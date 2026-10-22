// The assistant's tools. Every tool runs here, in the backend, and only ever reads or changes the bookings
// of the customer who verified in this chat (chat.customer.bookings): the model cannot widen that, whatever
// it is told. Verification (lib/support/verify.ts) is an order number that matches the e-mail or phone the
// person gave before the chat, or an SMS code to that phone. Changes to a booking go through a proposal (propose_date_change) that the customer must answer
// before commit_date_change is allowed, and every change is written to the rental's history and to
// support_audit with time and actor.

import { randomBytes } from "node:crypto";
import type { Db } from "mongodb";

import { addDays, formatRange, nights, weekday, type DayKey, type Range } from "../dates";
import { boxQuote, fits, heldRange, kr, problem, usage, type Block, type Hold, type RentalSettings } from "../udlejning/core";
import { RELEASED, type RentalDoc, type RentalStatus } from "../udlejning/db";
import { inboundProblem, saveInbound } from "../erhverv/leads";
import { PLACE_TYPES } from "../erhverv/places";
import { addMessage, audit, supportCollections, type SupportChatDoc } from "./db";
import { hoursText, isOpen, replyPromise } from "./hours";
import { sendSms, type SmsSender, type SmsTo } from "./sms";
import {
  bookingsFor,
  codeMatches,
  logSend,
  maskPhone,
  MAX_CODE_TRIES,
  MAX_SENDS_PER_CHAT,
  MAX_SENDS_PER_PHONE_HOUR,
  newCode,
  recentSends,
  sameEmail,
  samePhone,
  CODE_MINUTES,
} from "./verify";

export type ToolContext = {
  d: Db;
  chat: SupportChatDoc;
  settings: RentalSettings;
  today: DayKey;
  now: Date;
  sms: SmsSender;
  smsTo?: SmsTo; // SMS to the customer (the code); tests pass a fake
  adminUrl: string;
  setupUrl: string;
};

const MAX_VERIFY = 5;
const PROPOSAL_MINUTES = 60;
const CANCEL_DAYS = 14; // same as /lejebetingelser

export const STATUS_LABEL: Record<RentalStatus, string> = {
  pending: "Venter på betaling",
  paid: "Betalt og reserveret",
  packed: "Pakket, klar til afsendelse",
  shipped: "Sendt med dao",
  delivered: "Hos jer",
  returned: "Modtaget retur hos Selfi",
  done: "Tjekket og afsluttet",
  cancelled: "Afbestilt",
  expired: "Ikke betalt",
  refunded: "Refunderet",
};

/** The labels the widget shows while a tool runs. */
export const TOOL_LABELS: Record<string, string> = {
  verify_order: "Tjekker ordrenummeret…",
  send_sms_code: "Sender en kode på SMS…",
  verify_sms_code: "Tjekker koden…",
  request_design: "Bestiller jeres designudkast…",
  get_bookings: "Slår jeres bookinger op…",
  check_availability: "Tjekker ledige datoer…",
  propose_date_change: "Regner på de nye datoer…",
  commit_date_change: "Flytter bookingen…",
  escalate: "Sender videre til en kollega…",
  web_search: "Søger på nettet…",
};

const obj = (properties: Record<string, unknown>, required: string[]) => ({ type: "object", properties, required, additionalProperties: false });

