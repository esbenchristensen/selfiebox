"use client";

import { BoxViewer } from "../BoxViewer";
import { RENTAL_BOX } from "../three/rental";

// The /erhverv hero: the gen 2 box as it is, with no theme, so a place sees the normal version before its own
// design. No frame or background around it, and it holds still: only the shadow under it.
export function HeroPlainBox() {
  return (
    <div className="hero-plain">
      <BoxViewer design={{ venue: RENTAL_BOX }} variant="plain" preload={[RENTAL_BOX]} label="Selfi-boksen uden tema, som den hænger på væggen" />
    </div>
  );
}
