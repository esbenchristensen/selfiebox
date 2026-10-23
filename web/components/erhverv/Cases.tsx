"use client";

import { useState } from "react";
import { BoxViewer } from "@/components/BoxViewer";
import { Ph } from "@/components/Placeholder";
import type { Venue } from "@/components/three/HaloBox";
import bars from "@/components/three/bars.json";
import venues from "@/components/three/venues.json";
import { goalById, type GoalId } from "@/lib/erhverv/value";

// Plain JSON, so this component does not pull three.js in; BoxViewer fetches it when the box scrolls near.
const DESIGNS = [...(venues as Venue[]), ...(bars as Venue[])];
const designOf = (id: string) => DESIGNS.find((v) => v.id === id)!;

// The industries, each seen from the buyer: who decides, what they want (the goals from lib/erhverv/value.ts),
// their own story, and how the box is set up for them: standard box or custom design, how many, where and
// with which functions. One tab per kind of place. These are examples of a setup, not customers; the first
// real cases replace them.

type Case = {
  id: string;
  box: string; // a design from venues.json or bars.json that shows what the box looks like for this kind of place
  name: string;
  intro: string;
  buyer: string;
  goals: GoalId[];
  story: string;
  model: string;
  boxes: string;
  placement: string;
  functions: string;
  gain: string;
};

