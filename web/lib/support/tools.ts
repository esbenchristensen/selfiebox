// The assistant's tools. Every tool runs here, in the backend, and only ever reads or changes the bookings
// of the customer who verified in this chat (chat.customer.bookings): the model cannot widen that, whatever
// it is told. The assistant cannot change a booking: bookings are binding and cannot be moved or cancelled
// (/lejebetingelser point 8), so anything the customer wants changed goes to Esben through escalate.
// Verification and escalation are written to support_audit with time and actor.

import type { Db } from "mongodb";

import { addDays, formatRange, nights, weekday, type DayKey, type Range } from "../dates";
import { boxQuote, heldRange, kr, problem, usage, type Block, type Hold, type RentalSettings } from "../udlejning/core";
import { RELEASED, type RentalDoc, type RentalStatus } from "../udlejning/db";
import { addMessage, audit, supportCollections, type SupportChatDoc } from "./db";
import { hoursText, isOpen, replyPromise } from "./hours";
import type { SmsSender } from "./sms";

export type ToolContext = {
  d: Db;
  chat: SupportChatDoc;
  settings: RentalSettings;
  today: DayKey;
  now: Date;
  sms: SmsSender;
  adminUrl: string;
  setupUrl: string;
};

const MAX_VERIFY = 5;

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
  get_bookings: "Slår jeres bookinger op…",
  check_availability: "Tjekker ledige datoer…",
  escalate: "Sender videre til Esben…",
  web_search: "Søger på nettet…",
};

const obj = (properties: Record<string, unknown>, required: string[]) => ({ type: "object", properties, required, additionalProperties: false });

export const TOOL_DEFINITIONS = [
  {
    type: "function" as const,
    name: "verify_customer",
    description: "Verificerer kunden med bookingnummer (fx SB-271021-K4QX) og den e-mail, bookingen er lavet med. Skal lykkes, før noget om en booking kan vises eller ændres. Svarer med kundens navn og alle kundens bookinger med fulde detaljer (status, datoer, afsendelse, sporing, pris, opsætningslink), så get_bookings ikke behøves bagefter.",
    strict: true,
    parameters: obj({ bookingNo: { type: "string", description: "Bookingnummeret, som kunden skrev det" }, email: { type: "string", description: "E-mailen, som kunden skrev den" } }, ["bookingNo", "email"]),
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
    description: "Tjekker om boksen (og evt. printeren) er ledig i en periode, og hvad den koster, til en ny booking. Kræver ikke verificering.",
    strict: true,
    parameters: obj(
      {
        from: { type: "string", description: "Første lejedag, ÅÅÅÅ-MM-DD" },
        to: { type: "string", description: "Sidste lejedag, ÅÅÅÅ-MM-DD (samme som from ved én dag)" },
        printer: { type: "boolean", description: "Skal printeren også være ledig" },
      },
      ["from", "to", "printer"],
    ),
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
    setupUrl: ["pending", "expired"].includes(r.status) ? null : `${ctx.setupUrl}/${encodeURIComponent(r._id)}?t=${encodeURIComponent(r.token)}`,
    history: r.history.map((h) => `${h.at.toISOString().slice(0, 16).replace("T", " ")}: ${STATUS_LABEL[h.status]}`),
  };
}

