import type { Metadata } from "next";
import { Archivo_Black } from "next/font/google";
import { Logo } from "@/components/Logo";
import { Viewer } from "@/components/katalog/Viewer";
import "@/components/katalog/katalog.css";
import "./white-hawks.css";
import { Box3D } from "./Box3D";

// selfi.dk/erhverv/white-hawks: the sales catalogue for Frederikshavn White Hawks, the Metal League ice hockey
// club in Nordjyske Bank Arena, sixteen A4 pages that print to a PDF. The box is shown only in the White Hawks
// design on the gen 2 unit (the crest with hawk wings, a hockey stick and the goal lamp). The ideas that sell
// it to a club: a frame the club sells to its match sponsors, the match night from fan zone to final whistle,
// the goal lamp mode, player autographs on the prints and fan videos for the breaks. No prices: they are
// agreed per deal. It stays out of search and the sitemap.

const partner = Archivo_Black({ subsets: ["latin", "latin-ext"], weight: "400", variable: "--font-partner" });

export const metadata: Metadata = {
  title: "Selfi × Frederikshavn White Hawks | Salgskatalog",
  description: "Forslag til Frederikshavn White Hawks: Selfi Boks med høgevinger, hockeystav og målampe i Nordjyske Bank Arena, med kampramme, målalarm, autografer og en ramme, klubben kan sælge til kampsponsoren.",
  alternates: { canonical: "/erhverv/white-hawks" },
  robots: { index: false, follow: false },
};

const IMG = "/katalog/white-hawks";
const PAL = { navy: "#011a3f", blue: "#163463", red: "#a61d26", lamp: "#e0262f", white: "#ffffff", grey: "#cdcccc", gold: "#f7a60b", ice: "#e6f1f8" };
const kr = (n: number) => n.toLocaleString("da-DK");

// The rink's red and blue lines along the top of a page.
function Rink() {
  return <div className="kat-rink" aria-hidden="true" />;
}

// The jersey's hem stripes along the bottom of a page.
function Hem({ height = 26 }: { height?: number }) {
  return <div className="kat-hem" aria-hidden="true" style={{ height }} />;
}

function Lockup({ size = 34 }: { size?: number }) {
  return (
    <span className="kat-lockup" style={{ "--lk": `${size}px` } as React.CSSProperties}>
      <Logo size={size} href="/erhverv" />
      <span className="kat-times">×</span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/models/white_hawks/logo.svg" alt="Frederikshavn White Hawks" className="kat-partner-logo" />
    </span>
  );
}

