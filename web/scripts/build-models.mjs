// Builds the 3D assets for the site from the hardware repo (branch claude/halo-enclosure).
//
//   node scripts/build-models.mjs <path to the halo checkout> [--occasions]
//
//   --occasions builds only the private party designs (bryllup, fodselsdag, julefrokost) into
//   components/three/occasions.json and leaves the enclosure and the venues alone.
//   --bars builds only the bar, club and cinema designs (flying_hirsch, aab, palads, meny) into components/three/bars.json, for the bars' catalogues.
//
// unit.glb       the real Halo enclosure (bezel, diffuser ring, shell, photo module, joint spacer)
//                taken from hardware/docs/pack/pack.json, the CAD export behind the build pack.
// <theme>/       wings and topper for each venue theme, built by hardware/tools/venue_themes.py,
//                plus its idle screen, Instax frame, logo and palette.
// Everything is meshopt-compressed; the site decodes it with three's bundled MeshoptDecoder.

import { NodeIO } from "@gltf-transform/core";
import { EXTMeshoptCompression, KHRMeshQuantization } from "@gltf-transform/extensions";
import { dedup, meshopt, prune, simplify, unpartition, weld } from "@gltf-transform/functions";
import { MeshoptEncoder, MeshoptSimplifier } from "meshoptimizer";
import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const halo = resolve(process.argv[2] ?? "../../halo");
const occasionsOnly = process.argv.includes("--occasions");
const barsOnly = process.argv.includes("--bars");
const out = resolve("public/models");
const UNIT = ["bezel", "diffuser_ring", "shell_closed", "shell_closed_band", "v_display", "v_camera", "instax_front", "instax_shell", "instax_shell_band", "joint_spacer"];

await MeshoptEncoder.ready;
await MeshoptSimplifier.ready;
const io = new NodeIO().registerExtensions([EXTMeshoptCompression, KHRMeshQuantization]).registerDependencies({ "meshopt.encoder": MeshoptEncoder });

async function squeeze(doc, ratio) {
  await doc.transform(unpartition(), dedup(), weld(), simplify({ simplifier: MeshoptSimplifier, ratio, error: 0.0004 }), prune(), meshopt({ encoder: MeshoptEncoder, level: "high" }));
}

const kb = (f) => `${Math.round(statSync(f).size / 1024)} kB`;
mkdirSync(out, { recursive: true });

// The enclosure
if (!occasionsOnly && !barsOnly) {
  const unit = await io.read(join(halo, "hardware/docs/pack/pack.json"));
  for (const node of unit.getRoot().listNodes()) {
    if (!UNIT.includes(node.getName())) node.dispose();
  }
  for (const scene of unit.getRoot().listScenes()) {
    for (const n of unit.getRoot().listNodes()) if (!n.getParentNode() && !scene.listChildren().includes(n)) scene.addChild(n);
  }
  await squeeze(unit, 0.5);
  await io.write(join(out, "unit.glb"), unit);
  console.log("unit.glb", kb(join(out, "unit.glb")));
}

// Venue themes (business) and occasion themes (private parties) are built the same way
async function buildThemes(order, jsonFile) {
  const themes = join(halo, "themes");
  const index = [];
  for (const id of order) {
    const web = join(themes, id, "build/web");
    if (!existsSync(join(web, "parts.glb"))) continue;
    const dir = join(out, id);
    mkdirSync(dir, { recursive: true });
    const doc = await io.read(join(web, "parts.glb"));
    await squeeze(doc, 0.6);
    await io.write(join(dir, "parts.glb"), doc);
    for (const f of ["screen.png", "print.png", "logo.svg"]) copyFileSync(join(web, f), join(dir, f));
    index.push(JSON.parse(readFileSync(join(web, "theme.json"), "utf8")));
    console.log(`${id}/parts.glb`, kb(join(dir, "parts.glb")));
  }
  writeFileSync(jsonFile, JSON.stringify(index, null, 2) + "\n");
  console.log(`${jsonFile}: ${index.length} themes`);
}

if (!occasionsOnly && !barsOnly) await buildThemes(["smukfest", "roskilde", "nibe", "faarup", "legoland", "zoo"], "components/three/venues.json");
if (!barsOnly) await buildThemes(["bryllup", "fodselsdag", "julefrokost"], "components/three/occasions.json");
if (!occasionsOnly) await buildThemes(["flying_hirsch", "aab", "palads", "meny"], "components/three/bars.json");
