"""selfi-printer-v5: the shock deck and the grips, cut from the assembled meshes (v5 moved the printer's end stops
from the deck to the base, so the deck prints flat with its cones up; no seal groove under the hood's wall).

Writes <out>/selfi-printer-v5_plan-daempeplade.png, _snit-daempning.png and _skitse_gribehak.png.

Usage:  python3 hardware/render/drawing/draw_printer_v5_daempning.py <mesh dir> <out dir>
        (kappe, sokkel, udgang, daempeplade, c_printer, c_pi .stl rendered without PRINT, i.e. in the assembly frame)
"""
import sys
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import trimesh
from matplotlib.patches import Polygon

SRC, OUT = Path(sys.argv[1]), Path(sys.argv[2])
STYLE = {"sokkel": "#9ca3af", "daempeplade": "#e07b20", "c_printer": "#dbd3c7", "kappe": "#2b2b2f",
         "udgang": "#4b6a8a", "c_pi": "#22a050"}
M = {n: trimesh.load(SRC / f"{n}.stl") for n in STYLE if (SRC / f"{n}.stl").exists()}
BASE, FLOOR, DECK_T, D, L = 12.0, 2.0, 1.6, 222.5, 476.0
STOP_Y, STOP_W = [32.25, 170.25], 20
PRE = "selfi-printer-v5_"


def cut(ax, names, origin, normal, to2d, override=None):
    for n in names:
        if n not in M:
            continue
        sec = M[n].section(plane_origin=origin, plane_normal=normal)
        if sec is None:
            continue
        col = (override or {}).get(n, STYLE[n])
        for loop in sec.discrete:
            ax.add_patch(Polygon([to2d(p) for p in loop], closed=True, fc=col, ec="#222", lw=0.7))


def finish(ax, title, xl, yl, xlabel, ylabel="z (mm)"):
    ax.set_xlim(*xl); ax.set_ylim(*yl); ax.set_aspect("equal")
    ax.set_title(title, fontsize=10); ax.set_xlabel(xlabel); ax.set_ylabel(ylabel)


# 1  plan of the deck from below: the cones' feet, the vents, and the notches round the base's stops
fig, ax = plt.subplots(figsize=(10, 8.6))
deck = M["daempeplade"]
for z, fc in ((BASE - DECK_T / 2, "none"), (FLOOR + 0.3, "#e07b20")):
    sec = deck.section(plane_origin=[0, 0, z], plane_normal=[0, 0, 1])
    for loop in sec.discrete:
        ax.add_patch(Polygon(loop[:, :2], closed=True, fc=fc, ec="#222", lw=0.6))
for y in STOP_Y:                                  # the base's stop fins (x as in deck_stops())
    for x0, x1 in ((41.6, 42.9), (283.5, 284.6)):
        ax.add_patch(Polygon([(x0, y), (x1, y), (x1, y + STOP_W), (x0, y + STOP_W)], closed=True, fc="#4b5563", ec="#222", lw=0.6))
    ax.annotate("stop på soklen", (284, y + STOP_W / 2), (240, y + STOP_W / 2 + 12), fontsize=8,
                arrowprops=dict(arrowstyle="->", lw=0.7))
    ax.annotate("stop på soklen", (42.2, y + STOP_W / 2), (60, y + STOP_W / 2 + 12), fontsize=8,
                arrowprops=dict(arrowstyle="->", lw=0.7))
finish(ax, "Dæmpepladen set nedefra: kegler ved kanten, luftslidser i midten, hak om soklens 4 stop",
       (35, 292), (0, 222), "x (mm)", "y (mm)")
fig.tight_layout(); fig.savefig(OUT / f"{PRE}plan-daempeplade.png", dpi=100); plt.close(fig)

# 2  sections through the shock deck
fig = plt.figure(figsize=(16.5, 13))
gs = fig.add_gridspec(3, 2, height_ratios=[1, 2.4, 1.3])
names = ["sokkel", "daempeplade", "c_printer", "kappe", "udgang"]
for i, (x, t) in enumerate(((53.9, "A: snit på tværs ved x 53,9 (gennem ydre ring)"),
                            (151, "B: snit på tværs ved x 151 (midt: kun yderste kegler bærer)"))):
    ax = fig.add_subplot(gs[0, i])
    cut(ax, names, [x, 0, 0], [1, 0, 0], lambda p: (p[1], p[2]))
    finish(ax, t, (-2, D + 2), (-2, 40), "y (mm)")
