// Selfi printer v1: a DNP QW410 dye-sub printer in a printed ASA enclosure that stands beside the box.
// Same width and corner as gen 2 (222.5 wide, master superellipse A 26 / n 3 offset 16.8, see
// tools/gen2_sketches/concentric.py), one hood for every use, and the base swapped per use:
//   bord  (B2C rental): hood clicks onto the base on 4 detents, no key
//   hylde (B2B shelf/counter): base screwed to the shelf from inside, hood locked with a cam lock
//   vaeg  (B2B wall): base screwed onto a printed console that hangs on a wall cleat, hood locked
// Inside: the printer on the base, and in the rear bay a Pi Zero 2 W (CUPS + Gutenprint print server on
// wifi), powered from the printer's own 5 V 2 A USB output. One mains cable in at the back. Sketches: /mnt/project-files/selfi-printer/v1/.
//
// Frame: x right (seen from the front), y back (front face at y = 0), z up (bottom of the base at z = 0).
// Usage: openscad -D 'VIEW="kappe"' -D 'PRINT=true' -o kappe.stl hardware/cad/selfi_printer_v1.scad
// Views: printed parts (kappe, kappe_laas, sokkel, bakke, konsol, vaegplade, logo_hvid, logo_groen),
//        bought parts for the 3D model (c_printer, c_pi, c_inlet, c_lock, s_*), assembly "all".

include <logo_selfi.scad>

VIEW  = "all";
PRINT = false;        // true: the part in its print orientation, on z = 0
LOCK  = false;        // assembly: show the B2B hood with the cam lock
MOUNT = "bord";       // assembly: bord | hylde | vaeg
$fn = 64;

// ---------- measures (mm) ----------
PW = 208; PH = 198; PD = 240;      // DNP QW410 W x H x D (DNP brochure and user guide); measure the real one before printing
// QW410 (user guide p. 12 and photos): top door opens upwards (lever at the front), paper output high on the
// front with the trash box below it, rear: C14 inlet + power switch low, USB-B + 5 V 2 A USB out at mid height,
// fan high up, vents on the side. 5-35 C, natural convection.
WALL  = 3.2;                       // hood wall, 8 perimeters of 0.4
CLR   = 4.0;                       // printer to hood, sides and top
CLR_F = 8.0;                       // printer to hood front (paper exit)
BAY   = 40.0;                      // rear bay: Pi Zero, angled C13 and USB plugs, cables
BASE  = 12.0;                      // base slab
W = 222.5;                         // = gen 2 width (PW + 2 (CLR + WALL) = 222.4)
H = 220.0;
D = WALL + CLR_F + PD + BAY + WALL;   // 294.4
PY0 = WALL + CLR_F;                // printer front
SLOT_Z = 147; SLOT_W = 124; SLOT_H = 8;  // paper exit (4.5" roll = 114.3 wide); about 135 over the printer's
                                         // bottom, read off DNP's photo: measure before printing
LIP_H = 9; LIP_T = 2.4; LIP_GAP = 0.3;   // base lip inside the hood
INLET = [28, 20];                  // C14 snap-in panel inlet cut-out (W x H)
INLET_X = -60; INLET_Z = 30;       // centre of the inlet, seen from the back on the left of the bay
LOCK_Y = D - 24; LOCK_Z = 62;      // cam lock in the right side wall, in the rear bay
LOCK_D = 19.2; LOCK_FLAT = 17.0;   // 19 mm cam lock with two flats
LOGO_S = 3.3;                      // logo 27.5 x 10 -> 91 x 33
LOGO_Z = 72; LOGO_D = 0.8;         // inlay 0.8 deep (4 layers) in the front, under the tray
TRAY = [150, 72, 16];              // catch tray W x D x lip
SCREWS = [[-55, 120], [55, 120]];  // base to shelf/console, under the printer (x, y)
CON_T = 12; CON_H = 170;           // console shelf thickness, height below the shelf