export const TOOL_DEFINITIONS = [
  {
    type: "function" as const,
    name: "verify_order",
    description: "Åbner kundens ordrer med et ordrenummer (fx SB-271021-K4QX), som kunden selv har skrevet. Ordren skal være lavet med den e-mail eller det telefonnummer, kunden oplyste før chatten; det tjekker systemet. Kald den KUN, når kunden spørger om en ordre/booking eller noget personligt. Svarer med kundens bookinger med fulde detaljer, så get_bookings ikke behøves bagefter.",
    strict: true,
    parameters: obj({ bookingNo: { type: "string", description: "Ordrenummeret, som kunden skrev det" } }, ["bookingNo"]),
  },
  {
    type: "function" as const,
    name: "send_sms_code",
    description: "Sender en 6-cifret engangskode på SMS til det telefonnummer, kunden oplyste før chatten. Brug den, når kunden spørger om en ordre eller noget personligt og ikke har (eller ikke kan finde) ordrenummeret, eller ordrenummeret ikke passede. Spørg kunden først, om du må sende koden. Koden gælder i 10 minutter.",
    strict: true,
    parameters: obj({}, []),
  },
  {
    type: "function" as const,
    name: "verify_sms_code",
    description: "Tjekker den kode, kunden har skrevet fra SMS'en. Passer den, åbnes de bookinger, der er lavet med det telefonnummer.",
    strict: true,
    parameters: obj({ code: { type: "string", description: "Koden, som kunden skrev den" } }, ["code"]),
  },
  {
    type: "function" as const,
    name: "request_design",
    description: "Bestiller et gratis designudkast til et sted (erhverv): et design af boksen i stedets udtryk plus et forslag til software (aktiviteter, deling, gæsteliste), sendt inden for 24 timer. Kontaktpersonen er den, der skriver (navn, e-mail og telefon er allerede oplyst). Kræver virksomhedens navn og hjemmeside; spørg efter dem, hvis de mangler. Gentag ikke bestillingen, hvis den allerede er sendt.",
    strict: true,
    parameters: obj(
      {
        company: { type: "string", description: "Virksomhedens eller stedets navn" },
        website: { type: "string", description: "Hjemmeside, fx bodega.dk" },
        placeType: { type: "string", enum: PLACE_TYPES, description: "Slags sted" },
        city: { type: ["string", "null"], description: "By, hvis kunden har nævnt den, ellers null" },
        notes: { type: "string", description: "Det, kunden har fortalt om stedet, gæsterne, placering og ønsker (kort, på dansk). Tom streng hvis intet." },
      },
      ["company", "website", "placeType", "city", "notes"],
    ),
  },
  {
    type: "function" as const,
    name: "get_bookings",
    description: "Henter den verificerede kundes bookinger igen (status, datoer, tilvalg, pris, sporingsnumre, frister, opsætningslink). Kun nødvendig senere i samtalen, fx efter en ændring eller når der er gået tid; verify_order/verify_sms_code har allerede givet detaljerne.",
    strict: true,
    parameters: obj({}, []),
  },
  {
    type: "function" as const,
    name: "check_availability",
    description: "Tjekker om boksen (og evt. printeren) er ledig i en periode, og hvad den koster. Kræver ikke verificering. Angiv forBooking, når det er for at flytte en eksisterende booking, så dens egne datoer ikke tæller som optaget.",
    strict: true,
    parameters: obj(
      {
        from: { type: "string", description: "Første lejedag, ÅÅÅÅ-MM-DD" },
        to: { type: "string", description: "Sidste lejedag, ÅÅÅÅ-MM-DD (samme som from ved én dag)" },
        printer: { type: "boolean", description: "Skal printeren også være ledig" },
        forBooking: { type: ["string", "null"], description: "Bookingnummer, hvis det er et flyt af den booking, ellers null" },
      },
      ["from", "to", "printer", "forBooking"],
    ),
  },
  {
    type: "function" as const,
    name: "propose_date_change",
    description: "Laver et forslag om at flytte en af kundens bookinger til nye datoer (samme antal dage). Gemmer intet endnu: gentag forslaget for kunden og spørg, om bookingen skal flyttes. Kun for en verificeret kunde og kun før boksen er sendt.",
    strict: true,
    parameters: obj({ bookingNo: { type: "string" }, from: { type: "string", description: "Ny første lejedag, ÅÅÅÅ-MM-DD" }, to: { type: "string", description: "Ny sidste lejedag, ÅÅÅÅ-MM-DD" } }, ["bookingNo", "from", "to"]),
  },
  {
    type: "function" as const,
    name: "commit_date_change",
    description: "Udfører et datoforslag, EFTER kunden har svaret et klart ja i en ny besked. Systemet afviser, hvis kunden ikke har skrevet siden forslaget. Ændringen logges.",
    strict: true,
    parameters: obj({ changeId: { type: "string", description: "changeId fra propose_date_change" } }, ["changeId"]),
  },
  {
    type: "function" as const,
    name: "escalate",
    description: "Sender sagen til et menneske (en kollega hos Selfi) med SMS og markerer chatten. Brug ved ønske om et menneske, utilfredshed, klager, penge (refusion, erstatning, kompensation, skade, tyveri), jura, ændringer du ikke selv må lave, låst verificering, akutte problemer med boksen under en fest, tilbud til steder, og når du ikke kan svare sikkert. Svarer med, hvornår kunden kan forvente svar.",
    strict: true,
    parameters: obj(
      {
        reason: { type: "string", enum: ["wants_human", "unhappy", "complaint", "money", "damage_or_theft", "legal", "change_not_allowed", "verification_locked", "box_not_working", "business_offer", "unknown_answer", "other"] },
        summary: { type: "string", description: "Kort resumé på dansk til SMS'en: hvem, hvilken booking, hvad kunden vil have. Højst 200 tegn." },
        urgent: { type: "boolean", description: "true kun når boksen ikke virker under en fest, der er i gang nu eller i dag" },
        phone: { type: ["string", "null"], description: "Et andet telefonnummer, hvis kunden har bedt om at blive ringet op på et andet end det oplyste, ellers null" },
      },
      ["reason", "summary", "urgent", "phone"],
    ),
  },
];

