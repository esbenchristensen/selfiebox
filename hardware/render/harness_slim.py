"""Cable harness of the slim variant (slim1, cad/gen2_slim.scad: 57 mm deep), built on harness_gen2.

Same cables, same Wago row, same hinge idea as the main box (the box opens like a book over its left side, every cable
between the halves crosses in K1 or K2), but every part has moved, so every point and lane is this variant's own:
  - the Pi sits on its own carrier low on the left (x -81.5..-25.5, z 101-188.5), header on its left edge, pin 1 at the top,
    USB-A ports at the bottom, USB-C on its right edge 11 mm below the top;
  - the 5 V supply stands between the cross bars right of the Pi (x -24..36, z 90-218), DC IN at the top, DC OUT at the bottom;
  - the Gledopto right of it (x 41-87), the 4G HAT over it (z 198-230), the dimmer flat on the back wall top left
    (x -77..-33, z 198-230), the fuse holder on its side on the left wall (z 119-169), the mic core low left, the speaker low
    right, the IMU on the right wall, the reed low left by the lock;
  - K1 from the upper bar's left end (-80, z 230.5) to the shell's loop at (-90, 215), K2 from the lower bar's left end
    (-76, z 70.5) to (-75, 92).
Lanes in the shell: T under the Wago row (z 250), LL up the left (x -80), ML up the middle between the dimmer and the 5 V
supply (x -29.5), BL across under the supply and the Gledopto (z 86, in front of the power column), R up the right (x 97).
In the front: FT/FL along the frame's top and down its left edge to K1, GL beside the Pi's GPIO header (x -82.5).
Coordinates as the CAD: x right seen from the front, y back (front face 0, back wall 54 inside), z up.
"""
import math

from harness_gen2 import (BEND, GAP, H, W, WAGO, WAGO_NAME, WAGO_TYPE, RED, BLK, ORG, GRY, GRN, BLU, rev, FLAT)  # noqa: F401

D = 57.0
X_EDGE = -W / 2
RIM = D - 6.0


def wago(n, dx=0.0):
    """Wago row on the wall cleat's block: entry face z 262, levers to the front (slim1: block face y 45, clamps y 36-44)."""
    return (WAGO[n] + dx, 39.5, 262.0)


T = lambda x: (x, 37.0, 250.0)
LL = lambda z: (-80.0, 48.0, z)
ML = lambda z: (-31.2, 41.0, z)        # in front of the dimmer and the 5 V tray's catch, behind the fan guard
BL = lambda x: (x, 33.0, 86.0)
R = lambda z: (97.0, 48.0 if z < 158 else 41.5 if z < 192 else 37.0, z)   # in front of the wing pocket's boss (z 165-188) and the 4G
FT = lambda x: (x, 34.0, 295.0)
FL = lambda z: (-86.0, 34.0, z)
GL = lambda z: (-82.5, 34.0, z)


def w(n, dx=0.0):
    return [T(WAGO[n] + dx), wago(n, dx)]


K = {"K1": {"shell": (-90.0, 47.5, 215.0), "frame": (-80.0, 34.0, 230.5)},
     "K2": {"shell": (-75.0, 47.5, 92.0), "frame": (-76.0, 34.0, 70.5)}}
K_FOLD = {"K1": (-92.0, -1), "K2": (-86.0, 1)}    # admin viewer: x of the closed bundle's fold, and which way it runs
LABELS = {
    "pi": "Raspberry Pi 5 på sin egen holder (Pi-holder), lavt i venstre side",
    "blaeserhegn": "Blæserhegn (sort): klikkes på bagrammens øverste tværstykke over Pi'en, rist 3 mm over blæseren",
    "stik": "Strømindgang i bunden (x 17,65): hunstik med skrueklemmer i åben kanal, stik nedefra",
    "sikring": "Sikringsholder (inline, 3 A) liggende på venstre side",
    "daemper": "Dæmper hvidt lys (DFRobot DFR0457), fladt på bagvæggen øverst til venstre",
    "skruer_front": "4 skruer, front (4,0 × 40 T20, forsænket)",
    "sensor": "Stødsensor på højre sidevæg",
}


