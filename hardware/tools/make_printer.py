#!/usr/bin/env python3
"""Print files, 3D model, renders and drawings of the Selfi printer (DNP QW410 in a printed enclosure).

Usage:  python3 hardware/tools/make_printer.py [out dir]      (default: hardware/stl/printer/selfi-printer-v1)
CAD:    hardware/cad/selfi_printer_v1.scad
Needs:  openscad, xvfb-run (renders), trimesh, numpy, networkx, cairosvg, Pillow
Output (every file starts with the version):
  <v>_<part>.stl                 print-ready, in print orientation, on z = 0
  <v>_kappe_flerfarvet.3mf       hood + white and green logo as one multi-part object (AMS), also for kappe-laas
  <v>_3d.glb + <v>_parts.json    the admin 3D viewer (one node per part, explode offsets in glTF axes)
  <v>_*.png                      renders straight from the CAD and the drawing sheets (printer_sheet.py)
  <v>_printfiler.zip             print files, guide, shopping list and pictures
Write PRINTGUIDE_<v>.md and <v>_indkoebsliste.xlsx (make_printer_bom.py) before running, so the zip holds them.
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
SCAD = ROOT / "hardware/cad/selfi_printer_v1.scad"
VER = "selfi-printer-v1"
OUT = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "hardware/stl/printer" / VER
W, H, D = 222.5, 220.0, 294.4

# view in the CAD, file name, label for the guide
PRINTED = [
    ("kappe", "kappe", "Kappe (B2C, uden lås)"),
    ("kappe_laas", "kappe-laas", "Kappe med hul til skabslås (B2B)"),
    ("sokkel", "sokkel", "Sokkel (samme til bord, hylde og væg)"),
    ("bakke", "bakke", "Opsamlingsbakke"),
    ("konsol", "konsol", "Vægkonsol (B2B væg)"),
    ("vaegplade", "vaegplade", "Vægplade (B2B væg)"),
    ("logo_hvid", "logo-hvid", "Logo, hvide dele (indlagt i kappen)"),
    ("logo_groen", "logo-groen", "Logo, grønne prikker (indlagt i kappen)"),
]
CO_PRINTED = {"logo_hvid": "kappe", "logo_groen": "kappe"}

# node, CAD view (assembly frame), label, colour, group, explode [x, y, z] in glTF axes (y up, z towards the viewer)
PARTS = [
    ("kappe", "kappe_laas", "Kappe (sort ASA; B2B-udgaven med hul til skabslås, B2C-kappen er uden hul)", "#1d1d20", "Kabinet", [0, 260, 0]),
    ("logo_hvid", "logo_hvid", "Logo, hvidt (indlagt i kappen)", "#f5f5f4", "Kabinet", [0, 260, 0]),
    ("logo_groen", "logo_groen", "Logo, grønne prikker", "#22d36b", "Kabinet", [0, 260, 0]),
    ("sokkel", "sokkel", "Sokkel med 4 klikkanter, printerramme og bagrum (mørk ASA)", "#2b2b2f", "Kabinet", [0, 0, 0]),
    ("bakke", "bakke", "Opsamlingsbakke (klik-på)", "#1d1d20", "Kabinet", [0, 0, 110]),
    ("printer", "c_printer", "DNP QW410 (fotoprinter, rulle 150 × 4×6 / 300 striber)", "#d9d9d6", "Elektronik", [0, 130, 0]),
    ("pi", "c_pi", "Raspberry Pi Zero 2 W (printserver på wifi)", "#2e9e5b", "Elektronik", [0, 60, -60]),
    ("psu", "c_psu", "5 V-forsyning til Pi'en (Mean Well GST25E05)", "#8b5cf6", "Elektronik", [0, 60, -60]),
    ("inlet", "c_inlet", "Strømindgang C14 (panelkabel, snap-in)", "#e11d48", "Elektronik", [0, 0, -40]),
    ("laas", "c_lock", "Skabslås Ø19 med kam (B2B)", "#c3c7cf", "B2B", [60, 260, 0]),
    ("konsol", "konsol", "Vægkonsol med 2 massive knægte (B2B væg)", "#3a3a3f", "B2B", [0, -110, 0]),
    ("vaegplade", "vaegplade", "Vægplade med 45° skinne (B2B væg)", "#4a4a50", "B2B", [0, -110, -110]),
    ("skruer_sokkel", "s_base", "2 skruer, sokkel til hylde/konsol (SPUN+ 4,0 × 30, undersænket)", "#c3c7cf", "Skruer", [0, -60, 0]),
    ("skruer_vaeg", "s_wall", "4 skruer + dybler, vægplade (5 × 50)", "#c3c7cf", "Skruer", [0, -110, -170]),
]

M = np.array([[1, 0, 0, 0], [0, 0, 1, 0], [0, -1, 0, 0], [0, 0, 0, 1]], float)   # scad -> glTF
T = trimesh.transformations.translation_matrix([0, -H / 2, D / 2])             # centre the unit


def scad(view, out, **defs):
    args = ["openscad", "-D", f'VIEW="{view}"', "-o", str(out), str(SCAD)]
    for k, v in defs.items():
        args[1:1] = ["-D", f"{k}={v}"]
    subprocess.run(args, check=True, capture_output=True)


def render(out, view="all", cam="0,0,0,62,0,-38,0", size="1600,1200", **defs):
    args = ["xvfb-run", "-a", "openscad", "-D", f'VIEW="{view}"', f"--imgsize={size}", f"--camera={cam}",
            "--viewall", "--autocenter", "--colorscheme=Tomorrow", "-o", str(out), str(SCAD)]
    for k, v in defs.items():
        args[3:3] = ["-D", f"{k}={v}"]
    subprocess.run(args, check=True, capture_output=True)


def material(hexc):
    c = [int(hexc[i:i + 2], 16) / 255 for i in (1, 3, 5)] + [1.0]
    return trimesh.visual.material.PBRMaterial(baseColorFactor=c, metallicFactor=0.0, roughnessFactor=0.55)


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    tmp = Path(tempfile.mkdtemp())

    # print files: on the bed, centred; inlays keep the hood's offset so they stay registered
    shift = {}
    meshes = {}
    for view, name, _ in PRINTED:
        scad(view, tmp / f"{view}.stl", PRINT="true")
        meshes[view] = trimesh.load(tmp / f"{view}.stl")
    for view, _, _ in PRINTED:
        base = CO_PRINTED.get(view, view)
        if base not in shift:
            lo, hi = meshes[base].bounds
            shift[base] = [-(lo[0] + hi[0]) / 2, -(lo[1] + hi[1]) / 2, -lo[2]]
    for view, name, _ in PRINTED:
        m = meshes[view]
        m.apply_translation(shift[CO_PRINTED.get(view, view)])
        m.export(OUT / f"{VER}_{name}.stl")
    for hood in ("kappe", "kappe_laas"):
        sc = trimesh.Scene()
        sc.add_geometry(meshes[hood], node_name=hood, geom_name=hood)
        sc.add_geometry(meshes["logo_hvid"], node_name="logo_hvid", geom_name="logo_hvid")
        sc.add_geometry(meshes["logo_groen"], node_name="logo_groen", geom_name="logo_groen")
        sc.export(OUT / f"{VER}_{hood.replace('_', '-')}_flerfarvet.3mf")

    # 3D model for the viewer
    scene = trimesh.Scene()
    meta = []
    for node, view, label, colour, group, explode in PARTS:
        scad(view, tmp / f"a_{view}.stl")
        m = trimesh.load(tmp / f"a_{view}.stl")
        m.apply_transform(M)
        c = m.bounds.mean(axis=0)
        m.apply_translation(-c)                       # node origin at the part centre, so it explodes cleanly
        m.visual = trimesh.visual.TextureVisuals(material=material(colour))
        scene.add_geometry(m, node_name=node, geom_name=node, transform=T @ trimesh.transformations.translation_matrix(c))
        meta.append({"node": node, "label": label, "color": colour, "group": group, "explode": explode})
    scene.export(OUT / f"{VER}_3d.glb")
    (OUT / f"{VER}_parts.json").write_text(json.dumps(meta, ensure_ascii=False, indent=1) + "\n")

    # renders straight from the CAD
    render(OUT / f"{VER}_forfra.png", cam="0,0,0,72,0,-28,0")
    render(OUT / f"{VER}_bagfra.png", cam="0,0,0,66,0,152,0")
    render(OUT / f"{VER}_b2b-laas.png", cam="0,0,0,64,0,58,0", LOCK="true")
    render(OUT / f"{VER}_eksplosion.png", cam="0,0,0,68,0,-34,0", EX="1")
    render(OUT / f"{VER}_vaeg.png", cam="0,0,0,74,0,-52,0", LOCK="true", MOUNT='"vaeg"')
    render(OUT / f"{VER}_vaeg_eksplosion.png", cam="0,0,0,70,0,-140,0", LOCK="true", MOUNT='"vaeg"', EX="1")

    # drawing sheets from projections and sections
    for v in ("d_front", "d_side", "d_top", "d_cut", "d_cut_lock"):
        scad(v, tmp / f"{v}.svg")
    for v in ("d_side", "d_cut"):
        scad(v, tmp / f"{v}_vaeg.svg", MOUNT='"vaeg"')
    subprocess.run([sys.executable, str(Path(__file__).with_name("printer_sheet.py")), str(tmp), str(OUT), VER], check=True)

    # everything for the printer in one zip (Kasper prints from this)
    with zipfile.ZipFile(OUT / f"{VER}_printfiler.zip", "w", zipfile.ZIP_DEFLATED) as z:
        for f in sorted(OUT.iterdir()):
            if f.suffix in (".stl", ".3mf", ".md", ".png", ".xlsx"):
                z.write(f, f.name)
    shutil.rmtree(tmp)


if __name__ == "__main__":
    main()