export const WEB_SEARCH_TOOL = {
  type: "web_search" as const,
  search_context_size: "low" as const,
  user_location: { type: "approximate" as const, country: "DK", timezone: "Europe/Copenhagen" },
};

type Result = Record<string, unknown>;

const mine = (chat: SupportChatDoc): string[] => chat.customer?.bookings ?? [];
const DAY = /^\d{4}-\d{2}-\d{2}$/;

/** The first weekday on or after the day after `to`: when the box must be handed in. */
function returnBy(to: DayKey): DayKey {
  let k = addDays(to, 1);
  while (weekday(k) >= 5) k = addDays(k, 1);
  return k;
}

type RentalWithTracking = RentalDoc & { trackingOut?: string; trackingBack?: string };

/** What the assistant gets to see about one of the customer's own bookings. No Stripe ids, no admin notes. */
function bookingView(r: RentalWithTracking, ctx: ToolContext): Result {
  const held = heldRange(ctx.settings, { from: r.from, to: r.to }, r.delivery);
  const paid = r.history.find((h) => h.status === "paid");
  return {
    bookingNo: r._id,
    status: r.status,
    statusLabel: STATUS_LABEL[r.status],
    period: formatRange({ from: r.from, to: r.to }),
    from: r.from,
    to: r.to,
    days: r.days,
    theme: r.theme,
    printer: r.printer ? { photoType: r.photoType, printsIncluded: ctx.settings.printsIncluded } : null,
    total: kr(r.total),
    lines: r.lines.map((l) => `${l.label}: ${kr(l.amount)}`),
    address: r.address ? `${r.address.street}, ${r.address.zip} ${r.address.city}` : null,
    contact: { name: r.contact.name, email: r.contact.email, phone: r.contact.phone },
    occasion: r.contact.occasion || null,
    paidAt: paid ? paid.at.toISOString().slice(0, 10) : null,
    shipping: { carrier: "dao", shipsOn: held.from, trackingOut: r.trackingOut ?? null, trackingBack: r.trackingBack ?? null, returnBy: returnBy(r.to) },
    canMoveDates: r.status === "paid" || r.status === "packed",
    cancelFreeUntil: addDays(r.from, -CANCEL_DAYS),
    setupUrl: ["pending", "expired"].includes(r.status) ? null : `${ctx.setupUrl}/${encodeURIComponent(r._id)}?t=${encodeURIComponent(r.token)}`,
    history: r.history.map((h) => `${h.at.toISOString().slice(0, 16).replace("T", " ")}: ${STATUS_LABEL[h.status]}`),
  };
}

/** Bookings and blocks that touch the days from `from` on, leaving out one booking (the one being moved). */
async function holdsExcluding(d: Db, from: DayKey, exclude: string | null): Promise<{ holds: Hold[]; blocks: Block[] }> {
  const now = new Date();
  const since = addDays(from, -31);
  const rentals = await d
    .collection<RentalDoc>("rentals")
    .find(
      { status: { $nin: RELEASED }, to: { $gte: since }, $or: [{ status: { $ne: "pending" } }, { expiresAt: { $gt: now } }], ...(exclude ? { _id: { $ne: exclude } } : {}) },
      { projection: { from: 1, to: 1, delivery: 1, printer: 1 } },
    )
    .toArray();
  const blocks = await d.collection<Block & { _id: unknown }>("rental_blocks").find({ to: { $gte: since } }, { projection: { from: 1, to: 1, boxes: 1, printers: 1 } }).toArray();
  return {
    holds: rentals.map((r) => ({ range: { from: r.from, to: r.to }, delivery: r.delivery, printer: r.printer })),
    blocks: blocks.map((b) => ({ from: b.from, to: b.to, boxes: b.boxes ?? 0, printers: b.printers ?? 0 })),
  };
}

/** The nearest free periods of the same length within three weeks, so the model can offer something concrete. */
function alternatives(ctx: ToolContext, u: ReturnType<typeof usage>, range: Range, theme: string | null, printer: boolean): string[] {
  const out: string[] = [];
  for (let off = 1; off <= 21 && out.length < 4; off++) {
    for (const sign of [1, -1]) {
      const f = addDays(range.from, off * sign);
      const t = addDays(range.to, off * sign);
      if (f < ctx.today || out.length >= 4) continue;
      if (!problem(ctx.settings, u, { range: { from: f, to: t }, theme, printer, photoType: "strip", delivery: "post" }, ctx.today)) out.push(formatRange({ from: f, to: t }));
    }
  }
  return out;
}