// ---------- outline ----------
function sq_pts(hw, hh, off = 16.8, A = 26, N = 3, steps = 24) = [
  for (c = [[1, 1, 0], [-1, 1, 90], [-1, -1, 180], [1, -1, 270]]) for (i = [0:steps])
    let(t = c[2] + 90 * i / steps, co = cos(t), si = sin(t),
        u = A * sign(co) * pow(abs(co), 2 / N), v = A * sign(si) * pow(abs(si), 2 / N),
        nx = sign(co) * pow(abs(co), 2 - 2 / N), nz = sign(si) * pow(abs(si), 2 - 2 / N),
        L = max(norm([nx, nz]), 1e-9), cx = c[0] * (hw - off - A), cz = c[1] * (hh - off - A))
    [cx + u + off * nx / L, cz + v + off * nz / L]];

module profile(d = 0) translate([0, H / 2]) offset(delta = -d) polygon(sq_pts(W / 2, H / 2));
// the front outline extruded from y0 to y1, inset by d
module prism(y0, y1, d = 0) translate([0, y1, 0]) rotate([90, 0, 0]) linear_extrude(y1 - y0) profile(d);
// the whole enclosure: 1.2 mm chamfer on the front and back edges
module outer() hull() { prism(0, 1.2, 1.2); prism(1.2, D - 1.2); prism(D - 1.2, D, 1.2); }
module zband(z0, z1) translate([-W, -50, z0]) cube([2 * W, D + 100, z1 - z0]);

// ---------- hood ----------
DET_X = [-55, 55];                 // detents on the front and back lip faces
module detent_groove(y, s) translate([0, y, BASE + 4.5]) for (x = DET_X)
  translate([x, 0, 0]) rotate([0, 90, 0]) cylinder(d = 2.4, h = 22, center = true, $fn = 24);

module kappe(lock = false) difference() {
  intersection() { outer(); zband(BASE, H + 1); }
  prism(WALL, D - WALL, WALL);
  zband(-10, BASE + 0.01);
  // paper exit, chamfered outside
  hull() {
    translate([-SLOT_W / 2, -1, SLOT_Z]) cube([SLOT_W, 0.1, SLOT_H]);
    translate([-SLOT_W / 2 + 1.2, WALL + 0.1, SLOT_Z + 1.2]) cube([SLOT_W - 2.4, 0.1, SLOT_H - 2.4]);
  }
  translate([-SLOT_W / 2 + 1.2, -1, SLOT_Z + 1.2]) cube([SLOT_W - 2.4, WALL + 2, SLOT_H - 2.4]);
  // two slots for the catch tray's hooks, under the exit
  for (x = [-50, 50]) translate([x - 8, -1, SLOT_Z - 16]) cube([16, WALL + 2, 4]);
  // logo pocket
  translate([0, LOGO_D, LOGO_Z]) rotate([90, 0, 0]) linear_extrude(LOGO_D + 1) scale(LOGO_S) logo_all2d();
  // back: open notch over the inlet, so the hood lifts off over it
  translate([INLET_X - (INLET[0] + 12) / 2, D - WALL - 1, -1]) cube([INLET[0] + 12, WALL + 2, INLET_Z + INLET[1] / 2 + 6 + 1]);
  // vents at the top of the back wall (warm air out)
  for (i = [-4:4]) translate([i * 18 - 5, D - WALL - 1, H - 46]) cube([10, WALL + 2, 22]);
  // vents in both sides, high at the rear, by the printer's own side vents and fan
  for (sx = [-1, 1]) for (i = [0:5]) translate([sx * W / 2 - 10, D - BAY - 96 + i * 18, H - 80]) cube([20, 10, 36]);
  // detent grooves in the front and back wall (blind, 0.8 deep)
  detent_groove(WALL, 1); detent_groove(D - WALL, -1);
  if (lock) translate([W / 2 - 20, LOCK_Y, LOCK_Z]) rotate([0, 90, 0]) intersection() {
    cylinder(d = LOCK_D, h = 40, $fn = 48); translate([-LOCK_FLAT / 2, -20, 0]) cube([LOCK_FLAT, 40, 40]);
  }
}
// boss around the cam lock: the wall is 10 mm thick there (lock for panels up to 12 mm)
module lock_boss() intersection() {
  prism(WALL - 0.01, D - WALL, WALL - 0.01);
  translate([W / 2 - 10 - WALL, LOCK_Y - 17, LOCK_Z - 17]) cube([10 + WALL, 34, 34]);
}
module kappe_full(lock = false) difference() {
  union() { kappe(false); if (lock) lock_boss(); }
  if (lock) translate([W / 2 - 30, LOCK_Y, LOCK_Z]) rotate([0, 90, 0]) intersection() {
    cylinder(d = LOCK_D, h = 40, $fn = 48); translate([-LOCK_FLAT / 2, -20, 0]) cube([LOCK_FLAT, 40, 40]);
  }
}

