import type { Metadata } from "next";
import { Archivo_Black } from "next/font/google";
import { Logo } from "@/components/Logo";
import { Viewer } from "@/components/katalog/Viewer";
import "@/components/katalog/katalog.css";
import "./aab.css";
import { Box3D } from "./Box3D";

// selfi.dk/erhverv/aab: the sales catalogue for AaB, thirteen A4 pages that print to a PDF.
// The box is shown only in the AaB design (the top of the home shirt with the crest, a fan scarf and a
// floodlight mast). No prices: they are agreed per deal. It is a proposal for one club, so it stays out of
// search and the sitemap.

const partner = Archivo_Black({ subsets: ["latin", "latin-ext"], weight: "400", variable: "--font-partner" });

export const metadata: Metadata = {
  title: "Selfi × AaB | Salgskatalog",
  description: "Forslag til AaB: Selfi Boks i de bolchestribede farver med AaB-logoet, videohilsner til holdet, fansenes egne historier, aktiviteter på kampdagen og AaB på hvert foto, der deles.",
  alternates: { canonical: "/erhverv/aab" },
  robots: { index: false, follow: false },
};

const IMG = "/katalog/aab";
const PAL = { red: "#c4161d", bright: "#ed1c24", darkred: "#870e12", white: "#f7f7f5", night: "#0e1730", grass: "#2f7d3a", steel: "#8d939b" };

const BOXES = 3;
const kr = (n: number) => n.toLocaleString("da-DK");

// Broad red and white stripes like the 2026/27 home shirt, along the bottom of a page.
function Stripes({ height = 34 }: { height?: number }) {
  return <div className="kat-stripes" aria-hidden="true" style={{ height }} />;
}

// Two floodlight banks in the top corners of the dark pages, like the stadium at night.
function Floodlights() {
  const bank = (
    <svg viewBox="0 0 60 40">
      <rect x="1" y="1" width="58" height="38" rx="7" />
      {[0, 1, 2].map((i) => [0, 1].map((j) => <circle key={`${i}${j}`} cx={14 + i * 16} cy={13 + j * 14} r="5" />))}
    </svg>
  );
  return (
    <div className="kat-flood" aria-hidden="true">
      <span className="l">{bank}</span>
      <span className="r">{bank}</span>
    </div>
  );
}

function Lockup({ size = 34 }: { size?: number }) {
  return (
    <span className="kat-lockup" style={{ "--lk": `${size}px` } as React.CSSProperties}>
      <Logo size={size} href="/erhverv" />
      <span className="kat-times">×</span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/models/aab/logo.svg" alt="AaB" className="kat-partner-logo" />
    </span>
  );
}

