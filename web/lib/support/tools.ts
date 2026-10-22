// The assistant's tools. Every tool runs here, in the backend, and only ever reads or changes the bookings
// of the customer who verified in this chat (chat.customer.bookings): the model cannot widen that, whatever
// it is told. Verification is a booking number that matches the e-mail or phone the customer gave when the
// chat started, or a one-time code sent by SMS to that phone (GDPR: nothing about an order before that). Changes to a booking go through a proposal (propose_date_change) that the customer must answer
// before commit_date_change is allowed, and every change is written to the rental's history and to
// support_audit with time and actor.

import { createHash, randomBytes, randomInt, timingSafeEqual } from "node:crypto";
import type { Db } from "mongodb";

import { addDays, formatRange, nights, weekday, type DayKey, type Range } from "../dates";
import { boxQuote, fits, heldRange, kr, problem, usage, type Block, type Hold, type RentalSettings } from "../udlejning/core";
import { RELEASED, type RentalDoc, type RentalStatus } from "../udlejning/db";
import { addMessage, audit, supportCollections, type SupportChatDoc } from "./db";
import { hoursText, isOpen, replyPromise } from "./hours";
import { generateDraft, hostOf, normalizePhone, notifyLead, parseLead, saveLead } from "../erhverv/leads";
import type { CodeSender, SmsSender } from "./sms";

export type ToolContext = {
  d: Db;
  chat: SupportChatDoc;
  settings: RentalSettings;
  today: DayKey;
  now: Date;
  sms: SmsSender;
  codeSms?: CodeSender; // the verification code to the customer's own phone
  later?: (job: () => Promise<void>) => void; // work that may finish after the reply (the lead's draft)
  adminUrl: string;
  setupUrl: string;
};

const MAX_VERIFY = 5;
const MAX_CODE_SENDS = 3;
const CODE_MINUTES = 10;
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
  verify_customer: "Tjekker bookingen…",
  send_sms_code: "Sender en kode på SMS…",
  verify_sms_code: "Tjekker koden…",
  register_business_lead: "Sender jeres forespørgsel videre…",
  get_bookings: "Slår jeres bookinger op…",
  check_availability: "Tjekker ledige datoer…",
  propose_date_change: "Regner på de nye datoer…",
  commit_date_change: "Flytter bookingen…",
  escalate: "Sender videre til Esben…",
  web_search: "Søger på nettet…",
};

const obj = (properties: Record<string, unknown>, required: string[]) => ({ type: "object", properties, required, additionalProperties: false });

