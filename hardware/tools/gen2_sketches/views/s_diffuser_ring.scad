include <../../../cad/gen2_concept.scad>
VIEW="none";
module sc() multmatrix([[0,1,0,0],[0,0,1,0],[1,0,0,-JOINTS[2][0]],[0,0,0,1]]) children(); projection(cut=true) sc() diffuser_ring();
