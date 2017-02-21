
var XMessage=Class.create();XMessage.SetImagePath=function(p)
{this.image=p;}
XMessage.GetImagePath=function(p)
{if(this.image===undefined)
{this.image='images/';}
return this.image;}
XMessage.show=function(msg,orientation)
{orientation=(orientation===undefined?'top.middle':orientation);if(orientation==='top.middle')
{if(XMessage.topmiddle===undefined)
{XMessage.topmiddle=new XMessage('top.middle');}
XMessage.topmiddle.message(msg);}
else if(orientation==='bottom.right')
{if(XMessage.bottomright===undefined)
{XMessage.bottomright=new XMessage('bottom.right');}
XMessage.bottomright.message(msg);}}
XMessage.images=function()
{if(this.loaded===undefined)
{this.loaded=true;var pImage,images,x,k;k=XMessage.GetImagePath();if(document.images)
{for(x=1;x<=8;x++)
{pImage=new Image();pImage.src=k+'/'+x+'.gif';}}}}
Object.extend(XMessage.prototype,{initialize:function(orientation,delay)
{XMessage.images();this.orientation=(orientation===undefined?'top.middle':orientation);this.delay=(delay===undefined?5:delay);this.timeOut=null;this.interval=null;},center:function()
{var size=document.viewport.getWidth(),center=(size/2)-(this.obj.getWidth()/2);this.obj.setStyle({'left':center+'px'});},message:function(msg)
{var left,html,k;if(this.obj!==undefined)
{this.obj.hide();}
clearInterval(this.interval);clearTimeout(this.timeOut);this.obj=new Element('div');this.obj.setStyle({'position':'absolute','clip':'rect(0px 0px 0px 0px)','overflow':'hidden'});document.body.appendChild(this.obj);k=XMessage.GetImagePath();html="<table border='0' cellpadding='0' cellspacing='0'><tr><td width='2'><img src='"+k+"/1.gif' width='6' height='5' ></td><td><img src='"+k+"/2.gif' width='100%' height='5' ></td><td width='5'><img src='"+k+"/3.gif' width='5' height='5' ></td></tr><tr><td background='"+k+"/8.gif'></td><td bgcolor='#9fc4fc'>"+msg+"</td><td background='"+k+"/4.gif'></td></tr><tr><td><img src='"+k+"/7.gif' width='6' height='6' ></td><td><img src='"+k+"/6.gif' width='100%' height='6' ></td><td><img src='"+k+"/5.gif' width='5' height='6'></td></tr></table>";this.obj.update(html);this.height=this.obj.getHeight();this.width=this.obj.getWidth();this.vheight=document.viewport.getHeight();if(this.orientation==='top.middle')
{this.center();this.top=this.height;this.right=this.width;this.bottom=this.height;this.left=0;}
else if(this.orientation==='bottom.right')
{left=document.viewport.getWidth()-this.width-100;this.obj.setStyle({'left':left+'px','top':this.vheight-this.height+'px'});this.top=0;this.right=this.width;this.bottom=0;this.left=0;}
this.obj.show();this.interval=window.setInterval(this.doShow.bind(this),25);Event.observe(this.obj,'mouseover',this.over.bindAsEventListener(this));Event.observe(this.obj,'mouseout',this.out.bindAsEventListener(this));},doShow:function()
{if(this.orientation==='top.middle')
{if(this.top>0)
{this.top=this.top-5;this.obj.setStyle({'top':-(this.top)+'px','clip':'rect('+this.top+'px '+this.right+'px '+this.bottom+'px '+this.left+'px)'});}
else
{clearInterval(this.interval);this.timeOut=window.setTimeout(this.hide.bind(this),1000*this.delay);}}
if(this.orientation==='bottom.right')
{if(this.bottom<=this.height)
{this.bottom=this.bottom+5;this.vheight=this.vheight-5;this.obj.setStyle({'height':this.bottom,'top':this.vheight+'px','clip':'rect('+this.top+'px '+this.right+'px '+this.bottom+'px '+this.left+'px)'});}
else
{clearInterval(this.interval);this.timeOut=window.setTimeout(this.hide.bind(this),1000*this.delay);}}},hide:function()
{this.interval=window.setInterval(this.doHide.bind(this),25);},doHide:function()
{if(this.orientation==='top.middle')
{if(this.top<=0)
{this.top=this.top-5;this.obj.setStyle({'top':this.top+'px','clip':'rect('+this.top+'px '+this.right+'px '+this.bottom+'px '+this.left+'px)'});}
else
{clearInterval(this.interval);}}
if(this.orientation==='bottom.right')
{if(this.bottom>0)
{this.bottom=this.bottom-5;this.vheight=this.vheight+5;this.obj.setStyle({'height':this.bottom,'top':this.vheight+'px','clip':'rect('+this.top+'px '+this.right+'px '+this.bottom+'px '+this.left+'px)'});}
else
{clearInterval(this.interval);}}},over:function()
{clearTimeout(this.timeOut);},out:function()
{this.timeOut=window.setTimeout(this.hide.bind(this),1000*this.delay);}});