// ============================================================================
//  SELFIEBOX "HALO RING" rev G – 10" Touch Display 2, all black
//  Portrait selfie box with a full light ring around screen and camera,
//  fully 3D-printed on a Bambu Lab H2C (305 x 320 x 325 mm, heated chamber).
//  All bought parts come from components.scad, where every dimension carries
//  its source. Every printed part stays inside a 285 x 306 x 305 mm safe zone
//  (tools/check_bed.py), and tools/check_fit.py checks all clearances.
//
//  How things are held
//    Display   Touch Display 2 10" (native portrait). The LED rail's two cross
//              bars press its flat metal back forward through 1 mm EVA pads;
//              the glass sits on a 1 mm EVA ring around the window and the light
//              ring's ribs locate it with 1.2 mm clearance all round.
//    Camera    rotated 90 deg for native portrait frames; 4 x M2x6 thread-forming
//              screws through its own holes into bosses; the lens sits in a gap
//              at the top of the light ring, 1.2 mm behind the front face.
//    Pi 5      on the display's own M2.5 stand-offs (as Raspberry Pi intends).
//    Light     a 16 mm halo ring, raised 1.6 mm proud of the face. Each of its
//              four straight runs holds a high-CRI 12 V COB strip (photo light)
//              next to an SK6812 RGBW strip (colour); glow strips on the rail's
//              outer walls light a translucent stripe around the body.
//    Power     2 x Pololu D36V50F5 in snap cradles, a 70 x 50 mm perfboard in
//              slide-in rails (74AHCT125, fuse, terminals), panel DC jack.
//    Front     2 Torx M3 per side into brass inserts; shell hangs on the wall
//              cleat; an M4 lock screw from inside the shell into the cleat.
//
//  Coordinates: X = width, Z = up, Y = depth (front face at Y = 0). Every
//  module has its own bottom at Z = 0.
// ============================================================================
include <components.scad>

PART    = "assembly";
PRINT   = false;
EXPLODE = 0;
FPC     = -1;          // side of the display's LCD flex: -1 left, +1 right (see components.scad)
UNIT_TOP = "joint";    // "joint" or "closed"
BOTTOM   = "strip";    // assembly: "strip" | "photo" | "foot" | "none"
WITH_SIGN = true;
WITH_ROOF = false;
SIGN_TEXT = "CLUB NAME";
PRN_LABEL = "PHOTO STRIPS";

$fn = 48;

// ------------------------------------------------------------- envelope --
D  = 66;   R = 24;
PT = 3.2;  SKIRT = 6;  WALL = 3;  BACK_T = 3;
FIT = 0.25;  TONGUE_T = 1.4;  TONGUE_L = 5;
EDGE_CH = 1.2;
FOAM_C = 0.5;                       // compressed thickness of the 1 mm EVA foam ring
GLASS_Y = PT + FOAM_C;              // glass front face
GW = TD10_GLASS[0];  GH = TD10_GLASS[1];  // portrait: 166.9 wide, 248.1 tall

// light ring: four straight light channels on a rounded-rectangle centre line
SLOT_W = 14;  DIFF_FLANGE = 1.2;  DIFF_FLANGE_T = 1.2;  RIB_T = 1.6;
RIB_TOP = GLASS_Y + TD10_D + 0.5;  RAIL_T = 2.5;  XBAR_T = 4;   // 1 mm foam pads -> 0.5 mm
CH_HALF = SLOT_W/2 + DIFF_FLANGE + RIB_T;          // 9.8: centre line -> rib outer face
RING_R  = 22;                                      // centre-line corner radius
RING_PROUD = 1.6;  RING_FACE = SLOT_W + 4;         // raised diffuser ring: height, width
CHIN = 7;  TOPM = 6.5;                               // frame margins below / above the ring
CAM_GAP = 38;                                      // gap in the top of the ring for the camera

// vertical layout
CAM_CLEAR = 0.5;
GLASS_BOT = CHIN + 2*CH_HALF + 1.2;                 // 34.8
GLASS_TOP = GLASS_BOT + GH;
GC = GLASS_BOT + GH/2;
RING_X  = GW/2 + 1.2 + CH_HALF;                    // centre line
RING_Z0 = GLASS_BOT - 1.2 - CH_HALF;               // bottom centre line
LENS_Z = GLASS_TOP + 10.5 + 2.3 + 0.5;              // lower camera bosses (Ø4.6) clear the glass top by 0.5
RING_Z1 = LENS_Z;                                   // camera eye sits on the ring's top line
CAM_PCB_Y = 1.2 + CAM_LENS_H;
CAM_TOP = LENS_Z + CAM_PCB[0]/2;                    // rotated board: 12.5 above the lens
H = ceil(RING_Z1 + CH_HALF + TOPM);
EDGE_X = RING_X + CH_HALF + 0.4;                   // rail edge, carries the glow strip
W  = 2 * ceil(EDGE_X + 2 + 7 + WALL);
HW = W / 2;
BAND_Y0 = 22;  BAND_Y1 = 32;
// runs: [x, z, length, vertical?]  (straight parts only; corners stay solid)
RUN_V = (RING_Z1 - RING_Z0) - 2*RING_R;
RUN_H = 2*RING_X - 2*RING_R;
RUN_T = RUN_H/2 - CAM_GAP/2;                       // each top run (left / right of the camera)
RUNS = [[-RING_X, (RING_Z0 + RING_Z1)/2, RUN_V, true], [RING_X, (RING_Z0 + RING_Z1)/2, RUN_V, true],
        [0, RING_Z0, RUN_H, false],
        [-(CAM_GAP/2 + RUN_T/2), RING_Z1, RUN_T, false], [CAM_GAP/2 + RUN_T/2, RING_Z1, RUN_T, false]];
function run_leds(len) = floor((len - 20)/LED_PITCH);
GLOW_LEDS = floor((RUN_V - 8)/LED_PITCH);
VIEW_X = 0;                                         // [M] picture assumed centred
CAM_HOLE = CAM_BARREL + 1.65;
CAM_RING = 24;

// side screws
BLOCK_X0 = EDGE_X + 0.2;
BLOCK_Z  = [RING_Z0 + 50, RING_Z1 - 50];
SIDE_Y   = 10;
RAIL_EAR_X = BLOCK_X0 + 5;

// display mounting (M3 tabs)
XBAR_Z  = [GC - TD10_PLATE[1]/2 + 14, GC + TD10_PLATE[1]/2 - 14];   // cross bars press the back plate
PI_Y    = GLASS_Y + TD10_D + 6;                     // [M] Pi underside on the display's stand-offs

