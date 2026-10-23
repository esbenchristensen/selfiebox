// Selfi printer v4: v3 with the seal Esben chose for every Selfi part (23 Oct 2026): silicone foam cord 1.5 mm
// (RS 234-2906) in 2.0 wide grooves, squeezed 33 % against a hard stop, instead of foam tape. The cord pushes
// back, so six hooks on the hood's walls run under ramps in the base's lip as the hood slides the last 10 mm onto
// the spigot: they pull it the last millimetre down and hold it there.
// Shock (Esben 23 Oct 2026: a B2C customer may drop it; the printer is dear, filament cheap; not one mm bigger):
// the printer no longer stands on the base but on a separate deck ("daempeplade") on 8.4 mm hollow cones that
// crush when the unit lands on its bottom; long hollow cones on the hood's end wall and on two hangers in the exit
// module crush when it lands on an end, and ribs on the hood's walls and roof take small knocks. The crushed parts
// are reprinted. The tongue that joined base and exit module lay under the printer and now runs the other way,
// from the base under the exit module. Everything else as v3.
// Selfi printer v3: the DNP QW410 in a vandal-proof printed ASA enclosure. v2 (sketch approved by Esben 22 Oct 2026,
// /mnt/project-files/selfi-printer/v2/selfi-printer-v2_skitse_oversigt.png) with a new top: Esben found the gable
// too much like a house roof, and a top steep enough to stop a can too tall, so v3 is flat (217.2 high, 60 lower),
// plus "Dit print" and an arrow inlaid over the pickup pocket. Everything else as v2.
// v1 failed in use: a dye-sub printer feeds the paper out and back in four times (Y, M, C, overcoat), and the v1 slot
// and tray were in the way; guests could also reach the printer. v2:
//   - long side to the guest, the printer turned 90 degrees so its paper exit points at the right end, into a closed
//     chamber with 190 mm free for the paper to travel during the passes (4x6, 2x6 strips, 4x4; not 4.5x8)
//   - the cut print drops onto a 30 degree chute that slides it forward into a pickup pocket low in the front;
//     a steep (54 degree) screen over the pocket ends in front of the drop zone, so nothing lies on it, and a hand
//     has to go round a corner to get near the exit
//   - flat top with R10 edges and no openings: a spill runs off, nothing gets in (a can can stand on it: Esben's call)
//   - no openings on top, louvres slant down, the pocket floor drains outwards, 3.2 mm walls, no thin parts
//   - service only with a key: the cam lock in the left end locks the hood to the base; unlocked, the hood slides
//     10 mm to the left off the exit module's spigot and lifts off (roll and ribbon change)
//   - RGB: a short WS2812 strip in a rail on the chamber's back wall lights the chute, so the pocket glows. It runs
//     from the Pi Zero's GPIO and 5 V (the printer's own 5 V USB output), no controller, no buttons
// 476 mm does not fit the H2C bed, so the enclosure is three prints: hood, base and exit module.
//
// Frame: x along the unit (x = 0 at the left end, seen from the guest), y back (front face at y = 0), z up (table at z = 0).
// Usage: openscad -D 'VIEW="kappe"' -D 'PRINT=true' -o kappe.stl hardware/cad/selfi_printer_v4.scad
// Views: printed parts (kappe, sokkel, udgang, logo_hvid, logo_groen, tekst_hvid, tekst_groen, konsol, vaegplade), bought parts for the 3D model
//        (c_printer, c_pi, c_kabel, c_lock, c_led, c_print, s_base, s_link, s_con, s_wall), wall parts (konsol,
//        vaegplade; konsoller/vaegplader in place), assembly "all", drawing views d_*.

include <logo_selfi.scad>
use <../tools/fonts/instrument-sans-semibold.ttf>

VIEW  = "all";
PRINT = false;        // true: the part in its print orientation, on z = 0
EX    = 0;            // assembly: 0 closed .. 1 exploded
$fn = 48;

