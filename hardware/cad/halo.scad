// ============================================================================
//  SELFIEBOX "HALO" rev D – concept A in portrait, fully 3D-printed
//  Printer: Bambu Lab P2S Combo. Every part stays inside a 236 x 236 x 240 mm
//  safe zone and leaves room for the prime tower (tools/check_bed.py).
//
//  One front piece carries the screen AND the camera (no split). Two tall light
//  bars run the full height beside the screen, a translucent stripe glows
//  around the body, and a strip on the back lights the wall.
//
//  Attachments bolt to the top or bottom through a slim JOINT SPACER that
//  leaves a deliberate shadow gap:
//    top:     SIGN (backlit venue name),  ROOF (festival canopy)
//    bottom:  STRIP PRINTER (58 mm thermal, wall-friendly),
//             PHOTO BASE (Canon SELPHY CP1500, 10x15 colour prints, bar top),
//             FOOT (weighted bar-top foot)
//    back:    WALL CLEAT with lock, VESA 75;  bottom: 1/4"-20 tripod insert
//
//  Joint rule: screws always go UP from inside the lower piece into brass
//  inserts in the bottom of the piece above. Nothing is screwed from the top.
//
//  Coordinates: X = width, Z = up, Y = depth (front face at Y = 0).
//  Every module is modelled with its own bottom at Z = 0.
//  openscad -D 'PART="bezel"' -D 'PRINT=true' -o bezel.stl halo.scad
// ============================================================================

PART    = "assembly";
PRINT   = false;
EXPLODE = 0;
DISPLAY = "v1";        // "v1" = official 7" Touch Display (800x480, rotated)
                       // "td2" = Touch Display 2 (720x1280, native portrait)
UNIT_TOP = "joint";    // "joint" (accepts a top attachment) or "closed"
BOTTOM   = "strip";    // assembly view: "strip" | "photo" | "foot" | "none"
WITH_SIGN = true;
WITH_ROOF = false;
SIGN_TEXT = "CLUB NAME";
PRN_LABEL = "PHOTO STRIPS";

$fn = 48;

// ------------------------------------------------------------- display --
DSP = DISPLAY == "td2" ? [120.0, 189.5, 2.0, 15, 88, 155.5]
                       : [110.8, 194.0, 2.0, 20, 86, 155.0];
GLASS_W = DSP[0];  GLASS_H = DSP[1];  GLASS_T = DSP[2];   // GLASS_T: measure yours
DISP_DEPTH = DSP[3];  VIEW_W = DSP[4];  VIEW_H = DSP[5];
VIEW_DZ = 0;           // vertical offset of the picture vs glass centre – verify
FOAM = 1.0;            // EVA foam between the clamp pads and the display

// ------------------------------------------------------------- envelope --
D  = 66;   R = 16;     // depth, front-view corner radius
PT = 3.2;  SKIRT = 6;  WALL = 3;  BACK_T = 3;
FIT = 0.25;  TONGUE_T = 1.4;  TONGUE_L = 5;
EDGE_CH = 1.2;         // front edge chamfer (printed on the bed, hides elephant foot)

// light bars
SLOT_W = 11;  DIFF_FLANGE = 1.2;  DIFF_FLANGE_T = 1.2;  RIB_T = 1.6;
RIB_TOP = PT + 16;  RAIL_T = 2.5;
CH_HALF = SLOT_W/2 + DIFF_FLANGE + RIB_T;        // 8.3
SLOT_X = GLASS_W/2 + 1.2 + CH_HALF;              // v1: 64.9
EDGE_X = SLOT_X + CH_HALF + 0.4;                 // rail edge, carries the glow strip
W  = 2 * ceil(EDGE_X + 2 + 7 + WALL);            // v1: 172
HW = W / 2;
BAND_Y0 = 22;  BAND_Y1 = 32;                     // translucent stripe in the shell

