<h2><%= $this->User->Name %></h2>
<com:TRepeater ID="Repeater">
    <prop:ItemTemplate>
        <div class="newsConatiner">
            <div class="dateNumContainer">
                <div class="dateNumDay"><%# date("j",$this->Data->input_date) %></div>
                <div class="dateNumMonthYear"><%# date("m/y",$this->Data->input_date) %></div>
            </div>

            <p> <%# $this->Data->comment %> </p>

        </div>
    </prop:ItemTemplate>
</com:TRepeater>            
<com:TPager ID="Pager" ControlToPaginate="Repeater" Mode="Numeric"  OnPageIndexChanged="pageChanged" cssClass="pager" FirstPageText="<<" LastPageText=">>"/>
<com:FWidgetControl ID="MetaData">
properties:
	-	respectdates
	-	respectculture
	-	pagesize
fields:
    -	fieldLabel: <%= $this->MetaData->getRecord()->name %> / <%[Respect dates]%>
		name: <%= $this->MetaData->getFieldName('respectdates') %>
		editor:
			xtype: xcheckbox
    -	fieldLabel: <%= $this->MetaData->getRecord()->name %> / <%[Respect culture]%>
		name: <%= $this->MetaData->getFieldName('respectculture') %>
		editor:
			xtype: xcheckbox
    -	fieldLabel: <%= $this->MetaData->getRecord()->name %> / <%[Page size]%>
		name: <%= $this->MetaData->getFieldName('pagesize') %>
		editor:
			xtype: numberfield
			allowNegative: false
			width: 200
</com:FWidgetControl>

