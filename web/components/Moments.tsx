import Image from "next/image";

// What the box does for a night: the queue, the photo in hand, the share the next morning.

export function Moments() {
  return (
    <section className="section" aria-labelledby="moments-title">
      <div className="wrap">
        <div className="sec-head">
          <span className="label">Det, gæsterne husker</span>
          <h2 id="moments-title" className="h-l">
            Grin i køen. Fotoet i hånden. Opslaget næste morgen.
          </h2>
          <p className="lede">Boksen samler folk, giver dem et minde med hjem og sørger for, at aftenen lever videre der, hvor deres venner kigger med.</p>
        </div>
        <div className="moments">
          <figure className="moment">
            <div className="moment-media">
              <Image
                src="/photos/klub.jpg"
                alt="Selfi Boks på en betonsøjle i en natklub, venner på skærmen og dansegulvet bagved"
                fill
                sizes="(max-width: 900px) 90vw, 30vw"
                style={{ objectFit: "cover", objectPosition: "45% 45%" }}
              />
            </div>
            <figcaption>
              <h3>Stemning, der samler</h3>
              <p>Lysringen trækker folk til, og missioner og titler får dem til at blive. Fremmede ender på samme billede.</p>
            </figcaption>
          </figure>
          <figure className="moment">
            <div className="moment-media">
              <Image
                src="/photos/instax-haand.jpg"
                alt="Hænder holder et frisk Instax-foto af tre venner på en bar"
                fill
                sizes="(max-width: 900px) 90vw, 30vw"
                style={{ objectFit: "cover" }}
              />
            </div>
            <figcaption>
              <h3>Et ægte foto i hånden</h3>
              <p>Instax-fotoet fremkalder, mens de står og venter, og ender på køleskabet. Med jeres navn i rammen.</p>
            </figcaption>
          </figure>
          <figure className="moment">
            <div className="moment-media moment-media--phone" aria-hidden="true">
              <div className="phone">
                <div className="phone-head">
                  <i />
                  <span>
                    <b>maja.k</b>
                    <small>for 2 timer siden</small>
                  </span>
                </div>
                <div className="phone-print">
                  <div className="phone-photo">
                    <Image src="/photos/print-club.jpg" alt="" fill sizes="200px" style={{ objectFit: "cover" }} />
                  </div>
                  <span className="print-cap">Fredag · Kælderbaren</span>
                </div>
                <p className="phone-text">Bedste fredag i lang tid</p>
              </div>
            </div>
            <figcaption>
              <h3>Delt, før de er hjemme</h3>
              <p>Hvert event får sin egen side med alle fotos, så gæsterne kan dele med det samme. Jeres navn står i rammen, så hvert opslag peger tilbage på jer.</p>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
