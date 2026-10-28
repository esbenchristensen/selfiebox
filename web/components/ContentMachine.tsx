"use client";

import { useState } from "react";
import { contentCalc } from "@/content";

const n = (v: number) => Math.round(v).toLocaleString("da-DK");

const points = [
  { title: "Ægte gæster, ægte stemning", text: "Billederne og videoerne er taget af gæsterne selv, midt i aftenen. Det kan ingen kampagne iscenesætte." },
  { title: "Video med deres egne ord", text: "Gæsterne svarer på jeres spørgsmål foran kameraet i HD. Mikrofonmodulet gør lyden tydelig, også i et larmende lokale. Det giver udtalelser og hilsner, der virker, fordi de er ægte." },
  { title: "Høj kvalitet hele vejen", text: "12 MP-kamera med autofokus og HDR og studielys på ansigterne. Billederne kan bruges i annoncer og på storskærm, ikke kun på telefonen." },
  { title: "Klar til alle jeres kanaler", text: "Billeder og klip med samtykke ligger samlet i kontrolpanelet, klar til sociale medier, nyhedsbrev, hjemmeside, skærme og annoncer." },
  { title: "Ingen skal stå med kameraet", text: "Boksen arbejder hele aftenen, hver aften. Ingen medarbejder skal gå rundt, spørge om lov og samle filer bagefter." },
];

// The box as a content machine: what it makes in a month, and what the same amount would cost in staff time.
// The staff minutes are stated assumptions in content.ts, shown on the page, so the comparison stays honest.
export function ContentCalc() {
  const [nights, setNights] = useState(8);
  const [photos, setPhotos] = useState(60);
  const [videos, setVideos] = useState(8);
  const [wage, setWage] = useState(contentCalc.hourlyWage);

  const monthPhotos = photos * nights;
  const monthVideos = videos * nights;
  const hours = (monthPhotos * contentCalc.minutesPerPhoto + monthVideos * contentCalc.minutesPerVideo) / 60;

  return (
    <div className="calc cm-calc">
      <div className="ctl">
        <div className="ctl-row">
          <label htmlFor="cm-nights">Åbne aftener eller dage pr. måned</label>
          <output htmlFor="cm-nights">{nights}</output>
        </div>
        <input id="cm-nights" type="range" min={1} max={30} step={1} value={nights} onChange={(e) => setNights(+e.target.value)} />
      </div>
      <div className="ctl">
        <div className="ctl-row">
          <label htmlFor="cm-photos">Billeder pr. aften</label>
          <output htmlFor="cm-photos">{photos}</output>
        </div>
        <input id="cm-photos" type="range" min={10} max={300} step={10} value={photos} onChange={(e) => setPhotos(+e.target.value)} />
      </div>
      <div className="ctl">
        <div className="ctl-row">
          <label htmlFor="cm-videos">Videoklip pr. aften</label>
          <output htmlFor="cm-videos">{videos}</output>
        </div>
        <input id="cm-videos" type="range" min={0} max={60} step={1} value={videos} onChange={(e) => setVideos(+e.target.value)} />
      </div>
      <div className="ctl">
        <div className="ctl-row">
          <label htmlFor="cm-wage">Timepris for en medarbejder</label>
          <output htmlFor="cm-wage">{n(wage)} kr.</output>
        </div>
        <input id="cm-wage" type="range" min={150} max={600} step={25} value={wage} onChange={(e) => setWage(+e.target.value)} />
      </div>
      <div className="cm-out" aria-live="polite">
        <div>
          <span className="label">Billeder pr. måned</span>
          <b>{n(monthPhotos)}</b>
        </div>
        <div>
          <span className="label">Videoklip pr. måned</span>
          <b>{n(monthVideos)}</b>
        </div>
      </div>
      <div className="calc-total">
        <span className="label">Det samme med en medarbejder</span>
        <b>
          {n(hours)}
          <sup>timer</sup>
        </b>
        <span className="cm-cost">≈ {n(hours * wage)} kr. om måneden</span>
        <span className="fine">
          Et regneeksempel ud fra jeres tal, ikke en garanti. Vi regner med {contentCalc.minutesPerPhoto} minutter pr. billede og {contentCalc.minutesPerVideo} minutter pr. videoklip for en medarbejder, der skal finde gæsterne, spørge om lov, tage billedet eller klippet og samle filerne bagefter.
        </span>
      </div>
    </div>
  );
}

export function ContentMachine() {
  return (
    <section id="content" className="section" aria-labelledby="cm-title">
      <div className="wrap">
        <div className="sec-head">
          <span className="label">Content is king</span>
          <h2 id="cm-title" className="h-l">
            Ikke bare en fotoboks. En contentmaskine.
          </h2>
          <p className="lede">
            Selfi laver billeder og videoer af jeres gæster hver aften, I har åbent. Dem, gæsterne har sagt ja til, kan I bruge i jeres egne kanaler, og ingen skal stå med kameraet.
          </p>
        </div>
        <div className="cm">
          <div className="gains cm-points">
            {points.map((p) => (
              <div className="gain" key={p.title}>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </div>
            ))}
            <a className="btn btn-secondary" href="/funktioner/contentmaskine">
              Læs om contentmaskinen
            </a>
          </div>
          <ContentCalc />
        </div>
      </div>
    </section>
  );
}
