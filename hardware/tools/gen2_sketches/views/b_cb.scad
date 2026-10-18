include <../../../cad/gen2_concept.scad>
VIEW="none";
module bk() multmatrix([[1,0,0,0],[0,0,1,0],[0,1,0,-(D-1.5)],[0,0,0,1]]) children(); projection(cut=true) multmatrix([[1,0,0,0],[0,0,1,0],[0,1,0,-(D-6)],[0,0,0,1]]) shell2();
