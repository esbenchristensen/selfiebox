// ============================================================================
//  SELFIEBOX – component library ("vitamins")
//  Every dimension carries its source and a confidence rating:
//    [A] official manufacturer data      [B] reputable CAD library / CAD model
//    [C] measured from an official photo [M] MUST be measured on the real part
//  Coordinates of each part are documented at its module.
// ============================================================================

// ---------------------------------------------------- Raspberry Pi 7" Touch Display (v1)
// [A] outer glass 192.96 x 110.76, viewable area 154.08 x 85.92 (raspberrypi.com docs)
// [B] metal frame 166.3 x 100.7, centred behind the glass; 4 x M3 tabs on the frame back,
//     pattern 126.2 x 65.65, pattern shifted ~2.5 mm along the short axis (STEP model built
//     from the official drawing, github.com/xayhewalo/touchscreen-graduation-cap-decoration)
// [B] Pi stand-offs: M2.5, 58 x 49 pattern on the frame back
// [A] overall depth 20 mm including the stand-offs (retailer fact sheets)
// [C] viewable area sits ~1.15 mm off-centre, away from the long edge where the LCD flex
//     cable exits (measured on the official product photo)
// [B] glass corner radius ~3.2
// [M] DSP_FRAME_D: glass front face -> back face of the M3 tabs (model: 7.6)
// [M] DSP_GLASS_T: glass thickness at the overhang (only used for clearances)
DSP_GLASS_W = 192.96;  DSP_GLASS_H = 110.76;  DSP_GLASS_R = 3.2;
DSP_VIEW_W  = 154.08;  DSP_VIEW_H  = 85.92;   DSP_VIEW_OFF = 1.15;
DSP_FRAME_W = 166.3;   DSP_FRAME_H = 100.7;
DSP_FRAME_D = 7.6;     DSP_GLASS_T = 1.8;
DSP_TAB_PX  = 126.2;   DSP_TAB_PY  = 65.65;   DSP_TAB_SHIFT = 2.5;  DSP_TAB = [7.8, 14.8, 2.3];
DSP_PI_PX   = 58;      DSP_PI_PY   = 49;
DSP_TOTAL_D = 20;      // glass front -> Pi PCB underside
DSP_TAB_SCREW_MAX = 2.0;   // max thread engagement into the tabs (LCD behind!)

// Display in PORTRAIT, glass front face at y = 0, glass centre at x = 0, z = 0.
// fpc = -1: the LCD flex exits on the left (-x) long edge. Set to +1 if your unit is
// rotated the other way (choose the rotation that makes the Pi's USB ports face down).
module rpi_display_v1(fpc = -1, tab_shift = 0) {
    color([0.04, 0.04, 0.05]) hull() for (sx = [-1, 1], sz = [-1, 1])
        translate([sx*(DSP_GLASS_H/2 - DSP_GLASS_R), 0, sz*(DSP_GLASS_W/2 - DSP_GLASS_R)]) rotate([-90, 0, 0]) cylinder(r = DSP_GLASS_R, h = DSP_GLASS_T, $fn = 24);
    color([0.12, 0.3, 0.55]) translate([-DSP_VIEW_H/2 - fpc*DSP_VIEW_OFF, -0.05, -DSP_VIEW_W/2]) cube([DSP_VIEW_H, 0.05, DSP_VIEW_W]);
    color([0.62, 0.63, 0.66]) translate([-DSP_FRAME_H/2, DSP_GLASS_T, -DSP_FRAME_W/2]) cube([DSP_FRAME_H, DSP_FRAME_D - DSP_GLASS_T - DSP_TAB[2], DSP_FRAME_W]);
    // M3 tabs
    color([0.55, 0.56, 0.6]) for (sx = [-1, 1], sz = [-1, 1])
        translate([sx*DSP_TAB_PY/2 + tab_shift - DSP_TAB[0]/2, DSP_FRAME_D - DSP_TAB[2], sz*DSP_TAB_PX/2 - DSP_TAB[1]/2]) cube([DSP_TAB[0], DSP_TAB[2], DSP_TAB[1]]);
    // adapter board (approximate envelope) + LCD flex
    color([0.1, 0.45, 0.2]) translate([-25, DSP_FRAME_D, -30]) cube([50, 8, 60]);
    color([0.8, 0.5, 0.1]) translate([fpc*(DSP_FRAME_H/2) - (fpc > 0 ? 0 : 4), DSP_GLASS_T, -20]) cube([4, DSP_FRAME_D - DSP_GLASS_T, 40]);
}
function dsp_tab_pos(fpc_shift = 0) = [for (sx = [-1, 1], sz = [-1, 1]) [sx*DSP_TAB_PY/2 + fpc_shift, sz*DSP_TAB_PX/2]];


