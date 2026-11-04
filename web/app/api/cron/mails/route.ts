import { NextResponse } from "next/server";
import { alert } from "@/lib/alert";
import { addDays } from "@/lib/dates";
import { deleteDay, returnBy, shipDay } from "@/lib/mail/templates";
import { db, getSettings, todayDK, type RentalDoc, type RentalStatus } from "@/lib/udlejning/db";
import { autoMail } from "@/lib/udlejning/mails";
import { customerSms } from "@/lib/udlejning/sms";

// selfi.dk/api/cron/mails: Vercel runs this every morning (web/vercel.json). It sends the mails that are due
// on a given day: the setup reminder, "i morgen er det fest", the thank-you with the photo portal and the
// return reminder. Each mail has a key per booking, so running it twice, or catching up a missed day, never
// sends one twice. With CRON_SECRET set in Vercel, only Vercel's own call gets through.

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const ACTIVE: RentalStatus[] = ["paid", "packed", "shipped", "delivered"];
const OUT: RentalStatus[] = ["shipped", "delivered"];

export async function GET(req: Request) {
  try {
    return await run(req);
  } catch (e) {
    await alert(`Morgenkørslen med kundemails fejlede: ${(e as Error).message}`);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}

async function run(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.get("authorization") !== `Bearer ${secret}`) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const d = await db();
  const settings = await getSettings(d);
  const today = todayDK();
  const yesterday = addDays(today, -1);
  const due = (day: string) => day === today || day === yesterday; // yesterday too, in case a run was missed
  const day0 = (day: string) => day === today; // SMS kun på selve dagen: en dag for sent er værre end ingen
  const ship = settings.rules.shipDaysBefore;

  // Everything that can still get a mail: from a week before shipping until a few days after the return.
  const bookings = await d
    .collection<RentalDoc & { party?: { answers?: unknown } }>("rentals")
    .find({ status: { $in: ACTIVE }, to: { $gte: addDays(today, -7) }, from: { $lte: addDays(today, ship + 7) } })
    .toArray();

  const sent: string[] = [];
  const send = async (kind: Parameters<typeof autoMail>[1], b: RentalDoc, extra?: Parameters<typeof autoMail>[3]) => {
    const r = await autoMail(d, kind, b, extra);
    if (r && r.at.getTime() > Date.now() - 60_000) sent.push(`${b._id}:${kind}:${r.status}`);
  };

  for (const b of bookings) {
    const isOut = OUT.includes(b.status);
    // Setup reminder 3 days before we ship, unless the customer has set the box up or only just booked.
    const remind = addDays(shipDay(b, ship), -3);
    if (due(remind) && !b.party?.answers && b.createdAt < new Date(Date.now() - 2 * 864e5)) await send("opsaet_paamindelse", b);
    if (due(addDays(b.from, -1))) {
      await send("klar_til_fest", b);
      if (day0(addDays(b.from, -1))) await customerSms(d, b, "klar_til_fest", `Selfi: I morgen er det fest! Har I ikke hentet boksen i pakkeshoppen, så gør det i dag. Hjælp: selfi.dk/#chat (booking ${b._id})`);
    }
    if (due(addDays(b.to, 1))) await send("tak", b);
    if (due(returnBy(b.to)) && isOut) {
      await send("retur_paamindelse", b);
      if (day0(returnBy(b.to))) await customerSms(d, b, "retur", `Selfi: Husk at aflevere boksen i en dao-pakkeshop i dag. Returlabelen ligger i kassen, og fragten er betalt. (booking ${b._id})`);
    }
  }

  // Bokse, der ikke er kommet hjem: 3 dage efter returfristen og stadig ude. Én alarm pr. morgen, til den er modtaget.
  const late = bookings.filter((b) => OUT.includes(b.status) && addDays(returnBy(b.to), 3) <= today);
  if (late.length) await alert(`${late.length === 1 ? "1 boks er" : `${late.length} bokse er`} ikke kommet retur: ${late.map((b) => `${b._id} (retur senest ${returnBy(b.to)})`).join(", ")}`);

  // Varsel 14 dage før billederne slettes. Gælder også bookinger, der er afsluttet for længst.
  const old = await d
    .collection<RentalDoc>("rentals")
    .find({ status: { $in: ["paid", "packed", "shipped", "delivered", "returned", "done"] }, to: { $gte: addDays(today, -400), $lte: addDays(today, -60) } })
    .toArray();
  for (const b of old) {
    const gone = deleteDay(b);
    if (due(addDays(gone, -14))) await send("sletning_varsel", b, { extra: { deleteOn: gone } });
  }
  return NextResponse.json({ today, checked: bookings.length, sent });
}
