#!/usr/bin/env python3
"""Trace a venue's logo (PNG with a transparent background) into one geometry per colour.

Every opaque pixel goes to the nearest reference colour, each colour is cleaned of specks smaller than
`--min` pixels and turned into polygons with holes. The result is logos/<id>.geo.json, which
venue_themes.py reads with traced_logo() and place_logo() (image pixels, y down).

Usage: python3 hardware/tools/trace_logo.py flying_hirsch
Needs: opencv-python-headless, numpy, shapely, pillow
"""
import argparse
import json
from pathlib import Path

import cv2
import numpy as np
import shapely
from PIL import Image
from shapely.geometry import Polygon
from shapely.ops import unary_union

LOGOS = Path(__file__).resolve().parent / "logos"

# Reference colours per logo: name -> list of RGB samples taken from the artwork.
REFS = {
    "flying_hirsch": {
        "black": [(12, 4, 3), (28, 27, 26), (0, 0, 0)],
        "grey": [(51, 51, 51), (51, 53, 53), (46, 53, 54)],
        "white": [(255, 255, 255), (249, 248, 246), (255, 254, 226), (150, 200, 230)],
        "red": [(216, 26, 33), (128, 15, 19), (160, 19, 24)],
        "darkred": [(67, 6, 8), (68, 10, 11)],
        "fur": [(137, 99, 61)],
        "brown": [(101, 66, 33)],
        "tan": [(197, 155, 109), (193, 183, 165)],
    },
    "aab": {
        "white": [(255, 255, 255)],
        "bright": [(237, 28, 36)],
        "red": [(196, 22, 29)],
        "darkred": [(135, 14, 18)],
    },
}


def trace(tid, min_px=60, simplify=0.8):
    img = np.array(Image.open(LOGOS / f"{tid}-source.png").convert("RGBA")).astype(np.int32)
    refs = REFS[tid]
    names, samples = [], []
    for name, cols in refs.items():
        for c in cols:
            names.append(name)
            samples.append(c)
    samples = np.array(samples)
    d = ((img[..., None, :3] - samples[None, None]) ** 2).sum(-1)
    idx = d.argmin(-1)
    opaque = img[..., 3] > 128
    out = {}
    for name in refs:
        mask = np.isin(idx, [i for i, n in enumerate(names) if n == name]) & opaque
        m = cv2.morphologyEx(mask.astype(np.uint8) * 255, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
        contours, hier = cv2.findContours(m, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_NONE)
        polys = []
        if hier is not None:
            for i, c in enumerate(contours):
                if hier[0][i][3] != -1 or len(c) < 3 or cv2.contourArea(c) < min_px:
                    continue
                holes = []
                j = hier[0][i][2]
                while j != -1:
                    if len(contours[j]) >= 3 and cv2.contourArea(contours[j]) >= min_px:
                        holes.append(contours[j][:, 0, :])
                    j = hier[0][j][0]
                p = Polygon(c[:, 0, :], holes).buffer(0)
                polys.append(p.simplify(simplify))
        g = unary_union(polys)
        if not g.is_empty:
            out[name] = shapely.to_geojson(g)
        print(f"  {name:8s} {len(polys):4d} shapes")
    (LOGOS / f"{tid}.geo.json").write_text(json.dumps(out))


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("ids", nargs="+")
    ap.add_argument("--min", type=int, default=60, help="smallest shape kept, in pixels")
    a = ap.parse_args()
    for tid in a.ids:
        print(tid)
        trace(tid, a.min)
