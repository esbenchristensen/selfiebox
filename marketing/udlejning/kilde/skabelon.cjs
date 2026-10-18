// Skæreskabelon 1:1 til skumindlægget (forslag A, stående i ét lag). Print på A3 i 100 %.
// Kør: NODE_PATH=$(npm root -g) node skabelon.cjs  → ../tryk/skaereskabelon/
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");
const FONT = "file://" + path.join(__dirname, "..", "..", "brandpakke", "kilde", "assets") + "/";
const OUT = path.join(__dirname, "..", "tryk", "skaereskabelon");

// Kasse 350 × 250 × 250 indv. Bund 15, vægge 222 høje, låg-pude 15 (presses ca. 2 mm).
const H = 222;
const PIECES = [
  { nr: 1, navn: "Bundplade", w: 350, h: 250, t: 15, n: 1, note: "Ligger i bunden af kassen. Alt andet limes ovenpå." },
  { nr: 2, navn: "Låg-pude", w: 350, h: 250, t: 15, n: 1, note: "Løs. Ligger øverst og holder boksen nede, når låget lukkes." },
  { nr: 3, navn: "Langvæg", w: 350, h: H, t: 15, n: 2, note: "Limes langs kassens to lange sider." },
  { nr: 4, navn: "Skillevæg", w: 330, h: H, t: 15, n: 1, note: "Mellem endevæggene, 88 mm fra langvæggen på Halo-siden.", marks: [] },
  { nr: 5, navn: "Endevæg", w: 220, h: H, t: 10, n: 2, note: "Mellem langvæggene. Stregerne viser, hvor skillevæggen sidder.", marks: [88, 103] },
  { nr: 6, navn: "Fyldklods", w: 88, h: H, t: 10, n: 2, note: "I hver ende af Halo-lommen, så boksen ikke glider på langs." },
];

const sheet = (p) => `<section class="pg">
  <div class="head"><b>${p.nr} · ${p.navn}</b><span>${p.w} × ${p.h} mm · ${p.t} mm PE-skum · ${p.n} stk.</span></div>
  <p class="note">${p.note}</p>
  <svg class="piece" style="width:${p.w}mm;height:${p.h}mm" viewBox="0 0 ${p.w} ${p.h}">
    <rect x="0.15" y="0.15" width="${p.w - 0.3}" height="${p.h - 0.3}" fill="none" stroke="#121412" stroke-width="0.3"/>
    ${(p.marks || []).map((x) => `<line x1="${x}" y1="0" x2="${x}" y2="${p.h}" stroke="#0f7a3b" stroke-width="0.3" stroke-dasharray="3 2"/>`).join("")}
    <text x="${p.w / 2}" y="${p.h / 2}" text-anchor="middle" font-size="9" font-family="IS" fill="#c9ccc6">${p.nr}</text>
    <text x="${p.w / 2}" y="${p.h - 4}" text-anchor="middle" font-size="3.2" font-family="GM" fill="#5c615b">${p.w} mm</text>
    <text x="4" y="${p.h / 2}" font-size="3.2" font-family="GM" fill="#5c615b" transform="rotate(-90 4 ${p.h / 2})" text-anchor="middle" dy="3">${p.h} mm</text>
  </svg>
  <div class="check"><i></i><span>Kontrol: denne streg skal måle præcis 100 mm. Ellers er skabelonen ikke printet i 100 %.</span></div>
</section>`;

