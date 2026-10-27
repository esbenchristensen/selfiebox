#!/usr/bin/env python3
"""Print files, 3D model, renders and drawings of the Selfi printer (DNP QW410 in a printed enclosure).

Usage:  python3 hardware/tools/make_printer.py [version] [out dir]
        version: selfi-printer-v1 .. -v5 (default: the newest); out dir: default hardware/stl/printer/<version>
        python3 hardware/tools/make_printer.py <version> --hurtig     the hurtigprint set (v2 and later), see below
CAD:    hardware/cad/selfi_printer_v<N>.scad
Needs:  openscad, node + Playwright + three (web/node_modules) for the renders, trimesh, manifold3d, numpy, networkx,
        cairosvg, Pillow. Playwright from elsewhere: PLAYWRIGHT_MJS=/path/to/playwright/index.mjs
Output (every file starts with the version):
  <v>_<part>.stl                 print-ready, in print orientation, on z = 0
  <v>_<part>_flerfarvet.3mf      a part + its white and green inlays as one multi-part object (AMS)
  <v>_3d.glb + <v>_parts.json    the admin 3D viewer (one node per part, explode offsets in glTF axes)
  <v>_*.png                      renders of the 3D model (render_glb.mjs) and the drawing sheets (printer_sheet.py)
  <v>_printfiler.zip             print files, guide, shopping list, wiring diagram and pictures
Write PRINTGUIDE_<v>.md, <v>_indkoebsliste.xlsx (make_printer_bom.py) and, from v2, <v>_ledningsdiagram.png
(printer_wiring.py) before running, so the zip holds them.

Hurtigprint (rules: hardware/docs/HURTIGPRINT.md): the released STLs 1:1 plus test pieces ("proeve"), boxes cut out of
the parts round the places where something has to fit, in the parts' own print orientation. Output in
hardware/stl/printer-hurtig/<v>-hurtig/; write PRINTGUIDE_<v>-hurtig.md there.
"""
import json
import shutil
import subprocess
import sys
import tempfile
import zipfile
from pathlib import Path

import numpy as np
import trimesh

sys.path.insert(0, str(Path(__file__).resolve().parent))
from make_3mf import SETTINGS, write_bambu_3mf  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]

