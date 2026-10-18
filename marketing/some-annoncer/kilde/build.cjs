// Selfi SoMe-annoncer (B2C). Bygger hver annonce som HTML og tager et skærmbillede med Playwright.
// Brug: NODE_PATH=$(npm root -g) node build.cjs [filter]
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const A = "file://" + path.join(__dirname, "assets") + "/";
const OUT = path.join(__dirname, "out");

const FORMATS = {
  feed: { W: 1080, H: 1350 },
  story: { W: 1080, H: 1920 },
};

// ---------- Byggeklodser ----------

const MARK = `<svg viewBox="0 0 92 120"><path class="r" d="M58 12 H60 A20 20 0 0 1 80 32 V88 A20 20 0 0 1 60 108 H32 A20 20 0 0 1 12 88 V32 A20 20 0 0 1 32 12 H34"/><circle class="l" cx="46" cy="12" r="7"/><path class="r" d="M31 66 A17 17 0 0 0 61 66"/></svg>`;
const logo = () => `<span class="logo">${MARK}<span class="word">self<span class="i">ı</span></span></span>`;

// Boksen som flad grafik (samme tegning som i filmene). Koncentrisk: skal R36, ring R22 (14 inde), skærm R6 (30 inde).
const box = (screen, cls = "", style = "") => `<div class="box ${cls}" style="${style}"><svg viewBox="0 0 234 306">
<rect class="shell" x="0.75" y="0.75" width="232.5" height="304.5" rx="36"/>
<rect class="ringb" x="14" y="14" width="206" height="278" rx="22"/>
<rect class="ring" x="14" y="14" width="206" height="278" rx="22"/>
<rect class="notch" x="99" y="5" width="36" height="18" rx="9"/><circle class="cam" cx="117" cy="14" r="4.5"/>
</svg><div class="screen">${screen}</div></div>`;

const stamp = (t, cls = "", style = "") => `<div class="stamp ${cls}" style="${style}">${t}</div>`;

const scr = {
  count: (n = "3", t = "Smil til kameraet") => `<div class="s-count"><b>${n}</b><small>${t}</small></div>`,
  rec: (img, line, time = "0:12") => `<div class="s-photo" style="background-image:url(${A}${img})"></div>
    <div class="s-rec"><span class="dot"></span>Optager <em>${time}</em></div>
    <div class="s-cap">${line}</div>`,
  question: (q) => `<div class="s-q"><span class="k">Dagens spørgsmål</span><b>${q}</b><span class="btn-rec"><i></i>Tryk og svar på video</span></div>`,
  photo: (img, extra = "") => `<div class="s-photo" style="background-image:url(${A}${img})"></div>${extra}`,
  mission: () => `<div class="s-m"><span class="k">Mission 3 af 5</span><b>Tag et billede med en, du ikke kendte i forvejen</b><span class="dots"><i class="on"></i><i class="on"></i><i class="on"></i><i></i><i></i></span></div>`,
  word: (k, t, cls = "") => `<div class="s-word ${cls}"><span class="k">${k}</span><b>${t}</b></div>`,
};

const phone = (cls = "", style = "") => `<div class="phone ${cls}" style="${style}">
  <span class="k">Eventside</span>
  <h3>Freja 14 år</h3>
  <span class="meta">Konfirmation · 312 billeder · 41 videohilsner</span>
  <div class="grid">
    <i style="background-image:url(${A}print-wedding.jpg)"></i>
    <i class="v" style="background-image:url(${A}print-birthday.jpg)"></i>
    <i style="background-image:url(${A}print-office.jpg)"></i>
    <i class="v" style="background-image:url(${A}print-club.jpg)"></i>
    <i style="background-image:url(${A}print-birthday.jpg);background-position:30% 40%"></i>
    <i style="background-image:url(${A}print-wedding.jpg);background-position:80% 30%"></i>
  </div>
  <span class="dl">Hent alle</span>
</div>`;

const panel = (cls = "", style = "") => `<div class="panel ${cls}" style="${style}">
  <span class="k">Kontrolpanel</span>
  <div class="row"><span>Videohilsner</span><span class="tog on"></span></div>
  <div class="row q"><span>Spørgsmål</span><em>Hvad er jeres bedste minde med Freja?</em></div>
  <div class="row"><span>Titler</span><span class="tog on"></span></div>
  <div class="row"><span>Missioner</span><span class="tog on"></span></div>
  <div class="row"><span>Tema</span><em class="v">Konfirmation</em></div>
</div>`;

