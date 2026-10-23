import "server-only";

import { randomUUID } from "node:crypto";
import type { Db } from "mongodb";

import { company } from "../company";
import { renderEmail, type Email } from "../mail/render";
import { FROM, REPLY_TO } from "../mail/send";
import { sendSms } from "../support/sms";

// The lead machine on selfi.dk/erhverv: a place asks for a design proposal within 24 hours, from the form
// or through Sif in the chat. The request lands in selfiebox.leads (the same collection as the market list,
// shown in admin.selfi.dk/admin/leads), the place gets a receipt by mail and Selfi gets a mail and an SMS.
// Nothing else happens here (Esben: the form only puts the lead in the lead system). Admin builds a prompt from
// the lead that Esben pastes into Claude to make their theme and catalogue (/erhverv/<slug>), and sends the
// link from admin ("Send til kunden"). The 24 hours count from `requestedAt`.
//
// Keep LeadInbound / LeadDraft in sync with selfiebox-platform web/src/lib/types.ts (LeadDoc).

export const INDUSTRIES = [
  "Bar eller bodega",
  "Natklub",
  "Restaurant eller café",
  "Hotel",
  "Sportsklub",
  "Festival eller event",
  "Biograf eller teater",
  "Forlystelsespark eller zoo",
  "Butik eller center",
  "Brand eller sponsor",
  "Andet",
] as const;

export const LOCATIONS = ["1 sted", "2–3 steder", "4–10 steder", "Mere end 10"] as const;

export type LeadInput = {
  company: string;
  website: string;
  name: string;
  email: string;
  phone: string;
  industry: string;
  locations: string;
  message: string;
};

export type LeadInbound = {
  at: Date;
  source: "form" | "chat";
  page: string;
  company: string;
  website: string;
  industry: string;
  locations: string;
  message: string;
  contact: { name: string; email: string; phone: string };
  chatId?: string;
  ip?: string; // pseudonymised (ipHash), only for the rate limit
};

export type LeadDraft = {
  status: "open" | "sent";
  requestedAt: Date;
  dueAt: Date; // requestedAt + 24 h: the promise on the page
  sentAt?: Date;
  sentBy?: string;
};

const clean = (v: unknown, max = 300) => (typeof v === "string" ? v.replace(/\s+/g, " ").trim().slice(0, max) : "");
const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/æ/g, "ae")
    .replace(/ø/g, "oe")
    .replace(/å/g, "aa")
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);

/** "www.Bodega.dk/om" → "bodega.dk"; "" when it is not a web address. */
export function hostOf(website: string): string {
  const raw = website.trim();
  if (!raw) return "";
  try {
    const u = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
    return u.hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return "";
  }
}

export function normalizePhone(p: string): string {
  const d = p.replace(/[^\d+]/g, "");
  if (/^\+\d{8,15}$/.test(d)) return d;
  if (/^00\d{8,15}$/.test(d)) return `+${d.slice(2)}`;
  if (/^\d{8}$/.test(d)) return `+45${d}`;
  return d;
}

/** Checks and trims what the form or the chat sent. Returns an error in Danish, or the clean input. */
export function parseLead(body: Record<string, unknown>): { ok: true; lead: LeadInput } | { ok: false; error: string } {
  const lead: LeadInput = {
    company: clean(body.company, 200),
    website: clean(body.website, 300),
    name: clean(body.name, 200),
    email: clean(body.email, 200).toLowerCase(),
    phone: clean(body.phone, 40),
    industry: clean(body.industry, 80),
    locations: clean(body.locations, 40),
    message: typeof body.message === "string" ? body.message.trim().slice(0, 2000) : "",
  };
  if (!lead.company) return { ok: false, error: "Skriv navnet på virksomheden." };
  if (!lead.name) return { ok: false, error: "Skriv navnet på kontaktpersonen." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) return { ok: false, error: "Skriv en gyldig e-mail." };
  if (normalizePhone(lead.phone).replace(/\D/g, "").length < 8) return { ok: false, error: "Skriv et telefonnummer, vi kan ringe på." };
  if (!hostOf(lead.website)) return { ok: false, error: "Skriv jeres hjemmeside, fx bodegahjoernet.dk. Har I ingen, så skriv jeres Facebook- eller Instagram-side." };
  return { ok: true, lead };
}

