if (typeof(Fresh)=='undefined')
	var Fresh = {};
//var Fresh = Fresh || {};


Fresh.BlindList = function(id) {
	var elem = Ext.get(id);
	elem.setVisibilityMode(Element.DISPLAY);
	if (elem.is('._inited'))
		return;
	elem.select("ul").each(
		function() { 
			var c = readCookie('fresh_'+id);
			if (!c) this.autoHeight(true).hide(); 
		}
	);
	var level =	elem.select('li');//,this); //.find("li")
    level.each(function() {
	 if (elem.select('ul').getCount()>0)   
	 { 	
      Ext.fly(this).select('.canopen').on('click',function(e){
		//alert(jQuery(this).text());
		console.log('click '+this.id);
		e.stopEvent();
		Ext.fly(this).parent().select('ul').hide();//each(function(){
		Ext.fly(this).select('ul').show();//each(function(){
//			console.log(this);
//			Ext.fly(this).slideOut('t',{duration: 1,easing: 'easeOut' , 
//					     callback: function() {  eraseCookie('fresh_'+id,'1',1); return false; }});//.limitQueue('fxMenu',1);
//		});
//			console.log(this);
//			Ext.fly(this).slideIn('t', { duration: 1, easing: 'easeOut' ,callback: function() {  createCookie('fresh_'+this.id,'1',1); return false; }});//.limitQueue('fxMenu',1);
//		});
		
	    return true;
	   });
	 }
    });
	elem.select('A').on('focus',function() { console.log('blur');this.blur(); });
	elem.addClass('_inited');
}
//Fresh.BlindList = function(id) {
	//		jQuery('#'+id).BlindList();
	//}
//easing: 'easeinout' ,

function createCookie(name,value,days)
{
	console.log('write cookie '+name);
	if (days)
	{
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
	//alert(document.cookie);
}

function readCookie(name)
{
	console.log('read cookie '+name);
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++)
	{
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

function eraseCookie(name)
{
	console.log('erase cookie '+name);
	createCookie(name,"",-1);
}