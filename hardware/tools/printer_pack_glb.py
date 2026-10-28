"""The printer for the packaging viewer in the admin (Hardware → Emballage): the cabinet and the printer from
<ver>_3d.glb as shipped (no screws, no wall parts in place), plus one wall console and one wall cleat on their own.

  python3 hardware/tools/printer_pack_glb.py [selfi-printer-v5] <out.glb>

Millimetres, y up, the front at +z, like the admin model; the console and the cleat in their local frames.
"""
import json
import subprocess
import sys
import tempfile
from pathlib import Path

import numpy as np
import trimesh

ROOT = Path(__file__).resolve().parents[2]
ver = sys.argv[1] if len(sys.argv) > 1 else "selfi-printer-v5"
out = Path(sys.argv[2])
src = ROOT / "hardware/stl/printer" / ver
parts = json.loads((src / f"{ver}_parts.json").read_text())
keep = {p["node"] for p in parts if p["group"] == "Kabinet" and p["node"] != "laas"} | {"printer"}
scene = trimesh.load(src / f"{ver}_3d.glb")
for node in list(scene.graph.nodes_geometry):
    if node not in keep:
        scene.delete_geometry(scene.graph[node][1])
M = np.array([[1, 0, 0, 0], [0, 0, 1, 0], [0, -1, 0, 0], [0, 0, 0, 1]], float)   # scad -> glTF
scad = ROOT / "hardware/cad" / f"{ver.replace('-', '_')}.scad"
tmp = Path(tempfile.mkdtemp())
for view in ("konsol",):   # v4: the hidden L-bracket (no wall cleat)
    subprocess.run(["openscad", "-D", f'VIEW="{view}"', "-o", str(tmp / f"{view}.stl"), str(scad)], check=True, capture_output=True)
    m = trimesh.load(tmp / f"{view}.stl")
    m.apply_transform(M)
    scene.add_geometry(m, node_name=view, geom_name=view)
scene.export(out)
print(out, sorted(scene.graph.nodes_geometry), out.stat().st_size)
