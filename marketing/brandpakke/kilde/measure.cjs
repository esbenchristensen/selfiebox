// Måler web-logoet (components/Logo.tsx + globals.css) i Chromium ved font-size 1000px, så SVG-logoet får præcis samme placering og kerning.
const fs = require("fs"), path = require("path");
const { chromium } = require("playwright");
const A = "file://" + path.join(__dirname, "assets") + "/";
const html = `<!doctype html><style>
@font-face{font-family:IS;src:url(${A}InstrumentSans.woff2);font-weight:100 900}
body{margin:0;padding:200px}
.logo{white-space:nowrap;display:inline-flex;align-items:center;gap:.32em;font-size:1000px;line-height:1}
.logo svg{height:1.12em;width:auto;flex:none}
.word{font-family:IS;font-weight:500;letter-spacing:-.045em;font-feature-settings:"liga" 0;font-variant-ligatures:none;position:relative;top:-.04em}
.i{position:relative;display:inline-block}
.base{display:inline-block;width:0;height:0;vertical-align:baseline}
</style><span class="logo"><svg viewBox="0 0 92 120"></svg><span class="word">self<span class="i">ı</span><span class="base"></span></span></span>`;
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  const f = path.join(__dirname, "assets/_measure.html"); fs.writeFileSync(f, html); await p.goto("file://" + f); await p.evaluate(() => document.fonts.ready); fs.unlinkSync(f);
  await p.screenshot({ path: process.env.SHOT || "/dev/null", fullPage: true }).catch(() => {});
  const m = await p.evaluate(() => {
    const r = (e) => { const x = e.getBoundingClientRect(); return { x: x.left, y: x.top, w: x.width, h: x.height }; };
    const word = document.querySelector(".word");
    const chars = []; const t = word.firstChild; // "self"
    for (let k = 0; k < 4; k++) { const rg = document.createRange(); rg.setStart(t, k); rg.setEnd(t, k + 1); chars.push(rg.getBoundingClientRect().left); }
    return { svg: r(document.querySelector("svg")), word: r(word), i: r(document.querySelector(".i")), base: r(document.querySelector(".base")).y, chars };
  });
  await b.close();
  fs.writeFileSync(path.join(__dirname, "assets/measure.json"), JSON.stringify(m, null, 1));
  console.log(m);
})();
