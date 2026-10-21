import type { Metadata } from "next";
import { Lilita_One } from "next/font/google";
import { Logo } from "@/components/Logo";
import { Viewer } from "@/components/katalog/Viewer";
import "@/components/katalog/katalog.css";
import "./heidis.css";
import { Box3D } from "./Box3D";

// selfi.dk/erhverv/heidis: the sales catalogue for Heidi's Bier Bar, REKOM's afterski bars in six Danish cities,
// fourteen A4 pages that print to a PDF. The box is shown only in the Heidi's design on the gen 2 unit (a
// gingerbread heart with the logo, wheat and hops, a beer tower and a maypole). The ideas that sell it to a
// chain: one design in every bar, a frame per city, a frame the brewery can pay for, and the cities competing
// for the month's most photos. No prices: they are agreed per deal. It stays out of search and the sitemap.

const partner = Lilita_One({ subsets: ["latin", "latin-ext"], weight: "400", variable: "--font-partner" });

export const metadata: Metadata = {
  title: "Selfi × Heidi's Bier Bar | Salgskatalog",
  description: "Forslag til Heidi's Bier Bar: Selfi Boks som et honningkagehjerte med ølrør og majstang i alle seks barer, med en ramme for hver by, bryggeriets ramme til Oktoberfest og Heidi's på hvert foto, der deles.",
  alternates: { canonical: "/erhverv/heidis" },
  robots: { index: false, follow: false },
};

const IMG = "/katalog/heidis";
const PAL = { base: "#00572a", green: "#006a31", deep: "#023d1e", yellow: "#fccd28", white: "#fbfaf4", ginger: "#a5642b", beer: "#f0a524", hop: "#8dbb3c" };

const BARS = [
  { city: "Aalborg", street: "Jomfru Anes Gård 5" },
  { city: "Aarhus", street: "Klostergade 34B" },
  { city: "København", street: "Vestergade 18" },
  { city: "Herning", street: "Smallegade 1" },
  { city: "Sønderborg", street: "Rådhustorvet 5" },
  { city: "Thisted", street: "Østerbakken 11" },
];
const kr = (n: number) => n.toLocaleString("da-DK");

// Bunting in the bar's green, yellow and white along the top of a page, like the ceiling on a Saturday.
function Bunting() {
  const flags = Array.from({ length: 14 }, (_, i) => i);
  return (
    <div className="kat-bunting" aria-hidden="true">
      <svg viewBox="0 0 700 60" preserveAspectRatio="none">
        <path className="rope" d="M0 6 Q350 34 700 6" />
        {flags.map((i) => {
          const x0 = i * 50 + 3;
          const x1 = x0 + 44;
          const y = (x: number) => 6 + 28 * (1 - ((x - 350) / 350) ** 2) * 0.98;
          return <path key={i} className={["g", "y", "w"][i % 3]} d={`M${x0} ${y(x0)} L${x1} ${y(x1)} L${(x0 + x1) / 2} ${(y(x0) + y(x1)) / 2 + 26} Z`} />;
        })}
      </svg>
    </div>
  );
}

// The maypole's green and white stripes along the bottom of a page.
function Stripes({ height = 26 }: { height?: number }) {
  return <div className="kat-stripes" aria-hidden="true" style={{ height }} />;
}

function Lockup({ size = 34 }: { size?: number }) {
  return (
    <span className="kat-lockup" style={{ "--lk": `${size}px` } as React.CSSProperties}>
      <Logo size={size} href="/erhverv" />
      <span className="kat-times">×</span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/models/heidis/logo.svg" alt="Heidi's Bier Bar" className="kat-partner-logo" />
    </span>
  );
}

