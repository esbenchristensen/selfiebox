import { NextResponse } from "next/server";

// Forwards contact requests to CONTACT_WEBHOOK_URL (e.g. a Slack, Zapier or Make webhook).
// Set it in Vercel's environment variables. Without it the form tells the visitor it is not set up yet.

type Payload = {
  type?: string;
  name?: string;
  email?: string;
  phone?: string;
  place?: string;
  topic?: string;
  message?: string;
};

const clean = (v: unknown, max = 2000) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(req: Request) {
  let body: Payload;
  try {
    body = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ error: "Beskeden kunne ikke læses. Prøv igen." }, { status: 400 });
  }

  const data = {
    type: "erhverv",
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

  const hook = process.env.CONTACT_WEBHOOK_URL;
  if (!hook) {
    return NextResponse.json(
      { error: "Formularen er ikke sat op endnu. Prøv igen senere." },
      { status: 503 },
    );
  }

  const res = await fetch(hook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ source: "selfi.dk", ...data, at: new Date().toISOString() }),
  });
  if (!res.ok) {
    return NextResponse.json({ error: "Beskeden blev ikke sendt. Prøv igen om lidt." }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
