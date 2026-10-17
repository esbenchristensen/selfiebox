// Danish voice-over for the films with ElevenLabs, one clip per scene from voiceover.json.
// Usage (from web/video): ELEVENLABS_API_KEY=... [VOICE_ID=...] node voice.cjs [explainer|erhverv ...]
// Writes voice/<film>/<scene>.mp3 and voice/<film>/timing.js. A clip is only made again when its text,
// voice or settings change. Then run render.cjs: scenes stretch to fit their line, and the voice is mixed in.
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { execFileSync } = require("child_process");

const KEY = process.env.ELEVENLABS_API_KEY;
// Mathias from the ElevenLabs voice library: the most used Danish narrator there, warm and natural.
const VOICE = process.env.VOICE_ID || "ygiXC2Oa1BiHksD3WkJZ";
const MODEL = process.env.MODEL_ID || "eleven_multilingual_v2";
const SETTINGS = { stability: 0.5, similarity_boost: 0.8, style: 0.15, use_speaker_boost: true, speed: 1.1 };
// 128 kbps is the best format without a subscription. With Creator or above, set FORMAT=mp3_44100_192.
const FORMAT = process.env.FORMAT || "mp3_44100_128";

if (!KEY) {
  console.error("Set ELEVENLABS_API_KEY.");
  process.exit(1);
}

const script = JSON.parse(fs.readFileSync(path.join(__dirname, "voiceover.json"), "utf8"));
const films = process.argv.slice(2).length ? process.argv.slice(2) : ["explainer", "erhverv"];

const duration = (file) => +execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file]).toString().trim();

async function tts(text, previous, next) {
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE}?output_format=${FORMAT}`, {
    method: "POST",
    headers: { "xi-api-key": KEY, "content-type": "application/json", accept: "audio/mpeg" },
    // The lines around it keep the tone even from scene to scene.
    body: JSON.stringify({ text, model_id: MODEL, voice_settings: SETTINGS, previous_text: previous, next_text: next }),
  });
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  return Buffer.from(await res.arrayBuffer());
}

(async () => {
  for (const film of films) {
    const lines = Object.entries(script[film]);
    const dir = path.join(__dirname, "voice", film);
    fs.mkdirSync(dir, { recursive: true });
    const timing = {};
    for (let i = 0; i < lines.length; i++) {
      const [id, text] = lines[i];
      const file = path.join(dir, `${id}.mp3`), stamp = `${file}.hash`;
      const hash = crypto.createHash("sha1").update(JSON.stringify([text, VOICE, MODEL, SETTINGS, FORMAT])).digest("hex");
      if (!fs.existsSync(file) || !fs.existsSync(stamp) || fs.readFileSync(stamp, "utf8") !== hash) {
        const audio = await tts(text, lines[i - 1]?.[1], lines[i + 1]?.[1]);
        fs.writeFileSync(file, audio);
        fs.writeFileSync(stamp, hash);
        console.log(`${film}/${id}: made`);
      }
      timing[id] = Math.round(duration(file) * 100) / 100;
    }
    fs.writeFileSync(path.join(dir, "timing.js"), `// Made by voice.cjs. Seconds of speech per scene.\nwindow.VOICE_TIMING = ${JSON.stringify(timing, null, 2)};\n`);
    console.log(film, timing);
  }
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
