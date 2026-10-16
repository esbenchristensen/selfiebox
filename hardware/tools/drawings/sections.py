#!/usr/bin/env python3
"""Section drawings (cut views) of the assembled Halo unit, hatched per part.

Cuts every part (and every screw, insert and dowel) of the assembly with a plane and draws
the cut faces as a technical section sheet with labels. Uses the assembly STLs that
build_pack.py caches in hardware/.cache/assembly.

Usage: python3 hardware/tools/drawings/sections.py   ->  docs/pack/drawings/X0*_*.png
"""
import json
import sys
from pathlib import Path

import cairosvg
import numpy as np
import trimesh
from shapely.geometry import MultiPolygon, Polygon
from shapely.ops import unary_union

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent.parent
sys.path.insert(0, str(HERE.parent))
import build_pack  # noqa: E402

CACHE = ROOT / ".cache" / "assembly"
OUT = ROOT / "docs" / "pack" / "drawings"
HW = json.loads((ROOT / "docs" / "pack" / "hardware.json").read_text())

NAMES = {"bezel": "Bezel", "diffuser_ring": "Diffuserring", "led_rail": "LED-skinne", "shell_closed": "Kabinet", "shell_closed_band": "Translucent stribe",
         "wall_cleat": "Vægbeslag", "v_display": "Touch Display 2", "v_pi": "Pi 5 + køler", "v_camera": "Kamera", "v_leds": "LED-strips (COB + RGBW)",
         "v_power": "Strømmodul", "v_pads": "EVA-pad", "printer_front": "Printer-front", "printer_shell": "Printerkabinet", "printer_shell_band": "Translucent stribe",
         "v_printer": "DFR0503", "v_pol9": "Pololu 9 V", "joint_spacer": "Samlestykke",
         "instax_front": "Fotomodul-front", "instax_shell": "Fotomodul-kabinet", "instax_shell_band": "Translucent stribe", "v_instax": "Instax Square Link"}
HWN = {"ins_m3": "M3-indsats", "ins_m4": "M4-indsats", "ins_q": '1/4"-indsats', "m3x8": "M3 × 8", "m3x16": "M3 × 16", "m2x6": "M2 × 6", "m25x6": "M2,5 × 6",
       "m4x10": "M4 × 10", "wood45x50": "Vægskrue 4,5 × 50", "dowel6x20": "Styrestift Ø6"}
STYLE = {  # fill, hatch colour
    "asa": ("#cfcfd4", "#55555c"), "petg": ("#f4eedf", "#b9a77a"), "glass": ("#c9d3e3", "#4c6188"), "pcb": ("#bfe0c9", "#2f8a55"),
    "power": ("#c4d4f0", "#2c62b0"), "pad": ("#e6e6e6", "#8a8a8f"), "led": ("#fff3c4", "#c99a10"), "brass": ("#e7c98a", "#9a6c12"),
    "steel": ("#9a9ca5", "#3a3c44")}


def style_of(name):
    if name.startswith("hw--"):
        k = name.split("--")[3]
        return "brass" if k.startswith("ins") else "steel"
    if name.endswith("_band") or name == "diffuser_ring":
        return "petg"
    return {"v_display": "glass", "v_pi": "pcb", "v_camera": "pcb", "v_power": "power", "v_pol9": "power", "v_pads": "pad", "v_leds": "led", "v_printer": "steel", "v_instax": "pad"}.get(name, "asa")


def meshes(unit_dz=0.0, printer=False):
    out = {}
    for n in ["bezel", "diffuser_ring", "led_rail", "shell_closed", "wall_cleat", "v_display", "v_pi", "v_camera", "v_leds", "v_power", "v_pads"]:
        m = trimesh.load(CACHE / f"{n}.stl")
        m.apply_translation([0, 0, unit_dz]); out[n] = m
    if printer:
        for n in ["instax_front", "instax_shell", "v_instax", "joint_spacer"]:
            m = trimesh.load(CACHE / f"{n}.stl")
            if n == "joint_spacer":
                m.apply_translation([0, 0, unit_dz - 6])
            out[n] = m
    for i, (grp, part, kind, pos, d, when) in enumerate(HW["HW_LIST"]):
        if when != "base" or grp not in ("unit", "photo") or (grp == "photo" and not printer):
            continue
        g = build_pack.fastener(kind, pos, d)
        if grp == "unit":
            g.apply_translation([0, 0, unit_dz])
        out[f"hw--{grp}--{when}--{kind}--{part}--{i}"] = g
    return out


