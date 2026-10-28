"use client";

import { useEffect, useRef, useState } from "react";

// A Selfi film with Danish on-screen text and a Danish voice-over. 16:9 on desktop, 4:5 on phones.
// Made from video/<film>.html (see video/README.md). Browsers only autoplay muted video, so it starts
// muted and on a loop when it scrolls into view. "Slå lyd til" plays it from the start with sound.
export function Explainer({ film = "explainer", label, title, lede, alt }: { film?: "explainer" | "erhverv"; label: string; title: string; lede: string; alt: string }) {
  const SRC = `/video/selfi-${film}`;
  const ref = useRef<HTMLVideoElement>(null);
  const [tall, setTall] = useState(false);
  const [muted, setMuted] = useState(true);

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
    if (!v) return;
    const onVolume = () => setMuted(v.muted);
    onVolume();
    v.addEventListener("volumechange", onVolume);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => v.removeEventListener("volumechange", onVolume);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          if (v.muted) v.play().catch(() => {});
        } else v.pause();
      },
      { threshold: 0.5 },
    );
    io.observe(v);
    return () => {
      io.disconnect();
      v.removeEventListener("volumechange", onVolume);
    };
  }, [fmt]);

  function withSound() {
    const v = ref.current;
    if (!v) return;
    v.muted = false;
    v.currentTime = 0;
    v.play().catch(() => {});
  }

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
            loop={muted}
            playsInline
            controls
            preload="metadata"
            aria-label={alt}
          >
            <source src={`${SRC}-${fmt}.mp4`} type={`video/mp4; codecs="avc1.640032"`} />
            <source src={`${SRC}-${fmt}.webm`} type={`video/webm; codecs="vp9"`} />
          </video>
          {muted && (
            <button type="button" className="film-sound" onClick={withSound}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" />
                <path className="wave" d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" />
              </svg>
              Slå lyd til
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
