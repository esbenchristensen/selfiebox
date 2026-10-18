// ============================================================================
//  SELFIEBOX HALO gen 2 – CONCEPT (not a print file)
//  Main unit 85 mm deep (room for 4G and a mic array) and a printer module that
//  hugs the underside of the main unit: its top follows the main unit's R24
//  corners as two cheeks, so the pair reads as one body. The module holds two
//  Instax Link WIDE printers standing on edge, one behind the other, exit slots
//  down. The whole underside is a locked service lid.
//  Render: tools/render_gen2.sh
// ============================================================================
include <halo.scad>

D       = 85;          // gen 2 depth (rev G: 66)
BOTTOM  = "none";
PART    = "none";
VIEW    = "pair";      // "main" | "module" | "pair" | "pair_xray" | "module_open"
GAP     = 0.8;         // shadow gap between module and main unit

// Instax Link WIDE: 139.9 x 128.3 x 36.0 (fujifilm.com spec), film 86 x 108
INW = [139.9, 36.0, 128.3];  INW_R = 10;  FILM_W = [86, 108];
CHEEK = 60;                         // how far the module's cheeks climb up the main unit's sides
CHEEK_T = 3;                        // cheek thickness = depth of the recess in the main unit's skin
HP_IN = 3 + 10 + INW[2] + 5;        // floor + photo drop + printer + headroom
HP    = ceil(HP_IN);                // module height below the main unit
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
// the main unit's outline with its lower CHEEK mm recessed by CHEEK_T (where the cheeks sit)
module main_inset_2d() {
    union() {
        offset(-CHEEK_T) rr(W, H, R);
        intersection() { rr(W, H, R); translate([-W, CHEEK]) square([2*W, H]); }
    }
}
module main_recess() { ext_y(-1, D + 1) difference() { rr(W + 2, H + 2, R); main_inset_2d(); } }
module module_2d() {        // front view outline, z = 0 at the module bottom
    difference() {
        intersection() { rr(W, HP + CHEEK + 2*R, R); translate([-W, -1]) square([2*W, HP + CHEEK + 1]); }
        translate([0, HP]) offset(GAP) main_inset_2d();
    }
}
// solid module body; the front edge is chamfered by EDGE_CH (no hull: the cradle top is concave)
module mod_solid() {
    for (i = [0:3]) ext_y(i*EDGE_CH/4, EDGE_CH) offset(-(EDGE_CH - i*EDGE_CH/4)) module_2d();
    ext_y(EDGE_CH - 0.01, D) module_2d();
}
module printer_module(open = 0) {
    difference() {
        union() {
            // shell: outline extruded to the full depth, hollowed
            difference() {
                mod_solid()
                ext_y(WALL, D - BACK_T) offset(-WALL) module_2d();
                // service lid opening in the floor
                translate([-(W/2 - 14), 10, -1]) cube([W - 28, D - 20, WALL + 2]);
            }
        }
        // a translucent band at the same height as the main unit's glow stripe
        // (kept as a colour split in the render, see band below)
    }
    color(C_LID) lid(open);
}
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
    // a photo dropping out of the front printer
    color(C_FILM) translate([-FILM_W[0]/2, PRN_Y[0] + INW[1]/2 - 0.6, -60]) cube([FILM_W[0], 1.2, 70]);
}

// ------------------------------------------------------------ main unit ----
module main_unit() {        // rev G unit at 85 mm, without the wall cleat
    color(C_BODY) bezel();
    color(C_DIFF) diffuser_ring();
    placed_display();
    placed_camera();
    color(C_INT) led_rail(); placed_leds();
    placed_pi();
    band_split() shell();
    placed_power();
}

// ------------------------------------------- single parts for the renders ----
// one mesh per material: openscad -D 'VIEW="x_bezel"' -o bezel.stl gen2_concept.scad
module band_cut()  { translate([-500, BAND_Y0, -500]) cube([1000, BAND_Y1 - BAND_Y0, 1000]); }
module band_keep() { intersection() { children(); band_cut(); } }
if (VIEW == "x_bezel")     difference() { bezel(); main_recess(); }
if (VIEW == "x_diffuser")  diffuser_ring();
if (VIEW == "x_shell")     difference() { shell(); band_cut(); main_recess(); }
if (VIEW == "x_shell_band") difference() { band_keep() shell(); main_recess(); }
if (VIEW == "x_display")   placed_display();
if (VIEW == "x_camera")    placed_camera();
if (VIEW == "x_mod")       difference() { printer_module(); band_cut(); }
if (VIEW == "x_mod_band")  band_keep() printer_module();
if (VIEW == "x_mod_shell") difference() { difference() { mod_solid()
                               ext_y(WALL, D - BACK_T) offset(-WALL) module_2d();
                               translate([-(W/2 - 14), 10, -1]) cube([W - 28, D - 20, WALL + 2]); } band_cut(); }
if (VIEW == "x_mod_shell_band") band_keep() difference() { mod_solid()
                               ext_y(WALL, D - BACK_T) offset(-WALL) module_2d();
                               translate([-(W/2 - 14), 10, -1]) cube([W - 28, D - 20, WALL + 2]); }
if (VIEW == "x_lid")       lid(0);
if (VIEW == "x_lid_open")  lid(100);
if (VIEW == "x_printers")  for (y = PRN_Y) translate([0, y, 3 + 10]) instax_wide();
if (VIEW == "x_photo")     translate([-FILM_W[0]/2, PRN_Y[0] + INW[1]/2 - 0.6, -60]) cube([FILM_W[0], 1.2, 70]);

// ----------------------------------------------------------------- views ----
if (VIEW == "main") main_unit();
if (VIEW == "module") module_body();
if (VIEW == "module_open") { color(C_BODY) printer_module(open = 100); module_band(); for (y = PRN_Y) translate([0, y, 3 + 10]) instax_wide(); }
if (VIEW == "pair") { translate([0, 0, HP]) main_unit(); module_body(); placed_printers(); }
if (VIEW == "pair_xray") {
    translate([0, 0, HP]) main_unit();
    %module_body();
    placed_printers();
}

// cutaway: keep x > -20 so the camera on the left looks into the printer bay
module cut_keep() { intersection() { children(); translate([-20, -500, -500]) cube([1000, 1000, 1000]); } }
if (VIEW == "x_mod_shell_cut")      cut_keep() difference() { mod_solid()
                               ext_y(WALL, D - BACK_T) offset(-WALL) module_2d();
                               translate([-(W/2 - 14), 10, -1]) cube([W - 28, D - 20, WALL + 2]); band_cut(); }
if (VIEW == "x_mod_shell_band_cut") cut_keep() band_keep() difference() { mod_solid()
                               ext_y(WALL, D - BACK_T) offset(-WALL) module_2d(); }
if (VIEW == "x_lid_cut")            cut_keep() lid(0);
