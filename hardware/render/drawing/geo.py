"""Outlines and sections for the gen 2 line drawing.  Usage: python3 geo.py <stl dir> geo.json"""
import sys, json, ast
import numpy as np, trimesh, manifold3d as mf
G = sys.argv[1]
def load(v):
    m = trimesh.load(f"{G}/{v}.stl"); m.merge_vertices()
    return mf.Manifold(mf.Mesh(vert_properties=np.asarray(m.vertices, np.float32), tri_verts=np.asarray(m.faces, np.uint32)))
def polys(cs): return [np.asarray(p).round(2).tolist() for p in cs.to_polygons()]
src = open(__import__('pathlib').Path(__file__).parents[1] / 'gen2_viewer.py').read()
tree = ast.parse(src); vals = {}
for n in tree.body:
    if isinstance(n, ast.Assign) and getattr(n.targets[0], "id", "") in ("PARTS", "CABLES"): vals[n.targets[0].id] = ast.literal_eval(n.value)
out = {"parts": {}, "cables": vals["CABLES"]}
XZ = [[1,0,0,0],[0,0,1,0],[0,-1,0,0]]     # (x,y,z) -> (x,z,-y): project to front plane
YZX = [[0,1,0,0],[0,0,1,0],[1,0,0,0]]     # (x,y,z) -> (y,z,x): slice at x
for node, view, label, col, group, ex in vals["PARTS"]:
    m = load(view)
    d = {"label": label, "color": col, "group": group}
    d["front"] = polys(m.transform(XZ).project())
    d["secA"] = polys(m.slice(150.0))                       # horizontal cut z = 150 -> (x, y)
    d["secB"] = polys(m.transform(YZX).slice(-89.0862))     # vertical cut through left screws -> (y, z)
    out["parts"][node] = d
    print(node, len(d["front"]), len(d["secA"]), len(d["secB"]))
json.dump(out, open(sys.argv[2], "w"))