# Per version: CAD file, overall size (x along the front, depth, height; used to centre the 3D model), print files,
# inlays printed with a part, 3D parts, renders and drawing views.
#   PRINTED: (CAD view, file name, label)
#   PARTS:   (node, CAD view in the assembly frame, label, colour, group, explode [x, y, z] in glTF axes (y up, z to the viewer))
LOGO = ["logo_hvid", "logo_groen"]
VERSIONS = {
    "selfi-printer-v1": {
        "scad": "selfi_printer_v1.scad", "size": (222.5, 294.4, 220.0), "centre_x": False,
        "printed": [
            ("kappe", "kappe", "Kappe (B2C, uden lås)"),
            ("kappe_laas", "kappe-laas", "Kappe med hul til skabslås (B2B)"),
            ("sokkel", "sokkel", "Sokkel (samme til bord, hylde og væg)"),
            ("bakke", "bakke", "Opsamlingsbakke"),
            ("konsol", "konsol", "Vægkonsol (B2B væg)"),
            ("vaegplade", "vaegplade", "Vægplade (B2B væg)"),
            ("logo_hvid", "logo-hvid", "Logo, hvide dele (indlagt i kappen)"),
            ("logo_groen", "logo-groen", "Logo, grønne prikker (indlagt i kappen)"),
        ],
        "co_printed": {"logo_hvid": "kappe", "logo_groen": "kappe"},
        "multicolour": {"kappe": LOGO, "kappe_laas": LOGO},
        "parts": [
            ("kappe", "kappe_laas", "Kappe (sort ASA; B2B-udgaven med hul til skabslås, B2C-kappen er uden hul)", "#1d1d20", "Kabinet", [0, 260, 0]),
            ("logo_hvid", "logo_hvid", "Logo, hvidt (indlagt i kappen)", "#f5f5f4", "Kabinet", [0, 260, 0]),
            ("logo_groen", "logo_groen", "Logo, grønne prikker", "#22d36b", "Kabinet", [0, 260, 0]),
            ("sokkel", "sokkel", "Sokkel med 4 klikkanter, printerramme og bagrum (mørk ASA)", "#2b2b2f", "Kabinet", [0, 0, 0]),
            ("bakke", "bakke", "Opsamlingsbakke (klik-på)", "#1d1d20", "Kabinet", [0, 0, 110]),
            ("printer", "c_printer", "DNP QW410 (fotoprinter, rulle 150 × 4×6 / 300 striber)", "#d9d9d6", "Elektronik", [0, 130, 0]),
            ("pi", "c_pi", "Raspberry Pi Zero 2 W (printserver på wifi, strøm fra printerens 5 V-udgang)", "#2e9e5b", "Elektronik", [0, 60, -60]),
            ("inlet", "c_inlet", "Strømindgang C14 (panelkabel, snap-in, videre til printerens eget C14-stik)", "#e11d48", "Elektronik", [0, 0, -40]),
            ("laas", "c_lock", "Skabslås Ø19 med kam (B2B)", "#c3c7cf", "B2B", [60, 260, 0]),
            ("konsol", "konsol", "Vægkonsol med 2 massive knægte (B2B væg)", "#3a3a3f", "B2B", [0, -110, 0]),
            ("vaegplade", "vaegplade", "Vægplade med 45° skinne (B2B væg)", "#4a4a50", "B2B", [0, -110, -110]),
            ("skruer_sokkel", "s_base", "2 skruer, sokkel til hylde/konsol (SPUN+ 4,0 × 30, undersænket)", "#c3c7cf", "Skruer", [0, -60, 0]),
            ("skruer_vaeg", "s_wall", "4 skruer + dybler, vægplade (5 × 50)", "#c3c7cf", "Skruer", [0, -110, -170]),
        ],
        "renders": [
            {"out": "forfra", "az": -30, "el": 14, "hide": ["B2B", "Skruer"]},
            {"out": "bagfra", "az": 150, "el": 16, "hide": ["B2B", "Skruer"]},
            {"out": "b2b-laas", "az": 60, "el": 14, "hide": ["konsol", "vaegplade", "skruer_vaeg"]},
            {"out": "eksplosion", "az": -34, "el": 16, "explode": 1, "hide": ["B2B", "Skruer"]},
            {"out": "vaeg", "az": -48, "el": 12},
            {"out": "vaeg_eksplosion", "az": -40, "el": 12, "explode": 1},
        ],
        "drawings": [("d_front", {}), ("d_side", {}), ("d_top", {}), ("d_cut", {}), ("d_cut_lock", {}),
                     ("d_side", {"MOUNT": '"vaeg"'}, "d_side_vaeg"), ("d_cut", {"MOUNT": '"vaeg"'}, "d_cut_vaeg")],
    },
    "selfi-printer-v2": {
        "scad": "selfi_printer_v2.scad", "size": (476.0, 222.5, 277.6), "centre_x": True,
        "printed": [
            ("kappe", "kappe", "Kappe med låsehul og logo (samme til B2C og B2B)"),
            ("sokkel", "sokkel", "Sokkel under printeren"),
            ("udgang", "udgang", "Udgangsmodul: papirrum, rutsjebane, lomme, skærm og LED-skinne"),
            ("logo_hvid", "logo-hvid", "Logo, hvide dele (indlagt i kappen)"),
            ("logo_groen", "logo-groen", "Logo, grønne prikker (indlagt i kappen)"),
        ],
        "co_printed": {"logo_hvid": "kappe", "logo_groen": "kappe"},
        "multicolour": {"kappe": LOGO},
        "parts": [
            ("kappe", "kappe", "Kappe (sort ASA): sadeltag 30°, luftlameller og nøglelås i venstre ende", "#1d1d20", "Kabinet", [-10, 300, 0]),
            ("logo_hvid", "logo_hvid", "Logo, hvidt (indlagt i kappen)", "#f5f5f4", "Kabinet", [-10, 300, 0]),
            ("logo_groen", "logo_groen", "Logo, grønne prikker", "#22d36b", "Kabinet", [-10, 300, 0]),
            ("laas", "c_lock", "Kamlås Ø19 med nøgle (låser kappen til soklen)", "#c3c7cf", "Kabinet", [-60, 300, 0]),
            ("sokkel", "sokkel", "Sokkel: printerramme, låseholder, Pi-holder og strømindgang (sort ASA)", "#1d1d20", "Kabinet", [0, 0, 0]),
            ("udgang", "udgang", "Udgangsmodul: papirrum, rutsjebane 30°, udtagslomme og skærm (sort ASA)", "#1d1d20", "Kabinet", [150, 0, 0]),
            ("led", "c_led", "RGB-LED-strip WS2812B, 9 LED (5 V fra Pi'en, lyser ned ad rutsjebanen)", "#22d36b", "Elektronik", [150, 0, 0]),
            ("print", "c_print", "Et 4×6-print i lommen", "#ffffff", "Elektronik", [150, 0, 140]),
            ("printer", "c_printer", "DNP QW410 drejet 90° (papirudgangen mod højre ende)", "#d9d9d6", "Elektronik", [0, 150, 0]),
            ("pi", "c_pi", "Raspberry Pi Zero 2 W (printserver på wifi, styrer LED'en)", "#2e9e5b", "Elektronik", [-60, 60, 0]),
            ("inlet", "c_inlet", "Strømindgang C14 (panelkabel, snap-in)", "#e11d48", "Elektronik", [-40, 0, 0]),
            ("skruer_sokkel", "s_base", "2 skruer, sokkel til bord/hylde (B2B, SPUN+ 4,0 × 30)", "#c3c7cf", "Skruer", [0, -60, 0]),
            ("skruer_link", "s_link", "2 skruer, sokkel til udgangsmodul (3,5 × 10 til plast)", "#c3c7cf", "Skruer", [80, -40, 0]),
        ],
        "renders": [
            {"out": "forfra", "az": -22, "el": 14, "hide": ["Skruer"]},
            {"out": "bagfra", "az": 155, "el": 16, "hide": ["Skruer"]},
            {"out": "venstre", "az": -75, "el": 12, "hide": ["Skruer"]},
            {"out": "lomme", "az": 18, "el": 22, "hide": ["Skruer"], "dist": 0.75},
            {"out": "eksplosion", "az": -28, "el": 18, "explode": 1},
        ],
        "drawings": [("d_front", {}), ("d_end", {}), ("d_top", {}), ("d_cut_end", {}), ("d_cut_long", {}), ("d_cut_lock", {})],
        # hurtigprint test pieces: name, part, box in the assembly frame (x0, y0, z0, x1, y1, z1), what it tests
        "coupons": [
            ("laas", "kappe", (0, 30, 40, 22, 95, 100),
             "Kamlåsen i bossen i venstre ende: Ø19 med 2 flader, låsen skal kunne skrues fast og dreje."),
            ("laas", "sokkel", (14, 28, 0, 42, 58, 84),
             "Låseholderen: kammen (lås drejet til låst) skal gå ind under taget i slidsen med lidt luft."),
            ("stroemindgang", "sokkel", (0, 140, 0, 18, 195, 50),
             "C14-panelkablet klikkes i pladen og sidder fast."),
            ("pi", "sokkel", (26, 84, 0, 46, 176, 40),
             "Pi Zero 2 W skubbes ned i de 2 riller på højkant og står fast."),
            ("fuge", "kappe", (262, -1, 0, 290, 224, 300),
             "Kappens højre kant over udgangsmodulets studs (lægges sammen med fuge_udgang): 0,3 mm luft hele vejen."),
            ("fuge", "udgang", (279, -1, 11, 305, 224, 300),
             "Studsen på udgangsmodulet (8 mm). Skal glide ind i kappens kant, og fugen skal være lige."),
            ("lomme", "udgang", (372, -1, 0, 476, 125, 165),
             "Højre del af udtagslommen med endevæggen: åbning, stoplæbe med dræn, skærmen og rutsjebanens fod. Et 4×6-print skal glide ned ad banen og blive i lommen."),
            ("led", "udgang", (436, 190, 118, 476, 224, 160),
             "LED-skinnen: stripen (10-12 mm) skubbes ind fra venstre og sidder fast uden klister."),
        ],
    },
}
# v3: v2 with a flat top and "Dit print" + arrow inlaid over the pocket (white and green, printed with the exit module)
D_V3 = 222.5
VERSIONS["selfi-printer-v3"] = v3 = json.loads(json.dumps(VERSIONS["selfi-printer-v2"]))
v3.update({"scad": "selfi_printer_v3.scad", "size": (476.0, 222.5, 217.2)})
v3["printed"] += [["tekst_hvid", "tekst-hvid", "\"Dit print\", hvid (indlagt i udgangsmodulet)"],
                  ["tekst_groen", "tekst-groen", "Pil ned mod lommen, grøn (indlagt i udgangsmodulet)"]]