// ---------- measures (mm) ----------
PW = 208; PH = 198; PD = 240;      // DNP QW410 W x H x D (DNP sheet): measure the real one before printing
WALL = 3.2;                        // 8 perimeters of 0.4
CLR  = 4.0;                        // printer to the hood's top and to the joint
BASE = 12.0;                       // base slab under the printer
BAY  = 40.0;                       // left end: printer rear, C14 + USB + Pi Zero 2 W, cam lock
CHB  = 190.0;                      // free paper chamber in front of the exit (measure how far the paper travels)
D = 222.5;                         // depth = gen 2 width (PW + 2 (CLR + WALL) = 222.4)
L = 476.0;
ROOF = 30;                         // chute pitch
// Flat top (Esben 23 Oct 2026: the gable read as a house roof, and every top steep enough to stop a can made the unit
// taller; "bare flad"). The top sits as low as it goes: CLR over the printer, edges R10 like v2's eaves.
R_EDGE = 10;
HE = BASE + PH + CLR + WALL;       // 217.2
TOP = HE;
PX0 = WALL + BAY;                  // printer rear
PX1 = PX0 + PD;                    // printer front with the exit
PM  = PX1 + CLR;                   // 287.2 joint hood | exit module
JG  = 0.5;                         // half the shadow joint
PY0 = (D - PW) / 2;
SLOT_Z = BASE + 135;               // printer's paper exit, read off DNP's photo: measure
SLOT_W = 124;
LIP_H = 9; LIP_T = 2.4; LIP_GAP = 0.3;
SPIG = 8;                          // spigot of the exit module into the hood
SLIDE = 10;                        // the hood slides this far left to come off the spigot
// mains: no inlet on the outside (Esben 23 Oct 2026: nobody may unplug it). The mains cable (Schuko to angled C13)
// lies in a slot through the base, open at the back edge, comes up in the left bay and plugs straight into the
// printer; a cable tie round it and the anchor post inside stops it being pulled out.
CAB_X = 12; CAB_W = 8.5; CAB_L = 48;                   // slot centre x, width (cable up to 7.5), length in from the back
ANCHOR = [18, D - 40];             // anchor post for the cable tie (10 x 10 x 18)
// seals (Esben 23 Oct 2026): silicone foam cord 1.5 (RS 234-2906), the same as halo-gen2-v20, squeezed to 1.0 (33 %).
// Grooves 2.0 wide with flat bottoms, corners R3 or more on the cord's centre line, at least 0.5 of wall either side,
// and a hard stop (the faces meet), so the groove's depth and not the force sets the squeeze.
SEAL_W = 2.0;
SEAL_D = 1.0;                      // groove in the base's top face, centred under the hood's 3.2 wall (0.6 each side)
SEAL_DS = 0.7;                     // groove round the exit module's spigot: 1.0 less the 0.3 gap to the hood
SEAL_R = 3;                        // groove corners on the cord's centre line
SEAL_X = PM - SPIG + 2.1;          // the spigot groove's left edge (2.1 in from the spigot's end)
// hooks: three on each long wall of the hood. Lowered 10 mm to the left of home they drop past the base's lip
// through open slots; sliding home they run under ramps (1 in 8) in the lip that pull the hood down the last mm.
HOOKS = [30, 140, 250];            // x of each hook's left end, home
HOOK_L = 10; HOOK_P = 1.4;         // length, how far it reaches in from the wall (1.1 into the lip, which starts 0.3 in)
HOOK_BOSS = 0.7;                   // the lip is this much thicker inside along each hook, so 1.7 stays behind the slot
HOOK_Z0 = 0.5; HOOK_Z1 = 3.0;      // over the base's top face, home; the top slopes up 1 in 8 towards its left end
HOOK_SLOPE = 1 / 8;
LOCK_Y = 60; LOCK_Z = 70;          // cam lock in the left end wall
LOCK_D = 19.3; LOCK_FLAT = 16.8;   // Euro-Locks 19 mm cam lock, 19.1 x 16.6 over the flats (RS 195-9616)
CAM_X = 33; CAM_R = 18;            // cam plate (2 thick) at the end of the 32 mm body; 18 from the axis, locked it points to -y
LOGO_S = 3.6; LOGO_Z = 120; LOGO_D = 0.8;              // logo 99 x 36 on the hood's front
SIGN_TXT = "Dit print"; SIGN_H = 17;                   // sign over the pickup pocket, centred on the logo's height
SIGN_FONT = "Instrument Sans";                         // the site's font, weight 600 (hardware/tools/fonts)
// pickup pocket and chute (y from the front)
OP_Z0 = 31; OP_Z1 = 85; OP_W = 170;                    // opening in the front of the exit module
OP_X = (PM + JG + L) / 2;          // its centre
RAMP_Y0 = 65; RAMP_Z0 = 35;        // chute foot = back of the pocket floor
function ramp_z(y) = RAMP_Z0 + (y - RAMP_Y0) * tan(ROOF);
SCREEN = [[0, 150], [48, 84], [45, 80], [0, 142]];   // 54 degree screen over the pocket
LED_Z = 136;                       // LED rail on the chamber's back wall (strip 10-12 wide)
SCREWS = [[110, 70], [110, D - 70]];                   // base to table/shelf, under the printer (B2B)
// tongue from the base under the exit module, two screws up from below into a pad in the exit module
TONGUE = [PM + 35, 5];             // to x, thickness
LINK = [[PM + 20, 60], [PM + 20, D - 60]];
// shock: the deck under the printer, its cones, and the end cones (see the header)
FLOOR = 2.0;                       // the base's floor under the deck
DECK_T = 1.6;
CONE_H = BASE - DECK_T - FLOOR;    // 8.4
CONE_D = [6, 10];                  // at the deck, at the floor
CONE_W = 0.45;                     // one perimeter: about 55-110 N each to crush; with the rings' cones about 50-100 g
POCKET = [[PX0 - 1.6, PY0 - 0.55], [PX1 + 1.4, D - PY0 + 0.55]];    // the base's pocket for the deck
DECK = [[POCKET[0][0] + 0.3, POCKET[0][1] + 0.3], [POCKET[1][0] - 0.3, POCKET[1][1] - 0.3]];
FEET_IN = [[PM - 48, 28], [PM - 48, D - 28]];          // the two feet under the pocket stand on bosses in the floor
END_CONES = [[22, 120], [22, 195], [D - 22, 120], [D - 22, 195]];   // (y, z) on the hood's end wall, into the bay
END_D = [20, 12]; END_W = 0.9;     // at the wall, at the tip; two perimeters
EXIT_CONES = [[22, 192], [D - 22, 192]];               // (y, z) on hangers from the exit module's roof
EXIT_X = 312;                      // the hangers' face; the cones run from here to 1 mm off the printer's front
RIBS_Z = [60, 110, 160];           // ribs along x on the hood's long walls; three along the roof at RIBS_Y
RIBS_Y = [40, D / 2, D - 40];
RIB_H = 3; RIB_T = 0.8;
// grips: a closed pocket in each end wall to lift by (Esben 23 Oct 2026: inside, neat; the ceiling angled up 20
// degrees inwards, so the fingers hook in behind the edge). In the hood's left end, centred, clear of the cam lock's
// sweep, the Pi's posts and the mains cable's C13, and over the base's lip, which is cut away behind it (the cup
// locates the hood there instead). In the exit module's right end in the dead space under the chute, which rises
// towards the back: so that one sits 8 lower and 10 further back
GRIP_L = [[D / 2 - 38, D / 2 + 38], [16, 38]];          // left: y, z of the opening
GRIP_R = [[GRIP_L[0][0] + 10, GRIP_L[0][1] + 10], [8, 30]];
GRIP_D = 20; GRIP_A = 20; GRIP_RAD = 6;                 // depth, the ceiling's angle, corners
// B2B wall: two identical consoles, each hung on its own printed wall cleat; one under the base, one under the
// exit module (Esben 23 Oct 2026: it must sit firmly on the wall and on its bracket)
CW = 200; CON_T = 12; CON_H = 110; // console length, thickness at the screws' bosses, height below the top
// (v4: slimmed from v3's solid 12 mm shelf, 170 high, ~650 g, to a T-arm, ~250 g: 500 N leant on the front edge is
// 55 Nm per console, about 4 MPa in the webs and 750 N on the cleat)
CON_F = 6;                         // top flange
CC = 120;                          // the console's middle, between its screws at local x 90 and 150
CLEAT_Z = -30;                     // top of the 45 degree hook
WALL_Z = [-52, -96];               // the wall cleat's screws
SEC_Z = -74;                       // the security screw
CON_X = [20, L - CW];              // the consoles' left ends: under the base, under the exit module (256 apart);
                                   // the mains cable drops down left of the left one
