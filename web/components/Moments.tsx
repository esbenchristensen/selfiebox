import Image from "next/image";

// What the box gives the people in front of it. Each page picks its own scenes.

export type Moment =
  | { kind: "photo"; src: string; alt: string; pos?: string; title: string; text: string }
  | { kind: "phone"; src: string; caption: string; user: string; post: string; title: string; text: string };

export function Moments({ label, title, lede, items }: { label: string; title: string; lede: string; items: Moment[] }) {
  return (
    <section className="section" aria-labelledby="moments-title">
      <div className="wrap">
        <div className="sec-head">
          <span className="label">{label}</span>
          <h2 id="moments-title" className="h-l">
            {title}
          </h2>
          <p className="lede">{lede}</p>
        </div>
        <div className="moments">
          {items.map((m) => (
            <figure className="moment" key={m.title}>
              {m.kind === "photo" ? (
                <div className="moment-media">
                  <Image src={m.src} alt={m.alt} fill sizes="(max-width: 900px) 90vw, 30vw" style={{ objectFit: "cover", objectPosition: m.pos ?? "50% 50%" }} />
                </div>
              ) : (
                <div className="moment-media moment-media--phone" aria-hidden="true">
                  <div className="phone">
                    <div className="phone-head">
                      <i />
                      <span>
                        <b>{m.user}</b>
                        <small>for 2 timer siden</small>
                      </span>
                    </div>
                    <div className="phone-print">
                      <div className="phone-photo">
                        <Image src={m.src} alt="" fill sizes="200px" style={{ objectFit: "cover" }} />
                      </div>
                      <span className="print-cap">{m.caption}</span>
                    </div>
                    <p className="phone-text">{m.post}</p>
                  </div>
                </div>
              )}
              <figcaption>
                <h3>{m.title}</h3>
                <p>{m.text}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
