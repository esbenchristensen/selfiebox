// ============================================================================
//  SELFIEBOX HALO gen 2: the main unit, 224.5 x 307 x 70 (room for 4G and a mic array).
//  No printer under the box (Esben 22 Oct): the printer stands on its own (selfi_printer_v*.scad).
//
//  1:1 concentric outline (Halo rule 1-3, see the "Apples designprincipper"
//  doc): one master curve, the light ring's centre line with continuous-
//  curvature corners, and every outline of the face is an exact offset of it.
//  The border from box edge to light ring is the same 7.8 mm on all sides.
//
//  Fastening without visible screws: the 4 side screws of rev G are gone. Four 3.0 mm
//  thread-forming screws from the back, in the 4 corners, run through shell posts and the
//  frame into bosses in the front (J2). Theme parts hook into closed pockets in the back
//  wall (v21). No inserts. v20: one removable seal everywhere (silicone
//  sponge cord Ø1.5 in 2 mm grooves) and a small camera window, see "v20 sealing" below.
//  Print files: VIEW="p_<part>"; released sets live in hardware/stl/gen2/<version>/.
//  3D viewer and checks: hardware/render/gen2_viewer.py, hardware/tools/check_fit_gen2.py
// ============================================================================
include <halo.scad>
include <logo_selfi.scad>

D       = 70;          // gen 2 depth (v1-v4: 85, rev G: 66). Set by the 5 V PSU (25 mm) behind the frame (31.7) + 9 mm air
BOTTOM  = "none";
PART    = "none";
VIEW    = "main";      // "main" | "x_..." / "c_..." / "p_..." single meshes

// ------------------------------------------------- concentric outline -----
SQ_A = 26;  SQ_N = 3;                       // corner: superellipse quadrant, extent and exponent
MASTER = [2*RING_X, RING_Z1 - RING_Z0];     // light-ring centre line, 188.9 x 272.4
BORDER = RING_Z0 - RING_FACE/2;             // 7.8: box edge -> light ring, all four sides
// (overrides of halo.scad values are evaluated where halo first assigns them: literals or earlier names only)
RING_R = 26;                                // = SQ_A: straight light runs end where the corners start
W = 2*RING_X + RING_FACE + 2*(RING_Z0 - RING_FACE/2);   // 224.5 since v20 (222.5 before)
R = 42.8;                                   // = SQ_A + RING_FACE/2 + BORDER: where the box's straight faces begin
// v20 (Esben 23 Oct, sketch /mnt/project-files/gen2-gennemgang/halo-gen2-v20_skitse_taetning-v2.png): the light channel is
// 1 mm wider each side (diffuser flange room 1.2 -> 2.2) so a seal cord fits beside the ring; the visible ring stays 14.
// The chin gives the 1 mm back at the bottom, so the border stays 7.8 all round: the box is 224.5 x 307 (v19: 222.5 x 306).
DIFF_FLANGE = 2.2;  CHIN = 6;  H = RING_Z1 + RING_Z0;
CLEAT_ZC = 274;                             // as v5-v19 (306 - 32): the wall cleat and its lock tongue stay exactly as they are
BLOCK_Z = [];                               // no side screws
// fewer loose parts: no VESA or tripod inserts, no lock screw inside, and every former M3 insert
// becomes a pilot hole for a 3.0 mm thread-forming plastic screw (e.g. WN 1452 K30)
VESA_ON = false;  TRIPOD_ON = false;  LOCK_INSIDE = false;  DC_PANEL = false;  REVG_BACK = false;  REVG_CABLE = false;   // rev G's back-wall slots (3 mm, behind the mic core), recessed band and label recess had no use
INS_M3 = [2.4, 12];                          // pilot for the 3.0 x 15 SPUN+ front screws (core 1.8, ITW datasheet)
// no glow band (Esben 19 Oct): the shell is one print in one colour; only the front ring lights
GLOW = false;
// underside services at y = D/2 + 11.5 (85 deep: 54). Written out, not via a new variable: these override
// halo.scad's values, and OpenSCAD evaluates an override where the first assignment stands.
IF_SCREW = [];  IF_DOWEL = [[-18, 60], [18, 60]];  IF_CABLE = [-20, 38];  IF_CABLE_D = 0;   // v11: the power column has the middle, the dowels step aside
// v19 (Esben 22 Oct): no printer under the box. The cable hole (IF_CABLE_D 0), its cap and the module's 2 screw
// pilots (IF_SCREW was ±70) are gone; the dowel holes stay for the floor stand bracket.
VENT_X = [];                                // rev G's four slots give way to the vent fields below
UNIT_TOP = "closed";
POWER_REVG = false;  CLIPS = [];   // v23: halo's cable-tie loops replaced by cable_loops() (see "cable routing"); until v22 [[-75, 90], [0, 110], [-98, 205], [88, 100]];   // v11: cable-tie loops moved clear of the upright PSU and the speaker; v21: [-98, 175] -> 205, clear of the wing pocket                         // v2: Mean Well RSD-60G-5, WLED controller and MOSFET in their own holders                        // nothing stacks on top in gen 2: no holes where the rain falls
// camera (Esben 19 Oct, Wide chosen). v20 (Esben 23 Oct): a small glass window in front of the lens. The glass lies in a
// pocket behind a 0.6 lip; the lens tip sits 0.6 behind the glass (v19: tip 0.3 behind the open face, so the camera moves 2.4 back)
CAM_TIP_Y = 3.1;   // v24 (Esben 26 Oct: the Camera Module 3 lens moves to focus and must touch nothing): 1.0 mm air to the glass (v20-v23: 0.6)

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

// ---------------------------------------------- hidden front fastening ----
// 4 points on the ring's centre line, at the 45 degree point of each corner (the front screws J2 sit J_R further out)
J_U = SQ_A * pow(0.5, 1/SQ_N);
JOINTS = [for (sx = [-1, 1], sz = [-1, 1]) [sx*(RING_X - SQ_A + J_U), (RING_Z0 + RING_Z1)/2 + sz*(MASTER[1]/2 - SQ_A + J_U)]];
POST_D = 9;

// ------------------------------------------------------------- light ring ----
// The channel round the screen: ring_band2d(a, b) = the band between offsets a and b of the ring's centre line.
CH_IN = SLOT_W/2 + DIFF_FLANGE;           // 8.2: cavity half-width
module ring_centre2d() translate([0, (RING_Z0 + RING_Z1)/2]) sq2d(MASTER[0], MASTER[1]);
module ring_band2d(a, b) difference() { offset(r = b) ring_centre2d(); offset(r = a) ring_centre2d(); }
// v14: the glass corners are R5 (RP-010276 drawing; v2-v13 used R3 + 1.2, which cut the inner wall open at the
// bottom corners). Real corners leave 0.24 mm to the wall there, so the keep-out only shaves the wall locally.
DSP_R = 5;  KEEP_C = 0.5;
module glass_keep2d() translate([VIEW_X, GC]) offset(r = DSP_R + KEEP_C) square([GW - 2*DSP_R, GH - 2*DSP_R], center = true);
// theme wings: hook slots in the back wall (hidden against the wall)
WING_POCKET = true;                       // v21: each slot opens into a closed pocket (see v20 sealing, 7)
// v21: the lower pair moves up from RING_Z0 + 50 (57.7) to 175: its closed pocket (below) would hit the MOSFET board and the
// reed switch low on the left, and the speaker (z 128-159) leaves no room between them. The upper pair (249.3) also carries a theme top: its back plate hooks in like a wing.
WING_P = [for (sx = [-1, 1], z = [WING_POCKET ? 175 : RING_Z0 + 50, RING_Z1 - 50]) [sx*(W/2 - 12), z]];
module shell2(top = UNIT_TOP) {
    difference() {
        shell(top);   // v21: v1's 4 screw posts at JOINTS (no screw there since v2) and the plug over rev G's cable hole are gone
        lock_cut();
        services_cut();
        mic_floor_cut();
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
MIC_Y = 18.0;                             // mic line, y (v9: 0.7 back, so the board centred on its holes keeps 0.8 to the front)
MIC_POCKET = [MSTRIP[0] + 0.6, MSTRIP[1] + 0.6, 1.8];   // recess in the floor: x, y, depth (floor 1.2 under it)
MIC_PEG = [3.0, 31.25, -0.68, 5.4];       // peg Ø, |x|, y offset from the mic line (holes and board centre sit 0.68 in front of the ports), top z (v20: 6.4 -> 5.4, the channel wall is 1 mm lower)
MSTRIP_Y = MIC_Y + MIC_PEG[2];            // v9: board centre line = hole line (v8 centred the board on the ports)
MIC_FPC = [-0.68, 15, 1.0];               // FPC notch in the pocket's back wall: centre x, width, floor height above the pocket floor
DRIP = [8.2, 2, 1];                       // drip groove: y start, width, depth
REED = [32, 19, 7];                         // w (x), h (z), thickness (y); REED_P just above the lock
module back_part(p, sz, c) color(c) translate([p[0], D - BACK_T - 1.2 - sz[2], p[1]]) cube([sz[0], sz[2], sz[1]]);
module placed_electronics() {
    back_part(HAT4G_P, HAT4G, [0.1, 0.3, 0.6]);
    back_part(MCORE_P, MCORE, [0.15, 0.15, 0.15]);
    back_part(IMU_P, IMU, [0.1, 0.1, 0.4]);
    color([0.15, 0.15, 0.15]) translate([-MSTRIP[0]/2, MSTRIP_Y - MSTRIP[1]/2, WALL - MIC_POCKET[2] + MIC_RING[2]]) cube(MSTRIP);
    back_part(REED_P, REED, [0.1, 0.3, 0.6]);
}
// snap trays, no screws; the mic strip sits on two pegs in its floor pocket
module electronics_holders() {
    for (q = [[HAT4G_P, HAT4G], [IMU_P, IMU]])
        translate([q[0][0], D - BACK_T + 0.01, q[0][1]]) rotate([90, 0, 0]) cradle2([q[1][0], q[1][1], q[1][2]], BOARD_LIP);
    difference() {   // v9: the bottom lip opens 20 mm for the FPC socket (17.5 long, 2 over the edge)
        translate([MCORE_P[0], D - BACK_T + 0.01, MCORE_P[1]]) rotate([90, 0, 0]) cradle2(MCORE, BOARD_LIP);
        translate([MCORE_P[0] + MCORE[0]/2 - 10, D - BACK_T - MCORE[2] - 3, MCORE_P[1] - 3]) cube([20, MCORE[2] + 2.2, 5]);
    }
    for (sx = [-1, 1]) cyl_z(MIC_PEG[0], WALL - MIC_POCKET[2] - 0.01, MIC_PEG[3], sx*MIC_PEG[1], MSTRIP_Y);   // v9: up to 0.6 under the front, so the board cannot lift off
    // reed module tray just above the lock tongue (reed glass at the bottom edge): lifting the box off the cleat moves the magnet away
    translate([REED_P[0], D - BACK_T + 0.01, REED_P[1]]) rotate([90, 0, 0]) cradle2([REED[0], REED[1], REED[2]], BOARD_LIP);
}

// ------------------------------------------------------------ wall lock ----
// The cleat grows a tongue that enters a slot low in the back wall. One security screw
// (Torx with pin, 4 x 25, thread-forming for plastics) goes up through the bottom into the
// tongue; its countersunk head sits flush in the underside. The box cannot be lifted off without
// the special bit, and the front screws stay behind the box.
// Lifting force on the tongue: 18 x 18 section, 19 mm lever to the plate.
// v24 (Esben 26 Oct, first assembly): the tongue stood 10 mm above the floor boss (room to drop the box straight down onto the
// cleat), so the security screw pulled the box up towards the tongue and off the cleat. The box must sit rock solid, not 1 mm of
// play. Now the tongue goes down to 0.3 above the boss: the screw pulls the box up those 0.3 and the boss then stands on the
// tongue, so the box is clamped between the cleat's hook and the screw. To hang it: hook the top on the cleat with the bottom
// held out, then swing the bottom in (the tongue enters level, at its final height). The slot is 0.2 wider than the tongue
// each side (v10-v23: 0.6) with a 1 mm lead-in, and the tongue's lower front edge is chamfered.
LOCK_BOSS = [15, 8];                                // floor boss under the head: dia, top z
LOCK_X = -82;  LOCK_W = 18;  LOCK_TZ = [LOCK_BOSS[1] + 0.3, 36];  LOCK_Y = D - 15;  DROP = CLEAT_D;   // v10: x -56 -> -82, room for the power column; v24: bottom 18 -> 8.3
LOCK_C = [0.2, 1.0, 2.0];                           // v24: slot clearance per side, lead-in chamfer, tongue nose chamfer
LOCK_SY = (LOCK_Y + D - BACK_T)/2;                  // screw axis, y
REED_P = [LOCK_X - REED[0]/2, LOCK_TZ[1] + 4];      // reed module tray, bottom-left on the back wall
LOCK_HEAD = [8.6, 0.3];                             // [A] Bolte 88115 = DIN 7982 ST4.2 countersunk (head Ø8.1, ISO 14586 max 8.4), 90°; head 0.3 below the bottom
module lock_cut() {
    c = LOCK_C[0];  e = LOCK_C[1];
    translate([LOCK_X - LOCK_W/2 - c, D - BACK_T - 1, LOCK_TZ[0] - 0.4]) cube([LOCK_W + 2*c, BACK_T + 2, LOCK_TZ[1] - LOCK_TZ[0] + 1.0]);
    hull() {   // lead-in round the slot's mouth
        translate([LOCK_X - LOCK_W/2 - c, D - 0.01, LOCK_TZ[0] - 0.4]) cube([LOCK_W + 2*c, 0.02, LOCK_TZ[1] - LOCK_TZ[0] + 1.0]);
        translate([LOCK_X - LOCK_W/2 - c - e, D + 0.01, LOCK_TZ[0] - 0.4 - e]) cube([LOCK_W + 2*c + 2*e, 0.02, LOCK_TZ[1] - LOCK_TZ[0] + 1.0 + 2*e]);
    }
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
        lock_nose_cut();
    }
}
// v24: 45 deg chamfer on the tongue's lower front edge, so it rides over the boss's edge when the box swings in
module lock_nose_cut() translate([LOCK_X - LOCK_W/2 - 1, LOCK_Y, LOCK_TZ[0]]) rotate([90, 0, 90]) linear_extrude(LOCK_W + 2)
    polygon([[-0.01, -0.01], [LOCK_C[2], -0.01], [-0.01, LOCK_C[2]]]);

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
ST_PANEL = [180, 58, 8, 17];        // logo panel: width, height, corner r, gap to the unit's top. v20+ unit is 307 high: bracket 304 (H2C bed 306); 180 wide keeps 4.9 mm to the theme top's straps (|x| >= 94.9)
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
        lock_nose_cut();
        cyl_z(TNUT[0] + 0.3, zs - 1, 1, ST_NUT[0], ST_NUT[1]);                  // T-nut barrel, flush with the underside
        cyl_z(TNUT[2], zs + TNUT[1], 1, ST_NUT[0], ST_NUT[1]);                   // flange seat; the unit closes it
        translate([-ST_SLOT[0], ST_SLOT[1], zs - 1]) cube([2*ST_SLOT[0], yb - ST_SLOT[1] + 0.01, ST_SHELF[2] + 2]);   // power plug
        translate([0, ST_SLOT[1], zs - 1]) cylinder(r = ST_SLOT[0], h = ST_SHELF[2] + 2, $fn = 32);
        ext_y(yf - LOGO_D, yf + 1) translate([0, ST_LOGO_Z]) st_logo2d("all");   // pocket for the inlay
    }
}

