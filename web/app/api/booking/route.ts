import { NextResponse } from "next/server";
import { addons, deliveries, priceForDays, pricing } from "@/content";
import { nights } from "@/lib/dates";

// Receives a private booking request and forwards it to BOOKING_WEBHOOK_URL
// (falls back to CONTACT_WEBHOOK_URL). Selfi confirms dates and price by mail.

const DAY = /^\d{4}-\d{2}-\d{2}$/;
const str = (v: unknown, max = 500) => (typeof v === "string" ? v.trim().slice(0, max) : "");

function reference() {
  const d = new Date();
  const ymd = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `SB-${ymd}-${rand}`;
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Bookingen kunne ikke læses. Prøv igen." }, { status: 400 });
  }

  const delivery = deliveries.find((d) => d.id === body.delivery);
  const range = body.range as { from?: unknown; to?: unknown } | null;
  const contact = (body.contact ?? {}) as Record<string, unknown>;
  const address = (body.address ?? null) as Record<string, unknown> | null;
  const chosen = Array.isArray(body.addons) ? addons.filter((a) => (body.addons as unknown[]).includes(a.id)) : [];

  const from = str(range?.from, 10);
  const to = str(range?.to, 10);
  const email = str(contact.email, 200);

  if (!delivery || !DAY.test(from) || !DAY.test(to) || from > to) {
    return NextResponse.json({ error: "Vælg datoer og levering igen." }, { status: 400 });
  }
  const days = nights({ from, to });
  if (days > pricing.maxDays) {
    return NextResponse.json({ error: `Vi kan booke op til ${pricing.maxDays} dage her. Skriv til os for længere lejeperioder.` }, { status: 400 });
  }
  if (!str(contact.name) || !/^\S+@\S+\.\S+$/.test(email) || str(contact.phone, 40).length < 8) {
    return NextResponse.json({ error: "Skriv navn, telefon og en gyldig e-mail." }, { status: 400 });
  }
  if (delivery.needsAddress && (!str(address?.street) || !/^\d{4}$/.test(str(address?.zip, 4)) || !str(address?.city))) {
    return NextResponse.json({ error: "Skriv adressen for festen." }, { status: 400 });
  }

  const hook = process.env.BOOKING_WEBHOOK_URL ?? process.env.CONTACT_WEBHOOK_URL;
  if (!hook) {
    return NextResponse.json({ error: "Bookingen er ikke sat op endnu. Prøv igen senere." }, { status: 503 });
  }

  const ref = reference();
  const payload = {
    source: "selfi.dk/booking",
    ref,
    days,
    price: priceForDays(days), // kr. inkl. moms, before add-ons and delivery
    from,
    to,
    addons: chosen.map((a) => a.name),
    themeText: str(body.themeText, 60),
    delivery: delivery.name,
    address: delivery.needsAddress ? { street: str(address?.street), zip: str(address?.zip, 4), city: str(address?.city, 100) } : null,
    contact: {
      name: str(contact.name, 200),
      email,
      phone: str(contact.phone, 40),
      occasion: str(contact.occasion, 40),
      message: str(contact.message, 2000),
    },
    at: new Date().toISOString(),
  };

  const res = await fetch(hook, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
  if (!res.ok) {
    return NextResponse.json({ error: "Bookingen blev ikke sendt. Prøv igen om lidt." }, { status: 502 });
  }
  return NextResponse.json({ ok: true, ref });
}
