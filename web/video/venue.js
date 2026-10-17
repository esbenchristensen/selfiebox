// Boxes in a venue's own design: wings, a sign on top, casing, ring, screen and a framed print.
// Shared by erhverv.html and events.html; each film defines its own venues.
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (a, b, k) => { const A = hex(a), B = hex(b); return `rgb(${A.map((x, i) => Math.round(x + (B[i] - x) * k)).join(",")})`; };
const vscreen = (v) => `<div class="vscreen" style="background:${v.screen};color:${v.screenInk}"><span class="sg" style="color:${v.acc}">${v.sign}</span><b>Velkommen til ${v.name}</b><small>Tryk for at tage et billede</small><div class="shutter" style="border-color:${v.screenInk}"><i style="background:${v.acc}"></i></div></div>`;
const vbox = (bw, v, screen, attrs = "") => `
  <div class="vbox ${v.style}" style="--bw:${bw}px;--w1:${v.w1};--w2:${v.w2};--acc:${v.acc};--ink2:${v.ink2};--casing:${v.casing}" ${attrs}>
    <div class="wing l">${"<i></i>".repeat(5)}</div><div class="wing r">${"<i></i>".repeat(5)}</div>
    <div class="topper">${v.style === "bulbs" ? `<span class="row t">${"<i></i>".repeat(9)}</span><span class="row b">${"<i></i>".repeat(9)}</span>` : ""}<b>${v.sign}</b><small>${v.sub}</small></div>
    ${box(bw, screen)}
  </div>`;
const vprint = (w, v, attrs = "") => `<div class="print vprint" style="width:${w}px;--pw:${w}px;background:${v.frame}" ${attrs}><div class="ph" style="background-image:url(${PH}${v.photo}.jpg)"></div><span class="cap" style="color:${v.frameInk || v.acc}">${v.caption}</span></div>`;
function ringColor(b, color, glow) { const r = b.querySelector(".ring"); r.style.stroke = color; r.style.filter = `drop-shadow(0 0 ${glow}px ${color})`; }
function breatheIn(b, t, color) { const k = 0.5 - 0.5 * Math.cos((t / 3.2) * Math.PI * 2); b.querySelector(".ring").style.strokeDasharray = "100 0"; ringColor(b, color, 8 + 14 * k); }

