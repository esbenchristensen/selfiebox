// ============================================================================
//  SELFIEBOX HALO gen 2 – CONCEPT (not a print file)
//  Main unit 70 mm deep (room for 4G and a mic array) and a printer module that
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
include <logo_selfi.scad>

D       = 70;          // gen 2 depth (v1-v4: 85, rev G: 66). Set by the 5 V PSU (25 mm) behind the frame (31.7) + 9 mm air
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
VESA_ON = false;  TRIPOD_ON = false;  LOCK_INSIDE = false;  DC_PANEL = false;  REVG_BACK = false;   // rev G's back-wall slots (3 mm, behind the mic core), recessed band and label recess had no use
INS_M3 = [2.4, 12];                          // pilot for the 3.0 x 15 SPUN+ front screws (core 1.8, ITW datasheet)
// no glow band (Esben 19 Oct): the shell is one print in one colour; only the front ring lights
GLOW = false;
RAIL_T = 4;                                 // rail ring as deep as the cross bars: flat back, prints back-down with the spring bumps on top
// underside services at y = D/2 + 11.5 (85 deep: 54). Written out, not via a new variable: these override
// halo.scad's values, and OpenSCAD evaluates an override where the first assignment stands.
IF_SCREW = [[-70, D/2 + 11.5], [70, D/2 + 11.5]];  IF_DOWEL = [[-18, 60], [18, 60]];  IF_CABLE = [-20, 38];   // v11: the power column has the middle; cable cap and dowels step aside. v13: x -22 -> -20, the wider collar clears the vent hood
VENT_X = [];                                // rev G's four slots give way to the vent fields below
UNIT_TOP = "closed";
POWER_REVG = false;  CLIPS = [[-75, 90], [0, 110], [-98, 175], [88, 100]];   // v11: cable-tie loops moved clear of the upright PSU and the speaker                         // v2: Mean Well RSD-60G-5, WLED controller and MOSFET in their own holders                        // nothing stacks on top in gen 2: no holes where the rain falls
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
// v14: the glass corners are R5 (RP-010276 drawing; v2-v13 used R3 + 1.2, which cut the inner wall open at the
// bottom corners). Real corners leave 0.24 mm to the wall there, so the keep-out only shaves the wall locally.
DSP_R = 5;  KEEP_C = 0.5;
module glass_keep2d() translate([VIEW_X, GC]) offset(r = DSP_R + KEEP_C) square([GW - 2*DSP_R, GH - 2*DSP_R], center = true);
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
        if (MIC_FLOOR) mic_floor_cut(); else for (x = MIC_HOLES) cyl_z(MIC_PORT, H - WALL - 1, H + 1, x, MIC_Y);    // mic ports in the top face
        joint_groove();
    }
    mic_rings();
    electronics_holders();
    services_add();
}

// ------------------------------------------ 4G, vandal sensing, microphones ----
// [A] Waveshare SIM7600G-H 4G HAT (B) 65 x 32 mm (waveshare.com); height with SIM holder [M]
// [A] Adafruit LIS3DH breakout 25.4 x 17.8 x 4.6 (tap/shock interrupt to the Pi)
// [A] reSpeaker Flex XVF3800 Linear (Seeed wiki DXF + STEP, checked v9): core board 70.5 x 52.2 x 1.6, 12.2 with
//     parts, 4 x Ø3.3 on 62.5 x 44.2, 24-pin FPC socket centred on one long edge (2 mm over the edge);
//     mic board 110 x 11, 3.0 with parts (all on top), 4 mics 33 apart, ports Ø1 through the PCB to the back,
//     0.68 off the board centre line towards the FPC edge; M3 holes Ø3.3 on the centre line, 62.5 apart;
//     FPC socket on top, centred, cable leaves from the long edge on the port side; Seeed's FPC is 20 cm
// [C] reed module OKY3440-1 32 x 19 x 7 (retailer; one M3 hole), [C] neodymium magnet Ø8 x 3 (retailer)
HAT4G = [32, 65, 12];   HAT4G_P = [-88, 166];      // w (x), h (z), thickness (y); bottom-left on the back wall
MCORE = [70.5, 52.2, 12.2]; MCORE_P = [5 - 70.5/2, 148];  // v9: lying (long edge horizontal, FPC socket at the bottom), right behind the Pi above the WLED controller: the 20 cm FPC needs ~16 cm (v8's spot needed ~29)
IMU   = [17.8, 25.4, 4.6];  IMU_P = [-8.9, 205];
MSTRIP = [110, 11, 3.0];  MIC_HOLES = [-49.5, -16.5, 16.5, 49.5];
// v8 (Esben 19 Oct, sketch /mnt/project-files/gen2-gennemgang/halo-gen2-v8_skitse_mikrofon-underside.png):
// the mic strip moves from under the top to a recess in the floor right behind the front, under the light
// channel. Ports point down, 17 mm behind the front face: nothing runs in from above, a theme top cannot
// cover them, and they sit closer to the talker. Two printed pegs through the board's own Ø3.3 holes
// (62.5 apart, Seeed DXF) locate it; the front's channel wall 0.5 mm above keeps it in once assembled.
// A drip groove in front of the ports stops water running back from the front face.
MIC_FLOOR = true;
MIC_Y = MIC_FLOOR ? 18.0 : D - 17;         // mic line, y (v9: 0.7 back, so the board centred on its holes keeps 0.8 to the front)
MIC_POCKET = [MSTRIP[0] + 0.6, MSTRIP[1] + 0.6, 1.8];   // recess in the floor: x, y, depth (floor 1.2 under it)
MIC_PEG = [3.0, 31.25, -0.68, 6.4];       // peg Ø, |x|, y offset from the mic line (holes and board centre sit 0.68 in front of the ports), top z
MSTRIP_Y = MIC_Y + MIC_PEG[2];            // v9: board centre line = hole line (v8 centred the board on the ports)
MIC_FPC = [-0.68, 15, 1.0];               // FPC notch in the pocket's back wall: centre x, width, floor height above the pocket floor
DRIP = [8.2, 2, 1];                       // drip groove: y start, width, depth
REED = [32, 19, 7];                         // w (x), h (z), thickness (y); REED_P below the lock
module back_part(p, sz, c) color(c) translate([p[0], D - BACK_T - 1.2 - sz[2], p[1]]) cube([sz[0], sz[2], sz[1]]);
module placed_electronics() {
    back_part(HAT4G_P, HAT4G, [0.1, 0.3, 0.6]);
    back_part(MCORE_P, MCORE, [0.15, 0.15, 0.15]);
    back_part(IMU_P, IMU, [0.1, 0.1, 0.4]);
    color([0.15, 0.15, 0.15]) translate([-MSTRIP[0]/2, (MIC_FLOOR ? MSTRIP_Y : MIC_Y) - MSTRIP[1]/2, MIC_FLOOR ? WALL - MIC_POCKET[2] + MIC_RING[2] : H - WALL - MSTRIP[2] - 0.2]) cube(MSTRIP);
    back_part(REED_P, REED, [0.1, 0.3, 0.6]);
}
// snap trays like the Pololu cradles: no screws; the mic strip hangs in two hook clips
module electronics_holders() {
    for (q = [[HAT4G_P, HAT4G], [IMU_P, IMU]])
        translate([q[0][0], D - BACK_T + 0.01, q[0][1]]) rotate([90, 0, 0]) pololu_cradle([q[1][0], q[1][1], q[1][2]], q[1][2] + 1.5);
    difference() {   // v9: the bottom lip opens 20 mm for the FPC socket (17.5 long, 2 over the edge)
        translate([MCORE_P[0], D - BACK_T + 0.01, MCORE_P[1]]) rotate([90, 0, 0]) pololu_cradle(MCORE, MCORE[2] + 1.5);
        translate([MCORE_P[0] + MCORE[0]/2 - 10, D - BACK_T - MCORE[2] - 3, MCORE_P[1] - 3]) cube([20, MCORE[2] + 2.2, 5]);
    }
    if (MIC_FLOOR) for (sx = [-1, 1]) cyl_z(MIC_PEG[0], WALL - MIC_POCKET[2] - 0.01, MIC_PEG[3], sx*MIC_PEG[1], MSTRIP_Y);   // v9: up to 0.6 under the front, so the board cannot lift off
    else for (sx = [-1, 1]) translate([sx*40 - 4, MIC_Y - MSTRIP[1]/2 - 2, H - WALL - MSTRIP[2] - 2.2]) difference() {
        cube([8, MSTRIP[1] + 4, MSTRIP[2] + 2.21]);
        translate([-1, 2 - 0.15, 1.8]) cube([10, MSTRIP[1] + 0.3, MSTRIP[2] + 0.3]);
        translate([-1, 4, -1]) cube([10, MSTRIP[1] - 4, 3]);
    }
    // reed module tray just above the lock tongue (reed glass at the bottom edge): lifting the box off the cleat moves the magnet away
    translate([REED_P[0], D - BACK_T + 0.01, REED_P[1]]) rotate([90, 0, 0]) pololu_cradle([REED[0], REED[1], REED[2]], REED[2] + 1.5);
}