CON_L = [[90, 70], [90, D - 70]];  // left console: pilots for the base's SCREWS (110, y), from above
CON_R = [[150, 70], [150, D - 70]];// right console: screws up from below into the exit module's bosses (426, y)

// ---------- outline ----------
// end profile (y, z): a rectangle with R10 edges; inset by d (concentric)
module prof(d = 0) offset(delta = -d) offset(r = R_EDGE) offset(delta = -R_EDGE) square([D, TOP]);
// the profile extruded along x from x0 to x1
module bar(x0, x1, d = 0) multmatrix([[0, 0, 1, x0], [1, 0, 0, 0], [0, 1, 0, 0]]) linear_extrude(x1 - x0) prof(d);
// a closed body with 1.2 mm chamfers on both ends (the chamfers meet in a V at the joint: the shadow joint)
module body(x0, x1) hull() { bar(x0, x0 + 1.2, 1.2); bar(x0 + 1.2, x1 - 1.2); bar(x1 - 1.2, x1, 1.2); }
module zband(z0, z1) translate([-50, -50, z0]) cube([L + 100, D + 100, z1 - z0]);
// a 2D (y, z) shape extruded along x
module yz(x0, x1) multmatrix([[0, 0, 1, x0], [1, 0, 0, 0], [0, 1, 0, 0]]) linear_extrude(x1 - x0) children();

// ---------- hood ----------
module louvres() for (i = [0:4]) for (j = [0:1]) {
  y = 50 + j * 64; z = 150 + i * 11;
  // slot slanting down to the outside: no straight way in for rain or a spilt drink
  hull() { translate([-1, y, z]) cube([0.1, 56, 4]); translate([WALL + 0.9, y, z + 5]) cube([0.1, 56, 4]); }
}
module lock_cut(x0) translate([x0, LOCK_Y, LOCK_Z]) rotate([0, 90, 0]) intersection() {
  cylinder(d = LOCK_D, h = 40, $fn = 48); translate([-LOCK_FLAT / 2, -20, 0]) cube([LOCK_FLAT, 40, 40]);
}
module kappe() difference() {
  union() {
    difference() {
      intersection() { body(0, PM - JG); zband(BASE, TOP + 1); }
      bar(WALL, PM + 5, WALL);
    }
    hooks();
    end_cones();
    ribs();
    grip_cup(0, 1, GRIP_L);
    // boss round the cam lock: the end wall is 13.2 thick there (lock for panels up to 15 mm)
    intersection() { bar(WALL - 0.01, PM, WALL - 0.01); translate([WALL - 0.01, LOCK_Y - 17, LOCK_Z - 17]) cube([10, 34, 34]); }
  }
  lock_cut(-1);
  louvres();
  grip_cut(0, 1, GRIP_L);
  // lead-in at the right end's inside edge, 30 degrees x 1 mm, so the cord on the spigot slides in, not out
  hull() { bar(PM - JG - 0.01, PM - JG + 1, WALL - 0.58); bar(PM - JG - 1, PM - JG, WALL - 0.001); }
  // logo pocket in the front
  translate([PM / 2, LOGO_D, LOGO_Z]) rotate([90, 0, 0]) linear_extrude(LOGO_D + 1) scale(LOGO_S) logo_all2d();
}

// ---------- shock ----------
// a hollow cone along +z from d0 to d1 over h, wall w, open at both ends
module hcone(d0, d1, h, w) difference() {
  cylinder(d1 = d0, d2 = d1, h = h, $fn = 32);
  translate([0, 0, -0.01]) cylinder(d1 = d0 - 2 * w, d2 = d1 - 2 * w, h = h + 0.02, $fn = 32);
}
// the cones stand in two rings near the pocket's rim, where the 2 mm floor is held by the base's walls: a cone in
// the middle would bend the floor (it spans the 211 mm between the bumper feet) instead of crushing
function ring(i, s) = let(a = [DECK[0][0] + i, DECK[0][1] + i], b = [DECK[1][0] - i, DECK[1][1] - i],
  nx = round((b[0] - a[0]) / s), ny = round((b[1] - a[1]) / s), dx = (b[0] - a[0]) / nx, dy = (b[1] - a[1]) / ny)
  concat([for (k = [0 : nx - 1]) [a[0] + k * dx, a[1]]], [for (k = [0 : ny - 1]) [b[0], a[1] + k * dy]],
         [for (k = [0 : nx - 1]) [b[0] - k * dx, b[1]]], [for (k = [0 : ny - 1]) [a[0], b[1] - k * dy]]);
RINGS = [[12, 24], [34, 26]];      // (inset from the deck's edge, spacing)
function deck_cones() = [for (r = RINGS) for (c = ring(r[0], r[1]))
  if (min([for (q = concat(SCREWS, FEET_IN)) norm(c - q)]) > 16) c];