type LeadDoc = {
  _id: string;
  name: string;
  website?: string;
  status: string;
  inbound?: LeadInbound;
  requests?: LeadInbound[];
  draft?: LeadDraft;
  updated_at?: Date;
};

/**
 * Saves the request on the lead: an existing lead from the market list when the website matches, otherwise a
 * new one with id "web-<name>". Status is kept on an existing lead (a place we already talk to stays where it is).
 */
export async function saveLead(d: Db, input: LeadInput, meta: { source: "form" | "chat"; page: string; chatId?: string; ip?: string }, now = new Date()): Promise<{ id: string; dueAt: Date; repeat: boolean }> {
  const leads = d.collection<LeadDoc>("leads");
  const host = hostOf(input.website);
  const hostRe = new RegExp(`^(https?://)?(www\\.)?${host.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(/.*)?$`, "i");
  // A Facebook or Instagram page says nothing about which place it is, so only a real domain finds an old lead.
  const shared = /(^|\.)(facebook|instagram|tiktok|linkedin|linktr)\.(com|ee)$|^fb\.me$/.test(host);
  const existing = host && !shared ? await leads.findOne({ website: hostRe }, { projection: { _id: 1, draft: 1 } }) : null;
  const id = existing?._id ?? `web-${slug(input.company) || randomUUID().slice(0, 8)}`;
  const inbound: LeadInbound = {
    at: now,
    source: meta.source,
    page: meta.page.slice(0, 200),
    company: input.company,
    website: input.website,
    industry: input.industry,
    locations: input.locations,
    message: input.message,
    contact: { name: input.name, email: input.email, phone: normalizePhone(input.phone) },
    ...(meta.chatId ? { chatId: meta.chatId } : {}),
    ...(meta.ip ? { ip: meta.ip } : {}),
  };
  // A second request within 24 hours keeps the first promise; after that it is a new request with a new one.
  const open = existing?.draft && existing.draft.status !== "sent" && existing.draft.dueAt > now ? existing.draft : null;
  const draft: LeadDraft = open ?? { status: "open", requestedAt: now, dueAt: new Date(now.getTime() + 24 * 3600_000) };
  const units = /mere/i.test(input.locations) ? { low: 10, high: 20, realistic: 10 } : /4/.test(input.locations) ? { low: 4, high: 10, realistic: 5 } : /2/.test(input.locations) ? { low: 2, high: 3, realistic: 2 } : { low: 1, high: 1, realistic: 1 };
  await leads.updateOne(
    { _id: id },
    {
      $set: { inbound, draft: { ...draft, status: "open" }, updated_at: now },
      $push: { requests: inbound },
      $setOnInsert: {
        name: input.company,
        category: input.industry || "Fra hjemmesiden",
        city: "",
        region: "Hjemmesiden",
        website: input.website,
        status: "new",
        source: "web",
        // Asked for a proposal themselves, so they go to the top of the list.
        priority: 10,
        fit: 0,
        yes: 0,
        value: 0,
        visitors: 0,
        season: "",
        theme: "",
        why: "",
        units,
      },
    },
    { upsert: true },
  );
  return { id, dueAt: draft.dueAt, repeat: !!open };
}

// ---------- mails and SMS ----------

