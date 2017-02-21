<com:TPanel id="videogal" Style.Width="<%= $this->width %>px" Style.Height="<%= $this->height %>px"/>
<com:TClientScript >
		var s1 = new SWFObject("<%= $this->mediaplayerurl %>","mediaplayer","<%= $this->width %>","<%= $this->height %>","7");
		s1.addParam("allowfullscreen","false");
		s1.addVariable("width","<%= $this->width %>");
		s1.addVariable("height","<%= $this->height %>");
		s1.addVariable("file","<%= $this->filepath %>");
		s1.addVariable("image","<%= $this->imagepath %>");
		s1.addVariable("screencolor","<%= $this->getColor(0) %>"); //0x000000
		s1.addVariable("backcolor","<%= $this->getColor(1) %>"); //0xFFFFFF
		s1.addVariable("frontcolor","<%= $this->getColor(2) %>"); //0x035701
		s1.addVariable("lightcolor","<%= $this->getColor(3) %>"); //0x3d9e03
		s1.write("<%= $this->videogal->ClientID %>");
</com:TClientScript>
<com:FWidgetControl ID="MetaData">
properties:
	-	filepath
	-	imagepath
	-	width
	-	height
	-	colors
	-	mediaplayerurl
fields:
    -	fieldLabel: <%= $this->MetaData->getRecord()->name %> / <%[File]%>
		name: <%= $this->MetaData->getFieldName('filepath') %>
		editor:
			xtype: textfield
			allowBlank: true
			anchor: 90%
    -	fieldLabel: <%= $this->MetaData->getRecord()->name %> / <%[Image]%>
		name: <%= $this->MetaData->getFieldName('imagepath') %>
		editor:
			xtype: textfield
			allowBlank: true
			anchor: 90%
    -	fieldLabel: <%= $this->MetaData->getRecord()->name %> / <%[Media player]%>
		name: <%= $this->MetaData->getFieldName('mediaplayerurl') %>
		editor:
			xtype: textfield
			allowBlank: true
			anchor: 90%
    -	fieldLabel: <%= $this->MetaData->getRecord()->name %> / <%[Width]%>
		name: <%= $this->MetaData->getFieldName('width') %>
		editor:
			xtype: textfield
			allowBlank: false
			anchor: 90%
    -	fieldLabel: <%= $this->MetaData->getRecord()->name %> / <%[Height]%>
		name: <%= $this->MetaData->getFieldName('height') %>
		editor:
			xtype: textfield
			allowBlank: false
			anchor: 90%
    -	fieldLabel: <%= $this->MetaData->getRecord()->name %> / screencolor,backcolor,frontcolor,lightcolor
		name: <%= $this->MetaData->getFieldName('colors') %>
		editor:
			xtype: textfield
			allowBlank: true
			anchor: 90%
</com:FWidgetControl>