function Folio({ n }: { n: number }) {
  return (
    <div className="kat-folio">
      <span>Selfi × AaB</span>
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

// Ten ways the boxes can work for AaB, each from a different angle of the club and the match day.
const CASES: { title: string; angle: string; text: string; gain: string }[] = [
  { title: "»Kom så AaB!«", angle: "Branding", text: "Boksen tæller ned, og hele gruppen råber »Kom så AaB!«, når billedet tages. Logoet står på rammen, og billedet bliver klubbens reklame, når det deles.", gain: "AaB-logoet på hvert eneste billede fra kampdagen" },
  { title: "Kampens fanfoto", angle: "SoMe", text: "Fansene stemmer på dagens bedste billede. Vinderen vises på storskærmen i pausen og på klubbens kanaler efter kampen.", gain: "Nyt indhold til storskærm og SoMe hver kamp" },
  { title: "Hilsen til holdet", angle: "Opbakning", text: "Fansene optager korte hilsner før kampen. De bedste bliver klippet sammen og vist for spillerne og på storskærmen før kickoff.", gain: "Fans, der føler sig tæt på holdet" },
  { title: "Selfie med spillerne", angle: "Events", text: "Til sæsonpremieren eller en fandag står spillerne ved boksen. Hvert billede får rammen med spillerens navn og nummer.", gain: "Kø ved boksen og billeder, der bliver delt" },
  { title: "Min første AaB-kamp", angle: "Familie", text: "Børn til deres første kamp får en særlig ramme med dato og modstander. Forældrene får billedet på telefonen med det samme.", gain: "Nye fans, der husker dagen" },
  { title: "Sponsorernes lounge", angle: "Sponsor", text: "En boks i loungen med partnerens logo i hjørnet af rammen. Kontrolpanelet viser bagefter, hvor mange fotos og delinger kampen gav.", gain: "Sponsorværdi med tal, I kan vise frem" },
  { title: "Årskortets ramme", angle: "Loyalitet", text: "Årskortholdere scanner deres kort og får en ramme med »Årskort 2026/27«. Ved sidste hjemmekamp samles deres billeder til et sæsonalbum.", gain: "Ekstra værdi i årskortet" },
  { title: "Næste kamp er ét tryk væk", angle: "Salg", text: "Siden, hvor fansene henter deres foto, har links til billetter til næste hjemmekamp og til fanshoppen, lige når stemningen er bedst.", gain: "Billet- og merchandisesalg fra kampdagen" },
  { title: "De store kampe", angle: "Kampagne", text: "Sæsonpremieren, derbyet, sidste hjemmekamp og jubilæer får hver deres ramme og skærm, som vi skifter fra kontrolpanelet.", gain: "Hver stor kamp ser anderledes ud på billederne" },
  { title: "Løb ind med holdet", angle: "Konkurrence", text: "Alle billeder i sæsonen er lodder i en konkurrence om at være maskot, løbe ind med holdet eller se en kamp fra loungen.", gain: "Fans, der kommer igen hele sæsonen" },
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

export default function AaBKatalog() {
  return (
    <div className={`kat kat--aab ${partner.variable}`}>
      <Viewer>
        {/* 01 FORSIDE */}
        <Page n={1} cap="Forside" dark>
          <Floodlights />
          <div className="kat-top">
            <Lockup />
            <span className="kat-kicker">Forslag · 2026/27</span>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="kat-box kat-glow" src={`${IMG}/boks-aab.png`} alt="Selfi Boks i AaB-design med toppen af den rød-hvide hjemmebanetrøje og AaB-logoet, et halstørklæde på den ene side og en lysmast på den anden" style={{ width: 330, marginTop: 4 }} />
          <h1 className="kat-center">Kom så AaB på hvert foto</h1>
          <p className="kat-lede kat-center">Et udkast til AaB: en boks i de bolchestribede farver, der laver billeder, videohilsner og historier fra fansene, som klubben kan bruge.</p>
          <Stripes />
        </Page>

        {/* 02 BREV */}
        <Page n={2} cap="Brev">
          <span className="kat-kicker">Til AaB</span>
          <h2>Fansene laver allerede stemningen</h2>
          <p className="kat-lede" style={{ maxWidth: "44ch" }}>
            På en kampdag synger tusindvis af fans i rødt og hvidt, og hele familier tager billeder foran stadion. De øjeblikke findes hver kamp, men de fleste bliver aldrig fanget. Selfi Boks er bygget i jeres eget design: toppen af hjemmebanetrøjen med logoet på brystet, et halstørklæde på den ene side og en lysmast på den anden. Den tager billeder og videoer, stiller fansene spørgsmål og sætter AaB-logoet på alt, der bliver delt. I får omtale hver kamp og content, I ikke selv har skullet lave.
          </p>
          <div className="kat-sign">
            <b>Med rød-hvide hilsner</b>
            <span>Holdet bag Selfi</span>
          </div>
          <p className="kat-quote">Fra tribunen til hele Nordjyllands feeds.</p>
          <span className="kat-kicker" style={{ marginTop: 32 }}>
            Det vi har bygget forslaget på
          </span>
          <div className="kat-facts" style={{ marginBottom: 100 }}>
            <div><b>1885</b><span>Aalborg Boldspilklub af 1885</span></div>
            <div><b>4</b><span>Danske mesterskaber: 1995, 1999, 2008 og 2014</span></div>
            <div><b>Striberne</b><span>De bolchestribede, i brede striber på trøjen</span></div>
            <div><b>Hjemme</b><span>Aalborg Portland Park</span></div>
          </div>
          <Stripes height={26} />
          <Folio n={2} />
        </Page>

        {/* 03 SÅDAN VIRKER DEN */}
        <Page n={3} cap="Sådan virker den" dark>
          <span className="kat-kicker">Sådan virker den</span>
          <h2>Fire trin fra jubel til opslag</h2>
          <p className="kat-lede">Fansene klarer det selv. Intet personale, ingen app, intet login. Det virker også i myldretiden før kickoff.</p>
          <div className="kat-screen-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="kat-screen" src="/models/aab/screen.png" alt="Boksens skærm med AaB-logoet over et stadion om aftenen, en rød-hvid tribune og teksten Råb Kom så AaB" />
          </div>
          <div className="kat-steps kat-steps--4" style={{ marginBottom: 80 }}>
            <div><b>1</b><h3>Tryk</h3><p>Lysringen kalder. Et tryk på skærmen starter.</p></div>
            <div><b>2</b><h3>Vælg</h3><p>Foto, videohilsen eller dagens spørgsmål.</p></div>
            <div><b>3</b><h3>3-2-1 AaB</h3><p>Ringen tæller ned og giver studielys, også i aftenkampe.</p></div>
            <div><b>4</b><h3>Del</h3><p>Billedet kommer på SMS med AaB-rammen.</p></div>
          </div>
          <Folio n={3} />
        </Page>

        {/* 04 DESIGNET */}
        <Page n={4} cap="Designet" dark>
          <Floodlights />
          <span className="kat-kicker">Designet</span>
          <h2>Trøjen, tørklædet og lysmasten</h2>
          <p className="kat-lede">Ét design styrer fire lag, så boksen ligner en del af klubben og ikke noget, der er stillet ind på stadion.</p>
          <div className="kat-theme">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="kat-box kat-glow" src={`${IMG}/boks-aab.png`} alt="Selfi Boks i AaB-design" />
            <div className="kat-layers">
              <div>
                <b>Top og sider</b>
                Toppen af hjemmebanetrøjen med brede striber, hvid krave og logoet på brystet. Et halstørklæde på den ene side og en lysmast over banen på den anden. Vi printer delene selv i klubbens farver.
                <Swatches keys={["red", "white", "darkred", "night", "grass"]} />
              </div>
              <div>
                <b>Lysring</b>Hvid og rød, mens den venter, med en rød glød bag boksen. Studielys, når billedet tages.
                <Swatches keys={["white", "bright"]} />
              </div>
              <div>
                <b>Skærm</b>Stadion om aftenen med lysmaster, logoet, en rød-hvid tribune og »Råb «Kom så AaB!»«.
              </div>
              <div>
                <b>Hvert foto og hver video</b>Rød ramme med logoet og Aalborg Portland Park på alt, der bliver delt.
              </div>
            </div>
          </div>
          <p className="kat-fine kat-push" style={{ marginBottom: 110 }}>
            Konceptdesign udarbejdet til AaB. Navn og logo bruges kun med jeres tilladelse.
          </p>
          <Stripes />
          <Folio n={4} />
        </Page>

        {/* 05 I 3D */}
        <Page n={5} cap="Boksen i 3D" dark>
          <Floodlights />
          <span className="kat-kicker">Boksen i 3D</span>
          <h2>Se den fra alle sider</h2>
          <p className="kat-lede">Træk i boksen for at dreje den. Trøjen, tørklædet og lysmasten er printede dele, der klikkes på den samme boks, så den kan skifte til et andet design til en partner eller en stor kamp.</p>
          <div className="kat-3d-wrap">
            <Box3D poster={`${IMG}/boks-aab.png`} alt="AaB-boksen i 3D. Træk for at dreje den." />
          </div>
          <div className="kat-angles">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="kat-box" src={`${IMG}/boks-aab-skraa-venstre.png`} alt="AaB-boksen set skråt fra venstre med halstørklædet forrest" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="kat-box" src={`${IMG}/boks-aab-skraa-hoejre.png`} alt="AaB-boksen set skråt fra højre med lysmasten forrest" />
          </div>
          <Stripes />
          <Folio n={5} />
        </Page>

        {/* 06 BRANDING */}
        <Page n={6} cap="Branding">
          <span className="kat-kicker">Branding</span>
          <h2>AaB på hvert opslag</h2>
          <p className="kat-lede">Alt, der kommer ud af boksen, bærer jeres ramme. Når fansene deler på Instagram, TikTok og Snapchat, følger logoet med ud i deres feeds.</p>
          <div className="kat-brand">
            <div className="kat-phone" aria-label="Eksempel på et opslag på Instagram med AaB-rammen">
              <div className="kat-phone-bar">
                <i />
                <span>
                  <b>mathilde.kj</b>
                  <small>Aalborg Portland Park</small>
                </span>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${IMG}/foto-aab.jpg`} alt="Foto af fire venner med AaB's røde ramme, logoet og teksten Aalborg Portland Park" />
              <div className="kat-phone-foot">
                <span className="kat-phone-heart">♥</span> 214 synes godt om
                <p>
                  <b>mathilde.kj</b> Kom så AaB! ❤️🤍 #AaB
                </p>
              </div>
            </div>
            <ul className="kat-points">
              <li><b>Ramme på alt</b><span>Logo på hvert foto, hver video og hver GIF.</span></li>
              <li><b>Klar til stories</b><span>Formater til feed, story og reels, så rammen sidder rigtigt overalt.</span></li>
              <li><b>Jeres hashtag</b><span>#AaB og jeres tekst er sat ind, når fansen deler.</span></li>
              <li><b>Delingssiden</b><span>Siden med fotoet har logoet og links til billetter, fanshop og klubbens kanaler.</span></li>
              <li><b>Plads til partnere</b><span>En sponsor kan få en hjørneplads på rammen eller overtage den til en kamp.</span></li>
            </ul>
          </div>
          <p className="kat-fine kat-push" style={{ marginBottom: 80 }}>Eksempel på et opslag. Navn og tal er opdigtede.</p>
          <Stripes height={18} />
          <Folio n={6} />
        </Page>

        {/* 07 VIDEOHILSNER */}
        <Page n={7} cap="Videohilsner" dark>
          <span className="kat-kicker">Videohilsner</span>
          <h2>»Kom så, drenge!«</h2>
          <p className="kat-lede">Boksen har mikrofon og optager korte videohilsner. Fansene sender dem til holdet, til vennerne, der blev hjemme, eller til sig selv. Jeres intro og ramme sidder på hver hilsen.</p>
          <div className="kat-rec">
            <div className="kat-rec-screen" aria-label="Boksens skærm under optagelse af en videohilsen">
              <span className="kat-rec-top">
                <i /> Optager · 0:07 / 0:15
              </span>
              <span className="kat-rec-q">Send holdet en hilsen før kampen</span>
              <span className="kat-rec-heart">⚽</span>
              <span className="kat-rec-bar"><i /></span>
            </div>
            <div className="kat-places">
              <div><h3>Til holdet</h3><p>De bedste hilsner bliver klippet sammen og vist for spillerne før kampen.</p></div>
              <div><h3>Til storskærmen</h3><p>Hilsner fra fansene i pausen, med navn og plads på tribunen.</p></div>
              <div><h3>Til dem derhjemme</h3><p>Stemningen fra stadion sendt med det samme som et link på SMS.</p></div>
              <div><h3>Til os selv næste sæson</h3><p>Hilsenen sendes til fansen igen, når den nye sæson starter.</p></div>
            </div>
          </div>
          <div className="kat-specs kat-push" style={{ marginBottom: 80 }}>
            <div>Længde<span>5 til 15 sekunder, I bestemmer</span></div>
            <div>Lyd<span>Mikrofon med støjfilter til fuld tribune</span></div>
            <div>Ramme<span>Jeres intro, logo og afslutning på hver video</span></div>
          </div>
          <Folio n={7} />
        </Page>

        {/* 08 FANSENES HISTORIER */}
        <Page n={8} cap="Fansenes historier">
          <span className="kat-kicker">Fansenes historier</span>
          <h2>Fansene laver jeres content</h2>
          <p className="kat-lede">Skærmen stiller et spørgsmål, og fansen svarer på video. Med deres samtykke bliver svarene til klubbens content, uden at I selv skal filme.</p>
          <div className="kat-qs">
            <span>Hvad er dit bedste AaB-minde?</span>
            <span>Hvem tog dig med til din første kamp?</span>
            <span>Hvad ender kampen i dag?</span>
            <span>Hvem er den bedste AaB-spiller nogensinde?</span>
            <span>Beskriv AaB med ét ord</span>
            <span>Hvad betyder AaB for dig?</span>
          </div>
          <div className="kat-steps kat-steps--3 kat-steps--light" style={{ marginTop: 10 }}>
            <div><b>1</b><h3>I vælger spørgsmålene</h3><p>Skift dem fra kamp til kamp eller til de store dage.</p></div>
            <div><b>2</b><h3>Fansen svarer</h3><p>15 sekunder på video. Fansen siger ja til, at I må bruge klippet.</p></div>
            <div><b>3</b><h3>I bruger det</h3><p>Klippene ligger sorteret i kontrolpanelet, klar til SoMe, storskærm og kampagner.</p></div>
          </div>
          <div className="kat-quotes kat-push" style={{ marginBottom: 80 }}>
            <blockquote>»Min far tog mig med. Nu tager jeg min datter med.«<span>Eksempel på et svar</span></blockquote>
            <blockquote>»Rød og hvid. Det er ikke en farve, det er en følelse.«<span>Eksempel på et svar</span></blockquote>
          </div>
          <Stripes height={18} />
          <Folio n={8} />
        </Page>

        {/* 09 CASES 1 */}
        <Page n={9} cap="Cases" dark>
          <span className="kat-kicker">Cases · 1 af 2</span>
          <h2>Ti måder at bruge boksene på</h2>
          <p className="kat-lede">Aktiviteterne tilpasses AaB og jeres fans. Her er de første fem.</p>
          <div className="kat-cases" style={{ marginBottom: 80 }}>
            {CASES.slice(0, 5).map((c) => (
              <Case key={c.title} c={c} />
            ))}
          </div>
          <Folio n={9} />
        </Page>

        {/* 10 CASES 2 */}
        <Page n={10} cap="Cases" dark>
          <span className="kat-kicker">Cases · 2 af 2</span>
          <h2>Og fem mere</h2>
          <p className="kat-lede">Alle cases kan kombineres, og I kan skifte mellem dem fra kamp til kamp.</p>
          <div className="kat-cases" style={{ marginBottom: 80 }}>
            {CASES.slice(5).map((c) => (
              <Case key={c.title} c={c} />
            ))}
          </div>
          <Folio n={10} />
        </Page>

        {/* 11 KONTROLPANEL */}
        <Page n={11} cap="Kontrolpanelet">
          <span className="kat-kicker">Kontrolpanelet</span>
          <h2>Hele kampdagen på én skærm</h2>
          <p className="kat-lede">Følg fotos, videoer og delinger live, hent fansenes klip, skift ramme og spørgsmål, og slå aktiviteter til fra telefonen.</p>
          <div className="kat-panel">
            <div className="nav">
              <div className="tabs">
                <span className="on">Overblik</span>
                <span>Bokse</span>
                <span>Klip</span>
                <span>Aktiviteter</span>
              </div>
              <span className="loc">AaB · {BOXES} bokse</span>
            </div>
            <div className="tiles tiles--4">
              <div className="tile"><span className="lab">Fotos i dag</span><span className="num">{kr(1342)}</span></div>
              <div className="tile"><span className="lab">Videohilsner</span><span className="num">{kr(218)}</span></div>
              <div className="tile"><span className="lab">Delt på SoMe</span><span className="num g">{kr(1027)}</span></div>
              <div className="tile"><span className="lab">Klip klar til brug</span><span className="num">46</span></div>
            </div>
            <div className="card">
              <div className="row h"><span>Tid</span><span>Aktivitet</span><span className="r">Fotos</span><span className="r">Videoer</span></div>
              <div className="row"><span>16–17 · fanzonen</span><span className="st">Kom så AaB</span><span className="r">312</span><span className="r">41</span></div>
              <div className="row"><span>17–18 · ved indgangen</span><span className="st">Hilsen til holdet</span><span className="r">288</span><span className="r">96</span></div>
              <div className="row"><span>17–18 · loungen</span><span className="st">Sponsorens ramme</span><span className="r">164</span><span className="r">22</span></div>
              <div className="row"><span>18.45–19 · pausen</span><span className="st">Kampens fanfoto</span><span className="r">241</span><span className="r">18</span></div>
              <div className="row"><span>20–21 · fanzonen</span><span className="st">Min første kamp</span><span className="r">337</span><span className="r">41</span></div>
            </div>
            <div className="card theme">
              <span className="lab">Dagens spørgsmål</span>
              <b>Hvad er dit bedste AaB-minde?</b>
              <span className="btn">Skift</span>
            </div>
          </div>
          <p className="kat-fine kat-push" style={{ marginBottom: 80 }}>
            Eksempel med opdigtede tal. Klip vises først, når fansen har givet samtykke.
          </p>
          <Stripes height={18} />
          <Folio n={11} />
        </Page>

        {/* 12 OPSÆTNING */}
        <Page n={12} cap="Opsætning">
          <span className="kat-kicker">Opsætning og drift</span>
          <h2>Hvor boksene står på stadion</h2>
          <p className="kat-lede">Boksene hænger på væggen. I hænger dem selv op med vægbeslaget og vores korte guide, og vi passer og opdaterer dem, så I kun skal tænke på kampen.</p>
          <div className="kat-setup2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="kat-box" src={`${IMG}/boks-aab.png`} alt="Selfi Boks i AaB-design" />
            <div className="kat-places">
              <div><h3>I fanzonen</h3><p>Hvor fansene samles før kampen og har tid til et billede med vennerne.</p></div>
              <div><h3>Ved indgangen</h3><p>Første billede på vej ind, sidste hilsen på vej hjem.</p></div>
              <div><h3>I loungen</h3><p>Til sponsorer og partnere, med deres logo på rammen.</p></div>
              <div><h3>I fanshoppen</h3><p>Et billede i den nye trøje, lige når den er købt.</p></div>
              <div><h3>Til de store dage</h3><p>Ekstra bokse til sæsonpremiere, fandag og sidste hjemmekamp.</p></div>
            </div>
          </div>
          <div className="kat-specs kat-specs--light kat-push" style={{ marginBottom: 80 }}>
            <div>Montering<span>Vægbeslag, I hænger den selv op</span></div>
            <div>Strøm<span>230 V, én stikkontakt pr. boks</span></div>
            <div>Service<span>Vi passer boksene og skifter design til de store kampe</span></div>
          </div>
          <Stripes height={18} />
          <Folio n={12} />
        </Page>

        {/* 13 BAGSIDE */}
        <Page n={13} cap="Bagside" dark>
          <Floodlights />
          <span className="kat-kicker">Næste skridt</span>
          <h2>Lad os bygge jeres boks</h2>
          <p className="kat-lede">Vi gør designet og aktiviteterne færdige sammen med jer og har boksene klar til næste hjemmekamp.</p>
          <div className="kat-steps kat-steps--3" style={{ marginTop: 22 }}>
            <div><b>1</b><h3>Vi aftaler</h3><p>Antal bokse, placeringer, aktiviteter og spørgsmål.</p></div>
            <div><b>2</b><h3>Vi bygger</h3><p>Top, sider, skærm og ramme i jeres design.</p></div>
            <div><b>3</b><h3>I får content</h3><p>Fotos, hilsner og historier fra hver kamp.</p></div>
          </div>
          <div className="kat-contact">
            <span className="kat-kicker">Jeres kontakt</span>
            <b>Holdet bag Selfi</b>
            <a href="/erhverv#kontakt">selfi.dk/erhverv · Book en snak</a>
          </div>
          <div className="kat-push" style={{ marginBottom: 150 }}>
            <Lockup size={40} />
          </div>
          <Stripes />
          <Folio n={13} />
        </Page>
      </Viewer>
    </div>
  );
}
