import Image from "next/image";
import { Booking } from "./booking/Booking";

export function Private() {
  return (
    <section id="privat" className="section" aria-labelledby="private-title">
      <div className="wrap">
        <div className="sec-head">
          <span className="label">Privat</span>
          <h2 id="private-title" className="h-l">
            Book en Selfi Boks til jeres fest.
          </h2>
          <p className="lede">Vælg pakke og dato, så holder vi boksen til jer. Den kommer på en stander, så den kan stå hvor som helst.</p>
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
        <div id="book">
          <Booking />
        </div>
      </div>
    </section>
  );
}
