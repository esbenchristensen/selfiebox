// Every mail a B2C customer can get from Selfi, with its default texts. Admin can rewrite the texts
// (subject, preheader, heading, body, button) in admin.selfi.dk → Udlejning → Mails; the rewritten ones are
// stored in MongoDB (mail_templates) and laid over these defaults. The fixed parts (the order summary,
// the steps, the tracking number) are built here from the booking, so they are always right.
//
// Texts follow web/TEKSTSTRATEGI.md: "I" and "jeres", concrete, no emojis and no exclamation marks.
// Selfi never mounts the box; the customer collects it at a parcel shop and sets it up on the stand.
//
// Samme fil i selfiebox (web/lib/mail/) og selfiebox-platform (web/src/lib/mail/). Hold de to kopier ens.

import type { Block, Email } from "./render";

export type MailKind =
  | "bekraeftelse"
  | "opsaet_paamindelse"
  | "sendt"
  | "klar_til_fest"
  | "tak"
  | "retur_paamindelse"
  | "modtaget"
  | "ombooking"
  | "konflikt"
  | "annulleret"
  | "refunderet"
  | "ikke_gennemfoert"
  | "fri_besked";

/** The parts of a mail admin can rewrite. {fornavn}, {periode} … are filled in from the booking. */
export type MailTexts = { subject: string; preheader: string; heading: string; body: string; button: string };

/** What the templates need to know about a booking. Both repos' RentalDoc fit this shape. */
export type MailBooking = {
  _id: string;
  token?: string;
  status: string;
  from: string;
  to: string;
  days: number;
  printer: boolean;
  photoType: "strip" | "polaroid";
  address: { street: string; zip: string; city: string } | null;
  contact: { name: string; email: string; phone: string };
  lines: { id: string; label: string; amount: number }[];
  total: number;
  trackingOut?: string;
  trackingBack?: string;
  stripe?: { amountPaid?: number; refunded?: number };
  party?: { slug?: string } | null;
};

export type MailContext = {
  booking: MailBooking;
  shipDaysBefore: number; // from the rental settings
  site: string; // https://www.selfi.dk
  portal: string; // https://foto.selfi.dk (setup portal and photo portal)
  phone?: string; // Selfi's phone, when set in company.ts
  refund?: number; // kr., for "refunderet" and "annulleret"
  oldRange?: { from: string; to: string }; // for "ombooking"
};

export const KINDS: Record<MailKind, { name: string; when: string; auto: boolean; defaultOn?: boolean }> = {
  bekraeftelse: { name: "Bookingbekræftelse", when: "Automatisk, når betalingen er gået igennem", auto: true, defaultOn: true },
  opsaet_paamindelse: { name: "Påmindelse: sæt boksen op", when: "Automatisk 3 dage før afsendelse, hvis opsætningen ikke er lavet", auto: true, defaultOn: true },
  sendt: { name: "Boksen er sendt", when: "Fra admin, når bookingen markeres som sendt (med sporing)", auto: false },
  klar_til_fest: { name: "I morgen er det fest", when: "Automatisk dagen før første lejedag", auto: true, defaultOn: true },
  tak: { name: "Tak for festen + fotoportal", when: "Automatisk dagen efter sidste lejedag", auto: true, defaultOn: true },
  retur_paamindelse: { name: "Påmindelse om retur", when: "Automatisk om morgenen den dag, boksen senest skal afleveres", auto: true, defaultOn: true },
  modtaget: { name: "Boksen er kommet hjem", when: "Fra admin, når boksen er modtaget og tjekket", auto: false },
  ombooking: { name: "Ombooking", when: "Fra admin, når datoerne flyttes", auto: false },
  konflikt: { name: "Datoerne er taget", when: "Fra admin, når en betaling kom ind, efter datoerne var givet fri", auto: false },
  annulleret: { name: "Aflysning", when: "Fra admin, når bookingen annulleres", auto: false },
  refunderet: { name: "Refusion", when: "Automatisk, når Stripe har refunderet", auto: true, defaultOn: true },
  ikke_gennemfoert: { name: "Booking ikke gennemført", when: "Automatisk, når betalingssiden udløb uden betaling", auto: true, defaultOn: false },
  fri_besked: { name: "Fri besked", when: "Fra admin, når som helst", auto: false },
};

