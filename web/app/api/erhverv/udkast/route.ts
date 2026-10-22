import { after, NextResponse } from "next/server";

import { notifyLead, parseLead, saveLead } from "@/lib/erhverv/leads";
import { ipHash } from "@/lib/support/session";
import { db } from "@/lib/udlejning/db";

// "Få jeres designudkast på 24 timer" on /erhverv. Saves the lead, answers at once, and then (after the
// response) sends the receipt and the notice to Selfi and writes the internal draft. See lib/erhverv/leads.ts.

export const dynamic = "force-dynamic";
export const maxDuration = 120;

const PER_IP_HOUR = 5;

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Formularen kunne ikke læses. Prøv igen." }, { status: 400 });
  }
  // A field people never see: a filled one is a bot. It gets a normal answer, and nothing is saved.
  if (typeof body.fax === "string" && body.fax) return NextResponse.json({ ok: true });

  const parsed = parseLead(body);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });

  let d;
  try {
    d = await db();
  } catch (e) {
    console.error("lead db", e);
    return NextResponse.json({ error: "Vi kunne ikke tage imod lige nu. Ring eller skriv til os, så går vi i gang alligevel." }, { status: 503 });
  }
  const ip = ipHash(req);
  const recent = await d.collection("leads").countDocuments({ requests: { $elemMatch: { ip, at: { $gt: new Date(Date.now() - 3600_000) } } } });
  if (recent >= PER_IP_HOUR) return NextResponse.json({ error: "Der er sendt mange forespørgsler herfra. Prøv igen om lidt." }, { status: 429 });

  const page = typeof body.page === "string" ? body.page : "/erhverv";
  const saved = await saveLead(d, parsed.lead, { source: "form", page, ip });
  after(() => notifyLead(parsed.lead, saved.id, saved.dueAt, { source: "form", repeat: saved.repeat }));
  return NextResponse.json({ ok: true, dueAt: saved.dueAt.toISOString() });
}