// ---------- base ----------
module lip() intersection() {
  difference() {
    prism(WALL + LIP_GAP, D - WALL - LIP_GAP, WALL + LIP_GAP);
    prism(WALL + LIP_GAP + LIP_T, D - WALL - LIP_GAP - LIP_T, WALL + LIP_GAP + LIP_T);
    // the inlet notch and the lock catch stay clear
    translate([INLET_X - (INLET[0] + 14) / 2, D - 20, 0]) cube([INLET[0] + 14, 30, 40]);
  }
  zband(BASE - 0.01, BASE + LIP_H);
}
// detent ridges on the lip (half round 0.8), springing in on the 2.4 lip
module detents() for (y = [WALL + LIP_GAP, D - WALL - LIP_GAP]) translate([0, y, BASE + 4.5]) for (x = DET_X)
  translate([x, 0, 0]) rotate([0, 90, 0]) cylinder(d = 1.6, h = 20, center = true, $fn = 24);

module sokkel() difference() {
  union() {
    intersection() { outer(); zband(0, BASE); }
    lip(); detents();
    // fence that locates the printer (3 mm high, 1 mm clearance)
    translate([0, 0, BASE]) difference() {
      translate([-PW / 2 - 3.4, PY0 - 3.4, 0]) cube([PW + 6.8, PD + 6.8, 3]);
      translate([-PW / 2 - 1, PY0 - 1, -1]) cube([PW + 2, PD + 2, 5]);
      translate([-70, PY0 - 5, -1]) cube([140, 6, 5]);           // open at the front: paper and scraps
    }
    // rear bay: plate that carries the mains inlet
    translate([INLET_X - (INLET[0] + 12) / 2 + 0.5, D - WALL - LIP_GAP - 4, 0]) cube([INLET[0] + 11, 4, INLET_Z + INLET[1] / 2 + 6]);
    // Pi Zero 2 W: two slotted posts, the board stands on its long edge
    for (x = [-2, 66]) translate([x, D - WALL - 30, BASE]) difference() {
      cube([6, 12, 24]); translate([2, 3.5, 4]) cube([2.2, 5, 30]);   // 1.6 board + play
    }
    // lock catch: the cam turns down behind this tooth
    if (true) translate([W / 2 - WALL - 24, LOCK_Y - 10, BASE]) difference() {
      cube([10, 20, LOCK_Z - BASE - 6]);
    }
  }
  translate([INLET_X - INLET[0] / 2, D - 10, INLET_Z - INLET[1] / 2]) cube([INLET[0], 20, INLET[1]]);
  // vents under the printer (cool air in), clear of the screws
  for (i = [-4:4]) for (j = [0:5]) translate([i * 20 - 3.5, PY0 + 40 + j * 30, -1]) cube([7, 20, BASE + 2]);
  // screws to the shelf or console: countersunk 4 mm (SPUN+ 4.0 x 30), heads flush with the top
  for (s = SCREWS) translate([s[0], s[1], -1]) {
    cylinder(d = 4.5, h = 20);
    translate([0, 0, BASE + 1 - 2.4]) cylinder(d1 = 4.5, d2 = 9.2, h = 2.41);
  }
  // cable holes from the bay into the printer area are open (the bay is part of the hood space)
  // feet: four 1 mm recesses for the bumpers
  for (x = [-W / 2 + 30, W / 2 - 30]) for (y = [30, D - 30]) translate([x, y, -0.01]) cylinder(d = 12.6, h = 1);
}

