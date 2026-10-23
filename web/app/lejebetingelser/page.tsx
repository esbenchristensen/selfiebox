import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { company, companyAddress, contactHref, contactText } from "@/lib/company";
import { DEFAULT_SETTINGS, GALLERY_MONTHS, KEEP_MONTHS } from "@/lib/udlejning/core";

const { changeDays: CHANGE_DAYS, refundPercent: REFUND } = DEFAULT_SETTINGS.rules;

export const metadata: Metadata = {
  title: "Lejebetingelser for private | Selfi",
  description: "Betingelser for leje af Selfi Boks til bryllup, fødselsdag, konfirmation og firmafest: booking, levering, retur, forsikring og afbestilling.",
  alternates: { canonical: "/lejebetingelser" },
};

// Consumer terms for renting a box for one party, booked on selfi.dk. UDKAST: the figures marked with
// (*) are decisions, not law: the deductible and the late-return fee. Decide them, and have the text read
// by an adviser before the first paying customer, together with the price list. /vilkaar is for businesses.
// Point 8 has no withdrawal right and no cancellation, and moves only to dates outside high season, relying on forbrugeraftalelovens § 18,
// stk. 2, nr. 12. That only holds if the customer is told before paying (checkout) and in the receipt.
const DEDUCTIBLE = "1.000 kr."; // (*) selvrisiko ved skade
const LATE_FEE = "895 kr."; // (*) pr. påbegyndt dag ved for sen retur, svarer til dagsprisen
const LOST_DAYS = 10; // (*) ikke afleveret så mange dage efter sidste lejedag: regnes som bortkommet
const HOURLY = "400 kr."; // (*) timepris for reparation og ekstra arbejde

// (*) Fixed prices for damage outside the insurance and for loss: the part, plus the work at HOURLY to take
// the box apart, fit, test and pack, rounded up. They must stay a fair estimate of the real loss, not a fine.
const DAMAGE_PRICES: [string, string][] = [
  ["Skærm", "1.500 kr."],
  ["Kamera", "800 kr."],
  ["Kabinet eller front", "1.500 kr."],
  ["Lysring", "800 kr."],
  ["Stativ", "1.000 kr."],
  ["Strømforsyning", "500 kr."],
  ["Kabel eller forlængerledning", "200 kr."],
  ["Kasse med skum", "600 kr."],
  ["AirTag", "300 kr."],
  ["Printer", "1.500 kr."],
  ["Brudt forsegling (sikkerhedsmærkat over skruerne)", "1.000 kr. plus eventuelle skader"],
  ["Ekstra rengøring, fx tape, pynt eller spild", "400 kr."],
  ["Boks bortkommet, stjålet eller totalskadet (med stativ og kasse)", "8.000 kr."],
  ["Andre skader", `Reservedele plus ${HOURLY} pr. påbegyndt time`],
];

