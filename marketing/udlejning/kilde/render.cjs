// Renderinger af den pakkede kasse (forslag A) med three.js i Chromium.
// Kør: NODE_PATH=$(npm root -g) node render.cjs  → ../renders/
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");
const OUT = path.join(__dirname, "..", "renders");
fs.copyFileSync(path.join(__dirname, "..", "tryk", "laagkort", "selfi-laagkort-A4.png"), path.join(__dirname, "lagkort.png"));
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--allow-file-access-from-files", "--enable-unsafe-swiftshader"] });
  for (const [v, name] of [["laag", "1-aabnet-laagkort"], ["pakket", "2-pakket"], ["snit", "3-snit-bagfra"], ["tom", "4-skumindlaeg"]]) {
    const p = await b.newPage({ viewport: { width: 1800, height: 1300 } });
    p.on("console", (m) => m.type() === "error" && console.log(m.text()));
    await p.goto("file://" + path.join(__dirname, "render.html") + "?view=" + v);
    await p.waitForFunction(() => window.__done === true, null, { timeout: 120000 });
    await p.screenshot({ path: path.join(OUT, `udlejningskasse-${name}.png`) }); await p.close();
    console.log("✓", name);
  }
  await b.close(); fs.unlinkSync(path.join(__dirname, "lagkort.png"));
})();
