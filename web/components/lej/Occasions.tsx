import Image from "next/image";
import { kr } from "@/lib/udlejning/core";

// The parties people rent a box for, in the words they search with. Each card sends them to the calendar.
const OCCASIONS: { name: string; text: string; photo: string; alt: string }[] = [
  { name: "Bryllup", photo: "fest-bryllup", alt: "Bryllupsgæster foran Selfi Boks i en lade", text: "Alle gæster på billede med jeres navne og datoen. Det bliver den gæstebog, der faktisk bliver kigget i." },
  { name: "Konfirmation", photo: "fest-konfirmation", alt: "Konfirmand og veninder foran Selfi Boks i et festtelt", text: "Konfirmanden og vennerne går i boksen igen og igen, og familien har billederne på telefonen samme aften." },
  { name: "Rund fødselsdag", photo: "fest-fodselsdag", alt: "Fødselar med børnebørn foran Selfi Boks", text: "Fra børnebørnene til fødselaren: et tryk, en nedtælling, og alle er med." },
  { name: "Firmafest og julefrokost", photo: "fest-julefrokost", alt: "Kolleger med nissehuer foran Selfi Boks til julefrokost", text: "Kollegerne viser en side, man ikke ser til morgenmødet. Kvitteringen fra betalingen kan bruges som bilag." },
  { name: "Studenterfest", photo: "fest-studenter", alt: "Studenter med huer foran Selfi Boks", text: "Billederne fra den aften, I kommer til at tale om de næste 20 år, i godt lys og med alle på." },
  { name: "Barnedåb og jubilæum", photo: "fest-barnedaab", alt: "Familie med dåbsbarn foran Selfi Boks", text: "En rolig boks i hjørnet, der samler familien, mens kagen bliver skåret." },
];

export function Occasions({ from }: { from: number }) {
  return (
    <section id="anledninger" className="section" aria-labelledby="anledninger-title">
      <div className="wrap">
        <div className="sec-head">
          <span className="label">Anledninger</span>
          <h2 id="anledninger-title" className="h-l">Til den fest, I holder.</h2>
          <p className="lede">Boksen er den samme. Det er overskriften på skærmen, rammen på billedet og stemningen, der skifter.</p>
        </div>
        <ul className="occ">
          {OCCASIONS.map((o) => (
            <li key={o.name}>
              <a href="#datoer">
                <span className="occ-photo">
                  <Image src={`/photos/${o.photo}.jpg`} alt={o.alt} fill sizes="(max-width: 640px) 90vw, 30vw" style={{ objectFit: "cover" }} />
                </span>
                <b>{o.name}</b>
                <span className="muted">{o.text}</span>
                <span className="occ-foot">
                  <span>Fra {kr(from)}</span>
                  <span className="occ-go">Se ledige datoer →</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
