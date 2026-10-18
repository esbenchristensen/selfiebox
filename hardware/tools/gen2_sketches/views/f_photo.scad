include <../../../cad/gen2_concept.scad>
VIEW="none";
module fr() multmatrix([[1,0,0,0],[0,0,1,0],[0,-1,0,0],[0,0,0,1]]) children(); projection() fr() translate([-FILM_W[0]/2, PRN_Y[0] + INW[1]/2 - 0.6, -95]) cube([FILM_W[0], 1.2, 95]);
