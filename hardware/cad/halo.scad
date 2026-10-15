// ============================================================================
//  SELFIEBOX "HALO" – fully 3D-printed enclosure
//  Target printer: 256 x 256 x 256 mm (Bambu Lab A1 / P1S / X1C class)
//
//  Coordinate system (assembled, unit hanging on a wall):
//    X = width (left/right), Z = height (up), Y = depth.
//    Front face of the bezel is at Y = 0, back of the unit at Y = DEPTH.
//
//  Render a single part with:   openscad -D 'PART="bezel"' -o bezel.stl halo.scad
//  PART = "assembly" (default, for viewing), "bezel", "diffuser_top",
//         "diffuser_side", "led_rail", "display_clamp", "camera_clamp",
//         "shell", "wall_plate", "desk_stand", "logo_inlay"
//  PRINT = true  -> part is rotated into its recommended print orientation.
// ============================================================================

PART  = "assembly";
PRINT = false;
EXPLODE = 0;          // 0..1, only for PART="assembly"

$fn = 48;

// ---------------------------------------------------------------- envelope --
W      = 240;         // outer width
H      = 204;         // outer height
R      = 18;          // outer corner radius (front view)
DEPTH  = 66;          // total depth, front face -> back face
PT     = 3.2;         // front plate thickness
SKIRT  = 8;           // bezel depth; the shell starts here
WALL   = 3.0;         // shell wall thickness
BACK_T = 3.0;         // shell back thickness
TONGUE_T = 1.4;       // bezel alignment tongue that slides inside the shell
TONGUE_L = 5;
FIT    = 0.25;        // sliding clearance
EDGE_CH = 1.2;        // chamfer on the front edge (printed against the bed)

// ------------------------------------------------- display (official 7" v1) --
// Raspberry Pi 7" Touch Display (800x480): glass 194 x 110.76, active 155 x 86
GLASS_W = 194.0;
GLASS_H = 110.8;
GLASS_T = 2.0;        // glass + touch layer; measure yours and adjust
GLASS_Z = -18;        // glass centre (display sits low, camera above)
ACTIVE_W = 155;
ACTIVE_H = 86;
ACTIVE_DZ = 0;        // vertical offset of active area vs glass centre – verify!
DISP_DEPTH = 20;      // incl. the factory stand-offs the Pi mounts on
FOAM = 1.0;           // EVA foam tape between clamps and glass
GLASS_BOT = GLASS_Z - GLASS_H/2;
LIP_OV = 3;           // how far the bottom lips overlap the glass

// ---------------------------------------------------- camera (Camera Module 3) --
CAM_Z   = 60;         // lens centre height
CAM_BW  = 25;         // board width
CAM_BH  = 24;         // board height
CAM_LENS_FROM_TOP = 9.5;   // lens centre measured from board top edge – verify
CAM_PCB_Y = PT + 4.5;      // front face of the camera PCB (lens pokes into plate)
CAM_HOLE  = 9.5;           // lens hole at the back of the plate
CAM_FOV_HALF = 62;         // 120 deg wide lens -> cone so the bezel never vignettes

// ---------------------------------------------------------- light bars --
SLOT_W   = 11;        // visible width of a light bar
SLOT_TB_L = 184;      // top/bottom bar length
SLOT_TB_Z = 83.5;     // top/bottom bar centre height
SLOT_S_L  = 140;      // side bar length
SLOT_S_X  = 106.5;    // side bar centre x
DIFF_FLANGE = 1.2;    // diffuser flange (keeps it from being pushed out)
DIFF_FLANGE_T = 1.2;
RIB_T   = 1.6;
RIB_TOP = PT + 16;    // LEDs sit ~15 mm behind the diffuser = smooth light
RAIL_T  = 2.5;

