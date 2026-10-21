import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { nights } from "@/lib/dates";
import { priceLines, problem, total, usage, type Choice, type Delivery, type PhotoType } from "@/lib/udlejning/core";
import { db, getHolds, getSettings, todayDK, type RentalDoc } from "@/lib/udlejning/db";
import { stripe, type CheckoutSession } from "@/lib/udlejning/stripe";

// Turns the customer's choice into a booking that holds the dates for 30 minutes and a Stripe Checkout
// page to pay it. Prices and availability are recomputed here; the browser's numbers are never trusted.
// The webhook (/api/stripe/webhook) marks the booking paid; an unpaid one is released when it expires.

const DAY = /^\d{4}-\d{2}-\d{2}$/;
const HOLD_MIN = 30; // Stripe's shortest Checkout lifetime
const str = (v: unknown, max = 500) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const site = () => (process.env.SITE_URL || "https://www.selfi.dk").replace(/\/$/, "");

function bookingNo(): string {
  const d = new Date();
  const ymd = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const abc = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const rand = Array.from(randomBytes(4), (b) => abc[b % abc.length]).join("");
  return `SB-${ymd}-${rand}`;
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Bookingen kunne ikke læses. Prøv igen." }, { status: 400 });
  }

  const range = (body.range ?? {}) as { from?: unknown; to?: unknown };
  const from = str(range.from, 10);
  const to = str(range.to, 10);
  const delivery = (body.delivery === "afhent" ? "afhent" : body.delivery === "post" ? "post" : null) as Delivery | null;
  const photoType = (body.photoType === "polaroid" ? "polaroid" : body.photoType === "strip" ? "strip" : null) as PhotoType | null;
  const contact = (body.contact ?? {}) as Record<string, unknown>;
  const address = (body.address ?? {}) as Record<string, unknown>;
  const email = str(contact.email, 200);

  if (!DAY.test(from) || !DAY.test(to) || !delivery || !photoType) {
    return NextResponse.json({ error: "Vælg datoer, levering og billedtype igen." }, { status: 400 });
  }
  if (!str(contact.name) || !/^\S+@\S+\.\S+$/.test(email) || str(contact.phone, 40).replace(/\D/g, "").length < 8) {
    return NextResponse.json({ error: "Skriv navn, telefon og en gyldig e-mail." }, { status: 400 });
  }
  const addr = { street: str(address.street, 200), zip: str(address.zip, 4), city: str(address.city, 100) };
  if (delivery === "post" && (!addr.street || !/^\d{4}$/.test(addr.zip) || !addr.city)) {
    return NextResponse.json({ error: "Skriv jeres adresse, så vi kan finde den nærmeste pakkeshop." }, { status: 400 });
  }
  if (body.accepted !== true) {
    return NextResponse.json({ error: "Sæt flueben ved lejebetingelserne." }, { status: 400 });
  }

  const choice: Choice = { range: { from, to }, theme: str(body.theme, 60) || null, printer: body.printer === true, photoType, delivery };

  let d;
  try {
    d = await db();
  } catch (e) {
    console.error("checkout db", e);
    return NextResponse.json({ error: "Bookingen er ikke åben lige nu. Prøv igen om lidt." }, { status: 503 });
  }
  const settings = await getSettings(d);
  if (!settings.open) return NextResponse.json({ error: "Vi tager ikke imod bookinger lige nu. Skriv til os." }, { status: 503 });

  const today = todayDK();
  const { holds, blocks } = await getHolds(d, today);
  const wrong = problem(settings, usage(settings, holds, blocks), choice, today);
  if (wrong) return NextResponse.json({ error: wrong, taken: true }, { status: 409 });

  const lines = priceLines(settings, choice);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + HOLD_MIN * 60_000);
  const doc: RentalDoc = {
    _id: bookingNo(),
    token: randomBytes(16).toString("hex"),
    status: "pending",
    from,
    to,
    days: nights(choice.range),
    theme: choice.theme,
    printer: choice.printer,
    photoType,
    delivery,
    address: delivery === "post" ? addr : null,
    contact: {
      name: str(contact.name, 200),
      email,
      phone: str(contact.phone, 40),
      occasion: str(contact.occasion, 40),
      message: str(contact.message, 2000),
    },
    lines,
    total: total(lines),
    currency: "dkk",
    stripe: {},
    expiresAt,
    history: [{ at: now, status: "pending", by: "kunde" }],
    createdAt: now,
    updatedAt: now,
  };
  const rentals = d.collection<RentalDoc>("rentals");
  await rentals.insertOne(doc);

  // Two customers can reach this line for the last box at the same moment. Count again with only the
  // bookings made before this one: if they now fill the dates, this one gives way and the first one wins.
  const again = await getHolds(d, today, { id: doc._id, at: now });
  if (problem(settings, usage(settings, again.holds, again.blocks), choice, today)) {
    await rentals.updateOne({ _id: doc._id }, { $set: { status: "expired", expiresAt: null, updatedAt: new Date() }, $push: { history: { at: new Date(), status: "expired", by: "system", note: "Datoerne blev taget samtidig" } } });
    return NextResponse.json({ error: "Nogen nåede at booke de dage lige før jer. Vælg andre datoer.", taken: true }, { status: 409 });
  }

  try {
    const back = `${site()}/lej/tak?id=${doc._id}&t=${doc.token}`;
    const session = await stripe<CheckoutSession>(
      "POST",
      "/checkout/sessions",
      {
        mode: "payment",
        locale: "da",
        currency: "dkk",
        customer_email: email,
        client_reference_id: doc._id,
        metadata: { booking: doc._id },
        payment_intent_data: { description: `Selfi udlejning ${doc._id}`, metadata: { booking: doc._id } },
        line_items: lines.map((l) => ({ quantity: 1, price_data: { currency: "dkk", unit_amount: l.amount * 100, product_data: { name: l.label } } })),
        success_url: `${back}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${site()}/lej?annulleret=${doc._id}&t=${doc.token}#book`,
        expires_at: Math.floor(expiresAt.getTime() / 1000) + 60,
      },
      `checkout-${doc._id}`,
    );
    await rentals.updateOne({ _id: doc._id }, { $set: { "stripe.sessionId": session.id, updatedAt: new Date() } });
    return NextResponse.json({ ok: true, ref: doc._id, url: session.url });
  } catch (e) {
    console.error("checkout stripe", e);
    await rentals.updateOne({ _id: doc._id }, { $set: { status: "expired", expiresAt: null, updatedAt: new Date() }, $push: { history: { at: new Date(), status: "expired", by: "system", note: "Stripe svarede ikke" } } });
    return NextResponse.json({ error: "Betalingen kunne ikke startes. Prøv igen om lidt." }, { status: 502 });
  }
}
