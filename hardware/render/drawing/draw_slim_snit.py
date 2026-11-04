"""slim1: side sections of the slim box (57 mm) beside the main box (70 mm), and the new back vents behind the wall cleat.

Usage:  python3 hardware/render/drawing/draw_slim_snit.py <slim views dir> <main views dir> <out.png> <version>
Sections in the y-z plane (y = depth, front at the left; z up) at a given x, from the assembled views (x_*, c_*).
"""
import sys
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import trimesh
from matplotlib.collections import PolyCollection

SL, MAIN, OUT, VER = Path(sys.argv[1]), Path(sys.argv[2]), sys.argv[3], sys.argv[4]
INK, MUTED = "#1f2328", "#57606a"
COL = {"x_shell3": "#3b3e46", "x_front3": "#3b3e46", "x_ring3": "#e7f5ff", "x_frame3": "#d9d3c7", "x_dsp_back": "#adb5bd",
       "x_dsp_glass": "#212529", "c_pi_board": "#2e9e5b", "c_cooler": "#495057", "x_fanguard": "#343a40", "c_psu5": "#9775fa",
       "c_wled": "#40c057", "c_mosfet": "#20c997", "c_wagos": "#ff922b", "x_cleat": "#6c757d", "x_piholder": "#868e96",
       "c_4g": "#4dabf7", "c_mcore": "#74c0fc", "c_speaker": "#ffa94d", "x_stand": "#495057"}


def section(ax, d, view, x, dy=0.0):
    p = d / f"{view}.stl"
    if not p.exists():
        return
    m = trimesh.load(p)
    sec = m.section(plane_origin=[x, 0, 0], plane_normal=[1, 0, 0])
    if sec is None:
        return
    polys = [[(q[1] + dy, q[2]) for q in e] for e in sec.discrete]
    ax.add_collection(PolyCollection(polys, facecolors=COL.get(view, "#ced4da"), edgecolors="#212529", linewidths=0.4, alpha=0.95))


fig = plt.figure(figsize=(20, 11))
gs = fig.add_gridspec(2, 3, width_ratios=[1, 1, 1.3])
axs = [fig.add_subplot(gs[:, 0]), fig.add_subplot(gs[:, 1]), fig.add_subplot(gs[0, 2]), fig.add_subplot(gs[1, 2])]
views = list(COL)
for ax, d, x, title, D in ((axs[0], MAIN, -20.0, "v42: 70 mm dyb (snit ved x −20)", 70), (axs[1], SL, -45.0, f"{VER}: 57 mm dyb (snit gennem Pi'en, x −45)", 57)):
    for v in views:
        if v == "x_stand":
            continue
        section(ax, d, v, x)
    ax.annotate("", xy=(0, -8), xytext=(D, -8), arrowprops=dict(arrowstyle="<->", color=INK))
    ax.text(D / 2, -14, f"{D} mm", ha="center", va="top", fontsize=13, weight="bold", color=INK)
    ax.set_title(title, fontsize=13, color=INK)
    ax.set_xlim(-10, 95); ax.set_ylim(-25, 315); ax.set_aspect("equal"); ax.axis("off")
    ax.text(-6, 150, "front", rotation=90, ha="center", va="center", color=MUTED)
for txt, z in (("Pi på egen holder", 145), ("Wago-række", 271)):
    axs[1].text(60, z, txt, fontsize=9, color=INK)

# the back vents: a section through one vent slot (x 46) at the top of the box, on the wall cleat and on the stand bracket
for ax, v, where in ((axs[2], "x_cleat", "på væggen (vægbeslag)"), (axs[3], "x_stand", "på gulvstativet (stativbeslag)")):
    for w in ("x_shell3", v, "c_wagos", "x_frame3", "c_4g"):
        section(ax, SL, w, 46.0)
    ax.set_xlim(28, 78); ax.set_ylim(218, 262); ax.set_aspect("equal"); ax.axis("off")
    ax.set_title(f"udluftning bagpå, {where}", fontsize=11, color=INK)
axs[2].annotate("rende i bagsiden\n(falder ud mod enderne)", xy=(57, 239), xytext=(62, 226), fontsize=8, color=INK,
                arrowprops=dict(arrowstyle="->", color=INK))
fig.text(0.80, 0.0, "Slidserne stiger 45° indad fra en rende i bagsiden, der falder\nud mod enderne: regn og stænk løber ud, før de når ind.\n"
         "Udluftningen sidder bag beslagets ryg og kan ikke ses;\nkanaler i vægbeslaget og stativbeslaget holder luftvejen åben.",
         ha="center", va="top", fontsize=10, color=MUTED)
fig.suptitle(f"Selfi {VER}: slim-boksen 13 mm tyndere, samme dele, flyttet", fontsize=16, color=INK)
fig.savefig(OUT, dpi=110, bbox_inches="tight")
print("wrote", OUT)
