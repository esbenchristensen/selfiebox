// ============================================================================
//  SELFIEBOX HALO gen 2 – CONCEPT (not a print file)
//  Main unit 85 mm deep (room for 4G and a mic array) and a printer module that
//  cradles the main unit's lower corners without changing it: the main unit is
//  complete on its own. The module holds two Instax Link WIDE printers on edge,
//  one behind the other, exits down; the whole underside is a locked lid.
//
//  1:1 concentric outline (Halo rule 1-3, see the "Apples designprincipper"
//  doc): one master curve, the light ring's centre line with continuous-
//  curvature corners, and every outline of the face is an exact offset of it.
//  The border from box edge to light ring is the same 7.8 mm on all sides,
//  so the box is 222.5 wide instead of 234.
//
//  Fastening without visible screws: the 4 side screws of rev G are gone. Four
//  M3 screws from the back run through shell posts and the LED rail into
//  inserts in bosses behind the ring's solid corners (clamping the rail too).
//  Theme wings move from the side screws to inserts in the back wall.
//  Render: hardware/render/render_gen2.py
// ============================================================================
include <halo.scad>

D       = 85;          // gen 2 depth (rev G: 66)
BOTTOM  = "none";
PART    = "none";
VIEW    = "pair";      // "main" | "module" | "pair" | "pair_xray" | "module_open" | "x_..." single meshes
GAP     = 0.8;         // shadow gap between module and main unit

// ------------------------------------------------- concentric outline -----
SQ_A = 26;  SQ_N = 3;                       // corner: superellipse quadrant, extent and exponent
MASTER = [2*RING_X, RING_Z1 - RING_Z0];     // light-ring centre line, 188.9 x 272.4
BORDER = RING_Z0 - RING_FACE/2;             // 7.8: box edge -> light ring, all four sides
// (overrides of halo.scad values are evaluated where halo first assigns them: literals or earlier names only)
RING_R = 26;                                // = SQ_A: straight light runs end where the corners start
W = 2*RING_X + RING_FACE + 2*(RING_Z0 - RING_FACE/2);   // 222.5 (H stays 306)
R = 42.8;                                   // = SQ_A + RING_FACE/2 + BORDER: where the box's straight faces begin
BLOCK_Z = [];                               // no side screws
// fewer loose parts: no VESA or tripod inserts, no lock screw inside, and every former M3 insert
// becomes a pilot hole for a 3.0 mm thread-forming plastic screw (e.g. WN 1452 K30)
VESA_ON = false;  TRIPOD_ON = false;  LOCK_INSIDE = false;
INS_M3 = [2.5, 12];

function se(t) = [pow(max(cos(t), 0), 2/SQ_N), pow(max(sin(t), 0), 2/SQ_N)];
function sq_pts(w, h, a, n = 32) = let(hx = w/2 - a, hz = h/2 - a) concat(
    [for (i = [0:n]) let(p = se(i*90/n))      [ hx + a*p[0],  hz + a*p[1]]],
    [for (i = [0:n]) let(p = se(90 - i*90/n)) [-hx - a*p[0],  hz + a*p[1]]],
    [for (i = [0:n]) let(p = se(i*90/n))      [-hx - a*p[0], -hz - a*p[1]]],
    [for (i = [0:n]) let(p = se(90 - i*90/n)) [ hx + a*p[0], -hz - a*p[1]]]);
module sq2d(w, h) polygon(sq_pts(w, h, SQ_A));
// a rounded rectangle whose insets are equal on all sides is an offset of the master curve
function concentric(w, h) = abs((w - MASTER[0]) - (h - MASTER[1])) < 0.01;
module rrc(w, h, r) {
    if (concentric(w, h)) offset(r = (w - MASTER[0])/2) sq2d(MASTER[0], MASTER[1]);
    else { r2 = min(r, w/2 - 0.01, h/2 - 0.01); offset(r2) square([w - 2*r2, h - 2*r2], center = true); }
}
module rr(w, h, r) translate([0, h/2]) rrc(w, h, r);
// the same corner family at any height (printer module)
module box_like(h) translate([0, h/2]) offset(r = RING_FACE/2 + BORDER) sq2d(MASTER[0], h - RING_FACE - 2*BORDER);