async function myRental(ctx: ToolContext, bookingNo: string): Promise<RentalWithTracking | null> {
  const id = String(bookingNo).trim().toUpperCase();
  if (!mine(ctx.chat).includes(id)) return null; // the only line that decides what the model may see
  return ctx.d.collection<RentalWithTracking>("rentals").findOne({ _id: id });
}

async function setChat(ctx: ToolContext, set: Partial<SupportChatDoc>): Promise<void> {
  const { chats } = await supportCollections(ctx.d);
  await chats.updateOne({ _id: ctx.chat._id }, { $set: { ...set, updatedAt: ctx.now } });
  Object.assign(ctx.chat, set);
}

// ---------- the tools ----------

const contactOf = (chat: SupportChatDoc) => chat.contact ?? null;

/** Opens the bookings for the verified identifiers and writes the verification on the chat and the audit log. */
async function openBookings(ctx: ToolContext, keys: { email: string | null; phone: string | null }, via: "order" | "sms", note: string, bookingId: string | null): Promise<Result> {
  const all = await bookingsFor<RentalWithTracking>(ctx.d, keys);
  const contact = contactOf(ctx.chat);
  const name = all.find((b) => b._id === bookingId)?.contact.name ?? all[0]?.contact.name ?? contact?.name ?? "";
  const customer = { email: keys.email ?? contact?.email ?? "", name, bookings: all.map((b) => b._id), verifiedAt: ctx.now, via, keys };
  await setChat(ctx, { customer, smsCode: null });
  await audit(ctx.d, { chatId: ctx.chat._id, actor: "customer", actorName: name || "kunde", action: "verify", bookingId, note: `${note}. Bookinger: ${customer.bookings.join(", ") || "ingen"}` });
  if (!all.length) return { ok: true, verified: true, bookings: [], message: "Kunden er verificeret, men der er ingen betalte bookinger på det telefonnummer. Sig det, og spørg om ordren kan være lavet med et andet nummer eller en anden e-mail (så kan kunden skrive ordrenummeret)." };
  return { ok: true, verified: true, name, today: ctx.today, bookings: all.map((b) => bookingView(b, ctx)), message: "Kunden er verificeret. Svar ud fra bookingerne her; get_bookings er ikke nødvendig." };
}

async function failAttempt(ctx: ToolContext, bookingId: string | null, what: string): Promise<{ locked: boolean; left: number }> {
  const attempts = ctx.chat.verifyAttempts + 1;
  const locked = attempts >= MAX_VERIFY;
  await setChat(ctx, { verifyAttempts: attempts, verifyLockedAt: locked ? ctx.now : null });
  await audit(ctx.d, { chatId: ctx.chat._id, actor: "customer", actorName: contactOf(ctx.chat)?.name ?? "kunde", action: locked ? "verify_locked" : "verify_failed", bookingId, note: `${what}. Forsøg ${attempts} af ${MAX_VERIFY}` });
  return { locked, left: MAX_VERIFY - attempts };
}

const LOCKED: Result = { ok: false, locked: true, message: "Verificeringen er låst i denne chat efter for mange forkerte forsøg. Eskalér, så en kollega kan hjælpe kunden." };

async function verifyOrder(ctx: ToolContext, a: { bookingNo: string }): Promise<Result> {
  const chat = ctx.chat;
  const contact = contactOf(chat);
  if (!contact) return { ok: false, message: "Kunden har ikke oplyst kontaktoplysninger. Bed kunden starte en ny samtale." };
  if (chat.verifyLockedAt) return LOCKED;
  const id = String(a.bookingNo ?? "").trim().toUpperCase().replace(/\s+/g, "");
  const r = await ctx.d.collection<RentalDoc>("rentals").findOne({ _id: id }, { projection: { contact: 1, status: 1 } });
  const paid = !!r && r.status !== "pending" && r.status !== "expired";
  const emailOk = paid && sameEmail(r!.contact.email, contact.email);
  const phoneOk = paid && samePhone(r!.contact.phone, contact.phone);
  if (!emailOk && !phoneOk) {
    const f = await failAttempt(ctx, id || null, "Ordrenummer passede ikke med oplyst e-mail/telefon");
    if (f.locked) return LOCKED;
    return {
      ok: false,
      attemptsLeft: f.left,
      message: "Ordrenummeret passer ikke med den e-mail og det telefonnummer, kunden oplyste. Sig ikke, om ordren findes, eller hvad der er forkert. Bed kunden tjekke nummeret i kvitteringen, og tilbyd en kode på SMS til det oplyste nummer (send_sms_code) i stedet.",
    };
  }
  return openBookings(ctx, { email: emailOk ? contact.email : null, phone: phoneOk ? contact.phone : null }, "order", `Verificeret med ordrenummer, der passer med oplyst ${[emailOk && "e-mail", phoneOk && "telefon"].filter(Boolean).join(" og ")}`, id);
}

