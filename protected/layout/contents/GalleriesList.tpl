
<com:TRepeater ID="Repeater" >
    <prop:ItemTemplate>

        <div class="commentsContainer">
		<a class="headingLink" href="<%# $this->TemplateControl->getDetailLink($this->Data) %>"><%# $this->Data->nameLangAct %></a>
                <div class="commentsDatesContainer">
                    <a class="thumbImage" href="<%# $this->TemplateControl->getDetailLink($this->Data) %>">
                        <img src="<%# $this->Data->firstImageAsThumb150x100 %>" />
                    </a>
                </div>

                <p><%# $this->Data->descriptionLangAct %></p>

        </div>

    </prop:ItemTemplate>

</com:TRepeater>

<com:TPager ID="Pager" ControlToPaginate="Repeater" Mode="Numeric"  OnPageIndexChanged="pageChanged" cssClass="pager" FirstPageText="<<" LastPageText=">>"/>


<com:FWidgetControl ID="MetaData">
properties:
	-	category
	-	pagesize
	-	detailidvar
	-	detailpage
fields:
    -	fieldLabel: <%= $this->MetaData->getRecord()->name %> / <%[Select category]%>
		name: <%= $this->MetaData->getFieldName('category') %>
		editor:
			hiddenName: <%= $this->MetaData->getFieldName('category') %>
			xtype: ccombo
			displayField: name
			valueField: uid
			width: 200
			store: "@Ext.StoreMgr.lookup('galleries-categories-store')"
    -	fieldLabel: <%= $this->MetaData->getRecord()->name %> / <%[Page size]%>
		name: <%= $this->MetaData->getFieldName('pagesize') %>
		editor:
			xtype: numberfield
			allowNegative: false
			width: 200
    -	fieldLabel: <%= $this->MetaData->getRecord()->name %> / <%[Detail id variable]%>
		name: <%= $this->MetaData->getFieldName('detailidvar') %>
		editor:
			xtype: textfield
			width: 200
    -	fieldLabel: <%= $this->MetaData->getRecord()->name %> / <%[Detail page]%>
		name: <%= $this->MetaData->getFieldName('detailpage') %>
		editor:
			xtype: textfield
			width: 200
</com:FWidgetControl>	
