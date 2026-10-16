"use client";

import { useEffect, useRef, useState } from "react";

// The explainer film: Danish on-screen text, no voice yet. 16:9 on desktop, 4:5 on phones.
// Made from video/explainer.html (see video/README.md). It plays muted when it scrolls into view.
const SRC = "/video/selfi-explainer";

export function Explainer({ label, title, lede }: { label: string; title: string; lede: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [tall, setTall] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 700px)");
    const sync = () => setTall(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const fmt = tall ? "tall" : "wide";

  // The <video> is remounted when the format changes, so it is observed again each time.
  useEffect(() => {
    const v = ref.current;
    if (!v || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.5 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [fmt]);

  return (
    <section id="film" className="section" aria-labelledby="film-title">
      <div className="wrap">
        <div className="sec-head">
          <span className="label">{label}</span>
          <h2 id="film-title" className="h-l">
            {title}
          </h2>
          <p className="lede">{lede}</p>
        </div>
        <div className="film">
          <video
            key={fmt}
            ref={ref}
            poster={`${SRC}-${fmt}.jpg`}
            muted
            playsInline
            loop
            controls
            preload="metadata"
            aria-label="Film: Sådan lejer I en fotoboks hos Selfi, fra kalenderen til billedet på telefonen"
          >
            <source src={`${SRC}-${fmt}.mp4`} type={`video/mp4; codecs="avc1.640032"`} />
            <source src={`${SRC}-${fmt}.webm`} type={`video/webm; codecs="vp9"`} />
          </video>
        </div>
      </div>
    </section>
  );
}
