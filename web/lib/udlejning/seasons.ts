// Danish party seasons, so the calendar can say when a weekend tends to go first. Real patterns, not
// invented scarcity: konfirmationer fall on weekends from mid-April to the end of May, studenterne get
// their caps in the second half of June, weddings fill Saturdays from May to September, late summer has the
// company parties, and the julefrokoster take the Fridays and Saturdays from late November. Month and day
// only, so the list holds for every year.

import { weekday, type DayKey } from "../dates";

export type Season = { key: string; name: string; hint: string };

type Rule = Season & { from: [number, number]; to: [number, number]; days?: number[] }; // Monday = 0 … Sunday = 6

const RULES: Rule[] = [
  { key: "konfirmation", name: "Konfirmationer", hint: "Weekenderne fra midt i april til sidst i maj går først.", from: [4, 15], to: [5, 31], days: [4, 5, 6] },
  { key: "bryllup", name: "Bryllupper", hint: "Lørdagene fra maj til september bliver booket tidligt.", from: [5, 1], to: [9, 30], days: [5] },
  { key: "sankthans", name: "Sankthans", hint: "Sankthansaften er en af årets travleste.", from: [6, 23], to: [6, 23] },
  { key: "studenter", name: "Studenterfester", hint: "Sidst i juni holder studenterne fest hver dag.", from: [6, 15], to: [6, 30] },
  { key: "sommerfest", name: "Sommer- og firmafester", hint: "Fredage og lørdage fra midt i august til midt i september.", from: [8, 15], to: [9, 15], days: [4, 5] },
  { key: "julefrokost", name: "Julefrokoster", hint: "Fredage og lørdage fra sidst i november til jul.", from: [11, 20], to: [12, 20], days: [4, 5] },
  { key: "nytaar", name: "Nytårsaften", hint: "Nytårsaften er booket længe før.", from: [12, 31], to: [12, 31] },
];

/** The busy season a day falls in, or null. */
export function seasonOf(k: DayKey): Season | null {
  const [, m, d] = k.split("-").map(Number);
  const md = m * 100 + d;
  const wd = weekday(k);
  for (const r of RULES) {
    const a = r.from[0] * 100 + r.from[1];
    const b = r.to[0] * 100 + r.to[1];
    if (md >= a && md <= b && (!r.days || r.days.includes(wd))) return r;
  }
  return null;
}

/** The seasons that touch a month, in calendar order, for the note under the month's name. */
export function seasonsIn(year: number, month: number): Season[] {
  const out: Season[] = [];
  const count = new Date(year, month + 1, 0).getDate();
  for (let d = 1; d <= count; d++) {
    const k = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const s = seasonOf(k);
    if (s && !out.some((x) => x.key === s.key)) out.push(s);
  }
  return out;
}
