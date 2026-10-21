// What the place gets out of the box: three outcomes, each with one concrete sentence, and the three
// technical facts that make the pictures usable. This is the "why" and comes right after the hero.

const outcomes = [
  {
    title: "Jeres navn på hvert billede, der bliver delt",
    text: "Rammen bærer jeres logo. Når gæsten sender billedet videre eller lægger det op, ser vennerne, hvor det er taget. Pladsen i rammen kan I også sælge til et bryggeri eller en sponsor.",
  },
  {
    title: "Gæster, der bliver lidt længere og kommer igen",
    text: "Lysringen kan ses fra den anden ende af lokalet, og titler, missioner og guldtid giver en grund til at tage ét billede til. Siger gæsten ja til tilbud, har I et nummer til næste fredag.",
  },
  {
    title: "Billeder og video til jeres kanaler, hver aften I har åbent",
    text: "Gæsterne tager billederne selv. Dem, de har sagt ja til, ligger klar i kontrolpanelet til opslag, nyhedsbrev og skærme. Ingen skal gå rundt med et kamera og spørge om lov.",
  },
];

const facts = ["12 MP-kamera med autofokus og studielys fra ringen", "Video i HD, stående til stories", "Mikrofonmodul til videohilsner som tilvalg"];

export function Outcomes() {
  return (
    <section id="faar" className="section" aria-labelledby="outcomes-title">
      <div className="wrap">
        <div className="sec-head">
          <span className="label">Det får I</span>
          <h2 id="outcomes-title" className="h-l">
            Omtale, gæster der kommer igen, og billeder I må bruge.
          </h2>
        </div>
        <div className="gains gains--3">
          {outcomes.map((o) => (
            <div className="gain" key={o.title}>
              <h3>{o.title}</h3>
              <p>{o.text}</p>
            </div>
          ))}
        </div>
        <ul className="facts" aria-label="Kamera, video og lyd">
          {facts.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
