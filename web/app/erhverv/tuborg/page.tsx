import type { Metadata } from "next";
import { Alfa_Slab_One } from "next/font/google";
import { Logo } from "@/components/Logo";
import { Viewer } from "@/components/katalog/Viewer";
import "@/components/katalog/katalog.css";
import "./tuborg.css";
import { Box3D } from "./Box3D";

// selfi.dk/erhverv/tuborg: the sales catalogue for Tuborg (Carlsberg Danmark), sixteen A4 pages that print to a PDF.
// The deal is a brand deal, not a venue deal: Tuborg pays for one box per bar, the bar hangs it up itself, and
// every photo and video carries the Tuborg wordmark. The box is shown only in the Tuborg design on the gen 2 unit
// (the crown and label of the Danish Grøn Tuborg on top, a Grøn Tuborg bottle and a draught glass on the sides). What sells
// it to a brand: the network of bars in one view, one-click campaigns on every box (J-dag at 20:59), the bar's
// own name next to Tuborg, numbers per bar and responsible drinking built in. No prices: they are agreed per deal.
// It stays out of search and the sitemap.

const partner = Alfa_Slab_One({ subsets: ["latin", "latin-ext"], weight: "400", variable: "--font-partner" });

export const metadata: Metadata = {
  title: "Selfi × Tuborg | Salgskatalog",
  description: "Forslag til Tuborg: Selfi Boks i Tuborg-design i Danmarks barer, med Tuborg på hvert billede, J-dag på alle bokse kl. 20:59 og hele netværket af barer i ét overblik.",
  alternates: { canonical: "/erhverv/tuborg" },
  robots: { index: false, follow: false },
};

const IMG = "/katalog/tuborg";
const PAL = { green: "#0c6928", can: "#309654", deep: "#1a4033", lime: "#a2f37c", silver: "#adadb0", white: "#ffffff", cream: "#f4ead2", beer: "#e7a21f", blue: "#123a8c" };
const kr = (n: number) => n.toLocaleString("da-DK");

// The can's green rims along the top of a page.
function Rim() {
  return <div className="kat-rim" aria-hidden="true" />;
}

// The can's green and lime band along the bottom of a page.
function Band({ height = 24 }: { height?: number }) {
  return <div className="kat-band" aria-hidden="true" style={{ height }} />;
}

function Lockup({ size = 34, light }: { size?: number; light?: boolean }) {
  return (
    <span className="kat-lockup" style={{ "--lk": `${size}px` } as React.CSSProperties}>
      <Logo size={size} href="/erhverv" />
      <span className="kat-times">×</span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`${IMG}/tuborg-${light ? "groen" : "hvid"}.svg`} alt="Tuborg" className="kat-partner-logo" />
    </span>
  );
}

