// B2C rental: settings, prices and availability. Pure functions shared by the booking page, the API routes
// and (as a copy in selfiebox-platform web/src/lib/udlejning.ts) the admin. Keep the two copies in sync.
//
// Availability: every booking holds one box, and one printer when the printer is chosen, from the day it
// leaves us until it is back and checked. With the post that is shipDaysBefore before the first day until
// returnDaysAfter + prepDays after the last day. A day is free when fewer boxes (printers) are held than
// we own, minus what is blocked in admin (service, B2B use).

import { addDays, daysIn, nights, type DayKey, type Range } from "../dates";

export type Delivery = "post"; // always by post with dao; there is no pickup
export type PhotoType = "strip" | "polaroid";

// The fixed rental periods, as on the other Danish rental sites. Days around a period cost perExtraDay each.
export type Period = "day" | "weekend" | "twoDays" | "week";

export const PERIODS: Record<Period, { name: string; text: string }> = {
  day: { name: "1 hverdag", text: "Én dag, mandag til torsdag" },
  weekend: { name: "Weekend", text: "Hele weekenden, fredag til søndag" },
  twoDays: { name: "2 hverdage", text: "To dage i træk, mandag til torsdag" },
  week: { name: "1 uge", text: "Op til syv dage i træk" },
};

export type RentalSettings = {
  open: boolean; // bookings can be paid on selfi.dk
  inventory: { boxes: number; printers: number };
  prices: {
    periods: Record<Period, number>; // kr. inkl. moms
    perExtraDay: number; // each day the period does not cover
    byDays?: number[]; // the old price per number of days, still written by admin for older selfi.dk builds
    theme: number;
    printer: number;
    keep: number; // add-on: the photos kept for KEEP_MONTHS
  };
  printsIncluded: number;
  themes: string[];
  rules: {
    leadDays: number; // earliest first day, counted from today
    themeLeadDays: number; // earliest first day with a theme
    monthsAhead: number;
    maxDays: number;
    shipDaysBefore: number; // with the post: the box leaves us this many days before the first day
    returnDaysAfter: number; // and is back this many days after the last day
    prepDays: number; // check, clean and charge before the next booking
    peakMonths: number[]; // 1-12: friday to sunday in these months is high season, which a booking cannot be moved to
  };
};

export const DEFAULT_SETTINGS: RentalSettings = {
  open: true,
  inventory: { boxes: 1, printers: 1 },
  prices: {
    periods: { day: 895, weekend: 1195, twoDays: 1195, week: 1995 },
    perExtraDay: 350, // mere end 2 hverdage minus 1 hverdag, så 2 hverdage altid er billigst
    theme: 295,
    printer: 895,
    keep: 149,
  },
  printsIncluded: 100,
  themes: ["Bryllup", "Fødselsdag", "Julefrokost"],
  rules: {
    leadDays: 4,
    themeLeadDays: 7,
    monthsAhead: 12,
    maxDays: 14,
    shipDaysBefore: 2,
    returnDaysAfter: 3,
    prepDays: 1,
    peakMonths: [4, 5, 6, 7, 8, 9, 12], // konfirmationer, bryllupper, sommerfester, julefrokoster
  },
};

/** Settings from the database laid over the defaults, so a missing field never breaks the page. */
export function withDefaults(s: Partial<RentalSettings> | null | undefined): RentalSettings {
  const d = DEFAULT_SETTINGS;
  if (!s) return d;
  return {
    ...d,
    ...s,
    inventory: { ...d.inventory, ...s.inventory },
    // Saved before the periods existed: perExtraDay then meant "after byDays", so the period defaults apply.
    prices: s.prices?.periods
      ? { ...d.prices, ...s.prices, periods: { ...d.prices.periods, ...s.prices.periods } }
      : { ...d.prices, theme: s.prices?.theme ?? d.prices.theme, printer: s.prices?.printer ?? d.prices.printer },
    rules: { ...d.rules, ...s.rules },
    themes: s.themes?.length ? s.themes : d.themes,
  };
}

export type Choice = {
  range: Range;
  theme: string | null; // null = no theme
  printer: boolean;
  photoType: PhotoType;
  delivery: Delivery;
  keep?: boolean; // the photos kept for KEEP_MONTHS instead of GALLERY_MONTHS
};