// Udlægning på plader 1000 × 500 mm
const nest = (title, items) => `<svg viewBox="-2 -2 1004 504" style="width:185mm;height:92.5mm;display:block;margin-top:5mm">
  <rect x="0" y="0" width="1000" height="500" fill="#f3f4f1" stroke="#121412" stroke-width="1.5"/>
  ${items.map(([x, y, w, h, nr]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#fff" stroke="#0f7a3b" stroke-width="1.5"/><text x="${x + w / 2}" y="${y + h / 2 + 14}" text-anchor="middle" font-size="40" font-family="IS" fill="#0f7a3b">${nr}</text>`).join("")}
  <text x="995" y="490" text-anchor="end" font-size="22" font-family="GM" fill="#5c615b">${title}</text></svg>`;
const overview = `<section class="pg">
  <div class="head"><b>Skumindlæg til udlejningskassen</b><span>Forslag A · kasse 350 × 250 × 250 mm indvendigt</span></div>
  <p class="note" style="max-width:384mm">Skær delene af PE-skum (ca. 30 kg/m³) med en skarp hobbykniv langs en lineal. Lim med kontaktlim eller limpistol: bundplade (1), langvægge (3) langs siderne, endevægge (5) mellem dem, skillevæg (4) og til sidst fyldklodserne (6) i enderne af Halo-lommen. Halo-lommen er 88 mm bred til en 85 mm boks. Læg et løftebånd (25 mm stofbånd) på tværs under boksen, så den er nem at tage op. Mål stativet: er det længere end 330 mm, skæres en lomme på 10 mm i endevæggene ud for stativet.</p>
  <div style="display:flex;gap:14mm">
    <div>${nest("15 mm · ét sæt pr. plade", [[0, 0, 350, 250, 1], [350, 0, 350, 250, 2], [0, 250, 350, 222, 3], [350, 250, 350, 222, 3], [700, 0, 222, 330, 4]])}</div>
    <div>${nest("10 mm · to sæt pr. plade", [[0, 0, 220, 222, 5], [220, 0, 220, 222, 5], [440, 0, 88, 222, 6], [528, 0, 88, 222, 6], [0, 250, 220, 222, 5], [220, 250, 220, 222, 5], [440, 250, 88, 222, 6], [528, 250, 88, 222, 6]])}</div>
  </div>
</section>`;

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:IS;src:url(${FONT}InstrumentSans.woff2)}@font-face{font-family:G;src:url(${FONT}Geist.woff2)}@font-face{font-family:GM;src:url(${FONT}GeistMono.woff2)}
@page{size:420mm 297mm;margin:0}*{margin:0;padding:0;box-sizing:border-box}
body{font-family:G;color:#121412}
.pg{width:420mm;height:297mm;padding:14mm 16mm;position:relative;page-break-after:always;overflow:hidden}
.head{display:flex;justify-content:space-between;align-items:baseline;border-bottom:.3mm solid #d9dcd6;padding-bottom:3mm}
.head b{font:600 9mm/1 IS;letter-spacing:-.03em}.head span{font:500 4mm GM;color:#5c615b}
.note{font:400 4mm/1.45 G;color:#5c615b;margin:4mm 0 6mm;max-width:300mm}
.piece{display:block;margin:0 auto}
.check{position:absolute;left:16mm;bottom:12mm;display:flex;align-items:center;gap:5mm;font:400 3.4mm G;color:#5c615b}
.check i{display:block;width:100mm;height:0;border-top:.5mm solid #121412;position:relative}
.check i::before,.check i::after{content:"";position:absolute;top:-2.5mm;height:5mm;border-left:.5mm solid #121412}.check i::after{right:0}
</style></head><body>${overview}${PIECES.map(sheet).join("")}</body></html>`;

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const f = path.join(__dirname, "_skabelon.html"); fs.writeFileSync(f, html);
  const b = await chromium.launch(); const p = await b.newPage();
  await p.goto("file://" + f); await p.evaluate(() => document.fonts.ready);
  await p.pdf({ path: path.join(OUT, "selfi-skumskabelon-A3.pdf"), width: "420mm", height: "297mm", printBackground: true, preferCSSPageSize: true });
  await p.setViewportSize({ width: 1588, height: 1123 });
  await p.screenshot({ path: path.join(OUT, "selfi-skumskabelon-oversigt.png"), clip: { x: 0, y: 0, width: 1588, height: 1123 } });
  await b.close(); fs.unlinkSync(f); console.log("✓ skabelon");
})();
