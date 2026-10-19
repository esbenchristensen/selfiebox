import type { Metadata } from "next";
import { Lilita_One } from "next/font/google";
import { Logo } from "@/components/Logo";
import { Viewer } from "@/components/katalog/Viewer";
import "@/components/katalog/katalog.css";
import "./meny.css";
import { Box3D } from "./Box3D";

// selfi.dk/erhverv/meny-fjerritslev: the sales catalogue for MENY Fjerritslev, fourteen A4 pages that print to a PDF.
// The box is shown only in the MENY design on the gen 2 unit (a market awning under the MENY arch, a stack of
// greengrocer's crates and a red shopping basket). A supermarket is not a party, so the box is not sold as a
// selfie spot by the entrance. It earns its place two ways: "Fortæl og vind", where customers say on video why
// they shop here for a chance to win their basket, and the party box that customers borrow when they order
// food for a party from the shop. No prices: they are agreed per deal. Proposal for one shop, so no index.

const partner = Lilita_One({ subsets: ["latin", "latin-ext"], weight: "400", variable: "--font-partner" });

export const metadata: Metadata = {
  title: "Selfi × MENY Fjerritslev | Salgskatalog",
  description: "Forslag til MENY Fjerritslev: Selfi Boks som en lille markedsbod, hvor kunderne fortæller, hvorfor de handler hos jer, og en festboks, der følger med festmaden hjem.",
  alternates: { canonical: "/erhverv/meny-fjerritslev" },
  robots: { index: false, follow: false },
};

const IMG = "/katalog/meny";
const PAL = { red: "#cc092f", darkred: "#8e0620", base: "#3c3c3b", cream: "#f4efe6", kraft: "#c4b9aa", wood: "#b07a45", green: "#4f8a2b", orange: "#ef7d1a", white: "#ffffff" };

const kr = (n: number) => n.toLocaleString("da-DK");

// The red and white market awning along the top of a page. Each page gets its own pattern id.
function Awning({ id }: { id: string }) {
  return (
    <div className="kat-awning" aria-hidden="true">
      <svg width="100%" height="40">
        <defs>
          <pattern id={`aw-${id}`} width="80" height="40" patternUnits="userSpaceOnUse">
            <rect width="40" height="22" fill="#cc092f" />
            <rect x="40" width="40" height="22" fill="#ffffff" />
            <circle cx="20" cy="20" r="20" fill="#cc092f" />
            <circle cx="60" cy="20" r="20" fill="#ffffff" />
          </pattern>
        </defs>
        <rect width="100%" height="40" fill={`url(#aw-${id})`} />
      </svg>
    </div>
  );
}

// A row of crates with fruit along the bottom of a page, like the stand by the entrance.
function Crates() {
  return <div className="kat-crates" aria-hidden="true" />;
}

function Lockup({ size = 34 }: { size?: number }) {
  return (
    <span className="kat-lockup" style={{ "--lk": `${size}px` } as React.CSSProperties}>
      <Logo size={size} href="/erhverv" />
      <span className="kat-times">×</span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/models/meny/logo.svg" alt="MENY" className="kat-partner-logo" />
    </span>
  );
}

function Folio({ n }: { n: number }) {
  return (
    <div className="kat-folio">
      <span>Selfi × MENY Fjerritslev</span>
      <span>{String(n).padStart(2, "0")}</span>
    </div>
  );
}

function Page({ n, cap, dark, children }: { n: number; cap: string; dark?: boolean; children: React.ReactNode }) {
  return (
    <div className="kat-slot">
      <section className={`kat-pg${dark ? " kat-pg--dark" : ""}`} aria-label={`Side ${n}, ${cap.toLowerCase()}`}>
        <Awning id={String(n)} />
        {children}
      </section>
      <div className="kat-cap">
        {String(n).padStart(2, "0")} · {cap}
      </div>
    </div>
  );
}

