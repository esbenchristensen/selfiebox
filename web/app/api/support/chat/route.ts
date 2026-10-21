import { NextResponse } from "next/server";

import { MODEL, runTurn, type TurnEvent } from "@/lib/support/agent";
import { addMessage, supportCollections, type SupportMessageDoc } from "@/lib/support/db";
import { cookieFor, createChat, ipHash, loadChat, publicView } from "@/lib/support/session";
import { db } from "@/lib/udlejning/db";

// The chat widget's one endpoint.
//   GET  ?after=<seq>   the chat's state and the messages after seq (the widget polls this)
//   POST { text, page } a message from the customer; the reply streams back as server-sent events,
//                       or, when a human has taken over, a JSON { human: true } and the human answers later
//   DELETE              forget the cookie, so the next message starts a new conversation
// Verification, data scope and changes are enforced in lib/support/tools.ts, not here and not in the prompt.

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const MAX_TEXT = 1500;
const PER_CHAT_10MIN = 30;
const NEW_CHATS_PER_HOUR = 20;

const SHOWN: SupportMessageDoc["role"][] = ["customer", "assistant", "human", "system"];

function pub(m: SupportMessageDoc) {
  return { seq: m.seq, role: m.role, text: m.text, at: m.at.toISOString(), name: m.name ?? null, sources: m.sources ?? null };
}

export async function GET(req: Request) {
  const d = await db();
  const chat = await loadChat(d, req);
  if (!chat) return NextResponse.json({ chat: null, messages: [] }, { headers: { "cache-control": "no-store" } });
  const after = Number(new URL(req.url).searchParams.get("after") ?? 0) || 0;
  const { messages } = await supportCollections(d);
  const list = await messages.find({ chatId: chat._id, seq: { $gt: after }, role: { $in: SHOWN } }).sort({ seq: 1 }).limit(200).toArray();
  return NextResponse.json({ chat: publicView(chat), messages: list.map(pub) }, { headers: { "cache-control": "no-store" } });
}

export async function DELETE() {
  return new NextResponse(null, { status: 204, headers: { "set-cookie": cookieFor(null) } });
}

export async function POST(req: Request) {
  let body: { text?: unknown; page?: unknown };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Beskeden kunne ikke læses." }, { status: 400 });
  }
  const text = typeof body.text === "string" ? body.text.trim().slice(0, MAX_TEXT) : "";
  const page = typeof body.page === "string" ? body.page : "";
  if (!text) return NextResponse.json({ error: "Skriv en besked." }, { status: 400 });

  let d;
  try {
    d = await db();
  } catch (e) {
    console.error("support db", e);
    return NextResponse.json({ error: "Chatten er ikke åben lige nu. Prøv igen om lidt." }, { status: 503 });
  }
  const { chats, messages } = await supportCollections(d);
  let chat = await loadChat(d, req);
  const headers = new Headers({ "cache-control": "no-store" });
  if (!chat || chat.status === "closed") {
    const recent = await chats.countDocuments({ ipHash: ipHash(req), createdAt: { $gt: new Date(Date.now() - 3600_000) } });
    if (recent >= NEW_CHATS_PER_HOUR) return NextResponse.json({ error: "Der er startet for mange samtaler herfra. Prøv igen om lidt." }, { status: 429 });
    chat = await createChat(d, req, page, MODEL);
    headers.set("set-cookie", cookieFor(chat));
  }
  const burst = await messages.countDocuments({ chatId: chat._id, role: "customer", at: { $gt: new Date(Date.now() - 600_000) } });
  if (burst >= PER_CHAT_10MIN) return NextResponse.json({ error: "Tag en kort pause. Du kan skrive igen om et par minutter." }, { status: 429, headers });

  if (!chat.summary) await chats.updateOne({ _id: chat._id }, { $set: { summary: text.slice(0, 120) } });
  const saved = await addMessage(d, chat, { role: "customer", text });

  if (chat.status === "human") {
    // A colleague has the chat: the message is saved for them, the assistant stays quiet.
    headers.set("content-type", "application/json");
    return new NextResponse(JSON.stringify({ human: true, chat: publicView(chat) }), { headers });
  }

  const encoder = new TextEncoder();
  const chatRef = chat;
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (e: TurnEvent | { type: "state"; chat: ReturnType<typeof publicView> } | { type: "accepted"; seq: number }) => controller.enqueue(encoder.encode(`event: ${e.type}\ndata: ${JSON.stringify(e)}\n\n`));
      try {
        send({ type: "accepted", seq: saved.seq });
        await runTurn(d, chatRef, send);
        const fresh = await chats.findOne({ _id: chatRef._id });
        if (fresh) send({ type: "state", chat: publicView(fresh) });
      } catch (e) {
        console.error("support stream", e);
        send({ type: "error", text: "Noget gik galt. Prøv igen." });
      } finally {
        controller.close();
      }
    },
  });
  headers.set("content-type", "text/event-stream; charset=utf-8");
  headers.set("x-accel-buffering", "no");
  headers.set("connection", "keep-alive");
  return new NextResponse(stream, { headers });
}
