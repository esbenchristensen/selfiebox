// Checks the support chat's verification and lead tools directly, without the model: order number against the
// contact details, SMS codes (wrong, right, wait, limits per chat and per number), a number without bookings,
// the design request from the chat, and the contact form's lead.
//
//   MONGODB_URI=mongodb://127.0.0.1:27017 MONGODB_DB=selfiebox_support_test node --conditions=react-server --import tsx scripts/support-tools-check.mts
//
// Runs against a throwaway database (the name must contain "test" or "dev"). No SMS or mail is sent: the SMS
// senders are stubs, and without RESEND_API_KEY and Twilio nothing leaves the machine.

import assert from "node:assert/strict";
import { MongoClient } from "mongodb";

import { saveContactRequest } from "../lib/erhverv/leads";
import { createChat } from "../lib/support/session";
import { runTool, type ToolContext } from "../lib/support/tools";
import { getSettings, todayDK } from "../lib/udlejning/db";
import { seed } from "../support/tests/fixtures";

const client = await new MongoClient(process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017").connect();
const d = client.db(process.env.MONGODB_DB ?? "selfiebox_support_test");
if (!/test|dev/.test(d.databaseName)) throw new Error(`Databasen skal hedde noget med "test" eller "dev", ikke ${d.databaseName}`);
await seed(d);
await Promise.all(["support_sms_codes", "leads", "contact_requests"].map((c) => d.collection(c).deleteMany({})));

const req = () => new Request("http://localhost/", { headers: { "x-forwarded-for": "10.0.0.9" } });
const sent: { to: string; text: string }[] = [];
let now = new Date();

async function chatAs(name: string, email: string, phone: string): Promise<ToolContext> {
  const chat = await createChat(d, req(), "/", "test", { name, email, phone });
  return {
    d,
    chat,
    settings: await getSettings(d),
    today: todayDK(),
    get now() {
      return now;
    },
    sms: async () => true,
    codeSms: async (to, text) => (sent.push({ to, text }), true),
    later: () => undefined,
    adminUrl: "https://admin.test",
    setupUrl: "https://foto.test/opsaet",
  } as ToolContext;
}
const call = (ctx: ToolContext, name: string, args: unknown = {}) => runTool(ctx, name, JSON.stringify(args));
const lastCode = () => sent.at(-1)!.text.match(/\d{6}/)![0];
const ids = (r: Record<string, unknown>) => ((r.bookings as { bookingNo: string }[] | undefined) ?? []).map((b) => b.bookingNo);
const later = (ms: number) => (now = new Date(now.getTime() + ms));

let n = 0;
const ok = (what: string) => console.log(`  ✓ ${++n}. ${what}`);

let ctx = await chatAs("Anna", "ANNA@example.dk", "99 99 99 99");
let r = await call(ctx, "verify_customer", { bookingNo: "sb-261001-anna" });
assert.equal(r.ok, true);
assert.deepEqual(ids(r), ["SB-261001-ANNA"]);
ok("ordrenummer + oplyst e-mail åbner kun egne bookinger");

ctx = await chatAs("Anna", "andet@example.dk", "+45 22 11 22 11");
r = await call(ctx, "verify_customer", { bookingNo: "SB-261001-ANNA" });
assert.equal(r.ok, true);
ok("ordrenummer + oplyst telefon virker også");

ctx = await chatAs("Lars", "lars@example.org", "30303030");
r = await call(ctx, "verify_customer", { bookingNo: "SB-261001-ANNA" });
assert.equal(r.ok, false);
assert.equal(ctx.chat.customer, null);
ok("andres ordrenummer giver intet");

ctx = await chatAs("Anna", "nope@example.org", "22112211");
r = await call(ctx, "send_sms_code");
assert.equal(r.ok, true);
assert.equal(sent.at(-1)!.to, "+4522112211");
assert.equal((await call(ctx, "send_sms_code")).ok, false);
ok("kode sendes til det oplyste nummer, og ikke igen inden for et minut");

assert.equal((await call(ctx, "verify_sms_code", { code: "000000" })).ok, false);
r = await call(ctx, "verify_sms_code", { code: lastCode() });
assert.equal(r.ok, true);
assert.deepEqual(ids(r), ["SB-261001-ANNA"]);
assert.deepEqual(ids(await call(ctx, "get_bookings")), ["SB-261001-ANNA"]);
ok("forkert kode afvises, rigtig kode åbner bookingerne på nummeret");

ctx = await chatAs("Lars", "lars@example.org", "30303030");
await call(ctx, "send_sms_code");
r = await call(ctx, "verify_sms_code", { code: ` ${lastCode().slice(0, 3)} ${lastCode().slice(3)} ` });
assert.equal(r.ok, true);
assert.deepEqual(ids(r), []);
ok("et nummer uden bookinger bekræftes, men viser intet");

// Two more codes to Anna's number from new chats, then the number is full for the hour.
for (let i = 0; i < 2; i++) {
  later(61_000);
  assert.equal((await call(await chatAs("X", "x@example.org", "22112211"), "send_sms_code")).ok, true);
}
later(61_000);
r = await call(await chatAs("X", "x@example.org", "22112211"), "send_sms_code");
assert.equal(r.ok, false);
ok("højst 3 koder i timen til samme nummer på tværs af chats");
later(3600_000);
assert.equal((await call(await chatAs("X", "x@example.org", "22112211"), "send_sms_code")).ok, true);
ok("efter en time kan der sendes igen");

ctx = await chatAs("Mads Holm", "mads@bodegahjoernet.dk", "40404040");
r = await call(ctx, "register_business_lead", { company: "Bodega Hjørnet", website: "bodegahjoernet.dk", industry: "Bar", locations: null, message: null });
assert.equal(r.ok, true);
const lead = await d.collection("leads").findOne({ "inbound.contact.email": "mads@bodegahjoernet.dk" });
assert.ok(lead);
assert.equal((lead.draft as { status: string }).status, "open");
ok("designudkast fra chatten lander på leadlisten med frist");

const id = await saveContactRequest(d, { type: "erhverv", topic: "erhverv", name: "Mette", email: "mette@barhjornet.dk", phone: "22 33 44 55", place: "Bar Hjørnet, Aarhus", message: "Ring gerne" }, "ip-test", now);
const meeting = await d.collection("leads").findOne({ _id: id as never });
assert.ok(meeting);
assert.equal((meeting.requests as unknown[]).length, 1);
ok("\"Book en snak\" lander på leadlisten");

console.log(`\n${n} tjek bestået`);
await client.close();