export const DEFAULT_TEXTS: Record<MailKind, MailTexts> = {
  bekraeftelse: {
    subject: "Booking bekræftet: Selfi Boks {periode}",
    preheader: "Boksen er reserveret til jer. Sæt den op til festen, når I har tid.",
    heading: "Tak, {fornavn}. Boksen er jeres.",
    body: "Vi har reserveret Selfi Boks til jer {periode}. Betalingen er gået igennem, og kvitteringen fra Stripe kommer i en mail for sig.\n\nNu kan I sætte boksen op til festen: overskrift, stemning og tekster til aftenen. I kan se boksen live og tage et testbillede med jeres eget kamera, før den kommer.",
    button: "Sæt boksen op",
  },
  opsaet_paamindelse: {
    subject: "Sæt boksen op, før vi sender den",
    preheader: "Det tager 5 minutter: overskrift, stemning og tekster til festen.",
    heading: "Boksen sendes {afsendelse}.",
    body: "Vi pakker boksen om få dage. Sæt den op nu, så den er klar med jeres overskrift, stemning og tekster, når I tænder for den.\n\nDet tager omkring 5 minutter, og I kan rette det helt frem til festen. Springer I over, kører boksen med vores standardtema.",
    button: "Sæt boksen op",
  },
  sendt: {
    subject: "Boksen er på vej til jer",
    preheader: "Den er i pakkeshoppen senest dagen før {forste_dag}.",
    heading: "Boksen er på vej.",
    body: "Vi har sendt Selfi Boks til den dao-pakkeshop, der ligger nærmest {adresse}. Den er fremme senest dagen før {forste_dag}, og I får en sms eller mail fra dao, når den kan hentes.",
    button: "Følg pakken",
  },
  klar_til_fest: {
    subject: "I morgen er det fest",
    preheader: "Sådan får I boksen op at køre på få minutter.",
    heading: "Klar til i morgen, {fornavn}?",
    body: "Har I ikke hentet pakken endnu, så gør det i dag. Her er det, I skal bruge for at komme i gang.",
    button: "Ret opsætningen",
  },
  tak: {
    subject: "Tak for festen. Her er jeres billeder",
    preheader: "Alle billeder fra boksen ligger på jeres fotoportal.",
    heading: "Tak for festen, {fornavn}.",
    body: "Alle billeder fra boksen ligger på jeres fotoportal. Del linket med gæsterne, så kan de hente deres egne. Portalen er åben i mindst 3 måneder, så hent de billeder, I vil gemme.",
    button: "Se billederne",
  },
  retur_paamindelse: {
    subject: "Husk at aflevere boksen i dag",
    preheader: "Returlabelen ligger i kassen, og fragten er betalt.",
    heading: "Boksen skal retur i dag.",
    body: "I dag er sidste dag for at aflevere boksen i en dao-pakkeshop. Returlabelen ligger i kassen, og fragten er betalt.\n\nHar I allerede afleveret den, så tak. Så kan I se bort fra denne mail. Bliver I forsinkede, så svar på mailen, så finder vi ud af det.",
    button: "",
  },
  modtaget: {
    subject: "Boksen er kommet hjem",
    preheader: "Alt er i orden. Tak fordi I passede på den.",
    heading: "Boksen er kommet hjem.",
    body: "Vi har fået boksen retur og tjekket den. Alt er i orden, så bookingen er afsluttet.\n\nVi vil gerne høre, hvordan det gik. Svar på denne mail med et par ord, så bliver boksen bedre til næste fest.",
    button: "Se billederne igen",
  },
  ombooking: {
    subject: "Nye datoer: {periode}",
    preheader: "Jeres booking {booking} er flyttet.",
    heading: "Jeres booking er flyttet.",
    body: "Som aftalt har vi flyttet jeres booking til {periode}. Prisen er den samme, og I skal ikke gøre noget.",
    button: "",
  },
  konflikt: {
    subject: "Vi skal finde en ny dato til jer",
    preheader: "Betalingen kom ind, efter datoerne var givet videre.",
    heading: "Vi skal lige finde en løsning.",
    body: "Jeres betaling kom igennem, lige efter datoerne {periode} var givet videre til en anden fest. Det er vores fejl, at det kunne ske, og I får selvfølgelig enten en anden dato eller pengene tilbage.\n\nSvar på denne mail med, hvad I foretrækker, så ordner vi det med det samme.",
    button: "",
  },
  annulleret: {
    subject: "Jeres booking er annulleret",
    preheader: "Booking {booking} er aflyst.",
    heading: "Jeres booking er annulleret.",
    body: "Vi har annulleret jeres booking af Selfi Boks {periode}.\n\nHar I spørgsmål, så svar på denne mail.",
    button: "",
  },
  refunderet: {
    subject: "Vi har refunderet {refusion}",
    preheader: "Pengene er på vej tilbage til jeres kort.",
    heading: "{refusion} er på vej tilbage.",
    body: "Vi har refunderet {refusion} for booking {booking}. Beløbet går tilbage til det kort, I betalte med, og plejer at være der inden for 5–10 bankdage.",
    button: "",
  },
  ikke_gennemfoert: {
    subject: "Jeres booking blev ikke gennemført",
    preheader: "Datoerne er ikke reserveret. Book igen, hvis de stadig er ledige.",
    heading: "Bookingen blev ikke gennemført.",
    body: "Betalingen for Selfi Boks {periode} blev ikke gennemført, så datoerne er ikke reserveret til jer. I er ikke blevet trukket.\n\nVil I stadig have boksen, så book igen. Datoerne er ledige, til en anden tager dem.",
    button: "Book igen",
  },
  fri_besked: {
    subject: "Om jeres booking {booking}",
    preheader: "",
    heading: "Hej {fornavn}",
    body: "",
    button: "",
  },
};

