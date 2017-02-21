<div class="<%= $this->cssClass %>">

	<com:TRepeater ID="Repeater" >
		<prop:ItemTemplate>
			<a href="<%# $this->TemplateControl->getEshopDetailLink($this->Data->uid) %>" ><%# $this->Data->NameLangAct %></a> 
		</prop:ItemTemplate>
	</com:TRepeater>
	<com:TPager ID="Pager" ControlToPaginate="Repeater" Mode="Numeric"  OnPageIndexChanged="pageChanged" cssClass="pager" FirstPageText="<<" LastPageText=">>"/>

</div>
<com:FWidgetControl ID="MetaData">
properties:
	-	maxproducts
	-	pagesize
fields:
    -	fieldLabel: <%= $this->MetaData->getRecord()->name %> / <%[Max products]%>
		name: <%= $this->MetaData->getFieldName('category') %>
		editor:
			xtype: numberfield
			allowNegative: false
			width: 200
    -	fieldLabel: <%= $this->MetaData->getRecord()->name %> / <%[Page size]%>
		name: <%= $this->MetaData->getFieldName('pagesize') %>
		editor:
			xtype: numberfield
			allowNegative: false
			width: 200
</com:FWidgetControl>	