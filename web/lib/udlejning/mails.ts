import "server-only";

import type { Db } from "mongodb";
import { company } from "../company";
import type { Company } from "../mail/render";
import { autoOn, composeMail, sendMail } from "../mail/send";
import type { MailBooking, MailContext, MailKind } from "../mail/templates";
import { getSettings, type RentalDoc } from "./db";

// The automatic customer mails from selfi.dk (Stripe webhook and the daily cron). The design and texts are in
// lib/mail; admin.selfi.dk sends the manual ones with the same code. A mail never stops a booking from being
// saved: anything that goes wrong is logged and the caller carries on.

const site = () => (process.env.SITE_URL || "https://www.selfi.dk").replace(/\/$/, "");
const portal = () => (process.env.SELFI_PORTAL_URL || "https://foto.selfi.dk").replace(/\/$/, "");

export const mailCompany: Company = { ...company };

export async function mailContext(d: Db, b: RentalDoc, extra: Partial<MailContext> = {}): Promise<MailContext> {
  const settings = await getSettings(d);
  return { booking: b as MailBooking, shipDaysBefore: settings.rules.shipDaysBefore, site: site(), portal: portal(), phone: company.phone || undefined, ...extra };
}

/** Sends one automatic mail if it is switched on in admin and has not been sent before (`key`). */
export async function autoMail(d: Db, kind: MailKind, b: RentalDoc, opts: { key?: string; by?: string; extra?: Partial<MailContext> } = {}) {
  try {
    if (!(await autoOn(d, kind))) return null;
    const m = await composeMail(d, kind, await mailContext(d, b, opts.extra), mailCompany);
    return await sendMail(d, { rental: b._id, kind, to: b.contact.email, ...m, by: opts.by ?? "auto", key: opts.key ?? `${b._id}:${kind}` });
  } catch (e) {
    console.error("autoMail", kind, b._id, e);
    return null;
  }
}
