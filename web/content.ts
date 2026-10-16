// All copy, prices and business rules for the landing page live here.
// Private prices are set at half of Myselfie's (weekend ≈ 1.500 kr., base package 995 kr.).
// The week price has no Myselfie counterpart and is our own estimate. A `null` price shows
// "Pris bekræftes"; the booking is still a request that Selfi confirms.

export const business = {
  monthlyPricePerBox: 995, // kr. pr. boks pr. måned, ekskl. moms
  minPhotoPrice: 25, // laveste pris gæsten kan betale pr. foto
  costPerPhoto: 25, // papir og film 15 kr. + Selfi 10 kr.
};

export type PackageId = "dag" | "weekend" | "uge";

export type Package = {
  id: PackageId;
  name: string;
  period: string;
  includes: string;
  days: number; // how many calendar days a booking covers
  price: number | null; // kr. inkl. moms
  popular?: boolean;
};

export const packages: Package[] = [
  { id: "dag", name: "Dag", period: "Én dag og aften", includes: "Boks, stander og eventside", days: 1, price: 495 },
  { id: "weekend", name: "Weekend", period: "Fredag til søndag", includes: "Boks, stander og eventside", days: 3, price: 750, popular: true },
  { id: "uge", name: "Uge", period: "Syv dage i træk", includes: "Boks, stander og eventside", days: 7, price: 1250 },
];

export type Addon = { id: string; name: string; text: string; price: number | null };

export const addons: Addon[] = [
  { id: "film", name: "Ekstra Instax-film", text: "Flere printede fotos, så alle får et med hjem", price: null },
  { id: "tema", name: "Eget tema", text: "Jeres navne og dato på skærmen og i rammen på hvert foto", price: null },
];

export type DeliveryId = "afhent" | "levering" | "opsaetning";

export const deliveries: { id: DeliveryId; name: string; text: string; price: number | null; needsAddress: boolean }[] = [
  { id: "afhent", name: "Afhent selv", text: "Vi viser jer, hvordan den virker, når I henter den. Det tager fem minutter.", price: 0, needsAddress: false },
  { id: "levering", name: "Levering", text: "Vi bringer boksen dagen før og henter den dagen efter.", price: null, needsAddress: true },
  { id: "opsaetning", name: "Levering og opsætning", text: "Vi stiller boksen op, tester den og pakker ned igen bagefter.", price: null, needsAddress: true },
];

export const occasions = ["Bryllup", "Fødselsdag", "Firmafest", "Konfirmation", "Andet"];

export const booking = {
  leadDays: 3, // earliest start is this many days from today
  monthsAhead: 18, // how far ahead the calendar goes
};

export type ActivityId = "titler" | "missioner" | "skattejagt" | "rundtur" | "konkurrence" | "guldtid";

export const activities: { id: ActivityId; name: string; text: string }[] = [
  { id: "titler", name: "Titler", text: "Boksen kårer aftenens største smil og største gruppe og stempler titlen på billedet." },
  { id: "missioner", name: "Missioner", text: "Små opgaver på skærmen, fx at tage et billede med en, man ikke kender. Kameraet tjekker, om I klarede den." },
  { id: "skattejagt", name: "Skattejagt", text: "Gæsterne følger spor fra boks til boks gennem en lille historie. Kræver flere bokse." },
  { id: "rundtur", name: "Rundtur", text: "Gæsterne samler et stempel ved hver boks på ruten, fx på en barrunde eller en festival." },
  { id: "konkurrence", name: "Konkurrence", text: "Gæsterne stemmer på aftenens bedste billede, og vinderen får en præmie." },
  { id: "guldtid", name: "Guldtid", text: "I korte, synlige vinduer vinder næste billede en præmie, fx en gratis øl. Det skaber kø på få sekunder." },
];

// A rented party box is one box for one night: no multi-box games and no bar prizes.
export const privateActivities: ActivityId[] = ["titler", "missioner", "konkurrence"];

