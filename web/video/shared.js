// Shared engine for the Selfi films (explainer.html, erhverv.html). A page defines its SCENES and calls
// mountFilm(SCENES, { steps, stepLabel }). render.cjs then calls window.seek(t) once per frame.
const FORMAT = new URLSearchParams(location.search).get("format") === "tall" ? "tall" : "wide";
document.documentElement.className = FORMAT;
const TALL = FORMAT === "tall";
const PH = "../public/photos/";
const MD = "../public/models/";

// ---------- building blocks ----------
const RING = "M117 18.5 H196 A19.5 19.5 0 0 1 215.5 38 V268 A19.5 19.5 0 0 1 196 287.5 H38 A19.5 19.5 0 0 1 18.5 268 V38 A19.5 19.5 0 0 1 38 18.5 H117";
const logo = (size) => `<span class="logo" style="--ls:${size}px"><svg viewBox="0 0 92 120"><path class="ring" d="M58 12 H60 A20 20 0 0 1 80 32 V88 A20 20 0 0 1 60 108 H32 A20 20 0 0 1 12 88 V32 A20 20 0 0 1 32 12 H34"/><circle class="lens" cx="46" cy="12" r="7"/><path class="smile" d="M31 66 A17 17 0 0 0 61 66"/></svg><span class="word">self<span class="i">ı</span></span></span>`;
const box = (bw, screen, attrs = "", cls = "") => `<div class="box ${cls}" style="--bw:${bw}px" ${attrs}><svg viewBox="0 0 234 306"><rect class="shell" width="234" height="306" rx="36"/><path class="ring-base" d="${RING}"/><path class="ring" d="${RING}" pathLength="100"/><rect class="notch" x="92" y="8" width="50" height="26" rx="10"/><circle class="cam" cx="117" cy="20" r="5"/></svg><div class="screen">${screen}</div></div>`;
const idle = `<div class="idle"><b>Tryk for at tage et billede</b><div class="shutter"><i></i></div></div>`;
const print = (w, img, cap, attrs = "") => `<div class="print" style="width:${w}px;--pw:${w}px" ${attrs}><div class="ph" style="background-image:url(${PH}${img}.jpg)"></div><span class="cap">${cap}</span></div>`;
// A full-screen photo behind the copy, with a dark gradient so white text stays readable.
const bleed = (img, pos = "50% 50%", attrs = "") => `<div class="bleed" ${attrs}><img src="${PH}${img}.jpg" alt="" style="object-position:${pos}"></div>`;
const tick = (t, at) => `<div data-in="${at}"><span class="check"></span>${t}</div>`;
const label = (n, t) => `<span class="label" data-in="0.2">${n ? `<span class="n">${n}</span>` : ""}${t}</span>`;

// A QR-looking pattern: three finder squares and fixed noise, so every frame is the same.
function qr() {
  let s = 7, out = "";
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  const finder = (x, y, ox, oy) => { const dx = x - ox, dy = y - oy; if (dx < 0 || dy < 0 || dx > 6 || dy > 6) return null; return dx === 0 || dy === 0 || dx === 6 || dy === 6 || (dx > 1 && dx < 5 && dy > 1 && dy < 5); };
  for (let y = 0; y < 21; y++) for (let x = 0; x < 21; x++) {
    let f = finder(x, y, 0, 0); if (f === null) f = finder(x, y, 14, 0); if (f === null) f = finder(x, y, 0, 14);
    const near = (x < 8 && y < 8) || (x > 12 && y < 8) || (x < 8 && y > 12);
    const on = f !== null ? f : near ? false : rnd() > 0.5;
    out += `<i${on ? "" : ' class="o"'}></i>`;
  }
  return `<div class="code">${out}</div>`;
}

// ---------- timeline ----------
const E = { out: (x) => 1 - Math.pow(1 - x, 3), inOut: (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2) };
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const prog = (t, a, d) => clamp((t - a) / d);
const FADE = 0.3;

function breathe(b, t) {
  const r = b.querySelector(".ring"), k = 0.5 - 0.5 * Math.cos((t / 3.2) * Math.PI * 2);
  r.style.strokeDasharray = "100 0";
  r.style.filter = `drop-shadow(0 0 ${7 + 16 * k}px rgba(255,243,227,${0.5 + 0.25 * k}))`;
}

// A touch: the ring lands on the target, swells and fades.
function tapAt(tap, frame, t, taps) {
  tap.style.opacity = 0;
  for (const [at, target] of taps) {
    const k = (t - at) / 0.55;
    if (k < 0 || k > 1) continue;
    const f = frame.getBoundingClientRect(), r = target.getBoundingClientRect();
    tap.style.left = `${r.left - f.left + r.width / 2}px`;
    tap.style.top = `${r.top - f.top + r.height / 2}px`;
    tap.style.opacity = k < 0.25 ? k / 0.25 : 1 - (k - 0.25) / 0.75;
    tap.style.transform = `scale(${0.6 + 0.9 * E.out(k)})`;
  }
}

