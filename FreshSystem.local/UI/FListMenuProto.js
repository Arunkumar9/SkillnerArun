if (typeof(Fresh)=='undefined')
	var Fresh = {};
//var Fresh = Fresh || {};


Fresh.BlindList = Class.create({
    initialize: function(){
        this.accordion = null;           /* Stores a pointer to the the accordion element */
        this.contents = null;            /* Array of pointers to the headings and content panes of the accordion */
        this.options = null;             /* Allows user to define the names of the css classes */
        this.maxHeight = 0;              /* Stores the height of the tallest content pane */
        this.current = null;             /* Stores a pointer to the currently expanded content pane */
        this.toExpand = null;            /* Stores a pointer to the content pane to expand when a user clicks */
        this.isAnimating = false;        /* Keeps track of whether or not animation is currently running */

    },

    checkMaxHeight: function(){},         /* Determines the height of the tallest content pane */
    initialHide: function(){},            /* Hides the panes which are not displayed by default */
    attachInitialMaxHeight: function(){}, /* Ensures that the height of the first content pane matches the tallest */
    expand: function(el){},               /* Tells the animation function which elements to animate */
    animate: function(){},                /* Performs the actual animation of the accordion effect */
    handleClick: function(e){}            /* Determine where a user has clicked and act based on that click */

});
Fresh.BlindList = function(id) {
	var elem = Ext.get(id);
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
      elem.select('A:first-child').on('click',function(){
		//alert(jQuery(this).text());
		console.log('click '+this.id);
		Ext.fly(this).parent().parent().select('ul{display!=none}').each(function(){
			console.log('open '+this);
				Ext.fly(this).slideOut('t',{duration: 400,easing: 'easeOut' , 
					     callback: function() {  eraseCookie('fresh_'+id,'1',1); return false; }});//.limitQueue('fxMenu',1);
		});
		Ext.fly(this).parent().parent().select('ul{display=none}').each(function(){
			console.log('close '+this);
			Ext.fly(this).slideIn('t', { duration: 400, easing: 'easeOut' ,callback: function() {  createCookie('fresh_'+this.id,'1',1); return false; }});//.limitQueue('fxMenu',1);
		});

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