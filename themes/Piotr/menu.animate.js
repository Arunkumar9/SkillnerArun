//current item setup
function currentMenu() {
    var ts = flowplayer().getTime();
    jQuery('#menu a').each(function(item,i){
                var ch,next = jQuery(this).parent('li').next().find('a').attr('data');
                if (ts >= parseInt(jQuery(this).attr('data')) && (!next || ts < parseInt(next)) ) {
                    jQuery(this).css('color','#2EBCCD').addClass('currentChapter')
		    ch = jQuery('#menu .currentChapter').html() || jQuery('#menu a').first().html();    
		    jQuery('#now_playing').html('<p>Now playing:</p><span><b>'+ch+'</span>');
		}
                else {
                    jQuery(this).css('color','#DDD').removeClass('currentChapter');
                }

    });
}

function updateMenu() {
    currentMenu();
    setTimeout("updateMenu()",	1000);
}

jQuery(function() {
	 jQuery('#sidebar').jScrollPane({showArrows: true, animateScroll: true});
	 
	 jQuery('#now_playing').html('<p>Now playing:</p><span><b>'+jQuery('#menu a').first().html()+'</span>');
	 updateMenu();
         //clicks
         jQuery('#chapters').toggle(
                function()
                {
                  jQuery('#sidebar_bg').stop().animate({left:0},1000, 'easeOutCubic');
                    currentMenu();
                },
                function()
                {
                  jQuery('#sidebar_bg').stop().animate({left:-300},1000, 'easeOutCubic');
                    currentMenu();
                });
   
	jQuery('#rew_forw').click(function(e) {
	    e.preventDefault();
	    if (player) player.seek(player.getTime()+10);
	});
	
	jQuery('#rew_back').click(function(e) {
	    e.preventDefault();
	    if (player) player.seek(player.getTime()-10);
	});
	
	jQuery('#chapters_prev').click(function(e) {
	    e.preventDefault();
	    var data = jQuery('#menu .currentChapter').parent('li').prev('li').find('a').attr('data');
	    if (player && data) player.seek(data);
	    //var ch = jQuery('#menu .currentChapter').parent('li').prev('li').addClass('currentChapter').css('color','#2EBCCD').html();
	    //jQuery('#menu .currentChapter').removeClass('currentChapter').css('color','#DDD');
	    //jQuery('#now_playing').html('<p>Now playing:</p><span><b>'+ch+'</span>');
	});
	
	jQuery('#chapters_next').click(function(e) {
	    e.preventDefault();
	    currentMenu();

	    var data = jQuery('#menu .currentChapter').parent('li').next('li').find('a').attr('data');
	    if (player && data) player.seek(data);
	    //var ch = jQuery('#menu .currentChapter').parent('li').next('li').addClass('currentChapter').css('color','#2EBCCD').html();
	    //jQuery('#menu .currentChapter').removeClass('currentChapter').css('color','#DDD');
	    //jQuery('#now_playing').html('<p>Now playing:</p><span><b>'+ch+'</span>');
	});
	
        jQuery('#sidebar_bg').mouseenter(function(e) {
                jQuery('#sidebar_bg').stop().animate({left:0},1000, 'easeOutCubic');
                currentMenu();
                }).mouseleave(function(e) {
                  jQuery('#sidebar_bg').stop().animate({left:-300},1000, 'easeOutCubic');
                    currentMenu();
                });
       



		jQuery('#menu li a').mouseenter(function(e) {
		 		jQuery(this).stop().animate( { color: '#2EBCCD' }, 200);

                //currentMenu();
				}).mouseleave(function(e){
		 		jQuery(this).stop().animate( { color: '#DDD' }, 500);

		//		   currentMenu();
				 

		});
		

		
		jQuery('#menu li a').click(function(e) {
		 		jQuery('#sidebar_bg').stop(true,true).animate({left:-300},1000, 'easeOutCubic');
                currentMenu();
			
		});


});

jQuery("div.enterleave").mouseenter(function(){
      jQuery("p:first",this).text("mouse enter");
    }).mouseleave(function(){
      jQuery("p:first",this).text("mouse leave");
      jQuery("p:last",this).text(++n);
    });
