<com:TClientScript >
   var config_<%= $this->ClientID %> = { objectType: '<%= $this->HSObjectType %>',
                allowSizeReduction: false, wrapperClassName: 'draggable-header no-footer',
                useControls: true,
                outlineType: 'rounded-white',
                headingEval : 'this.thumb.title',
                slideshowGroup: '<%= $this->SlideShowGroup %>',
                preserveContent: false, width: 900, objectWidth: 950, height: 500, objectHeight: 470,
                maincontentText: 'You need to upgrade your flash player'};
</com:TClientScript >
<com:TRepeater ID="Repeater">
	<prop:ItemTemplate>
            <com:TControl Visible="<%= $this->TemplateControl->HSObjectType == 'swf'%>" >
            <a class="highslide panoramaLink" 
               onclick="return hs.htmlExpand(this, config_<%= $this->TemplateControl->ClientID %>)"
               href="<%# $this->Data['filename'] %>">
                <img src="images/<%# $this->Data['thumb'] %>" title="<%# $this->Data['name'] %>" alt="<%# $this->Data['name'] %>" />
            </a>
            </com:TControl>
            <com:TControl Visible="<%= $this->TemplateControl->HSObjectType == 'ajax'%>" >
            <a class="highslide"
               onclick="return hs.<%# $this->Data['expand'] %>(this, config_<%= $this->TemplateControl->ClientID %>)"
               href="<%# $this->Data['filename'] %>">
                <img src="images/<%# $this->Data['thumb'] %>" title="<%# $this->Data['name'] %>" alt="<%# $this->Data['name'] %>" />
            </a>
            </com:TControl>
	</prop:ItemTemplate>           
</com:TRepeater>            
<com:FWidgetControl ID="MetaData">
editors:
    names:
        fieldLabel: Names
        xtype: textarea
    filenames:
        fieldLabel: Filenames big
        xtype: textarea
    thumbs:
        fieldLabel: Filenames thumbs
        xtype: textarea
    hsobjecttype: Object type
    group: Group
</com:FWidgetControl>	
<!---
properties:
	-	names
	-	filenames
	-	thumbs
	-	hsobjecttype
	-	group
fields:
    -	fieldLabel: <%= $this->MetaData->getRecord()->name %> / <%[Names]%>
		name: <%= $this->MetaData->getFieldName('names') %>
		editor:
			xtype: textarea
			width: 500
                        height: 300
    -	fieldLabel: <%= $this->MetaData->getRecord()->name %> / <%[Filenames big]%>
		name: <%= $this->MetaData->getFieldName('filenames') %>
		editor:
			xtype: textarea
			width: 500
                        height: 300
    -	fieldLabel: <%= $this->MetaData->getRecord()->name %> / <%[Filenames thumbs]%>
		name: <%= $this->MetaData->getFieldName('thumbs') %>
		editor:
			xtype: textarea
			width: 500
                        height: 300
    -	fieldLabel: <%= $this->MetaData->getRecord()->name %> / <%[Object type]%>
		name: <%= $this->MetaData->getFieldName('hsobjecttype') %>
		editor:
			xtype: textfield
			width: 200
    -	fieldLabel: <%= $this->MetaData->getRecord()->name %> / <%[Group]%>
		name: <%= $this->MetaData->getFieldName('group') %>
		editor:
			xtype: textfield
			width: 200
--->