// The assistant's instructions: support/system-prompt.md with the knowledge base (support/viden.md plus the
// business FAQ and the function list from content.ts) and support/stilguide.md folded in. The three .md files
// are plain text, so tone and rules can be edited without touching code. They are read from disk: in
// development on every turn, in production once per process. The dynamic part (date, opening hours, the
// customer's verification, live prices) is a separate developer message, so the static prefix stays cacheable.

import { readFileSync } from "node:fs";
import path from "node:path";

import { faq as erhvervFaq, features } from "../../content";
import { GALLERY_MONTHS, KEEP_MONTHS, kr, PERIODS, type Period, type RentalSettings } from "../udlejning/core";
import type { SupportChatDoc } from "./db";
import { dkParts, hoursText, isOpen } from "./hours";

export const ASSISTANT_NAME = "Sif";

const DIR = path.join(process.cwd(), "support");
const read = (file: string) => readFileSync(path.join(DIR, file), "utf8");

let cached: string | null = null;

/** The static instructions: prompt + knowledge + style guide. */
export function instructions(): string {
  if (cached && process.env.NODE_ENV === "production") return cached;
  const viden = [read("viden.md"), generatedKnowledge()].join("\n\n");
  cached = read("system-prompt.md").replace("{{VIDEN}}", viden).replace("{{STILGUIDE}}", read("stilguide.md"));
  return cached;
}

/** What the site itself says to places: the FAQ and the functions, with "kommer snart" kept. */
function generatedKnowledge(): string {
  const out: string[] = ["### Erhverv: spørgsmål og svar fra selfi.dk/erhverv"];
  for (const f of erhvervFaq) out.push(`- **${f.q}** ${f.a}`);
  out.push("", "### Funktioner (selfi.dk/funktioner)");
  for (const f of features) {
    const soon = f.soon ? " (KOMMER SNART, ikke bygget endnu)" : "";
    const parts = f.points.filter((p) => p[2]).map((p) => p[0]);
    out.push(`- **${f.name}**${soon}: ${f.short} ${f.lede}${parts.length ? ` Kommer snart: ${parts.join(", ")}.` : ""}`);
    for (const q of f.faq) out.push(`  - ${q.q} ${q.a}`);
  }
  return out.join("\n");
}

const MONTH_NAMES = ["januar","februar","marts","april","maj","juni","juli","august","september","oktober","november","december"];

/** The developer message that changes per turn: date, hours, verification, prices and rules. */
export function dynamicContext(chat: SupportChatDoc, settings: RentalSettings, now = new Date()): string {
  const p = dkParts(now);
  const lines = [
    `Dags dato: ${p.day}, kl. ${p.time} (dansk tid). Menneskelig support svarer ${hoursText()}. Lige nu er der ${isOpen(now) ? "åbent" : "lukket"}.`,
    `Siden, kunden skriver fra: ${chat.page || "selfi.dk"}.`,
  ];
  if (chat.contact) {
    lines.push(`Kunden skrev sig ind som ${chat.contact.name}. E-mail og telefon er gemt og bruges af værktøjerne (verificering, SMS-kode, designudkast, eskalering). Tiltal kunden ved fornavn. Gentag ikke e-mail eller telefonnummer, og brug dem ikke til at slå noget op, før kunden selv spørger til en ordre eller noget personligt.`);
  }
  if (chat.customer) {
    lines.push(`Kunden er verificeret (${chat.customer.via === "sms" ? "med SMS-kode" : "med bookingnummer"}) som ${chat.customer.name || chat.contact?.name || "kunden"}. Bookinger: ${chat.customer.bookings.join(", ") || "ingen"}. Detaljerne står i værktøjssvaret tidligere i samtalen; kald get_bookings kun, hvis de mangler eller kan have ændret sig.`);
  } else if (chat.verifyLockedAt) {
    lines.push("Kunden er IKKE verificeret, og verificeringen er låst efter for mange forsøg. Eskalér, hvis kunden vil have hjælp med en booking.");
  } else if (chat.smsCode && chat.smsCode.expiresAt > now) {
    lines.push(`Kunden er IKKE verificeret endnu. Der er sendt en SMS-kode til nummeret, der slutter på ${chat.smsCode.to.slice(-2)}; når kunden skriver koden, kald verify_sms_code. Forsøg brugt: ${chat.verifyAttempts} af 5.`);
  } else {
    lines.push(`Kunden er IKKE verificeret. Spørger kunden til en ordre eller noget personligt: bed om bookingnummeret (ordrenummeret) og kald verify_customer. Har kunden det ikke, så tilbyd en kode på SMS (send_sms_code). Forsøg brugt: ${chat.verifyAttempts} af 5.`);
  }
  if (chat.lead) lines.push(`Kunden har allerede bestilt et designudkast i denne chat (lead ${chat.lead.id}). Bestil ikke igen, medmindre det er til et andet sted.`);
  if (chat.status === "waiting_human" && chat.escalation) {
    lines.push(`Sagen er sendt videre til en kollega kl. ${dkParts(chat.escalation.at).time} (${chat.escalation.urgent ? "AKUT" : "normal"}), som svarer ${chat.escalation.replyBy}. Giver kunden nye vigtige oplysninger bagefter (navn, telefonnummer, bookingnummer, en ny dato eller et nyt ønske), så kald escalate igen med dem, så kollegaen får dem på SMS. Ellers eskalér ikke igen; hjælp videre med det, du må.`);
  }
  if (chat.pendingChange) {
    const c = chat.pendingChange;
    lines.push(`Afventende datoforslag (changeId ${c.id}) for ${c.bookingId}: ${c.summary}. Kunden har endnu ikke sagt ja. Kald commit_date_change kun ved et klart ja i kundens seneste besked.`);
  }
  const s = settings;
  const periods = (Object.keys(PERIODS) as Period[]).map((k) => `${PERIODS[k].name} (${PERIODS[k].text.toLowerCase()}): ${kr(s.prices.periods[k])}`).join(", ");
  lines.push(
    "Aktuelle priser og regler for privat leje (fra admin, inkl. moms):",
    `- Boks, faste perioder: ${periods}. Dage før, efter eller mellem perioderne koster ${kr(s.prices.perExtraDay)} pr. ekstra dag, og kunden får altid den billigste kombination (5-7 dage koster højst en uge). check_availability giver den præcise pris for datoerne. Højst ${s.rules.maxDays} dage online.`,
    `- Printer: ${kr(s.prices.printer)} med ${s.printsIncluded} print. Temaer findes ikke længere.`,
    `- Tilvalg: Billederne gemt i ${KEEP_MONTHS} måneder (${kr(s.prices.keep)}). Uden tilvalget er eventsiden åben i ${GALLERY_MONTHS} måneder, og derefter sletter vi billederne. Tilvalget kan kun vælges ved booking.`,
    `- Højsæson: fredag til søndag i ${s.rules.peakMonths.map((m) => MONTH_NAMES[m - 1]).join(", ")}. En booking kan flyttes til datoer uden for højsæson, aldrig ind i højsæson.`,
    `- Første lejedag tidligst ${s.rules.leadDays} dage frem, højst ${s.rules.monthsAhead} måneder frem. Boksen sendes ${s.rules.shipDaysBefore} dage før første lejedag og skal være retur ${s.rules.returnDaysAfter} dage efter sidste.`,
    `- Online booking er ${s.open ? "åben" : "lukket lige nu (henvis til chatten/eskalér)"}.`,
  );
  return lines.join("\n");
}