async function sendSmsCode(ctx: ToolContext): Promise<Result> {
  const chat = ctx.chat;
  const contact = contactOf(chat);
  if (!contact) return { ok: false, message: "Kunden har ikke oplyst et telefonnummer. Bed kunden starte en ny samtale." };
  if (chat.verifyLockedAt) return LOCKED;
  if (chat.customer?.keys?.phone) return { ok: false, message: "Kunden er allerede verificeret med telefonen." };
  const sends = chat.smsSends ?? 0;
  if (sends >= MAX_SENDS_PER_CHAT) return { ok: false, reason: "too_many", message: "Der er sendt det højeste antal koder i denne chat. Eskalér, så en kollega kan hjælpe." };
  if (chat.smsCode && ctx.now.getTime() - chat.smsCode.sentAt.getTime() < 60_000) return { ok: false, reason: "wait", message: "Der blev sendt en kode for under et minut siden. Bed kunden vente lidt og tjekke sine SMS'er." };
  if ((await recentSends(ctx.d, contact.phone, ctx.now)) >= MAX_SENDS_PER_PHONE_HOUR) return { ok: false, reason: "too_many", message: "Der er sendt for mange koder til det nummer den sidste time. Bed kunden prøve igen senere, eller eskalér." };
  const { code, stored } = newCode(chat._id, ctx.now);
  const sent = await (ctx.smsTo ?? sendSms)(contact.phone, `Din kode til Selfi-chatten er ${code}. Den gælder i ${CODE_MINUTES} minutter. Giv den kun til chatten på selfi.dk.`);
  await audit(ctx.d, { chatId: chat._id, actor: "ai", actorName: "Sif", action: sent ? "sms_code_sent" : "sms_code_failed", bookingId: null, note: `Kode til ${maskPhone(contact.phone)}` });
  if (!sent) return { ok: false, reason: "sms_failed", message: "SMS'en kunne ikke sendes lige nu. Bed kunden skrive ordrenummeret i stedet, eller eskalér." };
  await logSend(ctx.d, contact.phone, chat._id, ctx.now);
  await setChat(ctx, { smsCode: stored, smsSends: sends + 1 });
  return { ok: true, sentTo: maskPhone(contact.phone), validMinutes: CODE_MINUTES, message: `Koden er sendt til nummeret, der ender på ${contact.phone.slice(-4)}. Bed kunden skrive den 6-cifrede kode her i chatten.` };
}

async function verifySmsCode(ctx: ToolContext, a: { code: string }): Promise<Result> {
  const chat = ctx.chat;
  const contact = contactOf(chat);
  const c = chat.smsCode;
  if (!contact || !c) return { ok: false, message: "Der er ikke sendt nogen kode i denne chat. Tilbyd at sende en med send_sms_code." };
  if (chat.verifyLockedAt) return LOCKED;
  if (ctx.now > c.expiresAt) {
    await setChat(ctx, { smsCode: null });
    return { ok: false, reason: "expired", message: "Koden er udløbet. Tilbyd at sende en ny." };
  }
  if (!codeMatches(chat._id, c, a.code)) {
    const tries = c.tries + 1;
    await setChat(ctx, { smsCode: tries >= MAX_CODE_TRIES ? null : { ...c, tries } });
    const f = await failAttempt(ctx, null, "Forkert SMS-kode");
    if (f.locked) return LOCKED;
    return tries >= MAX_CODE_TRIES
      ? { ok: false, reason: "expired", message: "Koden er brugt for mange gange forkert og gælder ikke længere. Tilbyd en ny kode." }
      : { ok: false, attemptsLeft: Math.min(MAX_CODE_TRIES - tries, f.left), message: "Koden passer ikke. Bed kunden tjekke SMS'en og skrive koden igen." };
  }
  return openBookings(ctx, { email: null, phone: contact.phone }, "sms", `Verificeret med SMS-kode til ${maskPhone(contact.phone)}`, null);
}

