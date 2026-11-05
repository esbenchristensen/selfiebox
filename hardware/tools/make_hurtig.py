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

v37 (Esben 1 Nov: "Lav et hurtig print sæt, så vi kan få testet fit og alt det andet uden at skulle bruge dage på at
printe"): the set had not been made since v23, and the test pieces named parts that are gone (camera glass and sleeve,
gasket cord). COUPONS now covers v37 (power inlet, fuse, Wago row and the strap loops under it, front/shell snap, both
wall locks, the stand bracket's shelf with the heat-set insert, the theme groove and so on), and every piece and part
is a Bambu Studio project (make_3mf.write_bambu_objects) with the draft settings inside, PLA as everything is printed,
plus a few full plates with all the test pieces of one colour, so a plate is one press on Print.

Usage:  python3 hardware/tools/make_hurtig.py [version]   (default: the newest hardware/stl/gen2/halo-gen2-v<N>)
Output: hardware/stl/gen2-hurtig/<version>-hurtig/ with the STLs, a 3MF for each, the plates
        (<version>-hurtig_plade-<farve>-<n>.3mf), PRINTGUIDE_<version>-hurtig.md and <version>-hurtig.zip.
        With prusa-slicer on the PATH it also estimates print times (draft profile, H2C-like speeds).
Needs:  trimesh, manifold3d, numpy, networkx
"""
import re
import shutil
import subprocess
import sys
import tempfile
import zipfile
from pathlib import Path

import numpy as np
import trimesh

from make_3mf import NO_SUPPORT, SETTINGS, SKAL_BLOCK, SKAL_ENFORCE, write_bambu_objects

HW = Path(__file__).resolve().parents[1]
GEN2, OUT_ROOT = HW / "stl" / "gen2", HW / "stl" / "gen2-hurtig"

# print file suffix -> (node in <version>_3d.glb or None, filament colour as in the release, settings key below).
# Only parts with a node can have test pieces; the others (the fan guard lies on its side) are printed whole.
PARTS = {"skal": ("skal", "sort", "skal"), "front": ("front", "sort", "front"),
         "bagramme": ("ledskinne", "hvid", "bagramme"), "lysring": ("lysring", "natur", "lysring"),
         "vaegbeslag": ("vaegbeslag", "sort", "hurtig"), "stativbeslag": ("stativbeslag", "sort", "hurtig"),
         "blaeserhegn": (None, "sort", "blaeserhegn"),
         "tema-vinge-venstre-eksempel": ("tema_vinge_v", "sort", "hurtig")}   # v53-v54 also the wagoholder-* (v55: in the frame)

# The draft profile (HURTIGPRINT.md section 5): 0.28 mm, 2 walls, 3 top/bottom layers (0.84 mm, at least 0.8), 10 %.
# Crosshatch, not grid, and infill every layer: grid crossings and combined infill made the nozzle catch in v31-v33 (v34).
HURTIG = {"layer_height": "0.28", "wall_loops": "2", "top_shell_layers": "3", "top_shell_thickness": "0.8",
          "bottom_shell_layers": "3", "sparse_infill_density": "10%", "sparse_infill_pattern": "crosshatch",
          "infill_combination": "0", "brim_type": "no_brim", **NO_SUPPORT}
BRIM = {"brim_type": "outer_only", "brim_width": "3"}
HSET = {
    "hurtig": HURTIG,
    # shell: tree support only at the release's enforcers, as the normal shell; the brim only on the whole part (corner lift)
    "skal": {**HURTIG, "enable_support": "1", "support_type": "tree(manual)", "support_on_build_plate_only": "0"},
    # front: face down; keep the release's 0.15 elephant foot so the 0.15 shadow gap at the light ring stays open
    "front": {**HURTIG, "elefant_foot_compensation": "0.15"},
    "bagramme": HURTIG,
    # light ring: the release's settings (solid, clear PETG; v42 Bambu's own patterns and aligned seam) at 0.2 instead of 0.16. Its 45 deg collar steps
    # 0.2 per layer, still under make_3mf.OVERHANG_MAX, and the ring is thin, so draft walls and infill would save nothing
    "lysring": {**SETTINGS["lysring"], "layer_height": "0.2"},
    "blaeserhegn": {**HURTIG, **BRIM},
    "wagoholder": {**HURTIG, **BRIM},
}
# Modifier volumes the release 3MFs carry that change what a fit test shows (in the part's print coordinates): the shell's
# support enforcers/blockers (make_3mf.SKAL_*) and the stand bracket's solid shelf round the heat-set insert (the insert
# must melt into solid plastic as in the real part). The corner modifiers (v37, drop strength) are left out: they do not
# change the fit and only cost time.
SOLID_SHELF = {"wall_loops": "6", "sparse_infill_density": "100%"}

# glTF coordinates (assembled box): x across (seen from the front, + = right), y up (bottom of the box at -153.5),
# z depth (front face at 0, back at -70). CAD z (height above the bottom) = y + 153.5.
CORNER = ((-200, -200), (-46, -88))   # one front screw, the shell/front joint and the ring corner (bottom left)
# name, parts, where (bought-part nodes + margin, or a fixed glTF x/y region), margin, height, what it tests
#   height: "fuld" = the whole part; a number = mm above the plate in print orientation;
#           "+m" = up to the top of the listed nodes in print orientation + m mm
COUPONS = [
    # ---- v53: the splice clamps for the parts with their own short leads (the strips and the fuse holder)
    ("wagolommer", ["bagramme"], ((-62, 76), (86, 112)), 0, "fuld",
     "v55: Wago-lommerne er nu støbt ind i bagrammen (v53-v54: to løse holdere, der klikkedes på): over det øverste "
     "tværstykke, i rammens vindue bag skærmen, 2 lommer til 221-415 (hvid + og hvid −) til venstre og 3 til 221-413 (RGB data, "
     "GND, +5 V) til højre. Klemmerne står på højkant med indgangene opad og håndtagene bagud, og de skubbes ind bagfra med "
     "bunden mod skærmen. Skub en klemme i hver lomme: glider den ind med lidt modstand og klikker bag de små kanter, sidder "
     "den uden slør, og kan håndtagene åbnes helt? Går en afisoleret ledning ned i indgangene forbi kanterne foroven? Klik "
     "også blæserhegnet på tværstykket i midten: går dets øverste arm fri under lommerne?"),
    ("sikringsklemmer", ["skal"], ["wago_sikring"], 5, "+4",
     "v53: de to faste Wago-pladser (221-413) over sikringsholderen: én på 5 V-forsyningens væg og én på højre væg, indgangene "
     "nedad mod sikringen. Klik en klemme i hver: sidder de fast, kan håndtagene åbnes helt, og kan sikringens korte ledning "
     "(6 cm) nå op i den højre?"),
    # ---- shell (printed back down: the height is from the outside of the back wall)
    ("stroemindgang", ["skal"], ((-22, -154), (22, -50)), 0, 24,
     "v54: kabellåsens skrueklods fra v52 er væk igen, så strømindgangen er som i v51. v43: kanalen til strømforsyningens stik nedefra er 1 mm større, Ø11,8 (v40-v42: Ø10,8), stadig med flad top. Bøjlen "
     "over hunstikket er som v40. Kør strømforsyningens stik op nedefra: glider det op uden at tage fat, og rammer det "
     "stadig hunstikket uden at lede efter det? Skub hunstikket ind forfra: sidder det stadig uden slør?"),
    ("sikring", ["skal"], ["sikring"], 8, "+6",
     "v43: åbningerne i hver ende til sikringsholderens ledningsstudse er 7,5 mm brede (v40-v42: 5,6, så holderen ikke kunne "
     "komme ned; du målte studsene til ca. 8 mm). Lommen og knusribberne er som v40. Trykkes den ned og sidder fast? Kan "
     "låget stadig åbnes?"),
    ("wago-loekker", ["skal"], ((-90, 68), (90, 136)), 0, 28,
     "v40: Wago-lommerne efter dine mål (18,6 / 29,6 brede, 18,0 lange): skrå tænder med bred fod, der går 1,2 mm op over "
     "hullets 0,5 mm kant og 2 mm ind, knusribber i siderne (0,5) og bagved, og en lille kant over klemmens bagende i hvert "
     "hjørne. Sæt indgangsenden ind over tænderne og læg klemmen ned, til den klikker under kanterne bagved: sidder den uden "
     "slør i alle retninger, og går en afisoleret ledning stadig ind over tanden? Velcroløkkerne under rækken er som v37."),
    ("kabelloekker", ["skal"], ((-26, -50), (26, -8)), 0, 14,
     "v37: de 2 flade velcroløkker midt på bagvæggen (som v23–v35). Går en 10 mm velcrostrop igennem begge?"),
    ("stroem", ["skal"], ["stroem"], 8, "+6",
     "v36: 5 V-forsyningen i sin bakke. Tænderne skal holde den, uden at væggene skubbes ud."),
    ("ledstyring", ["skal"], ["ledstyring"], 8, "+6",
     "v36: WLED-styringen (Gledopto) i sin bakke med 2,4 mm vægge. Klikker den på plads og sidder fast?"),
    ("daemper", ["skal"], ["daemper"], 8, "+6",
     "v36: dæmperens printkort (DFR0457) på de 4 puder, 2 pinde i hullerne, én tand pr. side. Klikker kortet på plads?"),
    ("hoejttaler", ["skal"], ["hoejttaler"], 8, "+6", "Højttaleren (FIT0502) i sin bakke bag gitteret."),
    ("laas-reed", ["skal"], ((-104, -154), (-58, -88)), 0, 22,
     "v41: venstre låseslids i bunden, låseskruens hul og reed-modulets bakke. Skruehovedet sidder nu 3 mm oppe i bunden "
     "(v40: 0,3). Prøves med `proeve-laasetunge` og `proeve-stativ-hylde`: går tungen ind og op, kan låseskruen skrues i, "
     "og ligger hovedet helt skjult inde i hullet?"),
    ("laas-hoejre", ["skal"], ((72, -154), (100, -110)), 0, 22,
     "Højre låseslids (12 mm tunge). Prøves med `proeve-laasetunge-hoejre` og `proeve-stativ-hylde`."),
    ("4g", ["skal"], ["modem4g"], 8, "+6", "4G-modemet i sin bakke (tilvalg)."),
    ("mikrofonkerne", ["skal"], ["lydkerne"], 8, "+6",
     "v43: mikrofonkernens (XVF3800) tænder er de samme som v40 (samme pasform), men tappen under hver tand er stærkere: 10 mm "
     "bred (v40: 6), 1,2 mm tyk ved roden og 0,8 ved tanden, med afskåret fod og 0,5 mm længere. Tryk kortet ned over "
     "pindene, til begge tænder klikker over printet: holder tapperne, uden at knække? Sidder kortet fast, når du vender "
     "stykket og banker det? Kan USB-C, AUX og fladkablet stadig sættes i?"),
    ("stoedsensor", ["skal"], ["sensor"], 8, "+6", "v36: stødsensoren (LIS3DH) i sin bakke til højre for 5 V-forsyningen."),
    ("mikrofonstrip", ["skal"], ["mikrofoner"], 8, "+6",
     "Mikrofonkortet i lommen i bunden: pindene gennem hullerne og kortet fladt på de 4 ringe (tilvalg)."),
    ("vingerille", ["skal"], ((-113, -142), (-90, -106)), 0, 14,
     "v36: rillen bag på skallen med lommen under. Prøv med den hele `tema-vinge-venstre-eksempel`: går tappen i rillen, "
     "og falder tåen ned i lommen, så vingen ikke kan vippe ud forneden?"),
    # ---- shell + front: the snap (v37)
    ("klik", ["skal", "front"], ((-114, -78), (-92, -39)), 0, "fuld",
     "v41: frontens nederste venstre klikkant (95 mm oppe) og skallens rille. Kanten sidder 0,3 mm længere inde på tungen "
     "end i v40, så den kan nå ned i rillen. Tryk de to stykker sammen: ligger front og skal helt sammen uden fuge, når det "
     "klikker? Træk dem fra hinanden igen med hånden. Stykket er kort, så det er stivere end den hele væg; bedøm kraften "
     "på det hele print."),
    # v38 (Esben 1 Nov): the front also snaps into the shell's top and bottom wall at x +-50; the bottom left one here
    ("klik-bund", ["skal", "front"], ((-72, -154), (-28, -128)), 0, "fuld",
     "v41: frontens klikkant i bunden (x −50, 0,3 mm længere inde end i v40) og rillen i skallens bundvæg. Tryk sammen: ligger "
     "front og skal helt sammen, når det klikker? Kanten er 0,45 mm her (0,6 i siderne), så klikket skal være lettere end i `klik`."),
    # ---- front + frame
    ("kamera", ["front", "bagramme"], ["kamera", "klikstik"], 8, "fuld",
     "v37: kameraet på frontens tappe, linsen midt i hullet (Ø8,6 i den yderste 1 mm, Ø10 bagved), bagrammens 4 rør med "
     "knusspidser trykker kortet let ned, kablet gennem slidsen og klikstikkene i deres lommer. Læg front og bagramme "
     "sammen med kameraet imellem: rører linsen ingenting, og sidder kortet fast uden at bøje?"),
    ("laas", ["front", "bagramme"], ((-116, -64), (-64, -22)), 0, "fuld",
     "En sidelås mellem front og bagramme (venstre side): klikker begge arme, og kan de vippes fri med en lille skruetrækker?"),
    ("skaermhuller", ["bagramme"], ((-72, -93), (72, -74)), 0, "fuld",
     "Bagrammens nederste tværbjælke med de 2 nederste skruetårne til skærmen. Skru en M2,5 × 3–4 mm i hvert."),
    # v41 (Esben 2 Nov: "så vi kan teste lysring, front og LED-holder-modulet"): the front's piece joins the frame and the ring
    ("lyskanal", ["front", "bagramme", "lysring"], ((-106, -148), (-40, -84)), 0, "fuld",
     "v51: bagrammen er nu hul bag bunden, en kølekanal (12 × 8,6 mm) hele vejen rundt med spalter i bagsiden; stykket har "
     "spalten i bunden og den nederste i venstre side. Er kanalens loft (12 mm bro, printet bagsiden ned) pænt og lukket, og kommer "
     "der intet lys ud gennem spalterne, når en strip lyser i kanalen? Resten er som v49 (1,8 mm under broerne over de hvide strips): "
     "hele lysstakken nederst til venstre med hjørnet: ingen skråning, hvid 1 på ydervæggen med RGB bag, hvid 2 på "
     "indervæggen og hvid 3 på bunden. Hvid 3 ligger fladt under læberne, og 15 mm før hjørnet vrides den op på højkant ned i slidsen "
     "mellem de to finner midt i hjørnet. Kan den vrides op og ned igen uden at slå bule eller løfte sig fra bunden, hvor læberne "
     "begynder igen? Læg RGB, hvid 1 og hvid 2 i og træk dem ind under broen: ligger de tæt mod væggene? Broerne er nu 2,0 × 2,4 mm: "
     "tryk hårdt på dem med en finger, de må ikke knække. Pres bagrammen ned på fronten med ringen i sædet: ligger ringen fast?"),

    # v45 (Esben 4 Nov: the strips' clip connectors pushed the front off): the clip bay at the left end of the top run;
    # v46: both bays, as each side now takes two clips
    ("klipslomme", ["front", "bagramme", "lysring"], ((-50, 116), (-8, 154)), 0, "fuld",
     "v46: venstre klipslomme ved kameraet, hvor hvid 1 (ydervæggen) og hvid 3 (bunden) føres ind. Fra kameraet og 21,5 mm ud er "
     "hele kanalens bredde fri og bunden 1,1 mm dybere, og lysringen har et hak bag på ydersiden. Sæt klipsene på, læg dem i "
     "lommen med ledningerne bøjet ind i slidsen ved kameraet, og læg front og ring på: ligger front, ring og bagramme helt "
     "sammen, uden at klipsene trykker dem fra hinanden?"),
    ("klipslomme-hoejre", ["front", "bagramme", "lysring"], ((8, 116), (50, 154)), 0, "fuld",
     "v46: højre klipslomme, hvor hvid 2 (indervæggen) og RGB (ydervæggen, bagerst) føres ind. Lysringen har hakket på indersiden "
     "fra x 21. Samme prøve: ligger klipsene i lommen og ledningerne i slidsen, og lukker front, ring og bagramme helt?"),
    ("hjoerne", ["skal", "front", "bagramme", "lysring"], CORNER, 0, "fuld",
     "v41: ét hjørne af hele stakken med én frontskrue (4,0 × 50 T20) skruet i bagfra. Hovedet skal nu ligge 2 mm under "
     "bagsiden (v40: plant). Lukker skal og front uden fuge, sidder bagrammen fast (knusribberne trykkes flade), og ligger "
     "ringen stille?"),
    ("skaerm-lysring", ["front"], None, 0, 7.0,
     "De nederste 7 mm af fronten med lysringens sæde og skærmlommen. Læg skærmen og den hele lysring i: ligger glasset ind "
     "mod kanten hele vejen rundt, og er skyggefugen ved ringen jævn? Lysringen printes hel."),
    # ---- wall cleat and stand bracket
    ("laasetunge", ["vaegbeslag"], ((-104, -154), (-60, -110)), 0, "fuld",
     "Vægbeslagets venstre låsetunge. Prøves i `proeve-laas-reed`: går den ind i låseslidsen, og kan låseskruen skrues i?"),
    ("laasetunge-hoejre", ["vaegbeslag"], ((72, -154), (100, -110)), 0, "fuld",
     "Vægbeslagets højre låsetunge. Prøves i `proeve-laas-hoejre`."),
    ("skinne", ["vaegbeslag", "stativbeslag"], ((-66, 100), (66, 137)), 0, "fuld",
     "Skinnen øverst på vægbeslaget og stativbeslaget, som boksen hænger på. Prøves i `proeve-wago-loekker` (skallens "
     "udsparing til skinnen ligger i det stykke): glider skinnen ind uden at tvinge, og sidder den uden slør?"),
    ("stativ-hylde", ["stativbeslag"], ((-112, -168), (112, -108)), 0, "fuld",
     "v54: slidsen til strømstikket er som i v51 igen (16 mm bred), kabellåsens form fra v52 er væk. "
     "v37: stativbeslagets hylde med hullet til gevindindsatsen (massiv som i den rigtige 3MF) og tungerne til skallens låse. "
     "Smelt indsatsen (1/4\"-20 × 12,7) i med loddekolben: går den lige ned og flugter med hylden? Skru kuglehovedets "
     "lynplade i, og prøv tungerne i `proeve-laas-reed` og `proeve-laas-hoejre`."),
]

# The plates, in the order to print them: 1 = what v37 changed (print this first), 2 = the other fits, 3 = options and
# the big screen/ring piece. Every piece is also its own 3MF.
# v40 (Esben 2 Nov, after printing v38's set): plate 1 is only what v40 changed, the rest of the v37/v38 news is on plate 2
# v41 (Esben 2 Nov, after printing v40's set): plate 1 is the snap and the deeper screw heads
# v43 (Esben 4 Nov, after printing the mic holder and the power inlet): plate 1 is only the two v43 changes, the mic teeth's
# tabs, the PSU plug's channel and the fuse holder's lead slots; v41/v42's snap, screws and light stack go to plate 2
# v45 (Esben 4 Nov: clips and corners in the LED channel): plate 1 is the clip bay and the light stack with the corner bridge;
# v43's three shell holders go to plate 2. v46 (no slope, four strips): the same, with the right clip bay too
# v53 (the strips' and the fuse's own leads): plate 1 is both Wago holders, the bar to try them on and the fuse's two clamp
# seats
# v54 (Esben 5 Nov: the kabellås is gone, back to v51 at the plug; no dowel holes): plate 1 is the shell's inlet and the stand
# shelf with its v51 slot again; v53's holders go to plate 2
# v55 (Esben 5 Nov: the Wago holders belong in the frame): plate 1 is the frame's new Wago pockets over the upper bar
GROUP = {"wagolommer": 1, "4g": 3, "mikrofonstrip": 3, "skaerm-lysring": 3}
GROUP_NAME = {1: "nyt", 2: "resten", 3: "ekstra"}
# v42 (Esben 3 Nov: a seam line across the clear ring): no part changed, only the ring's seam and patterns, so plate 1 is
# still v41's, and its natural-colour plate is the ring test
GROUP_TEXT = {1: "v55: bagrammens nye Wago-lommer over det øverste tværstykke (i stedet for v53's løse holdere); print den først", 2: "de andre holdere og samlinger (også v54's strømindgang, v53's sikringsklemmer og v51's lysstak med kølekanalen)", 3: "tilvalg og skærmens kant"}

# slim1 (cad/gen2_slim.scad, 57 mm): the same set with this variant's places. Plate 1 is what slim moved or added: the back
# vents behind the wall cleat, the power inlet at x 17.65, the fuse holder on its side, the dimmer flat on the back wall, the
# turned 4G, the IMU on the right wall, the left side lock (now 138 mm up) and a corner with the shorter front screw.
PLATE1_TEXT = ("bagrammens nye Wago-lommer: de 5 klemmer til strippenes egne ledninger sidder nu i lommer støbt ind i bagrammen "
               "over det øverste tværstykke, i vinduet bag skærmen, i stedet for v53-v54's to løse holdere, der klikkedes på. Stykket "
               "har tværstykket med, så blæserhegnet også kan klikkes på. Plade 2 har resten, også v54's strømindgang og v53's "
               "faste Wago-pladser ved sikringen")
CAD_FILE = "hardware/cad/gen2_concept.scad"


def slim_set():
    global COUPONS, GROUP, GROUP_TEXT, PLATE1_TEXT, CAD_FILE
    PARTS["pi-holder"] = (None, "sort", "hurtig")
    new = {
        "stroemindgang": (((-5, -154), (40, -50)), "slim1: strømindgangen er flyttet til x 17,65, mellem mikrofonkernen og "
                          "højttaleren; bøjlen er som v40. slim2 (som v43): kanalen til strømforsyningens stik er 1 mm større, Ø11,8 "
                          "(slim1: Ø10,8). slim13 (som v54): kabellåsens skrueklods fra slim11 er væk igen. Skub hunstikket ind forfra og kør strømforsyningens stik op nedefra: går begge ind uden at "
                          "tvinge, og sidder hunstikket uden slør?"),
        "sikring": (None, "slim1: sikringsholderen ligger nu på siden, bunden ind mod venstre væg (v42: stående på højre væg), med "
                    "de samme knusribber. slim2 (som v43): slidserne i enderne er 7,5 mm (slim1: 5,6). Trykkes den ind og sidder fast? Kan låget åbnes, og kommer ledningerne ud i begge ender?"),
        "daemper": (None, "slim1: dæmperens printkort (DFR0457) ligger fladt på bagvæggen øverst til venstre (v42: på venstre væg), på de "
                    "samme 4 puder med 2 pinde og en tand pr. side. Klikker kortet på plads, og kan skrueklemmerne og Gravity-stikket nås?"),
        "4g": (None, "slim1: 4G-modemet ligger på tværs over 5 V-forsyningen (tilvalg). Klikker det i bakken?"),
        "stoedsensor": (None, "slim1: stødsensoren (LIS3DH) i en bakke på højre sidevæg. Klikker den i, og kan stikket sættes på?"),
        "kabelloekker": (((-12, -90), (8, -65)), "slim1: velcroløkken over mikrofonkernen ved strømindgangen. Går en 10 mm velcrostrop igennem?"),
        "laas": (((-116, -36), (-64, 6)), "slim1: venstre sidelås mellem front og bagramme sidder nu 138 mm oppe (v42: 110), så Pi'ens "
                 "USB-porte og GPIO-stikkets ledninger går fri. Klikker begge arme, og kan de vippes fri med en lille skruetrækker?"),
        "wagolommer": (((-47, 76), (86, 112)), "slim14 (som v55): Wago-lommerne er nu støbt ind i bagrammen (slim12-13: to løse "
                       "holdere): i rammens vindue over det øverste tværstykke, bag skærmen, 2 lommer til 221-415 (hvid + og −) fra "
                       "x −45 til 20, lige over blæserhegnet, og 3 til 221-413 (RGB data, GND, +5 V) fra x 21 til 85. Indgangene "
                       "opad, håndtagene bagud, og klemmerne skubbes ind bagfra med bunden mod skærmen. Skub en klemme i hver: "
                       "glider den ind med lidt modstand og klikker bag de små kanter, sidder den uden slør, og kan håndtagene "
                       "åbnes helt? Klik blæserhegnet på tværstykket: går dets øverste arm fri under de hvide lommer?"),
        "sikringsklemmer": (None, "slim12 (som v53): de to faste Wago-pladser (221-413) ved sikringsholderen, indgangene opad: FWL "
                            "på venstre væg lige under sikringen og FWR på bagvæggen til højre for den. Sæt sikringen i med den "
                            "korte ledning (6 cm) nedad: når den ned i FWL, og når den lange (15 cm) over holderen og ned i FWR? "
                            "Sidder klemmerne fast, og kan håndtagene åbnes helt?"),
        "hjoerne": (CORNER, "slim1: ét hjørne af hele stakken med én frontskrue, nu 4,0 × 40 T20 (v42: × 50). Hovedet skal ligge 2 mm "
                    "under bagsiden. Lukker skal og front uden fuge, sidder bagrammen fast, og ligger ringen stille?"),
    }
    COUPONS = [(n, parts, new[n][0] if n in new and new[n][0] is not None else where, margin, height, new[n][1] if n in new else what)
               for n, parts, where, margin, height, what in COUPONS]
    COUPONS.insert(0, ("udluftning", ["skal", "vaegbeslag", "stativbeslag"], ((28, 78), (90, 96)), 0, "fuld",
                       "slim1: den nye udluftning bagpå: en rende i bagsiden, der falder ud mod enderne, med slidser, der stiger 45° "
                       "indad, og kanaler i vægbeslaget og stativbeslaget ud for dem. Læg skal-stykket på hvert beslag-stykke: står "
                       "kanalerne ud for slidserne? Hæld lidt vand i renden med stykket stående som på væggen: løber det ud i enderne "
                       "uden at komme ind gennem slidserne?"))
    # slim4 (as v45): the clip bay and the light stack with the corner bridge; slim5 (as v46): both bays; slim's own moved parts stay on plate 1 too
    GROUP = {"wagolommer": 1, "lyskanal": 2, "klipslomme": 2, "klipslomme-hoejre": 2, "udluftning": 1, "stroemindgang": 1, "mikrofonkerne": 1, "sikring": 1, "daemper": 1, "4g": 1,
             "stoedsensor": 1, "laas": 1, "hjoerne": 1, "mikrofonstrip": 3, "skaerm-lysring": 3}
    GROUP_TEXT = {1: "slim14 (som v55): bagrammens nye Wago-lommer over det øverste tværstykke; slim1: udluftningen og alt det, der er flyttet; print den først", 2: "de andre holdere og samlinger (slim13's strømindgang, slim12's sikringsklemmer, slim10's kølekanal og slim5-8's lysstak og klipslommer)",
                  3: "tilvalg og skærmens kant"}
    PLATE1_TEXT = ("slim14 (som v55): bagrammens nye Wago-lommer: de 5 klemmer til strippenes egne ledninger sidder nu i lommer "
                   "støbt ind i bagrammen over det øverste tværstykke, i vinduet bag skærmen (slim12-13: to løse holdere), med "
                   "tværstykket, så blæserhegnet kan prøves under dem. Desuden "
                   "udluftningen bagpå og alt det, slim-versionen har flyttet: strømindgangen, sikringen på siden, dæmperen fladt på "
                   "bagvæggen, 4G-modemet på tværs, stødsensoren på højre væg, venstre sidelås og et hjørne med den kortere frontskrue. "
                   "Pi-holderen printes hel (`pi-holder`) og prøves på skærmens afstandsstykker med Pi'en skruet på. slim2 (som v43): "
                   "mikrofonkernens holder med stærkere tappe under tænderne, 1 mm større kanal til strømforsyningens stik og 7,5 mm "
                   "åbninger i sikringsholderens ender. slim7 (som v48): lysstakken nederst til venstre med hvid 3 på højkant i hjørnets "
                   "slids og de stærkere broer, og begge klipslommer ved kameraet. slim10 (som v51): bagrammen er hul bag bunden med spalter bagud (kølekanalen)")
    CAD_FILE = "hardware/cad/gen2_slim.scad"


PROFILE = ["--layer-height", "0.28", "--first-layer-height", "0.2", "--perimeters", "2",
           "--top-solid-layers", "3", "--bottom-solid-layers", "3", "--fill-density", "10%", "--fill-pattern", "grid"]
PROFILE_LYSRING = ["--layer-height", "0.2", "--first-layer-height", "0.2", "--perimeters", "3",
                   "--fill-density", "100%", "--fill-pattern", "rectilinear"]
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
# the plate (H2C 330 x 320; one filament, so the left nozzle's x 0-325) less 5 mm all round, and the gap between pieces
PLATE, GAP = (315.0, 310.0), 8.0


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


def part_modifiers(src, ver, part, stl):
    """(name, [x0, x1, y0, y1, z0, z1] in the part's print coordinates, subtype, settings) for the release's modifier
    volumes that matter for the fit (see SOLID_SHELF)."""
    if part == "skal":
        enf = [e for e in SKAL_ENFORCE if not ("slim" in ver and e[0] == "support: dæmperbakkens forvæg")]   # slim1: no dimmer tray
        return [(n, b, "support_enforcer", {}) for n, b in enf] + [(n, b, "support_blocker", {}) for n, b in SKAL_BLOCK]
    if part == "stativbeslag":
        lo, hi = stl.bounds
        b = np.clip(trimesh.load(src / f"{ver}_stativbeslag_forstaerkning.stl").bounds, lo, hi)
        return [("forstærkning: hylde og gevindindsats", [b[0][0], b[1][0], b[0][1], b[1][1], b[0][2], b[1][2]],
                 "modifier_part", SOLID_SHELF)]
    return []


def clip_modifiers(mods, lo, hi, shift):
    """the modifier boxes that reach into the piece's box lo-hi, clipped to it and moved with the piece"""
    out = []
    for n, b, kind, st in mods:
        a = np.maximum([b[0], b[2], b[4]], lo)
        c = np.minimum([b[1], b[3], b[5]], hi)
        if np.all(c - a > 0.5):
            out.append((n, trimesh.creation.box(bounds=[a + shift, c + shift]), 1, kind, st))
    return out


def estimate(stl, support, profile=PROFILE):
    if not shutil.which("prusa-slicer"):
        return None
    with tempfile.TemporaryDirectory() as d:
        ini, gc = Path(d) / "h.ini", Path(d) / "h.gcode"
        ini.write_text(SLICER_INI)
        cmd = ["prusa-slicer", "--export-gcode", "--load", str(ini), *profile, *(SUPPORT if support else []), "-o", str(gc), str(stl)]
        if subprocess.run(cmd, capture_output=True).returncode or not gc.exists():
            return None
        txt = gc.read_text(errors="ignore")
    t = re.search(r"estimated printing time \(normal mode\) = (.*)", txt)
    g = re.search(r"filament used \[g\] = ([\d.]+)", txt)
    return (minutes(t.group(1).strip()) if t else None), (float(g.group(1)) if g else 0)


def minutes(t):
    d, h, m = (re.search(rf"(\d+){u}", t) for u in ("d", "h", "m"))
    return sum(int(x.group(1)) * k for x, k in ((d, 1440), (h, 60), (m, 1)) if x) or 1


def fmt_t(m):
    if m is None:
        return "–"
    return f"{m // 60} t {m % 60:02d} min" if m >= 60 else f"{m} min"


def write_3mf(path, name, parts, settings, colour):
    plate = "tekstureret" if colour == "natur" else "glat"
    write_bambu_objects(path, [(name, parts, settings, (0.0, 0.0), False)], filaments=(colour,), plate=plate)


def pack(items):
    """shelf packing of (name, parts, settings, extents) on PLATE: returns a list of plates, each a list of
    (name, parts, settings, (dx, dy) from the bed centre, turn) for write_bambu_objects. Deepest first."""
    plates, cur, x, y, row = [], [], 0.0, 0.0, 0.0
    for name, parts, st, ext in sorted(items, key=lambda i: (-i[3][1], -i[3][0])):
        w, d = ext[0], ext[1]
        if w > PLATE[0] or d > PLATE[1]:
            raise SystemExit(f"{name}: {w:.0f} x {d:.0f} does not fit on a plate")
        if x + w > PLATE[0]:
            x, y, row = 0.0, y + row + GAP, 0.0
        if y + d > PLATE[1]:
            plates.append(cur)
            cur, x, y, row = [], 0.0, 0.0, 0.0
        cur.append((name, parts, st, (x + w / 2 - PLATE[0] / 2, PLATE[1] / 2 - (y + d / 2)), False))
        x, row = x + w + GAP, max(row, d)
    if cur:
        plates.append(cur)
    return plates


def main():
    ver = sys.argv[1] if len(sys.argv) > 1 else newest()
    if "slim" in ver:
        slim_set()
    src, out = GEN2 / ver, OUT_ROOT / f"{ver}-hurtig"
    out.mkdir(parents=True, exist_ok=True)
    for f in [*out.glob("*.stl"), *out.glob("*.3mf"), *out.glob("*.zip")]:
        f.unlink()
    pre = f"{ver}-hurtig"
    nodes = glb_nodes(src / f"{ver}_3d.glb")
    stls, T, mods = {}, {}, {}
    for part, (node, _, _) in PARTS.items():
        stls[part] = trimesh.load(src / f"{ver}_{part}.stl")
        if node:
            T[part] = to_print(nodes[node], stls[part])
        mods[part] = part_modifiers(src, ver, part, stls[part])

    rows = []
    for part, (_, colour, key) in PARTS.items():
        stl = stls[part]
        st = {**HSET[key], **(BRIM if part == "skal" else {})}
        dst = out / f"{pre}_{part}.stl"
        shutil.copyfile(src / f"{ver}_{part}.stl", dst)
        write_3mf(dst.with_suffix(".3mf"), f"{pre}_{part}", [(part, stl, 1)] + clip_modifiers(mods[part], *stl.bounds, 0), st, colour)
        est = estimate(dst, part == "skal", PROFILE_LYSRING if part == "lysring" else PROFILE)
        rows.append(("del", dst.with_suffix(".3mf").name, part, stl, colour, "", est))
        print(dst.with_suffix(".3mf").name, fmt_t(est[0]) if est else "")

    pieces = {}   # (group, colour) -> [(name, parts, settings, extents)]
    for name, parts, where, margin, height, what in COUPONS:
        for part in parts:
            stl, (_, colour, key) = stls[part], PARTS[part]
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
            shift = np.array([-(piece.bounds[0][0] + piece.bounds[1][0]) / 2, -(piece.bounds[0][1] + piece.bounds[1][1]) / 2, -piece.bounds[0][2]])
            mod = clip_modifiers(mods[part], np.maximum(lo, piece.bounds[0]), np.minimum(hi, piece.bounds[1]), shift)
            piece.apply_translation(shift)
            suffix = f"_{part}" if len(parts) > 1 else ""
            dst = out / f"{pre}_proeve-{name}{suffix}.stl"
            piece.export(dst)
            st = dict(HSET[key])
            if key == "skal" and not any(q[3] == "support_enforcer" for q in mod):
                st.update(NO_SUPPORT)
            ext = piece.extents
            if ext[2] > 2.5 * min(ext[0], ext[1]):   # tall and thin: a brim keeps it on the plate
                st.update(BRIM)
            parts3 = [(f"proeve-{name}{suffix}", piece, 1)] + mod
            write_3mf(dst.with_suffix(".3mf"), dst.stem, parts3, st, colour)
            pad = 6.0 if st.get("brim_type", "no_brim") != "no_brim" else 0.0
            pieces.setdefault((GROUP.get(name, 2), colour), []).append((dst.stem, parts3, st, ext + pad))
            note = f" ({n} krop(pe), {dropped / 1000:.1f} cm3 svævende fjernet)" if dropped > 1 or n != 1 else ""
            est = estimate(dst, False, PROFILE_LYSRING if part == "lysring" else PROFILE)
            print(f"{dst.name}: {np.round(ext, 1).tolist()} {fmt_t(est[0]) if est else ''}{note}")
            rows.append(("proeve", dst.with_suffix(".3mf").name, part, piece, colour, what if part == parts[0] else "", est))

    est_of = {r[1][:-4]: r[6] for r in rows if r[0] == "proeve"}
    plates = []
    for (g, colour), items in sorted(pieces.items(), key=lambda kv: (kv[0][0], ["sort", "hvid", "natur"].index(kv[0][1]))):
        packed = pack(items)
        for i, plate in enumerate(packed):
            f = out / f"{pre}_plade{g}-{GROUP_NAME[g]}_{colour}{f'-{i + 1}' if len(packed) > 1 else ''}.3mf"
            write_bambu_objects(f, plate, filaments=(colour,), plate="tekstureret" if colour == "natur" else "glat")
            t = [est_of[name] for name, *_ in plate]
            tot = (sum(e[0] for e in t), sum(e[1] for e in t)) if all(t) else None
            plates.append((f.name, colour, [name for name, *_ in plate], tot, g))
            print(f.name, len(plate), "stk.", fmt_t(tot[0]) if tot else "")
    write_guide(ver, out, rows, plates)
    with zipfile.ZipFile(out / f"{pre}.zip", "w", zipfile.ZIP_DEFLATED) as z:
        for f in sorted(out.iterdir()):
            if f.suffix in (".3mf", ".stl", ".md"):
                z.write(f, f.name)
    print(out / f"{pre}.zip")


COLOUR_NAME = {"sort": "PLA sort", "hvid": "PLA hvid", "natur": "klar PETG"}


def write_guide(ver, out, rows, plates):
    pre = f"{ver}-hurtig"
    full = [r for r in rows if r[0] == "del"]
    tests = [r for r in rows if r[0] == "proeve"]
    plate_total = {g: sum(p[3][0] for p in plates if p[3] and p[4] == g) for g in GROUP_NAME}
    L = [f"# Selfi Halo gen 2, version {ver.rsplit('-', 1)[-1]}: hurtigprint", "",
         f"**Version:** {pre}. Kun til pasformsprøver. Geometrien er den samme som i de normale printfiler for {ver} "
         f"(`hardware/stl/gen2/{ver}/`); kun printindstillingerne er anderledes, og der er små prøvestykker skåret ud af delene. "
         "Reglerne står i `hardware/docs/HURTIGPRINT.md`. **Brug aldrig disse filer til en boks, der skal ud til en kunde.**", "",
         f"Lavet med `python3 hardware/tools/make_hurtig.py {ver}`. Alle filer er Bambu Studio-projekter (3MF) til H2C med "
         "indstillingerne indbygget: åbn, tjek at spolen passer, og tryk Print. STL-filerne ligger ved siden af.", "",
         "## Sådan bruges sættet", "",
         f"1. **Print plade 1 først** (`plade1-nyt`, ca. {fmt_t(plate_total[1])}): {PLATE1_TEXT}. Plade 2 "
         f"(ca. {fmt_t(plate_total[2])}) er resten af holderne og samlingerne, plade 3 (ca. {fmt_t(plate_total[3])}) tilvalg og "
         "skærmens kant. Hver plade har stykker i én farve, så det er ét print pr. plade, og de kan køre på flere printere på én gang. "
         "Hvert stykke ligger også som sin egen 3MF, hvis I kun vil prøve ét sted.",
         "2. Saml stykkerne med de rigtige købedele, og gå listen \"Hvad prøves\" igennem.",
         "3. Passer det hele, så print de hele dele med kladdeindstillinger (eller de normale filer), og saml en hel boks.",
         "4. Passer noget ikke, så skriv det i en samlenote. Rettelsen laves i CAD og bliver en ny version; ret aldrig en hurtigfil.", "",
         "Tiderne er skøn fra PrusaSlicer med H2C-lignende hastigheder og kan afvige 20–40 %; Bambu Studio viser den rigtige tid, "
         "når pladen er slicet.", "",
         "## Prøveplader", "",
         "| Fil | Hvad | Filament | Stykker | Ca. tid | Ca. filament |", "|---|---|---|---|---|---|"]
    for f, colour, names, tot, g in plates:
        short = ", ".join(n.replace(f"{pre}_proeve-", "") for n in names)
        L.append(f"| `{f}` | {GROUP_TEXT[g]} | {COLOUR_NAME[colour]} | {short} | {fmt_t(tot[0]) if tot else '–'} | {f'{tot[1]:.0f} g' if tot else '–'} |")
    L += ["", "## Prøvestykker", "",
          "Hvert prøvestykke er en kasse skåret ud af en del, så det passer præcis til denne version. Det står på den samme flade "
          "som delen og printes i den samme retning. Stykker med samme navn og flere dele (fx `kamera`, `hjoerne`, `klik`) lægges sammen.", "",
          "| Fil | Filament | Mål (mm) | Ca. tid | Hvad prøves |", "|---|---|---|---|---|"]
    for _, f, part, m, colour, what, est in tests:
        L.append(f"| `{f}` | {COLOUR_NAME[colour]} | {' × '.join(f'{v:.0f}' for v in m.extents)} | {fmt_t(est[0]) if est else '–'} | {what} |")
    L += ["", "## Hele dele (kladde)", "",
          "De normale dele, 1:1, med kladdeindstillingerne. Til den første hele samling efter prøverne.", "",
          "| Fil | Filament | Mål på pladen (mm) | Ca. tid | Ca. filament |", "|---|---|---|---|---|"]
    for _, f, part, m, colour, _, est in full:
        L.append(f"| `{f}` | {COLOUR_NAME[colour]} | {' × '.join(f'{v:.1f}' for v in m.extents)} | {fmt_t(est[0]) if est else '–'} | {f'{est[1]:.0f} g' if est else '–'} |")
    L += ["", "Fronten og stativbeslaget er uden logo i hurtigsættet (fordybningen står tom). Skal logoet med, så brug de normale "
          f"`{ver}_front_flerfarvet.3mf` og `{ver}_stativbeslag_flerfarvet.3mf`. Dominance-temaet og eksempeltoppen er ikke med her; "
          "brug de normale filer.", "",
          "## Indstillinger (ligger i 3MF'erne)", "",
          "- **Kladde (alle sorte og hvide dele):** 0,28 mm lag, 2 vægge, 3 top- og bundlag (mindst 0,8 mm), 10 % crosshatch, "
          "ingen brim. Bambu PLA Basic, glat PEI. Ingen opvarmning af kammeret.",
          "- **Skallen** har support kun ved de samme enforcere som den normale skal (tree, manuel); prøvestykker uden et af de "
          "steder har ingen support. Den hele skal har 3 mm brim.",
          "- **Fronten** har elefantfodskompensation 0,15 som den normale, så skyggefugen ved lysringen bliver åben.",
          "- **Lysringen** printes som den normale (klar PETG, massiv, koncentriske baner, tekstureret PEI), men med 0,2 mm lag i "
          "stedet for 0,16.",
          "- **Stativbeslagets hylde** er massiv (6 vægge, 100 %) som i den normale 3MF, så gevindindsatsen prøves i den rigtige plast.",
          "- Høje, smalle prøvestykker har 3 mm brim.",
          "- De forstærkede hjørner fra v37 er ikke med: de ændrer ikke pasformen, kun styrken ved et fald.",
          "- Printretning som filerne ligger. Flyt eller vend dem ikke.", "",
          "## Husk", "",
          "- Kladdeindstillingerne ændrer ikke målene, men 0,28 mm lag kan flytte en højde op til et halvt lag (0,14 mm). En "
          "pasform på 0,2 mm eller mindre i højden (fx klikket og skyggefugen) bedømmes til sidst på et normalt print.",
          "- Et prøvestykke er stivere end den hele del. Bedøm klikkraft og hvor meget en væg giver efter på det hele print.",
          "- Skruer kan skrues i til prøve, men ikke ind og ud mange gange.",
          f"- Ret aldrig en fejl i en hurtigfil. Ret CAD (`{CAD_FILE}`), lav en ny version og kør værktøjet igen."]
    (out / f"PRINTGUIDE_{pre}.md").write_text("\n".join(L) + "\n")


if __name__ == "__main__":
    main()
