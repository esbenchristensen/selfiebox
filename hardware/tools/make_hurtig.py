#!/usr/bin/env python3
"""Hurtigprint set for a released gen 2 version (prototype/MVP fit tests): <version>-hurtig.

The rules are in hardware/docs/HURTIGPRINT.md. In short: the geometry is never redrawn. The hurtig set is
the released print files 1:1 (same fit, holes, posts and holders), printed with a draft profile, plus small
test pieces ("proeve") cut out of the released parts round the places where something has to fit. A test
piece is a box cut of one part, so it always matches the version it came from.

Where the test pieces sit comes from the version's 3D model (<version>_3d.glb, assembled coordinates):
each one is a box round one or more bought parts (node names from render/gen2_viewer.py) or a fixed
region, cut out of each printed part listed with it. The box always runs down to the face the part
stands on in its print orientation, so the piece prints flat and in one body.

Usage:  python3 hardware/tools/make_hurtig.py [version]   (default: the newest hardware/stl/gen2/halo-gen2-v<N>)
Output: hardware/stl/gen2-hurtig/<version>-hurtig/ with the STLs, the multi-colour front as a 3MF
        (<version>-hurtig_front_flerfarvet.3mf, see make_3mf.py) and PRINTGUIDE_<version>-hurtig.md.
        With prusa-slicer on the PATH it also estimates print times (draft profile, H2C-like speeds).
Needs:  trimesh, manifold3d, numpy, networkx
"""
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

import numpy as np
import trimesh

from make_3mf import FRONT_PARTS, front_3mf

HW = Path(__file__).resolve().parents[1]
GEN2, OUT_ROOT = HW / "stl" / "gen2", HW / "stl" / "gen2-hurtig"

# print file suffix -> node in <version>_3d.glb. The logo inlays (LOGO) are copied as well, as separate colour
# bodies with the front's origin, and put together with the front in one 3MF; a slicer needs one body per colour.
PARTS = {"skal": "skal", "front": "front", "bagramme": "ledskinne", "lysring": "lysring",
         "vaegbeslag": "vaegbeslag"}   # v19: no printer cap (no printer under the box)
LOGO = [suffix for suffix, *_ in FRONT_PARTS if suffix != "front"]

