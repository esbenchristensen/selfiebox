import type { Metadata } from "next";
import { Limelight } from "next/font/google";
import { Logo } from "@/components/Logo";
import { Viewer } from "@/components/katalog/Viewer";
import "@/components/katalog/katalog.css";
import "./palads.css";
import { Box3D } from "./Box3D";

// selfi.dk/erhverv/palads: the sales catalogue for Palads Teatret in Frederikshavn, fourteen A4 pages that
// print to a PDF. The box is shown only in the Palads design on the gen 2 unit (an art deco marquee with the
// name in bulbs, a BIO blade sign over a popcorn box and a film strip). The idea that sells it: a photo frame
// for every premiere, so each shared photo advertises the film and the distributor can pay for it. No prices:
// they are agreed per deal. It is a proposal for one cinema, so it stays out of search and the sitemap.

const partner = Limelight({ subsets: ["latin", "latin-ext"], weight: "400", variable: "--font-partner" });

export const metadata: Metadata = {
  title: "Selfi × Palads Teatret | Salgskatalog",
  description: "Forslag til Palads Teatret: Selfi Boks som et biografskilt i foyeren, med en ny fotoramme til hver premiere, publikums egne anmeldelser på video og Palads på hvert foto, der deles.",
  alternates: { canonical: "/erhverv/palads" },
  robots: { index: false, follow: false },
};

const IMG = "/katalog/palads";
const PAL = { base: "#2b2a3d", night: "#312f43", deep: "#1b1a28", gold: "#e0ae45", bulb: "#fff2c2", velvet: "#9b1c22", white: "#f7f5ee", silver: "#a7a9ba" };

const BOXES = 2;
const kr = (n: number) => n.toLocaleString("da-DK");

// A row of marquee bulbs along the bottom of a page.
function Bulbs({ height = 30 }: { height?: number }) {
  return <div className="kat-bulbs" aria-hidden="true" style={{ height }} />;
}

// The velvet curtain drawn aside in the top corners of the dark pages, like the hall before the film.
function Curtain() {
  const side = (
    <svg viewBox="0 0 60 120" preserveAspectRatio="none">
      <path d="M0 0 H60 C52 30 30 60 38 120 H0 Z" />
      <path className="f" d="M14 0 C12 40 10 80 14 120 M30 0 C27 40 24 80 26 120" />
    </svg>
  );
  return (
    <div className="kat-curtain" aria-hidden="true">
      <span className="l">{side}</span>
      <span className="r">{side}</span>
    </div>
  );
}

function Lockup({ size = 34 }: { size?: number }) {
  return (
    <span className="kat-lockup" style={{ "--lk": `${size}px` } as React.CSSProperties}>
      <Logo size={size} href="/erhverv" />
      <span className="kat-times">×</span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/models/palads/logo.svg" alt="Palads Teatret" className="kat-partner-logo" />
    </span>
  );
}

