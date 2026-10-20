import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { Logo } from "@/components/Logo";
import { Viewer } from "@/components/katalog/Viewer";
import "@/components/katalog/katalog.css";
import "./airtox-dominance.css";
import { Box3D } from "./Box3D";

// selfi.dk/erhverv/airtox-dominance: the sales catalogue for Airtox Dominance Fighting Championship (ADFC), Denmark's
// largest MMA league, fifteen A4 pages that print to a PDF. The box hangs in the arena foyer and in the fight gyms in
// the league's design (the cage's octagon on top with the logo, two corner posts on the sides), and the league and its
// title sponsor Airtox are on every photo. The ideas that sell it to a fight promotion: the face-off between two fans,
// the fighter card for SoMe, photos on the big screen between fights, the countdown to the next event in the gyms, and
// the sponsor on every frame. No prices: they are agreed per deal. It stays out of search and the sitemap.

const partner = Outfit({ subsets: ["latin", "latin-ext"], weight: ["600", "800"], variable: "--font-partner" });

export const metadata: Metadata = {
  title: "Selfi × Airtox Dominance | Salgskatalog",
  description: "Forslag til Airtox Dominance FC: en Selfi Boks i ligaens sorte og orange design med burets ottekant og hjørnestolper, hvor ADFC og Airtox står på hvert foto, med face-off, fighterkort, storskærm og nedtælling til næste stævne.",
  alternates: { canonical: "/erhverv/airtox-dominance" },
  robots: { index: false, follow: false },
};

const IMG = "/katalog/airtox-dominance";
const PAL = { black: "#141414", orange: "#ee3e15", white: "#ffffff" };
const kr = (n: number) => n.toLocaleString("da-DK");

// The logo's orange bar along the top of a page.
function Rule() {
  return <div className="kat-rule" aria-hidden="true" />;
}

// A band of black and orange along the bottom of a page, like the cage's padding.
function Band({ height = 24 }: { height?: number }) {
  return <div className="kat-band" aria-hidden="true" style={{ height }} />;
}

function Lockup({ size = 34 }: { size?: number }) {
  return (
    <span className="kat-lockup" style={{ "--lk": `${size}px` } as React.CSSProperties}>
      <Logo size={size} href="/erhverv" />
      <span className="kat-times">×</span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/models/airtox_dominance/logo.svg" alt="Airtox Dominance Fighting Championship" className="kat-partner-logo" />
    </span>
  );
}

