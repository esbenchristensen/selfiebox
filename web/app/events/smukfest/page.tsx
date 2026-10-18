import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { Logo } from "@/components/Logo";
import { Viewer } from "@/components/katalog/Viewer";
import "@/components/katalog/katalog.css";

// selfi.dk/events/smukfest: the sales catalogue for Smukfest, twelve A4 pages that print to a PDF.
// The box is shown only in the Smukfest design from the showroom on /events. No prices: they are agreed per deal.
// It is a proposal for one festival, so it stays out of search and the sitemap.

const partner = Outfit({ subsets: ["latin", "latin-ext"], weight: ["700", "800"], variable: "--font-partner" });

export const metadata: Metadata = {
  title: "Selfi × Smukfest | Salgskatalog",
  description: "Forslag til Smukfest 2027: Selfi Boks i Smukfests eget design med videohilsner, publikums egne historier, aktiviteter og Smukfest på hvert foto, der deles.",
  alternates: { canonical: "/events/smukfest" },
  robots: { index: false, follow: false },
};

const IMG = "/katalog/smukfest";
const PAL = { base: "#0f3d24", forest: "#1c5a33", leaf: "#3f8f3a", lime: "#9cc94a", red: "#e2001a", cream: "#f6eedc", bark: "#5a3b22" };

const BOXES = 6;
const kr = (n: number) => n.toLocaleString("da-DK");

// Hearts scattered on the dark pages, at fixed spots so screen and print look the same.
const HEARTS: [number, number, number][] = [
  [4, 17, 12], [22, 14, 9], [84, 9, 12], [70, 4, 8], [92, 22, 10], [14, 30, 8], [62, 18, 7], [40, 8, 7], [78, 34, 9], [5, 44, 7],
];

function Hearts({ n = HEARTS.length }: { n?: number }) {
  return (
    <div className="kat-hearts" aria-hidden="true">
      {HEARTS.slice(0, n).map(([x, y, s], i) => (
        <svg key={i} viewBox="0 0 24 24" style={{ left: `${x}%`, top: `${y}%`, width: s, height: s }}>
          <path d="M12 21C5 15 2 11.2 2 7.6A4.6 4.6 0 0 1 12 5a4.6 4.6 0 0 1 10 2.6C22 11.2 19 15 12 21Z" />
        </svg>
      ))}
    </div>
  );
}

// The rolling hills from the Smukfest screen: forest, leaf and lime, with the red ribbon at the bottom.
function Hills({ height }: { height?: number }) {
  return (
    <div className="kat-hills" aria-hidden="true">
      <svg viewBox="0 0 420 110" preserveAspectRatio="none" style={height ? { height } : undefined}>
        <path fill={PAL.forest} d="M0 34 C60 14 120 44 190 28 S310 10 370 30 S410 26 420 24 V110 H0Z" />
        <path fill={PAL.leaf} d="M0 58 C70 40 130 70 200 52 S320 38 380 58 L420 52 V110 H0Z" />
        <path fill={PAL.lime} d="M0 80 C80 68 150 92 230 78 S350 70 420 82 V110 H0Z" />
      </svg>
      <div className="kat-ribbon" />
    </div>
  );
}

function Lockup({ size = 34 }: { size?: number }) {
  return (
    <span className="kat-lockup" style={{ "--lk": `${size}px` } as React.CSSProperties}>
      <Logo size={size} href="/events" />
      <span className="kat-times">×</span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/models/smukfest/logo.svg" alt="Smukfest" className="kat-partner-logo" />
    </span>
  );
}