const cases: Case[] = [
  {
    id: "bar",
    box: "flying_hirsch",
    name: "Baren og bodegaen",
    intro: "Ét sted, én boks og de samme gæster hver uge. Boksen skal give dem noget at samles om og jer en grund til at skrive til dem.",
    buyer: "Ejeren, ofte sammen med en partner",
    goals: ["gaester", "omsaetning", "sjov"],
    story: "Jeg vil have fredagens gæster tilbage næste fredag, og en tirsdag, der ikke er død.",
    model: "Standardboksen i stedets farver, eller et kabinet i træets farve med navnet på toppen.",
    boxes: "1 boks",
    placement: "Ved baren i øjenhøjde, hvor folk venter på næste omgang og har hænderne fri.",
    functions: "Gæsteliste og SMS lørdag kl. 14. Guldtid hver halve time på stille tirsdage, med præmien i baren. Titler fredag og lørdag.",
    gain: "En liste over stamgæster, I må skrive til, og fredagens billeder på jeres Instagram lørdag formiddag.",
  },
  {
    id: "natklub",
    box: "heidis",
    name: "Natklubben",
    intro: "Mange gæster, højt tempo og en kø, der skal holdes i gang. Boksen skal kunne ses over dansegulvet og give en grund til at blive til kl. 3.",
    buyer: "Ejeren eller marketingchefen",
    goals: ["branding", "gaester", "omsaetning"],
    story: "Vi vil være klubben, folk lægger billeder op fra, og vi vil kunne skrive til dem torsdag før weekenden.",
    model: "Specialdesign i klubbens farver og logo. Ringen pulserer, mens ingen bruger den.",
    boxes: "2 bokse",
    placement: "Én ved indgangen, hvor aftenen starter, og én på en søjle ved dansegulvet.",
    functions: "Konkurrence om aftenens bedste billede med præmie i baren. Missionen “Tag et billede med en, du ikke kender”. Gæsteliste.",
    gain: "Hvert delt billede viser klubbens navn til venner, der ikke var med, og listen fylder torsdagens SMS.",
  },
  {
    id: "festival",
    box: "smukfest",
    name: "Festivalen",
    intro: "Tusindvis af gæster på en plads, der skal bruges hele vejen rundt. Flere bokse sender publikum forbi scener, boder og sponsorer.",
    buyer: "Marketing- og partnerchefen",
    goals: ["sponsor", "indhold", "sjov"],
    story: "Jeg skal give vores sponsorer mere for pengene og have materiale til næste års billetsalg.",
    model: "Specialdesign: festivalens figurer og årets farver på hver boks, og én i hovedsponsorens design.",
    boxes: "4–8 bokse",
    placement: "Ved indgangen, ved hver scene og hos hovedsponsoren.",
    functions: "Skattejagt fra boks til boks, videohilsner til dem, der blev hjemme, sponsorlogo i rammen og guldtid, når et område skal fyldes.",
    gain: "Publikums egne billeder og ord til næste års markedsføring, og en sponsorpakke, I ikke havde sidste år.",
  },
  {
    id: "park",
    box: "faarup",
    name: "Forlystelsesparken og zoo",
    intro: "Familier på en hel dag med mange stop. Boksene bliver en del af parkens univers og en rute gennem den.",
    buyer: "Marketingchefen eller oplevelseschefen",
    goals: ["sjov", "branding", "omsaetning"],
    story: "Børnene skal have en grund til at gå hele parken rundt, og familien skal tage parken med hjem på telefonen.",
    model: "Specialdesign: parkens figur eller et dyr printet som top og sider, i parkens farver.",
    boxes: "3–6 bokse",
    placement: "Ved indgangen, ved de attraktioner, flere skal se, og ved kiosken.",
    functions: "Skattejagt for børnene med et stempel ved hver boks og præmien ved udgangen. Titler med parkens figur på billedet.",
    gain: "Familiernes billeder med parkens figur deles samme dag, og ruten sender dem forbi de steder, I gerne vil vise frem.",
  },
  {
    id: "bio",
    box: "palads",
    name: "Biografen og teatret",
    intro: "Hver premiere er en aften, folk vil vise frem. Boksen får en ny ramme til hver film, og den ramme kan nogen betale for.",
    buyer: "Biografchefen eller marketing i kæden",
    goals: ["sponsor", "indhold", "branding"],
    story: "Jeg vil have premieren til at fylde mere på sociale medier og have noget at tilbyde filmudlejerne.",
    model: "Specialdesign: et biografskilt med navnet i pærer over toppen. Standardboksen i resten af kæden.",
    boxes: "1–2 bokse",
    placement: "I foyeren, mellem billetsalget og salen.",
    functions: "Publikum giver filmen stjerner på video på vej ud. Premiereramme fra filmudlejeren. Månedens publikumsfoto vinder fribilletter.",
    gain: "Filmudlejeren betaler for premiererammen, og publikums anmeldelser på video bliver jeres reklame.",
  },
  {
    id: "klub",
    box: "aab",
    name: "Sportsklubben",
    intro: "Kampdag er en fest, og fansene vil vise, at de var der. Boksen giver billedet klubbens farver og dagens dato.",
    buyer: "Kommerciel chef eller sponsoransvarlig",
    goals: ["sponsor", "gaester", "indhold"],
    story: "Jeg skal have noget nyt at sælge til hovedsponsoren, og vi skal kende de fans, der kommer.",
    model: "Specialdesign: trøjens farver, klubbens mærke og et halstørklæde printet over toppen.",
    boxes: "2–3 bokse",
    placement: "Fanzonen, VIP-loungen og klubbutikken.",
    functions: "Titlen “Dagens største fan”, videohilsner til holdet, rundtur med stempel ved hver boks, gæsteliste til billetnyt.",
    gain: "Hovedsponsoren får plads i rammen på hvert billede fra kampen, og klubben en liste over fans, der vil høre om billetter.",
  },
  {
    id: "hotel",
    box: "tuborg",
    name: "Hotellet og festsalen",
    intro: "Gæsterne er der én nat eller én fest. Boksen giver dem et minde med hotellets navn på og jer materiale, når festsalen skal sælges igen.",
    buyer: "Direktøren eller salgs- og eventchefen",
    goals: ["indhold", "sjov", "gaester"],
    story: "Jeg vil vise kommende brudepar og firmaer, hvordan en fest hos os ser ud, med rigtige billeder.",
    model: "Standardboksen i hotellets farver eller i hotellets materialer. Printeren som tilvalg til fester.",
    boxes: "1 boks",
    placement: "I lobbyen eller i baren, hvor gæsterne mødes før middagen, og i festsalen, når der er fest.",
    functions: "Videohilsner fra bryllupper og firmafester. Titler på julefrokosterne. Ja til nyhedsbrevet med sæsonens tilbud.",
    gain: "Billeder og hilsner fra festerne, I må bruge, når I sælger festsalen næste gang.",
  },
  {
    id: "brand",
    box: "carlsberg",
    name: "Bryggeriet og brandet",
    intro: "Mærket skal ses der, hvor det bliver drukket. En boks i brandets design hos barerne i jeres netværk gør hvert billede til en eksponering.",
    buyer: "Brand manager eller trade marketing",
    goals: ["branding", "sponsor", "sjov"],
    story: "Jeg vil have vores mærke på billederne fra de barer, der skænker vores øl, og give barerne en grund til at vælge os.",
    model: "Specialdesign i brandets form og farver, med både jeres og barens navn i rammen.",
    boxes: "5–30 bokse, én pr. bar",
    placement: "Hos barerne i jeres aftaler, ved baren, hvor jeres produkt står.",
    functions: "Guldtid, hvor næste billede vinder en af jeres øl. Logo i rammen. Konkurrence på tværs af aftenen.",
    gain: "Jeres mærke på hvert delt billede fra barerne, og noget, barerne får med i aftalen med jer.",
  },
  {
    id: "event",
    box: "red_bull",
    name: "Firmafest, messe og event",
    intro: "Én dag eller en kampagne, mange mennesker og et behov for, at de stopper op. Boksen giver standen noget at samles om.",
    buyer: "Eventansvarlig eller marketing",
    goals: ["sjov", "gaester", "branding"],
    story: "Jeg vil have folk til at stoppe ved standen og gå derfra med et billede med vores logo, og vide, hvem der vil høre mere.",
    model: "Standardboksen med kampagnens tema, eller et kabinet i produktets form til større kampagner.",
    boxes: "1–3 bokse, også til kortere perioder (aftales)",
    placement: "På standen, ved indgangen til festen eller ved produktet, I lancerer.",
    functions: "Logo og kampagne i rammen. Ja til at høre mere, når gæsten skriver sit nummer. Printeren som tilvalg, så gæsterne har noget i hånden.",
    gain: "Kontakter, der selv har sagt ja, og billeder med jeres logo på telefonerne hos dem, der var der.",
  },
];

