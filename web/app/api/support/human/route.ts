import { NextResponse } from "next/server";

import { MODEL } from "@/lib/support/agent";
import { addMessage, supportCollections } from "@/lib/support/db";
import { cookieFor, createChat, loadChat, parseContact, publicView } from "@/lib/support/session";
import { sendSupportSms } from "@/lib/support/sms";
import { escalateByCustomer } from "@/lib/support/tools";
import { db, getSettings, todayDK } from "@/lib/udlejning/db";

// "Tal med et menneske" in the widget: escalates without asking the assistant first.

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const d = await db();
  let chat = await loadChat(d, req);
  const headers = new Headers({ "cache-control": "no-store" });
  if (!chat || chat.status === "closed") {
    // The widget asks for name, e-mail and phone before anything else, also before "Tal med et menneske".
    const body = (await req.json().catch(() => ({}))) as { contact?: unknown };
    const given = parseContact(body.contact);
    if (!given.ok) return NextResponse.json({ error: given.error, needContact: true }, { status: 400 });
    chat = await createChat(d, req, "", MODEL, given.contact);
    headers.set("set-cookie", cookieFor(chat));
  }
  if (chat.status === "open") {
    const now = new Date();
    const result = await escalateByCustomer({ d, chat, settings: await getSettings(d), today: todayDK(), now, sms: sendSupportSms, adminUrl: (process.env.ADMIN_URL || "https://admin.selfi.dk").replace(/\/$/, ""), setupUrl: process.env.SELFI_SETUP_URL ?? "https://foto.selfi.dk/opsaet" });
    await addMessage(d, chat, { role: "assistant", name: "Sif", text: `Selvfølgelig. Jeg har givet Esben besked, og han skriver til dig her i chatten ${result.replyBy as string}. Du kan lade siden være åben, eller kigge forbi igen senere, så ligger svaret her.` });
  }
  const { chats } = await supportCollections(d);
  const fresh = (await chats.findOne({ _id: chat._id })) ?? chat;
  return NextResponse.json({ chat: publicView(fresh) }, { headers });
}
