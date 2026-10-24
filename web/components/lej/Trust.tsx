import { campaignWhen, discounted, kr, type RentalSettings } from "@/lib/udlejning/core";
import { company } from "@/lib/company";
import { Icon } from "./Drawings";

// Why it is safe to book with a new company. Selfi is new and has no reviews yet, so instead of stars this
// shows what we promise in the rental terms (lejebetingelser) and how the payment works. Everything here must be
// true and in the terms: no made-up numbers or quotes.
export function Trust({ s }: { s: RentalSettings }) {
  const items: { icon: Parameters<typeof Icon>[0]["name"]; title: string; text: string }[] = [
    { icon: "undo", title: "Hele lejen tilbage, hvis noget går galt", text: "Kommer boksen ikke frem, eller virker den ikke, og skyldes det ikke jer, får I alle pengene tilbage." },
    { icon: "calendar", title: "Flyt datoen gratis", text: `Indtil ${s.rules.changeDays} dage før festen kan I flytte bookingen til andre ledige datoer uden at betale noget.` },
    { icon: "truck", title: "Fragt og forsikring er med", text: "Fragt begge veje og forsikring er altid med i prisen, og der er intet depositum." },
    { icon: "card", title: "Sikker betaling", text: "I betaler med kort gennem Stripe. Vi ser aldrig jeres kortoplysninger, og I får kvittering med det samme." },
    { icon: "shield", title: "Testet, før den sendes", text: "Hver boks bliver tjekket og testet, før den bliver pakket, og vi kan se på afstand, om den kører." },
    { icon: "chat", title: "Hjælp på dagen", text: `Skriv til os i chatten eller på ${company.email}, også på selve festdagen.` },
  ];
  const c = s.campaign;
  return (
    <section id="tryg" className="section" aria-labelledby="tryg-title">
      <div className="wrap">
        <div className="sec-head">
          <span className="label">Tryg booking</span>
          <h2 id="tryg-title" className="h-l">Det kan I regne med.</h2>
          <p className="lede">
            Selfi er nyt, så vi har ingen anmeldelser at vise frem endnu. Til gengæld står alt det her i lejebetingelserne, så I ved præcis, hvad I
            får.
          </p>
        </div>
        <ul className="trust">
          {items.map((x) => (
            <li key={x.title}>
              <Icon name={x.icon} />
              <span>
                <b>{x.title}</b>
                {x.text}
              </span>
            </li>
          ))}
        </ul>
        <div className="trust-foot">
          <p>
            <Icon name="home" />
            <span>
              <b>Udviklet og bygget i Danmark</b>
              Vi har selv tegnet boksen og skrevet softwaren, og vi printer og samler den selv. Det er os, der svarer, når I skriver.
            </span>
          </p>
          {c && (
            <p>
              <Icon name="tag" />
              <span>
                <b>Vær blandt de første</b>
                Som tak giver vi {c.percent} % {c.name.toLowerCase()} på alle fester {campaignWhen(c)}, så en weekend koster {kr(discounted(s.prices.periods.weekend, c))} i stedet for {kr(s.prices.periods.weekend)}
              </span>
            </p>
          )}
        </div>
        <p className="fine">
          Læs det hele i <a href="/lejebetingelser">lejebetingelserne</a>. Efter festen beder vi alle om en ærlig anmeldelse, også når noget kunne have været bedre.
        </p>
      </div>
    </section>
  );
}