// ------------------------------------------------------------ wall lock ----
// The cleat grows a tongue that enters a slot low in the back wall. One security screw
// (Torx with pin, 4 x 25, thread-forming for plastics) goes up through the bottom into the
// tongue; its button head sits flush in a recess, so the printer module still seats flat.
// The box cannot be lifted off without the special bit, and the front screws stay behind
// the box. With the printer module fitted, the module (key lid + 2 screws) comes off first.
// Lifting force on the tongue: 18 x 18 section, 19 mm lever to the plate.
LOCK_X = -82;  LOCK_W = 18;  LOCK_TZ = [18, 36];  LOCK_Y = D - 15;  DROP = CLEAT_D;   // v10: x -56 -> -82, room for the power column
LOCK_SY = (LOCK_Y + D - BACK_T)/2;                  // screw axis, y
REED_P = [LOCK_X - REED[0]/2, LOCK_TZ[1] + 4];      // reed module tray, bottom-left on the back wall
LOCK_HEAD = [8.6, 0.3];                             // [A] Bolte 88115 = DIN 7982 ST4.2 countersunk (head Ø8.1, ISO 14586 max 8.4), 90°; head 0.3 below the bottom
LOCK_BOSS = [15, 8];                                // floor boss under the head: dia, top z (tongue clears it by 1 mm while hanging on)
module lock_cut() {
    translate([LOCK_X - LOCK_W/2 - 0.6, D - BACK_T - 1, LOCK_TZ[0] - DROP - 0.6]) cube([LOCK_W + 1.2, BACK_T + 2, LOCK_TZ[1] - LOCK_TZ[0] + DROP + 1.2]);
    cyl_z(4.5, -1, LOCK_TZ[0], LOCK_X, LOCK_SY);
    cyl_z(LOCK_HEAD[0], -1, LOCK_HEAD[1], LOCK_X, LOCK_SY);
    translate([LOCK_X, LOCK_SY, LOCK_HEAD[1] - 0.01]) cylinder(d1 = LOCK_HEAD[0], d2 = 4.4, h = (LOCK_HEAD[0] - 4.4)/2, $fn = 32);   // 90° countersink
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
        cyl_z(8.2, LOCK_TZ[1] - 3.4, LOCK_TZ[1] + 1, LOCK_X, LOCK_SY);           // magnet pocket Ø8 x 3 (press fit)
    }
}

