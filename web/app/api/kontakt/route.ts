import { NextResponse } from "next/server";

import { inboundProblem, parseInbound, recentInbound, saveInbound, type InboundKind } from "@/lib/erhverv/leads";
import { ipHash } from "@/lib/support/session";
import { db } from "@/lib/udlejning/db";

// The forms on selfi.dk: "designudkast på 24 timer" (kind "design") and "book en snak" on /erhverv, and the
// short question form for private parties. Saved in MongoDB, put on admin's lead list and sent to Esben on
// SMS (lib/erhverv/leads.ts). CONTACT_WEBHOOK_URL is optional and gets a copy.

export const dynamic = "force-dynamic";

const PER_IP_HOUR = 6;

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Beskeden kunne ikke læses. Prøv igen." }, { status: 400 });
  }
  // A hidden field people never see; bots fill it in.
  if (typeof body.company_url === "string" && body.company_url) return NextResponse.json({ ok: true });

  const kind: InboundKind = body.type === "privat" ? "privat" : body.type === "design" ? "design" : "meeting";
  const r = parseInbound(body, kind, "form");
  const problem = inboundProblem(r);
  if (problem) return NextResponse.json({ error: problem }, { status: 400 });

  try {
    const d = await db();
    const ip = ipHash(req);
    if ((await recentInbound(d, ip)) >= PER_IP_HOUR) return NextResponse.json({ error: "Der er sendt mange beskeder herfra. Prøv igen om lidt, eller ring til os." }, { status: 429 });
    const saved = await saveInbound(d, r, { ipHash: ip });
    return NextResponse.json({ ok: true, id: saved._id });
  } catch (e) {
    console.error("kontakt", e);
    return NextResponse.json({ error: "Beskeden blev ikke sendt. Prøv igen om lidt, eller skriv i chatten nederst til højre." }, { status: 502 });
  }
}
