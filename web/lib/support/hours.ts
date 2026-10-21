// Opening hours for the human support behind the chat, and the reply time the assistant may promise.
// Danish time. Hours are a decision, not law: change OPEN/CLOSE here (the prompt reads them from the context).

export const SUPPORT_HOURS = { open: 10, close: 22, days: "alle dage" } as const;
const REPLY_MIN = 60; // inside opening hours: a colleague answers within this many minutes
const URGENT_MIN = 15; // the box does not work at a party: a call back within this many minutes, day or night

const TZ = "Europe/Copenhagen";

export function dkParts(d: Date): { weekday: string; day: string; time: string; hour: number; minute: number; date: string } {
  const f = new Intl.DateTimeFormat("da-DK", { timeZone: TZ, weekday: "long", day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: false });
  const p = Object.fromEntries(f.formatToParts(d).map((x) => [x.type, x.value]));
  const hour = Number(p.hour) % 24;
  const date = new Intl.DateTimeFormat("sv-SE", { timeZone: TZ }).format(d);
  return { weekday: p.weekday, day: `${p.weekday} ${p.day}. ${p.month} ${p.year}`, time: `${String(hour).padStart(2, "0")}.${p.minute}`, hour, minute: Number(p.minute), date };
}

export const isOpen = (d = new Date()): boolean => {
  const { hour } = dkParts(d);
  return hour >= SUPPORT_HOURS.open && hour < SUPPORT_HOURS.close;
};

export const hoursText = () => `${SUPPORT_HOURS.days} kl. ${SUPPORT_HOURS.open}–${SUPPORT_HOURS.close}`;

/** When a colleague realistically answers, as the assistant should say it to the customer. */
export function replyPromise(urgent: boolean, d = new Date()): { text: string; minutes: number | null } {
  if (urgent) return { text: `inden for ${URGENT_MIN} minutter, også uden for åbningstid`, minutes: URGENT_MIN };
  const { hour, minute } = dkParts(d);
  if (hour >= SUPPORT_HOURS.open && hour < SUPPORT_HOURS.close) {
    const until = new Date(d.getTime() + REPLY_MIN * 60_000);
    const u = dkParts(until);
    if (u.hour < SUPPORT_HOURS.close && u.date === dkParts(d).date) return { text: `inden kl. ${u.time}`, minutes: REPLY_MIN };
    return { text: `i morgen inden kl. ${SUPPORT_HOURS.open + 1}`, minutes: null };
  }
  const beforeOpen = hour < SUPPORT_HOURS.open;
  void minute;
  return { text: `${beforeOpen ? "i dag" : "i morgen"} inden kl. ${SUPPORT_HOURS.open + 1}`, minutes: null };
}
