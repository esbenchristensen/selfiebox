// B2C rental: settings, prices and availability. Pure functions shared by the booking page, the API routes
// and (as a copy in selfiebox-platform web/src/lib/udlejning.ts) the admin. Keep the two copies in sync.
//
// Availability: every booking holds one box, and one printer when the printer is chosen, from the day it
// leaves us until it is back and checked. With the post that is shipDaysBefore before the first day until
// returnDaysAfter + prepDays after the last day. A day is free when fewer boxes (printers) are held than
// we own, minus what is blocked in admin (service, B2B use).

import { addDays, nights, type DayKey, type Range } from "../dates";

export type Delivery = "post"; // always by post with dao; there is no pickup
export type PhotoType = "strip" | "polaroid";

export type RentalSettings = {
  open: boolean; // bookings can be paid on selfi.dk
  inventory: { boxes: number; printers: number };
  prices: {
    byDays: number[]; // kr. inkl. moms for 1, 2, 3 … days
    perExtraDay: number; // each day after byDays
    theme: number;
    printer: number;
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
  };
};

export const DEFAULT_SETTINGS: RentalSettings = {
  open: true,
  inventory: { boxes: 1, printers: 1 },
  prices: {
    byDays: [495, 625, 750, 875, 995, 1125, 1250],
    perExtraDay: 100,
    theme: 295,
    printer: 695,
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
    prices: { ...d.prices, ...s.prices },
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
};

export const PHOTO_TYPES: Record<PhotoType, { name: string; text: string }> = {
  strip: { name: "Fotostrimmel", text: "Flere billeder under hinanden på en smal strimmel, som i en klassisk fotoautomat." },
  polaroid: { name: "Polaroid", text: "Ét billede med hvid kant og plads til en hilsen forneden." },
};

export const DELIVERIES: Record<Delivery, { name: string; text: string }> = {
  post: { name: "Med posten", text: "Vi sender boksen til jeres nærmeste dao-pakkeshop, så den er der dagen før. Returfragten er betalt, og labelen ligger i kassen." },
};

export const kr = (n: number) => `${n.toLocaleString("da-DK")} kr.`;

export function priceForDays(s: RentalSettings, days: number): number {
  const { byDays, perExtraDay } = s.prices;
  if (days <= byDays.length) return byDays[Math.max(1, days) - 1];
  return byDays[byDays.length - 1] + (days - byDays.length) * perExtraDay;
}

export type Line = { id: string; label: string; amount: number };

/** The order lines in kr. inkl. moms. The server recomputes these; the browser only shows them. */
// Shipping both ways (the return label is always in the box) and insurance are included in the prices.
export function priceLines(s: RentalSettings, c: Choice): Line[] {
  const days = nights(c.range);
  const lines: Line[] = [{ id: "box", label: `Selfi Boks · ${periodLabel(c.range)}`, amount: priceForDays(s, days) }];
  if (c.theme) lines.push({ id: "theme", label: `Tema: ${c.theme}`, amount: s.prices.theme });
  if (c.printer) lines.push({ id: "printer", label: `Printer med ${s.printsIncluded} print (${PHOTO_TYPES[c.photoType].name.toLowerCase()})`, amount: s.prices.printer });
  return lines;
}

export const total = (lines: Line[]) => lines.reduce((t, l) => t + l.amount, 0);

// "1 dag", "Weekend · 3 dage", "1 uge", "10 dage"
export function periodLabel(range: Range): string {
  const n = nights(range);
  if (n === 1) return "1 dag";
  if (n % 7 === 0) return n === 7 ? "1 uge" : `${n / 7} uger`;
  if (n <= 3 && weekday(range.from) >= 4 && weekday(range.to) >= 5) return `Weekend · ${n} dage`;
  return `${n} dage`;
}

function weekday(k: DayKey): number {
  const [y, m, d] = k.split("-").map(Number);
  return (new Date(y, m - 1, d).getDay() + 6) % 7;
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
