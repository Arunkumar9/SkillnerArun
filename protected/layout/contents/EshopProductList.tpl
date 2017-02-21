<com:TControl Visible="<%= $this->ShowCategoryName %>" >
<h1><%= Prado::localize($this->CategoryName) %></h1>
</com:TControl>
<com:TControl Visible="<%= $this->ShowSortingPanel %>" >

			 <div class="contentBlockContainer">


						<div class="contentBlockHeading">Zobrazení</div>
					  <div class="contentBlockContent">
						  <table border="0" width="100%">
							<tr>
							  <td width="120">
								Řazení podle:
							  </td>
							  <td width="70">
                                                        <com:TActiveDropDownList ID="OrderBox" OnSelectedIndexChanged="orderBoxClicked" OnCallback="orderBoxClicked" >
                                                            <com:TListItem Value="name" Text="Název"/>
                                                            <com:TListItem Value="price" Text="Cena"/>
                                                        </com:TActiveDropDownList>
							  </td>

							  <td width="18"><com:TActiveLinkButton ID="sortASC" cssClass="arrowUp" Attributes.Title="vzestupně" OnCallback="orderButtonClicked" /></td>
							  <td width="250"><com:TActiveLinkButton ID="sortDESC" cssClass="arrowDown" Attributes.Title="sestupně" OnCallback="orderButtonClicked" />
							  <!---
                                                          <td><a href="#" class="arrowDown" style="background-image:url(images/arrowDownInactive.jpg)" title="sestupně"></a></td>
                                                          --->
                                                          <!---
							  <td><com:TActiveRadioButton ID="sortASC" GroupName="OrderDir" cssClass="arrowUp" Attributes.Title="vzestupně" OnCallback="orderButtonClicked" OnCheckedChanged="orderButtonClicked" /></td>
							  <td><com:TActiveRadioButton ID="sortDESC" GroupName="OrderDir" cssClass="arrowDown" Attributes.Title="sestupně" OnCallback="orderButtonClicked" OnCheckedChanged="orderButtonClicked" /></td>
                                                          --->

                                                          </td>
														  
														  
													<td width="70">
													<div id="loadingIcon" class="pagerChangeLoadingIcon" style="display: none"></div>
													</td>	  
														  
							  <td width="350" align="right">Položky&nbsp;</td>
							  <td>
                                                        <com:TActiveDropDownList ID="PageSizeBox" OnSelectedIndexChanged="pageSizeBoxClicked" OnCallback="pageSizeBoxClicked" >
                                                            
                                                            <com:TListItem Value="3" />
                                                            <com:TListItem Value="6" />
                                                            <com:TListItem Value="12" />
                                                            <com:TListItem Value="24" />
                                                            <com:TListItem Value="0" Text="Vše" />
                                                        </com:TActiveDropDownList>
							  </td>
							</tr>
						  </table>




						</div>
                            </div>

</com:TControl>

<div class="pageControlContainer" >
<!---
<com:FActivePanelReceiver ID="pagerContainer" ListenOn="OnPageSizeChanged" TagName="div" cssClass="pageControlContainer">
                                                <span class="buttonPageStart" style="background-image:url(images/arrowPagesStartInactive.jpg)">první</span>
						<span class="buttonPagePrev" style="background-image:url(images/arrowPagesPrevInactive.jpg)">předchozí</span>
						<span class="pageLinkActual">1</span>
						<a href="#" class="pageLink">2</a>
						<a href="#" class="pageLink">3</a>
						<a href="#" class="pageLink">4</a>
						<a href="#" class="pageLink">5</a>
						<a href="#" class="pageLink">6</a>
						<a href="#" class="buttonPageNext">následující</a>
						<a href="#" class="buttonPageLast">poslední</a>
OnCallback="pageChanged" OnPageIndexChanged="pageChanged"
--->
<com:FActivePager ID="Pager" ListenOn="OnOrderChanged,OnPageSizeChanged" ControlToPaginate="Repeater" Mode="Numeric"  OnPageIndexChanged="pageChanged"  OnCallback="renderPageChanged" cssClass="pager" />

<com:FActivePager ID="PagerNP" ListenOn="OnOrderChanged,OnPageSizeChanged" ControlToPaginate="Repeater" Mode="NextPrev"  OnPageIndexChanged="pageChanged"  OnCallback="renderPageChanged" cssClass="pagerNP" FirstPageText="první" LastPageText="poslední" PrevPageText="předcházející" NextPageText="další"/>
</div>


<!---
</com:FActivePanelReceiver>

