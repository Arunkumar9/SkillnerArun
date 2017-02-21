<com:TRepeater ID="Repeater">
	<prop:EmptyTemplate>
	<div class="newsContainer newsEmpty" >
		<%[Nejsou žádné novinky.]%>
	</div>
	</prop:EmptyTemplate>
	<prop:ItemTemplate>
	<div class="paragraphWithDate" >
		<a href="#<%# $this->Data->uid %>"></a>
		<h2><%# $this->Data->Name %></h2>
		
			<div class="newsDetailDate"><%# date("j.m.Y", $this->Data->fromDate) %></div>

                <p><%# $this->Data->Text %></p>


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



    
	
		
