"""Cable routing in gen 2 (v24), seen from behind into the open shell: modules, loops, strain clip and the main bundle.

Usage:  python3 hardware/render/drawing/draw_v24_kabler.py <dir with the assembled views> <out.png> <version>
Positions are read from cad/gen2_concept.scad (CABLE_LOOPS, STRAIN, FRAME_LOOP, PWR_P) and the modules' STL bounds.
"""
import re
import subprocess
import sys
import tempfile
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.patches as mp
import trimesh

STL, OUT, VER = Path(sys.argv[1]), sys.argv[2], sys.argv[3]
SCAD = re.sub(r"//[^\n]*", "", (Path(__file__).resolve().parents[2] / "cad" / "gen2_concept.scad").read_text())
loops = [(float(x), float(z), d) for x, z, d in re.findall(r'\[(-?[\d.]+), (-?[\d.]+), "([hv])"\]', SCAD.split("CABLE_LOOPS =")[1].split(";")[0])]
# FRAME_LOOP is an expression since v24 (the lower cross bar): ask openscad for its value
_cad = Path(__file__).resolve().parents[2] / "cad" / "gen2_concept.scad"
_out = Path(tempfile.mkdtemp()) / "fl.echo"
subprocess.run(["openscad", "-o", str(_out), "-D", 'VIEW="none"', "-D", "echo(FL = FRAME_LOOP);", str(_cad)], capture_output=True, check=True)
fl = [float(v) for v in re.search(r"FL = \[([^\]]+)\]", _out.read_text()).group(1).split(",")]
st = [float(v) for v in re.search(r"STRAIN = \[([^\]]+)\]", SCAD).group(1).split(",")]
MODS = [("c_psu5", "5 V-forsyning"), ("c_wled", "WLED"), ("c_mosfet", "dæmper"), ("c_speaker", "højttaler"), ("c_mcore", "mikrofon-kerne"),
        ("c_4g", "4G"), ("c_imu", "stødsensor"), ("c_reed", "reed"), ("c_jack", "strømstik"), ("s_lock", "lås")]

fig, ax = plt.subplots(figsize=(9, 12))
W, H = 224.5, 307
ax.add_patch(mp.FancyBboxPatch((-W/2, 0), W, H, boxstyle="round,pad=0,rounding_size=20", fc="#2b2b30", ec="#111"))
for v, name in MODS:
    p = STL / f"{v}.stl"
    if not p.exists():
        continue
    b = trimesh.load(p).bounds
    x0, x1, z0, z1 = -b[1][0], -b[0][0], max(b[0][2], 0), b[1][2]      # seen from behind: x mirrored
    ax.add_patch(mp.Rectangle((x0, z0), x1 - x0, z1 - z0, fc="#4b5563", ec="#9ca3af", lw=0.8))
    ax.text((x0 + x1)/2, (z0 + z1)/2, name, color="w", ha="center", va="center", fontsize=8)
# Pi on the frame (front half), dashed
b = trimesh.load(STL / "c_pi_board.stl").bounds
ax.add_patch(mp.Rectangle((-b[1][0], b[0][2]), b[1][0] - b[0][0], b[1][2] - b[0][2], fill=False, ec="#22c55e", ls="--", lw=1))
ax.text(-(b[0][0] + b[1][0])/2, b[0][2] + 4, "Pi (på fronten)", color="#22c55e", ha="center", fontsize=8)
# main bundle and branches (drawn from the loop positions)
G = "#f59e0b"
route = [(0, st[4]), (0, 112), (0, 136)]
ax.plot([-x for x, _ in route], [z for _, z in route], color=G, lw=5, solid_capstyle="round", zorder=3)
ax.plot([0, 0], [st[4] - 6, st[4]], color=G, lw=3, zorder=3)
for a, b2 in [((0, 112), (-75, 112)), ((-75, 112), (-80, 72)), ((-75, 112), (-98, 150)), ((-98, 150), (-98, 205)),
              ((0, 112), (88, 100)), ((0, 136), (55, 158)), ((55, 158), (55, 214)), ((55, 214), (6, 214))]:
    ax.plot([-a[0], -b2[0]], [a[1], b2[1]], color=G, lw=2.5, zorder=3)
# v24: the service loop runs down to the frame's lower cross bar (below the Pi), so its slack hangs away from the fan
ax.plot([0, -fl[0]], [136, fl[1]], color=G, lw=2.5, ls=(0, (4, 3)), zorder=3)
ax.annotate("serviceløkke ca. 10 cm ned til bagrammens\nnederste tværbjælke (2 slidser, x %d, z %d):\nslæk hænger nedad, væk fra blæseren" % (fl[0], fl[1]),
            xy=(-fl[0], fl[1]), xytext=(-105, 30), color="w", fontsize=8, arrowprops=dict(arrowstyle="->", color=G))
# v24: fan guard on the Pi (separate print), drawn over the Active Cooler
b = trimesh.load(STL / "x_fanguard.stl").bounds
ax.add_patch(mp.Rectangle((-b[1][0], b[0][2]), b[1][0] - b[0][0], b[1][2] - b[0][2], fc="#22c55e", alpha=0.25, ec="#22c55e", lw=1.2, zorder=2))
ax.text(-(b[0][0] + b[1][0])/2, b[1][2] + 3, "blæserhegn på Pi'en", color="#22c55e", ha="center", fontsize=8)
for x, z, d in loops:
    w, h = (5, 14.4) if d == "h" else (14.4, 5)
    ax.add_patch(mp.Rectangle((-x - w/2, z - h/2), w, h, fc="#e5e7eb", ec="k", lw=0.8, zorder=4))
ax.add_patch(mp.Circle((0, st[4] + st[2]/2), 4.3, fc="#ef4444", ec="k", zorder=5))
ax.text(8, st[4] + 2, "trækaflastning\nover strømstikket", color="w", fontsize=8, va="center")
ax.set_xlim(-W/2 - 5, W/2 + 5); ax.set_ylim(-5, H + 5); ax.set_aspect("equal"); ax.axis("off")
ax.set_title(f"Selfi Halo gen 2 {VER}: kabelføring set bagfra ind i skallen", fontsize=13)
ax.legend(handles=[mp.Patch(fc="#e5e7eb", ec="k", label="løkke 10 × 2 (strip eller 10 mm velcro)"),
                   mp.Patch(fc="#ef4444", ec="k", label="klemme til stikkets 2 ledninger (Ø5,4)"),
                   mp.Patch(fc=G, label="kabelbundt")], loc="lower center", bbox_to_anchor=(0.5, -0.06), ncol=1, fontsize=9, frameon=False)
fig.savefig(OUT, dpi=150, bbox_inches="tight")
print("wrote", OUT)