// ---------------------------------------------------- Raspberry Pi Touch Display 2, 10-inch
// [A] outline 166.88 x 248.096, depth 15.55 (RP-010276 drawing), cover glass 1.1, viewing area 136.4 x 217.6, active 135.4 x 216.6,
//     1200 x 1920 native portrait (raspberrypi.com Touch Display 2 docs)
// [C] metal back plate ~232 x 145 (landscape), inset ~4 mm from the glass edges, thicker black
//     border on the FPC edge (measured on the official back-view photo)
// [M] picture centring on the glass (assumed centred)
TD10_GLASS = [166.9, 248.1];  TD10_D = 15.55;  TD10_VIEW = [136.4, 217.6];
TD10_GLASS_T = 1.1;  TD10_PLATE = [145, 232];  TD10_R = 3;   // glass corners are R5 (drawing); R3 keeps the pockets roomier in the corners
// Portrait, glass front face at y = 0, centred on x = 0, z = 0; FPC at the top edge.
module rpi_touch_display2_10() {
    color([0.04, 0.04, 0.05]) hull() for (sx = [-1, 1], sz = [-1, 1])
        translate([sx*(TD10_GLASS[0]/2 - TD10_R), 0, sz*(TD10_GLASS[1]/2 - TD10_R)]) rotate([-90, 0, 0]) cylinder(r = TD10_R, h = TD10_GLASS_T, $fn = 24);
    color([0.12, 0.3, 0.55]) translate([-TD10_VIEW[0]/2, -0.05, -TD10_VIEW[1]/2]) cube([TD10_VIEW[0], 0.05, TD10_VIEW[1]]);
    color([0.62, 0.63, 0.66]) translate([-TD10_PLATE[0]/2, TD10_GLASS_T, -TD10_PLATE[1]/2]) cube([TD10_PLATE[0], TD10_D - TD10_GLASS_T, TD10_PLATE[1]]);
}

// ---------------------------------------------------- Raspberry Pi 5 (+ Active Cooler)
// [A] board 85 x 56, holes Ø2.7 for M2.5 at 3.5 mm from the edges, pattern 58 x 49
// [A] Active Cooler 63.5 x 42.5 x 13.7
// [B] USB/Ethernet stack ~16 mm above the PCB (NopSCADlib RPI4 data; Pi 5 is the same form)
PI_L = 85;  PI_W = 56;  PI_T = 1.6;  PI_HOLE = 2.7;  PI_PORT_H = 16;  PI_COOLER = [63.5, 42.5, 13.7];
// [A] Active Cooler drawing + Pi 5 drawing (hardware/datablade): its two push pins sit in the Pi's Ø3 holes 6 mm inside the
// top-right and bottom-left mounting holes, so the cooler covers the board from 0.5 to 64 along it (from the end away from the
// ports) and 7 to 49.5 across (from the GPIO edge). The 30 x 30 blower sits at the PORT end, with its Ø21.4 intake 41.8 along and 23
// across; the fins are at the other end. In this frame (GPIO edge at x -28, ports down) that puts the fan centre 9.3 BELOW the hole
// centre and 5 towards the GPIO side. Until v35 the model had the cooler 8 mm up and the fan 14 above the centre, a guess that put
// the fan guard's grille over the fins (Esben 30 Oct, samlenoter 8).
PI_COOLER_P = [-21, -31.5];                // cooler corner x, z (relative to the hole centre)
PI_FAN = [-5.0, -9.3, 10.7];               // intake centre x, z and radius
PI_FAN_BOX = [-20.1, -24.9, 30];           // blower housing: x, z of its lower corner, side
// Portrait, PCB underside at y = 0, hole pattern centred on x = 0, z = 0, ports facing down (-z).
module rpi5() {
    // holes at z = +/-29 (58 pattern), x = +/-24.5; board runs 3.5 past the top holes and
    // 23.5 past the bottom holes, where the USB/Ethernet ports overhang ~2.5 mm
    color([0.1, 0.5, 0.25]) difference() {
        translate([-PI_W/2, 0, -29 - 23.5]) cube([PI_W, PI_T, PI_L]);
        for (sx = [-1, 1], sz = [-1, 1]) translate([sx*24.5, -1, sz*29]) rotate([-90, 0, 0]) cylinder(d = PI_HOLE, h = 4, $fn = 16);
    }
    color([0.75, 0.76, 0.8]) translate([-PI_W/2 + 1.5, PI_T, -29 - 23.5 - 2.5]) cube([PI_W - 3, PI_PORT_H, 21]);     // USB x2 + Ethernet
    color([0.2, 0.2, 0.22]) translate([PI_COOLER_P[0], PI_T, PI_COOLER_P[1]]) cube([PI_COOLER[1], PI_COOLER[2], PI_COOLER[0]]);
}