// ---------------------------------------------- hidden front fastening ----
// 4 points on the ring's centre line, at the 45 degree point of each corner
J_U = SQ_A * pow(0.5, 1/SQ_N);
JOINTS = [for (sx = [-1, 1], sz = [-1, 1]) [sx*(RING_X - SQ_A + J_U), (RING_Z0 + RING_Z1)/2 + sz*(MASTER[1]/2 - SQ_A + J_U)]];
POST_D = 9;  BOSS_D = 8;
module bezel2() {
    difference() {
        union() { bezel(); for (j = JOINTS) cyl_y(BOSS_D, PT - 0.01, RIB_TOP, j[0], j[1]); }
        for (j = JOINTS) cyl_y(INS_M3_D, RIB_TOP - INS_M3_L, RIB_TOP + 0.1, j[0], j[1]);
    }
}
module led_rail2() { difference() { led_rail(); for (j = JOINTS) cyl_y(M3_CLR, RIB_TOP - 1, RIB_TOP + RAIL_T + 1, j[0], j[1]); } }
// theme wings: two inserts per side in the back wall (hidden against the wall)
CABLE2 = [-70, 14];
WING_P = [for (sx = [-1, 1], z = [RING_Z0 + 50, RING_Z1 - 50]) [sx*(W/2 - 12), z]];
module shell2(top = UNIT_TOP) {
    y0 = RIB_TOP + RAIL_T;
    difference() {
        union() {
            shell(top);
            for (j = JOINTS) cyl_y(POST_D, y0, D - BACK_T + 0.01, j[0], j[1]);
            cyl_y(7, D - BACK_T - 0.01, D, -(HW - 17.5), 17.5);     // rev G cable hole sits on a joint post: plug it
        }
        for (j = JOINTS) { cyl_y(M3_CLR, y0 - 1, D + 1, j[0], j[1]); cyl_y(M3_HEAD_CB, y0 + 8, D + 1, j[0], j[1]); }
        for (p = WING_P) translate([p[0] - 2, D - BACK_T - 1, p[1] - 4]) cube([4, BACK_T + 2, 14]);   // wing hooks drop in; the wall holds them
        cyl_y(5, D - BACK_T - 1, D + 1, CABLE2[0], CABLE2[1]);           // ... and move it in
        lock_cut();
        for (x = MIC_HOLES) cyl_z(1.2, H - WALL - 1, H + 1, x, MIC_Y);    // mic ports in the top face
    }
    electronics_holders();
}

