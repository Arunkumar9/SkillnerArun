<com:FWidgetControl ID="MetaData">
properties:
	-	title
	-	description
	-	keywords
collapsed: false
forTab: Seo
fields:
    -	fieldLabel: <%= $this->MetaData->getRecord()->name %> / <%[Title tag]%>
		name: <%= $this->MetaData->getFieldName('title') %>
		editor:
			xtype: textfield
			allowBlank: true
			anchor: 90%
    -	fieldLabel: <%= $this->MetaData->getRecord()->name %> / <%[Meta description]%>
		name: <%= $this->MetaData->getFieldName('description') %>
		editor:
			xtype: textarea
			allowBlank: true
			anchor: 90%
			height: 80
    -	fieldLabel: <%= $this->MetaData->getRecord()->name %> / <%[Meta keywords]%>
		name: <%= $this->MetaData->getFieldName('keywords') %>
		editor:
			xtype: textarea
			allowBlank: true
			anchor: 90%
			height: 80
</com:FWidgetControl>