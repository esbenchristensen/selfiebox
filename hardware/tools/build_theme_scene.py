import json, numpy as np, trimesh
S = str(__import__('pathlib').Path(__file__).resolve().parent.parent / 'docs')
base = trimesh.load(f"{S}/halo-page/halo-g.json", file_type="gltf")
KEEP = ["bezel","diffuser_ring","shell","shell_band","v_display","v_camera","printer_front","printer_shell","printer_shell_band","v_printer",
        "sign_front","sign_letters","sign_shell","sign_shell_band","joint_spacer","wall_cleat"]
out = trimesh.Scene()
for name in KEEP:
    tf, gn = base.graph[name]; g = base.geometry[gn].copy()
    g.apply_transform(tf)
    g.visual = trimesh.visual.ColorVisuals(g)
    out.add_geometry(g, node_name="base--"+name, geom_name="base--"+name)
R = np.array([[1,0,0,0],[0,0,1,0],[0,-1,0,0],[0,0,0,1]], float)  # scad (x,y,z) -> gltf (x,z,-y)
for t in ["sommernat","neon"]:
    sc = trimesh.load(f"themes/{t}/build/theme_parts.glb")
    for n in sc.graph.nodes_geometry:
        tf, gname = sc.graph[n]
        g = sc.geometry[gname].copy(); g.apply_transform(tf); g.apply_transform(R)
        g.visual = trimesh.visual.ColorVisuals(g)
        out.add_geometry(g, node_name=f"{t}--{n}", geom_name=f"{t}--{n}")
out.export(f"{S}/themes-page/themes.json", file_type="gltf", embed_buffers=True) if False else None
data = trimesh.exchange.gltf.export_gltf(out, embed_buffers=True)
open(f"{S}/themes-page/themes.json","wb").write(data["model.gltf"])
j=json.load(open(f"{S}/themes-page/themes.json"))
print(len(j["nodes"]), [n["name"] for n in j["nodes"]][:6])
