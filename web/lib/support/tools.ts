// The assistant's tools. Every tool runs here, in the backend, and only ever reads or changes the bookings
// of the customer who verified in this chat (chat.customer.bookings): the model cannot widen that, whatever
// it is told. Changes to a booking go through a proposal (propose_date_change) that the customer must answer
// before commit_date_change is allowed, and every change is written to the rental's history and to
// support_audit with time and actor.

import { randomBytes } from "node:crypto";
import type { Db } from "mongodb";

import { addDays, formatRange, nights, weekday, type DayKey, type Range } from "../dates";
import { fits, heldRange, kr, periodLabel, problem, usage, type Block, type Hold, type RentalSettings } from "../udlejning/core";
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
    description: "Verificerer kunden med bookingnummer (fx SB-271021-K4QX) og den e-mail, bookingen er lavet med. Skal lykkes, før noget om en booking kan vises eller ændres. Giver kundens navn og alle kundens bookinger.",
    strict: true,
    parameters: obj({ bookingNo: { type: "string", description: "Bookingnummeret, som kunden skrev det" }, email: { type: "string", description: "E-mailen, som kunden skrev den" } }, ["bookingNo", "email"]),
  },
  {
    type: "function" as const,
    name: "get_bookings",
    description: "Den verificerede kundes bookinger med status, datoer, tilvalg, pris, adresse, sporingsnumre, frister og link til opsætning. Kun for en verificeret kunde.",
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
    .collection<RentalDoc>("rentals")
    .find({ "contact.email": { $regex: `^${email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, $options: "i" }, status: { $nin: ["pending", "expired"] } }, { projection: { _id: 1, from: 1, status: 1, contact: 1 } })
    .sort({ from: 1 })
    .toArray();
  const customer = { email, name: r!.contact.name, bookings: all.map((b) => b._id), verifiedAt: ctx.now };
  await setChat(ctx, { customer });
  await audit(ctx.d, { chatId: chat._id, actor: "customer", actorName: customer.name, action: "verify", bookingId: id, note: `Verificeret med bookingnummer og e-mail. Bookinger: ${customer.bookings.join(", ")}` });
  return {
    ok: true,
    name: customer.name,
    bookings: all.map((b) => ({ bookingNo: b._id, from: b.from, status: b.status, statusLabel: STATUS_LABEL[b.status] })),
    message: "Kunden er verificeret. Brug get_bookings for detaljer.",
  };
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
  const price = ctx.settings.prices.byDays[Math.min(days, ctx.settings.prices.byDays.length) - 1] + Math.max(0, days - ctx.settings.prices.byDays.length) * ctx.settings.prices.perExtraDay;
  if (wrong) return { ok: true, available: false, period: formatRange(range), reason: wrong, alternatives: alternatives(ctx, u, range, theme, !!a.printer), instruction: "Foreslå et par af de ledige datoer konkret i stedet for at spørge, hvilke kunden vil have tjekket." };
  return { ok: true, available: true, period: formatRange(range), label: periodLabel(range), days, boxPrice: kr(price), printerPrice: a.printer ? kr(ctx.settings.prices.printer) : null };
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