// ---------------------------------------------------------- edge glow band --
// A 10 mm stripe of the back shell is printed in translucent filament (a plain
// filament change at two layer heights – no purge per layer). A second strip on
// the LED rail's back wall shines outward into it, so the whole unit carries a
// glowing ring that is visible from the side and from across the room.
BAND_Y0 = 22;
BAND_Y1 = 32;
EDGE_X  = 108.6;      // outer face of the edge-strip wall
EDGE_Z  = 90.6;
EDGE_R  = 12;         // strip wraps the corners – keep >= 10 mm

// ---------------------------------------------------------- fasteners --
INS_M3_D = 4.0;  INS_M3_L = 6.2;    // brass heat-set M3 (Ø4.5 x 5.9)
INS_M4_D = 5.6;  INS_M4_L = 8.2;    // brass heat-set M4 (VESA)
INS_Q_D  = 7.9;  INS_Q_L  = 12.5;   // brass heat-set 1/4"-20 (tripod)
M3_CLR = 3.4;    M3_HEAD = 6.2;
SELF_TAP = 2.2;                     // pilot for M2.5 self-tapping screws
CLOSE_X = 70;                       // closure screws at x = ±70, top & bottom
CLOSE_Y = 16;

// ---------------------------------------------------------- wall cleat --
CLEAT_L  = 150;       // length of the groove in the shell back
CLEAT_ZC = 62;        // z where the cleat ceiling meets the back face
CLEAT_D  = 9;         // groove depth into the back
GAP_WALL = 14;        // distance between unit back and wall
PLATE_T  = 4;

// ---------------------------------------------------------- VESA / tripod --
VESA = 75;
VESA_Z = -10;
LOCK_X = -40;
LOCK_Y = DEPTH - 5;
DC_X = 50;            // 5.5/2.1 mm panel DC jack in the bottom
DC_D = 8.0;

// ============================================================ helpers ======
// 2-D shape in (x, z) extruded along +Y from y0 to y1
module ext_y(y0, y1) {
    multmatrix([[1,0,0,0],[0,0,1,y0],[0,1,0,0],[0,0,0,1]])
        linear_extrude(y1 - y0) children();
}
// 2-D shape in (y, z) extruded along +X from x0 to x1
module ext_x(x0, x1) {
    multmatrix([[0,0,1,x0],[1,0,0,0],[0,1,0,0],[0,0,0,1]])
        linear_extrude(x1 - x0) children();
}
module rrect(w, h, r) {
    r2 = min(r, w/2 - 0.01, h/2 - 0.01);
    offset(r2) square([w - 2*r2, h - 2*r2], center = true);
}
module slot2d(l, w) { hull() { for (s = [-1, 1]) translate([s*(l/2 - w/2), 0]) circle(d = w); } }

// the four light-bar slots in the front plate (2-D, x/z), grown by d
module slots2d(d = 0) {
    for (s = [-1, 1]) {
        translate([0, s*SLOT_TB_Z]) slot2d(SLOT_TB_L + 2*d, SLOT_W + 2*d);
        translate([s*SLOT_S_X, 0]) rotate(90) slot2d(SLOT_S_L + 2*d, SLOT_W + 2*d);
    }
}
module cyl_y(d, y0, y1, x, z) { translate([x, y0, z]) rotate([-90,0,0]) cylinder(d = d, h = y1 - y0); }
module cyl_z(d, z0, z1, x, y) { translate([x, y, z0]) cylinder(d = d, h = z1 - z0); }

