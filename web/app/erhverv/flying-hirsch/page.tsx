import type { Metadata } from "next";
import { Alfa_Slab_One } from "next/font/google";
import { Logo } from "@/components/Logo";
import { Viewer } from "@/components/katalog/Viewer";
import "@/components/katalog/katalog.css";
import "./flying-hirsch.css";

// selfi.dk/erhverv/flying-hirsch: the sales catalogue for Flying Hirsch, twelve A4 pages that print to a PDF.
// The box is shown only in the Flying Hirsch design (an afterski hut with the bar's own logo). No prices:
// they are agreed per deal. It is a proposal for one bar, so it stays out of search and the sitemap.

const partner = Alfa_Slab_One({ subsets: ["latin", "latin-ext"], weight: "400", variable: "--font-partner" });

export const metadata: Metadata = {
  title: "Selfi × Flying Hirsch | Salgskatalog",
  description: "Forslag til Flying Hirsch: Selfi Boks bygget som en afterski-hytte med jeres logo, videohilsner, gæsternes egne historier, aktiviteter og Flying Hirsch på hvert foto, der deles.",
  alternates: { canonical: "/erhverv/flying-hirsch" },
  robots: { index: false, follow: false },
};

const IMG = "/katalog/flying-hirsch";
const PAL = { black: "#0d0b0a", darkred: "#43060a", red: "#c8181f", fur: "#89633d", brown: "#65421f", tan: "#c59b6d", white: "#f8f7f4", stone: "#6b6f78", pine: "#1d4a35" };

const BOXES = 2;
const kr = (n: number) => n.toLocaleString("da-DK");

// Snowflakes on the dark pages, at fixed spots so screen and print look the same.
const FLAKES: [number, number, number][] = [
  [5, 16, 16], [21, 12, 11], [85, 8, 16], [70, 4, 10], [92, 21, 13], [13, 29, 10], [61, 17, 9], [39, 7, 9], [79, 33, 12], [6, 43, 9],
];

function Snow({ n = FLAKES.length }: { n?: number }) {
  return (
    <div className="kat-snow" aria-hidden="true">
      {FLAKES.slice(0, n).map(([x, y, s], i) => (
        <svg key={i} viewBox="0 0 24 24" style={{ left: `${x}%`, top: `${y}%`, width: s, height: s }}>
          <path d="M12 2v20M3.3 7l17.4 10M3.3 17 20.7 7" />
        </svg>
      ))}
    </div>
  );
}

// The Alps behind the hut: grey peaks with snow, the pine forest, and the log wall at the bottom.
function Peaks({ height }: { height?: number }) {
  return (
    <div className="kat-peaks" aria-hidden="true">
      <svg viewBox="0 0 420 110" preserveAspectRatio="none" style={height ? { height } : undefined}>
        <path fill={PAL.stone} d="M0 70 L46 30 L72 48 L118 8 L160 52 L196 30 L238 62 L286 14 L326 50 L362 28 L420 60 V110 H0Z" />
        <path fill={PAL.white} d="M100 24 L118 8 L136 28 L126 24 L118 32 L110 23Z M270 28 L286 14 L302 30 L292 27 L286 34 L278 26Z M36 39 L46 30 L56 37 L48 36 L44 41Z M352 34 L362 28 L372 34 L364 34Z" />
        <path fill={PAL.pine} d="M0 86 L10 70 L20 86 L28 66 L38 86 L52 74 L62 88 L78 64 L92 88 L106 72 L118 88 L134 68 L148 88 L160 76 L174 90 L190 66 L204 88 L220 74 L232 90 L248 68 L262 90 L276 76 L290 90 L306 66 L320 88 L334 74 L346 90 L362 70 L376 88 L390 76 L404 90 L420 72 V110 H0Z" />
        <path fill={PAL.white} d="M0 96 C60 88 120 100 200 92 S340 88 420 96 V110 H0Z" />
      </svg>
      <div className="kat-planks" />
    </div>
  );
}

function Lockup({ size = 34 }: { size?: number }) {
  return (
    <span className="kat-lockup" style={{ "--lk": `${size}px` } as React.CSSProperties}>
      <Logo size={size} href="/erhverv" />
      <span className="kat-times">×</span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/models/flying_hirsch/logo.svg" alt="Flying Hirsch" className="kat-partner-logo" />
    </span>
  );
}

