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
              src="/photos/reception.jpg"
              alt="Gæster til en reception tager et billede ved Selfi Boks"
              fill
              sizes="(max-width: 900px) 90vw, 55vw"
              style={{ objectFit: "cover", objectPosition: "60% 50%" }}
            />
          </div>
          <div>
            <Image
              src="/renders/wall.jpg"
              alt="Selfi Boks med fotomodul på en mørk væg"
              fill
              sizes="(max-width: 900px) 90vw, 35vw"
              style={{ objectFit: "cover", objectPosition: "50% 45%" }}
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
