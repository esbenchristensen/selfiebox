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
  { id: "film", name: "Ekstra film", text: "Flere fotos, så ingen går hjem uden", price: null },
  { id: "tema", name: "Eget tema", text: "Jeres navne og dato på skærmen og fotorammen", price: null },
];

export type DeliveryId = "afhent" | "levering" | "opsaetning";

export const deliveries: { id: DeliveryId; name: string; text: string; price: number | null; needsAddress: boolean }[] = [
  { id: "afhent", name: "Afhent selv", text: "Vi viser jer, hvordan den virker, når I henter den.", price: 0, needsAddress: false },
  { id: "levering", name: "Levering", text: "Vi bringer boksen dagen før og henter den dagen efter.", price: null, needsAddress: true },
  { id: "opsaetning", name: "Levering og opsætning", text: "Vi stiller op, tester og pakker ned igen.", price: null, needsAddress: true },
];

export const occasions = ["Bryllup", "Fødselsdag", "Firmafest", "Konfirmation", "Andet"];

export const booking = {
  leadDays: 3, // earliest start is this many days from today
  monthsAhead: 18, // how far ahead the calendar goes
};

export const activities = [
  { id: "titler", name: "Titler", text: "Boksen kårer aftenens største smil og største gruppe." },
  { id: "missioner", name: "Missioner", text: "Små opgaver på skærmen, som kameraet tjekker." },
  { id: "skattejagt", name: "Skattejagt", text: "En fortælling med spor fordelt på flere bokse." },
  { id: "rundtur", name: "Rundtur", text: "Gæsterne samler stempler ved hver boks." },
  { id: "konkurrence", name: "Konkurrence", text: "Gæsterne stemmer på aftenens bedste foto." },
  { id: "guldtid", name: "Guld tid", text: "I korte vinduer vinder næste foto en præmie." },
] as const;

export const specs = [
  ["Mål", "234 × 306 × 66 mm"],
  ["Skærm", "10\" touch, stående"],
  ["Kamera", "12 MP, 120° vidvinkel"],
  ["Lys", "Lysring, CRI 90+, 4000 K"],
  ["Foto", "Instax Square, 62 × 62 mm"],
  ["Montering", "Væg med tyverilås eller stander"],
] as const;

export const faq = [
  {
    q: "Hvad gør boksen for vores sted?",
    a: "Den giver gæsterne noget at samles om, et foto med hjem og en grund til at dele aftenen. Jeres navn står i rammen på hvert foto.",
  },
  {
    q: "Hvad koster en Selfi Boks til vores bar?",
    a: "995 kr. om måneden pr. boks, ekskl. moms. Vil I, kan gæsterne betale pr. foto som tilvalg, så boksen tjener sig selv hjem.",
  },
  {
    q: "Hvordan får gæsterne fotoene?",
    a: "Hvert event får sin egen side med alle aftenens fotos, så gæsterne kan finde og dele deres billeder bagefter. Med fotomodulet får de også et ægte Instax-foto i hånden.",
  },
  {
    q: "Skal personalet hjælpe gæsterne?",
    a: "Nej. Gæsterne trykker, betaler og får fotoet selv. I styrer pris, tema og aktiviteter fra et kontrolpanel.",
  },
  {
    q: "Hvad skal boksen bruge?",
    a: "En stikkontakt og enten en væg eller plads til en stander.",
  },
  {
    q: "Kan vi få boksen i vores egne farver?",
    a: "Ja. Et tema ændrer boksens sider, lysringen, skærmen og rammen på hvert foto. Vi laver det sammen med jer.",
  },
  {
    q: "Kan vi leje en boks til et bryllup eller en fest?",
    a: "Ja. En dag koster 495 kr., en weekend 750 kr. og en uge 1.250 kr., inkl. moms. I booker direkte i kalenderen her på siden, og vi bekræfter datoerne på mail.",
  },
] as const;
