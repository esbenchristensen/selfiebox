import pickle, numpy as np, matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import PathPatch, Rectangle, FancyBboxPatch, Circle
from matplotlib.path import Path
S=pickle.load(open('/tmp/claude-0/sk/sec.pkl','rb'))
C=dict(front='#3a3a3e',frame='#ecebe6',ring='#f6efd8',skal='#c9c9cc',cam='#3f7f5a',glass='#5b8fc7',mod='#9aa3ad')
plt.rcParams['font.family']='DejaVu Sans'
def draw(ax,polys,fc,ec='#111',lw=0.8,alpha=1,z=1):
    for p in polys:
        verts=[];codes=[]
        for ring in [p.exterior]+list(p.interiors):
            c=np.array(ring.coords); verts+=c.tolist(); codes+=[Path.MOVETO]+[Path.LINETO]*(len(c)-2)+[Path.CLOSEPOLY]
        ax.add_patch(PathPatch(Path(verts,codes),fc=fc,ec=ec,lw=lw,alpha=alpha,zorder=z))
def panel(ax,key,v,xl,yl,title,extra=None,keys=('skal','front','frame','ring','cam')):
    for k in keys:
        name={'front':'front'+v,'frame':'frame'+v,'ring':'ring13' if v=='13' else 'ring'}.get(k,k)
        if name in S[key]: draw(ax,S[key][name],C[k],z=2 if k in('front','frame') else 1)
    if extra: extra(ax)
    ax.set_xlim(*xl); ax.set_ylim(*yl); ax.set_aspect('equal'); ax.set_xticks([]); ax.set_yticks([])
    for s in ax.spines.values(): s.set_visible(False)
    ax.set_title(title,loc='left',fontsize=12,fontweight='bold')
def call(ax,n,xy,txt_xy,txt,col='#111'):
    ax.annotate('',xy=xy,xytext=txt_xy,arrowprops=dict(arrowstyle='-',lw=0.8,color=col),zorder=9)
    ax.add_patch(Circle(txt_xy,0.9,fc='white',ec=col,lw=0.9,zorder=10)); ax.text(*txt_xy,str(n),ha='center',va='center',fontsize=8,zorder=11,color=col)
def disp_side(ax):   # glass + metal back seen in section z=110, left side
    ax.add_patch(Rectangle((-83.45,1.6),60,1.1,fc=C['glass'],ec='#123',lw=0.6,zorder=3))
    ax.add_patch(Rectangle((-71.68,2.7),50,5.95,fc=C['mod'],ec='#333',lw=0.6,zorder=3))
    ax.text(-71,5.7,'metalbagside',fontsize=7.5,va='center')
    ax.text(-82.6,0.35,'glas 1,1 (sort kant 11,8)',fontsize=7.5,color='#123')
fig=plt.figure(figsize=(21,15),dpi=110)
fig.text(0.02,0.975,'halo-gen2-v14 – skitse: rettelser efter v13-hurtigprint (til godkendelse)',fontsize=17,fontweight='bold',va='top')
fig.text(0.02,0.952,'Alle snit er taget direkte fra CAD (v13- og v14-printfilerne). Mål i mm. Mørk = front, hvid = bagramme, creme = lysring, grå = skal, blå = skærmglas.',fontsize=10.5,va='top',color='#444')
# --- A/B lock section
axA=fig.add_axes([0.01,0.60,0.30,0.32]); panel(axA,'z110','13',(-112,-68),(-1.5,33),'A  v13: snaplås i snit (side, z 110)',disp_side)
call(axA,1,(-84.4,15.5),(-80,21),'');
axA.text(-79,21,'ledge 0,9 mm på indervæggen,\nbarb griber 0,8 mm',fontsize=8.5,va='center')
axA.text(-111.5,32.5,'ingen lås her: ydre ramme kun\nholdt af 4 skruer gennem skallen',fontsize=8.5,color='#b03030',va='top')
axB=fig.add_axes([0.32,0.60,0.30,0.32]); panel(axB,'z110','14',(-112,-68),(-1.5,33),'B  v14: vindueslås + fjedertå (samme snit)',disp_side)
for n,xy,t,txt in [(1,(-84.0,11),(-78.5,14.5),'vindue gennem indervæggen; den hvide\nreflektor lukker det fra kanalsiden'),
                   (2,(-85.6,11.8),(-78.5,10.2),'barb griber 1,2 mm i hele væggens kant'),
                   (3,(-79.5,3.0),(-73.5,0.8),''),
                   (4,(-105.5,14),(-110,20),''),
                   (5,(-84.6,29.5),(-79,30.5),'udløserslids: skruetrækker bagfra')]:
    call(axB,n,xy,t,''); 
    if txt: axB.text(t[0]+1.3,t[1],txt,fontsize=8.5,va='center')