// hardware
INS_M3_D = INS_M3[0];  INS_M3_L = INS_M3[1];
INS_M4_D = INS_M4[0];  INS_M4_L = INS_M4[1];
INS_Q_D  = INS_Q[0];   INS_Q_L  = INS_Q[1];
M3_HEAD_CB = 6.4;  M4_CLR = 4.5;

// joint
IF_SCREW = [[-55, 44], [55, 44]];
IF_DOWEL = [[-30, 50], [30, 50]];
IF_CABLE = [0, 30];  IF_CABLE_D = 20;
TRIPOD_P = [0, 52];
VENT_X   = [40, 46];
SPACER_T = 6;

// back
CLEAT_L = 120;  CLEAT_ZC = H - 32;  CLEAT_D = 9;
GAP_WALL = 14;  PLATE_T = 4;
VESA = 75;  VESA_Z = GC;
LOCK_Z = H - 72;
DC_POS = [-52, 40];
PB_RAIL = [70, 50, 1.6];   PB_Z0 = 18;  PB_Y = D - BACK_T - 6;   // perfboard: size, bottom, back face y
POL_X = 46;  POL_Z = [18, 50];                                      // Pololu cradles (right side)

// attachments
H_PRN = 84;  PRN_Z = 38;
H_SIGN = 72;
PB_W = 228;  PB_FRONT = 140;  PB_H = 66;

// ============================================================ helpers ======
module ext_y(y0, y1) { multmatrix([[1,0,0,0],[0,0,1,y0],[0,1,0,0],[0,0,0,1]]) linear_extrude(y1 - y0) children(); }
module ext_x(x0, x1) { multmatrix([[0,0,1,x0],[1,0,0,0],[0,1,0,0],[0,0,0,1]]) linear_extrude(x1 - x0) children(); }
module ext_z(z0, z1) { translate([0, 0, z0]) linear_extrude(z1 - z0) children(); }
module rr(w, h, r) { r2 = min(r, w/2 - 0.01, h/2 - 0.01); translate([0, h/2]) offset(r2) square([w - 2*r2, h - 2*r2], center = true); }
module rrc(w, h, r) { r2 = min(r, w/2 - 0.01, h/2 - 0.01); offset(r2) square([w - 2*r2, h - 2*r2], center = true); }
module slot2d(l, w) { hull() for (s = [-1, 1]) translate([s*(l/2 - w/2), 0]) circle(d = w); }
module cyl_y(d, y0, y1, x, z) { translate([x, y0, z]) rotate([-90,0,0]) cylinder(d = d, h = y1 - y0); }
module cyl_z(d, z0, z1, x, y) { translate([x, y, z0]) cylinder(d = d, h = z1 - z0); }
module cyl_x(d, x0, x1, y, z) { translate([x0, y, z]) rotate([0, 90, 0]) cylinder(d = d, h = x1 - x0); }

// ---------------------------------------------------- generic front + shell --
module front_base(h, blocks) {
    difference() {
        union() {
            hull() { ext_y(EDGE_CH, PT) rr(W, h, R); ext_y(0, EDGE_CH) translate([0, EDGE_CH]) rr(W - 2*EDGE_CH, h - 2*EDGE_CH, R - EDGE_CH); }
            ext_y(PT - 0.01, SKIRT) difference() { rr(W, h, R); translate([0, WALL]) rr(W - 2*WALL, h - 2*WALL, R - WALL); }
            ext_y(SKIRT - 0.01, SKIRT + TONGUE_L) translate([0, WALL + FIT]) difference() {
                rr(W - 2*(WALL + FIT), h - 2*(WALL + FIT), R - WALL);
                translate([0, TONGUE_T]) rr(W - 2*(WALL + FIT + TONGUE_T), h - 2*(WALL + FIT + TONGUE_T), R - WALL - TONGUE_T);
            }
            for (sx = [-1, 1], z = blocks)
                translate([sx > 0 ? BLOCK_X0 : -(HW - WALL - FIT), PT - 0.01, z - 6]) cube([HW - WALL - FIT - BLOCK_X0, RIB_TOP - PT + 0.01, 12]);
        }
        for (sx = [-1, 1], z = blocks)
            cyl_x(INS_M3_D, sx > 0 ? HW - WALL - INS_M3_L : -(HW - WALL) - 0.3, sx > 0 ? HW - WALL + 0.3 : -(HW - WALL - INS_M3_L), SIDE_Y, z);
    }
}
module shell_base(h, blocks, top = "joint", bottom = "joint", tripod = false, vents = true) {
    difference() {
        union() {
            difference() {
                hull() { ext_y(SKIRT, D - 1) rr(W, h, R); ext_y(D - 1, D) translate([0, 1]) rr(W - 2, h - 2, R - 1); }
                ext_y(SKIRT - 1, D - BACK_T) translate([0, WALL]) rr(W - 2*WALL, h - 2*WALL, R - WALL);
            }
            if (bottom == "joint") {
                for (p = IF_SCREW) cyl_z(10, WALL - 0.01, 10, p[0], p[1]);
                for (p = IF_DOWEL) cyl_z(12, WALL - 0.01, 10, p[0], p[1]);
            }
            if (tripod) translate([TRIPOD_P[0] - 8, TRIPOD_P[1] - 8, WALL - 0.01]) cube([16, D - BACK_T - TRIPOD_P[1] + 8.01, 13]);
            if (top == "joint") {
                for (p = IF_SCREW) cyl_z(10, h - 9, h - WALL + 0.01, p[0], p[1]);
                for (p = IF_DOWEL) cyl_z(12, h - 10, h - WALL + 0.01, p[0], p[1]);
            }
        }
        if (bottom == "joint") {
            for (p = IF_SCREW) cyl_z(INS_M3_D, -1, INS_M3_L, p[0], p[1]);
            for (p = IF_DOWEL) cyl_z(6.2, -1, 8, p[0], p[1]);
            cyl_z(IF_CABLE_D, -1, WALL + 1, IF_CABLE[0], IF_CABLE[1]);
            if (vents) for (sx = [-1, 1], x = VENT_X) translate([sx*x - 1.5, 36, -1]) cube([3, 20, WALL + 2]);
        }
        if (tripod) cyl_z(INS_Q_D, -1, INS_Q_L, TRIPOD_P[0], TRIPOD_P[1]);
        if (top == "joint") {
            for (p = IF_SCREW) { cyl_z(M3_CLR, h - 5, h + 1, p[0], p[1]); cyl_z(M3_HEAD_CB, h - 20, h - 4, p[0], p[1]); }
            for (p = IF_DOWEL) cyl_z(6.2, h - 8, h + 1, p[0], p[1]);
            cyl_z(IF_CABLE_D, h - WALL - 1, h + 1, IF_CABLE[0], IF_CABLE[1]);
            if (vents) for (sx = [-1, 1], x = VENT_X) translate([sx*x - 1.5, 36, h - WALL - 1]) cube([3, 20, WALL + 2]);
        }
        for (sx = [-1, 1], z = blocks) {
            cyl_x(M3_CLR, sx > 0 ? HW - WALL - 1 : -HW - 1, sx > 0 ? HW + 1 : -HW + WALL + 1, SIDE_Y, z);
            cyl_x(M3_HEAD_CB, sx > 0 ? HW - 1.8 : -HW - 1, sx > 0 ? HW + 1 : -HW + 1.8, SIDE_Y, z);
        }
    }
}

