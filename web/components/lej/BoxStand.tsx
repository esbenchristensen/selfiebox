"use client";

import { BoxViewer } from "../BoxViewer";
import { RENTAL_STAND } from "../three/rental";

// The hero: the rental box on the floor tripod it comes with, and the printer beside it, as they stand at the
// party. They hold still at one angle; only the box's light, screen and print move.
export function BoxStand() {
  return (
    <div className="lej-stand">
      <BoxViewer design={{ venue: RENTAL_STAND }} variant="stand" preload={[RENTAL_STAND]} label="Selfi Boks på gulvstativet, som den står til festen" />
    </div>
  );
}
