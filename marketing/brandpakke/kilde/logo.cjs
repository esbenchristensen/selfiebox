// Selfi-logoet som rene SVG-stier. Geometrien er målt fra web-logoet (measure.cjs) og glyferne er Instrument Sans 500 (glyphs.py).
const G = require("./assets/glyphs.json");
const M = require("./assets/measure.json");

const RING = "M58 12 H60 A20 20 0 0 1 80 32 V88 A20 20 0 0 1 60 108 H32 A20 20 0 0 1 12 88 V32 A20 20 0 0 1 32 12 H34";
const SMILE = "M31 66 A17 17 0 0 0 61 66";
const K = M.svg.w / 92; // mærkets skala ved font-size 1000
const OX = M.svg.x, OY = M.svg.y;
const BASE = M.base - OY;

// Farvesæt: ring (ring og smil), lens (linsen), word (bogstaver), dot (prikken over i).
const C = {
  dark: { ring: "#22d36b", lens: "#22d36b", word: "#fff3e3", dot: "#22d36b" },
  light: { ring: "#0e0f0e", lens: "#22d36b", word: "#0e0f0e", dot: "#22d36b" },
  green: { ring: "#0b1a10", lens: "#0b1a10", word: "#0b1a10", dot: "#0b1a10" },
  sort: { ring: "#0e0f0e", lens: "#0e0f0e", word: "#0e0f0e", dot: "#0e0f0e" },
  hvid: { ring: "#ffffff", lens: "#ffffff", word: "#ffffff", dot: "#ffffff" },
  creme: { ring: "#fff3e3", lens: "#fff3e3", word: "#fff3e3", dot: "#fff3e3" },
};

const markG = (c, x = 0, y = 0, k = K) =>
  `<g transform="translate(${r(x)} ${r(y)}) scale(${r(k, 5)})"><path d="${RING}" fill="none" stroke="${c.ring}" stroke-width="12"/><path d="${SMILE}" fill="none" stroke="${c.ring}" stroke-width="12"/><circle cx="46" cy="12" r="7" fill="${c.lens}"/></g>`;
// Mærkets synlige kasse i viewBox-enheder: x 6..86, y 5..114
const MARK_BOX = { x0: 6, y0: 5, x1: 86, y1: 114 };

const letters = [
  ["s", M.chars[0]], ["e", M.chars[1]], ["l", M.chars[2]], ["f", M.chars[3]], ["ı", M.i.x],
];
const WX0 = M.chars[0] - OX + G.glyphs.s.bounds[0];
const WX1 = M.i.x - OX + G.glyphs["ı"].bounds[2];
const DOT = { cx: M.i.x - OX + M.i.w / 2, cy: M.i.y - OY + 120 + 85, r: 85 };

const wordG = (c, dx = 0, dy = 0) =>
  letters.map(([ch, x]) => `<path transform="translate(${r(x - OX + dx)} ${r(BASE + dy)}) scale(1 -1)" d="${G.glyphs[ch].d}" fill="${c.word}"/>`).join("") +
  `<circle cx="${r(DOT.cx + dx)}" cy="${r(DOT.cy + dy)}" r="${DOT.r}" fill="${c.dot}"/>`;

function r(n, d = 2) { return +n.toFixed(d); }
const svg = (w, h, body, title = "Selfi") =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${r(w)} ${r(h)}" width="${r(w)}" height="${r(h)}"><title>${title}</title>${body}</svg>`;

// Vandret logo (hovedlogo). pad i procent af logoets højde.
function horizontal(cname, pad = 0) {
  const c = C[cname];
  const x0 = MARK_BOX.x0 * K, y0 = MARK_BOX.y0 * K, x1 = WX1, y1 = MARK_BOX.y1 * K;
  const h = y1 - y0, p = h * pad;
  return { w: x1 - x0 + 2 * p, h: h + 2 * p, body: `<g transform="translate(${r(p - x0)} ${r(p - y0)})">${markG(c)}${wordG(c)}</g>` };
}
// Kun symbolet.
function mark(cname, pad = 0) {
  const c = C[cname];
  const w = (MARK_BOX.x1 - MARK_BOX.x0) * K, h = (MARK_BOX.y1 - MARK_BOX.y0) * K, p = h * pad;
  return { w: w + 2 * p, h: h + 2 * p, body: markG(c, p - MARK_BOX.x0 * K, p - MARK_BOX.y0 * K) };
}
// Kun ordmærket.
function wordmark(cname, pad = 0) {
  const c = C[cname];
  const y0 = DOT.cy - DOT.r, y1 = BASE + 10, h = y1 - y0, p = h * pad;
  return { w: WX1 - WX0 + 2 * p, h: h + 2 * p, body: wordG(c, p - WX0, p - y0) };
}
// Stablet: symbol over ordmærke, centreret.
function stacked(cname, pad = 0) {
  const c = C[cname];
  const ww = WX1 - WX0, wy0 = DOT.cy - DOT.r, wh = BASE + 10 - wy0;
  const mk = 1.35 * K, mw = (MARK_BOX.x1 - MARK_BOX.x0) * mk, mh = (MARK_BOX.y1 - MARK_BOX.y0) * mk;
  const gap = wh * 0.42, W = Math.max(ww, mw), H = mh + gap + wh, p = H * pad;
  const body = markG(c, p + (W - mw) / 2 - MARK_BOX.x0 * mk, p - MARK_BOX.y0 * mk, mk) + wordG(c, p + (W - ww) / 2 - WX0, p + mh + gap - wy0);
  return { w: W + 2 * p, h: H + 2 * p, body };
}
// App-ikon / profilbillede: firkant med symbolet centreret. shape: "square" | "round" | "circle"
function icon(bg, cname, size = 1024, shape = "square", scale = 0.5) {
  const c = C[cname];
  const mh = (MARK_BOX.y1 - MARK_BOX.y0), mw = (MARK_BOX.x1 - MARK_BOX.x0);
  const k = (size * scale) / mh;
  const x = (size - mw * k) / 2 - MARK_BOX.x0 * k, y = (size - mh * k) / 2 - MARK_BOX.y0 * k;
  const back = shape === "circle" ? `<circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="${bg}"/>`
    : shape === "round" ? `<rect width="${size}" height="${size}" rx="${size * 0.2237}" fill="${bg}"/>`
    : `<rect width="${size}" height="${size}" fill="${bg}"/>`;
  return { w: size, h: size, body: back + markG(c, x, y, k) };
}

module.exports = { K, C, svg, horizontal, mark, wordmark, stacked, icon, RING, SMILE };
