import { Ph } from "./Placeholder";
import { contact } from "@/lib/erhverv/placeholder";

// Full service for every place. It answers the question every owner asks right after the price:
// "what else will this cost me in time and trouble?". The answer is shown, not claimed: our list is
// long, theirs has one line. Then each fear is named and answered with a concrete promise, and only
// promises the terms can carry (no response times, no "at once", theft agreed in the offer).
// See TEKSTSTRATEGI.md, "Tryghed".

const ours = [
  ["Nem opsætning", "Boksen kommer med vægbeslag, tyverilås og en guide på én side. I hænger den selv op på ca. 20 minutter."],
  ["Overvågning", "Boksen melder sig til os hele tiden. Driller den, får vi en alarm."],
  ["Opdateringer", "Nye funktioner og rettelser kommer af sig selv. Boksen kører kun software, vi har signeret."],
  ["Ny boks", "Går en boks i stykker, sender vi en ny. Fejl og slitage koster jer ikke noget."],
  ["Support døgnet rundt", "Ring eller skriv, også lørdag kl. 01."],
  ["Gæsternes data", "Billeder og numre opbevares i EU efter en databehandleraftale og bruges kun til det, gæsten har sagt ja til."],
] as const;

const fears = [
  {
    q: "Hvad hvis boksen går i stykker?",
    a: "Så sender vi en ny og tager den gamle retur. Fejl og almindelig slitage koster jer ikke noget. Tyveri og hærværk aftaler vi i tilbuddet, så I ved det, før I siger ja.",
  },
  {
    q: "Hvad hvis den holder op med at virke midt på aftenen?",
    a: "Boksen melder sig til os hele tiden. Går den ned, får vi en alarm og går i gang, tit før I selv har set det. Falder jeres net ud, tager den stadig billeder og sender dem, når nettet er tilbage.",
  },
  {
    q: "Hvem skal jeg ringe til?",
    a: "Til os, når som helst på døgnet. I skal ikke finde fejlen selv eller forklare noget teknisk.",
  },
  {
    q: "Skal personalet lære noget?",
    a: "Nej. Gæsterne klarer det selv, og det tekniske er vores. Vil I skifte ramme eller tekster, tager det to minutter i kontrolpanelet, eller I skriver til os.",
  },
  {
    q: "Hvad med gæsternes billeder og numre?",
    a: "I ejer dem. Vi opbevarer dem for jer efter en databehandleraftale, og boksen spørger gæsten, før et billede må bruges, og før et nummer må få tilbud. Billeder uden et ja slettes efter 30 dage.",
  },
  {
    q: "Kommer der regninger ud over den aftalte pris?",
    a: "Nej. Service, opdateringer, support og en ny boks ved fejl er med i prisen. Tilvalg som 4G og print står i tilbuddet, før I siger ja.",
  },
];

function Check() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

export function Care() {
  return (
    <section id="service" className="section care" aria-labelledby="care-title">
      <div className="wrap">
        <div className="sec-head">
          <span className="label">Fuld service</span>
          <h2 id="care-title" className="h-l">
            I betaler én fast pris. Vi tager os af resten.
          </h2>
          <p className="lede">
            Selfi er ikke endnu en ting, I skal passe. I hænger den op, og vi holder øje med den, opdaterer den og bytter den, hvis den går i stykker.
          </p>
        </div>

        <div className="care-split">
          <div className="care-card care-ours">
            <span className="label">Det klarer vi</span>
            <ul>
              {ours.map(([title, text]) => (
                <li key={title}>
                  <Check />
                  <span>
                    <b>{title}</b>
                    <span className="muted">{text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="care-card care-yours">
            <span className="label">Det klarer I</span>
            <p className="care-one">Holder åbent, som I plejer.</p>
            <p className="muted">Boksen hænges op én gang på ca. 20 minutter. Derefter er der ingen software at passe og ingen leverandør, I skal jagte.</p>
          </div>
        </div>

        <div className="care-fears">
          <h3 className="h-m">Det, I måske tænker på.</h3>
          <div className="care-fears-list">
            {fears.map((f, i) => (
              <details key={f.q} open={i === 0}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>

        <div className="care-promise">
          <p>
            <b>Fast pris. Ingen regninger ved siden af. Intet at passe.</b>
            <span className="muted">
              Går noget galt, er det vores problem, ikke jeres. Ring på{" "}
              <Ph note="telefonnummer mangler">
                <a href={contact.phoneHref}>{contact.phone}</a>
              </Ph>
              .
            </span>
          </p>
          <a className="btn btn-primary" href="#kontakt">
            Book en snak
          </a>
        </div>
      </div>
    </section>
  );
}
