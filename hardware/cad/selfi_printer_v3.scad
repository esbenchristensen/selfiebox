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
// Usage: openscad -D 'VIEW="kappe"' -D 'PRINT=true' -o kappe.stl hardware/cad/selfi_printer_v3.scad
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
// seals (Esben 23 Oct 2026: tight, with tape in grooves): self-adhesive foam tape 3 x 1 in 3.2 wide grooves
SEAL_D = 0.6;                      // groove in the base's top face under the hood wall: 0.4 compression
SEAL_DS = 0.4;                     // groove round the exit module's spigot (0.3 gap to the hood): 0.3 compression
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
LINK = [[PM - 15, 45], [PM - 15, D - 45]];             // base to the exit module's tongue
TONGUE = [PM - 30, 6];             // tongue under the base: from x, thickness
// B2B wall: two identical consoles, each hung on its own printed wall cleat; one under the base, one under the
// exit module (Esben 23 Oct 2026: it must sit firmly on the wall and on its bracket)
CW = 200; CON_T = 12; CON_H = 170; // console length, shelf thickness, height below the shelf
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
    // boss round the cam lock: the end wall is 13.2 thick there (lock for panels up to 15 mm)
    intersection() { bar(WALL - 0.01, PM, WALL - 0.01); translate([WALL - 0.01, LOCK_Y - 17, LOCK_Z - 17]) cube([10, 34, 34]); }
  }
  lock_cut(-1);
  louvres();
  // logo pocket in the front
  translate([PM / 2, LOGO_D, LOGO_Z]) rotate([90, 0, 0]) linear_extrude(LOGO_D + 1) scale(LOGO_S) logo_all2d();
}