async function requestDesign(ctx: ToolContext, a: { company: string; website: string; placeType: string; city: string | null; notes: string }): Promise<Result> {
  const chat = ctx.chat;
  const contact = contactOf(chat);
  if (!contact) return { ok: false, message: "Kunden har ikke oplyst kontaktoplysninger." };
  if (chat.designRequest) return { ok: true, already: true, message: `Designudkastet til ${chat.designRequest.company} er allerede bestilt i denne chat. Bekræft det bare igen.` };
  const r = {
    kind: "design" as const,
    source: "chat" as const,
    company: String(a.company ?? "").trim().slice(0, 200),
    website: String(a.website ?? "").trim().slice(0, 300),
    placeType: String(a.placeType ?? "").slice(0, 80),
    city: String(a.city ?? "").trim().slice(0, 80),
    name: contact.name,
    email: contact.email,
    phone: contact.phone,
    message: String(a.notes ?? "").trim().slice(0, 2000),
    page: chat.page,
  };
  const problem = inboundProblem(r);
  if (problem) return { ok: false, message: `Mangler: ${problem} Spørg kunden.` };
  const saved = await saveInbound(ctx.d, r, { ipHash: chat.ipHash, chatId: chat._id, adminUrl: ctx.adminUrl, sms: ctx.sms, now: ctx.now });
  await setChat(ctx, { designRequest: { id: saved._id, company: r.company, at: ctx.now } });
  await audit(ctx.d, { chatId: chat._id, actor: "ai", actorName: "Sif", action: "design_request", bookingId: null, note: `${saved._id}: ${r.company} (${r.website})` });
  return { ok: true, requestId: saved._id, sendTo: contact.email, message: `Bestilt. Sig til kunden, at designudkastet og forslaget til software kommer på ${contact.email} inden for 24 timer, og at en kollega ringer på det oplyste nummer, hvis der er spørgsmål.` };
}

async function getBookings(ctx: ToolContext): Promise<Result> {
  const c = ctx.chat.customer;
  if (!c) return { ok: false, message: "Kunden er ikke verificeret. Bed om ordrenummeret, eller tilbyd en kode på SMS." };
  // New bookings made with the same verified e-mail or phone since the verification belong to the customer too.
  const keys = c.keys ?? { email: c.email, phone: null };
  const rentals = await bookingsFor<RentalWithTracking>(ctx.d, keys);
  const ids = rentals.map((r) => r._id);
  if (ids.join() !== c.bookings.join()) await setChat(ctx, { customer: { ...c, bookings: ids } });
  return { ok: true, today: ctx.today, bookings: rentals.map((r) => bookingView(r, ctx)) };
}

async function checkAvailability(ctx: ToolContext, a: { from: string; to: string; printer: boolean; forBooking: string | null }): Promise<Result> {
  if (!DAY.test(a.from) || !DAY.test(a.to)) return { ok: false, message: "Datoer skal være ÅÅÅÅ-MM-DD." };
  const range: Range = { from: a.from, to: a.to };
  let exclude: string | null = null;
  let theme: string | null = null;
  if (a.forBooking) {
    const r = await myRental(ctx, a.forBooking);
    if (!r) return { ok: false, message: "Den booking hører ikke til den verificerede kunde." };
    exclude = r._id;
    theme = r.theme;
  }
  const { holds, blocks } = await holdsExcluding(ctx.d, range.from, exclude);
  const u = usage(ctx.settings, holds, blocks);
  const wrong = problem(ctx.settings, u, { range, theme, printer: !!a.printer, photoType: "strip", delivery: "post" }, ctx.today);
  const days = nights(range);
  const quote = boxQuote(ctx.settings, range);
  if (wrong) return { ok: true, available: false, period: formatRange(range), reason: wrong, alternatives: alternatives(ctx, u, range, theme, !!a.printer), instruction: "Foreslå et par af de ledige datoer konkret i stedet for at spørge, hvilke kunden vil have tjekket." };
  return { ok: true, available: true, period: formatRange(range), label: quote.label, days, boxPrice: kr(quote.amount), printerPrice: a.printer ? kr(ctx.settings.prices.printer) : null };
}

