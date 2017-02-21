<com:TClientScript >
   var config_<%= $this->ClientID %> = { objectType: '<%= $this->HSObjectType %>',
                allowSizeReduction: false, wrapperClassName: 'draggable-header no-footer',
                useControls: true,
                outlineType: 'rounded-white',
                headingEval : 'this.thumb.title',
                preserveContent: false, width: 900, objectWidth: 950, height: 500, objectHeight: 470,
                maincontentText: 'You need to upgrade your flash player'};
</com:TClientScript >
<com:TRepeater ID="Repeater">
	<prop:ItemTemplate>
            <a class="highslide panoramaLink" 
               onclick="return hs.htmlExpand(this, config_<%= $this->TemplateControl->ClientID %>)"
               href="images/<%# $this->Data['filename'] %>">
                <img src="images/<%# $this->Data['thumb'] %>" title="<%# $this->Data['name'] %>" alt="<%# $this->Data['name'] %>" />
            </a>
	</prop:ItemTemplate>           
</com:TRepeater>            
<com:FWidgetControl ID="MetaData">
properties:
	-	names
	-	filenames
	-	thumbs
	-	hsobjecttype
fields:
    -	fieldLabel: <%= $this->MetaData->getRecord()->name %> / <%[Names]%>
		name: <%= $this->MetaData->getFieldName('names') %>
		editor:
			xtype: textfield
			width: 200
    -	fieldLabel: <%= $this->MetaData->getRecord()->name %> / <%[Filenames big]%>
		name: <%= $this->MetaData->getFieldName('filenames') %>
		editor:
			xtype: textfield
			width: 200
    -	fieldLabel: <%= $this->MetaData->getRecord()->name %> / <%[Filenames thumbs]%>
		name: <%= $this->MetaData->getFieldName('thumbs') %>
		editor:
			xtype: textfield
			width: 200
    -	fieldLabel: <%= $this->MetaData->getRecord()->name %> / <%[Object type]%>
		name: <%= $this->MetaData->getFieldName('hsobjecttype') %>
		editor:
			xtype: textfield
			width: 200
</com:FWidgetControl>	