// ---------- base (under the printer) ----------
module lip() {
  x0 = WALL + LIP_GAP; x1 = PM - 12;
  difference() {
    union() {
      translate([x0, WALL + LIP_GAP, BASE - 0.01]) cube([x1 - x0, LIP_T, LIP_H]);
      translate([x0, D - WALL - LIP_GAP - LIP_T, BASE - 0.01]) cube([x1 - x0, LIP_T, LIP_H]);
      translate([x0, WALL + LIP_GAP, BASE - 0.01]) cube([LIP_T, D - 2 * (WALL + LIP_GAP), LIP_H]);
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
    // fence that locates the printer (3 high, 1 mm clearance), open at the exit end
    translate([0, 0, BASE - 0.01]) difference() {
      translate([PX0 - 3.4, PY0 - 3.4, 0]) cube([PD + 6.8, PW + 6.8, 3]);
      translate([PX0 - 1, PY0 - 1, -1]) cube([PD + 2, PW + 2, 5]);
      translate([PX1 - 5, PY0 + 20, -1]) cube([10, PW - 40, 5]);
      translate([PM - SPIG - 1, -1, -1]) cube([20, D + 2, 5]);            // the exit module's spigot stands here
    }
    // anchor post for the cable tie that holds the mains cable (strain relief)
    translate([ANCHOR[0], ANCHOR[1], BASE - 0.01]) difference() { cube([10, 10, 18]); translate([-1, 3, 8]) cube([12, 4, 2.2]); }
    // Pi Zero 2 W on its long edge: two slotted posts
    for (y = [96, 164]) translate([PX0 - 14, y - 6, BASE - 0.01]) difference() {
      cube([12, 12, 24]); translate([3.5, -1, 4]) cube([5, 14, 30]); translate([-1, 6 - 1.1, 4]) cube([14, 2.2, 30]);
    }
  }
  // mains cable slot, through the base and open at the back edge (the cable is laid in from below)
  translate([CAB_X - CAB_W / 2, D - CAB_L, -1]) cube([CAB_W, CAB_L + 1, BASE + 2]);
  // seal groove under the hood wall (front, back and left end), for foam tape 3 x 1
  difference() {
    intersection() { body(0, PM - JG); zband(BASE - SEAL_D, BASE + 1); }
    bar(WALL, PM + 5, WALL);
  }
  // vents under the printer (cool air in), clear of the screws
  for (i = [0:8]) for (j = [0:4]) translate([PX0 + 30 + i * 22, PY0 + 30 + j * 33 - 3.5 + 16, -1]) cube([7, 18, BASE + 2]);
  // screws to the table or shelf (B2B): countersunk 4 mm, heads flush with the top, under the printer
  for (s = SCREWS) translate([s[0], s[1], -1]) {
    cylinder(d = 4.5, h = 20); translate([0, 0, BASE + 1 - 2.4]) cylinder(d1 = 4.5, d2 = 9.2, h = 2.41);
  }
  // step for the exit module's tongue, and the two link screws down into it (countersunk 3.5)
  translate([TONGUE[0] - 0.5, 29.5, -1]) cube([PM, D - 59, TONGUE[1] + 1.3]);
  for (s = LINK) translate([s[0], s[1], -1]) {
    cylinder(d = 3.9, h = 20); translate([0, 0, BASE + 1 - 2.2]) cylinder(d1 = 3.9, d2 = 7.8, h = 2.21);
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
    // tongue under the base, held by the two link screws
    translate([TONGUE[0], 30, 0]) cube([PM + JG + 1 - TONGUE[0], D - 60, TONGUE[1]]);
    // bosses for the B2B console screws from below
    for (s = CON_R) translate([CON_X[1] + s[0], s[1], 0]) cylinder(d = 12, h = 14);
  }
  // seal groove round the spigot, for foam tape 3 x 1 (the hood's edge slides over it)
  intersection() {
    difference() { bar(PM - SPIG + 1.5, PM - SPIG + 4.7, WALL + LIP_GAP - 1); bar(PM - SPIG + 1, PM - SPIG + 5.2, WALL + LIP_GAP + SEAL_DS); }
    zband(BASE + 0.3, TOP + 1);
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
  for (s = LINK) translate([s[0], s[1], 0.8]) cylinder(d = 2.8, h = TONGUE[1]);           // pilots, open at the top
  for (y = [28, D - 28]) translate([L - 28, y, -0.01]) cylinder(d = 12.6, h = 1);            // feet
}

// ---------- B2B wall: console and wall cleat (local x 0..CW, placed at CON_X) ----------
module konsol() {
  difference() {
    union() {
      // shelf under the unit
      translate([0, 20, -CON_T]) cube([CW, D - 20, CON_T]);
      // back plate, flush with the unit's back
      translate([12, D, -CON_H]) cube([CW - 24, 10, CON_H]);
      // two solid gussets, 14 thick
      for (x = [12, CW - 26]) hull() { translate([x, D - 0.01, -CON_H]) cube([14, 10, 1]); translate([x, 40, -CON_T]) cube([14, D - 30, 0.1]); }
      // cleat: 45 degree hook behind the back plate, over the wall cleat's bevel
      translate([30, D + 9.9, -48]) rotate([0, 90, 0]) linear_extrude(CW - 60) polygon([[0, 0], [0, 12.1], [12.1, 12.1]]);
    }
    for (s = CON_L) translate([s[0], s[1], -CON_T - 1]) cylinder(d = 3.2, h = CON_T + 2);           // pilots, base screws
    for (s = CON_R) translate([s[0], s[1], -CON_T - 1]) {                                           // screws up into the exit module
      cylinder(d = 4.5, h = CON_T + 2); cylinder(d1 = 9.2, d2 = 4.5, h = 2.4);
    }
    // security screw (Torx with pin) through the back plate into the wall cleat, below the cleat
    translate([CW / 2, D - 1, -CON_H + 25]) rotate([-90, 0, 0]) { cylinder(d = 4.5, h = 30); cylinder(d = 9, h = 4); }
  }
}
module vaegplade() difference() {
  // 45 degree bevel at the top, facing the console's hook
  translate([30, D + 10, 0]) rotate([0, 90, 0]) linear_extrude(CW - 60) polygon([[48, 0], [CON_H - 10, 0], [CON_H - 10, 12], [60, 12], [48, 0]]);
  for (x = [CW / 2 - 45, CW / 2 + 45]) for (z = [-70, -140]) translate([x, D + 9, z]) rotate([-90, 0, 0]) {
    cylinder(d = 5.2, h = 20); translate([0, 0, 0.99]) cylinder(d1 = 10.4, d2 = 5.2, h = 3.01);
  }
  translate([CW / 2, D + 9, -CON_H + 25]) rotate([-90, 0, 0]) cylinder(d = 3.4, h = 20);   // pilot, security screw
}
module konsoller() for (x = CON_X) translate([x, 0, 0]) konsol();
module vaegplader() for (x = CON_X) translate([x, 0, 0]) vaegplade();
module s_wall() for (c = CON_X) for (x = [CW / 2 - 45, CW / 2 + 45]) for (z = [-70, -140]) translate([c + x, D + 22 + 1, z]) rotate([90, 0, 0]) cylinder(d = 5, h = 40, $fn = 12);
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
module s_base() for (s = SCREWS) translate([s[0], s[1], -14]) { cylinder(d = 4, h = 26, $fn = 12); translate([0, 0, 23.6]) cylinder(d1 = 4, d2 = 8.8, h = 2.4, $fn = 16); }
module s_link() for (s = LINK) translate([s[0], s[1], 1]) { cylinder(d = 3.5, h = 11, $fn = 12); translate([0, 0, 8.8]) cylinder(d1 = 3.5, d2 = 7, h = 2.2, $fn = 16); }

// ---------- print orientation ----------
module place(v) {
  if (!PRINT) children();
  else if (v == "kappe" || v == "logo_hvid" || v == "logo_groen") rotate([0, -90, 0]) children();   // left end on the bed
  else if (v == "udgang" || v == "tekst_hvid" || v == "tekst_groen") translate([0, 0, L]) rotate([0, 90, 0]) children();                        // right end on the bed
  else if (v == "konsol") rotate([180, 0, 0]) children();                          // shelf top on the bed
  else if (v == "vaegplade") rotate([-90, 0, 0]) children();                       // wall side on the bed
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
  translate([140 * e, 0, 0]) { color("#1d1d20") udgang(); color("#f5f5f4") sign("hvid"); color("#22d36b") sign("groen"); color("#22d36b") c_led(); color("#ffffff") c_print(); }
  translate([0, 0, 150 * e]) color("#d9d9d6") c_printer();
  translate([-60 * e, 0, 60 * e]) color("#2e9e5b") c_pi();
  color("#2b2b2f") c_kabel();
}
if (VIEW == "all") asm();
// line drawings (projections and sections for the drawing sheet)
module whole() { kappe(); sokkel(); udgang(); }
END = [[0, 1, 0, 0], [0, 0, 1, 0], [-1, 0, 0, 0], [0, 0, 0, 1]];   // seen from the right end: (y, z) on the sheet
if (VIEW == "d_front") projection() rotate([-90, 0, 0]) whole();
if (VIEW == "d_end")   projection() multmatrix(END) whole();
if (VIEW == "d_top")   projection() whole();
if (VIEW == "d_cut_end") projection(cut = true) multmatrix(END) translate([-(PM + (L - PM) / 2), 0, 0]) union() { udgang(); c_printer(); c_led(); }
if (VIEW == "d_cut_long") projection(cut = true) rotate([-90, 0, 0]) translate([0, -D / 2, 0]) union() { whole(); c_printer(); c_pi(); }
if (VIEW == "d_cut_lock") projection(cut = true) multmatrix(END) translate([-CAM_X, 0, 0]) union() { kappe(); sokkel(); c_lock(); }