export const specs = [
  ["Mål", "234 × 306 × 66 mm"],
  ["Skærm", "10\" touch, stående"],
  ["Kamera", "12 MP, 120° vidvinkel"],
  ["Lys", "Lysring, CRI 90+, 4000 K"],
  ["Foto", "Instax Square, 62 × 62 mm"],
  ["Montering", "Væg med tyverilås eller stander"],
] as const;

export type Faq = { q: string; a: string };

// Private hosts: the party, the price and the logistics. Nothing about running a venue.
export const faqPrivate: Faq[] = [
  {
    q: "Hvad koster det at leje en fotoboks?",
    a: "En dag koster 495 kr., en weekend 750 kr. og en uge 1.250 kr., inkl. moms. Ubegrænsede billeder, stander og jeres egen eventside med alle fotos er med i prisen.",
  },
  {
    q: "Hvordan får gæsterne billederne?",
    a: "Efter hvert billede viser skærmen en QR-kode, og gæsten kan også få et link på SMS. Alle billeder fra festen samles på jeres egen eventside, så I kan finde og dele dem bagefter. Med fotomodulet får gæsterne også et printet Instax-foto i hånden.",
  },
  {
    q: "Hvordan får vi boksen ud til festen?",
    a: "I kan hente den selv, få den leveret dagen før og hentet dagen efter, eller få os til at stille den op og pakke den ned. Boksen står på en stander og skal kun bruge en almindelig stikkontakt.",
  },
  {
    q: "Kan vi få vores navne på billederne?",
    a: "Ja. Med et eget tema kommer jeres navne og dato, eller firmaets logo, på skærmen og i rammen på hvert foto.",
  },
  {
    q: "Skal nogen passe boksen under festen?",
    a: "Nej. Gæsterne trykker, tager billedet og får det selv. Skærmen tæller ned fra 3, så alle kan nå at komme med.",
  },
  {
    q: "Kan vi leje boksen til en firmafest eller julefrokost?",
    a: "Ja. En firmafest bookes ligesom en privat fest: Vælg datoer i kalenderen, så bekræfter vi på mail. Skal boksen hænge fast hos jer, fx i en bar eller på et hotel, har vi en månedlig aftale til faste steder.",
  },
];

// Venues: what it earns, how it runs, what the law allows. Nothing about wedding dates.
export const faqBusiness: Faq[] = [
  {
    q: "Hvad koster en fotoboks til en bar eller et hotel?",
    a: "995 kr. om måneden pr. boks, ekskl. moms. Boks, lysring, skærm, fotomodul og kontrolpanel er med i prisen.",
  },
  {
    q: "Hvad gør boksen for vores bar eller hotel?",
    a: "Den giver gæsterne noget at samles om og en grund til at blive. Jeres navn står i rammen på hvert foto, så hver deling er omtale, og gæstelisten giver jer en direkte vej til at invitere dem igen.",
  },
  {
    q: "Kan vi samle telefonnumre og sende SMS til vores gæster?",
    a: "Ja. Gæsten skriver sit nummer for at få billedet på SMS og kan samtidig sige ja til at modtage tilbud fra jer. Kun de numre, der har sagt ja, kan bruges til markedsføring, så I bygger en gæsteliste, der holder over for reglerne.",
  },
  {
    q: "Skal personalet hjælpe gæsterne?",
    a: "Nej. Gæsterne trykker, tager billedet og får det selv. I styrer tema, tekster, priser og aktiviteter fra et kontrolpanel på nettet.",
  },
  {
    q: "Kan gæsterne betale for de printede fotos?",
    a: "Ja, som tilvalg. I sætter prisen pr. foto, og alt over 25 kr. går til jer, så boksen kan tjene sig selv hjem.",
  },
  {
    q: "Kan boksen få vores farver og logo?",
    a: "Ja. Med et tema laver vi boksens sider og lysringen i jeres farver, og jeres logo kommer på skærmen og i rammen på hvert foto.",
  },
  {
    q: "Hvordan sidder boksen fast?",
    a: "Den hænger på væggen med tyverilås eller står på en stander. Den er kun 6,6 cm dyb og skal bruge en almindelig stikkontakt.",
  },
];
