      <com:TActiveHiddenField ID="currentVideo" />
      <div class="interaction">
          <ul>
              <li><a id="stampMe" href="#">Comment</a></li>
              <li><a id="stampMeStop" href="#">Pause & Comment</a></li>
              <li><a id="editSwitch" href="#">Edit</a></li>
	      <div id="searchwrapper">
                    <form action="">
                    <input type="text" class="searchbox" name="s" value="Search video" >
                    <input type="submit" class="searchbox_submit" value=""/>
                    </form>
                </div>
          </ul>
      </div>


	<a id="chapters_prev"><img src="/themes/Piotr/image/ch_prev.png" /></a>
	<a id="chapters"><p>Chapters</p></a> 
	<a id="chapters_next"><img src="/themes/Piotr/image/ch_next.png" /></a>
<div id="now_playing"><p>Now playing:</p><span><b>38 /</b> Stress - Principle components</span></div>
                
                   <a id="rew_back"><img src="/themes/Piotr/image/m_rew.png" /><p>10s</p></a>
                   <a id="rew_forw"><p>10s</p><img src="/themes/Piotr/image/m_forv.png" /></a>
		   
      <div id="sidebar_bg">
          <div id="shadow_top">&nbsp;</div>

          <div class="arrow">&nbsp;</div>

          <h1>
              <%= $this->Video->name %>
          </h1>

          <div id="sidebar">


              <ul id="menu">

                  <com:TRepeater ID="ChapterRepeater">
                      <prop:ItemTemplate>

                          <li><a href="#" data="<%# $this->Data->start %>" ><span><%# $this->Data->name %></span> / <%# $this->Data->description %></a></li> 
                      </prop:ItemTemplate>
                  </com:TRepeater>

              </ul>


          </div>
          <div id="shadow_bottom">&nbsp;</div>
      </div>
<!--- onClick="if (player) player.seek(<%# $this->Data->start %>);return false;" --->

      <com:TActivePanel ID="commentsList" cssClass="commentsL comments" Style.CustomStyle="margin: 0px;"/>
      <com:TActiveTextBox ID="commentsBox" TextMode="MultiLine" cssClass="comments"   OnTextChanged="postComments" AutoPostback="true" Style.CustomStyle="margin: 0px;"/>
      <com:TValueTriggeredCallback ID="submitComments" Interval="10" OnCallback="postComments" ControlID="commentsBox" PropertyName="value" DecayRate="1" />
      <com:TCallback ID="updateClip" OnCallback="clipChanged" />


<com:FClientEndScript>
        
    jQuery(function() {
        
                //setTimeout("currentMenu()",10000);
   
	jQuery('#menu').click(function(e) {
	    e.stopPropagation();
	    e.preventDefault();
	    var data = jQuery(e.target).attr('data');
	    if (player && data) player.seek(data);
	});

	// initialize scrollable
	jQuery("#stampMe, #stampMeStop").click(function(e) {
           var txt,fsec,hr,sec,min,ta;
           var bb = jQuery(this);
           ts = (typeof ts == 'undefined') ? 0 : ts;
           tsn = flowplayer().getTime();
           var co = jQuery("#<%= $this->commentsList->ClientID %>");
           var ta = jQuery("#<%= $this->commentsBox->ClientID %>");


                ts = tsn;
                txt = ta.val();
                hr = Math.floor(ts/3600);
                min = Math.floor(ts/60)-60*hr;
                sec = Math.floor(ts)-3600*hr - 60*min;
                fsec = ((hr<10)?'[0':'[')+hr + ((min<9)?':0':':') + min + ((sec<9)?':0':':') + sec + ']  ';

           if (!ta.is(':visible')) {
               co.hide();
               ta.show();
               jQuery('#editSwitch').html('Stop Edit');
           }

                ta.focus().val(txt+String.fromCharCode(13)+fsec);
//                ta.scrollTop(ta.scrollHeight - ta.height());
               if (!jQuery.browser.msie)
                        ta.scrollTop(2000);

               if (bb.is('#stampMeStop')) {
                    if (player) player.pause();
               }

           e.preventDefault();
          });

         function switchMe(e) {
	    e.preventDefault();
            var bb = jQuery('#editSwitch');
            var ta = jQuery("#<%= $this->commentsBox->ClientID %>");
            var co = jQuery("#<%= $this->commentsList->ClientID %>");
            var stp;
            var html='';
            var lines = ta.val().split("\n");

            for (i=0;i<lines.length;i++) {

                stp = lines[i].split(']');
                if (stp.length>1) {
                secs = stp[0].replace(/\[/,'');
                secs = secs.split(':');
                secs = parseInt(secs[0])*3600+parseInt(secs[1])*60+parseInt(secs[2]);

                tm = '<a href="#" data="'+secs+'">'+stp[0]+']</a>';
                tx = stp[1];
                } else {
                tm = '<span class="aspace">&nbsp;</span>';
                    tx = stp[0];
                }

                html = html + tm + '&nbsp;<span class="ctext">'+tx+'</span><br>';

            }

            co.html(html);
            co.find('a').click(function(e) {
                if (player) player.seek(parseInt(jQuery(this).attr('data'))).resume();
            });
            if (ta.is(':visible')) {

               ta.hide();
               co.show();
               bb.html('Edit');

            } else {
               co.hide();
               ta.show();
               bb.html('Stop Edit');
            }


        }

        jQuery('#editSwitch').click(switchMe);
        jQuery('#editSwitch').click();
/*
	var triggers = jQuery(".playlist a").overlay({

		// some mask tweaks suitable for modal dialogs
		top: 20,

		mask: {
			color: '#2b2b2b',
			loadSpeed: 200,
			opacity: 0.8
		},

		closeOnClick: false,
                onLoad: function() {
                        var request = <%= $this->updateClip->ActiveControl->Javascript %>;
                        //request.ActiveControl.CallbackParameter = this.getTrigger().attr('data');
                        jQuery('#<%= $this->currentVideo->ClientID %>').val(this.getTrigger().attr('data'));
                        request.dispatch();
			player.load().play(this.getTrigger().attr('href'));
		},

		// when overlay is closed, unload our player
		onClose: function() {
			player.unload();
		}
	});

*/

    });

</com:FClientEndScript>
<com:FWidgetControl ID="MetaData">
editors:
    cssClass: Css class
</com:FWidgetControl>