v3["co_printed"].update({"tekst_hvid": "udgang", "tekst_groen": "udgang"})
v3["multicolour"] = {"kappe": LOGO, "udgang": ["tekst_hvid", "tekst_groen"]}
i = [p[0] for p in v3["parts"]].index("udgang")
v3["parts"][i][2] = "Udgangsmodul: papirrum, rutsjebane 30°, udtagslomme, skærm og \"Dit print\" (sort ASA)"
v3["parts"][i + 1:i + 1] = [["tekst_hvid", "tekst_hvid", "\"Dit print\", hvidt (indlagt i udgangsmodulet)", "#f5f5f4", "Kabinet", [150, 0, 0]],
                            ["tekst_groen", "tekst_groen", "Pil ned mod lommen, grøn", "#22d36b", "Kabinet", [150, 0, 0]]]
v3["parts"][0][2] = "Kappe (sort ASA): flad top, luftlameller og nøglelås i venstre ende"
v3["printed"] += [["konsol", "konsol", "Vægkonsol (B2B væg), print 2"], ["vaegplade", "vaegplade", "Vægskinne (B2B væg), print 2"]]
P = {p[0]: p for p in v3["parts"]}
P["sokkel"][2] = "Sokkel: printerramme, låseholder, Pi-holder, kabelspor bagtil og rille til tætningsbånd (sort ASA)"
v3["parts"] = [p for p in v3["parts"] if p[0] != "inlet"]
v3["parts"].insert([p[0] for p in v3["parts"]].index("pi") + 1,
    ["kabel", "c_kabel", "Strømkabel Schuko → C13 vinklet: ind bagfra under soklen, stikket kun indeni (trækaflastet med strip)", "#2b2b2f", "Elektronik", [-40, 0, 0]])