// ---------- catch tray ----------
module bakke() {
  t = 3;
  difference() {
    union() {
      // floor sloping 8 deg down towards the printer, side walls and a front lip
      hull() {
        translate([-TRAY[0] / 2, -TRAY[1], SLOT_Z - 22]) cube([TRAY[0], 0.1, TRAY[2]]);
        translate([-TRAY[0] / 2, -0.1, SLOT_Z - 22]) cube([TRAY[0], 0.1, TRAY[2] - 6]);
      }
      // back plate against the hood
      translate([-TRAY[0] / 2 + 20, -t, SLOT_Z - 24]) cube([TRAY[0] - 40, t, 12]);
    }
    hull() {
      translate([-TRAY[0] / 2 + t, -TRAY[1] + t, SLOT_Z - 22 + t + 2]) cube([TRAY[0] - 2 * t, 0.1, 40]);
      translate([-TRAY[0] / 2 + t, -t, SLOT_Z - 22 + t]) cube([TRAY[0] - 2 * t, 0.1, 40]);
    }
  }
  // hooks through the slots, hooking down behind the wall
  for (x = [-50, 50]) translate([x - 7.5, -0.01, SLOT_Z - 15.8]) {
    cube([15, WALL + 0.4, 3.6]);
    translate([0, WALL + 0.4, -5]) cube([15, 2.4, 8.6]);
  }
}

// ---------- console + wall cleat (B2B wall) ----------
CW = W;                             // console as wide as the unit
module konsol() {
  difference() {
    union() {
      // shelf under the base
      intersection() { translate([0, 0, -CON_T]) outer(); zband(-CON_T, 0); translate([-W, 20, -50]) cube([2 * W, D, 100]); }   // from y 20: fits the bed
      // back plate against the wall plate
      translate([-CW / 2 + 12, D, -CON_H]) cube([CW - 24, 10, CON_H]);
      // two solid gussets, 14 mm thick
      for (x = [-CW / 2 + 12, CW / 2 - 26]) hull() {
        translate([x, D - 0.01, -CON_H]) cube([14, 10, 1]);
        translate([x, 40, -CON_T]) cube([14, D - 30, 0.1]);
      }
      // cleat: 45 deg hook behind the back plate, over the wall plate's bevel
      translate([-CW / 2 + 30, D + 9.9, -48]) rotate([0, 90, 0]) linear_extrude(CW - 60)
        polygon([[0, 0], [0, 12.1], [12.1, 12.1]]);
    }
    for (s = SCREWS) translate([s[0], s[1], -CON_T - 1]) cylinder(d = 3.2, h = CON_T + 2);   // pilot for SPUN+ 4.0
    // security screw through the back plate into the wall plate, below the cleat
    translate([0, D - 1, -CON_H + 25]) rotate([-90, 0, 0]) { cylinder(d = 4.5, h = 30); cylinder(d = 9, h = 4); }
  }
}
module vaegplade() difference() {
  // 45 deg bevel at the top, facing the console's hook
  translate([-CW / 2 + 30, D + 10, 0]) rotate([0, 90, 0]) linear_extrude(CW - 60)
    polygon([[48, 0], [CON_H - 10, 0], [CON_H - 10, 12], [60, 12], [48, 0]]);
  for (x = [-60, 60]) for (z = [-70, -140]) translate([x, D + 9, z]) rotate([-90, 0, 0]) {
    cylinder(d = 5.2, h = 20); translate([0, 0, 0.99]) cylinder(d1 = 10.4, d2 = 5.2, h = 3.01);
  }
  translate([0, D + 9, -CON_H + 25]) rotate([-90, 0, 0]) cylinder(d = 3.4, h = 20);   // pilot, security screw
}

// ---------- logo ----------
module logo(c) translate([0, LOGO_D, LOGO_Z]) rotate([90, 0, 0]) linear_extrude(LOGO_D) scale(LOGO_S)
  if (c == "groen") logo_green2d(); else logo_white2d();

// ---------- bought parts (3D model only) ----------
module c_printer() translate([-PW / 2, PY0, BASE]) difference() {
  minkowski() { translate([3, 3, 3]) cube([PW - 6, PD - 6, PH - 6]); sphere(3, $fn = 12); }
  translate([-1 + PW / 2 - 60, -1, SLOT_Z - BASE + 1]) cube([120, 8, 6]);   // its own paper exit
}
module c_pi() translate([0, D - WALL - 24, BASE + 4]) cube([65, 1.6, 30]);
module c_inlet() translate([INLET_X - 16, D - WALL - 16, INLET_Z - 12]) cube([32, 16, 24]);
module c_lock() translate([W / 2 - 10 - WALL - 14, LOCK_Y, LOCK_Z]) rotate([0, 90, 0]) {
  cylinder(d = 18.8, h = 14 + 10 + WALL, $fn = 32); translate([0, 0, 14 + 10 + WALL]) cylinder(d = 24, h = 2);
  translate([-3, -18, 0]) cube([6, 26, 2]);    // cam
}
module s_base() for (s = SCREWS) translate([s[0], s[1], -14]) { cylinder(d = 4, h = 26, $fn = 12); translate([0, 0, 23.6]) cylinder(d1 = 4, d2 = 8.8, h = 2.4, $fn = 16); }
module s_wall() for (x = [-60, 60]) for (z = [-70, -140]) translate([x, D + 22 + 1, z]) rotate([90, 0, 0]) cylinder(d = 5, h = 40, $fn = 12);

