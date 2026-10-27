#!/usr/bin/env python3
"""Release set for the stand bracket (selfi-stativbeslag-v<N>): the B2C gen 2 box on the Sirui floor tripod.

Builds from hardware/cad/gen2_concept.scad (module stand_bracket) into hardware/stl/stativbeslag/<version>/:
  <version>.stl                 the bracket, back face down on the bed (as printed)
  <version>_logo-hvid.stl       logo inlay, white  } same origin as the bracket: load together, or use the 3MF
  <version>_logo-groen.stl      logo inlay, green  }
  <version>_flerfarvet.3mf      one object, three parts on AMS slots 1 (sort) / 2 (hvid) / 3 (groen)
  <version>_3d.glb + _parts.json  the bracket on the newest gen 2 box, same layout as the box's own _3d.glb
and web/public/models/stand_gen2.glb (bracket, its logo and the T-nut for the website's hero, in unit_gen2.glb's coordinates:
bottom of the box at y = 0, front at z = 0).
The drawing is hardware/render/drawing/draw_stativbeslag.py.

Usage: python3 hardware/tools/make_stativbeslag.py selfi-stativbeslag-v4
Needs: openscad, trimesh, numpy
"""
import json
import re
import subprocess
import sys
import tempfile
from pathlib import Path

import numpy as np
import trimesh

sys.path.insert(0, str(Path(__file__).resolve().parent))
from make_3mf import write_bambu_3mf  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
SCAD = ROOT / "hardware/cad/gen2_concept.scad"

# node, view, label, colour, group, explode (glTF axes)
PARTS = [("stativbeslag", "x_stand", "Stativbeslag (sort ASA)", "#1d1d20", "Stativbeslag", [0, 0, -120]),
         ("stativlogo_hvid", "x_stand_logo_w", "Logo bagpå, hvidt (indlagt i beslaget)", "#f5f5f4", "Stativbeslag", [0, 0, -120]),
         ("stativlogo_groen", "x_stand_logo_g", "Logo bagpå, grønne prikker", "#22d36b", "Stativbeslag", [0, 0, -120]),
         ("t_moetrik", "x_tnut", "T-møtrik 1/4\"-20 (Einschlagmutter, stål), flangen opad", "#9a9ea2", "Stativbeslag", [0, -60, -120])]
PRINT = [("", "p_stand", "stativbeslag (sort)", 1), ("_logo-hvid", "p_stand_logo_w", "logo hvid", 2),
         ("_logo-groen", "p_stand_logo_g", "logo groen", 3)]


def scad(view, out):
    subprocess.run(["openscad", "-o", str(out), "-D", f'VIEW="{view}"', str(SCAD)], check=True, capture_output=True)
    return trimesh.load(out)


def latest_box():
    found = sorted(ROOT.glob("hardware/stl/gen2/halo-gen2-v*/halo-gen2-v*_3d.glb"), key=lambda p: int(re.search(r"-v(\d+)_3d", p.name).group(1)))
    return found[-1]


def main(ver):
    out = ROOT / "hardware/stl/stativbeslag" / ver
    out.mkdir(parents=True, exist_ok=True)
    tmp = Path(tempfile.mkdtemp())
    parts = []
    for suffix, view, name, slot in PRINT:
        m = scad(view, tmp / f"{view}.stl")
        m.export(out / f"{ver}{suffix}.stl")
        parts.append((name, m, slot))
    write_bambu_3mf(out / f"{ver}_flerfarvet.3mf", parts, ver)

    # the bracket on the newest box: every box node except the wall cleat, then the bracket's parts
    box = trimesh.load(latest_box())
    box_meta = json.loads(latest_box().with_name(latest_box().name.replace("_3d.glb", "_parts.json")).read_text())
    scene, meta = trimesh.Scene(), []
    for p in box_meta:
        if p["node"] == "vaegbeslag":
            continue
        T, g = box.graph[p["node"]]
        scene.add_geometry(box.geometry[g].copy(), node_name=p["node"], geom_name=p["node"], transform=T)
        meta.append(p)
    # scad -> glTF like gen2_viewer.py: the box is centred on y = 0, so its underside (scad z = 0) is at -H/2 (v20+: 307 high)
    T, g = box.graph["skal"]
    y0 = box.geometry[g].copy().apply_transform(T).bounds[0][1]
    M = np.array([[1, 0, 0, 0], [0, 0, 1, y0], [0, -1, 0, 0], [0, 0, 0, 1]], float)
    stand = {}
    for node, view, label, col, group, explode in PARTS:
        m = scad(view, tmp / f"{view}.stl")
        m.apply_transform(M)
        c = [int(col[i:i + 2], 16) / 255 for i in (1, 3, 5)] + [1.0]
        m.visual = trimesh.visual.TextureVisuals(material=trimesh.visual.material.PBRMaterial(baseColorFactor=c, metallicFactor=0.0, roughnessFactor=0.55))
        scene.add_geometry(m, node_name=node, geom_name=node)
        meta.append({"node": node, "label": label, "color": col, "group": group, "explode": explode})
        stand[node] = m
    scene.export(out / f"{ver}_3d.glb")
    (out / f"{ver}_parts.json").write_text(json.dumps(meta, ensure_ascii=False, indent=1))

    # website: bracket, logo and nut, unit coordinates (bottom of the box at y = 0)
    web = trimesh.Scene()
    lift = trimesh.transformations.translation_matrix([0, -y0, 0])
    for node, m in (("bracket", stand["stativbeslag"]), ("logo_white", stand["stativlogo_hvid"]), ("logo_green", stand["stativlogo_groen"]),
                    ("nut", stand["t_moetrik"])):
        m = m.copy()
        m.apply_transform(lift)
        m.visual = trimesh.visual.ColorVisuals(m)
        web.add_geometry(m, node_name=node, geom_name=node)
    web.export(ROOT / "web/public/models/stand_gen2.glb")
    b = stand["stativbeslag"].bounds
    print(f"{ver}: bracket {b[1][0] - b[0][0]:.1f} x {b[1][1] - b[0][1]:.1f} x {b[1][2] - b[0][2]:.1f} mm, "
          f"{stand['stativbeslag'].volume / 1000:.0f} cm3, on {latest_box().name}")


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "selfi-stativbeslag-v4")
