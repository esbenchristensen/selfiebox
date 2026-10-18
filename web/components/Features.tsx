import { FeatureIcon } from "./FeatureIcon";
import { featureGroups, features } from "@/content";

// Every function as a card with its icon, grouped like the mega menu. Each card opens its own page.
export function Features({ label = "Funktioner", title, lede, skip }: { label?: string; title: string; lede?: string; skip?: string }) {
  return (
    <section id="funktioner" className="section" aria-labelledby="features-title">
      <div className="wrap">
        <div className="sec-head">
          <span className="label">{label}</span>
          <h2 id="features-title" className="h-l">
            {title}
          </h2>
          {lede && <p className="lede">{lede}</p>}
        </div>
        {featureGroups.map((g) => {
          const items = features.filter((f) => f.group === g.id && f.slug !== skip);
          if (!items.length) return null;
          return (
            <div className="fgroup" key={g.id}>
              <h3 className="label">{g.name}</h3>
              <div className="fcards">
                {items.map((f) => (
                  <a className="fcard" key={f.slug} href={`/funktioner/${f.slug}`}>
                    <FeatureIcon d={f.icon} />
                    <span>
                      <b>{f.name}</b>
                      <span className="muted">{f.short}</span>
                    </span>
                  </a>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