export const TOOL_DEFINITIONS = [
  {
    type: "function" as const,
    name: "verify_customer",
    description: "Verificerer kunden med et bookingnummer/ordrenummer (fx SB-271021-K4QX). Bookingen skal være lavet med den e-mail eller det telefonnummer, kunden oplyste, da chatten startede. Kald den KUN, når kunden selv spørger til en ordre eller noget personligt. Svarer med kundens navn og alle kundens bookinger med fulde detaljer, så get_bookings ikke behøves bagefter.",
    strict: true,
    parameters: obj({ bookingNo: { type: "string", description: "Bookingnummeret, som kunden skrev det" } }, ["bookingNo"]),
  },
  {
    type: "function" as const,
    name: "send_sms_code",
    description: "Sender en engangskode på SMS til det telefonnummer, kunden oplyste, da chatten startede. Bruges når kunden spørger til en ordre eller noget personligt og ikke har (eller ikke kan finde) sit bookingnummer, eller når bookingnummeret ikke passede. Bed derefter kunden skrive koden her i chatten.",
    strict: true,
    parameters: obj({}, []),
  },
  {
    type: "function" as const,
    name: "verify_sms_code",
    description: "Tjekker koden, kunden har fået på SMS. Passer den, er kunden verificeret, og svaret indeholder de bookinger, der er lavet med det telefonnummer.",
    strict: true,
    parameters: obj({ code: { type: "string", description: "Koden, som kunden skrev den" } }, ["code"]),
  },
  {
    type: "function" as const,
    name: "register_business_lead",
    description: "Et sted/en virksomhed vil have et gratis designudkast til deres egen boks (svar inden 24 timer): gemmer forespørgslen hos Selfi og sender kunden en bekræftelse på mail. Kontaktpersonen er den, der skrev sig ind i chatten. Kræver virksomhedens navn og hjemmeside; spørg efter dem, hvis du ikke har dem.",
    strict: true,
    parameters: obj(
      {
        company: { type: "string", description: "Virksomhedens/stedets navn" },
        website: { type: "string", description: "Hjemmeside, eller Facebook/Instagram hvis de ingen har" },
        industry: { type: ["string", "null"], description: "Slags sted, fx bar, natklub, hotel, sportsklub, festival, eller null" },
        locations: { type: ["string", "null"], description: "Antal steder/bokse, hvis kunden har sagt det, ellers null" },
        message: { type: ["string", "null"], description: "Det, kunden har fortalt om stedet og ønskerne, kort, ellers null" },
      },
      ["company", "website", "industry", "locations", "message"],
    ),
  },
  {
    type: "function" as const,
    name: "get_bookings",
    description: "Henter den verificerede kundes bookinger igen (status, datoer, tilvalg, pris, sporingsnumre, frister, opsætningslink). Kun nødvendig senere i samtalen, fx efter en ændring eller når der er gået tid; verify_customer har allerede givet detaljerne.",
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
    description: "Sender sagen til et menneske (Esben) med SMS og markerer chatten. Brug ved ønske om et menneske, utilfredshed, klager, penge (refusion, erstatning, kompensation, skade, tyveri), jura, ændringer du ikke selv må lave, låst verificering, akutte problemer med boksen under en fest, tilbud til steder, og når du ikke kan svare sikkert. Svarer med, hvornår kunden kan forvente svar.",
    strict: true,
    parameters: obj(
      {
        reason: { type: "string", enum: ["wants_human", "unhappy", "complaint", "money", "damage_or_theft", "legal", "change_not_allowed", "verification_locked", "box_not_working", "business_offer", "unknown_answer", "other"] },
        summary: { type: "string", description: "Kort resumé på dansk til SMS'en: hvem, hvilken booking, hvad kunden vil have. Højst 200 tegn." },
        urgent: { type: "boolean", description: "true kun når boksen ikke virker under en fest, der er i gang nu eller i dag" },
        phone: { type: ["string", "null"], description: "Kundens telefonnummer, hvis kunden har skrevet det i chatten, ellers null" },
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

const escapeRe = (x: string) => x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const lastDigits = (p: string) => p.replace(/\D/g, "").slice(-8);
const hashCode = (chatId: string, code: string) => createHash("sha256").update(`${chatId}:${code}`).digest("hex");

/** Counts a failed attempt and locks verification at MAX_VERIFY. */
async function failVerify(ctx: ToolContext, action: "verify_failed", bookingId: string | null, how: string): Promise<{ locked: boolean; left: number }> {
  const attempts = ctx.chat.verifyAttempts + 1;
  const locked = attempts >= MAX_VERIFY;
  await setChat(ctx, { verifyAttempts: attempts, verifyLockedAt: locked ? ctx.now : null });
  await audit(ctx.d, { chatId: ctx.chat._id, actor: "customer", actorName: ctx.chat.contact?.name ?? "kunde", action: locked ? "verify_locked" : action, bookingId, note: `${how}. Forsøg ${attempts} af ${MAX_VERIFY}` });
  return { locked, left: MAX_VERIFY - attempts };
}

const LOCKED = { ok: false, locked: true, message: "Verificeringen er låst efter for mange forsøg. Eskalér, så en kollega kan hjælpe." };

async function verifyCustomer(ctx: ToolContext, a: { bookingNo: string }): Promise<Result> {
  const chat = ctx.chat;
  if (chat.verifyLockedAt) return LOCKED;
  if (!chat.contact) return { ok: false, message: "Kunden har ikke oplyst navn, e-mail og telefon. Bed om dem først." };
  const id = String(a.bookingNo ?? "").trim().toUpperCase().replace(/\s+/g, "");
  const r = await ctx.d.collection<RentalDoc>("rentals").findOne({ _id: id }, { projection: { contact: 1, status: 1 } });
  // The booking must belong to the person in the chat: same e-mail or same phone as they gave at the start.
  const mail = chat.contact.email.trim().toLowerCase();
  const match =
    !!r &&
    r.status !== "pending" &&
    r.status !== "expired" &&
    (r.contact.email.trim().toLowerCase() === mail || (!!r.contact.phone && normalizePhone(r.contact.phone) === normalizePhone(chat.contact.phone)));
  if (!match) {
    const f = await failVerify(ctx, "verify_failed", id || null, "Bookingnummer passede ikke med kundens e-mail/telefon");
    return f.locked
      ? { ok: false, locked: true, message: "For mange forkerte forsøg. Verificeringen er låst i denne chat. Eskalér, så en kollega kan hjælpe kunden." }
      : { ok: false, attemptsLeft: f.left, message: "Bookingnummeret passer ikke med den e-mail eller det telefonnummer, kunden har oplyst. Sig ikke, om bookingnummeret findes. Bed kunden tjekke nummeret i kvitteringen, eller tilbyd at sende en kode på SMS til det oplyste nummer (send_sms_code)." };
  }
  const email = r!.contact.email.trim().toLowerCase();
  const all = await ctx.d
    .collection<RentalWithTracking>("rentals")
    .find({ "contact.email": { $regex: `^${escapeRe(email)}$`, $options: "i" }, status: { $nin: ["pending", "expired"] } })
    .sort({ from: 1 })
    .toArray();
  const customer = { email, name: r!.contact.name, bookings: all.map((b) => b._id), verifiedAt: ctx.now, via: "booking" as const };
  await setChat(ctx, { customer, smsCode: null });
  await audit(ctx.d, { chatId: chat._id, actor: "customer", actorName: customer.name, action: "verify", bookingId: id, note: `Verificeret med bookingnummer og oplyst e-mail/telefon. Bookinger: ${customer.bookings.join(", ")}` });
  // The details come along at once, so the model can answer without a second round trip.
  return { ok: true, name: customer.name, today: ctx.today, bookings: all.map((b) => bookingView(b, ctx)), message: "Kunden er verificeret. Svar ud fra bookingerne her; get_bookings er ikke nødvendig." };
}

async function sendSmsCode(ctx: ToolContext): Promise<Result> {
  const chat = ctx.chat;
  if (chat.verifyLockedAt) return LOCKED;
  if (chat.customer) return { ok: false, message: "Kunden er allerede verificeret." };
  if (!chat.contact?.phone) return { ok: false, message: "Kunden har ikke oplyst et telefonnummer. Bed om det." };
  const prev = chat.smsCode;
  if (prev && prev.sends >= MAX_CODE_SENDS) return { ok: false, message: "Der er sendt koder for mange gange i denne chat. Eskalér, så en kollega kan hjælpe." };
  if (prev && ctx.now.getTime() - prev.sentAt.getTime() < 60_000) return { ok: false, message: "Der blev sendt en kode for under et minut siden. Bed kunden vente lidt og tjekke sine beskeder." };
  const to = normalizePhone(chat.contact.phone);
  const code = String(randomInt(0, 1_000_000)).padStart(6, "0");
  const sent = await (ctx.codeSms ?? (async () => false))(to, `Din kode til Selfis chat er ${code}. Den gælder i ${CODE_MINUTES} minutter. Skriv den kun i chatten på selfi.dk.`);
  if (!sent) return { ok: false, message: "SMS'en kunne ikke sendes lige nu. Bed om bookingnummeret i stedet, eller eskalér." };
  const smsCode = { hash: hashCode(chat._id, code), to, sentAt: ctx.now, expiresAt: new Date(ctx.now.getTime() + CODE_MINUTES * 60_000), sends: (prev?.sends ?? 0) + 1, attempts: 0 };
  await setChat(ctx, { smsCode });
  await audit(ctx.d, { chatId: chat._id, actor: "ai", actorName: "Sif", action: "sms_code_sent", bookingId: null, note: `Kode sendt til …${to.slice(-4)} (${smsCode.sends} af ${MAX_CODE_SENDS})` });
  return { ok: true, sentTo: `nummeret, der slutter på ${to.slice(-2)}`, validMinutes: CODE_MINUTES, message: "Sig til kunden, at koden er sendt på SMS, og bed dem skrive den her." };
}

async function verifySmsCode(ctx: ToolContext, a: { code: string }): Promise<Result> {
  const chat = ctx.chat;
  if (chat.verifyLockedAt) return LOCKED;
  const c = chat.smsCode;
  if (!c) return { ok: false, message: "Der er ikke sendt nogen kode. Brug send_sms_code først." };
  if (ctx.now > c.expiresAt) return { ok: false, expired: true, message: "Koden er udløbet. Tilbyd at sende en ny." };
  const got = Buffer.from(hashCode(chat._id, String(a.code ?? "").replace(/\D/g, "")));
  const want = Buffer.from(c.hash);
  if (got.length !== want.length || !timingSafeEqual(got, want)) {
    await setChat(ctx, { smsCode: { ...c, attempts: c.attempts + 1 } });
    const f = await failVerify(ctx, "verify_failed", null, "Forkert SMS-kode");
    return f.locked ? { ok: false, locked: true, message: "For mange forkerte forsøg. Verificeringen er låst. Eskalér." } : { ok: false, attemptsLeft: f.left, message: "Koden passer ikke. Bed kunden tjekke SMS'en og prøve igen." };
  }
  // The phone is proven: the customer's bookings are the ones made with that number.
  const tail = lastDigits(c.to);
  const all = (
    await ctx.d
      .collection<RentalWithTracking>("rentals")
      .find({ "contact.phone": { $regex: tail.split("").join("\\D*") }, status: { $nin: ["pending", "expired"] } })
      .sort({ from: 1 })
      .toArray()
  ).filter((r) => normalizePhone(r.contact.phone ?? "") === c.to);
  const name = all[0]?.contact.name ?? chat.contact?.name ?? "";
  const customer = { email: all[0]?.contact.email.toLowerCase() ?? "", name, bookings: all.map((b) => b._id), verifiedAt: ctx.now, via: "sms" as const, phone: c.to };
  await setChat(ctx, { customer, smsCode: null });
  await audit(ctx.d, { chatId: chat._id, actor: "customer", actorName: name || "kunde", action: "verify", bookingId: all[0]?._id ?? null, note: `Verificeret med SMS-kode til …${c.to.slice(-4)}. Bookinger: ${customer.bookings.join(", ") || "ingen"}` });
  if (!all.length) return { ok: true, name, bookings: [], message: "Telefonnummeret er bekræftet, men der er ingen bookinger lavet med det nummer. Spørg, om bookingen kan være lavet med et andet nummer eller en anden e-mail, og tilbyd bookingnummeret som alternativ." };
  return { ok: true, name, today: ctx.today, bookings: all.map((b) => bookingView(b, ctx)), message: "Kunden er verificeret. Svar ud fra bookingerne her." };
}

async function registerBusinessLead(ctx: ToolContext, a: { company: string; website: string; industry: string | null; locations: string | null; message: string | null }): Promise<Result> {
  const chat = ctx.chat;
  if (!chat.contact) return { ok: false, message: "Kunden har ikke oplyst navn, e-mail og telefon." };
  const parsed = parseLead({ ...chat.contact, company: a.company, website: a.website, industry: a.industry ?? "", locations: a.locations ?? "", message: a.message ?? "" });
  if (!parsed.ok) return { ok: false, message: parsed.error };
  const saved = await saveLead(ctx.d, parsed.lead, { source: "chat", page: chat.page || "chat", chatId: chat._id }, ctx.now);
  await setChat(ctx, { lead: { id: saved.id, at: ctx.now } });
  await audit(ctx.d, { chatId: chat._id, actor: "ai", actorName: "Sif", action: "lead", bookingId: null, note: `Designudkast bestilt til ${parsed.lead.company} (${hostOf(parsed.lead.website)}), lead ${saved.id}` });
  const job = async () => {
    await notifyLead(parsed.lead, saved.id, saved.dueAt, { source: "chat", repeat: saved.repeat });
    if (!saved.repeat) await generateDraft(ctx.d, saved.id);
  };
  if (ctx.later) ctx.later(job);
  else void job();
  const due = new Intl.DateTimeFormat("da-DK", { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Copenhagen" }).format(saved.dueAt);
  return {
    ok: true,
    dueBy: due,
    email: parsed.lead.email,
    message: `Sig til kunden, at ${parsed.lead.company} får et designforslag til boksen og et forslag til funktioner på ${parsed.lead.email} senest ${due}, og at der kommer en bekræftelse på mail nu. Har de logo eller designmanual, kan de svare på den mail med den.`,
  };
}

async function getBookings(ctx: ToolContext): Promise<Result> {
  if (!ctx.chat.customer) return { ok: false, message: "Kunden er ikke verificeret. Bed om bookingnummeret, eller send en kode på SMS." };
  // New bookings made with the same e-mail (or, after an SMS code, the same phone) belong to the customer too.
  const { email, via, phone } = ctx.chat.customer;
  const rentals =
    via === "sms" && phone
      ? (
          await ctx.d
            .collection<RentalWithTracking>("rentals")
            .find({ "contact.phone": { $regex: lastDigits(phone).split("").join("\\D*") }, status: { $nin: ["pending", "expired"] } })
            .sort({ from: 1 })
            .toArray()
        ).filter((r) => normalizePhone(r.contact.phone ?? "") === phone)
      : await ctx.d
          .collection<RentalWithTracking>("rentals")
          .find({ "contact.email": { $regex: `^${escapeRe(email)}$`, $options: "i" }, status: { $nin: ["pending", "expired"] } })
          .sort({ from: 1 })
          .toArray();
  const ids = rentals.map((r) => r._id);
  if (ids.join() !== ctx.chat.customer.bookings.join()) await setChat(ctx, { customer: { ...ctx.chat.customer, bookings: ids } });
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
    return { ok: false, reason: "different_length", message: `Bookingen er på ${r.days} ${r.days === 1 ? "dag" : "dage"}, men de nye datoer er ${nights(range)}. Et andet antal dage ændrer prisen og skal aftales med Esben: eskalér med de ønskede datoer.` };
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
  const who = chat.customer ? `${chat.customer.name}, ${chat.customer.bookings.join("/")}` : `${chat.contact?.name ?? "ukendt"}, ikke verificeret`;
  const phone = a.phone || chat.contact?.phone || null;
  const summary = String(a.summary ?? "").trim().slice(0, 200) || "Kunden vil have et menneske";
  const text = `Selfi-chat${urgent ? " AKUT" : ""}: ${summary} (${who}${phone ? `, tlf. ${phone}` : ""}) ${ctx.adminUrl}/admin/support/${chat._id}`;
  const smsSent = await ctx.sms(text);
  const escalation = { at: ctx.now, reason: a.reason, summary, urgent, smsSent, by, replyBy: promise.text };
  await setChat(ctx, { escalation, status: chat.status === "human" ? "human" : "waiting_human", unread: chat.unread + 1 });
  await audit(ctx.d, { chatId: chat._id, actor: by, actorName: by === "ai" ? "Sif" : chat.customer?.name ?? "kunde", action: "escalate", bookingId: chat.customer?.bookings[0] ?? null, note: `${a.reason}${urgent ? " (akut)" : ""}: ${summary}. SMS ${smsSent ? "sendt" : "ikke sendt"}` });
  await addMessage(ctx.d, chat, { role: "system", text: `Sendt videre til Esben${urgent ? " som akut" : ""}. Han svarer ${promise.text}.`, tool: { name: "escalate", label: "Sendt til Esben", ok: smsSent } });
  return { ok: true, replyBy: promise.text, open: isOpen(ctx.now), hours: hoursText(), smsSent, message: `Sig til kunden, at Esben tager over og svarer her i chatten ${promise.text}.${urgent && !phone ? " Bed om et telefonnummer." : ""}` };
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
      case "verify_customer":
        return await verifyCustomer(ctx, args as { bookingNo: string });
      case "send_sms_code":
        return await sendSmsCode(ctx);
      case "verify_sms_code":
        return await verifySmsCode(ctx, args as { code: string });
      case "register_business_lead":
        return await registerBusinessLead(ctx, args as { company: string; website: string; industry: string | null; locations: string | null; message: string | null });
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