// vents (cool air in) in the unloaded middle, clear of the screws' bosses
function vents() = [for (x = [DECK[0][0] + 62 : 30 : DECK[1][0] - 60]) for (y = [DECK[0][1] + 62 : 30 : DECK[1][1] - 60])
  if (min([for (q = SCREWS) norm([x, y] - q)]) > 22) [x, y]];
// the deck: the printer stands on it, the cones stand on the base's floor. Printed deck down, cones up.
module daempeplade() difference() {
  union() {
    translate([DECK[0][0], DECK[0][1], BASE - DECK_T]) cube([DECK[1][0] - DECK[0][0], DECK[1][1] - DECK[0][1], DECK_T]);
    for (c = deck_cones()) translate([c[0], c[1], FLOOR + 0.01]) translate([0, 0, CONE_H]) mirror([0, 0, 1]) hcone(CONE_D[0], CONE_D[1], CONE_H, CONE_W);
    // stops at the printer's ends, 0.3 off it (it is held sideways by the lip, 0.75 off)
    for (y = [PY0 + 25, D - PY0 - 45]) {
      translate([DECK[0][0], y, BASE - 0.01]) cube([PX0 - 0.3 - DECK[0][0], 20, 3]);
      translate([PX1 + 0.3, y, BASE - 0.01]) cube([DECK[1][0] - PX1 - 0.3, 20, 3]);
    }
  }
  // round the B2B screws' bosses, so the deck passes them
  for (q = SCREWS) translate([q[0], q[1], BASE - DECK_T - 1]) cylinder(d = 17, h = DECK_T + 2);
  // vents (cool air in), between the cones
  for (v = vents()) translate([v[0] - 6.75, v[1] - 9, BASE - DECK_T - 1]) cube([13.5, 18, DECK_T + 2]);
}
module end_cones() for (c = END_CONES) translate([WALL - 0.01, c[0], c[1]]) rotate([0, 90, 0]) hcone(END_D[0], END_D[1], PX0 - 1 - WALL, END_W);
module exit_cones() for (c = EXIT_CONES) {
  // hanger from the roof, sloped 45 degrees so it prints (exit module: right end on the bed)
  hull() {
    translate([EXIT_X, c[0] - 11, TOP - WALL - 0.01]) cube([12 + (TOP - WALL - c[1] + 12), 22, 0.01]);
    translate([EXIT_X, c[0] - 11, c[1] - 12]) cube([12, 22, TOP - WALL - c[1] + 12]);
  }
  // the cone's foot sunk 0.5 into the hanger, which is wider than it
  translate([EXIT_X + 0.5, c[0], c[1]]) rotate([0, -90, 0]) hcone(END_D[0], END_D[1], EXIT_X + 0.5 - PX1 - 1, END_W);
}
// the pocket's void from the end face at x0 inwards (dir +1) or outwards (-1), g = GRIP_L or GRIP_R; the ceiling
// rises GRIP_A inwards and the floor 0.7, so it drains
module grip_void(x0, dir, g, grow = 0) {
  w = g[0][1] - g[0][0]; h = g[1][1] - g[1][0];
  rise = (GRIP_D + grow) * tan(GRIP_A);
  hull() for (k = [0, 1]) translate([x0 + dir * (k ? GRIP_D + grow : -1), (g[0][0] + g[0][1]) / 2, g[1][0] + (k ? 0.7 : 0)])
    rotate([0, 90, 0]) linear_extrude(0.01) translate([-(h + (k ? rise - 0.7 : 0)) / 2, 0])
      offset(r = GRIP_RAD + grow) offset(delta = -GRIP_RAD) square([h + (k ? rise - 0.7 : 0), w], center = true);
}
// the cup round it, inside the wall
module grip_cup(x0, dir, g) intersection() {
  grip_void(x0, dir, g, 2.4);
  translate([dir > 0 ? WALL - 0.01 : L - GRIP_D - 2.4, 0, 0]) cube([GRIP_D + 2.4 - WALL + 0.01, D, TOP]);
}
// the void, with a 1.2 chamfer round the opening like the body's ends
module grip_cut(x0, dir, g) {
  grip_void(x0, dir, g);
  hull() {
    translate([x0 - dir * 0.01, 0, 0]) grip_face(g, 1.2);
    translate([x0 + dir * 1.2, 0, 0]) grip_face(g, 0);
  }
}
module grip_face(g, grow) {
  w = g[0][1] - g[0][0]; h = g[1][1] - g[1][0];
  translate([0, (g[0][0] + g[0][1]) / 2, (g[1][0] + g[1][1]) / 2]) rotate([0, 90, 0]) linear_extrude(0.01)
    offset(r = GRIP_RAD + grow) offset(delta = -GRIP_RAD) square([h, w], center = true);
}
module ribs() {
  for (z = RIBS_Z, m = [0, 1]) translate([0, m * D, 0]) mirror([0, m, 0]) translate([PX0 + 8, WALL - 0.01, z]) cube([PD - 16, RIB_H, RIB_T]);
  for (y = RIBS_Y) translate([PX0 + 8, y - RIB_T / 2, TOP - WALL - RIB_H + 0.01]) cube([PD - 16, RIB_T, RIB_H]);
}

