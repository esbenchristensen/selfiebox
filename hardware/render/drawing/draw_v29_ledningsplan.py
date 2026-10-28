"""Wiring plan for Halo gen 2 (v29): the box opened like a book, the shell on its back and the front unit face down to the
left of it, every cable in its lane, the two hinge bundles across the gap, and the cable list.

Usage:  python3 hardware/render/drawing/draw_v29_ledningsplan.py <dir with the assembled views> <out.png> <version>
The routes and lengths come from render/harness_gen2.py; the outlines from the STLs (x_shell3, x_frame3, c_*, x_fanguard).
"""
import sys
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.patches as mp
import trimesh

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import harness_gen2 as hz   # noqa: E402

STL, OUT, VER = Path(sys.argv[1]), sys.argv[2], sys.argv[3]
FX = lambda x: 2 * hz.X_EDGE - hz.GAP - x          # front unit, face down to the left: mirrored about the hinge
INK, MUTED, LINE = "#1f2328", "#57606a", "#8c959f"

fig, ax = plt.subplots(figsize=(22, 14.5))


def outline(mesh, y, tf, **kw):
    sec = mesh.section(plane_origin=[0, y, 0], plane_normal=[0, 1, 0])
    if sec is None:
        return
    for e in sec.discrete:
        ax.plot([tf(p[0]) for p in e], e[:, 2], **kw)


def box(view, tf, label, fc, txt=8, dy=0.0):
    p = STL / f"{view}.stl"
    if not p.exists():
        return None
    b = trimesh.load(p).bounds.copy()
    b[0][2] = max(b[0][2], 0.0)
    x0, x1 = sorted([tf(b[0][0]), tf(b[1][0])])
    ax.add_patch(mp.Rectangle((x0, b[0][2]), x1 - x0, b[1][2] - b[0][2], fc=fc, ec="#6e7781", lw=0.8, alpha=0.9, zorder=1))
    if label:
        ax.text((x0 + x1) / 2, (b[0][2] + b[1][2]) / 2 + dy, label, ha="center", va="center", fontsize=txt, color=INK, zorder=6)
    return b


I = lambda x: x
# ---- shell, on its back, seen from above (= from the front)
shell = trimesh.load(STL / "x_shell3.stl")
outline(shell, 66.0, I, color="#6e7781", lw=0.7)
outline(shell, 40.0, I, color="#24292f", lw=1.3)
for v, name, c in [("c_psu5", "5 V-forsyning\nRSD-60G-5\n(DC IN øverst,\nDC OUT nederst)", "#e5dbff"), ("c_wled", "RGB-styring\nGledopto\n(ind forneden,\nud + USB-C foroven)", "#d3f9d8"),
                   ("c_mosfet", "dæm-\nper", "#c3fae8"), ("c_speaker", "højttaler (tilvalg)", "#ffe8cc"), ("c_mcore", "mikrofon-kerne\nXVF3800", "#d0ebff"),
                   ("c_4g", "4G\n(tilvalg)", "#dbe4ff"), ("c_imu", "stød-\nsensor", "#e9fac8"), ("c_reed", "reed", "#ffdeeb"), ("c_jack", "", "#ffc9c9")]:
    box(v, I, name, c)
# the real terminals and plugs (Esben's photos 27 Oct)
for key, txt, side in [("psu_vin-", "V−", "l"), ("psu_vin+", "V+", "r"), ("psu_v+", "+V", "l"), ("psu_v-", "−V", "r"),
                       ("wled_in", "ind V+ V−", "r"), ("wled_out", "GPIO16", "l"), ("wled_usb", "USB-C", "r"),
                       ("dim_vin", "VIN/GND/VOUT", "r"), ("dim_grav", "Gravity", "r"),
                       ("core_usb", "USB-C", "r"), ("core_aux", "aux", "l"), ("core_spk", "SPEAKER", "r")]:
    q = hz.P[key]
    ax.add_patch(mp.Circle((q[0], q[2]), 2.2, fc="#fab005", ec=INK, lw=0.7, zorder=8))
    ax.text(q[0] + (3.5 if side == "r" else -3.5), q[2] - 4, txt, fontsize=6.5, color=INK, ha="left" if side == "r" else "right",
            va="top", zorder=8, bbox=dict(boxstyle="round,pad=0.1", fc="#fff9db", ec="none"))
