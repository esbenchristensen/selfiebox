// ============================================================================
//  SELFIEBOX HALO gen 2: the main unit, 224.5 x 307 x 70 (room for 4G and a mic array).
//  No printer under the box (Esben 22 Oct): the printer stands on its own (selfi_printer_v*.scad).
//
//  1:1 concentric outline (Halo rule 1-3, see the "Apples designprincipper"
//  doc): one master curve, the light ring's centre line with continuous-
//  curvature corners, and every outline of the face is an exact offset of it.
//  The border from box edge to light ring is the same 7.8 mm on all sides.
//
//  Fastening without visible screws: the 4 side screws of rev G are gone. Four screws (v27: 4.0 x 50 T20,
//  until v26 3.0 mm thread-forming) from the back, in the 4 corners, run through shell posts and the
//  frame into bosses in the front (J2). Theme parts hook into closed pockets in the back
//  wall (v21). No inserts. v27 (Esben 27 Oct): no glass and no seals anywhere (v20-v26 had a seal cord in 4 joints and a
//  glass in front of the camera); every opening is shaped so water runs back out, see "weather" and "v27: no seals" below.
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
// v27: no cord any more; the channel keeps this width, so the box, the frame and the ring keep their sizes.
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
// camera (Esben 19 Oct, Wide chosen). v20-v26 had a small glass window in front of the lens (lens tip 3.1 behind the face in
// v24-v26). v27 (Esben 27 Oct: no glass, and no big hole either, the camera must stay protected): the window is a plain
// Ø8.6 bore round the lens barrel and the camera sits 1.95 further forward, so the lens tip is 1.15 inside the bore and the
// Wide lens's 120 deg field of view clears the bore's edge at the face (see cam_window_cut). Nothing is in front of the lens.
CAM_TIP_Y = 1.15;  // lens tip behind the front face (v24-v26: 3.1, 1.0 behind the glass; v19: 0.3)

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
        both_locks() lock_cut();
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
IMU   = [17.8, 25.4, 4.6];  IMU_P = [80, 135];   // v36 (Esben 30 Oct, samlenoter 2): from [-8.9, 205], 3 mm over the mic core's USB-C / aux edge,
                                                 // to the free right side above the 5 V supply's lane (nothing within 10 mm but the wing pocket's wall)
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
    color([0.15, 0.15, 0.15]) mcore_model();
    back_part(IMU_P, IMU, [0.1, 0.1, 0.4]);
    color([0.15, 0.15, 0.15]) translate([-MSTRIP[0]/2, MSTRIP_Y - MSTRIP[1]/2, WALL - MIC_POCKET[2] + MIC_RING[2]]) cube(MSTRIP);
    back_part(REED_P, REED, [0.1, 0.3, 0.6]);
}
// snap trays, no screws; the mic strip sits on two pegs in its floor pocket
module electronics_holders() {
    for (q = [[HAT4G_P, HAT4G], [IMU_P, IMU]])
        translate([q[0][0], D - BACK_T + 0.01, q[0][1]]) rotate([90, 0, 0]) cradle2([q[1][0], q[1][1], q[1][2]], BOARD_LIP);
    translate([MCORE_P[0], D - BACK_T + 0.01, MCORE_P[1]]) rotate([90, 0, 0]) mcore_cradle();
    for (sx = [-1, 1]) cyl_z(MIC_PEG[0], WALL - MIC_POCKET[2] - 0.01, MIC_PEG[3], sx*MIC_PEG[1], MSTRIP_Y);   // v9: up to 0.6 under the front, so the board cannot lift off
    // reed module tray just above the lock tongue (reed glass at the bottom edge): lifting the box off the cleat moves the magnet away
    translate([REED_P[0], D - BACK_T + 0.01, REED_P[1]]) rotate([90, 0, 0]) cradle2([REED[0], REED[1], REED[2]], BOARD_LIP);
}

