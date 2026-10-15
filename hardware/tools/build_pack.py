#!/usr/bin/env python3
"""Build the combined 3D model for the A-Z documentation page.

docs/pack/pack.json = every part of the Halo unit and its attachments in assembly
coordinates (from docs/halo-page/halo-g.json, glTF y-up, front face at z = 0) plus the
themed parts of every built theme, named "<theme>--<part>__<colour>".

Usage: python3 hardware/tools/build_pack.py   (after theme_builder.py has built the themes)
"""
from pathlib import Path

import numpy as np
import trimesh

ROOT = Path(__file__).resolve().parent.parent
REPO = ROOT.parent
OUT = ROOT / "docs" / "pack" / "pack.json"
SCAD_TO_GLTF = np.array([[1, 0, 0, 0], [0, 0, 1, 0], [0, -1, 0, 0], [0, 0, 0, 1]], float)


def main():
    base = trimesh.load(ROOT / "docs" / "halo-page" / "halo-g.json", file_type="gltf")
    out = trimesh.Scene()
    for node in base.graph.nodes_geometry:
        tf, gname = base.graph[node]
        g = base.geometry[gname].copy()
        g.apply_transform(tf)
        g.visual = trimesh.visual.ColorVisuals(g)
        out.add_geometry(g, node_name=node, geom_name=node)
    for theme in sorted((REPO / "themes").iterdir()):
        glb = theme / "build" / "theme_parts.glb"
        if not glb.exists():
            continue
        sc = trimesh.load(glb)
        for node in sc.graph.nodes_geometry:
            tf, gname = sc.graph[node]
            g = sc.geometry[gname].copy()
            g.apply_transform(tf)
            g.apply_transform(SCAD_TO_GLTF)
            g.visual = trimesh.visual.ColorVisuals(g)
            name = f"{theme.name}--{node}"
            out.add_geometry(g, node_name=name, geom_name=name)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_bytes(trimesh.exchange.gltf.export_gltf(out, embed_buffers=True)["model.gltf"])
    print(f"{len(out.graph.nodes_geometry)} parts -> {OUT.relative_to(REPO)} ({OUT.stat().st_size / 1e6:.1f} MB)")


if __name__ == "__main__":
    main()
