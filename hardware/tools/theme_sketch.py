#!/usr/bin/env python3
"""Flat front sketch of a gen 2 theme for approval: the real unit from the CAD (gen2_unit.front_layers: front,
light ring, glass, camera, logo) with the theme's wings, topper and idle screen.

Usage: python3 hardware/tools/theme_sketch.py <theme id> <out.png> [--casing]
  --casing  paint the unit's front and shell in the theme's casing colour instead of the black ASA it is printed in.
Needs the theme built first (python3 hardware/tools/venue_themes.py <id>) for its screen.png.
"""
import argparse
import base64

import cairosvg
from shapely import affinity

import gen2_unit
import theme_builder as tb
import venue_themes as vt

SCREEN = dict(z=151.85, w=136.4, h=217.6)   # the picture area, as HaloBox draws it
OUTLINE = "#15171a"


def part(t, outline, L, dx=0.0, dz=0.0, mirror=False):
    if mirror:
        outline, L = vt.mirror(outline), [(k, vt.mirror(g)) for k, g in L]
    cols = tb.resolve(L, outline.buffer(-tb.EDGE_KEEP))
    out = [(OUTLINE, outline.buffer(1.4)), (t["pal"]["base"], outline)] + [(t["pal"][k], g) for k, g in cols.items() if k != "base"]
    return [(c, affinity.translate(g, dx, dz)) for c, g in out]


def sketch(tid, out, casing=False, width=1500):
    t = vt.THEMES[tid]
    vt.use_unit(t.get("unit"))
    layers = []
    layers += part(t, *t["wing"](8))
    layers += part(t, *t["wing"](7), mirror=True)
    outline, L = t["topper"]()
    layers += part(t, vt.topper_outline(outline), L, dz=vt.G["H"])
    unit = gen2_unit.front_layers()
    layers += [(OUTLINE, unit[0][1].buffer(1.4))]
    for colour, g in unit:
        layers.append((t["casing"] if casing and colour == gen2_unit.COLOURS["front"] else colour, g))
        if colour == gen2_unit.COLOURS["skaerm"]:
            layers.append(("screen", None))   # the idle screen goes on the glass, under the front's lip

    minx, minz, maxx, maxz = vt.U(*[g for _, g in layers if g is not None]).buffer(10).bounds
    w, h = maxx - minx, maxz - minz

    def path(g):
        polys = [g] if g.geom_type == "Polygon" else [p for p in getattr(g, "geoms", []) if p.geom_type == "Polygon"]
        return "".join("M" + " L".join(f"{x - minx:.2f},{maxz - z:.2f}" for x, z in r.coords) + " Z "
                       for p in polys for r in [p.exterior] + list(p.interiors))

    img = base64.b64encode((vt.ROOT / "themes" / tid / "build/web/screen.png").read_bytes()).decode()
    body = [f'<rect width="{w}" height="{h}" fill="#efeee9"/>']
    for c, g in layers:
        if g is None:
            body.append(f'<image href="data:image/png;base64,{img}" x="{-SCREEN["w"] / 2 - minx}" y="{maxz - SCREEN["z"] - SCREEN["h"] / 2}" '
                        f'width="{SCREEN["w"]}" height="{SCREEN["h"]}" preserveAspectRatio="none"/>')
        elif not g.is_empty:
            body.append(f'<path d="{path(g)}" fill="{c}" fill-rule="evenodd"/>')
    svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w:.1f} {h:.1f}">{"".join(body)}</svg>'
    cairosvg.svg2png(bytestring=svg.encode(), write_to=str(out), output_width=width)
    print(out, f"{w:.0f} x {h:.0f} mm, unit from {gen2_unit.latest_assembly().name}")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("tid")
    ap.add_argument("out")
    ap.add_argument("--casing", action="store_true")
    a = ap.parse_args()
    sketch(a.tid, a.out, a.casing)
