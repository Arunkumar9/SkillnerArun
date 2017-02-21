
var XToolTip=Class.create();XToolTip.init=function()
{if(this.XToolTip===undefined)
{XToolTip.arr=new Array();}
for(x=0;x<XToolTip.arr.length;x++)
{var text=XToolTip.arr[x][1];var orientation=XToolTip.arr[x][2];Event.observe($(XToolTip.arr[x][0]),"mouseover",XMessage.show.curry(XToolTip.arr[x][1],XToolTip.arr[x][2]));}}
XToolTip.add=function(obj,text,orientation)
{if(XToolTip.arr===undefined)
{XToolTip.arr=new Array();}
XToolTip.arr.push(new Array(obj,text,orientation));}
Object.extend(XToolTip.prototype,{initialize:function(obj,text,orientation)
{if(typeof(XMessage)===undefined)
{alert('Did you forget to include XMessage.js?');}
else
{if(XToolTip.loaded===undefined)
{XToolTip.loaded=true;Event.observe(window,"load",XToolTip.init);}
XToolTip.add(obj,text,orientation);}}});