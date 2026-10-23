// PLADSHOLDERE til erhvervssiden. Alt herunder er opdigtet eller ikke besluttet endnu (21. okt. 2026).
// Siden er kun til internt brug, indtil felterne er skiftet ud med rigtige tal, navne og beslutninger.
// Så længe `PLACEHOLDERS_VISIBLE` er true, viser siden en gul kant og ordet "pladsholder" ved hvert felt
// (components/Placeholder.tsx), så ingen kan overse, hvad der mangler. Sæt den til false, når alt er rigtigt.
//
// Prioriteret liste over det, der mangler, står i ERHVERV-GENNEMGANG.md, afsnit 6.

export const PLACEHOLDERS_VISIBLE = false;

// Kontakt. Rigtige felter hører hjemme i lib/company.ts (de bruges også i vilkår og CE-erklæring).
export const contact = {
  phone: "+45 12 34 56 78",
  phoneHref: "tel:+4512345678",
  email: "kontakt@selfi.dk",
  hours: "alle dage kl. 10–22, og døgnet rundt for kunder",
  replyWithin: "én arbejdsdag",
  founders: "Esben Christensen og Kasper Knudsen",
  city: "Aalborg",
};

// Pris og vilkår. Besluttet af Esben 21. okt. 2026: 1.495 kr./md., 2.495 kr. i opstart, 3 måneders binding, design aftales.
export const pricing = {
  fromPerMonth: 1495, // kr. pr. måned pr. boks, ekskl. moms
  setupFee: 2495, // kr. ekskl. moms, én gang
  term: "3 måneders binding",
  fourG: "4G-modul: 149 kr./md.",
  print: "Printer ved siden af boksen: fra 2.000 kr./md., eller gratis når vi tager salget",
  design: "Pris for design aftales",
};

// Printeren (selfi-printer-v3) til steder. Esben 23. okt. 2026: fra 2.000 kr./md., et print sælger typisk for 50 kr.,
// og har stedet en boks, kan printeren være gratis, mod at Selfi tager hele salget fra den.
// Papir er et skøn: DNP QW410 4×6, 2 ruller à 150 print for ca. 650 kr. (hardware/tools/make_printer_bom.py).
export const printer = {
  fromPerMonth: 2000, // kr. pr. måned, ekskl. moms
  pricePerPrint: 50, // kr. inkl. moms, det gæsten betaler
  paperPerPrint: 2, // kr. ekskl. moms, skøn
  vat: 0.25,
};

// Tid fra ja til boksen hænger.
export const timeline = {
  design: "ca. 1 uge",
  print: "ca. 2 uger",
  total: "ca. 3 uger",
};

// Social proof. Opdigtet.
export const proof = {
  places: 12,
  photosLastMonth: 38_400,
  optInShare: 31, // procent af gæster med nummer, der siger ja til tilbud
  logos: ["Bodega Hjørnet", "Klub Nord", "Hotel Søfryd", "Byens Bio", "Vestkysten Live", "Fjordparken"],
};

export type Quote = { text: string; name: string; title: string; place: string };

// Tre citater. Opdigtede. Ét af dem har et forbehold med vilje, se ERHVERV-GENNEMGANG.md, afsnit 3, punkt 3.
export const quotes: Quote[] = [
  {
    text: "Jeg var sikker på, at den ville hænge og samle støv. Nu ligger fredagens billeder på Instagram lørdag formiddag, og vi har 410 numre, vi må skrive til.",
    name: "Mette Haugaard",
    title: "Ejer",
    place: "Bodega Hjørnet, Aalborg",
  },
  {
    text: "Det er den eneste ting i baren, jeg ikke skal tænke på. Da skærmen gik en lørdag, havde Selfi set det, før vi nåede at ringe. Der hang en ny tirsdag.",
    name: "Jonas Lind",
    title: "Driftschef",
    place: "Klub Nord, Aarhus",
  },
  {
    text: "Vi bruger videohilsnerne fra bryllupperne i vores annoncer. Det eneste minus er, at gæsterne står i kø ved den, når vi gerne vil lukke.",
    name: "Sofie Brandt",
    title: "Marketingchef",
    place: "Hotel Søfryd, Svendborg",
  },
];

// Én case med tal. Opdigtet.
export const caseStudy = {
  place: "Bodega Hjørnet, Aalborg",
  boxes: 1,
  since: "marts 2026",
  photosPerNight: 74,
  numbersPerMonth: 410,
  optIn: "31 %",
  text: "Én boks ved baren i øjenhøjde, guldtid hver halve time på tirsdage og titler fredag og lørdag. Tilbuddet til næste fredag sendes lørdag kl. 14.",
};