export function Cases() {
  const [i, setI] = useState(0);
  const c = cases[i];
  return (
    <section id="cases" className="section" aria-labelledby="cases-title">
      <div className="wrap">
        <div className="sec-head">
          <span className="label">Brancher</span>
          <h2 id="cases-title" className="h-l">
            Hvem køber, hvad de vil, og hvordan boksen sættes op.
          </h2>
          <p className="lede">En bar vil have stamgæster tilbage, en festival vil sælge mere til sponsorerne, et bryggeri vil ses. Vælg jeres slags sted og se, hvordan det kan se ud.</p>
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
            {/* Its own column: with placeholders hidden, Ph renders nothing, so the grid needs a real wrapper. */}
            <div className="case-body">
              <Ph block note="eksempel på en opsætning, ikke en kunde">
                <h3 className="h-m">{c.name}</h3>
                <p className="case-intro">{c.intro}</p>
                <ul className="case-goals" aria-label="Det vil de opnå">
                  {c.goals.map((g) => (
                    <li key={g}>
                      <a href="#maal">{goalById(g).short}</a>
                    </li>
                  ))}
                </ul>
                <blockquote className="case-story">
                  <p>“{c.story}”</p>
                  <cite>{c.buyer}</cite>
                </blockquote>
                <dl className="case-rows">
                  <div>
                    <dt>Boksen</dt>
                    <dd>{c.model}</dd>
                  </div>
                  <div>
                    <dt>Antal</dt>
                    <dd>{c.boxes}</dd>
                  </div>
                  <div>
                    <dt>Placering</dt>
                    <dd>{c.placement}</dd>
                  </div>
                  <div>
                    <dt>Funktioner</dt>
                    <dd>{c.functions}</dd>
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
      </div>
    </section>
  );
}