// v24 (Esben 26 Oct, first assembly: the tray's walls were too high and the aux jack, on the USB-C edge, sticks out). Until v24 the
// tray was the generic cradle2 with the lips 12.2 over the floor, on top of the tallest parts; the board itself is 1.2 thick
// (Seeed DXF, hardware/datablade/halo-gen2-v2_respeaker_flex_coreboard_2d.dxf) with through-hole pins 2.1 under it. Now it
// stands on 4 pads round its own M3 holes (pins clear), Ø3 pegs through the holes locate it, and the lips catch the PCB's top
// face. Parts side to the front, FPC edge down, so the USB-C (1.4 over the edge) and the 3.5 mm jack (1.7 over) are on the top
// edge; the top wall is cut down to the PCB there. The short ends (pin header, XIAO's USB-C) only have low stops. Positions
// in the tray's x (from the left seen from the front, the DXF turned 180 deg).
MC_PAD = [6, 2.6];                         // pad Ø, height (pins 2.1 under the board)
MC_HOLES = [[4, 4], [66.5, 4], [4, 48.2], [66.5, 48.2]];
MC_NOTCH = [[6, 18.5], [30.5, 42.5]];      // top wall cut to the PCB: aux jack 8.4-16.1, USB-C 32-41.1
// v36 (Esben 30 Oct, samlenoter 2): the lips stopped the board going down (he cut them off: the 4 pegs and the walls hold it), and
// the aux jack did not fit with the board the drawn way round. No lips now, and both long walls are cut down to the PCB at the
// aux, USB-C and FPC places for either way round (the notches mirrored), so the board fits whichever way its jacks really are.
MC_CUTS = [[6, 18.5], [25.4, 45.4], [52.3, 64.8]];   // tray x, both long walls
MC_LIPS = [[[21.5, 5.5], [44, 7.5]], [[19, 11], [62.5, 7]]];   // [x, length]: bottom (FPC) wall, top wall, clear of the edge parts
// the board on its pads for the fit check: the 1.2 PCB with its 4 holes, and the parts (up to 9 over it) 1.4 in from the long
// edges, where the lips catch the PCB (the DXF has no parts there at the lips' places)
module mcore_model() translate([MCORE_P[0], D - BACK_T + 0.01, MCORE_P[1]]) rotate([90, 0, 0]) translate([0.15, 0.15, 1.2 + MC_PAD[1]]) {
    difference() { cube([MCORE[0], MCORE[1], 1.2]); for (h = MC_HOLES) translate([h[0], h[1], -1]) cylinder(d = 3.3, h = 4, $fn = 24); }
    translate([6, 1.4, 1.2]) cube([MCORE[0] - 12, MCORE[1] - 2.8, 9]);
}
module mcore_cradle() {
    sz = MCORE;  t = MC_PAD[1] + 1.2;  fl = 1.2;  hgt = fl + t + 0.1 + BOARD_LIP[3] + 0.3;  pcb = fl + t;
    difference() {
        translate([-1.6, -1.6, 0]) cube([sz[0] + 3.2, sz[1] + 3.2, hgt]);
        translate([0, 0, fl]) cube([sz[0] + 0.3, sz[1] + 0.3, hgt + 1]);
        for (sx = [0, 1]) translate([sx > 0 ? sz[0] + 0.3 - 0.01 : -2, -2, pcb - 0.2]) cube([2.01, sz[1] + 4.3, hgt]);   // low ends
        for (n = MC_CUTS, sy = [0, 1]) translate([n[0], sy > 0 ? sz[1] - 1 : -2, pcb]) cube([n[1] - n[0], 4, hgt]);   // v36: both walls
        translate([sz[0]/2 - 10 + 0.15, -2, fl]) cube([20, 4, hgt]);                 // FPC socket
    }
    for (h = MC_HOLES) translate([h[0] + 0.15, h[1] + 0.15, fl - 0.01]) {
        cylinder(d = MC_PAD[0], h = MC_PAD[1] + 0.01, $fn = 32);
        cylinder(d = 3.0, h = MC_PAD[1] + 1.2 + 1.5, $fn = 24);
    }
    // v36: no lips (v24-v35: MC_LIPS)
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
// v25 (Esben 27 Oct): a second lock in the other bottom corner: tongue, slot, pocket, drain, floor boss and security screw.
// The corner there is tight: the 5 V supply's tray wall stands at x 74.2 and the box's 42.8 corner radius rises from x 68.5,
// so the right tongue is 12 wide (left: 18) at x +84, and both tongues are clipped 0.5 inside the shell's inner corner.
// The reed magnet stays in the left tongue only. Lock geometry below uses $lx / $lw, set per lock by both_locks().
// v25 (Esben 27 Oct): the box sits close to the wall, so no fingers get in behind it to pull, and it looks stuck to the wall.
// Until v24 the back stood 14 off the wall (cleat plate 4 + 10 air); now 4.5: the box's back 0.5 off the cleat plate, which
// stays 4 thick. The theme straps behind the box go from 9-10 to 3.9 thick (0.2 off the back and 0.4 off the wall).
GAP_WALL = 4.5;                                 // = PLATE_T + 0.5; a number, since halo.scad sets PLATE_T after GAP_WALL
LOCKS = [[LOCK_X, LOCK_W], [84, 12]];   // [x, tongue width]
$lx = LOCK_X;  $lw = LOCK_W;
module both_locks() for (l = LOCKS) { $lx = l[0]; $lw = l[1]; children(); }
module tongue_clip(y0, y1) ext_y(y0, y1) translate([0, WALL + 0.5]) rr(W - 2*(WALL + 0.5), H, R - WALL - 0.5);
module lock_cut() {
    c = LOCK_C[0];  e = LOCK_C[1];
    translate([$lx - $lw/2 - c, D - BACK_T - 1, LOCK_TZ[0] - 0.4]) cube([$lw + 2*c, BACK_T + 2, LOCK_TZ[1] - LOCK_TZ[0] + 1.0]);
    hull() {   // lead-in round the slot's mouth
        translate([$lx - $lw/2 - c, D - 0.01, LOCK_TZ[0] - 0.4]) cube([$lw + 2*c, 0.02, LOCK_TZ[1] - LOCK_TZ[0] + 1.0]);
        translate([$lx - $lw/2 - c - e, D + 0.01, LOCK_TZ[0] - 0.4 - e]) cube([$lw + 2*c + 2*e, 0.02, LOCK_TZ[1] - LOCK_TZ[0] + 1.0 + 2*e]);
    }
    cyl_z(4.5, -1, LOCK_TZ[0], $lx, LOCK_SY);
    cyl_z(LOCK_HEAD[0], -1, LOCK_HEAD[1], $lx, LOCK_SY);
    translate([$lx, LOCK_SY, LOCK_HEAD[1] - 0.01]) cylinder(d1 = LOCK_HEAD[0], d2 = 4.4, h = (LOCK_HEAD[0] - 4.4)/2, $fn = 32);   // 90° countersink
}
// v26 (print review 27 Oct): the plate behind each tongue reaches 2 mm above the tongue's top. Until v25 it stopped at z0 + 16,
// so the tongue's upper 12 mm stood on nothing but the plate's edge: printed back face down, that was a 9 x 18 (12) mm flat
// overhang 4 mm over the bed, which sags without support. Now the whole tongue grows out of the plate.
module lock_plate2d(z0) translate([$lx, (z0 - 8 + LOCK_TZ[1] + 2)/2]) rrc($lw + 8, LOCK_TZ[1] + 2 - (z0 - 8), 6);
// v28 (Esben 27 Oct, from the 3D model: "bagbeslaget stikker ud i bunden og kan ses lidt forfra"): the arms out to the locks
// ended in lock_plate2d, 0.3 above the floor and 95 out, so their lower outer corners stood outside the box's round bottom
// corners and showed from the front. The arms (wall cleat and stand bracket) are now clipped CLEAT_IN inside the box's
// outline; the tongues still grow out of the plate along their whole length (outline 1.3 below the tongue at its corner).
CLEAT_IN = 1.5;
module arm_clip(y0, y1) ext_y(y0, y1) translate([0, CLEAT_IN]) rr(W - 2*CLEAT_IN, H - 2*CLEAT_IN, R - CLEAT_IN);
module lock_arm(z0, yb) intersection() { ext_y(yb, yb + PLATE_T) hull() { translate([0, 40]) rrc(60, 20, 6); lock_plate2d(z0); } arm_clip(yb - 1, yb + PLATE_T + 1); }
// v28 (Esben 27 Oct): one wall screw in each arm, out towards the lock, so the corner that takes the lock is held to the wall
// too (until v27 only the 4 holes in the bar and the spine). Every hole now has a real 90 deg countersink in the face
// towards the box: until v27 halo.scad's cone started 0.6 inside the plate, so the face was only Ø6.2 and a 4.0 x 50
// head (Ø7.75) stood 0.8 proud, more than the 0.5 to the box since v25. Now the head lies 0.4 below the face.
CLEAT_HOLES = [[-48, CLEAT_ZC - 32], [48, CLEAT_ZC - 32], [0, 70], [0, 125], [-60, 24], [60, 24]];
CLEAT_CSK = 8.6;
module cleat_hole(p, yb) {
    cyl_y(5, yb - 1, yb + PLATE_T + 1, p[0], p[1]);
    translate([p[0], yb - 0.01, p[1]]) rotate([-90, 0, 0]) cylinder(d1 = CLEAT_CSK, d2 = 5, h = (CLEAT_CSK - 5)/2 + 0.01, $fn = 32);
}
module wall_cleat2() {
    yb = D + GAP_WALL - PLATE_T;
    difference() {
        union() {
            wall_cleat();
            both_locks() {
                lock_arm(LOCK_TZ[0], yb);
                intersection() {
                    union() {
                        translate([$lx - $lw/2, LOCK_Y, LOCK_TZ[0]]) cube([$lw, yb - LOCK_Y + 0.01, LOCK_TZ[1] - LOCK_TZ[0]]);
                        // root fillet where the tongue meets the plate
                        translate([$lx - $lw/2, yb + 0.01, LOCK_TZ[0]]) rotate([0, 90, 0]) linear_extrude($lw) polygon([[0, 0], [-(LOCK_TZ[1] - LOCK_TZ[0]), 0], [0, -6]]);
                    }
                    tongue_clip(LOCK_Y - 1, D - BACK_T);   // inside the box only; through the wall and behind it the tongue is whole
                }
                translate([$lx - $lw/2, D - BACK_T - 0.01, LOCK_TZ[0]]) cube([$lw, yb - D + BACK_T + 0.02, LOCK_TZ[1] - LOCK_TZ[0]]);
            }
        }
        both_locks() cyl_z(3.4, LOCK_TZ[0] - 1, LOCK_TZ[1] - 4.4, $lx, LOCK_SY);   // pilot for the security screw
        cyl_z(8.2, LOCK_TZ[1] - 3.4, LOCK_TZ[1] + 1, LOCK_X, LOCK_SY);           // magnet pocket Ø8 x 3 (press fit), left tongue only
        both_locks() lock_nose_cut();
        for (p = CLEAT_HOLES) cleat_hole(p, yb);
    }
}
// the 6 wall screws (4.0 x 50 countersunk T20, head Ø7.75, 90 deg) as fitted, for the fit check against the box's back
module wall_screws() for (p = CLEAT_HOLES) translate([p[0], D + GAP_WALL - PLATE_T + 0.4, p[1]]) rotate([-90, 0, 0]) {
    cylinder(d1 = 7.75, d2 = 3.77, h = (7.75 - 3.77)/2, $fn = 32); cylinder(d = 3.77, h = 50, $fn = 16);
}
// v24: 45 deg chamfer on the tongue's lower front edge, so it rides over the boss's edge when the box swings in
module lock_nose_cut(z0 = LOCK_TZ[0]) translate([$lx - $lw/2 - 1, LOCK_Y, z0]) rotate([90, 0, 90]) linear_extrude($lw + 2)
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
// selfi-stativbeslag-v2 (Esben 27 Oct, for v24 boxes): v1 had the old lock tongue (10 mm above the floor boss, the box lowered
// 9 mm onto it) and 2 pins in the dowel holes. A v24 box goes on like on the wall: top hooked on the bar with the bottom held
// out, then the bottom swings in level. The pins would stop that, so they are gone; the tongue in its slot (0.2 per side)
// and the bar already stop the box turning or sliding. On the stand the box stands on the shelf, so the tongue goes down to
// 0.1 above the boss (wall cleat: 0.3): the security screw clamps the boss to the tongue and the box stays on the shelf.
// selfi-stativbeslag-v3 (Esben 27 Oct, for v25 boxes): 2 tongues like the v25 wall cleat (the right one 12 wide, magnet in the
// left only), and the box 0.5 off the plate (GAP_WALL 4.5), so the gussets and spacers in the old 14 mm gap are gone.
// selfi-stativbeslag-v4 (print review 27 Oct, for v25/v26 boxes, same fit as v3): the plate carries the whole of both tongues
// (lock_plate2d, as the v26 wall cleat; v3's tongues hung 9 mm over the plate's edge on the bed) and the T-nut bores are teardrops.
// selfi-stativbeslag-v5 (Esben 27 Oct, for v28 boxes, also fits v25-v27): the arms out to the locks are clipped 1.5 inside the
// box's outline like the v28 wall cleat (v4's lower corners stood out of the box's round bottom corners and showed from the front),
// and the logo panel is 172 wide (v4: 180 touched the theme top's straps, 10 wide since v25).
ST_TZ0 = LOCK_BOSS[1] + 0.1;
ST_SHELF = [24, 20.5, 14];          // half width, front edge (y), thickness under the unit
ST_NUT = [0, 31];                   // tripod screw axis (x, y)
TNUT = [8.0, 8.0, 20.0];            // [C] 1/4"-20 T-nut: barrel Ø, barrel length, flange Ø (+0.5 clearance); measure the bought part
ST_SLOT = [8, 50];                  // power plug slot: half width, front edge (y); open to the plate
ST_PANEL = [172, 58, 8, 17];        // logo panel: width, height, corner r, gap to the unit's top. v20+ unit is 307 high: bracket 304 (H2C bed 306). v5: 172 wide (v1-v4: 180), 3.9 mm to the theme top's straps (|x| >= 89.9 since v25's 10 wide straps; v4's panel overlapped them by 0.1)
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
            ext_y(yb, yf) translate([0, CLEAT_ZC - 14]) rrc(CLEAT_L + 4, 52, 6);
            both_locks() lock_arm(ST_TZ0, yb);   // v5: clipped inside the box's outline (v1-v4 stood out at the bottom corners)
            ext_x(-CLEAT_L/2 + 2, CLEAT_L/2 - 2) bar_2d(yb);
            if (yb - D > 2) for (z = [40, 100]) translate([-25, D + 1, z - 5]) cube([50, yb - D - 0.99, 10]);
            both_locks() {
                intersection() {
                    union() {
                        translate([$lx - $lw/2, LOCK_Y, ST_TZ0]) cube([$lw, yb - LOCK_Y + 0.01, LOCK_TZ[1] - ST_TZ0]);
                        translate([$lx - $lw/2, yb + 0.01, ST_TZ0]) rotate([0, 90, 0]) linear_extrude($lw) polygon([[0, 0], [-(LOCK_TZ[1] - ST_TZ0), 0], [0, -6]]);
                    }
                    tongue_clip(LOCK_Y - 1, D - BACK_T);
                }
                translate([$lx - $lw/2, D - BACK_T - 0.01, ST_TZ0]) cube([$lw, yb - D + BACK_T + 0.02, LOCK_TZ[1] - ST_TZ0]);
            }
            // logo panel and spine
            ext_y(yb, yf) { translate([0, ST_LOGO_Z]) rrc(ST_PANEL[0], ST_PANEL[1], ST_PANEL[2]); translate([0, (zs + CLEAT_ZC)/2]) rrc(ST_SPINE, CLEAT_ZC - zs, 6); }
            // shelf under the unit, rounded front corners
            translate([0, 0, zs]) linear_extrude(ST_SHELF[2]) hull() {
                for (sx = [-1, 1]) translate([sx*(ST_SHELF[0] - 6), ST_SHELF[1] + 6]) circle(r = 6, $fn = 32);
                translate([-ST_SPINE/2, yb]) square([ST_SPINE, PLATE_T]);
            }
            // gussets in the gap behind the unit, beside the plug slot (until v2; v3's gap is 0.5)
            if (yb - D > 2) for (sx = [-1, 1]) translate([sx*(ST_SLOT[0] + 9) - 4, D + 0.5, -0.01]) rotate([90, 0, 90]) linear_extrude(8)
                polygon([[0, 0], [yb - D - 0.5 + 0.01, 0], [yb - D - 0.5 + 0.01, 40]]);
        }
        both_locks() cyl_z(3.4, ST_TZ0 - 1, LOCK_TZ[1] - 4.4, $lx, LOCK_SY);   // pilot for the security screw
        cyl_z(8.2, LOCK_TZ[1] - 3.4, LOCK_TZ[1] + 1, LOCK_X, LOCK_SY);           // magnet pocket Ø8 x 3 (press fit), left tongue only
        both_locks() lock_nose_cut(ST_TZ0);
        // v4 (print review 27 Oct): the bracket prints back face down, so these bores lie along the bed; teardrops with a 45 deg
        // peak to the front (up on the bed) keep the Ø20 flange seat round and free of support (v1-v3: round, the roof sagged)
        translate([ST_NUT[0], ST_NUT[1], 0]) teardrop_z(TNUT[0] + 0.3, zs - 1, 1);   // T-nut barrel, flush with the underside
        translate([ST_NUT[0], ST_NUT[1], 0]) teardrop_z(TNUT[2], zs + TNUT[1], 1);    // flange seat; the unit closes it
        translate([-ST_SLOT[0], ST_SLOT[1], zs - 1]) cube([2*ST_SLOT[0], yb - ST_SLOT[1] + 0.01, ST_SHELF[2] + 2]);   // power plug
        translate([0, ST_SLOT[1], zs - 1]) cylinder(r = ST_SLOT[0], h = ST_SHELF[2] + 2, $fn = 32);
        ext_y(yf - LOGO_D, yf + 1) translate([0, ST_LOGO_Z]) st_logo2d("all");   // pocket for the inlay
    }
}