// ============================================================ BEZEL ========
module bezel() {
    difference() {
        union() {
            // front plate with chamfered front edge
            hull() {
                ext_y(EDGE_CH, PT) rrect(W, H, R);
                ext_y(0, EDGE_CH) rrect(W - 2*EDGE_CH, H - 2*EDGE_CH, R - EDGE_CH);
            }
            // outer skirt
            ext_y(PT - 0.01, SKIRT) difference() { rrect(W, H, R); rrect(W - 2*WALL, H - 2*WALL, R - WALL); }
            // alignment tongue (slides inside the shell -> no light leaks, perfect seam)
            ext_y(SKIRT - 0.01, SKIRT + TONGUE_L) difference() {
                rrect(W - 2*WALL - 2*FIT, H - 2*WALL - 2*FIT, R - WALL);
                rrect(W - 2*WALL - 2*FIT - 2*TONGUE_T, H - 2*WALL - 2*FIT - 2*TONGUE_T, R - WALL - TONGUE_T);
            }
            // light channels (opaque ribs around each diffuser – no light bleed onto the screen)
            ext_y(PT - 0.01, RIB_TOP) difference() {
                slots2d(DIFF_FLANGE + RIB_T);
                slots2d(DIFF_FLANGE);
            }
            // closure blocks (top & bottom) – screws come in from the top/bottom faces
            for (sx = [-1, 1], sz = [-1, 1])
                translate([sx*CLOSE_X - 8, PT - 0.01, sz > 0 ? 92.6 : -(H/2 - WALL - FIT)])
                    cube([16, 22 - PT, (H/2 - WALL - FIT) - 92.6]);
            // display clamp bosses (above the glass)
            for (sx = [-1, 1]) cyl_y(9, PT - 0.01, 12, sx*60, GLASS_Z + GLASS_H/2 + 8.6);
            // glass retaining lips (below the glass): glass is laid in 3 mm high, then slid down under them
            for (sx = [-1, 1]) translate([sx*60 - 12, PT - 0.01, GLASS_BOT - 1.8])
                cube([24, GLASS_T + 4.3, 1.6]);                                   // bottom stop
            for (sx = [-1, 1]) translate([sx*60 - 12, PT + GLASS_T + 0.3, GLASS_BOT - 1.8])
                cube([24, 4, 1.8 + LIP_OV]);                                       // lip over the glass edge
            // camera pocket walls + clamp bosses
            ext_y(PT - 0.01, PT + 4) difference() {
                translate([0, CAM_Z - CAM_LENS_FROM_TOP + CAM_BH/2]) square([CAM_BW + 0.8 + 3.2, CAM_BH + 0.8 + 3.2], center = true);
                translate([0, CAM_Z - CAM_LENS_FROM_TOP + CAM_BH/2]) square([CAM_BW + 0.8, CAM_BH + 0.8], center = true);
            }
            for (sx = [-1, 1]) cyl_y(7, PT - 0.01, CAM_PCB_Y + 1.6, sx*19, CAM_Z - CAM_LENS_FROM_TOP + CAM_BH/2);
            // camera PCB rest pads (corners only – clear of components)
            for (sx = [-1, 1], sz = [-1, 1])
                translate([sx*(CAM_BW/2 - 1.5) - 1.5, PT - 0.01, CAM_Z - CAM_LENS_FROM_TOP + CAM_BH/2 + sz*(CAM_BH/2 - 1.5) - 1.5])
                    cube([3, CAM_PCB_Y - PT + 0.01, 3]);
            // LED rail bosses
            for (sx = [-1, 1]) cyl_y(7, PT - 0.01, RIB_TOP, sx*60, 70);
            for (sx = [-1, 1]) cyl_y(6, PT - 0.01, RIB_TOP, sx*30, -94.6);
            // stiffening ribs behind the top band (keeps a 240 mm plate dead flat)
            for (sx = [-1, 1]) translate([sx*38 - 0.8, PT - 0.01, 50]) cube([1.6, 4, 22]);
        }
        // screen window with chamfer
        hull() {
            ext_y(-1, PT - 1.6) translate([0, GLASS_Z + ACTIVE_DZ]) square([ACTIVE_W + 2 + 3.2, ACTIVE_H + 2 + 3.2], center = true);
            ext_y(-1, PT + 1)   translate([0, GLASS_Z + ACTIVE_DZ]) square([ACTIVE_W + 2, ACTIVE_H + 2], center = true);
        }
        // glass pocket (glass lies directly on the plate)
        // light slots + flange recess behind
        ext_y(-1, PT + 1) slots2d(0);
        ext_y(PT - DIFF_FLANGE_T, PT + 1) slots2d(DIFF_FLANGE);
        // camera: lens hole + wide-angle cone
        cyl_y(CAM_HOLE, -1, PT + 1, 0, CAM_Z);
        translate([0, -0.01, CAM_Z]) rotate([-90, 0, 0])
            cylinder(d1 = CAM_HOLE + 2*PT*tan(CAM_FOV_HALF), d2 = CAM_HOLE, h = PT);
        // camera clamp screw pilots
        for (sx = [-1, 1]) cyl_y(SELF_TAP, PT + 0.6, CAM_PCB_Y + 2, sx*19, CAM_Z - CAM_LENS_FROM_TOP + CAM_BH/2);
        // display clamp inserts
        for (sx = [-1, 1]) cyl_y(INS_M3_D, 12 - INS_M3_L, 12.1, sx*60, GLASS_Z + GLASS_H/2 + 8.6);
        // LED rail pilots
        for (sx = [-1, 1]) cyl_y(SELF_TAP, PT + 1, RIB_TOP + 1, sx*60, 70);
        for (sx = [-1, 1]) cyl_y(SELF_TAP, PT + 1, RIB_TOP + 1, sx*30, -94.6);
        // closure inserts (vertical)
        for (sx = [-1, 1], sz = [-1, 1])
            translate([sx*CLOSE_X, CLOSE_Y, sz*(H/2 - WALL + 0.2)]) rotate([sz > 0 ? 180 : 0, 0, 0])
                cylinder(d = INS_M3_D, h = INS_M3_L + 0.2);
        // logo inlay recess (0.6 mm = 3 layers -> multicolour with almost no purge)
        logo_shape(0.6, -0.01);
    }
}

