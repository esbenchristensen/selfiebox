import Image from "next/image";
import { packages } from "@/content";

const kr = (n: number) => n.toLocaleString("da-DK");

export function Private() {
  return (
    <section id="privat" className="section" aria-labelledby="private-title">
      <div className="wrap">
        <div className="sec-head">
          <span className="label">Privat</span>
          <h2 id="private-title" className="h-l">
            Til brylluppet, festen og firmafesten.
          </h2>
          <p className="lede">Vi leverer boksen på en stander, så den kan stå hvor som helst. Gæsterne klarer resten.</p>
        </div>
        <div className="private-media">
          {/* Placeholder until real photos from events exist */}
          <div className="ph p2" data-label="Foto fra et bryllup kommer her" role="img" aria-label="Pladsholder for foto fra et bryllup" />
          <div>
            <Image
              src="/renders/detail.jpg"
              alt="Nærbillede af kameraet i lysringens gab"
              width={1200}
              height={1500}
              sizes="(max-width: 900px) 90vw, 35vw"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        </div>
        <div className="pkgs">
          {packages.map((p) => (
            <div className="pkg" key={p.id}>
              {p.popular && <span className="tag">Mest valgt</span>}
              <h3>{p.name}</h3>
              <p className="muted">{p.period}</p>
              <span className="price">{p.price ? `${kr(p.price)} kr.` : "Pris efter dato"}</span>
              <a className="btn btn-secondary" href={`#kontakt`} data-pakke={p.id}>
                Få en pris
              </a>
            </div>
          ))}
          <div className="pkg">
            <h3>Noget andet</h3>
            <p className="muted">Festival, flere bokse eller jeres egne datoer</p>
            <span className="price">Vi giver et tilbud</span>
            <a className="btn btn-secondary" href="#kontakt">
              Skriv til os
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