// ------------------------------------------------------------------ weather ----
// Rain, sleet and spills from any side under a light roof, with no added parts: no gaskets, membranes, glass or glue
// (Esben 19 Oct, and again 27 Oct for v27: v20-v26's seal cords and camera glass are gone, they made the box too hard to
// assemble). Every opening is shaped so water runs back out.
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
// camera: the front's shroud round the lens holder, from the front plate to just short of the camera board, keeps the
// camera bay apart from the light channel. v27: no loose sleeve in it any more (v20-v26 had one to press the glass's cord).
// v24: the bay is 0.8 wider than the lens holder each side (v20-v23: 0.4), so the board always lies flat on its 4 bosses
CAM_BAY = CAM_HOLDER + 1.6;
// v24 (Esben 27 Oct: make sure the camera lies flat): the shroud's walls stop 1.2 in front of the board (v14-v23: 0.6), and
// 2.0 where they cross the flat sensor flex under the lens holder (Raspberry Pi drawing: 8.9 wide, 7.3 out from the holder,
// towards the edge away from the ribbon, -x here). Only the 4 bosses round the holes touch the board's front.
CAM_SHR_GAP = [1.2, 2.0];                  // walls to the board; over the sensor flex
CAM_FLEX = [8.9, 7.3];                     // sensor flex below the holder: width, reach from the holder
module cam_shroud() translate([0, 0, LENS_Z]) difference() {
    ext_y(PT - 0.01, CAM_PCB_Y - CAM_SHR_GAP[0]) square(CAM_BAY + 2.4, center = true);
    ext_y(PT - 1, CAM_PCB_Y) square(CAM_BAY, center = true);
    translate([-CAM_HOLDER/2 - CAM_FLEX[1] - 1, CAM_PCB_Y - CAM_SHR_GAP[1], -CAM_FLEX[0]/2 - 2.5]) cube([CAM_FLEX[1] + 1, CAM_SHR_GAP[1] + 1, CAM_FLEX[0] + 5]);   // 1.45 off centre in the drawing: either way round
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
    // v26 (print review 27 Oct): the hood stops 1.5 short of the back wall (air out that way too), so on the bed (back face
    // down) its first layers hung 1.5 over the back wall, held only by the floor: two 8.6 mm cantilevers and a 43 mm roof
    // edge between their tips. 3 small posts across the gap, at the roof's two corners and its middle, make that a set of
    // short bridges (the side walls 8.6, the roof 2 x 20). They block 3 x 1.6 x 1.5 of the gap.
    for (x = [x0 - HOOD[1], (x0 + x1 - HOOD[1])/2, x1]) translate([sx > 0 ? x : -x - HOOD[1], y1 - 0.01, WALL + HOOD[0]])
        cube([HOOD[1], D - BACK_T - y1 + 0.02, HOOD[1]]);
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
// v24-v35 had a closed square column for the Conrad socket (14.6 cavity, 2 snap fingers): see v36 below power_column().
PWR_MOUTH = 38;                                 // socket mouth z: plug space below it
PWR_BORE = 12.5;                                // plug bore Ø
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
    for (h = spk_holes()) cyl_y(2, D - BACK_T - 1, D + 1, SPK_P[0] + h[0], SPK_P[1] + h[1]);   // v27: no seal groove round it (v20-v26)
    both_locks() cyl_z(2, -1, 12, $lx - $lw/2 + 1.0, LOCK_DRAIN[1]);   // v20: drain out of the lock pocket; v21: up to z 12 (the rounded bottom makes the floor ~6 thick here, so v20 stopped at 4, blind)
}
function spk_holes() = [for (i = [-6:6], j = [-5:5]) let(x = 3.5*i + (j % 2 ? 1.75 : 0), z = 3.03*j) if (pow(x/17.5, 2) + pow(z/11.8, 2) < 1) [x, z]];   // inside the 38.5 x 27 opening
module services_add() {
    vent_hoods();
    // floor boss under the lock screw head
    both_locks() difference() {
        cyl_z(LOCK_BOSS[0], WALL - 0.01, LOCK_BOSS[1], $lx, LOCK_SY);
        cyl_z(4.5, -1, LOCK_BOSS[1] + 1, $lx, LOCK_SY);
        translate([$lx - $lw/2 - 0.6, D - BACK_T - 0.01, 0]) cube([$lw + 1.2, 5, 20]);
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
            translate([0, sz > 0 ? 0 : 1.5, SPK_FL - 0.02]) snap_lip(12, 1.2, 1.6, sz > 0 ? 1 : 0);   // v21: no play (v17-v20: 0.1), the flange lies fully on the wall
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
module teardrop_z(d, z0, z1, x = 0, y = 0) translate([x, y, z0]) linear_extrude(z1 - z0) hull() {
    circle(d = d, $fn = 48); translate([0, -d/2*sqrt(2)]) square(0.01, center = true); }
// v36 (Esben 30 Oct, samlenoter 6/6b): the socket he has is not the Conrad DC-13F the column was drawn for. It is the common
// "DC female with screw terminal": barrel in front, a square ribbed body, the green 2-pole terminal at the back end with its screws
// on one face, standing ~1 mm over it. [M] Esben: 11.92 face to back (13 with the terminal), 37.96 from the mouth to the terminal's
// back; [M] width 14.25 (dictated, read back as "1/4 mm"). It could not go down the 14.6 square cavity past the catches, and a strain
// clip 9 mm over the column sat on its axis. Now the column is a channel open to the front: the socket goes in from the front with
// its screws facing the opening (the leads can be screwed in with it in place), its body stands on two side ledges, a bar behind
// the terminal's wire entries stops it when the plug is pushed in from below, and two lips on the channel's front edges hold it in.
// The barrel's length is not measured: the ledges assume >= 10 (a longer barrel just reaches further down the plug bore).
PWR_JACK = [14.25, 11.92, 13.0, 37.96, 10];     // width, body face-to-back, with the terminal, mouth to terminal back, barrel length (est.)
PWR_CH = [PWR_JACK[0] + 0.5, 2.0, 1.4, 3.5];    // channel width, side wall, ledge reach, bar depth (behind the wire entries)
PWR_BACK = D - BACK_T - 1.0;                    // the body's back face: 1 mm of column wall in front of the back wall
PWR_LEDGE = PWR_MOUTH + PWR_JACK[4];            // 48: the body stands here
PWR_JTOP = PWR_LEDGE + PWR_JACK[3] - PWR_JACK[4];   // 75.96 with a 10 mm barrel: the terminal's back end
PWR_TOP = PWR_JTOP + 0.3 + 2.5;                 // column top (the bar)
module power_column() translate([PWR_P[0], 0, 0]) {
    w = PWR_CH[0]/2;  t = PWR_CH[1];  yf = PWR_BACK - PWR_JACK[2] - 0.4;   // side walls' front edge
    difference() {
        union() {
            translate([-w - t, PWR_P[1] - PWR_BORE/2*sqrt(2) - 2, WALL - 0.01]) cube([2*(w + t), D - BACK_T - (PWR_P[1] - PWR_BORE/2*sqrt(2) - 2) + 0.01, PWR_MOUTH - WALL + 0.01]);   // closed foot round the plug bore (2 in front of the teardrop's peak)
            for (sx = [-1, 1]) translate([sx > 0 ? w : -w - t, yf, WALL - 0.01]) cube([t, D - BACK_T - yf + 0.01, PWR_TOP - WALL]);              // side walls
            translate([-w - 0.01, PWR_BACK, WALL - 0.01]) cube([2*w + 0.02, D - BACK_T - PWR_BACK + 0.01, PWR_TOP - WALL]);                       // back
            for (sx = [-1, 1]) translate([sx > 0 ? w - PWR_CH[2] : -w, PWR_P[1] - PWR_JACK[1]/2, PWR_LEDGE - 4]) cube([PWR_CH[2] + 0.01, PWR_BACK - PWR_P[1] + PWR_JACK[1]/2 + 0.01, 4]);   // ledges
            translate([-w - 0.01, PWR_BACK - PWR_CH[3], PWR_JTOP + 0.3]) cube([2*w + 0.02, PWR_CH[3] + 0.01, PWR_TOP - PWR_JTOP - 0.3]);      // bar
            // lips over the body's face (it stands PWR_JACK[1] in front of PWR_BACK), ramped towards the front
            for (sx = [-1, 1]) let(yl = PWR_BACK - PWR_JACK[1] - 0.25) translate([0, 0, PWR_LEDGE + 3]) linear_extrude(10)
                polygon([[sx*(w + 0.01), yl], [sx*(w - 0.8), yl], [sx*(w + 0.01), yl - 1.6]]);
        }
        teardrop_z(PWR_BORE, -1, PWR_MOUTH + 0.01, PWR_P[0], PWR_P[1]);
    }
}
module power_inlet() translate([PWR_P[0], PWR_P[1], 0]) {   // the socket in its channel, screws to the front, and the PSU plug from below
    j = PWR_JACK;  yb = PWR_BACK - PWR_P[1];
    cyl_z(10.8, PWR_LEDGE - j[4], PWR_LEDGE, 0, 0);                                              // barrel
    translate([-j[0]/2, yb - j[1], PWR_LEDGE]) cube([j[0], j[1], PWR_JTOP - PWR_LEDGE - 8]);      // body
    translate([-5.1, yb - j[2], PWR_JTOP - 8]) cube([10.2, j[2], 8]);                             // terminal (2 x 5.08)
    cyl_z(10, 9, PWR_LEDGE - j[4], 0, 0);                                                         // plug grip
    translate([0, 0, 1]) cylinder(d1 = 6, d2 = 8.5, h = 8.01, $fn = 32);                          // strain relief, inside the bore
    cyl_z(4, -60, 1.01, 0, 0);                                                                    // lead, straight down
}
module placed_services() {
    // socket (mouth down) in its column and the PSU's straight plug from below
    color([0.2, 0.2, 0.2]) power_inlet();
    // speaker
    color([0.2, 0.2, 0.22]) speaker3();
    color([0.1, 0.1, 0.1]) fuse_model();   // v36
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
WLED_WT = 2.4;                            // v36: long walls (v17-v35: 1.6)
WLED_X0 = -34.5 - WLED_B[0]/2;  WLED_Z0 = 70 - WLED_B[1]/2;   // same centre as the v11-v16 tray
WLED = [WLED_B[0], WLED_B[1], WLED_B[2]];  WLED_P = [WLED_X0, WLED_Z0];
PSU_LIP = [1.6, 20, 3, 2.0];  BOARD_LIP = [1.2, 12, 2, 1.6];   // v17: snap lips [in, length, per side, ramp]
MOSF = [44, 32, 16];   MOSF_P = [34.5, 64];                  // on the left wall; [A] DFR0457 PCB 44 x 32 (drawing), [C] ~16 high with the screw terminal
// v36 (Esben 30 Oct, samlenoter 3: the holder was built from the board's tallest point, its long walls and teeth stood ~15 mm over the
// PCB and touched nothing, and you could not see what you put it into). Now a holder for the board itself ([A] DFRobot drawing
// halo-gen2-v2_maalskitse_dfrobot_dfr0457.pdf): PCB 44 x 32 x 1.6, 4 x Ø3.1 at x 20.4 / 40.4 (from the terminal end), y 3.5 / 28.5;
// [M] Esben: about 5 mm high in all. It lies on 4 pads (the through-hole pins under it stay free), 2 pegs through two holes
// locate it, and the walls stand MOSF_CATCH + a 1.6 ramp over the PCB's top face, with one short lip per long wall over the PCB
// edge between the holes (no parts there). Both ends are only as high as the PCB, so the screw terminal (top) and the Gravity
// plug (bottom) stay free. Local frame as wall_tray: x along the 44 (0 = terminal end, top), y along the 32, z out of the wall.
MOSF_PCB = [44, 32, 1.6];  MOSF_PAD = [5.5, 2.4];  MOSF_HOLES = [[20.4, 3.5], [40.4, 3.5], [20.4, 28.5], [40.4, 28.5]];
MOSF_CATCH = 0.3;  MOSF_LIP = [1.2, 9, 1.6];             // lip: in, length, ramp (a 1.2 overhang sags little)
module mosfet_holder() {
    c = 0.15;  wt = 1.6;  fl = 1.2;  pcb = fl + MOSF_PAD[1];  top = pcb + MOSF_PCB[2];  hw = top + MOSF_CATCH + MOSF_LIP[2] + 0.2;
    difference() {
        translate([-c - wt, -c - wt, 0]) cube([MOSF_PCB[0] + 2*(c + wt), MOSF_PCB[1] + 2*(c + wt), hw]);
        translate([-c, -c, fl]) cube([MOSF_PCB[0] + 2*c, MOSF_PCB[1] + 2*c, hw]);
        for (x = [-c - wt - 1, MOSF_PCB[0] + c - 0.01]) translate([x, -c - wt - 1, top]) cube([wt + 1.01, MOSF_PCB[1] + 2*(c + wt) + 2, hw]);   // low ends
        translate([8, 6, -1]) cube([MOSF_PCB[0] - 16, MOSF_PCB[1] - 12, fl + 2]);                                                         // open floor
    }
    for (h = MOSF_HOLES) translate([h[0], h[1], fl - 0.01]) {
        cylinder(d = MOSF_PAD[0], h = MOSF_PAD[1] + 0.01, $fn = 32);
        if (h[1] < 10) cylinder(d = 2.8, h = MOSF_PAD[1] + MOSF_PCB[2] + 1.2, $fn = 24);   // 2 pegs, on the hole pair nearest the wall's edge
    }
    for (sy = [0, 1]) translate([25.5, sy > 0 ? MOSF_PCB[1] + c : -c, top + MOSF_CATCH]) snap_lip(MOSF_LIP[1], MOSF_LIP[0], MOSF_LIP[2], sy);
}
module mosfet_model() {   // the board in its holder, for the fit check and the 3D model: PCB + parts (up to Esben's ~5 mm)
    translate([0, 0, 1.2 + MOSF_PAD[1]]) { cube(MOSF_PCB); translate([0.5, 3, MOSF_PCB[2]]) cube([14, 26, 5 - MOSF_PCB[2]]); translate([22, 4, MOSF_PCB[2]]) cube([21, 24, 2.5]); }
}
module mosf_frame() translate([-(HW - WALL) - 0.01, MOSF_P[0], MOSF_P[1] + MOSF[0]]) rotate([0, 90, 0]) children();
// v17 (Esben 22 Oct: the teeth were too small, above all for the 5 V supply): every tray lip now has a flat catch 0.1 over the part's
// top edge and a ramp above it. Until v16 the lips started 0.3 above the part and leaned in only 0.6 at their top, so a sloped face was
// all that held the part. lip = [in, length, count per side, ramp height]
module snap_lip(len, inw, rh, side) translate([0, 0, 0]) rotate([90, 0, 90]) linear_extrude(len)   // profile in (y, z), y inwards
    polygon(side > 0 ? [[0, 0], [-inw, 0], [0, rh]] : [[0, 0], [inw, 0], [0, rh]]);
module lips_along(sz, t, lip, fl = 1.2, at = [], catch = 0.1) {   // lips on both long walls (along x) of an inner box sz[0] x sz[1] + 0.3
    for (sy = [0, 1], i = [0 : lip[2] - 1]) {
        x = len(at) ? at[i] : (i + 0.5)*(sz[0] + 0.3)/lip[2] - lip[1]/2;
        translate([x, sy > 0 ? sz[1] + 0.3 : 0, fl + t + catch]) snap_lip(lip[1], lip[0], lip[3], sy);
    }
}
// v36 (Esben 30 Oct, samlenoter 4 and 7: the teeth did not reach over the 5 V supply and the WLED controller, they pushed the walls
// out): a lip's flat catch is a 1.6-2.0 mm overhang when the shell prints back down, and it sags 0.2-0.4 mm, so a catch drawn 0.1 over
// the part's top edge printed level with it. Mean Well also gives the RSD-60G's 25 mm with +-1 mm. Now the catch stands CATCH over the
// part's nominal top (the walls 0.8 mm higher, Esben: 0.5-1), and every long wall has buttress ribs outside so it cannot bend away.
CATCH = 0.9;                              // catch over the part's nominal top (v17-v35: 0.1)
TRAY_RIB = [1.6, 4];                      // outside buttress: thickness, reach at the foot
module tray_rib(h, side) translate([0, side > 0 ? 0 : -TRAY_RIB[1], 0]) rotate([90, 0, 90]) linear_extrude(TRAY_RIB[0], center = true)
    polygon(side > 0 ? [[0, 0], [TRAY_RIB[1], 0], [0, h]] : [[0, 0], [TRAY_RIB[1], 0], [TRAY_RIB[1], h]]);
module wall_tray(sz, lip, wt = 1.6, end_h = 5, catch = 0.1) {   // sz = [x, y, z-thickness]: long walls with snap lips, low end stops (terminals stay free)
    hgt = 1.2 + sz[2] + catch + lip[3] + 0.3;
    difference() {
        translate([-wt, -wt, 0]) cube([sz[0] + 0.3 + 2*wt, sz[1] + 0.3 + 2*wt, hgt]);
        translate([0, 0, 1.2]) cube([sz[0] + 0.3, sz[1] + 0.3, hgt + 1]);
        translate([6, 6, -1]) cube([sz[0] - 12, sz[1] - 12, 3]);                   // open floor: less print, air
        translate([-wt - 1, -wt - 1, end_h]) cube([sz[0] + 2*wt + 2.3, sz[1] + 2*wt + 2.3, hgt]);   // ends cut down ...
    }
    for (sy = [0, 1]) translate([0, sy > 0 ? sz[1] + 0.3 : -wt, 0]) cube([sz[0] + 0.3, wt, hgt]);   // ... long walls stay full height
    lips_along(sz, sz[2], lip, catch = catch);
    if (catch > 0.1) for (sy = [0, 1], i = [0 : lip[2] - 1]) let(x = (i + 0.5)*(sz[0] + 0.3)/lip[2])   // v36: a rib behind each lip
        translate([x, sy > 0 ? sz[1] + 0.3 + wt : -wt, 0]) tray_rib(hgt - 1, sy > 0 ? 1 : -1);
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
    B = WLED_B; c = WLED_C[0]; wt = WLED_WT; hw = WLED_FL + B[2] + CATCH + 1.6 + 0.3;   // v36: walls 1.0 higher, 2.4 thick (v17-v35: 1.6)
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
            for (sd = [0, 1], v = [B[1]*0.15, B[1]*0.7]) translate([sd ? B[0] + c : -c, v, WLED_FL + B[2] + CATCH]) hull() {
                translate([sd ? -2.0 : 0, 0, 0]) cube([2.0, 10, 0.01]); translate([sd ? -0.01 : 0, 0, 1.6]) cube([0.01, 10, 0.1]); }
            // v36: a buttress outside each lip, so the wall cannot bend away from the case
            for (sd = [0, 1], v = [B[1]*0.15 + 5, B[1]*0.7 + 5]) translate([sd ? B[0] + c + wt : -c - wt, v, 0]) rotate([0, 0, 90]) tray_rib(hw - 1, sd ? -1 : 1);
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
    translate([PSU5_P[0] + PSU5[0], D - BACK_T + 0.01, PSU5_P[1]]) rotate([0, -90, 0]) rotate([90, 0, 0]) wall_tray([PSU5[1], PSU5[0], PSU5[2]], PSU_LIP, 2.2, catch = CATCH);   // v17: 3 lips 20 long, 1.6 in, per side; v36: CATCH
    wled_holder();
    mosf_frame() mosfet_holder();   // v36 (until v35: wall_tray([44, 32, 16]), walls 19.2 high)
}
module placed_power3() {
    color([0.75, 0.76, 0.78]) translate([PSU5_P[0], D - BACK_T - 1.2 - PSU5[2], PSU5_P[1]]) cube([PSU5[0], PSU5[2], PSU5[1]]);
    color([0.9, 0.9, 0.92]) placed_wled();
    color([0.1, 0.3, 0.6]) mosf_frame() mosfet_model();
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
// slot end centres (v19: 14.675; v20: 1.5 further out, so the wider window kept 3.7 mm black; v24-v35: 16.775).
// v36 (Esben 31 Oct, assembly note 14, his idea B): the ring's ends lay 7 mm out over the camera bay, where neither the frame
// nor the strips can be (CAM_KEEP), so they stayed dark and loose, and they had to be tucked in under the caps' back plates.
// Now the black round the camera reaches 7.1 mm further each side and the ring's face ends at |x| = CAM_KEEP[0] = 17,
// exactly where the reflector and the strips begin: 12.55 black from the Ø8.6 window to the slot, a bridge 33.7 wide.
CAM_END = 17 + 6.85;                      // 23.85 = CAM_KEEP[0] + RF3
CAM_KEEP = [17, 14];                      // no channel behind the camera board: half x, half z
// v36 (Esben 30 Oct, samlenoter 9: the RGB strip had to be forced in and got hard kinks): the reflector's foot moves 1.4 mm in
// (r 4.4 -> 3.0); its front edge, which clamps the ring's inner flange, stays. The RGB strip (face at r 4.7) now has 1.7 mm in
// front of it at the floor (v18-v35: 0.3, a wedge it had to be pressed into) and 3.4 at its front edge; white 2 gains 1 mm too.
// The slope gets 3 deg steeper, which hardly changes the light. The RGB strip is held by short nubs instead (RGB_NUBS).
REFL = [[4.2, -6.0], [26.45, 3.0]];       // reflector line (y, r): from the ring flange to the floor (v18-v35: r 4.4 at the floor)
FLOOR3 = 27.4;                            // v18: 0.95 deeper (v2-v17: 26.45) for the strip lanes
// [y0, y1, kind, thickness, end |x| left, end |x| right] (strip ends next to the camera)
// [C] white: Ledproff COB Ra95 24 V, 8 x 2 mm; RGB: Ledprodukter WS2812b COB 5 V, 5 x 2.2 mm (dimension sheet)
// Each strip is fed from ONE end: white 1 and RGB at the left end, white 2 at the right end.
// v36 (Esben 31 Oct): no clip connectors. Until v35 they took 16 mm of the strip end and up to 9.6 x 4.4, so they could not sit side
// by side and the strip next to a clip stopped 17 mm short (a dark patch at the ring's ends). Now the leads are soldered on (or
// the strips are bought with soldered leads), all three strips run right up to the camera keep-out at x +-17, and the leads leave
// through an open slot at each end of the top run (LEAD_SLOT).
// v18 (Esben 22 Oct, sketch /mnt/project-files/gen2-gennemgang/halo-gen2-v18_skitse_led-fastholdelse.png): no adhesive. Each strip has
// its own lane on the strip wall; its back edge goes in under a lip, its front edge presses down against the wall. The frame
// prints back down, so a lip can only point forward. [M] Esben: white 8.1 wide with a 3.7 yellow (lit) stripe in the middle,
// so 2.2 is dark each side and the lips take 1.0 of it; the RGB strip is lit right across, so it gets no lip (snug lane, reflector 0.3 above).
STRIPS3 = [[4.7, 12.7, "w", 2.0, 17, 17], [13.5, 21.5, "w", 2.0, 17, 17], [22.3, 27.3, "rgb", 2.2, 17, 17]];   // v35: 17/34 by the clips
STRIP_T3 = [4.7, 6.9];                    // strip wall face at r 6.9; thickest strip reaches r 4.7
// The white strip is thinner out at the dark edge than over the yellow stripe. The stems and lips only reach over that thin
// edge, so a stem stands at most ~1.1 out from the wall (a flat shelf in the print; 2.5 in the first v18 draft was too much).
T_EDGE = 0.5;                             // [A] white strip thickness at the dark edge, until Esben has measured it
LANE_STEMS = [12.8, 21.6];                // stem front faces: 0.6 wide, lip 1.1 forward over the strip in front
LANE_LIP = [STRIP_T3[1] - T_EDGE - 0.6, STRIP_T3[1] - T_EDGE - 0.1];   // lip r: 0.5 thick, 0.1 clear of the edge
// soldered joints on the strip ends: side, strip, [length along the strip, height over the strip face incl. heat shrink]
JOINTS3 = [[-1, 0, [6, 1.6]], [1, 1, [6, 1.6]], [-1, 2, [6, 1.6]]];
// lead slot at each end of the top run, straight through the floor and the back plate: x from, x to (|x|), r from, y from. It
// starts behind white 2's lane (its stem and lip stay) and runs from the strip wall in to r 0.5, so the joints of all three strips sit
// over it and the leads go straight back in a soft bend (20+ mm of depth to bend in). Nothing is threaded through a hole: each lead
// is laid into the slot from the front before its strip is pressed in. (v14-v35: a Ø4 hole at x +-19.5, r 4, which the clips
// covered on the left and the reflector half covered on the right, samlenoter 9.) The front's camera end caps stop outside it.
LEAD_SLOT = [CAM_KEEP[0], CAM_KEEP[0] + 4, 0.5, 22.4];
// RGB retaining nubs on the reflector, facing the RGB strip: y from (the strip's front edge), r of the face (0.2 mm off the strip
// face), length along the run.
// Only on the straight runs, none in the corners; the strip slides past them and they keep it within 0.2 of the wall, so the
// top run's strip cannot sag off the wall. [x, z] points on the ring centre line, and whether the run is a side ("v") or not.
RGB_NUB = [22.3, STRIP_T3[1] - 2.2 - 0.2, 3, 1.2];   // ... and the lead-in length at the front end
RGB_NUBS = concat([for (sx = [-1, 1], z = [60, 125, 175, 240]) [sx, z, "v"]], [for (x = [-55, -30, 30, 55]) [x, 1, "t"]], [for (x = [-45, 0, 45]) [x, -1, "b"]]);
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
// v27 (Esben 27 Oct: the screws he has, so one T20 bit does it all): the 4 front screws are 4.0 x 50 countersunk T20
// chipboard screws (measured: thread 3.77, head Ø7.75, 49.25 long, part thread). The head lies flush in a 90 deg
// countersink in the back face, the shank runs through a clearance hole in the shell post and the frame's ear, and the
// tip ends 50 in front of the back face (y 20), so the thread has 7 mm in the front boss's pilot. Until v26: 3.0 x 15
// SPUN+ with the head 37 mm down a counterbore (needed a long bit).
FS = [4.0, 50, 7.75];                     // screw: Ø, length, head Ø
FS_CLR = 4.4;                             // through the post and the frame
FS_PILOT = 3.2;                           // in the front's Ø6 boss (chipboard thread, core about 2.6)
FS_CSK = 8.2;                             // countersink Ø at the back face
FS_TIP = D - FS[1];

// ================================================================= v27: no seals ==
// v20-v26 (Esben 23 Oct) had a removable seal, a silicone sponge O-ring cord Ø1.5 (RS 234-2906), in 4 joints (display,
// light ring, camera glass, speaker) and a Ø12 x 1.5 glass in front of the camera. v27 (Esben 27 Oct: we will not use them,
// they make the box far too complex to assemble): all of it is gone, with the grooves and pockets it lay in. Every joint is
// now a hard stop of printed faces (v22 already made every part sit the same without them):
// 1 front to shell: rib and groove with 2 drain notches, faces meet with no gap (v21, see "weather").
JOINT_GAP = 0;                            // v20: 0.2, the cord took up the tolerance
// v21: crush bumps on each shell post's face against the frame: the front/shell faces are the stop, the bumps reach
// CRUSH[0] past the frame's back face and are squeezed flat by the screw, so the frame stays clamped (front boss ->
// frame -> post) whatever the print tolerance. The post face itself stays CRUSH[1] clear of the frame.
CRUSH = [0.2, 0.1, 3, 1.6, 0.6, 3.1];     // reach, face clearance, count, base Ø, tip Ø, radius from the screw
// 2 display: the glass lies straight on the front's 1.6 lip (v12); v27: the lip is solid (v20-v26: a 2 x 1 groove for the cord).
// 3 light ring: v27 has no cord pocket beside the ring (v20-v26: 1.0 deep behind the front plate, with the ring's shoulder
// standing on its floor). The ring's wall runs straight through the slot and its flange lies on the front plate's back face
// (y PT): that is the ring's hard stop, and the frame's crush bumps (ring_bumps) press the flange onto it.
// 4 camera: an open window, no glass, no cord ring and no sleeve. The window is one straight Ø8.6 bore through the front
// plate, no bigger than the lens barrel needs (Ø6.95 at the tip, Ø7.25 at most: 0.65-0.8 air all round, so the focus
// motor's barrel touches nothing, as in v24). The lens tip sits 1.15 inside it, so the plate's edge shields the lens.
// Field of view, front lens element Ø4 [C] at the tip (y 1.15): r 3.99 at the face, 0.31 inside the bore (x_cam_fov in
// the fit check). v27's first draft kept v24-v26's Ø12.1 face opening with a 60 deg cone: far too big without the glass.
CAM_WIN = 8.6;                            // bore Ø round the lens barrel, also the opening in the face
module cam_window_cut() cyl_y(CAM_WIN, -1, PT + 1, 0, LENS_Z);
// the lens's field of view (120 deg diagonal, from the Ø4 front element) to just in front of the face, and the lens barrel
// with its largest diameter: fit-check bodies, nothing may touch them
CAM_FOV = [4, 60];
module cam_fov() translate([0, -0.3, LENS_Z]) rotate([-90, 0, 0])
    cylinder(d1 = CAM_FOV[0] + 2*(CAM_TIP_Y + 0.3)*tan(CAM_FOV[1]), d2 = CAM_FOV[0], h = CAM_TIP_Y + 0.3, $fn = 64);
module cam_lens() cyl_y(7.25, CAM_TIP_Y, CAM_PCB_Y - CAM_HOLDER_H, 0, LENS_Z);
// 5 speaker: the flange lies on the back wall round the grille; v27: no groove (v20-v26: 2 x 1 for the cord).
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
// side. Straps stay outside the wall cleat (x -95..62) in the gap to the wall (v25: 4.5), so put them on before hanging the box.
HOOK = [4, 6, 5, 3, 0.25];                // tongue width (x), height (z), lip thickness (y), lip drop below the floor, clearance (tools/strength_hooks_gen2.py)
// To come off, a hook must move 8.25 back (lip + clearance + wall). The straps are 10 (top) and 9 (wing) thick, so with the
// box on the wall cleat (wall 14 behind the back) only 3.8 / 4.8 is left: hung on the wall, the parts cannot be unhooked.
WING_STRAP = GAP_WALL - 0.6;              // v25: 3.9 (until v24: 9, in a 14 gap)
TOP_STRAP = [GAP_WALL - 0.6, HOOK[0] + 6];   // v25: thickness 3.9 (until v24: 10), width 10 (until v24: 5); it carries the top in tension
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
// v28 (Esben 27 Oct: "en ekstra rille ned ved bunden af boksen, så de kan blive længere og være stabile i bunden"): a groove
// low in the back face on each side, under the wing's hooks (x = the outer hook's centre). A wing can now reach down to the
// bottom of the box: its strap runs on down behind the back and a tab on it sits in the groove, so the lower end cannot swing
// out sideways or twist. The groove is blind (v28: 1.5 deep in the 3 mm back wall; v30: 3.5 with a boss behind): a third slot with a pocket does not fit there
// (reed module, lock pocket and the dimmer tray on the left, see WING_P), and the tab only steadies, the hooks carry.
// The groove is 3.5 longer upwards than the tab, so the tab goes in with the hooks (lift 3, push in, drop) and ends 0.5 off
// its floor. It sits 5 mm inside the box's round bottom corner, hidden behind the box.
// v30 (Esben 27 Oct: "de ser ikke så dybe ud"): v28-v29's groove was 4.5 x 1.5 with a 4 x 1.3 x 8 tab, too shallow to hold a
// wing that someone pulls at the bottom. Now 5.5 wide and 3.5 deep, with a printed boss inside the back wall behind it
// (1.6 wall behind the groove's floor and round its sides), and the tab is 5 x 3.3 x 10 (tab bottom z 24, groove to 38).
// The groove's inner edge lines up with the strap's inner edge (WG_X0 = the outer hook's inner side, 100.6 from the middle).
WG_X0 = hook_x(1, false) - HOOK[0]/2;
WING_TAB = [5, 3.3, 24, 34];                            // width, depth into the groove (0.2 off its floor), z bottom, z top
WING_GROOVE = [WING_TAB[0] + 0.5, WING_TAB[1] + 0.2, WING_TAB[2] - 0.5, WING_TAB[3] + HOOK[3] + 1];   // width, depth, z bottom, z top
WG_BOSS = 1.6;                                          // wall round the groove inside the box
// v36 (Esben 30 Oct, samlenoter 12: the two low notches looked like they had no function; they only steadied the wing): now a lock
// like the upper hooks. Under the groove a pocket runs on down WG_LOCK[0] behind the back wall's outer WG_LOCK[1] (a ledge), and the
// wing's tab has a toe that goes down behind that ledge when the wing drops into place (lift 3, push in, drop), so the lower end
// cannot be pulled out either. The tab enters 3 higher, where the groove is open, so the toe passes. Prints without support
// (back down: the ledge is the first layers, the pocket's roof is the same 5.5 mm bridge as the groove's).
WG_LOCK = [3.5, 1.5, 1.6];                              // pocket depth below the groove, ledge thickness, toe thickness (y)
function wg_xc(sx) = sx*(WG_X0 + WING_TAB[0]/2);
module wing_grooves() for (sx = [-1, 1]) {
    translate([wg_xc(sx) - WING_GROOVE[0]/2, D - WING_GROOVE[1], WING_GROOVE[2]]) cube([WING_GROOVE[0], WING_GROOVE[1] + 1, WING_GROOVE[3] - WING_GROOVE[2]]);
    translate([wg_xc(sx) - WING_GROOVE[0]/2, D - WING_GROOVE[1], WING_GROOVE[2] - WG_LOCK[0]]) cube([WING_GROOVE[0], WING_GROOVE[1] - WG_LOCK[1], WG_LOCK[0] + 0.01]);   // v36: lock pocket
}
module wing_groove_bosses() intersection() {
    for (sx = [-1, 1]) translate([wg_xc(sx) - WING_GROOVE[0]/2 - WG_BOSS, D - WING_GROOVE[1] - WG_BOSS, WING_GROOVE[2] - WG_LOCK[0] - WG_BOSS])
        cube([WING_GROOVE[0] + 2*WG_BOSS, WING_GROOVE[1] + WG_BOSS - BACK_T + 0.01, WING_GROOVE[3] - WING_GROOVE[2] + WG_LOCK[0] + 2*WG_BOSS]);
    ext_y(SKIRT, D) translate([0, 1]) rr(W - 2, H - 2, R - 1);
}
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
        xs = sx < 0 ? xa : xa + HOOK[0] + 1 - TOP_STRAP[1];   // wider towards the middle
        translate([xs, STRAP_Y, zf - HOOK[3]]) cube([TOP_STRAP[1], TOP_STRAP[0], TOP_Z0 + 4 - zf + HOOK[3]]);
        translate([xs, D - 14, TOP_Z0]) cube([TOP_STRAP[1], STRAP_Y + TOP_STRAP[0] - (D - 14), 4]);   // ties the strap to the base
        hook(x0, zf);
    }
}
// example wing: a 6 mm panel beside the front, a 4 mm rib along the side, and a strap 9 thick behind the back wall that
// carries a hook into both slots on that side
// v28 (Esben 27 Oct): the wing reaches down to the bottom of the box (until v27 its panel stopped at z 120 and the strap at
// 162): panel from z WING_BOT, rib and strap down to the groove, and the tab in the groove steadies the lower end.
// Behind the box the strap is clipped 1 mm inside the box's outline, so it does not show at the round bottom corner.
WING_BOT = 20;
module theme_wing_demo(sx) {
    xe = W/2 + 0.2;                       // inner face of the rib (0.2 off the side wall)
    zs = [for (p = WING_P) if (p[0]*sx > 0) p[1] - 4];
    z0 = WING_TAB[2] - 4;  z1 = max(zs) + HOOK[1] + 8;
    xh = hook_x(1, false) - HOOK[0]/2;
    mirror([sx < 0 ? 1 : 0, 0, 0]) {
        translate([xe, -3, WING_BOT]) rotate([90, 0, 0]) mirror([0, 0, 1]) linear_extrude(6) offset(r = 12) translate([12, 12]) square([50 - 24, 290 - WING_BOT - 24]);
        translate([xe, -3, WING_BOT + 4]) cube([4, D + 3.2, 280 - WING_BOT - 4]);
        intersection() {   // ends flush with the hook, 0.7 from the top's strap
            translate([xh, STRAP_Y, z0]) cube([xe + 4 - xh, WING_STRAP, z1 - z0]);
            union() { ext_y(STRAP_Y - 1, STRAP_Y + WING_STRAP + 1) translate([0, 1]) rr(W - 2, H - 2, R - 1); translate([W/2 - 2, STRAP_Y - 1, R]) cube([20, WING_STRAP + 2, H]); translate([xe - 0.01, STRAP_Y - 1, 0]) cube([10, WING_STRAP + 2, H]); }
        }
        translate([xe, D - 10, z0]) cube([4, 10.21 + WING_STRAP, z1 - z0]);
        for (z = zs) hook(hook_x(1, false), z);
        translate([WG_X0, D - WING_TAB[1], WING_TAB[2]]) cube([WING_TAB[0], STRAP_Y - D + WING_TAB[1] + 0.01, WING_TAB[3] - WING_TAB[2]]);   // v28: tab in the groove (v30: 5 x 3.3 x 10)
        translate([WG_X0, D - WING_TAB[1], WING_TAB[2] - (WG_LOCK[0] - 0.5)]) cube([WING_TAB[0], WG_LOCK[2], WG_LOCK[0] - 0.5 + 0.01]);         // v36: toe behind the ledge
    }
}
// v21: clipped to 1 mm inside the shell's outer skin (until now its bottom-left corner stood up to 1 mm out of the round bottom edge)
module lock_pocket() intersection() {
    both_locks() difference() {
        translate([$lx - ($lw/2 + LOCK_C[0]) - LOCK_PK[3], LOCK_PK[1] - LOCK_PK[3], WALL - 0.01]) cube([2*(($lw/2 + LOCK_C[0]) + LOCK_PK[3]), D - BACK_T - LOCK_PK[1] + LOCK_PK[3] + 0.02, LOCK_PK[2] + LOCK_PK[3] - WALL + 0.01]);
        translate([$lx - ($lw/2 + LOCK_C[0]), LOCK_PK[1], WALL - 1]) cube([2*($lw/2 + LOCK_C[0]), D - BACK_T - LOCK_PK[1] + 1, LOCK_PK[2] - WALL + 1]);
    }
    ext_y(SKIRT, D) translate([0, 1]) rr(W - 2, H - 2, R - 1);
}
// front screw boss: where it reaches into the channel (r < CH_IN) it starts at y 4.5, clear of the ring's flange, with a 45 deg underside (no overhang face down)
// the boss stays clear of the ring's flange (v27-v35: to y 4.5) and, v36, of its rims (to PT + 1 + RIM[1] + RIM[2] = 6.3),
// then narrows back at 45 deg
J2_CUT = PT + 1 + RIM[1] + RIM[2];
module j2_boss(j) difference() {
    cyl_y(6, PT - 0.01, CH_BACK, j[0], j[1]);
    rfill(PT - 1, J2_CUT, CH_IN, CH_IN);
    rfill(J2_CUT - 0.01, J2_CUT + 1.62, CH_IN, CH_IN - 1.62);
}
// v12 (Esben 20 Oct, sketch /mnt/project-files/gen2-gennemgang/halo-gen2-v11_skitse_tyndere-front-og-rille.png):
// the display stays behind the front, but the front is only 1.6 mm thick over the glass (v2-v11: 3.2 + a 0.5 land,
// glass 3.7 in). The glass lies straight on the back of that lip, so there is no gap at the window edge. v27: the lip is
// solid; v12-v26 had a groove in it, 1 mm out from the window bevel, for foam tape (v12-v19) or the seal cord (v20-v26).
GLASS_Y3 = 1.6;                           // glass front face = lip thickness
GLASS_C3 = 0.4;                           // the thin pocket clears the glass by 0.4 (the 8 ribs locate it, 0.2)
WIN3_BEVEL = [1.6, 0.6];                  // window grows 1.6 at the face, 0.6 at the glass (as v2-v11)
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
// v36: no back plates any more (v14-v35 had a 1.2 back at CAP_Y): the slot now ends at |x| 16.85, so the front plate itself
// is solid over the camera bay and nothing needs hiding; the plates kept the frame off the ring's ends and the ring had to be
// tucked in under them. Only the walls round the ends stay, so the channel is closed at its ends.
CAP_Y = CAM_PCB_Y - 2.0;                  // v24: 2.0 in front of the board (v14-v23: 0.8), nothing near its front face but the 4 bosses
module cam_caps() intersection() {
    ext_y(PT - 0.01, CAP_Y) ring3_band(CH_IN, CH_HALF);
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
        ext_y(-1, LOGO_D) translate([0, LOGO_Z]) logo_all2d();   // pocket for the inlay
        ext_y(-1, PT + 0.01) ring3_2d(S3);
        ring3_bevel(RING_BEV, PT + 0.01, S3, S3 + PT + 0.01 - RING_BEV, 24);   // v36: v18's 45 deg seat for the ring's bevel
        cam_window_cut();
        ext_y(SKIRT - JOINT_GAP, SKIRT + 0.02) difference() { offset(r = 1) rr(W, H, R); translate([0, WALL + FIT]) rr(W - 2*(WALL + FIT), H - 2*(WALL + FIT), R - WALL - FIT); }
        translate([-CAM_PCB[1], SKIRT - 0.1, CAM_TOP - 1]) cube([2*CAM_PCB[1], TONGUE_L + 0.2, 10]);
        for (j = J2) cyl_y(FS_PILOT, FS_TIP - 1.5, CH_BACK + 1, j[0], j[1]);   // v27: 4.0 x 50 T20 (until v26: Ø2.4 for 3.0)
        snap_windows();
        translate([0, 0, LENS_Z]) ext_y(PT, CAM_PCB_Y) square(CAM_BAY, center = true);   // the caps keep clear of the lens holder
    }
    glass_ribs();
    joint_rib();                                                          // v21: into the shell's groove
}
// v36 (Esben 31 Oct, assembly notes 15/15b: v35's ring is unusable, base it on v18): v20 widened the flange (8.1 -> 9.1, for
// the seal cord) and v27 took away its 45 deg underside and the front's seat, so the flange stood 2.25 mm flat over air when
// printed face down; it failed, and v35's support made it jagged and ~5 mm wider. Back to v18's section: the walls run
// straight to RING_BEV, then go out at 45 deg, here all the way to FL3 at the flange's back (PT + 1), so it fills the cavity
// (CH_IN, 0.1 clear) and nothing on the ring is flatter than 45 deg: no support. Esben: support all round, inner and outer,
// out to the ends (v18's wedge was on the inner side only and stopped 9.5 / 27 mm short of the ends): a rim on each edge of
// the flange, round the round ends too, standing back into a notch in the frame (ring_rim_notch). Inside the rims the
// flange's back is flat, and the frame's crush bumps press it there as before.
RING_BEV = 1.95;                          // walls straight to here, then 45 deg (v18)
RIM = [1.2, 2.0, 0.1];                    // rim width, height behind the flange, notch clearance (each side and at the floor)
module ring3() {
    ext_y(RING_Y[0], RING_Y[0] + 0.3) ring3_2d(RF3 - 0.3);
    ext_y(RING_Y[0] + 0.29, RING_Y[1]) ring3_2d(RF3);
    ext_y(RING_Y[1] - 0.01, RING_BEV + 0.01) ring3_band(RF3 - RW3, RF3);
    difference() {
        ring3_bevel(RING_BEV, PT + 1, RF3, FL3, 45);
        ext_y(0, PT + 2) ring3_2d(RF3 - RW3);
    }
    difference() { ext_y(PT + 1 - 0.01, PT + 1 + RIM[1]) ring3_band(FL3 - RIM[0], FL3); rim_end_cut(); }
}
// Round each end the rim follows the arc, but on the outer half, from the tip to |x| RIM_END, the arc would run into the
// strips' ends and their clips/leads on the strip wall (from |x| 17, r 2.4-6.9), so it stops there; the inner half and the
// tip go all the way round. At RIM_END the arc is 7.5 out from the centre line, clear of the strip wall's face (6.9).
RIM_END = 21.5;
module rim_end_cut() translate([-RIM_END, PT, RING_Z1]) cube([2*RIM_END, RIM[1] + 3, 20]);
// the room for the rims in the frame's front edge (reflector inside, strip wall outside), used in frame3
module ring_rim_notch() difference() {
    ext_y(PT + 1 - 0.01, PT + 1 + RIM[1] + RIM[2]) ring3_band(FL3 - RIM[0] - RIM[2], FL3 + RIM[2] + 0.5);
    rim_end_cut();
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
module rgb_nub_place() for (n = RGB_NUBS)
    if (n[2] == "v") translate([n[0]*RING_X, n[1]]) square([30, RGB_NUB[2]], center = true);
    else translate([n[0], n[1] > 0 ? RING_Z1 : RING_Z0]) square([RGB_NUB[2], 30], center = true);
module rgb_nubs() intersection() {
    // a lead-in at the nub's front end, so a tilted strip edge is steered past it (the hull of the two slices is filled, so
    // the band below keeps it between the reflector and the nub face)
    hull() { ext_y(RGB_NUB[0], RGB_NUB[0] + 0.01) offset(r = refl_r(RGB_NUB[0]) + 0.01) ring_centre2d();
             ext_y(RGB_NUB[0] + RGB_NUB[3], FLOOR3 + 0.01) offset(r = RGB_NUB[1]) ring_centre2d(); }
    ext_y(RGB_NUB[0] - 1, FLOOR3 + 1) intersection() { ring_band2d(refl_r(RGB_NUB[0]) - 1, RGB_NUB[1]); rgb_nub_place(); }
}
module lead_slots() for (sx = [-1, 1]) translate([sx > 0 ? LEAD_SLOT[0] : -LEAD_SLOT[1], LEAD_SLOT[3], RING_Z1 + LEAD_SLOT[2]])
    cube([LEAD_SLOT[1] - LEAD_SLOT[0], FR_BACK + 1 - LEAD_SLOT[3], STRIP_T3[1] - LEAD_SLOT[2]]);
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
            }
            difference() { rgb_nubs(); ext_y(0, CH_BACK + 1) { glass_keep2d(); cam_keep2d(); } }   // v36
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
        lead_slots();                                                     // v36 (v18-v35: clip pockets)
        ring_rim_notch();                                                 // v36: room for the light ring's rims
        for (t = tabs2) {
            hull() for (z = [t[1], t[2]], dz = [-DSP_SLOT_Z, DSP_SLOT_Z], dx = [-DSP_SLOT_X, DSP_SLOT_X]) cyl_y(2.9, TAB_Y - 1, FR_BACK + 1, t[0] + dx, z + dz);
            hull() for (z = [t[1], t[2]], dz = [-DSP_SLOT_Z, DSP_SLOT_Z], dx = [-DSP_SLOT_X, DSP_SLOT_X]) cyl_y(5.6, TAB_Y + DSP_FLOOR - PRELOAD, FR_BACK + 1, t[0] + dx, z + dz);   // screw head well
        }
        for (h = CAM_HOLES_ROT) cyl_y(2.4, CAM_PCB_Y, CAM_PCB_Y + CAM_PCB[2] + 2, h[0], LENS_Z + h[1]);
        // camera ribbon (16 mm wide, does not like sharp folds): it leaves the connector sideways (+x),
        // takes one gentle 90 deg bend backwards and passes the frame here to the open space behind it
        translate([CAM_RIB[0], CAM_PCB_Y + CAM_PCB[2] + 0.5, LENS_Z - CAM_RIB[1]/2]) cube([CAM_RIB[2], FR_BACK, CAM_RIB[1]]);
        for (j = J2) cyl_y(FS_CLR, CH_BACK - 1, FR_BACK + 1, j[0], j[1]);
        frame_loop_cut();                                                 // v23: service loop strap (v29: K1, K2 and the Pi's power lead)
        // v29: the lower bar's top 8 mm cut away under the Pi's USB-A ports (stacks at x -19 and -1), so the 90 deg plugs of the
        // USB leads (cable out to the left, towards K2) have 20 mm below the ports; the bar stays 8 mm tall there
        translate([USB_NOTCH[0], XB3_Y - 1, GC + DSP_XB_Z[1] + 8 - USB_NOTCH[2]]) cube([USB_NOTCH[1] - USB_NOTCH[0], FR_BACK - XB3_Y + 2, USB_NOTCH[2] + 1]);
        for (j = J2) cyl_y(6.2, REFL[0][0] - 1, CH_BACK + 0.01, j[0], j[1]);   // v20: the front's screw bosses (Ø6) reach into the channel corners; the strip wall keeps 0.6
    }
}
// v24 (Esben 26 Oct: the diffuser gave a little when pressed, which feels cheap): small cones on the frame's two faces that
// meet the ring's flange (the reflector's front edge inside, the strip wall outside, both at y REFL[0][0]) reach RB[0] past
// that face, so the frame always presses the flange forward and its shoulder onto the front plate, all the way round the
// straight runs, whatever the print tolerance. They squash flat when the front screws are tightened, like the CRUSH bumps.
RB = [0.25, 1.4, 0.5, -7.05, 7.35];       // reach, base Ø, tip Ø, r inside (reflector), r outside (strip wall)
RB_V = [52, 80, 98, 128, 150, 172, 208, 232, 256];   // z on the side runs (clear of the snap arms at 110 and 190)
RB_B = [-45, -22, 0, 22, 45];             // x on the bottom run (clear of the snap arms at +-60/62)
RB_T = [22, 42, 50];                      // |x| on the top runs (clear of the strip clips and the snap arms); v36: 22 presses the ring's end
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
// v36: soldered joints with heat shrink on the strip ends (on the top run, at the camera), over the lead slot
module placed_clips3() for (j = JOINTS3) let(s = STRIPS3[j[1]], t = s[2] == "w" ? 2.0 : s[3])
    translate([j[0] > 0 ? CAM_KEEP[0] : -CAM_KEEP[0] - j[2][0], s[0], RING_Z1 + STRIP_T3[1] - t - j[2][1]]) cube([j[2][0], s[1] - s[0], j[2][1]]);
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
            wing_groove_bosses();   // v30
            for (p = CABLE_LOOPS) cable_clip(p); strain_clip();   // v23: cable routing; v36: open clips
            fuse_holder();                                         // v36
            wago_row();                                            // v29
        }
        if (WING_POCKET) for (p = WING_P) translate([p[0] - WING_SLOT/2, D - BACK_T - 1, p[1] - 4]) cube([WING_SLOT, BACK_T + 2, 14]);   // keep the slots open (9 wide)
        if (WING_POCKET) { wing_drains(); wing_slot_chamfers(); }
        wing_grooves();   // v28
        if (WING_POCKET) for (p = WING_P) translate([p[0] - WING_PK[0], D - BACK_T - WING_PK[1], p[1] - 4 - WING_PK[2]]) cube([2*WING_PK[0], WING_PK[1] + 0.01, 14 + WING_PK[2] + WING_PK[4]]);   // nothing else inside a pocket
        for (j = J2) { cyl_y(6.4, SKIRT - 1, FR_BACK - CRUSH[0] - 0.01, j[0], j[1]); cyl_y(FS_CLR, FR_BACK - 1, D + 1, j[0], j[1]); csk_y(FS_CSK, FS_CLR, D, j[0], j[1]); }   // v27: head flush in the back face
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
               [42, 214, "v"],                                     // v24: the IMU's branch goes round the right of the mic core (until v23
                                                                   // straight up the middle, over the mic core and right behind the Pi's fan)
               // v29 (Esben 27 Oct: "baner og ruter frem for overalt"): the left lane up past the speaker and the 4G, the right lane
               // from the PSU's terminals up to the Wago row, and the shell end of the top hinge bundle K1 (K2's shell end is [-80, 72])
               [-45, 170, "h"], [-45, 222, "h"], [72, 200, "h"], [72, 245, "h"], [-85, 240, "h"],
               [-30, 232, "v"], [30, 232, "v"]];                   // ... and two under the Wago row for the distribution lane (v36: z 243 -> 232, 15 mm free under the block)