const vthumb = (img, t, d, style = "") => `<div class="vthumb" style="${style}"><i style="background-image:url(${A}${img})"></i><span class="play"></span><span class="t">${t}<em>${d}</em></span></div>`;

// ---------- Annoncerne ----------
// Hver annonce: tone (dark/light/green), kicker, overskrift, undertekst og en visual pr. format.

const OCC = ["Konfirmation", "Bryllup", "Fødselsdag", "Firmafest", "Barnedåb"];
const chips = (cls = "") => `<div class="chips ${cls}">${OCC.map((o) => `<span>${o}</span>`).join("")}</div>`;

const ads = [
  {
    id: "01_alle-med",
    tone: "dark",
    kicker: "Fotoboks til jeres fest",
    h1: "Fotoboksen, der får alle med på billedet.",
    sub: chips(),
    vis: {
      feed: box(scr.count(), "glow", "--bw:min(56cqw, calc(104cqh * .765));left:50%;top:0;translate:-50% 0")
        + stamp("Videohilsner", "pill-line", "left:0;top:10%;rotate:-4deg") + stamp("Titler", "pill-line", "right:2%;top:42%;rotate:5deg") + `<div class="price-sticker" style="right:0;top:0;rotate:8deg"><small>Fra</small><b>499 kr.</b><small>Markedets laveste pris</small></div>`
        + stamp("Missioner", "pill-line", "left:2%;top:56%;rotate:3deg") + stamp("Spørgsmål", "pill-line", "right:0;top:72%;rotate:-3deg"),
      story: box(scr.count(), "glow", "--bw:min(68cqw, calc(100cqh * .765));left:50%;top:0;translate:-50% 0")
        + stamp("Videohilsner", "pill-line", "left:0;top:2%;rotate:-4deg") + stamp("Titler", "pill-line", "right:0;top:40%;rotate:5deg") + `<div class="price-sticker" style="right:0;top:0;rotate:8deg"><small>Fra</small><b>499 kr.</b><small>Markedets laveste pris</small></div>`
        + stamp("Missioner", "pill-line", "left:0;top:46%;rotate:3deg") + stamp("Spørgsmål", "pill-line", "right:0;top:60%;rotate:-3deg"),
    },
    tag: "Markedets laveste pris",
  },
  {
    id: "02_videohilsner",
    tone: "light",
    kicker: "Videohilsner",
    h1: "Gæsterne kan også sige det på video.",
    sub: "Boksen optager hilsner til jer, og I får dem alle sammen dagen efter.",
    vis: {
      feed: box(scr.rec("print-birthday.jpg", "Sig tillykke til Bente"), "", "--bw:min(58cqw, calc(104cqh * .765));left:50%;top:0;translate:-50% 0")
        + stamp("Bente 60 år", "pill-dark", "left:6%;top:30%;rotate:-5deg")
        + stamp("41 hilsner", "pill-green", "right:5%;top:58%;rotate:4deg"),
      story: box(scr.rec("print-birthday.jpg", "Sig tillykke til Bente"), "", "--bw:min(76cqw, calc(100cqh * .765));left:50%;top:0;translate:-50% 0")
        + stamp("Bente 60 år", "pill-dark", "left:2%;top:20%;rotate:-5deg")
        + stamp("41 hilsner", "pill-green", "right:2%;top:62%;rotate:4deg"),
    },
  },
  {
    id: "03_spoergsmaal",
    tone: "dark",
    kicker: "Spørgsmål på skærmen",
    h1: "Stil gæsterne et spørgsmål. Få svarene på video.",
    sub: "I skriver selv spørgsmålet. Gæsterne går hen og svarer, når de har lyst.",
    vis: {
      feed: box(scr.question("Hvad er jeres bedste minde sammen?"), "glow", "--bw:min(52cqw, calc(104cqh * .765));left:4%;top:0")
        + vthumb("print-wedding.jpg", "Mormor og morfar", "0:41", "right:4%;top:6%;rotate:3deg")
        + vthumb("print-office.jpg", "Kollegerne", "0:18", "right:8%;top:38%;rotate:-3deg")
        + vthumb("print-birthday.jpg", "Bente og Ole", "0:27", "right:2%;top:70%;rotate:2deg"),
      story: box(scr.question("Hvad er jeres bedste minde sammen?"), "glow", "--bw:min(56cqw, calc(100cqh * .765));left:0;top:0")
        + vthumb("print-wedding.jpg", "Mormor og morfar", "0:41", "right:0;top:6%;rotate:3deg")
        + vthumb("print-office.jpg", "Kollegerne", "0:18", "right:4%;top:26%;rotate:-3deg")
        + vthumb("print-birthday.jpg", "Bente og Ole", "0:27", "right:0;top:46%;rotate:2deg"),
    },
  },
  {
    id: "04_titler",
    tone: "light",
    kicker: "Titler",
    h1: "Boksen kårer aftenens største smil.",
    sub: "Titlen bliver stemplet på billedet. Det er det billede, alle vil have.",
    vis: {
      feed: box(scr.photo("print-wedding.jpg"), "", "--bw:min(58cqw, calc(104cqh * .765));left:50%;top:0;translate:-50% 0")
        + stamp("Aftenens største smil", "big", "left:50%;top:60%;translate:-50% 0;rotate:-6deg")
        + stamp("Største gruppe", "pill-dark", "right:3%;top:16%;rotate:5deg"),
      story: box(scr.photo("print-wedding.jpg"), "", "--bw:min(76cqw, calc(100cqh * .765));left:50%;top:0;translate:-50% 0")
        + stamp("Aftenens største smil", "big", "left:50%;top:62%;translate:-50% 0;rotate:-6deg")
        + stamp("Største gruppe", "pill-dark", "right:2%;top:10%;rotate:5deg"),
    },
  },
  {
    id: "05_missioner",
    tone: "dark",
    kicker: "Missioner",
    h1: "Små missioner, der får gæsterne til at mingle.",
    sub: "Kameraet tjekker selv, om I klarede den.",
    vis: {
      feed: box(scr.mission(), "glow", "--bw:min(54cqw, calc(104cqh * .765));left:2%;top:0")
        + `<div class="shot" style="right:1%;top:34%;width:40cqw;rotate:4deg"><i style="background-image:url(${A}print-club.jpg)"></i></div>`
        + stamp("Klaret", "big", "right:4%;top:28%;rotate:8deg"),
      story: box(scr.mission(), "glow", "--bw:min(62cqw, calc(100cqh * .765));left:0;top:0")
        + `<div class="shot" style="right:0;top:40%;width:46cqw;rotate:4deg"><i style="background-image:url(${A}print-club.jpg)"></i></div>`
        + stamp("Klaret", "big", "right:2%;top:35%;rotate:8deg"),
    },
  },
  {
    id: "06_webportal",
    tone: "light",
    kicker: "Jeres egen side",
    h1: "Alle billeder og videoer samlet ét sted.",
    sub: "Gæsterne får billedet på mobilen med det samme. I vælger spørgsmål, lege og tema på nettet.",
    vis: {
      feed: phone("", "--phw:min(46cqw, calc(100cqh * .5));left:4%;top:0") + panel("", "right:3%;top:16%;width:54cqw"),
      story: phone("", "--phw:min(50cqw, calc(100cqh * .49));left:0;top:0") + panel("", "right:0;top:14%;width:58cqw"),
    },
  },
  {
    id: "07_anledninger",
    tone: "dark",
    kicker: "Til alle jeres fester",
    h1: "Konfirmation, bryllup, fødselsdag, firmafest og barnedåb.",
    sub: "Skærmen og rammen på billedet følger festen.",
    vis: {
      feed: box(scr.word("Bryllup", "Emma og Jonas", "w1"), "glow sm", "--bw:34cqw;left:33%;top:0")
        + box(scr.word("Konfirmation", "Tillykke Freja", "w2"), "glow sm", "--bw:30cqw;left:0;top:8%")
        + box(scr.word("Fødselsdag", "Bente 60", "w3"), "glow sm", "--bw:30cqw;right:0;top:8%")
        + box(scr.word("Barnedåb", "Velkommen Oscar", "w4"), "glow sm", "--bw:26cqw;left:12%;top:54%")
        + box(scr.word("Firmafest", "Sommerfest", "w5"), "glow sm", "--bw:26cqw;right:12%;top:54%"),
      story: box(scr.word("Konfirmation", "Tillykke Freja", "w2"), "glow sm", "--bw:32cqw;left:0;top:0")
        + box(scr.word("Bryllup", "Emma og Jonas", "w1"), "glow sm", "--bw:32cqw;left:50%;translate:-50% 0;top:0")
        + box(scr.word("Fødselsdag", "Bente 60", "w3"), "glow sm", "--bw:32cqw;right:0;top:0")
        + box(scr.word("Barnedåb", "Velkommen Oscar", "w4"), "glow sm", "--bw:32cqw;left:16cqw;top:46cqh")
        + box(scr.word("Firmafest", "Sommerfest", "w5"), "glow sm", "--bw:32cqw;right:16cqw;top:46cqh"),
    },
  },
  {
    id: "08_pris-service",
    tone: "green",
    kicker: "Lej en Selfi",
    h1: "Markedets laveste pris. Og en service, I kan regne med.",
    sub: "",
    vis: {
      feed: `<ul class="promise">
          <li><b>Levering og opsætning</b><span>Vi stiller boksen op og pakker den ned igen.</span></li>
          <li><b>Klar på fem minutter</b><span>Henter I selv, viser vi jer, hvordan den virker.</span></li>
          <li><b>Ubegrænsede billeder</b><span>Og jeres egen side med alle fotos og videoer.</span></li>
        </ul>` + box(scr.count("Ledig", "Tjek jeres dato"), "", "--bw:44cqw;right:-12cqw;top:4%;rotate:6deg"),
      story: `<ul class="promise">
          <li><b>Levering og opsætning</b><span>Vi stiller boksen op og pakker den ned igen.</span></li>
          <li><b>Klar på fem minutter</b><span>Henter I selv, viser vi jer, hvordan den virker.</span></li>
          <li><b>Ubegrænsede billeder</b><span>Og jeres egen side med alle fotos og videoer.</span></li>
        </ul>` + box(scr.count("Ledig", "Tjek jeres dato"), "", "--bw:52cqw;right:-14cqw;top:60%;rotate:6deg"),
    },
    cta: "Se ledige datoer på selfi.dk",
  },
];