// ============================================================ MAIN FRONT ===
module slot_shape(d = 0) { for (r = RUNS) translate([r[0], r[1]]) rotate(r[3] ? 90 : 0) slot2d(r[2] + 2*d, SLOT_W + 2*d); }
module ring2d(w) { translate([0, (RING_Z0 + RING_Z1)/2]) difference() { rrc(2*RING_X + w, RING_Z1 - RING_Z0 + w, RING_R + w/2); rrc(2*RING_X - w, RING_Z1 - RING_Z0 - w, RING_R - w/2); } }
module window2d(grow = 0) { translate([VIEW_X, GC]) square([TD10_VIEW[0] + 1 + 2*grow, TD10_VIEW[1] + 1 + 2*grow], center = true); }

module bezel() {
    difference() {
        union() {
            front_base(H, BLOCK_Z);
            ext_y(PT - 0.01, RIB_TOP) difference() { slot_shape(DIFF_FLANGE + RIB_T); slot_shape(DIFF_FLANGE); }
            // camera bosses (M2 thread-forming into Ø1.7)
            for (h = CAM_HOLES_ROT) cyl_y(4.6, PT - 0.01, CAM_PCB_Y, h[0], LENS_Z + h[1]);
        }
        hull() {
            ext_y(-1, PT - 1.6) window2d(1.6);
            ext_y(-1, PT + 1)   window2d(0);
        }
        ext_y(-1, PT + 1) slot_shape(0);
        ext_y(PT - DIFF_FLANGE_T, PT + 1) slot_shape(DIFF_FLANGE);
        // camera: barrel clearance, front cone, accent ring inlay, screw pilots
        cyl_y(CAM_HOLE, 1.2 - 0.01, PT + 1, 0, LENS_Z);
        translate([0, -0.01, LENS_Z]) rotate([-90, 0, 0]) cylinder(d1 = CAM_HOLE + 2*1.2*tan(62), d2 = CAM_HOLE, h = 1.22);
        for (h = CAM_HOLES_ROT) cyl_y(M2_PILOT, PT + 0.6, CAM_PCB_Y + 1, h[0], LENS_Z + h[1]);
        // tongue relief above the camera board
        translate([-CAM_PCB[1], SKIRT - 0.1, CAM_TOP - 1]) cube([2*CAM_PCB[1], TONGUE_L + 0.2, 10]);
        for (sx = [-1, 1], z = BLOCK_Z) cyl_y(M25_PILOT, RIB_TOP - 5.5, RIB_TOP + 1, sx*RAIL_EAR_X, z);
    }
}
module camera_ring(depth, y0 = 0) {
    ext_y(y0, y0 + depth) translate([0, LENS_Z]) difference() { circle(d = CAM_RING); circle(d = CAM_HOLE + 2*1.2*tan(62) + 0.4); }
}
module logo_shape(depth, y0 = 0) {
    ext_y(y0, y0 + depth) translate([0, (RING_Z0 - CH_HALF)/2 + 0.5])
        text("SELFIEBOX", size = 5, font = "Liberation Sans:style=Bold", halign = "center", valign = "center", spacing = 1.4);
}
// One-piece raised halo: a 20 mm ring standing 1.6 mm proud of the face, with four
// plugs that press into the light slots (0.15 mm interference + a drop of CA glue).
module diffuser_ring() {
    hc = RING_Z1 - RING_Z0;  zc = (RING_Z0 + RING_Z1)/2;  p = RING_PROUD;
    difference() {
        hull() { ext_y(-p, -p + 0.8) translate([0, zc]) rrc(2*RING_X + RING_FACE - 1.6, hc + RING_FACE - 1.6, RING_R + RING_FACE/2 - 0.8);
                 ext_y(-p + 0.8, 0.01) translate([0, zc]) rrc(2*RING_X + RING_FACE, hc + RING_FACE, RING_R + RING_FACE/2); }
        hull() { ext_y(-p - 0.01, -p + 0.8) translate([0, zc]) rrc(2*RING_X - RING_FACE + 1.6, hc - RING_FACE + 1.6, RING_R - RING_FACE/2 + 0.8);
                 ext_y(-p + 0.8, 0.02) translate([0, zc]) rrc(2*RING_X - RING_FACE, hc - RING_FACE, RING_R - RING_FACE/2); }
        ext_y(-p - 1, 1) translate([0, RING_Z1]) rrc(CAM_GAP, RING_FACE + 4, 6);    // camera gap
    }
    ext_y(0, PT) for (r = RUNS) translate([r[0], r[1]]) rotate(r[3] ? 90 : 0) slot2d(r[2] + 0.3 - 0.6, SLOT_W + 0.3 - 0.6);
}

// ============================================================ LED RAIL =====
// Covers both light channels, carries the glow strips, and holds the display
// by its four M3 tabs through two cross bars.
module led_rail() {
    xi = RING_X - CH_HALF - 0.4;
    difference() {
        union() {
            ext_y(RIB_TOP, RIB_TOP + RAIL_T) {
                ring2d(2*CH_HALF + 0.8);
                for (sx = [-1, 1], z = BLOCK_Z) hull() { translate([sx*RAIL_EAR_X, z]) circle(d = 7); translate([sx*(EDGE_X - 1), z]) square([1, 7], center = true); }
            }
            ext_y(RIB_TOP, RIB_TOP + XBAR_T) for (z = XBAR_Z) translate([0, z]) square([2*xi + 1, 14], center = true);
            for (sx = [-1, 1]) translate([sx > 0 ? EDGE_X - 1.6 : -EDGE_X, RIB_TOP + RAIL_T - 0.01, RING_Z0 + RING_R]) cube([1.6, BAND_Y1 + 0.5 - RIB_TOP - RAIL_T, RUN_V]);
        }
        for (sx = [-1, 1], z = BLOCK_Z) cyl_y(2.9, RIB_TOP - 1, RIB_TOP + RAIL_T + 1, sx*RAIL_EAR_X, z);
        // wire passes at both ends of every run (COB + RGBW)
        for (r = RUNS, s2 = [-1, 1]) translate([r[0] + (r[3] ? 0 : s2*(r[2]/2 - 6)), RIB_TOP - 1, r[1] + (r[3] ? s2*(r[2]/2 - 6) : 0)])
            rotate([-90, 0, 0]) cylinder(d = 5, h = RAIL_T + 2);
    }
}


