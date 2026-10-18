// Selfi brandpakke. Bygger logoer, SoMe-grafik, tryksager, emballage, mockups og brandguide.
// Brug: NODE_PATH=$(npm root -g) node build.cjs [filter]   (filter matcher på id, fx "some" eller "visitkort")
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");
const L = require("./logo.cjs");

const ROOT = path.join(__dirname, "..");
const ASSETS = path.join(__dirname, "assets");
const A = "file://" + ASSETS + "/";
const TMP = path.join(__dirname, "_tmp");
const CSS = fs.readFileSync(path.join(__dirname, "brand.css"), "utf8").replaceAll("ASSETS/", A);
const ADS = "file://" + path.join(ROOT, "..", "some-annoncer") + "/";
const OUT = (p) => { const f = path.join(ROOT, p); fs.mkdirSync(path.dirname(f), { recursive: true }); return f; };
const U = (p) => "file://" + path.join(ROOT, p); // bruger en allerede bygget fil i en mockup

// ---------- Byggeklodser ----------

const inline = (lg, h, extra = "") => L.svg(lg.w, lg.h, lg.body).replace(/ width="[\d.]+" height="[\d.]+"/, ` class="logo-svg" style="height:${h};${extra}"`);
const logo = (variant, h, kind = "horizontal") => inline(L[kind](variant), h);
const markOnly = (variant, h) => logo(variant, h, "mark");

const BOX = `<svg viewBox="0 0 234 306"><rect class="shell" x="0.75" y="0.75" width="232.5" height="304.5" rx="36"/><rect class="ringb" x="14" y="14" width="206" height="278" rx="22"/><rect class="ring" x="14" y="14" width="206" height="278" rx="22"/><rect class="notch" x="99" y="5" width="36" height="18" rx="9"/><circle class="cam" cx="117" cy="14" r="4.5"/></svg>`;
const box = (screen, style = "", cls = "") => `<div class="box ${cls}" style="${style}">${BOX}<div class="screen">${screen}</div></div>`;
const scr = {
  count: (n = "3", t = "Smil til kameraet") => `<div class="s-count"><b>${n}</b><small>${t}</small></div>`,
  word: (k, t, sw = "") => `<div class="s-word" style="${sw ? `--sw:${sw}` : ""}"><span class="kk">${k}</span><b>${t}</b></div>`,
  photo: (img, cap = "") => `<div class="s-photo" style="background-image:url(${A}${img})"></div>${cap ? `<div class="s-cap">${cap}</div>` : ""}`,
  mark: () => `<div class="s-mark">${markOnly("dark", "auto")}</div>`,
};
const stamp = (t, cls, style) => `<div class="stamp ${cls}" style="${style}">${t}</div>`;

// Linjeikoner i samme streg som logoet (bruges til highlights og emballage)
const ICON = {
  boks: `<rect x="22" y="12" width="56" height="76" rx="14"/><circle cx="50" cy="12" r="5" class="f"/><path d="M38 56 A12 12 0 0 0 62 56"/>`,
  video: `<rect x="14" y="22" width="72" height="56" rx="14"/><path d="M43 38 L60 50 L43 62 Z" class="f"/>`,
  galleri: `<rect x="16" y="16" width="30" height="30" rx="8"/><rect x="54" y="16" width="30" height="30" rx="8"/><rect x="16" y="54" width="30" height="30" rx="8"/><rect x="54" y="54" width="30" height="30" rx="8"/>`,
  pris: `<text x="50" y="64" text-anchor="middle" class="t">kr.</text>`,
  kalender: `<rect x="16" y="22" width="68" height="62" rx="14"/><path d="M16 42 H84 M34 12 V30 M66 12 V30"/><circle cx="50" cy="63" r="6" class="f"/>`,
  sporg: `<path d="M38 36 A12 12 0 1 1 56 46 Q50 50 50 58 V60"/><circle cx="50" cy="74" r="5" class="f"/>`,
  op: `<path d="M34 86 V22 M20 36 L34 20 L48 36 M66 86 V22 M52 36 L66 20 L80 36"/>`,
  glas: `<path d="M30 14 H70 V36 A20 20 0 0 1 30 36 Z M50 56 V84 M34 86 H66"/><path d="M44 16 L52 30 L44 36" />`,
  tor: `<path d="M14 54 A36 36 0 0 1 86 54 Z M50 54 V80 A8 8 0 0 1 34 80"/><path d="M50 12 V18"/>`,
};
const icon = (name, color, size, sw = 7) => `<svg viewBox="0 0 100 100" style="width:${size};height:${size};display:block" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"><style>.f{fill:${color};stroke:none}.t{fill:${color};stroke:none;font:600 34px "Instrument Sans";letter-spacing:-1px}</style>${ICON[name]}</svg>`;

const page = (W, H, cls, body, extraCss = "") => `<!doctype html><html><head><meta charset="utf-8"><style>${CSS}
html,body{--W:${W};--H:${H}}${extraCss}</style></head><body class="${cls}">${body}</body></html>`;

// ---------- Opgaver ----------
// kind: png (W×H px), pdf (W×H mm, med 3 mm beskæring inkluderet), svg (skrives direkte)
const jobs = [];
const job = (id, o) => jobs.push({ id, ...o });

// ===== 01 LOGO =====
const LOGO_VARIANTS = [
  ["mork", "dark", "#0e0f0e"], ["lys", "light", "#f3f4f1"], ["groen", "green", "#22d36b"],
  ["sort", "sort", null], ["hvid", "hvid", null], ["creme", "creme", null],
];
for (const [name, v, bg] of LOGO_VARIANTS) {
  for (const kind of ["horizontal", "stacked", "mark", "wordmark"]) {
    const dk = { horizontal: "logo", stacked: "logo-stablet", mark: "symbol", wordmark: "ordmaerke" }[kind];
    job(`logo-${dk}-${name}`, { kind: "svg", out: `01_logo/svg/selfi-${dk}-${name}.svg`, svg: () => { const l = L[kind](v); return L.svg(l.w, l.h, l.body); } });
    // PNG: transparent baggrund, 2000 px bred (symbol 1200 px høj)
    job(`logo-${dk}-${name}-png`, {
      kind: "png", transparent: true, out: `01_logo/png/selfi-${dk}-${name}.png`,
      size: () => { const l = L[kind](v, 0.12); const s = kind === "mark" ? 1200 / l.h : 2000 / l.w; return [Math.round(l.w * s), Math.round(l.h * s)]; },
      html: (W, H) => { const l = L[kind](v, 0.12); return page(W, H, "", inline(l, `${H}px`, `width:${W}px`)); },
    });
  }
}
// App-ikoner og favicon
for (const [name, bg, v] of [["mork", "#0e0f0e", "dark"], ["groen", "#22d36b", "green"], ["creme", "#fff3e3", "light"]]) {
  job(`ikon-app-${name}`, { kind: "svg", out: `01_logo/ikoner/selfi-app-ikon-${name}.svg`, svg: () => { const l = L.icon(bg, v, 1024, "round", 0.52); return L.svg(1024, 1024, l.body); } });
  job(`ikon-app-${name}-png`, { kind: "png", transparent: true, out: `01_logo/ikoner/selfi-app-ikon-${name}-1024.png`, size: () => [1024, 1024], html: (W, H) => page(W, H, "", L.svg(1024, 1024, L.icon(bg, v, 1024, "round", 0.52).body)) });
}
job("ikon-favicon", { kind: "svg", out: `01_logo/ikoner/favicon.svg`, svg: () => L.svg(120, 120, L.icon("#0e0f0e", "dark", 120, "round", 0.62).body) });
for (const s of [32, 180, 512]) job(`ikon-favicon-${s}`, { kind: "png", transparent: true, out: `01_logo/ikoner/favicon-${s}.png`, size: () => [s, s], html: (W, H) => page(W, H, "", L.svg(s, s, L.icon("#0e0f0e", "dark", s, "round", 0.62).body)) });

