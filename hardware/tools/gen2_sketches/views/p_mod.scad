include <../../../cad/gen2_concept.scad>
VIEW="none";
module sd() multmatrix([[0,1,0,0],[0,0,1,0],[1,0,0,0],[0,0,0,1]]) children(); projection() sd() { mod_shell(); lid(0); }