// ---------- base (under the printer) ----------
// the base's groove in plan: a U under the hood's front, left end and back walls, open to the right where it ends
// under the hood past the spigot's groove (and short of the shadow joint's chamfer)
module seal_u2d() {
  c = WALL / 2;                                       // groove centre, in from the outside
  intersection() {
    difference() {
      offset(delta = SEAL_W / 2) seal_c2d(c);
      offset(delta = -SEAL_W / 2) seal_c2d(c);
    }
    translate([-1, -1]) square([PM - JG - 2 + 1, D + 2]);
  }
}
module seal_c2d(c) translate([c, c]) offset(r = SEAL_R) offset(delta = -SEAL_R) square([L, D - 2 * c]);
// a hook's top at home: BASE + HOOK_Z1 at its right end, rising 1 in 8 to the left
function hook_top(u) = HOOK_Z1 + (HOOK_L - u) * HOOK_SLOPE;          // u from the hook's left end
// the lip's cuts for one hook (h = its left end at home), on the front lip; mirrored for the back
module hook_cut(h) {
  y0 = WALL + LIP_GAP - 0.1; y1 = WALL + HOOK_P + 0.3;
  // open slot the hook drops through, 10 mm left of home (0.5 clear each end)
  translate([h - SLIDE - 0.5, y0, BASE - 0.01]) cube([HOOK_L + 1, y1 - y0, LIP_H + 1]);
  // window under the ramp: 0.05 over the hook's top at home, the same 1 in 8
  hull() for (u = [0, HOOK_L + 0.5]) translate([h + u, y0, BASE - 0.01])
    cube([0.01, y1 - y0, hook_top(u) + 0.05 + 0.01]);
}
module hook_cuts() for (h = HOOKS) { hook_cut(h); translate([0, D, 0]) mirror([0, 1, 0]) hook_cut(h); }
// one hook on the hood's front wall; mirrored for the back
module hook(h) hull() for (u = [0, HOOK_L]) {
  translate([h + u - (u > 0 ? 0.01 : 0), WALL - 0.5, BASE + HOOK_Z0]) cube([0.01, HOOK_P + 0.5, hook_top(u) - HOOK_Z0]);
}
module hooks() for (h = HOOKS) { hook(h); translate([0, D, 0]) mirror([0, 1, 0]) hook(h); }

module lip() {
  x0 = WALL + LIP_GAP; x1 = PM - 12;
  difference() {
    union() {
      translate([x0, WALL + LIP_GAP, BASE - 0.01]) cube([x1 - x0, LIP_T, LIP_H]);
      translate([x0, D - WALL - LIP_GAP - LIP_T, BASE - 0.01]) cube([x1 - x0, LIP_T, LIP_H]);
      translate([x0, WALL + LIP_GAP, BASE - 0.01]) cube([LIP_T, D - 2 * (WALL + LIP_GAP), LIP_H]);
      for (h = HOOKS, m = [0, 1]) translate([0, m * D, 0]) mirror([0, m, 0])
        translate([h - SLIDE - 2, WALL + LIP_GAP + LIP_T - 0.01, BASE - 0.01]) cube([HOOK_L + SLIDE + 4.5, HOOK_BOSS, LIP_H]);
    }
    translate([CAB_X - CAB_W / 2 - 1, D - CAB_L - 1, -1]) cube([CAB_W + 2, CAB_L + 2, 40]);   // cable slot stays clear
  }
}
// cam keeper: two cheeks either side of the cam's plane with a roof over its locked position. The cam swings
// from pointing down (unlocked) to pointing at -y (locked) and ends under the roof: the hood can neither lift
// nor slide left. Unlocked, the cam points down beside the keeper and the hood slides off.
module keeper() difference() {
  translate([CAM_X - 7.5, LOCK_Y - CAM_R - 6, BASE - 0.01]) cube([15, 14, LOCK_Z + 10 - BASE]);
  translate([CAM_X - 1.5, LOCK_Y - CAM_R - 10, BASE + 4]) cube([3, 30, LOCK_Z + 4 - BASE - 4]);
}
module sokkel() difference() {
  union() {
    intersection() { body(0, PM - JG); zband(0, BASE); }
    lip();
    keeper();
    // tongue under the exit module
    translate([PM - JG - 1, 30, 0]) cube([TONGUE[0] - PM + JG + 1, D - 60, TONGUE[1]]);
    // anchor post for the cable tie that holds the mains cable (strain relief)
    translate([ANCHOR[0], ANCHOR[1], BASE - 0.01]) difference() { cube([10, 10, 18]); translate([-1, 3, 8]) cube([12, 4, 2.2]); }
    // Pi Zero 2 W on its long edge: two slotted posts
    for (y = [96, 164]) translate([PX0 - 14, y - 6, BASE - 0.01]) difference() {
      cube([12, 12, 24]); translate([3.5, -1, 4]) cube([5, 14, 30]); translate([-1, 6 - 1.1, 4]) cube([14, 2.2, 30]);
    }
  }
  // the lip behind the left grip's cup
  translate([WALL, GRIP_L[0][0] - 2.7, BASE - 0.02]) cube([LIP_GAP + LIP_T + 1, GRIP_L[0][1] - GRIP_L[0][0] + 5.4, LIP_H + 1]);
  // mains cable slot, through the base and open at the back edge (the cable is laid in from below)
  translate([CAB_X - CAB_W / 2, D - CAB_L, -1]) cube([CAB_W, CAB_L + 1, BASE + 2]);
  // seal groove under the hood wall (front, back and left end), for the foam cord; it runs on past the spigot's
  // groove, so the spigot's ring of cord ends on this one
  translate([0, 0, BASE - SEAL_D]) linear_extrude(SEAL_D + 1) seal_u2d();
  // under the spigot's groove a short branch inwards, so the ends of the spigot's cord turn down into this groove
  // and butt against its cord
  for (m = [0, 1]) translate([0, m * D, 0]) mirror([0, m, 0])
    translate([SEAL_X, WALL / 2, BASE - SEAL_D]) cube([SEAL_W, WALL + LIP_GAP + 1.0 - WALL / 2, SEAL_D + 1]);
  // hook slots and ramps in the lip
  hook_cuts();
  // pocket for the deck, down to the floor, but for the screws' and feet's bosses
  difference() {
    translate([POCKET[0][0], POCKET[0][1], FLOOR]) cube([POCKET[1][0] - POCKET[0][0], POCKET[1][1] - POCKET[0][1], BASE]);
    for (q = SCREWS) translate([q[0], q[1], 0]) cylinder(d = 14, h = FLOOR + 3);
    for (q = FEET_IN) translate([q[0], q[1], 0]) cylinder(d = 16, h = FLOOR + 1.5);
  }
  // vents in the floor (cool air in), under the deck's
  for (v = vents()) translate([v[0] - 5.25, v[1] - 7, -1]) cube([10.5, 14, FLOOR + 2]);
  // screws to the table or shelf (B2B): countersunk 4 mm in the bosses, put in before the deck
  for (s = SCREWS) translate([s[0], s[1], -1]) {
    cylinder(d = 4.5, h = 20); translate([0, 0, FLOOR + 3 - 2.4]) cylinder(d1 = 4.5, d2 = 9.2, h = 2.41);
  }
  // the two link screws up through the tongue into the exit module (countersunk 3.5, from below)
  for (s = LINK) translate([s[0], s[1], -1]) {
    cylinder(d = 3.9, h = 20); translate([0, 0, 1 - 0.01]) cylinder(d1 = 7.8, d2 = 3.9, h = 2.2);
  }
  // feet: four 1 mm recesses for the bumpers
  for (p = [[28, 28], [28, D - 28], [PM - 48, 28], [PM - 48, D - 28]]) translate([p[0], p[1], -0.01]) cylinder(d = 12.6, h = 1);
}

