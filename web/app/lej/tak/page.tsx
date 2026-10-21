import type { Metadata } from "next";
import { connection } from "next/server";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { formatRange } from "@/lib/dates";
import { DELIVERIES, kr, PHOTO_TYPES } from "@/lib/udlejning/core";
import { db, type RentalDoc } from "@/lib/udlejning/db";
import { stripe, type CheckoutSession } from "@/lib/udlejning/stripe";
import "../lej.css";

// Where Stripe sends the customer after paying. The webhook normally marks the booking paid first; if the
// customer is faster than the webhook, the Checkout Session is asked directly so the page never says
// "not paid" for a booking that is.

export const metadata: Metadata = { title: "Tak for jeres booking | Selfi", robots: { index: false } };

async function load(id?: string, t?: string): Promise<{ b: RentalDoc; paid: boolean } | null> {
  await connection();
  if (!id || !t) return null;
  try {
    const b = await (await db()).collection<RentalDoc>("rentals").findOne({ _id: id, token: t });
    if (!b) return null;
    if (b.status !== "pending" && b.status !== "expired") return { b, paid: true };
    if (!b.stripe.sessionId) return { b, paid: false };
    const s = await stripe<CheckoutSession>("GET", `/checkout/sessions/${b.stripe.sessionId}`);
    return { b, paid: s.payment_status === "paid" };
  } catch {
    return null;
  }
}

// The customer's setup portal (theme, texts, timeline, live preview) lives on the platform: foto.selfi.dk/opsaet.
const SETUP_URL = process.env.SELFI_SETUP_URL ?? "https://foto.selfi.dk/opsaet";

export default async function Tak({ searchParams }: { searchParams: Promise<{ id?: string; t?: string }> }) {
  const { id, t } = await searchParams;
  const r = await load(id, t);
  return (
    <>
      <Nav links={[]} cta={{ label: "Tilbage til forsiden", href: "/" }} mega={false} />
      <main>
        <section className="section">
          <div className="wrap lej-done" role="status">
            {!r ? (
              <>
                <span className="label">Booking</span>
                <h1 className="h-l">Vi kunne ikke finde bookingen.</h1>
                <p className="lede">Har I betalt, får I en kvittering fra Stripe på mail. Skriv til os, hvis noget ser forkert ud.</p>
              </>
            ) : (
              <>
                <span className="label">Booking {r.b._id}</span>
                <h1 className="h-l">{r.paid ? `Tak, ${r.b.contact.name.split(" ")[0]}. Boksen er jeres.` : "Betalingen er ikke gået igennem endnu."}</h1>
                <p className="lede">
                  {r.paid
                    ? `Vi har reserveret ${formatRange({ from: r.b.from, to: r.b.to })} til jer. Kvitteringen kommer på ${r.b.contact.email}, og vi skriver, når boksen er sendt.`
                    : "Det kan tage et øjeblik. Genindlæs siden om lidt, eller skriv til os, hvis I er blevet trukket."}
                </p>
                {r.paid && t && (
                  <div className="bk-sum">
                    <span className="label">Næste skridt</span>
                    <p>Sæt boksen op til jeres fest nu: overskrift, stemning og tekster til aftenen. I kan se boksen live og tage et testbillede med jeres eget kamera, før den kommer.</p>
                    <a className="btn btn-primary" href={`${SETUP_URL}/${encodeURIComponent(r.b._id)}?t=${encodeURIComponent(t)}`}>Sæt boksen op</a>
                    <p className="fine">Gem linket. I kan rette opsætningen helt frem til festen.</p>
                  </div>
                )}
                <div className="bk-sum">
                  <span className="label">Jeres booking</span>
                  <div className="bk-sum-lines">
                    {r.b.lines.map((l) => (
                      <div key={l.id}>
                        <span>{l.label}</span>
                        <span>{kr(l.amount)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bk-sum-total">
                    <span>I alt inkl. moms</span>
                    <b>{kr(r.b.total)}</b>
                  </div>
                  <p className="fine">
                    {DELIVERIES[r.b.delivery].name} · {PHOTO_TYPES[r.b.photoType].name}
                    {r.b.theme ? ` · Tema: ${r.b.theme}` : ""}
                  </p>
                </div>
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
