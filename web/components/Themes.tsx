"use client";

import Image from "next/image";
import { useState } from "react";

// A theme with a `caption` is shown as a printed photo with that text in the frame
// (what a party gets). Without one it is a render of the whole box (what a venue gets).
export type Theme = { id: string; name: string; src: string; alt: string; caption?: string };

export function Themes({ title, lede, themes, layers }: { title: string; lede: string; themes: Theme[]; layers: [string, string][] }) {
  const [active, setActive] = useState(themes[0].id);
  const prints = themes.some((t) => t.caption);

  return (
    <section id="temaer" className="section" aria-labelledby="themes-title">
      <div className="wrap themes">
        <div className={`theme-media${prints ? " theme-media--prints" : ""}`}>
          {themes.map((t) =>
            t.caption ? (
              <div key={t.id} className="print-card theme-print" style={{ opacity: active === t.id ? 1 : 0 }} aria-hidden={active !== t.id}>
                <div className="print-photo">
                  <Image src={t.src} alt={t.alt} fill sizes="(max-width: 900px) 60vw, 30vw" style={{ objectFit: "cover" }} />
                </div>
                <span className="print-cap">{t.caption}</span>
              </div>
            ) : (
              <Image key={t.id} src={t.src} alt={t.alt} fill sizes="(max-width: 900px) 90vw, 45vw" style={{ opacity: active === t.id ? 1 : 0 }} />
            ),
          )}
        </div>
        <div>
          <span className="label">Temaer</span>
          <h2 id="themes-title" className="h-l" style={{ marginTop: 16 }}>
            {title}
          </h2>
          <p className="lede" style={{ marginTop: 20 }}>
            {lede}
          </p>
          <div className="seg" role="group" aria-label="Vælg tema" style={{ marginTop: 28 }}>
            {themes.map((t) => (
              <button key={t.id} aria-pressed={active === t.id} onClick={() => setActive(t.id)}>
                {t.name}
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
        </div>
      </div>
    </section>
  );
}
