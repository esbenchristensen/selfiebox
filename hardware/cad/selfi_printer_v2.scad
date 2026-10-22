// Selfi printer v2: the DNP QW410 in a vandal-proof printed ASA enclosure (sketch approved by Esben 22 Oct 2026,
// /mnt/project-files/selfi-printer/v2/selfi-printer-v2_skitse_oversigt.png).
// v1 failed in use: a dye-sub printer feeds the paper out and back in four times (Y, M, C, overcoat), and the v1 slot
// and tray were in the way; guests could also reach the printer. v2:
//   - long side to the guest, the printer turned 90 degrees so its paper exit points at the right end, into a closed
//     chamber with 190 mm free for the paper to travel during the passes (4x6, 2x6 strips, 4x4; not 4.5x8)
//   - the cut print drops onto a 30 degree chute that slides it forward into a pickup pocket low in the front;
//     a steep (54 degree) screen over the pocket ends in front of the drop zone, so nothing lies on it, and a hand
//     has to go round a corner to get near the exit
//   - gable roof at 30 degrees with a round ridge (R25): a can or a glass slides or tips off, nothing stands on top
//   - no openings on top, louvres slant down, the pocket floor drains outwards, 3.2 mm walls, no thin parts
//   - service only with a key: the cam lock in the left end locks the hood to the base; unlocked, the hood slides
//     10 mm to the left off the exit module's spigot and lifts off (roll and ribbon change)
//   - RGB: a short WS2812 strip in a rail on the chamber's back wall lights the chute, so the pocket glows. It runs
//     from the Pi Zero's GPIO and 5 V (the printer's own 5 V USB output), no controller, no buttons
// 476 mm does not fit the H2C bed, so the enclosure is three prints: hood, base and exit module.
//
// Frame: x along the unit (x = 0 at the left end, seen from the guest), y back (front face at y = 0), z up (table at z = 0).
// Usage: openscad -D 'VIEW="kappe"' -D 'PRINT=true' -o kappe.stl hardware/cad/selfi_printer_v2.scad
// Views: printed parts (kappe, sokkel, udgang, logo_hvid, logo_groen), bought parts for the 3D model
//        (c_printer, c_pi, c_inlet, c_lock, c_led, c_print, s_base, s_link), assembly "all", drawing views d_*.

include <logo_selfi.scad>

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
ROOF = 30; R_RIDGE = 25; R_EDGE = 10;
HE = BASE + PH + CLR + WALL;       // 217.2 eaves
RIDGE = HE + tan(ROOF) * D / 2;    // 281.4 sharp; rounded ridge top at 277.6
TOP = RIDGE - R_RIDGE / cos(ROOF) + R_RIDGE;
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
INLET = [28, 20]; INLET_Y = D - 55; INLET_Z = 30;     // C14 snap-in inlet in the left end, carried by the base
LOCK_Y = 60; LOCK_Z = 70;          // cam lock in the left end wall
LOCK_D = 19.3; LOCK_FLAT = 16.8;   // Euro-Locks 19 mm cam lock, 19.1 x 16.6 over the flats (RS 195-9616)
CAM_X = 33; CAM_R = 18;            // cam plate (2 thick) at the end of the 32 mm body; 18 from the axis, locked it points to -y
LOGO_S = 3.6; LOGO_Z = 120; LOGO_D = 0.8;              // logo 99 x 36 on the hood's front
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

// ---------- outline ----------
function ridge_arc(steps = 16) = let(zc = RIDGE - R_RIDGE / cos(ROOF))
  [for (i = [0:steps]) let(a = 90 - ROOF + 2 * ROOF * i / steps) [D / 2 + R_RIDGE * cos(a), zc + R_RIDGE * sin(a)]];