// ---------------------------------------------------------------------------------------------------------

const MONTHS = ["januar", "februar", "marts", "april", "maj", "juni", "juli", "august", "september", "oktober", "november", "december"];
const DAYS = ["søndag", "mandag", "tirsdag", "onsdag", "torsdag", "fredag", "lørdag"];
const parse = (k: string) => {
  const [y, m, d] = k.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
};
const key = (t: Date) => t.toISOString().slice(0, 10);
export const addDays = (k: string, n: number) => key(new Date(parse(k).getTime() + n * 864e5));
const dayName = (k: string) => `${DAYS[parse(k).getUTCDay()]} d. ${parse(k).getUTCDate()}. ${MONTHS[parse(k).getUTCMonth()]}`;
const shortDay = (k: string) => `${parse(k).getUTCDate()}. ${MONTHS[parse(k).getUTCMonth()]}`;
const range = (r: { from: string; to: string }) => (r.from === r.to ? dayName(r.from) : `${dayName(r.from)} – ${dayName(r.to)}`);
const kr = (n: number) => `${n.toLocaleString("da-DK")} kr.`;

/** The first weekday after the last day: when the box must be at the parcel shop again (lejebetingelser § 6). */
export function returnBy(to: string): string {
  let k = addDays(to, 1);
  while ([0, 6].includes(parse(k).getUTCDay())) k = addDays(k, 1);
  return k;
}
export const shipDay = (b: Pick<MailBooking, "from">, shipDaysBefore: number) => addDays(b.from, -shipDaysBefore);

