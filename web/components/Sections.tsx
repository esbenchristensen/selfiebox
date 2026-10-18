import Image from "next/image";
import { FeatureIcon } from "./FeatureIcon";
import { activities, featureBySlug, type ActivityId, type Faq as FaqItem } from "@/content";

export function Activities({ only, title, lede }: { only?: ActivityId[]; title: string; lede: string }) {
  const shown = only ? activities.filter((a) => only.includes(a.id)) : activities;
  return (
    <section id="aktiviteter" className="section" aria-labelledby="act-title">
      <div className="wrap">
        <div className="sec-head">
          <span className="label">Aktiviteter</span>
          <h2 id="act-title" className="h-l">
            {title}
          </h2>
          <p className="lede">{lede}</p>
        </div>
        <div className="acts">
          {shown.map((a) => (
            <a className="act" key={a.id} href={`/funktioner/${a.id}`}>
              <FeatureIcon d={featureBySlug(a.id)?.icon ?? ""} />
              <div>
                <h3>{a.name}</h3>
                <p>{a.text}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

// Each pair is [photo in /photos, caption in the frame].
export function PhotoStrip({ prints }: { prints: [string, string][] }) {
  const all = [...prints, ...prints, ...prints, ...prints].slice(0, 12);
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

export function Faq({ title, items }: { title: string; items: FaqItem[] }) {
  return (
    <section id="faq" className="section" aria-labelledby="faq-title">
      <div className="wrap">
        <div className="sec-head">
          <span className="label">Spørgsmål og svar</span>
          <h2 id="faq-title" className="h-l">
            {title}
          </h2>
        </div>
        <div className="faq">
          {items.map((f, i) => (
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
