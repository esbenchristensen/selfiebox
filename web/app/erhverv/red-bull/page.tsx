import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { Logo } from "@/components/Logo";
import { Viewer } from "@/components/katalog/Viewer";
import "@/components/katalog/katalog.css";
import "./red-bull.css";
import { Box3D } from "./Box3D";

// selfi.dk/erhverv/red-bull: the sales catalogue for Red Bull Danmark, fifteen A4 pages that print to a PDF. A brand,
// not a venue: Red Bull pays for a box in a bar, a club or a student bar and gets its logo on every photo taken
// there. The box is shown only in the Red Bull design on the gen 2 unit (a white wing down each side, the sun with
// the bulls on top). What sells it: Hangtime (the box catches guests at the top of a jump and gives them wings),
// one campaign across the whole network, a cold can in the bar for the night's best jump, and content with consent.
// No prices: they are agreed per deal. It stays out of search and the sitemap.

const partner = Outfit({ subsets: ["latin", "latin-ext"], weight: ["800"], variable: "--font-partner" });

export const metadata: Metadata = {
  title: "Selfi × Red Bull | Salgskatalog",
  description: "Forslag til Red Bull Danmark: Selfi Boks med vinger i barer, klubber og studenterbarer, med Red Bull-logoet på hvert billede, Hangtime og tal fra hvert sted.",
  alternates: { canonical: "/erhverv/red-bull" },
  robots: { index: false, follow: false },
};

const IMG = "/katalog/red-bull";
const PAL = { navy: "#0e1d48", blue: "#22407f", silver: "#c9ced6", red: "#d2003c", yellow: "#ffd300", white: "#ffffff" };
const kr = (n: number) => n.toLocaleString("da-DK");

// The can's blue checks along the top of a page.
function Checks() {
  return <div className="kat-checks" aria-hidden="true" />;
}

// Silver, red and blue along the bottom of a page.
function Band({ height = 26 }: { height?: number }) {
  return <div className="kat-band" aria-hidden="true" style={{ height }} />;
}

function Lockup({ size = 34 }: { size?: number }) {
  return (
    <span className="kat-lockup" style={{ "--lk": `${size}px` } as React.CSSProperties}>
      <Logo size={size} href="/erhverv" />
      <span className="kat-times">×</span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/models/red_bull/logo.svg" alt="Red Bull" className="kat-partner-logo" />
    </span>
  );
}

