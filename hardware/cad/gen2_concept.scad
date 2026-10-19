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
//  3.0 mm thread-forming screws from the back run through shell posts and the
//  LED rail into bosses behind the ring's solid corners (clamping the rail too).
//  Theme wings hook into slots in the back wall. No inserts, gaskets or glass.
//  Print files: VIEW="p_<part>"; released sets live in hardware/stl/gen2/<version>/.
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
VESA_ON = false;  TRIPOD_ON = false;  LOCK_INSIDE = false;  DC_PANEL = false;
INS_M3 = [2.5, 12];
// no glow band (Esben 19 Oct): the shell is one print in one colour; only the front ring lights
GLOW = false;
RAIL_T = 4;                                 // rail ring as deep as the cross bars: flat back, prints back-down with the spring bumps on top
IF_SCREW = [[-70, 54], [70, 54]];  IF_DOWEL = [[-20, 54], [20, 54]];  IF_CABLE = [0, 54];
VENT_X = [];                                // rev G's four slots give way to the vent fields below
UNIT_TOP = "closed";
POWER_REVG = false;  CLIPS = [[-60, 135], [60, 140], [-60, 160], [100, 90]];                         // v2: Mean Well RSD-60G-5, WLED controller and MOSFET in their own holders                        // nothing stacks on top in gen 2: no holes where the rain falls
// camera (Esben 19 Oct, Wide chosen): lens tip 0.3 behind the face, hole 0.4 over the tip, only a 0.4 x 45 deg edge break
CAM_TIP_Y = 0.3;  CAM_HOLE = CAM_BARREL + 0.4;  CAM_HOLE_REAR = CAM_BARREL + 0.85;  CAM_CONE = [0.4, 45];

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
        union() {
            bezel();
            ext_y(PT - 0.01, RIB_TOP) ch_walls2d();
            for (j = JOINTS) cyl_y(BOSS_D, RIB_TOP - 0.01, RIB_TOP + RAIL_T - 0.3, j[0], j[1]);   // screw bosses behind the channel floor
            glass_land(); cam_shroud(); joint_rib();
        }
        ext_y(-1, PT + 0.01) ch_face2d();
        ext_y(PT - DIFF_FLANGE_T, CH_FLOOR) ch_cavity2d();
        for (j = JOINTS) cyl_y(INS_M3_D, CH_FLOOR + 0.8, RIB_TOP + RAIL_T, j[0], j[1]);
        for (x = STRIP_WIRE_X) cyl_y(5, CH_FLOOR - 1, RIB_TOP + 1, x, RING_Z1);
    }
}
// the channel walls and floor are printed in white ASA in the same print (second material): they reflect
// the strip's light forward; the face, frame and skirt stay black
module bezel2_white() intersection() { bezel2(); ext_y(PT, RIB_TOP + RAIL_T) ch_walls2d(); }
module bezel2_black() difference() { bezel2(); ext_y(PT, RIB_TOP + RAIL_T) ch_walls2d(); }
module led_rail2() { difference() { union() { led_rail(); rail_springs(); } for (j = JOINTS) cyl_y(BOSS_D + 0.4, RIB_TOP - 1, RIB_TOP + RAIL_T + 1, j[0], j[1]); rail_spring_cut(); } }