function Swatches({ keys }: { keys: (keyof typeof PAL)[] }) {
  return (
    <span className="kat-sw">
      {keys.map((k) => (
        <i key={k} style={{ background: PAL[k] }} />
      ))}
    </span>
  );
}

// Eight ways the box can work for MENY Fjerritslev, through the shop's year.
const CASES: { title: string; angle: string; text: string; gain: string }[] = [
  { title: "Fortæl og vind", angle: "Kampagne", text: "Kunderne fortæller på 15 sekunder, hvorfor de handler hos jer, og er med i fredagens lodtrækning om deres indkøbskurv.", gain: "Ægte anbefalinger og viden om jeres kunder" },
  { title: "Festboksen", angle: "Festmad", text: "Den, der bestiller festbuffet, konfirmationsmad eller julefrokost, kan låne boksen med hjem til festen.", gain: "Flere og større ordrer på festmad" },
  { title: "Smagsdagen", angle: "Leverandør", text: "Leverandøren står i butikken, og hvert billede får leverandørens ramme. Leverandøren betaler for rammen.", gain: "Smagsdage, der kan ses bagefter" },
  { title: "Julemanden i MENY", angle: "Højtid", text: "Børnene får et billede med julemanden og kan tage det med hjem fra kassen. Forældrene får det også på telefonen.", gain: "Familierne kommer, og bliver lidt længere" },
  { title: "Fastelavn og Halloween", angle: "Børn", text: "Udklædte børn i en ramme med årstal og MENY-logo. Billederne bliver delt i forældrenes grupper samme dag.", gain: "Hele byens børn på jeres Facebook" },
  { title: "Byfesten og klubben", angle: "Sponsorat", text: "I låner boksen ud til byfesten, håndboldklubben eller skolens sommerfest med jeres ramme på hvert billede.", gain: "Sponsorat, som folk faktisk ser" },
  { title: "Vinsmagningen", angle: "Vinmanden", text: "Gæsterne fortæller, hvilken vin de tog med hjem. De korte klip bliver til opslag om næste smagning.", gain: "Fulde hold til næste arrangement" },
  { title: "Ugens tilbud", angle: "Hverdag", text: "Når boksen står i butikken og ingen bruger den, viser skærmen ugens tilbud fra avisen.", gain: "En tilbudsskærm ved indgangen" },
];

function Case({ c }: { c: (typeof CASES)[number] }) {
  return (
    <div className="kat-case">
      <span className="kat-tag">{c.angle}</span>
      <h3>{c.title}</h3>
      <p>{c.text}</p>
      <span className="kat-gain">{c.gain}</span>
    </div>
  );
}

