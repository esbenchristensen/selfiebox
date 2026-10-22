// The customer's chat is identified by a cookie: "<chat id>.<secret token>". The id alone opens nothing;
// the token is compared in constant time. The cookie is httpOnly, so scripts on the page never see it.

import { createHash, randomBytes, randomUUID, timingSafeEqual } from "node:crypto";
import type { Db } from "mongodb";

import { expiry, supportCollections, type SupportChatDoc } from "./db";
import { hoursText, isOpen } from "./hours";

export const COOKIE = "selfi_chat";
const COOKIE_DAYS = 30;

export type PublicChat = {
  id: string;
  status: SupportChatDoc["status"];
  takenBy: string | null;
  escalation: { at: string; urgent: boolean; replyBy: string } | null;
  customer: { name: string; bookings: string[] } | null;
  contact: { name: string } | null;
  open: boolean;
  hours: string;
};

export function readCookie(req: Request): { id: string; token: string } | null {
  const raw = req.headers.get("cookie") ?? "";
  const m = raw.match(new RegExp(`(?:^|;\\s*)${COOKIE}=([^;]+)`));
  if (!m) return null;
  const [id, token] = decodeURIComponent(m[1]).split(".");
  return id && token ? { id, token } : null;
}

export async function loadChat(d: Db, req: Request): Promise<SupportChatDoc | null> {
  const c = readCookie(req);
  if (!c) return null;
  const { chats } = await supportCollections(d);
  const chat = await chats.findOne({ _id: c.id });
  if (!chat) return null;
  const a = Buffer.from(chat.token);
  const b = Buffer.from(c.token);
  return a.length === b.length && timingSafeEqual(a, b) ? chat : null;
}

export const ipHash = (req: Request) => createHash("sha256").update(req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "lokal").digest("hex").slice(0, 24);

export type ChatContact = { name: string; email: string; phone: string };

/** Name, e-mail and phone from the widget's first screen, or an error in Danish. All three are required. */
export function parseContact(raw: unknown): { ok: true; contact: ChatContact } | { ok: false; error: string } {
  const c = (raw ?? {}) as Record<string, unknown>;
  const s = (v: unknown, max: number) => (typeof v === "string" ? v.replace(/\s+/g, " ").trim().slice(0, max) : "");
  const contact = { name: s(c.name, 120), email: s(c.email, 200).toLowerCase(), phone: s(c.phone, 40) };
  if (!contact.name) return { ok: false, error: "Skriv dit navn." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) return { ok: false, error: "Skriv en gyldig e-mail." };
  if (contact.phone.replace(/\D/g, "").length < 8) return { ok: false, error: "Skriv dit telefonnummer." };
  return { ok: true, contact };
}

export async function createChat(d: Db, req: Request, page: string, model: string, contact: ChatContact | null = null): Promise<SupportChatDoc> {
  const { chats } = await supportCollections(d);
  const now = new Date();
  const chat: SupportChatDoc = {
    _id: randomUUID(),
    token: randomBytes(24).toString("hex"),
    status: "open",
    createdAt: now,
    updatedAt: now,
    lastMessageAt: now,
    lastCustomerAt: null,
    lastAgentAt: null,
    expiresAt: expiry(now),
    page: page.slice(0, 200),
    ipHash: ipHash(req),
    summary: "",
    messages: 0,
    unread: 0,
    customer: null,
    contact: contact ? { ...contact, at: now } : null,
    smsCode: null,
    lead: null,
    verifyAttempts: 0,
    verifyLockedAt: null,
    takenBy: null,
    escalation: null,
    pendingChange: null,
    model,
  };
  await chats.insertOne(chat);
  return chat;
}

export function cookieFor(chat: SupportChatDoc | null): string {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  if (!chat) return `${COOKIE}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax${secure}`;
  return `${COOKIE}=${encodeURIComponent(`${chat._id}.${chat.token}`)}; Path=/; Max-Age=${COOKIE_DAYS * 86400}; HttpOnly; SameSite=Lax${secure}`;
}

export function publicView(chat: SupportChatDoc): PublicChat {
  return {
    id: chat._id,
    status: chat.status,
    takenBy: chat.takenBy?.name ?? null,
    escalation: chat.escalation ? { at: chat.escalation.at.toISOString(), urgent: chat.escalation.urgent, replyBy: chat.escalation.replyBy } : null,
    customer: chat.customer ? { name: chat.customer.name, bookings: chat.customer.bookings } : null,
    contact: chat.contact ? { name: chat.contact.name } : null,
    open: isOpen(),
    hours: hoursText(),
  };
}
