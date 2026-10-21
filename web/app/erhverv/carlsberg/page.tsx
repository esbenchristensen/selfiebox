import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { Logo } from "@/components/Logo";
import { Viewer } from "@/components/katalog/Viewer";
import "@/components/katalog/katalog.css";
import "./carlsberg.css";
import { Box3D } from "./Box3D";

// selfi.dk/erhverv/carlsberg: the sales catalogue for Carlsberg, fifteen A4 pages that print to a PDF. The case is a
// brand box: Carlsberg pays for a box in a bar, the bar gets it in Carlsberg's design, and Carlsberg and the bar are on
// every photo. The box is shown only in the Carlsberg design on the gen 2 unit (the Elephant Gate on top, a hop bine
// and a bottle on the sides). The ideas that sell it to a brewery: the bar frame with both names, campaigns that
// change in every bar at once, content from guests with consent, responsible marketing built in, and one panel for
// every bar. No prices: they are agreed per deal. It stays out of search and the sitemap.

const partner = Outfit({ subsets: ["latin", "latin-ext"], weight: ["600", "800"], variable: "--font-partner" });

export const metadata: Metadata = {
  title: "Selfi × Carlsberg | Salgskatalog",
  description: "Forslag til Carlsberg: en Selfi Boks i Carlsbergs grønne design med ordmærket, kronen og humlebladet i barerne, hvor Carlsberg og baren står på hvert foto, med kampagnerammer, content og ét kontrolpanel til alle barer.",
  alternates: { canonical: "/erhverv/carlsberg" },
  robots: { index: false, follow: false },
};

const IMG = "/katalog/carlsberg";
const PAL = { green: "#00703c", deep: "#004d29", bottle: "#2c9a46", white: "#ffffff" };
const kr = (n: number) => n.toLocaleString("da-DK");

// The label's gold rule along the top of a page.
function Rule() {
  return <div className="kat-rule" aria-hidden="true" />;
}

// A band of hop green and gold along the bottom of a page.
function Band({ height = 24 }: { height?: number }) {
  return <div className="kat-band" aria-hidden="true" style={{ height }} />;
}

function Lockup({ size = 34 }: { size?: number }) {
  return (
    <span className="kat-lockup" style={{ "--lk": `${size}px` } as React.CSSProperties}>
      <Logo size={size} href="/erhverv" />
      <span className="kat-times">×</span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/models/carlsberg/logo.svg" alt="Carlsberg" className="kat-partner-logo" />
    </span>
  );
}

function Folio({ n }: { n: number }) {
  return (
    <div className="kat-folio">
      <span>Selfi × Carlsberg</span>
      <span>{String(n).padStart(2, "0")}</span>
    </div>
  );
}