// ------------------------------------------------------------------ weather ----
// Rain, sleet and spills from any side under a light roof. Until v19 with no added parts (Esben 19 Oct: no gaskets,
// membranes, glass or glue); v20 (Esben 23 Oct) adds one removable seal cord in every joint and a small camera
// window (see "v20 sealing"). Every opening is still shaped so water runs back out.
// Front to shell (v21, Esben 23 Oct): no cord here any more (v20 had one, and it showed through the 0.2 mm joint gap).
// The two faces now meet with no gap; a rib on the front's skirt enters a groove in the shell's front face, as in v19.
// Water that passes the butt joint meets the rib, runs round the groove and leaves through two drain notches in the
// underside. Behind it the front's 5 mm tongue still overlaps the shell wall. The faces are the hard stop, so the
// 4 screws clamp the white frame through small crush bumps on the shell posts (CRUSH), which take up the print tolerance.
JR = [1.0, 1.4, 1.4, 0.8, 1.0];         // groove: from outside, width, depth; rib: width, height (v19: rib 0.6 wide)
DRAIN_X = [-60, 60];
module lip_ring(a, b) difference() { translate([0, a]) rr(W - 2*a, H - 2*a, R - a); translate([0, b]) rr(W - 2*b, H - 2*b, R - b); }
module joint_groove() {
    ext_y(SKIRT - 0.01, SKIRT + JR[2]) lip_ring(JR[0], JR[0] + JR[1]);
    for (x = DRAIN_X) translate([x - 0.8, SKIRT - 0.01, -0.01]) cube([1.6, JR[2] + 0.01, JR[0] + JR[1] - 0.2]);
}
module joint_rib() { c = JR[0] + (JR[1] - JR[3])/2;  ext_y(SKIRT - 0.01, SKIRT + JR[4]) lip_ring(c, c + JR[3]); }
// camera: a printed sleeve round the lens holder, from the front to just short of the camera board. Since v20 a small
// glass sits in front of the lens (see v20 sealing, 4); the sleeve still keeps the camera bay apart from the channel.
// v24: the bay is 0.8 wider than the lens holder each side (v20-v23: 0.4), so the board always lies flat on its 4 bosses
CAM_BAY = CAM_HOLDER + 1.6;
module cam_shroud() translate([0, 0, LENS_Z]) difference() {
    ext_y(PT - 0.01, CAM_PCB_Y - 0.6) square(CAM_BAY + 2.4, center = true);
    ext_y(PT - 1, CAM_PCB_Y) square(CAM_BAY, center = true);
}
// mic ports: Ø1.0 through the floor (v8); over each a printed crush ring presses on the strip round the
// mic's port, so the port is a closed air pocket that water cannot push into.
MIC_PORT = 1.0;  MIC_RING = [1.8, 3.6, 0.45];
module mic_floor_cut() {
    translate([-MIC_POCKET[0]/2, MSTRIP_Y - MIC_POCKET[1]/2, WALL - MIC_POCKET[2]]) cube([MIC_POCKET[0], MIC_POCKET[1], MIC_POCKET[2] + 1]);
    translate([MIC_FPC[0] - MIC_FPC[1]/2, MSTRIP_Y, WALL - MIC_POCKET[2] + MIC_FPC[2]]) cube([MIC_FPC[1], MIC_POCKET[1]/2 + 2, MIC_POCKET[2] + 1]);   // v9: FPC lies flat out of the back
    for (x = MIC_HOLES) cyl_z(MIC_PORT, -1, WALL - MIC_POCKET[2] + 0.01, x, MIC_Y);
    translate([-(W/2 - R - 4), DRIP[0], -1]) cube([W - 2*R - 8, DRIP[1], DRIP[2] + 1]);   // ends 4 mm inside the flat floor
}
module mic_rings() for (x = MIC_HOLES) translate([x, MIC_Y, WALL - MIC_POCKET[2] - 0.01]) difference() {
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
// Air: in and out through two slot fields in the underside (no drinks get in from below). The back louvres
// were closed in v7 (Esben 19 Oct): the box cools through its walls, about as if it were sealed.
// Every opening is 2.5 mm wide: no fingers, and a poked wire meets only 12 V parts.
VENT_SL = [2.5, 28];  VENT_XS = [for (i = [0:6]) 30 + 5*i];   // underside: 2 x 7 slots, 7.5 cm2 (85 deep: 9.8)
function vent_xs(sx) = VENT_XS;
// 70 deep, the hoods sit between the frame (y 31.7, it reaches down to z 7) and the back wall. The left
// field had shorter slots until v10 (lock boss, then the power column); in v11 both run full length: [left, right] slot length.
VENT_Y0 = 33.5;  VENT_L = [D - BACK_T - 1.5 - 4 - VENT_Y0, D - BACK_T - 1.5 - 4 - VENT_Y0];
function vent_l(sx) = VENT_L[sx > 0 ? 1 : 0];
function vent_y(sx) = VENT_Y0 + 2 + vent_l(sx)/2;
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
module services_cut() {
    bottom_vents();
    // power: plug hole in the underside (0.8 chamfer), and the speaker grille
    translate([PWR_P[0], PWR_P[1], 0]) teardrop_z(PWR_BORE, -1, WALL + 1);
    translate([PWR_P[0], PWR_P[1], -0.01]) cylinder(d1 = PWR_BORE + 1.6, d2 = PWR_BORE, h = 0.8, $fn = 48);
    for (h = spk_holes()) cyl_y(2, D - BACK_T - 1, D + 1, SPK_P[0] + h[0], SPK_P[1] + h[1]);
    ext_y(D - BACK_T - 0.01, D - BACK_T + SEAL[2]) translate([SPK_P[0], SPK_P[1]]) spk_seal2d(SEAL[1]/2);   // v20: seal round the grille
    cyl_z(2, -1, 12, LOCK_DRAIN[0], LOCK_DRAIN[1]);   // v20: drain out of the lock pocket; v21: up to z 12 (the rounded bottom makes the floor ~6 thick here, so v20 stopped at 4, blind)
}
function spk_holes() = [for (i = [-6:6], j = [-5:5]) let(x = 3.5*i + (j % 2 ? 1.75 : 0), z = 3.03*j) if (pow(x/17.5, 2) + pow(z/11.8, 2) < 1) [x, z]];   // inside the 38.5 x 27 opening
module services_add() {
    vent_hoods();
    // floor boss under the lock screw head
    difference() {
        cyl_z(LOCK_BOSS[0], WALL - 0.01, LOCK_BOSS[1], LOCK_X, LOCK_SY);
        cyl_z(4.5, -1, LOCK_BOSS[1] + 1, LOCK_X, LOCK_SY);
        translate([LOCK_X - LOCK_W/2 - 0.6, D - BACK_T - 0.01, 0]) cube([LOCK_W + 1.2, 5, 20]);
    }
    power_column();
    lock_pocket();
    // speaker: a rim round the flange, 4 pegs through the ear holes and 2 hooks over the flange
    translate([SPK_P[0], D - BACK_T + 0.01, SPK_P[1]]) rotate([90, 0, 0]) {
        difference() { translate([-SPK[0]/2 - 1.8, -SPK[1]/2 - 1.8, 0]) cube([SPK[0] + 3.6, SPK[1] + 3.6, SPK_FL + 1.6]);
                       translate([-SPK[0]/2 - 0.3, -SPK[1]/2 - 0.3, -1]) cube([SPK[0] + 0.6, SPK[1] + 0.6, SPK_FL + 4]);
                       for (sx = [-1, 1]) translate([sx*(SPK[0]/2 + 0.9) - 2, -SPK[1]/2 - 3, SPK_FL]) cube([4, SPK[1] + 6, 3]); }
        for (sx = [-1, 1], sz = [-1, 1]) translate([sx*SPK_EAR[0]/2, sz*SPK_EAR[1]/2, 0]) cylinder(d = 2.7, h = SPK_FL - 0.3, $fn = 16);
        // v17: hooks with a flat catch 1.2 over the flange (until v16 a slope 0.3 above it, 0.8 in at the top)
        for (sz = [-1, 1]) translate([-6, sz > 0 ? SPK[1]/2 + 0.3 : -SPK[1]/2 - 1.8, 0]) {
            cube([12, 1.5, SPK_FL + 2.0]);
            translate([0, sz > 0 ? 0 : 1.5, SPK_FL - 0.02]) snap_lip(12, 1.2, 1.6, sz > 0 ? 1 : 0);   // v21: no play (v17-v20: 0.1), the flange closes fully on the wall over the cord
        }
    }
}
module speaker3() translate([SPK_P[0] - SPK[0]/2, D - BACK_T - SPK[2], SPK_P[1] - SPK[1]/2]) {
    translate([0, SPK[2] - SPK_FL, 0]) cube([SPK[0], SPK_FL, SPK[1]]);                          // flange with the ears
    translate([4, 0, 2]) cube([SPK[0] - 8, SPK[2] - SPK_FL + 0.01, SPK[1] - 4]);               // box behind it
}
// v24 (Esben 26 Oct: the column's bores were full of support). The shell prints back down, so the column lies along the bed
// and its bores are horizontal holes whose roof is their front (-y) side. Every bore is now a teardrop with a 45 deg peak
// towards -y, and the body's square cavity has a 45 deg gable there (the column grows a matching ridge), so the column prints
// without support. Block support in the column in the slicer.
module teardrop_z(d, z0, z1) translate([0, 0, z0]) linear_extrude(z1 - z0) hull() {
    circle(d = d, $fn = 48); translate([0, -d/2*sqrt(2)]) square(0.01, center = true); }
module power_column() translate([PWR_P[0], PWR_P[1], 0]) {
    c = PWR_CAV;  o = PWR_OUT;  fz = PWR_BODY_TOP - 16;   // fingers: the ±x walls, free above fz
    difference() {
        translate([0, 0, WALL - 0.01]) linear_extrude(PWR_TOP - WALL + 0.01) hull() {
            rrc(o, o, 2); translate([0, -o]) square(0.01, center = true); }        // v24: ridge in front
        teardrop_z(PWR_BORE, -1, PWR_MOUTH);                                        // plug
        teardrop_z(PWR_SOCK[0] + 0.5, PWR_MOUTH - 0.01, PWR_MOUTH + PWR_SOCK[1]);   // barrel; its top is the step the body rests on
        translate([0, 0, PWR_MOUTH + PWR_SOCK[1]]) linear_extrude(PWR_TOP) hull() {   // body, with its gable
            translate([-c/2, -c/2]) square([c, c]); translate([0, -c]) square(0.01, center = true); }
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
    // socket (mouth down) in its column and the PSU's straight plug from below
    color([0.2, 0.2, 0.2]) power_inlet();
    // speaker
    color([0.2, 0.2, 0.22]) speaker3();
}



// --------------------------------------------- v2 power and light control ----
// No soldering (Esben 19 Oct): only finished modules with screw or lever terminals, joined with Wago clamps.
// [A] Mean Well RSD-60G-5, 24 V -> 5 V 12 A, 128 x 60 x 25 incl. flanges (reichelt / Mean Well datasheet),
//     screw terminals at one end; stands up on the back wall right of the power column (v11).
// [M] Gledopto GL-C-016WL-D WLED controller, measured by Esben 22 Oct (calipers, v17): see WLED_B below. Until v16 the CAD had 108 x 45 x 18 from the manual,
//     and the tray (45.3 inside) was too narrow for the 45.48 base plate.
// (the right wall is taken by the mic board higher up).
// [A] DFRobot Gravity MOSFET DFR0457 (white strips) 44 x 32, 4 x Ø3.1 on 20 x 25; height not published (~16): on the left side wall.
PSU5 = [60, 128, 25];  PSU5_P = [12, 16];                     // x, z (bottom-left), on the back wall; v11: stands up right of the power column, terminals at the top
// v17: the controller stands up on the back wall left of the power column, base plate against the wall, output end (4 terminals + USB-C) up.
// Local frame of the holder: u across (0 = left edge of the base plate seen from the front), v up (0 = bottom end of the case), w out of the wall.
WLED_B = [45.7, 99.74 - 2*5.9, 17.26];    // [M] widest 45.7 (45.48 across the base plate itself), case length ([C] 87.94 from the photos), height
WLED_TOPW = 44.7;                         // [M] top 44.7 against 45.7 at the bottom: the case tapers
// v24 (Esben 26 Oct, first assembly: the controller did not fit, the holder was too short; "maybe the length without the slots
// that go out"). The 99.74 measured over both arms reaches the bottoms of the open slots, not the tips: tip to tip is
// 99.74 + 2 x 4.5 = 108.7, and the manual says 108. The arms are now 10.03 past the case (v17-v23: 5.9), 108 in all.
WLED_L = 108;                             // [A] length over both arms, tip to tip (Gledopto manual)
WLED_ARM = [(WLED_L - WLED_B[1])/2, 2.0, 11.6, 3.5, 4.5];   // arms: length past the case, thickness, tip width, slot width, slot depth from the tip ([C] photos). No screws in them (Esben 22 Oct)
// [u0, u1] where the arm leaves the case ([M] 24.12 / 20.43 from the opposite edge), u of the slot centre ([M] 11.2 from the near edge, 34.8 from the far one), end (-1 bottom, 1 top)
WLED_ARMS = [[24.12, 45.7, 45.7 - 11.2, -1], [45.7 - 20.43 - 21.3, 45.7 - 20.43, 11.2, 1]];
WLED_C = [0.25, 0.3];                     // clearance: per side across, at each arm tip
WLED_FL = 1.2;                            // floor, as the v2-v16 trays
WLED_X0 = -34.5 - WLED_B[0]/2;  WLED_Z0 = 70 - WLED_B[1]/2;   // same centre as the v11-v16 tray
WLED = [WLED_B[0], WLED_B[1], WLED_B[2]];  WLED_P = [WLED_X0, WLED_Z0];
PSU_LIP = [1.6, 20, 3, 2.0];  BOARD_LIP = [1.2, 12, 2, 1.6];   // v17: snap lips [in, length, per side, ramp]
MOSF = [44, 32, 16];   MOSF_P = [34.5, 64];                  // on the left wall; [A] DFR0457 PCB 44 x 32 (drawing), [C] ~16 high with the screw terminal
// v17 (Esben 22 Oct: the teeth were too small, above all for the 5 V supply): every tray lip now has a flat catch 0.1 over the part's
// top edge and a ramp above it. Until v16 the lips started 0.3 above the part and leaned in only 0.6 at their top, so a sloped face was
// all that held the part. lip = [in, length, count per side, ramp height]
module snap_lip(len, inw, rh, side) translate([0, 0, 0]) rotate([90, 0, 90]) linear_extrude(len)   // profile in (y, z), y inwards
    polygon(side > 0 ? [[0, 0], [-inw, 0], [0, rh]] : [[0, 0], [inw, 0], [0, rh]]);
module lips_along(sz, t, lip, fl = 1.2, at = []) {   // lips on both long walls (along x) of an inner box sz[0] x sz[1] + 0.3
    for (sy = [0, 1], i = [0 : lip[2] - 1]) {
        x = len(at) ? at[i] : (i + 0.5)*(sz[0] + 0.3)/lip[2] - lip[1]/2;
        translate([x, sy > 0 ? sz[1] + 0.3 : 0, fl + t + 0.1]) snap_lip(lip[1], lip[0], lip[3], sy);
    }
}
module wall_tray(sz, lip, wt = 1.6, end_h = 5) {   // sz = [x, y, z-thickness]: long walls with snap lips, low end stops (terminals stay free)
    hgt = 1.2 + sz[2] + 0.1 + lip[3] + 0.3;
    difference() {
        translate([-wt, -wt, 0]) cube([sz[0] + 0.3 + 2*wt, sz[1] + 0.3 + 2*wt, hgt]);
        translate([0, 0, 1.2]) cube([sz[0] + 0.3, sz[1] + 0.3, hgt + 1]);
        translate([6, 6, -1]) cube([sz[0] - 12, sz[1] - 12, 3]);                   // open floor: less print, air
        translate([-wt - 1, -wt - 1, end_h]) cube([sz[0] + 2*wt + 2.3, sz[1] + 2*wt + 2.3, hgt]);   // ends cut down ...
    }
    for (sy = [0, 1]) translate([0, sy > 0 ? sz[1] + 0.3 : -wt, 0]) cube([sz[0] + 0.3, wt, hgt]);   // ... long walls stay full height
    lips_along(sz, sz[2], lip);
}
// v17: cradle for the small boards (4G, mic core, IMU, reed): walls all round, a finger notch in the middle of each long wall and a lip
// on each side of it. The Pololu cradle from gen 1 (until v16) had 2 lips, both at one end.
module cradle2(sz, lip) {
    hgt = 1.2 + sz[2] + 0.1 + lip[3] + 0.3;  notch = sz[0] >= 30;  ll = min(lip[1], (sz[0] - 10)/2 - 3);
    difference() {
        translate([-1.6, -1.6, 0]) cube([sz[0] + 3.2, sz[1] + 3.2, hgt]);
        translate([0, 0, 1.2]) cube([sz[0] + 0.3, sz[1] + 0.3, hgt + 1]);
        if (notch) translate([sz[0]/2 - 5, -3, 1.2 + sz[2]/2]) cube([10, sz[1] + 6, hgt]);   // finger notches
    }
    if (notch) lips_along(sz, sz[2], [lip[0], ll, 2, lip[3]], at = [sz[0]/2 - 6.5 - ll, sz[0]/2 + 6.8]);
    else lips_along(sz, sz[2], [lip[0], sz[0] - 4, 1, lip[3]]);   // small board: one long lip per side
}
// v17: holder for the measured WLED controller. Long walls with snap lips over the narrower lid, an open floor, the floor carried out under
// both arms, and a low stop just past each arm tip so it cannot slide along. No screws (Esben 22 Oct); the case ends stay free for the terminals.
module wled_frame() translate([WLED_X0, D - BACK_T, WLED_Z0]) multmatrix([[1, 0, 0, 0], [0, 0, -1, 0], [0, 1, 0, 0], [0, 0, 0, 1]]) children();
function wled_tip(e) = e < 0 ? -WLED_ARM[0] : WLED_B[1] + WLED_ARM[0];
module wled_arm2d(a) {   // arm outline in u, v (base on the case end, tip outwards)
    v0 = a[3] < 0 ? 0 : WLED_B[1];  t = wled_tip(a[3]);
    polygon([[a[0], v0], [a[1], v0], [a[2] + WLED_ARM[2]/2, t], [a[2] - WLED_ARM[2]/2, t]]);
}
module wled_holder() wled_frame() {
    B = WLED_B; c = WLED_C[0]; wt = 1.6; hw = WLED_FL + B[2] + 1.8;
    difference() {
        union() {
            translate([-c, 0, 0]) cube([B[0] + 2*c, B[1], WLED_FL]);                                   // floor under the case
            for (a = WLED_ARMS) {
                v0 = a[3] < 0 ? -WLED_ARM[0] - WLED_C[1] : B[1];
                translate([max(-c, a[0] - 1), v0, 0]) cube([min(B[0] + c, a[1] + 1) - max(-c, a[0] - 1), WLED_ARM[0] + WLED_C[1], WLED_FL]);   // pad under the arm
                // stop past the tip: 0.8 above the arm, so the wires into the terminals pass over it
                translate([a[2] - WLED_ARM[2]/2 - 1, a[3] < 0 ? -WLED_ARM[0] - WLED_C[1] - wt : B[1] + WLED_ARM[0] + WLED_C[1], 0])
                    cube([WLED_ARM[2] + 2, wt, WLED_FL + WLED_ARM[1] + 0.8]);
            }
            for (su = [-c - wt, B[0] + c]) translate([su, 0, 0]) cube([wt, B[1], hw]);                 // long walls
            // snap lips: catch 0.1 over the lid, 2.0 in (the top edge is 0.75 in from the wall, so 1.25 over it), ramp on top
            for (sd = [0, 1], v = [B[1]*0.15, B[1]*0.7]) translate([sd ? B[0] + c : -c, v, WLED_FL + B[2] + 0.1]) hull() {
                translate([sd ? -2.0 : 0, 0, 0]) cube([2.0, 10, 0.01]); translate([sd ? -0.01 : 0, 0, 1.6]) cube([0.01, 10, 0.1]); }
        }
        translate([6, 8, -1]) cube([B[0] - 12, B[1] - 16, WLED_FL + 2]);                              // open floor: less print, air
    }
}
module placed_wled() wled_frame() translate([0, 0, WLED_FL]) {   // the controller: base plate, case with the narrower lid, the 2 arms
    B = WLED_B;
    hull() { cube([B[0], B[1], 0.01]); translate([(B[0] - WLED_TOPW)/2, 0, B[2] - 0.01]) cube([WLED_TOPW, B[1], 0.01]); }
    for (a = WLED_ARMS) linear_extrude(WLED_ARM[1]) difference() {
        wled_arm2d(a);
        translate([a[2] - WLED_ARM[3]/2, a[3] < 0 ? wled_tip(-1) - 1 : wled_tip(1) - WLED_ARM[4] + WLED_ARM[3]/2]) square([WLED_ARM[3], WLED_ARM[4] - WLED_ARM[3]/2 + 1]);
        translate([a[2], wled_tip(a[3]) - a[3]*(WLED_ARM[4] - WLED_ARM[3]/2)]) circle(d = WLED_ARM[3], $fn = 20);
    }
}
module power_holders() {
    // v11: both stand up; the trays turn with them, so the low end stops stay at the terminal ends (top and bottom)
    translate([PSU5_P[0] + PSU5[0], D - BACK_T + 0.01, PSU5_P[1]]) rotate([0, -90, 0]) rotate([90, 0, 0]) wall_tray([PSU5[1], PSU5[0], PSU5[2]], PSU_LIP, 2.2);   // v17: 3 lips 20 long, 1.6 in, per side
    wled_holder();
    translate([-(HW - WALL) - 0.01, MOSF_P[0], MOSF_P[1] + MOSF[0]]) rotate([0, 90, 0]) wall_tray([MOSF[0], MOSF[1], MOSF[2]], [1.2, 10, 2, 1.6]);
}
module placed_power3() {
    color([0.75, 0.76, 0.78]) translate([PSU5_P[0], D - BACK_T - 1.2 - PSU5[2], PSU5_P[1]]) cube([PSU5[0], PSU5[2], PSU5[1]]);
    color([0.9, 0.9, 0.92]) placed_wled();
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
CAM_END = 16.775;                         // slot end centres (v19: 14.675); v20: 1.5 further out, so the wider window keeps 3.7 mm black; v24: 0.6 more (window Ø12.1)
CAM_KEEP = [17, 14];                      // no channel behind the camera board: half x, half z
REFL = [[4.2, -6.0], [26.45, 4.4]];       // reflector line (y, r): from the ring flange to the floor
FLOOR3 = 27.4;                            // v18: 0.95 deeper (v2-v17: 26.45) for the strip lanes; the reflector stops at r 4.4 as before
// [y0, y1, kind, thickness, end |x| left, end |x| right] (strip ends next to the camera)
// [C] white: Ledproff COB Ra95 24 V, 8 x 2 mm; RGB: Ledprodukter WS2812b COB 5 V, 5 x 2.2 mm (dimension sheet)
// Each strip is fed from ONE end. The clip connectors are wider than the strips (white 9.6, RGB 6.8,
// up to 4.4 high), so they cannot sit side by side: white 1 and RGB take their clips at the left end,
// white 2 at the right end, and the strip next to a clip stops 17 mm further out.
CLIP_L = 17;                              // clip zone along the strip, from the camera keep-out
// v18 (Esben 22 Oct, sketch /mnt/project-files/gen2-gennemgang/halo-gen2-v18_skitse_led-fastholdelse.png): no adhesive. Each strip has
// its own lane on the strip wall; its back edge goes in under a lip, its front edge presses down against the wall. The frame
// prints back down, so a lip can only point forward. [M] Esben: white 8.1 wide with a 3.7 yellow (lit) stripe in the middle,
// so 2.2 is dark each side and the lips take 1.0 of it; the RGB strip is lit right across, so it gets no lip (snug lane, reflector 0.3 above).
STRIPS3 = [[4.7, 12.7, "w", 2.0, 17, 34], [13.5, 21.5, "w", 2.0, 34, 17], [22.3, 27.3, "rgb", 2.2, 17, 34]];
STRIP_T3 = [4.7, 6.9];                    // strip wall face at r 6.9; thickest strip reaches r 4.7
// The white strip is thinner out at the dark edge than over the yellow stripe. The stems and lips only reach over that thin
// edge, so a stem stands at most ~1.1 out from the wall (a flat shelf in the print; 2.5 in the first v18 draft was too much).
T_EDGE = 0.5;                             // [A] white strip thickness at the dark edge, until Esben has measured it
LANE_STEMS = [12.8, 21.6];                // stem front faces: 0.6 wide, lip 1.1 forward over the strip in front
LANE_LIP = [STRIP_T3[1] - T_EDGE - 0.6, STRIP_T3[1] - T_EDGE - 0.1];   // lip r: 0.5 thick, 0.1 clear of the edge
// [C] Ledproff low-profile start clip 8 mm COB: 9.6 wide (retailer), ~15.5 x 4.3 (comparable LinearLux, unconfirmed)
// [C] Ledprodukter MiniClip 5 mm 3-pole: 16.53 x 6.8 x 4.4 (retailer table)
CLIPS3 = [[-1, 9.1, [16, 9.6, 4.3]], [1, 17.5, [16, 9.6, 4.3]], [-1, 24.8, [16.6, 6.8, 4.4]]];   // side, strip centre y, [l, w, h]
// v24 (Esben 26 Oct: two white strips give plenty of light): v18-v23's third white strip in a pocket at the front of the
// sloping reflector is gone, with its pocket, lips, clip and lead hole, and the light ring's wedge that held its front edge.
// The reflector's front face clamps the ring's inner flange again, as in v2-v17.
// r range of a convex (y, r) polygon at y
function xr(p, y) = let(r = [for (i = [0:len(p) - 1]) let(a = p[i], b = p[(i + 1) % len(p)]) if ((a[0] - y)*(b[0] - y) <= 0 && a[0] != b[0]) a[1] + (y - a[0])*(b[1] - a[1])/(b[0] - a[0])]) [min(r), max(r)];
// a smooth slope round the ring: everything inside the ring centre line offset r, going linearly from r0 at y0 to r1 at y1
// (the centre line is convex, so the hull of the two end slices is exactly that; v18 first draft and v2-v17 used 0.2-0.5 mm stairs)
module rfill(y0, y1, r0, r1) hull() { ext_y(y0, y0 + 0.001) offset(r = r0) ring_centre2d(); ext_y(y1 - 0.001, y1) offset(r = r1) ring_centre2d(); }
function qsort(v) = len(v) <= 1 ? v : let(p = v[0]) concat(qsort([for (x = v) if (x < p) x]), [p], qsort([for (x = v) if (x > p) x]));
// the convex polygon swept round the ring, smooth: between each pair of its corners (in y) the outer and inner edges are straight
function lerp_at(y, ya, ra, yb, rb) = ra + (y - ya)*(rb - ra)/(yb - ya);
module sweep3(p) {
    ys = qsort([for (q = p) q[0]]);  e = 1e-4;
    for (i = [0:len(ys) - 2]) let(a = ys[i], b = ys[i + 1], ra = xr(p, a + e), rb = xr(p, b - e))
        if (b - a > 0.002) difference() {
            rfill(a, b, lerp_at(a, a + e, ra[1], b - e, rb[1]), lerp_at(b, a + e, ra[1], b - e, rb[1]));
            rfill(a - 0.01, b + 0.01, lerp_at(a - 0.01, a + e, ra[0], b - e, rb[0]), lerp_at(b + 0.01, a + e, ra[0], b - e, rb[0]));
        }
}
J_R = 10.6;                               // front screws: in the outer wall at the 4 corners. v20: 11.8 -> 10.6, so the bosses and the
                                          // shell's clearance (Ø6.4) stay inside the shell wall (13.8) and clear of the joint groove
J2 = [for (j = JOINTS) [j[0] + sign(j[0])*J_R/sqrt(2), j[1] + sign(j[1] - (RING_Z0 + RING_Z1)/2)*J_R/sqrt(2)]];

// ======================================================================== v20 sealing ==
// Esben 23 Oct (sketch /mnt/project-files/gen2-gennemgang/halo-gen2-v20_skitse_taetning-v2.png): every joint where water can get
// in has the same removable seal, a silicone sponge O-ring cord Ø1.5 ([A] RS 234-2906) cut to length, ends butted, no glue.
// Sponge, not solid: 3.7 m of solid 60 Shore cord squeezed 33 % would push the parts apart with over 2 kN.
// Grooves are 2.0 wide; each cord is squeezed to about 1.0. All seals sit behind faces, so tape, stickers or a theme on
// the outside neither touch nor pull on them.
SEAL = [1.5, 2.0, 1.0];                   // cord Ø, groove width, groove depth
// 1 front to shell: v21 has no cord here, see "weather" (rib and groove, faces meet with no gap).
JOINT_GAP = 0;                            // v20: 0.2, the cord took up the tolerance
// v21: crush bumps on each shell post's face against the frame: the front/shell faces are the stop, the bumps reach
// CRUSH[0] past the frame's back face and are squeezed flat by the screw, so the frame stays clamped (front boss ->
// frame -> post) whatever the print tolerance. The post face itself stays CRUSH[1] clear of the frame.
CRUSH = [0.2, 0.1, 3, 1.6, 0.6, 3.1];     // reach, face clearance, count, base Ø, tip Ø, radius from the screw
// 3 light ring: a pocket 1.0 deep in the back of the front plate, the full channel width (CH_IN): the cord lies beside
// the ring's wall, under its flange. v22: the ring's shoulder stands on the pocket floor (hard stop) and the frame holds the
// flange down, so the groove is closed and fixed and the ring is just as tight without a cord (v20/v21: it rested on the cord).
RING_SEAL_Y = PT - 1.0;                   // 2.2: front face of the pocket
RING_SH = S3 + 0.4;                       // v22: the ring's shoulder rests on the pocket floor from the slot edge (7.0) to 7.4
// 4 camera: glass Ø12 x 1.5 ([C] AliExpress, ±0.3) in a Ø12.2 pocket behind a 0.6 lip; the lip opens 60 deg (Wide: 120 deg
// diagonal) to Ø10.9 at the face. A cord ring sits in the corner behind the glass, pressed into it by the 45 deg front
// of a printed sleeve: it seals the glass to the pocket wall. v21 (Esben 23 Oct: every seal closes fully, no gap): the
// sleeve is pressed into the shroud on 4 ribs until its front face stops on the glass, so glass -> lip and sleeve ->
// glass are both hard stops and the cord's corner is a closed, fixed gland (Ø1.5 squeezed to about 1.05). The sleeve
// stays CAM_SLV_GAP clear of the lens holder (v20: it stood on the holder, 0.5 behind the glass).
// v22 (Esben 23 Oct: everything must assemble and work without seals and without the glass): the 4 ribs sit in the corners of
// the shroud's square bore and their front ends stop on the front plate's back face (y PT), where the square bore starts. That
// is the sleeve's own hard stop; with a 1.5 mm glass the sleeve's front face meets the glass at the same time.
// Field of view, front lens element Ø4 [C]: v24 (1.0 to the glass): r 3.73 at the glass back, 4.77 at its front, 5.81 at the face (lip: 5.01 / 6.05).
CAM_GLASS = [12, 1.5];
CAM_WIN = [12.2, 0.6, 12.1];              // pocket Ø, lip, face Ø (v24: 10.9 -> 12.1, the lens sits 0.4 further back; lip Ø10.0 at the glass, so the glass rests on 1 mm)
CAM_SLV = [8.6, 11.2, 4.6];               // sleeve: bore (barrel Ø6.95-7.25; v24: 7.7 -> 8.6, 0.65 air round the lens), outside, r where the 45 deg front starts
CAM_SLV_GAP = 1.0;                        // v24: 1.0 clear of the lens holder (v21-v23: 0.3)
CAM_SLV_Y = [CAM_WIN[1] + CAM_GLASS[1], CAM_PCB_Y - CAM_HOLDER_H - CAM_SLV_GAP];   // front face on the glass, back clear of the lens holder
CAM_SLV_RIB = [1.0, CAM_BAY/2*sqrt(2) - 0.5 + 0.05, PT];   // v22: corner ribs: width, reach (0.05 into the corner walls), front end y (stop)
module cam_window_cut() {
    cyl_y(CAM_WIN[0], CAM_WIN[1], PT + 1, 0, LENS_Z);
    translate([0, -0.01, LENS_Z]) rotate([-90, 0, 0]) cylinder(d1 = CAM_WIN[2], d2 = CAM_WIN[2] - 2*(CAM_WIN[1] + 0.02)*tan(60), h = CAM_WIN[1] + 0.02, $fn = 64);
}
module cam_glass() cyl_y(CAM_GLASS[0], CAM_WIN[1], CAM_WIN[1] + CAM_GLASS[1], 0, LENS_Z);
module cam_sleeve() translate([0, 0, LENS_Z]) {
    rotate([-90, 0, 0]) rotate_extrude($fn = 64) polygon([
        [CAM_SLV[0]/2, CAM_SLV_Y[0]], [CAM_SLV[2], CAM_SLV_Y[0]], [CAM_SLV[1]/2, CAM_SLV_Y[0] + CAM_SLV[1]/2 - CAM_SLV[2]],
        [CAM_SLV[1]/2, CAM_SLV_Y[1]], [CAM_SLV[0]/2, CAM_SLV_Y[1]]]);
    // 4 press ribs in the corners of the shroud's square bore (v21: on its flats); they hold the sleeve and stop it at y PT
    for (a = [45, 135, 225, 315]) rotate([0, -a, 0]) translate([CAM_SLV[1]/2 - 0.3, CAM_SLV_RIB[2], -CAM_SLV_RIB[0]/2])
        cube([CAM_SLV_RIB[1] - CAM_SLV[1]/2 + 0.3, CAM_SLV_Y[1] - CAM_SLV_RIB[2], CAM_SLV_RIB[0]]);
}
// the cord ring: inscribed in the corner of glass back, pocket wall and the sleeve's 45 deg face
CAM_CORD = let(gb = CAM_WIN[1] + CAM_GLASS[1], L = CAM_WIN[0]/2 - (CAM_SLV[2] - (CAM_SLV_Y[0] - gb)), ri = L*(2 - sqrt(2))/2) [gb + ri, CAM_WIN[0]/2 - ri, ri];
// 5 speaker: a groove in the back wall round the grille, inside the speaker's flange and outside its 38.5 x 27 opening
module spk_seal2d(h) difference() { offset(r = 6 + h) square([31, 17], center = true); offset(r = max(6 - h, 0.01)) square([31, 17], center = true); }
// 6 lock: the slot for the cleat's tongue opens into a closed printed pocket (walls 1.6), so whatever gets in at the
// back stays round the tongue and runs out of a Ø2 drain in the floor.
LOCK_PK = [LOCK_W/2 + LOCK_C[0], LOCK_Y - 1, LOCK_TZ[1] + 0.8, 1.6];   // inner half width (v24: 0.2 beside the tongue, v20-v23: 0.6), front y, roof z, wall
LOCK_DRAIN = [LOCK_X - LOCK_W/2 + 1.0, LOCK_Y + 0.5];
// 7 v21 (Esben 23 Oct): the four theme-wing hook slots (WING_P, 4 x 14 through the back wall) opened straight into the
// box in v20. Each now opens into a closed printed pocket (walls 1.6) that leaves room for a hook to drop in: 6.5 behind the
// wall and 4 below the slot for the hook's lip (the theme hook: a 6 mm tongue through the slot, resting on its floor, with
// a lip 3 mm down behind the wall; it goes in near the top of the slot and drops). A Ø2 drain at the pocket floor runs
// back out through the back wall.
WING_SLOT = 9;                            // v21: 9 wide (v20: 4), so a top and a wing can share the upper slot: top inside, wing outside
WING_PK = [WING_SLOT/2 + 0.2, 6.5, 4, 1.6, 1];   // inner half width, depth behind the wall, room below the slot, wall, room above
module wing_pockets() for (p = WING_P) difference() {
    translate([p[0] - WING_PK[0] - WING_PK[3], D - BACK_T - WING_PK[1] - WING_PK[3], p[1] - 4 - WING_PK[2] - WING_PK[3]])
        cube([2*(WING_PK[0] + WING_PK[3]), WING_PK[1] + WING_PK[3] + 0.01, 14 + WING_PK[2] + WING_PK[4] + 2*WING_PK[3]]);
    translate([p[0] - WING_PK[0], D - BACK_T - WING_PK[1], p[1] - 4 - WING_PK[2]]) cube([2*WING_PK[0], WING_PK[1] + 1, 14 + WING_PK[2] + WING_PK[4]]);
}
module wing_drains() for (p = WING_P) cyl_y(2, D - BACK_T - 1, D + 1, p[0], p[1] - 4 - WING_PK[2] + 1);
module wing_slot_chamfers() for (p = WING_P) translate([p[0] - WING_SLOT/2, D - BACK_T, p[1] - 4]) rotate([90, 0, 90]) linear_extrude(WING_SLOT) polygon([[-0.01, 0.01], [1.3, 0.01], [-0.01, -1.31]]);

// ----------------------------------------------------------- theme hooks (v21) --
// Esben 23 Oct: a theme top and the wings hang in the slots. Each hook is a tongue 4 x 6 (x, z) from a strap behind the
// box, through the 3 mm wall, resting on the slot floor, with a lip 5 thick that reaches 3 below the floor behind the
// wall: lift 3, push in, drop. The top owns the inner half of each upper slot, a wing the outer half of both slots on its
// side. Straps stay outside the wall cleat (x -95..62) in the 14 mm gap to the wall, so put them on before hanging the box.
HOOK = [4, 6, 5, 3, 0.25];                // tongue width (x), height (z), lip thickness (y), lip drop below the floor, clearance (tools/strength_hooks_gen2.py)
// To come off, a hook must move 8.25 back (lip + clearance + wall). The straps are 10 (top) and 9 (wing) thick, so with the
// box on the wall cleat (wall 14 behind the back) only 3.8 / 4.8 is left: hung on the wall, the parts cannot be unhooked.
WING_STRAP = 9;
STRAP_Y = D + 0.2;                        // straps' front face, 0.2 off the back wall
TOP_Z0 = H + 0.2;                         // the top's base rests on the closed top face
module hook(xc, zf) {                     // zf: slot floor; tongue from the strap face forward through the wall
    y0 = D - BACK_T - HOOK[4] - HOOK[2];
    translate([xc - HOOK[0]/2, y0, zf]) cube([HOOK[0], STRAP_Y - y0 + 0.01, HOOK[1]]);
    translate([xc - HOOK[0]/2, y0, zf - HOOK[3]]) cube([HOOK[0], HOOK[2], HOOK[3] + 0.01]);
    // 1 mm fillets (as 45 deg chamfers) in the two loaded corners: tongue top at the strap, tongue underside at the lip
    // (the slot floor's inner edge has a 1.3 chamfer to clear it, wing_slot_chamfers)
    translate([xc - HOOK[0]/2, STRAP_Y, zf + HOOK[1]]) rotate([90, 0, 90]) linear_extrude(HOOK[0]) polygon([[0.01, 0], [0.01, 1], [-1, 0]]);
    translate([xc - HOOK[0]/2, y0 + HOOK[2], zf]) rotate([90, 0, 90]) linear_extrude(HOOK[0]) polygon([[0, 0], [1, 0], [0, -1]]);
}
function hook_x(sx, inner) = sx*(W/2 - 12) + (inner ? -sx : sx)*(WING_SLOT/4 + 0.1);   // centre of the slot's inner / outer half
// example top: a 6 mm sign over the front, a 4 mm base on the top face, ribs, and two straps 4 x 10 down to the upper slots
module theme_top_demo() {
    zf = WING_P[1][1] - 4;
    translate([0, 0, TOP_Z0]) {
        translate([0, 3, 0]) rotate([90, 0, 0]) linear_extrude(6) translate([0, 40]) offset(r = 14) square([W - 28, 80 - 28], center = true);
        translate([-(W/2 - 14), 0, 0]) cube([W - 28, D + 0.2, 4]);
        for (x = [-60, 0, 60]) translate([x - 2, 2.9, 3.9]) rotate([90, 0, 90]) linear_extrude(4) polygon([[0, 0], [30, 0], [0, 36]]);
    }
    for (sx = [-1, 1]) {
        x0 = hook_x(sx, true);
        xa = sx < 0 ? x0 - HOOK[0]/2 : x0 - HOOK[0]/2 - 1;      // 1 mm wider towards the middle, flush on the wing's side
        translate([xa, STRAP_Y, zf - HOOK[3]]) cube([HOOK[0] + 1, 10, TOP_Z0 + 4 - zf + HOOK[3]]);
        translate([xa, D - 14, TOP_Z0]) cube([HOOK[0] + 1, STRAP_Y + 10 - (D - 14), 4]);   // ties the strap to the base
        hook(x0, zf);
    }
}
// example wing: a 6 mm panel beside the front, a 4 mm rib along the side, and a strap 9 thick behind the back wall that
// carries a hook into both slots on that side
module theme_wing_demo(sx) {
    xe = W/2 + 0.2;                       // inner face of the rib (0.2 off the side wall)
    zs = [for (p = WING_P) if (p[0]*sx > 0) p[1] - 4];
    z0 = min(zs) - HOOK[3] - 6;  z1 = max(zs) + HOOK[1] + 8;
    mirror([sx < 0 ? 1 : 0, 0, 0]) {
        translate([xe, -3, 120]) rotate([90, 0, 0]) mirror([0, 0, 1]) linear_extrude(6) offset(r = 12) translate([12, 12]) square([50 - 24, 170 - 24]);
        translate([xe, -3, 130]) cube([4, D + 3.2, 150]);
        translate([hook_x(1, false) - HOOK[0]/2, STRAP_Y, z0]) cube([xe + 4 - (hook_x(1, false) - HOOK[0]/2), WING_STRAP, z1 - z0]);   // ends flush with the hook, 0.7 from the top's strap
        translate([xe, D - 10, z0]) cube([4, 10.21 + WING_STRAP, z1 - z0]);
        for (z = zs) hook(hook_x(1, false), z);
    }
}
// v21: clipped to 1 mm inside the shell's outer skin (until now its bottom-left corner stood up to 1 mm out of the round bottom edge)
module lock_pocket() intersection() {
    difference() {
        translate([LOCK_X - LOCK_PK[0] - LOCK_PK[3], LOCK_PK[1] - LOCK_PK[3], WALL - 0.01]) cube([2*(LOCK_PK[0] + LOCK_PK[3]), D - BACK_T - LOCK_PK[1] + LOCK_PK[3] + 0.02, LOCK_PK[2] + LOCK_PK[3] - WALL + 0.01]);
        translate([LOCK_X - LOCK_PK[0], LOCK_PK[1], WALL - 1]) cube([2*LOCK_PK[0], D - BACK_T - LOCK_PK[1] + 1, LOCK_PK[2] - WALL + 1]);
    }
    ext_y(SKIRT, D) translate([0, 1]) rr(W - 2, H - 2, R - 1);
}
// front screw boss: where it reaches into the channel (r < CH_IN) it starts at y 4.5, clear of the ring's flange and its
// cord, with a 45 deg underside (no overhang face down)
module j2_boss(j) difference() {
    cyl_y(6, PT - 0.01, CH_BACK, j[0], j[1]);
    rfill(PT - 1, 4.5, CH_IN, CH_IN);
    rfill(4.49, 4.5 + 1.62, CH_IN, CH_IN - 1.62);
}
// the cords as they lie squeezed (3D viewer, fit check)
module seal_cords() {
    ext_y(GLASS_Y3 - GROOVE3[1], GLASS_Y3) difference() { groove3_2d(LAND3 + GROOVE3[0] - 0.05); groove3_2d(LAND3 + 0.05); }            // 2
    ext_y(RING_SEAL_Y, PT) difference() { ring3_2d(CH_IN - 0.05); ring3_2d(RING_SH + 0.05); }                                               // 3
    translate([0, CAM_CORD[0], LENS_Z]) rotate([-90, 0, 0]) rotate_extrude($fn = 64) translate([CAM_CORD[1], 0]) circle(r = CAM_CORD[2], $fn = 16);   // 4
    ext_y(D - BACK_T, D - BACK_T + SEAL[2]) translate([SPK_P[0], SPK_P[1]]) spk_seal2d(SEAL[1]/2 - 0.05);                                   // 5
}
// v12 (Esben 20 Oct, sketch /mnt/project-files/gen2-gennemgang/halo-gen2-v11_skitse_tyndere-front-og-rille.png):
// the display stays behind the front, but the front is only 1.6 mm thick over the glass (v2-v11: 3.2 + a 0.5 land,
// glass 3.7 in). The glass lies straight on the back of that lip, so there is no gap at the window edge. A groove
// in the lip, 1 mm out from the window bevel, takes the seal cord round the picture (v12-v19: foam tape).
GLASS_Y3 = 1.6;                           // glass front face = lip thickness
GLASS_C3 = 0.4;                           // the thin pocket clears the glass by 0.4 (the 8 ribs locate it, 0.2)
LAND3 = 1.0;                              // flat land from the window bevel to the groove
GROOVE3 = [2.0, 1.0];                     // groove width, depth; v20: seal cord Ø1.5 squeezed to 1.0 (v12-v19: foam tape 3 x 1 in 3.2 x 0.6)
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
DSP_SLOT_X = 0.3;                         // v14: the holes are 0.3 wider each way across (3.5 mm): v13's 2.9 left 0.2 per side for
                                          // 121.8 mm between the holes, less than the print shrinks, and the screws missed
// v16: up to v15 there was a Ø7 tower round a Ø5.6 head well that was slotted ±2.4 mm lengthwise, so the well cut the tower
// away (0.4 mm slivers left): the bar hung 12 mm above the bracket. Now the tower wraps the well with 1.8 mm walls,
// the slot is ±0.8 lengthwise (the bracket positions are checked; 0.8 covers the shrink over 160 mm) and the floor
// under the screw head is 1.6 mm, so an M2.5 x 3-4 screw reaches the bracket (x 5 would touch the display's back).
DSP_SLOT_Z = 0.8;  DSP_BOSS = 9.2;  DSP_FLOOR = 1.6;
DSP_XB_Z = DSP_TAB_Z;                      // cross bars on the tabs (Esben 21 Oct: the plate notches face down, as drawn)
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
CAP_Y = CAM_PCB_Y - 2.0;  CAP_T = 1.2;     // v24: 2.0 in front of the board (v14-v23: 0.8), nothing near its front face but the 4 bosses
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
            for (j = J2) j2_boss(j);
            for (h = CAM_HOLES_ROT) cyl_y(4.6, PT - 0.01, CAM_PCB_Y, h[0], LENS_Z + h[1]);
            for (i = CAM_PEGS) cam_peg(CAM_HOLES_ROT[i]);
            cam_shroud(); cam_caps();
        }
        hull() { ext_y(-1, 0) window2d(WIN3_BEVEL[0]); ext_y(-1, GLASS_Y3 + 0.01) window2d(WIN3_BEVEL[1]); }
        ext_y(GLASS_Y3, PT + 0.01) pocket3_2d();                           // v12: thin lip over the glass
        ext_y(GLASS_Y3 - GROOVE3[1], GLASS_Y3 + 0.01) difference() { groove3_2d(LAND3 + GROOVE3[0]); groove3_2d(LAND3); }
        ext_y(-1, LOGO_D) translate([0, LOGO_Z]) logo_all2d();   // pocket for the inlay
        ext_y(-1, PT + 0.01) ring3_2d(S3);
        ext_y(RING_SEAL_Y, PT + 0.01) ring3_2d(CH_IN);                    // v20: seal pocket beside the ring (v19: a 45 deg seat)
        cam_window_cut();
        ext_y(SKIRT - JOINT_GAP, SKIRT + 0.02) difference() { offset(r = 1) rr(W, H, R); translate([0, WALL + FIT]) rr(W - 2*(WALL + FIT), H - 2*(WALL + FIT), R - WALL - FIT); }
        translate([-CAM_PCB[1], SKIRT - 0.1, CAM_TOP - 1]) cube([2*CAM_PCB[1], TONGUE_L + 0.2, 10]);
        for (j = J2) cyl_y(INS_M3_D, CH_BACK - 11, CH_BACK + 1, j[0], j[1]);
        snap_windows();
        translate([0, 0, LENS_Z]) ext_y(PT, CAM_PCB_Y) square(CAM_BAY, center = true);   // the caps keep clear of the lens holder
    }
    glass_ribs();
    joint_rib();                                                          // v21: into the shell's groove
}
module ring3() {
    ext_y(RING_Y[0], RING_Y[0] + 0.3) ring3_2d(RF3 - 0.3);
    ext_y(RING_Y[0] + 0.29, RING_Y[1]) ring3_2d(RF3);
    // v22: the wall runs straight on to the pocket floor (2.2), where a shoulder (RING_SH) stands on the front plate: a hard
    // stop, so the ring sits the same with or without its cord. The cord lies in the closed groove between the shoulder,
    // the pocket floor, the channel wall and the flange (v20/v21: a 45 deg step from 2.6 and the flange rested on the cord).
    ext_y(RING_Y[1] - 0.01, RING_SEAL_Y + 0.01) ring3_band(RF3 - RW3, RF3);
    difference() {
        union() { ext_y(RING_SEAL_Y, PT) ring3_2d(RING_SH); ext_y(PT - 0.01, PT + 1) ring3_2d(FL3); }
        ext_y(0, PT + 2) ring3_2d(RF3 - RW3);
        translate([-7.8, PT - 2, LENS_Z - 8]) cube([15.6, 4, 16]);       // clear of the camera shroud (v24: 14.8 wide)
        for (h = CAM_HOLES_ROT) cyl_y(4.6 + 1.0, PT - 1, PT + 2, h[0], LENS_Z + h[1]);   // v20: the flange gives way round the camera bosses
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
LK_PAD = [5, 1.8, 18];                    // frame tab under the arm root: u depth (inner, outer: stays 1.2 off the shell wall; v20 2.8 -> 1.8, the wall is 1 mm further out), width
LK_SLOT = [1.6, 8];                       // release slot through the frame, wall side of the arm: u, width
// [face point x, z], normal pointing away from the wall
SNAPS = [for (sx = [-1, 1], z = [110, 190]) [[sx*(RING_X - CH_HALF), z], [-sx, 0]],
         for (sx = [-1, 1]) [[sx*60, RING_Z0 + CH_HALF], [0, 1]],
         for (sx = [-1, 1]) [[sx*60, RING_Z1 - CH_HALF], [0, -1]]];
SNAPS_OUT = [for (sx = [-1, 1], z = [110, 190]) [[sx*(RING_X + CH_HALF), z], [sx, 0]],
             for (sx = [-1, 1]) [[sx*62, RING_Z0 - CH_HALF], [0, -1]]];   // v21: x 75 -> 62, on the straight run (at 75 the window met the corner's curve and left 0.1-0.3 flakes)
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
    tabs2 = [for (sx = [-1, 1], i = [0, 1]) [sx*DSP_TAB_X, GC + DSP_TAB_Z[i], GC + DSP_TAB_Z[i]]];
    difference() {
        union() {
            ext_y(CH_BACK, FR_BACK) {
                ring_band2d(-CH_HALF, CH_HALF);
                for (j = J2) translate(j) circle(d = 6.0, $fn = 32);   // v20: 6.4 -> 6.0, clear of the shell wall
                translate([-16, LENS_Z - 13.5]) square([34, 27]);               // behind the camera board and round the ribbon slot
            }
            // reflector, strip wall and floor, all inside the channel
            difference() {
                union() {
                    // the last step runs into the floor, so the reflector is one piece with the frame (v2 left a 0.24 mm gap)
                    difference() {   // v18: one smooth slope (v2-v17: 0.5 mm stairs)
                        union() { rfill(REFL[0][0], REFL[1][0], REFL[0][1], REFL[1][1]); ext_y(REFL[1][0] - 0.01, FLOOR3 + 0.01) offset(r = REFL[1][1]) ring_centre2d(); }
                        ext_y(REFL[0][0] - 1, FLOOR3 + 1) offset(r = -FL3) ring_centre2d();
                    }
                    ext_y(REFL[0][0], CH_BACK + 0.01) ring_band2d(STRIP_T3[1], FL3);
                    ext_y(FLOOR3, CH_BACK + 0.01) ring_band2d(-FL3, FL3);
                    // v18: lanes: a step in front of white 1, a stem + forward lip behind white 1 and white 2
                    ext_y(REFL[0][0], REFL[0][0] + 0.4) ring_band2d(LANE_LIP[0], STRIP_T3[1] + 0.01);
                    for (y = LANE_STEMS) { ext_y(y, y + 0.6) ring_band2d(LANE_LIP[0], STRIP_T3[1] + 0.01); ext_y(y - 1.1, y + 0.01) ring_band2d(LANE_LIP[0], LANE_LIP[1]); }
                }
                ext_y(0, CH_BACK + 1) { glass_keep2d(); cam_keep2d(); }
                for (c = CLIPS3) translate([c[0]*(CAM_KEEP[0] + c[2][0]/2), c[1], RING_Z1 + STRIP_T3[1] - c[2][2]/2 - 0.2])
                    cube([c[2][0] + 1, c[2][1] + 0.6, c[2][2] + 0.4], center = true);       // room for the clips
            }
            ring_bumps();                                                 // v24: press the ring's flange forward all round
            // cross bars at the display tabs, with bosses down to the tabs
            // they stop 0.4 short of the front's channel wall, but behind it (CH_BACK on) they run 1 mm into the frame ring:
            // in v2 they were loose pieces in the print
            for (z = DSP_XB_Z) ext_y(XB3_Y, FR_BACK) translate([0, GC + z]) square([2*(RING_X - CH_HALF - 0.4), 16], center = true);
            for (z = DSP_XB_Z) ext_y(CH_BACK, FR_BACK) translate([0, GC + z]) square([2*(RING_X - CH_HALF + 1), 16], center = true);
            for (t = tabs2) hull() for (z = [t[1], t[2]], dz = [-DSP_SLOT_Z, DSP_SLOT_Z], dx = [-DSP_SLOT_X, DSP_SLOT_X]) cyl_y(DSP_BOSS, TAB_Y - PRELOAD, XB3_Y + 0.01, t[0] + dx, z + dz);
            // tubes that press the camera board onto its pegs
            for (h = CAM_HOLES_ROT) cyl_y(4.6, CAM_PCB_Y + CAM_PCB[2], CH_BACK + 0.01, h[0], LENS_Z + h[1]);
            snap_arms();
        }
        snap_slots();
        // v18: the RGB lane ends 0.4 short of the frame plate, so its clip (6.8 wide) runs 0.5 into the plate: room for it there too
        for (c = CLIPS3) translate([c[0]*(CAM_KEEP[0] + c[2][0]/2), c[1], RING_Z1 + STRIP_T3[1] - c[2][2]/2 - 0.2])
            cube([c[2][0] + 1, c[2][1] + 0.6, c[2][2] + 0.4], center = true);
        for (t = tabs2) {
            hull() for (z = [t[1], t[2]], dz = [-DSP_SLOT_Z, DSP_SLOT_Z], dx = [-DSP_SLOT_X, DSP_SLOT_X]) cyl_y(2.9, TAB_Y - 1, FR_BACK + 1, t[0] + dx, z + dz);
            hull() for (z = [t[1], t[2]], dz = [-DSP_SLOT_Z, DSP_SLOT_Z], dx = [-DSP_SLOT_X, DSP_SLOT_X]) cyl_y(5.6, TAB_Y + DSP_FLOOR - PRELOAD, FR_BACK + 1, t[0] + dx, z + dz);   // screw head well
        }
        for (h = CAM_HOLES_ROT) cyl_y(2.4, CAM_PCB_Y, CAM_PCB_Y + CAM_PCB[2] + 2, h[0], LENS_Z + h[1]);
        // camera ribbon (16 mm wide, does not like sharp folds): it leaves the connector sideways (+x),
        // takes one gentle 90 deg bend backwards and passes the frame here to the open space behind it
        translate([CAM_RIB[0], CAM_PCB_Y + CAM_PCB[2] + 0.5, LENS_Z - CAM_RIB[1]/2]) cube([CAM_RIB[2], FR_BACK, CAM_RIB[1]]);
        for (j = J2) cyl_y(M3_CLR, CH_BACK - 1, FR_BACK + 1, j[0], j[1]);
        frame_loop_cut();                                                 // v23: service loop strap
        for (j = J2) cyl_y(6.2, REFL[0][0] - 1, CH_BACK + 0.01, j[0], j[1]);   // v20: the front's screw bosses (Ø6) reach into the channel corners; the strip wall keeps 0.6
        for (sx = [-1, 1]) cyl_y(4, CH_BACK - 1, FR_BACK + 1, sx*STRIP_LEAD_X, RING_Z1 + 4);   // strip leads, straight out of the clips
    }
}
// v24 (Esben 26 Oct: the diffuser gave a little when pressed, which feels cheap): small cones on the frame's two faces that
// meet the ring's flange (the reflector's front edge inside, the strip wall outside, both at y REFL[0][0]) reach RB[0] past
// that face, so the frame always presses the flange forward and its shoulder onto the front plate, all the way round the
// straight runs, whatever the print tolerance. They squash flat when the front screws are tightened, like the CRUSH bumps.
RB = [0.25, 1.4, 0.5, -7.05, 7.35];       // reach, base Ø, tip Ø, r inside (reflector), r outside (strip wall)
RB_V = [52, 80, 98, 128, 150, 172, 208, 232, 256];   // z on the side runs (clear of the snap arms at 110 and 190)
RB_B = [-45, -22, 0, 22, 45];             // x on the bottom run (clear of the snap arms at +-60/62)
RB_T = [42, 50];                          // |x| on the top runs (clear of the strip clips and the snap arms)
function rb_pts() = concat(
    [for (sx = [-1, 1], z = RB_V, r = [RB[3], RB[4]]) [sx*(RING_X + r), z]],
    [for (x = RB_B, r = [RB[3], RB[4]]) [x, RING_Z0 - r]],
    [for (sx = [-1, 1], x = RB_T, r = [RB[3], RB[4]]) [sx*x, RING_Z1 + r]]);
module ring_bumps() for (p = rb_pts()) translate([p[0], REFL[0][0] + 0.01, p[1]]) rotate([90, 0, 0])
    cylinder(d1 = RB[1], d2 = RB[2], h = RB[0] + 0.01, $fn = 16);
// 90 deg countersink, wide end (d1) at y0, narrowing towards -y to d2: for a screw driven in from the back
module csk_y(d1, d2, y0, x, z) translate([x, y0 + 0.01, z]) rotate([90, 0, 0]) cylinder(d1 = d1, d2 = d2, h = (d1 - d2)/2 + 0.01, $fn = 32);
module strip_cut2d(s) translate([-s[4], RING_Z1 - CAM_KEEP[1]]) square([s[4] + s[5], 2*CAM_KEEP[1]]);
module placed_strips3(kind) {
    // white: T_EDGE thin board full width, full thickness only over the 3.7 yellow stripe (+0.5 each side for the COB dome)
    for (s = STRIPS3) if (s[2] == kind)
        ext_y(s[0], s[1]) difference() { ring_band2d(STRIP_T3[1] - (kind == "w" ? T_EDGE : s[3]), STRIP_T3[1]); strip_cut2d(s); }
    for (s = STRIPS3) if (s[2] == kind && kind == "w")
        ext_y(s[0] + (s[1] - s[0] - 4.7)/2, s[1] - (s[1] - s[0] - 4.7)/2) difference() { ring_band2d(STRIP_T3[1] - s[3], STRIP_T3[1]); strip_cut2d(s); }
}
// clip connectors on the strip ends (on the top run, next to the camera); cable leaves towards the camera
module placed_clips3() {
    for (c = CLIPS3) translate([c[0]*(CAM_KEEP[0] + c[2][0]/2), c[1], RING_Z1 + STRIP_T3[1] - c[2][2]/2]) cube([c[2][0], c[2][1], c[2][2]], center = true);
}
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
            shell2(top);
            for (j = J2) { cyl_y(POST_D, FR_BACK + CRUSH[1], D - BACK_T + 0.01, j[0], j[1]); crush_bumps(j); }
            power_holders();
            if (WING_POCKET) wing_pockets();
            cable_loops(); strain_clip();                          // v23: cable routing
        }
        if (WING_POCKET) for (p = WING_P) translate([p[0] - WING_SLOT/2, D - BACK_T - 1, p[1] - 4]) cube([WING_SLOT, BACK_T + 2, 14]);   // keep the slots open (9 wide)
        if (WING_POCKET) { wing_drains(); wing_slot_chamfers(); }
        if (WING_POCKET) for (p = WING_P) translate([p[0] - WING_PK[0], D - BACK_T - WING_PK[1], p[1] - 4 - WING_PK[2]]) cube([2*WING_PK[0], WING_PK[1] + 0.01, 14 + WING_PK[2] + WING_PK[4]]);   // nothing else inside a pocket
        for (j = J2) { cyl_y(6.4, SKIRT - 1, FR_BACK - CRUSH[0] - 0.01, j[0], j[1]); cyl_y(M3_CLR, FR_BACK - 1, D + 1, j[0], j[1]); cyl_y(M3_HEAD_CB, FR_BACK + 2, D + 1, j[0], j[1]); csk_y(M3_HEAD_CB, M3_CLR, FR_BACK + 2, j[0], j[1]); }
    }
}

