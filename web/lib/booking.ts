"use client";

import { useEffect, useMemo, useState } from "react";
import { booking, packages, type PackageId } from "@/content";
import { addDays, today, toKey, weekday, type DayKey, type Range } from "./dates";

// The period a click on `day` books for a package. A weekend is always Friday to Sunday.
export function rangeForPackage(pkg: PackageId, day: DayKey): Range {
  if (pkg === "weekend") {
    const fri = addDays(day, 4 - weekday(day)); // the weekend this day belongs to (Mon–Thu: the coming one)
    return { from: fri, to: addDays(fri, 2) };
  }
  const days = packages.find((p) => p.id === pkg)!.days;
  return { from: day, to: addDays(day, days - 1) };
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
export type StartBooking = { pkg: PackageId; range: Range };
export function startBooking(detail: StartBooking) {
  window.dispatchEvent(new CustomEvent<StartBooking>(START_BOOKING, { detail }));
}
