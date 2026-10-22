// Inbound requests from places: "designudkast på 24 timer" (the form on /erhverv and the chat) and "book en
// snak" (the contact form). Every request is kept in `inbound_requests`, the place lands on the lead list in
// admin (MongoDB `leads`, the same list as the market list, admin.selfi.dk/admin/leads) and Esben gets an SMS.
// CONTACT_WEBHOOK_URL, when set, still gets a copy (Slack, Zapier or Make).

import { randomBytes } from "node:crypto";
import type { Db } from "mongodb";

import { sendSupportSms, type SmsSender } from "../support/sms";

export type InboundKind = "design" | "meeting" | "privat";

export type Inbound = {
  kind: InboundKind;
  source: "form" | "chat";
  company: string;
  website: string;
  placeType: string;
  city: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  page: string;
};

export type InboundDoc = Inbound & { _id: string; at: Date; ipHash: string; leadId: string | null; smsSent: boolean; chatId: string | null };

export { PLACE_TYPES } from "./places";

/** "Bodega Hjørnet" → "bodega-hjornet", the way the market list makes its ids. */
export const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/æ/g, "ae")
    .replace(/ø/g, "o")
    .replace(/å/g, "aa")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

/** "https://www.bodega.dk/om" → "bodega.dk". */
export const site = (url: string) => url.trim().replace(/^https?:\/\//i, "").replace(/^www\./i, "").replace(/\/.*$/, "").toLowerCase().slice(0, 120);

const clean = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().replace(/\s+/g, " ").slice(0, max) : "");

export function parseInbound(body: Record<string, unknown>, kind: InboundKind, source: Inbound["source"]): Inbound {
  return {
    kind,
    source,
    company: clean(body.company ?? body.place),
    website: clean(body.website, 300),
    placeType: clean(body.placeType, 80),
    city: clean(body.city, 80),
    name: clean(body.name),
    email: clean(body.email).toLowerCase(),
    phone: clean(body.phone, 40),
    message: typeof body.message === "string" ? body.message.trim().slice(0, 2000) : "",
    page: clean(body.page ?? body.topic, 200),
  };
}

export function inboundProblem(r: Inbound): string | null {
  if (r.name.length < 2) return "Skriv navnet på kontaktpersonen.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(r.email)) return "Skriv en gyldig e-mail.";
  if (r.kind === "privat") return null;
  if (r.company.length < 2) return "Skriv virksomhedens eller stedets navn.";
  if (r.kind === "design") {
    if (!/^(https?:\/\/)?[^\s/]+\.[a-z]{2,}(\/\S*)?$/i.test(r.website)) return "Skriv jeres hjemmeside, fx bodega.dk, så designet kan bygge på jeres udtryk.";
    if (r.phone.replace(/\D/g, "").length < 8) return "Skriv et telefonnummer, så vi kan ringe, når udkastet er klar.";
  }
  return null;
}

const LABEL: Record<InboundKind, string> = { design: "Designudkast", meeting: "Book en snak", privat: "Privat besked" };

/** Saves the request, puts the place on the lead list and tells Esben. Returns the request's id. */
export async function saveInbound(d: Db, r: Inbound, meta: { ipHash: string; chatId?: string | null; adminUrl?: string; sms?: SmsSender; now?: Date }): Promise<InboundDoc> {
  const now = meta.now ?? new Date();
  const id = `IN-${now.toISOString().slice(2, 10).replace(/-/g, "")}-${randomBytes(2).toString("hex").toUpperCase()}`;
  let leadId: string | null = null;
  if (r.kind !== "privat" && r.company) {
    leadId = slug(r.company) || null;
    if (leadId) {
      const request = { id, kind: r.kind, at: now, name: r.name, email: r.email, phone: r.phone, message: r.message, source: r.source };
      await d.collection<{ _id: string }>("leads").updateOne(
        { _id: leadId },
        {
          // The fields admin's lead list needs (selfiebox-platform LeadDoc). Priority 10 puts inbound requests on top.
          $setOnInsert: { name: r.company, category: r.placeType || "Henvendelse", city: r.city || "–", region: "Henvendelse", units: { low: 1, realistic: 1, high: 1 }, fit: 10, yes: 10, priority: 10, value: 0, status: "new", source: "selfi.dk" },
          $set: {
            inbound: { ...request, website: r.website, placeType: r.placeType },
            contact: `${r.name}, ${r.phone || "-"}, ${r.email}`,
            ...(r.website ? { website: site(r.website) } : {}),
            updated_at: now,
          },
          $push: { requests: request },
        } as never,
        { upsert: true },
      );
    }
  }
  const adminUrl = (meta.adminUrl ?? process.env.ADMIN_URL ?? "https://admin.selfi.dk").replace(/\/$/, "");
  const who = r.kind === "privat" ? r.name : `${r.company}${r.website ? ` (${site(r.website)})` : ""}, ${r.name}`;
  const text = `Selfi ${LABEL[r.kind]}${r.source === "chat" ? " via chat" : ""}: ${who}, ${r.phone || "ingen tlf."}, ${r.email}${r.kind === "design" ? ". Udkast lovet inden 24 timer." : ""} ${adminUrl}/admin/leads${leadId ? `?id=${leadId}` : ""}`;
  const smsSent = await (meta.sms ?? sendSupportSms)(text);
  const doc: InboundDoc = { _id: id, ...r, at: now, ipHash: meta.ipHash, leadId, smsSent, chatId: meta.chatId ?? null };
  await d.collection<InboundDoc>("inbound_requests").insertOne(doc);

  const hook = process.env.CONTACT_WEBHOOK_URL;
  if (hook) {
    await fetch(hook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...r, origin: "selfi.dk", id, at: now.toISOString() }),
      signal: AbortSignal.timeout(8000),
    }).catch((e) => console.error("inbound webhook", e));
  }
  return doc;
}

/** Requests from this IP (pseudonymised) in the last hour, for the rate limit. */
export const recentInbound = (d: Db, ipHash: string, now = new Date()) => d.collection<InboundDoc>("inbound_requests").countDocuments({ ipHash, at: { $gt: new Date(now.getTime() - 3600_000) } });
