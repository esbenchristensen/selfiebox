// PLADSHOLDERE til erhvervssiden. Alt herunder er opdigtet eller ikke besluttet endnu (21. okt. 2026).
// Siden er kun til internt brug, indtil felterne er skiftet ud med rigtige tal, navne og beslutninger.
// Så længe `PLACEHOLDERS_VISIBLE` er true, viser siden en gul kant og ordet "pladsholder" ved hvert felt
// (components/Placeholder.tsx), så ingen kan overse, hvad der mangler. Sæt den til false, når alt er rigtigt.
//
// Prioriteret liste over det, der mangler, står i ERHVERV-GENNEMGANG.md, afsnit 6.

export const PLACEHOLDERS_VISIBLE = false;

// Kontakt. Rigtige felter hører hjemme i lib/company.ts (de bruges også i vilkår og CE-erklæring).
export const contact = {
  phone: "", // intet telefonnummer endnu: siden viser e-mail og chat i stedet (24. okt. 2026)
  phoneHref: "",
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
  design: "Specialdesign af kabinettet: pris aftales",
};

// Printeren (selfi-printer-v4) til steder. Esben 23. okt. 2026: fra 2.000 kr./md., et print sælger typisk for 50 kr.,
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
