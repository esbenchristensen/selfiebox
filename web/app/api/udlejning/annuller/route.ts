import { NextResponse } from "next/server";
import { db, type RentalDoc } from "@/lib/udlejning/db";
import { stripe } from "@/lib/udlejning/stripe";

// The customer pressed "back" on the Stripe page: give the dates free at once instead of after 30 minutes.
// Needs the booking's secret token from the link, and only touches a booking that is still unpaid.

export async function POST(req: Request) {
  const { id, t } = (await req.json().catch(() => ({}))) as { id?: string; t?: string };
  if (typeof id !== "string" || typeof t !== "string") return NextResponse.json({ ok: false }, { status: 400 });
  const d = await db();
  const rentals = d.collection<RentalDoc>("rentals");
  const b = await rentals.findOne({ _id: id, token: t, status: "pending" });
  if (!b) return NextResponse.json({ ok: false });
  // Expire the Stripe page first, so it cannot be paid after the dates are released.
  if (b.stripe.sessionId) {
    try {
      await stripe("POST", `/checkout/sessions/${b.stripe.sessionId}/expire`);
    } catch {
      return NextResponse.json({ ok: false }); // already paid or already expired: the webhook decides
    }
  }
  await rentals.updateOne(
    { _id: id, status: "pending" },
    { $set: { status: "expired", expiresAt: null, updatedAt: new Date() }, $push: { history: { at: new Date(), status: "expired", by: "kunde", note: "Fortrudt på betalingssiden" } } },
  );
  return NextResponse.json({ ok: true });
}
