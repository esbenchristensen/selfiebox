"use client";

import { BoxViewer } from "../BoxViewer";
import { RENTAL_BOX } from "../three/rental";

// The rental box in 3D: it turns slowly by itself, and a drag turns it by hand.
export function Box3D() {
  return (
    <div className="lej-box3d">
      <BoxViewer design={{ venue: RENTAL_BOX }} variant="box" preload={[RENTAL_BOX]} label="Selfi Boks i 3D, som den kommer i kassen" />
      <span className="lej-box3d-hint" aria-hidden="true">
        Træk for at dreje
      </span>
    </div>
  );
}
