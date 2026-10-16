// Designs for the 3D box. Each one changes the same four things a real theme changes:
// the printed top and sides, the ring colour, the screen and the frame on the photo.
// The venue designs are concept work to show what a theme can do, not customer designs.

export type FontKey = "display" | "archivo" | "poppins" | "outfit" | "lilita";

export type Topper = "hills" | "arch" | "ticket" | "sun" | "brick" | "leaves";

export type Pattern = "none" | "beech" | "orange" | "neon" | "planks" | "studs" | "giraffe" | "confetti" | "gold" | "garland";

export type BoxTheme = {
  id: string;
  name: string;
  // Small line under the name in the picker, e.g. "Festival · Skanderborg".
  kind: string;
  font: FontKey;
  upper?: boolean;
  colors: {
    side: string; // base colour of the printed wrap round the sides
    sideInk: string; // the motif printed on it
    ring: string;
    screen: string;
    screenInk: string;
    accent: string;
    accentInk: string;
    topper: string;
    topperInk: string;
    topperAccent: string;
    frame: string;
    frameInk: string;
  };
  pattern: Pattern;
  topper?: Topper;
  // Text on the top piece. Defaults to the name.
  mark?: string;
  tagline?: string;
  label: string; // small text at the top of the screen
  welcome: string;
  ticker?: string;
  caption: string;
  photo: string;
  module?: boolean; // the Instax photo module under the box
};

const SELFI = { ring: "#fff3e3", screen: "#050605", screenInk: "#fff3e3", accent: "#22d36b", accentInk: "#0b1a10" };

export const venueThemes: BoxTheme[] = [
  {
    id: "smukfest",
    name: "Smukfest",
    kind: "Festival · Skanderborg",
    font: "outfit",
    colors: {
      side: "#0b0b0b",
      sideInk: "#157853",
      ring: "#c9a6d8",
      screen: "#000000",
      screenInk: "#f8f5ef",
      accent: "#ad88bd",
      accentInk: "#000000",
      topper: "#157853",
      topperInk: "#f8f5ef",
      topperAccent: "#ad88bd",
      frame: "#ad88bd",
      frameInk: "#000000",
    },
    pattern: "beech",
    topper: "hills",
    tagline: "Danmarks smukkeste festival",
    label: "Bøgeskoven",
    welcome: "Sig «Smukt!»",
    ticker: "Smukfest ✦ Danmarks smukkeste festival ✦ Skanderborg ✦ ",
    caption: "Smukfest · Bøgeskoven",
    photo: "/photos/print-club.jpg",
    module: true,
  },
  {
    id: "roskilde",
    name: "Roskilde Festival",
    kind: "Festival · Roskilde",
    font: "archivo",
    upper: true,
    colors: {
      side: "#ff7300",
      sideInk: "#0d0d0d",
      ring: "#ff8a1f",
      screen: "#0d0d0d",
      screenInk: "#ffffff",
      accent: "#ff7300",
      accentInk: "#0d0d0d",
      topper: "#ff7300",
      topperInk: "#0d0d0d",
      topperAccent: "#ffffff",
      frame: "#0d0d0d",
      frameInk: "#ffffff",
    },
    pattern: "orange",
    topper: "arch",
    mark: "Roskilde",
    tagline: "Orange Feeling",
    label: "Orange Scene",
    welcome: "Orange feeling!",
    ticker: "Roskilde Festival → Fællesskab og non-profit → ",
    caption: "Roskilde Festival · Orange Scene",
    photo: "/photos/print-club.jpg",
    module: true,
  },
  {
    id: "nibe",
    name: "Nibe Festival",
    kind: "Festival · Skalskoven",
    font: "poppins",
    upper: true,
    colors: {
      side: "#995dff",
      sideInk: "#e5ff50",
      ring: "#e5ff50",
      screen: "#000000",
      screenInk: "#ffffff",
      accent: "#e5ff50",
      accentInk: "#000000",
      topper: "#e5ff50",
      topperInk: "#000000",
      topperAccent: "#995dff",
      frame: "#ffffff",
      frameInk: "#000000",
    },
    pattern: "neon",
    topper: "ticket",
    mark: "Nibe Festival",
    tagline: "Skalskoven",
    label: "Skalskoven",
    welcome: "Hænderne op!",
    ticker: "Nibe Festival → Skalskoven → ",
    caption: "Nibe Festival · Skalskoven",
    photo: "/photos/print-bar.jpg",
    module: true,
  },
  {
    id: "faarup",
    name: "Fårup Sommerland",
    kind: "Forlystelsespark · Blokhus",
    font: "lilita",
    colors: {
      side: "#9c2a24",
      sideInk: "#f6efe4",
      ring: "#ffc93c",
      screen: "#9c2a24",
      screenInk: "#fff8ec",
      accent: "#ffc93c",
      accentInk: "#3a1410",
      topper: "#ffc93c",
      topperInk: "#9c2a24",
      topperAccent: "#ffffff",
      frame: "#9c2a24",
      frameInk: "#fff8ec",
    },
    pattern: "planks",
    topper: "sun",
    mark: "Fårup",
    tagline: "Sommerland",
    label: "Fårup Sommerland",
    welcome: "Hold fast og smil!",
    caption: "Fårup Sommerland · Sommer",
    photo: "/photos/print-birthday.jpg",
    module: true,
  },
  {
    id: "legoland",
    name: "LEGOLAND",
    kind: "Forlystelsespark · Billund",
    font: "lilita",
    upper: true,
    colors: {
      side: "#da291c",
      sideInk: "#b41f15",
      ring: "#ffd100",
      screen: "#da291c",
      screenInk: "#ffffff",
      accent: "#ffd100",
      accentInk: "#000000",
      topper: "#ffd100",
      topperInk: "#da291c",
      topperAccent: "#000000",
      frame: "#ffd100",
      frameInk: "#000000",
    },
    pattern: "studs",
    topper: "brick",
    mark: "LEGOLAND",
    tagline: "Billund",
    label: "LEGOLAND Billund",
    welcome: "Byg dit bedste smil",
    caption: "LEGOLAND · Billund",
    photo: "/photos/print-birthday.jpg",
    module: true,
  },
  {
    id: "zoo",
    name: "Aalborg Zoo",
    kind: "Zoo · Aalborg",
    font: "lilita",
    colors: {
      side: "#ebc57e",
      sideInk: "#8a4b1f",
      ring: "#ffd08a",
      screen: "#1d4a2e",
      screenInk: "#fff6e5",
      accent: "#f08a24",
      accentInk: "#1d1205",
      topper: "#1d4a2e",
      topperInk: "#fff6e5",
      topperAccent: "#8fc24a",
      frame: "#1d4a2e",
      frameInk: "#fff6e5",
    },
    pattern: "giraffe",
    topper: "leaves",
    mark: "Aalborg Zoo",
    tagline: "Savannen",
    label: "Savannen",
    welcome: "Sig «Zebra!»",
    caption: "Aalborg Zoo · Savannen",
    photo: "/photos/print-bar.jpg",
    module: true,
  },
  {
    id: "selfi",
    name: "Selfi Sort",
    kind: "Standard · Bar og klub",
    font: "display",
    colors: {
      side: "#0c0d0c",
      sideInk: "#0c0d0c",
      ...SELFI,
      topper: "#0c0d0c",
      topperInk: "#fff3e3",
      topperAccent: "#22d36b",
      frame: "#fbfaf6",
      frameInk: "#3a3a3a",
    },
    pattern: "none",
    label: "Kælderbaren",
    welcome: "Tryk for at tage et billede",
    caption: "Fredag · Kælderbaren",
    photo: "/photos/print-bar.jpg",
    module: true,
  },
];

