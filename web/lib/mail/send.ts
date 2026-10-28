// Sends a customer mail through Resend and logs it on the booking (MongoDB rental_mails), so admin can see
// exactly what the customer got. Without RESEND_API_KEY nothing is sent: the mail is logged as "mock", so
// the flow can be tested before the key is in Vercel. The key is only ever read from the environment.
//
// Samme fil i selfiebox (web/lib/mail/) og selfiebox-platform (web/src/lib/mail/). Hold de to kopier ens.

import { randomUUID } from "node:crypto";
import type { Db } from "mongodb";
import { renderEmail, type Company } from "./render";
import { buildMail, DEFAULT_TEXTS, KINDS, type MailContext, type MailKind, type MailTexts } from "./templates";

export type MailStatus = "sent" | "mock" | "failed";

export type MailLogDoc = {
  _id: string;
  rental: string; // booking number
  kind: MailKind;
  to: string;
  subject: string;
  html: string;
  text: string;
  status: MailStatus;
  resendId?: string;
  error?: string;
  by: string; // "auto", "stripe" or the admin's e-mail
  key?: string; // set on automatic mails, so one is never sent twice
  at: Date;
};

export type MailTemplateDoc = { _id: MailKind } & Partial<MailTexts> & { updatedAt?: Date; by?: string };
export type MailSettingsDoc = { _id: "settings"; auto: Partial<Record<MailKind, boolean>> };

export const FROM = () => process.env.MAIL_FROM || "Selfi <booking@mail.selfi.dk>";
export const REPLY_TO = () => process.env.MAIL_REPLY_TO || "";

/** Admin's rewritten texts for one kind, or nothing when the defaults are used. */
export async function getTexts(db: Db, kind: MailKind): Promise<Partial<MailTexts>> {
  const doc = await db.collection<MailTemplateDoc>("mail_templates").findOne({ _id: kind });
  if (!doc) return {};
  const out: Partial<MailTexts> = {};
  for (const k of Object.keys(DEFAULT_TEXTS[kind]) as (keyof MailTexts)[]) if (typeof doc[k] === "string") out[k] = doc[k];
  return out;
}

/** Whether an automatic mail is switched on in admin. */
export async function autoOn(db: Db, kind: MailKind): Promise<boolean> {
  const s = await db.collection<MailSettingsDoc>("mail_settings").findOne({ _id: "settings" });
  return s?.auto?.[kind] ?? !!KINDS[kind].defaultOn;
}

/** The finished mail for one booking: admin's texts (or the defaults) filled in and rendered. */
export async function composeMail(db: Db, kind: MailKind, ctx: MailContext, company: Company, texts?: Partial<MailTexts>) {
  const t = { ...(await getTexts(db, kind)), ...(texts ?? {}) };
  return renderEmail(buildMail(kind, ctx, t), { company, site: ctx.site });
}

export async function sendMail(
  db: Db,
  m: { rental: string; kind: MailKind; to: string; subject: string; html: string; text: string; by: string; key?: string },
): Promise<MailLogDoc> {
  const logs = db.collection<MailLogDoc>("rental_mails");
  if (m.key) {
    const done = await logs.findOne({ key: m.key, status: { $ne: "failed" } });
    if (done) return done;
  }
  const doc: MailLogDoc = { _id: randomUUID(), ...m, status: "mock", at: new Date() };
  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          ...(m.key ? { "Idempotency-Key": m.key.slice(0, 256) } : {}),
        },
        body: JSON.stringify({
          from: FROM(),
          to: [m.to],
          subject: m.subject,
          html: m.html,
          text: m.text,
          ...(REPLY_TO() ? { reply_to: REPLY_TO() } : {}),
          tags: [{ name: "kind", value: m.kind }, { name: "booking", value: m.rental.replace(/[^\w-]/g, "_") }],
        }),
        signal: AbortSignal.timeout(10_000),
      });
      const out = (await res.json().catch(() => ({}))) as { id?: string; message?: string };
      if (res.ok && out.id) Object.assign(doc, { status: "sent", resendId: out.id });
      else Object.assign(doc, { status: "failed", error: out.message ?? `Resend svarede ${res.status}` });
    } catch (e) {
      Object.assign(doc, { status: "failed", error: (e as Error).message });
    }
  }
  if (doc.status === "failed") console.error("mail", m.kind, m.rental, doc.error);
  await logs.insertOne(doc);
  return doc;
}
