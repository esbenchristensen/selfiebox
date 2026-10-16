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
              {/* Placeholder until real photos from events exist */}
              <div className="ph p1" data-label="Foto: gæster ved boksen" role="img" aria-label="Pladsholder for foto af gæster ved boksen" />
            </div>
            <figcaption>
              <h3>Stemning, der samler</h3>
              <p>Lysringen trækker folk til, og missioner og titler får dem til at blive. Fremmede ender på samme billede.</p>
            </figcaption>
          </figure>
          <figure className="moment">
            <div className="moment-media moment-media--prints" aria-hidden="true">
              <div className="print-card" style={{ "--r": "-5deg", left: "12%", top: "16%" } as React.CSSProperties}>
                <div className="ph p2" />
                <span className="print-cap">Fredag · Kælderbaren</span>
              </div>
              <div className="print-card" style={{ "--r": "4deg", left: "40%", top: "8%" } as React.CSSProperties}>
                <div className="ph p3" />
                <span className="print-cap">Anna &amp; Jonas · 12.6</span>
              </div>
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
                  <div className="ph p4" />
                  <span className="print-cap">Fredag · Kælderbaren</span>
                </div>
                <p className="phone-text">Bedste fredag i lang tid</p>
              </div>
            </div>
            <figcaption>
              <h3>Delt, før de er hjemme</h3>
              <p>Gæsterne deler fotoet med det samme. Fordi jeres navn står i rammen, peger hvert opslag tilbage på jer.</p>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
