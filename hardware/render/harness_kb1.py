"""Cable harness of the camera-at-the-bottom variant (kb1, cad/gen2_kamera_bund.scad), built on harness_gen2 (v38).

The shell and everything in it are v38's, so every shell point, lane and Wago clamp is reused as it is. The front unit
(front, ring, frame, display, Pi) is turned 180 deg about the box's front-to-back axis, so every front point is v38's point
turned over: x -> -x, z -> H - z (front()). The box still opens over its LEFT side, so the frame's two hinge grooves are
redrawn at x -76 (gen2_kamera_bund.scad: FRAME_LOOPS) and the two bundles swap ends:
  K1 (strips, Pi power, dimmer, reed) from the frame's LOWER bar (z 76.5) to the shell's lower loop (z 72): the strip leads now
     leave the ring at the bottom beside the camera, the Pi's USB-C socket is on its left edge low down, and the dimmer and the
     reed sit low on the left wall;
  K2 (the 3 USB cables, the IMU) from the frame's UPPER bar (z 236.5) to the shell's upper loop (z 240): the Pi's USB ports now
     face up, and the IMU is reached along the distribution lane under the Wago row.
Same coordinates as harness_gen2 (x right seen from the front, y back, z up).
"""
import math

import harness_gen2 as hz
from harness_gen2 import (BEND, GAP, H, RIM, X_EDGE, WAGO, WAGO_NAME, WAGO_TYPE, T, L, R, M, RH, Hh, G, RS,  # noqa: F401
                          RED, BLK, ORG, GRY, GRN, BLU, w, wago, lane, rev, FLAT)


def front(p):
    """A v38 front-unit point, turned over with the front unit."""
    x, y, z = p
    return (-x, y, H - z)


def front_dir(d):
    """A direction in the front unit, turned over with it."""
    x, y, z = d
    return (-x, y, -z)


# admin viewer (render/gen2_viewer.py): the closed bundles fold towards the middle, K1 up from the lower bar, K2 down
K_FOLD = {"K1": (-84.0, 1), "K2": (-90.0, -1)}
LABELS = {
    "kamera": "Kamera (Wide), nederst i fronten",
    "blaeserhegn": "Blæserhegn (sort ASA): klikkes på bagrammens nederste tværstykke, rist 3 mm over blæseren (kb1: 0,5 mm aflastet bagpå ud for 5 V-forsyningen)",
    "logo_hvid": "Logo, hvidt (indlagt øverst i fronten)",
    "mikrofoner": "Mikrofonstrip, standard (i bunden under kameraet; kamerarørene er skåret flade 1,0 mm over den)",
}


# the mic board's flat cable (20 cm, standard): out of the pocket backwards under the camera plate (kb1: 2.6 mm over the floor),
# then up between the RGB control and the 5 V tray at y 45-47, 8 mm behind the fan guard (which now hangs down to z 66), to
# the mic core's lower edge. 159 mm of the 200.
MIC_FPC = ("mikrofoner", "Mikrofonstrip → kerne (fladt kabel bag blæserhegnet, ikke hen over det)", 1.2,
           [(-0.7, 22.2, 3.6), (-0.7, 33, 3.6), (-0.7, 33.5, 12), (1, 40, 18), (3, 45, 60), (3, 46, 130), (5, 47, 143), (5, 52, 145.5)])


K = {"K1": {"shell": hz.K["K2"]["shell"], "frame": (-76.0, 33.0, H - 230.5)},     # shell (-80, 62, 72), frame lower bar
     "K2": {"shell": hz.K["K1"]["shell"], "frame": (-76.0, 33.0, H - 70.5)}}      # shell (-85, 62, 240), frame upper bar


def k_loop(k):
    """Strap to strap, front open (as harness_gen2.k_loop, with this variant's ends)."""
    (xs, ys, zs), (xf, yf, zf) = K[k]["shell"], K[k]["frame"]
    path = (ys - 6.0) + (xs - X_EDGE) + 3.0 + GAP + math.hypot(xf - X_EDGE, RIM - yf) + abs(zs - zf)
    return math.ceil(path * BEND / 10.0) * 10.0


def k_closed(k):
    return math.dist(K[k]["shell"], K[k]["frame"])


def pin(n):
    """Pi 5 GPIO pin: the header is on the Pi's RIGHT edge now (x +28), pin 1 at the bottom."""
    return front(hz.pin(n))