# Corner region (glTF x, y; seen from the front, bottom left): one front screw, the shell/front joint and the ring corner.
CORNER = ((-200, -200), (-46, -88))
# name, parts, box (glTF x/y from these nodes + margin, or a fixed region), height, what it tests
#   height: "fuld" = the whole part; a number = mm above the plate in print orientation;
#           "+m" = up to the top of the listed nodes in print orientation + m mm
COUPONS = [
    ("stroem-ledstyring", ["skal"], ["stroem", "ledstyring"], 8, "+6",
     "5 V-forsyningen og WLED-styringen klikkes i deres bakker. v17: WLED-styringen med udgangen opad; går den ned, klikker kanterne over låget, og står den fast på langs mellem de 2 stop ved armspidserne? Sidder begge fast, også når stykket vendes?"),
    ("daemper", ["skal"], ["daemper"], 8, "+6",
     "Dæmperen (DFR0457) i bakken på venstre væg. Er der plads til skrueklemmen?"),
    ("stroemindgang", ["skal"], ["stik"], 8, "+6",
     "Røret i bunden: hunstikket (TRU DC-13F) trykkes ned ovenfra og klikker under de 2 snaplåse, og GST-proppen går "
     "helt op i røret nedefra."),
    ("hoejttaler", ["skal"], ["hoejttaler"], 8, "+6", "Højttaleren (FIT0502) i sin bakke bag gitteret."),
    ("laas-reed", ["skal"], ["skrue_laas", "reed"], 10, "+6",
     "Låseslidsen, låseskruens hul i bunden og reed-modulets bakke. Prøves med vægbeslagets låsetunge."),
    ("laasetunge", ["vaegbeslag"], ["skrue_laas"], 14, "fuld",
     "Låsetungen på vægbeslaget. Den skal gå ind i skallens låseslids, og låseskruen skal kunne skrues i."),
    ("4g", ["skal"], ["modem4g"], 8, "+6", "4G-modemet i sin bakke (tilvalg)."),
    ("mikrofonkerne", ["skal"], ["lydkerne"], 8, "+6",
     "Mikrofon-kernen (XVF3800) ligger ned i sin bakke, og stikket i underkanten går fri gennem åbningen (tilvalg)."),
    ("stoedsensor", ["skal"], ["sensor"], 8, "+6", "Stødsensoren (LIS3DH) i sin bakke (tilvalg)."),
    ("mikrofonstrip", ["skal"], ["mikrofoner"], 8, "+6",
     "Mikrofonkortet i lommen i bunden med Seeed-logoet nedad: pindene gennem hullerne, kortet fladt på de 4 ringe, "
     "kablet fladt ud bagtil (tilvalg)."),
    ("kamera", ["front", "bagramme"], ["kamera", "klikstik"], 8, "fuld",
     "Kameraet på frontens tappe, linsen midt i hullet, bagrammens rør trykker printet ned, "
     "kamerakablet gennem slidsen og de fire klikstik i deres lommer (v18: hvid 3's stik i reflektoren til højre). Front og bagramme lægges sammen."),
    ("lyskanal", ["bagramme", "lysring"], ((-106, -148), (-40, -84)), 0, "fuld",
     "v18: lyskanalen uden klister, nederste venstre hjørne med ca. 10 cm strip-bane. Hvid 1 og 2: bagkanten ind under læben, "
     "forkanten trykkes ned mod væggen. RGB i den tætte bane bagerst. Hvid 3 i lommen i den skrå reflektor, bagkanten ind under "
     "læben. Læg lysringens stykke i, og pres bagrammen på: trykker ringens kile forkanten af hvid 3 ned? Kør en finger langs alle "
     "strips, også i hjørnet: bliver de liggende? Tænd strips og se efter skygger eller striber i lysringen."),
    ("hjoerne", ["skal", "front", "bagramme", "lysring"], CORNER, 0, "fuld",
     "Ét hjørne af hele stakken: skal over front, lysringens hjørne i slidsen, bagrammens øre og én frontskrue "
     "(3,0 × 15) skruet i bagfra. Er skyggefugen mellem skal og front jævn?"),
    ("laas", ["front", "bagramme"], ((-116, -64), (-64, -22)), 0, "fuld",
     "v14: en sidelås (venstre side, nederste par): vinduet i indervæggen og i ydervæggen og bagrammens 2 arme. "
     "Klikker begge arme, kan de vippes fri med en lille skruetrækker, og ligger fjedertåen ned på et stykke glas "
     "eller plastik (1,1 mm) i frontens skærmlomme?"),
    ("skaermhuller", ["bagramme"], ((-72, -93), (72, -74)), 0, "fuld",
     "v16: bagrammens nederste tværbjælke med de 2 nederste skruetårne (hele tårne, 1,6 mm bund, hul 3,5 mm på tværs). "
     "Læg den på skærmens bagside: står begge tårne ned på beslagene? Skru en M2,5 × 3-4 mm i hvert med en PH0/PH1. "
     "Går begge i uden at skulle tvinges, og tager de fat?"),
    ("skaerm-lysring", ["front"], None, 0, 7.0,
     "De nederste 7 mm af fronten: den 1,6 mm tynde kant foran skærmen, rillen med skumbåndet, skærmglasset mellem "
     "de 8 ribber, lysringen i slidsen (skyggefuge 0,15 mm) og kamerahullet. Klæb båndet i rillen, læg skærmen i og "
     "tryk den ned: ligger glasset helt ind mod kanten hele vejen rundt? Lysringen printes hel."),
]

PROFILE = ["--layer-height", "0.28", "--first-layer-height", "0.2", "--perimeters", "2",
           "--top-solid-layers", "3", "--bottom-solid-layers", "3", "--fill-density", "10%", "--fill-pattern", "grid"]
SUPPORT = ["--support-material", "--support-material-style", "organic", "--support-material-buildplate-only"]
# H2C-like speeds and Bambu PLA Basic flow, only for the time estimate
SLICER_INI = """bed_shape = -160x-160,160x-160,160x160,-160x160
nozzle_diameter = 0.4
filament_diameter = 1.75
filament_density = 1.24
filament_max_volumetric_speed = 21
temperature = 220
bed_temperature = 55
machine_limits_usage = time_estimate_only
machine_max_acceleration_extruding = 20000,20000
machine_max_acceleration_x = 20000,20000
machine_max_acceleration_y = 20000,20000
machine_max_acceleration_travel = 20000,20000
machine_max_feedrate_x = 1000,1000
machine_max_feedrate_y = 1000,1000
machine_max_feedrate_z = 30,30
default_acceleration = 10000
perimeter_acceleration = 5000
external_perimeter_acceleration = 5000
infill_acceleration = 10000
travel_acceleration = 10000
first_layer_acceleration = 500
perimeter_speed = 300
external_perimeter_speed = 200
infill_speed = 270
solid_infill_speed = 250
top_solid_infill_speed = 200
gap_fill_speed = 250
bridge_speed = 50
support_material_speed = 150
travel_speed = 500
first_layer_speed = 50
center_object = 1
gcode_flavor = marlin2
skirts = 0
"""


