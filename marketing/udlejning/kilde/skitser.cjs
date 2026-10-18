// Skitser af kasseopdelingen (to forslag) i 350 × 250 × 250 mm indvendigt.
// Kør: NODE_PATH=$(npm root -g) node skitser.cjs  → ../skitser/*.png
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");
const OUT = path.join(__dirname, "..", "skitser");
const FONT = "file://" + path.join(__dirname, "..", "..", "brandpakke", "kilde", "assets") + "/";

// Mål i mm
const BOX = { L: 350, B: 250, H: 250, wall: 4 };          // indvendigt; 2-lags pap ca. 7 mm, 1-lags ca. 4 mm
const HALO = { b: 222.5, h: 306, d: 85 };                   // hovedenhed (gen 2)
const TRI = { l: 330, d: 90 };                              // stativ sammenklappet, Ø ca. 90 med kuglehoved
const PSU = { l: 145, b: 60, h: 32 };                       // Mean Well GST90A12

const S = 1.9; // px pr. mm
let svg = [];
const px = (v) => +(v * S).toFixed(1);
function view(ox, oy, title, sub, fn) { svg.push(`<g transform="translate(${ox},${oy})"><text class="vt" x="0" y="-34">${title}</text><text class="vs" x="0" y="-14">${sub}</text>`); fn(); svg.push(`</g>`); }
const R = (x, y, w, h, cls, r = 0) => svg.push(`<rect class="${cls}" x="${px(x)}" y="${px(y)}" width="${px(w)}" height="${px(h)}" rx="${px(r)}"/>`);
const C = (cx, cy, rr, cls) => svg.push(`<circle class="${cls}" cx="${px(cx)}" cy="${px(cy)}" r="${px(rr)}"/>`);
const T = (x, y, t, cls = "lb", anchor = "middle") => svg.push(`<text class="${cls}" x="${px(x)}" y="${px(y)}" text-anchor="${anchor}">${t}</text>`);
function D(x1, y1, x2, y2, t, off = 0) { // målelinje med pile
  const hor = y1 === y2; const tx = (x1 + x2) / 2, ty = (y1 + y2) / 2;
  svg.push(`<line class="dim" x1="${px(x1)}" y1="${px(y1)}" x2="${px(x2)}" y2="${px(y2)}" marker-start="url(#a)" marker-end="url(#a)"/>`);
  if (hor) svg.push(`<text class="dt" x="${px(tx)}" y="${px(ty) - 5}" text-anchor="middle">${t}</text>`);
  else svg.push(`<text class="dt" x="${px(tx) + 6 + off}" y="${px(ty) + 4}" text-anchor="start">${t}</text>`);
}
const foam = (x, y, w, h) => R(x, y, w, h, "foam");
const boxOutline = (w, h) => { R(-BOX.wall, -BOX.wall, w + 2 * BOX.wall, h + 2 * BOX.wall, "card", 2); R(0, 0, w, h, "inner"); };

// ---------- Forslag A: Stående i ét lag ----------
const A = { wall: 15, slot: 88, div: 15 };
A.tri = BOX.B - 2 * A.wall - A.slot - A.div;   // 117
const yHalo = A.wall, yTri = A.wall + A.slot + A.div;
const xHalo = (BOX.L - HALO.h) / 2;

function sheet(name, title, intro, views, notes) {
  const W = 1500, Hh = 1060;
  return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:IS;src:url(${FONT}InstrumentSans.woff2)}@font-face{font-family:G;src:url(${FONT}Geist.woff2)}@font-face{font-family:GM;src:url(${FONT}GeistMono.woff2)}