function Folio({ n }: { n: number }) {
  return (
    <div className="kat-folio">
      <span>Selfi × Red Bull</span>
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

// Ten ways the boxes can work for Red Bull, from an ordinary Friday bar to a race weekend.
const CASES: { title: string; angle: string; text: string; gain: string }[] = [
  { title: "Hangtime", angle: "Aktivitet", text: "Gæsterne hopper, når lyset blinker. Boksen tager billedet på toppen af hoppet, giver dem vinger og måler højden. Nattens højeste hop står øverst på skærmen.", gain: "Det billede, alle vil have" },
  { title: "En kold Red Bull til nattens hop", angle: "Salg", text: "Den, der hopper højest, får en kold Red Bull i baren. Bartenderen ser vinderen i kontrolpanelet, og I kan se, hvor mange præmier der er givet ud.", gain: "Salg over disken, som kan måles" },
  { title: "Fredagsbaren", angle: "Studerende", text: "Bokse i fredagsbarer og studenterhuse med jeres studenterteams events på skærmen og rammen for semesterstart og eksamensfest.", gain: "De unge, hvor de er" },
  { title: "Racerweekend", angle: "Kampagne", text: "Når der er Grand Prix, skifter alle bokse i netværket til en racerramme på én gang. Søndag aften står resultatet på rammen.", gain: "Én kampagne overalt samme aften" },
  { title: "Hvad giver dig viiinger?", angle: "Content", text: "Skærmen stiller spørgsmålet, gæsterne svarer på ti sekunders video, og med deres samtykke bliver klippene til jeres kanaler.", gain: "Ægte stemmer, I ikke skal filme" },
  { title: "Festivalbaren", angle: "Events", text: "Boksen hænger i jeres bar på festivalen med festivalens ramme ved siden af jeres logo og en hilsen fra scenen på skærmen.", gain: "Festivalen på hvert opslag" },
  { title: "Skatehallen", angle: "Sport", text: "I skate- og BMX-haller filmer boksen et trick på fem sekunder og sætter jeres ramme på. Månedens bedste trick vinder.", gain: "Sporten, som deler sig selv" },
  { title: "Gaming og esport", angle: "Gaming", text: "På gamingcaféer og til LAN-fester kommer holdnavn og placering på rammen, og vinderholdet får billedet på skærmen.", gain: "En ny målgruppe med vinger" },
  { title: "Natklubbens prime time", angle: "Natteliv", text: "Kl. 01 skifter skærmen til nattens udfordring, og lysringen pulserer i takt med DJ'en. Billedet deles, mens festen stadig er i gang.", gain: "Red Bull i nattens bedste minut" },
  { title: "Nyt produkt", angle: "Lancering", text: "Når der kommer en ny Edition, får rammen og skærmen dens farve på alle steder i netværket fra dag ét.", gain: "En lancering, gæsterne selv deler" },
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

export default function RedBullKatalog() {
  return (
    <div className={`kat kat--rb ${partner.variable}`}>
      <Viewer>
        {/* 01 FORSIDE */}
        <Page n={1} cap="Forside" dark>
          <Checks />
          <div className="kat-top">
            <Lockup />
            <span className="kat-kicker">Forslag · 2026/27</span>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="kat-box kat-glow" src={`${IMG}/boks-red-bull.png`} alt="Selfi Boks i Red Bull-design med en hvid vinge på hver side og solen med de to tyre på toppen" style={{ width: 400, marginTop: -6 }} />
          <h1 className="kat-center">Viiinger på hvert foto</h1>
          <p className="kat-lede kat-center">Et udkast til Red Bull Danmark: fotobokse med vinger i barer, klubber og studenterbarer. I betaler en boks pr. sted, og Red Bull kommer på hvert billede og hver video, gæsterne deler.</p>
          <Band />
        </Page>

        {/* 02 BREV */}
        <Page n={2} cap="Brev">
          <span className="kat-kicker">Til Red Bull Danmark</span>
          <h2>Gæsterne tager billederne alligevel</h2>
          <p className="kat-lede" style={{ maxWidth: "44ch" }}>
            Fredag aften står gæsterne i baren og tager billeder af hinanden. Hundredvis af billeder på ét sted, på én aften, og ingen af dem siger Red Bull. Selfi Boks hænger på væggen i baren i jeres design med en vinge på hver side. Den tager billeder og korte videoer af gæsterne, sætter jeres ramme på alt, der deles, og fanger dem i luften, når de hopper. I betaler for boksen på de steder, I vælger, og får tallene fra hvert sted bagefter.
          </p>
          <div className="kat-sign">
            <b>Red Bull giver viiinger</b>
            <span>Holdet bag Selfi</span>
          </div>
          <p className="kat-quote">Fra baren til hele Danmarks feeds.</p>
          <span className="kat-kicker" style={{ marginTop: 22 }}>
            Det vi har bygget forslaget på
          </span>
          <div className="kat-facts" style={{ marginBottom: 90 }}>
            <div><b>Siden 1987</b><span>Red Bull giver viiinger til mennesker og idéer</span></div>
            <div><b>Content</b><span>Et brand, der selv laver sin historie gennem events og medier</span></div>
            <div><b>Natteliv</b><span>Barer, klubber og festivaler, hvor Red Bull allerede står i køleskabet</span></div>
            <div><b>Studerende</b><span>Fredagsbarer og studenterhuse, hvor de unge mødes hver uge</span></div>
          </div>
          <Band height={20} />
          <Folio n={2} />
        </Page>

        {/* 03 MODELLEN */}
        <Page n={3} cap="Modellen" dark>
          <Checks />
          <span className="kat-kicker">Modellen</span>
          <h2>Én boks pr. sted, jeres logo på alt</h2>
          <p className="kat-lede">I vælger stederne. Stedet får en fotoboks, gæsterne elsker, og I får jeres logo på hvert billede, der tages der, hver aften.</p>
          <div className="kat-steps kat-steps--4" style={{ marginTop: 10 }}>
            <div><b>1</b><h3>I vælger stederne</h3><p>Barer, klubber, studenterbarer og haller, der passer til jeres målgruppe.</p></div>
            <div><b>2</b><h3>I betaler boksen</h3><p>En aftale pr. sted. Stedet betaler intet og får boksen i jeres design.</p></div>
            <div><b>3</b><h3>Stedet hænger den op</h3><p>Med vægbeslaget og vores korte guide. Vi passer og opdaterer den.</p></div>
            <div><b>4</b><h3>I får tallene</h3><p>Billeder, delinger, hop og præmier pr. sted og pr. aften.</p></div>
          </div>
          <ul className="kat-points" style={{ marginTop: 26, marginBottom: 80 }}>
            <li><b>For Red Bull</b><span>Jeres logo på content, som gæsterne selv deler, og en kanal ind i baren, som I styrer.</span></li>
            <li><b>For stedet</b><span>En fotoboks uden udgift, mere stemning og flere opslag om stedet.</span></li>
            <li><b>For gæsterne</b><span>Et sjovt billede med vinger, og en chance for en kold Red Bull.</span></li>
          </ul>
          <Folio n={3} />
        </Page>

        {/* 04 SÅDAN VIRKER DEN */}
        <Page n={4} cap="Sådan virker den" dark>
          <Checks />
          <span className="kat-kicker">Sådan virker den</span>
          <h2>Fire trin fra hop til opslag</h2>
          <p className="kat-lede">Gæsterne klarer det selv. Intet personale, ingen app og intet login.</p>
          <div className="kat-screen-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="kat-screen" src="/models/red_bull/screen.png" alt="Boksens skærm med Red Bull-solen, tyrene, ordmærket og Hop og få viiinger" />
          </div>
          <div className="kat-steps kat-steps--4" style={{ marginBottom: 80 }}>
            <div><b>1</b><h3>Tryk</h3><p>Lysringen kalder. Et tryk på skærmen starter.</p></div>
            <div><b>2</b><h3>Vælg</h3><p>Foto, video eller Hangtime.</p></div>
            <div><b>3</b><h3>Hop</h3><p>Ringen tæller ned og giver studielys, også i en mørk bar.</p></div>
            <div><b>4</b><h3>Del</h3><p>Billedet kommer på SMS med jeres ramme.</p></div>
          </div>
          <Folio n={4} />
        </Page>

        {/* 05 DESIGNET */}
        <Page n={5} cap="Designet" dark>
          <Checks />
          <span className="kat-kicker">Designet</span>
          <h2>Boksen har fået vinger</h2>
          <p className="kat-lede">Roligt og stærkt: få store former, der kan genkendes fra den anden ende af baren.</p>
          <div className="kat-theme">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="kat-box kat-glow" src={`${IMG}/boks-red-bull.png`} alt="Selfi Boks i Red Bull-design" />
            <div className="kat-layers">
              <div>
                <b>Top og sider</b>
                Solen med de to tyre over en sølvplade med Red Bull på toppen og en hvid vinge foldet ned langs hver side. Vi printer delene selv i jeres farver, massive og robuste nok til en travl bar.
                <Swatches keys={["navy", "silver", "red", "yellow", "white"]} />
              </div>
              <div>
                <b>Lysring</b>Hvidt og gult, mens den venter, og studielys, når billedet tages.
                <Swatches keys={["white", "yellow"]} />
              </div>
              <div>
                <b>Skærm</b>Dåsens blå tern, solen med tyrene og »Hop – og få viiinger!«.
              </div>
              <div>
                <b>Hvert foto og hver video</b>Sølvramme med Red Bull-logoet og »Red Bull giver viiinger«.
              </div>
            </div>
          </div>
          <p className="kat-fine kat-push" style={{ marginBottom: 100 }}>
            Konceptdesign udarbejdet til Red Bull. Navn og logo bruges kun med jeres tilladelse.
          </p>
          <Band />
          <Folio n={5} />
        </Page>

        {/* 06 I 3D */}
        <Page n={6} cap="Boksen i 3D" dark>
          <span className="kat-kicker">Boksen i 3D</span>
          <h2>Se den fra alle sider</h2>
          <p className="kat-lede">Træk i boksen for at dreje den. Toppen og siderne er printede dele på den samme boks, så de kan skiftes til en kampagne eller en ny Edition.</p>
          <div className="kat-3d-wrap">
            <Box3D poster={`${IMG}/boks-red-bull.png`} alt="Red Bull-boksen i 3D. Træk for at dreje den." />
          </div>
          <div className="kat-angles">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="kat-box" src={`${IMG}/boks-red-bull-skraa-venstre.png`} alt="Red Bull-boksen set skråt fra venstre" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="kat-box" src={`${IMG}/boks-red-bull-skraa-hoejre.png`} alt="Red Bull-boksen set skråt fra højre" />
          </div>
          <Band />
          <Folio n={6} />
        </Page>

        {/* 07 HANGTIME */}
        <Page n={7} cap="Hangtime" dark>
          <Checks />
          <span className="kat-kicker">Bygget til Red Bull</span>
          <h2>Hangtime: hop og få viiinger</h2>
          <p className="kat-lede">En funktion, vi bygger til jer. Gæsterne hopper, når lyset blinker. Boksen filmer hoppet, vælger billedet på toppen, giver dem vinger og måler, hvor højt de kom.</p>
          <div className="kat-side" style={{ marginTop: 6 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${IMG}/skaerm-hangtime.jpg`} alt="Boksens skærm efter et hop med 52 cm, tid i luften og nattens højeste hop" />
            <div className="kat-places">
              <div><h3>Billedet på toppen</h3><p>Kameraet optager hoppet, og boksen vælger selv det billede, hvor gæsterne svæver højest.</p></div>
              <div><h3>Vinger på</h3><p>Hvide vinger lægges bag hver gæst på billedet. Red Bull giver viiinger, helt bogstaveligt.</p></div>
              <div><h3>Højden målt</h3><p>Tiden i luften giver højden. Nattens top fem står på skærmen og driver næste hop.</p></div>
              <div><h3>En kold Red Bull</h3><p>Nattens højeste hop vinder en kold Red Bull i baren. Bartenderen ser vinderen på mobilen.</p></div>
            </div>
          </div>
          <p className="kat-fine kat-push" style={{ marginBottom: 70 }}>Skærmen er en skitse. Navne og højder er eksempler.</p>
          <Band />
          <Folio n={7} />
        </Page>

        {/* 08 RAMMERNE */}
        <Page n={8} cap="Rammerne">
          <span className="kat-kicker">Rammerne</span>
          <h2>Red Bull på hvert billede</h2>
          <p className="kat-lede">Hvert foto og hver video får jeres ramme. Hangtime-billederne får højden og placeringen med, så de bliver delt.</p>
          <div className="kat-frames">
            <figure>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${IMG}/foto-red-bull.jpg`} alt="Red Bull-rammen i sølv med logoet og Red Bull giver viiinger" />
              <figcaption>Jeres ramme til hver aften.</figcaption>
            </figure>
            <figure>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${IMG}/foto-hangtime.jpg`} alt="Hangtime-rammen med højden 52 cm og nr. 2 i aften" />
              <figcaption>Hangtime-rammen med højde og placering.</figcaption>
            </figure>
          </div>
          <p className="kat-fine kat-push" style={{ marginBottom: 70 }}>Rammerne er skitser. Vingerne på gæsterne kommer i den færdige Hangtime-funktion.</p>
          <Band height={20} />
          <Folio n={8} />
        </Page>

        {/* 09 NETVÆRKET */}
        <Page n={9} cap="Netværket" dark>
          <Checks />
          <span className="kat-kicker">Netværket</span>
          <h2>Én kampagne på alle steder</h2>
          <p className="kat-lede">Alle jeres bokse styres fra ét kontrolpanel. En ny ramme, en ny skærm eller en ny udfordring kan gå ud til hele netværket på én gang eller til ét sted ad gangen.</p>
          <div className="kat-net">
            <div><b>Barer</b>Fredagsstemning og venner, der vil have billedet.</div>
            <div><b>Natklubber</b>Prime time kl. 01, hvor alle hopper alligevel.</div>
            <div><b>Fredagsbarer</b>Studerende hver uge, på campus og i studenterhuse.</div>
            <div><b>Skatehaller</b>Tricks og hop, som skal deles.</div>
            <div><b>Gamingcaféer</b>Hold, turneringer og vindere på rammen.</div>
            <div><b>Festivalbarer</b>Boksen med i jeres bar på festivalen.</div>
          </div>
          <ul className="kat-points" style={{ marginTop: 22, marginBottom: 80 }}>
            <li><b>Kampagner på et tryk</b><span>Racerweekend, semesterstart eller en ny Edition på alle skærme samme aften.</span></li>
            <li><b>Lokalt, når det giver mening</b><span>Stedets navn og egne events på rammen ved siden af jeres logo.</span></li>
            <li><b>Start småt</b><span>Et par steder i én by først, og flere, når tallene er der.</span></li>
          </ul>
          <Folio n={9} />
        </Page>

        {/* 10 VIDEO */}
        <Page n={10} cap="Video" dark>
          <Checks />
          <span className="kat-kicker">Video og content</span>
          <h2>Hvad giver dig viiinger?</h2>
          <p className="kat-lede">Boksen optager korte videoer. Skærmen stiller et spørgsmål, gæsterne svarer, og med deres samtykke bliver klippene til jeres SoMe.</p>
          <div className="kat-rec">
            <div className="kat-rec-screen" aria-label="Boksens skærm under optagelse af en video">
              <span className="kat-rec-top">
                <i /> Optager · 0:04 / 0:10
              </span>
              <span className="kat-rec-q">Hvad giver dig viiinger?</span>
              <span className="kat-rec-heart">⚡</span>
              <span className="kat-rec-bar"><i /></span>
            </div>
            <div className="kat-places">
              <div><h3>Til jeres kanaler</h3><p>Ugens bedste svar fra alle steder, klar til et opslag.</p></div>
              <div><h3>Ægte stemmer</h3><p>Gæster i baren, ikke skuespillere, og med samtykke fra start.</p></div>
              <div><h3>Til stederne</h3><p>Stederne kan bruge deres egne klip med jeres ramme.</p></div>
              <div><h3>Indsigt</h3><p>Hvad gæsterne svarer, fortæller jer, hvad der rører sig.</p></div>
            </div>
          </div>
          <div className="kat-qs" style={{ marginBottom: 80 }}>
            <span>Hvad giver dig viiinger?</span>
            <span>Hvad er aftenens plan?</span>
            <span>Vis dit bedste hop</span>
            <span>Hvem er nattens hopkonge?</span>
            <span>Hvad skal vi lave i weekenden?</span>
          </div>
          <Folio n={10} />
        </Page>

        {/* 11 BRANDING */}
        <Page n={11} cap="Branding">
          <span className="kat-kicker">Branding</span>
          <h2>Gæsterne deler, I er med</h2>
          <p className="kat-lede">Alt, der kommer ud af boksen, bærer jeres ramme. Når gæsterne deler på Instagram, TikTok og Snapchat, følger Red Bull med ud til deres venner.</p>
          <div className="kat-brand">
            <div className="kat-phone" aria-label="Eksempel på et opslag på Instagram med Hangtime-rammen">
              <div className="kat-phone-bar">
                <i />
                <span>
                  <b>mathilde.aar</b>
                  <small>Fredagsbaren</small>
                </span>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${IMG}/foto-hangtime.jpg`} alt="Foto af fire venner i Hangtime-rammen" />
              <div className="kat-phone-foot">
                <span className="kat-phone-heart">♥</span> 214 synes godt om
                <p>
                  <b>mathilde.aar</b> 52 cm og nr. 2 i aften 🪽 #giverviiinger
                </p>
              </div>
            </div>
            <ul className="kat-points">
              <li><b>Ramme på alt</b><span>Logo og slogan på hvert foto, hver video og hvert Hangtime-billede.</span></li>
              <li><b>Klar til stories</b><span>Formater til feed, story og reels, så rammen sidder rigtigt overalt.</span></li>
              <li><b>Jeres hashtag</b><span>Jeres tag er sat ind, når gæsterne deler.</span></li>
              <li><b>Delingssiden</b><span>Siden med billedet kan linke til jeres events og kampagner.</span></li>
            </ul>
          </div>
          <p className="kat-fine kat-push" style={{ marginBottom: 70 }}>Eksempel på et opslag. Navn og tal er opdigtede.</p>
          <Band height={18} />
          <Folio n={11} />
        </Page>

        {/* 12 CASES 1 */}
        <Page n={12} cap="Cases" dark>
          <Checks />
          <span className="kat-kicker">Cases · 1 af 2</span>
          <h2>Ti måder at bruge boksene på</h2>
          <p className="kat-lede">Aktiviteterne tilpasses stedet og publikum. Her er de første fem.</p>
          <div className="kat-cases" style={{ marginBottom: 80 }}>
            {CASES.slice(0, 5).map((c) => (
              <Case key={c.title} c={c} />
            ))}
          </div>
          <Folio n={12} />
        </Page>

        {/* 13 CASES 2 */}
        <Page n={13} cap="Cases" dark>
          <Checks />
          <span className="kat-kicker">Cases · 2 af 2</span>
          <h2>Og fem mere</h2>
          <p className="kat-lede">Alle cases kan kombineres og skiftes fra aften til aften i kontrolpanelet.</p>
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
          <h2>Hele netværket på én skærm</h2>
          <p className="kat-lede">Følg billeder, videoer, hop og delinger live på hvert sted, skift kampagne for alle bokse på én gang, og se, hvor mange kolde Red Bull der er vundet.</p>
          <div className="kat-panel">
            <div className="nav">
              <div className="tabs">
                <span className="on">Netværk</span>
                <span>Steder</span>
                <span>Hangtime</span>
                <span>Kampagner</span>
              </div>
              <span className="loc">Fredag · 12 steder</span>
            </div>
            <div className="tiles tiles--4">
              <div className="tile"><span className="lab">Fotos i aften</span><span className="num">{kr(6420)}</span></div>
              <div className="tile"><span className="lab">Hop målt</span><span className="num">{kr(1873)}</span></div>
              <div className="tile"><span className="lab">Delt på SoMe</span><span className="num g">{kr(4115)}</span></div>
              <div className="tile"><span className="lab">Præmier i baren</span><span className="num">{kr(12)}</span></div>
            </div>
            <div className="card">
              <div className="row h"><span>Sted</span><span>Kampagne</span><span className="r">Fotos</span><span className="r">Hop</span></div>
              <div className="row"><span>Bar, Aarhus C</span><span className="st">Giver viiinger</span><span className="r">812</span><span className="r">264</span></div>
              <div className="row"><span>Fredagsbar, campus</span><span className="st">Semesterstart</span><span className="r">1.040</span><span className="r">391</span></div>
              <div className="row"><span>Natklub, København</span><span className="st">Giver viiinger</span><span className="r">1.226</span><span className="r">318</span></div>
              <div className="row"><span>Skatehal, Odense</span><span className="st">Månedens trick</span><span className="r">377</span><span className="r">205</span></div>
            </div>
            <div className="card theme">
              <span className="lab">Kampagne til alle steder</span>
              <b>Racerweekend: ny ramme og skærm søndag</b>
              <span className="btn">Send ud</span>
            </div>
          </div>
          <p className="kat-fine kat-push" style={{ marginBottom: 70 }}>
            Eksempel med opdigtede steder og tal. Klip vises først, når gæsterne har givet samtykke.
          </p>
          <Band height={18} />
          <Folio n={14} />
        </Page>

        {/* 15 BAGSIDE */}
        <Page n={15} cap="Bagside" dark>
          <Checks />
          <span className="kat-kicker">Næste skridt</span>
          <h2>Lad os starte med fem barer</h2>
          <p className="kat-lede">Vi gør designet og Hangtime færdige sammen med jer og starter med en pilot på fem steder i én by i en måned.</p>
          <div className="kat-steps kat-steps--3" style={{ marginTop: 22 }}>
            <div><b>1</b><h3>Vi aftaler</h3><p>Steder, kampagner, præmier og hvad I vil måle på.</p></div>
            <div><b>2</b><h3>Vi bygger</h3><p>Top, sider, skærm, rammer og Hangtime i jeres design.</p></div>
            <div><b>3</b><h3>I får tallene</h3><p>Fotos, hop, delinger og præmier fra hvert sted, hver uge.</p></div>
          </div>
          <div className="kat-specs kat-push" style={{ marginTop: 22 }}>
            <div>Montering<span>Vægbeslag, stedet hænger den selv op</span></div>
            <div>Strøm<span>230 V, én stikkontakt</span></div>
            <div>Service<span>Vi passer boksene og sender kampagner ud</span></div>
          </div>
          <div className="kat-contact">
            <span className="kat-kicker">Jeres kontakt</span>
            <b>Holdet bag Selfi</b>
            <a href="/erhverv#kontakt">selfi.dk/erhverv · Book en snak</a>
          </div>
          <div style={{ marginBottom: 120 }}>
            <Lockup size={40} />
          </div>
          <Band />
          <Folio n={15} />
        </Page>
      </Viewer>
    </div>
  );
}