v3["parts"] += [
    ["konsoller", "konsoller", "2 vægkonsoller (B2B væg): soklen og udgangsmodulet skrues fast indefra/nedefra", "#3a3a3f", "B2B væg", [0, -110, 0]],
    ["vaegplader", "vaegplader", "2 vægskinner med 45° kant (4 skruer + dybler hver)", "#4a4a50", "B2B væg", [0, -110, -110]],
    ["skruer_konsol", "s_con", "2 skruer op i udgangsmodulet (SPUN+ 4,0 × 20)", "#c3c7cf", "Skruer", [0, -60, 0]],
    ["skruer_vaeg", "s_wall", "8 skruer + dybler (5 × 50) og 2 sikkerhedsskruer (Torx med pind)", "#c3c7cf", "Skruer", [0, -110, -170]]]
v3["renders"] = [dict(r, hide=["Skruer", "B2B væg"]) if r["out"] != "eksplosion" else dict(r, hide=["B2B væg"]) for r in v3["renders"]]
v3["renders"].append({"out": "vaeg", "az": -30, "el": 10, "hide": ["Skruer"]})
v3["coupons"] = [c for c in v3["coupons"] if c[0] != "stroemindgang"] + [
    ["kabel", "sokkel", [0, D_V3 - 56, 0, 32, D_V3, 32], "Kabelsporet bagtil og ankeret: strømkablet (op til 7,5 mm) trykkes ind nedefra, og en strip om kablet og ankeret holder det."],
    ["taetning", "sokkel", [0, 0, 0, 45, 45, 24], "Hjørnet med rillen til tætningsbånd 3 × 1 under kappens væg og kanten indenfor."],
    ["krog", "konsol", [20, 180, -70, 80, 236, 0], "Konsollens 45°-krog og bagplade: skal hægte sig på vægskinnen og ligge tæt mod væggen."],
    ["krog", "vaegplade", [20, 230, -80, 80, 246, -40], "Vægskinnens 45°-kant (lægges sammen med proeve-krog_konsol)."]]
