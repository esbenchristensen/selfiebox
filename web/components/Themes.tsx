"use client";

import { useState } from "react";
import { BoxViewer } from "./BoxViewer";
import { OCCASIONS } from "./three/HaloBox";

// Private parties: the box gets wings and a topper for the occasion, and a matching screen and photo
// frame. The themes are fixed designs, not made per party. Same 3D as the venues on /erhverv, with three designs made for a party.
export function Themes({ title, lede, layers }: { title: string; lede: string; layers: [string, string][] }) {
  const [active, setActive] = useState(OCCASIONS[0].id);
  const occasion = OCCASIONS.find((o) => o.id === active) ?? OCCASIONS[0];

  return (
    <section id="temaer" className="section" aria-labelledby="themes-title">
      <div className="wrap themes">
        <div className="theme-media">
          <BoxViewer design={{ venue: occasion }} variant="venue" preload={OCCASIONS} label={`Selfi Boks i 3D med temaet ${occasion.name}: ${occasion.frame.caption}`} />
        </div>
        <div className="themes-head">
          <span className="label">Temaer</span>
          <h2 id="themes-title" className="h-l" style={{ marginTop: 16 }}>
            {title}
          </h2>
          <p className="lede" style={{ marginTop: 20 }}>
            {lede}
          </p>
        </div>
        {/* Its own grid cell, so on a phone it sits right under the box it changes. */}
        <div className="themes-pick">
          <div className="seg" role="group" aria-label="Vælg tema">
            {OCCASIONS.map((o) => (
              <button key={o.id} aria-pressed={active === o.id} onClick={() => setActive(o.id)}>
                {o.name}
              </button>
            ))}
          </div>
          <p className="fine" style={{ marginTop: 12 }}>
            Temaerne er faste designs, klar til jeres fest.
          </p>
        </div>
        <div className="themes-layers">
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
