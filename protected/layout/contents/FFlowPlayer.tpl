 <com:TPanel id="FlowPlayer" cssClass="fplayer left" Attribute.href="http://fss28.streamhoster.com/jnovak/_definst_/smil:01.smil.xml/playlist.m3u8"  
              Style.Width="<%= $this->width %>px" Style.Height="<%= $this->height %>px"></com:TPanel>
<!---  <a id="ipad" href="http://fss28.streamhoster.com/jnovak/_definst_/smil:01.smil.xml/playlist.m3u8" Style="display: block; width: <%= $this->width %>px; height: <%= $this->height %>px">Video 01</a> --->




<com:FClientEndScript >
    player = flowplayer("<%= $this->FlowPlayer->ClientID %>", {src: "http://fast.freshsystems.cz/flowplayer/flowplayer-3.2.6.swf", wmode: "opaque" } , <%= $this->ConfigJson %> ).ipad();

     jQuery(function() {
        setTimeout("toggleLogo(20,1)",10);
         
    });
    function toggleLogo(t,h) {
        try {
        if (h==1)
            player.getPlugin('content').show();
        else
            player.getPlugin('content').hide();
        } catch(e) {
        }
        if (t==10)
            setTimeout("toggleLogo(300,0)",t*1000);
        else
            setTimeout("toggleLogo(10,1)",t*1000);
    }


</com:FClientEndScript>
<com:FWidgetControl ID="MetaData">
editors:
    filepath: <%[File]%>
    imagepath: <%[Image]%>
    width: <%[Width]%>
    height: <%[Height]%>
    colors: <%[Colors]%>
    mediaplayerurl: <%[Media player]%>
</com:FWidgetControl>