ax.text(0, 66, "strømstik\n+ sikring", ha="center", fontsize=8, color=INK, zorder=6)
# Wago row
for n, x in hz.WAGO.items():
    w = {"221-413": 18.8, "221-414": 24.4, "221-415": 30.0}[hz.WAGO_TYPE[n]]
    ax.add_patch(mp.Rectangle((x - w / 2, 262), w, 18.8, fc="#ff922b", ec="#a65800", lw=1, zorder=4))
    ax.text(x, 273.5, n, ha="center", va="center", fontsize=10, weight="bold", color="white", zorder=5)
    ax.text(x, 284.5, f"{hz.WAGO_NAME[n]}", ha="center", va="bottom", fontsize=7, color=INK, zorder=5)
ax.text(0, 296, "Wago-række på vægbeslagets klods: håndtag mod dig, ledningerne ind nedefra", ha="center", fontsize=9, color=INK, weight="bold")
# loops in the shell
import re   # noqa: E402
scad = (Path(__file__).resolve().parents[2] / "cad" / "gen2_concept.scad").read_text()
body = re.sub(r"//[^\n]*", "", scad.split("CABLE_LOOPS =")[1].split(";")[0])
for x, z, d in re.findall(r'\[(-?[\d.]+), (-?[\d.]+), "([hv])"\]', body):
    x, z = float(x), float(z)
    w, h = (5, 14.4) if d == "h" else (14.4, 5)
    ax.add_patch(mp.Rectangle((x - w / 2, z - h / 2), w, h, fc="white", ec=INK, lw=1, zorder=5))

# ---- front unit, face down to the left: frame, display back, Pi, guard
frame = trimesh.load(STL / "x_frame3.stl")
outline(frame, 30.0, FX, color="#24292f", lw=1.0)
box("x_dsp_back", FX, "", "#f1f3f5")
b = box("c_pi_board", FX, "", "#b2f2bb")
pix = (FX(b[0][0]) + FX(b[1][0])) / 2
ax.text(pix, b[1][2] - 8, "Raspberry Pi 5", ha="center", fontsize=9, weight="bold", color=INK, zorder=6)
fg = box("x_fanguard", FX, "", "#dee2e6")
ax.text((FX(fg[0][0]) + FX(fg[1][0])) / 2, fg[1][2] - 6, "blæserhegn", ha="center", va="top", fontsize=7, color=MUTED, zorder=6)
ax.add_patch(mp.Rectangle((FX(-22.0) - 2.5, 120.6), 5, 50.8, fc="#343a40", ec="none", zorder=5))            # GPIO header
ax.text(FX(-22.0), 117, "GPIO\n(ben 1 øverst)", fontsize=7, color=INK, ha="center", va="top", zorder=6)
for x in (-19.0, -1.0):
    ax.add_patch(mp.Rectangle((FX(x) - 7, 91), 14, 6, fc="#adb5bd", ec=INK, lw=0.6, zorder=5))
ax.text(FX(-10.0), 72, "USB-A: 90° vinklede stik", fontsize=7, ha="center", va="top", color=INK, zorder=6)
ax.add_patch(mp.Rectangle((FX(28.0) - 4, 163), 4, 8, fc="#495057", zorder=5))
ax.text(FX(30.0) - 6, 158, "USB-C\n(strøm)", fontsize=7, ha="right", va="top", color=INK, zorder=6)
for x in (-19.5, 19.5):
    ax.add_patch(mp.Circle((FX(x), 300.2), 3, fc="white", ec=INK, zorder=5))
ax.text(FX(0.0), 314, "stripledninger ud af bagrammen", fontsize=7, ha="center", va="bottom", color=INK)
for (x, z) in [(-76, 70.48), (-76, 230.48), (34, 230.48)]:
    for dz in (-3.8, 3.8):
        ax.add_patch(mp.Rectangle((FX(x) - 5.2, z + dz - 1.2), 10.4, 2.4, fc="white", ec=INK, lw=0.8, zorder=5))

# ---- lanes (wide light bands) and cables (thin coloured lines on top)
for name, (half, pts) in hz.LANES.items():
    tf = I if half == "shell" else FX
    ax.plot([tf(q[0]) for q in pts], [q[2] for q in pts], color="#ffe066", lw=11, alpha=0.45, zorder=2, solid_capstyle="round")
    m = pts[0]
    ax.text(tf(m[0]), m[2], name, fontsize=7, color="#8f6b00", weight="bold", ha="center", va="center", zorder=2.5)


