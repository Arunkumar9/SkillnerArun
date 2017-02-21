<ul class="CategoryList">

<com:TRepeater ID="Repeater">
	<prop:ItemTemplate>
	    <li>
	          <a href="<%# $this->TemplateControl->getProductListLink($this->Data->uid) %>" class="productListLink">
	          	<%# Prado::localize($this->Data->name) %>
	          </a>
		</li>
	</prop:ItemTemplate>           
</com:TRepeater> 	
	
</ul>
<com:FWidgetControl ID="MetaData">
properties:
	-	category
	-	detail
fields:
    -	fieldLabel: <%= $this->MetaData->getRecord()->name %> / <%[Select category]%>
		name: <%= $this->MetaData->getFieldName('category') %>
		editor:
			hiddenName: <%= $this->MetaData->getFieldName('category') %>
			xtype: ccombo
			displayField: nameLangCs
			valueField: uid
			width: 200
			store: "@Ext.StoreMgr.lookup('categories-store')"
    -	fieldLabel: <%= $this->MetaData->getRecord()->name %> / <%[Detail page id]%>
		name: <%= $this->MetaData->getFieldName('detail') %>
		editor:
			xtype: textfield
			width: 200
</com:FWidgetControl>	