function Folio({ n, light }: { n: number; light?: boolean }) {
  return (
    <div className={`kat-folio${light ? " kat-folio--on-hills" : ""}`}>
      <span>Selfi × Smukfest</span>
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

// Ten ways the boxes can work at Smukfest, each from a different angle of the festival.
const CASES: { title: string; angle: string; text: string; gain: string }[] = [
  { title: "Skattejagt gennem Bøgeskoven", angle: "Oplevelse", text: "Seks bokse gemt rundt på pladsen. Hver boks giver et stempel og et spor til den næste. Den, der finder dem alle, er med i lodtrækningen om en backstage-tur.", gain: "Gæster, der går på opdagelse i hele skoven" },
  { title: "»Sig Smukt!«", angle: "Branding", text: "Boksen beder gæsterne om at råbe festivalens eget ord, når fotoet tages. Hjertetræet står på rammen, og billedet bliver et kærlighedsbrev til festivalen.", gain: "Jeres sprog og logo på tusindvis af billeder" },
  { title: "Årets smukkeste foto", angle: "SoMe", text: "Gæsterne stemmer på dagens bedste billede. Vinderne vises på storskærmene mellem koncerterne og på jeres kanaler dagen efter.", gain: "Engagement, der fortsætter efter festivalen" },
  { title: "Frivilligbyen fortæller", angle: "Rekruttering", text: "De frivillige fortæller på video, hvorfor de er med. Klippene bliver til næste års kampagne for at skaffe frivillige.", gain: "Ægte stemmer til jeres rekruttering" },
  { title: "Partnerens time", angle: "Sponsor", text: "En partner overtager rammen og skærmen i en aftalt time, fx fra 20 til 21 ved scenen. Kontrolpanelet viser bagefter, hvor mange fotos og delinger timen gav.", gain: "Sponsorplads med tal, I kan vise frem" },
  { title: "Missioner på campingen", angle: "Fællesskab", text: "Små opgaver på skærmen: tag et billede med nabolejren, find nogen fra et andet land, lav jeres lejrs kampråb.", gain: "Nye venskaber og billeder, der ikke ligner andre" },
  { title: "Råmateriale til aftermovien", angle: "Content", text: "Alle videoklip og svar sorteres efter emne og stemning. Jeres redaktion vælger de bedste uden at skulle filme noget selv.", gain: "Timevis af publikumsvideo, klar til klipning" },
  { title: "Pas på hinanden", angle: "Tryghed", text: "Mellem billederne viser skærmen program, vandposter og jeres tryghedsbeskeder. Beskederne skifter I selv fra kontrolpanelet.", gain: "Vigtige beskeder dér, hvor folk faktisk kigger" },
  { title: "Billetter til næste år", angle: "Salg", text: "Siden, hvor gæsten henter sit foto, har et link til jeres billetsalg. Lige når minderne er bedst, er næste års billet ét tryk væk.", gain: "Salg fra den gladeste dag på året" },
  { title: "Kunstnerens hilsen", angle: "Musik", text: "En kunstner optager en kort hilsen, som afspilles på boksene før koncerten, og publikum kan svare med deres egen.", gain: "Hype op til koncerterne" },
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

export default function SmukfestKatalog() {
  return (
    <div className={`kat ${partner.variable}`}>
      <Viewer>
        {/* 01 FORSIDE */}
        <Page n={1} cap="Forside" dark>
          <Hearts />
          <div className="kat-top">
            <Lockup />
            <span className="kat-kicker">Forslag · 2027</span>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="kat-box kat-glow" src={`${IMG}/boks-smukfest.png`} alt="Selfi Boks i Smukfest-design med hjertetræet på toppen, træer på siderne og Smukfest på skærmen" style={{ width: 360, marginTop: 6 }} />
          <h1 className="kat-center">Smukfest på hvert foto</h1>
          <p className="kat-lede kat-center">Et udkast til 2027: bokse i Bøgeskovens design, der laver billeder, videohilsner og historier fra publikum, som I kan bruge.</p>
          <Hills />
        </Page>

        {/* 02 BREV */}
        <Page n={2} cap="Brev">
          <span className="kat-kicker">Til Smukfest</span>
          <h2>Jeres publikum fortæller allerede historien</h2>
          <p className="kat-lede" style={{ maxWidth: "44ch" }}>
            Hvert år bliver Bøgeskoven til en by, hvor folk kommer for musikken og bliver for stemningen. De historier findes allerede, de bliver bare ikke fanget. Selfi Boks er bygget i Smukfests eget design, med hjertetræet på toppen og skoven på siderne. Den tager billeder og videoer, stiller publikum spørgsmål og sætter jeres logo på alt, der bliver delt. I får omtale hver dag og content, I ikke selv har skullet lave.
          </p>
          <div className="kat-sign">
            <b>Kærlig hilsen</b>
            <span>Holdet bag Selfi</span>
          </div>
          <p className="kat-quote">Fra Bøgeskoven til hele landets feeds.</p>
          <span className="kat-kicker" style={{ marginTop: 32 }}>
            Det vi har bygget forslaget på
          </span>
          <div className="kat-facts" style={{ marginBottom: 120 }}>
            <div><b>1980</b><span>Første festival i Skanderborg</span></div>
            <div><b>Non&shy;profit</b><span>Drevet af foreninger og frivillige</span></div>
            <div><b>ca. 18.000</b><span>Frivillige bygger byen hvert år</span></div>
            <div><b>Aug.</b><span>Bøgeskoven, Skanderborg</span></div>
          </div>
          <Hills height={64} />
          <Folio n={2} light />
        </Page>

        {/* 03 SÅDAN VIRKER DEN */}
        <Page n={3} cap="Sådan virker den" dark>
          <span className="kat-kicker">Sådan virker den</span>
          <h2>Fire trin fra smil til opslag</h2>
          <p className="kat-lede">Gæsterne klarer det selv. Intet personale, ingen app, intet login. Det virker også klokken tre om natten.</p>
          <div className="kat-screen-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="kat-screen" src="/models/smukfest/screen.png" alt="Boksens skærm i Smukfest-design med hjertetræet og teksten Sig Smukt" />
          </div>
          <div className="kat-steps kat-steps--4" style={{ marginBottom: 80 }}>
            <div><b>1</b><h3>Tryk</h3><p>Lysringen kalder. Et tryk på skærmen starter.</p></div>
            <div><b>2</b><h3>Vælg</h3><p>Foto, videohilsen eller dagens spørgsmål.</p></div>
            <div><b>3</b><h3>3-2-1</h3><p>Ringen tæller ned og giver studielys på ansigterne.</p></div>
            <div><b>4</b><h3>Del</h3><p>En QR-kode sender det til telefonen med Smukfests ramme.</p></div>
          </div>
          <Folio n={3} />
        </Page>

        {/* 04 TEMAET */}
        <Page n={4} cap="Designet" dark>
          <Hearts n={6} />
          <span className="kat-kicker">Designet</span>
          <h2>Smukfest, hele vejen rundt</h2>
          <p className="kat-lede">Ét design styrer fire lag, så boksen føles som en del af festivalen og ikke som noget, der er stillet ind i den.</p>
          <div className="kat-theme">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="kat-box kat-glow" src={`${IMG}/boks-smukfest.png`} alt="Selfi Boks i Smukfest-design" />
            <div className="kat-layers">
              <div>
                <b>Top og sider</b>
                Hjertetræet og navnet på toppen, skovens træer med røde hjerter på siderne. Vi printer delene selv i Smukfests farver.
                <Swatches keys={["base", "forest", "leaf", "lime", "red", "cream"]} />
              </div>
              <div>
                <b>Lysring</b>Skifter roligt mellem lime, rød og creme, mens den venter. Varm hvid, når billedet tages.
                <Swatches keys={["lime", "red", "cream"]} />
              </div>
              <div>
                <b>Skærm</b>Hjertetræet, »Sig Smukt!« og et rødt bånd med Danmarks smukkeste festival.
              </div>
              <div>
                <b>Hvert foto og hver video</b>Hjertetræet og Smukfest · Bøgeskoven på rammen af alt, der bliver delt.
              </div>
            </div>
          </div>
          <p className="kat-fine kat-push" style={{ marginBottom: 150 }}>
            Konceptdesign udarbejdet til Smukfest. Festivalens navn, logo og artwork bruges kun med jeres tilladelse.
          </p>
          <Hills />
          <Folio n={4} light />
        </Page>

        {/* 05 BRANDING */}
        <Page n={5} cap="Branding">
          <span className="kat-kicker">Branding</span>
          <h2>Jeres logo på hvert opslag</h2>
          <p className="kat-lede">Alt, der kommer ud af boksen, bærer Smukfests ramme. Når gæsterne deler på Instagram, TikTok og Snapchat, følger jeres logo med ud i deres feeds.</p>
          <div className="kat-brand">
            <div className="kat-phone" aria-label="Eksempel på et opslag på Instagram med Smukfests ramme">
              <div className="kat-phone-bar">
                <i />
                <span>
                  <b>sofie.mh</b>
                  <small>Bøgeskoven, Skanderborg</small>
                </span>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${IMG}/foto-smukfest.jpg`} alt="Foto af fire venner med Smukfests creme ramme, hjertetræet og teksten Smukfest · Bøgeskoven" />
              <div className="kat-phone-foot">
                <span className="kat-phone-heart">♥</span> 214 synes godt om
                <p>
                  <b>sofie.mh</b> Smukt! ❤️ #smukfest
                </p>
              </div>
            </div>
            <ul className="kat-points">
              <li><b>Ramme på alt</b><span>Logo og hjertetræ på hvert foto, hver video og hver GIF.</span></li>
              <li><b>Klar til stories</b><span>Formater til feed, story og reels, så rammen sidder rigtigt overalt.</span></li>
              <li><b>Jeres hashtag</b><span>#smukfest og jeres tekst er sat ind, når gæsten deler.</span></li>
              <li><b>Delingssiden</b><span>Siden med fotoet har jeres logo og links til program, billetter og jeres kanaler.</span></li>
              <li><b>Plads til partnere</b><span>En partner kan få en hjørneplads på rammen eller overtage den i en aftalt periode.</span></li>
            </ul>
          </div>
          <p className="kat-fine kat-push" style={{ marginBottom: 86 }}>Eksempel på et opslag. Navn og tal er opdigtede.</p>
          <Folio n={5} />
        </Page>

        {/* 06 VIDEOHILSNER */}
        <Page n={6} cap="Videohilsner" dark>
          <Hearts n={5} />
          <span className="kat-kicker">Videohilsner</span>
          <h2>En hilsen fra Bøgeskoven</h2>
          <p className="kat-lede">Boksen har mikrofon og optager korte videohilsner. Gæsterne sender dem hjem, til vennerne, der ikke fik billet, eller til sig selv om et år. Smukfests intro og ramme sidder på hver hilsen.</p>
          <div className="kat-rec">
            <div className="kat-rec-screen" aria-label="Boksens skærm under optagelse af en videohilsen">
              <span className="kat-rec-top">
                <i /> Optager · 0:07 / 0:15
              </span>
              <span className="kat-rec-q">Send en hilsen til dem derhjemme</span>
              <span className="kat-rec-heart">❤</span>
              <span className="kat-rec-bar"><i /></span>
            </div>
            <div className="kat-places">
              <div><h3>Hilsen hjem</h3><p>»Mor, vi har det fantastisk!« Sendt med det samme som et link på SMS.</p></div>
              <div><h3>Til dem uden billet</h3><p>Vennerne derhjemme får lyst til at komme næste år.</p></div>
              <div><h3>Til os selv om et år</h3><p>Hilsenen sendes til gæsten igen, når næste års billetsalg åbner.</p></div>
              <div><h3>Til kunstneren</h3><p>Hilsner fra publikum kan samles og vises før koncerten.</p></div>
            </div>
          </div>
          <div className="kat-specs kat-push" style={{ marginBottom: 80 }}>
            <div>Længde<span>5 til 15 sekunder, I bestemmer</span></div>
            <div>Lyd<span>Mikrofon med støjfilter til festivalpladsen</span></div>
            <div>Ramme<span>Smukfests intro, logo og afslutning på hver video</span></div>
          </div>
          <Folio n={6} />
        </Page>

        {/* 07 TESTIMONIALS */}
        <Page n={7} cap="Publikums historier">
          <span className="kat-kicker">Publikums historier</span>
          <h2>Publikum laver jeres content</h2>
          <p className="kat-lede">Skærmen stiller et spørgsmål, og gæsten svarer på video. Med deres samtykke bliver svarene til jeres content, uden at I selv skal sende et filmhold ud.</p>
          <div className="kat-qs">
            <span>Hvad er det sjoveste ved Smukfest?</span>
            <span>Beskriv Smukfest med ét ord</span>
            <span>Hvem er du her med i år?</span>
            <span>Hvilken koncert glæder du dig mest til?</span>
            <span>Hvad er dit bedste Smukfest-minde?</span>
            <span>Hvorfor kommer du igen år efter år?</span>
          </div>
          <div className="kat-steps kat-steps--3 kat-steps--light" style={{ marginTop: 10 }}>
            <div><b>1</b><h3>I vælger spørgsmålene</h3><p>Skift dem fra dag til dag eller fra scene til scene.</p></div>
            <div><b>2</b><h3>Gæsten svarer</h3><p>15 sekunder på video. Gæsten siger ja til, at I må bruge klippet.</p></div>
            <div><b>3</b><h3>I bruger det</h3><p>Klippene ligger sorteret i kontrolpanelet, klar til SoMe, aftermovie og næste års kampagne.</p></div>
          </div>
          <div className="kat-quotes kat-push" style={{ marginBottom: 86 }}>
            <blockquote>»Det er det eneste sted, hvor man siger hej til alle.«<span>Eksempel på et svar</span></blockquote>
            <blockquote>»Smukt. Det er ordet. Det hele er bare smukt.«<span>Eksempel på et svar</span></blockquote>
          </div>
          <Folio n={7} />
        </Page>

        {/* 08 CASES 1 */}
        <Page n={8} cap="Cases" dark>
          <span className="kat-kicker">Cases · 1 af 2</span>
          <h2>Ti måder at bruge boksene på</h2>
          <p className="kat-lede">Aktiviteterne tilpasses Smukfest og jeres publikum. Her er de første fem.</p>
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
          <p className="kat-lede">Alle cases kan kombineres, og I kan skifte mellem dem i løbet af festivalen.</p>
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
          <h2>Hele skoven på én skærm</h2>
          <p className="kat-lede">Følg fotos, videoer og delinger live, hent publikums klip, skift design og spørgsmål, og slå aktiviteter til fra telefonen eller kontoret.</p>
          <div className="kat-panel">
            <div className="nav">
              <div className="tabs">
                <span className="on">Overblik</span>
                <span>Bokse</span>
                <span>Klip</span>
                <span>Aktiviteter</span>
              </div>
              <span className="loc">Smukfest 2027 · {BOXES} bokse</span>
            </div>
            <div className="tiles tiles--4">
              <div className="tile"><span className="lab">Fotos i dag</span><span className="num">{kr(2412)}</span></div>
              <div className="tile"><span className="lab">Videohilsner</span><span className="num">{kr(538)}</span></div>
              <div className="tile"><span className="lab">Delt på SoMe</span><span className="num g">{kr(1876)}</span></div>
              <div className="tile"><span className="lab">Klip klar til brug</span><span className="num">94</span></div>
            </div>
            <div className="card">
              <div className="row h"><span>Boks</span><span>Aktivitet</span><span className="r">Fotos</span><span className="r">Videoer</span></div>
              <div className="row"><span>Scenepladsen, bar 1</span><span className="st">Sig Smukt</span><span className="r">612</span><span className="r">121</span></div>
              <div className="row"><span>Scenepladsen, bar 2</span><span className="st">Partnerens time</span><span className="r">498</span><span className="r">97</span></div>
              <div className="row"><span>Campingen Øst</span><span className="st">Missioner</span><span className="r">455</span><span className="r">88</span></div>
              <div className="row"><span>Campingen Vest</span><span className="st">Skattejagt</span><span className="r">371</span><span className="r">64</span></div>
              <div className="row"><span>Frivilligbyen</span><span className="st">Spørgsmål</span><span className="r">218</span><span className="r">112</span></div>
              <div className="row"><span>Skoven</span><span className="st">Skattejagt</span><span className="r">258</span><span className="r">56</span></div>
            </div>
            <div className="card theme">
              <span className="lab">Dagens spørgsmål</span>
              <b>Hvad er det sjoveste ved Smukfest?</b>
              <span className="btn">Skift</span>
            </div>
          </div>
          <p className="kat-fine kat-push" style={{ marginBottom: 86 }}>
            Eksempel med opdigtede tal og placeringer. Klip vises først, når gæsten har givet samtykke.
          </p>
          <Folio n={10} />
        </Page>

        {/* 11 OPSÆTNING */}
        <Page n={11} cap="Opsætning">
          <span className="kat-kicker">Opsætning og drift</span>
          <h2>Hvor boksene står i Bøgeskoven</h2>
          <p className="kat-lede">Boksene hænger på en væg, en stander eller en bod. Vi monterer, passer og bytter dem, så I kun skal tænke på gæsterne.</p>
          <div className="kat-setup2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="kat-box" src={`${IMG}/boks-smukfest.png`} alt="Selfi Boks i Smukfest-design" />
            <div className="kat-places">
              <div><h3>Ved scenerne</h3><p>På barerne og boderne langs pladsen, hvor folk venter på næste koncert.</p></div>
              <div><h3>På campingen</h3><p>Ved fællesområderne, hvor dagen starter og natten slutter.</p></div>
              <div><h3>Hos de frivillige</h3><p>I Frivilligbyen, hvor dem, der bygger festivalen, kan fortælle deres historie.</p></div>
              <div><h3>I skoven</h3><p>Langs stierne som stop på skattejagten.</p></div>
              <div><h3>I partnerområderne</h3><p>Toppen og siderne kan skiftes, så en partner kan få sin egen boks.</p></div>
            </div>
          </div>
          <div className="kat-specs kat-specs--light kat-push" style={{ marginBottom: 80 }}>
            <div>Montering<span>Væg, stander eller bod</span></div>
            <div>Strøm<span>230 V, én stikkontakt pr. boks</span></div>
            <div>Service<span>Vi passer boksene under hele festivalen</span></div>
          </div>
          <Folio n={11} />
        </Page>

        {/* 12 BAGSIDE */}
        <Page n={12} cap="Bagside" dark>
          <Hearts n={8} />
          <span className="kat-kicker">Næste skridt</span>
          <h2>Lad os bygge Smukfests bokse</h2>
          <p className="kat-lede">Vi gør designet og aktiviteterne færdige sammen med jer og har boksene klar til august.</p>
          <div className="kat-steps kat-steps--3" style={{ marginTop: 22 }}>
            <div><b>1</b><h3>Vi aftaler</h3><p>Antal bokse, placeringer, aktiviteter og spørgsmål.</p></div>
            <div><b>2</b><h3>Vi bygger</h3><p>Top, sider, skærm og ramme i Smukfests design.</p></div>
            <div><b>3</b><h3>I får content</h3><p>Fotos, hilsner og historier hele festivalen.</p></div>
          </div>
          <div className="kat-contact">
            <span className="kat-kicker">Jeres kontakt</span>
            <b>Holdet bag Selfi</b>
            <a href="/events#kontakt">selfi.dk/events · Book en snak</a>
          </div>
          <div className="kat-push" style={{ marginBottom: 200 }}>
            <Lockup size={40} />
          </div>
          <Hills />
          <Folio n={12} light />
        </Page>
      </Viewer>
    </div>
  );
}
