include <../../../cad/gen2_concept.scad>
VIEW="none";
module sd() multmatrix([[0,1,0,0],[0,0,1,0],[1,0,0,0],[0,0,0,1]]) children(); projection() sd() translate([0,0,HP]) { bezel2(); shell2(); diffuser_ring(); }