axB.text(-71.6,-0.6,'fjedertå 45° trykker glassets\nsorte kant 0,2 mm',fontsize=8.5,va='center')
axB.text(-111.5,26.5,'ny lås på\nydervæggen\n(båndvæggen\nlukker den)',fontsize=8.5,va='top')
# --- C/D corner
def glass_front(ax):
    from matplotlib.patches import FancyBboxPatch
    ax.add_patch(FancyBboxPatch((-83.45+5,27.8+5),166.9-10,248.1-10,boxstyle='round,pad=5',fc='none',ec=C['glass'],lw=1.6,ls='--',zorder=5))
axC=fig.add_axes([0.64,0.75,0.17,0.19]); panel(axC,'y10','13',(-93,-71),(21,41),'C  v13: nederste hjørne (snit 10)',glass_front)
axC.text(-92.5,21.5,'skåret ud i filen (ikke printfejl):\nfrizone R3 + 1,2 mm fjernede\nvæggen; skærmen passer alligevel',fontsize=8.5,color='#b03030')
axD=fig.add_axes([0.82,0.75,0.17,0.19]); panel(axD,'y10','14',(-93,-71),(21,41),'D  v14: glas R5 (tegning)',glass_front)
axD.text(-92.5,21.5,'væggen er hel; 0,24 luft\ntil glassets hjørne',fontsize=8.5)
fig.text(0.645,0.735,'stiplet blå = skærmglassets kant (R5 iflg. Raspberry Pi-tegningen)',fontsize=8.5,color='#335')
# --- E/F camera caps, G/H frame back
axE=fig.add_axes([0.64,0.52,0.17,0.19]); panel(axE,'y7','13',(-34,34),(268,306),'E  v13: kameraet (snit 7,2 bag front)')
axE.text(-33,270,'kanalen åben ind til\nkamerarummet: mørkt bag ringen',fontsize=8.5,color='#b03030')
axF=fig.add_axes([0.82,0.52,0.17,0.19]); panel(axF,'y7','14',(-34,34),(268,306),'F  v14: ringens ender lukket')
axF.text(-33,270,'vægge følger ringens runde ender,\nbund 1,2 mm, 1 mm foran kameraprintet',fontsize=8.5)
axG=fig.add_axes([0.64,0.30,0.17,0.19]); panel(axG,'y29','13',(-34,34),(268,306),'G  v13: bagramme ved kameraet (snit 29)',keys=('frame',))
axG.text(-33,270,'højre ledningshul løber\nsammen med kablets slids',fontsize=8.5,color='#b03030')
axH=fig.add_axes([0.82,0.30,0.17,0.19]); panel(axH,'y29','14',(-34,34),(268,306),'H  v14: ledningshuller x ±19,5',keys=('frame',))
axH.text(-33,270,'kamerakablet har sin egen\nslids; LED-ledninger går fri',fontsize=8.5)
# --- I display back
axI=fig.add_axes([0.29,0.05,0.22,0.48]); axI.set_aspect('equal'); axI.set_xticks([]); axI.set_yticks([])
for s in axI.spines.values(): s.set_visible(False)
axI.set_title('I  Skærmens bagside (Raspberry Pi-tegning) og bagrammens huller',loc='left',fontsize=12,fontweight='bold')
axI.add_patch(FancyBboxPatch((-83.44+5,-124.05+5),166.88-10,248.1-10,boxstyle='round,pad=5',fc='#222',ec='k'))
axI.add_patch(Rectangle((-71.68,-124.05+7.5),143.36,228.73,fc=C['mod'],ec='k'))
for sx in (-1,1):
    for z in (77.63,-82.37):
        axI.add_patch(Rectangle((sx*60.91-4,z-6),8,12,fc='#ddd',ec='k',lw=0.8)); axI.add_patch(Circle((sx*60.91,z),1.4,fc='k'))
    for z in (29-6.87,-29-6.87): axI.add_patch(Circle((sx*24.5,z),1.4,fc='none',ec='k'))
