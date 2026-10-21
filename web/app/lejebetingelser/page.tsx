import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { company, companyAddress, contactHref, contactText } from "@/lib/company";

export const metadata: Metadata = {
  title: "Lejebetingelser for private | Selfi",
  description: "Betingelser for leje af Selfi Boks til bryllup, fødselsdag, konfirmation og firmafest: booking, levering, retur, forsikring, ombooking og afbestilling.",
  alternates: { canonical: "/lejebetingelser" },
};

// Consumer terms for renting a box for one party, booked on selfi.dk. UDKAST: the figures marked with
// (*) are decisions, not law: the deductible, the cancellation deadline and the late-return fee. Decide
// them, and have the text read by an adviser before the first paying customer. /vilkaar is for businesses.
const DEDUCTIBLE = "1.000 kr."; // (*) selvrisiko ved skade
const CANCEL_DAYS = 14; // (*) afbestilling uden beregning senest så mange dage før første lejedag
const LATE_FEE = "695 kr."; // (*) pr. påbegyndt dag ved for sen retur, svarer til dagsprisen

export default function Lejebetingelser() {
  return (
    <LegalPage
      label="Lejebetingelser"
      title="Lejebetingelser for private"
      lede="Gælder, når I lejer Selfi Boks til en fest gennem selfi.dk. De er skrevet, så de kan læses på fem minutter. Har I et spørgsmål, som ikke er besvaret her, så skriv til os."
      updated="21. oktober 2026 (version 1)"
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
        <li>I betaler hele beløbet med det samme gennem Stripe. Bookingen er bindende, når betalingen er gennemført, og I får en kvittering på mail.</li>
        <li>Mens I betaler, holdes datoerne til jer i 30 minutter. Bliver betalingen ikke gennemført, bliver datoerne ledige igen.</li>
        <li>Der er ikke noget depositum.</li>
      </ul>

      <h2>4. Levering</h2>
      <ul>
        <li>Vi sender boksen med posten til den pakkeshop, der ligger nærmest den adresse, I har skrevet, så den er fremme senest dagen før første lejedag. I får en sms eller mail fra pakketjenesten, når den kan hentes.</li>
        <li>Pakken skal hentes af jer eller en, I sender. Bliver pakken ikke hentet, før den sendes retur til os, er lejen stadig betalt.</li>
        <li>Bliver vi forsinkede, så boksen ikke er fremme senest dagen før, giver vi besked, så snart vi ved det. Når boksen ikke frem til jeres første lejedag, og det ikke skyldes jer, får I hele beløbet tilbage.</li>
      </ul>

      <h2>5. Mens boksen er hos jer</h2>
      <ul>
        <li>Boksen skal stå indendørs eller under tag, tørt og i 0 til 30 grader, på det medfølgende stativ og i en almindelig stikkontakt. Følg guiden i kassen og <a href="/dokumentation/brugsanvisning">brugsanvisningen</a>.</li>
        <li>Boksen må ikke åbnes, ændres, udlånes eller lejes videre.</li>
        <li>I er ansvarlige for boksen, fra I henter pakken, til I har afleveret den i pakkeshoppen igen, se punkt 7.</li>
        <li>I er værter for festen og bestemmer, hvem der tager billeder. Billederne er jeres og jeres gæsters. Hvordan vi behandler billeder og oplysninger, står i <a href="/privatliv">privatlivspolitikken</a>.</li>
      </ul>

      <h2>6. Retur</h2>
      <ul>
        <li>Senest den første hverdag efter sidste lejedag pakker I boksen og eventuelt printeren i kasserne, sætter returlabelen på og afleverer dem i en pakkeshop. Returfragten er betalt.</li>
        <li>Afleverer I senere end det, betaler I {LATE_FEE} pr. påbegyndt dag, og vi kan blive nødt til at aflyse en anden fest. Giv os besked med det samme, hvis I bliver forsinkede.</li>
        <li>Når boksen er tilbage hos os, tjekker vi den. Mangler der noget, eller er den beskadiget, skriver vi til jer inden for 5 hverdage.</li>
      </ul>

      <h2>7. Skader, tyveri og forsikring</h2>
      <ul>
        <li>Boksen er forsikret, mens den er hos jer, og forsikringen er med i prisen. Går boksen i stykker ved et uheld, betaler I højst en selvrisiko på {DEDUCTIBLE}</li>
        <li>Forsikringen dækker ikke skader, der er sket med vilje eller ved grov uagtsomhed, fx at boksen står i regn, bliver tabt fra højde eller bruges i strid med brugsanvisningen, og den dækker ikke, hvis boksen bliver væk eller stjålet. I de tilfælde betaler I for reparation eller en ny boks efter vores kostpris, dog højst 9.500 kr. for boksen og 4.500 kr. for printeren.</li>
        <li>Almindelig brug og almindelig slitage koster ikke noget.</li>
      </ul>

      <h2>8. Flyt datoen eller afbestil</h2>
      <ul>
        <li>I kan flytte til en anden ledig dato uden beregning, så længe boksen ikke er sendt. Skriv til os med jeres bookingnummer.</li>
        <li>Afbestiller I senest {CANCEL_DAYS} dage før første lejedag, får I hele beløbet tilbage inden for 5 hverdage.</li>
        <li>Afbestiller I senere end {CANCEL_DAYS} dage før, beholder vi lejen, men I kan stadig flytte datoen til en anden ledig dag inden for 12 måneder, så længe boksen ikke er sendt.</li>
        <li>Fortrydelsesret: Lejen er en tjenesteydelse til en bestemt dato, og derfor gælder den almindelige fortrydelsesret på 14 dage ikke (forbrugeraftalelovens § 18, stk. 2, nr. 12). I stedet gælder reglerne ovenfor, som i de fleste tilfælde stiller jer bedre.</li>
      </ul>

      <h2>9. Hvis boksen ikke virker</h2>
      <ul>
        <li>Boksen er testet, før den sendes, og vi kan se på afstand, om den er i gang. Virker den ikke på festen, så ring eller skriv til os med det samme, så hjælper vi.</li>
        <li>Kan boksen ikke bruges til festen, og skyldes det ikke jer, får I hele lejen tilbage. Virker den kun en del af tiden, aftaler vi et afslag.</li>
        <li>Udfald i jeres strøm eller wifi er ikke en fejl ved boksen. Boksen tager billeder uden internet, og billederne kommer på eventsiden, når den er på nettet igen.</li>
        <li>Vi erstatter ikke udgifter ud over lejen, fx til fotograf eller andre indslag.</li>
      </ul>

      <h2>10. Billederne</h2>
      <ul>
        <li>Billederne samles på jeres eventside, som kun kan ses af dem, der har linket. Vi bruger ikke billederne til noget og viser dem ikke for andre.</li>
        <li>Eventsiden er åben i mindst 3 måneder efter festen. Hent de billeder, I vil gemme, inden da.</li>
        <li>Vil en gæst have et billede fjernet, kan I slette det fra eventsiden, eller skrive til os, så gør vi det.</li>
      </ul>

      <h2>11. Klager</h2>
      <p>
        Er I utilfredse, så skriv til os først, så løser vi det sammen. Kan vi ikke blive enige, kan I klage til Center for Klageløsning, Nævnenes Hus,
        Toldboden 2, 8800 Viborg, <a href="https://naevneneshus.dk" target="_blank" rel="noreferrer">naevneneshus.dk</a>.
      </p>

      <h2>12. Øvrigt</h2>
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
