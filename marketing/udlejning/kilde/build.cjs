// Tryksager til B2C-udlejning med posten. Bruger brandpakkens fonte, farver, logo og boksgrafik.
// Kør: NODE_PATH=$(npm root -g) node build.cjs   (filerne lander i ../tryk)
const B = require("../../brandpakke/kilde/build.cjs");
const { page, logo, markOnly, box, scr, icon } = B;
const R = "../udlejning/tryk/"; // relativt til brandpakken, som render.cjs regner ud fra
const PRINT = `html{font-size:1mm}.k{--ks:2.1mm}.bleed{position:absolute;inset:3mm}`;
const KONTAKT = { tlf: "+45 12 34 56 78", mail: "hej@selfi.dk" }; // pladsholdere, ret før tryk
const jobs = [];
const job = (id, o) => jobs.push({ id, ...o });

const steps = (list, size = 4.6) => `<ol style="list-style:none;display:flex;flex-direction:column;gap:6.5mm">
  ${list.map(([t, d], i) => `<li style="display:grid;grid-template-columns:9mm 1fr;gap:3.5mm;align-items:start">
    <span style="width:8mm;height:8mm;border-radius:50%;background:var(--green);color:var(--on-green);display:grid;place-items:center;font:600 3.8mm/1 var(--mono)">${i + 1}</span>
    <span><b style="display:block;font:600 ${size + 0.8}mm/1.1 var(--display);letter-spacing:-.02em;margin-bottom:1.4mm">${t}</b><span style="font:400 ${size - 0.9}mm/1.4 var(--body);color:var(--muted)">${d}</span></span></li>`).join("")}</ol>`;
const foot = (cls) => `<div class="abs" style="left:10mm;right:10mm;bottom:10mm;display:flex;justify-content:space-between;align-items:center;border-top:.3mm solid var(--rule);padding-top:4mm">${markOnly(cls, "6.5mm")}<span class="url" style="--us:2.4mm">Hjælp: ${KONTAKT.tlf} · <b>selfi.dk/hjaelp</b></span></div>`;

// Startguide A5 (148×210 + 3 mm beskæring), dobbeltsidet. Ligger øverst i kassen.
const SETUP = [
  ["Stil stativet op", "Fold benene ud, træk dem helt ud, og lås dem. Stil stativet på et fladt gulv med cirka to meter fri plads foran."],
  ["Skru boksen fast", "Skruen på toppen af stativet går i hullet under boksen. Drej boksen, til den sidder fast, og spænd hovedet, så skærmen står lodret."],
  ["Sæt strøm til", "Det runde stik i bunden af boksen, strømforsyningen i en stikkontakt. Brug forlængeren, hvis der er langt, og bind kablet til et af benene med velcrobåndet."],
  ["Vent et minut", "Boksen starter af sig selv. Ringen lyser, og skærmen viser jeres navn, når den er klar."],
];
job("startguide-forside", {
  kind: "pdf", out: R + "startguide/selfi-startguide-forside-A5.pdf", size: () => [154, 216],
  html: (W, H) => page(W, H, "light", `<div class="bleed">
    <div class="abs" style="left:10mm;top:10mm">${logo("light", "6.5mm")}</div>
    <span class="k abs" style="left:10mm;top:24mm">Startguide</span>
    <h1 class="h abs" style="--hs:10mm;left:10mm;top:31mm;width:100mm">Klar til fest på fem minutter.</h1>
    ${box(scr.word("Selfi", "Hej"), "--bw:26mm;right:10mm;top:24mm")}
    <div class="abs" style="left:10mm;right:10mm;top:66mm">${steps(SETUP)}</div>
    <p class="abs" style="left:10mm;right:10mm;bottom:27mm;font:400 3.4mm/1.4 var(--body);color:var(--muted)"><b style="color:var(--ink)">Godt at vide:</b> Stil boksen indenfor eller under tag, ikke i direkte modlys. Hæng en pose eller flaske vand på krogen under stativet, så står det helt fast.</p>
    ${foot("light")}</div>`, PRINT),
});
const RETUR = [
  ["Sluk", "Træk stikket ud. Alle billeder ligger allerede på jeres side."],
  ["Pak ned", "Læg tingene tilbage, som de lå. Billedet inde i låget viser hvor. Boksen med skærmen ind mod skummet."],
  ["Luk kassen", "Brug tapen fra lommen i låget, én stribe hen over midten."],
  ["Skift label", "Tag den gamle label ud af plastlommen på låget, og sæt returlabelen i. Den ligger øverst i kassen."],
  ["Aflever den", "I en dao-pakkeshop senest dagen efter festen. Find den nærmeste på dao.as. Vi får besked, når den er afleveret."],
];
job("startguide-bagside", {
  kind: "pdf", out: R + "startguide/selfi-startguide-bagside-A5.pdf", size: () => [154, 216],
  html: (W, H) => page(W, H, "dark", `<div class="bleed">
    <span class="k abs" style="left:10mm;top:11mm">Når festen er slut</span>
    <h1 class="h abs" style="--hs:8.5mm;left:10mm;top:18mm;width:118mm">Sådan sender I den tilbage.</h1>
    <div class="abs" style="left:10mm;right:10mm;top:42mm">${steps(RETUR, 4.4)}</div>
    <p class="abs" style="left:10mm;right:10mm;bottom:27mm;font:400 3.4mm/1.4 var(--body);color:var(--muted)"><b style="color:var(--halo)">Er noget gået i stykker?</b> Skriv eller ring, før I sender kassen, så finder vi ud af det sammen.</p>
    ${foot("dark")}</div>`, PRINT),
});

