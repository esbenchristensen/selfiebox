"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { BoxViewer } from "./BoxViewer";
import { OutlinePoster } from "./Outline";
import { Ph } from "./Placeholder";
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
          <Ph note="konceptdesigns med andres logoer; skiftes til rigtige kunders designs, eller der indhentes tilladelse, før siden udgives">
            Konceptdesigns. Stederne og mærkerne er ikke kunder hos Selfi, og logoer og navne tilhører dem.
          </Ph>
        </p>
      </div>
    </section>
  );
}

// The hero on /erhverv: one box that turns through the venue designs by itself. Swipe, the arrows or
// the dots move it by hand; after that it stays where it was put.
export function HeroBox() {
  const [i, setI] = useState(0);
  const paused = useRef(false);
  const touched = useRef(false);
  const swipe = useRef<{ x: number; y: number; t: number } | null>(null);
  // Phones get the line drawing and fetch three.js and the models only when asked: the hero is the first
  // thing on the page, and the 3D costs about a megabyte before the first design shows.
  const [small, setSmall] = useState(false);
  const [wants3d, setWants3d] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 700px)");
    const sync = () => setSmall(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  const live = !small || wants3d;
  useEffect(() => {
    if (!live || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      if (!paused.current && !touched.current && document.visibilityState === "visible") setI((n) => (n + 1) % venues.length);
    }, 4600);
    return () => clearInterval(id);
  }, [live]);
  const go = (n: number) => {
    touched.current = true;
    setI((n + venues.length) % venues.length);
  };
  const venue = venues[i];
  return (
    <div
      className="hero-box"
      onPointerEnter={(e) => e.pointerType === "mouse" && (paused.current = true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && (paused.current = false)}
      onPointerDownCapture={(e) => (swipe.current = { x: e.clientX, y: e.clientY, t: e.timeStamp })}
      onPointerUpCapture={(e) => {
        const s = swipe.current;
        swipe.current = null;
        if (!s) return;
        const dx = e.clientX - s.x;
        const dy = e.clientY - s.y;
        // A quick, clearly sideways flick changes design; a slow drag only turns the box.
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5 && e.timeStamp - s.t < 800) go(i + (dx < 0 ? 1 : -1));
      }}
    >
      {live ? (
        <BoxViewer design={{ venue }} variant="venue" label={`Selfi i 3D, her med et design til ${venue.name}`} preload={[venues[(i + 1) % venues.length]]} />
      ) : (
        <div className="viewer hero-box-still">
          <div className="viewer-poster" aria-hidden="true">
            <OutlinePoster />
          </div>
          <button type="button" className="btn btn-secondary hero-box-3d" onClick={() => setWants3d(true)}>
            Se boksen i 3D
          </button>
        </div>
      )}
      <div className="hero-box-cap" style={{ "--bg": venue.palette.base } as React.CSSProperties}>
        <a href="#temaer" className="hero-box-logo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/models/${venue.id}/logo.svg`} alt={venue.name} />
        </a>
        <div className="hero-box-nav">
          <button type="button" className="hero-box-arrow" onClick={() => go(i - 1)} aria-label="Forrige design">
            ‹
          </button>
          <span className="dots" role="tablist" aria-label="Designs">
            {venues.map((t, k) => (
              <button key={t.id} type="button" role="tab" aria-selected={k === i} aria-label={t.name} data-on={k === i} onClick={() => go(k)}>
                <i />
              </button>
            ))}
          </span>
          <button type="button" className="hero-box-arrow" onClick={() => go(i + 1)} aria-label="Næste design">
            ›
          </button>
        </div>
      </div>
    </div>
  );
}
