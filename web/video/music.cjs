// Background music for the films with ElevenLabs Music, one instrumental track per film.
// Usage (from web/video): NODE_USE_ENV_PROXY=1 NODE_PATH=$(npm root -g) ELEVENLABS_API_KEY=... node music.cjs [explainer|erhverv ...]
//
// Made with music_v2_5, their best music model, from a composition plan rather than a loose prompt:
// each section starts on a scene change in the film, so the music builds with the story and lands a
// final hit on the end card. The film's real scene times are read from the page, after voice.cjs, since
// the voice-over sets how long each scene lasts. render.cjs ducks the music under the voice.
// Writes music/<film>.mp3. A track is only made again when its plan changes.
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { chromium } = require("playwright");

const KEY = process.env.ELEVENLABS_API_KEY;
if (!KEY) {
  console.error("Set ELEVENLABS_API_KEY.");
  process.exit(1);
}

const NO_VOICE = ["vocals", "singing", "vocal chops", "lyrics", "choir", "spoken word"];

// Every section begins at the start of a scene ("from") and runs to the next section, or to the end.
const PLANS = {
  explainer: {
    global: ["instrumental", "feel-good modern pop", "122 BPM", "in C major", "bright plucked synths", "handclaps", "groovy bass guitar", "crisp live-sounding drums", "warm, polished commercial mix", "celebratory party mood"],
    sections: [
      { from: "hook", name: "Intro", styles: ["quiet and a little curious", "just a muted plucked synth and soft finger snaps", "no drums yet"] },
      { from: "solve", name: "Groove", styles: ["kick, claps and bass come in", "catchy plucked synth hook", "happy and bouncy", "leaves room for a voice-over"] },
      { from: "peak", name: "Breakdown", styles: ["drums and bass drop out completely", "only a rising riser and a ticking hi-hat building tension", "ends in a short silence just before the drop"] },
      { from: "home", name: "Drop", styles: ["full groove explodes back in on the first beat", "biggest and happiest part", "leaves room for a voice-over"] },
      { from: "price", name: "Lift", styles: ["confident and bright", "full chords", "steady energy", "leaves room for a voice-over"] },
      { from: "cta", name: "Ending", styles: ["last phrase of the hook", "ends on one clean final hit", "short natural tail, no fade"] },
    ],
  },
  erhverv: {
    global: ["instrumental", "modern electronic club pop", "122 BPM", "in A minor", "punchy drums", "deep warm bass", "glossy synth chords", "polished nightlife feel", "premium, confident commercial mix"],
    sections: [
      { from: "hook", name: "Intro", styles: ["dark and minimal", "a muted pulsing synth and a soft heartbeat kick", "a little tension", "filter slowly opening"] },
      { from: "intro", name: "Drop", styles: ["club groove kicks in on the first beat", "deep bass and crisp hats", "confident and driving", "leaves room for a voice-over"] },
      { from: "content", name: "Groove", styles: ["steady driving groove", "playful synth arpeggio on top", "sidechained pads", "leaves room for a voice-over"] },
      { from: "mission", name: "Groove two", styles: ["a touch brighter", "extra percussion", "same tempo and key", "leaves room for a voice-over"] },
      { from: "reach", name: "Lift", styles: ["more energy", "brighter chords", "fuller drums", "leaves room for a voice-over"] },
      { from: "cta", name: "Ending", styles: ["final phrase", "ends on one clean final hit", "short natural tail, no fade"] },
    ],
  },
  events: {
    global: ["instrumental", "uplifting cinematic pop", "118 BPM", "in D major", "bright pianos and plucked strings", "big but tasteful drums", "warm synth pads", "sense of wonder and adventure", "premium brand film mix"],
    sections: [
      { from: "hook", name: "Intro", styles: ["airy and curious", "soft piano motif and shimmering pads", "no drums yet"] },
      { from: "theme", name: "Reveal", styles: ["drums and bass enter", "a feeling of something opening up", "confident, leaves room for a voice-over"] },
      { from: "hunt", name: "Adventure", styles: ["playful and adventurous", "light percussion and pizzicato", "forward motion", "leaves room for a voice-over"] },
      { from: "list", name: "Lift", styles: ["full and uplifting", "wide chords", "strongest part", "leaves room for a voice-over"] },
      { from: "cta", name: "Ending", styles: ["final phrase", "ends on one clean final hit", "short natural tail, no fade"] },
    ],
  },
};

async function sceneTimes(page, film) {
  await page.goto("file://" + path.join(__dirname, `${film}.html`));
  await page.evaluate(() => window.ready);
  return page.evaluate(() => ({ speed: window.FILM_SPEED || 1, total: window.DURATION, scenes: window.SCENE_TIMES }));
}

(async () => {
  const films = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(PLANS);
  const dir = path.join(__dirname, "music");
  fs.mkdirSync(dir, { recursive: true });
  const browser = await chromium.launch({ args: ["--allow-file-access-from-files"] });
  const page = await browser.newPage();
  for (const film of films) {
    const { global, sections } = PLANS[film];
    const { speed, total, scenes } = await sceneTimes(page, film);
    const at = (id) => Math.round((scenes.find((s) => s.id === id).start / speed) * 1000);
    const end = Math.round((total / speed) * 1000);
    const chunks = sections.map((s, i) => ({
      text: `[${s.name}]`,
      duration_ms: (i + 1 < sections.length ? at(sections[i + 1].from) : end) - at(s.from),
      positive_styles: [...global, ...s.styles],
      negative_styles: NO_VOICE,
      context_adherence: "high",
    }));
    const plan = { chunks };
    const file = path.join(dir, `${film}.mp3`), stamp = `${file}.hash`;
    const hash = crypto.createHash("sha1").update(JSON.stringify(plan)).digest("hex");
    if (fs.existsSync(file) && fs.existsSync(stamp) && fs.readFileSync(stamp, "utf8") === hash) continue;
    const res = await fetch("https://api.elevenlabs.io/v1/music", {
      method: "POST",
      headers: { "xi-api-key": KEY, "content-type": "application/json" },
      body: JSON.stringify({ composition_plan: plan, model_id: "music_v2_5" }),
    });
    if (!res.ok) throw new Error(`${film}: ${res.status} ${await res.text()}`);
    fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
    fs.writeFileSync(stamp, hash);
    console.log(`${film}: made, ${chunks.map((c) => `${c.text} ${(c.duration_ms / 1000).toFixed(1)}s`).join(", ")}`);
  }
  await browser.close();
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