/** Bookings and blocks that touch the days from `from` on. */
async function holdsFrom(d: Db, from: DayKey): Promise<{ holds: Hold[]; blocks: Block[] }> {
  const now = new Date();
  const since = addDays(from, -31);
  const rentals = await d
    .collection<RentalDoc>("rentals")
    .find(
      { status: { $nin: RELEASED }, to: { $gte: since }, $or: [{ status: { $ne: "pending" } }, { expiresAt: { $gt: now } }] },
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

async function setChat(ctx: ToolContext, set: Partial<SupportChatDoc>): Promise<void> {
  const { chats } = await supportCollections(ctx.d);
  await chats.updateOne({ _id: ctx.chat._id }, { $set: { ...set, updatedAt: ctx.now } });
  Object.assign(ctx.chat, set);
}

// ---------- the tools ----------

async function verifyCustomer(ctx: ToolContext, a: { bookingNo: string; email: string }): Promise<Result> {
  const chat = ctx.chat;
  if (chat.verifyLockedAt) return { ok: false, locked: true, message: "Verificeringen er låst efter for mange forsøg. Eskalér, så Esben kan hjælpe." };
  const id = String(a.bookingNo ?? "").trim().toUpperCase().replace(/\s+/g, "");
  const email = String(a.email ?? "").trim().toLowerCase();
  const r = await ctx.d.collection<RentalDoc>("rentals").findOne({ _id: id }, { projection: { contact: 1, status: 1 } });
  const match = !!r && r.contact.email.trim().toLowerCase() === email && r.status !== "pending" && r.status !== "expired";
  if (!match) {
    const attempts = chat.verifyAttempts + 1;
    const locked = attempts >= MAX_VERIFY;
    await setChat(ctx, { verifyAttempts: attempts, verifyLockedAt: locked ? ctx.now : null });
    await audit(ctx.d, { chatId: chat._id, actor: "customer", actorName: "kunde", action: locked ? "verify_locked" : "verify_failed", bookingId: id || null, note: `Forsøg ${attempts} af ${MAX_VERIFY}` });
    return locked
      ? { ok: false, locked: true, message: "For mange forkerte forsøg. Verificeringen er låst i denne chat. Eskalér, så Esben kan hjælpe kunden." }
      : { ok: false, attemptsLeft: MAX_VERIFY - attempts, message: "Bookingnummer og e-mail passer ikke sammen. Sig ikke, hvilken af de to der er forkert. Bed kunden tjekke begge dele i kvitteringen fra Stripe." };
  }
  const all = await ctx.d
    .collection<RentalWithTracking>("rentals")
    .find({ "contact.email": { $regex: `^${email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, $options: "i" }, status: { $nin: ["pending", "expired"] } })
    .sort({ from: 1 })
    .toArray();
  const customer = { email, name: r!.contact.name, bookings: all.map((b) => b._id), verifiedAt: ctx.now };
  await setChat(ctx, { customer });
  await audit(ctx.d, { chatId: chat._id, actor: "customer", actorName: customer.name, action: "verify", bookingId: id, note: `Verificeret med bookingnummer og e-mail. Bookinger: ${customer.bookings.join(", ")}` });
  // The details come along at once, so the model can answer without a second round trip.
  return { ok: true, name: customer.name, today: ctx.today, bookings: all.map((b) => bookingView(b, ctx)), message: "Kunden er verificeret. Svar ud fra bookingerne her; get_bookings er ikke nødvendig." };
}

async function getBookings(ctx: ToolContext): Promise<Result> {
  if (!ctx.chat.customer) return { ok: false, message: "Kunden er ikke verificeret. Bed om bookingnummer og e-mail først." };
  // New bookings made with the same e-mail since the verification belong to the customer too.
  const email = ctx.chat.customer.email;
  const rentals = await ctx.d
    .collection<RentalWithTracking>("rentals")
    .find({ "contact.email": { $regex: `^${email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, $options: "i" }, status: { $nin: ["pending", "expired"] } })
    .sort({ from: 1 })
    .toArray();
  const ids = rentals.map((r) => r._id);
  if (ids.join() !== ctx.chat.customer.bookings.join()) await setChat(ctx, { customer: { ...ctx.chat.customer, bookings: ids } });
  return { ok: true, today: ctx.today, bookings: rentals.map((r) => bookingView(r, ctx)) };
}

async function checkAvailability(ctx: ToolContext, a: { from: string; to: string; printer: boolean }): Promise<Result> {
  if (!DAY.test(a.from) || !DAY.test(a.to)) return { ok: false, message: "Datoer skal være ÅÅÅÅ-MM-DD." };
  const range: Range = { from: a.from, to: a.to };
  const theme: string | null = null;
  const { holds, blocks } = await holdsFrom(ctx.d, range.from);
  const u = usage(ctx.settings, holds, blocks);
  const wrong = problem(ctx.settings, u, { range, theme, printer: !!a.printer, photoType: "strip", delivery: "post" }, ctx.today);
  const days = nights(range);
  const quote = boxQuote(ctx.settings, range);
  if (wrong) return { ok: true, available: false, period: formatRange(range), reason: wrong, alternatives: alternatives(ctx, u, range, theme, !!a.printer), instruction: "Foreslå et par af de ledige datoer konkret i stedet for at spørge, hvilke kunden vil have tjekket." };
  return { ok: true, available: true, period: formatRange(range), label: quote.label, days, boxPrice: kr(quote.amount), printerPrice: a.printer ? kr(ctx.settings.prices.printer) : null };
}

async function escalate(ctx: ToolContext, a: { reason: string; summary: string; urgent: boolean; phone: string | null }, by: "ai" | "customer" = "ai"): Promise<Result> {
  const chat = ctx.chat;
  const urgent = !!a.urgent;
  const promise = replyPromise(urgent, ctx.now);
  const who = chat.customer ? `${chat.customer.name}, ${chat.customer.bookings.join("/")}` : "ikke verificeret";
  const summary = String(a.summary ?? "").trim().slice(0, 200) || "Kunden vil have et menneske";
  const text = `Selfi-chat${urgent ? " AKUT" : ""}: ${summary} (${who}${a.phone ? `, tlf. ${a.phone}` : ""}) ${ctx.adminUrl}/admin/support/${chat._id}`;
  const smsSent = await ctx.sms(text);
  const escalation = { at: ctx.now, reason: a.reason, summary, urgent, smsSent, by, replyBy: promise.text };
  await setChat(ctx, { escalation, status: chat.status === "human" ? "human" : "waiting_human", unread: chat.unread + 1 });
  await audit(ctx.d, { chatId: chat._id, actor: by, actorName: by === "ai" ? "Sif" : chat.customer?.name ?? "kunde", action: "escalate", bookingId: chat.customer?.bookings[0] ?? null, note: `${a.reason}${urgent ? " (akut)" : ""}: ${summary}. SMS ${smsSent ? "sendt" : "ikke sendt"}` });
  await addMessage(ctx.d, chat, { role: "system", text: `Sendt videre til Esben${urgent ? " som akut" : ""}. Han svarer ${promise.text}.`, tool: { name: "escalate", label: "Sendt til Esben", ok: smsSent } });
  return { ok: true, replyBy: promise.text, open: isOpen(ctx.now), hours: hoursText(), smsSent, message: `Sig til kunden, at Esben tager over og svarer her i chatten ${promise.text}.${urgent && !a.phone && !chat.customer?.bookings.length ? " Bed om et telefonnummer." : ""}` };
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
        return await verifyCustomer(ctx, args as { bookingNo: string; email: string });
      case "get_bookings":
        return await getBookings(ctx);
      case "check_availability":
        return await checkAvailability(ctx, args as { from: string; to: string; printer: boolean });
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
