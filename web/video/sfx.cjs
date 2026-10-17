// Sound effects for the films with ElevenLabs Sound Effects.
// Usage (from web/video): NODE_USE_ENV_PROXY=1 ELEVENLABS_API_KEY=... node sfx.cjs
// Writes sfx/<name>.mp3. The films place them per scene (the `sfx` lists in explainer.html and
// erhverv.html), and render.cjs mixes them in. "shutter" followed by "chime" is Selfi's sound: it plays
// when the brand first shows and again on the end card, so the sound becomes part of the brand.
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const KEY = process.env.ELEVENLABS_API_KEY;
if (!KEY) {
  console.error("Set ELEVENLABS_API_KEY.");
  process.exit(1);
}

const SOUNDS = {
  shutter: { seconds: 0.6, text: "A single crisp modern camera shutter click, clean and close, no reverb" },
  chime: { seconds: 1.2, text: "A short bright two-note chime, warm and friendly, like a premium app logo sound, clean, no reverb tail" },
  beep: { seconds: 0.5, text: "One soft rounded countdown beep, gentle electronic tone, clean, single hit" },
  pop: { seconds: 0.5, text: "A soft satisfying UI pop, like a phone notification bubble appearing, subtle and clean" },
  cheer: { seconds: 2.5, text: "A small group of friends laughing and cheering happily at a party, close, short and natural" },
};

(async () => {
  const dir = path.join(__dirname, "sfx");
  fs.mkdirSync(dir, { recursive: true });
  for (const [name, { seconds, text }] of Object.entries(SOUNDS)) {
    const file = path.join(dir, `${name}.mp3`), stamp = `${file}.hash`;
    const hash = crypto.createHash("sha1").update(JSON.stringify([text, seconds])).digest("hex");
    if (fs.existsSync(file) && fs.existsSync(stamp) && fs.readFileSync(stamp, "utf8") === hash) continue;
    const res = await fetch("https://api.elevenlabs.io/v1/sound-generation?output_format=mp3_44100_128", {
      method: "POST",
      headers: { "xi-api-key": KEY, "content-type": "application/json" },
      body: JSON.stringify({ text, duration_seconds: seconds, prompt_influence: 0.6 }),
    });
    if (!res.ok) throw new Error(`${name}: ${res.status} ${await res.text()}`);
    fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
    fs.writeFileSync(stamp, hash);
    console.log(`${name}: made`);
  }
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
