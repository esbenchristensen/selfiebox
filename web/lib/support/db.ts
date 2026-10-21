// The support chat's data in MongoDB (database "selfiebox", next to the rentals), so admin.selfi.dk shows
// and takes over chats from the same collections. Keep these types in sync with selfiebox-platform
// web/src/lib/types.ts (SupportChatDoc, SupportMessageDoc, SupportAuditDoc).
//
//   support_chats     one document per conversation
//   support_messages  every message, in order (seq), customer, assistant, human, system and tool notes
//   support_audit     who changed what, when: verifications, date changes, escalations, takeovers. Kept.
//
// GDPR: chats and messages carry expiresAt and a TTL index, so a conversation is deleted
// SUPPORT_RETENTION_DAYS (default 90) after its last message. The audit log is a business record and stays.

import type { Db, ObjectId } from "mongodb";
import type { DayKey } from "../dates";

export type ChatStatus = "open" | "waiting_human" | "human" | "closed";
export type MessageRole = "customer" | "assistant" | "human" | "system" | "tool";

export type SupportChatDoc = {
  _id: string;
  token: string; // secret in the customer's cookie; the id alone opens nothing
  status: ChatStatus;
  createdAt: Date;
  updatedAt: Date;
  lastMessageAt: Date;
  lastCustomerAt: Date | null;
  lastAgentAt: Date | null;
  expiresAt: Date;
  page: string; // where on selfi.dk the chat was started
  ipHash: string;
  summary: string; // the first customer message, for the list in admin
  messages: number;
  unread: number; // customer messages since a human last looked, for the badge in admin
  customer: { email: string; name: string; bookings: string[]; verifiedAt: Date } | null;
  verifyAttempts: number;
  verifyLockedAt: Date | null;
  takenBy: { id: string; name: string; at: Date } | null;
  escalation: { at: Date; reason: string; summary: string; urgent: boolean; smsSent: boolean; by: "ai" | "customer"; replyBy: string } | null;
  pendingChange: { id: string; bookingId: string; oldFrom: DayKey; oldTo: DayKey; from: DayKey; to: DayKey; proposedAt: Date; summary: string } | null;
  model: string;
};

export type SupportMessageDoc = {
  _id?: ObjectId;
  chatId: string;
  seq: number;
  at: Date;
  role: MessageRole;
  text: string;
  name?: string; // the human's name on "human" messages
  tool?: { name: string; label: string; ok: boolean };
  sources?: { url: string; title: string }[];
  expiresAt: Date;
};

export type SupportAuditDoc = {
  _id?: ObjectId;
  at: Date;
  chatId: string;
  actor: "ai" | "human" | "customer" | "system";
  actorName: string;
  action: "verify" | "verify_failed" | "verify_locked" | "date_change_proposed" | "date_change" | "escalate" | "takeover" | "give_back" | "close";
  bookingId: string | null;
  before?: unknown;
  after?: unknown;
  note: string;
};

export const RETENTION_DAYS = Number(process.env.SUPPORT_RETENTION_DAYS || 90);
export const expiry = (from = new Date()) => new Date(from.getTime() + RETENTION_DAYS * 864e5);

const indexed = new WeakSet<Db>();

/** Collections with their indexes made once per process. */
export async function supportCollections(d: Db) {
  const chats = d.collection<SupportChatDoc>("support_chats");
  const messages = d.collection<SupportMessageDoc>("support_messages");
  const audit = d.collection<SupportAuditDoc>("support_audit");
  if (!indexed.has(d)) {
    indexed.add(d);
    await Promise.all([
      chats.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
      chats.createIndex({ status: 1, lastMessageAt: -1 }),
      chats.createIndex({ ipHash: 1, createdAt: -1 }),
      messages.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
      messages.createIndex({ chatId: 1, seq: 1 }, { unique: true }),
      audit.createIndex({ chatId: 1, at: 1 }),
      audit.createIndex({ bookingId: 1, at: 1 }),
    ]).catch((e) => console.error("support indexes", e));
  }
  return { chats, messages, audit };
}

/** Appends a message with the next seq and bumps the chat's counters and expiry. */
export async function addMessage(d: Db, chat: SupportChatDoc, m: Omit<SupportMessageDoc, "chatId" | "seq" | "at" | "expiresAt"> & { at?: Date }): Promise<SupportMessageDoc> {
  const { chats, messages } = await supportCollections(d);
  const at = m.at ?? new Date();
  const exp = expiry(at);
  const bump: Partial<SupportChatDoc> = { updatedAt: at, lastMessageAt: at, expiresAt: exp };
  if (m.role === "customer") bump.lastCustomerAt = at;
  if (m.role === "assistant" || m.role === "human") bump.lastAgentAt = at;
  const r = await chats.findOneAndUpdate(
    { _id: chat._id },
    { $set: bump, $inc: { messages: 1, unread: m.role === "customer" ? 1 : 0 } },
    { returnDocument: "after" },
  );
  const seq = r?.messages ?? chat.messages + 1;
  const doc: SupportMessageDoc = { chatId: chat._id, seq, at, expiresAt: exp, ...m };
  await messages.insertOne(doc);
  await messages.updateMany({ chatId: chat._id, expiresAt: { $lt: exp } }, { $set: { expiresAt: exp } });
  Object.assign(chat, bump, { messages: seq });
  return doc;
}

export async function audit(d: Db, entry: Omit<SupportAuditDoc, "at">): Promise<void> {
  const { audit } = await supportCollections(d);
  await audit.insertOne({ at: new Date(), ...entry });
}