// ------------------------------------------ 4G, vandal sensing, microphones ----
// [A] Waveshare SIM7600G-H 4G HAT (B) 65 x 32 mm (waveshare.com); height with SIM holder [M]
// [A] Adafruit LIS3DH breakout 25.4 x 17.8 x 4.6 (tap/shock interrupt to the Pi)
// [A] reSpeaker Flex XVF3800 Linear with XIAO ESP32S3: mic strip 110 long, mics 33 apart,
//     ports on the back of the board; core board on a 20 cm FPC. Width/thickness/core size [M]
// [M] glass reed switch in a 20 x 4 x 4 sleeve; [A] N52 magnet 6 x 3
HAT4G = [32, 65, 12];   HAT4G_P = [-88, 166];      // w (x), h (z), thickness (y); bottom-left on the back wall
MCORE = [45, 60, 15];   MCORE_P = [48, 166];
IMU   = [17.8, 25.4, 4.6];  IMU_P = [-8.9, 200];
MSTRIP = [110, 16, 5];  MIC_Y = 68;  MIC_HOLES = [-49.5, -16.5, 16.5, 49.5];
REED = [20, 4, 4];
module back_part(p, sz, c) color(c) translate([p[0], D - BACK_T - 1.2 - sz[2], p[1]]) cube([sz[0], sz[2], sz[1]]);
module placed_electronics() {
    back_part(HAT4G_P, HAT4G, [0.1, 0.3, 0.6]);
    back_part(MCORE_P, MCORE, [0.15, 0.15, 0.15]);
    back_part(IMU_P, IMU, [0.1, 0.1, 0.4]);
    color([0.15, 0.15, 0.15]) translate([-MSTRIP[0]/2, MIC_Y - MSTRIP[1]/2, H - WALL - MSTRIP[2] - 0.2]) cube(MSTRIP);
    color([0.8, 0.8, 0.85]) translate([LOCK_X - REED[0]/2, D - BACK_T - 6, LOCK_TZ[1] + 4]) cube(REED);
}
// snap trays like the Pololu cradles: no screws; the mic strip hangs in two hook clips
module electronics_holders() {
    for (q = [[HAT4G_P, HAT4G], [MCORE_P, MCORE], [IMU_P, IMU]])
        translate([q[0][0], D - BACK_T + 0.01, q[0][1]]) rotate([90, 0, 0]) pololu_cradle([q[1][0], q[1][1], q[1][2]], q[1][2] + 1.5);
    for (sx = [-1, 1]) translate([sx*40 - 4, MIC_Y - MSTRIP[1]/2 - 2, H - WALL - MSTRIP[2] - 2.2]) difference() {
        cube([8, MSTRIP[1] + 4, MSTRIP[2] + 2.21]);
        translate([-1, 2 - 0.15, 1.8]) cube([10, MSTRIP[1] + 0.3, MSTRIP[2] + 0.3]);
        translate([-1, 4, -1]) cube([10, MSTRIP[1] - 4, 3]);
    }
    // reed switch sleeve, just above the lock tongue: lifting the box off the cleat moves the magnet away
    translate([LOCK_X - REED[0]/2 - 1.6, D - BACK_T - 7.6, LOCK_TZ[1] + 2.4]) difference() {
        cube([REED[0] + 3.2, 7.61, REED[2] + 3.2]);
        translate([-1, 1.6, 1.6]) cube([REED[0] + 5, REED[1] + 0.3, REED[2] + 0.3]);
    }
}

// ------------------------------------------------------------ wall lock ----
// The cleat grows a tongue that enters a slot low in the back wall. One security screw
// (Torx with pin, 4 x 30 thread-forming) goes up through the bottom into the tongue: the box
// cannot be lifted off without the special bit, and the front screws stay behind the box.
// With the printer module fitted, the screw is reached through the module's locked lid.
LOCK_X = -56;  LOCK_W = 16;  LOCK_TZ = [14, 26];  LOCK_Y = 70;  DROP = CLEAT_D;
module lock_cut() {
    translate([LOCK_X - LOCK_W/2 - 0.6, D - BACK_T - 1, LOCK_TZ[0] - DROP - 0.6]) cube([LOCK_W + 1.2, BACK_T + 2, LOCK_TZ[1] - LOCK_TZ[0] + DROP + 1.2]);
    cyl_z(4.5, -1, LOCK_TZ[0], LOCK_X, (LOCK_Y + D - BACK_T)/2);
}
module wall_cleat2() {
    yb = D + GAP_WALL - PLATE_T;
    wall_cleat();
    difference() {
        union() {
            ext_y(yb, yb + PLATE_T) hull() { translate([0, 40]) rrc(60, 20, 6); translate([LOCK_X, LOCK_TZ[0] + 4]) rrc(LOCK_W + 8, 24, 6); }
            translate([LOCK_X - LOCK_W/2, LOCK_Y, LOCK_TZ[0]]) cube([LOCK_W, yb - LOCK_Y + 0.01, LOCK_TZ[1] - LOCK_TZ[0]]);
        }
        cyl_z(3.4, LOCK_TZ[0] - 1, LOCK_TZ[1] - 3, LOCK_X, (LOCK_Y + D - BACK_T)/2);   // pilot for the security screw
        cyl_z(6.2, LOCK_TZ[1] - 3, LOCK_TZ[1] + 1, LOCK_X, (LOCK_Y + D - BACK_T)/2 + 0); // magnet pocket (press fit)
    }
}