// ------------------------------------------------------------- light ring ----
// One addressable COB strip (24 V FCOB RGBW, 10 mm) in one piece: it starts left of the camera, runs
// round all four corners and ends right of it. It stands on edge against the channel's outer wall,
// LEDs facing inward, so it bends round the corners; the white walls throw the light forward into the
// diffuser. The channel is a U open to the front; its floor ties the screen frame to the outer frame,
// and the 4 hidden front screws now bite into bosses behind that floor instead of blocking the corners.
STRIP = [10, 2.2];                       // [A] FCOB width, thickness incl. LEDs [M]
CH_FLOOR = RIB_TOP - 3;                   // channel floor (front face of it)
STRIP_WIRE_X = [-25, 25];                 // feed holes at both strip ends (power injected at both ends)
CH_IN = SLOT_W/2 + DIFF_FLANGE;           // 8.2: cavity half-width
module ring_centre2d() translate([0, (RING_Z0 + RING_Z1)/2]) sq2d(MASTER[0], MASTER[1]);
module ring_band2d(a, b) difference() { offset(r = b) ring_centre2d(); offset(r = a) ring_centre2d(); }
module glass_keep2d() translate([VIEW_X, GC]) offset(r = TD10_R + 1.2) square([GW - 2*TD10_R, GH - 2*TD10_R], center = true);
module cam_block2d() translate([-CAM_GAP/2, RING_Z1 - CH_HALF - 1]) square([CAM_GAP, 2*CH_HALF + 2]);
module ch_walls2d() difference() { ring_band2d(-CH_HALF, CH_HALF); glass_keep2d(); }
module ch_cavity2d() difference() { ring_band2d(-CH_IN, CH_IN); offset(r = RIB_T) glass_keep2d(); cam_block2d(); }
module ch_face2d() difference() { ring_band2d(-SLOT_W/2, SLOT_W/2); offset(r = RIB_T) glass_keep2d(); cam_block2d(); }
module strip2d() difference() { ring_band2d(CH_IN - STRIP[1], CH_IN); cam_block2d(); translate([-CAM_GAP/2 - 1, RING_Z1 - 20]) square([CAM_GAP + 2, 40]); }
module placed_strip() color([1, 0.95, 0.85]) ext_y(CH_FLOOR - STRIP[0], CH_FLOOR) strip2d();
module diffuser2() {
    difference() {
        diffuser_ring();
        ext_y(-0.01, PT + 1) difference() { offset(r = 5) ring_band2d(-SLOT_W/2, SLOT_W/2); ring_band2d(-SLOT_W/2 + 0.15, SLOT_W/2 - 0.15); }
    }
    ext_y(0, PT) difference() { ring_band2d(-SLOT_W/2 + 0.15, SLOT_W/2 - 0.15); offset(r = RIB_T + 0.15) glass_keep2d(); offset(r = 0.15) cam_block2d(); }
}
// theme wings: hook slots in the back wall (hidden against the wall)
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
        lock_cut();
        services_cut();
        for (x = MIC_HOLES) cyl_z(MIC_PORT, H - WALL - 1, H + 1, x, MIC_Y);    // mic ports in the top face
        joint_groove();
    }
    mic_rings();
    electronics_holders();
    services_add();
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
// (Torx with pin, 4 x 25, thread-forming for plastics) goes up through the bottom into the
// tongue; its button head sits flush in a recess, so the printer module still seats flat.
// The box cannot be lifted off without the special bit, and the front screws stay behind
// the box. With the printer module fitted, the module (key lid + 2 screws) comes off first.
// Lifting force on the tongue: 18 x 18 section, 19 mm lever to the plate.
LOCK_X = -56;  LOCK_W = 18;  LOCK_TZ = [18, 36];  LOCK_Y = 70;  DROP = CLEAT_D;
LOCK_SY = (LOCK_Y + D - BACK_T)/2;                  // screw axis, y
LOCK_HEAD = [8.4, 2.6];                             // ISO 7380 M4 head 7.6 x 2.2 + clearance
LOCK_BOSS = [15, 8];                                // floor boss under the head: dia, top z (tongue clears it by 1 mm while hanging on)
module lock_cut() {
    translate([LOCK_X - LOCK_W/2 - 0.6, D - BACK_T - 1, LOCK_TZ[0] - DROP - 0.6]) cube([LOCK_W + 1.2, BACK_T + 2, LOCK_TZ[1] - LOCK_TZ[0] + DROP + 1.2]);
    cyl_z(4.5, -1, LOCK_TZ[0], LOCK_X, LOCK_SY);
    cyl_z(LOCK_HEAD[0], -1, LOCK_HEAD[1], LOCK_X, LOCK_SY);
}
module wall_cleat2() {
    yb = D + GAP_WALL - PLATE_T;
    difference() {
        union() {
            wall_cleat();
            ext_y(yb, yb + PLATE_T) hull() { translate([0, 40]) rrc(60, 20, 6); translate([LOCK_X, LOCK_TZ[0] + 4]) rrc(LOCK_W + 8, 24, 6); }
            translate([LOCK_X - LOCK_W/2, LOCK_Y, LOCK_TZ[0]]) cube([LOCK_W, yb - LOCK_Y + 0.01, LOCK_TZ[1] - LOCK_TZ[0]]);
            // root fillet where the tongue meets the plate
            translate([LOCK_X - LOCK_W/2, yb + 0.01, LOCK_TZ[0]]) rotate([0, 90, 0]) linear_extrude(LOCK_W) polygon([[0, 0], [-(LOCK_TZ[1] - LOCK_TZ[0]), 0], [0, -6]]);
        }
        cyl_z(3.4, LOCK_TZ[0] - 1, LOCK_TZ[1] - 4.4, LOCK_X, LOCK_SY);           // pilot for the security screw
        cyl_z(6.2, LOCK_TZ[1] - 3.4, LOCK_TZ[1] + 1, LOCK_X, LOCK_SY);           // magnet pocket (press fit)
        translate([PWR_P[0] - 5, D + 0.5, 0]) cube([10, yb - D - 0.49, 250]);       // power lead down the gap: notch the stand-offs
    }
}

// ------------------------------------------------------- weather, print only ----
// Rain, sleet and spills from any side under a light roof, with no added parts (Esben 19 Oct):
// no gaskets, membranes, glass or glue. The shell is one print; the one fixed seam is acetone-welded
// (diffuser ring); every opening is shaped so water runs back out.
// Front to shell: a rib on the bezel's skirt enters a groove in the shell's front face. Water that
// passes the butt joint meets the rib, runs round the groove and leaves through two drain notches
// in the underside. Behind it the bezel's 5 mm tongue still overlaps the shell wall.
JR = [1.0, 1.4, 1.4, 0.6, 1.0];         // groove: from outside, width, depth; rib: width, height
DRAIN_X = [-60, 60];
module lip_ring(a, b) difference() { translate([0, a]) rr(W - 2*a, H - 2*a, R - a); translate([0, b]) rr(W - 2*b, H - 2*b, R - b); }
module joint_groove() {
    ext_y(SKIRT - 0.01, SKIRT + JR[2]) lip_ring(JR[0], JR[0] + JR[1]);
    for (x = DRAIN_X) translate([x - 0.8, SKIRT - 0.01, -0.01]) cube([1.6, JR[2] + 0.01, JR[0] + JR[1] - 0.2]);
}
module joint_rib() { c = JR[0] + (JR[1] - JR[3])/2;  ext_y(SKIRT - 0.01, SKIRT + JR[4]) lip_ring(c, c + JR[3]); }
// display glass: a printed 0.5 mm land around the window replaces the EVA ring (glass on ASA,
// clamped by the rail); outside the land a 0.5 mm gap is a capillary break. Behind the display the
// EVA pads become printed springs: each pad spot on the cross bars is a 1.2 mm bridge with a bump.
module glass_land() ext_y(PT - 0.01, GLASS_Y) difference() { window2d(2.6); window2d(0.6); }
SPR = [30, 1.2, 0.6];                   // bridge length, thickness, bump
module rail_springs() for (sx = [-1, 1], z = XBAR_Z) translate([sx*40, 0, z]) hull() {
    translate([-4, RIB_TOP - SPR[2], -3]) cube([8, 0.01, 6]); translate([-6, RIB_TOP, -5]) cube([12, 0.01, 10]); }
module rail_spring_cut() for (sx = [-1, 1], z = XBAR_Z) translate([sx*40 - SPR[0]/2, RIB_TOP + SPR[1], z - 7.5]) cube([SPR[0], XBAR_T, 15]);
// camera: open aperture (no window); the lens barrel fills the hole bar a 0.8 mm gap. A printed
// sleeve round the lens holder, from the bezel to just short of the camera board, keeps a splash
// that gets through that gap on the lens side instead of on the electronics.
module cam_shroud() translate([0, 0, LENS_Z]) difference() {
    ext_y(PT - 0.01, CAM_PCB_Y - 0.6) square(CAM_HOLDER + 3.2, center = true);
    ext_y(PT - 1, CAM_PCB_Y) square(CAM_HOLDER + 0.8, center = true);
}
// mic ports: Ø1.0 through the top; under each a printed crush ring presses on the strip round the
// mic's port, so the port is a closed air pocket that water cannot push into.
MIC_PORT = 1.0;  MIC_RING = [1.8, 3.6, 0.45];
module mic_rings() for (x = MIC_HOLES) translate([x, MIC_Y, H - WALL - MIC_RING[2]]) difference() {
    cylinder(d = MIC_RING[1], h = MIC_RING[2] + 0.01, $fn = 32); translate([0, 0, -1]) cylinder(d = MIC_RING[0], h = 3, $fn = 24); }
