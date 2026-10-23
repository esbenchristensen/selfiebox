"""Sections through the gen 2 print files as assembled (v20 sealing): checks fit and wall thickness by eye.

Usage:  python3 hardware/render/drawing/draw_v20_snit.py <stl dir with the assembled views> <out.png>
Needs:  trimesh, shapely, matplotlib
"""
import sys
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import trimesh
from matplotlib.patches import PathPatch
from matplotlib.path import Path as MPath

STL, OUT = Path(sys.argv[1]), sys.argv[2]
PARTS = [("x_shell3", "#2b2b30", "skal"), ("x_front3", "#3a3a42", "front"), ("x_ring3", "#efe6cf", "lysring"),
         ("x_frame3", "#d9d4c8", "bagramme"), ("x_seal", "#dc2626", "snor"), ("x_dsp_glass", "#7fb3c8", "skærmglas"),
         ("x_dsp_back", "#9aa0a8", "skærm"), ("x_camglass", "#9fd6ee", "kameraglas"), ("x_camsleeve", "#57534e", "kamerarør"),
         ("x_camera", "#2e7d4f", "kamera"), ("x_strip_w", "#f5b301", "hvid strip"), ("x_strip_rgb", "#a855f7", "RGB-strip"),
         ("c_speaker", "#f97316", "højttaler"), ("x_cleat", "#6b7280", "vægbeslag"), ("s_lock", "#c3c7cf", "låseskrue"),
         ("s_front3", "#c3c7cf", "frontskrue"), ("c_mics", "#14b8a6", "mikrofonkort"), ("x_logo_w", "#ffffff", "logo")]
meshes = {v: trimesh.load(STL / f"{v}.stl") for v, *_ in PARTS if (STL / f"{v}.stl").exists()}
J2 = np.array([-97.5815, 0, 14.6685]); LENS_Z = 290.2
d = np.array([-1, 0, -1]) / np.sqrt(2)
# title, plane origin, u axis, v axis, (u range), (v range)
VIEWS = [
    ("1+3  Venstre side, z 150: front, lysring, snor, bagramme, skal", [0, 0, 150], [0, 1, 0], [-1, 0, 0], (-1.5, 36), (80, 113.5)),
    ("Hjørne gennem frontskruen (diagonal)", J2, [0, 1, 0], d, (-1.5, 36), (-12, 10)),
    ("4  Kamera, x 0", [0, 0, 0], [0, 1, 0], [0, 0, 1], (-1.5, 14), (LENS_Z - 12, LENS_Z + 12)),
    ("1+2  Bund, x 0: front mod skal, skærm, mikrofon", [0, 0, 0], [0, 1, 0], [0, 0, 1], (-1.5, 36), (-1, 40)),
    ("5  Højttaler, x -72,5", [-72.5, 0, 0], [0, 1, 0], [0, 0, 1], (48, 71), (122, 165)),
    ("6  Låselomme, x -82", [-82, 0, 0], [0, 1, 0], [0, 0, 1], (44, 86), (-2, 48)),
]


def polys(mesh, o, u, v):
    n = np.cross(u, v)
    sec = mesh.section(plane_origin=o, plane_normal=n)
    if sec is None:
        return []
    T = np.eye(4); T[:3, 0], T[:3, 1], T[:3, 2] = u, v, n; T[:3, 3] = o
    p2, _ = sec.to_2D(to_2D=np.linalg.inv(T))
    return p2.polygons_full


fig, axs = plt.subplots(2, 3, figsize=(24, 17))
for ax, (title, o, u, v, ur, vr) in zip(axs.flat, VIEWS):
    o, u, v = (np.array(a, float) for a in (o, u, v))
    used = set()
    for view, col, lab in PARTS:
        if view not in meshes:
            continue
        for pg in polys(meshes[view], o, u, v):
            if not pg.intersects(__import__("shapely").geometry.box(ur[0], vr[0], ur[1], vr[1])):
                continue
            verts, codes = [], []
            for ring in [pg.exterior, *pg.interiors]:
                c = np.asarray(ring.coords); verts += c.tolist(); codes += [MPath.MOVETO] + [MPath.LINETO] * (len(c) - 2) + [MPath.CLOSEPOLY]
            ax.add_patch(PathPatch(MPath(verts, codes), fc=col, ec="#000", lw=0.4, label=None if lab in used else lab))
            used.add(lab)
    ax.set_xlim(*ur); ax.set_ylim(*vr); ax.set_aspect("equal"); ax.set_title(title, fontsize=13)
    ax.grid(True, lw=0.3, alpha=0.5); ax.set_xlabel("y (dybde, mm)")
    ax.legend(fontsize=8, loc="lower right")
fig.suptitle("Selfi Halo gen 2 v20: snit gennem printfilerne samlet (tætning)", fontsize=17)
fig.tight_layout()
fig.savefig(OUT, dpi=110)
print("wrote", OUT)