async function proposeDateChange(ctx: ToolContext, a: { bookingNo: string; from: string; to: string }): Promise<Result> {
  if (!ctx.chat.customer) return { ok: false, message: "Kunden er ikke verificeret." };
  const r = await myRental(ctx, a.bookingNo);
  if (!r) return { ok: false, message: "Den booking hører ikke til den verificerede kunde." };
  if (!DAY.test(a.from) || !DAY.test(a.to) || a.from > a.to) return { ok: false, message: "Datoer skal være ÅÅÅÅ-MM-DD, og første dag før sidste." };
  if (r.status !== "paid" && r.status !== "packed") {
    return { ok: false, reason: "not_movable", message: `Bookingen har status "${STATUS_LABEL[r.status]}" og kan ikke flyttes her. ${r.status === "shipped" || r.status === "delivered" ? "Boksen er sendt. Eskalér, hvis kunden vil ændre noget." : "Eskalér."}` };
  }
  const range: Range = { from: a.from, to: a.to };
  if (nights(range) !== r.days) {
    return { ok: false, reason: "different_length", message: `Bookingen er på ${r.days} ${r.days === 1 ? "dag" : "dage"}, men de nye datoer er ${nights(range)}. Et andet antal dage ændrer prisen og skal aftales med en kollega: eskalér med de ønskede datoer.` };
  }
  if (a.from === r.from && a.to === r.to) return { ok: false, message: "Det er de datoer, bookingen allerede har." };
  const { holds, blocks } = await holdsExcluding(ctx.d, range.from, r._id);
  const u = usage(ctx.settings, holds, blocks);
  const wrong = problem(ctx.settings, u, { range, theme: r.theme, printer: r.printer, photoType: r.photoType, delivery: "post" }, ctx.today);
  if (wrong) return { ok: false, reason: "not_available", message: wrong, alternatives: alternatives(ctx, u, range, r.theme, r.printer), instruction: "Foreslå et par af de ledige datoer konkret, og spørg om kunden vil have en af dem." };
  const id = randomBytes(4).toString("hex");
  const summary = `${r._id}: fra ${formatRange({ from: r.from, to: r.to })} til ${formatRange(range)}, samme pris (${kr(r.total)})`;
  const pendingChange = { id, bookingId: r._id, oldFrom: r.from, oldTo: r.to, from: a.from, to: a.to, proposedAt: ctx.now, summary };
  await setChat(ctx, { pendingChange });
  await audit(ctx.d, { chatId: ctx.chat._id, actor: "ai", actorName: "Sif", action: "date_change_proposed", bookingId: r._id, before: { from: r.from, to: r.to }, after: { from: a.from, to: a.to }, note: summary });
  return {
    ok: true,
    changeId: id,
    summary,
    newPeriod: formatRange(range),
    shipsOn: heldRange(ctx.settings, range, "post").from,
    instruction: "Gentag forslaget for kunden i én sætning og spørg, om bookingen skal flyttes. Kald commit_date_change først, når kunden har svaret et klart ja i sin næste besked.",
  };
}

async function commitDateChange(ctx: ToolContext, a: { changeId: string }): Promise<Result> {
  const chat = ctx.chat;
  const c = chat.pendingChange;
  if (!c || c.id !== String(a.changeId)) return { ok: false, message: "Der er ikke noget aktuelt forslag med det id. Lav et nyt med propose_date_change." };
  if (!chat.lastCustomerAt || chat.lastCustomerAt <= c.proposedAt) {
    return { ok: false, reason: "no_answer_yet", message: "Kunden har ikke svaret på forslaget endnu. Gentag forslaget og vent på et ja." };
  }
  if (ctx.now.getTime() - c.proposedAt.getTime() > PROPOSAL_MINUTES * 60_000) {
    await setChat(ctx, { pendingChange: null });
    return { ok: false, reason: "expired", message: "Forslaget er for gammelt. Lav et nyt med propose_date_change og få et nyt ja." };
  }
  const r = await myRental(ctx, c.bookingId);
  if (!r || (r.status !== "paid" && r.status !== "packed") || r.from !== c.oldFrom || r.to !== c.oldTo) {
    await setChat(ctx, { pendingChange: null });
    return { ok: false, message: "Bookingen har ændret sig siden forslaget. Slå den op igen." };
  }
  const range: Range = { from: c.from, to: c.to };
  const { holds, blocks } = await holdsExcluding(ctx.d, range.from, r._id);
  if (!fits(ctx.settings, usage(ctx.settings, holds, blocks), range, "post", r.printer)) {
    await setChat(ctx, { pendingChange: null });
    return { ok: false, reason: "not_available", message: "Datoerne er blevet optaget i mellemtiden. Foreslå andre datoer." };
  }
  const by = `Sif (AI-support) efter kundens ja i chat ${chat._id}`;
  const note = `Datoer flyttet fra ${formatRange({ from: r.from, to: r.to })} til ${formatRange(range)} via supportchatten`;
  await ctx.d.collection<RentalDoc>("rentals").updateOne(
    { _id: r._id, from: r.from, to: r.to },
    { $set: { from: c.from, to: c.to, updatedAt: ctx.now }, $push: { history: { at: ctx.now, status: r.status, by, note } } },
  );
  await setChat(ctx, { pendingChange: null });
  await audit(ctx.d, { chatId: chat._id, actor: "ai", actorName: by, action: "date_change", bookingId: r._id, before: { from: r.from, to: r.to }, after: { from: c.from, to: c.to }, note: `${note}. Kundens besked kl. ${chat.lastCustomerAt.toISOString()}` });
  await addMessage(ctx.d, chat, { role: "tool", text: `Booking ${r._id} flyttet til ${formatRange(range)}`, tool: { name: "commit_date_change", label: "Dato flyttet", ok: true } });
  const after = { ...r, from: c.from, to: c.to };
  return { ok: true, message: "Bookingen er flyttet. Bekræft de nye datoer for kunden.", booking: bookingView(after, ctx) };
}

