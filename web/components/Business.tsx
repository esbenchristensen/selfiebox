"use client";

import Image from "next/image";
import { useState } from "react";
import { business } from "@/content";

const kr = (n: number) => Math.round(n).toLocaleString("da-DK");

const gains = [
  { title: "En gæsteliste, I må bruge", text: "Gæsterne skriver deres nummer for at få billedet på SMS og kan samtidig sige ja til at høre fra jer. Så kan I sende fredagens gæster et tilbud til næste weekend." },
  { title: "Omtale, I ikke betaler for", text: "Jeres navn står i rammen på hvert billede. Når gæsterne deler, ser deres venner, hvor de var." },
  { title: "Gæster, der bliver en omgang mere", text: "Guldtid, konkurrencer og missioner giver folk en grund til at blive. Præmien kan være en øl, I alligevel ville have solgt." },
  { title: "Billeder til jeres egne kanaler", text: "Hver aften får sin egen side med alle fotos. Siger gæsten ja, kan I bruge billedet på jeres sociale medier og på en fotovæg i lokalet." },
  { title: "Jeres stil, hele vejen", text: "Et tema i jeres farver på boksen, lysringen, skærmen og fotorammen." },
  { title: "Kører af sig selv", text: "Intet personale ved boksen. Tema, tekster, priser og aktiviteter styrer I fra et kontrolpanel på nettet." },
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
    <section id="gevinst" className="section" aria-labelledby="biz-title">
      <div className="wrap">
        <div className="sec-head">
          <span className="label">Hvad I får</span>
          <h2 id="biz-title" className="h-l">
            Gæsterne får det sjovt. I får omtalen og gæstelisten.
          </h2>
          <p className="lede">Selfi Boks hænger på væggen og kører uden personale. Hvert billede bærer jeres navn, hver deling viser jeres sted til nye mennesker, og hvert telefonnummer kan blive en gæst, der kommer igen.</p>
        </div>

        <figure className="biz-photo">
          <Image
            src="/photos/sted-vaertshus.jpg"
            alt="Venner på et travlt værtshus griner foran Selfi Boks på murstensvæggen"
            fill
            sizes="(max-width: 1200px) 95vw, 1160px"
            style={{ objectFit: "cover", objectPosition: "50% 45%" }}
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

        <div className="biz" id="pris">
          <div>
            <span className="label">Leje pr. boks</span>
            <div className="price-big" style={{ marginTop: 12 }}>
              {kr(business.monthlyPricePerBox)}
              <sup>kr./md.</sup>
            </div>
            <p className="fine">Ekskl. moms. Boks, lysring, skærm, fotomodul og kontrolpanel.</p>
            <div className="btn-row" style={{ marginTop: 24 }}>
              <a className="btn btn-primary" href="#kontakt">
                Book en uforpligtende snak
              </a>
            </div>
          </div>

          <details className="addon-earn">
            <summary>
              <span>
                <span className="label">Tilvalg</span>
                <b>Lad gæsterne betale pr. foto</b>
                <span className="muted">Vil I, kan boksen tage betaling for printede fotos. I sætter prisen, og alt over {business.costPerPhoto} kr. pr. foto går til jer.</span>
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
