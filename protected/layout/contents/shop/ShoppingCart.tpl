<com:TControl Visible="<%= $this->getIsCartEmpty() %>" >
    <div class="contentOfset"><div class="icoWarn"></div>Váš košík je prázdný.	</div>
</com:TControl>	
<com:TControl Visible="<%= !$this->getIsCartEmpty() %>" >
	<com:XActiveDataGrid ID="CartGrid" cssClass="basketSummaryTable" AutoGenerateColumns="false"
						 ShowFooter="true" OnItemCommand="termDeleteButtonClicked" 
						 FooterStyle.cssClass="basketSummaryLine"
						 >
		<com:XActiveHyperLinkColumn DataTextField="ProductName" DataNavigateUrlField="ProductUrl"
                                            HeaderText="<%[ Produkt ]%>"
								ItemStyle.cssClass="firstCol"
								FooterStyle.cssClass="firstCol" 
								HeaderStyle.cssClass="firstCol">
				<prop:FooterText>Celkem s DPH</prop:FooterText>
		</com:XActiveHyperLinkColumn>
		<com:XActiveTemplateColumn HeaderText="<%[ Varianty ]%>"
								ItemStyle.cssClass="firstCol"
								FooterStyle.cssClass="firstCol"
								HeaderStyle.cssClass="firstCol">
                    <prop:ItemTemplate>
                        <%# $this->TemplateControl->getVariantsList($this->Parent->Data) %>
                    </prop:ItemTemplate>
                </com:XActiveTemplateColumn>
		<com:XActiveBoundColumn DataField="PriceCurrency" HeaderText="<%[ Cena za ks ]%>"
								ItemStyle.cssClass="firstCol"
								FooterStyle.cssClass="firstCol"
								HeaderStyle.cssClass="firstCol">
		</com:XActiveBoundColumn>
		<com:XActiveTemplateColumn HeaderText="<%[ Množství ]%>" >
			<prop:ItemTemplate>
			<com:TActiveTextBox Text="<%# $this->Parent->Data->Count %>" ActiveControl.CallbackParameter="<%# $this->Parent->Data->Key %>" onCallback="Parent.TemplateControl.numberChanged" cssClass="inputPocet" Attributes.Size="2" AutoPostBack="true"/>
			</prop:ItemTemplate>
		</com:XActiveTemplateColumn >
		<com:XActiveBoundColumn  DataField="TotalPriceCurrency" HeaderText="<%[ Cena s DPH ]%>"  />
		<com:XActiveButtonColumn HeaderText="" CommandName="termDelete" ButtonType="PushButton" 
								 ItemStyle.cssClass="buttonDel"
								 FooterStyle.cssClass="noBorder" 
								 HeaderStyle.cssClass="noBorder"
								 />
	
	</com:XActiveDataGrid>
	<br/>
<!---	<div class="cellCentered">
<com:TActiveButton cssClass="buttZpet" OnClick="backClicked" OnCallback="backClicked" 
				   Text="<%[ Vymazat obsah košíku ]%>"
				   CausesValidation="false"  />

	    <com:TActiveButton cssClass="buttZpet" OnClick="backClicked" OnCallback="backClicked" 
						   CausesValidation="false" Visible="<%= isset($this->Request['catid']) %>" />
		

	    <com:TButton cssClass="buttVybratKurz" OnClick="chooseClassClicked" 
						   CausesValidation="false" Visible="<%= !isset($this->Request['catid']) %>" />
<com:THyperLink cssClass="buttZpet"  Text="<%[ Zpět nakupovat ]%>" NavigateUrl="<%= $this->Page->getContainer(59)->Href %>"  />

	<com:THyperLink cssClass="buttZpet"  NavigateUrl="<%= $this->Page->getContainer(59)->Href %>"  />
		<com:TActiveButton cssClass="buttObjednat" OnClick="sendOrderClicked" OnCallback="sendOrderClicked" />
	</div>--->

<div class="buttonsTable">
<com:TButton cssClass="buttonEmptyCart" OnClick="emptyCartClicked"
				   Text="<%[ Vysypat obsah košíku ]%>"
				   CausesValidation="false"  />
&nbsp;&nbsp;				   
<com:TActiveButton cssClass="buttonNextStep" OnClick="sendOrderClicked" OnCallback="sendOrderClicked"
				   Text="<%[ Zadat dodací údaje ]%>" />
	
</div>

</com:TControl>	