module logo_shape(depth, y0 = 0) {
    ext_y(y0, y0 + depth)
        translate([0, -(H/2 - 6.8)])
            text("SELFIEBOX", size = 5.2, font = "Liberation Sans:style=Bold", halign = "center", valign = "center", spacing = 1.35);
}

// ============================================================ DIFFUSERS ====
// Print in translucent/natural PETG, 100 % infill. Either co-print with the
// bezel (multi-material) or print separately and press in from the back.
module diffuser_tb() {
    ext_y(0, PT) slot2d(SLOT_TB_L - 0.3, SLOT_W - 0.3);
    ext_y(PT - DIFF_FLANGE_T, PT) slot2d(SLOT_TB_L + 2*DIFF_FLANGE - 0.4, SLOT_W + 2*DIFF_FLANGE - 0.4);
}
module diffuser_side() {
    rotate([0, 90, 0]) mirror([0,0,0]) {
        ext_y(0, PT) slot2d(SLOT_S_L - 0.3, SLOT_W - 0.3);
        ext_y(PT - DIFF_FLANGE_T, PT) slot2d(SLOT_S_L + 2*DIFF_FLANGE - 0.4, SLOT_W + 2*DIFF_FLANGE - 0.4);
    }
}

// ============================================================ LED RAIL =====
// One frame that closes all four light channels; the LED strip is stuck on its
// front face. Printed flat in black PETG.
module led_rail() {
    difference() {
        union() {
            ext_y(RIB_TOP, RIB_TOP + RAIL_T) difference() {
                rrect(2*(SLOT_S_X + SLOT_W/2 + DIFF_FLANGE + RIB_T + 0.4), 2*(SLOT_TB_Z + SLOT_W/2 + DIFF_FLANGE + RIB_T + 0.4), 10);
                rrect(2*(SLOT_S_X - SLOT_W/2 - DIFF_FLANGE - RIB_T - 0.4), 2*(SLOT_TB_Z - SLOT_W/2 - DIFF_FLANGE - RIB_T - 0.4), 3);
            }
            // ears
            for (sx = [-1, 1]) ext_y(RIB_TOP, RIB_TOP + RAIL_T) hull() {
                translate([sx*60, 70]) circle(d = 8);
                translate([sx*60 - 5, 74]) square([10, 1]);
            }
            for (sx = [-1, 1]) ext_y(RIB_TOP, RIB_TOP + RAIL_T) hull() {
                translate([sx*30, -94.6]) circle(d = 7);
                translate([sx*30 - 5, -92]) square([10, 1]);
            }
            // wall carrying the outward-facing edge-glow strip
            ext_y(RIB_TOP + RAIL_T - 0.01, BAND_Y1 + 0.5) difference() {
                rrect(2*EDGE_X, 2*EDGE_Z, EDGE_R);
                rrect(2*EDGE_X - 3.2, 2*EDGE_Z - 3.2, EDGE_R - 1.6);
            }
        }
        for (p = [[60, 70], [-60, 70], [30, -94.6], [-30, -94.6]]) cyl_y(2.9, RIB_TOP - 1, RIB_TOP + RAIL_T + 1, p[0], p[1]);
        // wire passes at the four corners
        for (sx = [-1, 1], sz = [-1, 1]) cyl_y(5, RIB_TOP - 1, RIB_TOP + RAIL_T + 1, sx*(SLOT_S_X), sz*(SLOT_TB_Z));
        // wire pass for the edge strip
        translate([-EDGE_X - 1, RIB_TOP + RAIL_T + 2, -60]) cube([4, 4, 8]);
    }
}