def k_loop(k):
    """Strap to strap, front open (as harness_gen2.k_loop, with this variant's depth and ends)."""
    (xs, ys, zs), (xf, yf, zf) = K[k]["shell"], K[k]["frame"]
    path = (ys - 6.0) + (xs - X_EDGE) + 3.0 + GAP + math.hypot(xf - X_EDGE, RIM - yf) + abs(zs - zf)
    return math.ceil(path * BEND / 10.0) * 10.0


def k_closed(k):
    return math.dist(K[k]["shell"], K[k]["frame"])


def pin(n):
    """Pi 5 GPIO pin: header on the Pi's left edge (x -78), pin 1 at the top (z 180.1), plugs reach y 36."""
    return (-76.7 if n % 2 == 0 else -79.3, 36.0, 180.1 - ((n - 1) // 2) * 2.54)


K1s, K1f, K2s, K2f = K["K1"]["shell"], K["K1"]["frame"], K["K2"]["shell"], K["K2"]["frame"]
P = {
    "jack": (17.65, 46.0, 77.0), "strain": (17.65, 46.0, 87.0),
    # RSD-60G-5 standing, screws to the front: DC IN (V-, V+) at its top end, DC OUT (+V, -V) at its bottom end
    "psu_vin+": (12.0, 30.0, 219.2), "psu_vin-": (3.0, 30.0, 219.2), "psu_v+": (10.0, 29.0, 89.2), "psu_v-": (18.5, 29.0, 89.2),
    # DFR0457 flat on the back wall: screw terminals at its left end (VIN top, GND, VOUT bottom), Gravity plug at its right end
    "dim_vin": (-79.0, 44.0, 222.0), "dim_gnd": (-79.0, 44.0, 214.0), "dim_vout": (-79.0, 44.0, 205.0),
    "dim_grav": (-31.0, 44.0, 214.0),
    # Gledopto: input at the bottom end, OUTPUT and USB-C at the top end
    "wled_in": (54.5, 37.0, 88.0), "wled_out": (52.8, 36.0, 186.0), "wled_usb": (70.0, 40.0, 186.0),
    "reed": (-67.0, 44.0, 46.0), "g4_usb": (38.0, 45.0, 214.0),
    # XVF3800 lying low left: USB-C and aux on the top edge, SPEAKER plug and the mic FPC on the bottom edge
    "core_usb": (-29.6, 43.0, 70.0), "core_aux": (-55.6, 43.0, 70.0), "core_spk": (-10.6, 38.0, 12.0),
    "spk": (34.0, 38.0, 61.0),
    "imu": (103.0, 43.0, 153.0),                   # on the right wall, pins on its top edge
    "fuse_lo": (-101.65, 47.0, 116.0), "fuse_hi": (-101.65, 47.0, 172.0),
    # front unit: the Pi's 90 deg USB plugs (cable out to the left), its USB-C (straight plug) and the display's power plug
    "usb_a1": (-72.5, 26.0, 94.0), "usb_a2": (-54.5, 26.0, 94.0), "usb_a3": (-72.5, 30.0, 92.0),
    "usb_c_pi": (-3.5, 20.0, 177.3),
    "hole_l": (-19.0, 33.0, 293.9), "hole_r": (19.0, 33.0, 293.9),
    "dsp_pwr": (12.0, 13.0, 205.0),
}
TRUNK = [P["jack"], P["strain"], (17.65, 38.0, 87.0)]       # up out of the strain relief, forward under the 5 V supply
TO_LEFT = [T(-80.0), (-82.0, 48.0, 246.0)]                 # Wago row -> left, down past the dimmer's terminals
UP_K1 = [K1s, (-84.0, 48.0, 244.0), T(-80.0)]               # shell's K1 loop -> distribution lane
STRIP = [K1f, "K1"] + UP_K1
STRIPS_L = [P["hole_l"], FT(-86.0), FL(240.0)] + STRIP
STRIPS_R = [P["hole_r"], FT(19.5), FT(-86.0), FL(240.0)] + STRIP
K2_SHELL = [K2s, (-62.0, 40.0, 87.0), BL(-30.0)]             # shell's K2 loop -> across under the 5 V supply
PSU_OUT = [BL(14.0), BL(-31.2), ML(95.0), ML(160.0), ML(240.0)]   # DC OUT down, left under the supply, up the middle lane
UP_R = [R(195.0), R(240.0), T(97.0)]
BL_R = [BL(80.0), (92.0, 44.0, 80.0), R(100.0)]           # off BL's right end under the Gledopto's arms, over the speaker                         # right lane -> distribution lane

CABLES = [
    # 24 V side
    ("P1", "24 V", "hunstik + → sikringsholder (nederste ledning)", "hunstik +", "sikring 3 A", "1,5 mm² rød", RED,
     TRUNK + [BL(-30.0), BL(-78.0), (-95.0, 47.0, 100.0), P["fuse_lo"]], 15),
    ("P1b", "24 V", "sikringsholder (øverste ledning) → W1", "sikring 3 A", "W1", "1,5 mm² rød", RED,
     [P["fuse_hi"], (-98.0, 42.0, 176.0), (-84.0, 42.0, 186.0), LL(196.0), (-82.0, 48.0, 244.0), T(-80.0)] + w("W1"), 15),
    ("P2", "24 V", "hunstik − → W2", "hunstik −", "W2", "1,5 mm² sort", BLK, TRUNK + [BL(30.0)] + BL_R + [R(160.0)] + UP_R + w("W2"), 15),
    ("P3", "24 V", "W1 → 5 V-forsyning +Vin", "W1", "RSD-60G-5 +Vin", "1,5 mm² rød", RED,
     rev(w("W1", -3)) + [T(12.0), (12.0, 36.0, 224.0), P["psu_vin+"]], 15),
    ("P4", "24 V", "W2 → 5 V-forsyning −Vin", "W2", "RSD-60G-5 −Vin", "1,5 mm² sort", BLK,
     rev(w("W2", -3)) + [T(3.0), (3.0, 36.0, 224.0), P["psu_vin-"]], 15),
    ("P5", "5 V", "5 V-forsyning +V → W3", "RSD-60G-5 +V", "W3", "1,5 mm² rød, orange tape", ORG, [P["psu_v+"], (10.0, 33.0, 86.0)] + PSU_OUT + w("W3"), 15),
    ("P6", "5 V", "5 V-forsyning −V → W4", "RSD-60G-5 −V", "W4", "1,5 mm² sort", BLK, [P["psu_v-"], (18.5, 33.0, 86.0)] + PSU_OUT + w("W4"), 15),
    ("P7", "GND", "bro W4 → W2 (fælles GND)", "W4", "W2", "1,5 mm² sort", BLK, rev(w("W4", 6)) + w("W2", -6), 15),
    ("P8", "GND", "bro W2 → W5 (hvid −)", "W2", "W5", "1,5 mm² sort", BLK, rev(w("W2", 6)) + w("W5", 4), 15),
    ("P9", "24 V", "W1 → dæmper VIN", "W1", "DFR0457 VIN", "0,75 mm² rød", RED, rev(w("W1", 3)) + TO_LEFT + [P["dim_vin"]], 15),
    ("P10", "GND", "W2 → dæmper GND", "W2", "DFR0457 GND", "0,75 mm² sort", BLK, rev(w("W2", 3)) + TO_LEFT + [P["dim_gnd"]], 15),
    ("P11", "hvid", "dæmper VOUT → W6", "DFR0457 VOUT", "W6", "0,75 mm² rød, hvid tape", GRY, [P["dim_vout"]] + rev(TO_LEFT) + w("W6"), 15),
    # 5 V side: the Pi's power crosses in K1, then in front of the upper bar and the fan guard (y 16) to its USB-C
    ("P12", "5 V", "W3 → Pi USB-C (pigtail: rød i W3, sort i W4)", "W3 + W4", "Pi 5 USB-C", "USB-C-pigtail 2 × 0,75 mm²", ORG,
     rev(w("W3")) + rev(UP_K1) + ["K1", K1f, (-80.0, 35.0, 219.0), (-80.0, 21.0, 219.0), (-60.0, 16.0, 214.0), (-3.5, 16.0, 214.0), (-3.5, 20.0, 190.0), P["usb_c_pi"]], 15),
    ("P13", "5 V", "W3 → RGB-styring V+", "W3", "Gledopto V+", "0,75 mm² rød, orange tape", ORG,
     rev(w("W3", 4)) + rev(UP_R) + [R(160.0), R(100.0), (92.0, 44.0, 80.0), (60.0, 40.0, 80.0), P["wled_in"]], 15),
    ("P14", "GND", "W4 → RGB-styring V−", "W4", "Gledopto V−", "0,75 mm² sort", BLK,
     rev(w("W4", -4)) + rev(UP_R) + [R(160.0), R(100.0), (92.0, 44.0, 80.0), (60.0, 40.0, 80.0), P["wled_in"]], 15),
    # strips (their own leads, through K1): white 1 + RGB from the left lead slot, white 2 from the right
    ("S1", "RGB", "RGB-strip +5 V (rød) → W3", "RGB-strip", "W3", "strippens ledning", ORG, STRIPS_L + w("W3", -6), 15),
    ("S2", "RGB", "RGB-strip GND (hvid) → W4", "RGB-strip", "W4", "strippens ledning", BLK, STRIPS_L + w("W4", -8), 15),
    ("S3", "RGB", "RGB-strip data (grøn) → RGB-styring GPIO16", "RGB-strip", "Gledopto GPIO16", "strippens ledning", GRN,
     STRIPS_L + [T(52.8), (52.8, 36.0, 236.0), P["wled_out"]], 10),
    ("S4", "hvid", "hvid strip 1 + → W6", "hvid strip 1", "W6", "strippens ledning", RED, STRIPS_L + w("W6", -4), 15),
    ("S5", "hvid", "hvid strip 1 − → W5", "hvid strip 1", "W5", "strippens ledning", BLK, STRIPS_L + w("W5", -4), 15),
    ("S6", "hvid", "hvid strip 2 + → W6", "hvid strip 2", "W6", "strippens ledning", RED, STRIPS_R + w("W6", 4), 15),
    ("S7", "hvid", "hvid strip 2 − → W5", "hvid strip 2", "W5", "strippens ledning", BLK, STRIPS_R + w("W5"), 15),
    # data: the USB ports face down, so the 90 deg plugs send their cables left to K2 on the lower bar
    ("U1", "USB", "Pi USB-A → RGB-styring USB-C (styring)", "Pi 5 USB-A", "Gledopto USB-C", "USB-A 90° venstre → USB-C", BLU,
     [P["usb_a1"], (-80.0, 30.0, 92.0), (-80.0, 35.0, 78.0), K2f, "K2"] + K2_SHELL + BL_R + [R(160.0), R(186.0), (90.0, 40.0, 190.0), P["wled_usb"]], 0),
    ("U2", "USB", "Pi USB-A → mikrofon-kerne USB-C", "Pi 5 USB-A", "XVF3800 USB-C", "USB-A 90° venstre → USB-C", BLU,
     [P["usb_a2"], (-80.0, 30.0, 92.0), (-80.0, 35.0, 78.0), K2f, "K2", K2s, (-40.0, 42.0, 82.0), P["core_usb"]], 0),
    ("U3", "USB", "Pi USB-A → 4G-modem (tilvalg)", "Pi 5 USB-A", "4G-modem", "USB-A 90° venstre → modemets stik", BLU,
     [P["usb_a3"], (-80.0, 30.0, 92.0), (-80.0, 35.0, 78.0), K2f, "K2"] + K2_SHELL + [ML(95.0), ML(222.0), (-20.0, 40.0, 223.0), (36.0, 40.0, 223.0), P["g4_usb"]], 0),
    ("G1", "GPIO", "Pi ben 1, 12, 14 → dæmperens 3-polede stik", "Pi 5 GPIO", "DFR0457 Gravity", "3 ledere: Gravity-kabel + forlænger", BLU,
     [pin(12), GL(168.0), GL(222.0), K1f, "K1", K1s, (-84.0, 44.0, 233.0), (-31.0, 44.0, 233.0), P["dim_grav"]], 0),
    ("G2", "GPIO", "Pi ben 13, 17, 20 → reed (tilvalg)", "Pi 5 GPIO", "reed-modul", "3 dupont-ledere hun-hun", BLU,
     [pin(17), GL(160.0), GL(80.0), K2f, "K2", K2s, (-62.0, 44.0, 64.0), P["reed"]], 0),
    ("G3", "GPIO", "Pi ben 3, 4, 5, 7, 9 → stødsensor (tilvalg)", "Pi 5 GPIO", "LIS3DH", "5 dupont-ledere hun-hun", BLU,
     [pin(5), GL(175.0), GL(80.0), K2f, "K2"] + K2_SHELL + BL_R + [R(150.0), P["imu"]], 0),
    ("G4", "GPIO", "Pi ben 2, 6 → skærmens strøm", "Pi 5 GPIO", "Touch Display 2", "skærmens eget kabel (for kort: 2 dupont-ledere hun-hun, 20 cm)", BLU,
     [pin(2), (-76.7, 36.0, 193.0), (-76.7, 19.0, 195.0), (0.0, 16.0, 200.0), P["dsp_pwr"]], 0),
    ("A1", "lyd", "højttaler → mikrofon-kernens SPEAKER-stik (tilvalg)", "FIT0502", "XVF3800 SPEAKER", "højttalerens kabel", "#f97316",
     [P["spk"], (28.0, 33.0, 50.0), (8.0, 33.0, 33.0), (-8.0, 36.0, 20.0), P["core_spk"]], 0),
]

# the mic board's flat cable (20 cm, standard): out of the pocket backwards, up in front of the mic core's lower edge
MIC_FPC = ("mikrofoner", "Mikrofonstrip → kerne", 1.2,
           [(-0.7, 22.2, 3.6), (-0.7, 33.0, 3.6), (-0.7, 33.5, 14.0), (-27.3, 34.0, 14.0), (-27.3, 40.0, 14.5)])

# flat cables in the front unit: the camera's goes behind the frame's top band, down between the frame and the Wago row,
# over the fan guard and down behind it to the Pi; the display's (slim1: a longer one, 200 mm) runs left from the display's
# socket in the gap between the display's back and the fan guard and folds down into the Pi's socket
RIBBONS = [
    ("kamera", "Kamerakabel (fladt, 16 mm, 300 mm)", 16, 0.3, [((9.6, 11.15, 290), (0, 0, 1)), ((11.5, 11.65, 290), (0, 0, 1)),
        ((12.6, 13.95, 290), (0, 0, 1)), ((12.6, 33.6, 290), (0, 0, 1)), ((12.6, 33.6, 270), (1, 0, 0)), ((0, 33.6, 250), (1, 0, 0)),
        ((-40, 38.5, 245), (0.3, 0, 1)), ((-48.5, 38.5, 238), (1, 0, 0)), ((-48.5, 37.9, 200), (1, 0, 0))]),
    ("skaerm", "Skærmkabel (fladt, 22-polet mini-mini 200 mm)", 11.5, 0.3, [((0, 10.8, 205), (1, 0, 0)), ((0, 11.3, 201), (1, 0, 0)),
        ((-6, 12.0, 203), (0, 0, 1)), ((-45, 13.0, 203), (0, 0, 1)), ((-53.5, 14.0, 203), (1, 0, 0)), ((-53.5, 17.4, 198), (1, 0, 0)),
        ((-53.5, 19.4, 196.5), (1, 0, 0))]),
]

LANES = {   # for the drawing: name, half, points
    "T": ("shell", [T(-84.0), T(97.0)]), "LL": ("shell", [LL(182.0), LL(246.0)]), "ML": ("shell", [ML(95.0), ML(240.0)]),
    "BL": ("shell", [BL(-78.0), BL(80.0)]), "R": ("shell", [R(100.0), R(240.0)]),
    "FT": ("front", [FT(19.5), FT(-86.0)]), "FL": ("front", [FL(295.0), FL(240.0)]), "GL": ("front", [GL(80.0), GL(222.0)]),
}


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
    import harness_gen2 as hz
    for k in K:
        print(k, "loop", k_loop(k), "closed", round(k_closed(k)))
    old = {c[0]: hz.cut_length(c)[1] for c in hz.CABLES}
    for c in CABLES:
        L_, cut, k = cut_length(c)
        print(f"{c[0]:4s} {c[2]:55s} {L_:6.0f}  cut {cut:4d}  (v42 {old.get(c[0], 0):4d})  {k or ''}")