export default function MenyKatalog() {
  return (
    <div className={`kat kat--meny ${partner.variable}`}>
      <Viewer>
        {/* 01 FORSIDE */}
        <Page n={1} cap="Forside" dark>
          <div className="kat-top">
            <Lockup />
            <span className="kat-kicker">Forslag · 2026/27</span>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="kat-box kat-glow" src={`${IMG}/boks-meny.png`} alt="Selfi Boks som en lille markedsbod med en rød og hvid markise under MENY-buen, frugtkasser på den ene side og en rød indkøbskurv med baguette og rødvin på den anden" style={{ width: 430, marginTop: 10 }} />
          <h1 className="kat-center">Fjerritslev smiler</h1>
          <p className="kat-lede kat-center">Et udkast til MENY Fjerritslev: en lille markedsbod, der får kunderne til at fortælle, hvorfor de handler hos jer, og som følger med festmaden hjem.</p>
          <Crates />
        </Page>

        {/* 02 BREV */}
        <Page n={2} cap="Brev">
          <span className="kat-kicker">Til MENY Fjerritslev</span>
          <h2>I kender jeres kunder ved navn</h2>
          <p className="kat-lede" style={{ maxWidth: "44ch" }}>
            I en by som Fjerritslev handler folk ikke bare ind. De vælger slagteren, der ved, hvad de skal have til søndagsstegen, vinmanden, der husker, hvad de kunne lide sidst, og festmaden, der er klar, når der er konfirmation. Det er jeres forspring, men det står ingen steder, hvor de nye tilflyttere ser det. Selfi Boks er bygget som jeres egen markedsbod. Den får kunderne til at sige det højt på video, og den tager med hjem til festerne, så MENY er med på billederne, når byen fejrer noget.
          </p>
          <div className="kat-sign">
            <b>Med venlig hilsen</b>
            <span>Holdet bag Selfi</span>
          </div>
          <p className="kat-quote">Jeres bedste reklame er jeres kunder.</p>
          <span className="kat-kicker" style={{ marginTop: 32 }}>
            Det vi har bygget forslaget på
          </span>
          <div className="kat-facts" style={{ marginBottom: 110 }}>
            <div><b>Søgade 10</b><span>Midt i Fjerritslev</span></div>
            <div><b>8-20</b><span>Åbent alle ugens dage</span></div>
            <div><b>Slagter og vinmand</b><span>Rådgivning ved disken, som kæderne ikke har</span></div>
            <div><b>Mad ud af huset</b><span>Festbuffet, julefrokost og nytårsmenu</span></div>
          </div>
          <Crates />
          <Folio n={2} />
        </Page>

        {/* 03 SÅDAN VIRKER DEN */}
        <Page n={3} cap="Sådan virker den" dark>
          <span className="kat-kicker">Sådan virker den</span>
          <h2>Fra indkøbskurv til opslag</h2>
          <p className="kat-lede">Kunderne klarer det selv. Intet personale, ingen app og intet login, så kassen kan passe sig selv.</p>
          <div className="kat-screen-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="kat-screen" src="/models/meny/screen.png" alt="Boksens skærm med markisen, MENY-logoet, Fjerritslev smiler, Sig Ost og frugtkasser forneden" />
          </div>
          <div className="kat-steps kat-steps--4" style={{ marginBottom: 80 }}>
            <div><b>1</b><h3>Tryk</h3><p>Lysringen kalder. Et tryk på skærmen starter.</p></div>
            <div><b>2</b><h3>Vælg</h3><p>Et billede, eller fortæl og vind ugens kurv.</p></div>
            <div><b>3</b><h3>Sig »Ost!«</h3><p>Ringen tæller ned og giver studielys.</p></div>
            <div><b>4</b><h3>Del</h3><p>En QR-kode sender billedet til telefonen med jeres ramme.</p></div>
          </div>
          <Folio n={3} />
        </Page>

        {/* 04 DESIGNET */}
        <Page n={4} cap="Designet" dark>
          <span className="kat-kicker">Designet</span>
          <h2>Markisen, kasserne og kurven</h2>
          <p className="kat-lede">Ét design styrer fire lag, så boksen ligner en del af butikken og ikke noget, der er stillet ind ved indgangen.</p>
          <div className="kat-theme">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="kat-box kat-glow" src={`${IMG}/boks-meny.png`} alt="Selfi Boks i MENY-design" />
            <div className="kat-layers">
              <div>
                <b>Top og sider</b>
                En rød og hvid markise under MENY-buen og et skilt med »Fødevaremarked · Fjerritslev«. Frugtkasser med æbler, appelsiner, gulerødder og broccoli på den ene side og en rød indkøbskurv med baguette, rødvin og et »SMIL 0,-«-skilt på den anden. Delene er massive, så de kan tåle en travl butik.
                <Swatches keys={["red", "white", "base", "kraft", "wood", "green", "orange"]} />
              </div>
              <div>
                <b>Lysring</b>Hvid og MENY-rød, mens den venter. Studielys, når billedet tages.
                <Swatches keys={["white", "red"]} />
              </div>
              <div>
                <b>Skærm</b>Markisen, logoet, »Fjerritslev smiler« og »Sig «Ost!»« over en række frugtkasser.
              </div>
              <div>
                <b>Hvert foto og hver video</b>Jeres egen ramme, festens ramme eller leverandørens ramme på smagsdagen.
              </div>
            </div>
          </div>
          <p className="kat-fine kat-push" style={{ marginBottom: 110 }}>
            Konceptdesign udarbejdet til MENY Fjerritslev. Navn og logo bruges kun med jeres tilladelse.
          </p>
          <Crates />
          <Folio n={4} />
        </Page>

        {/* 05 I 3D */}
        <Page n={5} cap="Boksen i 3D" dark>
          <span className="kat-kicker">Boksen i 3D</span>
          <h2>Se den fra alle sider</h2>
          <p className="kat-lede">Træk i boksen for at dreje den. Markisen, kasserne og kurven er printede dele på den samme boks, så den kan få et juledesign eller festens eget design.</p>
          <div className="kat-3d-wrap">
            <Box3D poster={`${IMG}/boks-meny.png`} alt="MENY-boksen i 3D. Træk for at dreje den." />
          </div>
          <div className="kat-angles">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="kat-box" src={`${IMG}/boks-meny-skraa-venstre.png`} alt="MENY-boksen set skråt fra venstre med frugtkasserne forrest" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="kat-box" src={`${IMG}/boks-meny-skraa-hoejre.png`} alt="MENY-boksen set skråt fra højre med indkøbskurven forrest" />
          </div>
          <Folio n={5} />
        </Page>

        {/* 06 FORTÆL OG VIND */}
        <Page n={6} cap="Fortæl og vind">
          <span className="kat-kicker">Fortæl og vind</span>
          <h2>»Hvorfor handler du hos os?«</h2>
          <p className="kat-lede">Boksen spørger, og kunden svarer på 15 sekunder. Hvert svar er et lod i fredagens lodtrækning om at få indkøbskurven betalt. Præmien er grunden til, at folk stopper op, og svarene er det, I får ud af det.</p>
          <div className="kat-rec">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="kat-win-screen" src={`${IMG}/skaerm-fortael-og-vind.jpg`} alt="Boksens skærm: Fortæl os, hvorfor du handler hos os, og vind din kurv betalt. Vi trækker en vinder hver fredag" />
            <div className="kat-places">
              <div><h3>Anbefalinger til annoncer</h3><p>En nabo, der siger »slagteren her er den bedste«, sælger bedre end noget, I selv kan skrive. Klippene er klar til Facebook.</p></div>
              <div><h3>Viden om jeres kunder</h3><p>Svarene bliver skrevet ud og talt op, så I kan se, hvad der får folk til at vælge MENY frem for discountbutikkerne.</p></div>
              <div><h3>Kunder, I må skrive til</h3><p>Deltagerne skriver deres nummer og siger ja til at høre fra jer, til nyhedsbrev og app.</p></div>
              <div><h3>Fredagens vinder</h3><p>Vinderen bliver offentliggjort på jeres Facebook med sin egen video, og det giver en grund til at følge med hver uge.</p></div>
            </div>
          </div>
          <div className="kat-specs kat-push" style={{ marginBottom: 80 }}>
            <div>Længde<span>15 sekunder, I bestemmer spørgsmålet</span></div>
            <div>Samtykke<span>Kunden siger ja på skærmen, før klippet må bruges</span></div>
            <div>Præmie<span>I vælger: kurven betalt, et gavekort eller en festbuffet</span></div>
          </div>
          <Folio n={6} />
        </Page>

        {/* 07 HVAD KUNDERNE SIGER */}
        <Page n={7} cap="Hvad kunderne siger">
          <span className="kat-kicker">Kontrolpanelet</span>
          <h2>Hvad Fjerritslev siger om jer</h2>
          <p className="kat-lede">Alle svar ligger i kontrolpanelet, skrevet ud og sorteret efter emne. Så kan I se, hvad I skal blive ved med, og hvad I skal skrive om i avisen.</p>
          <div className="kat-panel">
            <div className="nav">
              <div className="tabs">
                <span className="on">Svar</span>
                <span>Klip</span>
                <span>Deltagere</span>
                <span>Rammer</span>
              </div>
              <span className="loc">MENY Fjerritslev · uge 46</span>
            </div>
            <div className="tiles tiles--4">
              <div className="tile"><span className="lab">Svar i ugen</span><span className="num">{kr(142)}</span></div>
              <div className="tile"><span className="lab">Klar til brug</span><span className="num g">{kr(97)}</span></div>
              <div className="tile"><span className="lab">Nye tilmeldte</span><span className="num">{kr(118)}</span></div>
              <div className="tile"><span className="lab">Fotos</span><span className="num">{kr(364)}</span></div>
            </div>
            <div className="card">
              <div className="row h"><span>Hvorfor de handler hos jer</span><span>Eksempel</span><span className="r">Andel</span><span className="r">Klip</span></div>
              <div className="row"><span>Slagteren</span><span className="st">»Han ved præcis, hvad jeg skal have«</span><span className="r">38 %</span><span className="r">31</span></div>
              <div className="row"><span>Personalet</span><span className="st">»De siger hej og kender os«</span><span className="r">22 %</span><span className="r">24</span></div>
              <div className="row"><span>Festmaden</span><span className="st">»Konfirmationen var bare nem«</span><span className="r">14 %</span><span className="r">12</span></div>
              <div className="row"><span>Frugt og grønt</span><span className="st">»Det er altid frisk«</span><span className="r">12 %</span><span className="r">17</span></div>
              <div className="row"><span>Vinen</span><span className="st">»Vinmanden rammer hver gang«</span><span className="r">9 %</span><span className="r">13</span></div>
            </div>
            <div className="card theme">
              <span className="lab">Ugens spørgsmål</span>
              <b>Hvorfor handler du hos os?</b>
              <span className="btn">Skift</span>
            </div>
          </div>
          <p className="kat-fine kat-push" style={{ marginBottom: 80 }}>
            Eksempel med opdigtede tal og svar. Klip vises først, når kunden har givet samtykke.
          </p>
          <Folio n={7} />
        </Page>

        {/* 08 FESTBOKSEN */}
        <Page n={8} cap="Festboksen" dark>
          <span className="kat-kicker">Festboksen</span>
          <h2>Boksen følger med festmaden hjem</h2>
          <p className="kat-lede">Det er til fester, folk tager billeder. Når en kunde bestiller festbuffet, konfirmationsmad eller julefrokost hos jer, kan de låne boksen med hjem. Det giver en grund mere til at bestille festmaden hos jer, og MENY er med på hvert billede fra festen.</p>
          <div className="kat-frames">
            <figure>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${IMG}/foto-meny.jpg`} alt="Eksempel på festrammen: et foto fra en 60-års fødselsdag med en rød og hvid markise foroven, MENY-logoet og Fjerritslev smiler forneden" />
              <figcaption>Festens ramme med jeres logo. Navn og anledning kan sættes ind.</figcaption>
            </figure>
            <div className="kat-places">
              <div><h3>Konfirmationer</h3><p>Forårets store salg af festmad, og hele familien er samlet.</p></div>
              <div><h3>Runde fødselsdage</h3><p>Billederne bliver delt i familiens grupper dagen efter.</p></div>
              <div><h3>Julefrokost og nytår</h3><p>Firmaer og vennegrupper, der bestiller menuen hos jer.</p></div>
              <div><h3>Bryllupper og guldbryllupper</h3><p>Festens navn og dato på hvert billede.</p></div>
            </div>
          </div>
          <div className="kat-steps kat-steps--3" style={{ marginBottom: 80 }}>
            <div><b>1</b><h3>Kunden bestiller</h3><p>Festmaden og boksen i samme bestilling.</p></div>
            <div><b>2</b><h3>Boksen følger med</h3><p>Hentes med maden og afleveres, når fadene kommer retur.</p></div>
            <div><b>3</b><h3>Billederne deles</h3><p>Gæsterne får dem på telefonen med jeres ramme.</p></div>
          </div>
          <Folio n={8} />
        </Page>

        {/* 09 SMAGSDAGEN */}
        <Page n={9} cap="Smagsdagen">
          <span className="kat-kicker">Smagsdagen</span>
          <h2>Leverandøren betaler for rammen</h2>
          <p className="kat-lede">Når et mejeri, et bryggeri eller en lokal producent står i butikken med smagsprøver, får hvert billede deres logo. Det er reklame, de gerne betaler for, og QR-koden på printet giver kunden ugens kupon.</p>
          <div className="kat-frames">
            <figure>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${IMG}/foto-smagsdag.jpg`} alt="Eksempel på leverandørrammen: et grønt bånd med Smagsdag, MENY-logoet, plads til leverandørens logo og en QR-kode til ugens kupon" />
              <figcaption>Leverandørrammen på en smagsdag. Leverandørens logo og kupon sættes ind.</figcaption>
            </figure>
            <figure className="kat-fig-screen">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${IMG}/skaerm-tilbud.jpg`} alt="Boksens skærm i hvile med ugens tilbud fra avisen: slagterens hakkede oksekød, vinmandens rødvin og frugt og grønt" />
              <figcaption>Når ingen tager billeder, viser skærmen ugens tilbud fra avisen.</figcaption>
            </figure>
          </div>
          <div className="kat-steps kat-steps--3 kat-steps--light" style={{ marginBottom: 80 }}>
            <div><b>1</b><h3>Leverandøren booker</h3><p>En dag eller en uge med deres ramme og kupon.</p></div>
            <div><b>2</b><h3>Vi laver rammen</h3><p>Logo og kupon skiftes fra kontrolpanelet om morgenen.</p></div>
            <div><b>3</b><h3>I får tallene</h3><p>Billeder, delinger og indløste kuponer til leverandøren.</p></div>
          </div>
          <Folio n={9} />
        </Page>

        {/* 10 CASES 1 */}
        <Page n={10} cap="Cases" dark>
          <span className="kat-kicker">Cases · 1 af 2</span>
          <h2>Otte måder at bruge boksen på</h2>
          <p className="kat-lede">Boksen står ikke bare ved indgangen. Den kommer frem, når der sker noget, og følger med ud i byen. Her er de første fire.</p>
          <div className="kat-cases" style={{ marginBottom: 80 }}>
            {CASES.slice(0, 4).map((c) => (
              <Case key={c.title} c={c} />
            ))}
          </div>
          <Crates />
          <Folio n={10} />
        </Page>

        {/* 11 CASES 2 */}
        <Page n={11} cap="Cases" dark>
          <span className="kat-kicker">Cases · 2 af 2</span>
          <h2>Og fire mere</h2>
          <p className="kat-lede">Alle cases kan kombineres, og I skifter mellem dem fra kontrolpanelet.</p>
          <div className="kat-cases" style={{ marginBottom: 80 }}>
            {CASES.slice(4).map((c) => (
              <Case key={c.title} c={c} />
            ))}
          </div>
          <Crates />
          <Folio n={11} />
        </Page>

        {/* 12 BRANDING */}
        <Page n={12} cap="Branding">
          <span className="kat-kicker">Branding</span>
          <h2>MENY på hvert opslag i byen</h2>
          <p className="kat-lede">Alt, der kommer ud af boksen, bærer jeres ramme. Når kunderne deler fra festen, smagsdagen eller fredagens lodtrækning, følger MENY med ud i deres feeds.</p>
          <div className="kat-brand">
            <div className="kat-phone" aria-label="Eksempel på et opslag på Facebook med festrammen">
              <div className="kat-phone-bar">
                <i />
                <span>
                  <b>MENY Fjerritslev</b>
                  <small>Fredagens vinder</small>
                </span>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${IMG}/foto-meny.jpg`} alt="Foto af tre glade gæster i MENY-rammen" />
              <div className="kat-phone-foot">
                <span className="kat-phone-heart">♥</span> 214 synes godt om
                <p>
                  <b>MENY Fjerritslev</b> Tillykke til Birthe, som får sin kurv betalt! Hun handler her for slagterens skyld 🥩
                </p>
              </div>
            </div>
            <ul className="kat-points">
              <li><b>Ramme på alt</b><span>Logo på hvert foto og hver video, også fra festerne.</span></li>
              <li><b>Klar til Facebook</b><span>Formater til opslag, stories og reels.</span></li>
              <li><b>Ugens vinder</b><span>Et fast opslag hver fredag, som folk venter på.</span></li>
              <li><b>Delingssiden</b><span>Siden med billedet har links til festmad, ugens avis og appen.</span></li>
              <li><b>Plads til leverandører</b><span>Et mejeri eller bryggeri kan overtage rammen på smagsdagen.</span></li>
            </ul>
          </div>
          <p className="kat-fine kat-push" style={{ marginBottom: 80 }}>Eksempel på et opslag. Navn og tal er opdigtede.</p>
          <Folio n={12} />
        </Page>

        {/* 13 OPSÆTNING */}
        <Page n={13} cap="Opsætning">
          <span className="kat-kicker">Opsætning og drift</span>
          <h2>Hvor boksen gør gavn</h2>
          <p className="kat-lede">Boksen står på en stander eller hænger på væggen, og den kan pakkes i sin kasse og sendes med festmaden. Vi passer og opdaterer den, så I kan tænke på butikken.</p>
          <div className="kat-setup2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="kat-box" src={`${IMG}/boks-meny.png`} alt="Selfi Boks i MENY-design" />
            <div className="kat-places">
              <div><h3>Ved frugt og grønt</h3><p>Under kampagnen, hvor kunderne går forbi med kurven.</p></div>
              <div><h3>Ved smagsprøverne</h3><p>Ved siden af leverandørens bord på smagsdagen.</p></div>
              <div><h3>Hjemme hos kunden</h3><p>Til festen, sammen med maden fra Mad ud af huset.</p></div>
              <div><h3>Ude i byen</h3><p>Til byfesten, i klubhuset og til skolens sommerfest.</p></div>
            </div>
          </div>
          <div className="kat-specs kat-specs--light kat-push" style={{ marginBottom: 80 }}>
            <div>Montering<span>Vægbeslag, I hænger den selv op</span></div>
            <div>Strøm<span>230 V, én almindelig stikkontakt</span></div>
            <div>Service<span>Vi skifter rammer, spørgsmål og design fra kontrolpanelet</span></div>
          </div>
          <Folio n={13} />
        </Page>

        {/* 14 BAGSIDE */}
        <Page n={14} cap="Bagside" dark>
          <span className="kat-kicker">Næste skridt</span>
          <h2>Lad os bygge jeres boks</h2>
          <p className="kat-lede">Vi gør designet og kampagnerne færdige sammen med jer og har boksen klar til den første »Fortæl og vind«.</p>
          <div className="kat-steps kat-steps--3" style={{ marginTop: 22 }}>
            <div><b>1</b><h3>Vi aftaler</h3><p>Præmie, spørgsmål, festmad og de første smagsdage.</p></div>
            <div><b>2</b><h3>Vi bygger</h3><p>Markise, kasser, kurv, skærm og rammer i jeres design.</p></div>
            <div><b>3</b><h3>I får content</h3><p>Anbefalinger, festbilleder og ugens vinder.</p></div>
          </div>
          <div className="kat-contact">
            <span className="kat-kicker">Jeres kontakt</span>
            <b>Holdet bag Selfi</b>
            <a href="/erhverv#kontakt">selfi.dk/erhverv · Book en snak</a>
          </div>
          <div className="kat-push" style={{ marginBottom: 170 }}>
            <Lockup size={40} />
          </div>
          <Crates />
          <Folio n={14} />
        </Page>
      </Viewer>
    </div>
  );
}
