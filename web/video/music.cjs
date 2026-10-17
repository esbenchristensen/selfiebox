// Background music for the films with ElevenLabs Music, one instrumental track per film.
// Usage (from web/video): ELEVENLABS_API_KEY=... node music.cjs [explainer|erhverv ...]
// Writes music/<film>.mp3. render.cjs fades it in and out and ducks it under the voice.
// A track is only made again when its prompt or length changes.
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const KEY = process.env.ELEVENLABS_API_KEY;
if (!KEY) {
  console.error("Set ELEVENLABS_API_KEY.");
  process.exit(1);
}

// A little longer than each film (55 s and 52 s), so the fade-out never runs out of music.
const TRACKS = {
  explainer: {
    seconds: 60,
    prompt:
      "Upbeat feel-good instrumental pop for a party photo booth ad. Bright plucked synths, handclaps, groovy bass, crisp light drums. Warm, celebratory and fun, steady energy from the first second, 120 bpm. No vocals. Leaves room for a voice-over.",
  },
  erhverv: {
    seconds: 57,
    prompt:
      "Confident modern instrumental electronic pop for a product video aimed at bars, clubs and hotels. Punchy drums, deep warm bass, glossy synth chords, a polished nightlife feel. Driving and premium, 122 bpm, steady energy from the first second. No vocals. Leaves room for a voice-over.",
  },
};

(async () => {
  const films = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(TRACKS);
  const dir = path.join(__dirname, "music");
  fs.mkdirSync(dir, { recursive: true });
  for (const film of films) {
    const { seconds, prompt } = TRACKS[film];
    const file = path.join(dir, `${film}.mp3`), stamp = `${file}.hash`;
    const hash = crypto.createHash("sha1").update(JSON.stringify([prompt, seconds])).digest("hex");
    if (fs.existsSync(file) && fs.existsSync(stamp) && fs.readFileSync(stamp, "utf8") === hash) continue;
    const res = await fetch("https://api.elevenlabs.io/v1/music?output_format=mp3_44100_128", {
      method: "POST",
      headers: { "xi-api-key": KEY, "content-type": "application/json" },
      body: JSON.stringify({ prompt, music_length_ms: seconds * 1000, force_instrumental: true }),
    });
    if (!res.ok) throw new Error(`${film}: ${res.status} ${await res.text()}`);
    fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
    fs.writeFileSync(stamp, hash);
    console.log(`${film}: made`);
  }
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
