import Image from "next/image";

// Where the box works: the same box, from the corner pub to the wedding.
const venues = [
  { src: "sted-bodega", name: "Bodegaen", text: "Et nyt samtaleemne mellem dartskiven og baren.", pos: "50% 45%" },
  { src: "sted-gymnasie", name: "Gymnasiefesten", text: "Hele klassen på ét billede, før natten er slut.", pos: "35% 50%" },
  { src: "sted-festival", name: "Festivalen", text: "I festivalens farver og under tag, så regnen ikke stopper den.", pos: "60% 50%" },
  { src: "sted-julefrokost", name: "Julefrokosten", text: "Kollegerne viser en side, man ikke ser til morgenmødet.", pos: "55% 40%" },
  { src: "sted-hotel", name: "Hotelbaren", text: "Et minde fra opholdet med hotellets navn i rammen.", pos: "30% 50%" },
];

export function Venues() {
  return (
    <section className="section" aria-labelledby="venues-title">
      <div className="wrap">
        <div className="sec-head">
          <span className="label">Hvor den passer ind</span>
          <h2 id="venues-title" className="h-l">
            Fra bodegaen til bryllupet.
          </h2>
          <p className="lede">Boksen er lidt større end et A4-ark og kun 6,6 cm dyb. Den hænger på væggen eller står på en stander, så den passer ind i et værtshus fra 1950 og i et festivaltelt i skoven.</p>
        </div>
        <div className="venues">
          {venues.map((v, i) => (
            <figure className={`venue${i === 0 ? " venue--big" : ""}`} key={v.src}>
              <div className="venue-media">
                <Image
                  src={`/photos/${v.src}.jpg`}
                  alt={`Selfi Boks fotoboks i ${v.name.toLowerCase()}`}
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