// ============================================================ CLAMPS =======
module display_clamp(sx = 1) {
    z0 = GLASS_Z + GLASS_H/2 + 8.6;
    difference() {
        union() {
            translate([sx*60 - 6, 12, GLASS_Z + GLASS_H/2 - 4]) cube([12, 3, z0 + 5 - (GLASS_Z + GLASS_H/2 - 4)]);
            // finger pressing the glass (via foam)
            translate([sx*60 - 6, PT + GLASS_T + FOAM, GLASS_Z + GLASS_H/2 - 4]) cube([12, 12 - (PT + GLASS_T + FOAM) + 0.01, 4]);
            // end stop
            translate([sx*60 - 6, PT + 0.3, GLASS_Z + GLASS_H/2 + 0.4]) cube([12, 12 - PT - 0.3 + 0.01, 3]);
        }
        cyl_y(M3_CLR, 10, 16, sx*60, z0);
    }
}
module camera_clamp() {
    zc = CAM_Z - CAM_LENS_FROM_TOP + CAM_BH/2;
    difference() {
        ext_y(CAM_PCB_Y + 1.6, CAM_PCB_Y + 1.6 + 2.5) hull() for (sx = [-1, 1]) translate([sx*19, zc]) circle(d = 8);
        for (sx = [-1, 1]) cyl_y(2.8, 0, 30, sx*19, zc);
        // relief for parts on the back of the camera PCB
        translate([-7, CAM_PCB_Y + 1.5, zc - 6]) cube([14, 1.4, 12]);
    }
}

