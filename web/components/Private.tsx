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
          <div>
            <Image
              src="/photos/sted-bryllup.jpg"
              alt="Brudepar og venner griner foran Selfi Boks på en stander til et bryllup i en lade"
              fill
              sizes="(max-width: 900px) 90vw, 55vw"
              style={{ objectFit: "cover", objectPosition: "50% 50%" }}
            />
          </div>
          <div>
            <Image
              src="/photos/reception.jpg"
              alt="Kolleger til en reception trykker på Selfi Boks på væggen"
              fill
              sizes="(max-width: 900px) 90vw, 35vw"
              style={{ objectFit: "cover", objectPosition: "75% 50%" }}
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
