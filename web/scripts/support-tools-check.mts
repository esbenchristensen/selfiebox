// Checks the support chat's verification and design tools directly, without the model: order number against
// the contact details, SMS codes (wrong, right, expired, limits), what opens, and the design request.
//
//   MONGODB_DB=selfiebox_support_test node --conditions=react-server --import tsx --env-file=.env.local scripts/support-tools-check.mts
//
// Runs against a throwaway database (the name must contain "test" or "dev"). No SMS is sent: stubs record them.

import assert from "node:assert/strict";
import { MongoClient } from "mongodb";

import { supportCollections, type SupportChatDoc } from "../lib/support/db";
import { createChat } from "../lib/support/session";
import { runTool, type ToolContext } from "../lib/support/tools";
import { normalizePhone, parseContact } from "../lib/support/verify";
import { getSettings, todayDK } from "../lib/udlejning/db";
import { seed } from "../support/tests/fixtures";

const client = await new MongoClient(process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017").connect();
const d = client.db(process.env.MONGODB_DB ?? "selfiebox_support_test");
if (!/test|dev/.test(d.databaseName)) throw new Error(`Databasen skal hedde noget med "test" eller "dev", ikke ${d.databaseName}`);
await seed(d);
await d.collection("support_sms_codes").deleteMany({});

const req = () => new Request("http://localhost/", { headers: { "x-forwarded-for": "10.0.0.9" } });
const sent: { to: string; text: string }[] = [];
const toEsben: string[] = [];
let now = new Date();

async function chatAs(name: string, email: string, phone: string, page = "/"): Promise<ToolContext> {
  const chat = await createChat(d, req(), page, "test", { name, email, phone: normalizePhone(phone)!, at: now });
  return {
    d,
    chat,
    settings: await getSettings(d),
    today: todayDK(),
    get now() {
      return now;
    },
    sms: async (t) => (toEsben.push(t), true),
    smsTo: async (to, text) => (sent.push({ to, text }), true),
    adminUrl: "https://admin.test",
    setupUrl: "https://foto.test/opsaet",
  } as ToolContext;
}
const call = (ctx: ToolContext, name: string, args: unknown = {}) => runTool(ctx, name, JSON.stringify(args));
const lastCode = () => sent.at(-1)!.text.match(/\d{6}/)![0];
const fresh = async (ctx: ToolContext) => (await (await supportCollections(d)).chats.findOne({ _id: ctx.chat._id })) as SupportChatDoc;

let n = 0;
const ok = (what: string) => console.log(`  ✓ ${++n}. ${what}`);

// Contact details
assert.equal(normalizePhone("22 11 22 11"), "+4522112211");
assert.equal(normalizePhone("0045 22112211"), "+4522112211");
assert.equal(normalizePhone("+46 70 123 45 67"), "+46701234567");
assert.equal(normalizePhone("123"), null);
assert.equal(parseContact({ name: "A", email: "a@b.dk", phone: "22112211" }).ok, false);
assert.equal(parseContact({ name: "Anna", email: "a@b", phone: "22112211" }).ok, false);
ok("telefonnumre og kontaktoplysninger renses og tjekkes");

// 1. Order number with matching e-mail
{
  const ctx = await chatAs("Anna", "ANNA@example.dk", "99 99 99 99");
  const r = await call(ctx, "verify_order", { bookingNo: "sb-261001-anna" });
  assert.equal(r.ok, true);
  assert.deepEqual(ctx.chat.customer?.bookings, ["SB-261001-ANNA"]);
  ok("ordrenummer + samme e-mail åbner kundens ordre");
}
// 2. Order number with matching phone only (typed differently than on the booking)
{
  const ctx = await chatAs("Anna J", "anden@mail.dk", "+45 22112211");
  const r = await call(ctx, "verify_order", { bookingNo: "SB-261001-ANNA" });
  assert.equal(r.ok, true);
  assert.equal(ctx.chat.customer?.keys?.phone, "+4522112211");
  ok("ordrenummer + samme telefon (andet format) åbner ordren");
}
// 3. Someone else's order number
{
  const ctx = await chatAs("Lars", "lars@holm.dk", "20304050");
  const r = await call(ctx, "verify_order", { bookingNo: "SB-261001-ANNA" });
  assert.equal(r.ok, false);
  assert.equal(JSON.stringify(r).includes("Anna"), false);
  assert.equal(ctx.chat.customer, null);
  const g = await call(ctx, "get_bookings");
  assert.equal(g.ok, false);
  ok("andres ordrenummer afvises uden at lække noget, og get_bookings er lukket");
  for (let i = 0; i < 4; i++) await call(ctx, "verify_order", { bookingNo: `SB-000000-X${i}` });
  assert.ok((await fresh(ctx)).verifyLockedAt);
  assert.equal((await call(ctx, "send_sms_code")).locked, true);
  ok("5 forkerte forsøg låser chatten, også for SMS-koder");
}
// 4. SMS code: wrong, then right
{
  const ctx = await chatAs("Ditte", "ditte.ny@mail.dk", "55667788");
  const s = await call(ctx, "send_sms_code");
  assert.equal(s.ok, true);
  assert.equal(sent.at(-1)!.to, "+4555667788");
  assert.equal(JSON.stringify(s).includes(lastCode()), false, "koden må aldrig stå i værktøjssvaret");
  assert.equal(JSON.stringify(await fresh(ctx)).includes(lastCode()), false, "koden gemmes kun som hash");
  const bad = await call(ctx, "verify_sms_code", { code: "000000" === lastCode() ? "111111" : "000000" });
  assert.equal(bad.ok, false);
  assert.equal(ctx.chat.customer, null);
  const good = await call(ctx, "verify_sms_code", { code: lastCode().replace(/(\d{3})/, "$1 ") });
  assert.equal(good.ok, true);
  assert.deepEqual(ctx.chat.customer?.bookings, ["SB-261005-DITTE", "SB-261006-DITTE"]);
  assert.equal(ctx.chat.customer?.via, "sms");
  ok("SMS-kode: forkert afvises, rigtig åbner bookingerne på telefonnummeret, koden gemmes kun som hash");
}
// 5. Expiry and resend limits
{
  const ctx = await chatAs("Bo", "bo@example.dk", "33445566");
  await call(ctx, "send_sms_code");
  assert.equal((await call(ctx, "send_sms_code")).reason, "wait");
  now = new Date(now.getTime() + 11 * 60_000);
  assert.equal((await call(ctx, "verify_sms_code", { code: lastCode() })).reason, "expired");
  await call(ctx, "send_sms_code");
  now = new Date(now.getTime() + 2 * 60_000);
  await call(ctx, "send_sms_code");
  now = new Date(now.getTime() + 2 * 60_000);
  assert.equal((await call(ctx, "send_sms_code")).reason, "too_many");
  ok("koder udløber efter 10 min, 1 min mellem koder, højst 3 pr. chat");
  const other = await chatAs("Bo", "bo@example.dk", "33445566");
  assert.equal((await call(other, "send_sms_code")).reason, "too_many");
  ok("højst 3 koder pr. telefonnummer i timen, også på tværs af chats");
}
// 6. Five wrong guesses kill the code
{
  const ctx = await chatAs("Carl", "carl@example.dk", "44556677");
  await call(ctx, "send_sms_code");
  const right = lastCode();
  const wrong = right === "123456" ? "654321" : "123456";
  for (let i = 0; i < 5; i++) await call(ctx, "verify_sms_code", { code: wrong });
  assert.equal((await call(ctx, "verify_sms_code", { code: right })).ok, false);
  assert.equal(ctx.chat.customer, null);
  ok("efter 5 forkerte gæt virker den rigtige kode ikke længere, og chatten er låst");
}
// 7. Design request from the chat
{
  const ctx = await chatAs("Mette", "mette@bodega.dk", "20304050", "/erhverv");
  const miss = await call(ctx, "request_design", { company: "Bodega Hjørnet", website: "", placeType: "Bar eller bodega", city: null, notes: "" });
  assert.equal(miss.ok, false);
  const r = await call(ctx, "request_design", { company: "Bodega Hjørnet", website: "bodegahjoernet.dk", placeType: "Bar eller bodega", city: "Aalborg", notes: "Stamgæster, quiz om tirsdagen" });
  assert.equal(r.ok, true);
  assert.equal((await call(ctx, "request_design", { company: "Bodega Hjørnet", website: "bodegahjoernet.dk", placeType: "Bar eller bodega", city: null, notes: "" })).already, true);
  const lead = await d.collection("leads").findOne({ _id: "bodega-hjornet" as never });
  assert.equal(lead?.status, "new");
  assert.match(toEsben.at(-1)!, /Designudkast via chat: Bodega Hjørnet/);
  ok("request_design gemmer henvendelsen, lægger stedet på leadlisten og sender SMS til Esben, én gang");
}

console.log(`\n${n} tjek bestået`);
await client.close();