def cut(mesh, origin, normal, axes):
    sec = mesh.section(plane_origin=origin, plane_normal=normal)
    if sec is None:
        return None
    polys = []
    for loop in sec.discrete:
        pts = np.asarray(loop)[:, axes]
        if len(pts) >= 3:
            p = Polygon(pts).buffer(0)
            if p.area > 0.05:
                polys.append(p)
    if not polys:
        return None
    polys.sort(key=lambda p: -p.area)
    acc = Polygon()
    for p in polys:                      # even-odd: holes inside outer loops
        acc = acc.symmetric_difference(p)
    return acc if not acc.is_empty else None


def path_d(geom, tx):
    gs = [geom] if geom.geom_type == "Polygon" else [g for g in getattr(geom, "geoms", []) if g.geom_type == "Polygon"]
    d = ""
    for g in gs:
        for ring in [g.exterior, *g.interiors]:
            d += "M" + " L".join(f"{tx(x, y)[0]:.1f},{tx(x, y)[1]:.1f}" for x, y in ring.coords) + " Z "
    return d


def sheet(title, sub, mesh_dict, origin, normal, axes, flip_h, px, labels_side, out, notes=()):
    cuts = {}
    for n, m in mesh_dict.items():
        c = cut(m, origin, normal, axes)
        if c is not None:
            cuts[n] = c
    allg = unary_union(list(cuts.values()))
    x0, y0, x1, y1 = allg.bounds
    W = int((x1 - x0) * px) + 900
    H = int((y1 - y0) * px) + 330
    ox, oy = 120, 110
    def tx(h, v):
        hh = (x1 - h) if flip_h else (h - x0)
        return ox + hh * px, oy + (y1 - v) * px
    defs, body = [], []
    for key, (fill, hatch) in STYLE.items():
        defs.append(f'<pattern id="h_{key}" patternUnits="userSpaceOnUse" width="7" height="7" patternTransform="rotate(45)">'
                    f'<rect width="7" height="7" fill="{fill}"/><line x1="0" y1="0" x2="0" y2="7" stroke="{hatch}" stroke-width="1.1"/></pattern>')
    order = sorted(cuts, key=lambda n: (n.startswith("hw--"), -cuts[n].area))
    for n in order:
        s = style_of(n)
        body.append(f'<path d="{path_d(cuts[n], tx)}" fill="url(#h_{s})" fill-rule="evenodd" stroke="#16161a" stroke-width="1.2"/>')
    # labels: one per part (largest piece), fasteners grouped by type
    groups = {}
    for n, g in cuts.items():
        if n.startswith("hw--"):
            k = n.split("--")[3]; groups.setdefault(HWN.get(k, k), []).append(g)
        else:
            groups.setdefault(NAMES.get(n, n), []).append(g)
    items = []
    for name, gs in groups.items():
        big = max((p for g in gs for p in ([g] if g.geom_type == "Polygon" else g.geoms)), key=lambda p: p.area)
        rp = big.representative_point()
        items.append((name, tx(rp.x, rp.y), len(gs) if name in HWN.values() else 0))
    items.sort(key=lambda t: t[1][1])
    lx = ox + (x1 - x0) * px + 120
    ys = []
    y = oy
    for name, p, cnt in items:
        y = max(y + 30, p[1] - 8) if ys else max(oy, p[1] - 8)
        ys.append(y)
    # squeeze if overflowing
    if ys and ys[-1] > H - 230:
        step = (H - 230 - oy) / max(1, len(ys) - 1)
        ys = [oy + i * step for i in range(len(ys))]
    for (name, p, cnt), yy in zip(items, ys):
        body.append(f'<polyline points="{p[0]:.1f},{p[1]:.1f} {lx - 14:.1f},{yy:.1f} {lx - 4:.1f},{yy:.1f}" fill="none" stroke="#b3361f" stroke-width="1.1"/>')
        body.append(f'<circle cx="{p[0]:.1f}" cy="{p[1]:.1f}" r="3" fill="#b3361f"/>')
        lab = name + (f"  ({cnt} i snittet)" if cnt else "")
        body.append(f'<text x="{lx:.1f}" y="{yy + 5:.1f}" font-size="15" fill="#b3361f">{lab}</text>')
    for (h, v, text) in notes:
        p = tx(h, v)
        body.append(f'<text x="{p[0]:.1f}" y="{p[1]:.1f}" font-size="14" fill="#2a5bd7" font-weight="700">{text}</text>')
    # scale bar 50 mm
    sb = 50 * px
    body.append(f'<line x1="{ox}" y1="{H - 160}" x2="{ox + sb}" y2="{H - 160}" stroke="#16161a" stroke-width="3"/>'
                f'<text x="{ox}" y="{H - 168}" font-size="13" fill="#16161a">50 mm</text>')
    # frame + title block
    ty = H - 102
    tb = (f'<rect x="10" y="10" width="{W - 20}" height="{H - 20}" fill="none" stroke="#16161a" stroke-width="2"/>'
          f'<line x1="10" y1="{ty}" x2="{W - 10}" y2="{ty}" stroke="#16161a" stroke-width="1.5"/>'
          f'<text x="20" y="44" font-size="22" font-weight="800" fill="#16161a">{title}</text>'
          f'<text x="20" y="{ty + 22}" font-size="12" font-weight="600" fill="#6a6a72">SNIT</text>'
          f'<text x="20" y="{ty + 50}" font-size="20" font-weight="700" fill="#16161a">{title}</text>'
          f'<text x="{W * 0.5:.0f}" y="{ty + 22}" font-size="12" font-weight="600" fill="#6a6a72">PLAN</text>'
          f'<text x="{W * 0.5:.0f}" y="{ty + 50}" font-size="15" fill="#16161a">{sub}</text>'
          f'<line x1="{W * 0.5 - 10:.0f}" y1="{ty}" x2="{W * 0.5 - 10:.0f}" y2="{H - 10}" stroke="#16161a" stroke-width="1.5"/>'
          f'<text x="20" y="{H - 22}" font-size="12" fill="#6a6a72">Selfiebox Halo rev G · snit gennem CAD-modellen · skravering pr. del: grå ASA, creme PETG, blå glas, grøn print, messing indsatser, stål skruer · mål i mm</text>')
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" font-family="DejaVu Sans, Arial, sans-serif">'
           f'<defs>{"".join(defs)}</defs><rect width="{W}" height="{H}" fill="#fff"/>{"".join(body)}{tb}</svg>')
    OUT.mkdir(parents=True, exist_ok=True)
    cairosvg.svg2png(bytestring=svg.encode(), write_to=str(OUT / f"{out}.png"))
    print("section", out, f"{len(cuts)} parts cut")


