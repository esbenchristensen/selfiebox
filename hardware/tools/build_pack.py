#!/usr/bin/env python3
"""Build the combined 3D model and hardware data for the A-Z documentation page.

docs/pack/pack.json      every part of the Halo unit and its wall attachments in assembly
                         coordinates (glTF y-up, front face at z = 0), the themed parts of every
                         built theme ("<theme>--<part>__<colour>") and every screw, insert and dowel
                         ("hw--<group>--<when>--<type>--<n>") from HW_LIST in cad/halo.scad.
docs/pack/hardware.json  HW_LIST and HOLE_LIST (positions in each part's own OpenSCAD frame).

Usage: python3 hardware/tools/build_pack.py   (after theme_builder.py has built the themes)
"""
import json
import re
import subprocess
import tempfile
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

import numpy as np
import trimesh

ROOT = Path(__file__).resolve().parent.parent
REPO = ROOT.parent
OUT = ROOT / "docs" / "pack"
SCAD_TO_GLTF = np.array([[1, 0, 0, 0], [0, 0, 1, 0], [0, -1, 0, 0], [0, 0, 0, 1]], float)
CACHE = ROOT / ".cache" / "assembly"
# every part in its own assembly frame (unit parts in the unit frame, attachments in their own)
PARTS = ["bezel", "diffuser_ring", "led_rail", "shell", "shell_closed", "wall_cleat", "v_display", "v_pi", "v_camera",
         "v_leds", "v_power", "v_pads", "printer_front", "printer_shell", "v_printer", "v_pol9", "roof", "joint_spacer"]
BANDED = {"shell", "shell_closed", "printer_shell"}      # translucent glow stripe between y = 22 and 32
BAND_Y = (22.0, 32.0)

# fastener geometry: (shank Ø, length, head Ø, head height)  — screws; inserts/dowels: (Ø, length)
SCREWS = {"m3x8": (3, 8, 5.7, 1.65), "m3x12": (3, 12, 5.7, 1.65), "m3x16": (3, 16, 5.7, 1.65), "m2x6": (2, 6, 3.8, 1.2),
          "m25x6": (2.5, 6, 4.5, 1.4), "m4x10": (4, 10, 7.6, 2.2), "wood45x50": (4.5, 50, 9.0, 2.6)}
PLUGS = {"ins_m3": (4.5, 5.9), "ins_m4": (6.0, 8.0), "ins_q": (8.6, 12.0), "dowel6x20": (6.0, 20.0)}


def hardware():
    with tempfile.TemporaryDirectory() as tmp:
        r = subprocess.run(["openscad", "-D", 'PART="hardware"', "-o", str(Path(tmp) / "hw.csg"), str(ROOT / "cad" / "halo.scad")],
                           capture_output=True, text=True, check=True)
    out = {}
    for name in ("HW_LIST", "HOLE_LIST", "VARS"):
        m = re.search(rf"ECHO: {name} = (.*)", r.stderr)
        out[name] = json.loads(m.group(1))
    return out


def along(mesh, pos, d):
    """mesh is built along +z from z = 0; move its z axis onto direction d at pos."""
    d = np.array(d, float) / np.linalg.norm(d)
    T = trimesh.geometry.align_vectors([0, 0, 1], d)
    T[:3, 3] = pos
    mesh.apply_transform(T)
    return mesh


def fastener(kind, pos, d):
    if kind in SCREWS:
        sd, L, hd, hh = SCREWS[kind]
        shank = trimesh.creation.cylinder(radius=sd / 2, height=L, sections=20)
        shank.apply_translation([0, 0, L / 2])
        if kind.startswith("wood"):
            head = trimesh.creation.cone(radius=hd / 2, height=hh * 1.6, sections=24)
            head.apply_transform(trimesh.transformations.rotation_matrix(np.pi, [1, 0, 0]))
            head.apply_translation([0, 0, hh * 1.6 - 0.01])
            head.apply_translation([0, 0, -hh * 1.6])
        else:
            head = trimesh.creation.cylinder(radius=hd / 2, height=hh, sections=28)
            head.apply_translation([0, 0, -hh / 2])
        m = trimesh.util.concatenate([shank, head])
    else:
        dia, L = PLUGS[kind]
        m = trimesh.creation.cylinder(radius=dia / 2, height=L, sections=24)
        m.apply_translation([0, 0, L / 2])
    return along(m, pos, d)


def export_one(name):
    CACHE.mkdir(parents=True, exist_ok=True)
    stl = CACHE / f"{name}.stl"
    src = ROOT / "cad" / "halo.scad"
    if not stl.exists() or stl.stat().st_mtime < max(src.stat().st_mtime, (ROOT / "cad" / "components.scad").stat().st_mtime):
        subprocess.run(["openscad", "-D", f'PART="{name}"', "-o", str(stl), str(src)], check=True, capture_output=True)
    return name, trimesh.load(stl)


def export_parts():
    with ThreadPoolExecutor(4) as ex:
        meshes = dict(ex.map(export_one, PARTS))
    out = {}
    for name, m in meshes.items():
        if name in BANDED:
            lo, hi = m.bounds
            slab = trimesh.creation.box(bounds=[[lo[0] - 1, BAND_Y[0], lo[2] - 1], [hi[0] + 1, BAND_Y[1], hi[2] + 1]])
            out[name] = trimesh.boolean.difference([m, slab], engine="manifold")
            out[name + "_band"] = trimesh.boolean.intersection([m, slab], engine="manifold")
        else:
            out[name] = m
    return out


def main():
    hw = hardware()
    (OUT / "hardware.json").write_text(json.dumps(hw, ensure_ascii=False))
    out = trimesh.Scene()
    for name, g in export_parts().items():
        g.apply_transform(SCAD_TO_GLTF)
        g.visual = trimesh.visual.ColorVisuals(g)
        out.add_geometry(g, node_name=name, geom_name=name)
    for theme in sorted((REPO / "themes").iterdir()):
        glb = theme / "build" / "theme_parts.glb"
        if not glb.exists():
            continue
        sc = trimesh.load(glb)
        for node in sc.graph.nodes_geometry:
            if node.startswith("sign_front"):
                continue
            tf, gname = sc.graph[node]
            g = sc.geometry[gname].copy()
            g.apply_transform(tf)
            g.apply_transform(SCAD_TO_GLTF)
            g.visual = trimesh.visual.ColorVisuals(g)
            name = f"{theme.name}--{node}"
            out.add_geometry(g, node_name=name, geom_name=name)
    for i, (group, part, kind, pos, d, when) in enumerate(hw["HW_LIST"]):
        g = fastener(kind, pos, d)
        g.apply_transform(SCAD_TO_GLTF)
        g.visual = trimesh.visual.ColorVisuals(g)
        name = f"hw--{group}--{when}--{kind}--{part}--{i}"
        out.add_geometry(g, node_name=name, geom_name=name)
    path = OUT / "pack.json"
    path.write_bytes(trimesh.exchange.gltf.export_gltf(out, embed_buffers=True)["model.gltf"])
    print(f"{len(out.graph.nodes_geometry)} parts ({len(hw['HW_LIST'])} fasteners) -> {path.relative_to(REPO)} ({path.stat().st_size / 1e6:.1f} MB)")


if __name__ == "__main__":
    main()
