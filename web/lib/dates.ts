// Date helpers for the booking calendar. Dates are handled as local calendar days ("2027-06-11").

export type DayKey = string;
export type Range = { from: DayKey; to: DayKey };

export const MONTHS = ["januar", "februar", "marts", "april", "maj", "juni", "juli", "august", "september", "oktober", "november", "december"];
export const WEEKDAYS_SHORT = ["ma", "ti", "on", "to", "fr", "lø", "sø"];
const WEEKDAYS_LONG = ["mandag", "tirsdag", "onsdag", "torsdag", "fredag", "lørdag", "søndag"];

export function toKey(d: Date): DayKey {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

export function fromKey(k: DayKey): Date {
  const [y, m, d] = k.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(k: DayKey, n: number): DayKey {
  const d = fromKey(k);
  d.setDate(d.getDate() + n);
  return toKey(d);
}

/** Monday = 0 … Sunday = 6 */
export function weekday(k: DayKey): number {
  return (fromKey(k).getDay() + 6) % 7;
}

export function today(): DayKey {
  return toKey(new Date());
}

export function daysIn(range: Range): DayKey[] {
  const out: DayKey[] = [];
  for (let k = range.from; k <= range.to; k = addDays(k, 1)) out.push(k);
  return out;
}

export function nights(range: Range): number {
  return daysIn(range).length;
}

/** "fredag 11. juni" or "fre 11.6" */
export function formatDay(k: DayKey, style: "long" | "short" = "long"): string {
  const d = fromKey(k);
  const wd = weekday(k);
  if (style === "short") return `${WEEKDAYS_LONG[wd].slice(0, 3)} ${d.getDate()}.${d.getMonth() + 1}`;
  return `${WEEKDAYS_LONG[wd]} ${d.getDate()}. ${MONTHS[d.getMonth()]}`;
}

export function formatRange(r: Range, style: "long" | "short" = "long"): string {
  if (r.from === r.to) return formatDay(r.from, style);
  return `${formatDay(r.from, style)} – ${formatDay(r.to, style)}`;
}

/** The weeks of a month as rows of 7 cells; null pads days outside the month. */
export function monthGrid(year: number, month: number): (DayKey | null)[][] {
  const first = toKey(new Date(year, month, 1));
  const count = new Date(year, month + 1, 0).getDate();
  const cells: (DayKey | null)[] = Array(weekday(first)).fill(null);
  for (let d = 1; d <= count; d++) cells.push(toKey(new Date(year, month, d)));
  while (cells.length % 7) cells.push(null);
  const rows: (DayKey | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
  return rows;
}
