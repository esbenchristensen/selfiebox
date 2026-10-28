"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { OutlinePoster } from "./Outline";
import { SHOWROOM as venues } from "./three/showroom";

const Showroom3D = dynamic(() => import("./three/Showroom3D"), { ssr: false, loading: () => null });

const ADVANCE_MS = 6000;

// Venues: the whole box is designed for the place. All designs in one row that goes round and round; the
// visuals do the talking. focus counts on past the last design, the design shown is focus mod the count.
export function Showroom({ title, lede }: { title: string; lede: string }) {
  const [focus, setFocus] = useState(0);
  const swipe = useRef<{ x: number; y: number; t: number } | null>(null);
  const [ready, setReady] = useState(false);
  const [near, setNear] = useState(false);
  const touched = useRef(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: "700px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      if (!touched.current && document.visibilityState === "visible") setFocus((f) => f + 1);
    }, ADVANCE_MS);
    return () => clearInterval(id);
  }, []);

  const pick = (k: number) => {
    touched.current = true;
    setFocus(k);
  };
  const venue = venues[((focus % venues.length) + venues.length) % venues.length];

  return (
    <section id="temaer" className="showroom" aria-labelledby="showroom-title">
      <div className="wrap showroom-head">
        <span className="label">Jeres eget design</span>
        <h2 id="showroom-title" className="h-l">
          {title}
        </h2>
        <p className="lede">{lede}</p>
      </div>
      <div ref={ref} className={`showroom-stage viewer${ready ? " is-ready" : ""}`} role="img"
        aria-label={`Selfi i 3D med designet til ${venue.name}`}
        onPointerDownCapture={(e) => (swipe.current = { x: e.clientX, y: e.clientY, t: e.timeStamp })}
        onPointerUpCapture={(e) => {
          const s = swipe.current;
          swipe.current = null;
          if (!s) return;
          const dx = e.clientX - s.x;
          const dy = e.clientY - s.y;
          if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5 && e.timeStamp - s.t < 800) pick(focus + (dx < 0 ? 1 : -1));
        }}
      >
        <div className="viewer-poster" aria-hidden="true">
          <OutlinePoster />
        </div>
        {near && <Showroom3D focus={focus} onPick={pick} onReady={() => setReady(true)} />}
        <button className="showroom-arrow showroom-arrow--prev" onClick={() => pick(focus - 1)} aria-label="Forrige design">
          ‹
        </button>
        <button className="showroom-arrow showroom-arrow--next" onClick={() => pick(focus + 1)} aria-label="Næste design">
          ›
        </button>
      </div>
      <div className="wrap">
        <p className="fine showroom-note">
          Konceptdesigns uden logoer, der viser, hvad der kan lade sig gøre. Stederne og mærkerne er ikke kunder hos Selfi.
        </p>
      </div>
    </section>
  );
}
