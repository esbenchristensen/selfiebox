import "server-only";

import type { Db } from "mongodb";
import { sendSms } from "../support/sms";
import type { RentalDoc } from "./db";

// Korte SMS til privatkunder på de dage, hvor en mail let drukner: dagen før festen og den dag, boksen skal
// retur. Hver SMS har en nøgle pr. booking (rental_sms), så den aldrig sendes to gange. Uden Twilio i Vercel
// sendes intet, og mailen er stadig den rigtige besked.

/** Dansk nummer til E.164: 8 cifre får +45, 0045 bliver +45. Andet end et telefonnummer giver null. */
export function e164(phone: string): string | null {
  const p = phone.replace(/[\s\-().]/g, "");
  if (/^\+\d{8,15}$/.test(p)) return p;
  if (/^00\d{8,15}$/.test(p)) return `+${p.slice(2)}`;
  if (/^\d{8}$/.test(p)) return `+45${p}`;
  return null;
}

export async function customerSms(d: Db, b: RentalDoc, kind: string, text: string): Promise<boolean> {
  if (b.test) return false;
  const to = e164(b.contact.phone ?? "");
  if (!to) return false;
  const log = d.collection<{ _id: string; rental: string; kind: string; to: string; text: string; ok: boolean; at: Date }>("rental_sms");
  const key = `${b._id}:${kind}`;
  if (await log.findOne({ _id: key, ok: true })) return true;
  const ok = await sendSms(to, text);
  await log.updateOne({ _id: key }, { $set: { rental: b._id, kind, to, text, ok, at: new Date() } }, { upsert: true });
  return ok;
}
