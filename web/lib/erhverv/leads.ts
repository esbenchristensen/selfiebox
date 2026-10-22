import "server-only";

import { randomUUID } from "node:crypto";
import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
import type { Db } from "mongodb";
import OpenAI from "openai";

import { features } from "../../content";
import { company } from "../company";
import { renderEmail, type Email } from "../mail/render";
import { FROM, REPLY_TO } from "../mail/send";
import { sendSms } from "../support/sms";

// The lead machine on selfi.dk/erhverv: a place asks for a design proposal within 24 hours, from the form
// or through Sif in the chat. The request lands in selfiebox.leads (the same collection as the market list,
// shown in admin.selfi.dk/admin/leads), the place gets a receipt by mail and Selfi gets a mail and an SMS.
// Then, in the background, an internal draft is written from their website: a design idea for the box and
// the functions that fit their business. The draft is NEVER sent to the place from here. Esben reads it,
// adds the sketch, edits and sends it from admin ("Godkend og send"). The 24 hours count from `requestedAt`.
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

export type LeadProposal = {
  summary: string; // who they are, in two sentences
  design: { idea: string; colors: string[]; top: string; sides: string; screen: string };
  software: { slug: string; name: string; why: string }[];
  activities: string;
  questions: string[]; // what Esben should ask or check before sending
};

