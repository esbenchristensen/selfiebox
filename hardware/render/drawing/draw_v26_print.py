"""v26 print review (Esben 27 Oct): what changed for the printer, drawn from the print files on the bed.

  A  fan guard: v25's file lay arm tips down with the grille 13 mm in the air; v26 lies on its side
  B  wall cleat tongue: v25 hung 9 mm over the plate's edge 4 mm up; v26's plate carries the whole tongue
  C  vent hood: v25 started 1.5 over the back wall with nothing under it; v26 has 3 posts across the gap
  D  shell: where the slicer puts support (enforcers) and where it must not (blockers), from <version>_skal_support.3mf

Usage:  python3 hardware/render/drawing/draw_v26_print.py <old version dir> <new version dir> <out.png>
"""
import sys
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt  # noqa: E402
from matplotlib.patches import Polygon, Rectangle  # noqa: E402
import numpy as np  # noqa: E402
import trimesh  # noqa: E402

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "tools"))
from make_3mf import SKAL_BLOCK, SKAL_ENFORCE  # noqa: E402

OLD, NEW, OUT = Path(sys.argv[1]), Path(sys.argv[2]), sys.argv[3]
VO, VN = OLD.name, NEW.name
INK, PART, BED, BAD, GOOD = "#18181b", "#a8a29e", "#d6d3cb", "#dc2626", "#16a34a"


def load(d, part):
    return trimesh.load(d / f"{d.name}_{part}.stl")


def section(ax, m, origin, normal, keep, fill=PART):
    s = m.section(plane_origin=origin, plane_normal=normal)
    for e in ([] if s is None else s.discrete):
        ax.add_patch(Polygon(e[:, keep], closed=True, fc=fill, ec=INK, lw=0.8, zorder=2))


def frame(ax, title, note, xlim, ylim, bed=True):
    ax.set_title(title, loc="left", fontsize=12, fontweight="bold", pad=16)
    ax.text(0, 1.012, note, transform=ax.transAxes, fontsize=8.5, color="#555", va="bottom")
    ax.set_xlim(*xlim); ax.set_ylim(*ylim); ax.set_aspect("equal")
    ax.tick_params(labelsize=7, colors="#777")
    for s in ax.spines.values():
        s.set_color(BED)
    if bed:
        ax.axhspan(ylim[0], 0, color=BED, zorder=1)
        ax.text(xlim[1], ylim[0] + 0.15 * (0 - ylim[0]), "printpladen ", ha="right", va="bottom", fontsize=7, color="#666")


def holes_white(ax, m, origin, normal, keep):
    # loops inside other loops are holes: repaint them white
    s = m.section(plane_origin=origin, plane_normal=normal)
    if s is None:
        return
    polys = [trimesh.path.polygons.Polygon(e[:, keep]) for e in s.discrete]
    for i, p in enumerate(polys):
        if any(j != i and q.contains(p) for j, q in enumerate(polys)):
            ax.add_patch(Polygon(np.array(p.exterior.coords), closed=True, fc="white", ec=INK, lw=0.8, zorder=3))


def draw(ax, m, origin, normal, keep, fill=PART):
    section(ax, m, origin, normal, keep, fill)
    holes_white(ax, m, origin, normal, keep)


fig = plt.figure(figsize=(16, 19))
fig.suptitle(f"Selfi Halo gen 2 · {VN}: rettelser efter printgennemgangen (taget direkte fra printfilerne)", x=0.05, ha="left",
             fontsize=16, fontweight="bold", y=0.985)
fig.text(0.05, 0.962, "Alle snit er delene, som de ligger på printpladen (grå bund = pladen). Rødt: det, der hang i luften i "
         f"{VO}. Mål i mm.", fontsize=10, color="#555")
gs = fig.add_gridspec(4, 2, height_ratios=[1.05, 0.8, 0.55, 1.6], hspace=0.42, wspace=0.12, left=0.05, right=0.97, top=0.93, bottom=0.03)

# A fan guard
ax = fig.add_subplot(gs[0, 0])
m = load(OLD, "blaeserhegn")
draw(ax, m, [0, 0, 0], [1, 0, 0], [1, 2])
ax.plot([-60.25, 60.25], [13.05, 13.05], color=BAD, lw=3, zorder=4)
ax.plot([-60.25, -40.2], [9.3, 9.3], color=BAD, lw=3, zorder=4)
frame(ax, f"A1  Blæserhegn {VO}: forkert vej på pladen", "Filen lå med armenes spidser nedad: risten (rød) og puden svævede 9–13 mm over pladen.",
      (-64, 64), (-4, 18))
