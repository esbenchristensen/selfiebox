include <../../../cad/gen2_concept.scad>
VIEW="none";
module fr() multmatrix([[1,0,0,0],[0,0,1,0],[0,-1,0,0],[0,0,0,1]]) children(); projection() fr() bezel2();
