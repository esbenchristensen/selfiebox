#!/usr/bin/env python3
"""The gen 2 main unit for the website's 3D viewer: web/public/models/unit_gen2.glb.

Taken from the released print set's assembly (hardware/stl/gen2/<version>/<version>_3d.glb), so the site shows the
real front: the light ring broken round the camera, the screen window, the Selfi logo under it and the 70 mm shell.
Node names match unit.glb (bezel, shell_closed, diffuser_ring, v_display, v_camera), plus logo_white and logo_green
for the logo inlays. Writes an uncompressed file; web/scripts/build-models.mjs --unit-gen2 squeezes it with meshopt.

Usage: python3 hardware/tools/gen2_unit.py [version]          (default: the newest released set)
       cd web && node scripts/build-models.mjs .. --unit-gen2
"""
import sys
from pathlib import Path

import numpy as np
import trimesh

import theme_builder as tb

ROOT = Path(__file__).resolve().parents[2]
SETS = ROOT / "hardware/stl/gen2"
H = 306.0

# assembly node -> viewer node
NODES = {"front": "bezel", "skal": "shell_closed", "lysring": "diffuser_ring", "skaerm": "v_display", "kamera": "v_camera",
         "logo_hvid": "logo_white", "logo_groen": "logo_green"}


def newest():
    return max((p.name for p in SETS.glob("halo-gen2-v*") if (p / f"{p.name}_3d.glb").exists()), key=lambda n: int(n.rsplit("v", 1)[1]))


def main(version=None):
    version = version or newest()
    asm = trimesh.load(SETS / version / f"{version}_3d.glb")
    scene = trimesh.Scene()
    # The assembly is centred with the front at z = 0 facing +z; the viewer wants the unit's bottom at y = 0.
    lift = trimesh.transformations.translation_matrix([0, H / 2, 0])
    for node in asm.graph.nodes_geometry:
        if node not in NODES:
            continue
        T, g = asm.graph[node]
        m = asm.geometry[g].copy()
        m.apply_transform(lift @ T)
        m.visual = trimesh.visual.ColorVisuals(m)
        scene.add_geometry(m, node_name=NODES[node], geom_name=NODES[node])
    # Sits on the unit's top face (y = 0 here); HaloBox lifts it to the top of the unit.
    sp = tb.cube(-80, 80, 3, 62, 0, 6)
    sp.apply_transform(np.array([[1, 0, 0, 0], [0, 0, 1, 0], [0, -1, 0, 0], [0, 0, 0, 1]], float))
    scene.add_geometry(sp, node_name="joint_spacer", geom_name="joint_spacer")
    out = ROOT / "web/public/models/unit_gen2.glb"
    scene.export(out)
    print(out, version, f"{out.stat().st_size // 1024} kB")


if __name__ == "__main__":
    main(*sys.argv[1:])