# v4: v3 with the foam cord (RS 234-2906) in 2.0 grooves instead of tape, and six hooks that pull the hood down
VERSIONS["selfi-printer-v4"] = v4 = json.loads(json.dumps(v3))
v4["scad"] = "selfi_printer_v4.scad"
P = {p[0]: p for p in v4["parts"]}
P["kappe"][2] = "Kappe (sort ASA): flad top, luftlameller, nøglelås og gribehak i venstre ende og 6 kroge, der trækker den ned på tætningen"
P["sokkel"][2] = "Sokkel: printerramme, låseholder, Pi-holder, kabelspor bagtil, rille til skumsnor og ramper til kappens kroge (sort ASA)"
v4["coupons"] = [c for c in v4["coupons"] if c[0] != "taetning"] + [
    ["taetning", "sokkel", [0, 0, 0, 45, 45, 24], "Hjørnet med rillen (2,0 × 1,0) til skumsnoren Ø1,5 under kappens væg: snoren skal ligge i rillen og stikke 0,5 op."],
    ["kappekrog", "sokkel", [112, 0, 0, 168, 24, 24], "Krog-rampen i læben (x 140): sammen med proeve-kappekrog_kappe. Kappen sænkes 10 mm til venstre og skubbes hjem; krogen skal glide ind under rampen og trække kappen ned, så den ligger fladt på soklen."],
    ["kappekrog", "kappe", [112, 0, 0, 168, 24, 24], "Kappens krog ved x 140, nederst på forvæggen (lægges sammen med proeve-kappekrog_sokkel)."],
    ["studs", "udgang", [272, 0, 0, 296, 60, 60], "Studsens rille (2,0 × 0,7) til skumsnoren og kappens indføringsfase: snoren skal blive i rillen, når kappen skubbes over."]]
i = [p[0] for p in v4["parts"]].index("udgang")
v4["parts"][i][2] = "Udgangsmodul: papirrum, rutsjebane 30°, udtagslomme, skærm, \"Dit print\" og gribehak i højre ende (sort ASA)"
# v4 shock: a printed deck on 56 crush cones (two rings near the rim), cones on the hood's end wall and the exit
# module's hangers; and hidden L-brackets on the wall instead of consoles and cleats (Esben 23 Oct 2026)
v4["printed"].insert([p[0] for p in v4["printed"]].index("sokkel") + 1, ["daempeplade", "daempeplade", "Dæmpeplade med 56 knusekegler (sort ASA), print 1"])
v4["parts"].insert([p[0] for p in v4["parts"]].index("sokkel") + 1,
    ["daempeplade", "daempeplade", "Dæmpeplade: printeren står på den, 56 knusekegler under tager stødet ved et fald (må knuses, udskiftes)", "#e07a1f", "Kabinet", [0, 0, 40]])
