<!---

Gadget typ 5 - stejny jako 3 (GadgetList2) pouze 2 vedle sebe

--->

<com:TControl Visible="<%= $this->ShowCategoryName %>" >
<h2 class="catName"><%= Prado::localize($this->CategoryName) %></h2>
</com:TControl>
<div class="catalogueListContainer">

<com:TRepeater ID="Repeater" >
	<prop:ItemTemplate>
	
	
			<div class="catalogueItem">
			
				<a href="<%# $this->Data->getLink(1) %>" class="catalogueImage g<%# $this->Data->uid %>">&nbsp;</a>
			
				<h2><a href="<%# $this->Data->getLink(1) %>"><%# $this->Data->name %></a></h2>
			
				<p><%# $this->Data->description %></p>
				
			</div>
	
	
		 
		
</prop:ItemTemplate>

</com:TRepeater>


</div>
<com:TPager ID="Pager" ControlToPaginate="Repeater" Mode="Numeric"  OnPageIndexChanged="pageChanged" cssClass="pager" FirstPageText="<<" LastPageText=">>"/>

<com:FWidgetControl ID="MetaData">
properties:
	-	category
	-	showcategoryname
	-	categoryvar
	-	pagesize
fields:
    -	fieldLabel: <%= $this->MetaData->getRecord()->name %> / <%[Select category]%>
		name: <%= $this->MetaData->getFieldName('category') %>
		editor:
			hiddenName: <%= $this->MetaData->getFieldName('category') %>
			xtype: ccombo
			displayField: name
			valueField: uid
			width: 200
			store: 'categories-store'
    -	fieldLabel: <%= $this->MetaData->getRecord()->name %> / <%[Show category name]%>
		name: <%= $this->MetaData->getFieldName('showcategoryname') %>
		editor:
			xtype: xcheckbox
    -	fieldLabel: <%= $this->MetaData->getRecord()->name %> / <%[Category variable]%>
		name: <%= $this->MetaData->getFieldName('categoryvar') %>
		editor:
			xtype: textfield
			width: 200
    -	fieldLabel: <%= $this->MetaData->getRecord()->name %> / <%[Page size]%>
		name: <%= $this->MetaData->getFieldName('pagesize') %>
		editor:
			xtype: numberfield
			allowNegative: false
			width: 200
</com:FWidgetControl>	
