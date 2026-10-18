"use client";

import { useEffect, useState } from "react";

const PAGE_W = 794;
const GAP = 28;
const KEY = "kat-spread";

// Scales the A4 pages to the screen. "Opslag" shows two pages side by side on wide screens,
// and "Gem som PDF" prints every page at full size on its own sheet.
export function Viewer({ children }: { children: React.ReactNode }) {
  const [spread, setSpread] = useState(false);

  useEffect(() => {
    try {
      setSpread(localStorage.getItem(KEY) === "1");
    } catch {}
  }, []);

  useEffect(() => {
    const slots = [...document.querySelectorAll<HTMLElement>(".kat-slot")];
    const fit = () => {
      const w = document.documentElement.clientWidth - 32;
      const cols = spread && w >= 900 ? 2 : 1;
      const z = Math.min(cols === 2 ? 0.62 : 0.9, (w - (cols - 1) * GAP) / cols / PAGE_W);
      slots.forEach((s) => (s.style.zoom = z.toFixed(3)));
    };
    const full = () => slots.forEach((s) => (s.style.zoom = "1"));
    fit();
    window.addEventListener("resize", fit);
    window.addEventListener("beforeprint", full);
    window.addEventListener("afterprint", fit);
    return () => {
      window.removeEventListener("resize", fit);
      window.removeEventListener("beforeprint", full);
      window.removeEventListener("afterprint", fit);
    };
  }, [spread]);

  const toggle = () => {
    const next = !spread;
    setSpread(next);
    try {
      localStorage.setItem(KEY, next ? "1" : "0");
    } catch {}
  };

  return (
    <>
      <div className="kat-bar">
        <div className="kat-bar-t">
          <b>Selfi × Smukfest</b>
          <span>Salgskatalog · forslag 2027 · 12 sider A4</span>
        </div>
        <div className="kat-bar-acts">
          <button type="button" className="kat-pill kat-pill--spread" onClick={toggle}>
            {spread ? "Enkeltsider" : "Opslag"}
          </button>
          <button type="button" className="kat-pill kat-pill--primary" onClick={() => window.print()}>
            Gem som PDF
          </button>
        </div>
      </div>
      <main className="kat-deck">{children}</main>
    </>
  );
}
