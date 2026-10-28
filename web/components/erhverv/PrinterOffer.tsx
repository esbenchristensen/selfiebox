import { Ph } from "@/components/Placeholder";
import { PrinterViewer } from "@/components/lej/PrinterViewer";
import { pricing, printer } from "@/lib/erhverv/placeholder";
import { PrinterCalc } from "./PrinterCalc";

const n = (v: number) => Math.round(v).toLocaleString("da-DK");
const net = printer.pricePerPrint / (1 + printer.vat);
const freeAt = Math.ceil(pricing.fromPerMonth / printer.creditPerPrint);

// The printer next to the box: the two ways to have it (rent it and keep the sales, or Print-kredit: free with a box,
// Selfi keeps the sales and the place gets a fixed amount per print off the box's bill), what it earns with the owner's own numbers, and ideas that sell prints, each with its sum.
// Prices come from lib/erhverv/placeholder.ts.

type Idea = { title: string; text: string; sum: string; prints: number };

const ideas: Idea[] = [
  {
    title: "Stedets fotobog",
    text: "Gæsten køber to print: ét til lommen og ét til jeres fotobog med en hilsen skrevet på. Bogen ligger på baren, og folk kommer igen for at finde sig selv.",
    sum: "10 selskaber × 2 print × 8 aftener",
    prints: 160,
  },
  {
    title: "Aftenens bedste billede",
    text: "Hvert print er en kupon i aftenens konkurrence. Printene hænger på en væg, og ved midnat vælger baren det bedste. Vinderen får et bord eller en flaske næste gang.",
    sum: "25 print × 4 lørdage",
    prints: 100,
  },
  {
    title: "Missioner med bevis",
    text: "Boksen giver holdet en mission: seks på ét billede, den skæveste pyramide. Printet er beviset og kommer op på Hall of Fame. Månedens hold får en omgang.",
    sum: "15 print × 8 aftener",
    prints: 120,
  },
  {
    title: "Med i pakken",
    text: "Læg et print i prisen på julefrokost, polterabend og fødselsdag. Hver gæst går hjem med et billede fra aftenen, og I tjener på hvert ét.",
    sum: "4 selskaber × 40 gæster",
    prints: 160,
  },
  {
    title: "Samlekort efter kampen",
    text: "Fans tager billedet med maskotten eller pokalen, og printet bliver et samlekort fra kampen. Børnene vil have et til hver kamp.",
    sum: "60 print × 2 hjemmekampe",
    prints: 120,
  },
  {
    title: "Festivalens minde",
    text: "Et print fra festivalen er det, folk tager med hjem fra pladsen. Ved en scene eller i et partnerområde er der kø hele dagen.",
    sum: "150 print × 4 dage",
    prints: 600,
  },
];

export function PrinterOffer() {
  return (
    <section id="printer" className="section pr" aria-labelledby="pr-title">
      <div className="wrap">
        <div className="sec-head">
          <span className="label">Printer</span>
          <h2 id="pr-title" className="h-l">
            Få en printer med. Den kan tjene boksen hjem.
          </h2>
          <p className="lede">
            Gæsterne betaler gerne for et billede, de kan tage med hjem. Printeren står ved siden af boksen eller hænger på væggen, låst og skruet fast. Gæsten betaler på boksens skærm, og printet ligger i lommen få sekunder efter.
          </p>
        </div>
        <div className="pr-top">
          <div className="pr-viewer">
            <PrinterViewer variant="erhverv" />
          </div>
          <div className="pr-offers">
            <div className="pr-offer">
              <span className="label">Lej printeren</span>
              <p className="pr-price">
                <span className="price-from">fra</span>
                <Ph note="printerpris">{n(printer.fromPerMonth)}</Ph>
                <sup>kr./md.</sup>
              </p>
              <p className="muted">
                I sætter prisen og beholder hele salget. Sælger I et print til {n(printer.pricePerPrint)} kr., er det {n(net)} kr. ekskl. moms til jer, og papiret koster ca. {n(printer.paperPerPrint)} kr.
              </p>
            </div>
            <div className="pr-offer">
              <span className="label">Print-kredit</span>
              <p className="pr-price">
                0<sup>kr./md.</sup>
              </p>
              <p className="muted">
                Har I en boks, får I printeren med uden at betale for den. Vi sætter prisen, fylder papir på og tager salget, og I får {n(printer.creditPerPrint)} kr. for hvert solgt print trukket fra regningen for boksen. Ved {n(freeAt)} print om måneden er boksen gratis.
              </p>
            </div>
          </div>
        </div>
        <div className="pr-calc-wrap">
          <div className="pr-calc-head">
            <h3>Regn på jeres eget sted.</h3>
            <p className="muted">
              Et print sælger typisk for {n(printer.pricePerPrint)} kr. Sæt jeres aftener og et realistisk antal print ind, så kan I se, om printeren betaler både sig selv og boksen. Sælger I færre print end det, den koster, er Print-kredit det bedste valg.
            </p>
          </div>
          <PrinterCalc />
        </div>
        <h3 className="pr-ideas-title">Sådan sælger I flere print.</h3>
        <ul className="pr-ideas">
          {ideas.map((i) => (
            <li key={i.title}>
              <h4>{i.title}</h4>
              <p>{i.text}</p>
              <p className="pr-sum">
                <span>
                  {i.sum} = {n(i.prints)} print
                </span>
                <b>≈ {n(i.prints * net)} kr. ekskl. moms</b>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
