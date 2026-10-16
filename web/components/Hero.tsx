"use client";

import Image from "next/image";
import { useState } from "react";

const copy = {
  privat: {
    lede: "Lej en fotoboks med lysring til brylluppet, festen eller firmafesten. Gæsterne griner i køen og går hjem med et ægte foto i hånden.",
    primary: { label: "Book datoer", href: "#book" },
  },
  erhverv: {
    lede: "Fotoboksen der skaber stemning, samler gæsterne og sender jeres navn ud på sociale medier med hvert foto.",
    primary: { label: "Se hvad den gør for jer", href: "#erhverv" },
  },
} as const;

export function Hero() {
  const [mode, setMode] = useState<keyof typeof copy>("privat");
  const c = copy[mode];

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <div className="seg" role="group" aria-label="Vis for">
            <button aria-pressed={mode === "privat"} onClick={() => setMode("privat")}>
              Privat
            </button>
            <button aria-pressed={mode === "erhverv"} onClick={() => setMode("erhverv")}>
              Erhverv
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