function Folio({ n }: { n: number }) {
  return (
    <div className="kat-folio">
      <span>Selfi × Airtox Dominance</span>
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

// Ten ways the box works for a fight league, from fight night in the arena to a Tuesday in the gym.
const CASES: { title: string; angle: string; text: string; gain: string }[] = [
  { title: "Face-off i foyeren", angle: "Stævneaften", text: "To fans stiller sig op over for hinanden som til indvejningen. Boksen tæller ned, lyset blinker, og billedet får »VS« og aftenens navn på rammen.", gain: "Det billede alle vil dele fra stævnet" },
  { title: "Fighterkortet", angle: "SoMe", text: "Gæsten bliver til et fighterkort i sort/hvid med navn, »Fear nothing« og ADFC-logoet. Klar til story og profilbillede.", gain: "Fansene reklamerer for ligaen" },
  { title: "Storskærmen", angle: "Arena", text: "Mellem kampene viser storskærmen de bedste face-offs fra foyeren. Gæsterne ser sig selv i hallen og går ud og tager et til.", gain: "Mere liv i pauserne" },
  { title: "Walkout-klippet", angle: "Video", text: "Boksen optager et kort klip, hvor gæsten går frem mod kameraet i lyset, som en fighter på vej i buret. Klippet får ligaens grafik.", gain: "Video, der ligner jeres egne udsendelser" },
  { title: "Mød fighterne", angle: "Meet & greet", text: "Når fighterne møder fansene, sidder fighterens navn på rammen. Fansen får billedet på telefonen, og I får det med samtykke.", gain: "Hvert møde bliver til content" },
  { title: "Næste stævne", angle: "Billetter", text: "I klubberne viser skærmen nedtælling til næste stævne og en QR-kode til billetterne. Rammen siger hvor og hvornår.", gain: "Billetsalg, hvor fansene træner" },
  { title: "Klubberne", angle: "Gyms", text: "Bokse i MMA-klubber landet rundt med klubbens navn ved siden af ADFC. Klubbens egne fightere bliver synlige på vej mod buret.", gain: "Ligaen til stede hver træningsaften" },
  { title: "Fear nothing", angle: "Sponsor", text: "Airtox står på hvert billede. Til særlige aftener får rammen Airtox' egen kampagne, fra buret til byggepladsen.", gain: "Titelsponsoren på tusindvis af billeder" },
  { title: "Akademiet", angle: "Talent", text: "Til Airtox Dominance Academy får amatørerne et billede med deres navn og klub, som venner og familie deler.", gain: "Næste generation følger ligaen" },
  { title: "Indvejningen", angle: "Pressedag", text: "Til indvejningen dagen før står boksen ved vægten. Fansene kan stille sig op som fighterne, og rammen viser vægtklassen.", gain: "Stævnet starter dagen før" },
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

export default function AirtoxDominanceKatalog() {
  return (
    <div className={`kat kat--adfc ${partner.variable}`}>
      <Viewer>
        {/* 01 FORSIDE */}
        <Page n={1} cap="Forside" dark>
          <Rule />
          <div className="kat-top">
            <Lockup />
            <span className="kat-kicker">Forslag · 2026/27</span>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="kat-box kat-glow" src={`${IMG}/boks-airtox-dominance.png`} alt="Selfi Boks i sort med Airtox Dominance-logoet på en ottekantet top og to burstolper med orange hætter på siderne" style={{ width: 460, marginTop: 4 }} />
          <h1 className="kat-center">Fansene i ringen</h1>
          <p className="kat-lede kat-center">Et udkast til Airtox Dominance: en fotoboks i ligaens design i hallen og i klubberne, der tager billeder og videoer af fansene og sætter ADFC og Airtox på alt, der deles.</p>
          <Band />
        </Page>

        {/* 02 BREV */}
        <Page n={2} cap="Brev">
          <span className="kat-kicker">Til Airtox Dominance FC</span>
          <h2>Tusindvis af fans, ingen billeder med jer</h2>
          <p className="kat-lede" style={{ maxWidth: "44ch" }}>
            Til hvert stævne fylder fansene foyeren og tager billeder af hinanden. Burets stolper og logoet ses i udsendelsen, men ikke på de billeder, fansene selv deler. Selfi Boks er bygget i jeres design med burets ottekant, hjørnestolperne og logoet. Den hænger i hallen og i klubberne, og ADFC og Airtox kommer på hvert eneste billede og hver video.
          </p>
          <div className="kat-sign">
            <b>Fear nothing</b>
            <span>Holdet bag Selfi</span>
          </div>
          <p className="kat-quote">Hver fan får sit eget face-off.</p>
          <span className="kat-kicker" style={{ marginTop: 22 }}>
            Det vi har bygget forslaget på
          </span>
          <div className="kat-facts" style={{ marginBottom: 90 }}>
            <div><b>Siden 2024</b><span>Ligaen bag Mark O. Madsen, med stævner i K.B. Hallen og Arena Randers</span></div>
            <div><b>Fansene</b><span>Fulde haller til hvert stævne og en kerne, der træner i klubber over hele landet</span></div>
            <div><b>Brandet</b><span>Hvidt og orange på sort, buret med de sorte stolper og Airtox' »Fear nothing«</span></div>
            <div><b>Behovet</b><span>Synlighed mellem stævnerne, billetsalg og content, som fansene selv deler</span></div>
          </div>
          <Band height={18} />
          <Folio n={2} />
        </Page>

        {/* 03 MODELLEN */}
        <Page n={3} cap="Modellen" dark>
          <Rule />
          <span className="kat-kicker">Modellen</span>
          <h2>Én boks, tre vindere</h2>
          <p className="kat-lede">Boksen hænger fast i foyeren i K.B. Hallen og i klubberne. Fansene bruger den hele aftenen, og alle får noget ud af det.</p>
          <div className="kat-steps kat-steps--3" style={{ marginTop: 10 }}>
            <div><b>1</b><h3>ADFC</h3><p>Logoet på hvert foto og hver video, nedtælling til næste stævne og tal på, hvad det giver.</p></div>
            <div><b>2</b><h3>Airtox</h3><p>Titelsponsoren på hvert billede og egne kampagner, når det passer.</p></div>
            <div><b>3</b><h3>Fansene</h3><p>Et face-off eller et fighterkort fra aftenen, sendt til telefonen og klar til at dele.</p></div>
          </div>
          <ul className="kat-points kat-points--dark" style={{ marginTop: 14, marginBottom: 80 }}>
            <li><b>Fast plads</b><span>Boksen hænger på væggen året rundt, ikke kun på stævneaftener.</span></li>
            <li><b>Ægte rækkevidde</b><span>Hvert billede deles af fansen selv til venner, der ligner fansen.</span></li>
            <li><b>Mere til sponsorerne</b><span>En konkret ting, I kan give Airtox og de næste partnere.</span></li>
            <li><b>Én leverandør</b><span>Vi bygger, passer og opdaterer alle bokse. I styrer det hele fra ét panel.</span></li>
          </ul>
          <Folio n={3} />
        </Page>

        {/* 04 SÅDAN VIRKER DEN */}
        <Page n={4} cap="Sådan virker den" dark>
          <Rule />
          <span className="kat-kicker">Sådan virker den</span>
          <h2>Fire trin fra face-off til opslag</h2>
          <p className="kat-lede">Fansene klarer det selv. Intet personale, ingen app og intet login. Det virker også i en mørk foyer med fuld musik.</p>
          <div className="kat-screen-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="kat-screen" src="/models/airtox_dominance/screen.png" alt="Boksens skærm i sort med Airtox Dominance-logoet og Stil dig op til face-off" />
          </div>
          <div className="kat-steps kat-steps--4" style={{ marginBottom: 80 }}>
            <div><b>1</b><h3>Tryk</h3><p>Lysringen kalder. Et tryk på skærmen starter.</p></div>
            <div><b>2</b><h3>Vælg</h3><p>Face-off, fighterkort eller et kort walkout-klip.</p></div>
            <div><b>3</b><h3>Stil jer op</h3><p>Ringen tæller ned og giver studielys, også i en mørk hal.</p></div>
            <div><b>4</b><h3>Del</h3><p>En QR-kode sender billedet til telefonen med rammen.</p></div>
          </div>
          <Folio n={4} />
        </Page>

        {/* 05 DESIGNET */}
        <Page n={5} cap="Designet" dark>
          <Rule />
          <span className="kat-kicker">Designet</span>
          <h2>Buret, stolperne og logoet</h2>
          <p className="kat-lede">Ét design styrer fire lag, så boksen ligner et stykke af jeres bur på væggen og ikke en tilfældig fotoboks.</p>
          <div className="kat-theme">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="kat-box kat-glow" src={`${IMG}/boks-airtox-dominance.png`} alt="Selfi Boks i Airtox Dominance-design" />
            <div className="kat-layers">
              <div>
                <b>Top og sider</b>
                Toppen er en sort plade med burets ottekantede hjørner og jeres logo. På siderne står to hjørnestolper med orange hætte og navnet lodret, som i buret. Få, store former i jeres egne farver. Vi printer delene selv, massive og robuste nok til en fuld foyer.
                <Swatches keys={["black", "orange", "white"]} />
              </div>
              <div>
                <b>Lysring</b>Hvidt og orange, mens den venter. Studielys, når billedet tages.
                <Swatches keys={["white", "orange"]} />
              </div>
              <div>
                <b>Skærm</b>Sort med logoet og »Stil dig op til face-off«.
              </div>
              <div>
                <b>Hvert foto og hver video</b>ADFC-logoet og aftenens stævne på rammen, eller et fighterkort.
              </div>
            </div>
          </div>
          <p className="kat-fine kat-push" style={{ marginBottom: 100 }}>
            Konceptdesign udarbejdet til Airtox Dominance. Navne og logoer bruges kun med jeres og Airtox&apos; tilladelse.
          </p>
          <Band />
          <Folio n={5} />
        </Page>

        {/* 06 I 3D */}
        <Page n={6} cap="Boksen i 3D" dark>
          <span className="kat-kicker">Boksen i 3D</span>
          <h2>Se den fra alle sider</h2>
          <p className="kat-lede">Træk i boksen for at dreje den. Toppen og siderne er printede dele på den samme boks, så den kan få et særligt design til en titelkamp eller en ny sponsor.</p>
          <div className="kat-3d-wrap">
            <Box3D poster={`${IMG}/boks-airtox-dominance.png`} alt="Airtox Dominance-boksen i 3D. Træk for at dreje den." />
          </div>
          <div className="kat-angles">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="kat-box" src={`${IMG}/boks-airtox-dominance-skraa-venstre.png`} alt="Airtox Dominance-boksen set skråt fra venstre med burstolpen forrest" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="kat-box" src={`${IMG}/boks-airtox-dominance-skraa-hoejre.png`} alt="Airtox Dominance-boksen set skråt fra højre med burstolpen forrest" />
          </div>
          <Band />
          <Folio n={6} />
        </Page>

        {/* 07 RAMMERNE */}
        <Page n={7} cap="Rammerne">
          <span className="kat-kicker">Rammerne</span>
          <h2>Face-off, fighterkort og stævnet</h2>
          <p className="kat-lede">Hvert stævne får sin egen ramme med logoet, hallen og datoen. Face-off og fighterkort gør fansen til en del af kortet.</p>
          <div className="kat-frames kat-frames--3">
            <figure>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${IMG}/foto-faceoff.jpg`} alt="To fans laver face-off i foyeren med knyttede næver, i Airtox Dominance-rammen med Face-off og K.B. Hallen" />
              <figcaption>Face-off: to fans stirrer hinanden ned som til indvejningen.</figcaption>
            </figure>
            <figure>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${IMG}/foto-fighterkort.jpg`} alt="En fan med armene over kors i sort/hvid på fighterkortet med Fear nothing og Airtox Dominance-logoet" />
              <figcaption>Fighterkortet i sort/hvid med »Fear nothing«.</figcaption>
            </figure>
            <figure>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${IMG}/foto-staevne.jpg`} alt="Fire fans jubler mod kameraet i foyeren, i stævnerammen med Airtox Dominance-logoet og K.B. Hallen med dato" />
              <figcaption>Stævnerammen med hal og dato, her fra K.B. Hallen.</figcaption>
            </figure>
          </div>
          <p className="kat-fine">Eksempelbilleder lavet med AI for at vise rammerne. Ingen rigtige gæster.</p>
          <ul className="kat-points" style={{ marginTop: 6, marginBottom: 70 }}>
            <li><b>Altid logoet</b><span>ADFC og Airtox fast på rammen, stævnet eller klubben ved siden af.</span></li>
            <li><b>Klar til stories</b><span>Formater til feed, story og reels, så rammen sidder rigtigt overalt.</span></li>
            <li><b>Delingssiden</b><span>Siden med billedet kan linke til billetterne til næste stævne.</span></li>
          </ul>
          <Band height={18} />
          <Folio n={7} />
        </Page>

        {/* 08 SÆSONEN */}
        <Page n={8} cap="Sæsonen" dark>
          <Rule />
          <span className="kat-kicker">Sæsonen</span>
          <h2>Ét klik, alle bokse</h2>
          <p className="kat-lede">I bestemmer, hvad der står på skærm og ramme i alle bokse. Fra kortet bliver offentliggjort til stævneaftenen skifter boksene selv, uden at nogen skal ud med nye skilte.</p>
          <div className="kat-night" style={{ marginTop: 6 }}>
            <div><b>6 uger</b><h3>Kortet er ude</h3><p>Hovedkampen på skærmen i klubberne og nedtælling til stævnet.</p></div>
            <div><b>1 uge</b><h3>Billetspurten</h3><p>QR-koden til billetterne fylder skærmen i alle klubber.</p></div>
            <div><b>Dagen før</b><h3>Indvejningen</h3><p>Rammen med vægten og vægtklasserne.</p></div>
            <div><b>Stævnet</b><h3>Face-off i foyeren</h3><p>Aftenens ramme og de bedste billeder på storskærmen.</p></div>
            <div><b>Dagen efter</b><h3>Resultaterne</h3><p>Vinderne på skærmen og fansenes billeder samlet til jeres SoMe.</p></div>
          </div>
          <ul className="kat-points kat-points--dark" style={{ marginTop: 16, marginBottom: 80 }}>
            <li><b>Planlæg på forhånd</b><span>Læg stævnerne ind med start og slut, så skifter boksene selv.</span></li>
            <li><b>Pr. by eller klub</b><span>Kør en ramme i én klub, én by eller i alle bokse.</span></li>
            <li><b>Sponsorernes aftener</b><span>Airtox og andre partnere kan få deres egen ramme på udvalgte aftener.</span></li>
          </ul>
          <Folio n={8} />
        </Page>

        {/* 09 CONTENT */}
        <Page n={9} cap="Content" dark>
          <Rule />
          <span className="kat-kicker">Video og content</span>
          <h2>Fansene laver jeres content</h2>
          <p className="kat-lede">Boksen optager korte videoer. Skærmen stiller et spørgsmål, fansene svarer, og med deres samtykke bliver klippene til content for ligaen og for Airtox.</p>
          <div className="kat-rec">
            <div className="kat-rec-screen" aria-label="Boksens skærm under optagelse af en video">
              <span className="kat-rec-top">
                <i /> Optager · 0:04 / 0:10
              </span>
              <span className="kat-rec-q">Hvem vinder hovedkampen i aften?</span>
              <span className="kat-rec-heart">🥊</span>
              <span className="kat-rec-bar"><i /></span>
            </div>
            <div className="kat-places">
              <div><h3>Et bibliotek fra hvert stævne</h3><p>Klip og billeder samlet ét sted, sorteret efter stævne, hal og klub.</p></div>
              <div><h3>Til jeres SoMe</h3><p>Ægte fans og ægte stemning, klar til opslag og til at sælge næste stævne.</p></div>
              <div><h3>Til udsendelsen</h3><p>Fansenes forudsigelser kan klippes ind mellem kampene.</p></div>
              <div><h3>Indsigt</h3><p>Hvad fansene svarer, viser hvem de vil se i buret næste gang.</p></div>
            </div>
          </div>
          <div className="kat-qs" style={{ marginBottom: 80 }}>
            <span>Hvem vinder hovedkampen?</span>
            <span>Hvem vil du se i buret næste gang?</span>
            <span>Hvad er din walkout-sang?</span>
            <span>Hvilken klub træner du i?</span>
            <span>Send en hilsen til din fighter</span>
          </div>
          <Folio n={9} />
        </Page>

        {/* 10 SAMTYKKE */}
        <Page n={10} cap="Samtykke og rettigheder">
          <span className="kat-kicker">Samtykke og rettigheder</span>
          <h2>Bygget til fansene og til reglerne</h2>
          <p className="kat-lede">Boksen tager billeder af fansene, ikke af kampene. Reglerne er en del af designet fra start, så I trygt kan have den i hallen og i klubberne.</p>
          <div className="kat-places kat-places--grid" style={{ marginTop: 6 }}>
            <div><h3>Kun fansene</h3><p>Boksen filmer ikke buret, så rettighederne til udsendelsen er uberørte.</p></div>
            <div><h3>Samtykke før brug</h3><p>Billeder og klip bruges kun af jer og Airtox, når fansen har sagt ja.</p></div>
            <div><h3>Børn og unge</h3><p>Fans under 15 år deler kun med en voksens samtykke, og deres billeder bruges ikke til markedsføring.</p></div>
            <div><h3>Fighternes navne</h3><p>Fighternes navne og billeder bruges kun på rammer, de selv har godkendt.</p></div>
            <div><h3>GDPR</h3><p>Selfi er databehandler, og data ligger i EU.</p></div>
            <div><h3>Godkendt af jer</h3><p>Alle rammer og spørgsmål godkendes af ADFC, før de går i luften.</p></div>
          </div>
          <p className="kat-fine kat-push" style={{ marginBottom: 70 }}>Vi tilpasser opsætningen til jeres aftaler med fightere, sponsorer og hallerne.</p>
          <Band height={18} />
          <Folio n={10} />
        </Page>

        {/* 11 CASES 1 */}
        <Page n={11} cap="Cases" dark>
          <Rule />
          <span className="kat-kicker">Cases · 1 af 2</span>
          <h2>Ti måder at bruge boksen på</h2>
          <p className="kat-lede">Aktiviteterne tilpasses ligaen, hallen og klubben. Her er de første fem.</p>
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
          <p className="kat-lede">Alle cases kan kombineres og skiftes fra stævne til stævne og fra klub til klub i kontrolpanelet.</p>
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
          <h2>Hallen og klubberne på én skærm</h2>
          <p className="kat-lede">Se billeder, videoer og delinger fra hver boks, skift ramme i alle bokse, og send rapporten til jer selv og til Airtox.</p>
          <div className="kat-panel">
            <div className="nav">
              <div className="tabs">
                <span className="on">Bokse</span>
                <span>Stævner</span>
                <span>Content</span>
                <span>Rapporter</span>
              </div>
              <span className="loc">Stævneugen</span>
            </div>
            <div className="tiles tiles--4">
              <div className="tile"><span className="lab">Aktive bokse</span><span className="num">{kr(9)}</span></div>
              <div className="tile"><span className="lab">Fotos i ugen</span><span className="num">{kr(6240)}</span></div>
              <div className="tile"><span className="lab">Delt på SoMe</span><span className="num g">{kr(4380)}</span></div>
              <div className="tile"><span className="lab">Billet-scanninger</span><span className="num">{kr(512)}</span></div>
            </div>
            <div className="card">
              <div className="row h"><span>Boks</span><span>Ramme</span><span className="r">Fotos</span><span className="r">Delt</span></div>
              <div className="row"><span>Foyeren, hal A</span><span className="st">Face-off</span><span className="r">2.910</span><span className="r">2.140</span></div>
              <div className="row"><span>Foyeren, hal B</span><span className="st">Fighterkort</span><span className="r">1.420</span><span className="r">1.012</span></div>
              <div className="row"><span>Klub, København</span><span className="st">Nedtælling</span><span className="r">644</span><span className="r">402</span></div>
              <div className="row"><span>Klub, Aarhus</span><span className="st">Nedtælling</span><span className="r">588</span><span className="r">361</span></div>
              <div className="row"><span>Klub, Odense</span><span className="st">Fighterkort</span><span className="r">421</span><span className="r">298</span></div>
            </div>
            <div className="card theme">
              <span className="lab">Ugens rapport til Airtox</span>
              <b>4.380 delte billeder med Airtox-logoet</b>
              <span className="btn">Send</span>
            </div>
          </div>
          <p className="kat-fine kat-push" style={{ marginBottom: 70 }}>
            Eksempel med opdigtede bokse og tal. Klip vises først, når fansene har givet samtykke.
          </p>
          <Band height={18} />
          <Folio n={13} />
        </Page>

        {/* 14 UDRULNING */}
        <Page n={14} cap="Udrulning">
          <span className="kat-kicker">Udrulning og drift</span>
          <h2>Fra hallen til klubberne</h2>
          <p className="kat-lede">Vi starter i foyeren og måler. Hallen og klubberne hænger selv boksen op med vægbeslaget og vores korte guide, og vi passer og opdaterer alle bokse, så I ikke skal tænke på teknikken.</p>
          <div className="kat-setup2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="kat-box" src={`${IMG}/boks-airtox-dominance.png`} alt="Selfi Boks i Airtox Dominance-design" />
            <div className="kat-places">
              <div><h3>1. Foyeren</h3><p>To bokse i K.B. Hallen til næste stævne, med tal samme aften.</p></div>
              <div><h3>2. Klubberne</h3><p>Bokse i de klubber, hvor jeres fightere træner, med nedtælling og billetter.</p></div>
              <div><h3>3. Turnéen</h3><p>Et vægbeslag i hver hal, så boksene også hænger i Randers og på de næste adresser.</p></div>
              <div><h3>Sponsorerne</h3><p>Samme boks med top og sider til en titelkamp eller en ny partner.</p></div>
            </div>
          </div>
          <div className="kat-specs kat-specs--light kat-push" style={{ marginBottom: 70 }}>
            <div>Montering<span>Vægbeslag, stedet hænger den selv op</span></div>
            <div>Strøm<span>230 V, én stikkontakt</span></div>
            <div>Service<span>Vi passer boksene og skifter rammer centralt</span></div>
          </div>
          <Band height={18} />
          <Folio n={14} />
        </Page>

        {/* 15 BAGSIDE */}
        <Page n={15} cap="Bagside" dark>
          <Rule />
          <span className="kat-kicker">Næste skridt</span>
          <h2>Lad os bygge jeres boks</h2>
          <p className="kat-lede">Vi gør designet og aktiviteterne færdige sammen med jer og starter i foyeren til næste stævne.</p>
          <div className="kat-steps kat-steps--3" style={{ marginTop: 22 }}>
            <div><b>1</b><h3>Vi aftaler</h3><p>Hal, klubber, rammer, sponsorer og hvad I vil måle på.</p></div>
            <div><b>2</b><h3>Vi bygger</h3><p>Top, sider, skærm og rammer i jeres design.</p></div>
            <div><b>3</b><h3>I får content</h3><p>Billeder, videoer og tal fra hvert stævne og hver klub.</p></div>
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