// ============================================================ SHELL ========
module cleat_groove_2d() {   // (y, z) profile
    zb = CLEAT_ZC - 24;
    polygon([[DEPTH + 1, zb], [DEPTH - CLEAT_D, zb], [DEPTH - CLEAT_D, CLEAT_ZC + CLEAT_D], [DEPTH, CLEAT_ZC], [DEPTH + 1, CLEAT_ZC - 1]]);
}
module shell() {
    difference() {
        union() {
            difference() {
                ext_y(SKIRT, DEPTH) rrect(W, H, R);
                ext_y(SKIRT - 1, DEPTH - BACK_T) rrect(W - 2*WALL, H - 2*WALL, R - WALL);
            }
            // block behind the cleat groove
            translate([-CLEAT_L/2 - 3, DEPTH - BACK_T - CLEAT_D - 0.01 + 0.0, CLEAT_ZC - 27])
                cube([CLEAT_L + 6, CLEAT_D + 0.02, 39]);
            // VESA 75 bosses
            for (sx = [-1, 1], sz = [-1, 1]) cyl_y(11, DEPTH - BACK_T - 8, DEPTH - 0.5, sx*VESA/2, VESA_Z + sz*VESA/2);
            // tripod boss (bottom, under the centre of mass)
            translate([-9, 34, -H/2 + 0.5]) cube([18, 18, 15]);   // kept behind the glow band
            // anti-theft lock boss
            translate([LOCK_X - 6, DEPTH - 12, -H/2 + 0.5]) cube([12, 11, 10]);
        }
        // closure screws: clearance + counterbore
        for (sx = [-1, 1], sz = [-1, 1]) {
            translate([sx*CLOSE_X, CLOSE_Y, sz*(H/2 - WALL - 0.5)]) rotate([sz > 0 ? 0 : 180, 0, 0]) cylinder(d = M3_CLR, h = WALL + 2);
            translate([sx*CLOSE_X, CLOSE_Y, sz*(H/2 - 1.6)]) rotate([sz > 0 ? 0 : 180, 0, 0]) cylinder(d = M3_HEAD, h = 3);
        }
        // French-cleat groove
        ext_x(-CLEAT_L/2, CLEAT_L/2) cleat_groove_2d();
        // VESA inserts
        for (sx = [-1, 1], sz = [-1, 1]) cyl_y(INS_M4_D, DEPTH - INS_M4_L, DEPTH + 1, sx*VESA/2, VESA_Z + sz*VESA/2);
        // tripod insert 1/4"-20
        cyl_z(INS_Q_D, -H/2 - 1, -H/2 + INS_Q_L, 0, 43);
        // anti-theft lock insert
        cyl_z(INS_M3_D, -H/2 - 1, -H/2 + INS_M3_L, LOCK_X, LOCK_Y);
        // DC jack
        cyl_z(DC_D, -H/2 - 1, -H/2 + WALL + 1, DC_X, 46);
        // bottom intake vents
        for (sx = [-1, 1], i = [0 : 5]) translate([sx*(64 + i*8) - 1.5, 35, -H/2 - 1]) cube([3, 22, WALL + 2]);
        // rear exhaust vents (hidden against the wall – nothing can be spilled into them)
        for (sx = [-1, 1], i = [0 : 3]) ext_y(DEPTH - BACK_T - 1, DEPTH + 1) translate([sx*(66 + i*8), 10]) slot2d(3, 38) ;
        // rear "halo" LED channel (wall-wash glow) + wire entry
        ext_y(DEPTH - 1.2, DEPTH + 1) difference() { rrect(W - 24, H - 24, 8); rrect(W - 46, H - 46, 2); }
        cyl_y(5, DEPTH - BACK_T - 1, DEPTH + 1, -(W/2 - 17.5), -(H/2 - 17.5));
        // drill guide for an optional 24 mm arcade button (right side)
        translate([W/2 - WALL - 0.01, 38, -55]) rotate([0, 90, 0]) difference() { cylinder(d = 24.6, h = 0.8); cylinder(d = 22.6, h = 2, center = true); }
        // label recess on the back (serial / venue / QR)
        ext_y(DEPTH - 0.6, DEPTH + 1) translate([0, -62]) rrect(70, 26, 3);
    }
}

