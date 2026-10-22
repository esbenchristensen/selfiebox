// Test data for the support chat: a handful of bookings and a blocked period in a throwaway database.
// Used by scripts/support-test.mts (the conversation tests) and scripts/support-seed.mts (local development).
// All names, e-mails and numbers are invented.

import type { Db } from "mongodb";

import { DEFAULT_SETTINGS, priceLines, total, type Choice, type RentalSettings } from "../../lib/udlejning/core";
import type { RentalDoc } from "../../lib/udlejning/db";
import { nights } from "../../lib/dates";

export const SETTINGS: RentalSettings = { ...DEFAULT_SETTINGS, inventory: { boxes: 1, printers: 1 } };

type Fixture = {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: RentalDoc["status"];
  from: string;
  to: string;
  theme: string | null;
  printer: boolean;
  photoType: "strip" | "polaroid";
  occasion: string;
  city: string;
  trackingOut?: string;
  flex?: boolean;
  paidAt: string;
};

export const BOOKINGS: Fixture[] = [
  { id: "SB-261001-ANNA", name: "Anna Jensen", email: "anna@example.dk", phone: "22 11 22 11", status: "paid", from: "2026-11-14", to: "2026-11-15", theme: null, printer: true, photoType: "strip", occasion: "Bryllup", city: "Aarhus", paidAt: "2026-10-01" },
  { id: "SB-261002-BO", name: "Bo Madsen", email: "bo@example.dk", phone: "33 44 55 66", status: "delivered", from: "2026-10-23", to: "2026-10-24", theme: null, printer: false, photoType: "strip", occasion: "Fødselsdag", city: "Odense", trackingOut: "00057103150013412345", paidAt: "2026-10-02" },
  { id: "SB-260915-CARL", name: "Carl Nielsen", email: "carl@example.dk", phone: "44 55 66 77", status: "done", from: "2026-10-03", to: "2026-10-04", theme: null, printer: false, photoType: "strip", occasion: "Konfirmation", city: "Aalborg", paidAt: "2026-09-15" },
  { id: "SB-261005-DITTE", name: "Ditte Sørensen", email: "ditte@example.dk", phone: "55 66 77 88", status: "paid", from: "2026-12-11", to: "2026-12-12", theme: null, printer: true, photoType: "polaroid", occasion: "Julefrokost", city: "København", paidAt: "2026-10-05" },
  { id: "SB-261006-DITTE", name: "Ditte Sørensen", email: "ditte@example.dk", phone: "55 66 77 88", status: "paid", from: "2027-05-01", to: "2027-05-01", theme: null, printer: false, photoType: "strip", occasion: "Konfirmation", city: "København", flex: true, paidAt: "2026-10-06" },
];

export const BLOCKS = [{ _id: "service-nov", from: "2026-11-20", to: "2026-11-22", boxes: 1, printers: 1, note: "Service" }];

export function rentalDoc(f: Fixture): RentalDoc & { trackingOut?: string } {
  const choice: Choice = { range: { from: f.from, to: f.to }, theme: f.theme, printer: f.printer, photoType: f.photoType, delivery: "post", flex: f.flex };
  const lines = priceLines(SETTINGS, choice);
  const paid = new Date(`${f.paidAt}T10:00:00Z`);
  const history: RentalDoc["history"] = [{ at: paid, status: "pending", by: "kunde" }, { at: new Date(paid.getTime() + 300_000), status: "paid", by: "stripe", note: "Betalt" }];
  const flow: RentalDoc["status"][] = ["packed", "shipped", "delivered", "returned", "done"];
  for (const s of flow) {
    if (flow.indexOf(f.status) >= flow.indexOf(s)) history.push({ at: new Date(paid.getTime() + (flow.indexOf(s) + 1) * 864e5), status: s, by: "Esben" });
  }
  return {
    _id: f.id,
    token: `tok-${f.id.toLowerCase()}`,
    status: f.status,
    from: f.from,
    to: f.to,
    days: nights(choice.range),
    theme: f.theme,
    printer: f.printer,
    photoType: f.photoType,
    delivery: "post",
    address: { street: "Testvej 1", zip: "8000", city: f.city },
    contact: { name: f.name, email: f.email, phone: f.phone, occasion: f.occasion, message: "" },
    lines,
    total: total(lines),
    currency: "dkk",
    stripe: { sessionId: "cs_test", paymentIntent: "pi_test", paymentStatus: "paid", amountPaid: total(lines) },
    expiresAt: null,
    history,
    createdAt: paid,
    updatedAt: paid,
    ...(f.trackingOut ? { trackingOut: f.trackingOut } : {}),
    ...(f.flex ? { flex: true } : {}),
  };
}

/** Wipes the rentals and the chat collections and writes the fixtures. Only for a test database. */
export async function seed(d: Db): Promise<void> {
  if (!/test|dev/.test(d.databaseName)) throw new Error(`Nægter at seede databasen "${d.databaseName}": navnet skal indeholde test eller dev.`);
  await Promise.all(["rentals", "rental_blocks", "rental_settings", "support_chats", "support_messages", "support_audit"].map((c) => d.collection(c).deleteMany({})));
  await d.collection("rental_settings").insertOne({ _id: "settings", ...SETTINGS } as never);
  await d.collection("rentals").insertMany(BOOKINGS.map(rentalDoc) as never[]);
  await d.collection("rental_blocks").insertMany(BLOCKS as never[]);
}