export type LeadDraft = {
  status: "generating" | "ready" | "failed" | "sent";
  requestedAt: Date;
  dueAt: Date; // requestedAt + 24 h: the promise on the page
  site?: { title: string; description: string; colors: string[]; image: string | null; fetched: boolean };
  proposal?: LeadProposal;
  error?: string;
  model?: string;
  generatedAt?: Date;
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
  const draft: LeadDraft = open ?? { status: "generating", requestedAt: now, dueAt: new Date(now.getTime() + 24 * 3600_000) };
  const units = /mere/i.test(input.locations) ? { low: 10, high: 20, realistic: 10 } : /4/.test(input.locations) ? { low: 4, high: 10, realistic: 5 } : /2/.test(input.locations) ? { low: 2, high: 3, realistic: 2 } : { low: 1, high: 1, realistic: 1 };
  await leads.updateOne(
    { _id: id },
    {
      $set: { inbound, draft: { ...draft, status: open ? open.status : "generating" }, updated_at: now },
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
      { type: "text", text: "Et internt udkast (designidé og funktioner ud fra deres hjemmeside) bliver skrevet nu og ligger på leadet om lidt. Det sendes ikke til kunden, før du har godkendt det. Husk skitsen af boksen i deres farver (theme_sketch.py)." },
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

// ---------- the internal draft ----------

/** True for addresses on the public internet; the website fetch never goes to localhost or a private network. */
async function publicHost(host: string): Promise<boolean> {
  if (!host || host === "localhost" || host.endsWith(".local") || host.endsWith(".internal")) return false;
  const addrs = isIP(host) ? [{ address: host }] : await lookup(host, { all: true }).catch(() => []);
  if (!addrs.length) return false;
  return addrs.every(({ address: a }) => {
    if (a.includes(":")) return !/^(::1?$|f[cd]|fe80|::ffff:(10|127|169\.254|172\.(1[6-9]|2\d|3[01])|192\.168)\.)/i.test(a);
    const [x, y] = a.split(".").map(Number);
    return !(x === 0 || x === 10 || x === 127 || (x === 169 && y === 254) || (x === 172 && y >= 16 && y <= 31) || (x === 192 && y === 168) || (x === 100 && y >= 64 && y <= 127) || x >= 224);
  });
}

/** Title, description, brand colours, share image and the visible text of their front page. */
async function readSite(website: string): Promise<{ title: string; description: string; colors: string[]; image: string | null; text: string; fetched: boolean }> {
  const empty = { title: "", description: "", colors: [], image: null, text: "", fetched: false };
  let url: URL;
  try {
    url = new URL(/^https?:\/\//i.test(website) ? website : `https://${website}`);
  } catch {
    return empty;
  }
  // Redirects are followed by hand, so every hop is checked.
  for (let hop = 0; hop < 4; hop++) {
    if (!/^https?:$/.test(url.protocol) || !(await publicHost(url.hostname))) return empty;
    let res: Response;
    try {
      res = await fetch(url, { redirect: "manual", headers: { "user-agent": "SelfiBot/1.0 (+https://www.selfi.dk)", accept: "text/html" }, signal: AbortSignal.timeout(8000) });
    } catch {
      return empty;
    }
    const loc = res.headers.get("location");
    if (res.status >= 300 && res.status < 400 && loc) {
      url = new URL(loc, url);
      continue;
    }
    if (!res.ok || !(res.headers.get("content-type") ?? "").includes("html")) return empty;
    const html = (await res.text()).slice(0, 600_000);
    const meta = (re: RegExp) => html.match(re)?.[1]?.trim() ?? "";
    const title = meta(/<title[^>]*>([^<]{1,200})/i);
    const description = meta(/<meta[^>]+(?:name|property)=["'](?:description|og:description)["'][^>]+content=["']([^"']{1,400})/i);
    const image = meta(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)/i) || null;
    const theme = meta(/<meta[^>]+name=["']theme-color["'][^>]+content=["'](#[0-9a-f]{3,8})/i);
    const counts = new Map<string, number>();
    for (const m of html.matchAll(/#([0-9a-f]{6})\b/gi)) {
      const c = `#${m[1].toLowerCase()}`;
      if (["#ffffff", "#000000"].includes(c)) continue;
      counts.set(c, (counts.get(c) ?? 0) + 1);
    }
    const colors = [...new Set([theme.toLowerCase(), ...[...counts].sort((a, b) => b[1] - a[1]).map(([c]) => c)].filter(Boolean))].slice(0, 6);
    const text = html
      .replace(/<(script|style|noscript|svg)[\s\S]*?<\/\1>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 5000);
    return { title, description, colors, image: image ? new URL(image, url).toString() : null, text, fetched: true };
  }
  return empty;
}

const PROPOSAL_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["summary", "design", "software", "activities", "questions"],
  properties: {
    summary: { type: "string", description: "Hvem de er og hvad de lever af, to sætninger" },
    design: {
      type: "object",
      additionalProperties: false,
      required: ["idea", "colors", "top", "sides", "screen"],
      properties: {
        idea: { type: "string", description: "Designidéen i én eller to sætninger" },
        colors: { type: "array", items: { type: "string" }, description: "2-4 farver som hex, kabinettet først" },
        top: { type: "string", description: "Toppen: få, store, robuste former, ingen tynde detaljer" },
        sides: { type: "string", description: "Siderne/vingerne, eller 'ingen' hvis boksen skal være ren" },
        screen: { type: "string", description: "Startskærm og ramme på billederne" },
      },
    },
    software: {
      type: "array",
      description: "3-5 funktioner fra listen, de vigtigste først",
      items: { type: "object", additionalProperties: false, required: ["slug", "why"], properties: { slug: { type: "string" }, why: { type: "string", description: "Hvorfor netop hos dem, konkret, én sætning" } } },
    },
    activities: { type: "string", description: "Et konkret forslag til en uge eller en aften med boksen hos dem" },
    questions: { type: "array", items: { type: "string" }, description: "Det, Esben bør tjekke eller spørge om, før udkastet sendes" },
  },
} as const;

function proposalPrompt(lead: LeadInbound, s: Awaited<ReturnType<typeof readSite>>): string {
  const list = features.map((f) => `- ${f.slug}: ${f.name}. ${f.short}${f.soon ? " (KOMMER SNART: kun foreslå som noget, der kommer)" : ""}`).join("\n");
  return [
    "Du er designer og konsulent hos Selfi, der laver fotobokse til steder i stedets eget design. Boksen hænger på væggen (22,5 × 30,6 cm, 7 cm dyb, skærm og kamera i en lysende ring). Toppen og siderne printes i 3D i stedets form og farver; kabinettet får brandets farver. Stedet hænger selv boksen op; Selfi monterer den ikke.",
    "Skriv et INTERNT udkast på dansk til Esben, som han retter og sender til kunden. Tænk ud fra kundens forretning: hvad tjener de penge på, hvem er gæsterne, hvornår er der travlt, og hvad ville gøre boksen værdifuld for netop dem. Brug kun deres nyeste, aktuelle branding. Ingen pris, ingen tekniske mål til kunden. Formerne på toppen skal være rolige og robuste, så intet knækker af i en bar.",
    "",
    `Virksomhed: ${lead.company}`,
    `Hjemmeside: ${lead.website}`,
    `Branche (deres valg): ${lead.industry || "ikke oplyst"}`,
    `Antal steder: ${lead.locations || "ikke oplyst"}`,
    `Besked fra dem: ${lead.message || "ingen"}`,
    "",
    s.fetched ? `Fra deres forside:\nTitel: ${s.title}\nBeskrivelse: ${s.description}\nFarver i koden (kan være støj): ${s.colors.join(", ") || "ingen fundet"}\nTekst: ${s.text}` : "Deres hjemmeside kunne ikke hentes. Skriv det, du kan ud fra navn og branche, og sæt et spørgsmål om farver og logo.",
    "",
    "Selfis funktioner (brug slugs herfra i software):",
    list,
  ].join("\n");
}

let client: OpenAI | null = null;
const openai = () => (client ??= new OpenAI({ apiKey: process.env.OPENAI_API_KEY, timeout: 90_000, maxRetries: 1 }));

/** Writes the internal draft on the lead. Runs after the response; never throws. */
export async function generateDraft(d: Db, id: string): Promise<void> {
  const leads = d.collection<LeadDoc>("leads");
  const lead = await leads.findOne({ _id: id });
  if (!lead?.inbound) return;
  const s = await readSite(lead.inbound.website).catch(() => ({ title: "", description: "", colors: [], image: null, text: "", fetched: false }));
  const siteInfo = { title: s.title, description: s.description, colors: s.colors, image: s.image, fetched: s.fetched };
  const model = process.env.LEADS_MODEL || process.env.SUPPORT_MODEL || "gpt-6.1-sol";
  if (!process.env.OPENAI_API_KEY) {
    await leads.updateOne({ _id: id }, { $set: { "draft.status": "failed", "draft.site": siteInfo, "draft.error": "OPENAI_API_KEY mangler: skriv udkastet selv." } });
    return;
  }
  try {
    const res = await openai().responses.create({
      model,
      input: proposalPrompt(lead.inbound, s),
      reasoning: { effort: "medium" },
      max_output_tokens: 2500,
      store: false,
      text: { format: { type: "json_schema", name: "proposal", strict: true, schema: PROPOSAL_SCHEMA as unknown as Record<string, unknown> } },
    });
    const raw = JSON.parse(res.output_text) as Omit<LeadProposal, "software"> & { software: { slug: string; why: string }[] };
    const proposal: LeadProposal = {
      ...raw,
      software: raw.software.flatMap((x) => {
        const f = features.find((f) => f.slug === x.slug);
        return f ? [{ slug: f.slug, name: f.name, why: x.why }] : [];
      }),
    };
    await leads.updateOne({ _id: id }, { $set: { "draft.status": "ready", "draft.site": siteInfo, "draft.proposal": proposal, "draft.model": model, "draft.generatedAt": new Date() }, $unset: { "draft.error": "" } });
  } catch (e) {
    console.error("lead draft", id, (e as Error).message);
    await leads.updateOne({ _id: id }, { $set: { "draft.status": "failed", "draft.site": siteInfo, "draft.error": `Udkastet kunne ikke skrives automatisk (${(e as Error).message.slice(0, 120)}). Skriv det selv.` } });
  }
}
