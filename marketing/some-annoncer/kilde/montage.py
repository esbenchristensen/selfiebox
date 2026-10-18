from PIL import Image;import glob
def m(pat,w,h,cols,out):
    fs=sorted(glob.glob(pat)); ims=[Image.open(f).convert('RGB').resize((w,h)) for f in fs]
    rows=(len(ims)+cols-1)//cols; o=Image.new('RGB',(w*cols,h*rows),'white')
    for k,i in enumerate(ims): o.paste(i,((k%cols)*w,(k//cols)*h))
    o.save(out)
m('out/0[1-8]*_feed.png',432,540,4,'out/_feed.jpg')
m('out/0[1-8]*_story.png',360,640,4,'out/_story.jpg')
Image.open('out/karrusel_stribe.png').convert('RGB').resize((2520,360)).save('out/_car.jpg')
