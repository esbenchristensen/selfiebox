"""The printer for selfi.dk: the cabinet of <ver>_3d.glb without the inside, screws and the B2B wall parts.

  python3 hardware/tools/printer_web_glb.py [selfi-printer-v5]  ->  web/public/models/<ver>.glb

Same nodes and coordinates as the admin model (millimetres, y up, front at +z, centred), so the site's
StandPrinter/PrinterStage can look parts up by name and place the print in the pickup pocket.
"""
import json
import sys
from pathlib import Path

import trimesh

ROOT = Path(__file__).resolve().parents[2]
ver = sys.argv[1] if len(sys.argv) > 1 else "selfi-printer-v5"
src = ROOT / "hardware/stl/printer" / ver
keep = {p["node"] for p in json.loads((src / f"{ver}_parts.json").read_text()) if p["group"] == "Kabinet"}
scene = trimesh.load(src / f"{ver}_3d.glb")
for node in list(scene.graph.nodes_geometry):
    if node not in keep:
        scene.delete_geometry(scene.graph[node][1])
out = ROOT / "web/public/models" / f"{ver}.glb"
scene.export(out)
print(out, sorted(scene.graph.nodes_geometry), out.stat().st_size)
