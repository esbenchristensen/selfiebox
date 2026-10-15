# Selfiebox "Halo" – 3D-printed enclosure (rev D)

Concept A in portrait. One front piece holds the official 7" display (rotated to portrait) and the
Camera Module 3 Wide. Two 185 mm light bars run beside the screen, a translucent stripe glows around
the body, and a strip on the back lights the wall. The unit is 172 × 232 × 66 mm and prints on a
Bambu Lab P2S Combo inside the bed safe zone.

Attachments bolt on through a 6 mm joint spacer that leaves a shadow gap:

- **Strip printer** (below): 58 mm thermal photo strips; works on the wall
- **Photo printer base** (below): hides a Canon SELPHY CP1500 for 10 × 15 cm colour prints; for bar tops
- **Venue sign** (on top): backlit name with translucent letters co-printed in the black front
- **Festival roof** (on top): 75 mm canopy, drip edge, side cheeks
- **Foot** (below): weighted bar-top foot
- **Wall cleat** with lock, **1/4"-20** tripod thread, **VESA 75**

| Unit | Nightclub wall | Bar with photo prints | Festival | Exploded |
|---|---|---|---|---|
| ![unit](img/unit.png) | ![club](img/club.png) | ![bar](img/bar.png) | ![festival](img/fest.png) | ![exploded](img/exploded.png) |

## Files

| Path | What |
|---|---|
| `cad/halo.scad` | Parametric source: unit, every attachment, assembly, print orientation |
| `stl/*.stl` | Print-ready, already rotated to print orientation |
| `tools/check_bed.py` | Checks every STL against the P2S safe zone |
| `cad/archive/halo_landscape.scad` | Rev B, the landscape version |

```sh
openscad -D 'PART="bezel"' -D 'PRINT=true' -o stl/bezel.stl cad/halo.scad
openscad -D 'DISPLAY="td2"' ...      # Touch Display 2 instead of the official 7" display
python3 tools/check_bed.py           # needs: pip install trimesh numpy networkx
```

`PART="assembly"` shows a setup. Set it with `BOTTOM` (`strip`, `photo`, `foot` or `none`),
`WITH_SIGN`, `WITH_ROOF` and `EXPLODE`.

## P2S safe zone

Every part fits inside 236 × 236 mm, which keeps it 10 mm clear of every bed edge. No part is taller
than 240 mm. AMS prints also leave at least 50 mm free for the prime tower.
`tools/check_bed.py` checks all of this: 19 of 19 parts pass. The unit front and shell (172 × 232 mm)
and the photo base (228 × 206 mm) are the largest parts. Three full setups (strip printer + sign +
roof, photo base, foot + roof) are collision-free.

## The joint

Every piece has 2 × M3 brass inserts underneath at x = ±55, y = 44, two Ø6 dowel holes at x = ±30,
y = 50, and a Ø20 cable hole. The piece below screws **up** from inside, through the joint spacer,
into those inserts. Nothing is screwed in from the top. Each front comes off with 2 Torx screws per
side, so the unit opens while it is mounted.

## Measure before the first print

- `GLASS_T` (2.0 mm) and `VIEW_DZ`: glass thickness, and whether the picture is centred on the glass.
- `CAM_LENS_FROM_TOP` (9.5 mm): lens centre measured from the top edge of the camera board.
- `PRN_CUT_W/H` (103 × 57 mm): strip printer cutout. `SELPHY`: printer footprint (182.2 × 133 × 57.6 mm).
- Insert holes: `INS_M3_D` 4.0, `INS_M4_D` 5.6, `INS_Q_D` 7.9.

## Print settings

| Part | Material | Notes |
|---|---|---|
| bezel (+ camera_ring) | PETG HF + accent colour | Face down on the textured PEI plate; the ring is the first 3 layers |
| shell / shell_closed_top | PETG HF + PETG translucent | Back down. Change to translucent at **34.0 mm** and back at **44.0 mm** |
| diffuser ×2 | PETG translucent | 100 % infill |
| led_rail, clamp_pad ×4, camera_clamp | PETG black | Flat (pads standing) |
| joint_spacer | PETG, or TPU outdoors | One per joint |
| printer_front (+ printer_label), printer_shell | PETG HF | Same as the unit |
| photo_base | PETG HF | Upside down, top plate on the bed |
| sign_front + sign_letters, sign_shell | PETG HF + translucent | Load the letters as a second part of the front |
| roof | PETG, or ASA outdoors | Standing on its back face |
| foot, wall_cleat | PETG | Flat side down |

Use 4 walls everywhere so the brass inserts sit in solid plastic.

## Electronics (12 V input)

- Mean Well GST90A12-P1M (12 V 6.67 A) → jack low on the back of the shell.
- 12→5 V 10 A buck for the Pi 5, display and LEDs; 12→9 V buck for the strip printer.
  The SELPHY uses its own Canon adapter.
- SK6812 RGBW 60/m: bars 2 × 11, glow stripe 2 × 12, wall glow 40, sign 10.
  Data on GPIO10 (SPI) → 74AHCT125. Cap the LEDs at 3 A in software.
- Rotate the official display to portrait in the boot config.

## Assembly

1. Install the inserts.
2. Press the diffusers into the front, then fit the camera and its clamp.
3. Lay the display between the end stops. Push the 4 clamp pads, with foam on their tips, into the LED rail.
4. Stick the LEDs into the channels and onto the rail's outer walls, then screw the rail down. It clamps the display.
5. Mount the Pi on the display back and connect everything.
6. Fit the jack and the wall-glow strip into the shell, then close it with 2 side screws per side.
7. Attachments: spacer, two dowels, screws up from inside the lower piece.