function Folio({ n }: { n: number }) {
  return (
    <div className="kat-folio">
      <span>Selfi × Heidi&apos;s Bier Bar</span>
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

// Ten ways the boxes can work for Heidi's, from an ordinary Saturday to the big weeks of the year.
const CASES: { title: string; angle: string; text: string; gain: string }[] = [
  { title: "Bryggeriets ramme", angle: "Partner", text: "Til Oktoberfest eller en ny øl på hanen overtager bryggeriet rammen med sit logo ved siden af jeres. Hvert billede, der deles, er en reklame for øllen, og den betaler bryggeriet for.", gain: "En ny indtægt fra jeres leverandører" },
  { title: "Byernes kamp", angle: "Kæden", text: "Seks barer dyster om månedens flest billeder. Stillingen står på skærmen i alle barer, og vinderbyen får en runde ølrør på huset.", gain: "Gæster, der tager billeder for deres by" },
  { title: "Ølrøret", angle: "Salg", text: "Når et 4-liters ølrør lander på bordet, beder skærmen hele bordet om et billede med røret i midten. Billedet sælger det næste rør ved nabobordet.", gain: "Flere ølrør solgt" },
  { title: "Bier pong-finalen", angle: "Events", text: "Ugens vindere får deres eget billede i en guldramme med dato og by, og holdet bliver vist på skærmen hele aftenen.", gain: "Flere hold til næste turnering" },
  { title: "Oktoberfest", angle: "Sæson", text: "Lederhosen, dirndl og bordene fulde. En særlig ramme og skærm til hele Oktoberfest-perioden, med bryggeriet som partner.", gain: "Ugerne, alle taler om" },
  { title: "Polterabend", angle: "Grupper", text: "Gommen i lederhosen og vennerne omkring ham. Gruppen får en ramme med navn og dato og alle billeder samlet ét sted.", gain: "Flere gruppebookinger" },
  { title: "Fødselsdagen", angle: "Private", text: "Bordet med fødselaren får en ramme med navn og alder, og gæsterne får billederne med hjem på telefonen.", gain: "Bordreservationer til fødselsdage" },
  { title: "Julefrokost og firmafest", angle: "Erhverv", text: "Når et firma holder fest hos jer, kommer deres logo på rammen ved siden af Heidi's. En god grund til at vælge jer igen næste år.", gain: "Et stærkere tilbud til firmaer" },
  { title: "Studenter og rusfester", angle: "Sæson", text: "Huer, flag og en ramme med årgangen. Billederne bliver delt af hele klassen samme aften.", gain: "Næste årgang kender jer allerede" },
  { title: "Ugens bedste skål", angle: "Konkurrence", text: "Gæsterne optager deres bedste »Prost!« på video. Ugens bedste vinder et ølrør og bliver vist på jeres SoMe.", gain: "Content, I ikke selv skal lave" },
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

export default function HeidisKatalog() {
  return (
    <div className={`kat kat--heidis ${partner.variable}`}>
      <Viewer>
        {/* 01 FORSIDE */}
        <Page n={1} cap="Forside" dark>
          <Bunting />
          <div className="kat-top">
            <Lockup />
            <span className="kat-kicker">Forslag · 2026/27</span>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="kat-box kat-glow" src={`${IMG}/boks-heidis.png`} alt="Selfi Boks med et honningkagehjerte med Heidi's-logoet på toppen, et ølrør på den ene side og en grøn og hvid majstang med kringle og ølkrus på den anden" style={{ width: 330, marginTop: 4 }} />
          <h1 className="kat-center">Prost på hvert foto</h1>
          <p className="kat-lede kat-center">Et udkast til Heidi&apos;s Bier Bar: en fotoboks i jeres eget design i alle seks barer, der tager billeder og videoer af gæsterne og sætter Heidi&apos;s på alt, der deles.</p>
          <Stripes />
        </Page>

        {/* 02 BREV */}
        <Page n={2} cap="Brev">
          <span className="kat-kicker">Til Heidi&apos;s Bier Bar</span>
          <h2>Afterski, hver weekend</h2>
          <p className="kat-lede" style={{ maxWidth: "44ch" }}>
            Fredag aften hos jer står gæsterne på bænkene, ølrøret går rundt, og personalet i lederhosen synger med. Alle tager billeder, og de bliver delt, men der står ikke Heidi&apos;s på dem. Selfi Boks er bygget i jeres eget design med honningkagehjerte, ølrør og majstang. Den tager billeder og korte videoer og sætter jeres ramme på alt, der deles. Den samme boks kan stå i alle seks barer med hver sin by på rammen, og til Oktoberfest kan bryggeriet betale for rammen.
          </p>
          <div className="kat-sign">
            <b>Prost fra os</b>
            <span>Holdet bag Selfi</span>
          </div>
          <p className="kat-quote">Fra bænken i baren til hele byens feeds.</p>
          <span className="kat-kicker" style={{ marginTop: 28 }}>
            Det vi har bygget forslaget på
          </span>
          <div className="kat-facts" style={{ marginBottom: 90 }}>
            <div><b>6 barer</b><span>Aalborg, Aarhus, København, Herning, Sønderborg og Thisted</span></div>
            <div><b>Stemningen</b><span>Afterski og Oktoberfest med personale i lederhosen og dirndl</span></div>
            <div><b>På bordet</b><span>4-liters ølrør, tyske og østrigske øl og shots</span></div>
            <div><b>Hver uge</b><span>Bier pong-turneringer og fest til langt ud på natten</span></div>
          </div>
          <Stripes height={20} />
          <Folio n={2} />
        </Page>

        {/* 03 SÅDAN VIRKER DEN */}
        <Page n={3} cap="Sådan virker den" dark>
          <span className="kat-kicker">Sådan virker den</span>
          <h2>Fire trin fra skål til opslag</h2>
          <p className="kat-lede">Gæsterne klarer det selv. Intet personale, ingen app og intet login. Det virker også, når baren er fuld klokken to om natten.</p>
          <div className="kat-screen-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="kat-screen" src="/models/heidis/screen.png" alt="Boksens skærm med Alperne, flagranker, Heidi's-logoet, Afterski hver weekend og Sig Prost" />
          </div>
          <div className="kat-steps kat-steps--4" style={{ marginBottom: 80 }}>
            <div><b>1</b><h3>Tryk</h3><p>Lysringen kalder. Et tryk på skærmen starter.</p></div>
            <div><b>2</b><h3>Vælg</h3><p>Foto, GIF, video eller ugens skål.</p></div>
            <div><b>3</b><h3>Sig »Prost!«</h3><p>Ringen tæller ned og giver studielys, også midt på dansegulvet.</p></div>
            <div><b>4</b><h3>Del</h3><p>Billedet kommer på SMS med jeres ramme.</p></div>
          </div>
          <Folio n={3} />
        </Page>

        {/* 04 DESIGNET */}
        <Page n={4} cap="Designet" dark>
          <Bunting />
          <span className="kat-kicker">Designet</span>
          <h2>Hjertet, ølrøret og majstangen</h2>
          <p className="kat-lede">Ét design styrer fire lag, så boksen ligner en del af baren og ikke noget, der bare er stillet ind.</p>
          <div className="kat-theme">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="kat-box kat-glow" src={`${IMG}/boks-heidis.png`} alt="Selfi Boks i Heidi's-design" />
            <div className="kat-layers">
              <div>
                <b>Top og sider</b>
                Et honningkagehjerte fra Oktoberfest med jeres logo i glasuren og hvede og humle fra logoet ved siden af. Et 4-liters ølrør på den ene side og en majstang i grønt og hvidt med kringle og ølkrus på den anden. Vi printer delene selv i jeres farver.
                <Swatches keys={["green", "yellow", "white", "ginger", "beer"]} />
              </div>
              <div>
                <b>Lysring</b>Gult og varmt hvidt, mens den venter. Studielys, når billedet tages.
                <Swatches keys={["yellow", "white"]} />
              </div>
              <div>
                <b>Skærm</b>Alperne med flagranker, logoet, »Afterski hver weekend« og »Sig «Prost!»«.
              </div>
              <div>
                <b>Hvert foto og hver video</b>Jeres grønne ramme med logoet og byen, eller bryggeriets ramme, når der er kampagne.
              </div>
            </div>
          </div>
          <p className="kat-fine kat-push" style={{ marginBottom: 100 }}>
            Konceptdesign udarbejdet til Heidi&apos;s Bier Bar. Navn og logo bruges kun med jeres tilladelse.
          </p>
          <Stripes />
          <Folio n={4} />
        </Page>

        {/* 05 I 3D */}
        <Page n={5} cap="Boksen i 3D" dark>
          <span className="kat-kicker">Boksen i 3D</span>
          <h2>Se den fra alle sider</h2>
          <p className="kat-lede">Træk i boksen for at dreje den. Hjertet, ølrøret og majstangen er printede dele på den samme boks, så den kan få et andet design til Oktoberfest eller en firmafest.</p>
          <div className="kat-3d-wrap">
            <Box3D poster={`${IMG}/boks-heidis.png`} alt="Heidi's-boksen i 3D. Træk for at dreje den." />
          </div>
          <div className="kat-angles">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="kat-box" src={`${IMG}/boks-heidis-skraa-venstre.png`} alt="Heidi's-boksen set skråt fra venstre med majstangen forrest" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="kat-box" src={`${IMG}/boks-heidis-skraa-hoejre.png`} alt="Heidi's-boksen set skråt fra højre med ølrøret forrest" />
          </div>
          <Stripes />
          <Folio n={5} />
        </Page>

        {/* 06 SEKS BARER */}
        <Page n={6} cap="Seks barer">
          <span className="kat-kicker">Seks barer, én kæde</span>
          <h2>Samme boks, hver sin by</h2>
          <p className="kat-lede">Boksene ser ens ud i alle barer, men rammen siger, hvor festen var. Alt styres fra ét kontrolpanel, så en ny kampagne er live i alle seks barer på én gang.</p>
          <div className="kat-frames">
            <figure>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${IMG}/foto-heidis.jpg`} alt="Heidi's grønne ramme med logoet og Aalborg" />
              <figcaption>Jeres egen ramme med byen. Her Aalborg.</figcaption>
            </figure>
            <figure>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${IMG}/foto-oktoberfest.jpg`} alt="Oktoberfest-rammen med flagranker, Heidi's-logoet og plads til bryggeriets logo" />
              <figcaption>Bryggeriets ramme til Oktoberfest, med plads til deres logo.</figcaption>
            </figure>
          </div>
          <div className="kat-cities">
            {BARS.map((b) => (
              <div key={b.city}><b>{b.city}</b><span>{b.street}</span></div>
            ))}
          </div>
          <Stripes height={20} />
          <Folio n={6} />
        </Page>

        {/* 07 BRANDING */}
        <Page n={7} cap="Branding">
          <span className="kat-kicker">Branding</span>
          <h2>Heidi&apos;s på hvert opslag</h2>
          <p className="kat-lede">Alt, der kommer ud af boksen, bærer jeres ramme. Når gæsterne deler på Instagram, TikTok og Snapchat, følger Heidi&apos;s med ud i deres feeds.</p>
          <div className="kat-brand">
            <div className="kat-phone" aria-label="Eksempel på et opslag på Instagram med Heidi's-rammen">
              <div className="kat-phone-bar">
                <i />
                <span>
                  <b>mathilde.aal</b>
                  <small>Heidi&apos;s Bier Bar Aalborg</small>
                </span>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${IMG}/foto-heidis.jpg`} alt="Foto af fire venner i Heidi's-rammen" />
              <div className="kat-phone-foot">
                <span className="kat-phone-heart">♥</span> 214 synes godt om
                <p>
                  <b>mathilde.aal</b> Afterski uden sne 🍺🎿 #heidisbierbar
                </p>
              </div>
            </div>
            <ul className="kat-points">
              <li><b>Ramme på alt</b><span>Logo og by på hvert foto, hver video og hver GIF.</span></li>
              <li><b>Klar til stories</b><span>Formater til feed, story og reels, så rammen sidder rigtigt overalt.</span></li>
              <li><b>Jeres hashtag</b><span>#heidisbierbar og byens tag er sat ind, når gæsten deler.</span></li>
              <li><b>Delingssiden</b><span>Siden med fotoet linker til bordbooking, events og næste bier pong-turnering.</span></li>
              <li><b>Plads til partnere</b><span>Et bryggeri eller et spiritusmærke kan overtage rammen i en periode.</span></li>
            </ul>
          </div>
          <p className="kat-fine kat-push" style={{ marginBottom: 70 }}>Eksempel på et opslag. Navn og tal er opdigtede.</p>
          <Stripes height={18} />
          <Folio n={7} />
        </Page>

        {/* 08 VIDEO */}
        <Page n={8} cap="Video og GIF" dark>
          <span className="kat-kicker">Video og GIF</span>
          <h2>Den bedste skål i byen</h2>
          <p className="kat-lede">Boksen har mikrofon og optager korte videoer og GIF&apos;er. Bordet løfter glassene, råber »Prost!«, og jeres intro og ramme sidder på hver video.</p>
          <div className="kat-rec">
            <div className="kat-rec-screen" aria-label="Boksens skærm under optagelse af en skål">
              <span className="kat-rec-top">
                <i /> Optager · 0:04 / 0:10
              </span>
              <span className="kat-rec-q">Løft glassene og giv os jeres bedste skål!</span>
              <span className="kat-rec-heart">🍺</span>
              <span className="kat-rec-bar"><i /></span>
            </div>
            <div className="kat-places">
              <div><h3>Til jeres SoMe</h3><p>Ugens bedste skåle, klippet sammen til et opslag fra hver by.</p></div>
              <div><h3>Til bryggeriet</h3><p>Ægte stemning fra Oktoberfest, som de kan bruge i deres egen markedsføring.</p></div>
              <div><h3>Til skærmene i baren</h3><p>Aftenens bedste klip på storskærmen, mens festen er i gang.</p></div>
              <div><h3>Til vennerne</h3><p>Videoen sendes som et link på SMS, så dem der ikke kom med, ved hvor de skal være næste fredag.</p></div>
            </div>
          </div>
          <div className="kat-specs kat-push" style={{ marginBottom: 80 }}>
            <div>Længde<span>3 til 10 sekunder, I bestemmer</span></div>
            <div>Lyd<span>Mikrofon med støjfilter til en fuld bar</span></div>
            <div>Ramme<span>Jeres intro, logo og by på hver video</span></div>
          </div>
          <Folio n={8} />
        </Page>

        {/* 09 GÆSTERNES HISTORIER */}
        <Page n={9} cap="Gæsternes historier">
          <span className="kat-kicker">Gæsternes historier</span>
          <h2>Gæsterne laver jeres content</h2>
          <p className="kat-lede">Skærmen stiller et spørgsmål, og gæsten svarer på video. Med deres samtykke bliver svarene til jeres content, uden at I selv skal filme.</p>
          <div className="kat-qs">
            <span>Hvem på bordet synger højest?</span>
            <span>Hvad fejrer I i aften?</span>
            <span>Jäger eller Flügel?</span>
            <span>Hvem vinder bier pong i aften?</span>
            <span>Hvilken sang skal DJ&apos;en spille nu?</span>
            <span>Sig skål på tre sprog</span>
          </div>
          <div className="kat-steps kat-steps--3 kat-steps--light" style={{ marginTop: 10 }}>
            <div><b>1</b><h3>I vælger spørgsmålene</h3><p>Skift dem fra aften til aften eller til de store uger.</p></div>
            <div><b>2</b><h3>Gæsten svarer</h3><p>10 sekunder på video. Gæsten siger ja til, at I må bruge klippet.</p></div>
            <div><b>3</b><h3>I bruger det</h3><p>Klippene ligger sorteret pr. by i kontrolpanelet, klar til SoMe og storskærm.</p></div>
          </div>
          <div className="kat-quotes kat-push" style={{ marginBottom: 70 }}>
            <blockquote>»Vi fejrer, at det er fredag. Det er grund nok.«<span>Eksempel på et svar</span></blockquote>
            <blockquote>»Prost, skål og cheers. Og så en runde til.«<span>Eksempel på et svar</span></blockquote>
          </div>
          <Stripes height={18} />
          <Folio n={9} />
        </Page>

        {/* 10 CASES 1 */}
        <Page n={10} cap="Cases" dark>
          <span className="kat-kicker">Cases · 1 af 2</span>
          <h2>Ti måder at bruge boksene på</h2>
          <p className="kat-lede">Aktiviteterne tilpasses Heidi&apos;s og jeres gæster. Her er de første fem.</p>
          <div className="kat-cases" style={{ marginBottom: 80 }}>
            {CASES.slice(0, 5).map((c) => (
              <Case key={c.title} c={c} />
            ))}
          </div>
          <Folio n={10} />
        </Page>

        {/* 11 CASES 2 */}
        <Page n={11} cap="Cases" dark>
          <span className="kat-kicker">Cases · 2 af 2</span>
          <h2>Og fem mere</h2>
          <p className="kat-lede">Alle cases kan kombineres, og hver bar kan køre sin egen, mens kampagnerne kører i dem alle.</p>
          <div className="kat-cases" style={{ marginBottom: 80 }}>
            {CASES.slice(5).map((c) => (
              <Case key={c.title} c={c} />
            ))}
          </div>
          <Folio n={11} />
        </Page>

        {/* 12 KONTROLPANEL */}
        <Page n={12} cap="Kontrolpanelet">
          <span className="kat-kicker">Kontrolpanelet</span>
          <h2>Alle seks barer på én skærm</h2>
          <p className="kat-lede">Følg fotos, videoer og delinger live i hver by, skift ramme i alle barer på én gang, og vis bryggeriet, hvad deres ramme gav.</p>
          <div className="kat-panel">
            <div className="nav">
              <div className="tabs">
                <span className="on">Overblik</span>
                <span>Barer</span>
                <span>Klip</span>
                <span>Rammer</span>
              </div>
              <span className="loc">Heidi&apos;s · 6 barer</span>
            </div>
            <div className="tiles tiles--4">
              <div className="tile"><span className="lab">Fotos i aften</span><span className="num">{kr(1842)}</span></div>
              <div className="tile"><span className="lab">Videoer</span><span className="num">{kr(236)}</span></div>
              <div className="tile"><span className="lab">Delt på SoMe</span><span className="num g">{kr(1377)}</span></div>
              <div className="tile"><span className="lab">Klip klar til brug</span><span className="num">48</span></div>
            </div>
            <div className="card">
              <div className="row h"><span>Bar</span><span>Ramme</span><span className="r">Fotos</span><span className="r">Videoer</span></div>
              <div className="row"><span>Aalborg</span><span className="st">Oktoberfest</span><span className="r">512</span><span className="r">71</span></div>
              <div className="row"><span>Aarhus</span><span className="st">Oktoberfest</span><span className="r">438</span><span className="r">55</span></div>
              <div className="row"><span>København</span><span className="st">Oktoberfest</span><span className="r">401</span><span className="r">49</span></div>
              <div className="row"><span>Herning</span><span className="st">Polterabend</span><span className="r">227</span><span className="r">28</span></div>
              <div className="row"><span>Sønderborg</span><span className="st">Heidi&apos;s</span><span className="r">151</span><span className="r">19</span></div>
              <div className="row"><span>Thisted</span><span className="st">Bier pong-finalen</span><span className="r">113</span><span className="r">14</span></div>
            </div>
            <div className="card theme">
              <span className="lab">Byernes kamp i oktober</span>
              <b>Aalborg fører med 74 billeder</b>
              <span className="btn">Vis</span>
            </div>
          </div>
          <p className="kat-fine kat-push" style={{ marginBottom: 70 }}>
            Eksempel med opdigtede tal. Klip vises først, når gæsten har givet samtykke.
          </p>
          <Stripes height={18} />
          <Folio n={12} />
        </Page>

        {/* 13 OPSÆTNING */}
        <Page n={13} cap="Opsætning">
          <span className="kat-kicker">Opsætning og drift</span>
          <h2>Hvor boksene står i baren</h2>
          <p className="kat-lede">Boksene hænger på væggen. I hænger dem selv op med vægbeslaget og vores korte guide, og vi passer og opdaterer dem, så I kun skal tænke på festen.</p>
          <div className="kat-setup2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="kat-box" src={`${IMG}/boks-heidis.png`} alt="Selfi Boks i Heidi's-design" />
            <div className="kat-places">
              <div><h3>Ved baren</h3><p>Hvor ølrørene bliver hentet, og bordet samles til et billede.</p></div>
              <div><h3>Ved dansegulvet</h3><p>Midt i festen, hvor energien er højest.</p></div>
              <div><h3>Ved bier pong-bordet</h3><p>Holdbilledet før kampen og vinderbilledet bagefter.</p></div>
              <div><h3>På terrassen</h3><p>Om sommeren, hvor gæsterne står ude, som i Jomfru Anes Gård.</p></div>
              <div><h3>I lokalet til grupper</h3><p>Polterabender, fødselsdage og firmafester med eget navn på rammen.</p></div>
            </div>
          </div>
          <div className="kat-specs kat-specs--light kat-push" style={{ marginBottom: 70 }}>
            <div>Montering<span>Vægbeslag, I hænger den selv op</span></div>
            <div>Strøm<span>230 V, én stikkontakt pr. boks</span></div>
            <div>Service<span>Vi passer boksene og skifter rammer i alle barer</span></div>
          </div>
          <Stripes height={18} />
          <Folio n={13} />
        </Page>

        {/* 14 BAGSIDE */}
        <Page n={14} cap="Bagside" dark>
          <Bunting />
          <span className="kat-kicker">Næste skridt</span>
          <h2>Lad os bygge jeres boks</h2>
          <p className="kat-lede">Vi gør designet og aktiviteterne færdige sammen med jer og starter i én bar, før de andre fem følger med.</p>
          <div className="kat-steps kat-steps--3" style={{ marginTop: 22 }}>
            <div><b>1</b><h3>Vi aftaler</h3><p>Hvilke barer, placeringer, aktiviteter og den første kampagne.</p></div>
            <div><b>2</b><h3>Vi bygger</h3><p>Hjerte, sider, skærm og rammer i jeres design.</p></div>
            <div><b>3</b><h3>I får content</h3><p>Fotos, videoer og historier fra hver bar, hver weekend.</p></div>
          </div>
          <div className="kat-contact">
            <span className="kat-kicker">Jeres kontakt</span>
            <b>Holdet bag Selfi</b>
            <a href="/erhverv#kontakt">selfi.dk/erhverv · Book en snak</a>
          </div>
          <div className="kat-push" style={{ marginBottom: 140 }}>
            <Lockup size={40} />
          </div>
          <Stripes />
          <Folio n={14} />
        </Page>
      </Viewer>
    </div>
  );
}
