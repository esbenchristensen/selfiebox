"use client";

import { useState } from "react";
import { BoxViewer } from "@/components/BoxViewer";
import { Ph } from "@/components/Placeholder";
import type { Venue } from "@/components/three/HaloBox";
import bars from "@/components/three/bars.json";
import venues from "@/components/three/venues.json";

// Plain JSON, so this component does not pull three.js in; BoxViewer fetches it when the box scrolls near.
const DESIGNS = [...(venues as Venue[]), ...(bars as Venue[])];
const designOf = (id: string) => DESIGNS.find((v) => v.id === id)!;

// How the box is set up for each kind of place: boxes, placement, design, activities and what the place
// gets. One tab per kind. These are examples of a setup, not customers; the first real cases replace them.

type Case = {
  id: string;
  box: string; // a design from venues.json or bars.json that shows what the box looks like for this kind of place
  name: string;
  intro: string;
  boxes: string;
  placement: string;
  design: string;
  activities: string;
  list: string;
  gain: string;
};

const cases: Case[] = [
  {
    id: "bar",
    box: "flying_hirsch",
    name: "Baren og bodegaen",
    intro: "Ét sted, én boks, og de samme gæster hver uge. Boksen skal give dem noget at samles om og jer en grund til at skrive til dem.",
    boxes: "1 boks",
    placement: "Ved baren i øjenhøjde, hvor folk venter på næste omgang og har hænderne fri.",
    design: "Kabinet i træets farve med stedets navn på toppen, så den ligner noget, der altid har hængt der.",
    activities: "Guldtid hver halve time på stille tirsdage. Titler fredag og lørdag.",
    list: "Tilbuddet til næste fredag sendes lørdag kl. 14 til dem, der har sagt ja.",
    gain: "Fredagens billeder ligger på jeres Instagram lørdag formiddag, med jeres navn på.",
  },
  {
    id: "natklub",
    box: "heidis",
    name: "Natklubben",
    intro: "Mange gæster, højt tempo og en kø, der skal holdes i gang. Boksen skal kunne ses over dansegulvet og give en grund til at blive til kl. 3.",
    boxes: "2 bokse",
    placement: "Én ved indgangen, hvor aftenen starter, og én på en søjle ved dansegulvet.",
    design: "Klubbens farver og logo. Ringen pulserer, mens ingen bruger den, og lyser hvidt, når der tages billede.",
    activities: "Konkurrence om aftenens bedste billede, vinderen henter præmien i baren. Missionen “Tag et billede med en, du ikke kender”.",
    list: "SMS torsdag eftermiddag før hver weekend. Kun til dem, der har sagt ja.",
    gain: "Hvert delt billede viser klubbens navn til venner, der ikke var med.",
  },
  {
    id: "klub",
    box: "aab",
    name: "Sportsklubben",
    intro: "Kampdag er en fest, og fansene vil vise, at de var der. Boksen giver billedet klubbens farver og dagens dato.",
    boxes: "2–3 bokse",
    placement: "Fanzonen, VIP-loungen og klubbutikken.",
    design: "Trøjens farver, klubbens mærke og et halstørklæde printet over toppen.",
    activities: "Titlen “Dagens største fan”, videohilsner til holdet før kampen, rundtur med et stempel ved hver boks.",
    list: "Fansene siger ja til nyheder om billetter og kampe.",
    gain: "Hovedsponsoren får plads i rammen på hvert billede fra kampen.",
  },
  {
    id: "hotel",
    box: "tuborg",
    name: "Hotellet",
    intro: "Gæsterne er der én nat eller én fest. Boksen giver dem et minde med hotellets navn på og jer et nummer til næste sæson.",
    boxes: "1 boks",
    placement: "I lobbyen eller i baren, hvor gæsterne mødes før middagen.",
    design: "Hotellets materialer og farver, rammen med navn og dato.",
    activities: "Videohilsner fra bryllupper og firmafester i festsalen. Titler på julefrokosterne.",
    list: "Gæsterne siger ja til nyhedsbrevet med sæsonens tilbud.",
    gain: "Billeder og videohilsner fra festerne, I må bruge, når I sælger festsalen næste gang.",
  },
  {
    id: "bio",
    box: "palads",
    name: "Biografen",
    intro: "Hver premiere er en aften, folk vil vise frem. Boksen får en ny ramme til hver film, og den ramme kan nogen betale for.",
    boxes: "1–2 bokse",
    placement: "I foyeren, mellem billetsalget og salen.",
    design: "Et biografskilt med navnet i pærer over toppen.",
    activities: "Publikum giver filmen stjerner på video på vej ud. Månedens publikumsfoto vinder fribilletter.",
    list: "Besked, når der er premiere på noget, gæsten har set trailer til.",
    gain: "Filmudlejeren betaler for premiererammen, og hvert delt billede er en reklame for filmen.",
  },
  {
    id: "festival",
    box: "smukfest",
    name: "Festivalen",
    intro: "Tusindvis af gæster på en plads, der skal bruges hele vejen rundt. Flere bokse sender publikum forbi scener og sponsorer.",
    boxes: "4–8 bokse",
    placement: "Ved indgangen, ved hver scene og hos hovedsponsoren.",
    design: "Festivalens figurer og årets farver printet på hver boks.",
    activities: "Skattejagt fra boks til boks. Videohilsner til dem, der blev hjemme. Guldtid, når et område skal fyldes.",
    list: "Publikum siger ja til besked om næste års billetsalg.",
    gain: "Publikums egne billeder og ord bliver næste års markedsføring og materiale til sponsorerne.",
  },
  {
    id: "park",
    box: "legoland",
    name: "Forlystelsesparken og zoo",
    intro: "Familier på en hel dag med mange stop. Boksene bliver en del af parkens univers og en rute gennem den.",
    boxes: "3–6 bokse",
    placement: "Ved indgangen og de attraktioner, flere skal se.",
    design: "Parkens figur eller et dyr printet som top og sider, i parkens farver.",
    activities: "Skattejagt for børnene, et stempel ved hver boks, en præmie ved udgangen.",
    list: "Besked om sæsonstart og nye forlystelser til dem, der har sagt ja.",
    gain: "Familiernes billeder med parkens figur deles samme dag, og parken har en liste til sæsonstart.",
  },
];

