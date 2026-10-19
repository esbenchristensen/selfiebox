import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { company, companyAddress, contactHref, contactText } from "@/lib/company";

export const metadata: Metadata = {
  title: "Handelsbetingelser for erhverv | Selfi",
  description: "Selfis generelle betingelser for leje og abonnement på Selfi Boks til steder, virksomheder og arrangører.",
  alternates: { canonical: "/vilkaar" },
};

// General B2B terms. Selfi only sells to businesses, so consumer rules (fortrydelsesret, prices incl. VAT)
// do not apply. Anything agreed in the offer or order confirmation takes precedence over these terms.
export default function Vilkaar() {
  return (
    <LegalPage
      label="Handelsbetingelser"
      title="Handelsbetingelser for erhverv"
      lede="Gælder for alle aftaler om Selfi Boks mellem Selfi og virksomheder, foreninger, arrangører og offentlige kunder. Selfi sælger ikke til forbrugere."
      updated="19. oktober 2026 (version 2)"
    >
      <h2>1. Parter og aftalen</h2>
      <p>
        Leverandør: {company.legalName || company.name}
        {companyAddress && <>, {companyAddress}</>}
        {company.cvr && <>, CVR-nr. {company.cvr}</>} (&quot;Selfi&quot;). Kunde: den virksomhed eller organisation, der står i tilbuddet (&quot;kunden&quot;).
      </p>
      <p>
        Aftalen består af tilbuddet eller ordrebekræftelsen, disse betingelser og <a href="/databehandleraftale">databehandleraftalen</a>.
        Det, der står i tilbuddet, går forud for betingelserne. Kundens egne indkøbsbetingelser gælder kun, hvis Selfi har accepteret dem skriftligt.
        Et tilbud gælder i 30 dage, medmindre andet står i det.
      </p>

      <h2>2. Ydelsen</h2>
      <p>
        Selfi stiller Selfi Boks til rådighed i den periode og det antal, der er aftalt, med design, software, kontrolpanel, montering,
        overvågning, opdateringer og support som beskrevet i tilbuddet. Tilvalg, fx 4G, printer eller ekstra designs, er kun med, når de står i tilbuddet.
      </p>

      <h2>3. Ejendomsret og brug af boksen</h2>
      <ul>
        <li>Boksen, softwaren og designfilerne til boksen tilhører Selfi, medmindre andet er aftalt skriftligt. Kunden får brugsret i aftaleperioden.</li>
        <li>Kunden må ikke åbne, ændre, flytte, udlåne eller fjerne boksen fra det aftalte sted uden Selfis accept, og skal bruge den efter <a href="/dokumentation/brugsanvisning">brugsanvisningen</a>.</li>
        <li>Kunden sørger for en stikkontakt med HFI-relæ inden for kablets rækkevidde, adgang til monteringen og, hvis aftalt, Wi-Fi. Kunden sætter informationsskiltet til gæsterne op ved boksen.</li>
        <li>Logoer, billeder og tekster, kunden leverer til designet, må Selfi bruge til at lave og vise designet. Kunden indestår for at have ret til dem.</li>
      </ul>

      <h2>4. Pris og betaling</h2>
      <ul>
        <li>Alle priser er i danske kroner ekskl. moms.</li>
        <li>Abonnement faktureres forud for hver periode, engangsydelser ved levering. Betaling sker senest 8 dage efter fakturadato.</li>
        <li>Ved for sen betaling beregnes rente efter renteloven og kompensation efter rentelovens § 9 b. Efter skriftligt påkrav med 8 dages frist kan Selfi slukke for boksen, indtil der er betalt.</li>
        <li>Selfi kan regulere løbende priser én gang om året med 3 måneders varsel. Kunden kan opsige aftalen til ikrafttrædelsen.</li>
      </ul>

      <h2>5. Levering og montering</h2>
      <p>
        Selfi monterer og tester boksen på det aftalte sted og tidspunkt. Kan Selfi ikke levere til tiden, giver Selfi besked hurtigst muligt og
        aftaler en ny dato. Forsinkelse giver kun ret til at hæve aftalen, hvis den er væsentlig og Selfi ikke leverer inden for en rimelig frist.
      </p>

      <h2>6. Service, fejl og skader</h2>
      <ul>
        <li>Selfi overvåger boksen og retter fejl. Holder en boks op med at virke, sender Selfi en ny eller reparerer den uden beregning, ved fejl og almindelig slitage.</li>
        <li>Kunden giver Selfi besked hurtigst muligt om fejl og skader.</li>
        <li>Hvordan tyveri, hærværk og skader, som kunden, personale eller gæster forvolder med vilje eller grov uagtsomhed, dækkes, står i tilbuddet. Står der intet, betaler kunden for reparation eller ny boks efter Selfis kostpris.</li>
        <li>Selfi lover ikke en bestemt oppetid, medmindre det står i tilbuddet. Udfald i stedets internet eller strøm er ikke en fejl ved boksen.</li>
      </ul>

      <h2>7. Data, gæster og markedsføring</h2>
      <ul>
        <li>Kunden er dataansvarlig for alle billeder, videoer, lyd, telefonnumre og samtykker fra gæsterne, og Selfi er databehandler efter <a href="/databehandleraftale">databehandleraftalen</a>. Kunden har det fulde ansvar for, at indsamlingen og brugen er lovlig, herunder efter databeskyttelsesforordningen, markedsføringsloven, ophavsretsloven og spilleloven.</li>
        <li>Selfi leverer standardtekster til skærmen, skiltet og <a href="/brugsvilkaar">vilkårene for gæster</a>. De er et forslag, ikke rådgivning. Kunden skal selv vurdere, om de passer til kundens brug, og kan ændre dem i kontrolpanelet. Ændrede tekster er kundens instruks og kundens ansvar.</li>
        <li>Kunden bestemmer, hvordan content bruges (storskærm, sociale medier, annoncer, redigering), og må kun bruge det, gæsten har sagt ja til. Kunden skal fjerne content fra egne kanaler, når en gæst trækker sit ja tilbage, og selv overholde markedsføringsloven, når kunden sender SMS eller e-mail.</li>
        <li>Kunden sætter skiltet til gæsterne op ved boksen. Konkurrencer og lodtrækninger i boksen skal være gratis at deltage i.</li>
        <li>Kunden holder Selfi skadesløs for krav, bøder og udgifter, som skyldes kundens brug af gæsternes data og content, kundens tekster og instrukser eller manglende overholdelse af dette punkt.</li>
      </ul>

      <h2>8. Ansvar</h2>
      <ul>
        <li>Selfi er ikke ansvarlig for driftstab, mistet omsætning, avance, data, goodwill eller andre indirekte tab.</li>
        <li>Selfis samlede ansvar efter aftalen er begrænset til det beløb, kunden har betalt for de seneste 12 måneder, dog mindst 10.000 kr.</li>
        <li>Begrænsningerne gælder ikke ved forsæt eller grov uagtsomhed eller for produktansvar for skade på personer.</li>
        <li>Selfi er ikke ansvarlig for kundens brug af gæsternes billeder, videoer og data, for indhold, kunden lægger ind, eller for, om kundens samtykker og tekster er tilstrækkelige.</li>
        <li>Produktansvar følger produktansvarsloven. Selfi er ikke ansvarlig for skade på fast ejendom eller løsøre, som kunden hovedsageligt bruger erhvervsmæssigt, i det omfang loven tillader det.</li>
      </ul>

      <h2>9. Force majeure</h2>
      <p>
        Ingen af parterne er ansvarlige for forhold uden for deres kontrol, som de ikke burde have forudset, fx krig, oprør, naturkatastrofer, epidemier,
        strejke, myndighedsindgreb, brand, nedbrud hos internet- eller strømleverandører og manglende leverancer fra underleverandører af samme grund.
      </p>

      <h2>10. Varighed og opsigelse</h2>
      <p>
        Aftalen løber i den periode, der står i tilbuddet. Står der ikke en periode, kan begge parter opsige den skriftligt med 1 måneds varsel til
        udgangen af en måned. Ved væsentlig misligholdelse, som ikke er rettet senest 14 dage efter skriftligt påkrav, kan aftalen hæves. Når aftalen
        slutter, henter Selfi boksen, og kunden giver adgang til det.
      </p>

      <h2>11. Øvrigt</h2>
      <ul>
        <li>Selfi må nævne kunden som reference og vise billeder af boksen i kundens design, medmindre kunden har sagt nej skriftligt. Gæsternes billeder bruges ikke uden kundens accept.</li>
        <li>Selfi kan ændre betingelserne med 30 dages varsel. Ændringerne gælder ikke for allerede aftalte perioder, hvis de er til ugunst for kunden.</li>
        <li>Aftalen er underlagt dansk ret. Købelovens regler fraviges i det omfang, disse betingelser regulerer forholdet. Tvister afgøres ved Selfis hjemting, medmindre parterne aftaler voldgift.</li>
      </ul>
      <p>
        Spørgsmål: <a href={contactHref}>{contactText}</a>.
      </p>
    </LegalPage>
  );
}