// end profile (y, z): walls, 30 degree gable, round ridge, R10 edges; inset by d (concentric)
module prof(d = 0) offset(delta = -d) offset(r = R_EDGE) offset(delta = -R_EDGE)
  polygon(concat([[0, 0], [D, 0], [D, HE]], ridge_arc(), [[0, HE]]));
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
  // open notch over the inlet plate, so the hood lifts and slides clear of it
  translate([-1, INLET_Y - (INLET[0] + 12) / 2, BASE - 1]) cube([WALL + 2, INLET[0] + 12, INLET_Z + INLET[1] / 2 + 6 - BASE + 1]);
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
    translate([0, INLET_Y - (INLET[0] + 14) / 2, 0]) cube([20, INLET[0] + 14, 40]);   // inlet plate stays clear
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
    // plate that carries the mains inlet, just inside the hood's notch
    translate([WALL + LIP_GAP, INLET_Y - (INLET[0] + 12) / 2 + 0.5, 0]) cube([4, INLET[0] + 11, INLET_Z + INLET[1] / 2 + 6]);
    // Pi Zero 2 W on its long edge: two slotted posts
    for (y = [96, 164]) translate([PX0 - 14, y - 6, BASE - 0.01]) difference() {
      cube([12, 12, 24]); translate([3.5, -1, 4]) cube([5, 14, 30]); translate([-1, 6 - 1.1, 4]) cube([14, 2.2, 30]);
    }
  }
  translate([-1, INLET_Y - INLET[0] / 2, INLET_Z - INLET[1] / 2]) cube([WALL + 10, INLET[0], INLET[1]]);
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
  }
  // pickup opening with rounded corners and a chamfer outside
  translate([OP_X, -1, (OP_Z0 + OP_Z1) / 2]) rotate([-90, 0, 0]) linear_extrude(WALL + 2)
    offset(r = 8) offset(delta = -8) square([OP_W, OP_Z1 - OP_Z0], center = true);
  translate([OP_X, 1.2, (OP_Z0 + OP_Z1) / 2]) rotate([90, 0, 0]) linear_extrude(1.21, scale = [(OP_W + 2.4) / OP_W, (OP_Z1 - OP_Z0 + 2.4) / (OP_Z1 - OP_Z0)])
    offset(r = 8) offset(delta = -8) square([OP_W, OP_Z1 - OP_Z0], center = true);
  for (dx = DRAINS) translate([OP_X + dx - 6, WALL - 1, OP_Z0 - 4]) cube([12, 5, 4 + 1.5]);   // drains in the stop lip
  for (s = LINK) translate([s[0], s[1], 0.8]) cylinder(d = 2.8, h = TONGUE[1]);           // pilots, open at the top
  for (y = [28, D - 28]) translate([L - 28, y, -0.01]) cylinder(d = 12.6, h = 1);            // feet
}

// ---------- logo ----------
module logo(c) translate([PM / 2, LOGO_D, LOGO_Z]) rotate([90, 0, 0]) linear_extrude(LOGO_D) scale(LOGO_S)
  if (c == "groen") logo_green2d(); else logo_white2d();

// ---------- bought parts (3D model only) ----------
module c_printer() translate([PX0, PY0, BASE]) difference() {
  minkowski() { translate([3, 3, 3]) cube([PD - 6, PW - 6, PH - 6]); sphere(3, $fn = 12); }
  translate([PD - 6, PW / 2 - 60, SLOT_Z - BASE]) cube([8, 120, 6]);         // its own paper exit
}
module c_pi() translate([PX0 - 9.8, 99, BASE + 4]) cube([1.6, 65, 30]);
module c_inlet() translate([WALL + 0.3, INLET_Y - 16, INLET_Z - 12]) cube([16, 32, 24]);
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
  else if (v == "udgang") translate([0, 0, L]) rotate([0, 90, 0]) children();                        // right end on the bed
  else rotate([0, 0, 90]) children();               // base: bottom down, turned so 287 runs along the 306 side of the bed
}

// ---------- views ----------
if (VIEW == "kappe")      place(VIEW) kappe();
if (VIEW == "sokkel")     place(VIEW) sokkel();
if (VIEW == "udgang")     place(VIEW) udgang();
if (VIEW == "logo_hvid")  place(VIEW) logo("hvid");
if (VIEW == "logo_groen") place(VIEW) logo("groen");
if (VIEW == "c_printer")  c_printer();
if (VIEW == "c_pi")       c_pi();
if (VIEW == "c_inlet")    c_inlet();
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
  translate([140 * e, 0, 0]) { color("#1d1d20") udgang(); color("#22d36b") c_led(); color("#ffffff") c_print(); }
  translate([0, 0, 150 * e]) color("#d9d9d6") c_printer();
  translate([-60 * e, 0, 60 * e]) color("#2e9e5b") c_pi();
  color("#e11d48") c_inlet();
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