// ---------- exit module: paper chamber, chute, pocket, screen, LED rail ----------
module chute2d() polygon([[RAMP_Y0, RAMP_Z0], [D - WALL + 0.5, ramp_z(D - WALL + 0.5)],
  [D - WALL + 0.5, ramp_z(D - WALL + 0.5) - 3.2 / cos(ROOF)], [RAMP_Y0 + 3.2 * sin(ROOF), RAMP_Z0 - 3.2 * cos(ROOF)]]);
module pocket2d() polygon([[0, OP_Z0], [RAMP_Y0, RAMP_Z0], [RAMP_Y0 + 3.2 * sin(ROOF), RAMP_Z0 - 3.2 * cos(ROOF)],
  [RAMP_Y0, RAMP_Z0 - 3.4], [0, OP_Z0 - 3.2]]);
// stop lip at the front of the pocket floor, so the print stays in (the drain notches let spill out)
module stop2d() translate([WALL - 0.5, OP_Z0 - 1]) square([3.5, 9]);
DRAINS = [-60, 0, 60];
module led_rail2d() {
  translate([D - WALL - 6, LED_Z - 2]) square([6.5, 2]);              // shelf under the strip
  translate([D - WALL - 3, LED_Z + 13]) square([3.5, 2]);             // lip over it (strip up to 12 wide)
}
module udgang() difference() {
  union() {
    difference() {
      body(PM + JG, L);
      bar(PM - 1, L - WALL, WALL);
    }
    yz(PM + JG, L - WALL + 0.5) { chute2d(); pocket2d(); polygon(SCREEN); led_rail2d(); stop2d(); }
    // spigot into the hood: walls and roof only, stands on the base
    intersection() {
      difference() { bar(PM - SPIG, PM + JG + 0.5, WALL + LIP_GAP); bar(PM - SPIG - 1, PM + JG + 1, WALL + LIP_GAP + 2.4); }
      zband(BASE + 0.3, TOP);
    }
    // pad over the base's tongue, for the two link screws from below
    translate([PM + JG, 26, 0]) cube([TONGUE[0] + 5 - PM - JG, D - 52, TONGUE[1] + 10]);
    exit_cones();
    grip_cup(L, -1, GRIP_R);
    // bosses for the B2B console screws from below
    for (s = CON_R) translate([CON_X[1] + s[0], s[1], 0]) cylinder(d = 12, h = 14);
  }
  // seal groove round the spigot, for the foam cord (the hood's edge slides over it); it runs down to the base,
  // where the cord's ends press on the base's cord
  intersection() {
    difference() { bar(SEAL_X, SEAL_X + SEAL_W, WALL + LIP_GAP - 1); bar(SEAL_X - 1, SEAL_X + SEAL_W + 1, WALL + LIP_GAP + SEAL_DS); }
    zband(BASE - 1, TOP + 1);
  }
  for (s = CON_R) translate([CON_X[1] + s[0], s[1], -1]) cylinder(d = 3.2, h = 15);      // pilots, SPUN+ 4.0 x 20
    // sign pocket over the pickup opening
  translate([OP_X, LOGO_D, 0]) rotate([90, 0, 0]) linear_extrude(LOGO_D + 1) offset(delta = 0.01) { sign2d("hvid"); sign2d("groen"); }
  // pickup opening with rounded corners and a chamfer outside
  translate([OP_X, -1, (OP_Z0 + OP_Z1) / 2]) rotate([-90, 0, 0]) linear_extrude(WALL + 2)
    offset(r = 8) offset(delta = -8) square([OP_W, OP_Z1 - OP_Z0], center = true);
  translate([OP_X, 1.2, (OP_Z0 + OP_Z1) / 2]) rotate([90, 0, 0]) linear_extrude(1.21, scale = [(OP_W + 2.4) / OP_W, (OP_Z1 - OP_Z0 + 2.4) / (OP_Z1 - OP_Z0)])
    offset(r = 8) offset(delta = -8) square([OP_W, OP_Z1 - OP_Z0], center = true);
  for (dx = DRAINS) translate([OP_X + dx - 6, WALL - 1, OP_Z0 - 4]) cube([12, 5, 4 + 1.5]);   // drains in the stop lip
  // step for the base's tongue, and pilots for the link screws (3.5 x 13)
  translate([PM - 1, 29.7, -1]) cube([TONGUE[0] + 0.3 - PM + 1, D - 59.4, TONGUE[1] + 0.3 + 1]);
  for (s = LINK) translate([s[0], s[1], TONGUE[1]]) cylinder(d = 2.8, h = 9.5);
  for (y = [28, D - 28]) translate([L - 28, y, -0.01]) cylinder(d = 12.6, h = 1);            // feet
  grip_cut(L, -1, GRIP_R);
}

