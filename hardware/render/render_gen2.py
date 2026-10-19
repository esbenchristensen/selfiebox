"""Concept renders of Halo gen 2: 85 mm main unit + printer module (2 x Instax Link WIDE).

Usage:  blender -b -P hardware/render/render_gen2.py -- <stl dir> <out dir> [shot ...] [--samples N] [--size WxH]
Shots:  main module pair side cut                                   (default: all)
Input:  one STL per material from hardware/cad/gen2_concept.scad (VIEW="x_<part>")
Reuses materials, studio, lights and camera helpers from render.py.
"""
import math
import os
import sys

import bpy

HERE = os.path.dirname(os.path.abspath(__file__))
argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
STL, OUTDIR = argv[0], argv[1]
rest = argv[2:]

# borrow render.py's helpers without running its shots
src = open(os.path.join(HERE, "render.py")).read().split("\nfor s in shots:")[0]
sys.argv = [sys.argv[0], "--"] + rest
ns = {"__file__": os.path.join(HERE, "render.py"), "__name__": "render_lib"}
exec(compile(src, "render.py", "exec"), ns)
SAMPLES, SIZE = ns["SAMPLES"], ns["SIZE"]
shots = [s for s in ns["shots"] if s in ("main", "module", "pair", "side", "cut", "exploded")] or ["main", "module", "exploded", "pair", "side", "cut"]

# gen 2 geometry (mm, OpenSCAD frame): see gen2_concept.scad
W, H, D = 222.5, 306, 85
HP = 147                  # module height below the main unit
CHEEK = 34
GC, GLASS_Y, VIEW = 151.85, 3.7, (136.4, 217.6)

ROLE = {"bezel": "body", "diffuser": "diff", "shell": "body", "display": "glass", "camera": "lens",
        "mod_shell": "body", "lid": "body", "lid_open": "body", "printers": "printer", "photo": "paper",
        "mod_shell_cut": "body", "lid_cut": "body"}
MAIN = ["bezel", "diffuser", "shell", "display", "camera"]
MOD = ["mod_shell", "printers"]


def load(part, M, dz):
    path = os.path.join(STL, part + ".stl")
    if hasattr(bpy.ops.wm, "stl_import"):
        bpy.ops.wm.stl_import(filepath=path)
    else:
        bpy.ops.import_mesh.stl(filepath=path)
    o = bpy.context.selected_objects[0]
    o.location.z += dz
    o.data.materials.clear(); o.data.materials.append(M[ROLE[part]])
    return o


def shoot(name):
    ns["clear"]()
    M = ns["setup_materials"]()
    M["printer"] = ns["mat"]("Instax white", ns["srgb"]("#e9e7e2"), rough=0.35)
    parts, dz_main = [], 0
    if name == "main":
        parts = [(p, 0) for p in MAIN]
    elif name == "module":
        parts = [(p, 0) for p in MOD if p != "printers"] + [("lid", 0)]
    else:
        dz_main = HP
        parts = [(p, HP) for p in MAIN] + [(p, 0) for p in MOD if p != "printers"]
        if name == "exploded":
            dz_main = HP + 110
            parts = [(p, dz_main) for p in MAIN] + [(p, 0) for p in MOD if p != "printers"] + [("lid", 0)]
        if name == "cut":
            parts = [(p, HP) for p in MAIN] + [("mod_shell_cut", 0), ("lid_cut", 0), ("printers", 0), ("photo", 0)]
        else:
            parts += [("lid", 0), ("photo", 0)]
    for p, dz in parts:
        load(p, M, dz)
    if name != "module":
        ns["screen_plane"](M, dz_main)
    top = (H + dz_main) if name != "module" else HP + CHEEK
    floor_z = {"pair": -260, "side": -260, "cut": -260, "exploded": -120, "main": -60}.get(name, -1500)
    bd = ns["studio"](); bd.location.z = floor_z
    cz = top / 2
    aspect = SIZE[0] / SIZE[1]
    ns["lights"](cz)
    if name == "main":
        ns["frame_cam"]((0, 25, cz), (-0.55, -1, 0.15), 70, top * 1.55, aspect)
    elif name == "module":
        ns["frame_cam"]((0, 40, cz - 20), (-0.6, -0.8, 1.3), 60, 360, aspect)
    elif name == "pair":
        ns["frame_cam"]((0, 25, cz - 40), (-0.55, -1, 0.12), 60, top * 1.45, aspect)
    elif name == "side":
        ns["frame_cam"]((0, 40, cz - 40), (1, -0.1, 0.04), 85, top * 1.35, aspect)
    elif name == "exploded":
        ns["frame_cam"]((0, 25, cz - 30), (-0.6, -1, 0.35), 55, top * 1.4, aspect)
    elif name == "cut":
        ns["frame_cam"]((0, 40, 170), (-1, -0.7, 0.25), 60, 470, aspect)
    os.makedirs(OUTDIR, exist_ok=True)
    ns["render_settings"](os.path.join(OUTDIR, name + ".jpg"), SIZE)
    bpy.context.scene.cycles.samples = SAMPLES
    bpy.ops.render.render(write_still=True)
    print("RENDERED", name)


for s in shots:
    shoot(s)
