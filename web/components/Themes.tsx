"use client";

import Image from "next/image";
import { useState } from "react";

const themes = [
  { id: "sort", name: "Sort", src: "/renders/wall.jpg", alt: "Selfi Boks i sort med fotomodul på væggen" },
  { id: "sommernat", name: "Sommernat", src: "/renders/theme.jpg", alt: "Selfi Boks i Sommernat-temaet med bakker på sider og topper" },
];

const layers = [
  ["Boksen", "Sider og top printet i jeres farver og motiver."],
  ["Lysringen", "Jeres farver og animationer, når ingen tager billeder."],
  ["Skærmen", "Baggrund, velkomsttekst og en rulletekst med jeres budskab."],
  ["Fotoet", "Navne, logo eller dato i rammen på hvert billede."],
];

export function Themes() {
  const [active, setActive] = useState(themes[0].id);

  return (
    <section id="temaer" className="section" aria-labelledby="themes-title">
      <div className="wrap themes">
        <div className="theme-media">
          {themes.map((t) => (
            <Image
              key={t.id}
              src={t.src}
              alt={t.alt}
              fill
              sizes="(max-width: 900px) 90vw, 45vw"
              style={{ opacity: active === t.id ? 1 : 0 }}
            />
          ))}
        </div>
        <div>
          <span className="label">Temaer</span>
          <h2 id="themes-title" className="h-l" style={{ marginTop: 16 }}>
            Jeres boks. Jeres farver.
          </h2>
          <p className="lede" style={{ marginTop: 20 }}>
            Ét tema ændrer fire ting på én gang, så boksen ligner en del af festen eller stedet og ikke en lejet maskine.
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