let flashT = null;
function flashAt(t, at) { flashT = t >= at && t < at + 0.45 ? 1 - (t - at) / 0.45 : 0; }

// The voice-over sets the pace: a scene lasts as long as its line, plus a short lead-in and a short pause,
// and the scene's animation is stretched or squeezed to fit (warp), so there is never dead air.
const VOICE_LEAD = 0.3, VOICE_TAIL = 0.3;
const FILM_SPEED = 1;

function mountFilm(SCENES, { steps = 4, stepLabel = "Sådan virker den", plain = ["intro", "cta"] } = {}) {
  document.getElementById("c-step").innerHTML = `<span>${stepLabel}</span><span class="dots">${"<i></i>".repeat(steps)}</span>`;
  // With a voice-over (voice/<film>/timing.js), a scene is held until its line has been said.
  const VOICE = window.VOICE_TIMING || {};
  for (const s of SCENES) {
    s.design = s.dur;
    if (VOICE[s.id]) s.dur = VOICE_LEAD + VOICE[s.id] + VOICE_TAIL + (s.hold || 0);
    s.warp = s.design / s.dur; // design seconds per real second
  }
  let start = 0;
  for (const s of SCENES) { s.start = start; start += s.dur; }
  window.SCENE_TIMES = SCENES.map(({ id, start, dur }) => ({ id, start, dur }));
  // Sound effects, given per scene in design time as [at, name, gain], in real seconds for render.cjs.
  window.SFX_TIMES = SCENES.flatMap((s) => (s.sfx || []).map(([at, name, gain = 1]) => ({ t: s.start + at / s.warp, name, gain })));
  const DURATION = start;

  const root = document.getElementById("scenes");
  for (const s of SCENES) {
    const el = document.createElement("section");
    el.className = `scene${s.center ? " center" : ""}${s.full ? " full" : ""}`;
    el.innerHTML = s.html;
    root.appendChild(el);
    s.el = el;
  }
  document.getElementById("c-logo").innerHTML = logo(TALL ? 38 : 34);

  function seek(t) {
    flashT = 0;
    const steps = document.getElementById("c-step"), logoEl = document.getElementById("c-logo");
    let step = 0, chromeLogo = 0, stepVis = 0;
    for (const s of SCENES) {
      const lt = t - s.start;
      const active = lt >= -0.01 && lt < s.dur + 0.01;
      s.el.style.display = active ? "" : "none";
      if (!active) continue;
      const fin = prog(lt, 0, FADE), fout = s.last ? 0 : prog(lt, s.dur - FADE, FADE);
      s.el.style.opacity = fin * (1 - fout);
      s.el.style.transform = `translateY(${-14 * E.inOut(fout)}px)`;
      const a = lt * s.warp; // the scene's own clock, in design seconds
      s.el.querySelectorAll("[data-in]").forEach((n) => {
        const k = E.out(prog(a, +n.dataset.in, 0.6));
        n.style.opacity = k;
        n.style.translate = `0 ${(1 - k) * 28}px`;
      });
      // Full-screen photos drift slowly, so a still never looks frozen.
      s.el.querySelectorAll(".bleed img").forEach((img) => (img.style.transform = `scale(${1.04 + 0.08 * (a / s.design)})`));
      if (s.update) s.update(a, s.el);
      if (s.step) { step = s.step; stepVis = s.el.style.opacity; }
      if (!plain.includes(s.id)) chromeLogo = s.el.style.opacity;
    }
    logoEl.style.opacity = chromeLogo;
    steps.style.opacity = stepVis;
    steps.querySelectorAll(".dots i").forEach((d, i) => d.classList.toggle("on", i < step));
    document.getElementById("flash").style.opacity = (flashT || 0) * 0.4;
  }

  window.DURATION = DURATION; // in film time; real time is DURATION / FILM_SPEED
  window.FILM_SPEED = FILM_SPEED;
  window.VOICE_LEAD = VOICE_LEAD;
  window.seek = seek;
  window.ready = Promise.all([
    document.fonts.ready,
    ...[...document.images].map((i) => i.decode().catch(() => {})),
    ...[...new Set([...document.querySelectorAll("[style*=background-image]")].map((n) => n.style.backgroundImage.slice(5, -2)))].map((src) => new Promise((r) => { const i = new Image(); i.onload = i.onerror = r; i.src = src; })),
  ]).then(() => seek(+(new URLSearchParams(location.search).get("t") || 0)));

  // Preview in a browser: ?play plays in real time.
  if (new URLSearchParams(location.search).has("play")) window.ready.then(() => { const t0 = performance.now(); const f = () => { seek(((performance.now() - t0) / 1000 * FILM_SPEED) % DURATION); requestAnimationFrame(f); }; f(); });
}
