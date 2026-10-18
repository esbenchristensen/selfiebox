import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { Logo } from "@/components/Logo";
import { business } from "@/content";
import { Viewer } from "./Viewer";
import "./katalog.css";

// selfi.dk/events/smukfest: the sales catalogue for Smukfest, twelve A4 pages that print to a PDF.
// The box is the Smukfest design from the showroom on /events, on the Halo rev G main unit.
// It is a proposal for one festival, so it stays out of search and the sitemap.

const partner = Outfit({ subsets: ["latin", "latin-ext"], weight: ["700", "800"], variable: "--font-partner" });

export const metadata: Metadata = {
  title: "Selfi × Smukfest | Salgskatalog",
  description: "Forslag til Smukfest 2027: Selfi Boks i Smukfests eget design med lysring, skærm og fotoramme, aktiviteter, indtjening og pris.",
  alternates: { canonical: "/events/smukfest" },
  robots: { index: false, follow: false },
};

const IMG = "/katalog/smukfest";
const PAL = { base: "#0f3d24", forest: "#1c5a33", leaf: "#3f8f3a", lime: "#9cc94a", red: "#e2001a", cream: "#f6eedc", bark: "#5a3b22" };

// The festival maths on page 9: six boxes, five festival days, one month of rent per box.
const BOXES = 6;
const DAYS = 5;
const RENT = BOXES * business.monthlyPricePerBox;
const VOLUMES = [150, 250].map((perDay) => perDay * BOXES * DAYS);
const PRICES = [35, 40, 50];
const HL = 40;
const profit = (price: number, photos: number) => photos * (price - business.costPerPhoto) - RENT;
const kr = (n: number) => n.toLocaleString("da-DK");

