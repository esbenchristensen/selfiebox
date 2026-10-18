// Full service for every place. It answers the question every owner asks after the design:
// "what else will this cost me in time and trouble?". The answer is shown,
// not claimed: our list is long, theirs has one line. Then each fear is named and answered
// with a concrete promise. See TEKSTSTRATEGI.md, "Tryghed".

const ours = [
  ["Montering", "Vi hænger boksen op, tilslutter og tester den."],
  ["Overvågning", "Boksen melder sig til os hele tiden. Driller den, får vi en alarm."],
  ["Opdateringer", "Nye funktioner og rettelser kommer af sig selv."],
  ["Ny boks", "Går en boks i stykker, sender vi en ny med det samme."],
  ["Support døgnet rundt", "Ring eller skriv, også lørdag kl. 01."],
  ["Gæsternes data", "Billeder og numre opbevares sikkert og bruges kun med samtykke."],
] as const;

const fears = [
  {
    q: "Hvad hvis boksen går i stykker?",
    a: "Så sender vi en ny med det samme og tager den gamle med retur. I betaler ikke for reparation eller ny boks.",
  },
  {
    q: "Hvad hvis den holder op med at virke midt på aftenen?",
    a: "Boksen melder sig til os hele tiden. Går den ned, får vi en alarm og går i gang, ofte før I selv har set det.",
  },
  {
    q: "Hvem skal jeg ringe til?",
    a: "Til os, når som helst på døgnet. I skal ikke selv finde fejlen eller forklare noget teknisk.",
  },
  {
    q: "Skal personalet lære noget?",
    a: "Nej. Gæsterne klarer det selv, og alt det tekniske er vores. Vil I ændre tema eller tekster, gør vi det for jer, eller I gør det selv i kontrolpanelet.",
  },
  {
    q: "Hvad med gæsternes billeder og numre?",
    a: "Boksen kører kun software, vi har signeret, og billeder og numre opbevares sikkert. Telefonnumre bruges kun til tilbud, hvis gæsten selv har sagt ja, så I holder jer inden for reglerne.",
  },
  {
    q: "Kommer der regninger ud over den aftalte pris?",
    a: "Nej. Service, opdateringer, support og en ny boks, hvis noget går galt, er med i den pris, vi aftaler.",
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
            Selfi Boks er ikke endnu en ting, I skal passe. Det er en service, vi leverer. Vi monterer den, holder øje med den, opdaterer den og bytter den, hvis noget går galt.
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
            <p className="muted">Der er ingen manual, ingen opsætning og ingen leverandør, I skal jagte. Boksen er klar, når I åbner.</p>
          </div>
        </div>

        <div className="care-fears">
          <h3 className="h-m">Det, I måske tænker på.</h3>
          <dl>
            {fears.map((f) => (
              <div key={f.q}>
                <dt>{f.q}</dt>
                <dd>{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="care-promise">
          <p>
            <b>Fast pris. Ingen regninger ved siden af. Ingen ting at passe.</b>
            <span className="muted">Hvis noget går galt, er det vores problem, ikke jeres.</span>
          </p>
          <a className="btn btn-primary" href="#kontakt">
            Book en uforpligtende snak
          </a>
        </div>
      </div>
    </section>
  );
}