function Folio({ n }: { n: number }) {
  return (
    <div className="kat-folio">
      <span>Selfi × Tuborg</span>
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

// Ten bars and nights where a Tuborg box earns its place, from the corner pub to the concert hall.
const CASES: { title: string; angle: string; text: string; gain: string }[] = [
  { title: "Værtshuset på hjørnet", angle: "Hverdag", text: "Stamgæsterne, dartskiven og fredagens runde. Boksen hænger ved siden af skiven, og værtshusets navn står ved siden af Tuborg på hvert billede.", gain: "Tuborg i de lokale fællesskaber" },
  { title: "Sportsbaren", angle: "Fodbold", text: "Superligaen på storskærm. Rammen skifter til kampens hold og resultat, og billederne fra sejren bliver delt, før fløjtet har lydt.", gain: "Tuborg i de store øjeblikke" },
  { title: "Spillestedet", angle: "Musik", text: "Koncertaften med aftenens navn og dato på rammen. Publikum tager billedet med hjem, og spillestedet får content fra aftenen.", gain: "Tuborg tæt på musikken" },
  { title: "J-dag", angle: "Kampagne", text: "Kl. 20:59 skifter alle bokse til Julebryg på samme tid. Sneen falder på skærmen, og hele landet tager J-dags-billedet med Tuborg på.", gain: "Danmarks største ølaften i ét feed" },
  { title: "Julefrokosten", angle: "Sæson", text: "November og december er barernes travleste uger. Firmaets navn kan stå på rammen, og hele bordet får et billede med hjem.", gain: "Tuborg på tusindvis af julefrokostbilleder" },
  { title: "Studenterbaren", angle: "Fredagsbar", text: "Fredagsbaren på universitetet. Skærmen beder om at vise, at man er fyldt 18, og rammen siger tak for i aften, når baren lukker.", gain: "En ny generation møder Tuborg" },
  { title: "Quizaftenen", angle: "Aktivitet", text: "Holdbillede før quizzen og vinderbillede bagefter. Vinderholdets navn kommer på rammen, og baren deler billedet næste dag.", gain: "Flere, der kommer igen" },
  { title: "Festivalbaren", angle: "Sommer", text: "Boksen tager med i Tuborg-baren på festivalen med festivalens navn på rammen og ægte stemning til Tuborgs kanaler.", gain: "Sommerens content uden fotograf" },
  { title: "Landskampen", angle: "Kampagne", text: "Når Danmark spiller, kan Tuborg sende en landskampsramme til alle bokse med ét tryk og trække den tilbage efter slutfløjtet.", gain: "Hele landet bag holdet med Tuborg på" },
  { title: "Barens fødselsdag", angle: "Barerne", text: "Når baren fejrer jubilæum eller ny ejer, får den en ramme til aftenen. Tuborg står bag sine barer, også på billederne.", gain: "Stærkere bånd til barerne" },
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

export default function TuborgKatalog() {
  return (
    <div className={`kat kat--tuborg ${partner.variable}`}>
      <Viewer>
        {/* 01 FORSIDE */}
        <Page n={1} cap="Forside" dark>
          <Rim />
          <div className="kat-top">
            <Lockup />
            <span className="kat-kicker">Forslag · 2026/27</span>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="kat-box kat-glow" src={`${IMG}/boks-tuborg.png`} alt="Selfi Boks i Tuborg-design med kronen og Grøn Tuborg-etiketten på toppen, en Grøn Tuborg-flaske på den ene side og et fadølsglas på den anden" style={{ width: 430, marginTop: -6 }} />
          <h1 className="kat-center">Tuborg på hvert billede</h1>
          <p className="kat-lede kat-center">Et udkast til Tuborg: en fotoboks i Tuborgs design i Danmarks barer, der tager billeder og videoer af gæsterne og sætter Tuborg på alt, der deles.</p>
          <Band />
        </Page>

        {/* 02 BREV */}
        <Page n={2} cap="Brev">
          <span className="kat-kicker">Til Tuborg</span>
          <h2>Skålen bliver allerede taget</h2>
          <p className="kat-lede" style={{ maxWidth: "44ch" }}>
            Hver aften rejser tusindvis af gæster glasset i en bar, der skænker Tuborg, og hver aften bliver det øjeblik fotograferet. Men Tuborg står sjældent på billedet. Selfi Boks er bygget i jeres design med kronen og Grøn Tuborg-etiketten, en grøn flaske og et fadølsglas med skum. Den hænger i baren, tager billeder og korte videoer af gæsterne og sætter Tuborg på alt, der deles.
          </p>
          <div className="kat-sign">
            <b>Skål for i aften</b>
            <span>Holdet bag Selfi</span>
          </div>
          <p className="kat-quote">Fra bardisken til hele Danmarks feeds.</p>
          <span className="kat-kicker" style={{ marginTop: 22 }}>
            Det vi har bygget forslaget på
          </span>
          <div className="kat-facts" style={{ marginBottom: 90 }}>
            <div><b>Hele Danmarks pilsner</b><span>Grøn Tuborg er brygget siden 1880 og en del af danskernes fællesskaber</span></div>
            <div><b>Barerne</b><span>Værtshuse, sportsbarer, spillesteder og fredagsbarer, der skænker Tuborg</span></div>
            <div><b>J-dag</b><span>Første fredag i november kl. 20:59, i år fredag den 6. november</span></div>
            <div><b>Drik med respekt</b><span>Tuborgs eget arbejde for en bedre alkoholkultur, bygget ind i boksen</span></div>
          </div>
          <Band height={18} />
          <Folio n={2} />
        </Page>

        {/* 03 MODELLEN */}
        <Page n={3} cap="Modellen" dark>
          <Rim />
          <span className="kat-kicker">Modellen</span>
          <h2>Tuborg betaler boksen. Baren får den.</h2>
          <p className="kat-lede">Tuborg betaler én boks pr. bar. Baren får en fotoboks i Tuborgs design uden at betale, og til gengæld står Tuborg på hvert billede, der bliver taget.</p>
          <div className="kat-steps kat-steps--3" style={{ marginTop: 6 }}>
            <div><b>1</b><h3>I vælger barerne</h3><p>De barer, der skænker Tuborg, og som I vil stå stærkere i.</p></div>
            <div><b>2</b><h3>Baren hænger den op</h3><p>Boksen kommer med vægbeslag, boreskabelon og en kort guide.</p></div>
            <div><b>3</b><h3>Gæsterne deler</h3><p>Hvert billede og hver video bærer Tuborg ud på SoMe.</p></div>
          </div>
          <div className="kat-who" style={{ marginBottom: 86 }}>
            <div>
              <b>Tuborg får</b>
              <ul>
                <li>Ordmærket på hvert foto, hver video og hver GIF</li>
                <li>Alle barer i ét overblik med tal pr. bar</li>
                <li>Kampagner på alle bokse med ét tryk</li>
                <li>Ægte content fra gæsterne med samtykke</li>
              </ul>
            </div>
            <div>
              <b>Baren får</b>
              <ul>
                <li>En fotoboks, der får gæsterne til at blive</li>
                <li>Sit eget navn på rammen ved siden af Tuborg</li>
                <li>Billeder fra sine aftener til sin egen SoMe</li>
                <li>Service og opdateringer uden at løfte en finger</li>
              </ul>
            </div>
            <div>
              <b>Gæsterne får</b>
              <ul>
                <li>Et billede af aftenen på telefonen på sekunder</li>
                <li>Studielys, også i en mørk bar</li>
                <li>Ingen app og intet login</li>
                <li>Et print med hjem, hvis baren vil</li>
              </ul>
            </div>
          </div>
          <Folio n={3} />
        </Page>

        {/* 04 DESIGNET */}
        <Page n={4} cap="Designet" dark>
          <Rim />
          <span className="kat-kicker">Designet</span>
          <h2>Kronen, flasken og glasset</h2>
          <p className="kat-lede">Ét design styrer fire lag, så boksen ligner en del af baren og Tuborgs univers, ikke en automat, der er stillet ind.</p>
          <div className="kat-theme">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="kat-box kat-glow" src={`${IMG}/boks-tuborg.png`} alt="Selfi Boks i Tuborg-design" />
            <div className="kat-layers">
              <div>
                <b>Top og sider</b>
                Toppen af Grøn Tuborg-etiketten, som den ser ud i Danmark: kronen over en hvid etiket med TUBORG i bue og »GRØN«. En grøn flaske på den ene side og et fadølsglas med skum på den anden. Få, rolige former i jeres farver, printet massive og robuste nok til en fredag aften.
                <Swatches keys={["green", "can", "white", "silver", "beer"]} />
              </div>
              <div>
                <b>Lysring</b>Hvid og grøn, mens den venter. Studielys, når billedet tages, og blå og hvid sne på J-dag.
                <Swatches keys={["white", "lime", "blue"]} />
              </div>
              <div>
                <b>Skærm</b>Ordmærket over lys og perler, »Hele Danmarks pilsner« og »Sig «Skål!»«.
              </div>
              <div>
                <b>Hvert foto og hver video</b>Tuborg-rammen, barens egen ramme med Tuborg ved siden af, eller aftenens kampagne.
              </div>
            </div>
          </div>
          <p className="kat-fine kat-push" style={{ marginBottom: 96 }}>
            Konceptdesign udarbejdet til Tuborg. Navn og ordmærke tilhører Carlsberg og bruges kun med jeres tilladelse.
          </p>
          <Band />
          <Folio n={4} />
        </Page>

        {/* 05 I 3D */}
        <Page n={5} cap="Boksen i 3D" dark>
          <span className="kat-kicker">Boksen i 3D</span>
          <h2>Se den fra alle sider</h2>
          <p className="kat-lede">Træk i boksen for at dreje den. Toppen og siderne er printede dele på den samme boks, så designet kan skifte til Julebryg, en festival eller en ny kampagne uden en ny boks.</p>
          <div className="kat-3d-wrap">
            <Box3D poster={`${IMG}/boks-tuborg.png`} alt="Tuborg-boksen i 3D. Træk for at dreje den." />
          </div>
          <div className="kat-angles">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="kat-box" src={`${IMG}/boks-tuborg-skraa-venstre.png`} alt="Tuborg-boksen set skråt fra venstre med fadølsglasset forrest" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="kat-box" src={`${IMG}/boks-tuborg-skraa-hoejre.png`} alt="Tuborg-boksen set skråt fra højre med den grønne flaske forrest" />
          </div>
          <Band />
          <Folio n={5} />
        </Page>

        {/* 06 RAMMERNE */}
        <Page n={6} cap="Rammerne">
          <span className="kat-kicker">Rammerne</span>
          <h2>Tuborg står altid med på billedet</h2>
          <p className="kat-lede">Ordmærket sidder på hvert foto, hver video og hver GIF. Baren kan få sit eget navn ved siden af, så billedet føles som barens, men bærer Tuborg.</p>
          <div className="kat-frames">
            <figure>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${IMG}/foto-tuborg.jpg`} alt="Tuborg-rammen i grønt med ordmærket og Skål for i aften" />
              <figcaption>Tuborg-rammen, som alle bokse har.</figcaption>
            </figure>
            <figure>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${IMG}/foto-bar.jpg`} alt="Barens egen ramme med barens navn, dato og by og Tuborg til højre" />
              <figcaption>Barens navn, dato og by ved siden af Tuborg.</figcaption>
            </figure>
          </div>
          <ul className="kat-points" style={{ marginTop: 14, marginBottom: 70 }}>
            <li><b>I godkender alt</b><span>Rammer og skærme følger jeres designmanual og godkendes af jer, før de går ud.</span></li>
            <li><b>Formater til alt</b><span>Feed, story og reels, så ordmærket sidder rigtigt overalt.</span></li>
            <li><b>Jeres hashtag</b><span>Tuborgs tag er sat ind, når gæsterne deler.</span></li>
          </ul>
          <Band height={18} />
          <Folio n={6} />
        </Page>

        {/* 07 J-DAG */}
        <Page n={7} cap="J-dag" dark>
          <Rim />
          <span className="kat-kicker">J-dag · fredag 6. november · 20:59</span>
          <h2>Sneen falder på alle bokse på én gang</h2>
          <p className="kat-lede">Hele aftenen tæller skærmen ned. Kl. 20:59 skifter hver eneste Tuborg-boks til Julebryg på samme sekund: sneen falder på skærmen, lysringen bliver blå og hvid, og rammen får J-dag på.</p>
          <div className="kat-side" style={{ marginTop: 6 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${IMG}/skaerm-jdag.jpg`} alt="Boksens skærm på J-dag med Tuborg Julebryg, sne og en nedtælling til 20:59" />
            <div>
              <div className="kat-night">
                <div><b>18.00</b><h3>Nedtællingen</h3><p>Skærmen tæller ned til sneen, og gæsterne ved, hvad de venter på.</p></div>
                <div><b>20:59</b><h3>Sneen falder</h3><p>Alle bokse skifter på samme sekund. Det er aftenens billede.</p></div>
                <div><b>Natten</b><h3>J-dags-rammen</h3><p>Julebryg og datoen på hvert billede resten af aftenen.</p></div>
                <div><b>Lørdag</b><h3>Danmarks J-dag</h3><p>De bedste billeder fra alle barer samlet, klar til Tuborgs kanaler.</p></div>
              </div>
            </div>
          </div>
          <p className="kat-fine kat-push" style={{ marginBottom: 70 }}>Skærm og ramme er skitser. J-dags-designet tegnes efter jeres Julebryg-kampagne.</p>
          <Band />
          <Folio n={7} />
        </Page>

        {/* 08 NETVÆRKET */}
        <Page n={8} cap="Netværket">
          <span className="kat-kicker">Netværket</span>
          <h2>Alle jeres barer på én skærm</h2>
          <p className="kat-lede">Tuborg ser hele netværket: billeder, delinger og scanninger pr. bar, by og aften. Og I kan sende en ny ramme til alle bokse, til en region eller til en enkelt bar.</p>
          <div className="kat-panel">
            <div className="nav">
              <div className="tabs">
                <span className="on">Netværk</span>
                <span>Kampagner</span>
                <span>Content</span>
                <span>Rapporter</span>
              </div>
              <span className="loc">42 barer · fredag</span>
            </div>
            <div className="tiles tiles--4">
              <div className="tile"><span className="lab">Billeder i aften</span><span className="num">{kr(3184)}</span></div>
              <div className="tile"><span className="lab">Videoer</span><span className="num">{kr(412)}</span></div>
              <div className="tile"><span className="lab">Delt på SoMe</span><span className="num g">{kr(1902)}</span></div>
              <div className="tile"><span className="lab">Aktive bokse</span><span className="num">41/42</span></div>
            </div>
            <div className="card">
              <div className="row h"><span>Bar</span><span>Ramme</span><span className="r">Billeder</span><span className="r">Delt</span></div>
              <div className="row"><span>Værtshus · Aalborg</span><span className="st">Barens ramme</span><span className="r">214</span><span className="r">131</span></div>
              <div className="row"><span>Sportsbar · Aarhus</span><span className="st">Superliga</span><span className="r">188</span><span className="r">120</span></div>
              <div className="row"><span>Spillested · Odense</span><span className="st">Koncertramme</span><span className="r">176</span><span className="r">102</span></div>
              <div className="row"><span>Fredagsbar · København</span><span className="st">Tuborg-rammen</span><span className="r">163</span><span className="r">97</span></div>
              <div className="row"><span>Bodega · Esbjerg</span><span className="st">Tuborg-rammen</span><span className="r">121</span><span className="r">66</span></div>
            </div>
            <div className="card theme">
              <span className="lab">Kampagne på alle 42 bokse</span>
              <b>J-dag · fredag 6. november kl. 20:59</b>
              <span className="btn">Planlagt</span>
            </div>
          </div>
          <p className="kat-fine kat-push" style={{ marginBottom: 70 }}>Eksempel med opdigtede barer og tal.</p>
          <Band height={18} />
          <Folio n={8} />
        </Page>

        {/* 09 ÅRET RUNDT */}
        <Page n={9} cap="Året rundt" dark>
          <Rim />
          <span className="kat-kicker">Kampagner året rundt</span>
          <h2>Ét tryk, og alle bokse er med</h2>
          <p className="kat-lede">Rammer, skærme og lys kan skifte efter jeres kalender. I planlægger kampagnen én gang, og den går i luften på alle bokse på samme minut.</p>
          <div className="kat-year">
            <div><b>Januar</b><h3>Nytårsaften og ny sæson</h3><p>Rammen med årstallet ved midnat og et nyt design til foråret.</p></div>
            <div><b>Påske</b><h3>Påskebryg</h3><p>Påskerammen på alle bokse, mens påskeøllen er i barerne.</p></div>
            <div><b>Sommer</b><h3>Festivaler og koncerter</h3><p>Boksen med i Tuborg-baren og en ramme til hver koncertaften.</p></div>
            <div><b>Hele året</b><h3>Landskampe og Superliga</h3><p>Holdene og resultatet på rammen, når Danmark spiller.</p></div>
            <div><b>November</b><h3>J-dag</h3><p>Nedtællingen, sneen kl. 20:59 og J-dags-rammen.</p></div>
            <div><b>December</b><h3>Julefrokoster og nytår</h3><p>Firmaets navn på rammen og et billede til hele bordet.</p></div>
          </div>
          <div className="kat-frames kat-frames--3" style={{ marginBottom: 80 }}>
            <figure>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${IMG}/foto-tuborg.jpg`} alt="Tuborg-rammen til hverdag" />
              <figcaption>Hverdag</figcaption>
            </figure>
            <figure>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${IMG}/foto-bar.jpg`} alt="Barens egen ramme med Tuborg" />
              <figcaption>Barens aften</figcaption>
            </figure>
            <figure>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${IMG}/foto-jdag.jpg`} alt="J-dags-rammen i blåt med sne, Tuborg, Julebryg er landet og datoen" />
              <figcaption>J-dag kl. 20:59</figcaption>
            </figure>
          </div>
          <Folio n={9} />
        </Page>

        {/* 10 BRANDING */}
        <Page n={10} cap="Branding">
          <span className="kat-kicker">Branding</span>
          <h2>Tuborg i jeres målgruppes feeds</h2>
          <p className="kat-lede">Billederne bliver delt af gæsterne selv, til deres venner, på Instagram, TikTok og Snapchat. Det er Tuborg i de feeds, hvor annoncer har sværest ved at nå frem.</p>
          <div className="kat-brand">
            <div className="kat-phone" aria-label="Eksempel på et opslag på Instagram med Tuborg-rammen">
              <div className="kat-phone-bar">
                <i />
                <span>
                  <b>mette.aalborg</b>
                  <small>Café Hjørnet</small>
                </span>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${IMG}/foto-tuborg.jpg`} alt="Foto af tre venner i Tuborg-rammen" />
              <div className="kat-phone-foot">
                <span className="kat-phone-heart">♥</span> 143 synes godt om
                <p>
                  <b>mette.aalborg</b> Fredag med de bedste 🍻
                </p>
              </div>
            </div>
            <ul className="kat-points">
              <li><b>Delt af gæsterne</b><span>Venner, der viser venner en god aften med Tuborg på.</span></li>
              <li><b>Tal på det hele</b><span>Billeder, delinger og scanninger pr. bar, by og kampagne.</span></li>
              <li><b>Delingssiden</b><span>Siden med billedet kan linke til jeres kampagne, koncerter eller Drik med respekt.</span></li>
              <li><b>Content til jer</b><span>Med gæsternes samtykke kan de bedste billeder og klip bruges i Tuborgs egne kanaler.</span></li>
            </ul>
          </div>
          <p className="kat-fine kat-push" style={{ marginBottom: 70 }}>Eksempel på et opslag. Navn og tal er opdigtede.</p>
          <Band height={18} />
          <Folio n={10} />
        </Page>

        {/* 11 DRINK WITH RESPECT */}
        <Page n={11} cap="Ansvar" dark>
          <Rim />
          <span className="kat-kicker">Drik med respekt</span>
          <h2>Ansvaret er bygget ind</h2>
          <p className="kat-lede">En boks med et ølmærke på skal være i orden. Derfor er de regler, I selv arbejder efter, en del af boksen fra dag ét.</p>
          <div className="kat-places kat-places--2" style={{ marginTop: 8 }}>
            <div><h3>Kun for 18+</h3><p>Skærmen beder gæsten bekræfte, at alle på billedet er fyldt 18, før Tuborg-rammen bruges.</p></div>
            <div><h3>Branchens regler</h3><p>Rammer og tekster skrives efter retningslinjerne for markedsføring af alkohol. Ingen opfordring til at drikke mere eller hurtigere.</p></div>
            <div><h3>Husk vand</h3><p>Efter midnat kan skærmen og rammen minde om vand og en god vej hjem, i jeres egen tone.</p></div>
            <div><h3>Kom godt hjem</h3><p>Ved lukketid viser skærmen taxa og natbus, og rammen siger tak for i aften.</p></div>
            <div><h3>Samtykke først</h3><p>Billeder og klip bruges kun i jeres kanaler, når gæsten har sagt ja, og I godkender dem, før de går ud.</p></div>
            <div><h3>Gæsternes data</h3><p>Billederne slettes efter en fast periode, og baren er dataansvarlig for sine gæster.</p></div>
          </div>
          <p className="kat-fine kat-push" style={{ marginBottom: 70 }}>Vi tilpasser reglerne til Carlsbergs egne retningslinjer for markedsføring.</p>
          <Band />
          <Folio n={11} />
        </Page>

        {/* 12 VIDEO */}
        <Page n={12} cap="Video" dark>
          <Rim />
          <span className="kat-kicker">Video</span>
          <h2>Gæsterne laver jeres content</h2>
          <p className="kat-lede">Boksen optager korte videoer. Skærmen stiller et spørgsmål, gæsterne svarer, og med deres samtykke bliver klippene til Tuborgs og barens SoMe.</p>
          <div className="kat-rec">
            <div className="kat-rec-screen" aria-label="Boksens skærm under optagelse af en hilsen">
              <span className="kat-rec-top">
                <i /> Optager · 0:04 / 0:10
              </span>
              <span className="kat-rec-q">Hvem skåler du med i aften?</span>
              <span className="kat-rec-heart">🍻</span>
              <span className="kat-rec-bar"><i /></span>
            </div>
            <div className="kat-places">
              <div><h3>Til Tuborgs kanaler</h3><p>Ægte aftener fra hele landet, klippet sammen efter J-dag eller en landskamp.</p></div>
              <div><h3>Til barerne</h3><p>Aftenens bedste klip, klar til barens eget opslag.</p></div>
              <div><h3>Til spillestederne</h3><p>Publikums hilsner til bandet efter koncerten.</p></div>
              <div><h3>Til kampagnerne</h3><p>Spørgsmål, der passer til jeres kampagne, skiftet med ét tryk.</p></div>
            </div>
          </div>
          <div className="kat-qs" style={{ marginBottom: 80 }}>
            <span>Hvem skåler du med i aften?</span>
            <span>Hvad er jeres bedste J-dag?</span>
            <span>Send en hilsen til bandet</span>
            <span>Hvem tager du med næste fredag?</span>
            <span>Hvad fejrer I i aften?</span>
          </div>
          <Folio n={12} />
        </Page>

        {/* 13 CASES 1 */}
        <Page n={13} cap="Cases" dark>
          <Rim />
          <span className="kat-kicker">Cases · 1 af 2</span>
          <h2>Ti barer og aftener</h2>
          <p className="kat-lede">Boksen passer ind, hvor Tuborg allerede bliver skænket. Her er de første fem.</p>
          <div className="kat-cases" style={{ marginBottom: 80 }}>
            {CASES.slice(0, 5).map((c) => (
              <Case key={c.title} c={c} />
            ))}
          </div>
          <Folio n={13} />
        </Page>

        {/* 14 CASES 2 */}
        <Page n={14} cap="Cases" dark>
          <Rim />
          <span className="kat-kicker">Cases · 2 af 2</span>
          <h2>Og fem mere</h2>
          <p className="kat-lede">Alle cases kan kombineres og skiftes fra bar til bar og fra aften til aften i kontrolpanelet.</p>
          <div className="kat-cases" style={{ marginBottom: 80 }}>
            {CASES.slice(5).map((c) => (
              <Case key={c.title} c={c} />
            ))}
          </div>
          <Folio n={14} />
        </Page>

        {/* 15 OPSÆTNING */}
        <Page n={15} cap="Opsætning">
          <span className="kat-kicker">Opsætning og drift</span>
          <h2>Baren hænger den selv op</h2>
          <p className="kat-lede">Boksen hænger på væggen. Baren hænger den selv op med vægbeslaget, boreskabelonen og vores korte guide, og vi passer og opdaterer alle bokse, så hverken I eller baren skal tænke på dem.</p>
          <div className="kat-setup2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="kat-box" src={`${IMG}/boks-tuborg.png`} alt="Selfi Boks i Tuborg-design" />
            <div className="kat-places">
              <div><h3>Ved baren</h3><p>Hvor gæsterne står med glasset, og skålen bliver taget.</p></div>
              <div><h3>Ved dartskiven</h3><p>Hvor holdet samles, og vinderen skal fejres.</p></div>
              <div><h3>Ved storskærmen</h3><p>Til kampene, hvor jubel bliver til billeder.</p></div>
              <div><h3>Ved scenen</h3><p>På spillestedet, før og efter koncerten.</p></div>
              <div><h3>Ved udgangen</h3><p>Det sidste billede af aftenen og en god vej hjem.</p></div>
            </div>
          </div>
          <div className="kat-specs kat-specs--light kat-push" style={{ marginBottom: 70 }}>
            <div>Montering<span>Vægbeslag, baren hænger den selv op</span></div>
            <div>Strøm<span>230 V, én stikkontakt</span></div>
            <div>Service<span>Vi passer boksene og sender jeres kampagner ud</span></div>
          </div>
          <Band height={18} />
          <Folio n={15} />
        </Page>

        {/* 16 BAGSIDE */}
        <Page n={16} cap="Bagside" dark>
          <Rim />
          <span className="kat-kicker">Næste skridt</span>
          <h2>Lad os starte med ti barer</h2>
          <p className="kat-lede">Vi gør designet færdigt sammen med jer, vælger barerne sammen og viser tallene efter de første uger.</p>
          <div className="kat-steps kat-steps--3" style={{ marginTop: 22 }}>
            <div><b>1</b><h3>Vi aftaler</h3><p>Barerne, rammerne, kampagnerne og jeres godkendelse af designet.</p></div>
            <div><b>2</b><h3>Vi bygger</h3><p>Top, sider, skærm og rammer i Tuborgs design, sendt direkte til barerne.</p></div>
            <div><b>3</b><h3>I får tallene</h3><p>Billeder, delinger og content pr. bar, så I kan se, hvor det virker.</p></div>
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
          <Folio n={16} />
        </Page>
      </Viewer>
    </div>
  );
}