// ============================================================ SHELL ========
module cleat_groove_2d() {
    zb = CLEAT_ZC - 24;
    polygon([[D + 1, zb], [D - CLEAT_D, zb], [D - CLEAT_D, CLEAT_ZC + CLEAT_D], [D, CLEAT_ZC], [D + 1, CLEAT_ZC - 1]]);
}
// 25.4 mm Pololu module lies flat in a tray with two snap lips; wires leave through the gap
module pololu_cradle(sz = POL50, hgt = 7) {
    difference() {
        translate([-1.6, -1.6, 0]) cube([sz[0] + 3.2, sz[1] + 3.2, hgt]);
        translate([0, 0, 1.2]) cube([sz[0] + 0.3, sz[1] + 0.3, hgt + 1]);
        translate([sz[0]/2 - 5, -3, 1.2]) cube([10, sz[1] + 6, hgt + 1]);
    }
    for (sy = [0, 1]) translate([2, sy > 0 ? sz[1] + 0.3 : -1.6, hgt - 0.01]) hull() {
        cube([4, 1.6, 0.01]); translate([0, sy > 0 ? -0.6 : 0.6, 1.2]) cube([4, 1.6, 0.01]);
    }
}
module shell(top = UNIT_TOP) {
    difference() {
        union() {
            shell_base(H, BLOCK_Z, top = top, bottom = "joint", tripod = true);
            translate([-CLEAT_L/2 - 3, D - BACK_T - CLEAT_D, CLEAT_ZC - 27]) cube([CLEAT_L + 6, CLEAT_D + 0.01, 39]);
            for (sx = [-1, 1], sz = [-1, 1]) cyl_y(11, D - BACK_T - 8, D - 0.5, sx*VESA/2, VESA_Z + sz*VESA/2);
            // perfboard slide rails (board stands 6 mm off the back wall, components face forward)
            for (sx = [-1, 1]) translate([sx > 0 ? PB_RAIL[0]/2 - 1.8 : -PB_RAIL[0]/2 - 2.2, PB_Y - 4, PB_Z0]) difference() {
                cube([4, D - BACK_T - (PB_Y - 4) + 0.01, PB_RAIL[1] + 2]);
                translate([sx > 0 ? -0.01 : 2.21, 4 - PB_RAIL[2] - 0.15, -1]) cube([1.8, PB_RAIL[2] + 0.3, PB_RAIL[1] + 4]);
            }
            translate([-PB_RAIL[0]/2 - 2.2, PB_Y - 4, PB_Z0 - 3]) cube([PB_RAIL[0] + 4.4, D - BACK_T - (PB_Y - 4) + 0.01, 3]);
            for (z = POL_Z) translate([POL_X, D - BACK_T + 0.01, z]) rotate([90, 0, 0]) pololu_cradle();
            for (p = [[-60, 110], [60, 110], [-60, 160], [0, 95]]) translate([p[0] - 5, D - BACK_T - 3, p[1] - 2]) difference() { cube([10, 3.01, 4]); translate([2, -0.01, -1]) cube([6, 1.8, 6]); }
        }
        ext_x(-CLEAT_L/2, CLEAT_L/2) cleat_groove_2d();
        for (sx = [-1, 1], sz = [-1, 1]) cyl_y(INS_M4_D, D - INS_M4_L, D + 1, sx*VESA/2, VESA_Z + sz*VESA/2);
        cyl_y(M4_CLR, D - BACK_T - 1, D + 1, 0, LOCK_Z);
        cyl_y(DC_JACK_HOLE, D - BACK_T - 1, D + 1, DC_POS[0], DC_POS[1]);
        for (sx = [-1, 1], x = [50, 57]) ext_y(D - BACK_T - 1, D + 1) translate([sx*x, VESA_Z + 25]) rotate(90) slot2d(36, 3);
        ext_y(D - 1.2, D + 1) translate([0, 12]) difference() { rr(W - 24, H - 24, 8); translate([0, 11]) rr(W - 46, H - 46, 2); }
        cyl_y(5, D - BACK_T - 1, D + 1, -(HW - 17.5), 17.5);
        translate([HW - WALL - 0.01, 45, VESA_Z]) rotate([0, 90, 0]) difference() { cylinder(d = 24.6, h = 0.8); cylinder(d = 22.6, h = 2, center = true); }
        ext_y(D - 0.6, D + 1) translate([0, 40]) rrc(56, 22, 3);
    }
}

module shell_closed() { shell("closed"); }   // plain unit: nothing on the top joint
// ============================================================ JOINT SPACER ==
module joint_spacer() {
    difference() {
        hull() {
            translate([0, 0, 0.6]) linear_extrude(SPACER_T - 1.2) translate([0, 34]) rrc(2*(HW - R) - 4, 56, 4);
            linear_extrude(SPACER_T) translate([0, 34]) rrc(2*(HW - R) - 5.2, 54.8, 3.4);
        }
        for (p = IF_SCREW) cyl_z(M3_CLR, -1, SPACER_T + 1, p[0], p[1]);
        for (p = IF_DOWEL) cyl_z(6.3, -1, SPACER_T + 1, p[0], p[1]);
        cyl_z(IF_CABLE_D, -1, SPACER_T + 1, IF_CABLE[0], IF_CABLE[1]);
        for (sx = [-1, 1], x = VENT_X) translate([sx*x - 1.5, 36, -1]) cube([3, 20, SPACER_T + 2]);
    }
}

// ============================================================ STRIP PRINTER =
// DFRobot DFR0503 (82 x 58 front, 77 x 53 cut-out, 42 deep) clamps into the 3.2 mm front.
PRN_BLOCKS = [22, H_PRN - 22];
module printer_front() {
    difference() {
        union() {
            front_base(H_PRN, PRN_BLOCKS);
            for (sx = [-1, 1]) translate([sx > 0 ? EDGE_X - 1.6 : -EDGE_X, PT - 0.01, 30]) cube([1.6, BAND_Y1 + 0.5 - PT, H_PRN - 60]);
        }
        translate([-PRN_CUT[0]/2 - 0.2, -10, PRN_Z - PRN_CUT[1]/2 - 0.2]) cube([PRN_CUT[0] + 0.4, 20, PRN_CUT[1] + 0.4]);
        // 0.4 mm seat for the printer's front flange keeps it square and centred
        ext_y(-1, 0.4) translate([0, PRN_Z]) square([PRN_FRONT[0] + 0.6, PRN_FRONT[1] + 0.6], center = true);
    }
}
module printer_label(depth, y0 = 0) {
    ext_y(y0, y0 + depth) translate([0, PRN_Z + PRN_FRONT[1]/2 + 7.5])
        text(PRN_LABEL, size = 5, font = "Liberation Sans:style=Bold", halign = "center", valign = "center", spacing = 1.3);
}
module printer_shell() {
    union() {
        shell_base(H_PRN, PRN_BLOCKS, top = "joint", bottom = "joint", tripod = true);
        // cradle for the 12 -> 9 V Pololu D36V28F9 (left, high on the back wall)
        translate([-HW + WALL + 4, D - BACK_T + 0.01, H_PRN - WALL - POL28[1] - 8]) rotate([90, 0, 0]) pololu_cradle(POL28, 6);
    }
}

