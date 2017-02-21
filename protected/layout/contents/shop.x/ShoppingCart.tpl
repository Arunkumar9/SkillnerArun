<com:TControl Visible="<%= $this->getIsCartEmpty() %>" >
	Váš košík je prázdný.	
</com:TControl>	
<com:TControl Visible="<%= !$this->getIsCartEmpty() %>" >
	<com:XActiveDataGrid ID="CartGrid" cssClass="basketTable" AutoGenerateColumns="false" 
						 ShowFooter="true" OnItemCommand="termDeleteButtonClicked" 
						 FooterStyle.cssClass="summaryPriceTax"
						 >
		<com:XActiveBoundColumn DataField="ProductName" HeaderText="<%[ Produkt ]%>"  
								ItemStyle.cssClass="firstCol"
								FooterStyle.cssClass="firstCol" 
								HeaderStyle.cssClass="firstCol">
				<prop:FooterText>Celkem</prop:FooterText>
		</com:XActiveBoundColumn>
		<com:XActiveTemplateColumn HeaderText="<%[ Množství ]%>" >
			<prop:ItemTemplate>
			<com:TActiveTextBox Text="<%# $this->Parent->Data->Count %>" ActiveControl.CallbackParameter="<%# $this->Parent->Data->Key %>" onCallback="Parent.TemplateControl.numberChanged" cssClass="inputPocet" Attributes.Size="2" AutoPostBack="true"/>
			</prop:ItemTemplate>
		</com:XActiveTemplateColumn >
		<com:XActiveBoundColumn  DataField="TotalPriceCurrency" HeaderText="<%[ Cena ]%>"  />
		<com:XActiveButtonColumn HeaderText="" CommandName="termDelete" ButtonType="PushButton" 
								 ItemStyle.cssClass="cellDeleteItem" 
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
<com:TButton cssClass="buttZpet" OnClick="backClicked" 
				   Text="<%[ Zpět nakupovat ]%>"
				   CausesValidation="false"  />
&nbsp;&nbsp;				   
<com:TActiveButton cssClass="buttObjednat" OnClick="sendOrderClicked" OnCallback="sendOrderClicked" 
				   Text="<%[ Objednat zboží z košíku ]%>" />				   
	
</com:TControl>	
