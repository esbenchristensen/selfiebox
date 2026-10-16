import Image from "next/image";

// What the box does for a night: the queue, the photo in hand, the share the next morning.

export function Moments() {
  return (
    <section className="section" aria-labelledby="moments-title">
      <div className="wrap">
        <div className="sec-head">
          <span className="label">Hvorfor en fotoboks</span>
          <h2 id="moments-title" className="h-l">
            Det bedste billede fra aftenen er det, hvor alle er med.
          </h2>
          <p className="lede">Mobilerne tager hundrede billeder af aftenen. Selfi Boks tager dem, folk faktisk gemmer: alle samlet foran kameraet, i godt lys, med et foto med hjem.</p>
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
              <h3>Den samler folk</h3>
              <p>Lysringen kan ses fra den anden ende af lokalet. Folk stiller sig i kø, griner af hinanden og ender på billede med nogen, de lige har mødt.</p>
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
              <h3>Et foto i hånden</h3>
              <p>Med fotomodulet printer boksen et Instax-foto, der fremkalder, mens man står og venter. Det er det billede, der hænger på køleskabet en måned senere.</p>
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
              <h3>På telefonen med det samme</h3>
              <p>Gæsterne scanner en QR-kode eller får billedet på SMS. Alle aftenens fotos samles på én side, og navnet i rammen følger med, når de deler.</p>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