body{margin:0;width:${W}px;height:${Hh}px;background:#f3f4f1;font-family:G;color:#121412}
h1{font:600 40px/1 IS;letter-spacing:-.03em;margin:0;position:absolute;left:50px;top:42px}
.intro{position:absolute;left:50px;top:96px;width:1380px;font:400 19px/1.4 G;color:#5c615b}
svg{position:absolute;left:0;top:0}
.vt{font:600 22px IS;fill:#121412}.vs{font:400 15px G;fill:#5c615b}
.card{fill:#d8c8a8;stroke:#8a7650;stroke-width:1.5}.inner{fill:#fff;stroke:#8a7650;stroke-width:1}
.foam{fill:url(#h);stroke:#9aa09a;stroke-width:1}
.halo{fill:#fff;stroke:#121412;stroke-width:2.2}.ring{fill:none;stroke:#121412;stroke-width:1.2;stroke-dasharray:5 4}
.tri{fill:#fff;stroke:#0f7a3b;stroke-width:2.2}.psu{fill:#fff;stroke:#1f5fbf;stroke-width:2}.cab{fill:#fff;stroke:#1f5fbf;stroke-width:1.5;stroke-dasharray:4 3}
.paper{fill:#fff;stroke:#b0563a;stroke-width:1.8}.grip{fill:#fff;stroke:#9aa09a;stroke-width:1;stroke-dasharray:3 3}
.lb{font:600 14px G;fill:#121412}.lbs{font:400 12.5px G;fill:#5c615b}.dim{stroke:#5c615b;stroke-width:1}.dt{font:500 12.5px GM;fill:#5c615b}
.notes{position:absolute;left:50px;right:50px;bottom:38px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:28px;font:400 16px/1.4 G}
.notes b{display:block;font:600 17px IS;margin-bottom:6px}
.leg{position:absolute;right:50px;top:44px;display:flex;gap:18px;font:400 14px G;color:#5c615b}.leg i{display:inline-block;width:18px;height:12px;margin-right:6px;vertical-align:-1px;border:2px solid}
</style></head><body><h1>${title}</h1><div class="intro">${intro}</div>
<div class="leg"><span><i style="border-color:#121412"></i>Halo</span><span><i style="border-color:#0f7a3b"></i>Stativ</span><span><i style="border-color:#1f5fbf"></i>Strøm og kabler</span><span><i style="border-color:#b0563a"></i>Tryksager</span><span><i style="border-color:#9aa09a;background:repeating-linear-gradient(45deg,#e4e6e1 0 3px,#fff 3px 6px)"></i>PE-skum</span></div>
<svg width="${W}" height="${Hh}"><defs><pattern id="h" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="6" height="6" fill="#fff"/><rect width="3" height="6" fill="#e4e6e1"/></pattern>
<marker id="a" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 1 L9 5 L0 9" fill="none" stroke="#5c615b" stroke-width="1.4"/></marker></defs>
${views}</svg><div class="notes">${notes.map(([h, p]) => `<div><b>${h}</b>${p}</div>`).join("")}</div></body></html>`;
}

function optionA() {
  svg = [];
  view(70, 250, "Set ovenfra, låget af", "Halo står på sin lange kant med skærmen ind mod skillevæggen", () => {
    boxOutline(BOX.L, BOX.B);
    foam(0, 0, BOX.L, BOX.B);
    // slids til Halo
    R(xHalo - 1, yHalo, HALO.h + 2, A.slot, "inner");
    R(xHalo, yHalo + 1.5, HALO.h, HALO.d, "halo", 6);
    T(BOX.L / 2, yHalo + A.slot / 2 + 2, "Halo · 306 × 85");
    T(BOX.L / 2, yHalo + A.slot / 2 + 18, "skærm vender ned mod skillevæggen", "lbs");
    // gribehuller i enderne
    for (const x of [xHalo - 1 - 18, xHalo + HALO.h + 1]) R(x, yHalo + 14, 18, A.slot - 28, "grip", 9);
    // stativ-lomme
    R(8, yTri, BOX.L - 16, A.tri, "inner");
    R(10, yTri + (A.tri - TRI.d) / 2, TRI.l, TRI.d, "tri", 20);
    T(15 + TRI.l / 2, yTri + A.tri / 2 - 6, "Stativ · 330 × Ø90 (nederst)");
    T(15 + TRI.l / 2, yTri + A.tri / 2 + 12, "ovenpå: strømforsyning + kabelpose", "lbs");
    D(0, BOX.B + 22, BOX.L, BOX.B + 22, "350 indv.");
    D(BOX.L + 30, 0, BOX.L + 30, BOX.B, "250");
    D(BOX.L + 8, yHalo, BOX.L + 8, yHalo + A.slot, "88");
  });
  view(930, 250, "Snit på tværs", "Set fra enden af kassen", () => {
    const W = BOX.B, H = BOX.H; // y vandret, z lodret (z=0 i bunden)
    const Z = (z) => H - z;
    boxOutline(W, H);
    foam(0, Z(15), W, 15);                       // bund
    foam(0, Z(H), A.wall, H);                    // væg venstre
    foam(yHalo + A.slot, Z(H - 13), A.div, H - 13); // skillevæg
    foam(W - A.wall, Z(H), A.wall, H);           // væg højre
    R(yHalo + 1.5, Z(15 + HALO.b), HALO.d, HALO.b, "halo", 6);
    svg.push(`<line class="ring" x1="${px(yHalo + HALO.d - 6)}" y1="${px(Z(15 + 18))}" x2="${px(yHalo + HALO.d - 6)}" y2="${px(Z(15 + HALO.b - 18))}"/>`);
    T(yHalo + HALO.d / 2 + 1.5, Z(15 + HALO.b / 2) - 4, "Halo");
    T(yHalo + HALO.d / 2 + 1.5, Z(15 + HALO.b / 2) + 12, "222,5 høj", "lbs");
    C(yTri + A.tri / 2, Z(15 + TRI.d / 2), TRI.d / 2, "tri"); T(yTri + A.tri / 2, Z(15 + TRI.d / 2) + 5, "Stativ");
    R(yTri + (A.tri - PSU.b) / 2, Z(15 + TRI.d + 4 + PSU.h), PSU.b, PSU.h, "psu", 4); T(yTri + A.tri / 2, Z(15 + TRI.d + 4 + PSU.h / 2) + 5, "Strøm", "lbs");
    R(yTri + 8, Z(15 + TRI.d + 4 + PSU.h + 4 + 50), A.tri - 16, 50, "cab", 6); T(yTri + A.tri / 2, Z(15 + TRI.d + PSU.h + 8 + 25) + 5, "Kabelpose", "lbs");
    foam(0, Z(H), W, 12.5);                      // låg-pude
    R(8, Z(H - 13.5) , W - 16, 1.5, "paper"); T(W / 2, Z(H) + 8.5, "Låg-pude · startguide og returlabel ligger øverst", "lbs");
    D(-14, Z(0), -14, Z(H), "250", -58);
    D(0, Z(0) + 22, W, Z(0) + 22, "250");
  });
  return sheet("A", "Forslag A · Stående i ét lag",
    "Alt står i én skumklods med to lommer, så kunden løfter tingene lige op og sætter dem tilbage samme vej. Kasse 350 × 250 × 250 mm indvendigt (standardmål), ca. 364 × 264 × 270 mm udvendigt. Passer i PostNords pakkebokse (maks. 42 × 49 × 60 cm) og dao's pakkeshops.",
    svg.join(""), [
      ["Fordele", "Kun to skumdele: en bundklods med lommer og en pude i låget. Hurtigt at pakke ned igen, og man kan ikke lægge noget forkert, fordi hver ting har sin egen lomme."],
      ["Ulemper", "Halo står på kanten, så skumlommen skal være præcis (85 mm boks i 88 mm lomme). Skærmen beskyttes af skillevæggen og ikke af et låg."],
      ["Mål og vægt", "Skum 15 mm i bund og vægge. Stativ, strøm og kabler i samme lomme. Vægt i alt ca. 4,3 kg (anslået, skal vejes), altså under 5 kg-grænsen hos alle fragtfirmaer."],
    ]);
}

function optionB() {
  svg = [];
  const wall = (BOX.B - HALO.b) / 2, end = (BOX.L - HALO.h) / 2;
  view(70, 250, "Set ovenfra, øverste lag", "Bakke med stativ, strøm og kabler. Løftes op i to stropper", () => {
    boxOutline(BOX.L, BOX.B);
    foam(0, 0, BOX.L, BOX.B);
    const tw = 98; // stativlomme
    R(8, 15, BOX.L - 16, tw, "inner"); R(10, 15 + (tw - TRI.d) / 2, TRI.l, TRI.d, "tri", 20); T(10 + TRI.l / 2, 15 + tw / 2 + 5, "Stativ · 330 × Ø90");
    const y2 = 15 + tw + 12, lw = BOX.B - y2 - 15;
    R(15, y2, 160, lw, "inner"); R(22, y2 + (lw - PSU.b) / 2, PSU.l, PSU.b, "psu", 4); T(22 + PSU.l / 2, y2 + lw / 2 + 5, "Strømforsyning");
    R(185, y2, BOX.L - 200, lw, "inner"); R(192, y2 + 8, BOX.L - 214, lw - 16, "cab", 6); T(185 + (BOX.L - 200) / 2, y2 + lw / 2 + 5, "Kabler + forlænger");
    D(0, BOX.B + 22, BOX.L, BOX.B + 22, "350 indv.");
    D(BOX.L + 30, 0, BOX.L + 30, BOX.B, "250");
  });
  view(930, 250, "Snit på tværs", "Nederst ligger Halo med skærmen op", () => {
    const W = BOX.B, H = BOX.H, Z = (z) => H - z;
    boxOutline(W, H);
    foam(0, Z(20), W, 20);                                   // bund
    foam(0, Z(105), wall, 85); foam(W - wall, Z(105), wall, 85); // ramme om Halo
    R(wall, Z(105), HALO.b, HALO.d, "halo", 8); T(W / 2, Z(62) + 5, "Halo · 222,5 × 85, skærm op");
    foam(0, Z(115), W, 10);                                  // skilleplade
    foam(0, Z(205), W, 90);                                  // bakke
    C(15 + 49, Z(115 + 45), 45, "tri"); T(64, Z(160) + 5, "Stativ");
    R(15 + 98 + 12 + 8, Z(115 + 20 + PSU.h), PSU.b, PSU.h, "psu", 4); T(133 + PSU.b / 2, Z(135 + PSU.h / 2) + 5, "Strøm", "lbs");
    R(200, Z(115 + 70), 35, 60, "cab", 5);
    foam(0, Z(H), W, 20);                                    // låg
    R(8, Z(H - 21.5), W - 16, 1.5, "paper"); T(W / 2, Z(H) + 8.5, "Låg-pude · startguide og returlabel ligger øverst", "lbs");
    D(-14, Z(0), -14, Z(H), "250", -58); D(0, Z(0) + 22, W, Z(0) + 22, "250");
  });
  return sheet("B", "Forslag B · To lag",
    "Øverst en skumbakke med stativ, strøm og kabler. Under den ligger Halo fladt med skærmen op i en skumramme. Samme kasse som forslag A: 350 × 250 × 250 mm indvendigt.",
    svg.join(""), [
      ["Fordele", "Halo ligger fladt og er bedst beskyttet, med skum under, rundt om og en plade over skærmen. Udpakningen føles som et produkt: låg, guide, bakke, boks."],
      ["Ulemper", "Fire skumdele (bund, ramme, skilleplade, bakke). Kunden skal løfte bakken op for at nå boksen og huske at lægge den tilbage øverst."],
      ["Mål og vægt", "Skum 20 mm i bund og låg, 14 mm på siderne af Halo. Vægt ca. 4,4 kg (anslået). Bakken kan også 3D-printes, men skum er lettere og billigere."],
    ]);
}

// ---------- Forslag C: kompakt, to faste dele ----------
// Del 1 (bundramme) limes i kassen. Del 2 (topbakke) er limet sammen til én bakke med rum og løftes op i to stropper.
function optionC() {
  svg = [];
  const keep = { ...BOX }; Object.assign(BOX, { L: 340, B: 240, H: 200 });
  const L = 340, Bw = 240, Hh = 200, Z = (z) => Hh - z;
  const capT = (L - HALO.h) / 2, base = 5, capH = base + HALO.d + 2;   // 17 mm endestykker, 92 høje
  const plate = 5, trayZ = capH, frameTop = trayZ + plate + 95;          // bakke 92..192
  const rail = 10, triY = rail, triW = 96, divY = triY + triW, accY = divY + 10, accW = Bw - rail - accY;
  const sad = [60, 250], sadT = 30;
  const rooms = [["Strømforsyning", 150], ["Kabler", 80], ["Forlænger", 70]];
  view(50, 250, "Topbakken set ovenfra", "Én limet del med fire rum. Løftes op i to stropper (rød)", () => {
    boxOutline(L, Bw);
    foam(0, 0, L, Bw);
    R(5, triY, L - 10, triW, "inner");                                   // stativlomme
    for (const x of sad) foam(x, triY, sadT, triW);
    R(5, triY + (triW - TRI.d) / 2, TRI.l, TRI.d, "tri", 20);
    for (const x of sad) { svg.push(`<g opacity=".7">`); foam(x, triY, sadT, triW); svg.push(`</g>`); }
    T(L / 2 - 15, triY + triW / 2 + 5, "Stativ");
    let x = rail;
    rooms.forEach(([n, w], i) => { R(x, accY, w, accW, "inner"); T(x + w / 2, accY + accW / 2 + 5, n, "lbs"); x += w + 10; });
    R(rail + 3, accY + (accW - PSU.b) / 2, PSU.l - 6, PSU.b, "psu", 4);
    T(rail + 75, accY + accW / 2 + 5, "Strømforsyning", "lbs");
    for (const sx of [100, 230]) R(sx, -6, 25, 12, "paper", 2);         // stropper
    D(0, Bw + 22, L, Bw + 22, "340 indv."); D(L + 22, 0, L + 22, Bw, "240");
  });
  view(760, 250, "Snit på langs gennem stativet", "Nederst bundrammen med Halo, skærmen op og 2 mm luft. Øverst bakken", () => {
    boxOutline(L, Hh);
    foam(0, Z(base), L, base);                                             // bundplade, limet
    foam(0, Z(capH), capT, capH); foam(L - capT, Z(capH), capT, capH);     // endestykker, limet
    R(capT, Z(base + HALO.d), HALO.h, HALO.d, "halo", 8); T(L / 2, Z(base + HALO.d / 2) + 5, "Halo · 306 × 85, skærm op");
    T(L / 2, Z(base + 10) + 2, "del 1 · bundramme, limet i kassen", "lbs");
    foam(0, Z(trayZ + plate), L, plate);                                   // bakkens bund, limet til bakken
    for (const x of sad) foam(x, Z(trayZ + plate + 50), sadT, 50);         // sadler med rund udskæring
    R(5, Z(trayZ + plate + TRI.d + 2), TRI.l, TRI.d, "tri", 20); T(L / 2, Z(trayZ + plate + TRI.d / 2 + 2) + 5, "Stativ");
    for (const x of sad) { svg.push(`<g opacity=".7">`); foam(x, Z(trayZ + plate + 50), sadT, 50); svg.push(`</g>`); }
    T(L / 2, Z(trayZ + plate) - 4, "del 2 · topbakke", "lbs");
    R(8, Z(frameTop + 1.5), L - 16, 1.5, "paper"); 
    D(L + 22, Z(0), L + 22, Z(Hh), "200");
  });
  Object.assign(BOX, keep);
  return sheet("C", "Forslag C · Kompakt i to faste dele",
    "Ingen løse plader og ingen skumkasse inde i papkassen. Del 1 er en bundramme, der limes fast i kassen og holder Halo i enderne. Del 2 er en topbakke, limet sammen til én del med fire rum: stativ, strømforsyning, kabler og forlænger. Bakken hviler på bundrammens endestykker, ikke på skærmen. Kasse 340 × 240 × 200 mm indvendigt (Husted 790163), 16,3 liter mod 21,9 liter i A.",
    svg.join(""), [
      ["Kun to dele", "Bundrammen sidder fast i kassen og kan ikke blive væk. Topbakken er én limet del med en bund på 5 mm, der dækker skærmen. Kunden løfter den op i stropperne og sætter den tilbage samme vej."],
      ["Rum til alt", "Stativet ligger i to sadler med runde udskæringer. Strømforsyning, kabler og forlænger har hvert sit rum, så man kan se med det samme, hvis noget mangler."],
      ["Mål og vægt", "Stativet fylder 330 af 340 mm. Halo har 17 mm skum i hver ende og 2 mm luft over skærmen. Ca. 150 g lettere end A. Under 5 kg og passer i pakkebokse."],
    ]);
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch();
  for (const [n, html] of [["kasseopdeling-A-staaende", optionA()], ["kasseopdeling-B-to-lag", optionB()], ["kasseopdeling-C-kompakt", optionC()]]) {
    const f = path.join(__dirname, `_${n}.html`); fs.writeFileSync(f, html);
    const p = await b.newPage({ viewport: { width: 1500, height: 1060 }, deviceScaleFactor: 1.5 });
    await p.goto("file://" + f); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(200);
    await p.screenshot({ path: path.join(OUT, n + ".png") }); await p.close(); fs.unlinkSync(f);
    console.log("✓", n);
  }
  await b.close();
})();