// ===== 02 SOME =====
// Profilbillede (Facebook, Instagram, LinkedIn, TikTok, YouTube). Beskæres til cirkel af platformene.
for (const [name, cls, v] of [["mork", "dark", "dark"], ["groen", "green", "green"], ["creme", "creme", "light"]]) {
  job(`some-profil-${name}`, {
    kind: "png", out: `02_some/profilbillede/selfi-profilbillede-${name}-1080.png`, size: () => [1080, 1080],
    html: (W, H) => page(W, H, `${cls}${cls === "dark" ? " glowbg" : ""}`, `<div class="abs" style="inset:0;display:grid;place-items:center">${markOnly(v, "500px")}</div>`, `.glowbg{--gx:50%;--gy:50%;--gw:50%;--gh:50%}`),
  });
}

// Facebook-cover 1640×624. Mobil viser kun midten (ca. 1100 px), så alt vigtigt ligger i x 270–1370.
const SAFE = (W, H, w, h) => `<div class="abs safe" style="left:${(W - w) / 2}px;top:${(H - h) / 2}px;width:${w}px;height:${h}px"></div>`;
job("some-facebook-cover-mork", {
  kind: "png", out: "02_some/facebook/selfi-facebook-cover-mork-1640x624.png", size: () => [1640, 624],
  html: (W, H) => page(W, H, "dark glowbg", `
    <div class="abs" style="left:290px;top:150px;width:620px;display:flex;flex-direction:column;gap:26px">
      <span class="k">Fotoboks til jeres fest</span>
      <h1 class="h" style="--hs:66px">Fotoboksen, der får alle med på billedet.</h1>
      <span class="url" style="--us:20px"><b>Fra 495 kr.</b> &nbsp;·&nbsp; Selfi.dk</span>
    </div>
    ${box(scr.count(), "--bw:300px;left:1010px;top:110px", "glow")}
    ${stamp("Videohilsner", "c", "--ss:17px;left:940px;top:200px;rotate:-6deg")}
    ${stamp("Titler", "g", "--ss:17px;left:1250px;top:420px;rotate:5deg")}`, `.glowbg{--gx:70%;--gy:55%;--gw:35%;--gh:70%}`),
});
job("some-facebook-cover-groen", {
  kind: "png", out: "02_some/facebook/selfi-facebook-cover-groen-1640x624.png", size: () => [1640, 624],
  html: (W, H) => page(W, H, "green", `
    <div class="abs" style="left:290px;top:140px;width:640px;display:flex;flex-direction:column;gap:26px">
      <span class="k">Lej en Selfi</span>
      <h1 class="h" style="--hs:66px">Markedets laveste pris. Fra 495 kr.</h1>
      <span class="url" style="--us:20px"><b>Se ledige datoer på selfi.dk</b></span>
    </div>
    ${box(scr.word("Tjek jeres dato", "Ledig"), "--bw:300px;left:1010px;top:110px")}`),
});
// LinkedIn-banner 1584×396 (erhverv). Profilbilledet dækker venstre del, så teksten starter ved 440.
job("some-linkedin-banner", {
  kind: "png", out: "02_some/linkedin/selfi-linkedin-banner-1584x396.png", size: () => [1584, 396],
  html: (W, H) => page(W, H, "dark glowbg", `
    <div class="abs" style="left:440px;top:92px;width:640px;display:flex;flex-direction:column;gap:22px">
      <span class="k" style="--ks:18px">Til barer, hoteller og spillesteder</span>
      <h1 class="h" style="--hs:52px">Fotoboksen, der får gæsterne til at komme igen.</h1>
    </div>
    ${box(scr.count("Hej", "Fredag kl. 23.14"), "--bw:210px;left:1230px;top:60px", "glow")}
    <span class="url abs" style="--us:16px;left:1110px;bottom:34px"><b>Fuld service</b> · Selfi.dk</span>`, `.glowbg{--gx:82%;--gy:55%;--gw:25%;--gh:80%}.s-count b{font-size:22cqw}`),
});
// YouTube-banner 2560×1440. Sikker zone i midten: 1546×423.
job("some-youtube-banner", {
  kind: "png", out: "02_some/youtube/selfi-youtube-banner-2560x1440.png", size: () => [2560, 1440],
  html: (W, H) => page(W, H, "dark glowbg", `
    <div class="abs" style="left:507px;top:509px;width:1546px;height:423px;display:flex;align-items:center;justify-content:space-between">
      ${logo("dark", "210px")}
      <div style="display:flex;flex-direction:column;gap:28px;width:820px"><span class="k" style="--ks:28px">Fotoboks til jeres fest</span><h1 class="h" style="--hs:86px">Fotoboksen, der får alle med på billedet.</h1></div>
    </div>`, `.glowbg{--gx:50%;--gy:50%;--gw:50%;--gh:40%}`),
});
// Instagram-highlights 1080×1920. Instagram viser midten som en cirkel.
const HL = [["sadan", "boks", "Sådan"], ["video", "video", "Video"], ["galleri", "galleri", "Fester"], ["priser", "pris", "Priser"], ["book", "kalender", "Book"], ["sporgsmal", "sporg", "Spørgsmål"]];
for (const [id, ic] of HL) job(`some-highlight-${id}`, {
  kind: "png", out: `02_some/instagram/highlights/highlight-${id}-1080x1920.png`, size: () => [1080, 1920],
  html: (W, H) => page(W, H, "dark", `<div class="abs" style="inset:0;display:grid;place-items:center">${icon(ic, "#22d36b", "420px", 6.5)}</div>`),
});
// Skabelon: Story "Ledig dato" og feed "Tak for festen"
job("some-skabelon-ledig-dato", {
  kind: "png", out: "02_some/skabeloner/story-ledig-dato-1080x1920.png", size: () => [1080, 1920],
  html: (W, H) => page(W, H, "green", `
    <div class="abs" style="left:80px;top:250px;right:80px;display:flex;flex-direction:column;gap:28px">
      <span class="k" style="--ks:26px">Ledig dato</span>
      <h1 class="h" style="--hs:124px">Lørdag 14. november er stadig ledig.</h1>
    </div>
    ${box(scr.word("Tjek jeres dato", "Ledig"), "--bw:480px;left:300px;top:800px")}
    <div class="abs" style="left:0;right:0;bottom:360px;display:flex;justify-content:center">${`<span class="pill d" style="--pls:34px">Book på selfi.dk</span>`}</div>`),
});
job("some-skabelon-tak", {
  kind: "png", out: "02_some/skabeloner/feed-tak-for-festen-1080x1350.png", size: () => [1080, 1350],
  html: (W, H) => page(W, H, "dark glowbg", `
    <div class="abs" style="left:72px;top:72px;right:72px;display:flex;flex-direction:column;gap:24px">
      <span class="k">Tak for i aftes</span>
      <h1 class="h" style="--hs:84px">Freja 14 år. 312 billeder og 41 videohilsner.</h1>
    </div>
    ${box(scr.photo("print-birthday.jpg", "Tillykke Freja"), "--bw:440px;left:320px;top:470px", "glow")}
    ${stamp("Ligger klar på jeres side", "g", "--ss:24px;left:150px;top:1010px;rotate:-4deg")}
    <div class="abs" style="left:72px;right:72px;bottom:60px;display:flex;justify-content:space-between;align-items:center;border-top:1.5px solid var(--rule);padding-top:26px">${logo("dark", "34px")}<span class="url"><b>Markedets laveste pris</b> · Selfi.dk</span></div>`, `.glowbg{--gx:50%;--gy:62%;--gw:50%;--gh:40%}`),
});

