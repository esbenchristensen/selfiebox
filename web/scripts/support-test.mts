// Runs the support chat's conversation tests (support/tests/cases.ts) against the real assistant and a
// throwaway database, and writes a report to support/tests/last-run.md.
//
//   node --conditions=react-server --import tsx --env-file=.env.local --env-file=.env.test scripts/support-test.mts [--only navn] [--no-judge]
//
// .env.test points MONGODB_DB at a test database (the name must contain "test"); OPENAI_API_KEY comes from
// .env.local. SMS is never sent: the sender is a stub that records the text. The judge is a small model
// (gpt-6.1-sol, low reasoning) scoring each turn against the case's criterion; --no-judge skips it.

import { writeFileSync } from "node:fs";
import { MongoClient } from "mongodb";
import OpenAI from "openai";

import { MODEL, runTurn, type TurnEvent } from "../lib/support/agent";
import { addMessage, supportCollections, type SupportChatDoc, type SupportMessageDoc } from "../lib/support/db";
import { createChat } from "../lib/support/session";
import { CASES, type Case, type Turn } from "../support/tests/cases";
import { BOOKINGS, seed } from "../support/tests/fixtures";

const args = process.argv.slice(2);
const only = args.includes("--only") ? args[args.indexOf("--only") + 1] : null;
const useJudge = !args.includes("--no-judge");
const JUDGE_MODEL = process.env.SUPPORT_JUDGE_MODEL || "gpt-6.1-sol";