// Instax Link WIDE: 139.9 x 128.3 x 36.0 (fujifilm.com spec), film 86 x 108
INW = [139.9, 36.0, 128.3];  INW_R = 10;  FILM_W = [86, 108];
HP_IN = 3 + 10 + INW[2] + 5;        // floor + photo drop + printer + headroom
HP    = ceil(HP_IN);                // module height below the main unit
CHEEK = 34;                         // how far the cradle climbs the main unit's corners
PRN_Y = [WALL + 2, WALL + 2 + INW[1] + 4];   // printer front faces (two deep)
SLOT  = [FILM_W[0] + 6, 3.2];

C_LID = [0.16, 0.16, 0.17];  C_PRN = [0.9, 0.9, 0.88];  C_FILM = [0.97, 0.97, 0.95];

// --------------------------------------------------------------- printer ----
module instax_wide() {   // standing, exit edge at z = 0 (turned upside down)
    color(C_PRN) hull() for (sx = [-1, 1], sz = [0, 1])
        translate([sx*(INW[0]/2 - INW_R), 0, INW_R + sz*(INW[2] - 2*INW_R)]) rotate([-90, 0, 0]) cylinder(r = INW_R, h = INW[1], $fn = 32);
    color([0.2, 0.2, 0.22]) translate([-SLOT[0]/2 + 3, INW[1]/2 - 1.5, -0.3]) cube([SLOT[0] - 6, 3, 0.6]);
}

// ------------------------------------------------------- module outline ----
// the same box family as the main unit, minus the main unit itself (unchanged) plus the shadow gap
module module_2d() {        // front view outline, z = 0 at the module bottom
    difference() {
        intersection() { box_like(HP + H); translate([-W, -1]) square([2*W, HP + CHEEK + 1]); }
        translate([0, HP]) offset(GAP) rr(W, H, R);
    }
}
// solid module body; the front edge is chamfered by EDGE_CH (no hull: the cradle top is concave)
module mod_solid() {
    for (i = [0:3]) ext_y(i*EDGE_CH/4, EDGE_CH) offset(-(EDGE_CH - i*EDGE_CH/4)) module_2d();
    ext_y(EDGE_CH - 0.01, D) module_2d();
}
module mod_shell() {
    difference() {
        mod_solid();
        ext_y(WALL, D - BACK_T) offset(-WALL) module_2d();
        translate([-(W/2 - 14), 10, -1]) cube([W - 28, D - 20, WALL + 2]);   // service lid opening
    }
}
module printer_module(open = 0) { mod_shell(); color(C_LID) lid(open); }
// service lid, hinged at the front edge, with the photo slots and a key lock
module lid(open = 0) {
    translate([0, 10, 0]) rotate([-open, 0, 0]) translate([0, -10, 0]) {
        difference() {
            translate([-(W/2 - 14) + 0.4, 10.4, 0]) cube([W - 28.8, D - 20.8, WALL]);
            for (y = PRN_Y) translate([-SLOT[0]/2, y + INW[1]/2 - SLOT[1]/2, -1]) cube([SLOT[0], SLOT[1], WALL + 2]);
            translate([W/2 - 40, D - 22, -1]) cylinder(d = 16, h = WALL + 2, $fn = 40);
        }
        translate([W/2 - 40, D - 22, -0.6]) difference() { cylinder(d = 15, h = WALL + 0.6, $fn = 40); translate([-1, -4, -1]) cube([2, 8, 1.6]); }
    }
}
module module_band() {      // glow stripe on the module, same y band as the main unit
    color(C_DIFF) intersection() {
        ext_y(BAND_Y0, BAND_Y1) difference() { module_2d(); offset(-WALL) module_2d(); }
        translate([-500, 0, -500]) cube([1000, 1000, 1000]);
    }
}
module module_body() {
    color(C_BODY) difference() { printer_module(); translate([-500, BAND_Y0, -500]) cube([1000, BAND_Y1 - BAND_Y0, 1000]); }
    module_band();
}
module placed_printers() {
    for (y = PRN_Y) translate([0, y, 3 + 10]) instax_wide();
    // a photo held by the lips in the front slot
    color(C_FILM) translate([-FILM_W[0]/2, PRN_Y[0] + INW[1]/2 - 0.6, -60]) cube([FILM_W[0], 1.2, 70]);
}

