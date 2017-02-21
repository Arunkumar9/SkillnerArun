<com:TControl Visible="<%= $this->ShowCategoryName %>" >
<h2 class="catName"><%= Prado::localize($this->CategoryName) %></h2>
</com:TControl>
<div class="cardsContainerOut">

<com:TRepeater ID="Repeater" >
	<prop:ItemTemplate>
 	<div class="productCard">
                	<h2><%# $this->Data->name %></h2>
					<a href="<%# $this->Page->getDetailLink($this->Data->uid) %>" class="thumbImageLink"><img src="<%# $this->Data->firstImageAsThumb145x1000 %>" ></a>
                    <div class="productCardText">
                        Cena: <strong><%# $this->Data->DefaultVariant->Price %> Kč</strong><br>
                        <span><%# $this->Data->price*1.19 %> Kč</span> s DPH<br>
                        Dostupnost:<br>
                        <strong>skladem k dispozici ihned</strong>
                    </div>                                       
                    
                    <div class="productCardButtons">
						<table>
                        <tr>
                        <td><input type="button" class="buttOrder"></td>
						<td><input type="text" class="textBoxOrder" value="1" size="3">&nbsp;&nbsp;Ks</td>
                    	<td><input type="button" class="buttDetails"></td>                        
                        </tr>
	                    </table>                    
                    </div>
	</div>			
 <!--
	<div class="productThumb">
		<a href="<%# $this->TemplateControl->getDetailLink($this->Data->uid) %>" class="cardImage">
			  <img src="<%# $this->Data->firstImageAsThumbUrl500x145 %>" >
		</a> 

	    <div class="cardText">
	          <h2><%# $this->Data->nameLangAct %></h2>
	          <p><%# $this->Data->short_descriptionLangAct %></p>
	    </div>
	
	    <div class="cardLinks">
	          <a href="<%# $this->TemplateControl->getDetailLink($this->Data->uid) %>" class="detailsLink"><%[ detail produktu ]%></a>
              <a href="<%# $this->TemplateControl->getEshopDetailLink($this->Data->uid) %>" class="cardEshopLink"><%[ koupit v e-shopu ]%></a>
	    </div>
	</div>

-->	
</prop:ItemTemplate>

</com:TRepeater>

<com:TPager ID="Pager" ControlToPaginate="Repeater" Mode="Numeric"  OnPageIndexChanged="pageChanged" cssClass="pager" FirstPageText="<<" LastPageText=">>"/>

</div>
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
			displayField: nameLangCs
			valueField: uid
			width: 200
			store: "@Ext.StoreMgr.lookup('categories-store')"
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
