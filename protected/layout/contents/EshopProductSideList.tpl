<h4>Nejprodávanější</h4>

<!--<com:TControl Visible="<%= $this->ShowCategoryName %>" >
<h4><%= Prado::localize($this->CategoryName) %></h4>
</com:TControl>

-->

<com:TRepeater ID="Repeater"  EnableViewState="true">
	<prop:ItemTemplate>

        <div class="bestSellerTopBox">
                <div class="bestSellerTop">

	            <a href="<%# $this->TemplateControl->getEshopDetailLink($this->Data) %>"><img src="/<%# $this->Data->firstImageAsThumb100x1000 %>" /></a>
                    <a href="<%# $this->TemplateControl->getEshopDetailLink($this->Data) %>" ><%# $this->Data->name %></a>
                    <br /><br />

                    <span class="bestSellerPrice"><%# $this->Data->priceWithVat %></span> Kč bez DPH
	        </div>
        </div>

        </prop:ItemTemplate>
</com:TRepeater>

<com:FWidgetControl ID="MetaData">
editors:
    category:
        name: Select category
        xtype: ccombo
        store: containers-store
    showcategoryname:
        name:  Show category name
        xtype: xcheckbox
    categoryvar: Category variable
    pagesize:
        xtype: numberfield
        name: Max items
</com:FWidgetControl>