// ---------- Side ----------

const CSS = fs.readFileSync(path.join(__dirname, "ads.css"), "utf8").replaceAll("ASSETS/", A);

function page(ad, fmt) {
  const { W, H } = FORMATS[fmt];
  const foot = ad.cta
    ? `<footer><span class="cta">${ad.cta}</span>${logo()}</footer>`
    : `<footer>${logo()}<span class="url"><b>Markedets laveste pris</b> · selfi.dk</span></footer>`;
  const stag = ad.cta ? `<span class="stag cta">${ad.cta}</span>` : `<span class="stag"><b>Markedets laveste pris</b> · selfi.dk</span>`;
  return `<!doctype html><html><head><meta charset="utf-8"><style>${CSS}</style></head>
<body class="${fmt}" style="--W:${W}px;--H:${H}px"><div class="ad ${ad.tone} ${ad.id}">
<header><div class="toprow">${logo()}<span class="kick">${ad.kicker}</span></div><h1>${ad.h1}</h1>${ad.sub ? (ad.sub.startsWith("<") ? ad.sub : `<p class="sub">${ad.sub}</p>`) : ""}</header>
<div class="vis">${ad.vis[fmt]}</div>${fmt === "story" ? stag : ""}
${foot}
</div></body></html>`;
}

// ---------- Karrusel: én lang stribe på 7 x 1080, skåret i kvadrater ----------