// vertical layout
GLASS_BOT = 5.5;
GLASS_TOP = GLASS_BOT + GLASS_H;
CAM_BW = 25;  CAM_BH = 24;  CAM_LENS_FROM_TOP = 9.5;   // Camera Module 3 (Wide)
CAM_PCB_Y = PT + 4.5;  CAM_HOLE = 9.5;  CAM_FOV_HALF = 62;
CAM_BOARD_BOT = GLASS_TOP + 2;
CAM_Z  = CAM_BOARD_BOT + CAM_BH - CAM_LENS_FROM_TOP;  // lens centre
CAM_ZC = CAM_BOARD_BOT + CAM_BH/2;                    // board centre
H = ceil(CAM_BOARD_BOT + CAM_BH + 6.5);               // v1: 232
SLOT_Z0 = 14;  SLOT_Z1 = H - 16;                      // rib extents
SLOT_L = SLOT_Z1 - SLOT_Z0 - 2*CH_HALF;
SLOT_ZM = (SLOT_Z0 + SLOT_Z1) / 2;
CAM_RING = 26;                                         // accent ring around the lens

// side screws (front <-> shell)
BLOCK_X0 = EDGE_X + 0.2;
BLOCK_Z  = [40, H - 42];
SIDE_Y   = 10;
RAIL_EAR_X = BLOCK_X0 + 5;

// fasteners
INS_M3_D = 4.0;  INS_M3_L = 6.4;
INS_M4_D = 5.6;  INS_M4_L = 8.2;
INS_Q_D  = 7.9;  INS_Q_L  = 12.5;   // 1/4"-20 tripod (3/8"-16 for light stands)
M3_CLR = 3.4;  M3_HEAD = 6.4;  M4_CLR = 4.5;  SELF_TAP = 2.2;

// joint (same on every module)
IF_SCREW = [[-55, 44], [55, 44]];
IF_DOWEL = [[-30, 50], [30, 50]];
IF_CABLE = [0, 30];  IF_CABLE_D = 20;
TRIPOD_P = [0, 52];
VENT_X   = [40, 46];
SPACER_T = 6;          // shadow gap between modules

// back
CLEAT_L = 120;  CLEAT_ZC = H - 32;  CLEAT_D = 9;
GAP_WALL = 14;  PLATE_T = 4;
VESA = 75;  VESA_Z = H/2;
LOCK_Z = H - 72;
DC_POS = [-45, 40];

// attachments
H_PRN = 96;   PRN_CUT_W = 103;  PRN_CUT_H = 57;  PRN_Z = 46;   // CSN-A2 / DFR0503 panel printer
H_SIGN = 72;
SELPHY = [182.2, 133.0, 57.6];                                // W x D x H, Canon CP1500
PB_W = 228;  PB_FRONT = 140;  PB_H = 66;                      // photo base

// ============================================================ helpers ======
module ext_y(y0, y1) { multmatrix([[1,0,0,0],[0,0,1,y0],[0,1,0,0],[0,0,0,1]]) linear_extrude(y1 - y0) children(); }
module ext_x(x0, x1) { multmatrix([[0,0,1,x0],[1,0,0,0],[0,1,0,0],[0,0,0,1]]) linear_extrude(x1 - x0) children(); }
module ext_z(z0, z1) { translate([0, 0, z0]) linear_extrude(z1 - z0) children(); }
module rr(w, h, r) { r2 = min(r, w/2 - 0.01, h/2 - 0.01); translate([0, h/2]) offset(r2) square([w - 2*r2, h - 2*r2], center = true); }  // bottom at 0
module rrc(w, h, r) { r2 = min(r, w/2 - 0.01, h/2 - 0.01); offset(r2) square([w - 2*r2, h - 2*r2], center = true); }       // centred
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
// top / bottom: "joint" = joint holes, "closed" = solid
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
            for (p = IF_SCREW) { cyl_z(M3_CLR, h - 5, h + 1, p[0], p[1]); cyl_z(M3_HEAD, h - 20, h - 4, p[0], p[1]); }
            for (p = IF_DOWEL) cyl_z(6.2, h - 8, h + 1, p[0], p[1]);
            cyl_z(IF_CABLE_D, h - WALL - 1, h + 1, IF_CABLE[0], IF_CABLE[1]);
            if (vents) for (sx = [-1, 1], x = VENT_X) translate([sx*x - 1.5, 36, h - WALL - 1]) cube([3, 20, WALL + 2]);
        }
        for (sx = [-1, 1], z = blocks) {
            cyl_x(M3_CLR, sx > 0 ? HW - WALL - 1 : -HW - 1, sx > 0 ? HW + 1 : -HW + WALL + 1, SIDE_Y, z);
            cyl_x(M3_HEAD, sx > 0 ? HW - 1.4 : -HW - 1, sx > 0 ? HW + 1 : -HW + 1.4, SIDE_Y, z);
        }
    }
}

