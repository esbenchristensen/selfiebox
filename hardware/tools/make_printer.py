#!/usr/bin/env python3
"""Print files, 3D model, renders and drawings of the Selfi printer (DNP QW410 in a printed enclosure).

Usage:  python3 hardware/tools/make_printer.py [version] [out dir]
        version: selfi-printer-v1 or selfi-printer-v2 (default: the newest); out dir: default hardware/stl/printer/<version>
        python3 hardware/tools/make_printer.py <version> --hurtig     the hurtigprint set (v2 and later), see below
CAD:    hardware/cad/selfi_printer_v<N>.scad
Needs:  openscad, node + Playwright + three (web/node_modules) for the renders, trimesh, manifold3d, numpy, networkx,
        cairosvg, Pillow. Playwright from elsewhere: PLAYWRIGHT_MJS=/path/to/playwright/index.mjs
Output (every file starts with the version):
  <v>_<part>.stl                 print-ready, in print orientation, on z = 0
  <v>_kappe_flerfarvet.3mf       hood + white and green logo as one multi-part object (AMS)
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

ROOT = Path(__file__).resolve().parents[2]

# Per version: CAD file, overall size (x along the front, depth, height; used to centre the 3D model), print files,
# inlays printed with a part, 3D parts, renders and drawing views.
#   PRINTED: (CAD view, file name, label)
#   PARTS:   (node, CAD view in the assembly frame, label, colour, group, explode [x, y, z] in glTF axes (y up, z to the viewer))
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
        "multicolour": ["kappe", "kappe_laas"],
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
        "multicolour": ["kappe"],
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
NEWEST = "selfi-printer-v2"

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
    for hood in cfg["multicolour"]:
        sc = trimesh.Scene()
        sc.add_geometry(meshes[hood], node_name=hood, geom_name=hood)
        sc.add_geometry(meshes["logo_hvid"], node_name="logo_hvid", geom_name="logo_hvid")
        sc.add_geometry(meshes["logo_groen"], node_name="logo_groen", geom_name="logo_groen")
        sc.export(out / f"{ver}_{hood.replace('_', '-')}_flerfarvet.3mf")


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
