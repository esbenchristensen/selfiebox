import { NextResponse } from "next/server";

import { saveContactRequest } from "@/lib/erhverv/leads";
import { ipHash } from "@/lib/support/session";
import { db } from "@/lib/udlejning/db";

// The contact form ("Book en snak" on /erhverv, questions on the rental page). Saved in MongoDB: from a place
// on admin's lead list, from a private party in contact_requests. Selfi gets an SMS and a mail
// (lib/erhverv/leads.ts). CONTACT_WEBHOOK_URL is optional and gets a copy.

export const dynamic = "force-dynamic";

const PER_IP_HOUR = 6;

type Payload = {
  type?: string;
  name?: string;
  email?: string;
  phone?: string;
  place?: string;
  topic?: string;
  message?: string;
  fax?: string;
};

const clean = (v: unknown, max = 2000) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(req: Request) {
  let body: Payload;
  try {
    body = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ error: "Beskeden kunne ikke læses. Prøv igen." }, { status: 400 });
  }

  // A hidden field people never see: a filled one is a bot. It gets a normal answer, and nothing is saved.
  if (body.fax) return NextResponse.json({ ok: true });

  const data = {
    type: (body.type === "privat" ? "privat" : "erhverv") as "privat" | "erhverv",
    topic: clean(body.topic, 80),
    name: clean(body.name, 200),
    email: clean(body.email, 200),
    phone: clean(body.phone, 40),
    place: clean(body.place, 200),
    message: clean(body.message),
  };

  if (!data.name || !/^\S+@\S+\.\S+$/.test(data.email)) {
    return NextResponse.json({ error: "Skriv jeres navn og en gyldig e-mail." }, { status: 400 });
  }

  try {
    const d = await db();
    const ip = ipHash(req);
    const since = new Date(Date.now() - 3600_000);
    const recent = (await d.collection("leads").countDocuments({ requests: { $elemMatch: { ip, at: { $gt: since } } } })) + (await d.collection("contact_requests").countDocuments({ ip, at: { $gt: since } }));
    if (recent >= PER_IP_HOUR) return NextResponse.json({ error: "Der er sendt mange beskeder herfra. Prøv igen om lidt, eller skriv i chatten." }, { status: 429 });
    await saveContactRequest(d, data, ip);
  } catch (e) {
    console.error("kontakt", e);
    return NextResponse.json({ error: "Beskeden blev ikke sendt. Prøv igen om lidt, eller skriv i chatten nederst til højre." }, { status: 502 });
  }

  const hook = process.env.CONTACT_WEBHOOK_URL;
  if (hook) {
    await fetch(hook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source: "selfi.dk", ...data, at: new Date().toISOString() }),
      signal: AbortSignal.timeout(5000),
    }).catch((e) => console.error("kontakt webhook", e));
  }
  return NextResponse.json({ ok: true });
}
