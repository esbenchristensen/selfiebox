// Renders a film frame by frame and encodes it with ffmpeg.
// Usage (from web/video): NODE_PATH=$(npm root -g) node render.cjs [explainer|erhverv|events] [wide|tall ...]
// Writes ../public/video/selfi-<film>-<format>.mp4, a .webm fallback and a poster .jpg next to it.
// If voice/<film>/ has a voice-over (see voice.cjs), each line is placed at the start of its scene, and
// music/<film>.mp3 (see music.cjs) plays underneath, ducking while someone speaks, and the sound effects
// each scene lists (see sfx.cjs) land on their moments.
const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");
const { chromium } = require("playwright");

const FPS = 30;
const SIZES = { wide: { width: 1920, height: 1080 }, tall: { width: 1080, height: 1350 } };
// Poster frame, as [scene, real seconds into it]: the laughing guests after the flash, or the club with the ring.
const POSTER = { explainer: ["peak", 4.0], erhverv: ["queue", 3.5], events: ["variety", 1.0] };
const OUT = path.join(__dirname, "..", "public", "video");

const run = (args) =>
  new Promise((res, rej) => spawn("ffmpeg", ["-y", "-loglevel", "error", ...args], { stdio: "inherit" }).on("close", (c) => (c === 0 ? res() : rej(new Error("ffmpeg " + c)))));

function measure(file) {
  return new Promise((res, rej) => {
    const p = spawn("ffmpeg", ["-hide_banner", "-i", file, "-af", "loudnorm=I=-15:TP=-1.5:LRA=20:print_format=json", "-f", "null", "-"]);
    let err = "";
    p.stderr.on("data", (d) => (err += d));
    p.on("close", () => { const j = err.slice(err.lastIndexOf("{")); try { res(JSON.parse(j)); } catch (e) { rej(new Error("loudnorm measure failed")); } });
  });
}

// The sound: every line at its scene's start (real time), the music under it and ducked while the
// voice speaks, then levelled for the web.
async function soundTrack(film, scenes, { speed, lead, sfx = [] }, duration, out) {
  const dir = path.join(__dirname, "voice", film);
  const music = path.join(__dirname, "music", `${film}.mp3`);
  const clip = (id) => [".opus", ".mp3"].map((e) => path.join(dir, id + e)).find((f) => fs.existsSync(f));
  const lines = scenes.filter((s) => clip(s.id));
  const hasMusic = fs.existsSync(music);
  if (!lines.length && !hasMusic) return false;
  const D = duration.toFixed(3);
  const inputs = lines.flatMap((s) => ["-i", clip(s.id)]);
  const graph = lines.map((s, i) => `[${i}:a]aformat=sample_rates=48000:channel_layouts=stereo,adelay=${Math.round((s.start / speed + lead) * 1000)}:all=1[a${i}]`);
  if (lines.length) graph.push(`${lines.map((_, i) => `[a${i}]`).join("")}amix=inputs=${lines.length}:normalize=0,apad,atrim=0:${D}[voice]`);
  // Sound effects (sfx/<name>.mp3) at their real times; they sit on top and do not duck the music.
  const fx = sfx.filter((f) => fs.existsSync(path.join(__dirname, "sfx", `${f.name}.mp3`)));
  fx.forEach((f, j) => {
    const i = inputs.length / 2;
    inputs.push("-i", path.join(__dirname, "sfx", `${f.name}.mp3`));
    graph.push(`[${i}:a]aformat=sample_rates=48000:channel_layouts=stereo,volume=${(0.5 * f.gain).toFixed(3)},adelay=${Math.round(f.t * 1000)}:all=1[f${j}]`);
  });
  if (fx.length) graph.push(`${fx.map((_, j) => `[f${j}]`).join("")}amix=inputs=${fx.length}:normalize=0,apad,atrim=0:${D}[fx]`);
  if (hasMusic) {
    inputs.push("-i", music);
    const m = inputs.length / 2 - 1;
    graph.push(`[${m}:a]aformat=sample_rates=48000:channel_layouts=stereo,apad,atrim=0:${D},loudnorm=I=-30:TP=-8,afade=t=in:d=0.15,afade=t=out:st=${(duration - 0.3).toFixed(3)}:d=0.3[bed]`);
    if (lines.length) {
      graph.push("[voice]asplit[v1][v2]");
      graph.push("[bed][v2]sidechaincompress=threshold=0.01:ratio=8:attack=15:release=500[duck]");
      graph.push("[v1][duck]amix=inputs=2:normalize=0[mix]");
    } else graph.push("[bed]anull[mix]");
  } else graph.push("[voice]anull[mix]");
  if (fx.length) { graph.push("[mix][fx]amix=inputs=2:normalize=0[mixfx]"); }
  const MIX = fx.length ? "[mixfx]" : "[mix]";
  // Levelled in two passes with a fixed gain, so the music does not swell in the pauses.
  const mixed = `${out}.mix.wav`;
  await run([...inputs, "-filter_complex", graph.join(";"), "-map", MIX, "-ar", "48000", "-ac", "2", mixed]);
  const m = await measure(mixed);
  await run(["-i", mixed, "-af", `loudnorm=I=-15:TP=-1.5:LRA=20:linear=true:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset}`, "-ar", "48000", out]);
  fs.unlinkSync(mixed);
  return true;
}

