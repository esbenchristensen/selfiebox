// Tests af priser, ledighed og mails til B2C-udlejningen. Kør: npm test
import assert from "node:assert/strict";
import { test } from "node:test";
import {
  boxQuote, chargeLines, DEFAULT_SETTINGS, fits, priceLines, problem, total, usage, withDefaults, type Choice, type RentalSettings,
} from "../lib/udlejning/core";
import { buildMail, deleteDay, KINDS, returnBy, type MailKind } from "../lib/mail/templates";

const noCampaign: RentalSettings = { ...DEFAULT_SETTINGS, campaign: null };
const choice = (from: string, to: string, extra: Partial<Choice> = {}): Choice => ({
  range: { from, to }, theme: null, printer: false, photoType: "strip", delivery: "post", keep: false, ...extra,
} as Choice);

test("weekend fredag-lørdag koster weekendprisen", () => {
  const q = boxQuote(noCampaign, { from: "2027-06-11", to: "2027-06-12" });
  assert.equal(q.period, "weekend");
  assert.equal(q.amount, 1195);
});

test("én hverdag koster dagsprisen", () => {
  assert.equal(boxQuote(noCampaign, { from: "2027-06-09", to: "2027-06-09" }).amount, 895);
});

test("fem dage koster aldrig mere end en uge", () => {
  const q = boxQuote(noCampaign, { from: "2027-06-07", to: "2027-06-11" });
  assert.ok(q.amount <= noCampaign.prices.periods.week);
});

test("lanceringsrabatten på 20 % gælder fester i 2027, ikke i 2026", () => {
  const s = DEFAULT_SETTINGS;
  const in27 = priceLines(s, choice("2027-06-11", "2027-06-12", { printer: true }));
  const camp = in27.find((l) => l.id === "campaign");
  assert.ok(camp, "rabatlinje mangler");
  assert.equal(camp!.amount, -Math.round(1195 * 0.2) - Math.round(895 * 0.2));
  const in26 = priceLines(s, choice("2026-12-11", "2026-12-12"));
  assert.equal(in26.find((l) => l.id === "campaign"), undefined);
});

test("Stripe-linjerne er aldrig negative og giver samme total", () => {
  const lines = priceLines(DEFAULT_SETTINGS, choice("2027-06-11", "2027-06-12", { printer: true, keep: true }));
  const charge = chargeLines(lines);
  assert.ok(charge.every((l) => l.amount >= 0));
  assert.equal(total(charge), total(lines));
});

test("tema kommer ikke med, når der ikke er valgt et", () => {
  assert.equal(priceLines(noCampaign, choice("2027-06-11", "2027-06-12")).some((l) => l.id === "theme"), false);
});

test("en boks er optaget inkl. forsendelse og klargøring", () => {
  const s = noCampaign;
  const u = usage(s, [{ range: { from: "2027-06-11", to: "2027-06-12" }, delivery: "post", printer: false }], []);
  assert.equal(fits(s, u, { from: "2027-06-11", to: "2027-06-12" }, "post", false), false);
  // Retur 3 dage + klargøring 1 dag efter den 12., og afsendelse 2 dage før: den 18. er boksen fri igen
  assert.equal(fits(s, u, { from: "2027-06-19", to: "2027-06-19" }, "post", false), true);
});

test("for tæt på i dag giver en forklaring", () => {
  assert.match(problem(noCampaign, {}, choice("2027-06-02", "2027-06-02"), "2027-06-01") ?? "", /for tæt på/);
  assert.equal(problem(noCampaign, {}, choice("2027-06-11", "2027-06-12"), "2027-06-01"), null);
});

test("indstillinger uden felter falder tilbage til standard", () => {
  const s = withDefaults({ inventory: { boxes: 3 } } as Partial<RentalSettings>);
  assert.equal(s.inventory.boxes, 3);
  assert.equal(s.inventory.printers, DEFAULT_SETTINGS.inventory.printers);
  assert.equal(s.prices.periods.weekend, 1195);
});

test("returdagen er første hverdag efter sidste lejedag", () => {
  assert.equal(returnBy("2027-06-12"), "2027-06-14"); // lørdag → mandag
  assert.equal(returnBy("2027-06-09"), "2027-06-10"); // onsdag → torsdag
});

test("billederne slettes 3 eller 12 måneder efter festen", () => {
  assert.equal(deleteDay({ to: "2027-06-12" }), "2027-09-12");
  assert.equal(deleteDay({ to: "2027-06-12", keep: true }), "2028-06-12");
});

test("alle mails kan bygges, med og uden fotoportal, og linker aldrig til forsiden som portal", () => {
  const booking = {
    _id: "SB-1", token: "t".repeat(24), status: "paid", from: "2027-06-11", to: "2027-06-12", days: 2, printer: true, photoType: "strip" as const,
    address: { street: "Vej 1", zip: "9900", city: "Frederikshavn" }, contact: { name: "Ida Hansen", email: "ida@example.dk", phone: "12345678" },
    lines: [{ id: "box", label: "Leje", amount: 1195 }], total: 1195, trackingOut: "123",
  };
  for (const kind of Object.keys(KINDS) as MailKind[]) {
    for (const party of [null, { slug: "ida-abcdefgh" }]) {
      const m = buildMail(kind, { booking: { ...booking, party }, shipDaysBefore: 2, site: "https://www.selfi.dk", portal: "https://foto.selfi.dk", deleteOn: "2027-09-12", pay: { url: "https://checkout.stripe.com/x", amount: 500, reason: "Ridse i skærmen" } });
      assert.ok(m.subject && !/\{\w+\}/.test(m.subject + m.heading), `${kind}: tom eller ufyldt tekst`);
      const buttons = m.blocks.filter((b) => b.type === "button") as { href: string }[];
      assert.ok(buttons.every((b) => b.href !== "https://www.selfi.dk/"), `${kind}: knap til forsiden`);
    }
  }
});