def main():
    unit = meshes()
    band = trimesh.load(CACHE / "shell_closed.stl")
    lo, hi = band.bounds
    slab = trimesh.creation.box(bounds=[[lo[0] - 1, 22, lo[2] - 1], [hi[0] + 1, 32, hi[2] + 1]])
    unit["shell_closed"] = trimesh.boolean.difference([band, slab], engine="manifold")
    unit["shell_closed_band"] = trimesh.boolean.intersection([band, slab], engine="manifold")
    # B-B: vertical through the centre (camera, display, Pi, lock screw, cleat)
    sheet("Snit B–B: lodret gennem midten (X = 0)", "Set fra højre · front til venstre, væg til højre", unit, [0, 0, 0], [1, 0, 0], [1, 2], False, 3.0, "right", "X01_section_BB",
          notes=[(0, -14, "FRONT"), (70, -14, "VÆG")])
    # A-A: horizontal through the upper side screws
    sheet("Snit A–A: vandret gennem øverste sideskruer (Z = 239,2)", "Set oppefra · front nederst", unit, [0, 0, 239.2], [0, 0, 1], [0, 1], False, 3.4, "right", "X02_section_AA")
    # C-C: vertical through the rail ear: M2.5 screw, M3 insert and side screw
    sheet("Snit C–C: lodret gennem skruesøjlen ved LED-skinnens øre (X = 109,85)", "Set fra højre · M2,5-skrue, M3-indsats og sideskrue", unit, [109.85, 0, 0], [1, 0, 0], [1, 2], False, 3.0, "right", "X03_section_CC")
    # D-D: with the printer below, through a joint screw
    both = meshes(unit_dz=195, printer=True)
    s2 = trimesh.load(CACHE / "shell_closed.stl"); s2.apply_translation([0, 0, 195])
    both["shell_closed"] = s2
    sheet("Snit D–D: lodret gennem fotomodulet (X = 0)", "Set fra højre · Instax på hovedet, rampe, fotolomme og samling", both, [0, 0, 0], [1, 0, 0], [1, 2], False, 1.9, "right", "X04_section_DD",
          notes=[(0, -12, "FRONT"), (64, -12, "VÆG")])


if __name__ == "__main__":
    main()