// ============================================================ SIGN =========
SIGN_BLOCKS = [22, H_SIGN - 22];
module sign_text(depth, y0) {
    ext_y(y0, y0 + depth) translate([0, H_SIGN/2])
        resize([min(118, 9 * len(SIGN_TEXT) + 20), 0], auto = true) text(SIGN_TEXT, size = 22, font = "Liberation Sans:style=Bold", halign = "center", valign = "center");
}
module sign_front()   { difference() { front_base(H_SIGN, SIGN_BLOCKS); sign_text(PT + 2, -1); } }
module sign_letters() { sign_text(PT, 0); }
module sign_shell()   { shell_base(H_SIGN, SIGN_BLOCKS, top = "joint", bottom = "joint", vents = false); }

// ============================================================ ROOF =========
ROOF_OVER = 75;  ROOF_SIDE = 15;  ROOF_T = 3.5;
function roof_top(y) = 40 + (y - D) * 12 / (D + ROOF_OVER);
module roof() {
    zf = roof_top(-ROOF_OVER); zb = roof_top(D);
    difference() {
        union() {
            hull() {
                translate([-(HW - R), 2, 0]) cube([2*(HW - R), D - 2, 1]);
                translate([-(HW - R), 2, roof_top(2) - ROOF_T - 0.5]) cube([2*(HW - R), 0.01, 0.5]);
                translate([-(HW - R), D - 0.01, roof_top(D) - ROOF_T - 0.5]) cube([2*(HW - R), 0.01, 0.5]);
            }
            hull() {
                translate([-HW - ROOF_SIDE, -ROOF_OVER, zf - ROOF_T]) cube([W + 2*ROOF_SIDE, 0.01, ROOF_T]);
                translate([-HW - ROOF_SIDE, D - 0.01, zb - ROOF_T]) cube([W + 2*ROOF_SIDE, 0.01, ROOF_T]);
            }
            translate([-HW - ROOF_SIDE, -ROOF_OVER, zf - ROOF_T - 8]) cube([W + 2*ROOF_SIDE, 3, 8.01]);
            for (sx = [-1, 1]) translate([sx > 0 ? HW + 3 : -HW - 6.5, 0, 0])
                ext_x(0, 3.5) polygon([[-ROOF_OVER, zf - 0.5], [-ROOF_OVER, zf - ROOF_T - 18], [D, -SPACER_T - 44], [D, zb - 0.5]]);
        }
        for (p = IF_SCREW) cyl_z(INS_M3_D, -1, INS_M3_L, p[0], p[1]);
        for (p = IF_DOWEL) cyl_z(6.2, -1, 8, p[0], p[1]);
        difference() {
            translate([-(HW - R) + 6, 12, 10]) cube([2*(HW - R) - 12, D, roof_top(12) - ROOF_T - 14]);
            for (p = concat(IF_SCREW, IF_DOWEL)) cyl_z(14, 0, 40, p[0], p[1]);
        }
    }
}

// ============================================================ PHOTO BASE ===
module photo_base() {
    t = 3.5;
    difference() {
        hull() {
            linear_extrude(PB_H - 1.2) translate([0, (D - PB_FRONT)/2]) rrc(PB_W, D + PB_FRONT, 20);
            linear_extrude(PB_H) translate([0, (D - PB_FRONT)/2]) rrc(PB_W - 2.4, D + PB_FRONT - 2.4, 18.8);
        }
        translate([0, 0, -1]) linear_extrude(PB_H - t + 1) translate([0, (D - PB_FRONT)/2]) rrc(PB_W - 2*t, D + PB_FRONT - 2*t, 20 - t);
        hull() for (sx = [-1, 1]) {
            translate([sx*(SELPHY[0]/2 - 6), -PB_FRONT + 10, -1]) cylinder(r = 6, h = SELPHY[2] - 2);
            translate([sx*(SELPHY[0]/2 - 6), -PB_FRONT - 10, -1]) cylinder(r = 6, h = SELPHY[2] - 2);
        }
        translate([-(PB_W/2 - 26), D - 10, -1]) cube([PB_W - 52, 20, PB_H - t - 4 + 1]);
        for (p = IF_SCREW) cyl_z(M3_CLR, PB_H - t - 1, PB_H + 1, p[0], p[1]);
        for (p = IF_DOWEL) cyl_z(6.2, PB_H - t - 1, PB_H + 1, p[0], p[1]);
        cyl_z(IF_CABLE_D, PB_H - t - 1, PB_H + 1, IF_CABLE[0], IF_CABLE[1]);
        for (sx = [-1, 1], x = VENT_X) translate([sx*x - 1.5, 36, PB_H - t - 1]) cube([3, 20, t + 2]);
    }
}

// ============================================================ FOOT =========
module foot() {
    ph = 18;  bt = 8;
    difference() {
        union() {
            hull() { linear_extrude(bt - 1.2) translate([0, 30]) rrc(220, 170, 18); translate([0, 0, bt - 1.21]) linear_extrude(1.2) translate([0, 30]) rrc(217.6, 167.6, 16.8); }
            translate([0, 0, bt - 0.01]) linear_extrude(ph + 0.01) translate([0, 34]) rrc(2*(HW - R) - 4, 56, 4);
        }
        translate([-60, 12, bt]) cube([120, D, ph - 3]);
        for (p = IF_SCREW) { cyl_z(7, -1, bt + ph - 4, p[0], p[1]); cyl_z(M3_CLR, 0, bt + ph + 1, p[0], p[1]); }
        for (p = IF_DOWEL) cyl_z(6.2, bt + ph - 8, bt + ph + 1, p[0], p[1]);
        for (sx = [-1, 1], x = VENT_X) translate([sx*x - 1.5, 36, bt + ph - 4]) cube([3, 20, 6]);
        for (sx = [-1, 1]) translate([sx*55, -20, -1]) linear_extrude(5) rrc(80, 50, 6);
        for (sx = [-1, 1], y = [-45, 105]) cyl_z(12.5, -1, 1.5, sx*95, y);
    }
}