// ============================================================ MAIN UNIT ====
module slot_shape(d = 0) { for (sx = [-1, 1]) translate([sx*SLOT_X, SLOT_ZM]) rotate(90) slot2d(SLOT_L + 2*d, SLOT_W + 2*d); }

module bezel() {
    difference() {
        union() {
            front_base(H, BLOCK_Z);
            // light channels: opaque ribs, LEDs sit ~15 mm behind the diffuser
            ext_y(PT - 0.01, RIB_TOP) difference() { slot_shape(DIFF_FLANGE + RIB_T); slot_shape(DIFF_FLANGE); }
            // end stops that locate the display (the LED rail clamps it from behind)
            for (sx = [-1, 1], z = [GLASS_BOT - 1.8, GLASS_TOP + 0.2]) translate([sx*32 - 10, PT - 0.01, z]) cube([20, 8, 1.6]);
            // camera pocket, PCB pads and clamp bosses
            ext_y(PT - 0.01, PT + 4) translate([0, CAM_ZC]) difference() {
                square([CAM_BW + 0.8 + 2.4, CAM_BH + 0.8 + 2.4], center = true);
                square([CAM_BW + 0.8, CAM_BH + 0.8], center = true);
            }
            for (sx = [-1, 1], sz = [-1, 1])
                translate([sx*(CAM_BW/2 - 1.5) - 1.5, PT - 0.01, CAM_ZC + sz*(CAM_BH/2 - 1.5) - 1.5]) cube([3, CAM_PCB_Y - PT + 0.01, 3]);
            for (sx = [-1, 1]) cyl_y(7, PT - 0.01, CAM_PCB_Y + 1.6, sx*19, CAM_ZC);
            // stiffening ribs across the top band
            for (sx = [-1, 1]) translate([sx*40 - 0.8, PT - 0.01, GLASS_TOP + 3]) cube([1.6, 4, H - WALL - GLASS_TOP - 4]);
        }
        // screen window with a 45° chamfer
        hull() {
            ext_y(-1, PT - 1.6) translate([0, GLASS_BOT + GLASS_H/2 + VIEW_DZ]) square([VIEW_W + 1 + 3.2, VIEW_H + 1 + 3.2], center = true);
            ext_y(-1, PT + 1)   translate([0, GLASS_BOT + GLASS_H/2 + VIEW_DZ]) square([VIEW_W + 1, VIEW_H + 1], center = true);
        }
        // diffuser slots + flange recess
        ext_y(-1, PT + 1) slot_shape(0);
        ext_y(PT - DIFF_FLANGE_T, PT + 1) slot_shape(DIFF_FLANGE);
        // camera: lens hole, wide-angle cone, accent-ring inlay
        cyl_y(CAM_HOLE, -1, PT + 1, 0, CAM_Z);
        translate([0, -0.01, CAM_Z]) rotate([-90, 0, 0]) cylinder(d1 = CAM_HOLE + 2*PT*tan(CAM_FOV_HALF), d2 = CAM_HOLE, h = PT);
        camera_ring(0.6, -0.01);
        for (sx = [-1, 1]) cyl_y(SELF_TAP, PT + 0.6, CAM_PCB_Y + 2, sx*19, CAM_ZC);
        // LED rail pilots (in the side-screw blocks)
        for (sx = [-1, 1], z = BLOCK_Z) cyl_y(SELF_TAP, RIB_TOP - 5.5, RIB_TOP + 1, sx*RAIL_EAR_X, z);
    }
}
module camera_ring(depth, y0 = 0) {
    ext_y(y0, y0 + depth) translate([0, CAM_Z]) difference() { circle(d = CAM_RING); circle(d = CAM_HOLE + 2*PT*tan(CAM_FOV_HALF) + 0.4); }
}
module diffuser() {     // flat, long axis X, front face at y = 0
    ext_y(0, PT) slot2d(SLOT_L - 0.3, SLOT_W - 0.3);
    ext_y(PT - DIFF_FLANGE_T, PT) slot2d(SLOT_L + 2*DIFF_FLANGE - 0.4, SLOT_W + 2*DIFF_FLANGE - 0.4);
}