// ===== 03 TRYKSAGER ===== (mål i mm, inkl. 3 mm beskæring hele vejen rundt)
const KONTAKT = { navn: "Esben Christensen", titel: "Stifter", tlf: "+45 12 34 56 78", mail: "esben@selfi.dk" }; // pladsholdere, ret før tryk
const PRINT = `html{font-size:1mm}.k{--ks:2.1mm}.bleed{position:absolute;inset:3mm}`;
job("tryk-visitkort-forside", {
  kind: "pdf", out: "03_tryksager/visitkort/selfi-visitkort-forside-91x61mm.pdf", size: () => [91, 61],
  html: (W, H) => page(W, H, "dark glowbg", `<div class="abs" style="inset:0;display:grid;place-items:center">${logo("dark", "11.5mm")}</div>`, PRINT + `.glowbg{--gx:50%;--gy:50%;--gw:60%;--gh:70%}`),
});
job("tryk-visitkort-bagside", {
  kind: "pdf", out: "03_tryksager/visitkort/selfi-visitkort-bagside-91x61mm.pdf", size: () => [91, 61],
  html: (W, H) => page(W, H, "light", `<div class="bleed">
    <div class="abs" style="left:5mm;top:5mm">${markOnly("light", "7mm")}</div>
    <span class="url abs" style="--us:2mm;right:5mm;top:6.2mm"><b>Selfi.dk</b></span>
    <div class="abs" style="left:5mm;bottom:5mm;right:5mm;display:flex;flex-direction:column;gap:1.6mm">
      <b style="font:600 4.4mm/1 var(--display);letter-spacing:-.03em">${KONTAKT.navn}</b>
      <span class="k" style="--ks:1.9mm">${KONTAKT.titel}</span>
      <span style="margin-top:2.2mm;font:400 2.6mm/1.45 var(--body);color:var(--ink)">${KONTAKT.tlf}<br>${KONTAKT.mail}</span>
    </div></div>`, PRINT),
});
job("tryk-gavekort-forside", {
  kind: "pdf", out: "03_tryksager/gavekort/selfi-gavekort-forside-91x61mm.pdf", size: () => [91, 61],
  html: (W, H) => page(W, H, "green", `<div class="bleed">
    <span class="k abs" style="left:5mm;top:5.5mm">Gavekort</span>
    <h1 class="h abs" style="--hs:7.6mm;left:5mm;top:13mm;width:46mm">En fest med Selfi.</h1>
    <div class="abs" style="left:5mm;bottom:5mm">${logo("green", "5mm")}</div>
    ${box(scr.count("3", "Smil"), "--bw:24mm;right:6mm;top:7mm")}
  </div>`, PRINT),
});
job("tryk-gavekort-bagside", {
  kind: "pdf", out: "03_tryksager/gavekort/selfi-gavekort-bagside-91x61mm.pdf", size: () => [91, 61],
  html: (W, H) => page(W, H, "light", `<div class="bleed">
    <p class="abs" style="left:5mm;top:5mm;width:60mm;font:500 3.2mm/1.3 var(--display);letter-spacing:-.01em">Gavekortet giver én dag med Selfi-fotoboksen, med videohilsner, spørgsmål og en side med alle billederne.</p>
    <div class="abs" style="left:5mm;right:5mm;bottom:12mm;display:flex;gap:4mm">
      <div style="flex:1.4"><span class="k" style="--ks:1.8mm">Kode</span><div style="margin-top:1.6mm;height:6.5mm;border:.3mm solid var(--line-strong,#8a8f88);border-radius:1.6mm"></div></div>
      <div style="flex:1"><span class="k" style="--ks:1.8mm">Gyldig til</span><div style="margin-top:1.6mm;height:6.5mm;border:.3mm solid #8a8f88;border-radius:1.6mm"></div></div>
    </div>
    <span class="url abs" style="--us:1.9mm;left:5mm;bottom:5mm">Indløs på <b>selfi.dk</b></span>
    <div class="abs" style="right:5mm;bottom:4.6mm">${markOnly("light", "4mm")}</div>
  </div>`, PRINT),
});
// Velkomstkort A6 (105×148), ligger øverst i kassen
job("tryk-velkomstkort-forside", {
  kind: "pdf", out: "03_tryksager/velkomstkort/selfi-velkomstkort-forside-A6.pdf", size: () => [111, 154],
  html: (W, H) => page(W, H, "dark glowbg", `<div class="bleed">
    <div class="abs" style="left:8mm;top:8mm">${logo("dark", "7mm")}</div>
    <h1 class="h abs" style="--hs:10.5mm;left:8mm;top:22mm;width:80mm">Hej. Nu er I klar til fest.</h1>
    ${box(scr.word("Selfi", "Hej"), "--bw:46mm;left:29.5mm;top:62mm", "glow")}
    <span class="url abs" style="--us:2.3mm;left:8mm;bottom:8mm">Vend kortet: <b>Sådan kommer I i gang</b></span>
  </div>`, PRINT + `.glowbg{--gx:50%;--gy:68%;--gw:60%;--gh:40%}`),
});
const STEPS = [
  ["Stil den op", "Sæt boksen på standeren, eller hæng den på væggen."],
  ["Sæt stikket i", "Boksen starter af sig selv. Ringen lyser, når den er klar."],
  ["Vælg jeres indstillinger", "Spørgsmål, tema og titler vælger I på jeres side på selfi.dk."],
  ["Pak den ned igen", "Læg boksen tilbage i kassen. Vi henter den dagen efter."],
];
job("tryk-velkomstkort-bagside", {
  kind: "pdf", out: "03_tryksager/velkomstkort/selfi-velkomstkort-bagside-A6.pdf", size: () => [111, 154],
  html: (W, H) => page(W, H, "light", `<div class="bleed">
    <span class="k abs" style="left:8mm;top:8mm">Sådan kommer I i gang</span>
    <ol class="abs" style="left:8mm;right:8mm;top:20mm;list-style:none;display:flex;flex-direction:column;gap:9mm">
      ${STEPS.map(([t, d], i) => `<li style="display:grid;grid-template-columns:8mm 1fr;gap:3mm;align-items:start">
        <span style="width:7mm;height:7mm;border-radius:50%;background:var(--green);color:var(--on-green);display:grid;place-items:center;font:600 3.4mm/1 var(--mono)">${i + 1}</span>
        <span><b style="display:block;font:600 5.2mm/1.1 var(--display);letter-spacing:-.02em;margin-bottom:1.6mm">${t}</b><span style="font:400 3.5mm/1.4 var(--body);color:var(--ink-muted)">${d}</span></span></li>`).join("")}
    </ol>
    <div class="abs" style="left:8mm;right:8mm;bottom:8mm;display:flex;justify-content:space-between;align-items:center;border-top:.3mm solid var(--rule);padding-top:4mm">${markOnly("light", "6mm")}<span class="url" style="--us:2.2mm">Hjælp og kontakt · <b>selfi.dk</b></span></div>
  </div>`, PRINT),
});
// Klistermærker, rund Ø60 mm (+2 mm beskæring)
for (const [name, cls, v, inner] of [
  ["groen", "green", "green", (v) => markOnly(v, "30mm")],
  ["mork", "dark", "dark", (v) => markOnly(v, "30mm")],
  ["creme", "creme", "light", (v) => logo(v, "10mm")],
]) job(`tryk-klistermaerke-${name}`, {
  kind: "pdf", out: `03_tryksager/klistermaerker/selfi-klistermaerke-${name}-oe60mm.pdf`, size: () => [64, 64],
  html: (W, H) => page(W, H, cls, `<div class="abs" style="inset:0;display:grid;place-items:center">${inner(v)}</div>`, PRINT),
});

// E-mailsignatur. Logoet hentes fra selfi.dk/brand (web/public/brand), så det virker i alle mailprogrammer.
const SIG = (logoSrc) => `<table cellpadding="0" cellspacing="0" border="0" style="font-family:Helvetica,Arial,sans-serif;color:#121412;font-size:14px;line-height:1.45">
  <tr><td style="padding-bottom:12px"><img src="${logoSrc}" width="110" height="${Math.round(110 * L.horizontal("light").h / L.horizontal("light").w)}" alt="Selfi" style="display:block;border:0"></td></tr>
  <tr><td><b style="font-size:15px">${KONTAKT.navn}</b><br><span style="color:#5c615b">${KONTAKT.titel}, Selfi</span></td></tr>
  <tr><td style="padding-top:8px">${KONTAKT.tlf}<br><a href="mailto:${KONTAKT.mail}" style="color:#121412;text-decoration:none">${KONTAKT.mail}</a><br><a href="https://selfi.dk" style="color:#0f7a3b;text-decoration:none;font-weight:bold">selfi.dk</a></td></tr>
  <tr><td style="padding-top:10px;font-size:12px;color:#5c615b">Fotoboksen, der får alle med på billedet.</td></tr></table>`;
