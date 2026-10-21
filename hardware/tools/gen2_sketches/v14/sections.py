import trimesh, numpy as np, pickle
S='/home/user/selfiebox/hardware/stl/gen2/halo-gen2-v13/'
def fix(m,f):
    v=m.vertices.copy(); m.vertices=f(v); m.fix_normals(); return m
fr13=fix(trimesh.load(S+'halo-gen2-v13_bagramme.stl'), lambda v: np.c_[v[:,0],31.7-v[:,2],v[:,1]+154.85])
ft13=fix(trimesh.load(S+'halo-gen2-v13_front.stl'), lambda v: np.c_[v[:,0],v[:,2],153-v[:,1]])
ri13=fix(trimesh.load(S+'halo-gen2-v13_lysring.stl'), lambda v: np.c_[v[:,0],v[:,2]-0.5,153-v[:,1]])
sk=fix(trimesh.load('/tmp/claude-0/v14/skal13.stl'), lambda v: np.c_[v[:,0],70-v[:,2],v[:,1]+153])
V='/tmp/claude-0/v14/'
M={'front13':ft13,'frame13':fr13,'ring13':ri13,'skal':sk,'front14':trimesh.load(V+'front.stl'),'frame14':trimesh.load(V+'frame.stl'),
   'ring':trimesh.load(V+'x_ring3.stl'),'cam':trimesh.load(V+'x_camera.stl')}
print({k:np.round(m.bounds,1).tolist() for k,m in M.items()})
def sec(m, axis, c):
    if axis=='z': o,n=[0,0,c],[0,0,1]; T=np.eye(4); T[2,3]=-c          # -> (x, y)
    else: o,n=[0,c,0],[0,1,0]; T=np.array([[1,0,0,0],[0,0,1,0],[0,1,0,-c],[0,0,0,1.]])  # -> (x, z)
    s=m.section(plane_origin=o,plane_normal=n)
    if s is None: return []
    p,_=s.to_2D(to_2D=T)
    return [poly for poly in p.polygons_full]
out={}
for key,ax,c in [('z110','z',110),('z30','z',30.5),('y10','y',10),('y7','y',7.2),('y29','y',29.0),('y5','y',5.0)]:
    out[key]={k:sec(m,ax,c) for k,m in M.items()}
pickle.dump(out,open('/tmp/claude-0/sk/sec.pkl','wb'))
