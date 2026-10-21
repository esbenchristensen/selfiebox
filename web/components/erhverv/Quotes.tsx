import { Ph } from "@/components/Placeholder";
import { caseStudy, quotes } from "@/lib/erhverv/placeholder";

const n = (v: number) => v.toLocaleString("da-DK");

// What the places say, and one case with numbers. All of it is made up until the first places are live.
export function Quotes() {
  return (
    <section id="kunder" className="section" aria-labelledby="quotes-title">
      <div className="wrap">
        <div className="sec-head">
          <span className="label">Det siger stederne</span>
          <h2 id="quotes-title" className="h-l">
            Tre steder, tre fredage.
          </h2>
        </div>
        <div className="quotes">
          {quotes.map((q) => (
            <figure className="quote" key={q.name}>
              <Ph block note="opdigtet citat; skiftes til et rigtigt med navn, titel og sted">
                <blockquote>
                  <p>{q.text}</p>
                </blockquote>
                <figcaption>
                  <b>{q.name}</b>
                  <span className="muted">
                    {q.title}, {q.place}
                  </span>
                </figcaption>
              </Ph>
            </figure>
          ))}
        </div>
        <div className="case-study">
          <Ph block note="opdigtet case; skiftes til tal fra det første sted">
            <div className="case-study-head">
              <span className="label">Et sted i tal</span>
              <h3 className="h-m">
                {caseStudy.place}, {caseStudy.boxes} boks siden {caseStudy.since}
              </h3>
              <p className="muted">{caseStudy.text}</p>
            </div>
            <dl className="case-study-nums">
              <div>
                <dt>Billeder pr. aften</dt>
                <dd>{caseStudy.photosPerNight}</dd>
              </div>
              <div>
                <dt>Numre på listen pr. måned</dt>
                <dd>{n(caseStudy.numbersPerMonth)}</dd>
              </div>
              <div>
                <dt>Siger ja til tilbud</dt>
                <dd>{caseStudy.optIn}</dd>
              </div>
            </dl>
          </Ph>
        </div>
      </div>
    </section>
  );
}
