#!/usr/bin/env python3
"""Strength check for the gen 2 theme hooks (v21): theme top and wings hanging in the four back-wall slots.

Hand calculation, no FEA: every load case is turned into forces on the hooks, and each hook's weak sections are checked
against ASA strengths with the layers where the print orientation puts them. Geometry from cad/gen2_concept.scad
(HOOK, WING_SLOT, WING_PK, WING_P); masses from the example parts' STLs if a directory is given (100 % solid, worst case).

Usage:  python3 hardware/tools/strength_hooks_gen2.py [dir with x_tema_top.stl, x_tema_vinge_v.stl] [--md out.md]
"""
import sys
from pathlib import Path

# geometry (mm), as in gen2_concept.scad
TONGUE_W, TONGUE_H, LIP_T, LIP_DROP, CLR = 4.0, 6.0, 5.0, 3.0, 0.25       # HOOK
WALL = 3.0                                                                 # BACK_T
SLOT_Z = (175.0, 240.2)                                                    # WING_P: lower / upper slot centre (floor 4 below)
UNHOOK = LIP_T + CLR + WALL                                                # travel back needed to come off
ROOM = {"top": 84 - 80.2, "vinge": 84 - 79.2}                              # strap back face to the wall behind the cleat
# ASA, FDM, 0.2 layers, conservative (datasheet XY ~ 40 MPa tensile; across layers ~ 1/3)
S_XY, S_Z, T_Z = 30.0, 12.0, 10.0                                          # MPa: in-plane, across layers, layer shear
KT = 1.2                                                                   # notch at the corners, with the 1 mm fillets in the CAD
TARGET = 2.0                                                               # wanted safety factor on the abuse loads
RHO = 1.07e-3                                                              # g/mm3

# Print orientation (PRINTGUIDE): theme parts face down, so the build axis is y (front to back). Then
#   tongue (along y): tension and its root shear are across / along layers -> S_Z, T_Z
#   lip (hangs in z, bends about x): bending stress along z, in plane -> S_XY
def capacities():
    a_t = TONGUE_W * TONGUE_H
    w_lip = TONGUE_W * LIP_T ** 2 / 6
    return {
        "Tunge, træk (på tværs af lag)": a_t * S_Z / KT,
        "Tunge, forskydning ved stroppen": a_t * T_Z,
        "Læbe, bøjning (i lagets plan)": S_XY * w_lip / (LIP_DROP / 2) / KT,
        "Bagvæg, tryk under læben": TONGUE_W * LIP_DROP * S_XY,
        "Slidsbund, tryk under tungen": TONGUE_W * WALL * S_XY,
    }


def loads(m_top, m_wing):
    g = 9.81e-3
    w_t, w_w = m_top * g, m_wing * g
    hz = SLOT_Z[1] - SLOT_Z[0]
    # each case: name, (force per hook pulling back out of the wall (lip), force down on a tongue (shear/bearing))
    c = {}
    c["Egenvægt, top"] = (0.0, w_t / 2)
    c["Egenvægt, vinge"] = (w_w * 35 / hz, w_w / 2)            # wing's centre ~35 mm in front of the hooks: a couple over the 65 mm
    # 50 N pulled straight forward at the top of the sign (80 above its base); it tips about the base's front edge (y 0, z 307)
    f, h, arm = 50.0, 80.0, 307 - (SLOT_Z[1] - 4 + TONGUE_H / 2)
    c["Top: 50 N træk fremad i skiltets overkant"] = ((f + f * h / arm) / 2, w_t / 2)
    # 50 N down on the wing's front outer corner (70 in front of the hooks): couple over the two hooks
    c["Vinge: 50 N ned på forreste yderhjørne"] = (50 * 70 / hz, (50 + w_w) / 2)
    # 50 N pulled forward on the wing: shared by its two lips, plus the tip about the rib's front edge (small)
    c["Vinge: 50 N træk fremad"] = (50 / 2 + 50 * 20 / hz, w_w / 2)
    # a child hanging 10 kg on the wing (100 N down at the panel, 25 in front of the side)
    c["Vinge: 100 N hængende i panelet"] = (100 * 70 / hz, (100 + w_w) / 2)
    return c


def main():
    args = sys.argv[1:]
    md = None
    if "--md" in args:
        i = args.index("--md"); md = Path(args[i + 1]); del args[i:i + 2]
    m_top, m_wing = 190.0, 110.0
    if args:
        import trimesh
        d = Path(args[0])
        m_top = trimesh.load(d / "x_tema_top.stl").volume * RHO
        m_wing = trimesh.load(d / "x_tema_vinge_v.stl").volume * RHO
    cap = capacities()
    lip_cap = min(cap["Læbe, bøjning (i lagets plan)"], cap["Tunge, træk (på tværs af lag)"], cap["Bagvæg, tryk under læben"])
    shear_cap = min(cap["Tunge, forskydning ved stroppen"], cap["Slidsbund, tryk under tungen"])
    out = [f"# Styrketest, temakroge gen 2 v21", "",
           f"Eksempeldele (100 % massive, værste fald): top {m_top:.0f} g, vinge {m_wing:.0f} g. ASA: {S_XY:.0f} MPa i lagets plan, "
           f"{S_Z:.0f} MPa på tværs af lag, {T_Z:.0f} MPa lagforskydning, kærvfaktor {KT} i hjørnet. Tema-dele printes med forsiden ned.", "",
           "## Hvad én krog kan tåle", "", "| Snit | Brudlast (N) |", "|---|---:|"]
    out += [f"| {k} | {v:.0f} |" for k, v in cap.items()]
    out += ["", f"Svageste ved træk ud af væggen: {lip_cap:.0f} N. Svageste nedad: {shear_cap:.0f} N.", "",
            "## Belastninger pr. krog", "", "| Tilfælde | Træk ud (N) | Ned (N) | Sikkerhed | OK |", "|---|---:|---:|---:|---|"]
    ok_all = True
    for name, (pull, down) in loads(m_top, m_wing).items():
        sf = min(lip_cap / pull if pull else 99, shear_cap / down if down else 99)
        ok = sf >= TARGET
        ok_all &= ok
        out.append(f"| {name} | {pull:.1f} | {down:.1f} | {min(sf, 99):.1f} | {'ja' if ok else 'NEJ'} |")
    out += ["", "## Kan delene tages af?", "",
            f"En krog skal 3 mm op og {UNHOOK:.2f} mm bagud for at komme fri. Når boksen hænger på vægbeslaget, er der kun "
            f"{ROOM['top']:.1f} mm (top) og {ROOM['vinge']:.1f} mm (vinge) bag stropperne: "
            + ("de kan ikke tages af, mens boksen hænger." if max(ROOM.values()) < UNHOOK else "DE KAN TAGES AF."), "",
            f"Mål for sikkerhed: mindst {TARGET:.0f}. " + ("Alle tilfælde er OK." if ok_all else "IKKE ALLE TILFÆLDE ER OK.")]
    text = "\n".join(out) + "\n"
    print(text)
    if md:
        md.write_text(text)
    return 0 if ok_all else 1


if __name__ == "__main__":
    sys.exit(main())