# front lanes, turned over: FB along the bottom behind the frame (v38: FT at the top), FL up the left edge from FB to K1,
# LB along the lower bar (v38: UB on the upper bar), GD up/down beside the GPIO header on the right, UB over the Pi's
# USB ports to K2 (v38: LB under them)
FB = lambda x: (x, 36.0, H - 296.0)
FL = lambda z: (-80.0, 36.0, z)
LB = lambda x: (x, 34.0, H - 230.5)
GD = lambda z: (40.0, 36.0, z)
UB = lambda x: (x, 30.0, H - 84.0)
K1s, K1f, K2s, K2f = K["K1"]["shell"], K["K1"]["frame"], K["K2"]["shell"], K["K2"]["frame"]

P = dict(hz.P)
for n in ("usb_a1", "usb_a2", "usb_a3", "usb_c_pi", "dsp_pwr"):
    P[n] = front(hz.P[n])
# the strip leads: v38's left lead slot (white 1 + RGB) is on the right now, beside the camera at the bottom
P["hole_r"], P["hole_l"] = front(hz.P["hole_l"]), front(hz.P["hole_r"])

UP_L = [Hh(-80.0), L(112.0), L(170.0), L(222.0), T(-45.0)]   # shell's lower loop -> H -> left lane up -> distribution lane
TO_K1 = list(reversed(UP_L)) + [K1s, "K1", K1f]               # Wago row -> front through K1
STRIPS_R = [P["hole_r"], FB(19.5), FB(-80.0), FL(40.0), K1f, "K1", K1s] + UP_L
STRIPS_L = [P["hole_l"], FB(-80.0), FL(40.0), K1f, "K1", K1s] + UP_L
K2_SHELL = [K2s, T(-85.0), T(-45.0), L(222.0)]                # shell's upper loop -> down the left lane