LOOP = [10.4, 2.2, 1.6, 2.0, 5];          // tunnel width (strap 10), tunnel height (strap 2), bridge, side posts, length
module cable_loop(p) translate([p[0], D - BACK_T + 0.01, p[1]]) rotate([0, p[2] == "h" ? 0 : 90, 0]) difference() {
    translate([-LOOP[4]/2, -(LOOP[1] + LOOP[2]), -LOOP[0]/2 - LOOP[3]]) cube([LOOP[4], LOOP[1] + LOOP[2] + 0.01, LOOP[0] + 2*LOOP[3]]);
    translate([-LOOP[4]/2 - 1, -LOOP[1], -LOOP[0]/2]) cube([LOOP[4] + 2, LOOP[1] + 0.02, LOOP[0]]);
}
module cable_loops() for (p = CABLE_LOOPS) cable_loop(p);
// v36 (Esben 31 Oct, samlenoter 13: the fuse holder had no place). [M] Esben's waterproof inline ATO holder: body 34.19 along the
// leads, 13.38 thick, 23.94 from its base to the top of the lid; a lead out of each end, the lid pulls off square to the leads and
// hangs on a strap. It stands on edge low on the right wall, in the largest free spot in the shell, beside the right lane that
// P1 (24 V +) runs up anyway: base against the back wall, lid to the front, so with the front off the lid comes straight off.
// A pocket the body's size with 2 crush ribs per side (as the Wago row), end walls slotted for the lead stubs.
FUSE = [13.38, 34.19, 23.94];             // [M] thickness (x), length along the leads (z), base to lid top (y)
FUSE_P = [99, 69];                        // centre x, z
FUSE_C = [0.15, 1.6, 9, 9];               // clearance per side, wall, wall height, lead slot width
module fuse_holder() translate([FUSE_P[0], D - BACK_T + 0.01, FUSE_P[1]]) rotate([90, 0, 0]) {   // local: x across, y = z of the box, z out of the wall
    a = FUSE[0]/2 + FUSE_C[0];  b = FUSE[1]/2 + FUSE_C[0];  t = FUSE_C[1];
    difference() {
        translate([-a - t, -b - t, 0]) cube([2*(a + t), 2*(b + t), FUSE_C[2]]);
        translate([-a, -b, -1]) cube([2*a, 2*b, FUSE_C[2] + 2]);
        translate([-FUSE_C[3]/2, -b - t - 1, -1]) cube([FUSE_C[3], 2*(b + t) + 2, FUSE_C[2] + 2]);   // lead slots in both ends
    }
    for (sx = [-1, 1], y = [-b/2, b/2]) translate([sx*a, y, 0]) cylinder(d = 2*(FUSE_C[0] + 0.1), h = FUSE_C[2], $fn = 12);   // crush ribs
}
module fuse_model() translate([FUSE_P[0], D - BACK_T, FUSE_P[1]]) rotate([90, 0, 0]) {
    translate([-FUSE[0]/2, -FUSE[1]/2, 0]) cube([FUSE[0], FUSE[1], 12]);           // base
    translate([-FUSE[0]/2, -11, 12 - 0.01]) cube([FUSE[0], 22, FUSE[2] - 12]);      // lid
    for (sy = [-1, 1]) translate([0, sy*(FUSE[1]/2 + 4), 6]) rotate([90, 0, 0]) cylinder(d = 6, h = 8, center = true, $fn = 24);   // lead stubs
}
// v36 (Esben 30 Oct, samlenoter 11: two strap loops under the Wago row stood 1-2 mm from it, no room to pull a strap through with
// the fingers; the same held for 3 more loops). Every loop is now an open clip: a C round the bundle, open to the front, so the
// bundle is pressed in from the front and nothing has to be threaded. [x, z, dir] as before: "h" = the bundle runs up/down,
// "v" = sideways. The main bundle's clips (x 0) are bigger.
CLIP = [9, 1.6, 6.5, 8];                  // inner Ø, wall, opening, length along the bundle
function clip_d(p) = p[0] == 0 ? 12 : CLIP[0];
module cable_clip(p) translate([p[0], D - BACK_T, p[1]]) rotate([0, p[2] == "h" ? 0 : 90, 0]) {
    d = clip_d(p);  r = d/2 + CLIP[1];  yc = -(d/2 + 0.5);
    translate([0, 0, -CLIP[3]/2]) linear_extrude(CLIP[3]) difference() {
        hull() { translate([0, yc]) circle(r = r, $fn = 40); translate([-r, -0.01]) square([2*r, 0.02]); }
        translate([0, yc]) circle(d = d, $fn = 40);
        translate([-CLIP[2]/2, yc - r - 1]) square([CLIP[2], r]);
    }
}
// v29: the Wago row. Until v28 the Wago clamps hung loose in the bundle (Esben's photo 27 Oct: wires everywhere). Now all six sit
// in one row of press-fit pockets on the front face of the wall cleat's block high on the back wall (y 58, z 247-286): levers to
// the front, so with the front off every lever and every entry is in reach, and the wire entries face down into a 20 mm
// distribution lane (z 240-262), where the left lane, the right lane and K1 arrive. The strip leads come out of the frame right
// above it. Order from the left (seen from the front): W6 white + (dimmed), W5 white -, W3 5 V +, W4 5 V GND, W2 GND, W1 24 V +.
// [A] WAGO data sheets 221-413 / 221-415: 18.7-18.8 wide (3 poles) / 29.9-30 (5 poles), 18.6-18.8 deep, 8.3-8.6 high;
//     221-414 by the 5.6 mm pitch: 24.4. The pockets take the largest figure + WG_C, and 2 crush ribs per side press it in.
WAGOS = [["W6", 3, 18.8], ["W5", 3, 18.8], ["W3", 4, 24.4], ["W4", 5, 30.0], ["W2", 5, 30.0], ["W1", 3, 18.8]];
WG = [18.8, 8.6];                          // depth (entry face to back), height (lever side up)
// v36 (Esben 30 Oct, samlenoter 1: the pockets were ~0.5 too big and nothing held the clamps, they could fall out): no clearance
// any more (the crush ribs give the press fit), and Esben's hooks: one per wire entry, from the pocket's open end it reaches 1.5 mm
// into the bottom of the entry (the floor side) and holds the clamp's entry end down. The clamp goes in entry end first, slides
// under the hooks and is laid down; its back end presses against the end wall. The hook takes only WG_HOOK[2] of the entry's
// height, so the stripped wire still goes in over it. [C] entries: one per pole, centred, about WG_HOLE over the floor.
WG_C = 0;  WG_GAP = 3;  WG_WALL = [1.6, 5.5];   // clearance per side (v29-v35: 0.2), wall between pockets, outer wall, wall height over the floor
WG_HOLE = [4.3, 3.4];                      // [C] wire entry: centre over the floor, size
WG_HOOK = [1.6, 1.5, 0.7, 1.4];            // width (x), reach into the entry, nose thickness, post thickness (z)
WG_Z = 262;                                // entry face (down); the backs rest on an end wall
WG_FL = [1.2, CLEAT_ZC - 27 + 39];         // floor on the block face, block top (286)
function wg_w(i) = WAGOS[i][2] + 2*WG_C;
function wg_x(i) = i == 0 ? -wg_x0() : wg_x(i - 1) + wg_w(i - 1) + WG_GAP;   // left edge of pocket i
function wg_x0() = (len(WAGOS) - 1)*WG_GAP/2 + sum_w(len(WAGOS) - 1)/2;
function sum_w(i) = i < 0 ? 0 : wg_w(i) + sum_w(i - 1);
WG_Y = D - BACK_T - CLEAT_D;               // 58: block face
module wago_row() {
    x0 = wg_x(0) - WG_WALL[0];  x1 = wg_x(len(WAGOS) - 1) + wg_w(len(WAGOS) - 1) + WG_WALL[0];
    z1 = WG_Z + WG[0] + WG_C + 1.6;
    difference() {
        union() {
            translate([x0, WG_Y - WG_FL[0], WG_Z - WG_HOOK[3] - 0.5]) cube([x1 - x0, WG_FL[0] + 0.01, z1 - WG_Z + WG_HOOK[3] + 0.5]);   // floor (v36: on down under the hooks)
            for (sx = [-1, 1]) translate([sx > 0 ? CLEAT_L/2 + 3 - 0.01 : x0, WG_Y - WG_FL[0], WG_Z - 0.5])                // feet past the block
                cube([sx > 0 ? x1 - CLEAT_L/2 - 3 + 0.01 : -CLEAT_L/2 - 3 - x0 + 0.01, D - BACK_T - WG_Y + WG_FL[0] + 0.01, z1 - WG_Z + 0.5]);
            translate([x0, WG_Y - WG_FL[0] - WG_WALL[1], z1 - 1.6]) cube([x1 - x0, WG_WALL[1] + 0.01, 1.6]);                // end wall at the backs
            for (i = [0 : len(WAGOS)]) {                                                                                        // side walls
                xa = i == 0 ? x0 : wg_x(i - 1) + wg_w(i - 1);  t = (i == 0 || i == len(WAGOS)) ? WG_WALL[0] : WG_GAP;
                translate([xa, WG_Y - WG_FL[0] - WG_WALL[1], WG_Z + 3]) cube([t, WG_WALL[1] + 0.01, z1 - WG_Z - 3]);
            }
            for (i = [0 : len(WAGOS) - 1], sx = [0, 1], z = [WG_Z + 7, WG_Z + 15])                                             // crush ribs
                translate([sx ? wg_x(i) + wg_w(i) : wg_x(i), WG_Y - WG_FL[0] - 4, z]) cylinder(d = 2*(WG_C + 0.1) + 0.01, h = 3, $fn = 12);
            // v36: the hooks, one per entry; the post stands on the floor below the entry face, the nose reaches up into the entry
            for (i = [0 : len(WAGOS) - 1], k = [0 : WAGOS[i][1] - 1]) let(xc = wg_x(i) + WG_C + WAGOS[i][2]*(k + 0.5)/WAGOS[i][1],
                    yf = WG_Y - WG_FL[0], yn = yf - (WG_HOLE[0] - WG_HOLE[1]/2)) {
                translate([xc - WG_HOOK[0]/2, yn - WG_HOOK[2], WG_Z - WG_HOOK[3]]) cube([WG_HOOK[0], yf - yn + WG_HOOK[2] + 0.01, WG_HOOK[3]]);
                translate([xc - WG_HOOK[0]/2, yn - WG_HOOK[2], WG_Z - 0.01]) cube([WG_HOOK[0], WG_HOOK[2], WG_HOOK[1] + 0.01]);
            }
        }
    }
}
module placed_wagos() for (i = [0 : len(WAGOS) - 1]) translate([wg_x(i) + WG_C, WG_Y - WG_FL[0] - WG[1], WG_Z]) cube([WAGOS[i][2], WG[1], WG[0]]);
// strain relief: a snap clip just above the power inlet holds the two leads from the jack (together up to Ø5.4), so a pull on
// the bundle never reaches the jack's terminals. It opens towards the front; the leads click in from the front.
STRAIN = [6.4, 1.6, 6, 4.6, 92];          // bore, wall, height (z), opening, z bottom (v36: 16 over the socket, which goes in from the front; for 2 x 1.5 mm2; v23-v35: Ø5.4 at z 84)
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
FRAME_LOOP = [30, GC + DSP_XB_Z[1], 7.6];  // x, z centre (lower cross bar, z 62.5-78.5), slot spacing (v23-v28)
// v29: the box opens like a book over its left side (front face down to the left of the shell, as Esben lays it). Every cable
// between the front and the shell crosses there in one of two hinge bundles, strapped on both halves: K1 (top: strips, Pi power,
// IMU) from the upper cross bar's left end, K2 (middle: the 3 USB cables, dimmer and reed) from the lower bar's left end. A third
// pair of slots on the upper bar, right of the fan guard, holds the Pi's power lead on its way to K1. The slot pair at x 30 on the
// lower bar (the v23-v28 service loop) is gone.
FRAME_LOOPS = [[-76, GC + DSP_XB_Z[1]], [-76, GC + DSP_XB_Z[0]], [34, GC + DSP_XB_Z[0]]];   // K2, K1, Pi power
USB_NOTCH = [-32, 10, 8];                  // x from, x to, depth from the lower bar's top
// v36 (Esben 30 Oct, samlenoter 10: nothing went through): v29-v35's slot pairs were cut from CH_BACK - 1 (y 26.7), but the cross
// bars start at XB3_Y (23.7), so 3 mm of solid bar was left in front of them. Even cut through, a strap would have had to be
// threaded blind down one slot, into the 6.6 mm gap to the display's back and up the other. Now the strap (cable tie or 10 mm
// hook-and-loop) goes round the whole bar: down past its front face in that gap and out under it, both ends in sight. A groove
// STRAP_GROOVE wide and deep over the bar's top, front and bottom faces keeps it from sliding along the bar; the bundle lies on
// the bar's back face as before. No slots, so the bar keeps its full section.
STRAP_GROOVE = [11, 1];
module frame_loop_cut() for (f = FRAME_LOOPS) translate([f[0] - STRAP_GROOVE[0]/2, 0, 0]) difference() {
    translate([0, XB3_Y - 1, f[1] - 8 - 1]) cube([STRAP_GROOVE[0], FR_BACK - XB3_Y + 2, 18]);
    translate([-1, XB3_Y + STRAP_GROOVE[1], f[1] - 8 + STRAP_GROOVE[1]]) cube([STRAP_GROOVE[0] + 2, FR_BACK, 16 - 2*STRAP_GROOVE[1]]);
}

