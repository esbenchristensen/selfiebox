import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { company, companyAddress, contactHref, contactText } from "@/lib/company";

export const metadata: Metadata = {
  title: "Privatlivspolitik | Selfi",
  description: "Sådan behandler Selfi personoplysninger om kunder, kontaktpersoner og besøgende på selfi.dk.",
  alternates: { canonical: "/privatliv" },
};

// Selfi as data controller (GDPR art. 13 and 14): contacts, customers, users of the control panel and visitors
// to selfi.dk. Guests in the boxes are covered by /gaester, where the venue is the controller.
export default function Privatliv() {
  return (
    <LegalPage
      label="Privatliv"
      title="Privatlivspolitik"
      lede="Sådan behandler Selfi oplysninger om jer, der kontakter os, er kunder hos os eller besøger selfi.dk."
      updated="19. oktober 2026"
    >
      <h2>Dataansvarlig</h2>
      <p>
        {company.legalName || company.name}
        {companyAddress && <>, {companyAddress}</>}
        {company.cvr && <>, CVR-nr. {company.cvr}</>}. Kontakt: <a href={contactHref}>{contactText}</a>.
      </p>
      <p>
        Gæster, der bruger en Selfi Boks, kan læse om deres billeder og data på <a href="/gaester">selfi.dk/gaester</a>. Her er det stedet,
        hvor boksen står, der er dataansvarlig, og Selfi er databehandler.
      </p>

      <h2>Hvad vi behandler, hvorfor og hvor længe</h2>
      <table>
        <thead><tr><th>Hvem</th><th>Oplysninger</th><th>Formål og grundlag</th><th>Slettes</th></tr></thead>
        <tbody>
          <tr>
            <td>I, der skriver til os</td>
            <td>Navn, e-mail, telefon, sted og besked fra kontaktformularen</td>
            <td>At svare og lave et tilbud. Legitim interesse og skridt før en aftale (GDPR art. 6, stk. 1, litra b og f)</td>
            <td>12 måneder efter sidste kontakt, hvis I ikke bliver kunde</td>
          </tr>
          <tr>
            <td>Kunder og kontaktpersoner</td>
            <td>Navn, firma, CVR, adresse, e-mail, telefon, aftaler, fakturaer og henvendelser</td>
            <td>At levere og passe boksene, fakturere og give support (litra b). Bogføring (litra c, bogføringsloven)</td>
            <td>Når aftalen slutter. Bogføringsbilag gemmes i 5 år efter regnskabsårets udløb</td>
          </tr>
          <tr>
            <td>Brugere af kontrolpanelet</td>
            <td>Navn, e-mail, login, hvad der er ændret og hvornår</td>
            <td>At give adgang og holde kontrolpanelet sikkert (litra b og f)</td>
            <td>Når brugeren lukkes, logs efter 12 måneder</td>
          </tr>
          <tr>
            <td>Besøgende på selfi.dk</td>
            <td>IP-adresse, browser, tidspunkt og side i hostingudbyderens tekniske logs</td>
            <td>At levere siden og stoppe angreb og misbrug (litra f)</td>
            <td>Efter hostingudbyderens faste frister, normalt få dage til 30 dage</td>
          </tr>
        </tbody>
      </table>
      <p>Vi bruger ingen cookies til statistik eller markedsføring, se <a href="/cookies">cookies</a>. Vi sender ikke nyhedsbreve uden samtykke.</p>

      <h2>Hvem vi deler med</h2>
      <p>
        Vi sælger aldrig oplysninger. Vi bruger leverandører, der behandler oplysninger for os efter databehandleraftaler: Vercel Inc.
        (hosting af hjemmesiden og kontrolpanelet, USA), MongoDB Inc. (database, servere i EU), samt vores e-mail-, besked- og regnskabsværktøjer.
        Overførsler til USA sker efter EU-USA-dataprivatlivsrammen og EU-Kommissionens standardkontraktbestemmelser. Revisor og myndigheder
        får oplysninger, når loven kræver det.
      </p>

      <h2>Jeres rettigheder</h2>
      <p>
        I har ret til indsigt, berigtigelse, sletning, begrænsning, dataportabilitet og til at gøre indsigelse mod behandling, der sker på grundlag af
        legitim interesse. Skriv til <a href={contactHref}>{contactText}</a>. Vi svarer inden for en måned.
      </p>
      <p>
        I kan klage til Datatilsynet, Carl Jacobsens Vej 35, 2500 Valby, <a href="https://www.datatilsynet.dk">datatilsynet.dk</a>.
      </p>

      <h2>Sikkerhed</h2>
      <p>
        Al trafik er krypteret, adgang er personlig og begrænset til dem, der har brug for den, og vi melder brud på sikkerheden til Datatilsynet
        inden for 72 timer, når loven kræver det. Se de tekniske og organisatoriske foranstaltninger i{" "}
        <a href="/databehandleraftale#sikkerhed">databehandleraftalen</a>.
      </p>
    </LegalPage>
  );
}