P["skruer_sokkel"][2] = "2 skruer, sokkel til bord/hylde/konsol (B2B, SPUN+ 4,0 × 16, sættes i før dæmpepladen)"
P["skruer_link"][2] = "2 skruer, soklens tunge til udgangsmodulet nedefra (3,5 × 12 til plast)"
P["konsoller"][2] = "2 skjulte L-beslag (B2B væg): hylde 15 under printeren, bagplade bag den, skruet i væggen dér; soklen og udgangsmodulet skrues fast indefra/nedefra"
P["skruer_konsol"][2] = "2 skruer op i udgangsmodulet (SPUN+ 4,0 × 25)"
P["skruer_vaeg"][2] = "8 skruer + dybler (5 × 50), skjult bag printeren"
v4["parts"].append(["dyvler", "s_pin", "2 dyvelstifter Ø6 × 16 (stål) samler de 2 L-beslag til én lige vinkel", "#c3c7cf", "Skruer", [0, -110, 0]])
v4["printed"] = [p for p in v4["printed"] if p[0] != "vaegplade"]
v4["printed"][[p[0] for p in v4["printed"]].index("konsol")][2] = "Skjult L-beslag (B2B væg), print 2"
v4["parts"] = [p for p in v4["parts"] if p[0] != "vaegplader"]
v4["coupons"] = [c for c in v4["coupons"] if c[0] != "krog"] + [
    ["hjoerne", "konsol", [10, 182.5, -15, 70, 237.5, 35], "L-beslagets hjørne med hulkehlen og en vægskrue: printes på enden som det hele beslag. Prøv, at printerens bagkant går helt ind til bagpladen, og at skruehovedet ligger plant."],
    ["greb", "kappe", [0, 66, 12, 30, 156, 52], "Venstre gribehak (76 × 22, loftet 20° op indad): fingrene skal kunne hage sig op bag kanten med god plads."],
    ["greb", "udgang", [446, 76, 0, 476, 166, 46], "Højre gribehak i udgangsmodulets ende, samme form."],
    ["knusekegler", "daempeplade", [41, 6, 0, 110, 66, 13], "Hjørne af dæmpepladen med knusekegler: tryk en kegle flad i en skruestik (skal give efter ved ca. 5–10 kg pr. kegle og knække, ikke pladen)."]]
# v5 (Esben 27 Oct 2026: no seals, as halo-gen2-v27): no foam cord or grooves, and no hooks and ramps (they only pulled
# the hood down onto the cord). The hood lies on the base by its weight; spigot and cam lock hold it.
VERSIONS["selfi-printer-v5"] = v5 = json.loads(json.dumps(v4))
v5["scad"] = "selfi_printer_v5.scad"
P = {p[0]: p for p in v5["parts"]}
P["kappe"][2] = "Kappe (sort ASA): flad top, luftlameller, nøglelås og gribehak i venstre ende; ligger på soklen ved egen vægt"
P["sokkel"][2] = "Sokkel: printerramme, låseholder, Pi-holder, kabelspor bagtil og lomme til dæmpepladen (sort ASA)"
v5["coupons"] = [c for c in v5["coupons"] if c[0] not in ("taetning", "kappekrog", "studs")] + [
    ["fuge", "sokkel", [0, 0, 0, 45, 45, 24], "Hjørnet af soklen med læben indenfor kappens væg (v5: ingen rille): kappens kant skal stå fladt på soklen og læben gå fri indenfor."]]
NEWEST = "selfi-printer-v5"

M = np.array([[1, 0, 0, 0], [0, 0, 1, 0], [0, -1, 0, 0], [0, 0, 0, 1]], float)   # scad -> glTF


def scad(cfg, view, out, **defs):
    args = ["openscad", "-D", f'VIEW="{view}"', "-o", str(out), str(ROOT / "hardware/cad" / cfg["scad"])]
    for k, v in defs.items():
        args[1:1] = ["-D", f"{k}={v}"]
    subprocess.run(args, check=True, capture_output=True)


def material(hexc):
    # glTF base colours are linear: convert from sRGB, or the black hood comes out mid grey
    c = [((v / 255 + 0.055) / 1.055) ** 2.4 if v > 10 else v / 255 / 12.92 for v in (int(hexc[i:i + 2], 16) for i in (1, 3, 5))] + [1.0]
    return trimesh.visual.material.PBRMaterial(baseColorFactor=c, metallicFactor=0.0, roughnessFactor=0.55)