// ============================================================ WALL PLATE ===
module bar_2d(yb) {     // cleat bar profile (y, z); yb = plate front face
    zb = CLEAT_ZC - 12;
    polygon([[yb + 0.01, zb - (yb - DEPTH)], [DEPTH, zb], [DEPTH - CLEAT_D + 0.5, zb],
             [DEPTH - CLEAT_D + 0.5, CLEAT_ZC + CLEAT_D - 0.8], [DEPTH, CLEAT_ZC - 0.3], [yb + 0.01, CLEAT_ZC - 0.3]]);
}
module wall_plate() {
    yb = DEPTH + GAP_WALL - PLATE_T;
    difference() {
        union() {
            ext_y(yb, yb + PLATE_T) translate([0, -16]) rrect(160, 184, 10);
            ext_x(-CLEAT_L/2 + 2, CLEAT_L/2 - 2) bar_2d(yb);
            // anti-theft lip under the unit
            translate([LOCK_X - 15, LOCK_Y - 6, -H/2 - 6]) cube([30, yb - (LOCK_Y - 6) + 0.01, 5]);
            translate([LOCK_X - 15, yb - 6, -H/2 - 6]) cube([30, 6.01, 18]);
        }
        // wall screws (countersunk, 4.5–5 mm wood screws + plugs)
        for (p = [[-62, 30], [62, 30], [-62, -88], [62, -88]]) {
            cyl_y(5, yb - 1, yb + PLATE_T + 1, p[0], p[1]);
            translate([p[0], yb + 0.6, p[1]]) rotate([90, 0, 0]) cylinder(d1 = 5, d2 = 10.5, h = 2.8);
        }
        // cable pass-through to an in-wall box
        ext_y(yb - 1, yb + PLATE_T + 1) translate([0, -40]) rrect(56, 36, 8);
        // lock screw
        cyl_z(M3_CLR, -H/2 - 7, -H/2, LOCK_X, LOCK_Y);
        cyl_z(M3_HEAD, -H/2 - 7, -H/2 - 4.5, LOCK_X, LOCK_Y);
    }
}

// ============================================================ DESK STAND ===
TILT = 10;
module desk_stand() {
    yb = DEPTH + GAP_WALL - PLATE_T;
    table = -118;
    intersection() {
        union() {
            rotate([-TILT, 0, 0]) {
                translate([-60, yb, -150]) cube([120, PLATE_T + 2, CLEAT_ZC + 10 + 150]);
                ext_x(-58, 58) bar_2d(yb);
                // side cheeks for stiffness
                for (sx = [-1, 1]) translate([sx*56 - 2, yb, -150]) cube([4, 22, 150 + CLEAT_ZC]);
            }
            // base
            translate([0, 0, table - 6]) linear_extrude(6) hull() {
                translate([0, 32]) rrect(200, 150, 14);
            }
        }
        translate([-150, -200, table - 6]) cube([300, 400, 400]);
    }
}

// ============================================================ MOCK-UPS =====
module mock_display() {
    color([0.05, 0.05, 0.07]) translate([-GLASS_W/2, PT, GLASS_Z - GLASS_H/2]) cube([GLASS_W, GLASS_T, GLASS_H]);
    color([0.12, 0.35, 0.65]) translate([-ACTIVE_W/2, PT - 0.05, GLASS_Z + ACTIVE_DZ - ACTIVE_H/2]) cube([ACTIVE_W, 0.1, ACTIVE_H]);
    color([0.6, 0.6, 0.62]) translate([-82, PT + GLASS_T, GLASS_Z - 50]) cube([164, DISP_DEPTH - GLASS_T - 6, 100]);
}
module mock_pi() {
    color([0.1, 0.55, 0.25]) translate([-42.5, PT + DISP_DEPTH, GLASS_Z - 28]) cube([85, 1.6, 56]);
    color([0.75, 0.75, 0.78]) translate([20, PT + DISP_DEPTH + 1.6, GLASS_Z - 26]) cube([22, 16, 52]);
    color([0.2, 0.2, 0.22]) translate([-25, PT + DISP_DEPTH + 1.6, GLASS_Z - 12]) cube([30, 9, 30]);
}
module mock_camera() {
    zc = CAM_Z - CAM_LENS_FROM_TOP + CAM_BH/2;
    color([0.1, 0.5, 0.25]) translate([-CAM_BW/2, CAM_PCB_Y, zc - CAM_BH/2]) cube([CAM_BW, 1.6, CAM_BH]);
    color([0.1, 0.1, 0.1]) translate([0, PT - 1.5, CAM_Z]) rotate([-90, 0, 0]) cylinder(d = 8.5, h = CAM_PCB_Y - PT + 1.5);
}
module mock_leds() {
    color([1, 0.85, 0.6]) ext_y(BAND_Y0, BAND_Y1) difference() {
        rrect(2*EDGE_X + 4, 2*EDGE_Z + 4, EDGE_R + 2);
        rrect(2*EDGE_X, 2*EDGE_Z, EDGE_R);
    }
    color([1, 0.85, 0.6]) for (s = [-1, 1]) {
        translate([-90, RIB_TOP - 2, s*SLOT_TB_Z - 5]) cube([180, 2, 10]);
        translate([s*SLOT_S_X - 5, RIB_TOP - 2, -67]) cube([10, 2, 134]);
    }
}

