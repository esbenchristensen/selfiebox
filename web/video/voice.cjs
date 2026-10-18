// Danish voice-over for the films with ElevenLabs, one clip per scene from voiceover.json.
// Usage (from web/video): NODE_USE_ENV_PROXY=1 ELEVENLABS_API_KEY=... node voice.cjs [explainer|erhverv ...]
//
// Set up the way ElevenLabs recommends for the best quality:
// - Eleven v4, their highest-quality model, with language_code "da", so it speaks and normalises Danish.
// - Jonas from the voice library: young and articulate, and the cleanest recording of the young Danish
//   voices (v4 copies the source recording, noise and all, so a clean source matters).
//   The B2B film uses Søren instead, a more grown-up commercial voice (see VOICES).
// - A light delivery tag instead of speed or style settings, which v4 does not have. A line in
//   voiceover.json that starts with its own [tag] uses that one instead.
// - Several takes of every line. Each take is transcribed with Scribe and the one that matches the script
//   best is kept, so a slipped word never ends up in a film.
// Writes voice/<film>/<scene>.opus (silence trimmed) and voice/<film>/timing.js. A line is only made again
// when its text, voice or settings change. Then run music.cjs and render.cjs.
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { execFileSync } = require("child_process");

const KEY = process.env.ELEVENLABS_API_KEY;
const JONAS = { voice: "hbLdgbgzfKYPCUr4Rs2V", direction: "[upbeat, warm and energetic] " };
// The B2B film speaks to owners and managers, so it uses Søren: a more grown-up voice made for
// commercials, still confident and lively. He had the cleanest recording of the adult Danish voices.
const VOICES = { erhverv: { voice: "xj6X4BCUsv9oxohm1E8o", direction: "[confident, warm and energetic] " } };
const voiceFor = (film) => (process.env.VOICE_ID ? { ...JONAS, voice: process.env.VOICE_ID } : VOICES[film] || JONAS);
const MODEL = "eleven_v4";
const SETTINGS = { stability: 0.5, similarity_boost: 0.75, use_speaker_boost: true };
const FORMAT = "opus_48000_192";
const TAKES = 3;

if (!KEY) {
  console.error("Set ELEVENLABS_API_KEY.");
  process.exit(1);
}

const script = JSON.parse(fs.readFileSync(path.join(__dirname, "voiceover.json"), "utf8"));
const films = process.argv.slice(2).length ? process.argv.slice(2) : ["explainer", "erhverv"];
const API = "https://api.elevenlabs.io/v1";

const duration = (file) => +execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file]).toString().trim();
// Compares words, so punctuation and how Scribe spells "selfi" or "d k" do not count.
const words = (t) => t.replace(/\[[^\]]*\]/g, " ").toLowerCase().replace(/selfie/g, "selfi").replace(/\bdk\b/g, "d k").replace(/[^\p{L}\p{N} ]/gu, " ").split(/\s+/).filter(Boolean);
function similarity(a, b) {
  const x = words(a), y = words(b);
  const dp = Array.from({ length: x.length + 1 }, (_, i) => [i, ...Array(y.length).fill(0)]);
  for (let j = 1; j <= y.length; j++) dp[0][j] = j;
  for (let i = 1; i <= x.length; i++) for (let j = 1; j <= y.length; j++) dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (x[i - 1] === y[j - 1] ? 0 : 1));
  return 1 - dp[x.length][y.length] / Math.max(x.length, 1);
}

async function tts({ voice, direction }, text, previous, next) {
  const res = await fetch(`${API}/text-to-speech/${voice}?output_format=${FORMAT}`, {
    method: "POST",
    headers: { "xi-api-key": KEY, "content-type": "application/json" },
    body: JSON.stringify({ text: (text.startsWith("[") ? "" : direction) + text, model_id: MODEL, language_code: "da", voice_settings: SETTINGS, previous_text: previous, next_text: next }),
  });
  if (!res.ok) throw new Error(`tts ${res.status} ${await res.text()}`);
  return Buffer.from(await res.arrayBuffer());
}

async function transcribe(file) {
  const form = new FormData();
  form.append("model_id", "scribe_v1");
  form.append("language_code", "da");
  form.append("tag_audio_events", "false");
  form.append("file", new Blob([fs.readFileSync(file)]), path.basename(file));
  const res = await fetch(`${API}/speech-to-text`, { method: "POST", headers: { "xi-api-key": KEY }, body: form });
  if (!res.ok) throw new Error(`stt ${res.status} ${await res.text()}`);
  return (await res.json()).text;
}

// Cuts the silence the model leaves at the start and end, so lines land on time.
function trim(src, dst) {
  const edge = "silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.05";
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", src, "-af", `${edge},areverse,${edge},areverse`, "-c:a", "libopus", "-b:a", "192k", dst]);
}

(async () => {
  for (const film of films) {
    const lines = Object.entries(script[film]);
    const v = voiceFor(film);
    const dir = path.join(__dirname, "voice", film), tmp = path.join(dir, ".takes");
    fs.mkdirSync(tmp, { recursive: true });
    const timing = {};
    for (let i = 0; i < lines.length; i++) {
      const [id, text] = lines[i];
      const file = path.join(dir, `${id}.opus`), stamp = `${file}.hash`;
      const hash = crypto.createHash("sha1").update(JSON.stringify([text, v.voice, MODEL, SETTINGS, v.direction, FORMAT, TAKES])).digest("hex");
      if (!fs.existsSync(file) || !fs.existsSync(stamp) || fs.readFileSync(stamp, "utf8") !== hash) {
        const takes = [];
        for (let k = 0; k < TAKES; k++) {
          const raw = path.join(tmp, `${id}-${k}.opus`);
          fs.writeFileSync(raw, await tts(v, text, lines[i - 1]?.[1], lines[i + 1]?.[1]));
          const heard = await transcribe(raw);
          takes.push({ raw, score: similarity(text, heard), seconds: duration(raw), heard });
          if (takes.at(-1).score === 1 && k >= 1) break; // two takes in, a perfect one is good enough
        }
        // Best match first; between equals, the one closest to the median length (no rushed or dragged take).
        const median = takes.map((t) => t.seconds).sort((a, b) => a - b)[Math.floor(takes.length / 2)];
        takes.sort((a, b) => b.score - a.score || Math.abs(a.seconds - median) - Math.abs(b.seconds - median));
        trim(takes[0].raw, file);
        fs.writeFileSync(stamp, hash);
        console.log(`${film}/${id}: ${takes.length} takes, kept ${takes[0].score.toFixed(2)} "${takes[0].heard}"`);
      }
      timing[id] = Math.round(duration(file) * 100) / 100;
    }
    fs.rmSync(tmp, { recursive: true, force: true });
    fs.writeFileSync(path.join(dir, "timing.js"), `// Made by voice.cjs. Seconds of speech per scene.\nwindow.VOICE_TIMING = ${JSON.stringify(timing, null, 2)};\n`);
    console.log(film, timing);
  }
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
