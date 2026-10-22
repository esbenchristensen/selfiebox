import type { Venue } from "./HaloBox";

// The box people rent for a party: the gen 2 unit as it is, with no topper or wings. Graphite casing so the
// Selfi logo in the front stands out, a white and green ring, and a plain Selfi screen and print frame
// (public/models/selfi). Plain data, so the page can use it without loading three.js.
export const RENTAL_BOX: Venue = {
  id: "selfi",
  name: "Selfi Boks",
  place: "Til leje",
  palette: { base: "#1d201d" },
  casing: "#1d201d",
  ring: { idle: ["#fff3e3", "#22d36b", "#ffffff"], glow: "#fff3e3" }, // warm white: no coloured glow on the page behind the box
  frame: { bg: "base", ink: "base", caption: "Skål for festen" },
  photo: "boks-bryllup",
  parts: [],
  unit: "gen2",
};

// The same box on its floor stand in the hero, taking a photo at a birthday: theme, countdown, flash, photo.
export const RENTAL_STAND: Venue = { ...RENTAL_BOX, shoot: { screen: "fodselsdag", photo: "boks-fodselsdag" } };

// The /erhverv hero: the same plain box, with the camera's live view on the screen: friends in a Danish nightclub
// getting ready for the photo (made with Gemini, public/photos/skaerm-natklub.jpg).
export const PLAIN_CLUB_BOX: Venue = { ...RENTAL_BOX, screen: "/photos/skaerm-natklub.jpg" };
