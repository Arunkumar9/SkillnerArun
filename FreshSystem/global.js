function twoDigit(a) {
if (a < 10) { return '0'+a; }
else { return a; }
}

function strToday() 
{
d = new Date();
return twoDigit(d.getDate())+'.'+twoDigit(d.getMonth()+1)+'.'+d.getFullYear()+' '+twoDigit(d.getHours())+':'+twoDigit(d.getMinutes());
}

function Launcher(url)
{
	return window.open(url,'','toolbar=no,scrollbars=yes,location=no,status=yes,width=900,height=650,resizable=1');
}

function HideWait(w)
{
//	pp = $(w);
//	pp.innerHTML = '<iframe src="about:blank" scrolling="no" frameborder="0" style="position: absolute; Left: 0px; Top: 0px; z-index: 0; height: 500px; width: 100%; filter: progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0);"></iframe>' + pp.innerHTML;

	//$(w).style.display = 'none';
	//$(w).hide();
	j$('.statusBar IMG, .statusText SPAN').remove();
	j$('.statusBar:visible').pause(15000).slideUp('normal');
}

function ShowWait(w)	
{
//	Effect.Appear(w,{duration: 1} );
	//j$('.statusBar').prepend('<img src="/fresh/images/mozilla_blu.gif" class="loader" />');
	j$('.statusText').empty().prepend('<span>Loading...</span>').after('<img src="/fresh/images/mozilla_blu.gif" class="loader" />');
	j$('.statusBar:hidden').slideDown('normal');
//	$$('.popPanel').each(function(p){ 
//		if (p.style.display != 'none') {
//			$(w).style.backgroundColor = 'white';
//			new Effect.Opacity($(w),{duration: 2,from: 0, to: 0.5});
//			$(w).style.display = '';
//		} else {
//			Effect.Appear(w,{duration: 1} );
//		}
//	});
}
/*
function ShowPane()  {
	$$('.tabs').each(function(tab) {
		Element.cleanWhitespace(tab); 
		Event.observe(tab,'click', function(event) { 
					e = Event.element(event);
					if (Element.hasClassName(e,'inactiveTab')) {
						$$('#'+tab.id+' .activeTab').each(function(item) { Element.removeClassName(item,'activeTab'); Element.addClassName(item,'inactiveTab');  Element.hide(item.nextSibling); });	
						Element.show(e.nextSibling); //Effect.Appear(e.id+'c', { duration: 0.3 });
						Element.removeClassName(e,'inactiveTab'); Element.addClassName(e,'activeTab');
						Event.stop(event); 
					}
		});
	});
}
*/