import { Ph } from "@/components/Placeholder";
import { pricing } from "@/lib/erhverv/placeholder";

const n = (v: number) => v.toLocaleString("da-DK");

// Two ways to get the box, and the options on top. The standard box is the quick start: our cabinet, their
// theme on the screen and their logo on every photo. The custom design is the box printed in the place's own
// shape, which is what people remember and photograph. Same software, same functions, same service.
// The printer is an option next to the box (its own section, PrinterOffer), not the reason to buy.

const models = [
  {
    id: "standard",
    label: "Standardboksen",
    title: "Vores boks, jeres univers på skærmen.",
    text: "Et neutralt kabinet, der passer ind de fleste steder. Skærmen får jeres farver, skrift og tekster, og hvert billede får jeres logo og ramme.",
    fits: "Steder, der vil i gang hurtigt, kæder med mange adresser og jer, der vil prøve boksen af først.",
    price: (
      <>
        Fra <Ph note="pris pr. måned">{n(pricing.fromPerMonth)}</Ph> kr./md. pr. boks
      </>
    ),
  },
  {
    id: "design",
    label: "Specialdesign",
    title: "En boks, der ligner jeres sted.",
    text: "Top, sider og kabinet printes i den form, stedet kalder på: et halstørklæde, en lysmast, en figur, et biografskilt. Vi tegner og printer delene selv.",
    fits: "Steder og brands med et stærkt univers: festivaler, parker, klubber, biografer og sponsorer, der vil ses.",
    price: <>Standardprisen plus designet, som aftales</>,
  },
];

const options: [string, string, boolean?][] = [
  ["Printer", "Står ved siden af boksen, og gæsten betaler pr. print på skærmen. Lej den og behold salget, eller få den gratis, mens vi tager salget."],
  ["Flere bokse", "Fra to bokse kan I køre skattejagt og rundtur og sende gæsterne rundt på stedet."],
  ["4G", "Til steder uden wifi, hvor boksen skal hænge.", true],
];

export function Models() {
  return (
    <section id="modeller" className="section" aria-labelledby="models-title">
      <div className="wrap">
        <div className="sec-head">
          <span className="label">To måder at få boksen på</span>
          <h2 id="models-title" className="h-l">
            Standardboksen i jeres farver, eller en boks i jeres egen form.
          </h2>
          <p className="lede">Begge har de samme funktioner, det samme kontrolpanel og den samme service. Forskellen er, hvordan boksen ser ud på væggen.</p>
        </div>
        <div className="models">
          {models.map((m) => (
            <article className={`model model--${m.id}`} key={m.id} aria-labelledby={`model-${m.id}`}>
              <span className="label">{m.label}</span>
              <h3 id={`model-${m.id}`} className="h-m">
                {m.title}
              </h3>
              <p className="muted">{m.text}</p>
              <p className="model-fits">
                <b>Passer til</b>
                <span>{m.fits}</span>
              </p>
              <p className="model-price">{m.price}</p>
            </article>
          ))}
        </div>
        <div className="model-options">
          <span className="label">Tilvalg til begge</span>
          <ul>
            {options.map(([title, text, isSoon]) => (
              <li key={title}>
                <b>
                  {title}
                  {isSoon && <span className="soon">Kommer snart</span>}
                </b>
                <span className="muted">{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