// ============================================================ WALL CLEAT ===
module bar_2d(yb) {
    zb = CLEAT_ZC - 12;
    polygon([[yb + 0.01, zb - (yb - D)], [D, zb], [D - CLEAT_D + 0.5, zb],
             [D - CLEAT_D + 0.5, CLEAT_ZC + CLEAT_D - 0.8], [D, CLEAT_ZC - 0.3], [yb + 0.01, CLEAT_ZC - 0.3]]);
}
module wall_cleat() {
    yb = D + GAP_WALL - PLATE_T;
    difference() {
        union() {
            ext_y(yb, yb + PLATE_T) {
                translate([0, CLEAT_ZC - 14]) rrc(CLEAT_L + 4, 52, 6);
                translate([0, (30 + CLEAT_ZC)/2]) rrc(60, CLEAT_ZC - 30, 6);
            }
            ext_x(-CLEAT_L/2 + 2, CLEAT_L/2 - 2) bar_2d(yb);
            cyl_y(14, D + 1, yb + 0.01, 0, LOCK_Z);
            for (z = [40, 100]) translate([-25, D + 1, z - 5]) cube([50, yb - D - 0.99, 10]);
        }
        cyl_y(INS_M4_D, D, D + 1 + INS_M4_L, 0, LOCK_Z);
        for (p = [[-48, CLEAT_ZC - 32], [48, CLEAT_ZC - 32], [0, 70], [0, 125]]) {
            cyl_y(5, yb - 1, yb + PLATE_T + 1, p[0], p[1]);
            translate([p[0], yb + 0.6, p[1]]) rotate([90, 0, 0]) cylinder(d1 = 5, d2 = 10.5, h = 2.8);
        }
    }
}

// ============================================================ PLACED PARTS ==
module placed_display()  { translate([0, GLASS_Y, GC]) rpi_touch_display2_10(); }
module placed_pi()       { translate([0, PI_Y, GC]) rpi5(); }
module placed_camera()   { translate([0, CAM_PCB_Y, LENS_Z]) camera_module3_wide_rot(); }
module placed_pads()     { color([0.2, 0.2, 0.2]) for (sx = [-1, 1], z = XBAR_Z) translate([sx*40 - 15, RIB_TOP - 0.5, z - 5]) cube([30, 0.5, 10]); }   // compressed EVA
module placed_power() {
    // board lies flat on the cradle floor against the back wall: 25.4 wide (x), 9.5 deep (y), 25.4 tall (z)
    for (z = POL_Z) translate([POL_X, D - BACK_T - 1.2 - POL50[2], z]) pololu([POL50[0], POL50[2], POL50[1]]);
    color([0.15, 0.4, 0.2]) translate([-PB_RAIL[0]/2, PB_Y - PB_RAIL[2], PB_Z0]) cube([PB_RAIL[0], PB_RAIL[2], PB_RAIL[1]]);
    color([0.3, 0.3, 0.3]) translate([-PB_RAIL[0]/2 + 4, PB_Y - PB_RAIL[2] - 12, PB_Z0 + 4]) cube([PB_RAIL[0] - 8, 12, PB_RAIL[1] - 8]);
    color([0.2, 0.2, 0.2]) translate([DC_POS[0], D - BACK_T - DC_JACK_BODY[1], DC_POS[1]]) rotate([-90, 0, 0]) cylinder(d = DC_JACK_BODY[0], h = DC_JACK_BODY[1]);
}
// In each run: RGBW strip on the inner half, COB strip on the outer half.
COB_W = 8;
module placed_leds() {
    for (r = RUNS) {
        o = (r[3] ? sign(r[0]) : sign(r[1] - GC));              // outward direction
        n = run_leds(r[2]);
        for (strip = [[LED_W, -(SLOT_W/2 + DIFF_FLANGE) + LED_W/2 + 0.2, [1, 0.85, 0.7]], [COB_W, (SLOT_W/2 + DIFF_FLANGE) - COB_W/2 - 0.2, [1, 1, 0.95]]])
            color(strip[2]) translate([r[0] + (r[3] ? o*strip[1] : 0), RIB_TOP - LED_T, r[1] + (r[3] ? 0 : o*strip[1])])
                if (r[3]) translate([-strip[0]/2, 0, -n*LED_PITCH/2]) cube([strip[0], LED_T, n*LED_PITCH]);
                else      translate([-n*LED_PITCH/2, 0, -strip[0]/2]) cube([n*LED_PITCH, LED_T, strip[0]]);
    }
    color([1, 0.9, 0.7]) for (sx = [-1, 1]) translate([sx > 0 ? EDGE_X : -EDGE_X - LED_T, BAND_Y0, GC - GLOW_LEDS*LED_PITCH/2]) cube([LED_T, LED_W, GLOW_LEDS*LED_PITCH]);
}

// ============================================================ ASSEMBLY =====
C_BODY = [0.11, 0.11, 0.12];  C_DIFF = [1, 0.97, 0.92];  C_INT = [0.25, 0.25, 0.27];  C_ACC = [0.85, 0.2, 0.55];
module band_split() {
    color(C_BODY) difference() { children(); translate([-500, BAND_Y0, -500]) cube([1000, BAND_Y1 - BAND_Y0, 1000]); }
    color(C_DIFF) intersection() { children(); translate([-500, BAND_Y0, -500]) cube([1000, BAND_Y1 - BAND_Y0, 1000]); }
}
B_H = BOTTOM == "strip" ? H_PRN : BOTTOM == "photo" ? PB_H : BOTTOM == "foot" ? 26 : 0;
Z_UNIT = B_H + (BOTTOM == "none" || BOTTOM == "foot" ? 0 : SPACER_T);
Z_TOP1 = Z_UNIT + H + SPACER_T;
module unit_assembly(e) {
    color(C_BODY) bezel();
    translate([0, -e*25, 0]) color(C_DIFF) diffuser_ring();
    translate([0, e*15, 0]) placed_display();
    translate([0, e*10, 0]) placed_camera();
    translate([0, e*30, 0]) placed_pads();
    translate([0, e*40, 0]) { color(C_INT) led_rail(); placed_leds(); }
    translate([0, e*55, 0]) placed_pi();
    translate([0, e*90, 0]) { band_split() shell(); placed_power(); }
    translate([0, e*140, 0]) color([0.3, 0.3, 0.32]) wall_cleat();
}
module assembly(e = EXPLODE) {
    if (BOTTOM == "strip") translate([0, 0, -e*60]) { color(C_BODY) printer_front(); translate([0, 0, PRN_Z]) dfr0503(); translate([0, e*60, 0]) band_split() printer_shell(); }
    if (BOTTOM == "photo") translate([0, 0, -e*60]) { color(C_BODY) photo_base(); color([0.92, 0.92, 0.9]) translate([-SELPHY[0]/2, -PB_FRONT + 6, 0]) cube([SELPHY[0], SELPHY[1], SELPHY[2]]); }
    if (BOTTOM == "foot") translate([0, 0, -e*60]) color([0.3, 0.3, 0.32]) foot();
    if (BOTTOM == "strip" || BOTTOM == "photo") translate([0, 0, B_H - e*30]) color(C_INT) joint_spacer();
    translate([0, 0, Z_UNIT]) unit_assembly(e);
    if (WITH_SIGN) translate([0, 0, Z_TOP1 + e*60]) {
        translate([0, 0, -SPACER_T - e*30]) color(C_INT) joint_spacer();
        color(C_BODY) sign_front(); color(C_DIFF) sign_letters(); translate([0, e*60, 0]) band_split() sign_shell();
    }
    if (WITH_ROOF) translate([0, 0, (WITH_SIGN ? Z_TOP1 + H_SIGN + SPACER_T : Z_TOP1) + e*120]) {
        translate([0, 0, -SPACER_T - e*30]) color(C_INT) joint_spacer();
        color(C_BODY) roof();
    }
}


