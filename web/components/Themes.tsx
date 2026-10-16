"use client";

import { useState } from "react";
import { BoxViewer } from "./BoxViewer";
import { privateThemes } from "./three/themes";

// Private parties: names and date on the screen and in the frame of every photo, shown on the box in 3D.
export function Themes({ title, lede, layers }: { title: string; lede: string; layers: [string, string][] }) {
  const [active, setActive] = useState(privateThemes[0].id);
  const theme = privateThemes.find((t) => t.id === active) ?? privateThemes[0];

  return (
    <section id="temaer" className="section" aria-labelledby="themes-title">
      <div className="wrap themes">
        <div className="theme-media">
          <BoxViewer design={{ theme }} variant="private" label={`Selfi Boks i 3D med temaet ${theme.name}: ${theme.welcome} på skærmen og på fotoet`} />
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
            {privateThemes.map((t) => (
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