function Folio({ n }: { n: number }) {
  return (
    <div className="kat-folio">
      <span>Selfi × Frederikshavn White Hawks</span>
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

// Ten ways the box can work for the club, from an ordinary Friday to the Final 4.
const CASES: { title: string; angle: string; text: string; gain: string }[] = [
  { title: "Kampsponsorens ramme", angle: "Sponsorer", text: "Dagens kampsponsor får sit logo på rammen og skærmen hele aftenen. Bagefter får sponsoren tal på, hvor mange billeder der blev taget og delt med deres logo.", gain: "Et nyt produkt at sælge til sponsorerne" },
  { title: "Målalarmen", angle: "Kampaften", text: "Når Hawks scorer, blinker lysringen rødt som målampen, og billederne får målscoreren og stillingen på rammen i et minut.", gain: "Måljublen, som fansene deler" },
  { title: "Autografen", angle: "Spillerne", text: "Hver spiller skriver sin underskrift én gang på boksens skærm. Fansene vælger deres favorit, og underskriften kommer på billedet.", gain: "Spillerne tæt på fansene, hver kamp" },
  { title: "Fan-cam i pauserne", angle: "Content", text: "Fansene råber for Hawks på 10 sekunders video. De bedste klip vises i pauserne og på jeres SoMe.", gain: "Content, I ikke selv skal filme" },
  { title: "Vind et sæsonkort", angle: "Salg", text: "Gæster, der ikke har sæsonkort, kan være med i lodtrækningen om et Unlimited-kort med deres telefonnummer og samtykke.", gain: "Varme leads til næste sæsonkortsalg" },
  { title: "Min første kamp", angle: "Børn", text: "Børn til deres første kamp får en ramme med navn og dato. Delingssiden linker til at prøve ishockey i klubben.", gain: "Nye familier i hallen og i klubben" },
  { title: "Fanzonen før kampen", angle: "Fans", text: "Vennerne samles i fanzonen fra kl. 17. Boksen står, hvor stemningen starter, og billedet bliver delt, før pucken droppes.", gain: "Flere, der kommer tidligt" },
  { title: "Erhvervsklubbens aftener", angle: "Erhverv", text: "Til hospitality og netværk står boksen i loungen med medlemsvirksomhedens logo ved siden af White Hawks.", gain: "Mere værdi i et medlemskab" },
  { title: "Final 4 og slutspil", angle: "Sæson", text: "Særlige rammer og skærme til de store kampe, så billederne fra slutspillet ser ud som et minde, man gemmer.", gain: "De kampe, alle taler om" },
  { title: "Veterankamp og jubilæer", angle: "Events", text: "Gamle helte på isen og en ramme fra klubbens historie siden 1964. Fansene får billedet med legenden med hjem.", gain: "Historien som noget, man kan dele" },
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

export default function WhiteHawksKatalog() {
  return (
    <div className={`kat kat--hawks ${partner.variable}`}>
      <Viewer>
        {/* 01 FORSIDE */}
        <Page n={1} cap="Forside" dark>
          <Rink />
          <div className="kat-top">
            <Lockup />
            <span className="kat-kicker">Forslag · 2026/27</span>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="kat-box kat-glow" src={`${IMG}/boks-white-hawks.png`} alt="Selfi Boks med White Hawks-logoet og høgevinger på toppen, en hockeystav på den ene side og den røde målampe på den anden" style={{ width: 430, marginTop: -6 }} />
          <h1 className="kat-center">Sammen på hvert foto</h1>
          <p className="kat-lede kat-center">Et udkast til Frederikshavn White Hawks: en fotoboks i klubbens eget design i Nordjyske Bank Arena, der tager billeder og videoer af fansene og sætter White Hawks på alt, der deles.</p>
          <Hem />
        </Page>

        {/* 02 BREV */}
        <Page n={2} cap="Brev">
          <span className="kat-kicker">Til Frederikshavn White Hawks</span>
          <h2>Fredagsbrag i hallen</h2>
          <p className="kat-lede" style={{ maxWidth: "44ch" }}>
            Fredag aften fylder fansene fanzonen, og et par timer senere står næsten 2.000 i Nordjyske Bank Arena og råber Hawks frem. Alle tager billeder, men der står ikke White Hawks på dem. Selfi Boks er bygget i jeres design med høgevinger, hockeystav og målampe. Den tager billeder og korte videoer af fansene, sætter jeres ramme på alt, der deles, og giver jer en ramme, I kan sælge til kampsponsoren.
          </p>
          <div className="kat-sign">
            <b>Kom så Hawks</b>
            <span>Holdet bag Selfi</span>
          </div>
          <p className="kat-quote">Fra tribunen til hele Nordjyllands feeds.</p>
          <span className="kat-kicker" style={{ marginTop: 22 }}>
            Det vi har bygget forslaget på
          </span>
          <div className="kat-facts" style={{ marginBottom: 90 }}>
            <div><b>Metalligaen</b><span>Ishockey i Frederikshavn siden 1964, danske mestre i 1989 og 2000</span></div>
            <div><b>Kampaftenen</b><span>Fanzone fra kl. 17, kampstart kl. 19.30 og næsten 2.000 på tribunerne</span></div>
            <div><b>Sponsorerne</b><span>Kampsponsorater, erhvervsklub og hospitality på kampdage</span></div>
            <div><b>Sæsonen</b><span>Unlimited-sæsonkort, veterankampe og billetten til Final 4</span></div>
          </div>
          <Hem height={20} />
          <Folio n={2} />
        </Page>

        {/* 03 SÅDAN VIRKER DEN */}
        <Page n={3} cap="Sådan virker den" dark>
          <Rink />
          <span className="kat-kicker">Sådan virker den</span>
          <h2>Fire trin fra jubel til opslag</h2>
          <p className="kat-lede">Fansene klarer det selv. Intet personale, ingen app og intet login. Det virker også i pausen, når hele hallen står i kø ved baren.</p>
          <div className="kat-screen-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="kat-screen" src="/models/white_hawks/screen.png" alt="Boksens skærm med arenaen, tilskuerne, White Hawks-logoet, isen og Råb Kom så Hawks" />
          </div>
          <div className="kat-steps kat-steps--4" style={{ marginBottom: 80 }}>
            <div><b>1</b><h3>Tryk</h3><p>Lysringen kalder. Et tryk på skærmen starter.</p></div>
            <div><b>2</b><h3>Vælg</h3><p>Foto, GIF, video eller en autograf.</p></div>
            <div><b>3</b><h3>Råb »Kom så Hawks!«</h3><p>Ringen tæller ned og giver studielys, også i en mørk hal.</p></div>
            <div><b>4</b><h3>Del</h3><p>En QR-kode sender billedet til telefonen med jeres ramme.</p></div>
          </div>
          <Folio n={3} />
        </Page>

        {/* 04 DESIGNET */}
        <Page n={4} cap="Designet" dark>
          <Rink />
          <span className="kat-kicker">Designet</span>
          <h2>Høgen, staven og målampen</h2>
          <p className="kat-lede">Ét design styrer fire lag, så boksen ligner en del af hallen og ikke noget, der bare er stillet ind.</p>
          <div className="kat-theme">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="kat-box kat-glow" src={`${IMG}/boks-white-hawks.png`} alt="Selfi Boks i White Hawks-design" />
            <div className="kat-layers">
              <div>
                <b>Top og sider</b>
                Jeres logo med et par hvide høgevinger og »Sammen er vi White Hawks« på toppen. En hockeystav i hvid tape med en puck på den ene side og den røde målampe over et fanbanner på den anden. Vi printer delene selv i jeres farver, massive og robuste nok til en fuld hal.
                <Swatches keys={["navy", "red", "white", "grey", "gold"]} />
              </div>
              <div>
                <b>Lysring</b>Hvidt og rødt, mens den venter. Studielys, når billedet tages, og rødt blink, når Hawks scorer.
                <Swatches keys={["white", "lamp"]} />
              </div>
              <div>
                <b>Skærm</b>Arenaen med tilskuere, logoet, isen og »Råb «Kom så Hawks!»«.
              </div>
              <div>
                <b>Hvert foto og hver video</b>Jeres navy ramme med logoet, kamprammen med modstander og resultat, eller sponsorens ramme.
              </div>
            </div>
          </div>
          <p className="kat-fine kat-push" style={{ marginBottom: 100 }}>
            Konceptdesign udarbejdet til Frederikshavn White Hawks. Navn og logo bruges kun med jeres tilladelse.
          </p>
          <Hem />
          <Folio n={4} />
        </Page>

        {/* 05 I 3D */}
        <Page n={5} cap="Boksen i 3D" dark>
          <span className="kat-kicker">Boksen i 3D</span>
          <h2>Se den fra alle sider</h2>
          <p className="kat-lede">Træk i boksen for at dreje den. Toppen og siderne er printede dele på den samme boks, så den kan få et særligt design til slutspillet eller en jubilæumskamp.</p>
          <div className="kat-3d-wrap">
            <Box3D poster={`${IMG}/boks-white-hawks.png`} alt="White Hawks-boksen i 3D. Træk for at dreje den." />
          </div>
          <div className="kat-angles">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="kat-box" src={`${IMG}/boks-white-hawks-skraa-venstre.png`} alt="White Hawks-boksen set skråt fra venstre med målampen forrest" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="kat-box" src={`${IMG}/boks-white-hawks-skraa-hoejre.png`} alt="White Hawks-boksen set skråt fra højre med hockeystaven forrest" />
          </div>
          <Hem />
          <Folio n={5} />
        </Page>

        {/* 06 KAMPAFTENEN */}
        <Page n={6} cap="Kampaftenen">
          <span className="kat-kicker">Kampaftenen</span>
          <h2>Fra fanzonen til slutfløjtet</h2>
          <p className="kat-lede">Boksen følger aftenen. Rammen ved, hvem I spiller mod, og når kampen er slut, kommer resultatet på billederne.</p>
          <div className="kat-frames">
            <figure>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${IMG}/foto-white-hawks.jpg`} alt="White Hawks-rammen i navy med logoet og Kom så Hawks" />
              <figcaption>Jeres egen ramme til hverdag.</figcaption>
            </figure>
            <figure>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${IMG}/foto-kampramme.jpg`} alt="Kamprammen med dato, modstander, slutresultat og plads til kampsponsorens logo" />
              <figcaption>Kamprammen med modstander, resultat og kampsponsorens logo.</figcaption>
            </figure>
          </div>
          <div className="kat-night" style={{ marginBottom: 70 }}>
            <div><b>17.00</b><h3>Fanzonen åbner</h3><p>Vennerne samles, og de første billeder bliver delt.</p></div>
            <div><b>19.30</b><h3>Pucken droppes</h3><p>Skærmen viser aftenens kamp og kampsponsoren.</p></div>
            <div><b>Mål</b><h3>Målalarmen</h3><p>Boksen blinker rødt, og rammen får målscoreren.</p></div>
            <div><b>Pauser</b><h3>Fan-cam</h3><p>Fansene optager deres hilsen til holdet.</p></div>
            <div><b>Slut</b><h3>Resultatet</h3><p>Rammen skifter til slutresultatet, så billedet bliver et minde.</p></div>
          </div>
          <Hem height={20} />
          <Folio n={6} />
        </Page>

        {/* 07 MÅLALARMEN */}
        <Page n={7} cap="Målalarmen" dark>
          <Rink />
          <span className="kat-kicker">Målalarmen</span>
          <h2>Når Hawks scorer, ved boksen det</h2>
          <p className="kat-lede">Et minut efter hvert mål bliver boksen til målampen. Lysringen blinker rødt, skærmen råber »MÅL!«, og alle billeder får målscoreren og stillingen på rammen.</p>
          <div className="kat-side" style={{ marginTop: 6 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${IMG}/skaerm-maal.jpg`} alt="Boksens skærm efter et mål med MÅL, målampen, målscorerens nummer og stillingen" />
            <div className="kat-places">
              <div><h3>Ét tryk</h3><p>Speakeren eller en frivillig trykker på målet i kontrolpanelet på mobilen og vælger målscoreren.</p></div>
              <div><h3>Eller helt af sig selv</h3><p>Vi kan bygge en kobling til kampens livedata, så boksen skifter, så snart målet står på tavlen.</p></div>
              <div><h3>Lyd med</h3><p>Boksen kan spille målsangen, så den også kan høres i foyeren.</p></div>
              <div><h3>Målets billeder</h3><p>Bagefter ligger alle billeder fra målet samlet, klar til et opslag efter kampen.</p></div>
            </div>
          </div>
          <p className="kat-fine kat-push" style={{ marginBottom: 70 }}>Skærmen er en skitse. Nummer, navn og stilling er eksempler.</p>
          <Hem />
          <Folio n={7} />
        </Page>

        {/* 08 SPONSORERNE */}
        <Page n={8} cap="Sponsorerne">
          <span className="kat-kicker">Sponsorerne</span>
          <h2>En ramme, I kan sælge</h2>
          <p className="kat-lede">Kamprammen har plads til dagens kampsponsor. Det er et nyt produkt i jeres sponsorpakker, og bagefter kan I vise sponsoren præcis, hvad de fik.</p>
          <div className="kat-steps kat-steps--3 kat-steps--light" style={{ marginTop: 6 }}>
            <div><b>1</b><h3>I sælger kampen</h3><p>Sponsorens logo på rammen og skærmen hele kampaftenen.</p></div>
            <div><b>2</b><h3>Fansene deler</h3><p>Hvert billede, der deles, viser sponsoren ved siden af White Hawks.</p></div>
            <div><b>3</b><h3>Sponsoren får tal</h3><p>Billeder, delinger og visninger samlet i en rapport efter kampen.</p></div>
          </div>
          <ul className="kat-points" style={{ marginTop: 10 }}>
            <li><b>Kampsponsoren</b><span>Logoet på kamprammen og skærmen, én kamp ad gangen.</span></li>
            <li><b>Sæsonens partner</b><span>Et fast felt på alle rammer hele sæsonen.</span></li>
            <li><b>Målsponsoren</b><span>»Målet er sponsoreret af …« på målalarmens ramme.</span></li>
            <li><b>Erhvervsklubben</b><span>Boksen i loungen med medlemmets logo ved siden af jeres til hospitality og netværk.</span></li>
          </ul>
          <p className="kat-fine kat-push" style={{ marginBottom: 70 }}>I bestemmer selv, hvordan felterne sælges og prissættes.</p>
          <Hem height={20} />
          <Folio n={8} />
        </Page>

        {/* 09 AUTOGRAFEN */}
        <Page n={9} cap="Autografen">
          <span className="kat-kicker">Spillerne</span>
          <h2>Din favoritspiller på billedet</h2>
          <p className="kat-lede">Hver spiller skriver sin underskrift én gang på boksens skærm. Derefter kan fansene vælge deres favorit, og underskriften og nummeret kommer på billedet.</p>
          <div className="kat-side" style={{ gridTemplateColumns: "300px 1fr" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${IMG}/foto-autograf.jpg`} alt="Fotoramme med White Hawks-logoet og en spillers underskrift og nummer" style={{ boxShadow: "0 14px 28px rgba(1, 26, 63, 0.3)", borderRadius: 4 }} />
            <div className="kat-places">
              <div><h3>Én gang pr. spiller</h3><p>Underskriften tages på boksens skærm til sæsonstart og ligger klar resten af sæsonen.</p></div>
              <div><h3>Mød spillerne</h3><p>Efter kampen kan spillerne stille op ved boksen, og fansene får billedet med underskrift med hjem.</p></div>
              <div><h3>Nye spillere</h3><p>Når I henter en ny spiller, kommer spilleren på boksen samme dag.</p></div>
              <div><h3>Til de yngste</h3><p>Børnene vælger deres helt, og billedet kan printes med det samme.</p></div>
            </div>
          </div>
          <p className="kat-fine kat-push" style={{ marginBottom: 70 }}>Rammen er en skitse. Underskrift og nummer er eksempler.</p>
          <Hem height={20} />
          <Folio n={9} />
        </Page>

        {/* 10 FAN-CAM */}
        <Page n={10} cap="Fan-cam" dark>
          <Rink />
          <span className="kat-kicker">Video og fan-cam</span>
          <h2>Fansene laver jeres content</h2>
          <p className="kat-lede">Boksen optager korte videoer. Skærmen stiller et spørgsmål, fansene svarer, og med deres samtykke bliver klippene til jeres SoMe og pausernes underholdning.</p>
          <div className="kat-rec">
            <div className="kat-rec-screen" aria-label="Boksens skærm under optagelse af en fan-hilsen">
              <span className="kat-rec-top">
                <i /> Optager · 0:04 / 0:10
              </span>
              <span className="kat-rec-q">Giv holdet en hilsen før 2. periode!</span>
              <span className="kat-rec-heart">🏒</span>
              <span className="kat-rec-bar"><i /></span>
            </div>
            <div className="kat-places">
              <div><h3>Til pauserne</h3><p>De bedste hilsner på skærmen i hallen, mens isen bliver lavet.</p></div>
              <div><h3>Til jeres SoMe</h3><p>Aftenens bedste klip, klar til et opslag efter kampen.</p></div>
              <div><h3>Til spillerne</h3><p>Hilsner fra fansene før en vigtig udekamp.</p></div>
              <div><h3>Til sponsorerne</h3><p>Ægte stemning, de kan bruge i deres egen markedsføring.</p></div>
            </div>
          </div>
          <div className="kat-qs" style={{ marginBottom: 80 }}>
            <span>Hvem scorer i aften?</span>
            <span>Hvad er din bedste Hawks-kamp nogensinde?</span>
            <span>Råb for din favoritspiller</span>
            <span>Hvor mange mål vinder vi med?</span>
            <span>Hvem tager du med til næste kamp?</span>
          </div>
          <Folio n={10} />
        </Page>

        {/* 11 BRANDING */}
        <Page n={11} cap="Branding">
          <span className="kat-kicker">Branding</span>
          <h2>White Hawks på hvert opslag</h2>
          <p className="kat-lede">Alt, der kommer ud af boksen, bærer jeres ramme. Når fansene deler på Instagram, TikTok og Snapchat, følger White Hawks med ud i hele Nordjylland.</p>
          <div className="kat-brand">
            <div className="kat-phone" aria-label="Eksempel på et opslag på Instagram med White Hawks-rammen">
              <div className="kat-phone-bar">
                <i />
                <span>
                  <b>sofie.fhavn</b>
                  <small>Nordjyske Bank Arena</small>
                </span>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${IMG}/foto-kampramme.jpg`} alt="Foto af fire venner i kamprammen" />
              <div className="kat-phone-foot">
                <span className="kat-phone-heart">♥</span> 187 synes godt om
                <p>
                  <b>sofie.fhavn</b> Fredagsbrag og sejr 🦅🏒 #whitehawks
                </p>
              </div>
            </div>
            <ul className="kat-points">
              <li><b>Ramme på alt</b><span>Logo, modstander og resultat på hvert foto, hver video og hver GIF.</span></li>
              <li><b>Klar til stories</b><span>Formater til feed, story og reels, så rammen sidder rigtigt overalt.</span></li>
              <li><b>Jeres hashtag</b><span>Klubbens tag er sat ind, når fansene deler.</span></li>
              <li><b>Delingssiden</b><span>Siden med fotoet linker til billetter, sæsonkort og shoppen.</span></li>
              <li><b>Plads til sponsorer</b><span>Kampsponsoren følger med på hvert billede fra aftenen.</span></li>
            </ul>
          </div>
          <p className="kat-fine kat-push" style={{ marginBottom: 70 }}>Eksempel på et opslag. Navn og tal er opdigtede.</p>
          <Hem height={18} />
          <Folio n={11} />
        </Page>

        {/* 12 CASES 1 */}
        <Page n={12} cap="Cases" dark>
          <Rink />
          <span className="kat-kicker">Cases · 1 af 2</span>
          <h2>Ti måder at bruge boksen på</h2>
          <p className="kat-lede">Aktiviteterne tilpasses White Hawks og jeres fans. Her er de første fem.</p>
          <div className="kat-cases" style={{ marginBottom: 80 }}>
            {CASES.slice(0, 5).map((c) => (
              <Case key={c.title} c={c} />
            ))}
          </div>
          <Folio n={12} />
        </Page>

        {/* 13 CASES 2 */}
        <Page n={13} cap="Cases" dark>
          <Rink />
          <span className="kat-kicker">Cases · 2 af 2</span>
          <h2>Og fem mere</h2>
          <p className="kat-lede">Alle cases kan kombineres og skiftes fra kamp til kamp i kontrolpanelet.</p>
          <div className="kat-cases" style={{ marginBottom: 80 }}>
            {CASES.slice(5).map((c) => (
              <Case key={c.title} c={c} />
            ))}
          </div>
          <Folio n={13} />
        </Page>

        {/* 14 KONTROLPANEL */}
        <Page n={14} cap="Kontrolpanelet">
          <span className="kat-kicker">Kontrolpanelet</span>
          <h2>Hele kampaftenen på én skærm</h2>
          <p className="kat-lede">Følg fotos, videoer og delinger live, sæt aftenens modstander og kampsponsor, tryk på målet, og send sponsoren rapporten bagefter.</p>
          <div className="kat-panel">
            <div className="nav">
              <div className="tabs">
                <span className="on">Kampaften</span>
                <span>Mål</span>
                <span>Klip</span>
                <span>Sponsorer</span>
              </div>
              <span className="loc">Hawks – Herning · fredag</span>
            </div>
            <div className="tiles tiles--4">
              <div className="tile"><span className="lab">Fotos i aften</span><span className="num">{kr(964)}</span></div>
              <div className="tile"><span className="lab">Videoer</span><span className="num">{kr(118)}</span></div>
              <div className="tile"><span className="lab">Delt på SoMe</span><span className="num g">{kr(702)}</span></div>
              <div className="tile"><span className="lab">Med i lodtrækningen</span><span className="num">{kr(143)}</span></div>
            </div>
            <div className="card">
              <div className="row h"><span>Tidspunkt</span><span>Ramme</span><span className="r">Fotos</span><span className="r">Videoer</span></div>
              <div className="row"><span>Fanzonen</span><span className="st">Kampramme</span><span className="r">288</span><span className="r">21</span></div>
              <div className="row"><span>1. pause</span><span className="st">Kampramme</span><span className="r">203</span><span className="r">37</span></div>
              <div className="row"><span>Mål, 2. periode</span><span className="st">Målalarm</span><span className="r">96</span><span className="r">12</span></div>
              <div className="row"><span>2. pause</span><span className="st">Kampramme</span><span className="r">171</span><span className="r">31</span></div>
              <div className="row"><span>Efter kampen</span><span className="st">Resultat og autografer</span><span className="r">206</span><span className="r">17</span></div>
            </div>
            <div className="card theme">
              <span className="lab">Rapport til kampsponsoren</span>
              <b>702 delte billeder med jeres logo</b>
              <span className="btn">Send</span>
            </div>
          </div>
          <p className="kat-fine kat-push" style={{ marginBottom: 70 }}>
            Eksempel med opdigtede tal. Klip vises først, når fansene har givet samtykke.
          </p>
          <Hem height={18} />
          <Folio n={14} />
        </Page>

        {/* 15 OPSÆTNING */}
        <Page n={15} cap="Opsætning">
          <span className="kat-kicker">Opsætning og drift</span>
          <h2>Hvor boksen står i hallen</h2>
          <p className="kat-lede">Boksen hænger på væggen eller står på en stander. Vi monterer, passer og opdaterer den, så I kun skal tænke på kampen.</p>
          <div className="kat-setup2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="kat-box" src={`${IMG}/boks-white-hawks.png`} alt="Selfi Boks i White Hawks-design" />
            <div className="kat-places">
              <div><h3>I fanzonen</h3><p>Hvor vennerne samles før kampen, og stemningen starter.</p></div>
              <div><h3>Ved indgangen</h3><p>Det første, fansene ser, og det sidste, de går forbi efter slutfløjtet.</p></div>
              <div><h3>I loungen</h3><p>Til erhvervsklubben, hospitality og sponsorernes gæster.</p></div>
              <div><h3>Ved spillernes udgang</h3><p>Når spillerne møder fansene og skriver autografer efter kampen.</p></div>
              <div><h3>Med på tur</h3><p>Boksen kan flyttes til Final 4, sæsonpremieren eller et sponsorarrangement.</p></div>
            </div>
          </div>
          <div className="kat-specs kat-specs--light kat-push" style={{ marginBottom: 70 }}>
            <div>Montering<span>Væg eller stander</span></div>
            <div>Strøm<span>230 V, én stikkontakt</span></div>
            <div>Service<span>Vi passer boksen og skifter rammer fra kamp til kamp</span></div>
          </div>
          <Hem height={18} />
          <Folio n={15} />
        </Page>

        {/* 16 BAGSIDE */}
        <Page n={16} cap="Bagside" dark>
          <Rink />
          <span className="kat-kicker">Næste skridt</span>
          <h2>Lad os bygge jeres boks</h2>
          <p className="kat-lede">Vi gør designet og aktiviteterne færdige sammen med jer og starter med en hjemmekamp.</p>
          <div className="kat-steps kat-steps--3" style={{ marginTop: 22 }}>
            <div><b>1</b><h3>Vi aftaler</h3><p>Placering, aktiviteter, sponsorfelter og den første kamp.</p></div>
            <div><b>2</b><h3>Vi bygger</h3><p>Top, sider, skærm og rammer i jeres design.</p></div>
            <div><b>3</b><h3>I får content</h3><p>Fotos, videoer og sponsortal fra hver kampaften.</p></div>
          </div>
          <div className="kat-contact">
            <span className="kat-kicker">Jeres kontakt</span>
            <b>Holdet bag Selfi</b>
            <a href="/erhverv#kontakt">selfi.dk/erhverv · Book en snak</a>
          </div>
          <div className="kat-push" style={{ marginBottom: 140 }}>
            <Lockup size={40} />
          </div>
          <Hem />
          <Folio n={16} />
        </Page>
      </Viewer>
    </div>
  );
}
