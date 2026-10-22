#!/usr/bin/env python3
"""The gen 2 main unit for the website's 3D viewer and the theme sketches, taken straight from the CAD.

Reads the newest hardware/stl/gen2/halo-gen2-v*/halo-gen2-v*_3d.glb (the assembly the print files come from) and
writes web/public/models/unit_gen2.glb with only what shows from outside: front, light ring, shell, glass, camera
and the Selfi logo in the front. Node names match unit.glb (bezel, diffuser_ring, shell_closed, v_display,
v_camera) so HaloBox can use either; the logo is logo_white / logo_green. There is no side light band and no
joint spacer on gen 2.

The stand bracket for the floor tripod (web/public/models/stand_gen2.glb) comes from its own release:
hardware/tools/make_stativbeslag.py.

front_layers() gives the same parts as flat front-view outlines (unit coordinates: x centred, z up from the
bottom of the unit), so a theme sketch draws the real unit instead of a stand-in.

Usage: python3 hardware/tools/gen2_unit.py
"""
import re
from functools import lru_cache
from pathlib import Path

import shapely
import trimesh
from shapely.ops import unary_union

ROOT = Path(__file__).resolve().parents[2]
# Assembly part -> site node. The assembly has x right, y up (centred) and the front face at z = 0, facing +z.
NODES = {"front": "bezel", "lysring": "diffuser_ring", "skal": "shell_closed", "skaerm": "v_display", "kamera": "v_camera",
         "logo_hvid": "logo_white", "logo_groen": "logo_green"}
# Colours from the assembly's parts.json: black ASA front and shell, natural ASA ring, the logo inlays.
COLOURS = {"skal": "#1d1d20", "skaerm": "#0a0a0c", "kamera": "#2b2f33", "front": "#1d1d20", "lysring": "#fbf8f1",
           "logo_hvid": "#f5f5f4", "logo_groen": "#22d36b"}
DRAW_ORDER = ["skal", "skaerm", "kamera", "front", "lysring", "logo_hvid", "logo_groen"]


def latest_assembly():
    found = sorted(ROOT.glob("hardware/stl/gen2/halo-gen2-v*/halo-gen2-v*_3d.glb"),
                   key=lambda p: int(re.search(r"-v(\d+)_3d", p.name).group(1)))
    return found[-1]


def _parts(names=NODES):
    scene = trimesh.load(latest_assembly())
    out = {}
    for part in names:
        T, geom = scene.graph[part]
        m = scene.geometry[geom].copy()
        m.apply_transform(T)
        out[part] = m
    T, geom = scene.graph["skal"]
    shell = scene.geometry[geom].copy()
    shell.apply_transform(T)
    h = shell.bounds[1][1] - shell.bounds[0][1]
    lift = trimesh.transformations.translation_matrix([0, -shell.bounds[0][1], 0])   # bottom of the unit at y = 0
    for m in out.values():
        m.apply_transform(lift)
    return out, h, -shell.bounds[0][1]


@lru_cache(maxsize=1)
def front_layers():
    """[(colour, outline)] back to front, as seen from the front, in unit coordinates (mm)."""
    parts, _, _ = _parts()
    layers = []
    for part in DRAW_ORDER:
        m = parts[part]
        tri = m.vertices[m.faces[m.face_normals[:, 2] > 0.05]][:, :, :2]
        polys = shapely.polygons(tri)
        g = unary_union(polys[shapely.area(polys) > 1e-6]).buffer(0.05).buffer(-0.05)
        layers.append((COLOURS[part], g))
    return layers


def main():
    parts, h, _ = _parts()
    scene = trimesh.Scene()
    for part, node in NODES.items():
        m = parts[part]
        if len(m.faces) > 6000:
            m = m.simplify_quadric_decimation(face_count=6000)
        m.visual = trimesh.visual.ColorVisuals(m)
        scene.add_geometry(m, node_name=node, geom_name=node)
    out = ROOT / "web/public/models/unit_gen2.glb"
    scene.export(out)
    print(latest_assembly().name, f"-> {out} ({out.stat().st_size // 1024} kB, unit {h:.1f} mm high)")


if __name__ == "__main__":
    main()
