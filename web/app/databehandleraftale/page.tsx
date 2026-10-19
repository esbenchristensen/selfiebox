import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { company, companyAddress, contactHref, contactText } from "@/lib/company";

export const metadata: Metadata = {
  title: "Databehandleraftale | Selfi",
  description: "Selfis standard-databehandleraftale med de steder, der bruger Selfi Boks, efter GDPR artikel 28.",
  alternates: { canonical: "/databehandleraftale" },
};

// Standard data processing agreement (GDPR art. 28), built on the structure of the European Commission's
// standard contractual clauses between controllers and processors (implementing decision (EU) 2021/915).
// It is part of every customer agreement; the offer or order confirmation refers to this page.
export default function Databehandleraftale() {
  return (
    <LegalPage
      label="Databehandleraftale"
      title="Databehandleraftale"
      lede="Aftalen mellem det sted, der bruger Selfi Boks (dataansvarlig), og Selfi (databehandler). Den er en del af enhver aftale om Selfi Boks og gælder, så længe Selfi behandler data for stedet."
      updated="19. oktober 2026 (version 1)"
    >
      <h2>1. Parter og formål</h2>
      <p>
        <strong>Dataansvarlig:</strong> kunden, som angivet i tilbud eller ordrebekræftelse (&quot;stedet&quot;).<br />
        <strong>Databehandler:</strong> {company.legalName || company.name}
        {companyAddress && <>, {companyAddress}</>}
        {company.cvr && <>, CVR-nr. {company.cvr}</>} (&quot;Selfi&quot;).
      </p>
      <p>
        Aftalen sikrer, at Selfis behandling af personoplysninger for stedet sker efter databeskyttelsesforordningen (GDPR) art. 28, stk. 3 og 4.
        Den bygger på EU-Kommissionens standardkontraktbestemmelser (gennemførelsesafgørelse (EU) 2021/915). Ved uoverensstemmelse med
        andre aftaler mellem parterne går denne aftale forud for så vidt angår databeskyttelse.
      </p>

      <h2>2. Behandlingen</h2>
      <table>
        <tbody>
          <tr><th>Registrerede</th><td>Gæster, der bruger boksen, og stedets medarbejdere, der bruger kontrolpanelet</td></tr>
          <tr><th>Oplysninger</th><td>Billeder og videoer med lyd af gæster, telefonnumre, samtykker (tidspunkt, tekst og svar), alder ja/nej (over/under 15), tekniske logs, brugernavne og e-mails til kontrolpanelet</td></tr>
          <tr><th>Følsomme oplysninger</th><td>Ingen tilsigtet. Billeder og video bruges ikke til at identificere personer (ingen ansigtsgenkendelse) og behandles derfor ikke som biometriske data</td></tr>
          <tr><th>Formål</th><td>At drive Selfi Boks for stedet: tage og levere billeder og videoer, sende dem på SMS eller QR-kode, indhente og dokumentere samtykker, vise dem i kontrolpanel og på fotovæg, udlevere gæstelisten til stedet, samt drift, overvågning, support og sikkerhed</td></tr>
          <tr><th>Varighed</th><td>Så længe kundeaftalen løber. Slettefrister: billeder uden samtykke 30 dage, billeder og videoer med samtykke til de trækkes tilbage, dog højst 3 år, numre til markedsføring til de afmeldes eller ikke er brugt i 2 år, tekniske logs 90 dage. Stedet kan sætte kortere frister i kontrolpanelet</td></tr>
        </tbody>
      </table>

      <h2>3. Selfis forpligtelser</h2>
      <ol>
        <li><strong>Instruks.</strong> Selfi behandler kun oplysninger efter stedets dokumenterede instruks, som er denne aftale, kundeaftalen og stedets valg i kontrolpanelet. Er en instruks efter Selfis vurdering i strid med databeskyttelsesreglerne, siger Selfi det straks.</li>
        <li><strong>Formål.</strong> Oplysningerne bruges kun til formålene i punkt 2. Selfi bruger ikke stedets gæsters billeder eller numre til egne formål, fx egen markedsføring eller træning af AI, uden særskilt skriftlig aftale.</li>
        <li><strong>Fortrolighed.</strong> Kun de medarbejdere hos Selfi, der har brug for det, har adgang, og de har tavshedspligt.</li>
        <li><strong>Sikkerhed.</strong> Selfi gennemfører de tekniske og organisatoriske foranstaltninger i punkt 7 (GDPR art. 32) og holder dem opdateret.</li>
        <li><strong>Underdatabehandlere.</strong> Stedet giver generel tilladelse til de underdatabehandlere, der står i punkt 8. Selfi varsler nye eller udskiftede underdatabehandlere mindst 30 dage før, så stedet kan gøre indsigelse og om nødvendigt opsige aftalen. Selfi pålægger underdatabehandlere de samme forpligtelser som i denne aftale og hæfter for dem.</li>
        <li><strong>Overførsel til tredjelande.</strong> Overførsel uden for EU/EØS sker kun til lande med tilstrækkeligt beskyttelsesniveau, herunder virksomheder certificeret under EU-USA-dataprivatlivsrammen, eller med EU-Kommissionens standardkontraktbestemmelser.</li>
        <li><strong>Bistand.</strong> Selfi hjælper stedet med at svare på anmodninger fra registrerede (indsigt, sletning m.m.), med konsekvensanalyser og med forhåndshøring af Datatilsynet. Anmodninger, Selfi modtager direkte, sendes videre til stedet uden unødig forsinkelse.</li>
        <li><strong>Brud på persondatasikkerheden.</strong> Selfi underretter stedet uden unødig forsinkelse og senest 48 timer efter at være blevet opmærksom på et brud, med de oplysninger, stedet har brug for til at anmelde det til Datatilsynet inden for 72 timer.</li>
        <li><strong>Dokumentation og kontrol.</strong> Selfi stiller de oplysninger til rådighed, der er nødvendige for at vise, at aftalen overholdes, og giver mulighed for revision, normalt som en skriftlig redegørelse én gang om året. Rimelige udgifter til en fysisk revision afholdes af stedet.</li>
        <li><strong>Ophør.</strong> Når aftalen slutter, sletter Selfi stedets oplysninger senest 30 dage efter, medmindre stedet forinden har bedt om at få dem udleveret (gæsteliste og godkendt content kan hentes i kontrolpanelet), eller loven kræver, at de gemmes.</li>
      </ol>

      <h2>4. Stedets forpligtelser</h2>
      <ul>
        <li>Stedet har ansvaret for, at der er et lovligt grundlag for behandlingen, og for de tekster, temaer og aktiviteter, stedet selv lægger ind.</li>
        <li>Stedet sætter Selfis skilt med information til gæsterne op ved boksen og bruger kun billeder, videoer og numre, som gæsten har sagt ja til.</li>
        <li>Stedet sender kun markedsføring til numre på gæstelisten og stopper straks, når en gæst afmelder sig (markedsføringslovens § 10).</li>
      </ul>

      <h2>5. Ansvar</h2>
      <p>Hver part hæfter efter GDPR art. 82. Ansvarsbegrænsningen i kundeaftalen gælder ikke for bøder eller erstatning, der følger af en parts egne overtrædelser af databeskyttelsesreglerne.</p>

      <h2>6. Ændringer og opsigelse</h2>
      <p>
        Selfi kan opdatere aftalen, når lovgivningen eller tjenesten ændrer sig, med 30 dages varsel. Ændringer, der giver gæsterne et lavere
        beskyttelsesniveau, kræver stedets accept. Aftalen kan ikke opsiges særskilt, så længe Selfi behandler data for stedet.
      </p>

      <h2 id="sikkerhed">7. Tekniske og organisatoriske foranstaltninger</h2>
      <ul>
        <li>Al kommunikation mellem boks, server, kontrolpanel og gæstens telefon er krypteret (TLS). Data i databasen og lagringen er krypteret.</li>
        <li>Boksen gemmer kun billeder og videoer lokalt, indtil de er sendt til serveren, og sletter dem derefter. Kamera og mikrofon gemmer intet, før gæsten trykker start.</li>
        <li>Boksen kører kun software, Selfi har signeret, har ingen standardadgangskoder, og fjernadgang sker kun med personlige nøgler. Ubrugte tjenester og Bluetooth er slået fra.</li>
        <li>Personligt login til kontrolpanelet med totrinsbekræftelse for Selfis administratorer. Stedet ser kun sine egne data.</li>
        <li>Links til gæsternes billeder er lange og tilfældige, så de ikke kan gættes.</li>
        <li>Sikkerhedsopdateringer installeres automatisk. Selfi følger med i sårbarheder i de dele, boksen er bygget af, og retter dem.</li>
        <li>Automatisk sletning efter fristerne i punkt 2. Daglig backup, som slettes efter højst 30 dage.</li>
        <li>Adgang logges. Medarbejdere med adgang har tavshedspligt og instrueres i databeskyttelse.</li>
        <li>Boksen er låst til vægbeslaget med en sikkerhedsskrue, og en tabt eller stjålet boks kan spærres og slettes på afstand.</li>
      </ul>

      <h2 id="underdatabehandlere">8. Underdatabehandlere</h2>
      <table>
        <thead><tr><th>Underdatabehandler</th><th>Opgave</th><th>Placering</th><th>Overførselsgrundlag</th></tr></thead>
        <tbody>
          <tr><td>Vercel Inc.</td><td>Hosting af galleri, fotovæg og kontrolpanel</td><td>EU (Frankfurt) og USA</td><td>EU-USA-dataprivatlivsrammen og standardkontraktbestemmelser</td></tr>
          <tr><td>MongoDB Inc. (MongoDB Atlas på AWS)</td><td>Database</td><td>EU (Stockholm)</td><td>Data i EU. Standardkontraktbestemmelser for support fra USA</td></tr>
        </tbody>
      </table>
      <p>
        Bruger stedet SMS-deling, sendes beskeden gennem den SMS-udbyder, der står i kontrolpanelet. Spørgsmål til aftalen:{" "}
        <a href={contactHref}>{contactText}</a>.
      </p>
    </LegalPage>
  );
}
