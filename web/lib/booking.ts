"use client";

import { useEffect, useMemo, useState } from "react";
import { booking, pricing, priceForDays } from "@/content";
import { addDays, nights, today, toKey, weekday, type DayKey, type Range } from "./dates";

export const kr = (n: number) => `${n.toLocaleString("da-DK")} kr.`;

// "1 dag", "Weekend · 3 dage", "1 uge", "10 dage"
export function periodLabel(range: Range): string {
  const n = nights(range);
  if (n === 1) return "1 dag";
  if (n % 7 === 0) return n === 7 ? "1 uge" : `${n / 7} uger`;
  if (n <= 3 && weekday(range.from) >= 4 && weekday(range.to) >= 5) return `Weekend · ${n} dage`;
  return `${n} dage`;
}

export type Quote = { days: number; price: number; perDay: number; saved: number; nextDay: number | null };

// The price for a range, what it costs per day, what it saves against single days and what one more day costs.
export function quote(range: Range): Quote {
  const days = nights(range);
  const price = priceForDays(days);
  return {
    days,
    price,
    perDay: Math.round(price / days),
    saved: priceForDays(1) * days - price,
    nextDay: days < pricing.maxDays ? priceForDays(days + 1) - price : null,
  };
}

// Whether every day of the range is inside the booking window, free and within the max length.
export function rangeFree(r: Range, isBlocked: (k: DayKey) => boolean, minDay: DayKey, maxDay: DayKey): boolean {
  if (r.from < minDay || r.to > maxDay || r.from > r.to) return false;
  if (nights(r) > pricing.maxDays) return false;
  for (let k = r.from; k <= r.to; k = addDays(k, 1)) if (isBlocked(k)) return false;
  return true;
}

// A preset applied to the chosen start day, or to the first free date when nothing is chosen yet.
// A weekend always runs Friday to Sunday.
export function presetRange(days: number, weekend: boolean, start: DayKey | null, isBlocked: (k: DayKey) => boolean, minDay: DayKey, maxDay: DayKey): Range | null {
  const at = (from: DayKey): Range => {
    if (weekend) {
      const fri = addDays(from, 4 - weekday(from)); // the weekend this day belongs to (Mon–Thu: the coming one)
      return { from: fri, to: addDays(fri, 2) };
    }
    return { from, to: addDays(from, days - 1) };
  };
  if (start) {
    const r = at(start);
    if (rangeFree(r, isBlocked, minDay, maxDay)) return r;
  }
  for (let k = start ?? minDay; k <= maxDay; k = addDays(k, weekend ? 7 : 1)) {
    const r = at(k);
    if (rangeFree(r, isBlocked, minDay, maxDay)) return r;
  }
  return null;
}

export function useBookingWindow() {
  const minDay = addDays(today(), booking.leadDays);
  const maxDay = useMemo(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + booking.monthsAhead);
    return toKey(d);
  }, []);
  return { minDay, maxDay };
}

// Days already booked by others, so the calendar can show them as taken.
export function useBookedDays() {
  const [booked, setBooked] = useState<Set<DayKey>>(new Set());
  useEffect(() => {
    fetch("/api/ledighed")
      .then((r) => (r.ok ? r.json() : { booked: [] }))
      .then((d: { booked: Range[] }) => {
        const s = new Set<DayKey>();
        for (const r of d.booked ?? []) for (let k = r.from; k <= r.to; k = addDays(k, 1)) s.add(k);
        setBooked(s);
      })
      .catch(() => {});
  }, []);
  return booked;
}

// The hero calendar hands its choice to the full booking flow further down the page.
export const START_BOOKING = "selfi:start-booking";
export type StartBooking = { range: Range };
export function startBooking(detail: StartBooking) {
  window.dispatchEvent(new CustomEvent<StartBooking>(START_BOOKING, { detail }));
}
