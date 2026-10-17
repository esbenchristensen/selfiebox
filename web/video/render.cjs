// Renders a film frame by frame and encodes it with ffmpeg.
// Usage (from web/video): NODE_PATH=$(npm root -g) node render.cjs [explainer|erhverv] [wide|tall ...]
// Writes ../public/video/selfi-<film>-<format>.mp4, a .webm fallback and a poster .jpg next to it.
// If voice/<film>/ has a voice-over (see voice.cjs), each line is placed at the start of its scene.
const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");
const { chromium } = require("playwright");

const FPS = 30;
const SIZES = { wide: { width: 1920, height: 1080 }, tall: { width: 1080, height: 1350 } };
// Poster frame, as [scene, seconds into it]: the intro with the glowing ring, or the box in Kælderbaren's design.
const POSTER = { explainer: ["intro", 4.2], erhverv: ["morph", 9.0] };
const VOICE_LEAD = 0.5; // same as in shared.js
const OUT = path.join(__dirname, "..", "public", "video");

const run = (args) =>
  new Promise((res, rej) => spawn("ffmpeg", ["-y", "-loglevel", "error", ...args], { stdio: "inherit" }).on("close", (c) => (c === 0 ? res() : rej(new Error("ffmpeg " + c)))));

// One track with every line at its scene's start, levelled for the web.
async function voiceTrack(film, scenes, duration, out) {
  const dir = path.join(__dirname, "voice", film);
  const lines = scenes.filter((s) => fs.existsSync(path.join(dir, `${s.id}.mp3`)));
  if (!lines.length) return false;
  const inputs = lines.flatMap((s) => ["-i", path.join(dir, `${s.id}.mp3`)]);
  const delays = lines.map((s, i) => `[${i}:a]adelay=${Math.round((s.start + VOICE_LEAD) * 1000)}:all=1[a${i}]`);
  const mix = `${lines.map((_, i) => `[a${i}]`).join("")}amix=inputs=${lines.length}:normalize=0,apad,atrim=0:${duration.toFixed(3)},loudnorm=I=-16:TP=-1.5:LRA=11[out]`;
  await run([...inputs, "-filter_complex", [...delays, mix].join(";"), "-map", "[out]", "-ar", "48000", "-ac", "2", out]);
  return true;
}

async function render(film, format) {
  const size = SIZES[format];
  const browser = await chromium.launch({ args: ["--allow-file-access-from-files"] });
  const page = await browser.newPage({ viewport: size });
  page.on("pageerror", (e) => console.error("pageerror:", e.message));
  await page.goto("file://" + path.join(__dirname, `${film}.html`) + "?format=" + format);
  await page.evaluate(() => window.ready);
  const duration = await page.evaluate(() => window.DURATION);
  const scenes = await page.evaluate(() => window.SCENE_TIMES);
  const frames = Math.round(duration * FPS);
  fs.mkdirSync(OUT, { recursive: true });
  const name = path.join(OUT, `selfi-${film}-${format}`);
  const file = `${name}.mp4`, silent = `${name}.silent.mp4`, voice = `${name}.voice.wav`;

  const ff = spawn("ffmpeg", ["-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", String(FPS), "-i", "-",
    "-c:v", "libx264", "-preset", "slow", "-crf", "21", "-tune", "animation", "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an", silent], { stdio: ["pipe", "inherit", "inherit"] });
  const done = new Promise((res, rej) => ff.on("close", (c) => (c === 0 ? res() : rej(new Error("ffmpeg " + c)))));

  for (let f = 0; f < frames; f++) {
    await page.evaluate((t) => window.seek(t), f / FPS);
    const buf = await page.screenshot({ type: "jpeg", quality: 95 });
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once("drain", r));
    if (f % 150 === 0) console.log(`${format}: ${f}/${frames}`);
  }
  ff.stdin.end();
  await done;

  const [pid, pt] = POSTER[film] ?? ["intro", 4.2];
  const ps = scenes.find((s) => s.id === pid);
  await page.evaluate((t) => window.seek(t), (ps ? ps.start : 0) + pt);
  await page.screenshot({ path: `${name}.jpg`, type: "jpeg", quality: 82 });
  await browser.close();

  const voiced = await voiceTrack(film, scenes, duration, voice);
  if (voiced) {
    await run(["-i", silent, "-i", voice, "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", "-shortest", file]);
  } else fs.renameSync(silent, file);
  await run(["-i", file, "-c:v", "libvpx-vp9", "-b:v", "0", "-crf", "36", "-row-mt", "1", "-deadline", "good", "-cpu-used", "2",
    ...(voiced ? ["-c:a", "libopus", "-b:a", "128k"] : ["-an"]), `${name}.webm`]);
  for (const f of [silent, voice]) if (fs.existsSync(f)) fs.unlinkSync(f);
  console.log(`${format}: ${file} (${duration.toFixed(1)} s${voiced ? ", med speak" : ""})`);
}

(async () => {
  let args = process.argv.slice(2);
  const film = args[0] && !SIZES[args[0]] ? args.shift() : "explainer";
  const formats = args.length ? args : ["wide", "tall"];
  for (const f of formats) await render(film, f);
})();
