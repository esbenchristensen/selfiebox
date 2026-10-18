// Gengiver opgaverne fra build.cjs med Chromium.
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");
const ROOT = path.join(__dirname, "..");
const TMP = path.join(__dirname, "_tmp");
const MM = 96 / 25.4;

async function run(jobs, filter) {
  fs.mkdirSync(TMP, { recursive: true });
  const list = jobs.filter((j) => !filter || j.id.includes(filter));
  const b = await chromium.launch();
  for (const j of list) {
    const out = path.join(ROOT, j.out);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    if (j.kind === "svg") { fs.writeFileSync(out, j.svg()); continue; }
    if (j.kind === "guide") {
      const f = path.join(TMP, j.id + ".html"); fs.writeFileSync(f, j.html());
      const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
      await p.goto("file://" + f); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400);
      await p.pdf({ path: out, width: "1920px", height: "1080px", printBackground: true });
      // Sidebilleder til gennemsyn og oversigt
      const n = await p.evaluate(() => document.querySelectorAll(".pg").length);
      fs.mkdirSync(path.join(TMP, "sider"), { recursive: true });
      for (let i = 0; i < n; i++) await p.screenshot({ path: path.join(TMP, "sider", `side-${String(i + 1).padStart(2, "0")}.png`), clip: { x: 0, y: i * 1080, width: 1920, height: 1080 }, fullPage: true });
      await p.close(); console.log("✓", j.out, n, "sider"); continue;
    }
    if (j.kind === "pdf") {
      // W×H i mm. Laver PDF til tryk og en PNG-forhåndsvisning i 300 dpi.
      const [W, H] = j.size();
      const html = j.html(`${W}mm`, `${H}mm`);
      const f = path.join(TMP, j.id + ".html"); fs.writeFileSync(f, html);
      const p = await b.newPage({ viewport: { width: Math.ceil(W * MM), height: Math.ceil(H * MM) }, deviceScaleFactor: 300 / 96 });
      await p.goto("file://" + f); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(150);
      await p.pdf({ path: out, width: `${W}mm`, height: `${H}mm`, printBackground: true, pageRanges: "1" });
      if (j.preview !== false) await p.screenshot({ path: out.replace(/\.pdf$/, ".png"), clip: { x: 0, y: 0, width: W * MM, height: H * MM } });
      await p.close(); console.log("✓", j.out); continue;
    }
    const [W, H] = j.size();
    const html = j.html(`${W}px`, `${H}px`);
    const f = path.join(TMP, j.id + ".html"); fs.writeFileSync(f, html);
    const p = await b.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: j.scale || 1 });
    await p.goto("file://" + f); await p.evaluate(() => document.fonts.ready);
    await p.evaluate(() => Promise.all([...document.images].map((i) => i.complete ? 0 : new Promise((r) => { i.onload = i.onerror = r; }))));
    await p.waitForTimeout(150);
    const opt = { path: out, omitBackground: !!j.transparent };
    if (out.endsWith(".jpg")) { opt.type = "jpeg"; opt.quality = 90; }
    await p.screenshot(opt);
    await p.close(); console.log("✓", j.out);
  }
  await b.close();
}
module.exports = { run };