def print_files(cfg, ver, out, tmp):
    """the print-ready STLs and the multi-colour 3MF; returns the meshes and their bed shifts"""
    shift, meshes = {}, {}
    for view, name, _ in cfg["printed"]:
        scad(cfg, view, tmp / f"{view}.stl", PRINT="true")
        meshes[view] = trimesh.load(tmp / f"{view}.stl")
    for view, _, _ in cfg["printed"]:
        base = cfg["co_printed"].get(view, view)
        if base not in shift:
            lo, hi = meshes[base].bounds
            shift[base] = [-(lo[0] + hi[0]) / 2, -(lo[1] + hi[1]) / 2, -lo[2]]
    for view, name, _ in cfg["printed"]:
        m = meshes[view]
        m.apply_translation(shift[cfg["co_printed"].get(view, view)])
        m.export(out / f"{ver}_{name}.stl")
    for hood, inlays in cfg["multicolour"].items():
        # a Bambu Studio project with the print settings (make_3mf.py): the part on slot 1 (sort), white 2, green 3
        parts = [(hood, meshes[hood], 1)] + [(v, meshes[v], 2 if v.endswith("hvid") else 3) for v in inlays]
        name = f"{ver}_{hood.replace('_', '-')}"
        write_bambu_3mf(out / f"{name}_flerfarvet.3mf", parts, name, SETTINGS["printerkappe"],
                        filaments=("sort", "hvid", "groen"))


def model(cfg, ver, out, tmp):
    """3D model for the admin viewer, and renders of it with three.js (they look like the viewer)"""
    sx, sy, sz = cfg["size"]
    T = trimesh.transformations.translation_matrix([-sx / 2 if cfg["centre_x"] else 0, -sz / 2, sy / 2])
    scene, meta = trimesh.Scene(), []
    for node, view, label, colour, group, explode in cfg["parts"]:
        scad(cfg, view, tmp / f"a_{view}.stl")
        m = trimesh.load(tmp / f"a_{view}.stl")
        m.apply_transform(M)
        c = m.bounds.mean(axis=0)
        m.apply_translation(-c)                       # node origin at the part centre, so it explodes cleanly
        m.visual = trimesh.visual.TextureVisuals(material=material(colour))
        scene.add_geometry(m, node_name=node, geom_name=node, transform=T @ trimesh.transformations.translation_matrix(c))
        meta.append({"node": node, "label": label, "color": colour, "group": group, "explode": explode})
    scene.export(out / f"{ver}_3d.glb")
    (out / f"{ver}_parts.json").write_text(json.dumps(meta, ensure_ascii=False, indent=1) + "\n")
    views = [dict(v, out=str(out / f"{ver}_{v['out']}.png")) for v in cfg["renders"]]
    (tmp / "views.json").write_text(json.dumps(views))
    subprocess.run(["node", str(Path(__file__).with_name("render_glb.mjs")), str(out / f"{ver}_3d.glb"),
                    str(out / f"{ver}_parts.json"), str(tmp / "views.json")], check=True)


def drawings(cfg, ver, out, tmp):
    for view, defs, *name in cfg["drawings"]:
        scad(cfg, view, tmp / f"{name[0] if name else view}.svg", **defs)
    subprocess.run([sys.executable, str(Path(__file__).with_name("printer_sheet.py")), str(tmp), str(out), ver], check=True)


