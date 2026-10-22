// Who the person in the chat is, and when the assistant may say anything about an order.
//
// Before the first message the widget asks for name, e-mail and phone (chat.contact). That is only what the
// person typed: it unlocks nothing. Orders open in one of two ways, both checked here and never by the model:
//   1. Order number: the booking must exist and its e-mail or phone must match the chat's contact details.
//   2. SMS code: a 6-digit code to the phone in chat.contact. The right code proves the phone, and the
//      bookings made with that phone open.
// Codes are stored as a hash, expire after CODE_MINUTES, allow MAX_CODE_TRIES guesses, and sending is
// limited per chat and per phone number (support_sms_codes, TTL), so the chat cannot be used to spam a number.

import { createHash, randomInt, timingSafeEqual } from "node:crypto";
import type { Db } from "mongodb";

import type { RentalDoc } from "../udlejning/db";
import type { SupportChatDoc } from "./db";

export const CODE_MINUTES = 10;
export const MAX_CODE_TRIES = 5;
export const MAX_SENDS_PER_CHAT = 3;
export const MAX_SENDS_PER_PHONE_HOUR = 3;

export type Contact = { name: string; email: string; phone: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** A phone number as +45XXXXXXXX (or +<country><number> for foreign numbers), or null when it is not one. */
export function normalizePhone(raw: string): string | null {
  let s = String(raw ?? "").trim().replace(/[\s().-]/g, "");
  if (s.startsWith("00")) s = `+${s.slice(2)}`;
  if (/^\d{8}$/.test(s)) return `+45${s}`;
  if (/^45\d{8}$/.test(s)) return `+${s}`;
  if (/^\+\d{8,15}$/.test(s)) return s;
  return null;
}

/** Name, e-mail and phone from the widget's form, cleaned, or an error to show. */
export function parseContact(body: { name?: unknown; email?: unknown; phone?: unknown }): { ok: true; contact: Contact } | { ok: false; error: string } {
  const name = typeof body.name === "string" ? body.name.trim().replace(/\s+/g, " ").slice(0, 120) : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase().slice(0, 200) : "";
  const phone = normalizePhone(typeof body.phone === "string" ? body.phone : "");
  if (name.length < 2) return { ok: false, error: "Skriv dit navn." };
  if (!EMAIL.test(email)) return { ok: false, error: "Skriv en gyldig e-mail." };
  if (!phone) return { ok: false, error: "Skriv et gyldigt telefonnummer, fx 12 34 56 78." };
  return { ok: true, contact: { name, email, phone } };
}

/** "•• •• 56 78": enough for the person to recognise the number, nothing more. */
export const maskPhone = (phone: string) => `•• •• ${phone.slice(-4, -2)} ${phone.slice(-2)}`;

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Mongo filter for rentals whose phone is this number, however it was typed (spaces, +45 or not). */
export function phoneFilter(phone: string): Record<string, unknown> {
  const dk = phone.startsWith("+45");
  const digits = (dk ? phone.slice(3) : phone.slice(1)).split("").join("\\D*");
  return { "contact.phone": { $regex: dk ? `^\\D*(?:(?:00)?45\\D*)?${digits}\\D*$` : `^\\D*(?:00)?${digits}\\D*$` } };
}

export const emailFilter = (email: string): Record<string, unknown> => ({ "contact.email": { $regex: `^\\s*${escape(email.trim().toLowerCase())}\\s*$`, $options: "i" } });

export const samePhone = (a: string, b: string) => {
  const x = normalizePhone(a);
  return !!x && x === normalizePhone(b);
};
export const sameEmail = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();

const HIDDEN: RentalDoc["status"][] = ["pending", "expired"];

/** The bookings the verified identifiers open: same e-mail and/or same phone, never unpaid ones. */
export async function bookingsFor<T extends RentalDoc>(d: Db, keys: { email: string | null; phone: string | null }): Promise<T[]> {
  const or = [keys.email ? emailFilter(keys.email) : null, keys.phone ? phoneFilter(keys.phone) : null].filter(Boolean) as Record<string, unknown>[];
  if (!or.length) return [];
  return d
    .collection<T>("rentals")
    .find({ $or: or, status: { $nin: HIDDEN } } as never)
    .sort({ from: 1 })
    .toArray() as Promise<T[]>;
}

// ---------- SMS codes ----------

type CodeLogDoc = { phone: string; chatId: string; at: Date; expiresAt: Date };

const hashCode = (chatId: string, code: string) => createHash("sha256").update(`${chatId}:${code}`).digest("hex");

export function newCode(chatId: string, now: Date): { code: string; stored: NonNullable<SupportChatDoc["smsCode"]> } {
  const code = String(randomInt(0, 1_000_000)).padStart(6, "0");
  return { code, stored: { hash: hashCode(chatId, code), sentAt: now, expiresAt: new Date(now.getTime() + CODE_MINUTES * 60_000), tries: 0 } };
}

export function codeMatches(chatId: string, stored: NonNullable<SupportChatDoc["smsCode"]>, typed: string): boolean {
  const clean = String(typed ?? "").replace(/\D/g, "");
  if (clean.length !== 6) return false;
  const a = Buffer.from(stored.hash);
  const b = Buffer.from(hashCode(chatId, clean));
  return a.length === b.length && timingSafeEqual(a, b);
}

/** How many codes went to this phone in the last hour, across all chats. */
export async function recentSends(d: Db, phone: string, now: Date): Promise<number> {
  const log = d.collection<CodeLogDoc>("support_sms_codes");
  await log.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }).catch(() => undefined);
  return log.countDocuments({ phone, at: { $gt: new Date(now.getTime() - 3600_000) } });
}

export async function logSend(d: Db, phone: string, chatId: string, now: Date): Promise<void> {
  await d.collection<CodeLogDoc>("support_sms_codes").insertOne({ phone, chatId, at: now, expiresAt: new Date(now.getTime() + 86400_000) });
}