// LED rail: covers both light channels, clamps the display, carries the glow strips
CLAMP_Y = DISPLAY == "td2" ? PT + DISP_DEPTH + FOAM : PT + GLASS_T + FOAM;
PAD_Z = [GLASS_BOT + 9, GLASS_TOP - 9];      // pad centres, on the glass overhang
module led_rail() {
    xi = SLOT_X - CH_HALF - 0.4;
    difference() {
        union() {
            ext_y(RIB_TOP, RIB_TOP + RAIL_T) {
                for (sx = [-1, 1]) translate([sx*(xi + EDGE_X)/2, (SLOT_Z0 + SLOT_Z1)/2]) square([EDGE_X - xi, SLOT_Z1 - SLOT_Z0 + 0.8], center = true);
                translate([0, GLASS_BOT + 6.5]) square([2*xi + 1, 11], center = true);                      // bottom cross bar
                for (sx = [-1, 1]) translate([sx*(xi + 12)/2, GLASS_TOP - 6.5]) square([xi - 12 + 0.5, 11], center = true);  // top bar, gap for the camera cable
                for (sx = [-1, 1], z = BLOCK_Z) hull() { translate([sx*RAIL_EAR_X, z]) circle(d = 7); translate([sx*(EDGE_X - 1), z]) square([1, 7], center = true); }
            }
            // walls for the outward-facing glow strips
            for (sx = [-1, 1]) translate([sx > 0 ? EDGE_X - 1.6 : -EDGE_X, RIB_TOP + RAIL_T - 0.01, SLOT_Z0]) cube([1.6, BAND_Y1 + 0.5 - RIB_TOP - RAIL_T, SLOT_Z1 - SLOT_Z0]);
        }
        for (sx = [-1, 1], z = BLOCK_Z) cyl_y(2.9, RIB_TOP - 1, RIB_TOP + RAIL_T + 1, sx*RAIL_EAR_X, z);
        for (sx = [-1, 1], z = [SLOT_Z0 + 12, SLOT_Z1 - 12]) cyl_y(5, RIB_TOP - 1, RIB_TOP + RAIL_T + 1, sx*SLOT_X, z);
        if (CLAMP_Y < RIB_TOP - 0.5) for (sx = [-1, 1], z = PAD_Z) cyl_y(3.2, RIB_TOP - 1, RIB_TOP + RAIL_T + 1, sx*30, z);
    }
}
// v1 display: pads reach from the rail down to the glass overhang (4 pieces, push-fit peg)
module clamp_pad() {
    union() {
        translate([-10, CLAMP_Y, -4]) cube([20, RIB_TOP - CLAMP_Y, 8]);
        cyl_y(3.0, RIB_TOP - 0.01, RIB_TOP + RAIL_T - 0.3, 0, 0);
    }
}
module camera_clamp() {
    difference() {
        ext_y(CAM_PCB_Y + 1.6, CAM_PCB_Y + 4.1) hull() for (sx = [-1, 1]) translate([sx*19, CAM_ZC]) circle(d = 8);
        for (sx = [-1, 1]) cyl_y(2.8, 0, 30, sx*19, CAM_ZC);
        translate([-7, CAM_PCB_Y + 1.5, CAM_ZC - 6]) cube([14, 1.4, 12]);
    }
}