def newest():
    return max((p for p in GEN2.glob("halo-gen2-v*") if re.fullmatch(r"halo-gen2-v\d+", p.name)),
               key=lambda p: int(p.name.rsplit("v", 1)[1])).name


def glb_nodes(path):
    scene = trimesh.load(path)
    out = {}
    for n in scene.graph.nodes_geometry:
        T, g = scene.graph[n]
        m = scene.geometry[g].copy()
        m.apply_transform(T)
        out[n] = m
    return out


def to_print(glb_part, stl):
    """Transform from assembled glTF coordinates to the part's print orientation: the release scripts only
    turn a part about x (face down, back down, outer face down) and move it, so try the four turns and match."""
    best = None
    for R in (trimesh.transformations.rotation_matrix(a * np.pi / 2, [1, 0, 0]) for a in range(4)):
        m = glb_part.copy()
        m.apply_transform(R)
        T = trimesh.transformations.translation_matrix((stl.bounds[0] + stl.bounds[1]) / 2 - (m.bounds[0] + m.bounds[1]) / 2) @ R
        m = glb_part.copy()
        m.apply_transform(T)
        err = np.abs(m.bounds - stl.bounds).max() + np.linalg.norm(m.center_mass - stl.center_mass)
        if best is None or err < best[0]:
            best = (err, T)
    if best[0] > 1.0:
        raise SystemExit(f"cannot match the 3D model to {stl.metadata.get('file_name')}: {best[0]:.2f} mm off")
    return best[1]


def box_bounds(T, lo, hi):
    pts = trimesh.transform_points(np.array([[x, y, z] for x in (lo[0], hi[0]) for y in (lo[1], hi[1]) for z in (lo[2], hi[2])]), T)
    return pts.min(axis=0), pts.max(axis=0)


def cut(stl, lo, hi):
    lo, hi = np.maximum(lo, stl.bounds[0] - 1), np.minimum(hi, stl.bounds[1] + 1)
    box = trimesh.creation.box(bounds=[lo, hi])
    piece = trimesh.boolean.intersection([stl, box], engine="manifold")
    bodies = piece.split(only_watertight=False)
    keep = [b for b in bodies if b.bounds[0][2] < stl.bounds[0][2] + 0.05]      # on the plate
    dropped = sum(b.volume for b in bodies if b not in keep)
    piece = trimesh.util.concatenate(keep)
    return piece, len(keep), dropped


def estimate(stl, support):
    if not shutil.which("prusa-slicer"):
        return None
    with tempfile.TemporaryDirectory() as d:
        ini, gc = Path(d) / "h.ini", Path(d) / "h.gcode"
        ini.write_text(SLICER_INI)
        cmd = ["prusa-slicer", "--export-gcode", "--load", str(ini), *PROFILE, *(SUPPORT if support else []), "-o", str(gc), str(stl)]
        if subprocess.run(cmd, capture_output=True).returncode or not gc.exists():
            return None
        txt = gc.read_text(errors="ignore")
    t = re.search(r"estimated printing time \(normal mode\) = (.*)", txt)
    g = re.search(r"filament used \[g\] = ([\d.]+)", txt)
    return (t.group(1).strip() if t else "?"), (float(g.group(1)) if g else 0)


def fmt_t(t):
    if t is None:
        return "–"
    h = re.search(r"(\d+)h", t)
    m = re.search(r"(\d+)m", t)
    hh, mm = int(h.group(1)) if h else 0, int(m.group(1)) if m else 0
    return f"{hh} t {mm:02d} min" if hh else f"{mm} min"


