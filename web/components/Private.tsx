import Image from "next/image";
import { Booking } from "./booking/Booking";

export function Private() {
  return (
    <section id="privat" className="section" aria-labelledby="private-title">
      <div className="wrap">
        <div className="sec-head">
          <span className="label">Lej til festen</span>
          <h2 id="private-title" className="h-l">
            Lej en fotoboks til bryllup, fødselsdag eller firmafest.
          </h2>
          <p className="lede">I vælger selv dagene, og prisen følger antal dage: 495 kr. for en dag, 750 kr. for en weekend og 1.250 kr. for en uge, inkl. moms. Ubegrænsede billeder, en stander og jeres egen eventside med alle fotos er med i prisen. Vælg datoer i kalenderen herunder, så bekræfter vi på mail.</p>
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
