// All copy, prices and business rules for the landing page live here.
// Fill in the real B2C prices when they are decided: a `null` price shows "Få en pris".

export const business = {
  monthlyPricePerBox: 995, // kr. pr. boks pr. måned, ekskl. moms
  minPhotoPrice: 25, // laveste pris gæsten kan betale pr. foto
  costPerPhoto: 25, // papir og film 15 kr. + Selfi 10 kr.
};

export type Package = {
  id: string;
  name: string;
  period: string;
  price: number | null; // kr. inkl. moms
  popular?: boolean;
};

export const packages: Package[] = [
  { id: "dag", name: "Dag", period: "Én dag og aften", price: null },
  { id: "weekend", name: "Weekend", period: "Fredag til søndag", price: null, popular: true },
  { id: "uge", name: "Uge", period: "Syv dage", price: null },
];

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
    q: "Hvad koster en Selfi Boks til vores bar?",
    a: "995 kr. om måneden pr. boks, ekskl. moms. Gæsterne betaler selv for fotoene, og I vælger prisen.",
  },
  {
    q: "Hvordan tjener vi penge på den?",
    a: "Gæsten betaler pr. foto, mindst 25 kr. De 25 kr. dækker papir og drift. Alt over er jeres.",
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
    a: "Ja. I lejer for en dag, en weekend eller en uge. Skriv jeres dato, så vender vi tilbage med en pris.",
  },
] as const;
