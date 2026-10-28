import { NextResponse } from "next/server";
import { addDays } from "@/lib/dates";
import { returnBy, shipDay } from "@/lib/mail/templates";
import { db, getSettings, todayDK, type RentalDoc, type RentalStatus } from "@/lib/udlejning/db";
import { autoMail } from "@/lib/udlejning/mails";

// selfi.dk/api/cron/mails: Vercel runs this every morning (web/vercel.json). It sends the mails that are due
// on a given day: the setup reminder, "i morgen er det fest", the thank-you with the photo portal and the
// return reminder. Each mail has a key per booking, so running it twice, or catching up a missed day, never
// sends one twice. With CRON_SECRET set in Vercel, only Vercel's own call gets through.

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const ACTIVE: RentalStatus[] = ["paid", "packed", "shipped", "delivered"];
const OUT: RentalStatus[] = ["shipped", "delivered"];

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.get("authorization") !== `Bearer ${secret}`) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const d = await db();
  const settings = await getSettings(d);
  const today = todayDK();
  const yesterday = addDays(today, -1);
  const due = (day: string) => day === today || day === yesterday; // yesterday too, in case a run was missed
  const ship = settings.rules.shipDaysBefore;

  // Everything that can still get a mail: from a week before shipping until a few days after the return.
  const bookings = await d
    .collection<RentalDoc & { party?: { answers?: unknown } }>("rentals")
    .find({ status: { $in: ACTIVE }, to: { $gte: addDays(today, -7) }, from: { $lte: addDays(today, ship + 7) } })
    .toArray();

  const sent: string[] = [];
  const send = async (kind: Parameters<typeof autoMail>[1], b: RentalDoc) => {
    const r = await autoMail(d, kind, b);
    if (r && r.at.getTime() > Date.now() - 60_000) sent.push(`${b._id}:${kind}:${r.status}`);
  };

  for (const b of bookings) {
    const isOut = OUT.includes(b.status);
    // Setup reminder 3 days before we ship, unless the customer has set the box up or only just booked.
    const remind = addDays(shipDay(b, ship), -3);
    if (due(remind) && !b.party?.answers && b.createdAt < new Date(Date.now() - 2 * 864e5)) await send("opsaet_paamindelse", b);
    if (due(addDays(b.from, -1))) await send("klar_til_fest", b);
    if (due(addDays(b.to, 1))) await send("tak", b);
    if (due(returnBy(b.to)) && isOut) await send("retur_paamindelse", b);
  }
  return NextResponse.json({ today, checked: bookings.length, sent });
}