const site = () => (process.env.SITE_URL || "https://www.selfi.dk").replace(/\/$/, "");
const admin = () => (process.env.ADMIN_URL || "https://admin.selfi.dk").replace(/\/$/, "");
const due = (d: Date) =>
  new Intl.DateTimeFormat("da-DK", { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Copenhagen" }).format(d).replace(" kl.", " kl.");

async function resend(to: string, e: Email, tag: string): Promise<boolean> {
  const m = renderEmail(e, { company: { ...company }, site: site() });
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn(`lead mail (${tag}) ikke sendt: RESEND_API_KEY mangler`);
    return false;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: FROM(), to: [to], subject: m.subject, html: m.html, text: m.text, ...(REPLY_TO() ? { reply_to: REPLY_TO() } : {}), tags: [{ name: "kind", value: tag }] }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) console.error("lead mail", tag, res.status, (await res.text()).slice(0, 200));
    return res.ok;
  } catch (e) {
    console.error("lead mail", tag, e);
    return false;
  }
}

/** The receipt to the place. Says what happens and when, nothing else: no price, no drawings. */
export function receiptMail(input: LeadInput, dueAt: Date): Email {
  const first = input.name.split(" ")[0];
  return {
    subject: `Vi går i gang med jeres designudkast, ${first}`,
    preheader: `I har et udkast til ${input.company} senest ${due(dueAt)}.`,
    label: "DESIGNUDKAST",
    heading: `Tak, ${first}. Vi tegner nu en Selfi til ${input.company}.`,
    blocks: [
      { type: "text", text: `Vi kigger på ${hostOf(input.website)} og jeres sted, og senest **${due(dueAt)}** får I to ting på mail:` },
      {
        type: "steps",
        label: "DET FÅR I",
        items: [
          { title: "Et designforslag til boksen", text: "Boksen i jeres farver og form, med jeres navn på toppen og rammen på billederne." },
          { title: "Et forslag til, hvad boksen skal kunne hos jer", text: "De funktioner, der passer til jeres gæster og forretning: fx gæsteliste, titler, konkurrencer eller videohilsner." },
        ],
      },
      { type: "text", text: "Udkastet er gratis og uden forpligtelser. Har I et logo i god kvalitet eller en designmanual, så svar bare på denne mail med den. Vil I hellere snakke, ringer vi gerne." },
      { type: "button", label: "Se hvad boksen kan", href: `${site()}/funktioner`, secondary: true },
    ],
    reason: `Du får denne mail, fordi du bad om et designudkast til ${input.company} på selfi.dk.`,
  };
}

function internalMail(input: LeadInput, id: string, dueAt: Date, meta: { source: "form" | "chat"; repeat: boolean }): Email {
  return {
    subject: `Nyt lead: ${input.company} vil have et designudkast${meta.repeat ? " (igen)" : ""}`,
    preheader: `Udkastet skal sendes senest ${due(dueAt)}.`,
    label: "NYT LEAD",
    heading: `${input.company} vil have et designudkast`,
    blocks: [
      {
        type: "summary",
        label: "LEAD",
        rows: [
          ["Virksomhed", input.company],
          ["Hjemmeside", input.website],
          ["Branche", input.industry || "–"],
          ["Antal steder", input.locations || "–"],
          ["Kontakt", input.name],
          ["E-mail", input.email],
          ["Telefon", normalizePhone(input.phone)],
          ["Kom fra", meta.source === "chat" ? "Chatten (Sif)" : "Formularen på /erhverv"],
          ["Frist", due(dueAt)],
        ],
      },
      ...(input.message ? [{ type: "note" as const, label: "BESKED", text: input.message }] : []),
      { type: "text", text: "På leadet i admin ligger en prompt, du kan kopiere ind i Claude. Den laver temaet og kataloget til dem, og linket sender du til kunden fra admin." },
      { type: "button", label: "Åbn leadet i admin", href: `${admin()}/admin/leads?id=${encodeURIComponent(id)}` },
    ],
    reason: "Intern besked fra selfi.dk.",
  };
}