/** dao's tracking page. A tracking field that is already a link is used as it is. */
export const trackingUrl = (t: string) => (/^https?:\/\//.test(t) ? t : `https://www.dao.as/privat/find-din-pakke?stregkode=${encodeURIComponent(t)}`);

export const setupUrl = (c: MailContext) =>
  c.booking.token ? `${c.portal}/opsaet/${encodeURIComponent(c.booking._id)}?t=${encodeURIComponent(c.booking.token)}` : `${c.site}/`;
export const portalUrl = (c: MailContext) => (c.booking.party?.slug ? `${c.portal}/f/${c.booking.party.slug}` : null);

/** The {placeholders} admin can use in the texts, with what each one becomes for this booking. */
export function variables(c: MailContext): Record<string, string> {
  const b = c.booking;
  return {
    fornavn: b.contact.name.trim().split(/\s+/)[0] ?? "",
    navn: b.contact.name,
    booking: b._id,
    periode: range(b),
    forste_dag: dayName(b.from),
    sidste_dag: dayName(b.to),
    afsendelse: dayName(shipDay(b, c.shipDaysBefore)),
    retur_senest: dayName(returnBy(b.to)),
    adresse: b.address ? `${b.address.street}, ${b.address.zip} ${b.address.city}` : "jeres adresse",
    total: kr(b.total),
    refusion: kr(c.refund ?? b.stripe?.refunded ?? b.total),
    gamle_periode: c.oldRange ? range(c.oldRange) : "",
    sporing: b.trackingOut ?? "",
    opsaet_link: setupUrl(c),
    fotoportal_link: portalUrl(c) ?? "",
  };
}
export const VARIABLE_HELP: Record<string, string> = {
  fornavn: "Kundens fornavn",
  navn: "Kundens fulde navn",
  booking: "Bookingnummer",
  periode: "Lejeperioden, fx fredag d. 11. juni – lørdag d. 12. juni",
  forste_dag: "Første lejedag",
  sidste_dag: "Sidste lejedag",
  afsendelse: "Dagen vi sender boksen",
  retur_senest: "Sidste dag for aflevering",
  adresse: "Kundens adresse",
  total: "Pris i alt",
  refusion: "Refunderet beløb",
  gamle_periode: "De gamle datoer (ombooking)",
  sporing: "Sporingsnummer ud",
  opsaet_link: "Link til opsætningen",
  fotoportal_link: "Link til fotoportalen",
};

export const fill = (s: string, v: Record<string, string>) => s.replace(/\{(\w+)\}/g, (m, k: string) => (k in v ? v[k] : m));

/** Builds one mail: the (possibly edited) texts with placeholders filled in, plus the fixed blocks. */
export function buildMail(kind: MailKind, c: MailContext, texts?: Partial<MailTexts>): Email {
  const v = variables(c);
  const t = { ...DEFAULT_TEXTS[kind], ...Object.fromEntries(Object.entries(texts ?? {}).filter(([, x]) => typeof x === "string")) } as MailTexts;
  const T = (s: string) => fill(s, v);
  const b = c.booking;
  const portal = portalUrl(c);
  const blocks: Block[] = [];
  const intro = () => T(t.body) && blocks.push({ type: "text", text: T(t.body) });
  const button = (href: string | null, secondary = false) => t.button && href && blocks.push({ type: "button", label: T(t.button), href, secondary });
  const help = c.phone ? `Ring på ${c.phone} eller svar på denne mail.` : "Svar på denne mail, så vender vi tilbage hurtigst muligt.";

  switch (kind) {
    case "bekraeftelse":
      intro();
      button(setupUrl(c));
      blocks.push(
        {
          type: "summary",
          label: "Jeres booking",
          rows: b.lines.map((l) => [l.label, kr(l.amount)]),
          total: ["I alt inkl. moms", kr(b.total)],
        },
        {
          type: "steps",
          label: "Sådan foregår det",
          items: [
            { title: `Vi sender boksen ${shortDay(shipDay(b, c.shipDaysBefore))}`, text: `Til den dao-pakkeshop, der ligger nærmest ${v.adresse}. Den er fremme senest dagen før, og dao giver jer besked.` },
            { title: "I henter og tester", text: `Sæt strøm til boksen, så snart I har hentet den, og se, at den starter. Virker den ikke, så skriv til os med det samme, så vi kan nå at sende en ny.${b.printer ? " Printeren kommer i sin egen kasse og finder selv boksen." : ""}` },
            { title: `Retur senest ${shortDay(returnBy(b.to))}`, text: "Pak boksen i kassen, sæt returlabelen på, og aflever den i en dao-pakkeshop. Fragten er betalt. Gem kvitteringen fra pakkeshoppen." },
          ],
        },
        { type: "note", label: "Bindende booking", text: "Bookingen er bindende. Der er ingen fortrydelsesret, fordi boksen er lejet til jeres fest på bestemte datoer, og den kan ikke afbestilles. I kan flytte den til ledige datoer uden for højsæson, så længe boksen ikke er sendt. Lejebetingelserne står på selfi.dk/lejebetingelser." },
        { type: "code", label: "Bookingnummer", value: b._id },
      );
      break;
    case "opsaet_paamindelse":
      intro();
      button(setupUrl(c));
      blocks.push({ type: "code", label: "Bookingnummer", value: b._id });
      break;
    case "sendt":
      intro();
      if (b.trackingOut) {
        button(trackingUrl(b.trackingOut));
        blocks.push({ type: "code", label: "Sporingsnummer", value: b.trackingOut, href: trackingUrl(b.trackingOut) });
      }
      blocks.push(
        {
          type: "steps",
          label: "Når I henter pakken",
          items: [
            { title: "Tag billedlegitimation med", text: "Eller send en anden med jeres sporingsnummer. Pakken vejer under 5 kg." },
            { title: "Gem kassen og returlabelen", text: `I skal bruge dem til at sende boksen retur senest ${shortDay(returnBy(b.to))}.` },
          ],
        },
        { type: "note", text: `Har I ikke sat boksen op endnu, kan I nå det nu: [sæt boksen op](${setupUrl(c)}).` },
      );
      break;
    case "klar_til_fest":
      intro();
      blocks.push({
        type: "steps",
        label: "Fra kasse til første billede",
        items: [
          { title: "Stil stativet op", text: "Der, hvor gæsterne går forbi, med lidt plads foran til at stå flere på billedet." },
          { title: "Sæt boksen på, og sæt strøm til", text: "Boksen starter selv og viser jeres startskærm efter et minuts tid." },
          { title: "Kobl på wifi", text: "Følg vejledningen på skærmen. Uden internet tager boksen stadig billeder, og de kommer på portalen, når den er online igen." },
          ...(b.printer ? [{ title: "Tænd printeren", text: "Den forbinder sig selv til boksen. Papir til jeres print ligger i kassen." }] : []),
        ],
      });
      if (portal) blocks.push({ type: "note", label: "Jeres fotoportal", text: `Gæsterne finder billederne på [${portal.replace(/^https?:\/\//, "")}](${portal}). Boksen viser også en QR-kode til portalen.` });
      button(setupUrl(c), true);
      blocks.push({ type: "note", label: "Brug for hjælp", text: help });
      break;
    case "tak":
      intro();
      button(portal ?? `${c.site}/`);
      blocks.push({
        type: "steps",
        label: `Sådan sender I boksen retur senest ${shortDay(returnBy(b.to))}`,
        items: [
          { title: "Pak boksen i kassen", text: `Læg den i skummet, som da den kom, med stativ og strømforsyning.${b.printer ? " Printeren i sin egen kasse." : ""}` },
          { title: "Sæt returlabelen på", text: "Den ligger i plastlommen på låget. Fragten er betalt." },
          { title: "Aflever i en dao-pakkeshop", text: "Hvilken som helst. Gem kvitteringen, til vi har meldt tilbage." },
        ],
      });
      break;
    case "retur_paamindelse":
      intro();
      blocks.push({ type: "code", label: "Bookingnummer", value: b._id });
      break;
    case "modtaget":
      intro();
      button(portal, true);
      break;
    case "ombooking":
      intro();
      blocks.push({
        type: "summary",
        label: "Jeres nye datoer",
        rows: [
          ...(c.oldRange ? ([["Før", range(c.oldRange)]] as [string, string][]) : []),
          ["Nu", range(b)],
          ["Vi sender boksen", dayName(shipDay(b, c.shipDaysBefore))],
          ["Retur senest", dayName(returnBy(b.to))],
        ],
      });
      blocks.push({ type: "code", label: "Bookingnummer", value: b._id });
      break;
    case "konflikt":
      intro();
      blocks.push({ type: "code", label: "Bookingnummer", value: b._id });
      break;
    case "annulleret":
      intro();
      if (c.refund) blocks.push({ type: "note", label: "Refusion", text: `Vi refunderer ${kr(c.refund)} til det kort, I betalte med. Beløbet plejer at være der inden for 5–10 bankdage.` });
      blocks.push({ type: "code", label: "Bookingnummer", value: b._id });
      break;
    case "refunderet":
      intro();
      blocks.push({
        type: "summary",
        label: "Refusion",
        rows: [
          ["Betalt", kr(b.stripe?.amountPaid ?? b.total)],
          ["Refunderet", v.refusion],
        ],
      });
      break;
    case "ikke_gennemfoert":
      intro();
      button(`${c.site}/`);
      break;
    case "fri_besked":
      intro();
      blocks.push({ type: "code", label: "Bookingnummer", value: b._id });
      break;
  }

  return {
    subject: T(t.subject),
    preheader: T(t.preheader),
    label: `Booking ${b._id}`,
    heading: T(t.heading),
    blocks,
    reason: `I får denne mail, fordi ${b.contact.email} har booket Selfi Boks (${b._id}).`,
  };
}
