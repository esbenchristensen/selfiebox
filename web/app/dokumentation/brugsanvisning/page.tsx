import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { company, companyAddress, contactHref, contactText } from "@/lib/company";
import { product, radios } from "@/lib/product";

export const metadata: Metadata = {
  title: "Brugsanvisning og sikkerhed for Selfi Boks | Selfi",
  description: "Sikkerhedsinformation, brug, placering, radiooplysninger og bortskaffelse for Selfi Boks gen 2.",
  alternates: { canonical: "/dokumentation/brugsanvisning" },
};

// Instructions and safety information in Danish (RED art. 10(8), GPSR art. 9(7)). The same text is printed
// as the A5 leaflet that goes with every box (halo-gen2-v8_brugsanvisning-og-sikkerhed.pdf).
export default function Brugsanvisning() {
  return (
    <LegalPage
      label="Dokumentation"
      title="Brugsanvisning og sikkerhed"
      lede={`${product.name} (${product.model}, type ${product.type}). Læs sikkerhedsinformationen, før boksen bruges, og gem den.`}
      updated={product.declared}
    >
      <h2>Hvad boksen er til</h2>
      <p>
        {product.name} er en fotoboks, som hænger på en væg eller en søjle på et sted, hvor gæster kommer: en bar, en klub, et hotel,
        en festival eller lignende. Gæsterne bruger selv berøringsskærmen til at tage billeder og korte videoer. Boksen er til
        erhvervsbrug. Selfi monterer, overvåger og vedligeholder den.
      </p>
      <p>Den må bruges indendørs og under tag, fx i et telt eller under et halvtag. Den er ikke til direkte regn, sne eller sol.</p>

      <h2>Sikkerhed</h2>
      <h3>Strøm</h3>
      <ul>
        <li>Brug kun den medfølgende strømforsyning ({product.psu}) og det medfølgende netkabel. En anden strømforsyning kan ødelægge boksen eller give brandfare.</li>
        <li>Strømforsyningen og stikket er kun til tørre steder. Læg dem indendørs eller i en tør, lukket boks, aldrig på jorden i et telt, hvor vand kan løbe.</li>
        <li>Sæt stikket i en stikkontakt med HFI/HPFI-relæ (fejlstrømsafbryder). Ved udendørs arrangementer skal der altid være HFI.</li>
        <li>Brug ikke et beskadiget netkabel eller en beskadiget strømforsyning. Træk stikket ud og kontakt Selfi.</li>
        <li>Stikket er boksens afbryder. Stikkontakten skal være let at komme til.</li>
      </ul>
      <h3>Vand, varme og sol</h3>
      <ul>
        <li>Boksen tåler stænk og spild under tag, men den er ikke vandtæt. Den må ikke spules, stå i regn eller få vand fra tagrender.</li>
        <li>Boksen er til omgivelser på {product.ambient}. Den må ikke stå i direkte sol eller op ad en varmekilde. Den bliver langsommere, hvis den bliver for varm, og slukker til sidst selv.</li>
        <li>Dæk ikke boksen til, mens den er tændt, og hold mindst 10 mm fri luft under den.</li>
      </ul>
      <h3>Montering</h3>
      <ul>
        <li>Boksen må kun monteres af Selfi eller efter Selfis anvisning, på en fast væg eller søjle med det medfølgende vægbeslag, fire skruer og dybler, der passer til væggen. Den vejer {product.weight}.</li>
        <li>Placer boksen, så ingen kan falde over kablet, og så den ikke sidder, hvor døre, stole eller folk i bevægelse kan ramme den.</li>
        <li>Vi anbefaler, at skærmens midte sidder ca. 120–140 cm over gulvet, så den også kan bruges fra en kørestol.</li>
      </ul>
      <h3>Brug</h3>
      <ul>
        <li>Åbn ikke boksen. Der er ingen dele indeni, som brugeren kan reparere. Kun Selfi må åbne den.</li>
        <li>Skærmen er af glas. Er glasset revnet eller knust, så træk stikket ud, dæk skærmen til og kontakt Selfi. Rør ikke ved de skarpe kanter.</li>
        <li>Lugter boksen brændt, kommer der røg, bliver den meget varm, eller er der kommet væske ind i den: træk stikket ud med det samme, og kontakt Selfi.</li>
        <li>Boksen er ikke legetøj. Man må ikke hænge i den eller klatre på den.</li>
        <li>Lyset i boksen kan blinke og skifte farve. Effekterne blinker højst 3 gange i sekundet, så de ikke kan udløse epileptiske anfald. Kig ikke ind i lyset på kort afstand i lang tid.</li>
      </ul>
      <h3>Rengøring</h3>
      <p>Tør boksen og skærmen af med en blød, let fugtig klud. Brug ikke opløsningsmidler, sprit i store mængder, slibende midler eller højtryksrenser.</p>

      <h2>Sådan bruges boksen</h2>
      <ol>
        <li>Boksen tænder af sig selv, når stikket er sat i, og viser stedets startskærm efter ca. 1 minut.</li>
        <li>Gæsten trykker på skærmen for at starte. Kameraet og mikrofonen gemmer intet, før gæsten har trykket start.</li>
        <li>Skærmen tæller ned, lyset går op, og billedet eller videoen bliver taget.</li>
        <li>Gæsten får billedet via en QR-kode eller på SMS og kan svare ja eller nej til, om stedet må bruge det.</li>
        <li>Stedet ændrer tema, tekster og aktiviteter i kontrolpanelet, eller Selfi gør det for dem.</li>
      </ol>
      <p>
        Gæsterne kan læse om deres billeder og data på <a href="/gaester">selfi.dk/gaester</a>. Sæt det medfølgende skilt op ved boksen.
      </p>

      <h2 id="radio">Radio</h2>
      <p>Boksen indeholder disse radiosendere. Moduler mærket &quot;tilvalg&quot; findes kun i nogle bokse.</p>
      <table>
        <thead><tr><th>Del</th><th>Bruges til</th><th>Frekvensbånd</th><th>Maks. sendeeffekt</th></tr></thead>
        <tbody>
          {radios.map((r) => (
            <tr key={r.part + r.band}>
              <td>{r.part}{r.optional && " (tilvalg)"}</td>
              <td>{r.use}</td>
              <td>{r.band}</td>
              <td>{r.power}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>
        <strong>Begrænsning:</strong> I alle EU-lande (AT, BE, BG, CY, CZ, DE, DK, EE, EL, ES, FI, FR, HR, HU, IE, IT, LT, LU, LV, MT, NL, PL, PT, RO, SE, SI, SK)
        samt NO, IS, LI, CH og UK må Wi-Fi i båndet 5150–5350 MHz kun bruges indendørs. Når boksen står udendørs under tag, indstiller Selfi den til ikke at bruge det bånd.
      </p>
      <p>
        Sendeeffekterne er lave, og antennerne sidder inde i boksen bag skærmen. Ved normal brug er man langt under grænseværdierne for elektromagnetiske felter.
      </p>

      <h2>Bortskaffelse</h2>
      <p>
        Symbolet med den overstregede affaldsspand på boksen betyder, at den ikke må smides ud med almindeligt affald. Boksen ejes af Selfi og skal
        leveres tilbage til Selfi, som sørger for, at den bliver genbrugt eller genanvendt efter reglerne for elektronikaffald. Det koster ikke noget.
        Elektronik kan indeholde stoffer, der skader miljø og helbred, hvis de ikke behandles rigtigt. Boksen indeholder ingen batterier.
      </p>

      <h2>Overensstemmelse</h2>
      <p>
        Hermed erklærer {company.legalName || company.name}, at radioudstyrstypen {product.model} (type {product.type}) er i overensstemmelse med direktiv 2014/53/EU.
        EU-overensstemmelseserklæringens fulde tekst kan findes på følgende internetadresse:{" "}
        <a href="/dokumentation/overensstemmelseserklaering">selfi.dk/dokumentation/overensstemmelseserklaering</a>.
      </p>

      <h2>Tekniske data</h2>
      <table>
        <tbody>
          <tr><th>Model</th><td>{product.model}, type {product.type}, hardware {product.hardware}</td></tr>
          <tr><th>Strøm ind</th><td>{product.rating} fra den medfølgende strømforsyning</td></tr>
          <tr><th>Mål</th><td>{product.size}</td></tr>
          <tr><th>Vægt</th><td>{product.weight}</td></tr>
          <tr><th>Omgivelser</th><td>{product.ambient}, ikke direkte sol eller regn</td></tr>
          <tr><th>Kabinet</th><td>3D-printet ASA</td></tr>
          <tr><th>Typeskilt</th><td>Bag på boksen, til højre for vægbeslaget. Her står serienummeret.</td></tr>
        </tbody>
      </table>

      <h2>Fabrikant og kontakt</h2>
      <p>
        {company.legalName || company.name}
        {companyAddress && <>, {companyAddress}</>}
        {company.cvr && <>, CVR-nr. {company.cvr}</>}. Fejl, ulykker og spørgsmål om sikkerhed: <a href={contactHref}>{contactText}</a>
        {company.phone && <>, tlf. {company.phone}</>}.
      </p>
    </LegalPage>
  );
}
