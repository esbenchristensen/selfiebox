#!/usr/bin/env python3
"""The gen 2 main unit for the website's 3D viewer and the theme sketches, taken straight from the CAD.

Reads the newest hardware/stl/gen2/halo-gen2-v*/halo-gen2-v*_3d.glb (the assembly the print files come from) and
writes web/public/models/unit_gen2.glb with only what shows from outside: front, light ring, shell, glass, camera
and the Selfi logo in the front. Node names match unit.glb (bezel, diffuser_ring, shell_closed, v_display,
v_camera) so HaloBox can use either; the logo is logo_white / logo_green. There is no side light band and no
joint spacer on gen 2.

It also writes web/public/models/stand_gen2.glb: the stand bracket the rental box hangs on when it goes out on the
floor tripod (B2C). That is the wall cleat from the same assembly plus a foot 70 x 12 x 52 behind it with a rib and
a pressed-in 1/4"-20 nut, as in the packing plan (emballage v2). Same unit coordinates as unit_gen2.glb; the nut's
underside, where the tripod's quick-release plate screws in, is at STAND_SOCKET.

front_layers() gives the same parts as flat front-view outlines (unit coordinates: x centred, z up from the
bottom of the unit), so a theme sketch draws the real unit instead of a stand-in.

Usage: python3 hardware/tools/gen2_unit.py
"""
import re
from functools import lru_cache
from pathlib import Path

import numpy as np
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
# Stand bracket foot and nut, in assembly coordinates (y centred): the tripod screw goes up into the nut from below.
FOOT = {"centre": (-16.5, -137.0, -108.0), "size": (70.0, 12.0, 52.0)}
NUT = {"centre": (-16.5, -140.6, -110.0), "r": 6.4, "h": 5.5}
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


def stand_bracket():
    """The stand bracket as one mesh, plus the nut, lifted like the unit (bottom of the unit at y = 0)."""
    parts, _, lift = _parts(["vaegbeslag"])
    tr = trimesh.transformations.translation_matrix
    foot = trimesh.creation.box(extents=FOOT["size"], transform=tr(FOOT["centre"]))
    # Rib between the cleat's back and the top of the foot: 8 thick, 46 back along the foot, 60 up the cleat.
    x0, y0, z0 = FOOT["centre"][0] - 4, FOOT["centre"][1] + 6, -84.0
    tri = [(0, 0), (46, 0), (0, 60)]   # (back, up)
    rib = trimesh.Trimesh([(x0 + dx, y0 + up, z0 - back) for dx in (0, 8) for back, up in tri],
                          [(0, 2, 1), (3, 4, 5), (0, 1, 4), (0, 4, 3), (1, 2, 5), (1, 5, 4), (2, 0, 3), (2, 3, 5)])
    bracket = trimesh.util.concatenate([parts["vaegbeslag"], foot.apply_translation([0, lift, 0]), rib.apply_translation([0, lift, 0])])
    nut = trimesh.creation.cylinder(radius=NUT["r"], height=NUT["h"], sections=6)
    nut.apply_transform(trimesh.transformations.rotation_matrix(np.pi / 2, [1, 0, 0]))
    nut.apply_translation(np.add(NUT["centre"], [0, lift, 0]))
    return {"bracket": bracket, "nut": nut}


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

    stand = trimesh.Scene()
    for node, m in stand_bracket().items():
        m.visual = trimesh.visual.ColorVisuals(m)
        stand.add_geometry(m, node_name=node, geom_name=node)
    out = ROOT / "web/public/models/stand_gen2.glb"
    stand.export(out)
    b = stand.bounds
    print(f"stand bracket -> {out} ({out.stat().st_size // 1024} kB, x {b[0][0]:.1f}..{b[1][0]:.1f}, y {b[0][1]:.1f}..{b[1][1]:.1f}, z {b[0][2]:.1f}..{b[1][2]:.1f})")


if __name__ == "__main__":
    main()