/** Receipt to the place, mail and SMS to Selfi. Never throws: the lead is saved whatever happens here. */
export async function notifyLead(input: LeadInput, id: string, dueAt: Date, meta: { source: "form" | "chat"; repeat: boolean }): Promise<void> {
  const to = process.env.LEADS_MAIL_TO || company.email || "";
  await Promise.all([
    meta.repeat ? Promise.resolve(true) : resend(input.email, receiptMail(input, dueAt), "lead_receipt"),
    to ? resend(to, internalMail(input, id, dueAt, meta), "lead_internal") : Promise.resolve(false),
    sendSms(process.env.LEADS_SMS_TO || process.env.SUPPORT_SMS_TO || "", `Selfi lead: ${input.company} (${hostOf(input.website)}) vil have designudkast senest ${due(dueAt)}. ${input.name}, ${normalizePhone(input.phone)}. ${admin()}/admin/leads?id=${encodeURIComponent(id)}`),
  ]).catch((e) => console.error("notifyLead", e));
}

export type ContactRequest = { type: "erhverv" | "privat"; topic: string; name: string; email: string; phone: string; place: string; message: string };

/**
 * The contact form (components/Contact.tsx). From a place it goes on the lead list (matched on the place's
 * name, id "web-<navn>") with the request in `requests`; from a private party it is kept in contact_requests.
 * Either way Selfi gets an SMS and a mail. Never throws on the notices; the request is saved first.
 */
export async function saveContactRequest(d: Db, r: ContactRequest, ip: string, now = new Date()): Promise<string> {
  const phone = r.phone ? normalizePhone(r.phone) : "";
  let id: string;
  if (r.type === "erhverv") {
    id = `web-${slug(r.place || r.name) || randomUUID().slice(0, 8)}`;
    const inbound: LeadInbound = { at: now, source: "form", page: `/erhverv#kontakt${r.topic ? ` (${r.topic})` : ""}`, company: r.place, website: "", industry: "", locations: "", message: r.message ? `Book en snak: ${r.message}` : "Book en snak", contact: { name: r.name, email: r.email, phone }, ip };
    await d.collection<LeadDoc>("leads").updateOne(
      { _id: id },
      {
        $set: { updated_at: now },
        $push: { requests: inbound },
        $setOnInsert: { name: r.place || r.name, category: "Fra hjemmesiden", city: "", region: "Hjemmesiden", website: "", status: "new", source: "web", priority: 9, fit: 0, yes: 0, value: 0, visitors: 0, season: "", theme: "", why: "", units: { low: 1, high: 1, realistic: 1 }, inbound },
      },
      { upsert: true },
    );
  } else {
    id = randomUUID();
    await d.collection("contact_requests").insertOne({ _id: id as never, ...r, phone, ip, at: now });
  }
  const what = r.type === "erhverv" ? `vil booke en snak (${r.place || "sted ikke oplyst"})` : `har et spørgsmål til en privat fest${r.place ? ` (${r.place})` : ""}`;
  const to = process.env.LEADS_MAIL_TO || company.email || "";
  await Promise.all([
    sendSms(process.env.LEADS_SMS_TO || process.env.SUPPORT_SMS_TO || "", `Selfi: ${r.name} ${what}. ${r.email}${phone ? `, ${phone}` : ""}${r.type === "erhverv" ? ` ${admin()}/admin/leads?id=${encodeURIComponent(id)}` : ""}`),
    to
      ? resend(to, {
          subject: `${r.name} ${what}`,
          preheader: r.message.slice(0, 120) || "Fra kontaktformularen på selfi.dk",
          label: r.type === "erhverv" ? "BOOK EN SNAK" : "SPØRGSMÅL",
          heading: `${r.name} ${what}`,
          blocks: [
            { type: "summary", label: "KONTAKT", rows: [["Navn", r.name], ["E-mail", r.email], ["Telefon", phone || "–"], [r.type === "erhverv" ? "Sted" : "Fest", r.place || "–"]] },
            ...(r.message ? [{ type: "note" as const, label: "BESKED", text: r.message }] : []),
            ...(r.type === "erhverv" ? [{ type: "button" as const, label: "Åbn leadet i admin", href: `${admin()}/admin/leads?id=${encodeURIComponent(id)}` }] : []),
          ],
          reason: "Intern besked fra selfi.dk.",
        }, "contact_internal")
      : Promise.resolve(false),
  ]).catch((e) => console.error("contact notice", e));
  return id;
}