def main():
    ver = sys.argv[1] if len(sys.argv) > 1 else newest()
    src, out = GEN2 / ver, OUT_ROOT / f"{ver}-hurtig"
    out.mkdir(parents=True, exist_ok=True)
    for f in out.glob("*.stl"):
        f.unlink()
    nodes = glb_nodes(src / f"{ver}_3d.glb")
    stls, T = {}, {}
    for part, node in PARTS.items():
        stls[part] = trimesh.load(src / f"{ver}_{part}.stl")
        T[part] = to_print(nodes[node], stls[part])

    rows = []
    for part in PARTS:
        dst = out / f"{ver}-hurtig_{part}.stl"
        shutil.copyfile(src / f"{ver}_{part}.stl", dst)
        rows.append(("del", dst.name, part, stls[part], "", estimate(dst, part == "skal")))
        print(dst.name)
    for suffix in LOGO:
        shutil.copyfile(src / f"{ver}_{suffix}.stl", out / f"{ver}-hurtig_{suffix}.stl")
    print(front_3mf(out, f"{ver}-hurtig").name)
    for name, parts, where, margin, height, what in COUPONS:
        for part in parts:
            stl = stls[part]
            if where is None:
                lo, hi = stl.bounds[0].copy(), stl.bounds[1].copy()
            else:
                if isinstance(where[0], str):
                    b = np.array([nodes[n].bounds for n in where])
                    glo, ghi = b[:, 0].min(axis=0), b[:, 1].max(axis=0)
                else:
                    glo, ghi = np.array([*where[0], -1e3]), np.array([*where[1], 1e3])
                lo, hi = box_bounds(T[part], [glo[0] - margin, glo[1] - margin, -1e3], [ghi[0] + margin, ghi[1] + margin, 1e3])
                if isinstance(height, str) and height.startswith("+"):
                    clo, chi = box_bounds(T[part], glo, ghi)
                    hi[2] = chi[2] + float(height[1:])
            lo[2] = stl.bounds[0][2] - 1
            if isinstance(height, (int, float)):
                hi[2] = stl.bounds[0][2] + height
            piece, n, dropped = cut(stl, lo, hi)
            piece.apply_translation([-(piece.bounds[0][0] + piece.bounds[1][0]) / 2, -(piece.bounds[0][1] + piece.bounds[1][1]) / 2, -piece.bounds[0][2]])
            suffix = f"_{part}" if len(parts) > 1 else ""
            dst = out / f"{ver}-hurtig_proeve-{name}{suffix}.stl"
            piece.export(dst)
            note = f" ({n} krop(pe), {dropped / 1000:.1f} cm3 svævende fjernet)" if dropped > 1 or n != 1 else ""
            print(f"{dst.name}: {np.round(piece.extents, 1).tolist()}{note}")
            rows.append(("proeve", dst.name, part, piece, what if part == parts[0] else "", estimate(dst, False)))
    write_guide(ver, out, rows)


def logo_section(ver, tag, material):
    """Guide text for printing the front with the logo inlays (3MF or the three STLs)."""
    p = f"{ver}{tag}"
    return [
        "## Front med logo", "",
        "Logoet er ikke en del af `_front.stl`. Fronten har en 0,8 mm fordybning, og logoet ligger i to separate filer, én pr. farve, "
        "fordi en slicer skal have én krop for hver farve. Printes `_front.stl` alene, kommer fronten ud uden logo.", "",
        f"**Nemmest: åbn `{p}_front_flerfarvet.3mf`** i Bambu Studio (File > Open Project, eller træk den ind). Den indeholder fronten "
        "og logoet som ét objekt med tre dele, der allerede ligger på plads, og farverne er sat til AMS-plads 1 = sort (front), "
        "2 = hvid (logo) og 3 = grøn (prikkerne). Læg filamentet i de pladser og tryk på synk-knappen ved \"Filament\" (Sync AMS), så alle tre pladser får de rigtige spoler. Filen har ingen materialer, så uden synk bruger Bambu de filamenter, der tilfældigvis står på plads 1–3, og de kan være forskellige. Vælg printer og profil som normalt, og slice. "
        "Der er ingen printer- eller profilindstillinger i filen.", "",
        f"**Alternativt med STL:** træk `{p}_front.stl`, `{p}_logo-hvid.stl` og `{p}_logo-groen.stl` ind på én gang og svar **Ja**, "
        "når Bambu Studio spørger, om de skal indlæses som ét objekt med flere dele. De har samme nulpunkt, så logoet lander præcis i "
        "fordybningen. Flyt ikke delene hver for sig. Giv derefter hver del sin farve i objektlisten.", "",
        "- Lag på 0,2 mm (ikke 0,28), så logoet er præcis de første 4 lag. Brug 0,4-dysen; logoets mindste detalje er ca. 1 mm.",
        "- Prime tower til og \"Flush into object's infill\" til. Ca. 12 farveskift og 10–15 g spild.",
        f"- Alle tre dele skal være samme materiale ({material}), ellers hæfter logoet ikke i fronten.",
        "- Hvis I ikke har brug for logoet på prøven, kan `_front.stl` printes alene i én farve uden AMS.",
    ]