// Private parties: the box stays black with a white ring. Only the screen and the photo frame change.
const privateBase = { side: "#0c0d0c", sideInk: "#0c0d0c", ring: "#fff3e3", topper: "#0c0d0c", topperInk: "#fff3e3", topperAccent: "#22d36b" };

export const privateThemes: BoxTheme[] = [
  {
    id: "bryllup",
    name: "Bryllup",
    kind: "Navne og dato",
    font: "display",
    colors: { ...privateBase, screen: "#f4ece1", screenInk: "#3b2f2a", accent: "#b89466", accentInk: "#ffffff", frame: "#fbfaf6", frameInk: "#5a4a40" },
    pattern: "garland",
    label: "12. juni",
    welcome: "Anna & Jonas",
    caption: "Anna & Jonas · 12.6",
    photo: "/photos/print-wedding.jpg",
  },
  {
    id: "fodselsdag",
    name: "Fødselsdag",
    kind: "Navn og alder",
    font: "display",
    colors: { ...privateBase, screen: "#16244d", screenInk: "#fff6e0", accent: "#f2c14e", accentInk: "#16244d", frame: "#16244d", frameInk: "#f2c14e" },
    pattern: "gold",
    label: "Tillykke",
    welcome: "Birthe 60 år",
    caption: "Birthe 60 år",
    photo: "/photos/print-birthday.jpg",
  },
  {
    id: "firmafest",
    name: "Firmafest",
    kind: "Logo og tekst",
    font: "display",
    colors: { ...privateBase, screen: "#0f3d2e", screenInk: "#fff6ec", accent: "#e0443a", accentInk: "#ffffff", frame: "#e0443a", frameInk: "#ffffff" },
    pattern: "confetti",
    label: "Nordlys A/S",
    welcome: "Julefrokost 2026",
    caption: "Julefrokost 2026",
    photo: "/photos/print-office.jpg",
  },
];