// ---------------------------------------------------- Camera Module 3 Wide
// [A] PCB 25 x 23.862, holes Ø2.2 (M2), "PCB size and mounting holes the same as Camera Module 2"
// [B] holes at x = 2 / 23, y = 9.362 / 21.862 from the flex-connector edge (NopSCADlib rpi_camera_v2)
// [A] lens centre x = 12.5, y = 9.462 from the flex-connector edge (CM3 Wide mechanical drawing)
// [B] PCB 1.12, flex connector 2.75 on the back, lens holder 10.8 x 10.8,
//     lens top 8.3 above the PCB front, front barrel Ø6.95 (CM3 Wide drawing labels)
CAM_PCB = [25, 23.862, 1.12];
CAM_HOLES = [[-10.5, -0.1], [10.5, -0.1], [-10.5, 12.4], [10.5, 12.4]];   // relative to lens centre (x, z)
CAM_LENS_FROM_EDGE = 9.462;   // [A] CM3 Wide drawing: lens 14.4 from the far edge (23.862 - 14.4)
CAM_HOLDER = 10.8;  CAM_HOLDER_H = 4.07;  CAM_LENS_H = 8.3;  CAM_BARREL = 6.95;  CAM_CONN_H = 2.75;   // RP-008155 (Wide): tip Ø6.95, 8.3 above the board; ribbon connector 2.75 on the back
// Lens centre at x = 0, z = 0; PCB front face at y = 0, lens pointing to -y; flex edge at -z.
// Rotated 90 deg (flex edge to +x): the sensor's long side runs vertically -> native portrait.
CAM_HOLES_ROT = [for (h = CAM_HOLES) [-h[1], h[0]]];
module camera_module3_wide_rot() { rotate([0, -90, 0]) camera_module3_wide(); }
module camera_module3_wide() {
    color([0.1, 0.45, 0.22]) difference() {
        translate([-12.5, 0, -CAM_LENS_FROM_EDGE]) cube([CAM_PCB[0], CAM_PCB[2], CAM_PCB[1]]);
        for (h = CAM_HOLES) translate([h[0], -1, h[1]]) rotate([-90, 0, 0]) cylinder(d = 2.2, h = 3, $fn = 16);
    }
    color([0.15, 0.15, 0.15]) {
        translate([-CAM_HOLDER/2, -CAM_HOLDER_H, -CAM_HOLDER/2]) cube([CAM_HOLDER, CAM_HOLDER_H, CAM_HOLDER]);
        translate([0, -CAM_LENS_H, 0]) rotate([-90, 0, 0]) cylinder(d1 = CAM_BARREL, d2 = CAM_BARREL + 0.3, h = CAM_LENS_H - CAM_HOLDER_H + 0.01, $fn = 32);
    }
    color([0.85, 0.85, 0.8]) translate([-10, CAM_PCB[2], -CAM_LENS_FROM_EDGE]) cube([20, CAM_CONN_H, 5.5]);
    // [A] sensor flex under the lens holder, towards the far edge: 8.9 wide, 7.3 out (height not given; 0.4 assumed)
    color([0.6, 0.45, 0.1]) translate([-4.45, -0.4, CAM_HOLDER/2 - 0.01]) cube([8.9, 0.4, 7.3]);
}

