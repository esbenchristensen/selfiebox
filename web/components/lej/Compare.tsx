import { kr, type RentalSettings } from "@/lib/udlejning/core";

// Why Selfi: one price with everything in it, against what the other Danish rental sites charge for the
// same things. The figures for "andre" come from the rental sites' own pages (October 2026), see the note
// under the table. Rows read: what · Selfi · typically elsewhere.

type Row = { what: string; us: string; others: string; usGood?: boolean; minor?: boolean }; // minor rows are left out on phones

export function Compare({ s }: { s: RentalSettings }) {
  const rows: Row[] = [
    { what: "Boksen én hverdag", us: kr(s.prices.periods.day), others: "895–1.645 kr.", usGood: true },
    { what: "Weekend, fredag til søndag", us: kr(s.prices.periods.weekend), others: "999–1.500 kr.", usGood: true },
    { what: "Ubegrænsede billeder", us: "Med", others: "Med", usGood: true, minor: true },
    { what: "Rekvisitter", us: "Digitale på skærmen: hatte, briller og kroner, der følger ansigtet", others: "En kasse med fysiske rekvisitter, ofte som tilkøb", usGood: true },
    { what: "Spørgsmål og opgaver til gæsterne", us: "På skærmen, og de skifter i løbet af aftenen", others: "Papirkort som tilkøb, eller slet ikke", usGood: true },
    { what: "Jeres navne og datoen på billedet", us: "Med", others: "Logo mod tilkøb", usGood: true },
    { what: "Eventside med alle festens billeder", us: "Med", others: "99–349 kr.", usGood: true },
    { what: "Fragt begge veje", us: "Med", others: "Med hos de fleste", usGood: true, minor: true },
    { what: "Forsikring", us: "Med, uden depositum", others: "Med, eller depositum på op til 1.000 kr.", usGood: true },
    { what: `Printer med ${s.printsIncluded} print`, us: kr(s.prices.printer), others: "Fra 2.000 kr.", usGood: true },
  ];

  return (
    <section id="hvorfor" className="section lej-band" aria-labelledby="hvorfor-title">
      <div className="wrap">
        <div className="sec-head">
          <span className="label">Hvorfor Selfi</span>
          <h2 id="hvorfor-title" className="h-l">Én pris. Alt er med.</h2>
          <p className="lede">
            Andre udlejere lokker med en lav pris og tager betaling for resten: rekvisitter, galleri, gæstebog, print og depositum. Hos os er det hele med
            fra starten, og det meste af det er digitalt, så der er ingen kasser med rekvisitter at holde styr på.
          </p>
        </div>
        <div className="cmp" role="table" aria-label="Selfi sammenlignet med andre udlejere af fotobokse">
          <div className="cmp-head" role="row">
            <span role="columnheader">Det får I</span>
            <span role="columnheader" className="cmp-us">Selfi</span>
            <span role="columnheader">Typisk hos andre</span>
          </div>
          {rows.map((r) => (
            <div className={`cmp-row${r.minor ? " cmp-row--minor" : ""}`} role="row" key={r.what}>
              <span role="cell" className="cmp-what">{r.what}</span>
              <span role="cell" className={`cmp-us${r.usGood ? " is-good" : ""}`}>
                <i aria-hidden="true" />
                {r.us}
              </span>
              <span role="cell" className="cmp-them">{r.others}</span>
            </div>
          ))}
        </div>
        <p className="fine cmp-note">
          Priser og vilkår for andre udlejere er taget fra deres egne hjemmesider i oktober 2026 (Myselfie, Selfie.dk, MindeMagi, EasySelfie, Betty Booth,
          SelfieCircle og Simple Selfie) og kan være ændret siden. Alle beløb er inkl. moms.
        </p>
      </div>
    </section>
  );
}
