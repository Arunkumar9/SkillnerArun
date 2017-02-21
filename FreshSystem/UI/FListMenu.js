if (typeof(Fresh)=='undefined')
	var Fresh = {};
//var Fresh = Fresh || {};


jQuery.fn.BlindList = function() {
	if (jQuery(this).is('._inited'))
		return;
	jQuery(this).find("ul").each(
		function() { 
			var c = readCookie('fresh_'+this.id);
			if (!c) jQuery(this).height('auto').hide(); 
			else jQuery(this).height('auto').show();
		}
	);
	var level =	jQuery('li',this); //.find("li")
    level.each(function() {
	 if (jQuery(this).children('ul').size()>0)   
	 { 	
      jQuery(this).children('A:first-child').click(function(){
		//alert(jQuery(this).text());
		jQuery(this).parent('li').parent().find('ul:visible').
				slideUp({duration: 300,easing: 'easeOutSine' , 
					     complete: function() {  eraseCookie('fresh_'+this.id,'1',1); return false; }});//.limitQueue('fxMenu',1);
		jQuery(this).parent('li').children('ul:hidden')
			.slideDown( { duration: 300, easing: 'easeOutSine' ,complete: function() {  createCookie('fresh_'+this.id,'1',1); return false; }});//.limitQueue('fxMenu',1);

	    return true;
	   });
	 }
    });
	jQuery(this).find('A').focus(function() { this.blur(); });
	jQuery(this).addClass('_inited');
}
//Fresh.BlindList = function(id) {
	//		jQuery('#'+id).BlindList();
	//}
//easing: 'easeinout' ,

function createCookie(name,value,days)
{
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
	createCookie(name,"",-1);
}