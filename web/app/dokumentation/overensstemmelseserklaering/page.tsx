import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { company, companyAddress } from "@/lib/company";
import { product } from "@/lib/product";

export const metadata: Metadata = {
  title: "EU-overensstemmelseserklæring for Selfi Boks | Selfi",
  description: "Den fulde EU-overensstemmelseserklæring for Selfi Boks gen 2 efter radioudstyrsdirektivet (RED) og RoHS-direktivet.",
  alternates: { canonical: "/dokumentation/overensstemmelseserklaering" },
};

// The full EU declaration of conformity (RED annex VI). The box carries the simplified declaration
// (RED annex VII) with a link to this page, so this text must stay at this address.
export default function Overensstemmelseserklaering() {
  return (
    <LegalPage
      label="Dokumentation"
      title="EU-overensstemmelseserklæring"
      lede="Fuld tekst efter radioudstyrsdirektivet 2014/53/EU, bilag VI. Nr. SB2-DoC-001."
      updated={product.declared}
    >
      <h2>1. Produkt</h2>
      <table>
        <tbody>
          <tr><th>Produkt</th><td>{product.name}, interaktiv fotoboks til vægmontering</td></tr>
          <tr><th>Model og type</th><td>{product.model}, type {product.type}</td></tr>
          <tr><th>Hardwareversion</th><td>{product.hardware}</td></tr>
          <tr><th>Serienummer</th><td>Alle enheder med serienummer SB2-2026-0001 og frem (står på typeskiltet bag på boksen)</td></tr>
          <tr><th>Mærkedata</th><td>{product.rating}</td></tr>
          <tr><th>Varianter</th><td>Med eller uden 4G-modem (Waveshare SIM7600G-H) og mikrofonkort (reSpeaker XVF3800). Erklæringen dækker alle varianter.</td></tr>
        </tbody>
      </table>

      <h2>2. Fabrikant</h2>
      <p>
        {company.legalName || company.name}
        {companyAddress && <>, {companyAddress}</>}
        {company.cvr && <>, CVR-nr. {company.cvr}</>}
        {company.email && <>, {company.email}</>}
        {!companyAddress && <>, {company.web}</>}
      </p>

      <h2>3. Erklæring</h2>
      <p>Denne overensstemmelseserklæring udstedes på fabrikantens ansvar.</p>

      <h2>4. Genstand for erklæringen</h2>
      <p>
        {product.name} ({product.model}): fotoboks med 10&quot; berøringsskærm, kamera, LED-lys og højttaler, styret af en Raspberry Pi 5 med Wi-Fi.
        Kabinettet er 3D-printet i ASA. Boksen forsynes fra den medfølgende eksterne strømforsyning {product.psu}.
      </p>

      <h2>5. Overensstemmelse</h2>
      <p>Genstanden for erklæringen er i overensstemmelse med den relevante EU-harmoniseringslovgivning:</p>
      <ul>
        <li>Direktiv 2014/53/EU om radioudstyr (RED), herunder artikel 3, stk. 1, litra a (sikkerhed og sundhed), litra b (elektromagnetisk kompatibilitet), stk. 2 (effektiv udnyttelse af radiospektret) og stk. 3, litra d og e, jf. delegeret forordning (EU) 2022/30 (beskyttelse af net og af personoplysninger).</li>
        <li>Direktiv 2011/65/EU om begrænsning af anvendelsen af visse farlige stoffer i elektrisk og elektronisk udstyr (RoHS), med ændringer i delegeret direktiv (EU) 2015/863.</li>
      </ul>

      <h2>6. Anvendte harmoniserede standarder og andre tekniske specifikationer</h2>
      <table>
        <thead><tr><th>Krav</th><th>Standard</th></tr></thead>
        <tbody>
          <tr><td>Sikkerhed, art. 3.1(a)</td><td>EN IEC 62368-1:2020+A11:2020; EN 62311:2008 (elektromagnetiske felter); EN 62471:2008 (fotobiologisk sikkerhed, LED-lys)</td></tr>
          <tr><td>EMC, art. 3.1(b)</td><td>ETSI EN 301 489-1 V2.2.3; ETSI EN 301 489-17 V3.2.4; ETSI EN 301 489-52 V1.2.1 og ETSI EN 301 489-19 V2.2.1 (med 4G-modem); EN 55032:2015+A11:2020; EN 55035:2017+A11:2020</td></tr>
          <tr><td>Radio, art. 3.2</td><td>ETSI EN 300 328 V2.2.2; ETSI EN 301 893 V2.1.1; med 4G-modem desuden ETSI EN 301 511 V12.5.1, ETSI EN 301 908-1 V15.1.1, -2 V13.1.1, -13 V13.2.1 og ETSI EN 303 413 V1.2.1</td></tr>
          <tr><td>Cybersikkerhed, art. 3.3(d) og (e)</td><td>EN 18031-1:2024; EN 18031-2:2024</td></tr>
          <tr><td>RoHS</td><td>EN IEC 63000:2018</td></tr>
        </tbody>
      </table>
      <p>
        Radiodelene er færdige moduler med egen EU-overensstemmelseserklæring (Raspberry Pi 5, Gledopto GL-C-016WL-D, Seeed XIAO ESP32-S3,
        Waveshare SIM7600G-H). De er bygget ind uden ændringer og med fabrikantens egne antenner, efter fabrikanternes anvisninger.
      </p>

      <h2>7. Bemyndiget organ</h2>
      <p>
        Ikke relevant. Overensstemmelsen er vurderet efter intern produktionskontrol (modul A, RED bilag II), og der er ikke brugt et bemyndiget organ.
      </p>

      <h2>8. Tilbehør og software</h2>
      <p>
        Ekstern strømforsyning {product.psu} med netkabel, vægbeslag og låseskrue. Boksen kører Selfis egen software,
        som opdateres automatisk; softwareopdateringer ændrer ikke boksens radioegenskaber.
      </p>

      <h2>9. Supplerende oplysninger</h2>
      <p>
        I alle EU-lande må Wi-Fi i båndet 5150–5350 MHz kun bruges indendørs. Frekvensbånd og maksimal sendeeffekt står i{" "}
        <a href="/dokumentation/brugsanvisning#radio">brugsanvisningen</a>.
      </p>

      <div className="sign">
        <p>Underskrevet for og på vegne af {company.legalName || company.name}:</p>
        <p>
          {companyAddress ? companyAddress.split(", ").slice(-2, -1)[0] ?? "" : "Danmark"}, {product.declared}
          <br />
          {company.signatory.name}, {company.signatory.title.toLowerCase()}
        </p>
      </div>
    </LegalPage>
  );
}