module crush_bumps(j) for (i = [0 : CRUSH[2] - 1]) let(a = 90 + i*360/CRUSH[2])
    translate([j[0] + CRUSH[5]*cos(a), FR_BACK + CRUSH[1] + 0.01, j[1] + CRUSH[5]*sin(a)]) rotate([90, 0, 0])
        cylinder(d1 = CRUSH[3], d2 = CRUSH[4], h = CRUSH[0] + CRUSH[1] + 0.01, $fn = 16);

// ------------------------------------------------------------ cable routing ----
// v23 (Esben 24 Oct): one main bundle up the middle of the back wall, from the power inlet past the PSU and the WLED to a
// hand-over point under the mic core, and from there a service loop (about 100 mm slack) to the frame's upper cross bar, so
// the shell can lie beside the front with everything still plugged in. Loops take a cable tie or a 10 mm hook-and-loop strap
// (reusable for service). Until v22: 4 loops with a 6 x 1.8 slot, ties only.
// [x, z, dir]: "h" = the strap runs along x round a bundle that runs up/down, "v" = along z round a bundle that runs sideways
CABLE_LOOPS = [[0, 112, "h"], [0, 136, "h"],                  // main bundle; 136 = the shell end of the service loop
               [-80, 72, "h"], [-75, 112, "v"],                // left: reed, dimmer, WLED, speaker
               [-98, 205, "h"], [88, 100, "h"], [55, 158, "v"],    // 4G / IMU along the left wall, PSU on the right
               [42, 214, "v"]];                                    // v24: the IMU's branch goes round the right of the mic core (until v23
                                                                   // straight up the middle, over the mic core and right behind the Pi's fan)
