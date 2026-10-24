// Private party themes for the 3D box: the box stays black with a white ring, and the screen and the
// frame on the photo change. Venue designs are built from the hardware repo, see examples.json and bars.json.

export type FontKey = "display" | "archivo" | "poppins" | "outfit" | "lilita";

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
  label: string; // small text at the top of the screen
  welcome: string;
  ticker?: string;
  caption: string;
  photo: string;
};

// Private parties: the box stays black with a white ring. Only the screen and the photo frame change.
const privateBase = { side: "#0c0d0c", sideInk: "#0c0d0c", ring: "#fff3e3", topper: "#0c0d0c", topperInk: "#fff3e3", topperAccent: "#22d36b" };

export const privateThemes: BoxTheme[] = [
  {
    id: "bryllup",
    name: "Bryllup",
    kind: "Blomster og guld",
    font: "display",
    colors: { ...privateBase, screen: "#f4ece1", screenInk: "#3b2f2a", accent: "#b89466", accentInk: "#ffffff", frame: "#fbfaf6", frameInk: "#5a4a40" },
    pattern: "garland",
    label: "Bryllup",
    welcome: "Skål for brudeparret",
    caption: "Skål for brudeparret",
    photo: "/photos/print-wedding.jpg",
  },
  {
    id: "fodselsdag",
    name: "Fødselsdag",
    kind: "Balloner og konfetti",
    font: "display",
    colors: { ...privateBase, screen: "#16244d", screenInk: "#fff6e0", accent: "#f2c14e", accentInk: "#16244d", frame: "#16244d", frameInk: "#f2c14e" },
    pattern: "gold",
    label: "Tillykke",
    welcome: "Tillykke med fødselsdagen",
    caption: "Tillykke med fødselsdagen",
    photo: "/photos/print-birthday.jpg",
  },
  {
    id: "firmafest",
    name: "Firmafest",
    kind: "Grantræer og sne",
    font: "display",
    colors: { ...privateBase, screen: "#0f3d2e", screenInk: "#fff6ec", accent: "#e0443a", accentInk: "#ffffff", frame: "#e0443a", frameInk: "#ffffff" },
    pattern: "confetti",
    label: "Julefrokost",
    welcome: "Glædelig jul",
    caption: "Glædelig jul",
    photo: "/photos/print-office.jpg",
  },
];