// splash hoods over the underside vents: water bouncing up hits the roof and drops back out,
// air turns sideways. Side walls only along x so the hood prints without support (back down).
HOOD = [8, 1.6];                        // roof height above the floor, wall/roof thickness
module vent_hoods() for (sx = [-1, 1]) {
    x0 = VENT_XS[0] - VENT_SL[0]/2 - 2;  x1 = VENT_XS[len(VENT_XS) - 1] + VENT_SL[0]/2 + 2;
    y0 = VENT_Y - VENT_SL[1]/2 - 2;      y1 = VENT_Y + VENT_SL[1]/2 + 2;
    for (x = [x0 - HOOD[1], x1]) translate([sx > 0 ? x : -x - HOOD[1], y0, WALL - 0.01]) cube([HOOD[1], y1 - y0, HOOD[0] + HOOD[1]]);
    translate([sx > 0 ? x0 - HOOD[1] : -x1 - HOOD[1], y0, WALL + HOOD[0]]) cube([x1 - x0 + 2*HOOD[1], y1 - y0, HOOD[1]]);
}

// ------------------------------------------------- underside and back services ----
// Air: in through two slot fields in the underside (no drinks get in from below), out through
// louvred slots high in the back wall into the 14 mm wall gap, which works as a chimney.
// Every opening is 2.5 mm wide: no fingers, and a poked wire meets only 12 V parts.
VENT_SL = [2.5, 28];  VENT_XS = [for (i = [0:6]) 30 + 5*i];  VENT_Y = 52;   // underside: 2 x 7 slots, 9.8 cm2
EXH_XS = [for (i = [0:36]) -90 + 5*i];  EXH_Z = [235, 245];  EXH_DROP = 2;    // back: 37 louvres, 9.3 cm2
EXH_C = [for (sx = [-1, 1], i = [0:3]) sx*(86 + 4.5*i)];  EXH_CZ = [254, 274]; // + 8 in the top corners, 4.0 cm2
// printer pass-through: bayonet cap, flush, turned with a 2-pin spanner (no coin slot to vandalise)
CAP_D = 19.6;  CAP_LUG = [6, 11.8];  CAP_ANG = [0, 120, 240];  CAP_ENTRY = 60;
// power: a pocket in the back wall holds the jack facing backwards; a right-angle plug lies inside
// it, so a pull on the lead loads the pocket walls, not the jack. The lead runs down the wall gap
// and leaves under the box in steel cable armour, which starts hidden behind the box.
PWR_P = [0, 146];  PWR_IN = [26, 36, 18];                         // pocket opening (x, z), depth
// speaker: fires backwards through a grille into the wall gap, sound leaves round the box edges
SPK_P = [-66, 80];  SPK = [50, 25];                               // [M] 50 mm full-range 4 ohm 5 W, depth
module bottom_vents() for (sx = [-1, 1], x = VENT_XS) hull() for (dy = [-1, 1])
    cyl_z(VENT_SL[0], -1, WALL + 1, sx*x, VENT_Y + dy*(VENT_SL[1] - VENT_SL[0])/2);
