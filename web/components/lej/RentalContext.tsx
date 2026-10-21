"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { addDays, nights, type DayKey, type Range } from "@/lib/dates";
import { bookingWindow, fits, priceLines, total, type Delivery, type PhotoType, type RentalSettings, type Usage } from "@/lib/udlejning/core";

// One booking shared by the whole front page: the calendar in the hero, the theme picker in 3D and the
// booking flow under #book all read and change the same choice. Free days and prices come from
// /api/udlejning/ledighed, which reads what is set in admin.selfi.dk → Udlejning.

export const STEPS = ["Datoer", "Pakke", "Kontakt", "Betal"] as const;
export const SAVED = "selfi:lej";

export type Data = { settings: RentalSettings; usage: Usage; today: DayKey };
export type Status = { kind: "idle" } | { kind: "sending" } | { kind: "error"; message: string };
export type State = {
  theme: string | null;
  printer: boolean;
  photoType: PhotoType;
  delivery: Delivery;
  range: Range | null;
  contact: { name: string; email: string; phone: string; occasion: string; message: string };
  address: { street: string; zip: string; city: string };
};

export const EMPTY: State = {
  theme: null,
  printer: false,
  photoType: "polaroid",
  delivery: "post",
  range: null,
  contact: { name: "", email: "", phone: "", occasion: "", message: "" },
  address: { street: "", zip: "", city: "" },
};

type Ctx = {
  data: Data | null;
  loadError: boolean;
  load: () => Promise<void>;
  s: State;
  set: (patch: Partial<State>) => void;
  setAll: (s: State) => void;
  step: number;
  done: number;
  go: (to: number, scroll?: boolean) => void;
  reach: (to: number) => void;
  win: { minDay: DayKey; maxDay: DayKey } | null;
  /** Can these days be booked with the current theme and printer choice? */
  canBook: (r: Range) => boolean;
  /** Could these days be booked with another theme or printer choice? Used to grey out add-ons. */
  canBookWith: (r: Range, theme: boolean, printer: boolean) => boolean;
  /** Jump to the first free run of `days` days from the chosen first day; a weekend runs Friday to Sunday. */
  preset: (days: number, weekend: boolean) => void;
  /** The total for these days with the theme and printer chosen so far, for the price in each calendar cell. */
  priceFor: (r: Range) => number | null;
  /** True until the free days have arrived: prices and dates are already there, the days are not yet known. */
  loading: boolean;
};

const RentalCtx = createContext<Ctx | null>(null);

export function useRental() {
  const c = useContext(RentalCtx);
  if (!c) throw new Error("useRental needs RentalProvider");
  return c;
}

/**
 * `initial` is what the server already knows when it renders the page: the prices and rules and today's date.
 * With it the calendar draws at once, with every price in place, and only which days are free is fetched.
 */
export function RentalProvider({ children, initial }: { children: ReactNode; initial?: { settings: RentalSettings; today: DayKey } }) {
  const [data, setData] = useState<Data | null>(initial ? { settings: initial.settings, today: initial.today, usage: {} } : null);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [s, setS] = useState<State>(EMPTY);
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(0);

  const set = useCallback((patch: Partial<State>) => setS((x) => ({ ...x, ...patch })), []);

  const load = useCallback(() => {
    setLoadError(false);
    return fetch("/api/udlejning/ledighed", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d: Data) => {
        setData(d);
        setLoaded(true);
      })
      .catch(() => setLoadError(true));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const canBookWith = useCallback(
    (r: Range, theme: boolean, printer: boolean) => {
      if (!data || !loaded) return false;
      const w = bookingWindow(data.settings, data.today, theme);
      return r.from >= w.minDay && r.to <= w.maxDay && nights(r) <= data.settings.rules.maxDays && fits(data.settings, data.usage, r, s.delivery, printer);
    },
    [data, loaded, s.delivery],
  );
  const canBook = useCallback((r: Range) => canBookWith(r, !!s.theme, s.printer), [canBookWith, s.theme, s.printer]);
  const win = useMemo(() => (data ? bookingWindow(data.settings, data.today, !!s.theme) : null), [data, s.theme]);

  // New free days from the server (someone else booked first) can make the chosen dates impossible.
  useEffect(() => {
    if (s.range && data && loaded && !canBook(s.range)) set({ range: null });
  }, [canBook, s.range, data, loaded, set]);

  const go = useCallback((to: number, scroll = true) => {
    setStep(to);
    if (scroll) document.getElementById("book")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);
  const reach = useCallback((to: number) => setDone((d) => Math.max(d, to)), []);

  const preset = useCallback(
    (days: number, weekend: boolean) => {
      if (!win) return;
      const at = (from: DayKey): Range => {
        if (!weekend) return { from, to: addDays(from, days - 1) };
        const [y, m, d] = from.split("-").map(Number);
        const wd = (new Date(y, m - 1, d).getDay() + 6) % 7;
        const fri = addDays(from, 4 - wd + (wd > 4 ? 7 : 0));
        return { from: fri, to: addDays(fri, 2) };
      };
      for (let k = s.range?.from ?? win.minDay; k <= win.maxDay; k = addDays(k, weekend ? 7 : 1)) {
        const r = at(k);
        if (canBook(r)) return set({ range: r });
      }
    },
    [win, s.range, canBook, set],
  );

  const priceFor = useCallback(
    (r: Range) => (data ? total(priceLines(data.settings, { range: r, theme: s.theme, printer: s.printer, photoType: s.photoType, delivery: s.delivery })) : null),
    [data, s.theme, s.printer, s.photoType, s.delivery],
  );

  const value: Ctx = { data, loadError, load, s, set, setAll: setS, step, done, go, reach, win, canBook, canBookWith, preset, priceFor, loading: !loaded && !loadError };
  return <RentalCtx.Provider value={value}>{children}</RentalCtx.Provider>;
}