# v14 holes: 3.5 across, slotted +-2.4 lengthwise
for sx in (-1,1):
    for zc in (77.63,-82.37):
        axI.add_patch(FancyBboxPatch((sx*60.91-1.75,zc-2.4-1.45),3.5,4.8+2.9,boxstyle='round,pad=0',fc='none',ec='#2a8a4a',lw=2))
axI.set_xlim(-92,92); axI.set_ylim(-135,135)
axI.text(-83,128,'top (11,86 til metalpladen)',fontsize=8.5); axI.text(-83,-133,'bund: 2 små hak i pladekanten (7,5 til glaskant)',fontsize=8.5)
for t,y in [('Beslag (sort prik): 121,8 mm imellem (22,54 fra glaskant),',62),('160 mm imellem, 46,42 fra top og 41,68 fra bund.',54),
            ('v13 har netop de mål, men kun huller ±2,4 mm,',40),('så skærmen passer kun med hakkene nedad.',32),
            ('Vendt om (rød stiplet) flytter hvert beslag',18),('4,74 mm: v13 rammer 2,3 mm ved siden af.',10),
            ('v14 (grøn): langhul og tryktårn dækker',-4),('begge veje, skruerne finder altid hullet.',-12),
            ('Midterhullerne (49 × 58) er til Pi\'en.',-26)]:
    axI.text(88,y,t,fontsize=8.5,ha='left') if False else None
fig.text(0.505,0.50,'Beslag (sort prik): 121,8 mm imellem,\n22,54 fra glaskanten; 160 mm imellem,\n46,42 fra top og 41,68 fra bund.\nPladens 2 hak vender nedad, væk fra\nkameraet (Esben 21. okt.).\n\nPlaceringen i v13 var rigtig, men\nhullerne (2,9 mm) gav kun 0,2 mm luft\npr. side på tværs, mindre end printet\nkrymper over 12 cm.\n\nv14 (grøn): 3,5 mm på tværs, stadig\naflange ±2,4 mm på langs; hoved 6,2.\n\nMidterhullerne (49 × 58) er Pi\'ens.',fontsize=9,va='top')
# --- text block
txt='''Hvad v14 ændrer (kun front og bagramme er nye; skal, lysring, låg og beslag som v13)

1  Låse: de 6 små ledges (0,9 mm) bliver til 8 vinduer gennem
   indervæggen. Barben griber 1,2 mm i hele vægkanten, som ikke
   slides eller ætses væk af acetone på samme måde som en lille knop.
   Vinduet ligger bag den hvide reflektor, så der slipper intet lys ud.
2  Armene er 2,0 mm og 14 mm lange (ca. 1,3 % bøjning ved klik).
3  Hver indre arm fortsætter ned og ender i en 45° fjedertå, der trykker
   0,2 mm på skærmglassets sorte kant (uden for metalbagsiden).
   Front + skærm + bagramme bliver én stiv enhed, som kan vendes og
   bruges åben på bordet uden skal og uden skruer.
4  6 nye låse på ydervæggen (2 i hver side, 2 i bunden) holder også
   den ydre ramme fast i bagrammen. Båndvæggen lukker vinduerne.
5  Udløserslids bagfra ved hver lås, så bagrammen kan tages af igen.

Fronten alene vil stadig være to dele, der kun mødes ved kameraet
(det er det, der gør lysringen hel). Stivheden kommer, når bagrammen
klikkes på, og det kan nu gøres uden skal.

Kameratappe (v15): alle 4 tappe er med, Ø1,9 med spids (v13 havde
Ø2,0, og nogle printede for tykke). v14 havde kun 2.
Hjørner: CAD regnede med R3 + 1,2 mm luft og skar indervæggen
op i de nederste hjørner. Glasset er R5, så væggen kan være hel.

LED og kamerakabel: båndene går ikke bag kameraet. Hvert bånd
er ét stykke rundt om alle 4 hjørner, men det starter og slutter
17 mm fra linsen, hvor klikstikkene sidder (hvid 1 + RGB venstre,
hvid 2 højre). Det flade kabel går ud til højre fra kameraet og
bagud gennem sin egen slids i bagrammen i hullet mellem de to
ender, så de krydser ikke. I v13 løb højre ledningshul sammen med
kablets slids; i v14 er ledningshullerne flyttet 4 mm ud.'''
fig.text(0.015,0.565,txt,fontsize=9.6,va='top',family='DejaVu Sans',linespacing=1.35)
import sys
fig.savefig(sys.argv[1] if len(sys.argv)>1 else '/tmp/claude-0/sk/halo-gen2-v14_skitse_rettelser.png',dpi=110,facecolor='white')
