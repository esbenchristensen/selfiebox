import "server-only";

import { MongoClient, type Db } from "mongodb";
import { addDays, type DayKey } from "../dates";
import { withDefaults, type Block, type Delivery, type Hold, type Line, type PhotoType, type RentalSettings } from "./core";

// B2C rentals live in MongoDB Atlas next to the admin's data (database "selfiebox"), so admin.selfi.dk
// sees every booking the moment it is made. Collections:
//   rentals          one document per booking (below)
//   rental_settings  one document, _id "settings": prices, inventory and rules, edited in admin
//   rental_blocks    periods where boxes or printers are not for rent (service, B2B use)

export type RentalStatus =
  | "pending" // waiting for payment in Stripe Checkout; holds the dates until expiresAt
  | "paid"
  | "packed"
  | "shipped"
  | "delivered"
  | "returned"
  | "done"
  | "cancelled"
  | "expired" // never paid
  | "refunded";

/** Statuses that no longer hold a box. A pending booking also stops holding once expiresAt has passed. */
export const RELEASED: RentalStatus[] = ["cancelled", "expired", "refunded"];

export type RentalDoc = {
  _id: string; // the booking number, e.g. "SB-271021-K4QX"
  token: string; // secret in the links back from Stripe, so a booking number alone reveals nothing
  status: RentalStatus;
  from: DayKey;
  to: DayKey;
  days: number;
  theme: string | null;
  printer: boolean;
  photoType: PhotoType;
  keep?: boolean; // photos kept for KEEP_MONTHS (add-on)
  delivery: Delivery;
  address: { street: string; zip: string; city: string } | null;
  contact: { name: string; email: string; phone: string; occasion: string; message: string };
  lines: Line[];
  total: number; // kr. inkl. moms
  currency: "dkk";
  stripe: { sessionId?: string; paymentIntent?: string | null; paymentStatus?: string; amountPaid?: number; refunded?: number };
  expiresAt: Date | null;
  conflict?: boolean; // paid while the dates were taken by someone else: admin must sort it out
  history: { at: Date; status: RentalStatus; by: string; note?: string }[];
  createdAt: Date;
  updatedAt: Date;
};

export type BlockDoc = Block & { _id: unknown; note: string };

const g = globalThis as unknown as { __rentalMongo?: Promise<MongoClient> };

export async function db(): Promise<Db> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI mangler");
  g.__rentalMongo ??= new MongoClient(uri, { appName: "selfi-web-udlejning", maxPoolSize: 5 }).connect();
  return (await g.__rentalMongo).db(process.env.MONGODB_DB || "selfiebox");
}

export async function getSettings(d: Db): Promise<RentalSettings> {
  const doc = await d.collection<{ _id: string } & Partial<RentalSettings>>("rental_settings").findOne({ _id: "settings" });
  if (!doc) return withDefaults(null);
  const { _id, ...s } = doc;
  void _id;
  return withDefaults(s);
}

/**
 * Bookings and blocks that touch the days from `from` on. `olderThan` leaves out one booking and everything
 * made after it, so when two customers race for the last box the first one keeps it.
 */
export async function getHolds(d: Db, from: DayKey, olderThan?: { id: string; at: Date }): Promise<{ holds: Hold[]; blocks: Block[] }> {
  const now = new Date();
  const since = addDays(from, -31); // a booking that ended a while ago can still be on its way back to us
  const rentals = await d
    .collection<RentalDoc>("rentals")
    .find(
      {
        status: { $nin: RELEASED },
        to: { $gte: since },
        $or: [{ status: { $ne: "pending" } }, { expiresAt: { $gt: now } }],
        ...(olderThan ? { _id: { $ne: olderThan.id }, createdAt: { $lte: olderThan.at } } : {}),
      },
      { projection: { from: 1, to: 1, delivery: 1, printer: 1 } },
    )
    .toArray();
  const blocks = await d
    .collection<BlockDoc>("rental_blocks")
    .find({ to: { $gte: since } }, { projection: { from: 1, to: 1, boxes: 1, printers: 1 } })
    .toArray();
  return {
    holds: rentals.map((r) => ({ range: { from: r.from, to: r.to }, delivery: r.delivery, printer: r.printer })),
    blocks: blocks.map((b) => ({ from: b.from, to: b.to, boxes: b.boxes ?? 0, printers: b.printers ?? 0 })),
  };
}

/** Today in Denmark, as a day key. The server runs in UTC. */
export function todayDK(): DayKey {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Copenhagen" }).format(new Date());
}