job("tryk-email-signatur", { kind: "svg", out: "03_tryksager/email-signatur/selfi-email-signatur.html", svg: () => `<!doctype html><meta charset="utf-8"><title>Selfi e-mailsignatur</title>\n<!-- Kopier tabellen herunder ind i mailprogrammets signaturfelt. -->\n${SIG("https://selfi.dk/brand/selfi-logo-email.png")}\n` });
job("web-email-logo", {
  kind: "png", transparent: true, out: "../../web/public/brand/selfi-logo-email.png", size: () => [440, Math.round(440 * L.horizontal("light").h / L.horizontal("light").w)],
  html: (W, H) => page(W, H, "", inline(L.horizontal("light"), H, `width:${W}`)),
});
job("tryk-email-signatur-preview", {
  kind: "png", out: "03_tryksager/email-signatur/selfi-email-signatur.png", size: () => [900, 380], scale: 2,
  html: (W, H) => page(W, H, "", `<div style="padding:48px 56px;background:#fff;height:100%"><p style="font:15px/1.5 Helvetica,Arial;color:#121412;margin-bottom:28px">Venlig hilsen</p>${SIG(U("../../web/public/brand/selfi-logo-email.png"))}</div>`),
});

// ===== 04 EMBALLAGE =====
// Transportkasse til boksen (234 × 306 × 66 mm). Kassens ydermål: 320 × 400 × 120 mm. Paneler uden beskæring; trykkeriet lægger dem på stansetegningen.
const PACK = `html{font-size:1mm}`;
job("emb-kasse-front", {
  kind: "pdf", out: "04_emballage/transportkasse/panel-front-320x400mm.pdf", size: () => [320, 400],
  html: (W, H) => page(W, H, "dark glowbg", `
    <div class="abs" style="left:24mm;top:24mm">${logo("dark", "22mm")}</div>
    ${box(scr.word("Selfi", "Hej", "22cqw"), "--bw:150mm;left:85mm;top:70mm", "glow")}
    <h1 class="h abs" style="--hs:21mm;left:24mm;bottom:24mm;width:272mm">Fotoboksen, der får alle med på billedet.</h1>`, PACK + `.glowbg{--gx:50%;--gy:48%;--gw:50%;--gh:40%}`),
});
job("emb-kasse-bag", {
  kind: "pdf", out: "04_emballage/transportkasse/panel-bag-320x400mm.pdf", size: () => [320, 400],
  html: (W, H) => page(W, H, "dark", `
    <span class="k abs" style="--ks:7mm;left:24mm;top:26mm">I kassen</span>
    <ul class="abs" style="left:24mm;top:46mm;list-style:none;font:600 21mm/1.2 var(--display);letter-spacing:-.03em">
      <li>Selfi-fotoboks</li><li>Stander</li><li>Strømkabel</li><li>Velkomstkort</li></ul>
    <div class="abs" style="left:24mm;right:24mm;top:212mm;border-top:.5mm solid var(--rule);padding-top:14mm">
      <span class="k" style="--ks:7mm">Når festen er slut</span>
      <p style="margin-top:8mm;font:500 14mm/1.2 var(--display);letter-spacing:-.025em;width:260mm;color:var(--halo)">Læg boksen tilbage i kassen. Vi henter den dagen efter.</p></div>
    <div class="abs" style="left:24mm;right:24mm;bottom:24mm;display:flex;justify-content:space-between;align-items:center">${markOnly("dark", "22mm")}<span class="url" style="--us:7mm"><b>Selfi.dk</b></span></div>`, PACK),
});
const HANDLING = [["op", "Denne side op"], ["glas", "Skrøbelig"], ["tor", "Holdes tør"]];
job("emb-kasse-side", {
  kind: "pdf", out: "04_emballage/transportkasse/panel-side-120x400mm.pdf", size: () => [120, 400],
  html: (W, H) => page(W, H, "green", `
    <div class="abs" style="left:60mm;top:120mm;translate:-50% -50%;rotate:-90deg">${logo("green", "36mm", "wordmark")}</div>
    <div class="abs" style="left:14mm;right:14mm;bottom:20mm;display:flex;flex-direction:column;gap:7mm">
      ${HANDLING.map(([i, t]) => `<div style="display:flex;align-items:center;gap:5mm">${icon(i, "#0b1a10", "24mm", 6)}<span class="k" style="--ks:5mm;opacity:1;color:var(--on-green)">${t}</span></div>`).join("")}
    </div>`, PACK),
});
job("emb-kasse-top", {
  kind: "pdf", out: "04_emballage/transportkasse/panel-top-320x120mm.pdf", size: () => [320, 120],
  html: (W, H) => page(W, H, "dark", `
    <div class="abs" style="left:24mm;top:50%;translate:0 -50%">${markOnly("dark", "50mm")}</div>
    <div class="abs" style="left:80mm;right:24mm;top:50%;translate:0 -50%;display:flex;align-items:center;gap:8mm">
      <span class="k" style="--ks:8mm;color:var(--halo)">Åbn her</span><span style="flex:1;height:1mm;background:var(--green)"></span><span style="width:6mm;height:6mm;border-radius:50%;background:var(--green)"></span></div>`, PACK),
});
// Pakketape 50 mm: gentaget ordmærke
job("emb-tape", {
  kind: "png", out: "04_emballage/tape/selfi-pakketape-50mm.png", size: () => [3600, 300],
  html: (W, H) => page(W, H, "green", `<div class="abs" style="inset:0;display:flex;align-items:center;gap:110px;padding-left:60px">${Array.from({ length: 9 }, () => logo("green", "150px")).join("")}</div>`),
});

// ===== 05 MOCKUPS ===== (bygges efter de andre filer, som de bruger)
const MW = 2400, MH = 1600;
const card = (src, w, style = "", trim = [91, 61, 85, 55]) =>
  `<div class="card" style="width:${w}px;height:${w * trim[3] / trim[2]}px;background-image:url(${src});background-size:${(trim[0] / trim[2]) * 100}% ${(trim[1] / trim[3]) * 100}%;${style}"></div>`;
const MOCK = `
.surface{position:absolute;inset:0;background:radial-gradient(90% 80% at 35% 25%,#f4f2ee,#d8d6d0)}
.card{position:absolute;background-position:center;border-radius:6px;box-shadow:0 1px 0 rgba(255,255,255,.4) inset,0 2px 2px rgba(0,0,0,.18),0 18px 30px rgba(0,0,0,.16),0 50px 80px rgba(0,0,0,.14)}
.stage{position:absolute;inset:0;perspective:3200px}
.plane{position:absolute;left:50%;top:50%;transform-style:preserve-3d}
.cap{display:none;position:absolute;left:64px;bottom:52px;font:500 20px/1 var(--mono);letter-spacing:.14em;text-transform:uppercase;color:rgba(18,20,18,.5)}
.dark .cap{color:rgba(255,243,227,.45)}`;

job("mock-visitkort", {
  kind: "png", out: "05_mockups/mockup-visitkort.jpg", size: () => [MW, MH],
  html: (W, H) => page(W, H, "", `<div class="surface"></div><div class="stage"><div class="plane" style="transform:rotateX(46deg) rotateZ(-24deg)">
    ${[0, 1, 2, 3].map((i) => card(U("03_tryksager/visitkort/selfi-visitkort-forside-91x61mm.png"), 1000, `left:-900px;top:${-330 - i * 5}px;transform:translateZ(${i * 3}px) rotate(${i * 1.5 - 3}deg)`)).join("")}
    ${card(U("03_tryksager/visitkort/selfi-visitkort-bagside-91x61mm.png"), 1000, "left:120px;top:-700px;transform:translateZ(4px) rotate(7deg)")}
    ${card(U("03_tryksager/visitkort/selfi-visitkort-forside-91x61mm.png"), 1000, "left:80px;top:140px;transform:translateZ(4px) rotate(-5deg)")}
  </div></div><span class="cap">Visitkort · 85 × 55 mm</span>`, MOCK),
});

