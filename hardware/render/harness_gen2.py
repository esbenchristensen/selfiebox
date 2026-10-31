"""Cable harness of Halo gen 2 (v29): every cable with its route, its length and its ends.

The box opens like a book over its left side: the shell lies on its back and the front unit (front, ring, frame, display,
Pi) lies face down to the left of it, up to GAP mm away. Every cable between the two halves crosses in one of two hinge
bundles (K1 at the top, K2 in the middle), strapped on both halves; the length of a bundle between its two straps is
worked out from that open position (k_loop). Everything else runs in fixed lanes, strapped in the shell's loops
(cad/gen2_concept.scad: CABLE_LOOPS, FRAME_LOOPS, wago_row).

Coordinates as the CAD: x right seen from the front, y back (front face 0, back wall 67 inside), z up (bottom 0).
Used by render/drawing/draw_v29_ledningsplan.py (drawing and cable list) and render/gen2_viewer.py (3D model).
"""
import math

D, W, H = 70.0, 224.5, 307.0
X_EDGE = -W / 2            # the hinge: the box's left edge seen from the front
RIM = D - 6.0              # the shell's front rim above the table when the shell lies on its back
GAP = 30.0                 # the front may lie up to 3 cm from the shell
BEND = 1.15                # bends and slack on top of the straight path

# ---------------------------------------------------------------- fixed points ----
# Wago row on the wall cleat's block (wago_row): pocket centres, entry face z 262, levers to the front
WAGO = {"W6": -69.5, "W5": -47.3, "W3": -22.3, "W4": 8.3, "W2": 41.7, "W1": 69.5}
WAGO_TYPE = {"W6": "221-413", "W5": "221-413", "W3": "221-414", "W4": "221-415", "W2": "221-415", "W1": "221-413"}
WAGO_NAME = {"W6": "hvid + (dæmpet)", "W5": "hvid −", "W3": "5 V +", "W4": "5 V GND", "W2": "GND", "W1": "24 V +"}


def wago(n, dx=0.0):
    return (WAGO[n] + dx, 52.5, 262.0)


def lane(n, dx=0.0):       # the distribution lane under the row, straight below a Wago
    return (WAGO[n] + dx, 50.0, 250.0)


# hinge bundles: shell end (a loop on the back wall), frame end (2 slots through a cross bar)
K = {"K1": {"shell": (-85.0, 62.0, 240.0), "frame": (-76.0, 33.0, 230.5)},
     "K2": {"shell": (-80.0, 62.0, 72.0), "frame": (-76.0, 33.0, 70.5)}}


def k_loop(k):
    """Strap to strap, front open: up the shell's back wall to the rim, over the left wall and the gap, down to the frame."""
    (xs, ys, zs), (xf, yf, zf) = K[k]["shell"], K[k]["frame"]
    path = (ys - 6.0) + (xs - X_EDGE) + 3.0 + GAP + math.hypot(xf - X_EDGE, RIM - yf) + abs(zs - zf)
    return math.ceil(path * BEND / 10.0) * 10.0


def k_closed(k):
    return math.dist(K[k]["shell"], K[k]["frame"])


