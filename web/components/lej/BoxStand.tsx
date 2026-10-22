"use client";

import { BoxViewer } from "../BoxViewer";
import { RENTAL_STAND } from "../three/rental";

// The hero: the rental box on the floor tripod it comes with, as it stands at the party. A drag turns it.
export function BoxStand() {
  return (
    <div className="lej-stand">
      <BoxViewer design={{ venue: RENTAL_STAND }} variant="stand" preload={[RENTAL_STAND]} label="Selfi Boks på gulvstativet, som den står til festen" />
      <span className="lej-box3d-hint" aria-hidden="true">
        Træk for at dreje
      </span>
    </div>
  );
}
