"""3D model of Halo gen 2 for the admin viewer: one node per part, component, cable and screw set.

Usage:  python3 hardware/render/gen2_viewer.py <stl dir> <out dir> <version>
Input:  STLs from hardware/cad/gen2_concept.scad, one per VIEW named below (x_*, c_*, s_*).
Output: <version>_3d.glb and <version>_parts.json (labels, colours, groups, explode offsets).

Every component has its own colour, and its cables use the same colour, so hiding a
component (for example the 4G modem, which early units do not have) hides its cables too.
Coordinates: OpenSCAD x right, y back, z up -> glTF x right, y up, z towards the viewer.
"""
import json
import sys
from pathlib import Path

import numpy as np
import trimesh

STL, OUT, VER = Path(sys.argv[1]), Path(sys.argv[2]), sys.argv[3]

# node, STL view, label, colour, group, explode [x, y, z] in glTF axes (mm at full explode)
PARTS = [
    ("lysring",       "x_ring3",       "Lysring (naturfarvet ASA)",       "#fbf8f1", "Kabinet",    [0, 0, 170]),
    ("front",         "x_front3",      "Front (sort ASA)",                "#1d1d20", "Kabinet",    [0, 0, 120]),
    ("ledskinne",     "x_frame3",      "Bagramme med reflektor (hvid ASA)", "#e9e4da", "Kabinet",  [0, 0, 25]),
    ("skal",          "x_shell3",      "Skal (sort ASA)",                 "#2a2a2e", "Kabinet",    [0, 0, -90]),
    ("vaegbeslag",    "x_cleat",       "Vægbeslag",                       "#4a4a50", "Kabinet",    [0, 0, -210]),
    ("printerdaeksel", "c_cap",        "Dæksel til printerhul",           "#3a3a3f", "Kabinet",    [0, -45, -90]),
    ("skaerm",        "x_display3",    "Skærm 10\"",                      "#253041", "Elektronik", [0, 0, 65]),
    ("kamera",        "x_camera",      "Kamera (Wide)",                   "#9aa3b5", "Elektronik", [0, 0, 120]),
    ("ledhvid",       "x_strip_w",     "2 × hvid COB-strip Ra95",         "#ffb000", "Elektronik", [0, 0, 60]),
    ("ledrgb",        "x_strip_rgb",   "RGB-strip 5 mm",                  "#a855f7", "Elektronik", [0, 0, 60]),
    ("pi",            "c_pi3",         "Raspberry Pi 5",                  "#2e9e5b", "Elektronik", [0, 0, 0]),
    ("stroem",        "c_psu5",        "5 V-forsyning (Mean Well RSD-60G-5)", "#8b5cf6", "Elektronik", [0, 0, -90]),
    ("ledstyring",    "c_wled",        "LED-styring RGB (Gledopto WLED)", "#127a49", "Elektronik", [0, 0, -90]),
    ("daemper",       "c_mosfet",      "Dæmper hvidt lys (MOSFET)",       "#0f766e", "Elektronik", [-90, 0, 0]),
    ("stik",          "c_jack",        "Strømstik 24 V",                  "#e11d48", "Elektronik", [0, 0, -90]),
    ("modem4g",       "c_4g",          "4G-modem med GPS",                "#2563eb", "Tilvalg",    [0, 0, -90]),
    ("lydkerne",      "c_mcore",       "Mikrofon-kerne (XVF3800)",        "#0ea5e9", "Tilvalg",    [0, 0, -90]),
    ("mikrofoner",    "c_mics",        "Mikrofonstrip",                   "#14b8a6", "Tilvalg",    [0, 0, -90]),
    ("hoejttaler",    "c_speaker",     "Højttaler",                       "#f97316", "Tilvalg",    [0, 0, -90]),
    ("sensor",        "c_imu",         "Stødsensor",                      "#84cc16", "Tilvalg",    [0, 0, -90]),
    ("reed",          "c_reed",        "Løftesensor (reed + magnet)",     "#ec4899", "Tilvalg",    [0, 0, -90]),
    ("skruer_front",  "s_front3",      "4 skruer, front (3,0 × 15)",      "#c3c7cf", "Skruer",     [0, 0, -150]),
    ("skruer_skaerm", "s_display",     "4 skruer, skærm (M2,5, følger med)", "#c3c7cf", "Skruer",  [0, 0, 40]),
    ("skrue_laas",    "s_lock",        "Låseskrue (4 × 25 Torx-pin)",     "#c3c7cf", "Skruer",     [0, -80, -90]),
]