// ---------------------------------------------------- DFRobot DFR0503 embedded thermal printer
// [A] front 82 x 58, panel cut-out 77 x 53, depth behind the panel 42 (DFRobot wiki / product page)
// [A] 58 mm paper, 5-9 V (TTL/USB version; V2.0 runs on 9-24 V)
PRN_FRONT = [82, 58];  PRN_CUT = [77, 53];  PRN_DEPTH = 42;  PRN_FRONT_T = 2;
module dfr0503() {   // front face at y = 0, centred on x = 0, z = 0
    color([0.2, 0.2, 0.22]) translate([-PRN_FRONT[0]/2, -PRN_FRONT_T, -PRN_FRONT[1]/2]) cube([PRN_FRONT[0], PRN_FRONT_T, PRN_FRONT[1]]);
    color([0.25, 0.25, 0.27]) translate([-PRN_CUT[0]/2 + 0.3, 0, -PRN_CUT[1]/2 + 0.3]) cube([PRN_CUT[0] - 0.6, PRN_DEPTH, PRN_CUT[1] - 0.6]);
    color([0.9, 0.9, 0.88]) translate([-29, -PRN_FRONT_T - 0.2, PRN_FRONT[1]/2 - 9]) cube([58, 0.2, 3]);
}

// ---------------------------------------------------- Fujifilm Instax Square Link (photo printer)
// [A] body 105 x 37.5 x 127.5 mm (W x D x H, without projecting parts), 236 g (Fujifilm / retailers)
// [A] instax SQUARE film 72 x 86 mm, image 62 x 62 mm; Bluetooth; ~100 prints per charge; USB-C charging
// [M] film exit slot on the top edge (assumed centred, 76 x 3); film door on the back face;
//     power button on one side ~20 mm below the top; USB-C position – measure on the real printer
INSQ = [105, 37.5, 127.5];  INSQ_R = 9;  INSQ_SLOT = [76, 3];  FILM_SQ = [72, 86, 1.2];
module instax_square_link() {   // standing, back (film door) towards -y, exit slot at the top, centred on x, bottom at z = 0
    color([0.92, 0.92, 0.9]) hull() for (sx = [-1, 1], sz = [0, 1])
        translate([sx*(INSQ[0]/2 - INSQ_R), 0, INSQ_R + sz*(INSQ[2] - 2*INSQ_R)]) rotate([-90, 0, 0]) cylinder(r = INSQ_R, h = INSQ[1], $fn = 32);
    color([0.2, 0.2, 0.22]) translate([-INSQ_SLOT[0]/2, INSQ[1]/2 - INSQ_SLOT[1]/2, INSQ[2] - 0.01]) cube([INSQ_SLOT[0], INSQ_SLOT[1], 0.6]);
}
// ---------------------------------------------------- Canon SELPHY CP1500
// [A] 182.2 x 133.0 x 57.6 (W x D x H), Canon product page
SELPHY = [182.2, 133.0, 57.6];

// ---------------------------------------------------- power
// [A] Pololu D36V50F5: 25.4 x 25.4 x 9.5, 5 V 5.5 A   (x2: Pi + display, LEDs)
// [A] Pololu D36V28F9: 17.8 x 20.3 x 8.8, 9 V 2.6 A    (printer module, TTL/USB printer only)
// [A] Mean Well GST90A12-P1M: 12 V 6.67 A, 5.5/2.5 mm plug
// [M] panel DC jack 5.5/2.5 with M8 thread: hole Ø8.0 (check your jack's thread)
POL50 = [25.4, 25.4, 9.5];   POL28 = [17.8, 20.3, 8.8];
DC_JACK_HOLE = 8.0;  DC_JACK_BODY = [11, 18];   // body Ø, length behind the panel
module pololu(sz) { color([0.1, 0.3, 0.6]) cube(sz); }

// ---------------------------------------------------- LED strip
// [A] SK6812 RGBW 5050, 60 LED/m: 10 mm wide, cut every 16.67 mm, ~2.5 mm thick incl. tape
LED_W = 10;  LED_T = 2.5;  LED_PITCH = 1000/60;

// ---------------------------------------------------- hardware
// [A] Elextra H44350 brass insert M3: Ø4.5 x 5.9 -> hole Ø4.0 x 6.4
// [A] ISO 7380 M3 button head: head Ø5.7 x 1.65
// [M] 1/4"-20 heat-set insert: hole Ø7.9 (check the insert you buy)
INS_M3 = [4.0, 6.4];  INS_M4 = [5.6, 8.2];  INS_Q = [7.9, 12.5];
M3_CLR = 3.4;  M3_HEAD = [5.7, 1.65];  M2_PILOT = 1.7;  M25_PILOT = 2.2;