def pieces(route):
    """Split a route at its K markers; each piece is (tf, points). A piece that ends or starts at a K's frame
    anchor, or that has no K at all and lies on the front (y < 40), is drawn mirrored."""
    out, pts = [], []
    for p in route:
        if isinstance(p, str):
            out.append(pts); pts = []
        else:
            pts.append(p)
    out.append(pts)
    frames = {hz.K[k]["frame"] for k in hz.K}
    res = []
    for ps in out:
        if not ps:
            continue
        front = ps[0] in frames or ps[-1] in frames or (len(out) == 1 and ps[0][1] < 40 and ps[-1][1] < 40)
        res.append((FX if front else I, ps))
    return res


seen = {}
for c in hz.CABLES:
    parts = pieces(c[7])
    for tf, ps in parts:
        ax.plot([tf(q[0]) for q in ps], [q[2] for q in ps], color=c[6], lw=1.6, alpha=0.9, zorder=3, solid_capstyle="round")
    for tf, q in ((parts[0][0], parts[0][1][0]), (parts[-1][0], parts[-1][1][-1])):
        if q[2] >= 240 and q[1] > 40 and abs(q[0]) < 85:
            continue            # Wago ends are named by the row itself
        key = (round(tf(q[0]) / 4) * 4, round(q[2] / 4) * 4)
        if c[0] not in seen.setdefault(key, []):
            seen[key].append(c[0])
for (x, z), ids in seen.items():
    ax.text(x + 3, z + 3, " ".join(ids), fontsize=7, color=INK, zorder=7,
            bbox=dict(boxstyle="round,pad=0.15", fc="white", ec=LINE, lw=0.5))

# ---- the hinge bundles across the gap
for k, col in (("K1", "#7048e8"), ("K2", "#d6336c")):
    xs, _, zs = hz.K[k]["shell"]
    xf, _, zf = hz.K[k]["frame"]
    X1, X2 = xs, FX(xf)
    ax.add_patch(mp.FancyArrowPatch((X2, zf), (X1, zs), connectionstyle="arc3,rad=-0.35", arrowstyle="-", lw=7, color=col, alpha=0.55, zorder=4))
    ax.text((X1 + X2) / 2, max(zs, zf) + 26, f"{k}: {hz.k_loop(k):.0f} mm\nmellem stropperne", ha="center", fontsize=10, color=col, weight="bold")
ax.axvline(hz.X_EDGE, color=LINE, lw=0.8, ls=":")
ax.axvline(hz.X_EDGE - hz.GAP, color=LINE, lw=0.8, ls=":")
ax.text(hz.X_EDGE - hz.GAP / 2, -14, "hængsel\n(venstre side)", ha="center", fontsize=8, color=MUTED)

ax.text(0, -20, "SKALLEN på ryggen, set ovenfra", ha="center", fontsize=13, weight="bold", color=INK)
ax.text(FX(0), -20, "FRONTEN med forsiden nedad, bagsiden op", ha="center", fontsize=13, weight="bold", color=INK)
ax.set_title(f"Selfi Halo gen 2 {VER}: ledningsplan, boksen åbnet som en bog over venstre side", fontsize=15, color=INK)
ax.legend(handles=[mp.Patch(color=hz.RED, label="24 V + / hvid +"), mp.Patch(color=hz.ORG, label="5 V +"), mp.Patch(color=hz.BLK, label="GND"),
                   mp.Patch(color=hz.GRY, label="hvid + dæmpet (VOUT)"), mp.Patch(color=hz.GRN, label="RGB data"),
                   mp.Patch(color="#1c7ed6", label="USB og GPIO"), mp.Patch(fc="white", ec=INK, label="løkke til 10 mm velcrostrop")],
          loc="lower center", bbox_to_anchor=(0.5, -0.07), ncol=7, fontsize=9, frameon=False)
ax.set_xlim(FX(115) - 5, 118); ax.set_ylim(-30, 318); ax.set_aspect("equal"); ax.axis("off")
fig.savefig(OUT, dpi=110, bbox_inches="tight")
print("wrote", OUT)
