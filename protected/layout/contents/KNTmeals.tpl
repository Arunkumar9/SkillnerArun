<div class="printButton">
<input type="button" onclick="javascript:window.print()" value="Tisknout výsledky" />
</div>




<div class="tableColumn">

	<div class="tableForm coloredForm noTableHeadWidth">
		<table border="0" >

		  <tr>
			<th>Jméno klienta:</th>
			<td>
<%= $this->Client->Name %>
			</td>

			<th>Datum:</th>
			<td>
<%= $this->Client->CreatedAsDateF %>
			</td>

		  </tr>
	</table>
</div>

<h2>Návrhy jídelníčku</h2>
<div class="tableForm foodTable <%= $this->cssClass %>">
	
		<table border="0" class="allCellsBorder">
		
		
		<tr>
			<th class="foodColumnVaha">VÁHA</th>
			<th class="foodColumnText1">DOPORUČENÍ PODLE</th> 
			<th class="foodColumnVaha">VÁHA</th>
			<th class="foodColumnText2">VHODNÉ</th>
			<th class="foodColumnVaha">VÁHA</th>
			<th class="foodColumnText3">NEVHODNÉ </th>			
			
			</tr>
                        <com:TRepeater ID="Repeater" >
                            <prop:ItemTemplate>
                <tr class="<%# $this->Data->rowClass %>">
			<td class="<%# $this->Data->colorB %>"><%# $this->Data->vahaB %></td>
			<td><%# $this->Data->nadpis %></td>
                    <!-- <td class="coloredCell4"><%# $this->Data->vahaD %> </td> -->
			<td class="<%# $this->Data->colorE %>"><%# $this->Data->vahaE %></td>
			<td><%# $this->Data->vhodne %></td>
			<td class="<%# $this->Data->colorH %>"><%# $this->Data->vahaH %></td>
			<td><%# $this->Data->nevhodne %></td>
		</tr>
                            </prop:ItemTemplate>
                        </com:TRepeater>

		</table>
	
</div>

<com:FWidgetControl ID="MetaData">
editors:
    cssClass: Css class
</com:FWidgetControl>