// ---------- B2B wall: console and wall cleat (local x 0..CW, placed at CON_X) ----------
module konsol() {
  difference() {
    union() {
      // top flange under the unit, 6 thick, with bosses down to CON_T at the screws
      translate([CC - 50, 20, -CON_F]) cube([100, D - 20, CON_F]);
      for (s = concat(CON_L, CON_R)) translate([s[0], s[1], -CON_T]) cylinder(d = 12, h = CON_T);
      // back plate, flush with the unit's back
      translate([CC - 60, D, -CON_H]) cube([120, 8, CON_H]);
      // two webs, 10 thick, from the back plate's foot to 20 high at the front
      for (x = [CC - 50, CC + 40]) hull() { translate([x, D - 0.01, -CON_H]) cube([10, 0.01, CON_H]); translate([x, 20, -20]) cube([10, 0.01, 20]); }
      // cleat: 45 degree hook behind the back plate, over the wall cleat's bevel
      translate([CC - 50, D + 7.9, CLEAT_Z]) rotate([0, 90, 0]) linear_extrude(100) polygon([[0, 0], [0, 12.1], [12.1, 12.1]]);
    }
    // a window in the flange between the screws
    translate([CC - 18, 45, -CON_F - 1]) cube([36, D - 90, CON_F + 2]);
    for (s = CON_L) translate([s[0], s[1], -CON_T - 1]) cylinder(d = 3.2, h = CON_T + 2);           // pilots, base screws
    for (s = CON_R) translate([s[0], s[1], -CON_T - 1]) {                                           // screws up into the exit module
      cylinder(d = 4.5, h = CON_T + 2); cylinder(d1 = 9.2, d2 = 4.5, h = 2.4);
    }
    // security screw (Torx with pin) through the back plate into the wall cleat, below the cleat
    translate([CC, D - 1, SEC_Z]) rotate([-90, 0, 0]) { cylinder(d = 4.5, h = 30); cylinder(d = 9, h = 4); }
  }
}
module vaegplade() difference() {
  // 45 degree bevel at the top, facing the console's hook
  translate([CC - 50, D + 8, 0]) rotate([0, 90, 0]) linear_extrude(100)
    polygon([[-CLEAT_Z + 0.2, 0], [CON_H - 4, 0], [CON_H - 4, 12], [-CLEAT_Z + 12.2, 12], [-CLEAT_Z + 0.2, 0]]);   // 0.2 under the hook
  for (x = [CC - 36, CC + 36]) for (z = WALL_Z) translate([x, D + 7, z]) rotate([-90, 0, 0]) {
    cylinder(d = 5.2, h = 20); translate([0, 0, 0.99]) cylinder(d1 = 10.4, d2 = 5.2, h = 3.01);
  }
  translate([CC, D + 7, SEC_Z]) rotate([-90, 0, 0]) cylinder(d = 3.4, h = 20);   // pilot, security screw
}
module konsoller() for (x = CON_X) translate([x, 0, 0]) konsol();
module vaegplader() for (x = CON_X) translate([x, 0, 0]) vaegplade();
module s_wall() for (c = CON_X) for (x = [CC - 36, CC + 36]) for (z = WALL_Z) translate([c + x, D + 20 + 1, z]) rotate([90, 0, 0]) cylinder(d = 5, h = 40, $fn = 12);
module s_con() for (s = CON_R) translate([CON_X[1] + s[0], s[1], -CON_T - 0.5]) { cylinder(d = 4, h = 20, $fn = 12); cylinder(d1 = 8.8, d2 = 4, h = 2.4, $fn = 16); }

// ---------- logo ----------
module logo(c) translate([PM / 2, LOGO_D, LOGO_Z]) rotate([90, 0, 0]) linear_extrude(LOGO_D) scale(LOGO_S)
  if (c == "groen") logo_green2d(); else logo_white2d();

// "Dit print" in white and a green arrow down to the pocket (2D in the front plane: x along the front, y = height)
module sign2d(c) if (c == "groen") translate([0, 89]) {
    offset(r = 0.8) offset(delta = -0.8) union() { translate([-2.25, 7]) square([4.5, 10]); polygon([[-9, 8], [9, 8], [0, -1]]); }
  } else translate([0, LOGO_Z]) text(SIGN_TXT, size = SIGN_H, font = SIGN_FONT, halign = "center", valign = "center", $fn = 48);
module sign(c) translate([OP_X, LOGO_D, 0]) rotate([90, 0, 0]) linear_extrude(LOGO_D) sign2d(c);

