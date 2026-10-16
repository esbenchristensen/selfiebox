import { NextResponse } from "next/server";

// Booked periods shown as unavailable in the calendar.
// Until a real booking system exists, set BOOKED_DATES in Vercel as JSON:
//   [{"from":"2027-06-11","to":"2027-06-13"},{"from":"2027-07-02","to":"2027-07-04"}]

type Range = { from: string; to: string };
const DAY = /^\d{4}-\d{2}-\d{2}$/;

export const dynamic = "force-dynamic";

export function GET() {
  let booked: Range[] = [];
  try {
    const raw = JSON.parse(process.env.BOOKED_DATES ?? "[]") as unknown;
    if (Array.isArray(raw)) {
      booked = raw.filter((r): r is Range => !!r && DAY.test(r.from) && DAY.test(r.to) && r.from <= r.to);
    }
  } catch {
    // A malformed value shows every day as free rather than breaking the calendar.
  }
  return NextResponse.json({ booked });
}