// ============================================================ OUTPUT =======
C_BODY = [0.11, 0.11, 0.12];
C_DIFF = [1.0, 0.97, 0.92, 0.9];
C_INT  = [0.25, 0.25, 0.27];
C_LOGO = [0.85, 0.2, 0.55];

module assembly(e = EXPLODE) {
    color(C_BODY) bezel();
    color(C_LOGO) translate([0, -0.0, 0]) logo_shape(0.6, -0.01);
    color(C_DIFF) translate([0, -e*30, 0]) for (s = [-1, 1]) {
        translate([0, 0, s*SLOT_TB_Z]) diffuser_tb();
        translate([s*SLOT_S_X, 0, 0]) diffuser_side();
    }
    translate([0, e*20, 0]) mock_display();
    translate([0, e*60, 0]) { color(C_INT) led_rail(); mock_leds(); }
    translate([0, e*45, 0]) color(C_INT) { display_clamp(1); display_clamp(-1); camera_clamp(); }
    translate([0, e*30, 0]) mock_camera();
    translate([0, e*75, 0]) mock_pi();
    translate([0, e*130, 0]) {
        color(C_BODY) difference() { shell(); translate([-W, BAND_Y0, -H]) cube([2*W, BAND_Y1 - BAND_Y0, 2*H]); }
        color(C_DIFF) intersection() { shell(); translate([-W, BAND_Y0, -H]) cube([2*W, BAND_Y1 - BAND_Y0, 2*H]); }
    }
    translate([0, e*190, 0]) color([0.3, 0.3, 0.32]) wall_plate();
}

module print_orient_front() { rotate([90, 0, 0]) children(); }               // front face on the bed
module print_orient_back()  { translate([0, 0, DEPTH]) rotate([-90, 0, 0]) children(); }

if (PART == "assembly") assembly();
else if (PART == "bezel")        { if (PRINT) print_orient_front() bezel(); else bezel(); }
else if (PART == "logo_inlay")   { if (PRINT) print_orient_front() logo_shape(0.6, 0); else logo_shape(0.6, -0.01); }
else if (PART == "diffuser_top") { if (PRINT) print_orient_front() diffuser_tb(); else translate([0, 0, SLOT_TB_Z]) diffuser_tb(); }
else if (PART == "diffuser_side"){ if (PRINT) print_orient_front() rotate([0, -90, 0]) diffuser_side(); else translate([SLOT_S_X, 0, 0]) diffuser_side(); }
else if (PART == "led_rail")     { if (PRINT) translate([0, 0, RIB_TOP + RAIL_T]) rotate([-90, 0, 0]) led_rail(); else led_rail(); }
else if (PART == "display_clamp"){ if (PRINT) translate([0, 0, 15]) rotate([-90, 0, 0]) translate([-60, 0, 0]) display_clamp(1); else display_clamp(1); }
else if (PART == "camera_clamp") { if (PRINT) translate([0, 0, CAM_PCB_Y + 4.1]) rotate([-90, 0, 0]) camera_clamp(); else camera_clamp(); }
else if (PART == "shell")        { if (PRINT) print_orient_back() shell(); else shell(); }
else if (PART == "wall_plate")   { if (PRINT) translate([0, 0, DEPTH + GAP_WALL]) rotate([-90, 0, 0]) wall_plate(); else wall_plate(); }
else if (PART == "desk_stand")   desk_stand();
