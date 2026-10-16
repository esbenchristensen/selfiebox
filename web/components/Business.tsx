"use client";

import Image from "next/image";
import { useState } from "react";
import { business } from "@/content";

const kr = (n: number) => Math.round(n).toLocaleString("da-DK");

const gains = [
  { title: "Glade gæster, der bliver længere", text: "Boksen giver gæsterne noget at gøre sammen. Køen ved boksen er en del af festen." },
  { title: "Omtale på sociale medier", text: "Hvert foto bærer jeres navn i rammen. Når gæsterne deler, ser deres venner, hvor de var." },
  { title: "Indhold til jeres egne kanaler", text: "Aftenens bedste fotos, delt med gæsternes tilladelse, kan bruges på jeres side og vises på en fotovæg i lokalet." },
  { title: "Jeres stil, hele vejen", text: "Et tema i jeres farver på boksen, lysringen, skærmen og fotorammen." },
  { title: "Aftener med noget at fortælle", text: "Titler, missioner, skattejagt og guld tid, som I slår til, når det passer." },
  { title: "Kører af sig selv", text: "Ingen personale ved boksen. I styrer tema, tekster og aktiviteter fra et kontrolpanel." },
];

export function Business() {
  const [price, setPrice] = useState(40);
  const [perNight, setPerNight] = useState(40);
  const [nights, setNights] = useState(8);

  const photos = perNight * nights;
  const gross = photos * price;
  const cost = photos * business.costPerPhoto;
  const profit = gross - cost - business.monthlyPricePerBox;

  return (
    <section id="erhverv" className="section" aria-labelledby="biz-title">
      <div className="wrap">
        <div className="sec-head">
          <span className="label">Til barer, hoteller og festivaler</span>
          <h2 id="biz-title" className="h-l">
            Glade gæster. Jeres navn i deres feed.
          </h2>
          <p className="lede">Selfi Boks hænger på væggen og gør en almindelig aften til én, folk deler. Det er den bedste reklame, der findes: gæster, der viser deres venner, hvor godt de har det hos jer.</p>
        </div>

        <figure className="biz-photo">
          <Image
            src="/photos/bodega.jpg"
            alt="Gæster på et værtshus ser på deres Instax-foto fra Selfi Boks på væggen"
            fill
            sizes="(max-width: 1200px) 95vw, 1160px"
            style={{ objectFit: "cover", objectPosition: "50% 55%" }}
          />
        </figure>

        <div className="gains">
          {gains.map((g) => (
            <div className="gain" key={g.title}>
              <h3>{g.title}</h3>
              <p>{g.text}</p>
            </div>
          ))}
        </div>

        <div className="biz">
          <div>
            <span className="label">Leje pr. boks</span>
            <div className="price-big" style={{ marginTop: 12 }}>
              {kr(business.monthlyPricePerBox)}
              <sup>kr./md.</sup>
            </div>
            <p className="fine">Ekskl. moms. Boks, lysring, skærm, fotomodul og kontrolpanel.</p>
            <div className="btn-row" style={{ marginTop: 24 }}>
              <a className="btn btn-primary" href="#kontakt">
                Tal med os om jeres sted
              </a>
            </div>
          </div>

          <details className="addon-earn">
            <summary>
              <span>
                <span className="label">Tilvalg</span>
                <b>Lad gæsterne betale pr. foto</b>
                <span className="muted">Vil I, kan boksen tage betaling. I bestemmer prisen, og alt over {business.costPerPhoto} kr. er jeres.</span>
              </span>
            </summary>
            <div className="calc">
              <div className="ctl">
                <div className="ctl-row">
                  <label htmlFor="c-price">Pris pr. foto</label>
                  <output htmlFor="c-price">{price} kr.</output>
                </div>
                <input id="c-price" type="range" min={business.minPhotoPrice} max={60} step={5} value={price} onChange={(e) => setPrice(+e.target.value)} />
              </div>
              <div className="ctl">
                <div className="ctl-row">
                  <label htmlFor="c-night">Fotos pr. aften</label>
                  <output htmlFor="c-night">{perNight}</output>
                </div>
                <input id="c-night" type="range" min={5} max={120} step={5} value={perNight} onChange={(e) => setPerNight(+e.target.value)} />
              </div>
              <div className="ctl">
                <div className="ctl-row">
                  <label htmlFor="c-nights">Åbne aftener pr. måned</label>
                  <output htmlFor="c-nights">{nights}</output>
                </div>
                <input id="c-nights" type="range" min={1} max={30} step={1} value={nights} onChange={(e) => setNights(+e.target.value)} />
              </div>
              <div className="calc-lines">
                <div>
                  <span>Gæsterne betaler</span>
                  <span>{kr(gross)} kr.</span>
                </div>
                <div>
                  <span>Papir og drift</span>
                  <span>− {kr(cost)} kr.</span>
                </div>
                <div>
                  <span>Leje af boksen</span>
                  <span>− {kr(business.monthlyPricePerBox)} kr.</span>
                </div>
              </div>
              <div className="calc-total" aria-live="polite">
                <span className="label">Overskud pr. måned</span>
                <b>
                  {profit < 0 ? "− " : ""}
                  {kr(Math.abs(profit))}
                  <sup>kr.</sup>
                </b>
                <span className="fine">Et eksempel ud fra jeres tal, ekskl. moms. Ikke en garanti.</span>
              </div>
            </div>
          </details>
        </div>
      </div>
    </section>
  );
}
