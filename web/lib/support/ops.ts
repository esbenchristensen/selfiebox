// Sifs tekniske værktøjer (boksstatus, genstart, opsætning, links, verificering af steder) ligger i
// selfiebox-platform, fordi de skal tale med fleet og boksene, og fordi en telefonassistent senere skal bruge
// præcis de samme. Her er chattens side: hent værktøjerne, kald dem med chattens scope, og gem et grant, når
// kunden er verificeret dér. Se selfiebox-platform docs/sif-vaerktoejer.md.
//
// Env: SUPPORT_OPS_URL (https://admin.selfi.dk), SUPPORT_OPS_TOKEN (= SUPPORT_API_TOKEN i platformen). Uden dem
// har Sif bare ikke værktøjerne og svarer som før.
//
// Afgrænsningen: scope bygges her af chat.customer (det kunden er verificeret til), aldrig af modellens
// argumenter. Platformen afviser alt uden for scope.

import type { Db } from "mongodb";

import { audit, supportCollections, type SupportChatDoc } from "./db";

export type OpsToolDef = { type: "function"; name: string; description: string; strict: true; parameters: Record<string, unknown> };
type Result = Record<string, unknown>;

export type OpsClient = {
  tools: () => Promise<{ tools: OpsToolDef[]; labels: Record<string, string> }>;
  call: (name: string, body: Record<string, unknown>) => Promise<Result>;
};

const base = () => (process.env.SUPPORT_OPS_URL || "").replace(/\/$/, "");
const token = () => process.env.SUPPORT_OPS_TOKEN || "";

let cache: { at: number; value: { tools: OpsToolDef[]; labels: Record<string, string> } } | null = null;
const TTL = 10 * 60_000;

/** Den rigtige klient mod platformen. */
export const httpOps: OpsClient = {
  async tools() {
    if (!base() || !token()) return { tools: [], labels: {} };
    if (cache && Date.now() - cache.at < TTL) return cache.value;
    try {
      const res = await fetch(`${base()}/api/support/v1/tools?format=openai`, { headers: { authorization: `Bearer ${token()}` }, signal: AbortSignal.timeout(5000), cache: "no-store" });
      if (!res.ok) throw new Error(`status ${res.status}`);
      const value = (await res.json()) as { tools: OpsToolDef[]; labels: Record<string, string> };
      cache = { at: Date.now(), value };
      return value;
    } catch (e) {
      console.error("support ops tools", (e as Error).message);
      return cache?.value ?? { tools: [], labels: {} }; // et gammelt sæt er bedre end intet
    }
  },
  async call(name, body) {
    try {
      const res = await fetch(`${base()}/api/support/v1/tools/${encodeURIComponent(name)}`, {
        method: "POST",
        headers: { authorization: `Bearer ${token()}`, "content-type": "application/json" },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(25_000),
      });
      const out = (await res.json().catch(() => null)) as Result | null;
      return out ?? { ok: false, message: `Platformen svarede ${res.status}` };
    } catch (e) {
      console.error("support ops call", name, (e as Error).message);
      return { ok: false, message: "Systemet kunne ikke nås lige nu. Sig det til kunden, og send sagen videre, hvis det haster (akut, hvis festen er i gang)." };
    }
  },
};

/** Det, chatten er verificeret til, som platformen forstår det. */
export function scopeOf(chat: SupportChatDoc) {
  const c = chat.customer;
  if (!c) return null;
  return {
    bookings: c.bookings,
    venues: (c.venues ?? []).map((v) => v.id),
    // customer.phone sættes kun af en SMS-kode (verify_sms_code eller check_verification), så nummeret er bevist.
    // Det giver adgang til gæstens egne billeder.
    phone: c.phone ?? null,
    via: c.via ?? "booking",
    verifiedAt: c.verifiedAt.toISOString(),
  };
}

type Grant = { bookings: string[]; venues: { id: string; name: string }[]; phone: string | null; email: string | null; via: "sms" | "email"; verifiedAt: string };

/** Kunden er verificeret i platformen: læg det oven i det, chatten allerede havde. */
async function applyGrant(d: Db, chat: SupportChatDoc, g: Grant, now: Date): Promise<void> {
  const prev = chat.customer;
  const venues = [...(prev?.venues ?? [])];
  for (const v of g.venues) if (!venues.some((x) => x.id === v.id)) venues.push(v);
  const customer: NonNullable<SupportChatDoc["customer"]> = {
    email: prev?.email || g.email || chat.contact?.email.toLowerCase() || "",
    name: prev?.name || chat.contact?.name || "",
    bookings: [...new Set([...(prev?.bookings ?? []), ...g.bookings])].sort(),
    verifiedAt: prev?.verifiedAt ?? now,
    via: prev?.via ?? (g.via === "sms" ? "sms" : "email"),
    ...(g.phone || prev?.phone ? { phone: g.phone ?? prev?.phone } : {}),
    venues,
  };
  const { chats } = await supportCollections(d);
  await chats.updateOne({ _id: chat._id }, { $set: { customer, updatedAt: now } });
  chat.customer = customer;
  await audit(d, {
    chatId: chat._id, actor: "customer", actorName: customer.name || "kunde", action: "verify", bookingId: customer.bookings[0] ?? null,
    note: `Verificeret med kode på ${g.via === "sms" ? "SMS" : "mail"}. Bookinger: ${customer.bookings.join(", ") || "ingen"}. Steder: ${venues.map((v) => v.name).join(", ") || "ingen"}`,
  });
}

/** Kør et platformsværktøj for chatten. */
export async function runOps(d: Db, chat: SupportChatDoc, ops: OpsClient, name: string, args: Record<string, unknown>, now: Date): Promise<Result> {
  const out = await ops.call(name, {
    session: { channel: "chat", id: chat._id, lastCustomerAt: chat.lastCustomerAt?.toISOString() ?? null },
    contact: chat.contact ? { name: chat.contact.name, email: chat.contact.email, phone: chat.contact.phone } : null,
    scope: scopeOf(chat),
    args,
  });
  if (out.ok === true && out.grant && typeof out.grant === "object") {
    await applyGrant(d, chat, out.grant as Grant, now);
    const { grant, ...rest } = out;
    const g = grant as Grant;
    // Modellen får hvad kunden nu har adgang til, ikke e-mail og nummer igen.
    return { ...rest, bookings: g.bookings, venues: g.venues, guestPhotos: !!g.phone };
  }
  return out;
}