export default function Lejebetingelser() {
  return (
    <LegalPage
      label="Lejebetingelser"
      title="Lejebetingelser for private"
      lede="Gælder, når I lejer Selfi Boks til en fest gennem selfi.dk. De er skrevet, så de kan læses på fem minutter. Har I et spørgsmål, som ikke er besvaret her, så skriv til os."
      updated="23. oktober 2026 (version 5)"
    >
      <h2>1. Hvem aftalen er mellem</h2>
      <p>
        Udlejer: {company.legalName || company.name}
        {companyAddress && <>, {companyAddress}</>}
        {company.cvr && <>, CVR-nr. {company.cvr}</>} (&quot;Selfi&quot;, &quot;vi&quot;). Lejer: den person, der booker på selfi.dk (&quot;I&quot;). I skal være fyldt 18 år.
      </p>
      <p>
        Lejer I til en virksomhed, et sted eller et arrangement, hvor boksen skal blive hængende, gælder <a href="/vilkaar">handelsbetingelserne for erhverv</a> i stedet.
      </p>

      <h2>2. Det, I lejer</h2>
      <p>
        Selfi Boks med gulvstativ, strømforsyning og kasse til forsendelse, i den periode I har valgt i kalenderen. Har I valgt printeren til, er den med
        i sin egen kasse sammen med det antal print, der stod på bookingen. Ubegrænsede billeder, jeres egen eventside, fragt begge veje og forsikring er
        altid med. Boksen bliver sat op til jeres fest ud fra de svar, I giver efter betalingen, og I kan rette opsætningen frem til festen.
      </p>

      <h2>3. Booking og betaling</h2>
      <ul>
        <li>Alle priser er i danske kroner og inkl. moms. Den samlede pris står i kalenderen og i kassen, før I betaler. Der kommer ikke noget oveni.</li>
        <li>I betaler hele beløbet med det samme gennem Stripe, fordi vi holder en boks til jer på de datoer, I har valgt. Bookingen er bindende, når betalingen er gennemført, og I får en kvittering på mail.</li>
        <li>Mens I betaler, holdes datoerne til jer i 30 minutter. Bliver betalingen ikke gennemført, bliver datoerne ledige igen.</li>
        <li>Der er ikke noget depositum.</li>
      </ul>

      <h2>4. Levering</h2>
      <ul>
        <li>Vi sender boksen med posten til den pakkeshop, der ligger nærmest den adresse, I har skrevet, så den er fremme senest dagen før første lejedag. I får en sms eller mail fra pakketjenesten, når den kan hentes.</li>
        <li>Pakken skal hentes af jer eller en, I sender. Bliver pakken ikke hentet, før den sendes retur til os, er lejen stadig betalt.</li>
        <li>Sæt boksen i stikkontakten, så snart I har hentet den, og se, at den starter. Virker den ikke, eller mangler der noget, så ring eller skriv til os med det samme, så vi kan nå at sende en ny før festen.</li>
        <li>Bliver vi forsinkede, så boksen ikke er fremme senest dagen før, giver vi besked, så snart vi ved det. Når boksen ikke frem til jeres første lejedag, og det ikke skyldes jer, får I hele beløbet tilbage.</li>
      </ul>

      <h2>5. Mens boksen er hos jer</h2>
      <ul>
        <li>Boksen skal stå indendørs eller under tag, tørt og i 0 til 30 grader, på det medfølgende stativ og i en almindelig stikkontakt. Følg guiden i kassen og <a href="/dokumentation/brugsanvisning">brugsanvisningen</a>.</li>
        <li>Boksen må ikke åbnes, ændres, udlånes eller lejes videre. Skruerne er forseglet med et sikkerhedsmærkat. Er det brudt, betaler I for eftersyn efter prislisten i punkt 7.</li>
        <li>Sæt ikke tape, klistermærker eller pynt direkte på boksen eller stativet.</li>
        <li>I er ansvarlige for boksen, fra I henter pakken, til I har afleveret den i pakkeshoppen igen, se punkt 7.</li>
        <li>I er værter for festen og bestemmer, hvem der tager billeder. Billederne er jeres og jeres gæsters. Hvordan vi behandler billeder og oplysninger, står i <a href="/privatliv">privatlivspolitikken</a>.</li>
      </ul>

      <h2>6. Retur</h2>
      <ul>
        <li>Senest den første hverdag efter sidste lejedag pakker I boksen og eventuelt printeren i de kasser, de kom i, sætter returlabelen på og afleverer dem i en pakkeshop. Returfragten er betalt.</li>
        <li>Gem kvitteringen fra pakkeshoppen. Den er jeres bevis for, at boksen er afleveret og hvornår. Uden kvittering kan vi ikke se det, hvis pakken bliver væk på vejen.</li>
        <li>Afleverer I senere end det, betaler I {LATE_FEE} pr. påbegyndt dag, og vi kan blive nødt til at aflyse en anden fest. Giv os besked med det samme, hvis I bliver forsinkede.</li>
        <li>Er boksen ikke afleveret {LOST_DAYS} dage efter sidste lejedag, regner vi den som bortkommet. Så betaler I erstatningen for en bortkommen boks i punkt 7, og gebyret for for sen retur stopper. Dukker boksen op igen i orden, får I erstatningen tilbage, fratrukket gebyret for de dage, den var for sent.</li>
        <li>Når boksen er tilbage hos os, tjekker vi den. Mangler der noget, eller er den beskadiget, skriver vi til jer inden for 5 hverdage.</li>
      </ul>

      <h2>7. Skader, tyveri og forsikring</h2>
      <ul>
        <li>Boksen er forsikret, mens den er hos jer, og forsikringen er med i prisen. Går boksen i stykker ved et uheld, betaler I højst en selvrisiko på {DEDUCTIBLE}</li>
        <li>Forsikringen dækker ikke skader, der er sket med vilje eller ved grov uagtsomhed, fx at boksen står i regn, bliver tabt fra højde eller bruges i strid med brugsanvisningen, og den dækker ikke, hvis boksen bliver væk eller stjålet. I de tilfælde betaler I efter prislisten nedenfor. Priserne er reservedelen plus vores arbejde med at skille boksen ad, sætte den nye del i, teste og pakke, til {HOURLY} i timen.</li>
        <li>Almindelig brug og almindelig slitage koster ikke noget.</li>
        <li>Skriv til os med det samme, hvis noget går i stykker eller bliver væk. Bliver boksen stjålet, skal I også anmelde det til politiet.</li>
      </ul>
      <table>
        <thead>
          <tr>
            <th>Skade eller bortkomst</th>
            <th>Pris inkl. moms</th>
          </tr>
        </thead>
        <tbody>
          {DAMAGE_PRICES.map(([what, price]) => (
            <tr key={what}>
              <td>{what}</td>
              <td>{price}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>8. Fortrydelsesret, flytning og afbestilling</h2>
      <ul>
        <li>Der er ikke fortrydelsesret. Lejen er en tjenesteydelse til jeres fest på de datoer, I har valgt, og vi holder boksen til jer de dage. Derfor gælder den almindelige fortrydelsesret på 14 dage ved køb på nettet ikke (forbrugeraftalelovens § 18, stk. 2, nr. 12).</li>
        <li>Senest {CHANGE_DAYS} dage før første lejedag kan I flytte bookingen gratis til andre ledige datoer med samme antal dage, eller afbestille den og få {REFUND} % af det betalte tilbage. Skriv til os, så klarer vi det.</li>
        <li>Senere end {CHANGE_DAYS} dage før første lejedag kan bookingen hverken flyttes eller afbestilles. Bruger I ikke boksen, får I ikke pengene tilbage.</li>
        <li>Det ændrer ikke punkt 4 og 9: kommer boksen ikke frem, eller kan den ikke bruges, og skyldes det ikke jer, får I hele lejen tilbage.</li>
      </ul>

      <h2>9. Hvis boksen ikke virker</h2>
      <ul>
        <li>Boksen er testet, før den sendes, og vi kan se på afstand, om den er i gang. Virker den ikke på festen, så ring eller skriv til os med det samme, så hjælper vi.</li>
        <li>Kan boksen ikke bruges til festen, og skyldes det ikke jer, får I hele lejen tilbage. Vi kan se på afstand, om boksen har været tændt og taget billeder i festens tidsrum, og det lægger vi til grund. Virker den kun en del af tiden, får I et forholdsmæssigt afslag.</li>
        <li>Udfald i jeres strøm eller wifi er ikke en fejl ved boksen. Boksen tager billeder uden internet, og billederne kommer på eventsiden, når den er på nettet igen.</li>
        <li>Vores ansvar er højst det, I har betalt for lejen. Vi erstatter ikke udgifter ud over lejen eller indirekte tab, fx til fotograf eller andre indslag.</li>
      </ul>

      <h2>10. Force majeure</h2>
      <ul>
        <li>Kan vi ikke levere på grund af forhold, vi ikke har indflydelse på, fx strejke hos pakketjenesten, ekstremt vejr eller myndighedspåbud, får I en ny dato eller hele lejen tilbage. I vælger.</li>
        <li>Sygdom, vejret på dagen eller at festen bliver aflyst eller flyttet hos jer, er ikke force majeure. Så gælder punkt 8.</li>
      </ul>

      <h2>11. Billederne</h2>
      <ul>
        <li>Billederne samles på jeres eventside, som kun kan ses af dem, der har linket. Vi bruger ikke billederne til noget og viser dem ikke for andre.</li>
        <li>Eventsiden er åben i {GALLERY_MONTHS} måneder efter festen. Har I købt tilvalget Billederne gemt i {KEEP_MONTHS} måneder, er den åben i {KEEP_MONTHS} måneder. Derefter sletter vi billederne, så hent dem, I vil gemme, inden da.</li>
        <li>Vil en gæst have et billede fjernet, kan I slette det fra eventsiden, eller skrive til os, så gør vi det.</li>
      </ul>

      <h2>12. Klager</h2>
      <p>
        Er I utilfredse, så skriv til os først, så løser vi det sammen. Kan vi ikke blive enige, kan I klage til Center for Klageløsning, Nævnenes Hus,
        Toldboden 2, 8800 Viborg, <a href="https://naevneneshus.dk" target="_blank" rel="noreferrer">naevneneshus.dk</a>.
      </p>

      <h2>13. Øvrigt</h2>
      <ul>
        <li>Vi kan ændre betingelserne, men ændringer gælder ikke for bookinger, der allerede er betalt.</li>
        <li>Aftalen er underlagt dansk ret.</li>
      </ul>
      <p>
        Spørgsmål: <a href={contactHref}>{contactText}</a>.
      </p>
    </LegalPage>
  );
}