<div class="orderingContainer">
	<div class="orderingText">Řadit podle:</div>
   	<div class="orderingText">Ceny </div><com:TActiveLinkButton ID="SortPriceUp" cssClass="arrowUp" OnClick="orderButtonClicked" OnCallback="orderButtonClicked" CommandName="price" CommandParameter="ASC" /> <com:TActiveLinkButton ID="SortPriceDown" cssClass="arrowDown" OnClick="orderButtonClicked" OnCallback="orderButtonClicked" CommandName="price" CommandParameter="DESC"/>
   	<div class="orderingText">Názvu </div><com:TActiveLinkButton ID="SortNameUp" cssClass="arrowUp" OnClick="orderButtonClicked" OnCallback="orderButtonClicked" CommandName="name" CommandParameter="ASC" /> <com:TActiveLinkButton ID="SortNameDown" cssClass="arrowDown" OnClick="orderButtonClicked" OnCallback="orderButtonClicked" CommandName="name" CommandParameter="DESC"/>   
</div>
   	<div class="orderingText">Ceny </div><com:TLinkButton ID="SortPriceUp" Text="" cssClass="arrowUp" OnCommand="orderButtonClicked" CommandName="price" CommandParameter="DESC" /> <com:TLinkButton ID="SortPriceDown" cssClass="arrowDown" Text="" OnCommand="orderButtonClicked" CommandName="price" CommandParameter="ASC"/>
   	<div class="orderingText">Názvu </div><com:TLinkButton ID="SortNameUp" Text="" cssClass="arrowUp" OnCommand="orderButtonClicked" CommandName="name" CommandParameter="ASC" /> <com:TLinkButton ID="SortNameDown" cssClass="arrowDown" Text="" OnCommand="orderButtonClicked" CommandName="name" CommandParameter="DESC"/>   
</div>
--->
<com:FActivePanelReceiver ID="cardsContainer" ListenOn="OnOrderChanged,OnPageSizeChanged" TagName="div">

<com:TRepeater ID="Repeater"  EnableViewState="true">
	<prop:ItemTemplate>

        <!-- zacatek prod card -->
        <div class="productCardContanier">

            <div class="cardTop">
                <a href="<%# $this->TemplateControl->getEshopDetailLink($this->Data) %>"><img src="<%# $this->Data->firstImageAsThumb175x175 %>" /></a>
            </div>
            <div class="cardBottom">
                <h2><a href="<%# $this->TemplateControl->getEshopDetailLink($this->Data) %>" ><%# $this->Data->name %></a></h2>
                <p>Kód: <%# $this->Data->sku %></p>

                <span class="price"><%# $this->Data->priceWithVat %></span> <span class="black">Kč</span>


				<div class="cardAvailability"><strong>Dostupnost:</strong> <%# $this->Data->Availability %></div>

				
			<!--	<a href=" class="detailLink"><%[ Zobraz detail produktu ]%></a> -->

			<a class="detailLink" href="<%# $this->TemplateControl->getEshopDetailLink($this->Data) %>"><span>Zobraz detail produktu</span></a>




<!--                <table border="0">
                <tr>
                  <td><input type="text" class="textBox basketAmount" value="1" /> &nbsp;ks</td>
                  <td>&nbsp;<img src="themes/Base/images/arrowRight.png" /></td>
                  <td>&nbsp;<com:TActiveButton
                                      OnCommand="SourceTemplateControl.insertToCartClicked"
                                      CommandParameter="<%# $this->Data->uid %>"
                                      cssClass="buttonBasket"
                                      Text="" CustomData="" /></td>
                </tr>
                </table>
-->				
				
				
				
            </div>
        </div>
        <!-- konec prod card -->

        </prop:ItemTemplate>
</com:TRepeater>

<com:XGlobalCallbackOptions>
	<prop:ClientSide.OnLoading>
		$('loadingIcon').show();
	</prop:ClientSide.OnLoading>
	<prop:ClientSide.OnComplete>
		$('loadingIcon').hide();
//                jQuery.uniform.update();
	</prop:ClientSide.OnComplete>
</com:XGlobalCallbackOptions>

</com:FActivePanelReceiver>
<!--</div>-->
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
        name: Page size
    showsortingpanel:
        name:  Show sorting panel
        xtype: xcheckbox
</com:FWidgetControl>	
              <!--- 
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
			store: "@Ext.StoreMgr.lookup('containers-store')"
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

			  <a href="<%# $this->TemplateControl->getEshopDetailLink($this->Data->uid) %>" class="cardEshopLink">koupit v e-shopu</a> 
              <a href="<%= $this->Page->getContainer(59)->Href %>" class="cardEshopLinkInsert">koupit v e-shopu</a> CommandParameter="<%# $this->Parent->Data->Key %>" 
<com:TButton cssClass="buttDetails" OnClick="Parent.TemplateControl.detailClicked" />
			  --->