// Facebook-side på computer (generisk sidelayout, ingen platformslogoer)
job("mock-facebook", {
  kind: "png", out: "05_mockups/mockup-facebook-side.jpg", size: () => [MW, MH],
  html: (W, H) => page(W, H, "", `<div class="surface" style="background:radial-gradient(80% 80% at 50% 0%,#2a2d2a,#0e0f0e)"></div>
  <div class="abs" style="left:200px;top:120px;width:2000px;height:1560px;border-radius:22px;background:#fff;overflow:hidden;box-shadow:0 60px 120px rgba(0,0,0,.5)">
    <div style="height:72px;background:#f0f1ef;display:flex;align-items:center;gap:12px;padding:0 28px;border-bottom:1px solid #e1e3df">
      <i style="width:16px;height:16px;border-radius:50%;background:#ff5f57"></i><i style="width:16px;height:16px;border-radius:50%;background:#febc2e"></i><i style="width:16px;height:16px;border-radius:50%;background:#28c840"></i>
      <span style="margin-left:40px;flex:0 0 640px;height:40px;border-radius:12px;background:#fff;border:1px solid #e1e3df;display:flex;align-items:center;padding:0 18px;font:400 19px var(--body);color:#5c615b">Selfi · Facebook</span></div>
    <div style="background:#f0f2f5;height:100%">
      <div style="background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.1)">
        <div style="margin:0 auto;width:1640px;height:624px;border-radius:0 0 16px 16px;background:url(${U("02_some/facebook/selfi-facebook-cover-mork-1640x624.png")}) center/cover"></div>
        <div style="margin:0 auto;width:1560px;display:flex;align-items:flex-end;gap:36px;height:200px;padding-bottom:36px;border-bottom:1px solid #e1e3df">
          <div style="width:256px;height:256px;margin-top:-100px;border-radius:50%;border:8px solid #fff;background:url(${U("02_some/profilbillede/selfi-profilbillede-mork-1080.png")}) center/cover;flex:none"></div>
          <div style="flex:1;color:#121412"><b style="font:700 50px/1.1 var(--body);letter-spacing:-.01em">Selfi</b><div style="font:400 22px/1.4 var(--body);color:#5c615b;margin-top:8px">Fotoboks · Udlejning af fotoboks · selfi.dk</div></div>
          <span style="display:flex;gap:14px"><span style="font:600 22px var(--body);padding:16px 28px;border-radius:10px;background:var(--green);color:var(--on-green)">Book nu</span><span style="font:600 22px var(--body);padding:16px 28px;border-radius:10px;background:#e4e6e3;color:#121412">Send besked</span></span>
        </div>
        <div style="margin:0 auto;width:1560px;display:flex;gap:44px;padding:22px 0;font:600 21px var(--body);color:#5c615b"><span style="color:#0f7a3b;border-bottom:4px solid #0f7a3b;padding-bottom:18px">Opslag</span><span>Om</span><span>Billeder</span><span>Videoer</span></div>
      </div>
      <div style="margin:28px auto 0;width:1560px;display:grid;grid-template-columns:560px 1fr;gap:28px">
        <div style="background:#fff;border-radius:14px;height:420px;padding:28px;font:400 21px/1.5 var(--body);color:#121412"><b style="font:700 26px var(--body)">Om</b><p style="margin-top:14px;color:#5c615b">Fotoboksen, der får alle med på billedet. Videohilsner, spørgsmål og en side med alle billederne. Fra 495 kr.</p></div>
        <div style="background:#fff;border-radius:14px;height:700px;padding:28px;display:flex;flex-direction:column;gap:20px"><div style="display:flex;gap:16px;align-items:center"><i style="width:64px;height:64px;border-radius:50%;background:url(${U("02_some/profilbillede/selfi-profilbillede-mork-1080.png")}) center/cover"></i><b style="font:700 22px var(--body);color:#121412">Selfi</b></div>
          <div style="flex:1;border-radius:10px;background:url(${ADS}feed_1080x1350/01_alle-med.png) center 20%/cover"></div></div>
      </div>
    </div>
  </div>`, MOCK),
});

// Instagram-profil og story på mobil
const phone = (inner, style) => `<div class="abs" style="width:640px;height:1320px;border-radius:96px;background:#0b0c0b;padding:18px;box-shadow:0 0 0 3px #2a2d2a inset,0 70px 120px rgba(0,0,0,.35),0 20px 40px rgba(0,0,0,.25);${style}"><div style="position:relative;width:100%;height:100%;border-radius:80px;overflow:hidden;background:#fff">${inner}<i style="position:absolute;left:50%;top:22px;translate:-50% 0;width:170px;height:48px;border-radius:30px;background:#0b0c0b"></i></div></div>`;
const FEED = ["01_alle-med", "02_videohilsner", "03_spoergsmaal", "04_titler", "05_missioner", "06_webportal", "07_anledninger", "08_pris-service"];
const igProfile = `<div style="padding:96px 30px 0;color:#121412;font-family:var(--body)">
  <div style="font:700 30px var(--body);text-align:center">selfi.dk</div>
  <div style="display:flex;align-items:center;gap:28px;margin-top:30px"><i style="width:160px;height:160px;border-radius:50%;background:url(${U("02_some/profilbillede/selfi-profilbillede-mork-1080.png")}) center/cover;flex:none"></i>
    <div><b style="font:700 26px var(--body)">Selfi</b><p style="font:400 21px/1.4 var(--body);margin-top:8px">Fotoboksen, der får alle med på billedet. Fra 495 kr.<br><span style="color:#0f7a3b">selfi.dk</span></p></div></div>
  <div style="display:flex;gap:12px;margin-top:26px"><span style="flex:1;text-align:center;font:600 21px var(--body);padding:14px;border-radius:12px;background:var(--green);color:var(--on-green)">Følg</span><span style="flex:1;text-align:center;font:600 21px var(--body);padding:14px;border-radius:12px;background:#eef0ec">Send besked</span></div>
  <div style="display:flex;gap:20px;margin-top:30px">${HL.slice(0, 5).map(([id, , t]) => `<div style="display:flex;flex-direction:column;align-items:center;gap:8px;font:400 17px var(--body)"><i style="width:96px;height:96px;border-radius:50%;border:2px solid #d9dcd6;box-shadow:0 0 0 4px #fff inset;background:url(${U(`02_some/instagram/highlights/highlight-${id}-1080x1920.png`)}) center/cover"></i>${t}</div>`).join("")}</div></div>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:3px;margin-top:30px">${[...FEED, "tak"].map((f) => `<i style="aspect-ratio:3/4;background:url(${f === "tak" ? U("02_some/skabeloner/feed-tak-for-festen-1080x1350.png") : `${ADS}feed_1080x1350/${f}.png`}) center/cover"></i>`).join("")}</div>`;
const story = `<div style="position:absolute;inset:0;background:#22d36b url(${U("02_some/skabeloner/story-ledig-dato-1080x1920.png")}) center/100% auto no-repeat"></div>
  <div style="position:absolute;left:24px;right:24px;top:84px;display:flex;gap:6px">${[1, 1, 0].map((on) => `<i style="flex:1;height:5px;border-radius:3px;background:rgba(11,26,16,${on ? .85 : .25})"></i>`).join("")}</div>
  <div style="position:absolute;left:24px;top:106px;display:flex;align-items:center;gap:12px;font:600 21px var(--body);color:#0b1a10"><i style="width:48px;height:48px;border-radius:50%;background:url(${U("02_some/profilbillede/selfi-profilbillede-mork-1080.png")}) center/cover"></i>selfi.dk</div>`;
job("mock-instagram", {
  kind: "png", out: "05_mockups/mockup-instagram.jpg", size: () => [MW, MH],
  html: (W, H) => page(W, H, "green", `
    ${phone(igProfile, "left:480px;top:180px;rotate:-4deg")}
    ${phone(story, "left:1280px;top:120px;rotate:5deg")}
    <span class="cap" style="color:rgba(11,26,16,.55)">Instagram · profil, highlights og story</span>`, MOCK),
});