// ------------------------------------------------------------ fan guard ----
// v24 (Esben 26 Oct: the Pi's fan stopped because of the wires in the box; it must have a fence so nothing can stop it). A
// separate print with a grille FG[0] above the Active Cooler: over the fan it has 2.5 mm slots (air in, no wire through);
// along both long edges it stops 20.5 from the middle, so the GPIO header and its plugs (x +-24.5) stay free on either side.
// Esben 26 Oct: it must not be screwed on. It clicks onto the frame's upper cross bar (the display, and with it the Pi on its
// stand-offs, is screwed to that bar, so the gap to the cooler does not depend on the shell): a pad on the bar's back face
// and 2 arms over the bar's top and bottom with lips that snap behind its front face. Off again: lever an arm up with a
// small screwdriver. The grille hangs 35-100 mm below the bar: a solid web between the bar and the cooler stiffens it, and 4 pegs stop
// 0.8 mm over the heat sink, outside the fan, if a bundle presses on it.
// v26 (print review 27 Oct): the v24/v25 STL lay with the arm tips on the bed and the grille 13 mm up in the air (the guide said
// grille down), and either way up the 2 arms stand on end, so the snap bends them across the layers. Everything here is an
// extrusion along x, so it now prints on its side (an x face on the bed): the arms, the pad, the web and the lips are whole
// profiles in every layer and bend along the layers, nothing overhangs, and the grille's slots run along x (until v25 along z),
// so on the bed they are upright slits with only a 2.5 mm bridge at their ends.
COOLER_TOP = PI_Y3 + PI_T + PI_COOLER[2];  // 32.45
PI_C = [0, GC + DSP_PI_DZ];               // Pi centre (x, z); holes at +-24.5, +-29
// v36 (Esben 30 Oct, samlenoter 8/8b: the grille's hole sat 80 mm down the guard, over the fins; the fan is ~100 down): the
// Active Cooler is now drawn from its data sheet (components.scad, PI_COOLER_P / PI_FAN). Its blower is at the PORT end,
// 9.3 below the Pi's hole centre and 5 towards the GPIO side (v24-v35 had it 14 above the centre), 104 mm below the guard's top.
// So the grille now runs down to 3 mm above the USB/Ethernet stack (it is only 0.7 mm behind the stack's top, so it must not
// overlap it) and is slotted over the WHOLE cooler, fins included: the fan is covered whatever the tolerance, and the fins'
// warm air gets out upwards too (until v35 a solid plate lay 3 mm over the fins). A rib down the middle keeps the slots short.
FAN_Z = PI_C[1] + PI_FAN[1];              // fan axis z (135.1)
COOLER_Z0 = PI_C[1] + PI_COOLER_P[1];     // 114.4: port end of the cooler
COOLER_Z1 = COOLER_Z0 + PI_COOLER[0];     // 177.9: fin end of the cooler
PORTS_Z1 = PI_C[1] - 29 - 23.5 - 2.5 + 21;   // 111.9: top of the USB/Ethernet stack
FG = [3.0, 1.6, 2.5, 2.0, 19, 20.5];      // gap over the cooler, grille thickness, slot, bar, slotted half width, half width
FG_Z0 = PORTS_Z1 + 3;                     // grille's lower edge, 3 mm above the ports
FG_SLOTS = [COOLER_Z0 + 2.5, COOLER_Z1 - 2, 2.0];   // slotted field z from, to; middle rib width
FG_CLIP = [2.0, 0.8, 1.3, 0.1];           // arm thickness, catch behind the bar, lip depth, play at the catch
// stop pegs 0.8 over the cooler, all >= 6 mm outside the intake: 4 on the fins, 2 on the blower housing's lower corners
FG_PEG = [4, 0.8, [[-15, 10], [15, 10], [-15, 22], [15, 22], [-17, -22], [7, -22]]];   // d, gap, [x, z from the Pi centre]
FG_Y = COOLER_TOP + FG[0];
XB_UP = GC + DSP_XB_Z[0];                 // 230.5: the upper cross bar, 16 high, from XB3_Y to FR_BACK
module fan_guard() {
    zb = [XB_UP - 8, XB_UP + 8];
    y1 = FG_Y + FG[1];
    ytip = XB3_Y - FG_CLIP[2];
    difference() {
        union() {
            ext_y(FG_Y, y1) translate([-FG[5], FG_Z0]) square([2*FG[5], zb[1] + FG_CLIP[0] - FG_Z0]);
            ext_y(FR_BACK, FG_Y + 0.01) translate([-FG[5], zb[0] + 1.5]) square([2*FG[5], zb[1] - zb[0] - 3]);   // pad on the bar
            // stiff web above the cooler; it starts 8 mm past the fin end, where the warm air leaves the fins
            ext_y(FR_BACK, FG_Y + 0.01) translate([-FG[5], COOLER_Z1 + 8]) square([2*FG[5], zb[0] - FG_CLIP[0] - 1 - COOLER_Z1 - 8]);
            for (s = [-1, 1]) {
                zo = s < 0 ? zb[0] : zb[1];                         // the bar face the arm runs along
                ext_y(ytip, y1) translate([-FG[5], s < 0 ? zo - FG_CLIP[0] : zo]) square([2*FG[5], FG_CLIP[0]]);
                // lip with a ramp: 0 at the tip, FG_CLIP[1] at the catch face (XB3_Y - play)
                hull() {
                    ext_y(ytip, ytip + 0.01) translate([-FG[5], zo - 0.01]) square([2*FG[5], 0.02]);
                    ext_y(XB3_Y - FG_CLIP[3] - 0.01, XB3_Y - FG_CLIP[3]) translate([-FG[5], s < 0 ? zo - 0.01 : zo - FG_CLIP[1]]) square([2*FG[5], FG_CLIP[1] + 0.01]);
                }
            }
        }
        // slots along x (upright slits on the bed, v26), in two fields either side of the middle rib
        ext_y(FG_Y - 1, y1 + 1) for (sx = [-1, 1], i = [0 : floor((FG_SLOTS[1] - FG_SLOTS[0] - FG[2])/(FG[2] + FG[3]))])
            translate([sx > 0 ? FG_SLOTS[2]/2 : -FG[4], FG_SLOTS[0] + i*(FG[2] + FG[3])]) square([FG[4] - FG_SLOTS[2]/2, FG[2]]);
    }
    // the pegs run up into the grille, so a peg closes the slot it stands on for 4 mm
    for (p = FG_PEG[2]) cyl_y(FG_PEG[0], COOLER_TOP + FG_PEG[1], y1, p[0], PI_C[1] + p[1]);
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
if (VIEW == "c_mcore")     mcore_model();
if (VIEW == "c_imu")       back_part(IMU_P, IMU, "red");
if (VIEW == "c_mics")      translate([-MSTRIP[0]/2, MSTRIP_Y - MSTRIP[1]/2, WALL - MIC_POCKET[2] + MIC_RING[2]]) cube(MSTRIP);
if (VIEW == "c_reed")      { back_part(REED_P, REED, "red"); translate([LOCK_X, LOCK_SY, LOCK_TZ[1] - 3]) cylinder(d = 8, h = 3, $fn = 24); }
if (VIEW == "c_speaker")   speaker3();
if (VIEW == "c_jack")      power_inlet();
if (VIEW == "c_fuse")      fuse_model();                                                 // v36
// screws: 4 front (v27: 4.0 x 50 T20 countersunk, heads flush in the back face), 4 camera (M2 x 6), 1 lock (4 x 25 Torx pin)
if (VIEW == "s_camera")    for (h = CAM_HOLES_ROT) screw_y(2, 6, [3.8, 1.3], h[0], CAM_PCB_Y + CAM_PCB[2], LENS_Z + h[1], -1);
if (VIEW == "s_lock")      both_locks() translate([$lx, LOCK_SY, LOCK_HEAD[1]]) { cylinder(d1 = 8.1, d2 = 4.2, h = 1.95, $fn = 24); cylinder(d = 4.2, h = 25, $fn = 16); }
if (VIEW == "x_elec")      { placed_electronics(); placed_services(); }
if (VIEW == "x_cleat")     wall_cleat2();
if (VIEW == "s_wall")      wall_screws();                                                // v28: the 6 wall screws, heads in the cleat's countersinks
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
if (VIEW == "x_cam_fov")   cam_fov();                                                     // v27: fit check, the lens's field of view
if (VIEW == "x_cam_lens")  cam_lens();                                                    // v27: fit check, the lens barrel (Ø7.25)
if (VIEW == "x_fanguard")  fan_guard();                                                   // v24
if (VIEW == "x_tema_top")   theme_top_demo();                                             // v21: example theme parts on the hooks
if (VIEW == "x_tema_vinge_v") theme_wing_demo(-1);
if (VIEW == "x_tema_vinge_h") theme_wing_demo(1);
if (VIEW == "c_tema_demo")  { main_unit(); color("orange") { theme_top_demo(); theme_wing_demo(-1); theme_wing_demo(1); } }
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
if (VIEW == "c_cooler")     translate([0, PI_Y3, GC + DSP_PI_DZ]) difference() {     // Active Cooler with its fan (v36: real position)
    translate([PI_COOLER_P[0], PI_T, PI_COOLER_P[1]]) cube([PI_COOLER[1], PI_COOLER[2], PI_COOLER[0]]);
    translate([PI_FAN[0], PI_T + PI_COOLER[2] - 2, PI_FAN[1]]) rotate([-90, 0, 0]) cylinder(r = PI_FAN[2], h = 3, $fn = 48);
}
if (VIEW == "c_fan")        translate([0, PI_Y3, GC + DSP_PI_DZ]) translate([PI_FAN[0], PI_T + PI_COOLER[2] - 2, PI_FAN[1]]) rotate([-90, 0, 0]) {
    cylinder(d = 8, h = 1.8, $fn = 32);
    for (a = [0:30:330]) rotate([0, 0, a]) translate([4, -1, 0]) cube([PI_FAN[2] - 4.5, 2, 1.6]);
}
if (VIEW == "c_psu5")      translate([PSU5_P[0], D - BACK_T - 1.2 - PSU5[2], PSU5_P[1]]) cube([PSU5[0], PSU5[2], PSU5[1]]);
if (VIEW == "c_wled")      placed_wled();
if (VIEW == "x_wled_holder") intersection() { shell3(); wled_frame() translate([-10, -15, -5]) cube([WLED_B[0] + 20, WLED_B[1] + 30, 40]); }
if (VIEW == "c_mosfet")    mosf_frame() mosfet_model();
if (VIEW == "x_shell3")    shell3();
if (VIEW == "s_front3")    for (j = J2) {   // v27: 4.0 x 50 T20, countersunk head flush with the back face (thread drawn at its 3.77 crest)
    cyl_y(3.77, FS_TIP, D - 1, j[0], j[1]);
    translate([j[0], D, j[1]]) rotate([90, 0, 0]) cylinder(d1 = FS[2], d2 = 3.77, h = (FS[2] - 3.77)/2, $fn = 32);
}
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
if (VIEW == "c_wagos")     placed_wagos();                                                // v29: the 6 Wago clamps in their row
if (VIEW == "x_wagorow")   wago_row();                                                    // v29: the row alone (print it for a v24-v28 shell)
if (VIEW == "wago_info")   echo(WGX = [for (i = [0 : len(WAGOS) - 1]) [WAGOS[i][0], wg_x(i), wg_x(i) + wg_w(i)]], WG_Y = WG_Y, XB = [GC + DSP_XB_Z[0], GC + DSP_XB_Z[1]]);