def write_guide(ver, out, rows):
    full = [r for r in rows if r[0] == "del"]
    tests = [r for r in rows if r[0] == "proeve"]
    L = [f"# Selfi Halo {ver}, hurtigprint: printguide", "",
         f"**Version:** {ver}-hurtig. Kun til prototype- og pasformsprøver. Geometrien er den samme som i de normale printfiler for {ver} "
         f"(`hardware/stl/gen2/{ver}/`); kun printindstillingerne er anderledes, og der er små prøvestykker skåret ud af delene. "
         "Reglerne står i `hardware/docs/HURTIGPRINT.md`. **Brug aldrig disse filer til en boks, der skal ud til en kunde.**", "",
         "Lavet med `python3 hardware/tools/make_hurtig.py " + ver + "`. Tiderne er skøn fra PrusaSlicer med H2C-lignende hastigheder; "
         "Bambu Studio viser de rigtige tider.", "",
         "## Hele dele", "",
         "| Fil | Mål på pladen (mm) | Ca. tid | Ca. PLA |", "|---|---|---|---|"]
    for _, f, part, m, _, est in full:
        L.append(f"| `{f}` | {' × '.join(f'{v:.1f}' for v in m.extents)} | {fmt_t(est[0]) if est else '–'} | {f'{est[1]:.0f} g' if est else '–'} |")
    L += ["", *logo_section(ver, "-hurtig", "PLA"), "",
          "## Prøvestykker", "",
          "Hvert prøvestykke er en kasse skåret ud af en del, så det passer præcis til denne version. Det står på den samme flade som "
          "delen, så det printes uden support. Prøvestykker med samme navn og flere dele (fx `kamera`, `hjoerne`) lægges sammen.", "",
          "| Fil | Mål (mm) | Ca. tid | Hvad prøves |", "|---|---|---|---|"]
    for _, f, part, m, what, est in tests:
        L.append(f"| `{f}` | {' × '.join(f'{v:.0f}' for v in m.extents)} | {fmt_t(est[0]) if est else '–'} | {what} |")
    L += ["", "## Indstillinger (Bambu Studio)", "",
          "Start fra **0.28mm Extra Draft** til H2C og **Bambu PLA Basic** (eller anden PLA). Ret dette:", "",
          "- Vægge (wall loops): **2**. Top- og bundlag: **3**.",
          "- Fyld (sparse infill): **10 %, Grid**.",
          "- Første lag 0,2 mm. Ingen ironing, ingen musøre, ingen brim.",
          "- Support kun til skallen: *Tree*, kun fra pladen (som den normale skal).",
          "- Ingen \"hole compensation\" eller skalering.",
          "- PLA: lågen eller toppen må gerne stå åben. Ingen opvarmning af kammeret.",
          "- Front, lysring og `skaerm-lysring`: print med **0,2 mm** lag, når lysringens skyggefuge eller kravens trin skal vurderes.",
          "- Printretning som filerne ligger. Flyt eller vend dem ikke.", "",
          "## Husk", "",
          "- PLA krymper mindre end ASA. En lomme, der lige netop passer i PLA, kan blive for stram i ASA. Er en pasform stram (0,3 mm luft "
          "eller mindre), så tjek den til sidst i ASA med den normale printfil.",
          "- Bland ikke PLA- og ASA-dele i samme samling. Over 300 mm kan forskellen i krympning blive op til ca. 1 mm.",
          "- Skruer: frontskruer og låseskrue kan skrues i PLA til prøve, men skru dem ikke i og ud mange gange.",
          "- Ret aldrig en fejl i en hurtigfil. Ret CAD (`hardware/cad/gen2_concept.scad`), lav en ny version og kør værktøjet igen."]
    (out / f"PRINTGUIDE_{ver}-hurtig.md").write_text("\n".join(L) + "\n")


if __name__ == "__main__":
    main()