// ---------- print orientation ----------
module place(v) {
  if (!PRINT) children();
  else if (v == "kappe" || v == "kappe_laas") translate([0, 0, H]) rotate([180, 0, 0]) children();      // top on the bed
  else if (v == "sokkel") children();                                                                  // bottom on the bed
  else if (v == "bakke") translate([0, 0, -(SLOT_Z - 22)]) children();
  else if (v == "konsol") rotate([180, 0, 0]) children();                               // shelf top on the bed
  else if (v == "vaegplade") rotate([-90, 0, 0]) children();                           // wall side on the bed
  else if (v == "logo_hvid" || v == "logo_groen") translate([0, 0, H]) rotate([180, 0, 0]) children();   // with the hood
  else children();
}

// ---------- views ----------
if (VIEW == "kappe")      place(VIEW) kappe_full(false);
if (VIEW == "kappe_laas") place(VIEW) kappe_full(true);
if (VIEW == "sokkel")     place(VIEW) sokkel();
if (VIEW == "bakke")      place(VIEW) bakke();
if (VIEW == "konsol")     place(VIEW) konsol();
if (VIEW == "vaegplade")  place(VIEW) vaegplade();
if (VIEW == "logo_hvid")  place(VIEW) logo("hvid");
if (VIEW == "logo_groen") place(VIEW) logo("groen");
if (VIEW == "c_printer")  c_printer();
if (VIEW == "c_pi")       c_pi();
if (VIEW == "c_inlet")    c_inlet();
if (VIEW == "c_lock")     c_lock();
if (VIEW == "s_base")     s_base();
if (VIEW == "s_wall")     s_wall();
EX = 0;               // assembly: 0 closed .. 1 exploded
module asm(lock, mount) {
  e = EX;
  translate([0, 0, 260 * e]) { color("#1d1d20") kappe_full(lock); color("#f5f5f4") logo("hvid"); color("#22d36b") logo("groen");
    if (lock) color("#c3c7cf") c_lock(); }
  color("#2b2b2f") sokkel();
  translate([0, -110 * e, 0]) color("#1d1d20") bakke();
  translate([0, 0, 130 * e]) color("#d9d9d6") c_printer();
  translate([0, 60 * e, 60 * e]) color("#2e9e5b") c_pi();
  color("#e11d48") c_inlet();
  if (mount == "vaeg") translate([0, 0, -110 * e]) { color("#3a3a3f") konsol(); translate([0, 110 * e, 0]) color("#4a4a50") vaegplade(); }
}
if (VIEW == "all") asm(LOCK, MOUNT);
// line drawings (projections for the drawing sheet)
module body(mount = "bord") { kappe_full(LOCK); sokkel(); bakke(); if (mount == "vaeg") { konsol(); vaegplade(); } }
SIDE = [[0, 1, 0, 0], [0, 0, 1, 0], [1, 0, 0, 0], [0, 0, 0, 1]];   // (x, y, z) -> (y, z, x): seen from the right
if (VIEW == "d_front") projection() rotate([-90, 0, 0]) body(MOUNT);
if (VIEW == "d_side")  projection() multmatrix(SIDE) body(MOUNT);
if (VIEW == "d_top")   projection() body(MOUNT);
if (VIEW == "d_cut")   projection(cut = true) multmatrix(SIDE) union() { body(MOUNT); c_printer(); c_pi(); }   // section at x = 0
if (VIEW == "d_cut_lock") projection(cut = true) rotate([-90, 0, 0]) translate([0, -LOCK_Y, 0]) union() { kappe_full(true); sokkel(); c_lock(); }   // section through the lock, seen from the front
