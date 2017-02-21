<!---

Gadget typ 4 - stejny jako 2 (GadgetListText) pouze s jinymi rozmery

--->
<com:TControl Visible="<%= $this->ShowCategoryName %>" >
    <h2 class="catName"><%= Prado::localize($this->CategoryName) %></h2>
</com:TControl>
<div class="gadgetsContainer">

    <com:TRepeater ID="Repeater" >
        <prop:ItemTemplate>
            <a href="<%# $this->Data->getLink(1) %>" class="gadget g-text"><span><%# $this->Data->description %></span></a>
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