LOOP = [10.4, 2.2, 1.6, 2.0, 5];          // tunnel width (strap 10), tunnel height (strap 2), bridge, side posts, length
module cable_loop(p) translate([p[0], D - BACK_T + 0.01, p[1]]) rotate([0, p[2] == "h" ? 0 : 90, 0]) difference() {
    translate([-LOOP[4]/2, -(LOOP[1] + LOOP[2]), -LOOP[0]/2 - LOOP[3]]) cube([LOOP[4], LOOP[1] + LOOP[2] + 0.01, LOOP[0] + 2*LOOP[3]]);
    translate([-LOOP[4]/2 - 1, -LOOP[1], -LOOP[0]/2]) cube([LOOP[4] + 2, LOOP[1] + 0.02, LOOP[0]]);
}
module cable_loops() for (p = CABLE_LOOPS) cable_loop(p);
// strain relief: a snap clip just above the power inlet holds the two leads from the jack (together up to Ø5.4), so a pull on
// the bundle never reaches the jack's terminals. It opens towards the front; the leads click in from the front.
STRAIN = [5.4, 1.6, 6, 3.8, 84];          // bore, wall, height (z), opening, z bottom
module strain_clip() translate([PWR_P[0], PWR_P[1], STRAIN[4]]) difference() {
    union() {
        cylinder(d = STRAIN[0] + 2*STRAIN[1], h = STRAIN[2], $fn = 40);
        translate([-3, 0, 0]) cube([6, D - BACK_T - PWR_P[1] + 0.01, STRAIN[2]]);
    }
    translate([0, 0, -1]) cylinder(d = STRAIN[0], h = STRAIN[2] + 2, $fn = 40);
    translate([-STRAIN[3]/2, -10, -1]) cube([STRAIN[3], 10, STRAIN[2] + 2]);
}
// the frame end of the service loop: two slots through a cross bar for one strap round the bundle. v24 (Esben 26 Oct: the Pi's
// fan stopped, there were wires in it): the slots move from the upper cross bar (above the fan, so the loop hung across it) to
// the lower one, below the Pi. The shell end stays at the main bundle's top loop (z 136), so the loop runs down from there and
// its slack hangs down in front of the 5 V supply, away from the fan. The fan also gets a guard (fan_guard).
FRAME_LOOP = [30, GC + DSP_XB_Z[1], 7.6];  // x, z centre (lower cross bar, z 62.5-78.5), slot spacing
module frame_loop_cut() for (dz = [-1, 1]) translate([FRAME_LOOP[0] - LOOP[0]/2, CH_BACK - 1, FRAME_LOOP[1] + dz*FRAME_LOOP[2]/2 - 1.2]) cube([LOOP[0], FR_T + 2, 2.4]);

