"use client";

import Image from "next/image";
import { useState } from "react";

const themes = [
  { id: "sort", name: "Sort", src: "/renders/wall.jpg", alt: "Selfi Boks i sort med fotomodul på væggen" },
  { id: "sommernat", name: "Sommernat", src: "/renders/theme.jpg", alt: "Selfi Boks i Sommernat-temaet med bakker på sider og topper" },
];

const layers = [
  ["Kassen", "Sider og topper printet i jeres farver og motiver."],
  ["Lysringen", "Farver og animation, når ingen tager billeder."],
  ["Skærmen", "Baggrund, tekster og en rulletekst med jeres budskab."],
  ["Fotoet", "Rammen på hvert foto bærer temaet."],
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
            Ét tema skifter fire ting på én gang, så boksen føles som en del af stedet eller festen.
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