const CARDS = 7, CW = 1080;
function carousel() {
  const x = (i) => i * CW;
  const steps = ["Videohilsner", "Spørgsmål", "Titler", "Missioner", "Jeres side", "Pris"];
  const rail = steps.map((s, i) => `<span class="step" style="left:${x(i + 1) + 80}px"><b>0${i + 1}</b>${s}</span>`).join("");
  const body = `
  <div class="rail"></div>${rail}
  <div class="c1" style="left:${x(0)}px">
    <span class="kick">Til jeres næste fest</span>
    <h1>Det kan jeres gæster i en Selfi.</h1>
    <div class="price"><span class="from">Fra</span><b>499 kr.</b><span class="claim">Markedets laveste pris</span></div>
    ${chips("small")}
    <span class="swipe">Swipe</span>
  </div>
  ${box(scr.rec("print-birthday.jpg", "Sig tillykke til Bente"), "glow", `--bw:520px;left:${x(1) - 110}px;top:220px`)}
  <div class="ct" style="left:${x(1) + 470}px;top:300px;width:530px"><h2>Gæsterne siger det på video.</h2><p>Boksen optager hilsner til jer. I får dem alle dagen efter.</p></div>

  <div class="qcard" style="left:${x(2) + 80}px;top:230px"><span class="k">Dagens spørgsmål</span><b>Hvad er jeres bedste minde sammen?</b><span class="btn-rec"><i></i>Tryk og svar på video</span></div>
  <div class="ct" style="left:${x(2) + 80}px;top:770px;width:900px"><p>I skriver selv spørgsmålet. Svarene kommer på video.</p></div>

  <div class="ct" style="left:${x(3) + 80}px;top:230px;width:440px"><h2>Boksen kårer aftenens største smil.</h2><p>Titlen stemples på billedet.</p></div>
  <div class="photo" style="left:${x(3) + 560}px;top:200px;width:460px;height:600px;background-image:url(${A}print-wedding.jpg)"></div>
  ${stamp("Aftenens største smil", "big", `left:${x(3) + 470}px;top:720px;rotate:-6deg`)}

  ${box(scr.mission(), "glow", `--bw:440px;left:${x(4) + 80}px;top:220px`)}
  <div class="ct" style="left:${x(4) + 580}px;top:300px;width:440px"><h2>Missioner, der får folk til at mingle.</h2><p>Kameraet tjekker, om I klarede den.</p></div>
  ${stamp("Klaret", "big", `left:${x(4) + 400}px;top:700px;rotate:8deg`)}

  ${phone("", `--phw:390px;left:${x(5) + 80}px;top:200px`)}
  <div class="ct" style="left:${x(5) + 560}px;top:300px;width:460px"><h2>Alt samlet på jeres egen side.</h2><p>Billederne lander på mobilen med det samme. Spørgsmål, lege og tema vælger I på nettet.</p></div>

  <div class="c7" style="left:${x(6)}px">
    <h1>Markedets laveste pris. Og en service, I kan regne med.</h1>
    <ul class="promise"><li><b>Levering og opsætning</b></li><li><b>Klar på fem minutter</b></li><li><b>Ubegrænsede billeder</b></li></ul>
    <span class="cta">Se ledige datoer på selfi.dk</span>
  </div>
  <div class="logos">${Array.from({ length: CARDS }, (_, i) => `<span style="left:${x(i) + 1000}px">${logo()}</span>`).join("")}</div>`;
  return `<!doctype html><html><head><meta charset="utf-8"><style>${CSS}</style></head>
<body class="carousel" style="--W:${CW * CARDS}px;--H:1080px"><div class="strip">${body}</div></body></html>`;
}

