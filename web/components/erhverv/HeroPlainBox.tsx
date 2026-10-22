"use client";

import { BoxViewer } from "../BoxViewer";
import { PLAIN_CLUB_BOX } from "../three/rental";

// The /erhverv hero: the gen 2 box as it is, with no theme, so a place sees the normal version before its own
// design. No frame or background around it, and it holds still: only the shadow under it. The screen shows
// the camera's view of a group in a nightclub getting ready for the photo.
export function HeroPlainBox() {
  return (
    <div className="hero-plain">
      <BoxViewer design={{ venue: PLAIN_CLUB_BOX }} variant="plain" preload={[PLAIN_CLUB_BOX]} label="Selfi-boksen uden tema, med en vennegruppe i en natklub på skærmen, klar til billedet" />
    </div>
  );
}