ax = fig.add_subplot(gs[0, 1])
m = load(NEW, "blaeserhegn")
draw(ax, m, [0, 6.6, 0], [0, 1, 0], [0, 2])
frame(ax, f"A2  Blæserhegn {VN}: på siden, set forfra",
      "41 mm højt. Hele profilen står på pladen; armene bøjer i lagets plan. Slidserne går op og ned (kun 2,5 mm bro i enderne).",
      (-64, 64), (-4, 45))

# B cleat tongue
for i, (d, title, note) in enumerate([(OLD, f"B1  Vægbeslagets tunge {VO}", "Pladen stoppede 9 mm før tungens ende: 9 × 18 mm flad underside 4 mm over pladen."),
                                     (NEW, f"B2  Vægbeslagets tunge {VN}", "Pladen går 2 mm forbi tungen, så hele tungen vokser op af pladen.")]):
    ax = fig.add_subplot(gs[1, i])
    m = load(d, "vaegbeslag")
    draw(ax, m, [-82.9, 0, 0], [1, 0, 0], [1, 2])
    if d == OLD:
        ax.plot([-116.2, -107.1], [4.0, 4.0], color=BAD, lw=3, zorder=4)
    frame(ax, title, note + " Snit gennem venstre tunge (x −82).", (-140, -95), (-3, 22))

# C vent hood
for i, (d, title, note) in enumerate([(OLD, f"C1  Luftskærm i skallen {VO}", "Skærmen startede 1,5 mm over bagvæggen uden noget under sig."),
                                     (NEW, f"C2  Luftskærm i skallen {VN}", "3 små stolper over spalten: skærmens kant er nu korte broer.")]):
    ax = fig.add_subplot(gs[2, i])
    m = load(d, "skal")
    draw(ax, m, [-45, 0, 0], [1, 0, 0], [1, 2])
    if d == OLD:
        ax.plot([-142.4, -140.9], [4.5, 4.5], color=BAD, lw=3, zorder=4)
    frame(ax, title, note + " Snit x −45 (midt i venstre skærm).", (-155, -128), (-2, 12))

# D support map
ax = fig.add_subplot(gs[3, :])
m = load(NEW, "skal")
draw(ax, m, [0, 0, 1.5], [0, 0, 1], [0, 1], fill="#3f3f46")
for name, b in SKAL_ENFORCE:
    ax.add_patch(Rectangle((b[0], b[2]), b[1] - b[0], b[3] - b[2], fc=GOOD, alpha=0.45, ec=GOOD, lw=1.5, zorder=5))
    ax.text((b[0] + b[1]) / 2, b[3] + 3, name, ha="center", fontsize=9, color=GOOD, fontweight="bold", zorder=6)
for name, b in SKAL_BLOCK:
    ax.add_patch(Rectangle((b[0], b[2]), b[1] - b[0], b[3] - b[2], fc=BAD, alpha=0.35, ec=BAD, lw=1.2, zorder=5))
labels = {"strømrør": (0, -70), "låselomme venstre": (-82, -110), "låselomme højre": (84, -110)}
for name, b in SKAL_BLOCK:
    key = name.replace("ingen support: ", "")
    if key in labels:
        x, y = labels[key]
        ax.text(x, y, "ingen support:\n" + key,
                ha="center", fontsize=8.5, color=BAD, zorder=6)
ax.text(100, 60, "ingen support:\nvingelommer", ha="center", fontsize=8.5, color=BAD, zorder=6)
ax.text(-100, 60, "ingen support:\nvingelommer", ha="center", fontsize=8.5, color=BAD, zorder=6)
frame(ax, f"D  Skallen på pladen ({VN}_skal_support.3mf), set oppefra",
      "Grøn: support-enforcer (support her og kun her med Tree (manuel)). Rød: support-blocker. Snit 1,5 mm over pladen (bagvæggen).",
      (-125, 125), (-160, 160), bed=False)
fig.savefig(OUT, dpi=110)
print("wrote", OUT)
