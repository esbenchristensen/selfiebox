// Renders the drawing sheets in drawings.json to docs/pack/drawings/<node>.png.
// Needs Node + playwright and three@0.128.0 (npm i playwright three@0.128.0).
// Usage: node hardware/tools/drawings/render_drawings.js
const fs = require("fs");
const path = require("path");
const http = require("http");
const { chromium } = require("playwright");

const HERE = __dirname;
const PACK = path.join(HERE, "..", "..", "docs", "pack");
const OUT = path.join(PACK, "drawings");
const THREE_DIR = path.dirname(require.resolve("three/package.json"));
const FILES = {
  "/render.html": path.join(HERE, "render.html"),
  "/pack.json": path.join(PACK, "pack.json"),
  "/three.min.js": path.join(THREE_DIR, "build", "three.min.js"),
  "/GLTFLoader.js": path.join(THREE_DIR, "examples", "js", "loaders", "GLTFLoader.js")
};

(async () => {
  const server = http.createServer((req, res) => {
    const f = FILES[req.url.split("?")[0]];
    if (!f) { res.writeHead(404); return res.end(); }
    res.writeHead(200); fs.createReadStream(f).pipe(res);
  }).listen(0);
  const port = server.address().port;
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined, args: ["--use-gl=swiftshader", "--enable-unsafe-swiftshader"] });
  const page = await browser.newPage();
  page.on("pageerror", e => console.log("page error:", e.message));
  await page.goto(`http://localhost:${port}/render.html`);
  await page.evaluate(() => window.ready);
  fs.mkdirSync(OUT, { recursive: true });
  const { parts } = JSON.parse(fs.readFileSync(path.join(HERE, "drawings.json"), "utf8"));
  for (const spec of parts) {
    const url = await page.evaluate(s => window.sheet(s), spec);
    const file = path.join(OUT, spec.node.replace("--", "_") + ".png");
    fs.writeFileSync(file, Buffer.from(url.split(",")[1], "base64"));
    console.log("drawing", path.basename(file));
  }
  await browser.close(); server.close();
})();
