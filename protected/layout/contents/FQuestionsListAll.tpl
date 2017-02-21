<com:TRepeater ID="Repeater">
	<prop:EmptyTemplate>
	<div class="newsContainer newsEmpty" >
		<%[Nejsou žádné otázky a odpovědi.]%>
	</div>
	</prop:EmptyTemplate>
	<prop:HeaderTemplate>
		<table cellspacing="0" cellpadding="3" border="0">
		<tbody>
	</prop:HeaderTemplate>
	<prop:ItemTemplate>
			<tr valign="top"> 
			  <td width="3%" valign="top" ><img width="16" height="16" alt="odpověď" src="themes/Base/images/otazka.gif"/></td>
		      <td width="97%" class="textnormal"><%# $this->Data->question %></td>
			</tr>
			<tr valign="top"> 
			  <td width="3%" valign="top" ><img width="16" height="16" alt="odpověď" src="themes/Base/images/odpoved.gif"/></td>
		      <td width="97%" class="textnormal"><%# $this->Data->answer %></td>
			</tr>
			<td height="1" colspan="2">------------------------------------------------------------------------------</td>
	</prop:ItemTemplate>
	<prop:FooterTemplate>
		</tbody>
		</table>           
	</prop:FooterTemplate>
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
