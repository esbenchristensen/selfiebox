import Image from "next/image";

// Where the box is used. The grid is laid out for exactly five places; the first is the big one.
export type Venue = { src: string; name: string; text: string; alt: string; pos: string };

export function Venues({ label, title, lede, items }: { label: string; title: string; lede: string; items: Venue[] }) {
  return (
    <section className="section" aria-labelledby="venues-title">
      <div className="wrap">
        <div className="sec-head">
          <span className="label">{label}</span>
          <h2 id="venues-title" className="h-l">
            {title}
          </h2>
          <p className="lede">{lede}</p>
        </div>
        <div className="venues">
          {items.map((v, i) => (
            <figure className={`venue${i === 0 ? " venue--big" : ""}`} key={v.src}>
              <div className="venue-media">
                <Image
                  src={`/photos/${v.src}.jpg`}
                  alt={v.alt}
                  fill
                  sizes={i === 0 ? "(max-width: 900px) 90vw, 60vw" : "(max-width: 900px) 90vw, 30vw"}
                  style={{ objectFit: "cover", objectPosition: v.pos }}
                />
              </div>
              <figcaption>
                <b>{v.name}</b>
                <span>{v.text}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