base = {c[0]: c for c in hz.CABLES}
CABLES = [base[i] for i in ("P1", "P1b", "P2", "P3", "P4", "P5", "P6", "P7", "P8", "P9", "P10", "P11", "P13", "P14", "A1")]
CABLES[12:12] = [
    ("P12", "5 V", "W3 → Pi USB-C (pigtail: rød i W3, sort i W4)", "W3 + W4", "Pi 5 USB-C", "USB-C-pigtail 2 × 0,75 mm²", ORG,
     rev(w("W3")) + TO_K1 + [LB(-34.0), (-45.0, 30.0, 120.0), P["usb_c_pi"]], 15),
]
CABLES += [
    # strips (their own leads, through K1): white 1 + RGB from the right lead slot, white 2 from the left
    ("S1", "RGB", "RGB-strip +5 V (rød) → W3", "RGB-strip", "W3", "strippens ledning", ORG, STRIPS_R + w("W3", -6), 15),
    ("S2", "RGB", "RGB-strip GND (hvid) → W4", "RGB-strip", "W4", "strippens ledning", BLK, STRIPS_R + w("W4", -8), 15),
    ("S3", "RGB", "RGB-strip data (grøn) → RGB-styring GPIO16", "RGB-strip", "Gledopto GPIO16", "strippens ledning", GRN,
     STRIPS_R[:7] + [Hh(-80.0), L(112.0), P["wled_out"]], 10),
    ("S4", "hvid", "hvid strip 1 + → W6", "hvid strip 1", "W6", "strippens ledning", RED, STRIPS_R + w("W6", -4), 15),
    ("S5", "hvid", "hvid strip 1 − → W5", "hvid strip 1", "W5", "strippens ledning", BLK, STRIPS_R + w("W5", -4), 15),
    ("S6", "hvid", "hvid strip 2 + → W6", "hvid strip 2", "W6", "strippens ledning", RED, STRIPS_L + w("W6", 4), 15),
    ("S7", "hvid", "hvid strip 2 − → W5", "hvid strip 2", "W5", "strippens ledning", BLK, STRIPS_L + w("W5"), 15),
    # data: the USB plugs now point up and must be angled the other way than in v38 (cable out to the LEFT as the box stands)
    ("U1", "USB", "Pi USB-A → RGB-styring USB-C (styring)", "Pi 5 USB-A", "Gledopto USB-C", "USB-A 90° (kabel mod venstre) → USB-C", BLU,
     [P["usb_a1"], UB(-76.0), K2f, "K2"] + K2_SHELL + [L(170.0), L(140.0), (-28.5, 46.0, 146.0), P["wled_usb"]], 0),
    ("U2", "USB", "Pi USB-A → mikrofon-kerne USB-C", "Pi 5 USB-A", "XVF3800 USB-C", "USB-A 90° (kabel mod venstre) → USB-C", BLU,
     [P["usb_a2"], UB(-76.0), K2f, "K2"] + K2_SHELL + [L(204.0), (3.0, 50.0, 208.0), P["core_usb"]], 0),
    ("U3", "USB", "Pi USB-A → 4G-modem (tilvalg)", "Pi 5 USB-A", "4G-modem", "USB-A 90° (kabel mod venstre) → modemets stik", BLU,
     [P["usb_a3"], UB(-76.0), K2f, "K2"] + K2_SHELL + [L(170.0), (-72.0, 50.0, 166.0), P["g4_usb"]], 0),
    ("G1", "GPIO", "Pi ben 1, 12, 14 → dæmperens 3-polede stik", "Pi 5 GPIO", "DFR0457 Gravity", "3 ledere: Gravity-kabel + forlænger", BLU,
     [pin(12), GD(155.0), GD(H - 230.5 + 4), LB(-76.0), K1f, "K1", K1s, (-88.0, 48.0, 58.0), (-100.0, 44.0, 58.0), P["dim_grav"]], 0),
    ("G2", "GPIO", "Pi ben 13, 17, 20 → reed (tilvalg)", "Pi 5 GPIO", "reed-modul", "3 dupont-ledere hun-hun", BLU,
     [pin(17), GD(160.0), GD(H - 230.5 + 4), LB(-76.0), K1f, "K1", K1s, (-64.0, 56.0, 64.0), (-64.0, 56.0, 50.0), P["reed"]], 0),
    ("G3", "GPIO", "Pi ben 3, 4, 5, 7, 9 → stødsensor (tilvalg)", "Pi 5 GPIO", "LIS3DH", "5 dupont-ledere hun-hun", BLU,
     [pin(5), GD(180.0), GD(H - 84.0), UB(-76.0), K2f, "K2", K2s, T(-85.0), T(72.0), R(200.0), R(166.0), (89.0, 56.0, 166.0), P["imu"]], 0),
    ("G4", "GPIO", "Pi ben 2, 6 → skærmens strøm", "Pi 5 GPIO", "Touch Display 2", "skærmens eget kabel", BLU,
     [pin(2), (20.0, 30.0, H - 190.0), P["dsp_pwr"]], 0),
]
LANES = {k: v for k, v in hz.LANES.items() if v[0] == "shell"}
LANES.update({
    "FB": ("front", [FB(19.5), FB(-80.0)]), "FL": ("front", [FL(H - 296.0), FL(H - 230.5)]), "LB": ("front", [LB(-76.0), LB(40.0)]),
    "GD": ("front", [GD(H - 78.0), GD(H - 150.0)]), "UB": ("front", [UB(1.0), UB(-76.0)]),
})


def route_length(route):
    pts, total, k = [], 0.0, None
    for p in route:
        if isinstance(p, str):
            total += sum(math.dist(a, b) for a, b in zip(pts, pts[1:]))
            total += k_loop(p)
            k, pts = p, []
        else:
            pts.append(p)
    total += sum(math.dist(a, b) for a, b in zip(pts, pts[1:]))
    return total, k


def cut_length(c):
    """Length to cut (or buy): route + bends + the clamp ends, rounded up to 5 cm."""
    route, ends = c[7], c[8]
    L_, k = route_length(route)
    L_ = L_ * (1.0 if k else BEND) + 2 * ends
    return L_, int(math.ceil(L_ / 50.0) * 50), k


if __name__ == "__main__":
    for k in K:
        print(k, "loop", k_loop(k), "closed", round(k_closed(k)))
    old = {c[0]: hz.cut_length(c)[1] for c in hz.CABLES}
    for c in CABLES:
        L_, cut, k = cut_length(c)
        print(f"{c[0]:4s} {c[2]:55s} {L_:6.0f}  cut {cut:4d}  (v38 {old.get(c[0], 0):4d})  {k or ''}")