module cleat_groove_2d() {
    zb = CLEAT_ZC - 24;
    polygon([[D + 1, zb], [D - CLEAT_D, zb], [D - CLEAT_D, CLEAT_ZC + CLEAT_D], [D, CLEAT_ZC], [D + 1, CLEAT_ZC - 1]]);
}
module shell() {
    difference() {
        union() {
            shell_base(H, BLOCK_Z, top = UNIT_TOP, bottom = "joint", tripod = true);
            translate([-CLEAT_L/2 - 3, D - BACK_T - CLEAT_D, CLEAT_ZC - 27]) cube([CLEAT_L + 6, CLEAT_D + 0.01, 39]);
            for (sx = [-1, 1], sz = [-1, 1]) cyl_y(11, D - BACK_T - 8, D - 0.5, sx*VESA/2, VESA_Z + sz*VESA/2);
        }
        ext_x(-CLEAT_L/2, CLEAT_L/2) cleat_groove_2d();
        for (sx = [-1, 1], sz = [-1, 1]) cyl_y(INS_M4_D, D - INS_M4_L, D + 1, sx*VESA/2, VESA_Z + sz*VESA/2);
        cyl_y(M4_CLR, D - BACK_T - 1, D + 1, 0, LOCK_Z);
        cyl_y(8.0, D - BACK_T - 1, D + 1, DC_POS[0], DC_POS[1]);
        for (sx = [-1, 1], x = [50, 57]) ext_y(D - BACK_T - 1, D + 1) translate([sx*x, VESA_Z + 25]) rotate(90) slot2d(36, 3);
        ext_y(D - 1.2, D + 1) translate([0, 12]) difference() { rr(W - 24, H - 24, 8); translate([0, 11]) rr(W - 46, H - 46, 2); }
        cyl_y(5, D - BACK_T - 1, D + 1, -(HW - 17.5), 17.5);
        translate([HW - WALL - 0.01, 45, VESA_Z]) rotate([0, 90, 0]) difference() { cylinder(d = 24.6, h = 0.8); cylinder(d = 22.6, h = 2, center = true); }
        ext_y(D - 0.6, D + 1) translate([0, 40]) rrc(56, 22, 3);
    }
}

// ============================================================ JOINT SPACER ==
// Sits between any two pieces: aligns, carries the screws, leaves a 6 mm shadow
// gap. Print in PETG, or in TPU for outdoor use (it then also seals the joint).
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
PRN_BLOCKS = [22, H_PRN - 22];
module printer_front() {
    difference() {
        union() {
            front_base(H_PRN, PRN_BLOCKS);
            for (sx = [-1, 1]) translate([sx > 0 ? EDGE_X - 1.6 : -EDGE_X, PT - 0.01, 30]) cube([1.6, BAND_Y1 + 0.5 - PT, H_PRN - 60]);
        }
        translate([-PRN_CUT_W/2, -10, PRN_Z - PRN_CUT_H/2]) cube([PRN_CUT_W, 20, PRN_CUT_H]);
        printer_label(0.6, -0.01);
    }
}
module printer_label(depth, y0 = 0) {
    ext_y(y0, y0 + depth) translate([0, PRN_Z + PRN_CUT_H/2 + 9.5])
        text(PRN_LABEL, size = 5, font = "Liberation Sans:style=Bold", halign = "center", valign = "center", spacing = 1.3);
}
module printer_shell() { shell_base(H_PRN, PRN_BLOCKS, top = "joint", bottom = "joint", tripod = true); }