// ------------------------------------------------------------ main unit ----
module main_unit() {        // gen 2 unit, without the wall cleat
    color(C_BODY) bezel2();
    color(C_DIFF) diffuser_ring();
    placed_display();
    placed_camera();
    color(C_INT) led_rail2(); placed_leds();
    placed_pi();
    band_split() shell2();
    placed_power();
    placed_electronics();
}

// ------------------------------------------- single parts for the renders ----
// one mesh per material: openscad -D 'VIEW="x_bezel"' -o bezel.stl gen2_concept.scad
module band_cut()  { translate([-500, BAND_Y0, -500]) cube([1000, BAND_Y1 - BAND_Y0, 1000]); }
module band_keep() { intersection() { children(); band_cut(); } }
if (VIEW == "x_bezel")     bezel2();
if (VIEW == "x_diffuser")  diffuser_ring();
if (VIEW == "x_rail")      led_rail2();
if (VIEW == "x_shell")     difference() { shell2(); band_cut(); }
if (VIEW == "x_shell_band") band_keep() shell2();
if (VIEW == "x_display")   placed_display();
if (VIEW == "x_camera")    placed_camera();
if (VIEW == "x_inside")    { placed_display(); placed_pi(); placed_power(); placed_camera(); placed_leds(); }
if (VIEW == "x_elec")      placed_electronics();
if (VIEW == "x_cleat")     wall_cleat2();
if (VIEW == "x_shell_all") shell2();
if (VIEW == "x_mod_shell") difference() { mod_shell(); band_cut(); }
if (VIEW == "x_mod_shell_band") band_keep() mod_shell();
if (VIEW == "x_lid")       lid(0);
if (VIEW == "x_lid_open")  lid(100);
if (VIEW == "x_printers")  for (y = PRN_Y) translate([0, y, 3 + 10]) instax_wide();
if (VIEW == "x_photo")     translate([-FILM_W[0]/2, PRN_Y[0] + INW[1]/2 - 0.6, -60]) cube([FILM_W[0], 1.2, 70]);

// cutaway: keep x > -20 so the camera on the left looks into the printer bay
module cut_keep() { intersection() { children(); translate([-20, -500, -500]) cube([1000, 1000, 1000]); } }
if (VIEW == "x_mod_shell_cut")      cut_keep() difference() { mod_shell(); band_cut(); }
if (VIEW == "x_mod_shell_band_cut") cut_keep() band_keep() mod_shell();
if (VIEW == "x_lid_cut")            cut_keep() lid(0);

// ----------------------------------------------------------------- views ----
if (VIEW == "main") main_unit();
if (VIEW == "module") module_body();
if (VIEW == "module_open") { color(C_BODY) printer_module(open = 100); module_band(); for (y = PRN_Y) translate([0, y, 3 + 10]) instax_wide(); }
if (VIEW == "pair") { translate([0, 0, HP]) main_unit(); module_body(); placed_printers(); }
if (VIEW == "pair_xray") { translate([0, 0, HP]) main_unit(); %module_body(); placed_printers(); }
if (VIEW == "info") echo(W = W, H = H, R = R, BORDER = BORDER, RUN_V = RUN_V, RUN_H = RUN_H, RUN_T = RUN_T, JOINTS = JOINTS, WING_P = WING_P, HP = HP);
