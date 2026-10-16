"use client";

import { useEffect, useRef, useState } from "react";
import { BoxViewer } from "./BoxViewer";
import { venueThemes, type BoxTheme } from "./three/themes";

function Swatches({ t }: { t: BoxTheme }) {
  return (
    <span className="swatches" aria-hidden="true">
      {[t.colors.side, t.colors.ring, t.colors.topper].map((c, i) => (
        <i key={i} style={{ background: c }} />
      ))}
    </span>
  );
}

// Venues: the whole box can be designed for the place. Pick a design and the box turns round in it.
export function ThemeStudio({ title, lede, layers }: { title: string; lede: string; layers: [string, string][] }) {
  const [active, setActive] = useState(venueThemes[0].id);
  const theme = venueThemes.find((t) => t.id === active) ?? venueThemes[0];

  return (
    <section id="temaer" className="section studio-section" aria-labelledby="studio-title">
      <div className="wrap">
        <div className="sec-head">
          <span className="label">Jeres eget design</span>
          <h2 id="studio-title" className="h-l">
            {title}
          </h2>
          <p className="lede">{lede}</p>
        </div>
        <div className="studio">
          <div className="studio-stage">
            <BoxViewer theme={theme} variant="venue" label={`Selfi Boks i 3D med designet ${theme.name}`} />
            <div className="studio-now" aria-live="polite">
              <b>{theme.name}</b>
              <span>{theme.kind}</span>
            </div>
            <span className="studio-hint">Træk for at dreje boksen</span>
          </div>
          <div className="studio-side">
            <div className="theme-picks" role="radiogroup" aria-label="Vælg et design">
              {venueThemes.map((t) => (
                <button key={t.id} role="radio" aria-checked={active === t.id} onClick={() => setActive(t.id)} className="theme-pick">
                  <Swatches t={t} />
                  <span>
                    <b>{t.name}</b>
                    <small>{t.kind}</small>
                  </span>
                </button>
              ))}
            </div>
            <div className="layers">
              {layers.map(([k, v]) => (
                <div key={k}>
                  <b>{k}</b>
                  <span>{v}</span>
                </div>
              ))}
            </div>
            <p className="fine studio-note">
              Designene er eksempler, vi har lavet for at vise, hvad et tema kan. Stederne er ikke kunder hos Selfi, og navne og farver tilhører dem.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// The hero on /erhverv: the box turns through the venue designs by itself.
export function HeroBox() {
  const [i, setI] = useState(0);
  const paused = useRef(false);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      if (!paused.current && document.visibilityState === "visible") setI((n) => (n + 1) % venueThemes.length);
    }, 4200);
    return () => clearInterval(id);
  }, []);
  const theme = venueThemes[i];
  return (
    <div
      className="hero-box"
      onPointerEnter={() => (paused.current = true)}
      onPointerLeave={() => (paused.current = false)}
    >
      <BoxViewer theme={theme} variant="venue" label={`Selfi Boks i 3D, her i et eksempel på et design til ${theme.name}`} />
      <a className="hero-box-cap" href="#temaer">
        <span className="label">Eksempel på design</span>
        <b>{theme.name}</b>
        <span className="dots" aria-hidden="true">
          {venueThemes.map((t, k) => (
            <i key={t.id} data-on={k === i} />
          ))}
        </span>
      </a>
    </div>
  );
}