// ------------------------------------------------------------ stand bracket ----
// selfi-stativbeslag-v1 (Esben 22 Oct): the B2C box on the floor tripod (Sirui Traveler 5AX). The unit is not
// changed: the bracket is the wall cleat (same bar, same lock tongue, security screw and reed magnet) without wall
// screw holes, plus a logo panel at the top of the back, a spine and a shelf under the unit. The unit stands on
// the shelf; the tripod screw is under the unit's centre of gravity (about y 28-32), so the ball head carries
// no tipping moment. The shelf stays clear of the mic ports (y 18), the vent fields (|x| >= 28.75) and the
// lock screw (x -82); the power plug goes down through a slot. Two pins in the printer-module dowel holes stop
// the unit turning on the shelf. A steel 1/4"-20 T-nut (Einschlagmutter, flange up) sits flush in the underside:
// the quick-release plate clamps the whole shelf against its flange, and the unit's underside closes it in.
// Printed back face down like the wall cleat, the logo inlaid in the first layers (white + green, AMS).
ST_SHELF = [24, 20.5, 14];          // half width, front edge (y), thickness under the unit
ST_NUT = [0, 31];                   // tripod screw axis (x, y)
TNUT = [8.0, 8.0, 20.0];            // [C] 1/4"-20 T-nut: barrel Ø, barrel length, flange Ø (+0.5 clearance); measure the bought part
ST_SLOT = [8, 50];                  // power plug slot: half width, front edge (y); open to the plate
ST_PIN = [5.8, 5];                  // pins in the Ø6.2 x 8 dowel holes: Ø, height
ST_PANEL = [190, 58, 8, 16];        // logo panel: width, height, corner r, gap to the unit's top (bracket 304 high: fits the H2C bed)
ST_SPINE = 60;
ST_LOGO = 130;                      // logo width on the panel
ST_LOGO_Z = H - ST_PANEL[3] - ST_PANEL[1]/2;
module st_logo2d(c) mirror([1, 0]) scale(ST_LOGO/LOGO_SIZE[0]) if (c == "green") logo_green2d(); else if (c == "white") logo_white2d(); else logo_all2d();
module st_logo(c) ext_y(D + GAP_WALL - LOGO_D, D + GAP_WALL) translate([0, ST_LOGO_Z]) st_logo2d(c);   // reads right from behind
module stand_bracket() {
    yb = D + GAP_WALL - PLATE_T;  yf = D + GAP_WALL;  zs = -ST_SHELF[2];
    difference() {
        union() {
            // the wall cleat, holes filled by the panel and spine below
            ext_y(yb, yf) { translate([0, CLEAT_ZC - 14]) rrc(CLEAT_L + 4, 52, 6); hull() { translate([0, 40]) rrc(60, 20, 6); translate([LOCK_X, LOCK_TZ[0] + 4]) rrc(LOCK_W + 8, 24, 6); } }
            ext_x(-CLEAT_L/2 + 2, CLEAT_L/2 - 2) bar_2d(yb);
            for (z = [40, 100]) translate([-25, D + 1, z - 5]) cube([50, yb - D - 0.99, 10]);
            translate([LOCK_X - LOCK_W/2, LOCK_Y, LOCK_TZ[0]]) cube([LOCK_W, yb - LOCK_Y + 0.01, LOCK_TZ[1] - LOCK_TZ[0]]);
            translate([LOCK_X - LOCK_W/2, yb + 0.01, LOCK_TZ[0]]) rotate([0, 90, 0]) linear_extrude(LOCK_W) polygon([[0, 0], [-(LOCK_TZ[1] - LOCK_TZ[0]), 0], [0, -6]]);
            // logo panel and spine
            ext_y(yb, yf) { translate([0, ST_LOGO_Z]) rrc(ST_PANEL[0], ST_PANEL[1], ST_PANEL[2]); translate([0, (zs + CLEAT_ZC)/2]) rrc(ST_SPINE, CLEAT_ZC - zs, 6); }
            // shelf under the unit, rounded front corners
            translate([0, 0, zs]) linear_extrude(ST_SHELF[2]) hull() {
                for (sx = [-1, 1]) translate([sx*(ST_SHELF[0] - 6), ST_SHELF[1] + 6]) circle(r = 6, $fn = 32);
                translate([-ST_SPINE/2, yb]) square([ST_SPINE, PLATE_T]);
            }
            // gussets in the 14 mm gap behind the unit, beside the plug slot
            for (sx = [-1, 1]) translate([sx*(ST_SLOT[0] + 9) - 4, D + 0.5, -0.01]) rotate([90, 0, 90]) linear_extrude(8)
                polygon([[0, 0], [yb - D - 0.5 + 0.01, 0], [yb - D - 0.5 + 0.01, 40]]);
            for (p = IF_DOWEL) cyl_z(ST_PIN[0], -0.01, ST_PIN[1], p[0], p[1]);
            for (p = IF_DOWEL) translate([p[0], p[1], ST_PIN[1] - 0.01]) cylinder(d1 = ST_PIN[0], d2 = ST_PIN[0] - 1.6, h = 0.8, $fn = 32);
        }
        cyl_z(3.4, LOCK_TZ[0] - 1, LOCK_TZ[1] - 4.4, LOCK_X, LOCK_SY);           // pilot for the security screw
        cyl_z(8.2, LOCK_TZ[1] - 3.4, LOCK_TZ[1] + 1, LOCK_X, LOCK_SY);           // magnet pocket Ø8 x 3 (press fit)
        cyl_z(TNUT[0] + 0.3, zs - 1, 1, ST_NUT[0], ST_NUT[1]);                  // T-nut barrel, flush with the underside
        cyl_z(TNUT[2], zs + TNUT[1], 1, ST_NUT[0], ST_NUT[1]);                   // flange seat; the unit closes it
        translate([-ST_SLOT[0], ST_SLOT[1], zs - 1]) cube([2*ST_SLOT[0], yb - ST_SLOT[1] + 0.01, ST_SHELF[2] + 2]);   // power plug
        translate([0, ST_SLOT[1], zs - 1]) cylinder(r = ST_SLOT[0], h = ST_SHELF[2] + 2, $fn = 32);
        ext_y(yf - LOGO_D, yf + 1) translate([0, ST_LOGO_Z]) st_logo2d("all");   // pocket for the inlay
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
module mic_floor_cut() {
    translate([-MIC_POCKET[0]/2, MSTRIP_Y - MIC_POCKET[1]/2, WALL - MIC_POCKET[2]]) cube([MIC_POCKET[0], MIC_POCKET[1], MIC_POCKET[2] + 1]);
    translate([MIC_FPC[0] - MIC_FPC[1]/2, MSTRIP_Y, WALL - MIC_POCKET[2] + MIC_FPC[2]]) cube([MIC_FPC[1], MIC_POCKET[1]/2 + 2, MIC_POCKET[2] + 1]);   // v9: FPC lies flat out of the back
    for (x = MIC_HOLES) cyl_z(MIC_PORT, -1, WALL - MIC_POCKET[2] + 0.01, x, MIC_Y);
    translate([-(W/2 - R - 4), DRIP[0], -1]) cube([W - 2*R - 8, DRIP[1], DRIP[2] + 1]);   // ends 4 mm inside the flat floor
}
module mic_rings() for (x = MIC_HOLES) translate([x, MIC_Y, MIC_FLOOR ? WALL - MIC_POCKET[2] - 0.01 : H - WALL - MIC_RING[2]]) difference() {
    cylinder(d = MIC_RING[1], h = MIC_RING[2] + 0.01, $fn = 32); translate([0, 0, -1]) cylinder(d = MIC_RING[0], h = 3, $fn = 24); }
// splash hoods over the underside vents: water bouncing up hits the roof and drops back out,
// air turns sideways. Side walls only along x so the hood prints without support (back down).
HOOD = [8, 1.6];                        // roof height above the floor, wall/roof thickness
module vent_hoods() for (sx = [-1, 1]) {
    xs = vent_xs(sx);  x0 = xs[0] - VENT_SL[0]/2 - 2;  x1 = xs[len(xs) - 1] + VENT_SL[0]/2 + 2;
    y0 = vent_y(sx) - vent_l(sx)/2 - 2;  y1 = vent_y(sx) + vent_l(sx)/2 + 2;
    for (x = [x0 - HOOD[1], x1]) translate([sx > 0 ? x : -x - HOOD[1], y0, WALL - 0.01]) cube([HOOD[1], y1 - y0, HOOD[0] + HOOD[1]]);
    translate([sx > 0 ? x0 - HOOD[1] : -x1 - HOOD[1], y0, WALL + HOOD[0]]) cube([x1 - x0 + 2*HOOD[1], y1 - y0, HOOD[1]]);
}

// ------------------------------------------------- underside and back services ----
// Air: in through two slot fields in the underside (no drinks get in from below), out through
// louvred slots high in the back wall into the 14 mm wall gap, which works as a chimney (closed in v7, BACK_EXH).
// Every opening is 2.5 mm wide: no fingers, and a poked wire meets only 12 V parts.
VENT_SL = [2.5, 28];  VENT_XS = [for (i = [0:6]) 30 + 5*i];   // underside: 2 x 7 slots, 7.5 cm2 (85 deep: 9.8)
// v11: the left field gives its two inner slots to the printer cable cap and gets full-length slots back
function vent_xs(sx) = sx > 0 ? VENT_XS : [for (i = [2:6]) 30 + 5*i];
// 70 deep, the hoods sit between the frame (y 31.7, it reaches down to z 7) and the back wall. The left
// field had shorter slots until v10 (lock boss, then the power column); in v11 both run full length: [left, right] slot length.
VENT_Y0 = 33.5;  VENT_L = [D - BACK_T - 1.5 - 4 - VENT_Y0, D - BACK_T - 1.5 - 4 - VENT_Y0];
function vent_l(sx) = VENT_L[sx > 0 ? 1 : 0];
function vent_y(sx) = VENT_Y0 + 2 + vent_l(sx)/2;
EXH_XS = [for (i = [0:36]) -90 + 5*i];  EXH_Z = [235, 245];  EXH_DROP = 2;    // back: 37 louvres, 9.3 cm2
EXH_C = [for (sx = [-1, 1], i = [0:3]) sx*(86 + 4.5*i)];  EXH_CZ = [254, 274]; // + 8 in the top corners, 4.0 cm2
// v7 (Esben 19 Oct): the back louvres are closed, only the underside vents stay. Without an outlet up high
// there is no chimney: the box cools through its walls, about as if it were sealed.
BACK_EXH = false;
// printer pass-through: bayonet cap, flush, turned with a 2-pin spanner (no coin slot to vandalise).
// v13 (Esben 20 Oct): in v12 nothing stopped the cap from the inside (a Ø19.6 disc in the Ø20 hole), so it
// rattled, slid 4 mm up into the box and its detents never worked. Now a flange stops on a shoulder
// (counterbore from below), so the cap sits flush; it is turned 60° clockwise seen from below, and each lug
// rides onto a printed spring tongue in the floor: a hump bends the tongue 0.45 mm on the way, drops into a
// groove under the lug at the end (click) and keeps 0.25 mm of preload (about 2.6 N per tongue) that pulls the
// flange onto the shoulder. A hard stop ends the turn. Sketch: gen2-gennemgang/halo-gen2-v13_skitse_printerprop.png
// Cap axes: z up (box), angles from +x, counter-clockwise seen from inside; a lug sits at a when locked, a - CAP_ENTRY on entry.
CAP_ANG = [90, 210, 330];  CAP_ENTRY = 60;
CAP_FL = [28.4, 1.8];  CAP_CB = 29;              // flange Ø, thickness (= counterbore depth); counterbore Ø
CAP_PLUG = 19.4;                                 // plug Ø in the Ø20 hole (IF_CABLE_D)
CAP_LUG = [9.5, 12.8, 15, 5.3, 6.7];             // lug: r in, r out, half angle, z bottom, z top (cap seated)
CAP_NOTCH = [13.3, 17];                          // entry notch through the floor: r out, half angle
CAP_COLLAR = [13.6, 15, 6.8];                    // collar r in, r out, top z (the frame starts at z 7 here)
CAP_TONGUE = [10.2, 13.2, 3.7, 5.1, -36, 12];    // spring tongue: r in, r out, z under, z top, angle from root edge to tip
CAP_ROOT = [-42, -36];                           // root post, angles (beside the entry notch)
CAP_HUMP = [1.2, 0.3, 5.75];                     // hump at the lock angle: half width at the base and at the top, top z
CAP_GROOVE = [0.62, 0.35, 0.2];                  // groove under the lug: half width at the face and at the bottom, depth
CAP_STOP = [16, 26];                             // hard stop, angles
module sector(r0, r1, a0, a1, z0, z1) translate([0, 0, z0]) rotate(a0) rotate_extrude(angle = a1 - a0, $fn = 96) translate([r0, 0]) square([r1 - r0, z1 - z0]);
// power (v10, Esben 20 Oct): the back stays closed. The 5.5/2.5 socket with screw terminals
// [A] TRU Components DC-13F (Conrad 1570909, drawing: 39.8 long, barrel Ø10 x 12, terminal block 10 wide, 5 long)
// sits mouth down in a printed column low on the back wall, in the middle between the PSU and the WLED controller. The PSU's straight plug goes up through
// a hole in the underside and disappears in the column; only the lead comes out, straight down. A hole that faces
// down cannot fill with rain. The socket is wired first and pushed down from above: it rests on the step above
// the barrel bore (plug pulled out) and two snap fingers catch the top of its body (plug pushed in).
// [C] Body ~13 square (photo); [C] plug grip Ø<=12, <=38 long under the barrel (no Mean Well drawing): measure.
PWR_P = [0, 60];                                // column axis (x, y): v11 in the middle (v10: x -49)
PWR_SOCK = [10, 12, 13, 22.8, 10, 5];           // barrel Ø, length; body width, length; terminal block width, length
PWR_MOUTH = 38;                                 // socket mouth z: plug space below it
PWR_BORE = 12.5;  PWR_CAV = 13.8;  PWR_WALLT = 2;  // plug bore Ø, body cavity, column wall
PWR_BODY_TOP = PWR_MOUTH + PWR_SOCK[1] + PWR_SOCK[3];   // 72.8: the fingers catch here
PWR_TOP = PWR_BODY_TOP + 2;                      // column top; the terminal block stands 3 mm above it
PWR_OUT = PWR_CAV + 2*PWR_WALLT;                 // column outside, square
// speaker: fires backwards through a grille into the wall gap, sound leaves round the box edges
// [A] DFRobot FIT0502 3 W 8 ohm enclosed speaker (drawing KN-SP4030-05): 69.9 x 31, flange 3.7,
//     4 x Ø3.0 ear holes on 63.6 x 24, front opening oval 38.5 x 27; depth 15–16 (spec/retailer)
SPK_P = [-72.5, 143.5];  SPK = [69.9, 31, 16];  SPK_FL = 3.7;  SPK_EAR = [63.6, 24];   // centre (x, z); w, h, depth
module bottom_vents() for (sx = [-1, 1], x = vent_xs(sx)) hull() for (dy = [-1, 1])
    cyl_z(VENT_SL[0], -1, WALL + 1, sx*x, vent_y(sx) + dy*(vent_l(sx) - VENT_SL[0])/2);
module louvre(x, z0, z1) hull() {   // outer opening lower than the inner one: water runs out
    translate([x - VENT_SL[0]/2, D - BACK_T - 0.5, z0]) cube([VENT_SL[0], 0.01, z1 - z0]);
    translate([x - VENT_SL[0]/2, D + 0.5, z0 - EXH_DROP]) cube([VENT_SL[0], 0.01, z1 - z0]);
}
module services_cut() {
    bottom_vents();
    if (BACK_EXH) { for (x = EXH_XS) louvre(x, EXH_Z[0], EXH_Z[1]); for (x = EXH_C) louvre(x, EXH_CZ[0], EXH_CZ[1]); }
    // bayonet entry notches next to the pass-through
    translate([IF_CABLE[0], IF_CABLE[1], 0]) {
        cyl_z(CAP_CB, -1, CAP_FL[1], 0, 0);                                                         // shoulder: the flange stops here, flush
        for (a = CAP_ANG) sector(0, CAP_NOTCH[0], a - CAP_ENTRY - CAP_NOTCH[1], a - CAP_ENTRY + CAP_NOTCH[1], -1, WALL + 1);
    }
    // power: plug hole in the underside (0.8 chamfer), and the speaker grille
    cyl_z(PWR_BORE, -1, WALL + 1, PWR_P[0], PWR_P[1]);
    translate([PWR_P[0], PWR_P[1], -0.01]) cylinder(d1 = PWR_BORE + 1.6, d2 = PWR_BORE, h = 0.8, $fn = 48);
    for (h = spk_holes()) cyl_y(2, D - BACK_T - 1, D + 1, SPK_P[0] + h[0], SPK_P[1] + h[1]);
}
function spk_holes() = [for (i = [-6:6], j = [-5:5]) let(x = 3.5*i + (j % 2 ? 1.75 : 0), z = 3.03*j) if (pow(x/17.5, 2) + pow(z/11.8, 2) < 1) [x, z]];   // inside the 38.5 x 27 opening
module services_add() {
    vent_hoods();
    cap_seat();
    // floor boss under the lock screw head
    difference() {
        cyl_z(LOCK_BOSS[0], WALL - 0.01, LOCK_BOSS[1], LOCK_X, LOCK_SY);
        cyl_z(4.5, -1, LOCK_BOSS[1] + 1, LOCK_X, LOCK_SY);
        translate([LOCK_X - LOCK_W/2 - 0.6, D - BACK_T - 0.01, 0]) cube([LOCK_W + 1.2, 5, 20]);
    }
    power_column();
    // speaker: a rim round the flange, 4 pegs through the ear holes and 2 hooks over the flange
    translate([SPK_P[0], D - BACK_T + 0.01, SPK_P[1]]) rotate([90, 0, 0]) {
        difference() { translate([-SPK[0]/2 - 1.8, -SPK[1]/2 - 1.8, 0]) cube([SPK[0] + 3.6, SPK[1] + 3.6, SPK_FL + 1.6]);
                       translate([-SPK[0]/2 - 0.3, -SPK[1]/2 - 0.3, -1]) cube([SPK[0] + 0.6, SPK[1] + 0.6, SPK_FL + 4]);
                       for (sx = [-1, 1]) translate([sx*(SPK[0]/2 + 0.9) - 2, -SPK[1]/2 - 3, SPK_FL]) cube([4, SPK[1] + 6, 3]); }
        for (sx = [-1, 1], sz = [-1, 1]) translate([sx*SPK_EAR[0]/2, sz*SPK_EAR[1]/2, 0]) cylinder(d = 2.7, h = SPK_FL - 0.3, $fn = 16);
        for (sz = [-1, 1]) translate([-5, sz > 0 ? SPK[1]/2 + 0.3 : -SPK[1]/2 - 1.8, 0]) {
            cube([10, 1.5, SPK_FL + 0.3]);
            translate([0, 0, SPK_FL + 0.3]) hull() { cube([10, 1.5, 0.01]); translate([0, sz > 0 ? -0.8 : 0, 1]) cube([10, 2.3, 0.01]); }
        }
    }
}
module speaker3() translate([SPK_P[0] - SPK[0]/2, D - BACK_T - SPK[2], SPK_P[1] - SPK[1]/2]) {
    translate([0, SPK[2] - SPK_FL, 0]) cube([SPK[0], SPK_FL, SPK[1]]);                          // flange with the ears
    translate([4, 0, 2]) cube([SPK[0] - 8, SPK[2] - SPK_FL + 0.01, SPK[1] - 4]);               // box behind it
}
// in the shell, round the pass-through: collar (splash past the cap must climb it), 3 spring tongues with a hump, 3 hard stops
module cap_seat() translate([IF_CABLE[0], IF_CABLE[1], 0]) {
    t = CAP_TONGUE;
    difference() { cyl_z(2*CAP_COLLAR[1], WALL - 0.01, CAP_COLLAR[2], 0, 0); cyl_z(2*CAP_COLLAR[0], WALL - 1, CAP_COLLAR[2] + 1, 0, 0); }
    for (a = CAP_ANG) {
        sector(t[0], t[1], a + CAP_ROOT[0], a + CAP_ROOT[1] + 0.01, WALL - 0.01, t[3]);           // root post
        sector(t[0], t[1], a + t[4], a + t[5], t[2], t[3]);                                        // tongue, 0.7 mm air under it
        rotate(a) hull() { translate([t[0], -CAP_HUMP[0], t[3] - 0.01]) cube([t[1] - t[0], 2*CAP_HUMP[0], 0.01]);
                           translate([t[0], -CAP_HUMP[1], CAP_HUMP[2] - 0.01]) cube([t[1] - t[0], 2*CAP_HUMP[1], 0.01]); }
        sector(t[0], CAP_COLLAR[0] + 0.01, a + CAP_STOP[0], a + CAP_STOP[1], WALL - 0.01, CAP_COLLAR[2]);   // hard stop
    }
}
module cable_cap() {   // printed separately, outer face down; flush with the box bottom when seated
    l = CAP_LUG;
    difference() {
        union() {
            cylinder(d = CAP_FL[0], h = CAP_FL[1], $fn = 96);
            cylinder(d = CAP_PLUG, h = l[4], $fn = 96);
            for (a = CAP_ANG) sector(l[0], l[1], a - l[2], a + l[2], l[3], l[4]);
        }
        for (sx = [-1, 1]) translate([sx*5, 0, -1]) cylinder(d = 2.2, h = 4, $fn = 16);       // spanner pins
        for (a = CAP_ANG) rotate(a) hull() {                                                      // detent groove under each lug
            translate([l[0] - 1, -CAP_GROOVE[0], l[3] - 0.01]) cube([l[1] - l[0] + 2, 2*CAP_GROOVE[0], 0.01]);
            translate([l[0] - 1, -CAP_GROOVE[1], l[3] + CAP_GROOVE[2]]) cube([l[1] - l[0] + 2, 2*CAP_GROOVE[1], 0.01]);
        }
    }
}
module power_column() translate([PWR_P[0], PWR_P[1], 0]) {
    c = PWR_CAV;  o = PWR_OUT;  fz = PWR_BODY_TOP - 16;   // fingers: the ±x walls, free above fz
    difference() {
        translate([0, 0, WALL - 0.01]) linear_extrude(PWR_TOP - WALL + 0.01) rrc(o, o, 2);
        cyl_z(PWR_BORE, -1, PWR_MOUTH, 0, 0);                                       // plug
        cyl_z(PWR_SOCK[0] + 0.5, PWR_MOUTH - 0.01, PWR_MOUTH + PWR_SOCK[1], 0, 0);  // barrel; its top is the step the body rests on
        translate([-c/2, -c/2, PWR_MOUTH + PWR_SOCK[1]]) cube([c, c, PWR_TOP]);    // body
        for (sx = [-1, 1], sy = [-1, 1]) translate([sx > 0 ? c/2 - 0.5 : -o/2 - 0.5, sy > 0 ? c/2 - 0.8 : -c/2, fz])
            cube([PWR_WALLT + 1, 0.8, PWR_TOP]);                                      // slots free the fingers
    }
    // catches: 1.2 over the body's top edge, ramped above so the socket pushes past them
    for (sx = [-1, 1]) translate([sx*c/2, -c/2 + 1.5, PWR_BODY_TOP + 0.2]) rotate([-90, 0, 0]) linear_extrude(c - 3)
        polygon([[0, 0], [-sx*1.2, 0], [-sx*1.2, -0.4], [0, -(PWR_TOP - PWR_BODY_TOP - 0.2)]]);
}
module power_inlet() translate([PWR_P[0], PWR_P[1], 0]) {   // socket mouth down, and the PSU plug pushed in from below
    s = PWR_SOCK;  z1 = PWR_MOUTH + s[1];
    cyl_z(s[0], PWR_MOUTH, z1, 0, 0);
    hull() { translate([-(s[2] - 1.5)/2, -(s[2] - 1.5)/2, z1]) cube([s[2] - 1.5, s[2] - 1.5, 0.01]); translate([-s[2]/2, -s[2]/2, z1 + s[3] - 0.01]) cube([s[2], s[2], 0.01]); }
    translate([-s[4]/2, -s[4]/2, z1 + s[3]]) cube([s[4], s[4], s[5]]);
    cyl_z(10, 9, PWR_MOUTH, 0, 0);                                   // plug grip
    translate([0, 0, 1]) cylinder(d1 = 6, d2 = 8.5, h = 8.01, $fn = 32);  // strain relief, inside the bore
    cyl_z(4, -60, 1.01, 0, 0);                                       // lead, straight down
}
module placed_services() {
    translate([IF_CABLE[0], IF_CABLE[1], 0]) color([0.11, 0.11, 0.12]) cable_cap();
    // socket (mouth down) in its column and the PSU's straight plug from below
    color([0.2, 0.2, 0.2]) power_inlet();
    // speaker
    color([0.2, 0.2, 0.22]) speaker3();
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
// [A] Gledopto GL-C-016WL-D WLED controller 108 x 45 x 18 (Gledopto manual; no drawing, terminals at both short ends): flat on the back wall above the PSU
// (the right wall is taken by the mic board higher up).
// [A] DFRobot Gravity MOSFET DFR0457 (white strips) 44 x 32, 4 x Ø3.1 on 20 x 25; height not published (~16): on the left side wall.
PSU5 = [60, 128, 25];  PSU5_P = [12, 16];                     // x, z (bottom-left), on the back wall; v11: stands up right of the power column, terminals at the top
WLED = [45, 108, 18];  WLED_P = [-57, 16];                    // x, z (bottom-left), on the back wall; v11: stands up left of the power column
MOSF = [44, 32, 16];   MOSF_P = [34.5, 64];                  // on the left wall; [A] DFR0457 PCB 44 x 32 (drawing), [C] ~16 high with the screw terminal
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
    // v11: both stand up; the trays turn with them, so the low end stops stay at the terminal ends (top and bottom)
    translate([PSU5_P[0] + PSU5[0], D - BACK_T + 0.01, PSU5_P[1]]) rotate([0, -90, 0]) rotate([90, 0, 0]) wall_tray([PSU5[1], PSU5[0], PSU5[2]], PSU5[2] + 1.5);
    translate([WLED_P[0] + WLED[0], D - BACK_T + 0.01, WLED_P[1]]) rotate([0, -90, 0]) rotate([90, 0, 0]) wall_tray([WLED[1], WLED[0], WLED[2]], WLED[2] + 1.5);
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
CH_BACK = 27.7;                           // channel back (front walls end here); v12: a fixed depth, no longer tied to the display
XB3_Y = CH_BACK - 4;                      // 23.7: front face of the frame's cross bars
FR_T = 4;                                 // frame back plate
FR_BACK = CH_BACK + FR_T;                 // 31.7: flat back of the frame
RING_Y = [-0.5, 0.5];                     // ring face: 0.5 proud, 1 mm thick
CAM_END = CAM_HOLE/2 + 4 + S3;            // slot end centres, 4 mm black round the camera hole
CAM_KEEP = [17, 14];                      // no channel behind the camera board: half x, half z
REFL = [[4.2, -6.0], [26.45, 4.4]];       // reflector line (y, r): from the ring flange to the floor
FLOOR3 = 26.45;
// [y0, y1, kind, thickness, end |x| left, end |x| right] (strip ends next to the camera)
// [C] white: Ledproff COB Ra95 24 V, 8 x 2 mm; RGB: Ledprodukter WS2812b COB 5 V, 5 x 2.2 mm (dimension sheet)
// Each strip is fed from ONE end. The clip connectors are wider than the strips (white 9.6, RGB 6.8,
// up to 4.4 high), so they cannot sit side by side: white 1 and RGB take their clips at the left end,
// white 2 at the right end, and the strip next to a clip stops 17 mm further out.
CLIP_L = 17;                              // clip zone along the strip, from the camera keep-out
STRIPS3 = [[5.1, 13.1, "w", 2.0, 17, 34], [13.15, 21.15, "w", 2.0, 34, 17], [21.2, 26.2, "rgb", 2.2, 17, 34]];
STRIP_T3 = [4.7, 6.9];                    // strip wall face at r 6.9; thickest strip reaches r 4.7
// [C] Ledproff low-profile start clip 8 mm COB: 9.6 wide (retailer), ~15.5 x 4.3 (comparable LinearLux, unconfirmed)
// [C] Ledprodukter MiniClip 5 mm 3-pole: 16.53 x 6.8 x 4.4 (retailer table)
CLIPS3 = [[-1, 9.1, [16, 9.6, 4.3]], [1, 17.15, [16, 9.6, 4.3]], [-1, 23.7, [16.6, 6.8, 4.4]]];   // side, strip centre y, [l, w, h]
J_R = 11.8;                               // front screws: in the outer wall at the 4 corners
J2 = [for (j = JOINTS) [j[0] + sign(j[0])*J_R/sqrt(2), j[1] + sign(j[1] - (RING_Z0 + RING_Z1)/2)*J_R/sqrt(2)]];
// v12 (Esben 20 Oct, sketch /mnt/project-files/gen2-gennemgang/halo-gen2-v11_skitse_tyndere-front-og-rille.png):
// the display stays behind the front, but the front is only 1.6 mm thick over the glass (v2-v11: 3.2 + a 0.5 land,
// glass 3.7 in). The glass lies straight on the back of that lip, so there is no gap at the window edge. A groove
// in the lip, 1 mm out from the window bevel, takes a self-adhesive soft foam tape that seals round the picture.
GLASS_Y3 = 1.6;                           // glass front face = lip thickness
GLASS_C3 = 0.4;                           // the thin pocket clears the glass by 0.4 (the 8 ribs locate it, 0.2)
LAND3 = 1.0;                              // flat land from the window bevel to the groove
GROOVE3 = [3.2, 0.6];                     // groove width, depth; [C] foam tape 3 x 1 mm, squeezed to 0.6 (40 %)
WIN3_BEVEL = [1.6, 0.6];                  // window grows 1.6 at the face, 0.6 at the glass (as v2-v11)
module groove3_2d(g) translate([VIEW_X, GC]) offset(r = WIN3_BEVEL[1] + g) square([TD10_VIEW[0] + 1, TD10_VIEW[1] + 1], center = true);
module pocket3_2d() translate([VIEW_X, GC]) offset(r = DSP_R + GLASS_C3) square([GW - 2*DSP_R, GH - 2*DSP_R], center = true);
// [A] Touch Display 2 10" (RP-010276 physical spec): panel 7.05 deep incl. the 1.1 cover lens,
// four M2.5 tabs 3 deep at 22.54 from the sides, 46.42 from the top and 41.68 from the bottom edge;
// Pi stand-offs 8.5 high on a 49 x 58 pattern, 6.87 below the centre. [M] up = the drawing's up.
// v14: turned the other way round, each tab moves 4.74 mm (v13's +/-2.4 slots missed it by 2.3), so the frame's
// slots and bosses now span both positions and the cross bars sit on their mid point (+/-80 from the glass centre).
DSP_PANEL = 7.05;  DSP_TAB3 = [8, 12, 3];  DSP_TAB_X = 166.9/2 - 22.54;  DSP_TAB_Z = [248.1/2 - 46.42, -(248.1/2 - 41.68)];
DSP_PI_DZ = -6.87;  DSP_SO = [5, 8.5];
DSP_BOTH = false;                         // Esben (21 Oct): the plate notches face down, away from the camera, as drawn
DSP_SLOT_X = 0.3;                         // v14: the holes are 0.3 wider each way across (3.5 mm): v13's 2.9 left 0.2 per side for
                                          // 121.8 mm between the holes, less than the print shrinks, and the screws missed
DSP_XB_Z = DSP_BOTH ? [for (z = DSP_TAB_Z) sign(z)*(abs(DSP_TAB_Z[0]) + abs(DSP_TAB_Z[1]))/2] : DSP_TAB_Z;   // [80, -80]
TAB_Y = GLASS_Y3 + DSP_PANEL + DSP_TAB3[2];  // 11.65: back face of the tabs
PRELOAD = 0.2;                            // the frame bosses press the display 0.2 mm onto the lip (v12; v2-v11: the glass land)
PI_Y3 = GLASS_Y3 + DSP_PANEL + DSP_SO[1];

module cam_keep2d() translate([-CAM_KEEP[0], RING_Z1 - CAM_KEEP[1]]) square([2*CAM_KEEP[0], 2*CAM_KEEP[1]]);
// the ring's plan shape at half width h: the band with round ends next to the camera
module ring3_2d(h) {
    difference() { ring_band2d(-h, h); translate([-CAM_END, RING_Z1 - 20]) square([2*CAM_END, 40]); }
    for (sx = [-1, 1]) translate([sx*CAM_END, RING_Z1]) circle(r = h, $fn = 48);
}
module ring3_band(a, b) difference() { ring3_2d(b); ring3_2d(a); }
// a 45 deg step from half width a at y0 to half width b at y1, in n layers
module ring3_bevel(y0, y1, a, b, n = 5) for (i = [0:n - 1]) ext_y(y0 + i*(y1 - y0)/n - 0.01, y0 + (i + 1)*(y1 - y0)/n) ring3_2d(a + (i + 1)*(b - a)/n);

// 8 locating ribs round the glass edge (0.2 mm clearance): the picture sits evenly in the window.
// Each runs from the glass edge out into the channel wall; 12 long, up to 2.5 mm over the glass back.
// v12: they stand on the thin lip (y = GLASS_Y3) inside the glass pocket.
GRIB_C = 0.2;  GRIB_L = 12;  GRIB_H = 2.5;
module glass_ribs() {
    for (sx = [-1, 1], dz = [-70, 70])           // sides: wall is 1.2 mm from the glass
        translate([sx > 0 ? GW/2 + GRIB_C : -(RING_X - CH_IN), GLASS_Y3 - 0.01, GC + dz - GRIB_L/2])
            cube([RING_X - CH_IN - GW/2 - GRIB_C, GRIB_H + 0.01, GRIB_L]);
    for (sx = [-1, 1], sz = [-1, 1])             // top and bottom
        translate([sx*45 - GRIB_L/2, GLASS_Y3 - 0.01, sz > 0 ? GC + GH/2 + GRIB_C : RING_Z0 + CH_IN])
            cube([GRIB_L, GRIB_H + 0.01, sz > 0 ? RING_Z1 - CH_IN - (GC + GH/2 + GRIB_C) : GC - GH/2 - GRIB_C - (RING_Z0 + CH_IN)]);
}
// logo (Esben 19 Oct, sketch /mnt/project-files/logo-paa-boksen/): the white Selfi logo with green dots,
// 27.5 x 10, inlaid 0.8 mm (layers 1-4, AMS) flush in the front, centred in the black field
// between the light ring and the display window. Separate white and green bodies for the slicer.
LOGO_D = 0.8;
LOGO_Z = ((RING_Z0 + S3) + (GC - (TD10_VIEW[1] + 1)/2 - 1.6))/2;
module logo_inlay(c) ext_y(0, LOGO_D) translate([0, LOGO_Z]) if (c == "green") logo_green2d(); else if (c == "white") logo_white2d(); else logo_all2d();
// v14 (Esben 21 Oct): the ring's round ends lie over the camera board (left) and the ribbon (right), and the
// channel walls stopped 17 mm either side of the lens, so the dark camera bay showed through the diffuser.
// The walls now follow the ring's ends round, and a 1.2 mm back closes each end 1 mm in front of the board.
CAP_Y = CAM_PCB_Y - 0.8;  CAP_T = 1.2;
module cam_caps() intersection() {
    union() { ext_y(PT - 0.01, CAP_Y) ring3_band(CH_IN, CH_HALF); ext_y(CAP_Y - CAP_T, CAP_Y) ring3_2d(CH_HALF); }
    ext_y(PT - 1, CAP_Y + 1) cam_keep2d();
}
// v13 had 4 pegs Ø2.0 in the board's Ø2.2 holes; some printed a little fat and had to be trimmed with a knife.
// v14 kept only 2. v15 (Esben 21 Oct): all 4 are back, Ø1.9 with a cone tip.
CAM_PEGS = [0, 1, 2, 3];  CAM_PEG = [1.9, 0.6];   // peg Ø, cone length to Ø1.1
module cam_peg(h) {
    cyl_y(CAM_PEG[0], CAM_PCB_Y - 0.01, CAM_PCB_Y + CAM_PCB[2] + 1.5 - CAM_PEG[1], h[0], LENS_Z + h[1]);
    translate([h[0], CAM_PCB_Y + CAM_PCB[2] + 1.5 - CAM_PEG[1] - 0.01, LENS_Z + h[1]]) rotate([-90, 0, 0]) cylinder(d1 = CAM_PEG[0], d2 = 1.1, h = CAM_PEG[1], $fn = 24);
}
module front3() union() {
    difference() {
        union() {
            front_base(H, BLOCK_Z);
            // the skirt carries the tongue: no 1.4 mm ledge hanging over air when printed face down
            ext_y(PT - 0.01, SKIRT + 0.01) difference() { rr(W, H, R); translate([0, WALL + FIT + TONGUE_T]) rr(W - 2*(WALL + FIT + TONGUE_T), H - 2*(WALL + FIT + TONGUE_T), R - WALL - TONGUE_T); }
            ext_y(PT - 0.01, CH_BACK) difference() { ring_band2d(-CH_HALF, CH_HALF); ring_band2d(-CH_IN, CH_IN); glass_keep2d(); cam_keep2d(); }
            for (j = J2) cyl_y(6, PT - 0.01, CH_BACK, j[0], j[1]);
            for (h = CAM_HOLES_ROT) cyl_y(4.6, PT - 0.01, CAM_PCB_Y, h[0], LENS_Z + h[1]);
            for (i = CAM_PEGS) cam_peg(CAM_HOLES_ROT[i]);
            cam_shroud(); joint_rib(); cam_caps();
        }
        hull() { ext_y(-1, 0) window2d(WIN3_BEVEL[0]); ext_y(-1, GLASS_Y3 + 0.01) window2d(WIN3_BEVEL[1]); }
        ext_y(GLASS_Y3, PT + 0.01) pocket3_2d();                           // v12: thin lip over the glass
        ext_y(GLASS_Y3 - GROOVE3[1], GLASS_Y3 + 0.01) difference() { groove3_2d(LAND3 + GROOVE3[0]); groove3_2d(LAND3); }
        ext_y(-1, LOGO_D) translate([0, LOGO_Z]) logo_all2d();   // pocket for the inlay
        ext_y(-1, PT + 0.01) ring3_2d(S3);
        ring3_bevel(1.95, PT + 0.01, S3, FL3 + 0.1);                      // seat for the ring's flange
        cyl_y(CAM_HOLE, CAM_CONE[0] - 0.01, PT + 1, 0, LENS_Z);
        cyl_y(CAM_HOLE_REAR, max(CAM_CONE[0], CAM_TIP_Y + 1), PT + 1, 0, LENS_Z);
        translate([0, -0.01, LENS_Z]) rotate([-90, 0, 0]) cylinder(d1 = CAM_HOLE + 2*CAM_CONE[0]*tan(CAM_CONE[1]), d2 = CAM_HOLE, h = CAM_CONE[0] + 0.02);
        translate([-CAM_PCB[1], SKIRT - 0.1, CAM_TOP - 1]) cube([2*CAM_PCB[1], TONGUE_L + 0.2, 10]);
        for (j = J2) cyl_y(INS_M3_D, CH_BACK - 11, CH_BACK + 1, j[0], j[1]);
        snap_windows();
        translate([0, 0, LENS_Z]) ext_y(PT, CAM_PCB_Y) square(CAM_HOLDER + 0.8, center = true);   // the caps keep clear of the lens holder
    }
    glass_ribs();
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
// v6 (Esben 19 Oct, sketch /mnt/project-files/gen2-gennemgang/halo-gen2-v5_skitse_snaplaase-front.png):
// the light-ring slot leaves the inner plate (window + logo) hanging on the bridge at the camera only.
// v14 (Esben 21 Oct, after the v13 quick print): v6's 0.9 mm ledges held too little and would lose more to
// acetone and wear, and the outer frame was only held by the 4 front screws through the shell. Now the
// barbs catch in windows through the channel walls (the white reflector and the strip wall close them from
// the channel side, so no light gets through), 8 on the inner wall and 6 on the outer wall. Each inner arm
// runs on down past its window and ends in a 45 deg spring toe on the black edge of the display glass
// (outside the metal back), so front, display and frame hold together with no shell and no screws.
// Lock profile in (u, y): u = distance out from the wall face, away from the wall (the wall is u -1.6..0).
SNAP = true;
LK_W = 12;                                // along the wall
LK_ARM = [0.3, 2.0];                      // arm: face u (air to the wall), thickness
// window y0, y1 and barb engagement: inner windows sit lower (a longer arm), the outer ones clear the tongue (y 6-11)
LK_IN = [9.5, 12.5, 1.2];  LK_OUT = [12.5, 15.5, 1.0];
LK_TOE = [6.5, 1.0, 6, 0.2];              // inner toe: arm end y, leaf thickness, width, preload on the glass
LK_PAD = [5, 2.8, 18];                    // frame tab under the arm root: u depth (inner, outer: stays 1.2 off the shell wall), width
LK_SLOT = [1.6, 8];                       // release slot through the frame, wall side of the arm: u, width
// [face point x, z], normal pointing away from the wall
SNAPS = [for (sx = [-1, 1], z = [110, 190]) [[sx*(RING_X - CH_HALF), z], [-sx, 0]],
         for (sx = [-1, 1]) [[sx*60, RING_Z0 + CH_HALF], [0, 1]],
         for (sx = [-1, 1]) [[sx*60, RING_Z1 - CH_HALF], [0, -1]]];
SNAPS_OUT = [for (sx = [-1, 1], z = [110, 190]) [[sx*(RING_X + CH_HALF), z], [sx, 0]],
             for (sx = [-1, 1]) [[sx*75, RING_Z0 - CH_HALF], [0, -1]]];
module snap_place(s) multmatrix([[s[1][0], 0, -s[1][1], s[0][0]], [0, 1, 0, 0], [s[1][1], 0, s[1][0], s[0][1]], [0, 0, 0, 1]]) children();
// extrude a (u, y) profile along the wall, w wide, centred
module snap_ext(w) translate([0, 0, -w/2]) linear_extrude(w) children();
module snap_window(k) snap_ext(LK_W + 0.6) translate([-RIB_T - 0.2, k[0]]) square([RIB_T + 0.21, k[1] - k[0]]);
module snap_windows() if (SNAP) { for (s = SNAPS) snap_place(s) snap_window(LK_IN); for (s = SNAPS_OUT) snap_place(s) snap_window(LK_OUT); }
// barb: square catch face 0.1 short of the window's back edge, 45 deg lead-in, tip only inside the window
function lk_barb(k) = let(a0 = LK_ARM[0], e = k[2], yc = k[1] - 0.1, yt = k[0] + 0.1 + e) [[a0, yt - e - a0], [-e, yt], [-e, yc], [a0, yc]];
module snap_arm(k, toe) {
    a0 = LK_ARM[0];  a1 = a0 + LK_ARM[1];  y0 = toe ? LK_TOE[0] : lk_barb(k)[0][1];
    snap_ext(LK_W) { polygon(lk_barb(k)); translate([a0, y0]) square([LK_ARM[1], CH_BACK + 0.01 - y0]); }
    snap_ext(LK_PAD[2]) translate([-RIB_T - 0.5, CH_BACK]) square([RIB_T + 0.5 + LK_PAD[toe ? 0 : 1], FR_T]);
    if (toe) {   // 45 deg leaf from the arm end down onto the glass edge, LK_TOE[3] interference
        l = LK_TOE[0] - (GLASS_Y3 + TD10_GLASS_T - LK_TOE[3]);  h = LK_TOE[1]*sqrt(2);
        snap_ext(LK_TOE[2]) polygon([[a1 - h, LK_TOE[0] + 0.01], [a1, LK_TOE[0] + 0.01], [a1 + l, LK_TOE[0] - l], [a1 - h + l, LK_TOE[0] - l]]);
    }
}
module snap_arms() if (SNAP) { for (s = SNAPS) snap_place(s) snap_arm(LK_IN, true); for (s = SNAPS_OUT) snap_place(s) snap_arm(LK_OUT, false); }
module snap_slots() if (SNAP) for (s = concat(SNAPS, SNAPS_OUT)) snap_place(s) snap_ext(LK_SLOT[1]) translate([LK_ARM[0] - LK_SLOT[0], CH_BACK - 0.01]) square([LK_SLOT[0], FR_T + 1.02]);
function refl_r(y) = REFL[0][1] + (y - REFL[0][0])*(REFL[1][1] - REFL[0][1])/(REFL[1][0] - REFL[0][0]);
REFL_STEP = 0.5;
CAM_RIB = [9.3, 17.5, 6.5];               // ribbon slot: x start (connector edge at 9.53), width (z), depth (x)
STRIP_LEAD_X = CAM_KEEP[0] + 2.5;         // v14: 19.5 (v13: 15.5 ran into the ribbon slot on the right)
module frame3() {
    tabs = [for (sx = [-1, 1], z = DSP_TAB_Z) [sx*DSP_TAB_X, GC + z]];
    tabs2 = [for (sx = [-1, 1], i = [0, 1]) [sx*DSP_TAB_X, GC + DSP_TAB_Z[i], DSP_BOTH ? GC - DSP_TAB_Z[1 - i] : GC + DSP_TAB_Z[i]]];   // v14: both ways round (if DSP_BOTH)
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
                    // the last step runs into the floor, so the reflector is one piece with the frame (v2 left a 0.24 mm gap)
                    for (y = [REFL[0][0] : REFL_STEP : FLOOR3 - 0.01]) ext_y(y, min(y + REFL_STEP, FLOOR3) + 0.01) ring_band2d(-FL3, refl_r(min(y + REFL_STEP, FLOOR3)));
                    ext_y(REFL[0][0], CH_BACK + 0.01) ring_band2d(STRIP_T3[1], FL3);
                    ext_y(FLOOR3, CH_BACK + 0.01) ring_band2d(-FL3, FL3);
                }
                ext_y(0, CH_BACK + 1) { glass_keep2d(); cam_keep2d(); }
                for (c = CLIPS3) translate([c[0]*(CAM_KEEP[0] + c[2][0]/2), c[1], RING_Z1 + STRIP_T3[1] - c[2][2]/2 - 0.2])
                    cube([c[2][0] + 1, c[2][1] + 0.6, c[2][2] + 0.4], center = true);       // room for the clips
            }
            // cross bars at the display tabs, with bosses down to the tabs
            // they stop 0.4 short of the front's channel wall, but behind it (CH_BACK on) they run 1 mm into the frame ring:
            // in v2 they were loose pieces in the print
            for (z = DSP_XB_Z) ext_y(XB3_Y, FR_BACK) translate([0, GC + z]) square([2*(RING_X - CH_HALF - 0.4), 16], center = true);
            for (z = DSP_XB_Z) ext_y(CH_BACK, FR_BACK) translate([0, GC + z]) square([2*(RING_X - CH_HALF + 1), 16], center = true);
            for (t = tabs2) hull() for (z = [t[1], t[2]]) cyl_y(7, TAB_Y - PRELOAD, XB3_Y + 0.01, t[0], z);
            // tubes that press the camera board onto its pegs
            for (h = CAM_HOLES_ROT) cyl_y(4.6, CAM_PCB_Y + CAM_PCB[2], CH_BACK + 0.01, h[0], LENS_Z + h[1]);
            snap_arms();
        }
        snap_slots();
        for (t = tabs2) {
            hull() for (z = [t[1], t[2]], dz = DSP_BOTH ? [-0.4, 0.4] : [-2.4, 2.4], dx = [-DSP_SLOT_X, DSP_SLOT_X]) cyl_y(2.9, TAB_Y - 1, FR_BACK + 1, t[0] + dx, z + dz);
            hull() for (z = [t[1], t[2]], dz = DSP_BOTH ? [0] : [-2.4, 2.4], dx = [-DSP_SLOT_X, DSP_SLOT_X]) cyl_y(5.6, TAB_Y + 2.0, FR_BACK + 1, t[0] + dx, z + dz);   // head 2 mm above the tab
        }
        for (h = CAM_HOLES_ROT) cyl_y(2.4, CAM_PCB_Y, CAM_PCB_Y + CAM_PCB[2] + 2, h[0], LENS_Z + h[1]);
        // camera ribbon (16 mm wide, does not like sharp folds): it leaves the connector sideways (+x),
        // takes one gentle 90 deg bend backwards and passes the frame here to the open space behind it
        translate([CAM_RIB[0], CAM_PCB_Y + CAM_PCB[2] + 0.5, LENS_Z - CAM_RIB[1]/2]) cube([CAM_RIB[2], FR_BACK, CAM_RIB[1]]);
        for (j = J2) cyl_y(M3_CLR, CH_BACK - 1, FR_BACK + 1, j[0], j[1]);
        for (sx = [-1, 1]) cyl_y(4, CH_BACK - 1, FR_BACK + 1, sx*STRIP_LEAD_X, RING_Z1 + 4);   // strip leads, straight out of the clips
    }
}
// 90 deg countersink, wide end (d1) at y0, narrowing towards -y to d2: for a screw driven in from the back
module csk_y(d1, d2, y0, x, z) translate([x, y0 + 0.01, z]) rotate([90, 0, 0]) cylinder(d1 = d1, d2 = d2, h = (d1 - d2)/2 + 0.01, $fn = 32);
module strip_cut2d(s) translate([-s[4], RING_Z1 - CAM_KEEP[1]]) square([s[4] + s[5], 2*CAM_KEEP[1]]);
module placed_strips3(kind) for (s = STRIPS3) if (s[2] == kind)
    ext_y(s[0], s[1]) difference() { ring_band2d(STRIP_T3[1] - s[3], STRIP_T3[1]); strip_cut2d(s); }