async function render(film, format) {
  const size = SIZES[format];
  const browser = await chromium.launch({ args: ["--allow-file-access-from-files"] });
  const page = await browser.newPage({ viewport: size });
  page.on("pageerror", (e) => console.error("pageerror:", e.message));
  await page.goto("file://" + path.join(__dirname, `${film}.html`) + "?format=" + format);
  await page.evaluate(() => window.ready);
  // The page counts film time; the video plays it FILM_SPEED times faster.
  const { filmDuration, scenes, speed, lead, sfx } = await page.evaluate(() => ({ filmDuration: window.DURATION, scenes: window.SCENE_TIMES, speed: window.FILM_SPEED || 1, lead: window.VOICE_LEAD || 0.5, sfx: window.SFX_TIMES || [] }));
  const duration = filmDuration / speed;
  const frames = Math.round(duration * FPS);
  fs.mkdirSync(OUT, { recursive: true });
  const name = path.join(OUT, `selfi-${film}-${format}`);
  const file = `${name}.mp4`, silent = `${name}.silent.mp4`, voice = `${name}.voice.wav`;

  const ff = spawn("ffmpeg", ["-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", String(FPS), "-i", "-",
    "-c:v", "libx264", "-preset", "slow", "-crf", "21", "-tune", "animation", "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an", silent], { stdio: ["pipe", "inherit", "inherit"] });
  const done = new Promise((res, rej) => ff.on("close", (c) => (c === 0 ? res() : rej(new Error("ffmpeg " + c)))));

  for (let f = 0; f < frames; f++) {
    await page.evaluate((t) => window.seek(t), (f / FPS) * speed);
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

  const voiced = await soundTrack(film, scenes, { speed, lead, sfx }, duration, voice);
  if (voiced) {
    await run(["-i", silent, "-i", voice, "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", "-shortest", file]);
  } else fs.renameSync(silent, file);
  await run(["-i", file, "-c:v", "libvpx-vp9", "-b:v", "0", "-crf", "36", "-row-mt", "1", "-deadline", "good", "-cpu-used", "2",
    ...(voiced ? ["-c:a", "libopus", "-b:a", "128k"] : ["-an"]), `${name}.webm`]);
  for (const f of [silent, voice]) if (fs.existsSync(f)) fs.unlinkSync(f);
  console.log(`${format}: ${file} (${duration.toFixed(1)} s${voiced ? ", med lyd" : ""})`);
}

module.exports = { soundTrack };

if (require.main === module) (async () => {
  let args = process.argv.slice(2);
  const film = args[0] && !SIZES[args[0]] ? args.shift() : "explainer";
  const formats = args.length ? args : ["wide", "tall"];
  for (const f of formats) await render(film, f);
})();
