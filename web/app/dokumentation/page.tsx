import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { company, companyAddress, contactHref, contactText } from "@/lib/company";
import { product } from "@/lib/product";

export const metadata: Metadata = {
  title: "Dokumentation for Selfi Boks: CE, sikkerhed og data | Selfi",
  description: "EU-overensstemmelseserklæring, brugsanvisning og sikkerhed, gæsteinformation, databehandleraftale og handelsbetingelser for Selfi Boks.",
  alternates: { canonical: "/dokumentation" },
};

const docs = [
  { href: "/dokumentation/overensstemmelseserklaering", title: "EU-overensstemmelseserklæring", text: "CE-mærkning efter radioudstyrsdirektivet og RoHS, med standarder." },
  { href: "/dokumentation/brugsanvisning", title: "Brugsanvisning og sikkerhed", text: "Strøm, placering, vand og varme, radio, rengøring og bortskaffelse." },
  { href: "/gaester", title: "Information til gæster", text: "Hvad boksen gemmer, samtykke, slettefrister og rettigheder. Står på skiltet ved boksen." },
  { href: "/brugsvilkaar", title: "Vilkår for gæster", text: "Det, gæsten accepterer i boksen: brugsret til storskærm, sociale medier og markedsføring." },
  { href: "/databehandleraftale", title: "Databehandleraftale", text: "Aftalen om gæsternes data mellem stedet og Selfi, med sikkerhed og underdatabehandlere." },
  { href: "/vilkaar", title: "Handelsbetingelser", text: "Leje og abonnement for erhverv." },
  { href: "/privatliv", title: "Privatlivspolitik", text: "Hvordan Selfi behandler oplysninger om kunder og besøgende." },
  { href: "/cookies", title: "Cookies", text: "selfi.dk bruger ingen cookies til statistik eller reklamer." },
];

export default function Dokumentation() {
  return (
    <LegalPage
      label="Dokumentation"
      title="Dokumentation for Selfi Boks."
      lede="Alt, I og jeres gæster skal kunne finde om sikkerhed, CE-mærkning og data."
      updated={product.declared}
    >
      <ul className="doc-list">
        {docs.map((d) => (
          <li key={d.href}>
            <a href={d.href}>{d.title}</a>
            <span>{d.text}</span>
          </li>
        ))}
      </ul>

      <h2>Til print</h2>
      <ul>
        <li><a href="/dokumentation/halo-gen2-v8_eu-overensstemmelseserklaering.pdf">EU-overensstemmelseserklæring (PDF, A4)</a></li>
        <li><a href="/dokumentation/halo-gen2-v8_brugsanvisning-og-sikkerhed.pdf">Brugsanvisning og sikkerhed (PDF, A5, følger med boksen)</a></li>
      </ul>

      <h2>Produktinformation</h2>
      <table>
        <tbody>
          <tr><th>Produkt</th><td>{product.model}, type {product.type}</td></tr>
          <tr><th>Fabrikant</th><td>{company.legalName || company.name}{companyAddress && <>, {companyAddress}</>}</td></tr>
          <tr><th>Mærkning</th><td>CE, overstreget affaldsspand (elektronikaffald), typeskilt med serienummer bag på boksen</td></tr>
          <tr><th>Batterier</th><td>Ingen</td></tr>
        </tbody>
      </table>

      <h2 id="sikkerhedshuller">Rapportér et sikkerhedshul eller en ulykke</h2>
      <p>
        Har I fundet et sikkerhedshul i boksen, kontrolpanelet eller galleriet, eller er der sket en ulykke eller en farlig situation med en boks,
        så skriv til <a href={contactHref}>{contactText}</a>. Vi svarer inden for 2 hverdage, retter fejlen og fortæller, når den er rettet.
        Vi melder aktivt udnyttede sårbarheder og alvorlige hændelser til myndighederne efter cyberrobusthedsforordningen og farlige produkter
        via EU&apos;s Safety Business Gateway. Vi går ikke rettens vej mod nogen, der i god tro melder et sikkerhedshul til os og giver os tid til at rette det.
      </p>
    </LegalPage>
  );
}
