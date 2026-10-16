import * as THREE from "three";
import { bodyFont, font, fontReady, monoFont } from "./fonts";
import type { BoxTheme, Topper } from "./themes";

// Every surface of the box is drawn on a 2D canvas, so a theme is just data and no image files are needed.
// Each texture is drawn once at once, then again when its font and photo have loaded.

type Draw = (ctx: CanvasRenderingContext2D, w: number, h: number) => void;

function canvasTexture(w: number, h: number, draw: Draw, waitFor: Promise<unknown>[] = []): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d")!;
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  const paint = () => {
    ctx.save();
    ctx.clearRect(0, 0, w, h);
    draw(ctx, w, h);
    ctx.restore();
    tex.needsUpdate = true;
  };
  paint();
  if (waitFor.length) Promise.all(waitFor).then(paint);
  return tex;
}

const images = new Map<string, Promise<HTMLImageElement | null>>();
function loadImage(src: string): Promise<HTMLImageElement | null> {
  let p = images.get(src);
  if (!p) {
    p = new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = src;
    });
    images.set(src, p);
  }
  return p;
}
const loaded = new Map<string, HTMLImageElement | null>();
function imageNow(src: string) {
  return loaded.get(src) ?? null;
}
function imageReady(src: string) {
  return loadImage(src).then((img) => {
    loaded.set(src, img);
  });
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

function star(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x, y - r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.quadraticCurveTo(x, y, x, y + r);
  ctx.quadraticCurveTo(x, y, x - r, y);
  ctx.quadraticCurveTo(x, y, x, y - r);
  ctx.fill();
}

// Repeatable random numbers, so a pattern looks the same every time it is drawn.
function rng(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

function fitText(ctx: CanvasRenderingContext2D, text: string, maxW: number, size: number, make: (s: number) => string) {
  let s = size;
  ctx.font = make(s);
  while (ctx.measureText(text).width > maxW && s > 10) {
    s -= 2;
    ctx.font = make(s);
  }
  return s;
}

function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxW: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxW && line) {
      lines.push(line);
      line = w;
    } else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

const up = (t: BoxTheme, s: string) => (t.upper ? s.toUpperCase() : s);

// ---------- Screen ----------

export const SCREEN_PX = { w: 768, h: 1086 };

function screenPattern(ctx: CanvasRenderingContext2D, t: BoxTheme, w: number, h: number) {
  const r = rng(7);
  const c = t.colors;
  ctx.save();
  switch (t.pattern) {
    case "beech": {
      ctx.fillStyle = c.accent;
      for (let i = 0; i < 26; i++) {
        ctx.globalAlpha = 0.25 + r() * 0.6;
        star(ctx, r() * w, r() * h * 0.92, 6 + r() * 14);
      }
      ctx.globalAlpha = 1;
      ctx.fillStyle = c.topper;
      ctx.beginPath();
      ctx.moveTo(0, h);
      for (let x = 0; x <= w; x += 64) ctx.quadraticCurveTo(x + 32, h - 150 - r() * 70, x + 64, h - 90);
      ctx.lineTo(w, h);
      ctx.fill();
      break;
    }
    case "orange": {
      ctx.strokeStyle = c.accent;
      for (let i = 0; i < 6; i++) {
        ctx.globalAlpha = 0.9 - i * 0.14;
        ctx.lineWidth = 26;
        ctx.beginPath();
        ctx.arc(w / 2, -120, 260 + i * 70, 0, Math.PI);
        ctx.stroke();
      }
      break;
    }
    case "neon": {
      ctx.fillStyle = c.topperAccent;
      ctx.beginPath();
      ctx.moveTo(0, h * 0.62);
      ctx.lineTo(w, h * 0.5);
      ctx.lineTo(w, h * 0.66);
      ctx.lineTo(0, h * 0.78);
      ctx.fill();
      ctx.fillStyle = c.accent;
      for (let y = 40; y < 240; y += 44) for (let x = 40 + ((y / 44) % 2) * 22; x < w; x += 44) {
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }
    case "planks": {
      ctx.translate(w / 2, h * 0.08);
      ctx.fillStyle = c.accent;
      for (let i = 0; i < 18; i++) {
        ctx.globalAlpha = i % 2 ? 0.1 : 0.2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, h * 1.2, (i / 18) * Math.PI, ((i + 0.5) / 18) * Math.PI);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.arc(0, 0, 90, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case "studs": {
      for (let y = 30; y < h; y += 96) for (let x = 30; x < w; x += 96) {
        ctx.fillStyle = "rgba(0,0,0,0.13)";
        ctx.beginPath();
        ctx.arc(x + 4, y + 5, 30, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,0.08)";
        ctx.beginPath();
        ctx.arc(x, y, 30, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }
    case "giraffe": {
      ctx.fillStyle = c.topperAccent;
      for (let i = 0; i < 14; i++) {
        const x = i % 2 ? w - r() * 120 : r() * 120;
        const y = r() * h;
        ctx.globalAlpha = 0.35 + r() * 0.3;
        ctx.beginPath();
        ctx.ellipse(x, y, 70, 26, r() * Math.PI, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }
    case "garland": {
      ctx.strokeStyle = c.accent;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-20, 60);
      ctx.quadraticCurveTo(w / 2, 230, w + 20, 60);
      ctx.stroke();
      for (let i = 1; i < 12; i++) {
        const x = (i / 12) * w;
        const tt = i / 12;
        const y = (1 - tt) * (1 - tt) * 60 + 2 * (1 - tt) * tt * 230 + tt * tt * 60;
        const g = ctx.createRadialGradient(x, y + 14, 0, x, y + 14, 28);
        g.addColorStop(0, "rgba(255,214,140,0.95)");
        g.addColorStop(1, "rgba(255,214,140,0)");
        ctx.fillStyle = g;
        ctx.fillRect(x - 30, y - 16, 60, 60);
      }
      break;
    }
    case "gold": {
      for (let i = 0; i < 9; i++) {
        const x = r() * w;
        const y = r() * h * 0.3 + (i % 2 ? h * 0.7 : 0);
        const rad = 30 + r() * 30;
        const g = ctx.createRadialGradient(x - rad / 3, y - rad / 3, 2, x, y, rad);
        g.addColorStop(0, "#fff1c2");
        g.addColorStop(1, c.accent);
        ctx.globalAlpha = 0.85;
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.ellipse(x, y, rad * 0.85, rad, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }
    case "confetti": {
      const cols = [c.accent, "#ffffff", "#f2c14e"];
      for (let i = 0; i < 70; i++) {
        ctx.fillStyle = cols[i % 3];
        ctx.globalAlpha = 0.7;
        ctx.save();
        ctx.translate(r() * w, r() * h);
        ctx.rotate(r() * Math.PI);
        ctx.fillRect(-7, -3, 14, 6);
        ctx.restore();
      }
      break;
    }
    default: {
      const g = ctx.createRadialGradient(w / 2, h * 0.42, 10, w / 2, h * 0.42, w * 0.8);
      g.addColorStop(0, "rgba(255,243,227,0.08)");
      g.addColorStop(1, "rgba(255,243,227,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    }
  }
  ctx.restore();
}

export function screenTexture(t: BoxTheme) {
  const c = t.colors;
  return canvasTexture(
    SCREEN_PX.w,
    SCREEN_PX.h,
    (ctx, w, h) => {
      roundRect(ctx, 0, 0, w, h, 26);
      ctx.clip();
      ctx.fillStyle = c.screen;
      ctx.fillRect(0, 0, w, h);
      screenPattern(ctx, t, w, h);

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = c.screenInk;
      ctx.globalAlpha = 0.75;
      ctx.font = monoFont(26);
      ctx.letterSpacing = "5px";
      ctx.fillText(t.label.toUpperCase(), w / 2, 150);
      ctx.letterSpacing = "0px";
      ctx.globalAlpha = 1;

      // Biggest size where the welcome fits on three lines.
      let size = 120;
      let lines: string[] = [];
      const text = up(t, t.welcome);
      for (; size > 40; size -= 4) {
        ctx.font = font(t.font, size);
        lines = wrapLines(ctx, text, w - 130);
        if (lines.length <= 3 && lines.every((l) => ctx.measureText(l).width <= w - 110)) break;
      }
      const lh = size * 1.02;
      const top = 430 - ((lines.length - 1) * lh) / 2;
      lines.forEach((l, i) => ctx.fillText(l, w / 2, top + i * lh));

      const cy = t.ticker ? 760 : 790;
      ctx.lineWidth = 6;
      ctx.strokeStyle = c.screenInk;
      ctx.beginPath();
      ctx.arc(w / 2, cy, 66, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = c.accent;
      ctx.beginPath();
      ctx.arc(w / 2, cy, 50, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = c.screenInk;
      ctx.globalAlpha = 0.7;
      ctx.font = bodyFont(28);
      ctx.fillText("Tryk på skærmen", w / 2, cy + 116);
    },
    [fontReady(t.font)],
  );
}

// A seamless strip that scrolls along the bottom of the screen.
export function tickerTexture(t: BoxTheme) {
  const H = 96;
  const probe = document.createElement("canvas").getContext("2d")!;
  probe.font = font(t.font, 50);
  const one = Math.ceil(probe.measureText(up(t, t.ticker ?? "")).width) || 400;
  const copies = Math.max(1, Math.ceil(1024 / one));
  const tex = canvasTexture(
    one * copies,
    H,
    (ctx, w, h) => {
      ctx.fillStyle = t.colors.accent;
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = t.colors.accentInk;
      ctx.font = font(t.font, 50);
      ctx.textBaseline = "middle";
      const unit = w / copies;
      for (let i = 0; i < copies; i++) ctx.fillText(up(t, t.ticker ?? ""), i * unit, h / 2 + 2);
    },
    [fontReady(t.font)],
  );
  tex.wrapS = THREE.RepeatWrapping;
  return { tex, aspect: (one * copies) / H };
}

// ---------- Top piece ----------

export function topperTexture(t: BoxTheme, type: Topper, bw: number, bh: number) {
  const c = t.colors;
  const W = 1024;
  const H = Math.round((W * bh) / bw);
  return canvasTexture(
    W,
    H,
    (ctx, w, h) => {
      const r = rng(11);
      ctx.fillStyle = c.topper;
      ctx.fillRect(0, 0, w, h);
      let textY = h * 0.6;
      let maxW = w * 0.78;
      switch (type) {
        case "hills": {
          ctx.fillStyle = "rgba(0,0,0,0.22)";
          for (let i = 0; i < 7; i++) {
            ctx.beginPath();
            ctx.arc((i / 6) * w, h * 0.32 + (i % 2) * 30, 110 + r() * 40, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.fillStyle = c.topperAccent;
          for (let i = 0; i < 18; i++) {
            ctx.globalAlpha = 0.5 + r() * 0.5;
            star(ctx, r() * w, h * 0.12 + r() * h * 0.35, 6 + r() * 12);
          }
          ctx.globalAlpha = 1;
          textY = h * 0.66;
          break;
        }
        case "arch": {
          ctx.strokeStyle = "rgba(0,0,0,0.28)";
          ctx.lineWidth = 7;
          for (let i = 0; i <= 12; i++) {
            const a = Math.PI + (i / 12) * Math.PI;
            ctx.beginPath();
            ctx.moveTo(w / 2, h);
            ctx.lineTo(w / 2 + Math.cos(a) * w, h + Math.sin(a) * h * 1.6);
            ctx.stroke();
          }
          ctx.fillStyle = "rgba(0,0,0,0.85)";
          ctx.fillRect(0, h * 0.74, w, h * 0.26);
          textY = h * 0.5;
          maxW = w * 0.62;
          break;
        }
        case "ticket": {
          ctx.fillStyle = c.topperAccent;
          ctx.fillRect(0, h * 0.78, w, h * 0.22);
          ctx.strokeStyle = c.topperInk;
          ctx.setLineDash([14, 12]);
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(w * 0.82, 12);
          ctx.lineTo(w * 0.82, h - 12);
          ctx.stroke();
          ctx.setLineDash([]);
          textY = h * 0.4;
          maxW = w * 0.66;
          ctx.translate(-w * 0.08, 0);
          break;
        }
        case "sun": {
          ctx.save();
          ctx.translate(w / 2, h);
          for (let i = 0; i < 16; i++) {
            ctx.fillStyle = i % 2 ? c.topper : "#ffb21e";
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.arc(0, 0, w, Math.PI + (i / 16) * Math.PI, Math.PI + ((i + 1) / 16) * Math.PI);
            ctx.fill();
          }
          ctx.fillStyle = "#fff4cf";
          ctx.beginPath();
          ctx.arc(0, 0, h * 0.66, Math.PI, 0);
          ctx.fill();
          ctx.restore();
          textY = h * 0.72;
          maxW = w * 0.5;
          break;
        }
        case "brick": {
          const g = ctx.createLinearGradient(0, 0, 0, h);
          g.addColorStop(0, "rgba(255,255,255,0.25)");
          g.addColorStop(0.12, "rgba(255,255,255,0)");
          g.addColorStop(1, "rgba(0,0,0,0.12)");
          ctx.fillStyle = g;
          ctx.fillRect(0, 0, w, h);
          ctx.fillStyle = c.topperInk;
          roundRect(ctx, w * 0.08, h * 0.16, w * 0.84, h * 0.6, 28);
          ctx.fill();
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 8;
          roundRect(ctx, w * 0.1, h * 0.19, w * 0.8, h * 0.54, 22);
          ctx.stroke();
          textY = h * 0.47;
          maxW = w * 0.7;
          break;
        }
        case "leaves": {
          ctx.fillStyle = c.topperAccent;
          for (let i = 0; i < 26; i++) {
            ctx.save();
            ctx.globalAlpha = 0.5 + r() * 0.5;
            ctx.translate(r() * w, r() * h * 0.45);
            ctx.rotate(r() * Math.PI);
            ctx.beginPath();
            ctx.ellipse(0, 0, 46, 16, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
          ctx.fillStyle = "#ebc57e";
          for (let i = 0; i < 9; i++) {
            ctx.beginPath();
            ctx.ellipse(r() * w, h * 0.86 + r() * 30, 34, 22, r() * 3, 0, Math.PI * 2);
            ctx.fill();
          }
          textY = h * 0.62;
          maxW = w * 0.7;
          break;
        }
      }
      const mark = up(t, t.mark ?? t.name);
      const size = fitText(ctx, mark, maxW, h * (t.tagline ? 0.34 : 0.42), (s) => font(t.font, s));
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = type === "arch" ? c.topperInk : c.topperInk;
      if (type === "sun") ctx.fillStyle = c.topperInk;
      if (type === "brick") ctx.fillStyle = "#ffffff";
      ctx.letterSpacing = t.upper ? "2px" : "0px";
      ctx.fillText(mark, w / 2, textY - (t.tagline ? size * 0.22 : 0));
      if (t.tagline) {
        ctx.font = bodyFont(Math.max(22, size * 0.3), 600);
        ctx.letterSpacing = "4px";
        ctx.globalAlpha = 0.9;
        if (type === "arch") ctx.fillStyle = c.topperAccent;
        if (type === "brick") ctx.fillStyle = c.topper;
        const ty = type === "arch" ? h * 0.87 : type === "ticket" ? h * 0.89 : textY + size * 0.6;
        if (type === "ticket") ctx.fillStyle = c.topperInk;
        ctx.fillText(t.tagline.toUpperCase(), w / 2, ty);
      }
    },
    [fontReady(t.font)],
  );
}

// ---------- Printed wrap round the sides ----------

export function sideTexture(t: BoxTheme) {
  const c = t.colors;
  const S = 256;
  const tex = canvasTexture(S, S, (ctx, w, h) => {
    const r = rng(23);
    ctx.fillStyle = c.side;
    ctx.fillRect(0, 0, w, h);
    // Draw each mark nine times, shifted a tile in each direction, so the tile has no seams.
    const wrapped = (f: () => void) => {
      for (const dx of [-w, 0, w]) for (const dy of [-h, 0, h]) {
        ctx.save();
        ctx.translate(dx, dy);
        f();
        ctx.restore();
      }
    };
    ctx.fillStyle = c.sideInk;
    switch (t.pattern) {
      case "beech":
        for (let i = 0; i < 9; i++) {
          const x = r() * w, y = r() * h, a = r() * Math.PI;
          wrapped(() => {
            ctx.translate(x, y);
            ctx.rotate(a);
            ctx.beginPath();
            ctx.ellipse(0, 0, 28, 11, 0, 0, Math.PI * 2);
            ctx.fill();
          });
        }
        ctx.fillStyle = c.accent;
        for (let i = 0; i < 6; i++) {
          const x = r() * w, y = r() * h;
          wrapped(() => star(ctx, x, y, 7));
        }
        break;
      case "orange":
        ctx.lineWidth = 34;
        ctx.strokeStyle = c.sideInk;
        for (let k = -2; k <= 2; k++) {
          ctx.beginPath();
          ctx.moveTo(k * 128 - 64, h + 64);
          ctx.lineTo(k * 128 + w + 64, -64 + h - w - 0);
          ctx.stroke();
        }
        break;
      case "neon":
        for (let y = 0; y < h; y += 64) for (let x = 0; x < w; x += 64) {
          ctx.beginPath();
          ctx.arc(x + 32 + ((y / 64) % 2) * 32, y + 32, 9, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
      case "planks":
        ctx.fillStyle = "rgba(0,0,0,0.25)";
        for (let x = 0; x < w; x += 64) ctx.fillRect(x, 0, 4, h);
        ctx.fillStyle = c.sideInk;
        ctx.fillRect(0, 0, w, 14);
        ctx.fillRect(0, h / 2 - 7, w, 14);
        break;
      case "studs":
        for (const [x, y] of [[64, 64], [192, 64], [64, 192], [192, 192]]) {
          ctx.fillStyle = "rgba(0,0,0,0.22)";
          ctx.beginPath();
          ctx.arc(x + 4, y + 6, 40, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "rgba(255,255,255,0.12)";
          ctx.beginPath();
          ctx.arc(x, y, 40, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
      case "giraffe":
        for (let gy = 0; gy < 3; gy++) for (let gx = 0; gx < 3; gx++) {
          const x = gx * 85 + 42 + (r() - 0.5) * 30, y = gy * 85 + 42 + (r() - 0.5) * 30;
          const pts = Array.from({ length: 7 }, (_, i) => {
            const a = (i / 7) * Math.PI * 2;
            const rr = 26 + r() * 12;
            return [Math.cos(a) * rr, Math.sin(a) * rr];
          });
          wrapped(() => {
            ctx.translate(x, y);
            ctx.beginPath();
            pts.forEach(([px, py], i) => (i ? ctx.lineTo(px, py) : ctx.moveTo(px, py)));
            ctx.closePath();
            ctx.lineJoin = "round";
            ctx.lineWidth = 10;
            ctx.strokeStyle = c.sideInk;
            ctx.stroke();
            ctx.fill();
          });
        }
        break;
    }
  });
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

// ---------- The Instax print ----------

export const PRINT = { w: 0.72, h: 0.86 };

export function printTexture(t: BoxTheme) {
  const c = t.colors;
  return canvasTexture(
    720,
    860,
    (ctx, w, h) => {
      ctx.fillStyle = c.frame;
      ctx.fillRect(0, 0, w, h);
      const img = imageNow(t.photo);
      if (img) {
        const s = Math.max(620 / img.width, 620 / img.height);
        const iw = img.width * s, ih = img.height * s;
        ctx.save();
        ctx.beginPath();
        ctx.rect(50, 50, 620, 620);
        ctx.clip();
        ctx.drawImage(img, 50 + (620 - iw) / 2, 50 + (620 - ih) / 2, iw, ih);
        ctx.restore();
      } else {
        ctx.fillStyle = "#222";
        ctx.fillRect(50, 50, 620, 620);
      }
      ctx.fillStyle = c.frameInk;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const cap = t.caption.toUpperCase();
      ctx.letterSpacing = "3px";
      fitText(ctx, cap, 600, 34, (s) => monoFont(s));
      ctx.fillText(cap, w / 2, 765);
    },
    [imageReady(t.photo), fontReady(t.font)],
  );
}

// ---------- Light ----------

// A soft blurred copy of the ring, drawn additively in front of the box so the ring seems to glow.
export function ringGlowTexture(ringW: number, ringH: number, r: number, pad: number) {
  const scale = 200;
  const W = Math.round((ringW + pad * 2) * scale);
  const H = Math.round((ringH + pad * 2) * scale);
  const tex = canvasTexture(W, H, (ctx) => {
    ctx.strokeStyle = "#ffffff";
    ctx.filter = `blur(${Math.round(scale * 0.09)}px)`;
    ctx.lineWidth = scale * 0.12;
    roundRect(ctx, pad * scale, pad * scale, ringW * scale, ringH * scale, r * scale);
    ctx.stroke();
    ctx.filter = `blur(${Math.round(scale * 0.03)}px)`;
    ctx.lineWidth = scale * 0.07;
    ctx.stroke();
  });
  tex.colorSpace = THREE.NoColorSpace;
  return tex;
}

export function radialTexture() {
  const tex = canvasTexture(256, 256, (ctx, w, h) => {
    const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.35, "rgba(255,255,255,0.35)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  });
  tex.colorSpace = THREE.NoColorSpace;
  return tex;
}