// ---------- bought parts (3D model only) ----------
module c_printer() translate([PX0, PY0, BASE]) difference() {
  minkowski() { translate([3, 3, 3]) cube([PD - 6, PW - 6, PH - 6]); sphere(3, $fn = 12); }
  translate([PD - 6, PW / 2 - 60, SLOT_Z - BASE]) cube([8, 120, 6]);         // its own paper exit
}
module c_pi() translate([PX0 - 9.8, 99, BASE + 4]) cube([1.6, 65, 30]);
// mains cable: in through the slot, up the bay, angled C13 into the printer's rear inlet
module c_kabel() {
  translate([CAB_X, D + 30, 3.5]) rotate([90, 0, 0]) cylinder(d = 7, h = CAB_L + 30, $fn = 16);
  translate([CAB_X, D - CAB_L, 3.5]) cylinder(d = 7, h = 22, $fn = 16);
  translate([CAB_X - 3.5, D - CAB_L - 3.5, 22]) cube([PX0 - CAB_X - 2, 7, 7]);
  translate([PX0 - 26, D - CAB_L - 16, 20]) cube([24, 32, 22]);                        // the C13 plug
}
module c_lock() translate([-2, LOCK_Y, LOCK_Z]) rotate([0, 90, 0]) {
  cylinder(d = 24, h = 2); cylinder(d = 18.8, h = CAM_X - 1 + 2, $fn = 32);
  translate([-3, -8, CAM_X - 1 + 2]) cube([6, 8 + CAM_R, 2]);            // cam, locked (pointing to -y)
}
module c_led() translate([PM + JG + 6, D - WALL - 3, LED_Z]) cube([L - WALL - PM - 12, 3, 12]);
// a 4x6 print come to rest: front edge against the stop lip, back edge on the chute
module c_print() translate([OP_X - 76, WALL + 3.3, OP_Z0 + 0.7]) rotate([atan((ramp_z(WALL + 3.3 + 102) - OP_Z0 - 0.7) / 102), 0, 0]) cube([152, 102, 0.3]);
// 4.0 x 16: the head flush with the boss (FLOOR + 3), the tip 1 mm inside the console's boss
module s_base() for (s = SCREWS) translate([s[0], s[1], FLOOR + 3 - 16]) { cylinder(d = 4, h = 16, $fn = 12); translate([0, 0, 13.6]) cylinder(d1 = 4, d2 = 8.8, h = 2.4, $fn = 16); }
module s_link() for (s = LINK) translate([s[0], s[1], 1]) { cylinder(d = 3.5, h = 13, $fn = 12); cylinder(d1 = 7, d2 = 3.5, h = 2.2, $fn = 16); }

// ---------- print orientation ----------
module place(v) {
  if (!PRINT) children();
  else if (v == "kappe" || v == "logo_hvid" || v == "logo_groen") rotate([0, -90, 0]) children();   // left end on the bed
  else if (v == "udgang" || v == "tekst_hvid" || v == "tekst_groen") translate([0, 0, L]) rotate([0, 90, 0]) children();                        // right end on the bed
  else if (v == "konsol") rotate([180, 0, 0]) children();                          // shelf top on the bed
  else if (v == "vaegplade") rotate([-90, 0, 0]) children();                       // wall side on the bed
  else if (v == "daempeplade") translate([0, 0, BASE]) mirror([0, 0, 1]) children();      // deck on the bed, cones up
  else rotate([0, 0, 90]) children();               // base: bottom down, turned so 287 runs along the 306 side of the bed
}

// ---------- views ----------
if (VIEW == "kappe")      place(VIEW) kappe();
if (VIEW == "sokkel")     place(VIEW) sokkel();
if (VIEW == "udgang")     place(VIEW) udgang();
if (VIEW == "logo_hvid")  place(VIEW) logo("hvid");
if (VIEW == "logo_groen") place(VIEW) logo("groen");
if (VIEW == "tekst_hvid") place(VIEW) sign("hvid");
if (VIEW == "tekst_groen") place(VIEW) sign("groen");
if (VIEW == "c_printer")  c_printer();
if (VIEW == "daempeplade") place(VIEW) daempeplade();
if (VIEW == "c_pi")       c_pi();
if (VIEW == "konsol")     place(VIEW) konsol();
if (VIEW == "vaegplade")  place(VIEW) vaegplade();
if (VIEW == "konsoller")  konsoller();
if (VIEW == "vaegplader") vaegplader();
if (VIEW == "s_wall")     s_wall();
if (VIEW == "s_con")      s_con();
if (VIEW == "c_kabel")    c_kabel();
if (VIEW == "c_lock")     c_lock();
if (VIEW == "c_led")      c_led();
if (VIEW == "c_print")    c_print();
if (VIEW == "s_base")     s_base();
if (VIEW == "s_link")     s_link();
module asm() {
  e = EX;
  translate([-SLIDE * e, 0, 300 * e]) { color("#1d1d20") kappe(); color("#f5f5f4") logo("hvid"); color("#22d36b") logo("groen");
    color("#c3c7cf") c_lock(); }
  color("#1d1d20") sokkel();
  translate([0, 0, 75 * e]) color("#e05a2b") daempeplade();
  translate([140 * e, 0, 0]) { color("#1d1d20") udgang(); color("#f5f5f4") sign("hvid"); color("#22d36b") sign("groen"); color("#22d36b") c_led(); color("#ffffff") c_print(); }
  translate([0, 0, 150 * e]) color("#d9d9d6") c_printer();
  translate([-60 * e, 0, 60 * e]) color("#2e9e5b") c_pi();
  color("#2b2b2f") c_kabel();
}
if (VIEW == "all") asm();
// line drawings (projections and sections for the drawing sheet)
module whole() { kappe(); sokkel(); udgang(); daempeplade(); }
END = [[0, 1, 0, 0], [0, 0, 1, 0], [-1, 0, 0, 0], [0, 0, 0, 1]];   // seen from the right end: (y, z) on the sheet
if (VIEW == "d_front") projection() rotate([-90, 0, 0]) whole();
if (VIEW == "d_end")   projection() multmatrix(END) whole();
if (VIEW == "d_top")   projection() whole();
if (VIEW == "d_cut_end") projection(cut = true) multmatrix(END) translate([-(PM + (L - PM) / 2), 0, 0]) union() { udgang(); c_printer(); c_led(); }
if (VIEW == "d_cut_long") projection(cut = true) rotate([-90, 0, 0]) translate([0, -D / 2, 0]) union() { whole(); c_printer(); c_pi(); }
if (VIEW == "d_cut_lock") projection(cut = true) multmatrix(END) translate([-CAM_X, 0, 0]) union() { kappe(); sokkel(); c_lock(); }