const client = await new MongoClient(process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017").connect();
const d = client.db(process.env.MONGODB_DB ?? "selfiebox_support_test");
if (!/test/.test(d.databaseName)) throw new Error(`Testdatabasen skal hedde noget med "test", ikke ${d.databaseName}`);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

type TurnResult = { say: string; reply: string; tools: string[]; failures: string[]; judge?: { pass: boolean; reason: string }; ms: number };
type CaseResult = { name: string; turns: TurnResult[]; pass: boolean };

const fakeReq = () => new Request("http://localhost/", { headers: { "x-forwarded-for": "10.0.0.1" } });

async function verifyAs(chat: SupportChatDoc, email: string): Promise<void> {
  const mine = BOOKINGS.filter((b) => b.email === email);
  const customer = { email, name: mine[0].name, bookings: mine.map((b) => b.id), verifiedAt: new Date() };
  const { chats } = await supportCollections(d);
  await chats.updateOne({ _id: chat._id }, { $set: { customer } });
  chat.customer = customer;
}

async function judge(transcript: string, criterion: string): Promise<{ pass: boolean; reason: string }> {
  const res = await openai.responses.create({
    model: JUDGE_MODEL,
    reasoning: { effort: "low" },
    store: false,
    instructions:
      "Du bedømmer det SIDSTE svar fra supportassistenten Sif i en dansk kundesamtale. Vurdér kun mod kriteriet. Vær streng på fakta og tone, men kræv ikke bestemte ord, når meningen er den samme. Svartidspunkter for Esben (fx 'inden kl. 11 i morgen') beregnes af systemet ud fra åbningstiden (alle dage 10–22) og er altid korrekte. Svar som JSON.",
    input: `Tidspunkt nu: ${new Date().toLocaleString("da-DK", { timeZone: "Europe/Copenhagen" })}\nKriterium: ${criterion}\n\nSamtale:\n${transcript}`,
    text: {
      format: {
        type: "json_schema",
        name: "verdict",
        strict: true,
        schema: { type: "object", properties: { pass: { type: "boolean" }, reason: { type: "string" } }, required: ["pass", "reason"], additionalProperties: false },
      },
    },
  });
  try {
    return JSON.parse(res.output_text) as { pass: boolean; reason: string };
  } catch {
    return { pass: false, reason: `Dommeren svarede uforståeligt: ${res.output_text.slice(0, 100)}` };
  }
}

async function runCase(c: Case): Promise<CaseResult> {
  await seed(d);
  const chat = await createChat(d, fakeReq(), "/", MODEL);
  if (c.verified) await verifyAs(chat, c.verified);
  const { messages } = await supportCollections(d);
  const sms: string[] = [];
  const results: TurnResult[] = [];
  const transcript: string[] = [];
  for (const t of c.turns) {
    const before = chat.messages;
    await addMessage(d, chat, { role: "customer", text: t.say });
    let reply = "";
    const t0 = Date.now();
    await runTurn(d, chat, (e: TurnEvent) => {
      if (e.type === "done") reply = e.text;
    }, { sms: async (text) => (sms.push(text), true), client: openai });
    const ms = Date.now() - t0;
    const toolMsgs = await messages.find({ chatId: chat._id, role: "tool", seq: { $gt: before } }).toArray();
    const tools = toolMsgs.map((m: SupportMessageDoc) => m.tool?.name ?? "?");
    transcript.push(`Kunde: ${t.say}`, `Sif: ${reply}`);
    const failures = checkTurn(t, reply, tools);
    if (t.db) {
      const err = await t.db(d, chat);
      if (err) failures.push(`db: ${err}`);
    }
    const r: TurnResult = { say: t.say, reply, tools, failures, ms };
    if (t.judge && useJudge) {
      r.judge = await judge(transcript.join("\n"), t.judge);
      if (!r.judge.pass) failures.push(`dommer: ${r.judge.reason}`);
    }
    results.push(r);
  }
  return { name: c.name, turns: results, pass: results.every((r) => r.failures.length === 0) };
}

function checkTurn(t: Turn, reply: string, tools: string[]): string[] {
  const f: string[] = [];
  for (const name of t.tools ?? []) if (!tools.includes(name)) f.push(`forventede værktøj ${name}, fik [${tools.join(", ") || "ingen"}]`);
  for (const name of t.noTools ?? []) if (tools.includes(name)) f.push(`værktøj ${name} måtte ikke kaldes`);
  for (const re of t.must ?? []) if (!re.test(reply)) f.push(`svaret mangler ${re}`);
  for (const re of t.mustNot ?? []) if (re.test(reply)) f.push(`svaret må ikke matche ${re}`);
  return f;
}

const cases = only ? CASES.filter((c) => c.name.includes(only)) : CASES;
console.log(`Model ${MODEL}, ${cases.length} samtaler, dommer: ${useJudge ? JUDGE_MODEL : "fra"}\n`);
const all: CaseResult[] = [];
for (const c of cases) {
  process.stdout.write(`${c.name.padEnd(30)} `);
  try {
    const r = await runCase(c);
    all.push(r);
    console.log(r.pass ? "OK" : `FEJL\n    ${r.turns.flatMap((t) => t.failures).join("\n    ")}`);
  } catch (e) {
    all.push({ name: c.name, turns: [], pass: false });
    console.log(`FEJL (${(e as Error).message})`);
  }
}
const passed = all.filter((r) => r.pass).length;
console.log(`\n${passed} af ${all.length} bestået`);

const lines = [`# Supportchat: testkørsel`, ``, `${new Date().toISOString()} · model ${MODEL} · dommer ${useJudge ? JUDGE_MODEL : "fra"} · **${passed} af ${all.length} bestået**`, ``];
for (const r of all) {
  lines.push(`## ${r.pass ? "✅" : "❌"} ${r.name}`, ``);
  for (const t of r.turns) {
    lines.push(`**Kunde:** ${t.say}`, ``, `**Sif** (${(t.ms / 1000).toFixed(1)} s${t.tools.length ? `, værktøjer: ${t.tools.join(", ")}` : ""}): ${t.reply.replace(/\n/g, "  \n")}`, ``);
    if (t.judge) lines.push(`_Dommer: ${t.judge.pass ? "ok" : "ikke ok"}. ${t.judge.reason}_`, ``);
    for (const f of t.failures) lines.push(`- ⚠️ ${f}`);
    if (t.failures.length) lines.push(``);
  }
}
writeFileSync(new URL("../support/tests/last-run.md", import.meta.url), lines.join("\n"));
await client.close();
process.exit(passed === all.length ? 0 : 1);