// clip connectors on the strip ends (on the top run, next to the camera); cable leaves towards the camera
module placed_clips3() for (c = CLIPS3)
    translate([c[0]*(CAM_KEEP[0] + c[2][0]/2), c[1], RING_Z1 + STRIP_T3[1] - c[2][2]/2]) cube([c[2][0], c[2][1], c[2][2]], center = true);
module td2_10() {   // glass front face at y = 0, centred on x = 0, z = 0
    color([0.04, 0.04, 0.05]) hull() for (sx = [-1, 1], sz = [-1, 1])
        translate([sx*(TD10_GLASS[0]/2 - 5), 0, sz*(TD10_GLASS[1]/2 - 5)]) rotate([-90, 0, 0]) cylinder(r = 5, h = DSP_PANEL, $fn = 24);
    color([0.12, 0.3, 0.55]) translate([-TD10_VIEW[0]/2, -0.05, -TD10_VIEW[1]/2]) cube([TD10_VIEW[0], 0.05, TD10_VIEW[1]]);
    color([0.6, 0.6, 0.63]) for (sx = [-1, 1], z = DSP_TAB_Z) translate([sx*DSP_TAB_X - DSP_TAB3[0]/2, DSP_PANEL - 0.01, z - DSP_TAB3[1]/2]) cube([DSP_TAB3[0], DSP_TAB3[2], DSP_TAB3[1]]);
    color([0.6, 0.6, 0.63]) for (sx = [-1, 1], sz = [-1, 1]) cyl_y(DSP_SO[0], DSP_PANEL - 0.01, DSP_PANEL + DSP_SO[1], sx*24.5, DSP_PI_DZ + sz*29);
    color([0.1, 0.45, 0.2]) translate([-20, DSP_PANEL, DSP_PI_DZ - 20]) cube([40, 2, 50]);       // [M] adapter board
}
module placed_display3() translate([0, GLASS_Y3, GC]) td2_10();
module placed_pi3() translate([0, PI_Y3, GC + DSP_PI_DZ]) rpi5();
// the shell gives way round the 4 front screw bosses (they sit in the outer wall)
module shell3(top = UNIT_TOP) {
    difference() {
        union() {
            difference() { shell2(top); for (j = JOINTS) cyl_y(POST_D + 0.5, XB3_Y - 0.1, D - BACK_T + 0.02, j[0], j[1]); }
            for (j = JOINTS) cyl_y(M3_HEAD_CB + 1, D - BACK_T - 0.01, D, j[0], j[1]);   // close v1's screw holes (Ø6.4) in the back wall: no screw there since v2
            for (j = J2) cyl_y(POST_D, FR_BACK, D - BACK_T + 0.01, j[0], j[1]);
            power_holders();
        }
        for (j = J2) { cyl_y(7.0, SKIRT - 1, FR_BACK + 0.01, j[0], j[1]); cyl_y(M3_CLR, FR_BACK - 1, D + 1, j[0], j[1]); cyl_y(M3_HEAD_CB, FR_BACK + 2, D + 1, j[0], j[1]); csk_y(M3_HEAD_CB, M3_CLR, FR_BACK + 2, j[0], j[1]); }
        lock_cut();   // v10: the lock sits over a closed v1 screw hole now; keep its slot open
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
if (VIEW == "c_mics")      translate([-MSTRIP[0]/2, (MIC_FLOOR ? MSTRIP_Y : MIC_Y) - MSTRIP[1]/2, MIC_FLOOR ? WALL - MIC_POCKET[2] + MIC_RING[2] : H - WALL - MSTRIP[2] - 0.2]) cube(MSTRIP);
if (VIEW == "c_reed")      { back_part(REED_P, REED, "red"); translate([LOCK_X, LOCK_SY, LOCK_TZ[1] - 3]) cylinder(d = 8, h = 3, $fn = 24); }
if (VIEW == "c_speaker")   speaker3();
if (VIEW == "c_jack")      power_inlet();
if (VIEW == "c_cap")       translate([IF_CABLE[0], IF_CABLE[1], 0]) cable_cap();
// screws: 4 front (3.0 x 14 thread-forming, heads in the back wall), 4 camera (M2 x 6), 1 lock (4 x 25 Torx pin)
if (VIEW == "s_front")     for (j = JOINTS) screw_y(3, 14, [5.6, 2], j[0], RIB_TOP + RAIL_T + 8, j[1], -1);
if (VIEW == "s_camera")    for (h = CAM_HOLES_ROT) screw_y(2, 6, [3.8, 1.3], h[0], CAM_PCB_Y + CAM_PCB[2], LENS_Z + h[1], -1);
if (VIEW == "s_lock")      translate([LOCK_X, LOCK_SY, LOCK_HEAD[1]]) { cylinder(d1 = 8.1, d2 = 4.2, h = 1.95, $fn = 24); cylinder(d = 4.2, h = 25, $fn = 16); }
if (VIEW == "x_core")      { placed_pi(); placed_power(); }
if (VIEW == "x_elec")      { placed_electronics(); placed_services(); }
if (VIEW == "x_cap")       cable_cap();
if (VIEW == "x_cleat")     wall_cleat2();
if (VIEW == "x_stand")     stand_bracket();
if (VIEW == "x_stand_logo_w") st_logo("white");
if (VIEW == "x_stand_logo_g") st_logo("green");
if (VIEW == "x_tnut")      translate([ST_NUT[0], ST_NUT[1], -ST_SHELF[2]]) { cyl_z(TNUT[0], 0, TNUT[1] + 1.5, 0, 0); cyl_z(TNUT[2] - 0.5, TNUT[1], TNUT[1] + 1.5, 0, 0); }
if (VIEW == "x_shell_all") shell2();
if (VIEW == "x_mod_shell") mod_shell();
if (VIEW == "x_lid")       lid(0);
if (VIEW == "x_lid_open")  lid(100);
if (VIEW == "x_printers")  for (y = PRN_Y) translate([0, y, 3 + 10]) instax_wide();
if (VIEW == "x_photo")     translate([-FILM_W[0]/2, PRN_Y[0] + INW[1]/2 - 0.6, -60]) cube([FILM_W[0], 1.2, 70]);


// v2c meshes
if (VIEW == "x_front3")    front3();
if (VIEW == "x_logo_w")    logo_inlay("white");
if (VIEW == "x_logo_g")    logo_inlay("green");
if (VIEW == "x_ring3")     ring3();
if (VIEW == "x_frame3")    frame3();
if (VIEW == "x_strip_w")   placed_strips3("w");
if (VIEW == "x_strip_rgb") placed_strips3("rgb");
if (VIEW == "x_display3")  placed_display3();
// v12: the foam tape in the lip groove, squeezed to the groove depth (for the 3D viewer)
if (VIEW == "x_tape3")     ext_y(GLASS_Y3 - GROOVE3[1], GLASS_Y3) difference() { groove3_2d(LAND3 + GROOVE3[0] - 0.1); groove3_2d(LAND3 + 0.1); }
if (VIEW == "c_pi3")       placed_pi3();
// the display and the Pi in their own materials for the 3D viewer: glass with its black border,
// the active picture, the metal back; the Pi board and the Active Cooler
if (VIEW == "x_dsp_glass")  translate([0, GLASS_Y3, GC]) hull() for (sx = [-1, 1], sz = [-1, 1])
        translate([sx*(TD10_GLASS[0]/2 - 5), 0, sz*(TD10_GLASS[1]/2 - 5)]) rotate([-90, 0, 0]) cylinder(r = 5, h = 1.1, $fn = 24);
if (VIEW == "x_dsp_active") translate([-135.4/2, GLASS_Y3 - 0.06, GC - 216.6/2]) cube([135.4, 0.05, 216.6]);
if (VIEW == "x_dsp_back")   translate([0, GLASS_Y3, GC]) {
    translate([-TD10_GLASS[0]/2 + 3, 1.1, -TD10_GLASS[1]/2 + 3]) cube([TD10_GLASS[0] - 6, DSP_PANEL - 1.1, TD10_GLASS[1] - 6]);
    for (sx = [-1, 1], z = DSP_TAB_Z) translate([sx*DSP_TAB_X - DSP_TAB3[0]/2, DSP_PANEL - 0.01, z - DSP_TAB3[1]/2]) cube([DSP_TAB3[0], DSP_TAB3[2], DSP_TAB3[1]]);
    for (sx = [-1, 1], sz = [-1, 1]) cyl_y(DSP_SO[0], DSP_PANEL - 0.01, DSP_PANEL + DSP_SO[1], sx*24.5, DSP_PI_DZ + sz*29);
    translate([-20, DSP_PANEL, DSP_PI_DZ - 20]) cube([40, 2, 50]);
}
if (VIEW == "c_pi_board")   translate([0, PI_Y3, GC + DSP_PI_DZ]) {
    difference() {
        translate([-PI_W/2, 0, -29 - 23.5]) cube([PI_W, PI_T, PI_L]);
        for (sx = [-1, 1], sz = [-1, 1]) translate([sx*24.5, -1, sz*29]) rotate([-90, 0, 0]) cylinder(d = PI_HOLE, h = 4, $fn = 16);
    }
    translate([-PI_W/2 + 1.5, PI_T, -29 - 23.5 - 2.5]) cube([PI_W - 3, PI_PORT_H, 21]);
}
if (VIEW == "c_cooler")     translate([0, PI_Y3, GC + DSP_PI_DZ]) difference() {     // Active Cooler with its fan
    translate([-PI_COOLER[1]/2, PI_T, -PI_COOLER[0]/2 + 8]) cube([PI_COOLER[1], PI_COOLER[2], PI_COOLER[0]]);
    translate([0, PI_T + PI_COOLER[2] - 2, 8 + 6]) rotate([-90, 0, 0]) cylinder(d = 34, h = 3, $fn = 48);
}
if (VIEW == "c_fan")        translate([0, PI_Y3, GC + DSP_PI_DZ]) translate([0, PI_T + PI_COOLER[2] - 2, 8 + 6]) rotate([-90, 0, 0]) {
    cylinder(d = 12, h = 1.8, $fn = 32);
    for (a = [0:30:330]) rotate([0, 0, a]) translate([6, -1, 0]) cube([10.5, 2, 1.6]);
}
if (VIEW == "c_psu5")      translate([PSU5_P[0], D - BACK_T - 1.2 - PSU5[2], PSU5_P[1]]) cube([PSU5[0], PSU5[2], PSU5[1]]);
if (VIEW == "c_wled")      translate([WLED_P[0], D - BACK_T - 1.2 - WLED[2], WLED_P[1]]) cube([WLED[0], WLED[2], WLED[1]]);
if (VIEW == "c_mosfet")    translate([-(HW - WALL) + 1.2, MOSF_P[0], MOSF_P[1]]) cube([MOSF[2], MOSF[1], MOSF[0]]);
if (VIEW == "x_shell3")    shell3();
if (VIEW == "s_front3")    for (j = J2) screw_y(3, 15, [6, 2.3], j[0], FR_BACK + 2, j[1], -1);
if (VIEW == "s_display")   for (sx = [-1, 1], z = DSP_TAB_Z) screw_y(2.5, 5, [4.5, 1.8], sx*DSP_TAB_X, TAB_Y + 2.0, GC + z, -1);
if (VIEW == "p_front3")    rotate([90, 0, 0]) front3();                                   // face down
if (VIEW == "p_ring3")     translate([0, 0, -RING_Y[0]]) rotate([90, 0, 0]) ring3();     // face down
if (VIEW == "p_frame3")    translate([0, 0, FR_BACK]) rotate([-90, 0, 0]) frame3();      // flat back down
if (VIEW == "info3") echo(J2 = J2, GLASS_Y3 = GLASS_Y3, TAB_Y = TAB_Y, PI_Y3 = PI_Y3, CAM_END = CAM_END, CH_BACK = CH_BACK, FR_BACK = CH_BACK + FR_T, CAM_PCB_Y = CAM_PCB_Y);

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
// stand bracket: back face down (logo in the first layers), the shelf stands up
if (VIEW == "p_stand")        translate([0, 0, D + GAP_WALL]) rotate([-90, 0, 0]) stand_bracket();
if (VIEW == "p_stand_logo_w") translate([0, 0, D + GAP_WALL]) rotate([-90, 0, 0]) st_logo("white");
if (VIEW == "p_stand_logo_g") translate([0, 0, D + GAP_WALL]) rotate([-90, 0, 0]) st_logo("green");
if (VIEW == "p_cap")      cable_cap();                                                  // outer face down
if (VIEW == "p_shell3")   translate([0, -H/2, D]) rotate([-90, 0, 0]) shell3();          // back down, centred (as the released skal.stl)
if (VIEW == "main") main_unit();
if (VIEW == "module") module_body();
if (VIEW == "module_open") { color(C_BODY) printer_module(open = 100); for (y = PRN_Y) translate([0, y, 3 + 10]) instax_wide(); }
if (VIEW == "pair") { translate([0, 0, HP]) main_unit(); module_body(); placed_printers(); }
if (VIEW == "pair_xray") { translate([0, 0, HP]) main_unit(); %module_body(); placed_printers(); }
if (VIEW == "info") echo(W = W, H = H, R = R, BORDER = BORDER, RUN_V = RUN_V, RUN_H = RUN_H, RUN_T = RUN_T, JOINTS = JOINTS, WING_P = WING_P, HP = HP);
if (VIEW == "c_clips")     placed_clips3();
