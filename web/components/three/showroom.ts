import type { Venue } from "./HaloBox";
import bars from "./bars.json";
import venues from "./venues.json";

// The designs on the front page (showroom and hero box): the venue designs, then the brands that pay for a box
// per bar. Plain data, so the page can list them without loading three.js.
const FRONT_BRANDS = ["carlsberg", "red_bull", "tuborg", "airtox_dominance"];

export const SHOWROOM: Venue[] = [...(venues as Venue[]), ...FRONT_BRANDS.map((id) => (bars as Venue[]).find((b) => b.id === id)).filter((v): v is Venue => !!v)];
