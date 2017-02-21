<!---<iframe src="/resources/teaser.html" style="width:450px; height:250px; margin:0px; padding:0px; margin-left:25px; border:0px;"></iframe>--->
<com:FWidgetControl ID="MetaData">
properties:
	-	frameurl
	-	width
	-	height
	-	cssstyle
fields:
    -	fieldLabel: <%= $this->MetaData->getRecord()->name %> / <%[Url]%>
		name: <%= $this->MetaData->getFieldName('frameurl') %>
		editor:
			xtype: textfield
			allowBlank: true
			anchor: 90%
    -	fieldLabel: <%= $this->MetaData->getRecord()->name %> / <%[Width]%>
		name: <%= $this->MetaData->getFieldName('width') %>
		editor:
			xtype: textfield
			allowBlank: true
			anchor: 90%
    -	fieldLabel: <%= $this->MetaData->getRecord()->name %> / <%[Height]%>
		name: <%= $this->MetaData->getFieldName('height') %>
		editor:
			xtype: textfield
			allowBlank: true
			anchor: 90%
    -	fieldLabel: <%= $this->MetaData->getRecord()->name %> / <%[Css Style]%>
		name: <%= $this->MetaData->getFieldName('cssstyle') %>
		editor:
			xtype: textfield
			allowBlank: true
			anchor: 90%
</com:FWidgetControl>