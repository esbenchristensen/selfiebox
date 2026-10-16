"use client";

import { useState } from "react";
import { business } from "@/content";

const kr = (n: number) => Math.round(n).toLocaleString("da-DK");

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
          <span className="label">Erhverv</span>
          <h2 id="biz-title" className="h-l">
            Hvert smil giver jer penge.
          </h2>
          <p className="lede">
            Gæsterne betaler pr. foto, og I bestemmer prisen. De første {business.costPerPhoto} kr. dækker papir og drift. Alt over er jeres.
          </p>
        </div>
        <div className="biz">
          <div>
            <span className="label">Leje pr. boks</span>
            <div className="price-big" style={{ marginTop: 12 }}>
              {kr(business.monthlyPricePerBox)}
              <sup>kr./md.</sup>
            </div>
            <p className="fine">Ekskl. moms.</p>
            <ul className="incl">
              <li>
                <b>Boksen</b> med lysring, skærm og fotomodul
              </li>
              <li>
                <b>Kontrolpanel</b> til pris, tema, lys og aktiviteter
              </li>
              <li>
                <b>Tal i realtid</b> for fotos og jeres andel
              </li>
            </ul>
          </div>
          <div className="calc" aria-labelledby="calc-title">
            <span id="calc-title" className="label">
              Regn jeres aften ud
            </span>
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
              <span className="label">Jeres overskud pr. måned</span>
              <b>
                {profit < 0 ? "− " : ""}
                {kr(Math.abs(profit))}
                <sup>kr.</sup>
              </b>
              <span className="fine">Et eksempel ud fra jeres tal, ekskl. moms. Ikke en garanti.</span>
            </div>
            <a className="btn btn-primary" href="#kontakt">
              Tal med os om jeres sted
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
