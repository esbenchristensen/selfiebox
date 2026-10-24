import type { Venue } from "./HaloBox";
import examples from "./examples.json";

// The designs in /erhverv's showroom and cases: concept designs for kinds of places, built without any logos, brand
// names or slogans (venue_themes.py --uden-logo, files in /models/eksempel/<id>/), all on the gen 2 box. The catalogues
// for one place (/erhverv/<slug>) use that place's own design with its logo from bars.json.
// Plain data, so the page can list them without loading three.js.
export const SHOWROOM: Venue[] = examples as Venue[];
