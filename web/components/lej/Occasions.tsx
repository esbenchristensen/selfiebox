import { kr } from "@/lib/udlejning/core";

// The parties people rent a box for, in the words they search with. Each card sends them to the calendar.
const OCCASIONS: { name: string; text: string }[] = [
  { name: "Bryllup", text: "Alle gæster på billede med jeres navne og datoen. Det bliver den gæstebog, der faktisk bliver kigget i." },
  { name: "Konfirmation", text: "Konfirmanden og vennerne går i boksen igen og igen, og familien har billederne på telefonen samme aften." },
  { name: "Rund fødselsdag", text: "Fra børnebørnene til fødselaren: et tryk, en nedtælling, og alle er med." },
  { name: "Firmafest og julefrokost", text: "Kollegerne viser en side, man ikke ser til morgenmødet. Kvitteringen fra betalingen kan bruges som bilag." },
  { name: "Studenterfest", text: "Billederne fra den aften, I kommer til at tale om de næste 20 år, i godt lys og med alle på." },
  { name: "Barnedåb og jubilæum", text: "En rolig boks i hjørnet, der samler familien, mens kagen bliver skåret." },
];

export function Occasions({ from }: { from: number }) {
  return (
    <section id="anledninger" className="section" aria-labelledby="anledninger-title">
      <div className="wrap">
        <div className="sec-head">
          <span className="label">Anledninger</span>
          <h2 id="anledninger-title" className="h-l">Til den fest, I holder.</h2>
          <p className="lede">Boksen er den samme. Det er overskriften på skærmen, rammen på billedet og stemningen, der skifter.</p>
        </div>
        <ul className="occ">
          {OCCASIONS.map((o) => (
            <li key={o.name}>
              <a href="#datoer">
                <b>{o.name}</b>
                <span className="muted">{o.text}</span>
                <span className="occ-foot">
                  <span>Fra {kr(from)}</span>
                  <span className="occ-go">Se ledige datoer →</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