function Folio({ n, light }: { n: number; light?: boolean }) {
  return (
    <div className={`kat-folio${light ? " kat-folio--on-hills" : ""}`}>
      <span>Selfi × Flying Hirsch</span>
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

// Ten ways the boxes can work at Flying Hirsch, each from a different angle of the bar.
const CASES: { title: string; angle: string; text: string; gain: string }[] = [
  { title: "»Sig Prost!«", angle: "Branding", text: "Boksen tæller ned, og hele bordet råber »Prost!«, når billedet tages. Hirschen står på rammen, og billedet bliver jeres reklame, når det deles.", gain: "Jeres logo på hvert eneste billede fra aftenen" },
  { title: "Afterski-missioner", angle: "Stemning", text: "Små opgaver på skærmen: få et billede med en fra personalet i lederhosen, lav jeres bedste skihop, dans på bordet med en fremmed.", gain: "Gæster, der snakker på tværs af bordene" },
  { title: "Ugens vildeste foto", angle: "SoMe", text: "Gæsterne stemmer på ugens vildeste billede. Vinderne får en runde og vises på storskærmen og jeres kanaler.", gain: "Grund til at komme igen næste weekend" },
  { title: "Ønsk en sang til gondolen", angle: "Musik", text: "Gæsten optager et kort ønske på video, og DJ'en i gondolen får det på sin skærm. De bedste ønsker bliver spillet og råbt op.", gain: "DJ og gæster, der laver festen sammen" },
  { title: "Temafester med egen ramme", angle: "Events", text: "Påskebal, skiferie i uge 7, fastelavn og julefrokost får hver deres ramme og skærm, som vi skifter fra kontrolpanelet.", gain: "Hver fest ser anderledes ud på billederne" },
  { title: "Klubbernes aften", angle: "Lokalt", text: "Når byens sportsklubber fejrer en sejr eller ser kampen hos jer, får holdet sin egen ramme og et holdbillede, der kan deles med det samme.", gain: "Klubberne vælger jer som deres sted" },
  { title: "Fødselsdag i hytten", angle: "Booking", text: "Når et selskab booker bord til en fødselsdag, får fødselaren sin egen ramme med navn, og alle billeder samles i ét album.", gain: "Flere bordbookinger til fester" },
  { title: "Næste fest er ét tryk væk", angle: "Salg", text: "Siden, hvor gæsten henter sit foto, har links til jeres næste events og bordbooking. Lige når stemningen er bedst.", gain: "Salg fra den bedste aften i ugen" },
  { title: "Bryggeriets time", angle: "Sponsor", text: "En leverandør overtager rammen og skærmen i en aftalt time, fx fra 22 til 23. Kontrolpanelet viser bagefter, hvor mange fotos og delinger timen gav.", gain: "Sponsorplads med tal, I kan vise frem" },
  { title: "Vind en skiferie", angle: "Konkurrence", text: "Alle billeder i sæsonen er lodder i en konkurrence om en skiferie sammen med en partner. Vinderen trækkes på en stor festaften.", gain: "Gæster, der kommer igen hele sæsonen" },
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

export default function FlyingHirschKatalog() {
  return (
    <div className={`kat kat--fh ${partner.variable}`}>
      <Viewer>
        {/* 01 FORSIDE */}
        <Page n={1} cap="Forside" dark>
          <Snow />
          <div className="kat-top">
            <Lockup />
            <span className="kat-kicker">Forslag · 2027</span>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="kat-box kat-glow" src={`${IMG}/boks-flying-hirsch.png`} alt="Selfi Boks bygget som en afterski-hytte med Flying Hirsch-logoet på toppen, ski på den ene side og et bjerg med gondoler på den anden" style={{ width: 340, marginTop: 4 }} />
          <h1 className="kat-center">Prost på hvert foto</h1>
          <p className="kat-lede kat-center">Et udkast til Flying Hirsch: en boks bygget som jeres afterski-hytte, der laver billeder, videohilsner og historier fra gæsterne, som I kan bruge.</p>
          <Peaks />
        </Page>

        {/* 02 BREV */}
        <Page n={2} cap="Brev">
          <span className="kat-kicker">Til Flying Hirsch</span>
          <h2>Jeres gæster laver allerede festen</h2>
          <p className="kat-lede" style={{ maxWidth: "44ch" }}>
            Hos jer står folk på bordene, synger med og skåler med nogen, de mødte for ti minutter siden. De øjeblikke findes hver weekend, de bliver bare ikke fanget. Selfi Boks er bygget i jeres eget design: en hytte med sne på taget, Hirschen på toppen og ski op ad væggen. Den tager billeder og videoer, stiller gæsterne spørgsmål og sætter jeres logo på alt, der bliver delt. I får omtale hver weekend og content, I ikke selv har skullet lave.
          </p>
          <div className="kat-sign">
            <b>Prost og kærlig hilsen</b>
            <span>Holdet bag Selfi</span>
          </div>
          <p className="kat-quote">Fra hytten i Søndergade til hele byens feeds.</p>
          <span className="kat-kicker" style={{ marginTop: 32 }}>
            Det vi har bygget forslaget på
          </span>
          <div className="kat-facts" style={{ marginBottom: 120 }}>
            <div><b>Hytten</b><span>Råt træ og afterski midt i Frederikshavn</span></div>
            <div><b>Gondolen</b><span>DJ&apos;en spiller fra en gammel gondollift</span></div>
            <div><b>Lederhosen</b><span>Personalet er klædt på til afterski</span></div>
            <div><b>Fri entré</b><span>The Craziest Afterskibar</span></div>
          </div>
          <Peaks height={64} />
          <Folio n={2} light />
        </Page>

        {/* 03 SÅDAN VIRKER DEN */}
        <Page n={3} cap="Sådan virker den" dark>
          <span className="kat-kicker">Sådan virker den</span>
          <h2>Fire trin fra skål til opslag</h2>
          <p className="kat-lede">Gæsterne klarer det selv. Intet personale, ingen app, intet login. Det virker også klokken fire om natten.</p>
          <div className="kat-screen-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="kat-screen" src="/models/flying_hirsch/screen.png" alt="Boksens skærm med Flying Hirsch-logoet, bjerge, en gondol og teksten Sig Prost" />
          </div>
          <div className="kat-steps kat-steps--4" style={{ marginBottom: 80 }}>
            <div><b>1</b><h3>Tryk</h3><p>Lysringen kalder. Et tryk på skærmen starter.</p></div>
            <div><b>2</b><h3>Vælg</h3><p>Foto, videohilsen eller aftenens spørgsmål.</p></div>
            <div><b>3</b><h3>3-2-1 Prost</h3><p>Ringen tæller ned og giver studielys, også midt på dansegulvet.</p></div>
            <div><b>4</b><h3>Del</h3><p>Billedet kommer på SMS med Flying Hirschs ramme.</p></div>
          </div>
          <Folio n={3} />
        </Page>

        {/* 04 DESIGNET */}
        <Page n={4} cap="Designet" dark>
          <Snow n={6} />
          <span className="kat-kicker">Designet</span>
          <h2>En hytte i hytten</h2>
          <p className="kat-lede">Ét design styrer fire lag, så boksen ligner en del af baren og ikke noget, der er stillet ind i den.</p>
          <div className="kat-theme">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="kat-box kat-glow" src={`${IMG}/boks-flying-hirsch.png`} alt="Selfi Boks i Flying Hirsch-design" />
            <div className="kat-layers">
              <div>
                <b>Top og sider</b>
                Hyttens gavl med sne på taget og jeres logo foran. Ski op ad bjælkevæggen på den ene side, bjerget med gondoler på den anden. Vi printer delene selv i jeres farver.
                <Swatches keys={["black", "red", "darkred", "fur", "tan", "white"]} />
              </div>
              <div>
                <b>Lysring</b>Varm hvid og rød, mens den venter, med en rød glød bag boksen. Studielys, når billedet tages.
                <Swatches keys={["white", "red"]} />
              </div>
              <div>
                <b>Skærm</b>Hirschen over bjergene, en gondol på vej op og »Sig Prost!«.
              </div>
              <div>
                <b>Hvert foto og hver video</b>Sort ramme med jeres logo og Flying Hirsch · Frederikshavn på alt, der bliver delt.
              </div>
            </div>
          </div>
          <p className="kat-fine kat-push" style={{ marginBottom: 150 }}>
            Konceptdesign udarbejdet til Flying Hirsch. Navn og logo bruges kun med jeres tilladelse.
          </p>
          <Peaks />
          <Folio n={4} light />
        </Page>

        {/* 05 BRANDING */}
        <Page n={5} cap="Branding">
          <span className="kat-kicker">Branding</span>
          <h2>Hirschen på hvert opslag</h2>
          <p className="kat-lede">Alt, der kommer ud af boksen, bærer jeres ramme. Når gæsterne deler på Instagram, TikTok og Snapchat, følger jeres logo med ud i deres feeds.</p>
          <div className="kat-brand">
            <div className="kat-phone" aria-label="Eksempel på et opslag på Instagram med Flying Hirschs ramme">
              <div className="kat-phone-bar">
                <i />
                <span>
                  <b>mathilde.kj</b>
                  <small>Flying Hirsch, Frederikshavn</small>
                </span>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${IMG}/foto-flying-hirsch.jpg`} alt="Foto af fire venner med Flying Hirschs sorte ramme, logoet og teksten Flying Hirsch · Frederikshavn" />
              <div className="kat-phone-foot">
                <span className="kat-phone-heart">♥</span> 187 synes godt om
                <p>
                  <b>mathilde.kj</b> Prost! 🍻 #flyinghirsch
                </p>
              </div>
            </div>
            <ul className="kat-points">
              <li><b>Ramme på alt</b><span>Logo på hvert foto, hver video og hver GIF.</span></li>
              <li><b>Klar til stories</b><span>Formater til feed, story og reels, så rammen sidder rigtigt overalt.</span></li>
              <li><b>Jeres hashtag</b><span>#flyinghirsch og jeres tekst er sat ind, når gæsten deler.</span></li>
              <li><b>Delingssiden</b><span>Siden med fotoet har jeres logo og links til events, bordbooking og jeres kanaler.</span></li>
              <li><b>Plads til partnere</b><span>Et bryggeri eller en leverandør kan få en hjørneplads på rammen eller overtage den i en aftalt periode.</span></li>
            </ul>
          </div>
          <p className="kat-fine kat-push" style={{ marginBottom: 86 }}>Eksempel på et opslag. Navn og tal er opdigtede.</p>
          <Folio n={5} />
        </Page>

        {/* 06 VIDEOHILSNER */}
        <Page n={6} cap="Videohilsner" dark>
          <Snow n={5} />
          <span className="kat-kicker">Videohilsner</span>
          <h2>»Kom herned, nu!«</h2>
          <p className="kat-lede">Boksen har mikrofon og optager korte videohilsner. Gæsterne sender dem til vennerne, der blev hjemme, til fødselaren eller til sig selv. Jeres intro og ramme sidder på hver hilsen.</p>
          <div className="kat-rec">
            <div className="kat-rec-screen" aria-label="Boksens skærm under optagelse af en videohilsen">
              <span className="kat-rec-top">
                <i /> Optager · 0:07 / 0:15
              </span>
              <span className="kat-rec-q">Send en hilsen til dem, der blev hjemme</span>
              <span className="kat-rec-heart">🍻</span>
              <span className="kat-rec-bar"><i /></span>
            </div>
            <div className="kat-places">
              <div><h3>Kom herned</h3><p>Vennerne derhjemme ser festen og når at komme, før aftenen er slut.</p></div>
              <div><h3>Tillykke fra hytten</h3><p>Hele bordet synger for fødselaren, sendt med det samme som et link på SMS.</p></div>
              <div><h3>Til os selv om et år</h3><p>Hilsenen sendes til gæsten igen, når næste sæsons store fest nærmer sig.</p></div>
              <div><h3>Til DJ&apos;en</h3><p>Ønsker og hilsner fra gæsterne kan vises i gondolen og på storskærmen.</p></div>
            </div>
          </div>
          <div className="kat-specs kat-push" style={{ marginBottom: 80 }}>
            <div>Længde<span>5 til 15 sekunder, I bestemmer</span></div>
            <div>Lyd<span>Mikrofon med støjfilter til fuld musik</span></div>
            <div>Ramme<span>Jeres intro, logo og afslutning på hver video</span></div>
          </div>
          <Folio n={6} />
        </Page>

        {/* 07 GÆSTERNES HISTORIER */}
        <Page n={7} cap="Gæsternes historier">
          <span className="kat-kicker">Gæsternes historier</span>
          <h2>Gæsterne laver jeres content</h2>
          <p className="kat-lede">Skærmen stiller et spørgsmål, og gæsten svarer på video. Med deres samtykke bliver svarene til jeres content, uden at I selv skal filme.</p>
          <div className="kat-qs">
            <span>Hvad er det vildeste, du har set på Flying Hirsch?</span>
            <span>Beskriv aftenen med ét ord</span>
            <span>Hvem er du her med i aften?</span>
            <span>Hvilken sang får dig op på bordet?</span>
            <span>Hvad er din bedste afterski-historie?</span>
            <span>Hvem skåler du for i aften?</span>
          </div>
          <div className="kat-steps kat-steps--3 kat-steps--light" style={{ marginTop: 10 }}>
            <div><b>1</b><h3>I vælger spørgsmålene</h3><p>Skift dem fra aften til aften eller til hver temafest.</p></div>
            <div><b>2</b><h3>Gæsten svarer</h3><p>15 sekunder på video. Gæsten siger ja til, at I må bruge klippet.</p></div>
            <div><b>3</b><h3>I bruger det</h3><p>Klippene ligger sorteret i kontrolpanelet, klar til SoMe og jeres næste event.</p></div>
          </div>
          <div className="kat-quotes kat-push" style={{ marginBottom: 86 }}>
            <blockquote>»Man kommer for én øl og går hjem i lederhosen.«<span>Eksempel på et svar</span></blockquote>
            <blockquote>»Det er skiferie uden ski. Og det er bedre.«<span>Eksempel på et svar</span></blockquote>
          </div>
          <Folio n={7} />
        </Page>

        {/* 08 CASES 1 */}
        <Page n={8} cap="Cases" dark>
          <span className="kat-kicker">Cases · 1 af 2</span>
          <h2>Ti måder at bruge boksene på</h2>
          <p className="kat-lede">Aktiviteterne tilpasses Flying Hirsch og jeres gæster. Her er de første fem.</p>
          <div className="kat-cases" style={{ marginBottom: 80 }}>
            {CASES.slice(0, 5).map((c) => (
              <Case key={c.title} c={c} />
            ))}
          </div>
          <Folio n={8} />
        </Page>

        {/* 09 CASES 2 */}
        <Page n={9} cap="Cases" dark>
          <span className="kat-kicker">Cases · 2 af 2</span>
          <h2>Og fem mere</h2>
          <p className="kat-lede">Alle cases kan kombineres, og I kan skifte mellem dem fra aften til aften.</p>
          <div className="kat-cases" style={{ marginBottom: 80 }}>
            {CASES.slice(5).map((c) => (
              <Case key={c.title} c={c} />
            ))}
          </div>
          <Folio n={9} />
        </Page>

        {/* 10 KONTROLPANEL */}
        <Page n={10} cap="Kontrolpanelet">
          <span className="kat-kicker">Kontrolpanelet</span>
          <h2>Hele hytten på én skærm</h2>
          <p className="kat-lede">Følg fotos, videoer og delinger live, hent gæsternes klip, skift ramme og spørgsmål, og slå aktiviteter til fra telefonen.</p>
          <div className="kat-panel">
            <div className="nav">
              <div className="tabs">
                <span className="on">Overblik</span>
                <span>Bokse</span>
                <span>Klip</span>
                <span>Aktiviteter</span>
              </div>
              <span className="loc">Flying Hirsch · {BOXES} bokse</span>
            </div>
            <div className="tiles tiles--4">
              <div className="tile"><span className="lab">Fotos i aften</span><span className="num">{kr(486)}</span></div>
              <div className="tile"><span className="lab">Videohilsner</span><span className="num">{kr(92)}</span></div>
              <div className="tile"><span className="lab">Delt på SoMe</span><span className="num g">{kr(371)}</span></div>
              <div className="tile"><span className="lab">Klip klar til brug</span><span className="num">28</span></div>
            </div>
            <div className="card">
              <div className="row h"><span>Tid</span><span>Aktivitet</span><span className="r">Fotos</span><span className="r">Videoer</span></div>
              <div className="row"><span>21–22 · ved baren</span><span className="st">Sig Prost</span><span className="r">64</span><span className="r">11</span></div>
              <div className="row"><span>22–23 · ved baren</span><span className="st">Bryggeriets time</span><span className="r">118</span><span className="r">19</span></div>
              <div className="row"><span>23–00 · ved gondolen</span><span className="st">Ønsk en sang</span><span className="r">97</span><span className="r">34</span></div>
              <div className="row"><span>00–01 · ved gondolen</span><span className="st">Missioner</span><span className="r">121</span><span className="r">16</span></div>
              <div className="row"><span>01–02 · ved baren</span><span className="st">Vildeste foto</span><span className="r">86</span><span className="r">12</span></div>
            </div>
            <div className="card theme">
              <span className="lab">Aftenens spørgsmål</span>
              <b>Hvilken sang får dig op på bordet?</b>
              <span className="btn">Skift</span>
            </div>
          </div>
          <p className="kat-fine kat-push" style={{ marginBottom: 86 }}>
            Eksempel med opdigtede tal. Klip vises først, når gæsten har givet samtykke.
          </p>
          <Folio n={10} />
        </Page>

        {/* 11 OPSÆTNING */}
        <Page n={11} cap="Opsætning">
          <span className="kat-kicker">Opsætning og drift</span>
          <h2>Hvor boksene står i hytten</h2>
          <p className="kat-lede">Boksene hænger på væggen. I hænger dem selv op med vægbeslaget og vores korte guide, og vi passer og opdaterer dem, så I kun skal tænke på gæsterne.</p>
          <div className="kat-setup2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="kat-box" src={`${IMG}/boks-flying-hirsch.png`} alt="Selfi Boks i Flying Hirsch-design" />
            <div className="kat-places">
              <div><h3>Ved baren</h3><p>Hvor folk venter på næste omgang og har hænderne fri til en skål.</p></div>
              <div><h3>Ved gondolen</h3><p>Tæt på DJ&apos;en, hvor ønsker og hilsner bliver til en del af festen.</p></div>
              <div><h3>Ved indgangen</h3><p>Første billede på vej ind, sidste hilsen på vej hjem.</p></div>
              <div><h3>Til de store fester</h3><p>Ekstra bokse til påskebal, skiferie-uger og julefrokoster.</p></div>
              <div><h3>Til partnere</h3><p>Toppen og siderne kan skiftes, så et bryggeri kan få sin egen boks for en aften.</p></div>
            </div>
          </div>
          <div className="kat-specs kat-specs--light kat-push" style={{ marginBottom: 80 }}>
            <div>Montering<span>Vægbeslag, I hænger den selv op</span></div>
            <div>Strøm<span>230 V, én stikkontakt pr. boks</span></div>
            <div>Service<span>Vi passer boksene og skifter design til hver fest</span></div>
          </div>
          <Folio n={11} />
        </Page>

        {/* 12 BAGSIDE */}
        <Page n={12} cap="Bagside" dark>
          <Snow n={8} />
          <span className="kat-kicker">Næste skridt</span>
          <h2>Lad os bygge jeres hytte</h2>
          <p className="kat-lede">Vi gør designet og aktiviteterne færdige sammen med jer og har boksene klar til næste store fest.</p>
          <div className="kat-steps kat-steps--3" style={{ marginTop: 22 }}>
            <div><b>1</b><h3>Vi aftaler</h3><p>Antal bokse, placeringer, aktiviteter og spørgsmål.</p></div>
            <div><b>2</b><h3>Vi bygger</h3><p>Top, sider, skærm og ramme i jeres design.</p></div>
            <div><b>3</b><h3>I får content</h3><p>Fotos, hilsner og historier fra hver weekend.</p></div>
          </div>
          <div className="kat-contact">
            <span className="kat-kicker">Jeres kontakt</span>
            <b>Holdet bag Selfi</b>
            <a href="/erhverv#kontakt">selfi.dk/erhverv · Book en snak</a>
          </div>
          <div className="kat-push" style={{ marginBottom: 200 }}>
            <Lockup size={40} />
          </div>
          <Peaks />
          <Folio n={12} light />
        </Page>
      </Viewer>
    </div>
  );
}