function Page({ n, cap, dark, children }: { n: number; cap: string; dark?: boolean; children: React.ReactNode }) {
  return (
    <div className="kat-slot">
      <section className={`kat-pg${dark ? " kat-pg--dark" : ""}`} aria-label={`Side ${n}, ${cap.toLowerCase()}`}>
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

// Ten ways a brand box works in a bar, from an ordinary Friday to a national launch.
const CASES: { title: string; angle: string; text: string; gain: string }[] = [
  { title: "Barens egen ramme", angle: "Hver aften", text: "Hver bar får sit navn ved siden af Carlsberg på rammen, med dato og by. Gæsterne deler et minde fra deres stambar, og Carlsberg er med på billedet.", gain: "Logoet på tusindvis af billeder om ugen" },
  { title: "Kampaftenen", angle: "Sport", text: "Når der er stor kamp på skærmen, skifter alle bokse til kampens ramme med holdene og resultatet efter slutfløjtet.", gain: "Carlsberg i centrum, når baren er fyldt" },
  { title: "Lanceringen", angle: "Nyheder", text: "En ny øl eller en alkoholfri nyhed får sin egen ramme og skærm i alle barer samme dag. Skærmen fortæller, hvor den kan smages.", gain: "En landsdækkende lancering uden nye skilte" },
  { title: "Spørg gæsterne", angle: "Video", text: "Boksen stiller et spørgsmål som »Hvad skåler I for i aften?«. Svarene bliver korte videoer, som Carlsberg og baren må bruge med samtykke.", gain: "Ægte stemmer til jeres kampagner" },
  { title: "Quiz og musik", angle: "Events", text: "Til quizaftener, koncerter og DJ-aftener får rammen aftenens navn, og boksen viser vinderholdet bagefter.", gain: "Flere grunde til at komme en hverdag" },
  { title: "Terrassesæsonen", angle: "Sommer", text: "Fra første solskinsdag hænger boksen ved terrassen med en sommerramme. Lysringen kan ses fra gaden.", gain: "Carlsberg på sommerens billeder" },
  { title: "Julefrokosterne", angle: "Vinter", text: "I november og december er barerne fulde af firmaer. Rammen får firmaets navn, og billederne bliver delt internt dagen efter.", gain: "Carlsberg i tusind firmafester" },
  { title: "Byens bedste bar", angle: "Konkurrence", text: "Barerne dyster om flest delte billeder på en måned. Vinderen får en fest fra Carlsberg, og kåringen bliver content i sig selv.", gain: "Barerne bruger boksen aktivt" },
  { title: "Hofleverandøren", angle: "Brand", text: "Til særlige aftener får rammen kronen og »Leverandør til det kongelige danske hof«, så kvaliteten står på billedet.", gain: "Brandets kendetegn på gæsternes billeder" },
  { title: "Sampling og events", angle: "Trade", text: "Til smagninger, messer og bryggeriets egne arrangementer kan boksen flyttes med, og rammen viser dagens program.", gain: "Den samme boks fra baren til eventet" },
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

export default function CarlsbergKatalog() {
  return (
    <div className={`kat kat--carlsberg ${partner.variable}`}>
      <Viewer>
        {/* 01 FORSIDE */}
        <Page n={1} cap="Forside" dark>
          <Rule />
          <div className="kat-top">
            <Lockup />
            <span className="kat-kicker">Forslag · 2026/27</span>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="kat-box kat-glow" src={`${IMG}/boks-carlsberg.png`} alt="Selfi Boks med det hvide Carlsberg-ordmærke og kronen på en grøn top, humlebladet på den ene side og en grøn Carlsberg-flaske på den anden" style={{ width: 460, marginTop: 4 }} />
          <h1 className="kat-center">Carlsberg på hvert foto</h1>
          <p className="kat-lede kat-center">Et udkast til Carlsberg: en fotoboks i jeres design i barerne, der tager billeder og videoer af gæsterne og sætter Carlsberg og baren på alt, der deles.</p>
          <Band />
        </Page>

        {/* 02 BREV */}
        <Page n={2} cap="Brev">
          <span className="kat-kicker">Til Carlsberg Danmark</span>
          <h2>Fredag aften i tusind barer</h2>
          <p className="kat-lede" style={{ maxWidth: "44ch" }}>
            Hver fredag tager gæsterne i jeres barer tusindvis af billeder. Der står Carlsberg på fadølsanlægget og parasollen, men ikke på billederne, der bliver delt. Selfi Boks er bygget i jeres design med ordmærket, kronen, humlebladet og flasken. I betaler boksen til baren, baren får en fotoboks i jeres univers, og Carlsberg og barens navn kommer på hvert eneste billede og hver video.
          </p>
          <div className="kat-sign">
            <b>Skål</b>
            <span>Holdet bag Selfi</span>
          </div>
          <p className="kat-quote">Probably the best photo in town.</p>
          <span className="kat-kicker" style={{ marginTop: 22 }}>
            Det vi har bygget forslaget på
          </span>
          <div className="kat-facts" style={{ marginBottom: 90 }}>
            <div><b>Siden 1847</b><span>J.C. Jacobsens bryggeri og leverandør til det kongelige danske hof</span></div>
            <div><b>Barerne</b><span>Værtshuse, cafeer, natklubber og sportsbarer, hvor Carlsberg allerede er på hanen</span></div>
            <div><b>Brandet</b><span>Det hvide ordmærke på grønt, kronen, humlebladet og »Probably the best beer in the world«</span></div>
            <div><b>Behovet</b><span>Synlighed, hvor gæsterne er, og content, der ikke ligner reklame</span></div>
          </div>
          <Band height={18} />
          <Folio n={2} />
        </Page>

        {/* 03 MODELLEN */}
        <Page n={3} cap="Modellen" dark>
          <Rule />
          <span className="kat-kicker">Modellen</span>
          <h2>Én boks, tre vindere</h2>
          <p className="kat-lede">Carlsberg betaler en boks til en bar. Baren hænger den op, og gæsterne bruger den hele aftenen. Alle får noget ud af det.</p>
          <div className="kat-steps kat-steps--3" style={{ marginTop: 10 }}>
            <div><b>1</b><h3>Carlsberg</h3><p>Logoet på hvert foto og hver video, kampagner i alle barer på én gang og tal på, hvad det giver.</p></div>
            <div><b>2</b><h3>Baren</h3><p>En fotoboks gratis, sit eget navn på rammen og billeder af gæsterne til sin egen SoMe.</p></div>
            <div><b>3</b><h3>Gæsterne</h3><p>Et godt billede fra aftenen, sendt til telefonen og klar til at dele med vennerne.</p></div>
          </div>
          <ul className="kat-points kat-points--dark" style={{ marginTop: 14, marginBottom: 80 }}>
            <li><b>Fast plads i baren</b><span>Boksen hænger på væggen året rundt, ikke kun en kampagneuge.</span></li>
            <li><b>Ægte rækkevidde</b><span>Hvert billede deles af gæsten selv til venner, der ligner gæsten.</span></li>
            <li><b>Mere værdi i aftalen</b><span>En konkret ting, I kan give barerne i jeres samarbejde.</span></li>
            <li><b>Én leverandør</b><span>Vi bygger, passer og opdaterer alle bokse. I styrer det hele fra ét panel.</span></li>
          </ul>
          <Folio n={3} />
        </Page>

        {/* 04 SÅDAN VIRKER DEN */}
        <Page n={4} cap="Sådan virker den" dark>
          <Rule />
          <span className="kat-kicker">Sådan virker den</span>
          <h2>Fire trin fra skål til opslag</h2>
          <p className="kat-lede">Gæsterne klarer det selv. Intet personale, ingen app og intet login. Det virker også, når baren er fuld og lyset er dæmpet.</p>
          <div className="kat-screen-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="kat-screen" src="/models/carlsberg/screen.png" alt="Boksens skærm i Carlsberg-grøn med kronen, logoet, Probably the best beer in the world og Sig Skål" />
          </div>
          <div className="kat-steps kat-steps--4" style={{ marginBottom: 80 }}>
            <div><b>1</b><h3>Tryk</h3><p>Lysringen kalder. Et tryk på skærmen starter.</p></div>
            <div><b>2</b><h3>Vælg</h3><p>Foto, GIF eller en kort video.</p></div>
            <div><b>3</b><h3>Sig »Skål!«</h3><p>Ringen tæller ned og giver studielys, også i en mørk bar.</p></div>
            <div><b>4</b><h3>Del</h3><p>Billedet kommer på SMS med rammen.</p></div>
          </div>
          <Folio n={4} />
        </Page>

        {/* 05 DESIGNET */}
        <Page n={5} cap="Designet" dark>
          <Rule />
          <span className="kat-kicker">Designet</span>
          <h2>Ordmærket, kronen og humlebladet</h2>
          <p className="kat-lede">Ét design styrer fire lag, så boksen ligner et stykke Carlsberg på væggen og ikke en tilfældig fotoboks.</p>
          <div className="kat-theme">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="kat-box kat-glow" src={`${IMG}/boks-carlsberg.png`} alt="Selfi Boks i Carlsberg-design" />
            <div className="kat-layers">
              <div>
                <b>Top og sider</b>
                Toppen er en grøn plade med jeres hvide ordmærke og kongekronen ovenpå, som på dåserne. Den grønne Danish Pilsner-flaske på den ene side og humlebladet på den anden. Få, store former i jeres egne farver, som kan ses på tværs af baren. Vi printer delene selv, massive og robuste nok til en travl bar.
                <Swatches keys={["green", "deep", "bottle", "white"]} />
              </div>
              <div>
                <b>Lysring</b>Hvidt og grønt, mens den venter. Studielys, når billedet tages.
                <Swatches keys={["white", "bottle"]} />
              </div>
              <div>
                <b>Skærm</b>Carlsberg-grøn med kronen, logoet og »Sig «Skål!»«.
              </div>
              <div>
                <b>Hvert foto og hver video</b>Carlsberg-logoet og barens navn på rammen, eller aftenens kampagne.
              </div>
            </div>
          </div>
          <p className="kat-fine kat-push" style={{ marginBottom: 100 }}>
            Konceptdesign udarbejdet til Carlsberg. Navn, logo og krone bruges kun med jeres tilladelse.
          </p>
          <Band />
          <Folio n={5} />
        </Page>

        {/* 06 I 3D */}
        <Page n={6} cap="Boksen i 3D" dark>
          <span className="kat-kicker">Boksen i 3D</span>
          <h2>Se den fra alle sider</h2>
          <p className="kat-lede">Træk i boksen for at dreje den. Toppen og siderne er printede dele på den samme boks, så den kan få et særligt design til en lancering eller et brand fra jeres portefølje.</p>
          <div className="kat-3d-wrap">
            <Box3D poster={`${IMG}/boks-carlsberg.png`} alt="Carlsberg-boksen i 3D. Træk for at dreje den." />
          </div>
          <div className="kat-angles">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="kat-box" src={`${IMG}/boks-carlsberg-skraa-venstre.png`} alt="Carlsberg-boksen set skråt fra venstre med flasken forrest" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="kat-box" src={`${IMG}/boks-carlsberg-skraa-hoejre.png`} alt="Carlsberg-boksen set skråt fra højre med humlebladet forrest" />
          </div>
          <Band />
          <Folio n={6} />
        </Page>

        {/* 07 RAMMERNE */}
        <Page n={7} cap="Rammerne">
          <span className="kat-kicker">Rammerne</span>
          <h2>Carlsberg og baren på samme billede</h2>
          <p className="kat-lede">Hver bar får sin egen ramme med Carlsberg-logoet, barens navn, dato og by. Gæsten deler et minde fra sin bar, og Carlsberg følger med.</p>
          <div className="kat-frames">
            <figure>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${IMG}/foto-sted.jpg`} alt="Sted-rammen i Carlsberg-grøn med logoet og × Bodegaen, dato og by" />
              <figcaption>Barens ramme: Carlsberg × barens navn med dato og by.</figcaption>
            </figure>
            <figure>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${IMG}/foto-kampagne.jpg`} alt="Kampagnerammen til julefrokosten med Carlsberg-logoet og Skål og glædelig jul" />
              <figcaption>Kampagnerammen, her til julefrokosterne, i alle barer på én gang.</figcaption>
            </figure>
          </div>
          <ul className="kat-points" style={{ marginTop: 6, marginBottom: 70 }}>
            <li><b>Altid begge navne</b><span>Carlsberg fast i venstre side, baren og aftenen i højre.</span></li>
            <li><b>Klar til stories</b><span>Formater til feed, story og reels, så rammen sidder rigtigt overalt.</span></li>
            <li><b>Delingssiden</b><span>Siden med billedet viser baren og kan linke til jeres kampagne.</span></li>
          </ul>
          <Band height={18} />
          <Folio n={7} />
        </Page>

        {/* 08 KAMPAGNER */}
        <Page n={8} cap="Kampagner" dark>
          <Rule />
          <span className="kat-kicker">Kampagner</span>
          <h2>Ét klik, alle barer</h2>
          <p className="kat-lede">I bestemmer, hvad der står på skærm og ramme i alle bokse. En ny kampagne går i luften i hver bar samme aften, uden at nogen skal ud med nye skilte.</p>
          <div className="kat-night" style={{ marginTop: 6 }}>
            <div><b>Jan</b><h3>Alkoholfrit i fokus</h3><p>Rammen og skærmen fremhæver jeres 0,0 % i januar.</p></div>
            <div><b>Forår</b><h3>Kampaftener</h3><p>Kampens ramme med holdene og resultatet efter slutfløjtet.</p></div>
            <div><b>Sommer</b><h3>Terrassen</h3><p>Sommerramme og lysring, der kan ses fra gaden.</p></div>
            <div><b>Efterår</b><h3>Lanceringen</h3><p>Den nye øl på skærmen og rammen, samme dag i hele landet.</p></div>
            <div><b>Vinter</b><h3>Julefrokost</h3><p>Firmaets navn på rammen, Carlsberg på hvert billede.</p></div>
          </div>
          <ul className="kat-points kat-points--dark" style={{ marginTop: 16, marginBottom: 80 }}>
            <li><b>Planlæg på forhånd</b><span>Læg kampagner ind med start og slut, så skifter boksene selv.</span></li>
            <li><b>Pr. region eller kæde</b><span>Kør en kampagne i én by, én kæde eller hele landet.</span></li>
            <li><b>Barens egne aftener</b><span>Baren kan selv lægge sine events ind, inden for jeres rammer.</span></li>
          </ul>
          <Folio n={8} />
        </Page>

        {/* 09 CONTENT */}
        <Page n={9} cap="Content" dark>
          <Rule />
          <span className="kat-kicker">Video og content</span>
          <h2>Gæsterne laver jeres content</h2>
          <p className="kat-lede">Boksen optager korte videoer. Skærmen stiller et spørgsmål, gæsterne svarer, og med deres samtykke bliver klippene til content for Carlsberg og for baren.</p>
          <div className="kat-rec">
            <div className="kat-rec-screen" aria-label="Boksens skærm under optagelse af en video">
              <span className="kat-rec-top">
                <i /> Optager · 0:04 / 0:10
              </span>
              <span className="kat-rec-q">Hvad skåler I for i aften?</span>
              <span className="kat-rec-heart">🍻</span>
              <span className="kat-rec-bar"><i /></span>
            </div>
            <div className="kat-places">
              <div><h3>Et bibliotek fra alle barer</h3><p>Klip og billeder samlet ét sted, sorteret efter bar, by og kampagne.</p></div>
              <div><h3>Til jeres SoMe</h3><p>Ægte gæster og ægte stemning, klar til opslag og annoncer.</p></div>
              <div><h3>Til barerne</h3><p>Hver bar får sine egne billeder til sin side, med Carlsberg i rammen.</p></div>
              <div><h3>Indsigt</h3><p>Hvad gæsterne svarer, giver et ærligt billede af stemningen i barerne.</p></div>
            </div>
          </div>
          <div className="kat-qs" style={{ marginBottom: 80 }}>
            <span>Hvad skåler I for i aften?</span>
            <span>Hvem har I med i aften?</span>
            <span>Hvad gør den her bar speciel?</span>
            <span>Jeres bedste fredag nogensinde?</span>
            <span>Send en hilsen til en, der ikke er her</span>
          </div>
          <Folio n={9} />
        </Page>

        {/* 10 ANSVARLIGT */}
        <Page n={10} cap="Ansvarlig markedsføring">
          <span className="kat-kicker">Ansvarlig markedsføring</span>
          <h2>Bygget til reglerne for øl</h2>
          <p className="kat-lede">Boksen sælger fællesskabet og aftenen, ikke mængden. Reglerne er en del af designet fra start, så I trygt kan have den i alle barer.</p>
          <div className="kat-places kat-places--grid" style={{ marginTop: 6 }}>
            <div><h3>18+ før deling</h3><p>Gæsten bekræfter sin alder, før billedet sendes, og før der gives samtykke til brug.</p></div>
            <div><h3>Ingen drikkelege</h3><p>Ingen konkurrencer, titler eller missioner, der handler om at drikke mere eller hurtigere.</p></div>
            <div><h3>Retningslinjerne</h3><p>Tekster, rammer og kampagner holdes inden for Alkoholreklamenævnets retningslinjer.</p></div>
            <div><h3>Alkoholfrit med</h3><p>Rammer og skærme kan fremhæve jeres alkoholfrie øl på lige fod med resten.</p></div>
            <div><h3>Samtykke og GDPR</h3><p>Billeder bruges kun med gæstens samtykke. Selfi er databehandler, og data ligger i EU.</p></div>
            <div><h3>Godkendt af jer</h3><p>Alle rammer og spørgsmål godkendes af Carlsberg, før de går i luften.</p></div>
          </div>
          <p className="kat-fine kat-push" style={{ marginBottom: 70 }}>Vi tilpasser opsætningen til jeres egen politik for ansvarlig markedsføring.</p>
          <Band height={18} />
          <Folio n={10} />
        </Page>

        {/* 11 CASES 1 */}
        <Page n={11} cap="Cases" dark>
          <Rule />
          <span className="kat-kicker">Cases · 1 af 2</span>
          <h2>Ti måder at bruge boksen på</h2>
          <p className="kat-lede">Aktiviteterne tilpasses Carlsberg og den enkelte bar. Her er de første fem.</p>
          <div className="kat-cases" style={{ marginBottom: 80 }}>
            {CASES.slice(0, 5).map((c) => (
              <Case key={c.title} c={c} />
            ))}
          </div>
          <Folio n={11} />
        </Page>

        {/* 12 CASES 2 */}
        <Page n={12} cap="Cases" dark>
          <Rule />
          <span className="kat-kicker">Cases · 2 af 2</span>
          <h2>Og fem mere</h2>
          <p className="kat-lede">Alle cases kan kombineres og skiftes fra bar til bar og fra uge til uge i kontrolpanelet.</p>
          <div className="kat-cases" style={{ marginBottom: 80 }}>
            {CASES.slice(5).map((c) => (
              <Case key={c.title} c={c} />
            ))}
          </div>
          <Folio n={12} />
        </Page>

        {/* 13 KONTROLPANEL */}
        <Page n={13} cap="Kontrolpanelet">
          <span className="kat-kicker">Kontrolpanelet</span>
          <h2>Alle barer på én skærm</h2>
          <p className="kat-lede">Se billeder, videoer og delinger fra hver bar, skift kampagne i alle bokse, og træk rapporten til marketing og salg.</p>
          <div className="kat-panel">
            <div className="nav">
              <div className="tabs">
                <span className="on">Barer</span>
                <span>Kampagner</span>
                <span>Content</span>
                <span>Rapporter</span>
              </div>
              <span className="loc">Hele landet · uge 43</span>
            </div>
            <div className="tiles tiles--4">
              <div className="tile"><span className="lab">Aktive bokse</span><span className="num">{kr(24)}</span></div>
              <div className="tile"><span className="lab">Fotos i ugen</span><span className="num">{kr(18460)}</span></div>
              <div className="tile"><span className="lab">Delt på SoMe</span><span className="num g">{kr(12115)}</span></div>
              <div className="tile"><span className="lab">Klip med samtykke</span><span className="num">{kr(642)}</span></div>
            </div>
            <div className="card">
              <div className="row h"><span>Bar</span><span>Ramme</span><span className="r">Fotos</span><span className="r">Delt</span></div>
              <div className="row"><span>Bodegaen, Aalborg</span><span className="st">Kampaften</span><span className="r">1.284</span><span className="r">902</span></div>
              <div className="row"><span>Kælderbaren, Aarhus</span><span className="st">Barens ramme</span><span className="r">1.106</span><span className="r">731</span></div>
              <div className="row"><span>Hjørnet, København</span><span className="st">Kampaften</span><span className="r">987</span><span className="r">688</span></div>
              <div className="row"><span>Havnecaféen, Odense</span><span className="st">Terrassen</span><span className="r">812</span><span className="r">540</span></div>
              <div className="row"><span>Stjernen, Esbjerg</span><span className="st">Barens ramme</span><span className="r">644</span><span className="r">409</span></div>
            </div>
            <div className="card theme">
              <span className="lab">Ugens rapport til marketing</span>
              <b>12.115 delte billeder med Carlsberg-logoet</b>
              <span className="btn">Send</span>
            </div>
          </div>
          <p className="kat-fine kat-push" style={{ marginBottom: 70 }}>
            Eksempel med opdigtede barer og tal. Klip vises først, når gæsterne har givet samtykke.
          </p>
          <Band height={18} />
          <Folio n={13} />
        </Page>

        {/* 14 UDRULNING */}
        <Page n={14} cap="Udrulning">
          <span className="kat-kicker">Udrulning og drift</span>
          <h2>Fra ti barer til hele landet</h2>
          <p className="kat-lede">Vi starter småt og måler. Barerne hænger selv boksen op med vægbeslaget og vores korte guide, og vi passer og opdaterer alle bokse, så hverken I eller barerne skal tænke på teknikken.</p>
          <div className="kat-setup2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="kat-box" src={`${IMG}/boks-carlsberg.png`} alt="Selfi Boks i Carlsberg-design" />
            <div className="kat-places">
              <div><h3>1. Pilot</h3><p>Ti udvalgte barer i to byer i en sæson, med tal fra første fredag.</p></div>
              <div><h3>2. Byerne</h3><p>Flere barer i de byer, hvor piloten virker bedst.</p></div>
              <div><h3>3. Hele landet</h3><p>Boksen som en fast del af jeres aftaler med barerne.</p></div>
              <div><h3>Andre brands</h3><p>Samme boks med top og sider til et andet brand fra jeres portefølje.</p></div>
            </div>
          </div>
          <div className="kat-specs kat-specs--light kat-push" style={{ marginBottom: 70 }}>
            <div>Montering<span>Vægbeslag, baren hænger den selv op</span></div>
            <div>Strøm<span>230 V, én stikkontakt</span></div>
            <div>Service<span>Vi passer boksene og skifter kampagner centralt</span></div>
          </div>
          <Band height={18} />
          <Folio n={14} />
        </Page>

        {/* 15 BAGSIDE */}
        <Page n={15} cap="Bagside" dark>
          <Rule />
          <span className="kat-kicker">Næste skridt</span>
          <h2>Lad os bygge jeres boks</h2>
          <p className="kat-lede">Vi gør designet og aktiviteterne færdige sammen med jer og starter med en pilot i ti barer.</p>
          <div className="kat-steps kat-steps--3" style={{ marginTop: 22 }}>
            <div><b>1</b><h3>Vi aftaler</h3><p>Barer, kampagner, regler og hvad I vil måle på.</p></div>
            <div><b>2</b><h3>Vi bygger</h3><p>Top, sider, skærm og rammer i jeres design.</p></div>
            <div><b>3</b><h3>I får content</h3><p>Billeder, videoer og tal fra hver bar, hver uge.</p></div>
          </div>
          <div className="kat-contact">
            <span className="kat-kicker">Jeres kontakt</span>
            <b>Holdet bag Selfi</b>
            <a href="/#kontakt">selfi.dk · Book en snak</a>
          </div>
          <div className="kat-push" style={{ marginBottom: 140 }}>
            <Lockup size={40} />
          </div>
          <Band />
          <Folio n={15} />
        </Page>
      </Viewer>
    </div>
  );
}