async function escalate(ctx: ToolContext, a: { reason: string; summary: string; urgent: boolean; phone: string | null }, by: "ai" | "customer" = "ai"): Promise<Result> {
  const chat = ctx.chat;
  const urgent = !!a.urgent;
  const promise = replyPromise(urgent, ctx.now);
  const c = chat.contact;
  const who = [chat.customer ? `${chat.customer.name}, ${chat.customer.bookings.join("/") || "ingen bookinger"}` : c ? `${c.name}, ikke verificeret` : "ikke verificeret", c ? `tlf. ${c.phone}` : null].filter(Boolean).join(", ");
  const summary = String(a.summary ?? "").trim().slice(0, 200) || "Kunden vil have et menneske";
  const text = `Selfi-chat${urgent ? " AKUT" : ""}: ${summary} (${who}${a.phone ? `, ring på ${a.phone}` : ""}) ${ctx.adminUrl}/admin/support/${chat._id}`;
  const smsSent = await ctx.sms(text);
  const escalation = { at: ctx.now, reason: a.reason, summary, urgent, smsSent, by, replyBy: promise.text };
  await setChat(ctx, { escalation, status: chat.status === "human" ? "human" : "waiting_human", unread: chat.unread + 1 });
  await audit(ctx.d, { chatId: chat._id, actor: by, actorName: by === "ai" ? "Sif" : chat.customer?.name ?? "kunde", action: "escalate", bookingId: chat.customer?.bookings[0] ?? null, note: `${a.reason}${urgent ? " (akut)" : ""}: ${summary}. SMS ${smsSent ? "sendt" : "ikke sendt"}` });
  await addMessage(ctx.d, chat, { role: "system", text: `Sendt videre til en kollega${urgent ? " som akut" : ""}, som svarer ${promise.text}.`, tool: { name: "escalate", label: "Sendt til en kollega", ok: smsSent } });
  return { ok: true, replyBy: promise.text, open: isOpen(ctx.now), hours: hoursText(), smsSent, message: `Sig til kunden, at en kollega tager over og svarer her i chatten ${promise.text}.${urgent ? " Han har kundens telefonnummer og kan ringe." : ""}` };
}

export const escalateByCustomer = (ctx: ToolContext) => escalate(ctx, { reason: "wants_human", summary: "Kunden trykkede på 'Tal med et menneske'", urgent: false, phone: null }, "customer");

/** Runs one tool call. Unknown tools and thrown errors come back as results the model can read. */
export async function runTool(ctx: ToolContext, name: string, rawArgs: string): Promise<Result> {
  let args: Record<string, unknown> = {};
  try {
    args = rawArgs ? (JSON.parse(rawArgs) as Record<string, unknown>) : {};
  } catch {
    return { ok: false, message: "Argumenterne kunne ikke læses." };
  }
  try {
    switch (name) {
      case "verify_order":
        return await verifyOrder(ctx, args as { bookingNo: string });
      case "send_sms_code":
        return await sendSmsCode(ctx);
      case "verify_sms_code":
        return await verifySmsCode(ctx, args as { code: string });
      case "request_design":
        return await requestDesign(ctx, args as { company: string; website: string; placeType: string; city: string | null; notes: string });
      case "get_bookings":
        return await getBookings(ctx);
      case "check_availability":
        return await checkAvailability(ctx, args as { from: string; to: string; printer: boolean; forBooking: string | null });
      case "propose_date_change":
        return await proposeDateChange(ctx, args as { bookingNo: string; from: string; to: string });
      case "commit_date_change":
        return await commitDateChange(ctx, args as { changeId: string });
      case "escalate":
        return await escalate(ctx, args as { reason: string; summary: string; urgent: boolean; phone: string | null });
      default:
        return { ok: false, message: `Ukendt værktøj: ${name}` };
    }
  } catch (e) {
    console.error(`support tool ${name}`, e);
    return { ok: false, message: "Værktøjet fejlede. Sig til kunden, at du ikke kunne slå det op lige nu, og eskalér hvis det haster." };
  }
}