// ============================================================ HARDWARE =====
// Every screw, insert and dowel: [group, owner part, type, position, direction, when].
// group: frame it lives in ("unit" = main unit, "strip" = printer module, "roof"/"topper" = own frame).
// position = head seat (screws) or entry point (inserts, dowels); direction = the way it goes in.
// when: "base" always, "top" only with a roof/topper on the top joint, "wing" with theme wings.
YB_CLEAT = D + GAP_WALL - PLATE_T;
HW_LIST = concat(
  [for (sx = [-1, 1], z = BLOCK_Z) ["unit", "bezel", "ins_m3", [sx*(HW - WALL), SIDE_Y, z], [-sx, 0, 0], "base"]],
  [for (sx = [-1, 1], z = BLOCK_Z) ["unit", "shell", "m3x8", [sx*(HW - 1.8), SIDE_Y, z], [-sx, 0, 0], "base"]],
  [for (sx = [-1, 1], z = BLOCK_Z) ["unit", "wing", "m3x12", [sx*(HW + 4.2), SIDE_Y, z], [-sx, 0, 0], "wing"]],
  [for (h = CAM_HOLES_ROT) ["unit", "v_camera", "m2x6", [h[0], CAM_PCB_Y + CAM_PCB[2], LENS_Z + h[1]], [0, -1, 0], "base"]],
  [for (sx = [-1, 1], z = BLOCK_Z) ["unit", "led_rail", "m25x6", [sx*RAIL_EAR_X, RIB_TOP + RAIL_T, z], [0, -1, 0], "base"]],
  [for (p = IF_SCREW) ["unit", "shell", "ins_m3", [p[0], p[1], 0], [0, 0, 1], "base"]],
  [["unit", "shell", "ins_q", [TRIPOD_P[0], TRIPOD_P[1], 0], [0, 0, 1], "base"]],
  [for (sx = [-1, 1], sz = [-1, 1]) ["unit", "shell", "ins_m4", [sx*VESA/2, D, VESA_Z + sz*VESA/2], [0, -1, 0], "base"]],
  [["unit", "shell", "m4x10", [0, D - BACK_T, LOCK_Z], [0, 1, 0], "base"]],
  [["unit", "wall_cleat", "ins_m4", [0, D, LOCK_Z], [0, 1, 0], "base"]],
  [for (p = [[-48, CLEAT_ZC - 32], [48, CLEAT_ZC - 32], [0, 70], [0, 125]]) ["unit", "wall_cleat", "wood45x50", [p[0], YB_CLEAT, p[1]], [0, 1, 0], "base"]],
  [for (p = IF_SCREW) ["unit", "shell", "m3x16", [p[0], p[1], H - 4], [0, 0, 1], "top"]],
  [for (p = IF_DOWEL) ["unit", "shell", "dowel6x20", [p[0], p[1], H - 8], [0, 0, 1], "top"]],
  [for (sx = [-1, 1], z = PRN_BLOCKS) ["strip", "printer_front", "ins_m3", [sx*(HW - WALL), SIDE_Y, z], [-sx, 0, 0], "base"]],
  [for (sx = [-1, 1], z = PRN_BLOCKS) ["strip", "printer_shell", "m3x8", [sx*(HW - 1.8), SIDE_Y, z], [-sx, 0, 0], "base"]],
  [for (p = IF_SCREW) ["strip", "printer_shell", "m3x16", [p[0], p[1], H_PRN - 4], [0, 0, 1], "base"]],
  [for (p = IF_DOWEL) ["strip", "printer_shell", "dowel6x20", [p[0], p[1], H_PRN - 8], [0, 0, 1], "base"]],
  [for (p = IF_SCREW) ["strip", "printer_shell", "ins_m3", [p[0], p[1], 0], [0, 0, 1], "base"]],
  [["strip", "printer_shell", "ins_q", [TRIPOD_P[0], TRIPOD_P[1], 0], [0, 0, 1], "base"]],
  [for (p = IF_SCREW) ["roof", "roof", "ins_m3", [p[0], p[1], 0], [0, 0, 1], "base"]],
  [for (p = IF_SCREW) ["topper", "topper", "ins_m3", [p[0], p[1], 0], [0, 0, 1], "base"]]
);
// Holes that are not fasteners themselves (for the hole tables): [part, label, position, direction, diameter, depth]
HOLE_LIST = concat(
  [["bezel", "Kamerahul", [0, 0, LENS_Z], [0, 1, 0], CAM_HOLE, PT]],
  [for (h = CAM_HOLES_ROT) ["bezel", "Pilot M2 (kamera)", [h[0], CAM_PCB_Y, LENS_Z + h[1]], [0, -1, 0], M2_PILOT, CAM_PCB_Y - PT - 0.6]],
  [for (sx = [-1, 1], z = BLOCK_Z) ["bezel", "Pilot M2,5 (skinne)", [sx*RAIL_EAR_X, RIB_TOP, z], [0, -1, 0], M25_PILOT, 5.5]],
  [for (sx = [-1, 1], z = BLOCK_Z) ["led_rail", "Hul M2,5", [sx*RAIL_EAR_X, RIB_TOP + RAIL_T, z], [0, -1, 0], 2.9, RAIL_T]],
  [for (sx = [-1, 1], z = BLOCK_Z) ["shell", "Frigang M3 + forsænkning Ø6,4", [sx*HW, SIDE_Y, z], [-sx, 0, 0], M3_CLR, WALL]],
  [for (p = IF_DOWEL) ["shell", "Styrestift bund", [p[0], p[1], 0], [0, 0, 1], 6.2, 8]],
  [["shell", "Kabelhul bund", [IF_CABLE[0], IF_CABLE[1], 0], [0, 0, 1], IF_CABLE_D, WALL]],
  [for (p = IF_SCREW) ["shell", "Frigang M3 top + forsænkning", [p[0], p[1], H], [0, 0, -1], M3_CLR, 5]],
  [for (p = IF_DOWEL) ["shell", "Styrestift top", [p[0], p[1], H], [0, 0, -1], 6.2, 8]],
  [["shell", "Kabelhul top", [IF_CABLE[0], IF_CABLE[1], H], [0, 0, -1], IF_CABLE_D, WALL]],
  [["shell", "DC-bøsning", [DC_POS[0], D, DC_POS[1]], [0, -1, 0], DC_JACK_HOLE, BACK_T]],
  [["shell", "Frigang M4 lås", [0, D, LOCK_Z], [0, -1, 0], M4_CLR, BACK_T]],
  [["shell", "Gennemføring Ø5", [-(HW - 17.5), D, 17.5], [0, -1, 0], 5, BACK_T]],
  [for (p = [[-48, CLEAT_ZC - 32], [48, CLEAT_ZC - 32], [0, 70], [0, 125]]) ["wall_cleat", "Vægskrue, undersænket", [p[0], YB_CLEAT, p[1]], [0, 1, 0], 5, PLATE_T]],
  [for (p = IF_SCREW) ["joint_spacer", "Frigang M3", [p[0], p[1], 0], [0, 0, 1], M3_CLR, SPACER_T]],
  [for (p = IF_DOWEL) ["joint_spacer", "Styrestift", [p[0], p[1], 0], [0, 0, 1], 6.3, SPACER_T]],
  [["joint_spacer", "Kabelhul", [IF_CABLE[0], IF_CABLE[1], 0], [0, 0, 1], IF_CABLE_D, SPACER_T]],
  [for (p = IF_DOWEL) ["roof", "Styrestift", [p[0], p[1], 0], [0, 0, 1], 6.2, 8]],
  [for (sx = [-1, 1], z = PRN_BLOCKS) ["printer_shell", "Frigang M3 + forsænkning Ø6,4", [sx*HW, SIDE_Y, z], [-sx, 0, 0], M3_CLR, WALL]],
  [for (p = IF_SCREW) ["printer_shell", "Frigang M3 top + forsænkning", [p[0], p[1], H_PRN], [0, 0, -1], M3_CLR, 5]],
  [for (p = IF_DOWEL) ["printer_shell", "Styrestift top", [p[0], p[1], H_PRN], [0, 0, -1], 6.2, 8]],
  [for (p = IF_DOWEL) ["printer_shell", "Styrestift bund", [p[0], p[1], 0], [0, 0, 1], 6.2, 8]],
  [["printer_front", "Udskæring printer", [0, 0, PRN_Z], [0, 1, 0], 0, PT]]
);

