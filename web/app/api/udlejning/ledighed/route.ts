import { NextResponse } from "next/server";
import { db, getHolds, getSettings, todayDK } from "@/lib/udlejning/db";
import { usage } from "@/lib/udlejning/core";

// selfi.dk/api/udlejning/ledighed: prices, rules and how many boxes and printers are in use per day,
// so the calendar can grey out the days that do not fit the customer's choice. Checkout checks again.

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const d = await db();
    const settings = await getSettings(d);
    const today = todayDK();
    const { holds, blocks } = await getHolds(d, today);
    return NextResponse.json(
      { settings, today, usage: usage(settings, holds, blocks) },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (e) {
    console.error("ledighed", e);
    return NextResponse.json({ error: "Kalenderen kunne ikke hentes. Prøv igen om lidt." }, { status: 503 });
  }
}
