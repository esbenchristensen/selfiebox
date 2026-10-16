// Renders the explainer film frame by frame and encodes it with ffmpeg.
// Usage (from web/video): NODE_PATH=$(npm root -g) node render.cjs [explainer|erhverv] [wide|tall ...]
// Writes ../public/video/selfi-<film>-<format>.mp4, a .webm fallback and a poster .jpg next to it.
const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");
const { chromium } = require("playwright");

const FPS = 30;
const SIZES = { wide: { width: 1920, height: 1080 }, tall: { width: 1080, height: 1350 } };
const POSTER_T = 4.2; // the intro with the headline and the glowing ring
const OUT = path.join(__dirname, "..", "public", "video");

async function render(film, format) {
  const size = SIZES[format];
  const browser = await chromium.launch({ args: ["--allow-file-access-from-files"] });
  const page = await browser.newPage({ viewport: size });
  page.on("pageerror", (e) => console.error("pageerror:", e.message));
  await page.goto("file://" + path.join(__dirname, `${film}.html`) + "?format=" + format);
  await page.evaluate(() => window.ready);
  const duration = await page.evaluate(() => window.DURATION);
  const frames = Math.round(duration * FPS);
  fs.mkdirSync(OUT, { recursive: true });
  const name = path.join(OUT, `selfi-${film}-${format}`);
  const file = `${name}.mp4`;

  const ff = spawn("ffmpeg", ["-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", String(FPS), "-i", "-",
    "-c:v", "libx264", "-preset", "slow", "-crf", "21", "-tune", "animation", "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an", file], { stdio: ["pipe", "inherit", "inherit"] });
  const done = new Promise((res, rej) => ff.on("close", (c) => (c === 0 ? res() : rej(new Error("ffmpeg " + c)))));

  for (let f = 0; f < frames; f++) {
    await page.evaluate((t) => window.seek(t), f / FPS);
    const buf = await page.screenshot({ type: "jpeg", quality: 95 });
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once("drain", r));
    if (f % 150 === 0) console.log(`${format}: ${f}/${frames}`);
  }
  ff.stdin.end();
  await done;

  await page.evaluate((t) => window.seek(t), POSTER_T);
  await page.screenshot({ path: `${name}.jpg`, type: "jpeg", quality: 82 });
  await browser.close();

  const webm = spawn("ffmpeg", ["-y", "-loglevel", "error", "-i", file, "-c:v", "libvpx-vp9", "-b:v", "0", "-crf", "36", "-row-mt", "1", "-deadline", "good", "-cpu-used", "2", "-an", `${name}.webm`], { stdio: "inherit" });
  await new Promise((res, rej) => webm.on("close", (c) => (c === 0 ? res() : rej(new Error("ffmpeg webm " + c)))));
  console.log(`${format}: ${file} (${duration.toFixed(1)} s)`);
}

(async () => {
  let args = process.argv.slice(2);
  const film = args[0] && !SIZES[args[0]] ? args.shift() : "explainer";
  const formats = args.length ? args : ["wide", "tall"];
  for (const f of formats) await render(film, f);
})();