# cables (OpenSCAD coordinates): owner node, label, diameter, points. Routed along the back wall
# and the display back, clear of the boards; each cable belongs to the component it serves.
CABLES = [
    ("stik",       "24 V ind → Wago (sikring 5 A)",  3.0, [(0, 60, 131), (40, 58, 130), (86, 54, 100), (88, 52, 76)]),
    ("ledstyring", "24 V → WLED-styring",            2.0, [(88, 52, 76), (84, 56, 100), (80, 60, 108)]),
    ("daemper",    "24 V → dæmper",                  2.0, [(88, 52, 76), (40, 52, 80), (-60, 52, 110), (-100, 55, 125)]),
    ("stroem",     "5 V → Pi",                       2.2, [(88, 52, 70), (60, 45, 85), (25, 38, 120)]),
    ("ledhvid",    "Hvide strips ← dæmper",          2.4, [(-25, 29, 295.4), (-25, 36, 295.4), (-40, 50, 250), (-95, 50, 160), (-100, 55, 150)]),
    ("ledrgb",     "RGB-strip ← WLED-styring",       2.0, [(25, 29, 295.4), (25, 36, 295.4), (40, 50, 250), (88, 50, 180), (86, 54, 125), (80, 60, 115)]),
    ("skaerm",     "Skærmkabel (DSI) + strøm",        1.2, [(0, 11.5, 150), (0, 19.0, 150)]),
    ("kamera",     "Kamerakabel (CSI)",              1.2, [(0, 11, 282), (0, 20, 272), (0, 21, 230), (0, 21, 175)]),
    ("modem4g",    "4G: USB → Pi",                   2.6, [(-56, 72, 190), (-32, 52, 170), (-18, 44, 118)]),
    ("lydkerne",   "Mikrofon-kerne: USB → Pi",       2.6, [(48, 72, 190), (30, 52, 170), (18, 44, 118)]),
    ("mikrofoner", "Mikrofonstrip → kerne",          1.2, [(40, 68, 297), (62, 70, 270), (70, 70, 226)]),
    ("hoejttaler", "Højttaler → kerne",              1.6, [(-41, 74, 100), (-12, 76, 124), (40, 76, 150), (60, 74, 166)]),
    ("sensor",     "Stødsensor → Pi (I2C)",          1.4, [(0, 76, 200), (12, 52, 190), (24, 41, 165)]),
    ("reed",       "Løftesensor → Pi",               1.4, [(-46, 75, 44), (-32, 60, 90), (-24, 41, 150)]),
]

M = np.array([[1, 0, 0, 0], [0, 0, 1, 0], [0, -1, 0, 0], [0, 0, 0, 1]], float)   # scad -> glTF
Y0 = -153.0                                                                     # centre the box on y = 0


def colour(hexc):
    return [int(hexc[i:i + 2], 16) / 255 for i in (1, 3, 5)] + [1.0]


def material(hexc, rough=0.55):
    return trimesh.visual.material.PBRMaterial(baseColorFactor=colour(hexc), metallicFactor=0.0, roughnessFactor=rough)


def tube(points, d):
    parts = []
    pts = [np.array(p, float) for p in points]
    for a, b in zip(pts, pts[1:]):
        v = b - a
        L = np.linalg.norm(v)
        if L < 1e-6:
            continue
        c = trimesh.creation.cylinder(radius=d / 2, height=L, sections=12)
        c.apply_transform(trimesh.geometry.align_vectors([0, 0, 1], v / L))
        c.apply_translation((a + b) / 2)
        parts.append(c)
    for p in pts:
        s = trimesh.creation.icosphere(subdivisions=1, radius=d / 2)
        s.apply_translation(p)
        parts.append(s)
    return trimesh.util.concatenate(parts)


scene = trimesh.Scene()
meta = []
for node, view, label, hexc, group, ex in PARTS:
    m = trimesh.load(STL / f"{view}.stl")
    m.merge_vertices()
    m.apply_transform(M)
    m.apply_translation([0, Y0, 0])
    m.visual = trimesh.visual.TextureVisuals(material=material(hexc, 0.3 if group == "Skruer" else 0.55))
    scene.add_geometry(m, node_name=node, geom_name=node)
    meta.append({"node": node, "label": label, "color": hexc, "group": group, "explode": ex})

owners = {p[0]: p for p in PARTS}
for i, (owner, label, d, pts) in enumerate(CABLES):
    m = tube(pts, d)
    m.apply_transform(M)
    m.apply_translation([0, Y0, 0])
    hexc = owners[owner][3]
    m.visual = trimesh.visual.TextureVisuals(material=material(hexc, 0.4))
    node = f"kabel_{i}_{owner}"
    scene.add_geometry(m, node_name=node, geom_name=node)
    meta.append({"node": node, "label": label, "color": hexc, "group": "Kabler", "owner": owner, "explode": [0, 0, 0]})

OUT.mkdir(parents=True, exist_ok=True)
(OUT / f"{VER}_3d.glb").write_bytes(scene.export(file_type="glb"))
(OUT / f"{VER}_parts.json").write_text(json.dumps(meta, ensure_ascii=False, indent=1))
print("wrote", OUT / f"{VER}_3d.glb", len(meta), "nodes")