// ============================================================ SIGN =========
SIGN_BLOCKS = [22, H_SIGN - 22];      // keep blocks out of the rounded corners
module sign_text(depth, y0) {
    ext_y(y0, y0 + depth) translate([0, H_SIGN/2])
        resize([min(118, 9 * len(SIGN_TEXT) + 20), 0], auto = true) text(SIGN_TEXT, size = 22, font = "Liberation Sans:style=Bold", halign = "center", valign = "center");
}
module sign_front()   { difference() { front_base(H_SIGN, SIGN_BLOCKS); sign_text(PT + 2, -1); } }
module sign_letters() { sign_text(PT, 0); }      // co-print in translucent filament
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
// Canon SELPHY CP1500 sits on the table inside an open-bottom shroud; the
// cassette and prints come out of the front arch, the paper path is free at
// the back. The main unit stands on the rear of the top plate.
module photo_base() {
    t = 3.5;
    difference() {
        // outer shell (printed upside down: top plate on the bed)
        hull() {
            translate([0, 0, 0]) linear_extrude(PB_H - 1.2) translate([0, (D - PB_FRONT)/2]) rrc(PB_W, D + PB_FRONT, 20);
            linear_extrude(PB_H) translate([0, (D - PB_FRONT)/2]) rrc(PB_W - 2.4, D + PB_FRONT - 2.4, 18.8);
        }
        translate([0, 0, -1]) linear_extrude(PB_H - t + 1) translate([0, (D - PB_FRONT)/2]) rrc(PB_W - 2*t, D + PB_FRONT - 2*t, 20 - t);
        // front arch for cassette + prints, rear opening for the paper path
        hull() for (sx = [-1, 1]) {
            translate([sx*(SELPHY[0]/2 - 6), -PB_FRONT + 10, -1]) cylinder(r = 6, h = SELPHY[2] - 2);
            translate([sx*(SELPHY[0]/2 - 6), -PB_FRONT - 10, -1]) cylinder(r = 6, h = SELPHY[2] - 2);
        }
        translate([-(PB_W/2 - 26), D - 10, -1]) cube([PB_W - 52, 20, PB_H - t - 4 + 1]);
        // joint on the top plate (screws go up from underneath)
        for (p = IF_SCREW) { cyl_z(M3_CLR, PB_H - t - 1, PB_H + 1, p[0], p[1]); }
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

// ============================================================ MOCK-UPS =====
module mock_display() {
    color([0.05, 0.05, 0.07]) translate([-GLASS_W/2, PT, GLASS_BOT]) cube([GLASS_W, GLASS_T, GLASS_H]);
    mw = DISPLAY == "td2" ? GLASS_W - 4 : 100;  mh = DISPLAY == "td2" ? GLASS_H - 4 : 165;
    color([0.6, 0.6, 0.62]) translate([-mw/2, PT + GLASS_T, GLASS_BOT + GLASS_H/2 - mh/2]) cube([mw, DISP_DEPTH - GLASS_T, mh]);
}
module mock_pi() {
    y = PT + DISP_DEPTH + (DISPLAY == "td2" ? 5 : 0.5);
    color([0.1, 0.55, 0.25]) translate([-28, y, 60]) cube([56, 1.6, 85]);
    color([0.2, 0.2, 0.22]) translate([-15, y + 1.6, 95]) cube([30, 9, 30]);
}
module mock_camera() {
    color([0.1, 0.5, 0.25]) translate([-CAM_BW/2, CAM_PCB_Y, CAM_ZC - CAM_BH/2]) cube([CAM_BW, 1.6, CAM_BH]);
    color([0.1, 0.1, 0.1]) translate([0, PT - 1.5, CAM_Z]) rotate([-90, 0, 0]) cylinder(d = 8.5, h = CAM_PCB_Y - PT + 1.5);
}
module mock_strip_printer() {
    color([0.25, 0.25, 0.27]) translate([-55.5, PT, PRN_Z - 28.5]) cube([111, 50, 57]);
    color([0.3, 0.3, 0.32]) translate([-55.5, -3, PRN_Z - PRN_CUT_H/2 - 2]) cube([111, 3, PRN_CUT_H + 4]);
}
module mock_selphy() { color([0.92, 0.92, 0.9]) translate([-SELPHY[0]/2, -PB_FRONT + 6, 0]) cube([SELPHY[0], SELPHY[1], SELPHY[2]]); }

// ============================================================ ASSEMBLY =====
C_BODY = [0.11, 0.11, 0.12];  C_DIFF = [1, 0.97, 0.92];  C_INT = [0.25, 0.25, 0.27];  C_ACC = [0.85, 0.2, 0.55];
module band_split() {
    color(C_BODY) difference() { children(); translate([-500, BAND_Y0, -500]) cube([1000, BAND_Y1 - BAND_Y0, 1000]); }
    color(C_DIFF) intersection() { children(); translate([-500, BAND_Y0, -500]) cube([1000, BAND_Y1 - BAND_Y0, 1000]); }
}
B_H = BOTTOM == "strip" ? H_PRN : BOTTOM == "photo" ? PB_H : BOTTOM == "foot" ? 26 : 0;
Z_UNIT = B_H + (BOTTOM == "none" ? 0 : SPACER_T);
Z_TOP1 = Z_UNIT + H + SPACER_T;
module unit_assembly(e) {
    color(C_BODY) bezel(); color(C_ACC) camera_ring(0.6, -0.01);
    translate([0, -e*25, 0]) color(C_DIFF) for (sx = [-1, 1]) translate([sx*SLOT_X, 0, SLOT_ZM]) rotate([0, 90, 0]) diffuser();
    mock_display(); mock_camera();
    translate([0, e*20, 0]) color(C_INT) camera_clamp();
    translate([0, e*40, 0]) { color(C_INT) led_rail(); if (CLAMP_Y < RIB_TOP - 0.5) color(C_INT) for (sx = [-1, 1], z = PAD_Z) translate([sx*30, 0, z]) clamp_pad(); }
    translate([0, e*55, 0]) mock_pi();
    translate([0, e*90, 0]) band_split() shell();
    translate([0, e*140, 0]) color([0.3, 0.3, 0.32]) wall_cleat();
}
module assembly(e = EXPLODE) {
    if (BOTTOM == "strip") translate([0, 0, -e*60]) { color(C_BODY) printer_front(); color(C_ACC) printer_label(0.6, -0.01); mock_strip_printer(); translate([0, e*60, 0]) band_split() printer_shell(); }
    if (BOTTOM == "photo") translate([0, 0, -e*60]) { color(C_BODY) photo_base(); mock_selphy(); }
    if (BOTTOM == "foot") translate([0, 0, -e*60]) color([0.3, 0.3, 0.32]) foot();
    if (BOTTOM != "none" && BOTTOM != "foot") translate([0, 0, B_H - e*30]) color(C_INT) joint_spacer();
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

// ============================================================ OUTPUT =======
module face_down() { rotate([90, 0, 0]) children(); }
module back_down() { translate([0, 0, D]) rotate([-90, 0, 0]) children(); }

if (PART == "assembly") assembly();
else if (PART == "bezel")          { if (PRINT) face_down() bezel(); else bezel(); }
else if (PART == "camera_ring")    { if (PRINT) face_down() camera_ring(0.6, 0); else camera_ring(0.6, -0.01); }
else if (PART == "diffuser")       { if (PRINT) face_down() diffuser(); else diffuser(); }
else if (PART == "led_rail")       { if (PRINT) translate([0, 0, -RIB_TOP]) rotate([90, 0, 0]) led_rail(); else led_rail(); }
else if (PART == "clamp_pad")      { if (PRINT) translate([0, 0, -CLAMP_Y]) rotate([90, 0, 0]) clamp_pad(); else clamp_pad(); }
else if (PART == "camera_clamp")   { if (PRINT) translate([0, 0, CAM_PCB_Y + 4.1]) rotate([-90, 0, 0]) camera_clamp(); else camera_clamp(); }
else if (PART == "shell")          { if (PRINT) back_down() shell(); else shell(); }
else if (PART == "joint_spacer")   joint_spacer();
else if (PART == "printer_front")  { if (PRINT) face_down() printer_front(); else printer_front(); }
else if (PART == "printer_label")  { if (PRINT) face_down() printer_label(0.6, 0); else printer_label(0.6, -0.01); }
else if (PART == "printer_shell")  { if (PRINT) back_down() printer_shell(); else printer_shell(); }
else if (PART == "sign_front")     { if (PRINT) face_down() sign_front(); else sign_front(); }
else if (PART == "sign_letters")   { if (PRINT) face_down() sign_letters(); else sign_letters(); }
else if (PART == "sign_shell")     { if (PRINT) back_down() sign_shell(); else sign_shell(); }
else if (PART == "roof")           { if (PRINT) translate([0, 0, D]) rotate([-90, 0, 0]) roof(); else roof(); }
else if (PART == "photo_base")     { if (PRINT) translate([0, 0, PB_H]) rotate([180, 0, 0]) photo_base(); else photo_base(); }
else if (PART == "foot")           foot();
else if (PART == "wall_cleat")     { if (PRINT) translate([0, 0, D + GAP_WALL]) rotate([-90, 0, 0]) wall_cleat(); else wall_cleat(); }