ax = fig.add_subplot(gs[1, :])
cut(ax, names, [0, 19, 0], [0, 1, 0], lambda p: (p[0], p[2]))
finish(ax, "C: snit på langs ved y 19 (kegler under printeren, på kappens endevæg og udgangsmodulets bøjler)",
       (-2, L + 2), (-2, 222), "x (mm)")
yc = STOP_Y[0] + STOP_W / 2
for i, (xl, side) in enumerate((((30, 62), "venstre"), ((262, 294), "højre"))):
    ax = fig.add_subplot(gs[2, i])
    cut(ax, ["sokkel", "daempeplade", "c_printer"], [0, yc, 0], [0, 1, 0], lambda p: (p[0], p[2]))
    finish(ax, f"D: snit på langs ved y {yc:.2f} gennem stoppet, {side} ende (v5: stoppet sidder på soklen)", xl, (-1, 24), "x (mm)")
fig.text(0.5, 0.015, "Grå: sokkel · orange: dæmpeplade med knusekegler · lys: printeren (QW410) · sort: kappe · blå: udgangsmodul. "
         "Stoppene står 0,3 mm fra printeren, går fra soklens gulv til 3 mm over pladen og gennem hak i den.",
         ha="center", fontsize=10)
fig.tight_layout(rect=(0, 0.03, 1, 1)); fig.savefig(OUT / f"{PRE}snit-daempning.png", dpi=100); plt.close(fig)


# 3  the grips: both end faces and a section through each
def finger(ax, pts):
    ax.add_patch(Polygon(pts, closed=True, fc="#f2d0ae", ec="#b07a4a", lw=0.8, alpha=0.9))


fig, axs = plt.subplots(2, 2, figsize=(15, 11))
for ax, part, x, t in ((axs[0, 0], "kappe", 1.0, "Venstre ende (kappen): gribehak midt på, z 16–38"),
                       (axs[0, 1], "udgang", L - 1.0, "Højre ende (udgangsmodulet): z 8–30, 10 mm længere bagud")):
    for n in (part, "sokkel"):
        sec = M[n].section(plane_origin=[x, 0, 0], plane_normal=[1, 0, 0])
        if sec is None:
            continue
        for loop in sec.discrete:
            ax.add_patch(Polygon(loop[:, 1:3], closed=True, fc="none", ec="#222", lw=0.8))
    ax.axhline(0, color="#bbb", lw=0.6)
    finish(ax, t, (-10, D + 10), (-5, 225), "mm", "")
axs[0, 0].annotate("nøglelås", (60, 70), (20, 120), fontsize=8, arrowprops=dict(arrowstyle="->", lw=0.7))
for ax, yz in ((axs[0, 0], (111, 27)), (axs[0, 1], (121, 19))):
    ax.annotate("76 × 22, R6, 20 dybt\nloftet 20° op indad, lukket bagved", yz, (150, 95), fontsize=8,
                arrowprops=dict(arrowstyle="->", color="#22c55e", lw=0.9))
ax = axs[1, 0]
cut(ax, ["kappe", "sokkel", "c_printer", "c_pi"], [0, 111.25, 0], [0, 1, 0], lambda p: (p[0], p[2]))
finger(ax, [(-5, 26), (-5, 37.5), (8, 38), (15, 42), (19, 37), (16, 30), (8, 26)])
ax.text(-3, 71, "Fingerspidserne hager sig op bag kanten", fontsize=8)
finish(ax, "Snit A-A: venstre greb set fra siden", (-5, 70), (-3, 75), "x (mm)")
ax = axs[1, 1]
cut(ax, ["udgang", "sokkel"], [0, 121.25, 0], [0, 1, 0], lambda p: (p[0], p[2]))
finger(ax, [(481, 18), (481, 29.5), (468, 30), (461, 34), (457, 29), (460, 22), (468, 18)])
ax.text(402, 71, "Fingerspidserne hager sig op bag kanten", fontsize=8)
finish(ax, "Snit B-B: højre greb set fra siden", (400, 481), (-3, 75), "x (mm)")
fig.text(0.5, 0.01, "Skitse fra v5-CAD: sort ASA · grå: sokkel · blå: udgangsmodul · lys: printeren · grøn: Pi Zero. "
         "Kappens væg står direkte på soklen (ingen rille eller snor). Gulvet i hakket hælder 0,7 mm udad, så vand løber ud.",
         ha="center", fontsize=10)
fig.tight_layout(rect=(0, 0.03, 1, 1)); fig.savefig(OUT / f"{PRE}skitse_gribehak.png", dpi=100); plt.close(fig)
print("wrote", OUT)