# Pi 5 on the display's stand-offs: GPIO header on its left edge (x -28), pin 1 at the top, USB-A ports at the bottom
def pin(n):
    return (-25.8 if n % 2 == 0 else -23.2, 36.0, 170.1 - ((n - 1) // 2) * 2.54)


# lanes. Shell: T the distribution lane under the Wago row, L the left lane, R the right lane, M the trunk up from the power
# inlet, RH across the 5 V supply's terminals, H across at z 112 to the dimmer and K2, G down the Gledopto's left side.
# Front: FT along the top behind the frame, FL down its left edge to K1, UB along the upper cross bar, GD down beside the
# Pi's GPIO header, LB under the Pi's USB-A ports to K2.
T = lambda x: (x, 50.0, 250.0)
L = lambda z: (-45.0, 50.0 if z >= 165 else 44.0, z)        # in front of the speaker and the Gledopto below z 165
R = lambda z: (72.0, 52.0, z)
M = lambda z: (0.0, 50.0, z)
RH = lambda x: (x, 48.0, 156.0)
Hh = lambda x: (x, 50.0 if x <= -66 else 44.0, 112.0)       # across the Gledopto: in front of it
G = lambda z: (-62.0, 46.0, z)                              # beside the Gledopto, in front of its tray wall
RS = lambda z: (88.0, 48.0, z)                              # right of the 5 V supply, from its output end (bottom) up
FT = lambda x: (x, 36.0, 296.0)
FL = lambda z: (-80.0, 36.0, z)
UB = lambda x: (x, 34.0, 230.5)
GD = lambda z: (-40.0, 36.0, z)
LB = lambda x: (x, 30.0, 84.0)
K1s, K1f, K2s, K2f = K["K1"]["shell"], K["K1"]["frame"], K["K2"]["shell"], K["K2"]["frame"]
P = {
    "jack": (0.0, 60.0, 77.0), "strain": (0.0, 60.0, 87.0),
    # RSD-60G-5 (Esben's photo 27 Oct): DC IN (FG, V-, V+) at its top end, DC OUT (+V, -V) at its bottom end, screws to the front
    "psu_vin+": (48.0, 43.0, 145.0), "psu_vin-": (39.0, 43.0, 145.0), "psu_v+": (46.0, 40.0, 17.0), "psu_v-": (54.5, 40.0, 17.0),
    # DFR0457 on the left wall: screw terminals at its top end (VOUT nearest the front, GND, VIN nearest the back wall),
    # the Gravity plug at its bottom end
    "dim_vout": (-100.0, 42.0, 104.0), "dim_gnd": (-100.0, 50.0, 104.0), "dim_vin": (-100.0, 58.0, 104.0),
    "dim_grav": (-100.0, 44.0, 64.0),
    # Gledopto: input V+/V- at the bottom end, OUTPUT (V+, GPIO16, GPIO2, GND) and USB-C at the top end
    "wled_in": (-44.0, 50.0, 19.0), "wled_out": (-45.7, 50.0, 123.0), "wled_usb": (-28.5, 55.0, 125.0),
    "reed": (-66.0, 58.0, 46.0), "g4_usb": (-72.0, 58.0, 166.0),
    # XVF3800 lying, FPC down (photo 27 Oct): USB-C and aux jack on the top edge, SPEAKER plug and the mic FPC on the bottom edge
    "core_usb": (3.0, 56.0, 200.0), "core_aux": (-23.0, 56.0, 196.0), "core_spk": (22.0, 54.0, 150.0),
    "spk": (-41.0, 58.0, 143.0),
    "imu": (89.0, 62.0, 160.0),                    # v36: right of the 5 V supply, pins on its top edge (until v35: (0, 62, 231))
    # v36: inline fuse holder on the right wall (x 92-106, z 52-86), leads out of both ends
    "fuse_lo": (99.0, 58.0, 44.0), "fuse_hi": (99.0, 58.0, 94.0),
    # front unit
    "usb_a1": (-19.0, 26.0, 84.0), "usb_a2": (-1.0, 26.0, 84.0), "usb_a3": (-19.0, 30.0, 82.0),   # 90 deg plugs, cable out to the left
    "usb_c_pi": (50.0, 20.0, 167.0),               # Pi's power socket on its right edge, straight plug
    # strip leads through the frame's lead slots at the ends of the top run (v36; until v35 a Ø4 hole at x +-19.5),
    # white 1 + RGB left, white 2 right
    "hole_l": (-19.0, 33.0, 293.9), "hole_r": (19.0, 33.0, 293.9),
    "dsp_pwr": (12.0, 18.0, 205.0),                # Touch Display 2: power plug beside its flat cable
}
TO_K1 = [T(-85.0), K1s, "K1", K1f]                 # shell -> front through K1 (reversed for the other way)
TO_K2 = [Hh(-80.0), K2s, "K2", K2f]
DOWN_L = [T(-45.0), L(222.0), L(170.0), L(112.0)]  # distribution lane -> left lane -> H
UP_R = [RH(72.0), R(200.0), R(245.0)]              # RH -> right lane -> distribution lane
PSU_OUT = [(64.0, 38.5, 15.5), (84.0, 40.0, 15.5), RS(30.0), RS(100.0), RS(140.0), (80.0, 50.0, 154.0), RH(72.0)]   # off DC OUT, along the supply's bottom end above its tray stop (z 13), up its right side


def rev(r):
    return list(reversed(r))


def w(n, dx=0.0):
    return [T(WAGO[n] + dx), wago(n, dx)]


# --------------------------------------------------------------------- cables ----
# id, group, what, from, to, kind, colour, route (points; "K1"/"K2" = the hinge bundle), end allowance (mm per end in a clamp)
RED, BLK, ORG, GRY, GRN, WHT = "#d62828", "#222222", "#e67700", "#868e96", "#2f9e44", "#adb5bd"
BLU = "#1c7ed6"
TRUNK = [P["jack"], P["strain"], M(112.0), M(124.0), M(136.0), M(156.0)]
CABLES = [
    # 24 V side
    # v36: the fuse holder sits low on the right wall; P1 comes over the 5 V supply and down the right edge to its lower lead,
    # P1b leaves its upper lead up the right lane (until v35 the holder hung loose in P1)
    ("P1", "24 V", "hunstik + → sikringsholder (nederste ledning)", "hunstik +", "sikring 3 A", "1,5 mm² rød", RED,
     TRUNK + [RH(72.0), (104.0, 50.0, 156.0), (104.0, 50.0, 96.0), (106.0, 52.0, 40.0), P["fuse_lo"]], 15),
    ("P1b", "24 V", "sikringsholder (øverste ledning) → W1", "sikring 3 A", "W1", "1,5 mm² rød", RED,
     [P["fuse_hi"], RS(100.0), RS(140.0), (80.0, 50.0, 154.0)] + UP_R + w("W1"), 15),
    ("P2", "24 V", "hunstik − → W2", "hunstik −", "W2", "1,0 mm² sort", BLK, TRUNK + UP_R + w("W2"), 15),
    ("P3", "24 V", "W1 → 5 V-forsyning +Vin", "W1", "RSD-60G-5 +Vin", "1,0 mm² rød", RED, rev(w("W1", -3)) + rev(UP_R) + [RH(18.0), P["psu_vin+"]], 15),
    ("P4", "24 V", "W2 → 5 V-forsyning −Vin", "W2", "RSD-60G-5 −Vin", "1,0 mm² sort", BLK, rev(w("W2", -3)) + rev(UP_R) + [RH(26.0), P["psu_vin-"]], 15),
    ("P5", "5 V", "5 V-forsyning +V → W3", "RSD-60G-5 +V", "W3", "1,0 mm² rød, orange tape", ORG, [P["psu_v+"]] + PSU_OUT + UP_R[1:] + w("W3"), 15),
    ("P6", "5 V", "5 V-forsyning −V → W4", "RSD-60G-5 −V", "W4", "1,0 mm² sort", BLK, [P["psu_v-"]] + PSU_OUT + UP_R[1:] + w("W4"), 15),
    ("P7", "GND", "bro W4 → W2 (fælles GND)", "W4", "W2", "1,0 mm² sort", BLK, rev(w("W4", 6)) + w("W2", -6), 15),
    ("P8", "GND", "bro W2 → W5 (hvid −)", "W2", "W5", "1,0 mm² sort", BLK, rev(w("W2", 6)) + w("W5", 4), 15),
    ("P9", "24 V", "W1 → dæmper VIN", "W1", "DFR0457 VIN", "0,75 mm² rød", RED, rev(w("W1", 3)) + DOWN_L + [Hh(-90.0), (-100.0, 58.0, 112.0), P["dim_vin"]], 15),
    ("P10", "GND", "W2 → dæmper GND", "W2", "DFR0457 GND", "0,75 mm² sort", BLK, rev(w("W2", 3)) + DOWN_L + [Hh(-90.0), (-100.0, 50.0, 112.0), P["dim_gnd"]], 15),
    ("P11", "hvid", "dæmper VOUT → W6", "DFR0457 VOUT", "W6", "0,75 mm² rød, hvid tape", GRY, [P["dim_vout"], (-100.0, 42.0, 112.0), Hh(-90.0)] + rev(DOWN_L) + w("W6"), 15),
    # 5 V side
    ("P12", "5 V", "W3 → Pi USB-C (pigtail: rød i W3, sort i W4)", "W3 + W4", "Pi 5 USB-C", "USB-C-pigtail 2 × 0,75 mm²", ORG,
     rev(w("W3")) + TO_K1 + [UB(-24.0), (-22.0, 40.0, 232.0), (22.0, 40.0, 232.0), UB(24.0), UB(34.0), UB(45.0), (45.0, 30.0, 175.0), P["usb_c_pi"]], 15),
    ("P13", "5 V", "W3 → RGB-styring V+", "W3", "Gledopto V+", "0,75 mm² rød, orange tape", ORG,
     rev(w("W3", 4)) + DOWN_L + [Hh(-62.0), G(30.0), (-50.0, 46.0, 22.0), P["wled_in"]], 15),
    ("P14", "GND", "W4 → RGB-styring V−", "W4", "Gledopto V−", "0,75 mm² sort", BLK,
     rev(w("W4", -4)) + DOWN_L + [Hh(-62.0), G(30.0), (-50.0, 46.0, 22.0), P["wled_in"]], 15),
    # strips (their own leads, through K1)
    ("S1", "RGB", "RGB-strip +5 V (rød) → W3", "RGB-strip", "W3", "strippens ledning", ORG,
     [P["hole_l"], FT(-80.0), FL(240.0), K1f, "K1", K1s, T(-85.0)] + w("W3", -6), 15),
    ("S2", "RGB", "RGB-strip GND (hvid) → W4", "RGB-strip", "W4", "strippens ledning", BLK,
     [P["hole_l"], FT(-80.0), FL(240.0), K1f, "K1", K1s, T(-85.0)] + w("W4", -8), 15),
    ("S3", "RGB", "RGB-strip data (grøn) → RGB-styring GPIO16", "RGB-strip", "Gledopto GPIO16", "strippens ledning", GRN,
     [P["hole_l"], FT(-80.0), FL(240.0), K1f, "K1", K1s, T(-45.0), L(222.0), L(170.0), L(130.0), P["wled_out"]], 10),
    ("S4", "hvid", "hvid strip 1 + → W6", "hvid strip 1", "W6", "strippens ledning", RED,
     [P["hole_l"], FT(-80.0), FL(240.0), K1f, "K1", K1s, T(-85.0)] + w("W6", -4), 15),
    ("S5", "hvid", "hvid strip 1 − → W5", "hvid strip 1", "W5", "strippens ledning", BLK,
     [P["hole_l"], FT(-80.0), FL(240.0), K1f, "K1", K1s, T(-85.0)] + w("W5", -4), 15),
    ("S6", "hvid", "hvid strip 2 + → W6", "hvid strip 2", "W6", "strippens ledning", RED,
     [P["hole_r"], FT(19.5), FT(-80.0), FL(240.0), K1f, "K1", K1s, T(-85.0)] + w("W6", 4), 15),
    ("S7", "hvid", "hvid strip 2 − → W5", "hvid strip 2", "W5", "strippens ledning", BLK,
     [P["hole_r"], FT(19.5), FT(-80.0), FL(240.0), K1f, "K1", K1s, T(-85.0)] + w("W5"), 15),
    # data
    ("U1", "USB", "Pi USB-A → RGB-styring USB-C (styring)", "Pi 5 USB-A", "Gledopto USB-C", "USB-A 90° venstre → USB-C", BLU,
     [P["usb_a1"], LB(-76.0), K2f, "K2", K2s, Hh(-80.0), Hh(-62.0), L(112.0), L(140.0), (-28.5, 46.0, 146.0), P["wled_usb"]], 0),
    ("U2", "USB", "Pi USB-A → mikrofon-kerne USB-C", "Pi 5 USB-A", "XVF3800 USB-C", "USB-A 90° venstre → USB-C", BLU,
     [P["usb_a2"], LB(-76.0), K2f, "K2", K2s, Hh(-80.0), L(112.0), L(170.0), L(204.0), (3.0, 50.0, 208.0), P["core_usb"]], 0),
    ("U3", "USB", "Pi USB-A → 4G-modem (tilvalg)", "Pi 5 USB-A", "4G-modem", "USB-A 90° venstre → modemets stik", BLU,
     [P["usb_a3"], LB(-76.0), K2f, "K2", K2s, Hh(-80.0), L(112.0), L(160.0), (-72.0, 50.0, 160.0), P["g4_usb"]], 0),
    ("G1", "GPIO", "Pi ben 1, 12, 14 → dæmperens 3-polede stik", "Pi 5 GPIO", "DFR0457 Gravity", "3 ledere: Gravity-kabel + forlænger", BLU,
     [pin(12), GD(150.0), GD(78.0), (-76.0, 34.0, 78.0), K2f, "K2", K2s, (-88.0, 48.0, 58.0), (-100.0, 44.0, 58.0), P["dim_grav"]], 0),
    ("G2", "GPIO", "Pi ben 13, 17, 20 → reed (tilvalg)", "Pi 5 GPIO", "reed-modul", "3 dupont-ledere hun-hun", BLU,
     [pin(17), GD(146.0), GD(78.0), (-76.0, 34.0, 78.0), K2f, "K2", K2s, (-64.0, 56.0, 64.0), (-64.0, 56.0, 50.0), P["reed"]], 0),
    ("G3", "GPIO", "Pi ben 3, 4, 5, 7, 9 → stødsensor (tilvalg)", "Pi 5 GPIO", "LIS3DH", "5 dupont-ledere hun-hun", BLU,
     [pin(5), (-34.0, 36.0, 176.0), UB(-34.0), K1f, "K1", K1s, T(-85.0), T(72.0), R(200.0), R(166.0), (89.0, 56.0, 166.0), P["imu"]], 0),
    ("G4", "GPIO", "Pi ben 2, 6 → skærmens strøm", "Pi 5 GPIO", "Touch Display 2", "skærmens eget kabel", BLU,
     [pin(2), (-20.0, 30.0, 190.0), P["dsp_pwr"]], 0),
    ("A1", "lyd", "højttaler → mikrofon-kernens SPEAKER-stik (tilvalg)", "FIT0502", "XVF3800 SPEAKER", "højttalerens kabel", "#f97316",
     [P["spk"], (-35.0, 46.0, 146.0), (22.0, 46.0, 146.0), P["core_spk"]], 0),
]
LANES = {   # for the drawing: name, half, points
    "T": ("shell", [T(-88.0), T(80.0)]), "L": ("shell", [L(250.0), L(112.0)]), "R": ("shell", [R(250.0), R(156.0)]), "RS": ("shell", [(46.0, 38.5, 15.5), (84.0, 40.0, 15.5), RS(30.0), RS(140.0), (80.0, 50.0, 154.0)]),
    "RH": ("shell", [RH(0.0), RH(72.0)]), "M": ("shell", [M(87.0), M(156.0)]), "H": ("shell", [Hh(-90.0), Hh(-17.0)]),
    "G": ("shell", [G(112.0), G(30.0)]),
    "FT": ("front", [FT(19.5), FT(-80.0)]), "FL": ("front", [FL(296.0), FL(230.5)]), "UB": ("front", [UB(-76.0), UB(45.0)]),
    "GD": ("front", [GD(150.0), GD(78.0)]), "LB": ("front", [LB(-1.0), LB(-76.0)]),
}
FLAT = [   # flat cables: they stay on one half
    ("F1", "kamerakabel 22-pin → 15-pin, 300 mm (fladt)", "front"),
    ("F2", "skærmens flade kabel (følger med skærmen)", "front"),
    ("F3", "mikrofonstrippens flade kabel, 20 cm (følger med)", "skal"),
]


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
    L, k = route_length(route)
    L = L * (1.0 if k else BEND) + 2 * ends
    return L, int(math.ceil(L / 50.0) * 50), k


if __name__ == "__main__":
    for k in K:
        print(k, "loop", k_loop(k), "closed", round(k_closed(k)))
    for c in CABLES:
        L, cut, k = cut_length(c)
        print(f"{c[0]:4s} {c[2]:55s} {L:6.0f}  cut {cut:4d}  {k or ''}")
