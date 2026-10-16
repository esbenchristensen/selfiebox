import Image from "next/image";

// Where the box works: the same box, from the corner pub to the wedding.
const venues = [
  { src: "sted-bodega", name: "Bodegaen", text: "Stamgæsterne får et nyt samtaleemne ved siden af dartskiven.", pos: "50% 45%" },
  { src: "sted-gymnasie", name: "Gymnasiefesten", text: "Hele klassen på ét billede, før natten er slut.", pos: "35% 50%" },
  { src: "sted-festival", name: "Festivalen", text: "I festivalens farver, under tag og klar til regn.", pos: "60% 50%" },
  { src: "sted-julefrokost", name: "Julefrokosten", text: "Kollegerne bliver lidt sjovere end til hverdag.", pos: "55% 40%" },
  { src: "sted-hotel", name: "Hotelbaren", text: "Gæsterne tager hotellet med hjem.", pos: "30% 50%" },
];

export function Venues() {
  return (
    <section className="section" aria-labelledby="venues-title">
      <div className="wrap">
        <div className="sec-head">
          <span className="label">Overalt, hvor folk mødes</span>
          <h2 id="venues-title" className="h-l">
            Fra bodegaen til bryllupet.
          </h2>
          <p className="lede">Den samme lille boks på væggen eller på en stander. Den passer ind i et værtshus fra 1950 lige så godt som i en festival i skoven.</p>
        </div>
        <div className="venues">
          {venues.map((v, i) => (
            <figure className={`venue${i === 0 ? " venue--big" : ""}`} key={v.src}>
              <div className="venue-media">
                <Image
                  src={`/photos/${v.src}.jpg`}
                  alt={`Selfi Boks på væggen: ${v.name.toLowerCase()}`}
                  fill
                  sizes={i === 0 ? "(max-width: 900px) 90vw, 60vw" : "(max-width: 900px) 90vw, 30vw"}
                  style={{ objectFit: "cover", objectPosition: v.pos }}
                />
              </div>
              <figcaption>
                <b>{v.name}</b>
                <span>{v.text}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
