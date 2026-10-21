import { Ph } from "@/components/Placeholder";
import { proof } from "@/lib/erhverv/placeholder";

const n = (v: number) => v.toLocaleString("da-DK");

// Who uses the box and what it does in numbers, right under the hero. Everything here is a placeholder
// until the first places are live (lib/erhverv/placeholder.ts).
export function Proof() {
  return (
    <section className="proof" aria-label="Steder og tal">
      <div className="wrap proof-inner">
        <ul className="proof-logos" aria-label="Steder med Selfi">
          {proof.logos.map((name) => (
            <li key={name}>
              <Ph block note="kundelogo">
                <span className="proof-logo">{name}</span>
              </Ph>
            </li>
          ))}
        </ul>
        <dl className="proof-nums">
          <div>
            <dt>Steder</dt>
            <dd>
              <Ph note="antal steder med en boks">{proof.places}</Ph>
            </dd>
          </div>
          <div>
            <dt>Billeder sidste måned</dt>
            <dd>
              <Ph note="billeder taget i alle bokse sidste måned">{n(proof.photosLastMonth)}</Ph>
            </dd>
          </div>
          <div>
            <dt>Siger ja til tilbud</dt>
            <dd>
              <Ph note="andel af gæster med nummer, der siger ja til tilbud">{proof.optInShare} %</Ph>
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