// Lågkort A4 på tværs. Ligger øverst under låget og er det første, kunden ser.
const IKASSEN = ["Selfi-fotoboks", "Stativ", "Strømforsyning med kabel", "Forlængerledning 3 m", "Velcrobånd til kablet", "Startguide", "Returlabel og tape"];
job("laagkort", {
  kind: "pdf", out: R + "laagkort/selfi-laagkort-A4.pdf", size: () => [303, 216],
  html: (W, H) => page(W, H, "dark glowbg", `<div class="bleed">
    <div class="abs" style="left:14mm;top:14mm">${logo("dark", "8mm")}</div>
    <h1 class="h abs" style="--hs:17mm;left:14mm;top:44mm;width:150mm">Hej. Start med guiden.</h1>
    <p class="abs p" style="--ps:5mm;left:14mm;top:100mm;width:140mm">Den ligger lige under dette kort. Det tager fem minutter, og I skal ikke bruge wifi eller en app.</p>
    <div class="abs" style="left:14mm;bottom:14mm;display:flex;gap:6mm;align-items:center"><span class="url" style="--us:3mm">Spørgsmål? <b>${KONTAKT.tlf}</b></span></div>
    <div class="abs" style="right:14mm;top:14mm;bottom:14mm;width:105mm;border-left:.3mm solid var(--rule);padding-left:10mm">
      <span class="k" style="--ks:2.8mm">I kassen</span>
      <ul style="list-style:none;margin-top:6mm;display:flex;flex-direction:column;gap:6mm">
        ${IKASSEN.map((t) => `<li style="display:flex;gap:3.5mm;align-items:center;font:500 6.6mm/1.1 var(--display);letter-spacing:-.015em"><i style="width:6mm;height:6mm;border:.5mm solid var(--green);border-radius:1.2mm;flex:none"></i>${t}</li>`).join("")}
      </ul>
      <p style="position:absolute;left:10mm;right:0;bottom:0;font:400 3.4mm/1.4 var(--body);color:var(--muted)">Sæt kryds, når I pakker ned, så I er sikre på, at det hele kommer med retur.</p>
    </div></div>`, PRINT + `.glowbg{--gx:30%;--gy:40%;--gw:60%;--gh:60%}`),
});

// Mærkat på låget, 150 × 100 mm (+3 mm). Ved siden af plastlommen til labelen.
job("laagmaerkat", {
  kind: "pdf", out: R + "maerkat/selfi-laagmaerkat-150x100mm.pdf", size: () => [156, 106],
  html: (W, H) => page(W, H, "green", `<div class="bleed">
    <div class="abs" style="left:8mm;top:8mm">${logo("green", "7mm")}</div>
    <span class="k abs" style="left:8mm;top:21mm;--ks:2.4mm">Udlejningskasse</span>
    <p class="abs" style="left:8mm;right:8mm;top:30mm;font:600 6.4mm/1.12 var(--display);letter-spacing:-.025em">Kassen skal retur til Selfi. Returlabelen ligger øverst i kassen.</p>
    <div class="abs" style="left:8mm;right:8mm;bottom:8mm;display:flex;gap:7mm;align-items:center">
      ${[["glas", "Skrøbelig"], ["tor", "Holdes tør"], ["op", "Denne side op"]].map(([i, t]) => `<span style="display:flex;align-items:center;gap:2mm">${icon(i, "#0b1a10", "9mm", 6)}<span class="k" style="--ks:2mm;opacity:1;color:var(--on-green)">${t}</span></span>`).join("")}
    </div></div>`, PRINT),
});

if (require.main === module) require("../../brandpakke/kilde/render.cjs").run(jobs, process.argv[2]);
module.exports = { jobs };
