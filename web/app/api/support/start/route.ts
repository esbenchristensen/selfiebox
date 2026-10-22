import { NextResponse } from "next/server";

import { MODEL } from "@/lib/support/agent";
import { audit, supportCollections } from "@/lib/support/db";
import { cookieFor, createChat, ipHash, loadChat, publicView } from "@/lib/support/session";
import { parseContact } from "@/lib/support/verify";
import { db } from "@/lib/udlejning/db";

// The widget's first step: name, e-mail and phone before anyone can write. POST { name, email, phone, page }.
// Starts a chat with the details, or adds them to the open chat in the cookie (a chat from before this step).
// The details unlock nothing: orders open only through lib/support/verify.ts.

export const dynamic = "force-dynamic";

const NEW_CHATS_PER_HOUR = 20;

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Oplysningerne kunne ikke læses." }, { status: 400 });
  }
  const parsed = parseContact(body);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const page = typeof body.page === "string" ? body.page : "";

  let d;
  try {
    d = await db();
  } catch (e) {
    console.error("support db", e);
    return NextResponse.json({ error: "Chatten er ikke åben lige nu. Prøv igen om lidt." }, { status: 503 });
  }
  const { chats } = await supportCollections(d);
  const headers = new Headers({ "cache-control": "no-store" });
  const contact = { ...parsed.contact, at: new Date() };
  let chat = await loadChat(d, req);
  if (chat && chat.status !== "closed" && !chat.contact) {
    await chats.updateOne({ _id: chat._id }, { $set: { contact, updatedAt: contact.at } });
    chat.contact = contact;
  } else {
    const recent = await chats.countDocuments({ ipHash: ipHash(req), createdAt: { $gt: new Date(Date.now() - 3600_000) } });
    if (recent >= NEW_CHATS_PER_HOUR) return NextResponse.json({ error: "Der er startet for mange samtaler herfra. Prøv igen om lidt." }, { status: 429 });
    chat = await createChat(d, req, page, MODEL, contact);
    headers.set("set-cookie", cookieFor(chat));
  }
  await audit(d, { chatId: chat._id, actor: "customer", actorName: contact.name, action: "contact", bookingId: null, note: "Navn, e-mail og telefon oplyst i chatten (ikke verificeret)" });
  return NextResponse.json({ chat: publicView(chat) }, { headers });
}
