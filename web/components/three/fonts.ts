import { Archivo, Lilita_One, Outfit, Poppins } from "next/font/google";
import type { FontKey } from "./themes";

// Only the 3D chunk imports these, so the fonts load with the viewer and never block the page.
const archivo = Archivo({ subsets: ["latin", "latin-ext"], weight: ["900"], preload: false });
const poppins = Poppins({ subsets: ["latin", "latin-ext"], weight: ["700"], preload: false });
const outfit = Outfit({ subsets: ["latin", "latin-ext"], weight: ["700"], preload: false });
const lilita = Lilita_One({ subsets: ["latin", "latin-ext"], weight: ["400"], preload: false });

const WEIGHTS: Record<FontKey, number> = { display: 600, archivo: 900, poppins: 700, outfit: 700, lilita: 400 };

function family(key: FontKey): string {
  if (key === "archivo") return archivo.style.fontFamily;
  if (key === "poppins") return poppins.style.fontFamily;
  if (key === "outfit") return outfit.style.fontFamily;
  if (key === "lilita") return lilita.style.fontFamily;
  // The site's own display face is set as a CSS variable on <html> by next/font.
  const v = typeof document !== "undefined" ? getComputedStyle(document.documentElement).getPropertyValue("--font-display").trim() : "";
  return v || "Helvetica Neue, Arial, sans-serif";
}

export function font(key: FontKey, size: number, weight = WEIGHTS[key]): string {
  return `${weight} ${Math.round(size)}px ${family(key)}, sans-serif`;
}

export function bodyFont(size: number, weight = 500): string {
  const v = typeof document !== "undefined" ? getComputedStyle(document.documentElement).getPropertyValue("--font-body").trim() : "";
  return `${weight} ${Math.round(size)}px ${v || "Helvetica Neue, Arial, sans-serif"}`;
}

export function monoFont(size: number, weight = 500): string {
  const v = typeof document !== "undefined" ? getComputedStyle(document.documentElement).getPropertyValue("--font-mono").trim() : "";
  return `${weight} ${Math.round(size)}px ${v || "ui-monospace, Menlo, monospace"}`;
}

// Resolves when the theme's face is ready to draw with. The @font-face rules arrive with the 3D chunk's CSS,
// which can be a moment after the first draw, so keep asking until the face exists or time runs out.
export function fontReady(key: FontKey): Promise<unknown> {
  if (typeof document === "undefined" || !document.fonts) return Promise.resolve();
  const spec = font(key, 64);
  return new Promise<void>((resolve) => {
    const start = performance.now();
    const attempt = () => {
      document.fonts
        .load(spec, "ÆØÅ Smukt!")
        .then((faces) => {
          if (faces.length || performance.now() - start > 5000) resolve();
          else setTimeout(attempt, 150);
        })
        .catch(() => resolve());
    };
    attempt();
  });
}
