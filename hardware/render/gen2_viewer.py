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
    ("skal",          "x_shell3",      "Skal (sort ASA)",                 "#1d1d20", "Kabinet",    [0, 0, -90]),
    ("vaegbeslag",    "x_cleat",       "Vægbeslag",                       "#4a4a50", "Kabinet",    [0, 0, -210]),
    ("printerdaeksel", "c_cap",        "Dæksel til printerhul",           "#3a3a3f", "Kabinet",    [0, -45, -90]),
    ("skaerm",        "x_dsp_glass",   "Skærm: glas med sort kant",       "#0b0b0d", "Elektronik", [0, 0, 65]),
    ("skaerm_billede", "x_dsp_active", "Skærm: aktivt billede 1200 × 1920", "#4f7df0", "Elektronik", [0, 0, 65]),
    ("skaerm_bag",    "x_dsp_back",    "Skærm: bagside med skrueører",    "#8a8d94", "Elektronik", [0, 0, 65]),
    ("kamera",        "x_camera",      "Kamera (Wide)",                   "#9aa3b5", "Elektronik", [0, 0, 120]),
    ("ledhvid",       "x_strip_w",     "2 × hvid COB-strip Ra95",         "#ffb000", "Elektronik", [0, 0, 60]),
    ("ledrgb",        "x_strip_rgb",   "RGB-strip 5 mm",                  "#a855f7", "Elektronik", [0, 0, 60]),
    ("pi",            "c_pi_board",    "Raspberry Pi 5",                  "#2e9e5b", "Elektronik", [0, 0, 0]),
    ("koeler",        "c_cooler",      "Active Cooler (blæser bagud)",    "#3b3e46", "Elektronik", [0, 0, 0]),
    ("blaeser",       "c_fan",         "Blæser i Active Cooler",          "#9ca3af", "Elektronik", [0, 0, 0]),
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
    ("modem4g",    "4G: USB → Pi",                   2.6, [(-56, 72, 190), (-32, 52, 170), (-18, 44, 118)]),
    ("lydkerne",   "Mikrofon-kerne: USB → Pi",       2.6, [(48, 72, 190), (30, 52, 170), (18, 44, 118)]),
    ("mikrofoner", "Mikrofonstrip → kerne",          1.2, [(40, 68, 297), (62, 70, 270), (70, 70, 226)]),
    ("hoejttaler", "Højttaler → kerne",              1.6, [(-41, 74, 100), (-12, 76, 124), (40, 76, 150), (60, 74, 166)]),
    ("sensor",     "Stødsensor → Pi (I2C)",          1.4, [(0, 76, 200), (12, 52, 190), (24, 41, 165)]),
    ("reed",       "Løftesensor → Pi",               1.4, [(-46, 75, 44), (-32, 60, 90), (-24, 41, 150)]),
]

# flat cables (FFC): owner, label, width, thickness, sections [(point, width direction)].
# They bend only about their width; the camera ribbon twists slowly behind the frame.
RIBBONS = [
    ("kamera", "Kamerakabel (fladt, 16 mm)", 16, 0.3, [((9.6, 10.7, 289), (0, 0, 1)), ((11.5, 11.2, 289), (0, 0, 1)), ((12.6, 13.5, 289), (0, 0, 1)),
        ((12.6, 34, 289), (0, 0, 1)), ((12.6, 44, 282), (0.5, 0, 0.87)), ((11, 48, 266), (1, 0, 0.2)), ((8, 46, 220), (1, 0, 0)), ((5, 40, 190), (1, 0, 0))]),
    ("skaerm", "Skærmkabel (fladt, følger med skærmen)", 11.5, 0.3, [((0, 12.9, 205), (1, 0, 0)), ((0, 13.4, 196), (1, 0, 0)), ((0, 16, 189.5), (1, 0, 0)),
        ((0, 19.5, 188), (1, 0, 0)), ((0, 21.5, 186.5), (1, 0, 0))]),
]


def ribbon(sections, w, th):
    P = [np.array(p, float) for p, _ in sections]
    V, F = [], []
    for i, (p, wd) in enumerate(sections):
        tdir = P[min(i + 1, len(P) - 1)] - P[max(i - 1, 0)]
        tdir /= np.linalg.norm(tdir)
        wd = np.array(wd, float); wd -= tdir * wd.dot(tdir); wd /= np.linalg.norm(wd)
        n = np.cross(tdir, wd)
        for a, b in ((-1, -1), (1, -1), (1, 1), (-1, 1)):
            V.append(P[i] + a * wd * w / 2 + b * n * th / 2)
    for i in range(len(sections) - 1):
        for k in range(4):
            a, b, c, d = 4 * i + k, 4 * i + (k + 1) % 4, 4 * (i + 1) + (k + 1) % 4, 4 * (i + 1) + k
            F += [(a, b, c), (a, c, d)]
    return trimesh.Trimesh(np.array(V), np.array(F), process=False)


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

for i, (owner, label, w, th, secs) in enumerate(RIBBONS):
    m = ribbon(secs, w, th)
    m.apply_transform(M)
    m.apply_translation([0, Y0, 0])
    m.visual = trimesh.visual.TextureVisuals(material=material("#c9a227", 0.45))
    node = f"fladkabel_{i}_{owner}"
    scene.add_geometry(m, node_name=node, geom_name=node)
    meta.append({"node": node, "label": label, "color": "#c9a227", "group": "Kabler", "owner": owner, "explode": [0, 0, 0]})

OUT.mkdir(parents=True, exist_ok=True)
(OUT / f"{VER}_3d.glb").write_bytes(scene.export(file_type="glb"))
(OUT / f"{VER}_parts.json").write_text(json.dumps(meta, ensure_ascii=False, indent=1))
print("wrote", OUT / f"{VER}_3d.glb", len(meta), "nodes")