/** How long the event page is open without and with the keep add-on. After that the photos are deleted. */
export const GALLERY_MONTHS = 3;
export const KEEP_MONTHS = 12;

/** The add-on besides the printer, as the booking shows it. */
export const ADDONS = {
  keep: () => ({ name: `Billederne gemt i ${KEEP_MONTHS} måneder`, text: `Eventsiden er åben i ${KEEP_MONTHS} måneder i stedet for ${GALLERY_MONTHS} måneder, så I kan hente billederne igen. Derefter sletter vi dem.` }),
};

export const PHOTO_TYPES: Record<PhotoType, { name: string; text: string }> = {
  strip: { name: "Fotostrimmel", text: "Flere billeder under hinanden på en smal strimmel, som i en klassisk fotoautomat." },
  polaroid: { name: "Polaroid", text: "Ét billede med hvid kant og plads til en hilsen forneden." },
};

export const DELIVERIES: Record<Delivery, { name: string; text: string }> = {
  post: { name: "Med posten", text: "Vi sender boksen til jeres nærmeste dao-pakkeshop, så den er der dagen før. Returfragten er betalt, og labelen ligger i kassen." },
};

export const kr = (n: number) => `${n.toLocaleString("da-DK")} kr.`;

export type Quote = { amount: number; period: Period; extraDays: number; label: string };

/** The box price for a range: the cheapest period that fits in it, plus perExtraDay for every day it does not
 *  cover. A weekday is Monday to Thursday; Friday to Sunday is the weekend. A week covers up to seven days, so
 *  five days never cost more than a week. */
export function boxQuote(s: RentalSettings, r: Range): Quote {
  const n = Math.max(1, nights(r));
  const { periods: p, perExtraDay: x } = s.prices;
  let weekdays = 0, weekend = 0, runWd = 0, runWe = 0;
  for (let i = 0; i < n; i++) {
    const wd = weekday(addDays(r.from, i));
    runWd = wd <= 3 ? runWd + 1 : 0;
    runWe = wd >= 4 ? runWe + 1 : 0;
    weekdays = Math.max(weekdays, runWd);
    weekend = Math.max(weekend, runWe);
  }
  const options: [Period, number][] = [];
  if (weekend) options.push(["weekend", weekend]);
  if (weekdays >= 2) options.push(["twoDays", 2]);
  if (weekdays) options.push(["day", 1]);
  options.push(["week", Math.min(n, 7)]);
  let best: Quote | null = null;
  for (const [period, covers] of options) {
    const amount = p[period] + (n - covers) * x;
    if (best && amount >= best.amount) continue;
    const extra = n - covers;
    const name = period === "week" && n < 7 ? `1 uge (${n} dage)` : PERIODS[period].name;
    best = { amount, period, extraDays: extra, label: extra ? `${name} + ${extra} ${extra === 1 ? "ekstra dag" : "ekstra dage"}` : name };
  }
  return best!;
}

export const boxPrice = (s: RentalSettings, r: Range) => boxQuote(s, r).amount;

/** The lowest price a box can be rented for, for "Fra … kr.". */
export const fromPrice = (s: RentalSettings) => Math.min(...Object.values(s.prices.periods));

export type Line = { id: string; label: string; amount: number };

/** The order lines in kr. inkl. moms. The server recomputes these; the browser only shows them. */
// Shipping both ways (the return label is always in the box) and insurance are included in the prices.
export function priceLines(s: RentalSettings, c: Choice): Line[] {
  const q = boxQuote(s, c.range);
  const lines: Line[] = [{ id: "box", label: `Selfi Boks · ${q.label}`, amount: q.amount }];
  if (c.theme) lines.push({ id: "theme", label: `Tema: ${c.theme}`, amount: s.prices.theme });
  if (c.printer) lines.push({ id: "printer", label: `Printer med ${s.printsIncluded} print (${PHOTO_TYPES[c.photoType].name.toLowerCase()})`, amount: s.prices.printer });
  if (c.keep) lines.push({ id: "keep", label: ADDONS.keep().name, amount: s.prices.keep });
  return lines;
}

export const total = (lines: Line[]) => lines.reduce((t, l) => t + l.amount, 0);

