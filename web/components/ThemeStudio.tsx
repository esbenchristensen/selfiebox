"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { BoxViewer } from "./BoxViewer";
import { OutlinePoster } from "./Outline";
import venues from "./three/venues.json";

const Showroom3D = dynamic(() => import("./three/Showroom3D"), { ssr: false, loading: () => null });

const ADVANCE_MS = 6000;

// Venues: the whole box is designed for the place. Six designs on one wall; the visuals do the talking.
export function Showroom({ title, lede }: { title: string; lede: string }) {
  const [focus, setFocus] = useState(0);
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
      if (!touched.current && document.visibilityState === "visible") setFocus((f) => (f + 1) % venues.length);
    }, ADVANCE_MS);
    return () => clearInterval(id);
  }, []);

  const pick = (i: number) => {
    touched.current = true;
    setFocus((i + venues.length) % venues.length);
  };

  return (
    <section id="temaer" className="showroom" aria-labelledby="showroom-title">
      <div className="wrap showroom-head">
        <span className="label">Jeres eget design</span>
        <h2 id="showroom-title" className="h-l">
          {title}
        </h2>
        <p className="lede">{lede}</p>
      </div>
      <div ref={ref} className={`showroom-stage viewer${ready ? " is-ready" : ""}`} role="img" aria-label={`Selfi Boks i 3D med designet til ${venues[focus].name}`}>
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
        <div className="showroom-logos" role="tablist" aria-label="Designs">
          {venues.map((v, i) => (
            <button key={v.id} role="tab" aria-selected={i === focus} onClick={() => pick(i)} title={v.name} style={{ "--c": v.ring.glow, "--bg": v.palette.base } as React.CSSProperties}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/models/${v.id}/logo.svg`} alt={v.name} />
            </button>
          ))}
        </div>
        <p className="fine showroom-note">Konceptdesigns til intern brug. Stederne er ikke kunder hos Selfi, og logoer og navne tilhører dem.</p>
      </div>
    </section>
  );
}

// The hero on /erhverv: one box that turns through the venue designs by itself.
export function HeroBox() {
  const [i, setI] = useState(0);
  const paused = useRef(false);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      if (!paused.current && document.visibilityState === "visible") setI((n) => (n + 1) % venues.length);
    }, 4600);
    return () => clearInterval(id);
  }, []);
  const venue = venues[i];
  return (
    <div className="hero-box" onPointerEnter={() => (paused.current = true)} onPointerLeave={() => (paused.current = false)}>
      <BoxViewer design={{ venue }} variant="venue" label={`Selfi Boks i 3D, her med et design til ${venue.name}`} />
      <a className="hero-box-cap" href="#temaer" style={{ "--bg": venue.palette.base } as React.CSSProperties}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/models/${venue.id}/logo.svg`} alt={venue.name} />
        <span className="dots" aria-hidden="true">
          {venues.map((t, k) => (
            <i key={t.id} data-on={k === i} />
          ))}
        </span>
      </a>
    </div>
  );
}
