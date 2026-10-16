"use client";

import Image from "next/image";
import { useState } from "react";

const copy = {
  privat: {
    lede: "Lej en fotoboks med lysring til brylluppet, festen eller firmafesten. Gæsterne får et ægte foto i hånden.",
    primary: { label: "Få en pris", href: "#privat" },
  },
  erhverv: {
    lede: "Fotoboksen der hænger på væggen, lyser gæsterne op og tjener penge for jer på hvert billede.",
    primary: { label: "Beregn jeres indtjening", href: "#erhverv" },
  },
} as const;

export function Hero() {
  const [mode, setMode] = useState<keyof typeof copy>("erhverv");
  const c = copy[mode];

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <div className="seg" role="group" aria-label="Vis for">
            <button aria-pressed={mode === "erhverv"} onClick={() => setMode("erhverv")}>
              Erhverv
            </button>
            <button aria-pressed={mode === "privat"} onClick={() => setMode("privat")}>
              Privat
            </button>
          </div>
          <h1 id="hero-title" className="h-xl">
            Lyset klarer resten.
          </h1>
          <p className="lede" aria-live="polite">
            {c.lede}
          </p>
          <div className="btn-row">
            <a className="btn btn-primary" href={c.primary.href}>
              {c.primary.label}
            </a>
            <a className="btn btn-secondary" href="#saadan">
              Se hvordan den virker
            </a>
          </div>
        </div>
        <div className="hero-media">
          <Image
            src="/renders/hero.jpg"
            alt="Selfi Boks med tændt lysring rundt om skærmen"
            width={1200}
            height={1500}
            priority
            sizes="(max-width: 900px) 90vw, 45vw"
          />
        </div>
      </div>
    </section>
  );
}
