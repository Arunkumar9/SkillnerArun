<com:TClientScript >
   var config_<%= $this->ClientID %> = { objectType: 'ajax',
                allowSizeReduction: false, wrapperClassName: 'draggable-header no-footer',
                useControls: true,
                outlineType: 'rounded-white',
                headingEval : 'this.thumb.title',
                preserveContent: false, width: 900, objectWidth: 950, height: 500, objectHeight: 470,
                maincontentText: 'You need to upgrade your flash player'};
</com:TClientScript >
<com:TControl Visible="<%= $this->ShowCategoryName %>" >
    <h2 class="catName"><%= Prado::localize($this->CategoryName) %></h2>
</com:TControl>
<div class="paragraphWithDate">

        <div class="dateInTextContainer">
            <div class="dateInTextDay"><%= date("j",$this->Gallery->from_date) %></div>
                <div class="dateInTextMonthYear"><%= date("m/y",$this->Gallery->from_date) %></div>
        </div>

        <p><%= $this->Gallery->descriptionLangAct %></p>


</div>


<com:TRepeater ID="Repeater" EnableViewState="false" >
     <prop:ItemTemplate>
         <a onclick="return hs.expand(this, config_<%= $this->TemplateControl->ClientID %>)"
            class="highslide thumbImage" href="/<%# $this->Data->uid %>">
               <img alt="<%# $this->Data->text %>"
                    title="<%# $this->Data->text %>" src="/<%# $this->Data->uidAsThumb150x100 %>" />
         </a>
     </prop:ItemTemplate>
</com:TRepeater>
<com:TPager ID="Pager" ControlToPaginate="Repeater" Mode="Numeric"  OnPageIndexChanged="pageChanged" cssClass="pager" FirstPageText="<<" LastPageText=">>"/>
<com:FWidgetControl ID="MetaData">
properties:
	-	category
	-	showcategoryname
	-	categoryvar
	-	pagesize
fields:
    -	fieldLabel: <%= $this->MetaData->getRecord()->name %> / <%[Detail id]%>
		name: <%= $this->MetaData->getFieldName('category') %>
		editor:
			xtype: numberfield
			allowNegative: false
			width: 200
    -	fieldLabel: <%= $this->MetaData->getRecord()->name %> / <%[Show category name]%>
		name: <%= $this->MetaData->getFieldName('showcategoryname') %>
		editor:
			xtype: xcheckbox
    -	fieldLabel: <%= $this->MetaData->getRecord()->name %> / <%[Detail id variable]%>
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
