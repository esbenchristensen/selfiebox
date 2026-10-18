import { FeatureIcon } from "./FeatureIcon";
import { quality } from "@/content";

// Picture, video and sound quality: the reason the content is good enough to use outside the night itself.
export function Quality() {
  return (
    <section id="kvalitet" className="section" aria-labelledby="quality-title">
      <div className="wrap">
        <div className="sec-head">
          <span className="label">Kvalitet</span>
          <h2 id="quality-title" className="h-l">
            Skarpt billede, klar video og tydelig lyd.
          </h2>
          <p className="lede">Content er kun noget værd, hvis det kan bruges. Derfor er boksen bygget med kamera, studielys og mikrofon i høj kvalitet, så billeder og videoer kan gå direkte videre til jeres kanaler.</p>
        </div>
        <div className="quality">
          {quality.map((q) => (
            <div className="quality-item" key={q.title}>
              <FeatureIcon d={q.icon} />
              <h3>{q.title}</h3>
              <p>{q.text}</p>
              <ul>
                {q.facts.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