// Hearts scattered on the dark pages, at fixed spots so screen and print look the same.
const HEARTS: [number, number, number][] = [
  [8, 6, 14], [22, 14, 9], [84, 9, 12], [70, 4, 8], [92, 22, 10], [14, 30, 8], [62, 18, 7], [40, 8, 7], [78, 34, 9], [5, 44, 7],
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
          <h1 className="kat-center">Jeres egen Selfi Boks</h1>
          <p className="kat-lede kat-center">Et udkast til Smukfest 2027: boks, lys, skærm og fotos i Bøgeskovens grønne og hjertets røde.</p>
          <Hills />
        </Page>

        {/* 02 BREV */}
        <Page n={2} cap="Brev">
          <span className="kat-kicker">Til Smukfest</span>
          <h2>Danmarks smukkeste festival fortjener et smukt minde</h2>
          <p className="kat-lede" style={{ maxWidth: "44ch" }}>
            Hvert år bliver Bøgeskoven til en by, hvor folk kommer for musikken og bliver for stemningen. Selfi Boks giver gæsterne et ægte foto med hjem fra netop den aften, oplyst af en ring af studielys og printet på få sekunder. Boksen er bygget i Smukfests eget design med hjertetræet på toppen og skoven på siderne, så den føles som en del af festivalen og ikke som en reklame. Og hvert foto giver penge tilbage til festivalen.
          </p>
          <div className="kat-sign">
            <b>Kærlig hilsen</b>
            <span>Holdet bag Selfi</span>
          </div>
          <p className="kat-quote">Fra Bøgeskoven til køleskabet derhjemme.</p>
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
          <h2>Fire trin fra smil til foto i hånden</h2>
          <p className="kat-lede">Gæsterne klarer det selv. Intet personale, ingen app, intet login. Det virker også klokken tre om natten.</p>
          <div className="kat-photo" style={{ height: 430, width: "62%", alignSelf: "center" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${IMG}/boks-rev-g.jpg`} alt="Selfi Boks forfra med tændt lysring og teksten Tryk for at tage et billede" style={{ objectPosition: "50% 45%" }} />
          </div>
          <div className="kat-steps kat-push" style={{ marginBottom: 80 }}>
            <div><b>1</b><h3>Tryk</h3><p>Lysringen kalder på gæsterne. Et tryk på skærmen starter.</p></div>
            <div><b>2</b><h3>Betal</h3><p>Gæsten betaler den pris, I har valgt, med kort eller telefon direkte på boksen.</p></div>
            <div><b>3</b><h3>3-2-1</h3><p>Ringen tæller ned i Smukfests grønne og røde og giver studielys på ansigterne.</p></div>
            <div><b>4</b><h3>Print</h3><p>Et ægte Instax-foto med Smukfests ramme kommer ud på få sekunder.</p></div>
          </div>
          <Folio n={3} />
        </Page>

        {/* 04 PRODUKTET */}
        <Page n={4} cap="Produktet" dark>
          <span className="kat-kicker">Selfi Boks · Halo</span>
          <h2>Lille nok til en træstamme. Lys nok til en hel lejr.</h2>
          <div className="kat-duo">
            <div className="kat-photo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${IMG}/boks-rev-g.jpg`} alt="Selfi Boks set skråt forfra med lysringen tændt" style={{ objectPosition: "45% 50%" }} />
            </div>
            <div className="kat-drawing">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${IMG}/maal.png`} alt="Tegning af boksen forfra og fra siden: 234 mm bred, 306 mm høj og 81,6 mm dyb" />
            </div>
          </div>
          <div className="kat-specs kat-push" style={{ marginBottom: 80 }}>
            <div>Mål<span>234 × 306 × 82 mm</span></div>
            <div>Skærm<span>10&quot; touch, stående</span></div>
            <div>Kamera<span>12 MP, 120° vidvinkel</span></div>
            <div>Lys<span>Lysring, CRI 90+, 4000 K + RGBW-farver</span></div>
            <div>Foto<span>Instax Square, 62 × 62 mm</span></div>
            <div>Montering<span>Væg med tyverilås eller stander</span></div>
            <div>Strøm<span>230 V, én stikkontakt pr. boks</span></div>
          </div>
          <Folio n={4} />
        </Page>

        {/* 05 TEMAET */}
        <Page n={5} cap="Temaet" dark>
          <Hearts n={6} />
          <span className="kat-kicker">Temaet</span>
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
                <b>Lysring</b>Skifter roligt mellem lime, rød og creme, mens den venter. Varm hvid, når fotoet tages.
                <Swatches keys={["lime", "red", "cream"]} />
              </div>
              <div>
                <b>Skærm</b>Hjertetræet, »Sig Smukt!« og et rødt bånd med Danmarks smukkeste festival.
              </div>
              <div>
                <b>Foto</b>Hjertetræet og Smukfest · Bøgeskoven på rammen af hvert eneste print.
              </div>
            </div>
          </div>
          <p className="kat-fine kat-push" style={{ marginBottom: 150 }}>
            Konceptdesign udarbejdet til Smukfest. Festivalens navn, logo og artwork bruges kun med jeres tilladelse.
          </p>
          <Hills />
          <Folio n={5} light />
        </Page>

        {/* 06 FOTOET */}
        <Page n={6} cap="Fotoet">
          <span className="kat-kicker">Det gæsterne tager med hjem</span>
          <h2>Et foto fra Smukfest 2027</h2>
          <div className="kat-print-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="kat-print" src={`${IMG}/foto-smukfest.jpg`} alt="Eksempel på et Instax-foto med Smukfests creme ramme, hjertetræet og teksten Smukfest · Bøgeskoven" />
          </div>
          <p className="kat-lede" style={{ marginBottom: 86 }}>
            Rammen har hjertetræet og festivalens navn. Fotoet ender på køleskabe over hele landet, og hver gang nogen ser det, ser de Smukfest.
          </p>
          <Folio n={6} />
        </Page>

        {/* 07 OPSÆTNING */}
        <Page n={7} cap="Opsætning">
          <span className="kat-kicker">Opsætning</span>
          <h2>Hvor boksene står i Bøgeskoven</h2>
          <p className="kat-lede">Boksen hænger på en væg, en stander eller en bod. Den er 82 mm dyb og fylder ikke mere end en lille opslagstavle.</p>
          <div className="kat-setup">
            <div className="kat-drawing">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${IMG}/maal.png`} alt="Tegning af boksen på væggen forfra og fra siden med vægbeslaget" />
            </div>
            <div className="kat-places">
              <div><h3>Ved scenerne</h3><p>På barerne og boderne langs pladsen, hvor folk venter på næste koncert.</p></div>
              <div><h3>På campingen</h3><p>Ved fællesområderne, hvor dagen starter og natten slutter.</p></div>
              <div><h3>Hos de frivillige</h3><p>Et foto til de mange, der bygger festivalen. Gratis for dem, hvis I vil.</p></div>
              <div><h3>I partnerområderne</h3><p>Toppen og siderne kan skiftes, så en partner kan få sin egen boks.</p></div>
            </div>
          </div>
          <div className="kat-specs kat-specs--light kat-push" style={{ marginBottom: 80 }}>
            <div>Væg<span>Vægbeslag med tyverilås</span></div>
            <div>Stander<span>Gulvstander til telte og pladser</span></div>
            <div>Tag<span>Udhæng til udendørs brug</span></div>
          </div>
          <Folio n={7} />
        </Page>

        {/* 08 AKTIVITETER */}
        <Page n={8} cap="Aktiviteter" dark>
          <span className="kat-kicker">Aktiviteter</span>
          <h2>Gør festivalen til et spil</h2>
          <p className="kat-lede">I vælger, hvad der kører, og hvornår. Skærmen skifter selv mellem fotoet og spillet.</p>
          <div className="kat-screen-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="kat-screen" src="/models/smukfest/screen.png" alt="Boksens skærm i Smukfest-design med hjertetræet og teksten Sig Smukt" />
          </div>
          <div className="kat-acts" style={{ marginBottom: 80 }}>
            <div><svg viewBox="0 0 48 48" aria-hidden="true"><rect className="s" x="7" y="11" width="34" height="26" rx="8" /><circle className="s" cx="16" cy="24" r="3.5" /><circle className="s" cx="24" cy="24" r="3.5" /><circle className="s" cx="32" cy="24" r="3.5" /></svg><span><b>Rundtur</b><small>Stempler ved hver boks i skoven</small></span></div>
            <div><svg viewBox="0 0 48 48" aria-hidden="true"><path className="s" d="M9 39 C15 33 13 25 21 24 S31 19 32 13" strokeDasharray="1 5" /><path className="s" d="M34 7 l7 7 M41 7 l-7 7" /></svg><span><b>Skattejagt</b><small>En fortælling med spor mellem boksene</small></span></div>
            <div><svg viewBox="0 0 48 48" aria-hidden="true"><rect className="s" x="10" y="7" width="28" height="34" rx="9" /><path className="s" d="M18 24 l4 4 8-9" /></svg><span><b>Missioner</b><small>Små opgaver, som kameraet tjekker</small></span></div>
            <div><svg viewBox="0 0 48 48" aria-hidden="true"><path className="s" d="M10 33 V17 L18 24 L24 13 L30 24 L38 17 V33 Z M10 38 H38" /></svg><span><b>Titler</b><small>Dagens største smil og største gruppe</small></span></div>
            <div><svg viewBox="0 0 48 48" aria-hidden="true"><path className="s" d="M16 9 H32 V18 A8 8 0 0 1 16 18 Z M16 12 H11 A5 5 0 0 0 16 20 M32 12 H37 A5 5 0 0 1 32 20 M24 26 V33 M17 39 H31" /></svg><span><b>Konkurrence</b><small>Gæsterne stemmer på festivalens foto</small></span></div>
            <div><svg viewBox="0 0 48 48" aria-hidden="true"><circle className="s" cx="24" cy="26" r="14" /><path className="s" d="M24 18 V26 L29 29 M20 7 H28" /></svg><span><b>Guldtid</b><small>Korte vinduer, hvor næste foto vinder</small></span></div>
          </div>
          <Folio n={8} />
        </Page>

        {/* 09 INDTJENING */}
        <Page n={9} cap="Indtjening">
          <span className="kat-kicker">Indtjening for Smukfest</span>
          <h2>Hvert smil giver festivalen penge</h2>
          <p className="kat-lede">I bestemmer prisen. Papir og drift koster {business.costPerPhoto} kr. pr. foto, og resten er jeres.</p>
          <div className="kat-hero-num">
            <span className="kat-kicker">
              Ved {HL} kr. pr. foto, {BOXES} bokse og {DAYS} festivaldage
            </span>
            <span className="kat-big">
              {kr(profit(HL, VOLUMES[0]))}
              <sup>kr</sup>
            </span>
            <span className="kat-sub">i overskud til festivalen efter {kr(RENT)} kr. i leje</span>
          </div>
          <table className="kat-ptable" style={{ marginTop: 28 }}>
            <thead>
              <tr>
                <th>Pris pr. foto</th>
                <th>Jeres andel</th>
                {VOLUMES.map((v) => (
                  <th key={v}>{kr(v)} fotos</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PRICES.map((p) => (
                <tr key={p} className={p === HL ? "hl" : undefined}>
                  <td>{p} kr.</td>
                  <td>{p - business.costPerPhoto} kr.</td>
                  {VOLUMES.map((v) => (
                    <td key={v} className="money">
                      {kr(profit(p, v))} kr.
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="kat-fine">
            Eksempler, ikke garantier. {kr(VOLUMES[0])} fotos = {BOXES} bokse × {DAYS} dage × 150 fotos pr. boks pr. dag; {kr(VOLUMES[1])} fotos = 250 pr. boks pr. dag. Regnestykket: fotos × (pris − {business.costPerPhoto} kr.) − {kr(business.monthlyPricePerBox)} kr. pr. boks. Alle beløb ekskl. moms.
          </p>
          <div className="kat-steps kat-steps--3 kat-push" style={{ marginBottom: 150 }}>
            <div><h3>Ingen investering</h3><p>I lejer boksene for festivalen og betaler intet for selve udstyret.</p></div>
            <div><h3>I sætter prisen</h3><p>Ændr prisen pr. foto når som helst, også midt på en festivaldag.</p></div>
            <div><h3>Pengene live</h3><p>Se fotos og jeres andel pr. boks i kontrolpanelet.</p></div>
          </div>
          <Hills height={78} />
          <Folio n={9} light />
        </Page>

        {/* 10 PRIS */}
        <Page n={10} cap="Pris">
          <span className="kat-kicker">Pris</span>
          <h2>{kr(business.monthlyPricePerBox)} kr. pr. boks for hele festivalen</h2>
          <p className="kat-lede">Én måneds leje dækker opbygning, festivaldagene og nedtagning. Alt er med, så I kun skal tænke på gæsterne.</p>
          <ul className="kat-incl" style={{ marginTop: 12 }}>
            <li><span>Selfi Boks med lysring, skærm og kamera</span><span>Inkl.</span></li>
            <li><span>Fotoprint på Instax og betaling på boksen</span><span>Inkl.</span></li>
            <li><span>Montering og test på pladsen</span><span>Inkl.</span></li>
            <li><span>Film og papir genopfyldes under festivalen</span><span>Inkl.</span></li>
            <li><span>Kontrolpanel til design, lys, pris og aktiviteter</span><span>Inkl.</span></li>
            <li><span>Service og ombytning</span><span>Inkl.</span></li>
          </ul>
          <span className="kat-kicker" style={{ marginTop: 18 }}>
            Tilvalg
          </span>
          <ul className="kat-incl">
            <li><span>Smukfest-design: top, sider, skærm og fotoramme</span><span>Efter aftale</span></li>
            <li><span>Tag til udendørs brug</span><span>Efter aftale</span></li>
            <li><span>Gulvstander</span><span>Efter aftale</span></li>
            <li><span>Top og sider til partnerområder</span><span>Efter aftale</span></li>
          </ul>
          <p className="kat-fine kat-push" style={{ marginBottom: 120 }}>
            Alle priser er ekskl. moms. Listen er et udkast og rettes til de endelige vilkår før aftalen.
          </p>
          <Hills height={78} />
          <Folio n={10} light />
        </Page>

        {/* 11 KONTROLPANEL */}
        <Page n={11} cap="Kontrolpanelet">
          <span className="kat-kicker">Kontrolpanelet</span>
          <h2>Hele skoven på én skærm</h2>
          <p className="kat-lede">Se fotos og penge live, skift design og lys, og slå aktiviteter til, fra telefonen eller kontoret.</p>
          <div className="kat-panel">
            <div className="nav">
              <div className="tabs">
                <span className="on">Overblik</span>
                <span>Bokse</span>
                <span>Design</span>
                <span>Aktiviteter</span>
              </div>
              <span className="loc">Smukfest 2027 · {BOXES} bokse</span>
            </div>
            <div className="tiles">
              <div className="tile"><span className="lab">Fotos i dag</span><span className="num">812</span></div>
              <div className="tile"><span className="lab">Jeres andel i dag</span><span className="num g">{kr(812 * (HL - business.costPerPhoto))}<sup>kr</sup></span></div>
              <div className="tile"><span className="lab">Bokse online</span><span className="num">{BOXES}<sup>/{BOXES}</sup></span></div>
            </div>
            <div className="card">
              <div className="row h"><span>Boks</span><span>Status</span><span className="r">Fotos</span><span className="r">Film</span></div>
              <div className="row"><span>Scenepladsen, bar 1</span><span className="st">Online</span><span className="r">214</span><span className="r">62 %</span></div>
              <div className="row"><span>Scenepladsen, bar 2</span><span className="st">Online</span><span className="r">187</span><span className="r">71 %</span></div>
              <div className="row"><span>Campingen Øst</span><span className="st w">Film snart tom</span><span className="r">166</span><span className="r">9 %</span></div>
              <div className="row"><span>Campingen Vest</span><span className="st">Online</span><span className="r">118</span><span className="r">80 %</span></div>
              <div className="row"><span>Frivilligbyen</span><span className="st">Online</span><span className="r">74</span><span className="r">88 %</span></div>
              <div className="row"><span>Partnerområdet</span><span className="st">Online</span><span className="r">53</span><span className="r">93 %</span></div>
            </div>
            <div className="card theme">
              <span className="lab">Design</span>
              <b>Smukfest 2027</b>
              <Swatches keys={["base", "lime", "red", "cream"]} />
              <span className="btn">Aktivt</span>
            </div>
          </div>
          <p className="kat-fine kat-push" style={{ marginBottom: 86 }}>
            Eksempel med opdigtede tal og placeringer. Når film er ved at slippe op, får vores folk på pladsen besked og skifter den.
          </p>
          <Folio n={11} />
        </Page>

        {/* 12 BAGSIDE */}
        <Page n={12} cap="Bagside" dark>
          <Hearts n={8} />
          <span className="kat-kicker">Næste skridt</span>
          <h2>Lad os bygge Smukfests boks</h2>
          <p className="kat-lede">Vi gør designet færdigt sammen med jer, printer top og sider og har boksene klar til august.</p>
          <div className="kat-steps kat-steps--3" style={{ marginTop: 22 }}>
            <div><b>1</b><h3>Vi aftaler</h3><p>Antal bokse, placeringer og pris pr. foto.</p></div>
            <div><b>2</b><h3>Vi monterer</h3><p>Boksene hænges op og testes, før pladsen åbner.</p></div>
            <div><b>3</b><h3>I tjener</h3><p>Følg fotos og penge i kontrolpanelet hele festivalen.</p></div>
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