// Transportkasse i 3D med velkomstkort
const S = 2.1; // px pr. mm
const BW = 320 * S, BH = 400 * S, BD = 120 * S;
const face = (src, w, h, t) => `<div class="abs" style="left:0;top:0;width:${w}px;height:${h}px;background:url(${src}) center/100% 100%;transform:${t};backface-visibility:hidden"></div>`;
job("mock-emballage", {
  kind: "png", out: "05_mockups/mockup-emballage.jpg", size: () => [MW, MH],
  html: (W, H) => page(W, H, "", `<div class="surface" style="background:radial-gradient(70% 70% at 45% 35%,#f1efea,#d3d0c9)"></div>
    <div class="abs" style="left:640px;top:1180px;width:1000px;height:110px;border-radius:50%;background:rgba(0,0,0,.4);filter:blur(36px)"></div><div class="abs" style="left:1620px;top:1250px;width:360px;height:40px;border-radius:50%;background:rgba(0,0,0,.35);filter:blur(16px)"></div>
    <div class="stage" style="perspective:5200px;perspective-origin:1000px 200px"><div class="plane" style="left:1000px;top:330px;transform:rotateX(-14deg) rotateY(-36deg)">
      ${face(U("04_emballage/transportkasse/panel-front-320x400mm.png"), BW, BH, `translateZ(${BD / 2}px) translateX(${-BW / 2}px)`)}
      ${face(U("04_emballage/transportkasse/panel-side-120x400mm.png"), BD, BH, `translateX(${BW / 2 - BD / 2}px) rotateY(90deg)`)}
      ${face(U("04_emballage/transportkasse/panel-top-320x120mm.png"), BW, BD, `translateX(${-BW / 2}px) translateY(${-BD / 2}px) rotateX(90deg)`)}
      <div class="abs" style="left:0;top:0;width:${BW}px;height:${BD}px;transform:translateX(${-BW / 2}px) translateY(${-BD / 2}px) rotateX(90deg) translateZ(1px);background:linear-gradient(90deg,transparent 0 46%,rgba(34,211,107,.95) 46% 54%,transparent 54%);opacity:.9"></div>
    </div></div>
    ${card(U("03_tryksager/velkomstkort/selfi-velkomstkort-forside-A6.png"), 330, "left:1640px;top:810px;rotate:4deg;border-radius:4px", [111, 154, 105, 148])}
    <span class="cap">Transportkasse 320 × 400 × 120 mm · velkomstkort A6</span>`, MOCK),
});

// Flatlay: mulepose, klistermærker, gavekort og tape
const toteSvg = `<svg viewBox="0 0 800 1080" style="position:absolute;left:150px;top:160px;width:800px;height:1080px;filter:drop-shadow(0 30px 40px rgba(0,0,0,.22))">
  <defs><pattern id="weave" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="6" height="6" fill="#efe6d4"/><path d="M0 3h6M3 0v6" stroke="#e4d9c4" stroke-width="1"/></pattern></defs>
  <path d="M220 260 C220 40 580 40 580 260" fill="none" stroke="#e6dbc6" stroke-width="44"/><path d="M220 260 C220 40 580 40 580 260" fill="none" stroke="#d9cdb6" stroke-width="44" stroke-dasharray="2 10" opacity=".5"/>
  <rect x="40" y="240" width="720" height="820" rx="8" fill="url(#weave)"/></svg>`;
job("mock-merch", {
  kind: "png", out: "05_mockups/mockup-merchandise.jpg", size: () => [MW, MH],
  html: (W, H) => page(W, H, "", `<div class="surface" style="background:radial-gradient(90% 90% at 40% 30%,#2a2d2a,#121412)"></div>
    ${toteSvg}
    <div class="abs" style="left:550px;top:820px;translate:-50% -50%">${logo("sort", "300px", "stacked")}</div>
    ${["groen", "mork", "creme"].map((n, i) => `<div class="abs" style="left:${1180 + i * 330}px;top:${210 + (i % 2) * 90}px;width:300px;height:300px;border-radius:50%;background:url(${U(`03_tryksager/klistermaerker/selfi-klistermaerke-${n}-oe60mm.png`)}) center/106.7% 106.7%;box-shadow:0 2px 2px rgba(0,0,0,.25),0 20px 34px rgba(0,0,0,.3);rotate:${i * 12 - 10}deg"></div>`).join("")}
    ${card(U("03_tryksager/gavekort/selfi-gavekort-forside-91x61mm.png"), 640, "left:1210px;top:700px;rotate:-6deg")}
    ${card(U("03_tryksager/gavekort/selfi-gavekort-bagside-91x61mm.png"), 640, "left:1560px;top:1000px;rotate:9deg")}
    <div class="abs" style="left:-100px;top:1400px;width:1400px;height:96px;background:url(${U("04_emballage/tape/selfi-pakketape-50mm.png")}) left/auto 100%;rotate:-4deg;box-shadow:0 8px 16px rgba(0,0,0,.3);opacity:.96"></div>
    <span class="cap" style="color:rgba(255,243,227,.45);left:auto;right:64px">Mulepose · klistermærker Ø60 mm · gavekort · pakketape</span>`, MOCK),
});

// ===== BRANDGUIDE ===== (16:9-sider samlet i én PDF)
const COLORS = [
  ["Nat", "#0e0f0e", "14 15 14", "C60 M40 Y40 K100", "Black 6 C", "Baggrund. Det meste af Selfi er mørkt, så lyset fra ringen står frem.", "dark"],
  ["Halo", "#fff3e3", "255 243 227", "C0 M4 Y11 K0", "Creme papir", "Tekst på mørk baggrund. Farven på ringens lys.", "creme"],
  ["Selfi-grøn", "#22d36b", "34 211 107", "C70 M0 Y80 K0", "7479 C", "Accent: symbolet, prikken over i, knapper og stempler.", "green"],
  ["Papir", "#f3f4f1", "243 244 241", "C3 M2 Y4 K0", "Hvidt papir", "Lys baggrund til tryk, formularer og ydersider.", "light"],
];
const COLORS2 = [["Skov", "#0b1a10", "Tekst og logo på grøn"], ["Grøn tekst", "#0f7a3b", "Grøn tekst på lys baggrund (Pantone 356 C)"], ["Blæk", "#121412", "Tekst på lys baggrund"], ["Grå", "#a3a8a2", "Sekundær tekst på mørk"], ["Grå mørk", "#5c615b", "Sekundær tekst på lys"]];
const GP = `
html{--W:1920px;--H:1080px}body{height:auto;overflow:visible}html{height:auto;overflow:visible}
.pg{position:relative;width:1920px;height:1080px;overflow:hidden;page-break-after:always;padding:96px 120px}
.pg .k{--ks:18px}.pg h2{font:600 76px/.98 var(--display);letter-spacing:-.04em;margin-top:22px;max-width:16ch;text-wrap:balance}
.pg .p{--ps:24px;max-width:46ch;margin-top:22px}
.num{position:absolute;right:120px;top:96px;font:500 18px/1 var(--mono);letter-spacing:.14em;color:var(--muted)}
.foot{position:absolute;left:120px;right:120px;bottom:56px;display:flex;justify-content:space-between;align-items:center;font:500 16px/1 var(--mono);letter-spacing:.14em;text-transform:uppercase;color:var(--muted)}
.tile{position:relative;border-radius:24px;display:grid;place-items:center;overflow:hidden}
.tile .lbl{position:absolute;left:22px;bottom:18px;font:500 14px/1 var(--mono);letter-spacing:.12em;text-transform:uppercase;opacity:.6}
.light .tile.light{border:1.5px solid #d9dcd6}
.img{border-radius:20px;background:center/cover;box-shadow:0 20px 40px rgba(0,0,0,.18)}
table{border-collapse:collapse;width:100%;font:400 19px/1.3 var(--body)}td,th{text-align:left;padding:13px 0;border-bottom:1.5px solid var(--rule)}th{font:500 14px/1 var(--mono);letter-spacing:.12em;text-transform:uppercase;color:var(--muted)}
.do,.dont{font:500 22px/1.35 var(--display);padding:22px 26px;border-radius:18px}.do{background:rgba(34,211,107,.14)}.dont{background:rgba(255,122,107,.12);text-decoration:line-through;text-decoration-color:rgba(255,122,107,.7)}
.do b,.dont b{display:block;font:500 13px/1 var(--mono);letter-spacing:.14em;text-transform:uppercase;margin-bottom:10px;text-decoration:none}
`;
let PN = 0;
const pg = (cls, body, title = "") => `<section class="pg ${cls}">${body}${title ? `<span class="num">${String(++PN).padStart(2, "0")} · ${title}</span><div class="foot"><span>Selfi brandguide</span><span>Oktober 2026</span></div>` : ""}</section>`;
const head = (k, h, p = "") => `<span class="k">${k}</span><h2>${h}</h2>${p ? `<p class="p">${p}</p>` : ""}`;
const tile = (cls, inner, lbl, style = "") => `<div class="tile ${cls}" style="${style}">${inner}<span class="lbl">${lbl}</span></div>`;