function weekday(k: DayKey): number {
  const [y, m, d] = k.split("-").map(Number);
  return (new Date(y, m - 1, d).getDay() + 6) % 7;
}

/** The high-season days in a range: friday to sunday in the peak months. A booking can be moved to other
 * dates, but not into these, because they would have been rented out anyway (/lejebetingelser point 8). */
export function peakDays(s: RentalSettings, r: Range): DayKey[] {
  return daysIn(r).filter((k) => weekday(k) >= 4 && s.rules.peakMonths.includes(Number(k.slice(5, 7))));
}

/** The days a booking holds its box and printer, including transport and the check afterwards. */
export function heldRange(s: RentalSettings, r: Range, delivery: Delivery): Range {
  const R = s.rules;
  void delivery;
  const before = R.shipDaysBefore;
  const after = R.returnDaysAfter + R.prepDays;
  return { from: addDays(r.from, -before), to: addDays(r.to, after) };
}

/** What occupies boxes and printers: active bookings and admin blocks. */
export type Hold = { range: Range; delivery: Delivery; printer: boolean };
export type Block = { from: DayKey; to: DayKey; boxes: number; printers: number };

/** Boxes and printers in use per day: { "2027-06-11": [boxes, printers] }. Days not listed are free. */
export type Usage = Record<DayKey, [number, number]>;

export function usage(s: RentalSettings, holds: Hold[], blocks: Block[]): Usage {
  const u: Usage = {};
  const add = (r: Range, b: number, p: number) => {
    for (let k = r.from; k <= r.to; k = addDays(k, 1)) {
      const cur = u[k] ?? [0, 0];
      u[k] = [cur[0] + b, cur[1] + p];
    }
  };
  for (const h of holds) add(heldRange(s, h.range, h.delivery), 1, h.printer ? 1 : 0);
  for (const b of blocks) add({ from: b.from, to: b.to }, b.boxes, b.printers);
  return u;
}

/** Is there a box (and a printer) for every day this choice would hold one? */
export function fits(s: RentalSettings, u: Usage, r: Range, delivery: Delivery, printer: boolean): boolean {
  const held = heldRange(s, r, delivery);
  for (let k = held.from; k <= held.to; k = addDays(k, 1)) {
    const [b, p] = u[k] ?? [0, 0];
    if (b >= s.inventory.boxes) return false;
    if (printer && p >= s.inventory.printers) return false;
  }
  return true;
}

/** The first and last day that can be booked from `today`. */
export function bookingWindow(s: RentalSettings, today: DayKey, theme: boolean): { minDay: DayKey; maxDay: DayKey } {
  const minDay = addDays(today, theme ? Math.max(s.rules.leadDays, s.rules.themeLeadDays) : s.rules.leadDays);
  const [y, m, d] = today.split("-").map(Number);
  const max = new Date(y, m - 1 + s.rules.monthsAhead, d);
  const maxDay = `${max.getFullYear()}-${String(max.getMonth() + 1).padStart(2, "0")}-${String(max.getDate()).padStart(2, "0")}`;
  return { minDay, maxDay };
}

/** Everything wrong with a choice, as one sentence for the customer. Null when it can be booked. */
export function problem(s: RentalSettings, u: Usage, c: Choice, today: DayKey): string | null {
  const { minDay, maxDay } = bookingWindow(s, today, !!c.theme);
  if (c.range.from > c.range.to) return "Vælg datoer igen.";
  if (c.range.from < minDay) return c.theme ? "Med tema skal første dag ligge lidt længere ude, så vi kan nå at gøre boksen klar." : "Første dag ligger for tæt på. Vælg en senere dato.";
  if (c.range.to > maxDay) return "Vi tager kun imod bookinger et stykke frem. Vælg en tidligere dato.";
  if (nights(c.range) > s.rules.maxDays) return `Vi kan booke op til ${s.rules.maxDays} dage her. Skriv til os for længere lejeperioder.`;
  if (c.theme && !s.themes.includes(c.theme)) return "Vælg et af temaerne.";
  if (!fits(s, u, c.range, c.delivery, c.printer)) {
    return c.printer && fits(s, u, c.range, c.delivery, false)
      ? "Printeren er optaget i de dage. Vælg andre datoer eller boksen uden printer."
      : "Boksen er desværre optaget i de dage. Vælg andre datoer.";
  }
  return null;
}