// ------------------------------------------------------------ fan guard ----
// v24 (Esben 26 Oct: the Pi's fan stopped because of the wires in the box; it must have a fence so nothing can stop it). A
// separate print that stands on the Pi on its own 4 mounting holes, so its distance to the Active Cooler does not depend on
// the shell: 4 tubes round longer M2.5 screws (M2.5 x 25, through the tube and the Pi into the display's stand-offs) carry a
// grille FG[0] above the cooler. Over the fan the grille has 2.5 mm slots (air in, no wire through); along both long edges it
// stops 20.5 from the middle, so the GPIO header and its plugs (x +-24.5, z between the holes) stay free on either side.
// Prints face down (grille on the bed), the tubes stand up.
COOLER_TOP = PI_Y3 + PI_T + PI_COOLER[2];  // 32.45
PI_C = [0, GC + DSP_PI_DZ];               // Pi centre (x, z); holes at +-24.5, +-29
FAN_Z = PI_C[1] + 14;                     // fan axis z (the Active Cooler's fan sits towards the top holes)
FG = [3.0, 1.6, 2.5, 2.0, 15.5, 20.5];    // gap over the cooler, grille thickness, slot, bar, slotted r round the fan, half width between the holes
FG_FOOT = [5.6, 2.9];                     // tube Ø, screw clearance
FG_Y = COOLER_TOP + FG[0];
module fan_guard() {
    hz = [PI_C[1] - 29, PI_C[1] + 29];
    difference() {
        union() {
            ext_y(FG_Y, FG_Y + FG[1]) {
                translate([-FG[5], hz[0] - 2]) square([2*FG[5], hz[1] - hz[0] + 4]);
                for (z = hz) hull() for (sx = [-1, 1]) translate([sx*24.5, z]) circle(d = FG_FOOT[0] + 1, $fn = 32);
            }
            for (sx = [-1, 1], z = hz) cyl_y(FG_FOOT[0], PI_Y3 + PI_T, FG_Y + 0.01, sx*24.5, z);
        }
        for (sx = [-1, 1], z = hz) cyl_y(FG_FOOT[1], PI_Y3, FG_Y + FG[1] + 1, sx*24.5, z);
        ext_y(FG_Y - 1, FG_Y + FG[1] + 1) intersection() {
            translate([0, FAN_Z]) circle(r = FG[4], $fn = 64);
            for (i = [-4:4]) translate([i*(FG[2] + FG[3]) - FG[2]/2, FAN_Z - FG[4]]) square([FG[2], 2*FG[4]]);
        }
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
    color(C_BODY) fan_guard();
    color(C_BODY) shell3();
    placed_power3();
    placed_electronics();
    placed_services();
}

// ------------------------------------------- single parts for the renders ----
if (VIEW == "x_shell")     shell2();
if (VIEW == "x_camera")    placed_camera();
// one mesh per component for the 3D viewer (admin → Hardware); cables are drawn by hardware/render/gen2_viewer.py
module screw_y(d, l, head, x, y, z, dir = 1) { translate([x, y, z]) rotate([dir > 0 ? -90 : 90, 0, 0]) { translate([0, 0, -head[1]]) cylinder(d = head[0], h = head[1], $fn = 24); cylinder(d = d, h = l, $fn = 16); } }
if (VIEW == "c_4g")        back_part(HAT4G_P, HAT4G, "red");
if (VIEW == "c_mcore")     back_part(MCORE_P, MCORE, "red");
if (VIEW == "c_imu")       back_part(IMU_P, IMU, "red");
if (VIEW == "c_mics")      translate([-MSTRIP[0]/2, MSTRIP_Y - MSTRIP[1]/2, WALL - MIC_POCKET[2] + MIC_RING[2]]) cube(MSTRIP);
if (VIEW == "c_reed")      { back_part(REED_P, REED, "red"); translate([LOCK_X, LOCK_SY, LOCK_TZ[1] - 3]) cylinder(d = 8, h = 3, $fn = 24); }
if (VIEW == "c_speaker")   speaker3();
if (VIEW == "c_jack")      power_inlet();
// screws: 4 front (3.0 x 14 thread-forming, heads in the back wall), 4 camera (M2 x 6), 1 lock (4 x 25 Torx pin)
if (VIEW == "s_camera")    for (h = CAM_HOLES_ROT) screw_y(2, 6, [3.8, 1.3], h[0], CAM_PCB_Y + CAM_PCB[2], LENS_Z + h[1], -1);
if (VIEW == "s_lock")      translate([LOCK_X, LOCK_SY, LOCK_HEAD[1]]) { cylinder(d1 = 8.1, d2 = 4.2, h = 1.95, $fn = 24); cylinder(d = 4.2, h = 25, $fn = 16); }
if (VIEW == "x_elec")      { placed_electronics(); placed_services(); }
if (VIEW == "x_cleat")     wall_cleat2();
if (VIEW == "x_stand")     stand_bracket();
if (VIEW == "x_stand_logo_w") st_logo("white");
if (VIEW == "x_stand_logo_g") st_logo("green");
if (VIEW == "x_tnut")      translate([ST_NUT[0], ST_NUT[1], -ST_SHELF[2]]) { cyl_z(TNUT[0], 0, TNUT[1] + 1.5, 0, 0); cyl_z(TNUT[2] - 0.5, TNUT[1], TNUT[1] + 1.5, 0, 0); }


// v2c meshes
if (VIEW == "x_front3")    front3();
if (VIEW == "x_logo_w")    logo_inlay("white");
if (VIEW == "x_logo_g")    logo_inlay("green");
if (VIEW == "x_ring3")     ring3();
if (VIEW == "x_frame3")    frame3();
if (VIEW == "x_strip_w")   placed_strips3("w");
if (VIEW == "x_strip_rgb") placed_strips3("rgb");
if (VIEW == "x_display3")  placed_display3();
if (VIEW == "x_seal")      seal_cords();                                                  // v20: every seal cord, squeezed
if (VIEW == "x_camglass")  cam_glass();
if (VIEW == "x_camsleeve") cam_sleeve();
if (VIEW == "x_fanguard")  fan_guard();                                                   // v24
if (VIEW == "s_fanguard")  for (sx = [-1, 1], sz = [-1, 1]) screw_y(2.5, 25, [4.5, 1.8], sx*24.5, FG_Y + FG[1], PI_C[1] + sz*29, -1);
if (VIEW == "x_tema_top")   theme_top_demo();                                             // v21: example theme parts on the hooks
if (VIEW == "x_tema_vinge_v") theme_wing_demo(-1);
if (VIEW == "x_tema_vinge_h") theme_wing_demo(1);
if (VIEW == "c_tema_demo")  { main_unit(); color("orange") { theme_top_demo(); theme_wing_demo(-1); theme_wing_demo(1); } }
if (VIEW == "p_camsleeve") translate([0, 0, CAM_SLV_Y[1]]) rotate([-90, 0, 0]) translate([0, 0, -LENS_Z]) cam_sleeve();   // holder end down
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
if (VIEW == "c_wled")      placed_wled();
if (VIEW == "x_wled_holder") intersection() { shell3(); wled_frame() translate([-10, -15, -5]) cube([WLED_B[0] + 20, WLED_B[1] + 30, 40]); }
if (VIEW == "c_mosfet")    translate([-(HW - WALL) + 1.2, MOSF_P[0], MOSF_P[1]]) cube([MOSF[2], MOSF[1], MOSF[0]]);
if (VIEW == "x_shell3")    shell3();
if (VIEW == "s_front3")    for (j = J2) screw_y(3, 15, [6, 2.3], j[0], FR_BACK + 2, j[1], -1);
if (VIEW == "s_display")   for (sx = [-1, 1], z = DSP_TAB_Z) screw_y(2.5, 4, [4.5, 1.8], sx*DSP_TAB_X, TAB_Y + DSP_FLOOR - PRELOAD, GC + z, -1);   // v16: M2.5 x 4, head on the 1.6 mm floor
if (VIEW == "p_front3")    rotate([90, 0, 0]) front3();                                   // face down
if (VIEW == "p_ring3")     translate([0, 0, -RING_Y[0]]) rotate([90, 0, 0]) ring3();     // face down
if (VIEW == "p_frame3")    translate([0, 0, FR_BACK]) rotate([-90, 0, 0]) frame3();      // flat back down
if (VIEW == "info3") echo(J2 = J2, GLASS_Y3 = GLASS_Y3, TAB_Y = TAB_Y, PI_Y3 = PI_Y3, CAM_END = CAM_END, CH_BACK = CH_BACK, FR_BACK = CH_BACK + FR_T, CAM_PCB_Y = CAM_PCB_Y);


// ----------------------------------------------------------------- views ----
// print-ready, oriented for the bed (H2C): openscad -D 'VIEW="p_shell"' -o shell.stl gen2_concept.scad
if (VIEW == "p_cleat")    translate([0, 0, D + GAP_WALL]) rotate([-90, 0, 0]) wall_cleat2(); // wall face down
// stand bracket: back face down (logo in the first layers), the shelf stands up
if (VIEW == "p_stand")        translate([0, 0, D + GAP_WALL]) rotate([-90, 0, 0]) stand_bracket();
if (VIEW == "p_stand_logo_w") translate([0, 0, D + GAP_WALL]) rotate([-90, 0, 0]) st_logo("white");
if (VIEW == "p_stand_logo_g") translate([0, 0, D + GAP_WALL]) rotate([-90, 0, 0]) st_logo("green");
if (VIEW == "p_shell3")   translate([0, -H/2, D]) rotate([-90, 0, 0]) shell3();          // back down, centred (as the released skal.stl)
if (VIEW == "main") main_unit();
if (VIEW == "info") echo(W = W, H = H, R = R, BORDER = BORDER, RUN_V = RUN_V, RUN_H = RUN_H, RUN_T = RUN_T, JOINTS = JOINTS, WING_P = WING_P);
if (VIEW == "c_clips")     placed_clips3();
