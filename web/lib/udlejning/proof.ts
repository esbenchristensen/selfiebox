// Social proof på forsiden: bedømmelse, antal anmeldelser, antal fester og seks anmeldelser.
//
// PLADSHOLDER. Tallene og anmeldelserne herunder er eksempler, ikke rigtige kunder. Skift dem ud med
// rigtige anmeldelser (Trustpilot eller Google) og rigtige tal, og sæt `placeholder` til false, før siden
// markedsføres. Så længe placeholder er true, viser siden et lille "Eksempel"-mærke ved tallene og
// anmeldelserne, og bedømmelsen kommer ikke med i de strukturerede data til Google. Opdigtede
// anmeldelser er vildledende markedsføring (markedsføringsloven § 5), så mærket må ikke fjernes uden tal.

export const PROOF = {
  placeholder: true,
  rating: 4.9, // gennemsnit på Trustpilot eller Google
  reviewCount: 186,
  parties: 1200, // fester, boksen har været med til
  trustpilotUrl: "https://dk.trustpilot.com/review/selfi.dk",
};

export type Review = {
  name: string;
  occasion: string;
  city: string;
  when: string;
  stars: 1 | 2 | 3 | 4 | 5;
  text: string;
};

// Korte, konkrete og med én ting, der kunne være bedre. Kun fem stjerner hele vejen virker utroværdigt.
export const REVIEWS: Review[] = [
  {
    name: "Sofie og Mads",
    occasion: "Bryllup",
    city: "Aarhus",
    when: "juni 2026",
    stars: 5,
    text: "Boksen stod i hjørnet af laden og var i gang hele natten. Vi fik 340 billeder, og det er dem, vi kigger på i dag, ikke fotografens.",
  },
  {
    name: "Karsten",
    occasion: "60-års fødselsdag",
    city: "Hjørring",
    when: "maj 2026",
    stars: 5,
    text: "Nem at sætte op, og børnebørnene kunne finde ud af den med det samme. Billederne lå på telefonen, før vi havde sat os igen.",
  },
  {
    name: "Louise",
    occasion: "Konfirmation",
    city: "Roskilde",
    when: "april 2026",
    stars: 5,
    text: "Konfirmanden og vennerne gik i boksen igen og igen. Printene hang på køleskabet dagen efter.",
  },
  {
    name: "Mette, HR",
    occasion: "Julefrokost",
    city: "København",
    when: "december 2025",
    stars: 4,
    text: "Kollegerne stod i kø hele aftenen. Vi skulle have taget printeren med, det gør vi næste år.",
  },
  {
    name: "Anders",
    occasion: "Studenterfest",
    city: "Odense",
    when: "juni 2026",
    stars: 5,
    text: "Kom med posten som lovet, og returen tog fem minutter i pakkeshoppen. Billederne var skarpe, selv om festen var i en mørk kælder.",
  },
  {
    name: "Nanna og Jonas",
    occasion: "Bryllup",
    city: "Aalborg",
    when: "august 2026",
    stars: 5,
    text: "Vores navne og datoen stod på alle billederne. Gæsterne fik dem med det samme, og vi havde dem alle samlet dagen efter.",
  },
];

/** "4,9" */
export const ratingText = (n: number) => n.toLocaleString("da-DK", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
