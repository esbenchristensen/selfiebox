import { NextResponse } from "next/server";

import { addMessage, supportCollections } from "@/lib/support/db";
import { loadChat, publicView } from "@/lib/support/session";
import { sendSupportSms } from "@/lib/support/sms";
import { escalateByCustomer } from "@/lib/support/tools";
import { db, getSettings, todayDK } from "@/lib/udlejning/db";

// "Tal med et menneske" in the widget: escalates without asking the assistant first.

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const d = await db();
  const chat = await loadChat(d, req);
  const headers = new Headers({ "cache-control": "no-store" });
  if (!chat || chat.status === "closed" || !chat.contact) {
    return NextResponse.json({ error: "Skriv dit navn, din e-mail og dit telefonnummer først.", needContact: true }, { status: 409 });
  }
  if (chat.status === "open") {
    const now = new Date();
    const result = await escalateByCustomer({ d, chat, settings: await getSettings(d), today: todayDK(), now, sms: sendSupportSms, adminUrl: (process.env.ADMIN_URL || "https://admin.selfi.dk").replace(/\/$/, ""), setupUrl: process.env.SELFI_SETUP_URL ?? "https://foto.selfi.dk/opsaet" });
    await addMessage(d, chat, { role: "assistant", name: "Sif", text: `Selvfølgelig. Jeg har givet en kollega besked, som skriver til dig her i chatten ${result.replyBy as string}. Du kan lade siden være åben, eller kigge forbi igen senere, så ligger svaret her.` });
  }
  const { chats } = await supportCollections(d);
  const fresh = (await chats.findOne({ _id: chat._id })) ?? chat;
  return NextResponse.json({ chat: publicView(fresh) }, { headers });
}