module louvre(x, z0, z1) hull() {   // outer opening lower than the inner one: water runs out
    translate([x - VENT_SL[0]/2, D - BACK_T - 0.5, z0]) cube([VENT_SL[0], 0.01, z1 - z0]);
    translate([x - VENT_SL[0]/2, D + 0.5, z0 - EXH_DROP]) cube([VENT_SL[0], 0.01, z1 - z0]);
}
module services_cut() {
    bottom_vents();
    for (x = EXH_XS) louvre(x, EXH_Z[0], EXH_Z[1]);
    for (x = EXH_C) louvre(x, EXH_CZ[0], EXH_CZ[1]);
    // bayonet entry notches next to the pass-through
    for (a = CAP_ANG) translate([IF_CABLE[0], IF_CABLE[1], -1]) rotate(a + CAP_ENTRY) translate([0, -(CAP_LUG[0] + 0.6)/2]) cube([CAP_LUG[1] + 0.5, CAP_LUG[0] + 0.6, WALL + 2]);
    // power pocket opening and the speaker grille
    ext_y(D - BACK_T - 1, D + 1) translate([PWR_P[0], PWR_P[1] - PWR_IN[1]/2]) rr(PWR_IN[0], PWR_IN[1], 4);
    for (h = spk_holes()) cyl_y(2, D - BACK_T - 1, D + 1, SPK_P[0] + h[0], SPK_P[1] + h[1]);
}
function spk_holes() = [for (i = [-6:6], j = [-6:6]) let(x = 3.5*i + (j % 2 ? 1.75 : 0), z = 3.03*j) if (x*x + z*z < 20*20) [x, z]];
module services_add() {
    vent_hoods();
    // collar round the printer pass-through: splash that gets past the cap must climb 4 mm
    difference() { cyl_z(CAP_D + 7, WALL - 0.01, WALL + 4, IF_CABLE[0], IF_CABLE[1]); cyl_z(CAP_D + 4.6, WALL - 1, WALL + 5, IF_CABLE[0], IF_CABLE[1]); }
    // floor boss under the lock screw head
    difference() {
        cyl_z(LOCK_BOSS[0], WALL - 0.01, LOCK_BOSS[1], LOCK_X, LOCK_SY);
        cyl_z(4.5, -1, LOCK_BOSS[1] + 1, LOCK_X, LOCK_SY);
        translate([LOCK_X - LOCK_W/2 - 0.6, D - BACK_T - 0.01, 0]) cube([LOCK_W + 1.2, 5, 20]);
    }
    // bayonet detents: a 0.4 mm bump the lugs click over in the locked position
    for (a = CAP_ANG) translate([IF_CABLE[0], IF_CABLE[1], WALL - 0.01]) rotate(a + 8) translate([CAP_D/2 + 0.8, -0.6, 0]) cube([1.2, 1.2, 0.41]);
    // power pocket
    difference() {
        translate([PWR_P[0], 0, PWR_P[1]]) translate([-PWR_IN[0]/2 - 2.4, D - BACK_T - PWR_IN[2] - 2.4, -PWR_IN[1]/2 - 2.4]) cube([PWR_IN[0] + 4.8, PWR_IN[2] + 2.41, PWR_IN[1] + 4.8]);
        translate([PWR_P[0], 0, PWR_P[1]]) translate([-PWR_IN[0]/2, D - BACK_T - PWR_IN[2], -PWR_IN[1]/2]) cube([PWR_IN[0], PWR_IN[2] + 1, PWR_IN[1]]);
        cyl_y(8.2, D - BACK_T - PWR_IN[2] - 3, D - BACK_T - PWR_IN[2] + 1, PWR_P[0], PWR_P[1] + 8);   // M8 panel jack, upper half
    }
    // speaker ring: the frame drops in and three hooks snap over it
    translate([SPK_P[0], D - BACK_T + 0.01, SPK_P[1]]) rotate([90, 0, 0]) {
        difference() { cylinder(d = SPK[0] + 5, h = 5, $fn = 64); translate([0, 0, -1]) cylinder(d = SPK[0] + 0.6, h = 7, $fn = 64); }
        for (a = [90, 210, 330]) rotate(a) translate([SPK[0]/2 + 0.3, -3, 0]) {
            cube([2.2, 6, 6.2]);
            translate([0, 0, 4.2]) hull() { cube([2.2, 6, 0.01]); translate([-1, 0, 1.2]) cube([3.2, 6, 0.01]); }
        }
    }
}
module cable_cap() {   // printed separately; underside flush with the box bottom
    difference() {
        union() {
            cylinder(d = CAP_D, h = WALL, $fn = 64);
            for (a = CAP_ANG) rotate(a) translate([0, -CAP_LUG[0]/2, WALL + 0.2]) cube([CAP_LUG[1], CAP_LUG[0], 2]);
            translate([0, 0, WALL - 0.01]) cylinder(d = 12, h = 2.21, $fn = 48);
        }
        for (sx = [-1, 1]) translate([sx*5, 0, -1]) cylinder(d = 2.2, h = 3, $fn = 16);   // spanner pins
    }
}
module placed_services() {
    translate([IF_CABLE[0], IF_CABLE[1], 0]) color([0.11, 0.11, 0.12]) cable_cap();
    // panel jack and a right-angle plug in the pocket
    color([0.2, 0.2, 0.2]) cyl_y(11, D - BACK_T - PWR_IN[2] - 2.4 - 16, D - BACK_T - PWR_IN[2] - 2.4, PWR_P[0], PWR_P[1] + 8);
    color([0.25, 0.25, 0.25]) translate([PWR_P[0] - 5.5, D - BACK_T - PWR_IN[2] + 0.5, PWR_P[1] - 15]) cube([11, 12, 28]);
    // speaker
    color([0.2, 0.2, 0.22]) translate([SPK_P[0], D - BACK_T - 3, SPK_P[1]]) rotate([-90, 0, 0]) cylinder(d = SPK[0], h = 3, $fn = 64);
    color([0.3, 0.3, 0.32]) translate([SPK_P[0], D - BACK_T - SPK[1], SPK_P[1]]) rotate([-90, 0, 0]) cylinder(d = 32, h = SPK[1] - 3, $fn = 48);
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
module module_body() color(C_BODY) printer_module();
module placed_printers() {
    for (y = PRN_Y) translate([0, y, 3 + 10]) instax_wide();
    // a photo held by the lips in the front slot
    color(C_FILM) translate([-FILM_W[0]/2, PRN_Y[0] + INW[1]/2 - 0.6, -60]) cube([FILM_W[0], 1.2, 70]);
}



// --------------------------------------------- v2 power and light control ----
// No soldering (Esben 19 Oct): only finished modules with screw or lever terminals, joined with Wago clamps.
// [A] Mean Well RSD-60G-5, 24 V -> 5 V 12 A, 128 x 60 x 25 incl. flanges (reichelt / Mean Well datasheet),
//     screw terminals on the right-hand end; lies flat on the back wall under the Pi.
// [C] Gledopto GL-C-016WL-D WLED controller 108 x 45 x 18 (one retailer listing): flat on the back wall above the PSU
// (the right wall is taken by the mic board higher up).
// [M] DFRobot Gravity MOSFET (white strips) 42 x 32 x 12: on the left side wall.
PSU5 = [128, 60, 25];  PSU5_P = [-37, 16];                    // x, z (bottom-left), on the back wall
WLED = [108, 45, 18];  WLED_P = [-30, 80];                    // x, z (bottom-left), on the back wall
MOSF = [42, 32, 12];   MOSF_P = [40, 112];                    // on the left wall
module wall_tray(sz, hgt, end_h = 5) {   // sz = [x, y, z-thickness]: long walls with snap lips, low end stops (terminals stay free)
    difference() {
        translate([-1.6, -1.6, 0]) cube([sz[0] + 3.2, sz[1] + 3.2, hgt]);
        translate([0, 0, 1.2]) cube([sz[0] + 0.3, sz[1] + 0.3, hgt + 1]);
        translate([6, 6, -1]) cube([sz[0] - 12, sz[1] - 12, 3]);                   // open floor: less print, air
        translate([-2, -2, end_h]) cube([sz[0] + 4.3, sz[1] + 4.3, hgt]) ;          // ends cut down ...
    }
    for (sy = [0, 1]) translate([0, sy > 0 ? sz[1] + 0.3 : -1.6, 0]) cube([sz[0] + 0.3, 1.6, hgt]);   // ... long walls stay full height
    for (sy = [0, 1], x = [sz[0]*0.2, sz[0]*0.7]) translate([x, sy > 0 ? sz[1] + 0.3 : -1.6, hgt - 0.01]) hull() {
        cube([8, 1.6, 0.01]); translate([0, sy > 0 ? -0.6 : 0.6, 1.2]) cube([8, 1.6, 0.01]); }
}
module power_holders() {
    translate([PSU5_P[0], D - BACK_T + 0.01, PSU5_P[1]]) rotate([90, 0, 0]) wall_tray([PSU5[0], PSU5[1], PSU5[2]], PSU5[2] + 1.5);
    translate([WLED_P[0], D - BACK_T + 0.01, WLED_P[1]]) rotate([90, 0, 0]) wall_tray([WLED[0], WLED[1], WLED[2]], WLED[2] + 1.5);
    translate([-(HW - WALL) - 0.01, MOSF_P[0], MOSF_P[1] + MOSF[0]]) rotate([0, 90, 0]) wall_tray([MOSF[0], MOSF[1], MOSF[2]], MOSF[2] + 1.5);
}
module placed_power3() {
    color([0.75, 0.76, 0.78]) translate([PSU5_P[0], D - BACK_T - 1.2 - PSU5[2], PSU5_P[1]]) cube([PSU5[0], PSU5[2], PSU5[1]]);
    color([0.9, 0.9, 0.92]) translate([WLED_P[0], D - BACK_T - 1.2 - WLED[2], WLED_P[1]]) cube([WLED[0], WLED[2], WLED[1]]);
    color([0.1, 0.3, 0.6]) translate([-(HW - WALL) + 1.2, MOSF_P[0], MOSF_P[1]]) cube([MOSF[2], MOSF[1], MOSF[0]]);
}

// ================================================== v2c: light channel, ring, frame ==
// Approved 19 Oct (drawing halo-gen2-v2_kamera_lysring_print). The front is one black print with an
// open channel (no ceilings when printed face down). The light ring drops into the slot from behind;
// its flange rests on the back of the front plate and the white frame clamps it all the way round.
// The frame carries the 45 deg reflector, the strip wall with two white COB strips + one RGB strip,
// and the display, screwed into the display's own four M2.5 tabs. r = offset from the ring centre line.
S3 = SLOT_W/2;                            // 7.0: slot half width
RF3 = S3 - 0.15;                          // 6.85: ring face half width (0.15 shadow gap)
RW3 = 1.2;                                // ring wall
FL3 = CH_IN - 0.1;                        // 8.1: ring flange half width
CH_BACK = RIB_TOP + 8;                    // 27.7: channel back (front walls end here)
FR_T = 4;                                 // frame back plate
FR_BACK = CH_BACK + FR_T;                 // 31.7: flat back of the frame
RING_Y = [-0.5, 0.5];                     // ring face: 0.5 proud, 1 mm thick
CAM_END = CAM_HOLE/2 + 4 + S3;            // slot end centres, 4 mm black round the camera hole
CAM_KEEP = [17, 14];                      // no channel behind the camera board: half x, half z
REFL = [[4.2, -6.0], [25.7, 5.0]];        // reflector line (y, r): from the ring flange to the floor
FLOOR3 = 25.7;
STRIPS3 = [[4.6, 12.6, "w"], [12.7, 20.7, "w"], [20.8, 25.6, "rgb"]];   // [A] LEDlife COB Ra95 8 mm x2, RGB 5 mm
STRIP_T3 = [5.4, 6.9];                    // strips on the frame's strip wall (r)
J_R = 11.8;                               // front screws: in the outer wall at the 4 corners
J2 = [for (j = JOINTS) [j[0] + sign(j[0])*J_R/sqrt(2), j[1] + sign(j[1] - (RING_Z0 + RING_Z1)/2)*J_R/sqrt(2)]];
// [A] Touch Display 2 10" (RP-010276 physical spec): panel 7.05 deep incl. the 1.1 cover lens,
// four M2.5 tabs 3 deep at 22.54 from the sides, 46.42 from the top and 41.68 from the bottom edge;
// Pi stand-offs 8.5 high on a 49 x 58 pattern, 6.87 below the centre. [M] up = the drawing's up,
// so the frame's tab holes are slots (+/-2.4) and fit either way round.
DSP_PANEL = 7.05;  DSP_TAB3 = [8, 12, 3];  DSP_TAB_X = 166.9/2 - 22.54;  DSP_TAB_Z = [248.1/2 - 46.42, -(248.1/2 - 41.68)];
DSP_PI_DZ = -6.87;  DSP_SO = [5, 8.5];
TAB_Y = GLASS_Y + DSP_PANEL + DSP_TAB3[2];   // 13.75: back face of the tabs
PRELOAD = 0.2;                            // the frame bosses press the display 0.2 mm onto the glass land
PI_Y3 = GLASS_Y + DSP_PANEL + DSP_SO[1];

module cam_keep2d() translate([-CAM_KEEP[0], RING_Z1 - CAM_KEEP[1]]) square([2*CAM_KEEP[0], 2*CAM_KEEP[1]]);
// the ring's plan shape at half width h: the band with round ends next to the camera
module ring3_2d(h) {
    difference() { ring_band2d(-h, h); translate([-CAM_END, RING_Z1 - 20]) square([2*CAM_END, 40]); }
    for (sx = [-1, 1]) translate([sx*CAM_END, RING_Z1]) circle(r = h, $fn = 48);
}
module ring3_band(a, b) difference() { ring3_2d(b); ring3_2d(a); }
// a 45 deg step from half width a at y0 to half width b at y1, in n layers
module ring3_bevel(y0, y1, a, b, n = 5) for (i = [0:n - 1]) ext_y(y0 + i*(y1 - y0)/n - 0.01, y0 + (i + 1)*(y1 - y0)/n) ring3_2d(a + (i + 1)*(b - a)/n);

module front3() {
    difference() {
        union() {
            front_base(H, BLOCK_Z);
            // the skirt carries the tongue: no 1.4 mm ledge hanging over air when printed face down
            ext_y(PT - 0.01, SKIRT + 0.01) difference() { rr(W, H, R); translate([0, WALL + FIT + TONGUE_T]) rr(W - 2*(WALL + FIT + TONGUE_T), H - 2*(WALL + FIT + TONGUE_T), R - WALL - TONGUE_T); }
            ext_y(PT - 0.01, CH_BACK) difference() { ring_band2d(-CH_HALF, CH_HALF); ring_band2d(-CH_IN, CH_IN); glass_keep2d(); cam_keep2d(); }
            for (j = J2) cyl_y(6, PT - 0.01, CH_BACK, j[0], j[1]);
            for (h = CAM_HOLES_ROT) { cyl_y(4.6, PT - 0.01, CAM_PCB_Y, h[0], LENS_Z + h[1]); cyl_y(2.0, CAM_PCB_Y - 0.01, CAM_PCB_Y + CAM_PCB[2] + 1.5, h[0], LENS_Z + h[1]); }
            glass_land(); cam_shroud(); joint_rib();
        }
        hull() { ext_y(-1, PT - 1.6) window2d(1.6); ext_y(-1, PT + 1) window2d(0); }
        ext_y(-1, PT + 0.01) ring3_2d(S3);
        ring3_bevel(1.95, PT + 0.01, S3, FL3 + 0.1);                      // seat for the ring's flange
        cyl_y(CAM_HOLE, CAM_CONE[0] - 0.01, PT + 1, 0, LENS_Z);
        cyl_y(CAM_HOLE_REAR, max(CAM_CONE[0], CAM_TIP_Y + 1), PT + 1, 0, LENS_Z);
        translate([0, -0.01, LENS_Z]) rotate([-90, 0, 0]) cylinder(d1 = CAM_HOLE + 2*CAM_CONE[0]*tan(CAM_CONE[1]), d2 = CAM_HOLE, h = CAM_CONE[0] + 0.02);
        translate([-CAM_PCB[1], SKIRT - 0.1, CAM_TOP - 1]) cube([2*CAM_PCB[1], TONGUE_L + 0.2, 10]);
        for (j = J2) cyl_y(INS_M3_D, CH_BACK - 11, CH_BACK + 1, j[0], j[1]);
    }
}
module ring3() {
    ext_y(RING_Y[0], RING_Y[0] + 0.3) ring3_2d(RF3 - 0.3);
    ext_y(RING_Y[0] + 0.29, RING_Y[1]) ring3_2d(RF3);
    ext_y(RING_Y[1] - 0.01, 1.95) ring3_band(RF3 - RW3, RF3);
    difference() {
        union() { ring3_bevel(1.95, PT, RF3, FL3); ext_y(PT - 0.01, PT + 1) ring3_2d(FL3); }
        ext_y(0, PT + 2) ring3_2d(RF3 - RW3);
        translate([-7.4, PT - 2, LENS_Z - 8]) cube([14.8, 4, 16]);       // clear of the camera shroud
    }
}
function refl_r(y) = REFL[0][1] + (y - REFL[0][0])*(REFL[1][1] - REFL[0][1])/(REFL[1][0] - REFL[0][0]);
REFL_STEP = 0.5;
CAM_RIB = [9.3, 17.5, 6.5];               // ribbon slot: x start (connector edge at 9.53), width (z), depth (x)
module frame3() {
    tabs = [for (sx = [-1, 1], z = DSP_TAB_Z) [sx*DSP_TAB_X, GC + z]];
    difference() {
        union() {
            ext_y(CH_BACK, FR_BACK) {
                ring_band2d(-CH_HALF, CH_HALF);
                for (j = J2) translate(j) circle(d = 6.4, $fn = 32);
                translate([-16, LENS_Z - 13.5]) square([34, 27]);               // behind the camera board and round the ribbon slot
            }
            // reflector, strip wall and floor, all inside the channel
            difference() {
                union() {
                    for (y = [REFL[0][0] : REFL_STEP : FLOOR3 - REFL_STEP]) ext_y(y, y + REFL_STEP + 0.01) ring_band2d(-FL3, refl_r(y + REFL_STEP));
                    ext_y(REFL[0][0], CH_BACK + 0.01) ring_band2d(STRIP_T3[1], FL3);
                    ext_y(FLOOR3, CH_BACK + 0.01) ring_band2d(-FL3, FL3);
                }
                ext_y(0, CH_BACK + 1) { glass_keep2d(); cam_keep2d(); }
            }
            // cross bars at the display tabs, with bosses down to the tabs
            for (z = DSP_TAB_Z) ext_y(RIB_TOP + 4, FR_BACK) translate([0, GC + z]) square([2*(RING_X - CH_HALF - 0.4), 16], center = true);
            for (t = tabs) cyl_y(7, TAB_Y - PRELOAD, RIB_TOP + 4.01, t[0], t[1]);
            // tubes that press the camera board onto its pegs
            for (h = CAM_HOLES_ROT) cyl_y(4.6, CAM_PCB_Y + CAM_PCB[2], CH_BACK + 0.01, h[0], LENS_Z + h[1]);
        }
        for (t = tabs) {
            hull() for (dz = [-2.4, 2.4]) cyl_y(2.9, TAB_Y - 1, FR_BACK + 1, t[0], t[1] + dz);
            hull() for (dz = [-2.4, 2.4]) cyl_y(5.6, TAB_Y + 2.0, FR_BACK + 1, t[0], t[1] + dz);   // head 2 mm above the tab
        }
        for (h = CAM_HOLES_ROT) cyl_y(2.4, CAM_PCB_Y, CAM_PCB_Y + CAM_PCB[2] + 2, h[0], LENS_Z + h[1]);
        // camera ribbon (16 mm wide, does not like sharp folds): it leaves the connector sideways (+x),
        // takes one gentle 90 deg bend backwards and passes the frame here to the open space behind it
        translate([CAM_RIB[0], CAM_PCB_Y + CAM_PCB[2] + 0.5, LENS_Z - CAM_RIB[1]/2]) cube([CAM_RIB[2], FR_BACK, CAM_RIB[1]]);
        for (j = J2) cyl_y(M3_CLR, CH_BACK - 1, FR_BACK + 1, j[0], j[1]);
        for (sx = [-1, 1]) cyl_y(5, FLOOR3 - 1, FR_BACK + 1, sx*(CAM_KEEP[0] + 8), RING_Z1 + 6.2);   // strip leads
    }
}
module placed_strips3(kind) for (s = STRIPS3) if (s[2] == kind)
    ext_y(s[0], s[1]) difference() { ring_band2d(STRIP_T3[0], STRIP_T3[1]); cam_keep2d(); }
module td2_10() {   // glass front face at y = 0, centred on x = 0, z = 0
    color([0.04, 0.04, 0.05]) hull() for (sx = [-1, 1], sz = [-1, 1])
        translate([sx*(TD10_GLASS[0]/2 - 5), 0, sz*(TD10_GLASS[1]/2 - 5)]) rotate([-90, 0, 0]) cylinder(r = 5, h = DSP_PANEL, $fn = 24);
    color([0.12, 0.3, 0.55]) translate([-TD10_VIEW[0]/2, -0.05, -TD10_VIEW[1]/2]) cube([TD10_VIEW[0], 0.05, TD10_VIEW[1]]);
    color([0.6, 0.6, 0.63]) for (sx = [-1, 1], z = DSP_TAB_Z) translate([sx*DSP_TAB_X - DSP_TAB3[0]/2, DSP_PANEL - 0.01, z - DSP_TAB3[1]/2]) cube([DSP_TAB3[0], DSP_TAB3[2], DSP_TAB3[1]]);
    color([0.6, 0.6, 0.63]) for (sx = [-1, 1], sz = [-1, 1]) cyl_y(DSP_SO[0], DSP_PANEL - 0.01, DSP_PANEL + DSP_SO[1], sx*24.5, DSP_PI_DZ + sz*29);
    color([0.1, 0.45, 0.2]) translate([-20, DSP_PANEL, DSP_PI_DZ - 20]) cube([40, 2, 50]);       // [M] adapter board
}
module placed_display3() translate([0, GLASS_Y, GC]) td2_10();
module placed_pi3() translate([0, PI_Y3, GC + DSP_PI_DZ]) rpi5();
// the shell gives way round the 4 front screw bosses (they sit in the outer wall)
module shell3(top = UNIT_TOP) {
    difference() {
        union() {
            difference() { shell2(top); for (j = JOINTS) cyl_y(POST_D + 0.5, RIB_TOP + RAIL_T - 0.1, D - BACK_T + 0.02, j[0], j[1]); }
            for (j = J2) cyl_y(POST_D, FR_BACK, D - BACK_T + 0.01, j[0], j[1]);
            power_holders();
        }
        for (j = J2) { cyl_y(7.0, SKIRT - 1, FR_BACK + 0.01, j[0], j[1]); cyl_y(M3_CLR, FR_BACK - 1, D + 1, j[0], j[1]); cyl_y(M3_HEAD_CB, FR_BACK + 2, D + 1, j[0], j[1]); }
    }
}

// ------------------------------------------------------------ main unit ----
module main_unit() {        // gen 2 unit, without the wall cleat
    color(C_BODY) front3();
    color(C_DIFF) ring3();
    placed_display3();
    placed_camera();
    color([0.95, 0.94, 0.9]) frame3();
    color([1, 0.95, 0.8]) placed_strips3("w"); color([0.5, 0.3, 0.8]) placed_strips3("rgb");
    placed_pi3();
    color(C_BODY) shell3();
    placed_power3();
    placed_electronics();
    placed_services();
}

// ------------------------------------------- single parts for the renders ----
// one mesh per material: openscad -D 'VIEW="x_bezel"' -o bezel.stl gen2_concept.scad
if (VIEW == "x_bezel")     bezel2();
if (VIEW == "x_diffuser")  diffuser2();
if (VIEW == "x_bezel_white") bezel2_white();
if (VIEW == "x_bezel_black") bezel2_black();
if (VIEW == "x_strip")     placed_strip();
if (VIEW == "x_rail")      led_rail2();
if (VIEW == "x_shell")     shell2();
if (VIEW == "x_display")   placed_display();
if (VIEW == "x_camera")    placed_camera();
if (VIEW == "x_inside")    { placed_display(); placed_pi(); placed_power(); placed_camera(); placed_strip(); }
// one mesh per component for the 3D viewer (admin → Hardware); cables are drawn by hardware/render/gen2_viewer.py
module screw_y(d, l, head, x, y, z, dir = 1) { translate([x, y, z]) rotate([dir > 0 ? -90 : 90, 0, 0]) { translate([0, 0, -head[1]]) cylinder(d = head[0], h = head[1], $fn = 24); cylinder(d = d, h = l, $fn = 16); } }
if (VIEW == "c_pi")        placed_pi();
if (VIEW == "c_pololu")    for (z = POL_Z) translate([POL_X, D - BACK_T - 1.2 - POL50[2], z]) pololu([POL50[0], POL50[2], POL50[1]]);
if (VIEW == "c_perfboard") { translate([-PB_RAIL[0]/2, PB_Y - PB_RAIL[2], PB_Z0]) cube([PB_RAIL[0], PB_RAIL[2], PB_RAIL[1]]);
                             translate([-PB_RAIL[0]/2 + 4, PB_Y - PB_RAIL[2] - 12, PB_Z0 + 4]) cube([PB_RAIL[0] - 8, 12, PB_RAIL[1] - 8]); }
if (VIEW == "c_4g")        back_part(HAT4G_P, HAT4G, "red");
if (VIEW == "c_mcore")     back_part(MCORE_P, MCORE, "red");
if (VIEW == "c_imu")       back_part(IMU_P, IMU, "red");
if (VIEW == "c_mics")      translate([-MSTRIP[0]/2, MIC_Y - MSTRIP[1]/2, H - WALL - MSTRIP[2] - 0.2]) cube(MSTRIP);
if (VIEW == "c_reed")      { translate([LOCK_X - REED[0]/2, D - BACK_T - 6, LOCK_TZ[1] + 4]) cube(REED); translate([LOCK_X, LOCK_SY, LOCK_TZ[1] - 3]) cylinder(d = 6, h = 3, $fn = 24); }
if (VIEW == "c_speaker")   { translate([SPK_P[0], D - BACK_T - 3, SPK_P[1]]) rotate([-90, 0, 0]) cylinder(d = SPK[0], h = 3, $fn = 64);
                             translate([SPK_P[0], D - BACK_T - SPK[1], SPK_P[1]]) rotate([-90, 0, 0]) cylinder(d = 32, h = SPK[1] - 3, $fn = 48); }
if (VIEW == "c_jack")      { cyl_y(11, D - BACK_T - PWR_IN[2] - 2.4 - 16, D - BACK_T - PWR_IN[2] - 2.4, PWR_P[0], PWR_P[1] + 8);
                             translate([PWR_P[0] - 5.5, D - BACK_T - PWR_IN[2] + 0.5, PWR_P[1] - 15]) cube([11, 12, 28]); }
if (VIEW == "c_cap")       translate([IF_CABLE[0], IF_CABLE[1], 0]) cable_cap();
// screws: 4 front (3.0 x 14 thread-forming, heads in the back wall), 4 camera (M2 x 6), 1 lock (4 x 25 Torx pin)
if (VIEW == "s_front")     for (j = JOINTS) screw_y(3, 14, [5.6, 2], j[0], RIB_TOP + RAIL_T + 8, j[1], -1);
if (VIEW == "s_camera")    for (h = CAM_HOLES_ROT) screw_y(2, 6, [3.8, 1.3], h[0], CAM_PCB_Y + CAM_PCB[2], LENS_Z + h[1], -1);
if (VIEW == "s_lock")      translate([LOCK_X, LOCK_SY, LOCK_HEAD[1]]) { translate([0, 0, -LOCK_HEAD[1]]) cylinder(d = LOCK_HEAD[0], h = LOCK_HEAD[1], $fn = 24); cylinder(d = 4, h = 25 - LOCK_HEAD[1], $fn = 16); }
if (VIEW == "x_core")      { placed_pi(); placed_power(); }
if (VIEW == "x_elec")      { placed_electronics(); placed_services(); }
if (VIEW == "x_cap")       cable_cap();
if (VIEW == "x_cleat")     wall_cleat2();
if (VIEW == "x_shell_all") shell2();
if (VIEW == "x_mod_shell") mod_shell();
if (VIEW == "x_lid")       lid(0);
if (VIEW == "x_lid_open")  lid(100);
if (VIEW == "x_printers")  for (y = PRN_Y) translate([0, y, 3 + 10]) instax_wide();
if (VIEW == "x_photo")     translate([-FILM_W[0]/2, PRN_Y[0] + INW[1]/2 - 0.6, -60]) cube([FILM_W[0], 1.2, 70]);


// v2c meshes
if (VIEW == "x_front3")    front3();
if (VIEW == "x_ring3")     ring3();
if (VIEW == "x_frame3")    frame3();
if (VIEW == "x_strip_w")   placed_strips3("w");
if (VIEW == "x_strip_rgb") placed_strips3("rgb");
if (VIEW == "x_display3")  placed_display3();
if (VIEW == "c_pi3")       placed_pi3();
if (VIEW == "c_psu5")      translate([PSU5_P[0], D - BACK_T - 1.2 - PSU5[2], PSU5_P[1]]) cube([PSU5[0], PSU5[2], PSU5[1]]);
if (VIEW == "c_wled")      translate([WLED_P[0], D - BACK_T - 1.2 - WLED[2], WLED_P[1]]) cube([WLED[0], WLED[2], WLED[1]]);
if (VIEW == "c_mosfet")    translate([-(HW - WALL) + 1.2, MOSF_P[0], MOSF_P[1]]) cube([MOSF[2], MOSF[1], MOSF[0]]);
if (VIEW == "x_shell3")    shell3();
if (VIEW == "s_front3")    for (j = J2) screw_y(3, 15, [5.6, 2], j[0], FR_BACK + 2, j[1], -1);
if (VIEW == "s_display")   for (sx = [-1, 1], z = DSP_TAB_Z) screw_y(2.5, 5, [4.5, 1.8], sx*DSP_TAB_X, TAB_Y + 2.0, GC + z, -1);
if (VIEW == "p_front3")    rotate([90, 0, 0]) front3();                                   // face down
if (VIEW == "p_ring3")     translate([0, 0, -RING_Y[0]]) rotate([90, 0, 0]) ring3();     // face down
if (VIEW == "p_frame3")    translate([0, 0, FR_BACK]) rotate([-90, 0, 0]) frame3();      // flat back down
if (VIEW == "info3") echo(J2 = J2, TAB_Y = TAB_Y, PI_Y3 = PI_Y3, CAM_END = CAM_END, CH_BACK = CH_BACK, FR_BACK = CH_BACK + FR_T, CAM_PCB_Y = CAM_PCB_Y);

// cutaway: keep x > -20 so the camera on the left looks into the printer bay
module cut_keep() { intersection() { children(); translate([-20, -500, -500]) cube([1000, 1000, 1000]); } }
if (VIEW == "x_mod_shell_cut")      cut_keep() mod_shell();
if (VIEW == "x_lid_cut")            cut_keep() lid(0);

// ----------------------------------------------------------------- views ----
// print-ready, oriented for the bed (H2C): openscad -D 'VIEW="p_shell"' -o shell.stl gen2_concept.scad
if (VIEW == "p_bezel")    rotate([90, 0, 0]) bezel2();                                  // face down on textured PEI
if (VIEW == "p_diffuser") translate([0, 0, RING_PROUD]) rotate([90, 0, 0]) diffuser2(); // face down
if (VIEW == "p_rail")     translate([0, 0, RIB_TOP + RAIL_T]) rotate([-90, 0, 0]) led_rail2(); // back down, bumps up
if (VIEW == "p_shell")    translate([0, 0, D]) rotate([-90, 0, 0]) shell2();              // back down
if (VIEW == "p_cleat")    translate([0, 0, D + GAP_WALL]) rotate([-90, 0, 0]) wall_cleat2(); // wall face down
if (VIEW == "p_cap")      cable_cap();                                                  // outer face down
if (VIEW == "main") main_unit();
if (VIEW == "module") module_body();
if (VIEW == "module_open") { color(C_BODY) printer_module(open = 100); for (y = PRN_Y) translate([0, y, 3 + 10]) instax_wide(); }
if (VIEW == "pair") { translate([0, 0, HP]) main_unit(); module_body(); placed_printers(); }
if (VIEW == "pair_xray") { translate([0, 0, HP]) main_unit(); %module_body(); placed_printers(); }
if (VIEW == "info") echo(W = W, H = H, R = R, BORDER = BORDER, RUN_V = RUN_V, RUN_H = RUN_H, RUN_T = RUN_T, JOINTS = JOINTS, WING_P = WING_P, HP = HP);