export function Cases() {
  const [i, setI] = useState(0);
  const c = cases[i];
  return (
    <section id="cases" className="section" aria-labelledby="cases-title">
      <div className="wrap">
        <div className="sec-head">
          <span className="label">Sådan kan det sættes op</span>
          <h2 id="cases-title" className="h-l">
            Fra bodegaen til festivalpladsen.
          </h2>
          <p className="lede">Antal bokse, placering, design og aktiviteter er forskellige fra sted til sted. Her er et eksempel på hver slags sted.</p>
        </div>
        <div className="cases">
          <div className="cases-tabs" role="tablist" aria-label="Slags steder">
            {cases.map((x, k) => (
              <button key={x.id} type="button" role="tab" id={`case-tab-${x.id}`} aria-selected={k === i} aria-controls="case-panel" onClick={() => setI(k)}>
                {x.name}
              </button>
            ))}
          </div>
          <div id="case-panel" role="tabpanel" aria-labelledby={`case-tab-${c.id}`} className="case">
            <div className="case-box hero-box">
              <BoxViewer design={{ venue: designOf(c.box) }} variant="venue" label={`Selfi i et design til ${c.name.toLowerCase()}, her ${designOf(c.box).name}`} preload={[]} />
              <span className="case-box-cap">Eksempel: {designOf(c.box).name}</span>
            </div>
            <Ph block note="eksempel på en opsætning, ikke en kunde">
              <h3 className="h-m">{c.name}</h3>
              <p className="case-intro">{c.intro}</p>
              <dl className="case-rows">
                <div>
                  <dt>Bokse</dt>
                  <dd>{c.boxes}</dd>
                </div>
                <div>
                  <dt>Placering</dt>
                  <dd>{c.placement}</dd>
                </div>
                <div>
                  <dt>Design</dt>
                  <dd>{c.design}</dd>
                </div>
                <div>
                  <dt>Aktiviteter</dt>
                  <dd>{c.activities}</dd>
                </div>
                <div>
                  <dt>Gæsteliste</dt>
                  <dd>{c.list}</dd>
                </div>
              </dl>
              <p className="case-gain">
                <b>Det får de</b>
                <span>{c.gain}</span>
              </p>
            </Ph>
          </div>
        </div>
      </div>
    </section>
  );
}
