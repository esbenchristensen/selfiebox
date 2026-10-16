import Image from "next/image";
import { activities, faq, specs } from "@/content";

export function Inside() {
  return (
    <section className="section" aria-labelledby="inside-title">
      <div className="wrap inside">
        <Image
          src="/renders/exploded.jpg"
          alt="Selfi Boks skilt ad: kabinet, LED-skinne, skærm, front og lysring"
          width={1200}
          height={1500}
          sizes="(max-width: 900px) 90vw, 50vw"
        />
        <div>
          <span className="label">Specifikationer</span>
          <h2 className="h-l" style={{ marginTop: 16 }}>
            Lille nok til væggen. Lys nok til hele baren.
          </h2>
          <p className="lede" style={{ marginTop: 20 }}>
            Kamera, skærm, lysring og printer i én boks, der kun er 6,6 cm dyb. Den hænger på væggen med tyverilås eller står på en stander og kører uden personale.
          </p>
          <div className="specs">
            {specs.map(([k, v]) => (
              <div key={k}>
                {k}
                <span>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Instax() {
  return (
    <section className="section" aria-labelledby="instax-title">
      <div className="wrap instax">
        <div>
          <span className="label">Fotoet</span>
          <h2 id="instax-title" className="h-l" style={{ marginTop: 16 }}>
            Et ægte foto i hånden.
          </h2>
          <p className="lede" style={{ marginTop: 20 }}>
            Fotomodulet under boksen printer på Instax-film. Fotoet fremkalder, mens man står og venter, og ender på køleskabet derhjemme. Rammen kan bære jeres navn og tema.
          </p>
        </div>
        <div className="prints" aria-hidden="true">
          <div className="print-card" style={{ "--r": "-6deg", left: "6%", top: "12%" } as React.CSSProperties}>
            <div className="ph p1" />
          </div>
          <div className="print-card" style={{ "--r": "4deg", left: "38%", top: "2%" } as React.CSSProperties}>
            <div className="ph p2" />
          </div>
          <div className="print-card" style={{ "--r": "-2deg", left: "24%", top: "40%" } as React.CSSProperties}>
            <div className="ph p3" />
          </div>
        </div>
      </div>
    </section>
  );
}

const ICONS: Record<string, string> = {
  titler: "M10 33 V17 L18 24 L24 13 L30 24 L38 17 V33 Z M10 38 H38",
  missioner: "M19 7 H29 A9 9 0 0 1 38 16 V32 A9 9 0 0 1 29 41 H19 A9 9 0 0 1 10 32 V16 A9 9 0 0 1 19 7 Z M18 24 l4 4 8-9",
  skattejagt: "M9 39 C15 33 13 25 21 24 S31 19 32 13 M34 7 l7 7 M41 7 l-7 7",
  rundtur: "M15 11 H33 A8 8 0 0 1 41 19 V29 A8 8 0 0 1 33 37 H15 A8 8 0 0 1 7 29 V19 A8 8 0 0 1 15 11 Z M12.5 24 a3.5 3.5 0 1 0 7 0 a3.5 3.5 0 1 0 -7 0 M20.5 24 a3.5 3.5 0 1 0 7 0 a3.5 3.5 0 1 0 -7 0 M28.5 24 a3.5 3.5 0 1 0 7 0 a3.5 3.5 0 1 0 -7 0",
  konkurrence: "M16 9 H32 V18 A8 8 0 0 1 16 18 Z M16 12 H11 A5 5 0 0 0 16 20 M32 12 H37 A5 5 0 0 1 32 20 M24 26 V33 M17 39 H31",
  guldtid: "M10 26 a14 14 0 1 0 28 0 a14 14 0 1 0 -28 0 M24 18 V26 L29 29 M20 7 H28",
};

export function Activities() {
  return (
    <section id="aktiviteter" className="section" aria-labelledby="act-title">
      <div className="wrap">
        <div className="sec-head">
          <span className="label">Aktiviteter</span>
          <h2 id="act-title" className="h-l">
            Gør aftenen til et spil.
          </h2>
          <p className="lede">Boksen kan mere end at tage billeder. Slå konkurrencer og små opgaver til, når I vil have liv i lokalet, og fra igen, når festen kører af sig selv.</p>
        </div>
        <div className="acts">
          {activities.map((a) => (
            <div className="act" key={a.id}>
              <svg viewBox="0 0 48 48" aria-hidden="true">
                <path d={ICONS[a.id]} />
              </svg>
              <div>
                <h3>{a.name}</h3>
                <p>{a.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const PRINTS = [
  ["print-bar", "Fredag · Bodegaen"],
  ["print-wedding", "Anna & Jonas · 12.6"],
  ["print-club", "Lørdag · Klubben"],
  ["print-office", "Julefrokost"],
  ["print-birthday", "Birthe 60 år"],
];

export function PhotoStrip() {
  const all = [...PRINTS, ...PRINTS, ...PRINTS.slice(0, 2)];
  const loop = [...all, ...all];
  return (
    <section className="strip" aria-label="Fotos fra Selfi Bokse">
      <div className="strip-track">
        {loop.map(([src, cap], i) => (
          <div
            key={i}
            className="print-card"
            style={{ "--r": `${(i % 2 ? 1 : -1) * (1 + (i % 3))}deg` } as React.CSSProperties}
            aria-hidden="true"
          >
            <div className="print-photo">
              <Image src={`/photos/${src}.jpg`} alt="" fill sizes="170px" style={{ objectFit: "cover" }} />
            </div>
            <span className="print-cap">{cap}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Faq() {
  return (
    <section className="section" aria-labelledby="faq-title">
      <div className="wrap">
        <div className="sec-head">
          <span className="label">Spørgsmål og svar</span>
          <h2 id="faq-title" className="h-l">
            Spørgsmål om at leje en fotoboks.
          </h2>
        </div>
        <div className="faq">
          {faq.map((f, i) => (
            <details key={f.q} open={i === 0}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