def hurtig(cfg, ver, out):
    """hurtigprint set: the released STLs 1:1 and test pieces cut out of them in print orientation"""
    src = ROOT / "hardware/stl/printer" / ver
    hv = f"{ver}-hurtig"
    dst = ROOT / "hardware/stl/printer-hurtig" / hv
    dst.mkdir(parents=True, exist_ok=True)
    for f in sorted(src.glob(f"{ver}_*")):
        if f.suffix in (".stl", ".3mf"):
            shutil.copy(f, dst / f.name.replace(ver, hv, 1))
    tmp = Path(tempfile.mkdtemp())
    for name, part, box, what in cfg["coupons"]:
        # cut in the assembly frame, then turn the piece like its part (same view with PRINT=true)
        scad(cfg, part, tmp / f"{part}.stl")
        scad(cfg, part, tmp / f"{part}_p.stl", PRINT="true")
        a, p = trimesh.load(tmp / f"{part}.stl"), trimesh.load(tmp / f"{part}_p.stl")
        R = print_transform(a, p)
        x0, y0, z0, x1, y1, z1 = box
        cut = trimesh.creation.box(extents=[x1 - x0, y1 - y0, z1 - z0],
                                   transform=trimesh.transformations.translation_matrix([(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2]))
        piece = trimesh.boolean.intersection([a, cut], engine="manifold")
        piece.apply_transform(R)
        bodies = piece.split(only_watertight=False)
        keep = max(bodies, key=lambda b: b.volume) if len(bodies) > 1 else piece
        dropped = sum(b.volume for b in bodies if b is not keep) if len(bodies) > 1 else 0
        lo, hi = keep.bounds
        keep.apply_translation([-(lo[0] + hi[0]) / 2, -(lo[1] + hi[1]) / 2, -lo[2]])
        fn = dst / f"{hv}_proeve-{name}_{part}.stl"
        keep.export(fn)
        print(f"{fn.name}: {keep.extents.round(0).tolist()} mm, ca. {keep.volume / 1000 * 1.24:.0f} g PLA"
              + (f" (fjernet {dropped / 1000:.1f} cm³ løse stykker)" if dropped > 1 else "") + f" · {what}")
    shutil.rmtree(tmp)
    return dst


def print_transform(a, p):
    """the rigid transform that turns the assembly mesh a into the print mesh p (rotation from the bounding boxes:
    the parts are only turned in steps of 90 degrees)"""
    import itertools
    ea, ep = a.extents, p.extents
    best = None
    for perm in itertools.permutations(range(3)):
        for signs in itertools.product((1, -1), repeat=3):
            Rm = np.zeros((3, 3))
            for i, j in enumerate(perm):
                Rm[i, j] = signs[i]
            if np.linalg.det(Rm) < 0.5:
                continue
            if not np.allclose(np.abs(Rm) @ ea, ep, atol=0.2):
                continue
            # check against the centre of mass, which a rotation moves predictably
            ca = Rm @ (a.center_mass - a.bounds.mean(axis=0))
            cp = p.center_mass - p.bounds.mean(axis=0)
            err = np.linalg.norm(ca - cp)
            if best is None or err < best[0]:
                best = (err, Rm)
    Rm = best[1]
    H = np.eye(4); H[:3, :3] = Rm
    t = p.bounds.mean(axis=0) - Rm @ a.bounds.mean(axis=0)
    H[:3, 3] = t
    return H


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    ver = args[0] if args and args[0] in VERSIONS else NEWEST
    rest = args[1:] if args and args[0] in VERSIONS else args
    cfg = VERSIONS[ver]
    if "--hurtig" in sys.argv:
        print(hurtig(cfg, ver, None))
        return
    out = Path(rest[0]) if rest else ROOT / "hardware/stl/printer" / ver
    out.mkdir(parents=True, exist_ok=True)
    tmp = Path(tempfile.mkdtemp())
    print_files(cfg, ver, out, tmp)
    model(cfg, ver, out, tmp)
    drawings(cfg, ver, out, tmp)
    # everything for the printer in one zip (Kasper prints from this)
    with zipfile.ZipFile(out / f"{ver}_printfiler.zip", "w", zipfile.ZIP_DEFLATED) as z:
        for f in sorted(out.iterdir()):
            if f.suffix in (".stl", ".3mf", ".md", ".png", ".xlsx"):
                z.write(f, f.name)
    shutil.rmtree(tmp)


if __name__ == "__main__":
    main()
