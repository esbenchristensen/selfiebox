import { NextResponse } from "next/server";
import { db, getHolds, getSettings, type RentalDoc, type RentalStatus } from "@/lib/udlejning/db";
import { fits, usage } from "@/lib/udlejning/core";
import { verifyWebhook, type CheckoutSession } from "@/lib/udlejning/stripe";

// selfi.dk/api/stripe/webhook: Stripe tells us here when a booking is paid, when Checkout expired unpaid
// and when a payment is refunded. Every call is checked against STRIPE_WEBHOOK_SECRET; anything without a
// valid signature gets a 400 and changes nothing. Stripe retries until it gets a 2xx, and every update is
// written so that a repeat does nothing.
//
// The endpoint in Stripe (Developers → Webhooks) listens for checkout.session.completed,
// checkout.session.async_payment_succeeded, checkout.session.async_payment_failed,
// checkout.session.expired and charge.refunded.

export const dynamic = "force-dynamic";

type Event = { id: string; type: string; data: { object: Record<string, unknown> } };
type Charge = { payment_intent: string | null; amount: number; amount_refunded: number; refunded: boolean };

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    console.error("webhook: STRIPE_WEBHOOK_SECRET mangler");
    return NextResponse.json({ error: "not configured" }, { status: 500 });
  }
  const raw = await req.text();
  const event = verifyWebhook<Event>(raw, req.headers.get("stripe-signature"), secret);
  if (!event) return NextResponse.json({ error: "bad signature" }, { status: 400 });

  const d = await db();
  const rentals = d.collection<RentalDoc>("rentals");
  const log = (status: RentalStatus, note: string) => ({ at: new Date(), status, by: "stripe", note: `${note} (${event.id})` });

  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded": {
      const s = event.data.object as unknown as CheckoutSession;
      const id = s.metadata?.booking ?? s.client_reference_id;
      if (!id) break;
      const stripeInfo = { "stripe.sessionId": s.id, "stripe.paymentIntent": s.payment_intent, "stripe.paymentStatus": s.payment_status, "stripe.amountPaid": (s.amount_total ?? 0) / 100 };
      if (s.payment_status !== "paid") {
        // Paid with a method that settles later: keep holding the dates until Stripe says yes or no.
        await rentals.updateOne({ _id: id, status: "pending" }, { $set: { ...stripeInfo, expiresAt: new Date(Date.now() + 7 * 864e5), updatedAt: new Date() } });
        break;
      }
      const booking = await rentals.findOne({ _id: id });
      if (!booking || (booking.status !== "pending" && booking.status !== "expired")) break; // already handled
      // A payment that lands after the hold ran out still counts, but if the dates were taken meanwhile admin must decide.
      let conflict = false;
      if (booking.status === "expired") {
        const settings = await getSettings(d);
        const { holds, blocks } = await getHolds(d, booking.from, { id, at: new Date() });
        conflict = !fits(settings, usage(settings, holds, blocks), { from: booking.from, to: booking.to }, booking.delivery, booking.printer);
      }
      await rentals.updateOne(
        { _id: id, status: booking.status },
        { $set: { ...stripeInfo, status: "paid", expiresAt: null, conflict, updatedAt: new Date() }, $push: { history: log("paid", conflict ? "Betalt, men datoerne var taget imens" : "Betalt") } },
      );
      await notify({ ...booking, status: "paid", conflict });
      break;
    }
    case "checkout.session.async_payment_failed":
    case "checkout.session.expired": {
      const s = event.data.object as unknown as CheckoutSession;
      const id = s.metadata?.booking ?? s.client_reference_id;
      if (!id) break;
      await rentals.updateOne(
        { _id: id, status: "pending" },
        { $set: { status: "expired", expiresAt: null, "stripe.paymentStatus": s.payment_status, updatedAt: new Date() }, $push: { history: log("expired", event.type === "checkout.session.expired" ? "Ikke betalt i tide" : "Betalingen fejlede") } },
      );
      break;
    }
    case "charge.refunded": {
      const c = event.data.object as unknown as Charge;
      if (!c.payment_intent) break;
      // Only a full refund releases the booking; a partial one (e.g. shipping back) is noted in admin.
      if (c.refunded) {
        await rentals.updateOne(
          { "stripe.paymentIntent": c.payment_intent, status: { $ne: "refunded" } },
          { $set: { status: "refunded", "stripe.refunded": c.amount_refunded / 100, updatedAt: new Date() }, $push: { history: log("refunded", "Refunderet") } },
        );
      } else {
        await rentals.updateOne({ "stripe.paymentIntent": c.payment_intent }, { $set: { "stripe.refunded": c.amount_refunded / 100, updatedAt: new Date() } });
      }
      break;
    }
  }
  return NextResponse.json({ received: true });
}

/** A heads-up to Selfi (Slack, Make …) when a booking is paid. Best effort: the booking is already saved. */
async function notify(b: RentalDoc) {
  const hook = process.env.BOOKING_WEBHOOK_URL ?? process.env.CONTACT_WEBHOOK_URL;
  if (!hook) return;
  try {
    await fetch(hook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "selfi.dk/lej",
        ref: b._id,
        status: b.status,
        conflict: !!b.conflict,
        from: b.from,
        to: b.to,
        theme: b.theme,
        printer: b.printer,
        photoType: b.photoType,
        delivery: b.delivery,
        total: b.total,
        contact: b.contact,
        admin: `https://admin.selfi.dk/admin/udlejning/${b._id}`,
      }),
      signal: AbortSignal.timeout(4000),
    });
  } catch (e) {
    console.error("notify", e);
  }
}