function Folio({ n }: { n: number }) {
  return (
    <div className="kat-folio">
      <span>Selfi × Palads Teatret</span>
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

// Ten ways the boxes can work for Palads, each from a different part of the cinema's year.
const CASES: { title: string; angle: string; text: string; gain: string }[] = [
  { title: "Premiererammen", angle: "Filmudlejer", text: "Hver stor premiere får sin egen ramme med filmens titel og dato. Filmudlejeren betaler for rammen, og hvert billede, der deles, er en reklame for filmen.", gain: "En ny indtægt fra filmudlejerne" },
  { title: "Gallapremiere", angle: "Events", text: "Rød løber, udklædte gæster og en ekstra boks ved indgangen. Alle billeder fra aftenen samles i et galleri, som I og filmudlejeren kan dele dagen efter.", gain: "Premieren bliver talt om i hele byen" },
  { title: "Publikums anmeldelse", angle: "Content", text: "Efter filmen giver publikum stjerner og siger én sætning på video. De bedste klip bliver til opslag om, at filmen stadig går.", gain: "Ægte anbefalinger, der sælger billetter" },
  { title: "Cheap Tuesday", angle: "Kampagne", text: "Tirsdagens ramme siger det hele: billig film, god aften. Billederne minder vennerne om, at tirsdag er biografdag.", gain: "Flere gæster på en stille ugedag" },
  { title: "Min første biograftur", angle: "Familie", text: "Børn til deres første film får en ramme med dato og film. Forældrene får billedet på telefonen med det samme.", gain: "Familier, der kommer igen" },
  { title: "Biografdaten", angle: "Par", text: "En ramme til to med »Vores film« og datoen. Delingssiden har et link til næste weekends forestillinger.", gain: "Biografen som byens bedste date" },
  { title: "Fødselsdag i biografen", angle: "Private", text: "Børnefødselsdage og private forestillinger får deres egen ramme med navn og alder, og gæsterne får billederne med hjem.", gain: "Mere salg af private arrangementer" },
  { title: "Firmaets biografaften", angle: "Erhverv", text: "Når en virksomhed lejer en sal, sidder deres logo på rammen ved siden af jeres. En god grund til at vælge Palads til næste julefrokost.", gain: "Et stærkere B2B-tilbud" },
  { title: "Koncerter og events", angle: "Program", text: "Julekoncerten, foredraget og filmserierne som Horror, Anime Filmfest og SeniorBio får hver deres skærm og ramme fra kontrolpanelet.", gain: "Hvert event ser anderledes ud på billederne" },
  { title: "Månedens publikumsfoto", angle: "Konkurrence", text: "Alle billeder i måneden er med i lodtrækningen om fribilletter og popcorn. Vinderen vises på jeres SoMe og i foyeren.", gain: "Gæster, der tager et billede hver gang" },
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

export default function PaladsKatalog() {
  return (
    <div className={`kat kat--palads ${partner.variable}`}>
      <Viewer>
        {/* 01 FORSIDE */}
        <Page n={1} cap="Forside" dark>
          <Curtain />
          <div className="kat-top">
            <Lockup />
            <span className="kat-kicker">Forslag · 2026/27</span>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="kat-box kat-glow" src={`${IMG}/boks-palads.png`} alt="Selfi Boks som et art deco-biografskilt med Palads Teatrets navn i en ramme af pærer, en filmstrimmel på den ene side og et BIO-skilt over et popcornbæger på den anden" style={{ width: 330, marginTop: 4 }} />
          <h1 className="kat-center">Hver premiere på hvert foto</h1>
          <p className="kat-lede kat-center">Et udkast til Palads Teatret: et biografskilt i foyeren, der tager billeder og videoer af publikum og sætter den nye film og Palads på alt, der deles.</p>
          <Bulbs />
        </Page>

        {/* 02 BREV */}
        <Page n={2} cap="Brev">
          <span className="kat-kicker">Til Palads Teatret</span>
          <h2>Premieren er byens aften</h2>
          <p className="kat-lede" style={{ maxWidth: "44ch" }}>
            Når en stor film har premiere, står Frederikshavn i kø i jeres foyer. Vennerne er klædt ud, børnene har glædet sig i ugevis, og alle tager billeder. De billeder bliver delt, men der står hverken Palads eller filmens titel på dem. Selfi Boks er bygget som jeres eget biografskilt med navnet i pærer. Den tager billeder og korte videoer, beder publikum anmelde filmen og sætter en ramme med filmen og Palads på alt, der bliver delt. I får omtale ved hver premiere, content I ikke selv har skullet lave, og en ramme, som filmudlejeren kan betale for.
          </p>
          <div className="kat-sign">
            <b>Med en hilsen fra første række</b>
            <span>Holdet bag Selfi</span>
          </div>
          <p className="kat-quote">Fra det store lærred til hele Nordjyllands feeds.</p>
          <span className="kat-kicker" style={{ marginTop: 32 }}>
            Det vi har bygget forslaget på
          </span>
          <div className="kat-facts" style={{ marginBottom: 100 }}>
            <div><b>4</b><span>Sale midt i Frederikshavn, over for Rådhusparken</span></div>
            <div><b>Lærredet</b><span>Danmarks største Cinemascope-lærred med laserprojektor</span></div>
            <div><b>Lyden</b><span>Dolby Atmos</span></div>
            <div><b>Programmet</b><span>Premierer, Cheap Tuesday, SeniorBio, filmserier, foredrag og koncerter</span></div>
          </div>
          <Bulbs height={22} />
          <Folio n={2} />
        </Page>

        {/* 03 SÅDAN VIRKER DEN */}
        <Page n={3} cap="Sådan virker den" dark>
          <span className="kat-kicker">Sådan virker den</span>
          <h2>Fire trin fra popcorn til opslag</h2>
          <p className="kat-lede">Publikum klarer det selv. Intet personale, ingen app, intet login. Det virker også, når foyeren er fuld lige før filmen.</p>
          <div className="kat-screen-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="kat-screen" src="/models/palads/screen.png" alt="Boksens skærm med røde fløjlstæpper, spotlys, Palads-logoet, teksten Premiere i aften og Sig Popcorn" />
          </div>
          <div className="kat-steps kat-steps--4" style={{ marginBottom: 80 }}>
            <div><b>1</b><h3>Tryk</h3><p>Lysringen kalder. Et tryk på skærmen starter.</p></div>
            <div><b>2</b><h3>Vælg</h3><p>Foto, anmeldelse på video eller dagens spørgsmål.</p></div>
            <div><b>3</b><h3>Sig »Popcorn!«</h3><p>Ringen tæller ned og giver studielys, også i den mørke foyer.</p></div>
            <div><b>4</b><h3>Del</h3><p>En QR-kode sender det til telefonen med filmens ramme.</p></div>
          </div>
          <Folio n={3} />
        </Page>

        {/* 04 DESIGNET */}
        <Page n={4} cap="Designet" dark>
          <Curtain />
          <span className="kat-kicker">Designet</span>
          <h2>Biografskiltet, BIO og filmen</h2>
          <p className="kat-lede">Ét design styrer fire lag, så boksen ligner en del af biografen og ikke noget, der er stillet ind i foyeren.</p>
          <div className="kat-theme">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="kat-box kat-glow" src={`${IMG}/boks-palads.png`} alt="Selfi Boks i Palads-design" />
            <div className="kat-layers">
              <div>
                <b>Top og sider</b>
                Et art deco-biografskilt med Palads-logoet i en ramme af pærer og en trappet krone. En filmstrimmel, der rulles af en filmrulle, på den ene side, og et lodret BIO-skilt over et popcornbæger på den anden. Vi printer delene selv i jeres farver.
                <Swatches keys={["base", "gold", "bulb", "white", "velvet"]} />
              </div>
              <div>
                <b>Lysring</b>Varmt hvidt og messing, mens den venter, som pærerne over indgangen. Studielys, når billedet tages.
                <Swatches keys={["bulb", "gold"]} />
              </div>
              <div>
                <b>Skærm</b>Et lærred mellem røde fløjlstæpper med spotlys, logoet, »Premiere i aften« og »Sig «Popcorn!»«.
              </div>
              <div>
                <b>Hvert foto og hver video</b>Jeres egen ramme med logoet, eller premiererammen med filmens titel, når der er premiere.
              </div>
            </div>
          </div>
          <p className="kat-fine kat-push" style={{ marginBottom: 110 }}>
            Konceptdesign udarbejdet til Palads Teatret. Navn og logo bruges kun med jeres tilladelse.
          </p>
          <Bulbs />
          <Folio n={4} />
        </Page>

        {/* 05 I 3D */}
        <Page n={5} cap="Boksen i 3D" dark>
          <Curtain />
          <span className="kat-kicker">Boksen i 3D</span>
          <h2>Se den fra alle sider</h2>
          <p className="kat-lede">Træk i boksen for at dreje den. Skiltet, BIO-skiltet og filmstrimlen er printede dele på den samme boks, så den kan få et andet design til en gallapremiere eller en firmaaften.</p>
          <div className="kat-3d-wrap">
            <Box3D poster={`${IMG}/boks-palads.png`} alt="Palads-boksen i 3D. Træk for at dreje den." />
          </div>
          <div className="kat-angles">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="kat-box" src={`${IMG}/boks-palads-skraa-venstre.png`} alt="Palads-boksen set skråt fra venstre med filmstrimlen forrest" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="kat-box" src={`${IMG}/boks-palads-skraa-hoejre.png`} alt="Palads-boksen set skråt fra højre med BIO-skiltet forrest" />
          </div>
          <Bulbs />
          <Folio n={5} />
        </Page>

        {/* 06 PREMIERERAMMEN */}
        <Page n={6} cap="Premiererammen">
          <span className="kat-kicker">Premiererammen</span>
          <h2>Hvert foto er en reklame for filmen</h2>
          <p className="kat-lede">Til hver stor premiere får boksen en ny ramme med filmens titel og premieredato. Når publikum deler deres billede, deler de også reklamen for filmen, og det er noget, filmudlejeren gerne betaler for.</p>
          <div className="kat-frames">
            <figure>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${IMG}/foto-premiere.jpg`} alt="Eksempel på premiererammen: mørk ramme med pærer, et guldbånd med Premiere, Palads-logoet og pladsen til filmens titel og dato" />
              <figcaption>Premiererammen. Filmens titel og plakatens farver kommer fra filmudlejeren.</figcaption>
            </figure>
            <figure>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${IMG}/foto-palads.jpg`} alt="Palads Teatrets egen ramme i mørk violet med logoet og Frederikshavn" />
              <figcaption>Jeres egen ramme resten af tiden.</figcaption>
            </figure>
          </div>
          <div className="kat-steps kat-steps--3 kat-steps--light" style={{ marginBottom: 90 }}>
            <div><b>1</b><h3>Filmudlejeren booker</h3><p>Rammen kører fra premieren og så længe, I aftaler, typisk de første uger.</p></div>
            <div><b>2</b><h3>Vi laver rammen</h3><p>Titel, dato og farver fra plakaten. Vi skifter den fra kontrolpanelet på premieredagen.</p></div>
            <div><b>3</b><h3>I får tallene</h3><p>Fotos, delinger og visninger, så filmudlejeren kan se, hvad rammen gav.</p></div>
          </div>
          <Bulbs height={22} />
          <Folio n={6} />
        </Page>

        {/* 07 BRANDING */}
        <Page n={7} cap="Branding">
          <span className="kat-kicker">Branding</span>
          <h2>Palads på hvert opslag</h2>
          <p className="kat-lede">Alt, der kommer ud af boksen, bærer jeres ramme. Når publikum deler på Instagram, TikTok og Snapchat, følger filmen og Palads med ud i deres feeds.</p>
          <div className="kat-brand">
            <div className="kat-phone" aria-label="Eksempel på et opslag på Instagram med premiererammen">
              <div className="kat-phone-bar">
                <i />
                <span>
                  <b>sofie.frh</b>
                  <small>Palads Teatret</small>
                </span>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${IMG}/foto-premiere.jpg`} alt="Foto af fire venner i premiererammen med Palads-logoet" />
              <div className="kat-phone-foot">
                <span className="kat-phone-heart">♥</span> 187 synes godt om
                <p>
                  <b>sofie.frh</b> Premiere med pigerne 🍿🎬 #PaladsTeatret
                </p>
              </div>
            </div>
            <ul className="kat-points">
              <li><b>Ramme på alt</b><span>Logo på hvert foto, hver video og hver GIF.</span></li>
              <li><b>Klar til stories</b><span>Formater til feed, story og reels, så rammen sidder rigtigt overalt.</span></li>
              <li><b>Jeres hashtag</b><span>#PaladsTeatret og filmens hashtag er sat ind, når gæsten deler.</span></li>
              <li><b>Delingssiden</b><span>Siden med fotoet har links til billetter, gavekort og kommende premierer.</span></li>
              <li><b>Plads til partnere</b><span>Filmudlejeren eller en lokal sponsor kan overtage rammen i en periode.</span></li>
            </ul>
          </div>
          <p className="kat-fine kat-push" style={{ marginBottom: 80 }}>Eksempel på et opslag. Navn og tal er opdigtede.</p>
          <Bulbs height={18} />
          <Folio n={7} />
        </Page>

        {/* 08 ANMELDELSER PÅ VIDEO */}
        <Page n={8} cap="Anmeldelser på video" dark>
          <span className="kat-kicker">Anmeldelser på video</span>
          <h2>»Den skal du se!«</h2>
          <p className="kat-lede">Boksen har mikrofon og optager korte videoer. På vej ud af salen giver publikum filmen stjerner og siger, hvad de synes. Jeres intro og ramme sidder på hver video.</p>
          <div className="kat-rec">
            <div className="kat-rec-screen" aria-label="Boksens skærm under optagelse af en anmeldelse">
              <span className="kat-rec-top">
                <i /> Optager · 0:07 / 0:15
              </span>
              <span className="kat-rec-q">Hvad syntes du om filmen? Uden at spoile!</span>
              <span className="kat-rec-heart">🍿</span>
              <span className="kat-rec-bar"><i /></span>
            </div>
            <div className="kat-places">
              <div><h3>Til jeres SoMe</h3><p>Publikums egne anbefalinger, klippet sammen til opslag om, at filmen stadig går.</p></div>
              <div><h3>Til filmudlejeren</h3><p>Ægte reaktioner fra premieren, som de kan bruge i deres egen markedsføring.</p></div>
              <div><h3>Til skærmen i foyeren</h3><p>Anmeldelser fra i går, mens de næste gæster står i kø ved kiosken.</p></div>
              <div><h3>Til vennerne</h3><p>Anmeldelsen sendes som et link på SMS med et link til næste forestilling.</p></div>
            </div>
          </div>
          <div className="kat-specs kat-push" style={{ marginBottom: 80 }}>
            <div>Længde<span>5 til 15 sekunder, I bestemmer</span></div>
            <div>Lyd<span>Mikrofon med støjfilter til en fuld foyer</span></div>
            <div>Ramme<span>Jeres intro, logo og filmens titel på hver video</span></div>
          </div>
          <Folio n={8} />
        </Page>

        {/* 09 PUBLIKUMS HISTORIER */}
        <Page n={9} cap="Publikums historier">
          <span className="kat-kicker">Publikums historier</span>
          <h2>Publikum laver jeres content</h2>
          <p className="kat-lede">Skærmen stiller et spørgsmål, og gæsten svarer på video. Med deres samtykke bliver svarene til biografens content, uden at I selv skal filme.</p>
          <div className="kat-qs">
            <span>Hvilken film så du på din første date?</span>
            <span>Hvor mange stjerner får filmen?</span>
            <span>Popcorn: sødt eller salt?</span>
            <span>Beskriv filmen med tre ord uden at spoile</span>
            <span>Hvad er den bedste film, du har set i Palads?</span>
            <span>Hvem skal du se den med igen?</span>
          </div>
          <div className="kat-steps kat-steps--3 kat-steps--light" style={{ marginTop: 10 }}>
            <div><b>1</b><h3>I vælger spørgsmålene</h3><p>Skift dem fra film til film eller til de store aftener.</p></div>
            <div><b>2</b><h3>Gæsten svarer</h3><p>15 sekunder på video. Gæsten siger ja til, at I må bruge klippet.</p></div>
            <div><b>3</b><h3>I bruger det</h3><p>Klippene ligger sorteret i kontrolpanelet, klar til SoMe, foyerskærm og nyhedsbrev.</p></div>
          </div>
          <div className="kat-quotes kat-push" style={{ marginBottom: 80 }}>
            <blockquote>»Vi så vores første film sammen her. Nu tager vi børnene med.«<span>Eksempel på et svar</span></blockquote>
            <blockquote>»Seks stjerner. Og saltede popcorn, selvfølgelig.«<span>Eksempel på et svar</span></blockquote>
          </div>
          <Bulbs height={18} />
          <Folio n={9} />
        </Page>

        {/* 10 CASES 1 */}
        <Page n={10} cap="Cases" dark>
          <span className="kat-kicker">Cases · 1 af 2</span>
          <h2>Ti måder at bruge boksene på</h2>
          <p className="kat-lede">Aktiviteterne tilpasses Palads og jeres publikum. Her er de første fem.</p>
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
          <p className="kat-lede">Alle cases kan kombineres, og I kan skifte mellem dem fra film til film.</p>
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
          <h2>Hele premiereaftenen på én skærm</h2>
          <p className="kat-lede">Følg fotos, videoer og delinger live, hent publikums klip, skift ramme og spørgsmål, og vis filmudlejeren, hvad premiererammen gav.</p>
          <div className="kat-panel">
            <div className="nav">
              <div className="tabs">
                <span className="on">Overblik</span>
                <span>Bokse</span>
                <span>Klip</span>
                <span>Rammer</span>
              </div>
              <span className="loc">Palads · {BOXES} bokse</span>
            </div>
            <div className="tiles tiles--4">
              <div className="tile"><span className="lab">Fotos i aften</span><span className="num">{kr(486)}</span></div>
              <div className="tile"><span className="lab">Anmeldelser</span><span className="num">{kr(73)}</span></div>
              <div className="tile"><span className="lab">Delt på SoMe</span><span className="num g">{kr(392)}</span></div>
              <div className="tile"><span className="lab">Klip klar til brug</span><span className="num">21</span></div>
            </div>
            <div className="card">
              <div className="row h"><span>Forestilling</span><span>Ramme</span><span className="r">Fotos</span><span className="r">Videoer</span></div>
              <div className="row"><span>17.00 · Sal 2</span><span className="st">Min første biograftur</span><span className="r">94</span><span className="r">6</span></div>
              <div className="row"><span>19.30 · Sal 1</span><span className="st">Premiererammen</span><span className="r">212</span><span className="r">38</span></div>
              <div className="row"><span>19.45 · Sal 3</span><span className="st">Premiererammen</span><span className="r">88</span><span className="r">17</span></div>
              <div className="row"><span>20.15 · Sal 4</span><span className="st">Palads</span><span className="r">53</span><span className="r">7</span></div>
              <div className="row"><span>21.30 · Sal 2</span><span className="st">Biografdaten</span><span className="r">39</span><span className="r">5</span></div>
            </div>
            <div className="card theme">
              <span className="lab">Dagens spørgsmål</span>
              <b>Hvor mange stjerner får filmen?</b>
              <span className="btn">Skift</span>
            </div>
          </div>
          <p className="kat-fine kat-push" style={{ marginBottom: 80 }}>
            Eksempel med opdigtede tal. Klip vises først, når gæsten har givet samtykke.
          </p>
          <Bulbs height={18} />
          <Folio n={12} />
        </Page>

        {/* 13 OPSÆTNING */}
        <Page n={13} cap="Opsætning">
          <span className="kat-kicker">Opsætning og drift</span>
          <h2>Hvor boksene står i biografen</h2>
          <p className="kat-lede">Boksene hænger på væggen eller står på en stander. Vi monterer, passer og opdaterer dem, så I kun skal tænke på filmene.</p>
          <div className="kat-setup2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="kat-box" src={`${IMG}/boks-palads.png`} alt="Selfi Boks i Palads-design" />
            <div className="kat-places">
              <div><h3>I foyeren</h3><p>Hvor publikum venter på, at salen åbner, og har tid til et billede.</p></div>
              <div><h3>Ved kiosken</h3><p>Billedet med popcornene, lige før filmen starter.</p></div>
              <div><h3>Ved udgangen fra salene</h3><p>Anmeldelsen på video, mens filmen er frisk.</p></div>
              <div><h3>Ved den røde løber</h3><p>En ekstra boks til gallapremierer og store aftener.</p></div>
              <div><h3>Til private arrangementer</h3><p>Fødselsdage og firmaaftener med deres eget navn på rammen.</p></div>
            </div>
          </div>
          <div className="kat-specs kat-specs--light kat-push" style={{ marginBottom: 80 }}>
            <div>Montering<span>Væg eller stander</span></div>
            <div>Strøm<span>230 V, én stikkontakt pr. boks</span></div>
            <div>Service<span>Vi passer boksene og skifter ramme til hver premiere</span></div>
          </div>
          <Bulbs height={18} />
          <Folio n={13} />
        </Page>

        {/* 14 BAGSIDE */}
        <Page n={14} cap="Bagside" dark>
          <Curtain />
          <span className="kat-kicker">Næste skridt</span>
          <h2>Lad os bygge jeres boks</h2>
          <p className="kat-lede">Vi gør designet og aktiviteterne færdige sammen med jer og har boksen klar til næste store premiere.</p>
          <div className="kat-steps kat-steps--3" style={{ marginTop: 22 }}>
            <div><b>1</b><h3>Vi aftaler</h3><p>Antal bokse, placeringer, aktiviteter og de første premierer.</p></div>
            <div><b>2</b><h3>Vi bygger</h3><p>Skilt, sider, skærm og rammer i jeres design.</p></div>
            <div><b>3</b><h3>I får content</h3><p>Fotos, anmeldelser og historier fra hver premiere.</p></div>
          </div>
          <div className="kat-contact">
            <span className="kat-kicker">Jeres kontakt</span>
            <b>Holdet bag Selfi</b>
            <a href="/erhverv#kontakt">selfi.dk/erhverv · Book en snak</a>
          </div>
          <div className="kat-push" style={{ marginBottom: 150 }}>
            <Lockup size={40} />
          </div>
          <Bulbs />
          <Folio n={14} />
        </Page>
      </Viewer>
    </div>
  );
}