(async () => {
  const filter = process.argv[2] || "";
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ executablePath: fs.existsSync("/opt/pw-browsers/chromium") ? undefined : undefined });
  const pg = await browser.newPage();
  for (const ad of ads) for (const fmt of Object.keys(FORMATS)) {
    const name = `${ad.id}_${fmt}`;
    if (filter && !name.includes(filter)) continue;
    const { W, H } = FORMATS[fmt];
    await pg.setViewportSize({ width: W, height: H });
    const f = path.join(OUT, name + ".html");
    fs.writeFileSync(f, page(ad, fmt));
    await pg.goto("file://" + f); await pg.evaluate(() => document.fonts.ready);
    await pg.screenshot({ path: path.join(OUT, name + ".png") });
    console.log(name);
  }
  if (!filter || "karrusel".includes(filter)) {
    await pg.setViewportSize({ width: CW * CARDS, height: 1080 });
    const f = path.join(OUT, "karrusel.html");
    fs.writeFileSync(f, carousel());
    await pg.goto("file://" + f); await pg.evaluate(() => document.fonts.ready);
    await pg.screenshot({ path: path.join(OUT, "karrusel_stribe.png") });
    for (let i = 0; i < CARDS; i++) await pg.screenshot({ path: path.join(OUT, `09_karrusel_${i + 1}.png`), clip: { x: i * CW, y: 0, width: CW, height: 1080 } });
    console.log("karrusel");
  }
  await browser.close();
})();