function guideHtml() {
  PN = 0;
  const L0 = L.horizontal("light"); const kx = 640 / L0.w; // logoets skala på frizone-siden
  const pages = [
    // Forside
    `<section class="pg dark glowbg" style="--gx:50%;--gy:50%;--gw:50%;--gh:50%"><div class="abs" style="inset:0;display:grid;place-items:center">${logo("dark", "190px")}</div>
      <div class="foot"><span>Brandguide</span><span>Oktober 2026</span></div></section>`,
    pg("dark", `${head("Brandet", "Fotoboksen, der får alle med på billedet.", "Selfi er en lille fotoboks med studielys, der hænger på væggen eller står på en stander. Brandet skal føles som boksen: mørkt rum, varmt lys, et smil. Konkret før kreativt.")}
      <div class="abs" style="left:1040px;top:250px;width:760px;display:grid;gap:22px">
        <div class="do" style="background:var(--raised)"><b style="color:var(--green)">Privat</b>Lej en fotoboks, der får alle med på billedet. Pris er det stærkeste argument.</div>
        <div class="do" style="background:var(--raised)"><b style="color:var(--green)">Erhverv</b>Fotoboksen, der får gæsterne til at komme igen. Det handler om omsætning.</div>
        <div class="do" style="background:var(--raised)"><b style="color:var(--green)">Tre ord</b>Lys. Smil. Ærlig.</div>
      </div>`, "Brandet"),
    pg("light", `${head("Logo", "Symbolet er boksen, set forfra.", "Ringen er lysringen, prikken øverst er kameraet, og buen er smilet. Prikken over i'et er den samme grønne linse. Logoet leveres altid som filerne i 01_logo; skriv det aldrig selv med fonten.")}
      <div class="abs" style="left:900px;top:300px;width:900px;height:520px;display:grid;place-items:center">
        <div style="position:relative;padding:${Math.round(0.5 * 80 * L.K * kx)}px;outline:2px dashed #b9bdb6;outline-offset:-1px">
          <div style="outline:1.5px solid rgba(34,211,107,.6)">${inline(L0, `${Math.round(L0.h * kx)}px`)}</div>
          <span class="k" style="position:absolute;left:0;top:-34px;--ks:14px">Frizone = ½ symbolets bredde hele vejen rundt</span></div></div>
      <div class="abs" style="left:120px;bottom:130px;display:flex;gap:56px;align-items:flex-end">
        <div>${logo("light", "34px")}<span class="k" style="display:block;margin-top:14px;--ks:13px">Min. 25 mm / 100 px</span></div>
        <div>${markOnly("light", "34px")}<span class="k" style="display:block;margin-top:14px;--ks:13px">Min. 8 mm / 24 px</span></div></div>`, "Logo"),
    pg("light", `${head("Logovarianter", "Seks versioner, én form.")}
      <div class="abs" style="left:120px;right:120px;top:330px;bottom:130px;display:grid;grid-template-columns:repeat(4,1fr);grid-template-rows:1fr 1fr;gap:20px">
        ${tile("dark", logo("dark", "64px"), "Hovedlogo · mørk", "grid-column:span 2")}
        ${tile("green", logo("green", "64px"), "Grøn", "grid-column:span 2")}
        ${tile("light", logo("light", "58px"), "Lys")}
        ${tile("creme", logo("light", "120px", "stacked"), "Stablet")}
        ${tile("dark", markOnly("dark", "130px"), "Symbol · profilbillede")}
        <div style="display:grid;grid-template-rows:1fr 1fr;gap:20px">${tile("light", logo("sort", "36px"), "Sort, 1 farve")}${tile("dark", logo("hvid", "36px"), "Hvid, 1 farve")}</div>
      </div>`, "Logo"),
    pg("dark", `${head("Logo", "Sådan bruger vi det ikke.")}
      <div class="abs" style="left:120px;right:120px;top:340px;display:grid;grid-template-columns:repeat(3,1fr);gap:20px">
        ${[["Strakt eller presset", `<div style="transform:scaleX(1.5)">${logo("dark", "60px")}</div>`],
           ["Drejet", `<div style="rotate:-14deg">${logo("dark", "60px")}</div>`],
           ["Andre farver", `<div style="filter:hue-rotate(150deg)">${logo("dark", "60px")}</div>`],
           ["Glød, skygge eller gradient", `<div style="filter:drop-shadow(0 0 18px #22d36b) drop-shadow(6px 6px 0 #ff7a6b)">${logo("dark", "60px")}</div>`],
           ["Grøn på grøn eller lav kontrast", `<div style="background:#22d36b;padding:40px 60px;border-radius:12px">${logo("dark", "60px")}</div>`],
           ["Ny tekst ved siden af", `<div style="display:flex;align-items:center;gap:20px">${logo("dark", "60px")}<span style="font:600 50px var(--display);letter-spacing:-.04em">Party</span></div>`]]
          .map(([t, inner]) => `<div class="tile" style="height:270px;background:var(--raised)">${inner}<span class="lbl" style="color:#ff7a6b;opacity:1">✕ ${t}</span></div>`).join("")}
      </div>`, "Logo"),
    pg("light", `${head("Farver", "Nat, lys og én grøn.", "Omtrent 60 % nat, 25 % creme og papir, 15 % grøn. Grøn er en accent, aldrig en flade bag lange tekster.")}
      <div class="abs" style="left:120px;right:120px;top:460px;height:330px;display:grid;grid-template-columns:repeat(4,1fr);gap:20px">
        ${COLORS.map(([n, hex, rgb, cmyk, pms, txt, cls]) => `<div class="${cls}" style="border-radius:24px;padding:28px;display:flex;flex-direction:column;justify-content:space-between;${cls === "light" ? "border:1.5px solid #d9dcd6" : ""}">
          <b style="font:600 36px/1 var(--display);letter-spacing:-.03em">${n}</b>
          <div style="font:500 16px/1.75 var(--mono);letter-spacing:.04em">${hex.toUpperCase()}<br>RGB ${rgb}<br>${cmyk}<br>Pantone ${pms}</div></div>`).join("")}
      </div>
      <div class="abs" style="left:120px;right:120px;top:820px;height:24px;border-radius:12px;overflow:hidden;display:flex"><i style="flex:60;background:#0e0f0e"></i><i style="flex:13;background:#fff3e3"></i><i style="flex:12;background:#e4e6e1"></i><i style="flex:15;background:#22d36b"></i></div>
      <div class="abs" style="left:120px;right:120px;top:880px;display:flex;gap:40px">${COLORS2.map(([n, h, t]) => `<div style="display:flex;gap:12px;align-items:center;font:400 16px/1.3 var(--body)"><i style="width:34px;height:34px;border-radius:50%;background:${h};flex:none;border:1px solid #d9dcd6"></i><span><b>${n}</b> <span style="font-family:var(--mono)">${h.toUpperCase()}</span><br><span style="color:var(--ink-muted)">${t}</span></span></div>`).join("")}</div>`, "Farver"),
    pg("dark", `${head("Typografi", "Tre skrifter, fri til brug.", "Alle tre er gratis på Google Fonts. Overskrifter er tætte og korte, brødtekst er rolig, og etiketter står i versaler med luft.")}
      <div class="abs" style="left:1000px;top:120px;right:120px;display:grid;gap:44px">
        <div><span class="k" style="--ks:14px">Instrument Sans · 600 · overskrifter</span><div style="font:600 96px/.95 var(--display);letter-spacing:-.045em;margin-top:16px">Alle med på billedet.</div></div>
        <div><span class="k" style="--ks:14px">Geist · 400 · brødtekst</span><div style="font:400 30px/1.4 var(--body);margin-top:16px;color:var(--halo)">Gæsterne kan sige tillykke på video, svare på jeres spørgsmål og finde alle billeder på jeres side dagen efter.</div></div>
        <div><span class="k" style="--ks:14px">Geist Mono · 500 · etiketter og stempler</span><div style="font:500 26px/1 var(--mono);letter-spacing:.14em;text-transform:uppercase;margin-top:20px;color:var(--green)">Markedets laveste pris · selfi.dk</div></div>
        <table style="color:var(--halo)"><tr><th>Brug</th><th>Skrift</th><th>Spatiering</th></tr><tr><td>Overskrift</td><td>Instrument Sans 600</td><td>−4,5 %</td></tr><tr><td>Brødtekst</td><td>Geist 400</td><td>0</td></tr><tr><td>Etiket</td><td>Geist Mono 500, versaler</td><td>+14 %</td></tr></table>
      </div>`, "Typografi"),
    pg("dark", `${head("Grafik", "Boksen er vores billede.", "Vi tegner kun hovedenheden: ring, kamera og skærm som flad grafik. Skærmen viser det, boksen faktisk gør. Aldrig printmodul, standard-renders eller tekniske tegninger i kundevendt materiale.")}
      ${box(scr.count(), "--bw:250px;left:1000px;top:330px", "glow")}
      ${box(scr.word("Dagens spørgsmål", "Hvad er jeres bedste minde?", "10cqw"), "--bw:250px;left:1300px;top:330px", "glow")}
      ${box(scr.photo("print-wedding.jpg", "Sig tillykke"), "--bw:250px;left:1600px;top:330px", "glow")}
      ${stamp("Aftenens største smil", "g", "--ss:20px;left:1050px;top:720px;rotate:-4deg")}
      ${stamp("Videohilsner", "c", "--ss:20px;left:1480px;top:760px;rotate:5deg")}
      <div class="abs" style="left:120px;bottom:140px;display:flex;gap:16px">${["Ens kant hele vejen rundt", "Koncentriske hjørner", "Varmt lys, ingen neon"].map((t) => `<span class="pill" style="--pls:18px;background:var(--raised);color:var(--halo)">${t}</span>`).join("")}</div>`, "Grafik"),
    pg("light", `${head("Tone", "Skriv, hvad boksen gør.", "Vi taler til værten med “I” og “jeres”. Varm og tør, ikke fjollet. Tal skaber tillid: 495 kr., fem minutter, 6,6 cm.")}
      <div class="abs" style="left:1000px;right:120px;top:150px;display:grid;gap:18px">
        <div class="do"><b>Sådan</b>Gæsterne kan også sige det på video.</div><div class="dont"><b>Ikke sådan</b>En uforglemmelig oplevelse til din fest!</div>
        <div class="do"><b>Sådan</b>Ringen skifter til hvidt studielys.</div><div class="dont"><b>Ikke sådan</b>Lyset klarer resten ✨</div>
        <div class="do"><b>Sådan</b>Fra 495 kr. for en dag, inkl. moms.</div><div class="dont"><b>Ikke sådan</b>Verdensklasse underholdning til skarpe priser</div>
      </div>
      <p class="abs p" style="left:120px;bottom:140px;--ps:20px;max-width:40ch">Ingen emojis, ingen udråbstegn, ingen opdigtede anmeldelser eller tal. Se web/TEKSTSTRATEGI.md for hele tekststrategien.</p>`, "Tone"),
    pg("dark", `${head("Billeder", "Rigtige fester, rigtige mennesker.", "Tæt på, varmt lys, flere på billedet. Ingen stockfotos af modeller. De billeder, vi bruger i dag, er AI-genererede pladsholdere og skal skiftes ud med billeder fra rigtige fester, så snart vi har dem.")}
      <div class="abs" style="left:1000px;top:120px;right:120px;bottom:120px;display:grid;grid-template-columns:1fr 1fr;gap:20px">
        ${["print-wedding.jpg", "print-birthday.jpg", "print-office.jpg", "print-club.jpg"].map((f) => `<div class="img" style="background-image:url(${A}${f})"></div>`).join("")}</div>`, "Billeder"),
    pg("light", `${head("Sociale medier", "Samme afsender overalt.", "Profilbilledet er symbolet på mørk baggrund. Coveret bærer budskabet, highlights bruger linjeikoner i samme streg som logoet.")}
      <div class="abs img" style="left:1000px;top:120px;width:800px;height:304px;background-image:url(${U("02_some/facebook/selfi-facebook-cover-mork-1640x624.png")})"></div>
      <div class="abs img" style="left:1000px;top:448px;width:800px;height:200px;background-image:url(${U("02_some/linkedin/selfi-linkedin-banner-1584x396.png")})"></div>
      <div class="abs" style="left:1000px;top:690px;display:flex;gap:22px;align-items:center">
        <i style="width:150px;height:150px;border-radius:50%;background:url(${U("02_some/profilbillede/selfi-profilbillede-mork-1080.png")}) center/cover;box-shadow:0 14px 30px rgba(0,0,0,.2)"></i>
        ${HL.slice(0, 5).map(([id, , t]) => `<div style="display:flex;flex-direction:column;align-items:center;gap:10px;font:400 16px var(--body)"><i style="width:100px;height:100px;border-radius:50%;background:url(${U(`02_some/instagram/highlights/highlight-${id}-1080x1920.png`)}) center/cover;box-shadow:0 0 0 3px #fff,0 0 0 5px #d9dcd6"></i>${t}</div>`).join("")}</div>
      <table class="abs" style="left:120px;width:740px;bottom:140px"><tr><th>Fil</th><th>Mål</th></tr><tr><td>Profilbillede (alle)</td><td>1080 × 1080</td></tr><tr><td>Facebook-cover</td><td>1640 × 624</td></tr><tr><td>LinkedIn-banner</td><td>1584 × 396</td></tr><tr><td>YouTube-banner</td><td>2560 × 1440</td></tr><tr><td>Highlights og stories</td><td>1080 × 1920</td></tr></table>`, "SoMe"),
    pg("dark", `<div class="abs img" style="inset:0;border-radius:0;background-image:url(${U("05_mockups/mockup-instagram.jpg")})"></div>`, ""),
    pg("light", `${head("Tryksager", "Visitkort, gavekort og velkomstkort.", "Visitkort 85 × 55 mm, mørk forside og lys bagside. Gavekortet er grønt, så det skiller sig ud. Velkomstkortet i A6 ligger øverst i kassen.")}
      <div class="abs img" style="left:900px;top:0;right:0;bottom:0;border-radius:0;background-image:url(${U("05_mockups/mockup-visitkort.jpg")})"></div>`, "Tryksager"),
    pg("light", `${head("Emballage", "Kassen siger hej, før boksen gør.", "Transportkasse 320 × 400 × 120 mm i mat sort med grønne sider, håndteringsikoner og pakketape med logoet. Bagsiden fortæller, hvad der er i kassen, og hvad I gør, når festen er slut.")}
      <div class="abs img" style="left:900px;top:0;right:0;bottom:0;border-radius:0;background-image:url(${U("05_mockups/mockup-emballage.jpg")})"></div>`, "Emballage"),
    pg("dark", `<div class="abs img" style="inset:0;border-radius:0;background-image:url(${U("05_mockups/mockup-merchandise.jpg")})"></div>`, ""),
    pg("dark", `${head("Filer", "Det hele ligger i brandpakken.")}
      <table class="abs" style="left:120px;right:120px;top:360px;color:var(--halo)"><tr><th>Mappe</th><th>Indhold</th></tr>
        <tr><td>01_logo</td><td>Logo, stablet logo, symbol og ordmærke i seks farver som SVG og PNG. App-ikoner og favicon.</td></tr>
        <tr><td>02_some</td><td>Profilbilleder, Facebook-covers, LinkedIn- og YouTube-banner, Instagram-highlights og to skabeloner.</td></tr>
        <tr><td>03_tryksager</td><td>Visitkort, gavekort, velkomstkort A6 og klistermærker som tryk-PDF med 3 mm beskæring, plus e-mailsignatur.</td></tr>
        <tr><td>04_emballage</td><td>Transportkassens paneler som PDF og pakketape.</td></tr>
        <tr><td>05_mockups</td><td>Visualiseringer af det hele.</td></tr>
        <tr><td>kilde</td><td>Byg det hele om med <span style="font-family:var(--mono)">node build.cjs</span>. Tekster og mål står i build.cjs.</td></tr></table>`, "Filer"),
  ];
  return page("1920px", "1080px", "", pages.join(""), GP);
}
job("guide", { kind: "guide", out: "Selfi_brandguide.pdf", html: guideHtml });

module.exports = { jobs, job, page, logo, markOnly, box, scr, stamp, icon, inline, L, A, ADS, U, OUT, ROOT };
if (require.main === module) require("./render.cjs").run(jobs, process.argv[2]);
