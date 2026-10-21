import { ContentCalc } from "@/components/ContentMachine";
import { Ph } from "@/components/Placeholder";
import { contentCalc } from "@/content";
import { pricing } from "@/lib/erhverv/placeholder";

const n = (v: number) => v.toLocaleString("da-DK");

// The calculator's starting values (components/ContentMachine.tsx), so the folded summary can show the result.
const DEFAULT = { nights: 8, photos: 60, videos: 8 };
const defaultHours = Math.round((DEFAULT.nights * (DEFAULT.photos * contentCalc.minutesPerPhoto + DEFAULT.videos * contentCalc.minutesPerVideo)) / 60);

// The price, what is in it, what is extra, and the terms. Next to it: what the same pictures and clips
// would cost in staff time, so the owner can hold the two numbers against each other.
// The amount and the terms come from lib/erhverv/placeholder.ts until they are decided.

const included = [
  ["Boksen i jeres design", "Top, sider og kabinet printet til jeres sted. Skærm og fotoramme med jeres logo."],
  ["Vægbeslag og tyverilås", "Med guide på én side. I hænger den op på ca. 20 minutter."],
  ["Deling på SMS og gæsteliste", "Gæsten får billedet på SMS og kan sige ja til tilbud fra jer."],
  ["Alle aktiviteter", "Titler, missioner, konkurrence, guldtid, skattejagt og rundtur."],
  ["Kontrolpanel", "Ramme, tekster, spørgsmål og præmier skiftes på nettet. Billeder og videoer hentes samme sted."],
  ["Overvågning og opdateringer", "Boksen melder sig til os, og ny software kommer af sig selv."],
  ["Support og ny boks", "Ring døgnet rundt. Går boksen i stykker, sender vi en ny."],
] as const;

export function Pricing() {
  return (
    <section id="pris" className="section pricing" aria-labelledby="pricing-title">
      <div className="wrap">
        <div className="sec-head">
          <span className="label">Pris</span>
          <h2 id="pricing-title" className="h-l">
            Én fast pris om måneden. Alt det her er med.
          </h2>
        </div>
        <div className="pricing-grid">
          <div className="price-card">
            <span className="label">Pr. boks</span>
            <p className="price-big">
              <span className="price-from">fra</span>
              <Ph note="pris pr. måned">{n(pricing.fromPerMonth)}</Ph>
              <sup>kr./md.</sup>
            </p>
            <p className="muted">Ekskl. moms. Opstart {n(pricing.setupFee)} kr. én gang. Prisen for designet aftales, og det hele står i tilbuddet, før I siger ja.</p>
            <ul className="price-terms">
              <li>Opstart {n(pricing.setupFee)} kr.</li>
              <li>{pricing.term}</li>
              <li>Faktura hver måned, ingen regninger ved siden af</li>
            </ul>
            <a className="btn btn-primary" href="#kontakt">
              Få et tilbud til jeres sted
            </a>
          </div>
          <div className="price-incl">
            <span className="label">Med i prisen</span>
            <ul className="incl">
              {included.map(([title, text]) => (
                <li key={title}>
                  <b>{title}</b> {text}
                </li>
              ))}
            </ul>
            <span className="label" style={{ marginTop: 24, display: "block" }}>
              Tilvalg
            </span>
            <ul className="incl incl--addons">
              <li>
                <Ph note="pris på 4G er ikke besluttet">{pricing.fourG}</Ph>
              </li>
              <li>{pricing.design}</li>
              <li>{pricing.print}</li>
            </ul>
          </div>
        </div>
        <details className="pricing-calc addon-earn">
          <summary>
            <span>
              <b>Det samme lavet af en medarbejder: ca. {n(defaultHours)} timer om måneden.</b>
              <span className="muted">
                Ved {DEFAULT.nights} åbne aftener med {DEFAULT.photos} billeder og {DEFAULT.videos} klip. Sæt jeres egne tal ind.
              </span>
            </span>
          </summary>
          <ContentCalc />
        </details>
      </div>
    </section>
  );
}