// ============================================================ OUTPUT =======
module face_down() { rotate([90, 0, 0]) children(); }
module back_down() { translate([0, 0, D]) rotate([-90, 0, 0]) children(); }

if (PART == "assembly") assembly();
else if (PART == "bezel")          { if (PRINT) face_down() bezel(); else bezel(); }
else if (PART == "diffuser_ring")  { if (PRINT) translate([0, 0, RING_PROUD]) face_down() diffuser_ring(); else diffuser_ring(); }
else if (PART == "led_rail")       { if (PRINT) translate([0, 0, -RIB_TOP]) rotate([90, 0, 0]) led_rail(); else led_rail(); }
else if (PART == "shell")          { if (PRINT) back_down() shell(); else shell(); }
else if (PART == "joint_spacer")   joint_spacer();
else if (PART == "printer_front")  { if (PRINT) face_down() printer_front(); else printer_front(); }
else if (PART == "printer_shell")  { if (PRINT) back_down() printer_shell(); else printer_shell(); }
else if (PART == "sign_front")     { if (PRINT) face_down() sign_front(); else sign_front(); }
else if (PART == "sign_letters")   { if (PRINT) face_down() sign_letters(); else sign_letters(); }
else if (PART == "sign_shell")     { if (PRINT) back_down() sign_shell(); else sign_shell(); }
else if (PART == "roof")           { if (PRINT) translate([0, 0, D]) rotate([-90, 0, 0]) roof(); else roof(); }
else if (PART == "photo_base")     { if (PRINT) translate([0, 0, PB_H]) rotate([180, 0, 0]) photo_base(); else photo_base(); }
else if (PART == "foot")           foot();
else if (PART == "wall_cleat")     { if (PRINT) translate([0, 0, D + GAP_WALL]) rotate([-90, 0, 0]) wall_cleat(); else wall_cleat(); }
else if (PART == "v_display")      placed_display();
else if (PART == "v_pi")           placed_pi();
else if (PART == "v_camera")       placed_camera();
else if (PART == "v_pads")         placed_pads();
else if (PART == "v_power")        placed_power();
else if (PART == "v_leds")         placed_leds();
else if (PART == "v_diffusers")    diffuser_ring();
else if (PART == "v_printer")      translate([0, 0, PRN_Z]) dfr0503();
else if (PART == "v_pol9")         translate([-HW + WALL + 4, D - BACK_T - 1.2 - POL28[2], H_PRN - WALL - POL28[1] - 8]) pololu([POL28[0], POL28[2], POL28[1]]);
else if (PART == "shell_closed")   shell_closed();
else if (PART == "hardware") { echo(HW_LIST = HW_LIST); echo(HOLE_LIST = HOLE_LIST); echo(VARS = [W, H, D, H_PRN, SPACER_T, LOCK_Z, CLEAT_ZC, GC, LENS_Z]); }
else if (PART == "geom") echo(GEOM = [W, H, D, R, SIDE_Y, BLOCK_Z[0], BLOCK_Z[1], H_SIGN, H_PRN, PRN_Z, SPACER_T, EDGE_CH, M3_CLR, INS_M3_D, INS_M3_L, PRN_FRONT[0], PRN_FRONT[1]]);
else if (PART == "info") echo(W = W, H = H, GLASS_TOP = GLASS_TOP, GC = GC, LENS_Z = LENS_Z, CAM_PCB_Y = CAM_PCB_Y, PI_Y = PI_Y, RING = [RING_X, RING_Z0, RING_Z1], RUN_V = RUN_V, RUN_H = RUN_H, LEDS = [run_leds(RUN_V), run_leds(RUN_H), run_leds(RUN_T)], RUN_T = RUN_T, XBAR_Z = XBAR_Z, CAM_TOP = CAM_TOP);
