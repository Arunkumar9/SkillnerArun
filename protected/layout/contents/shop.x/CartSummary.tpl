<com:TDataGrid ID="CartSummaryGrid" ShowFooter="true" cssClass="<%= $this->getCssClass() %>" AutoGenerateColumns="false"  >
	<prop:FooterStyle cssClass="summaryPriceTax2" />
<!---
	<com:XActiveTemplateColumn HeaderText="Kurz" >
			<prop:ItemTemplate>
				
				<%# $this->Parent->Data->ClassName.' '.$this->Parent->Data->DateInterval.' '.$this->Parent->Data->TimeInterval %>
				<com:TControl Visible="<%# $this->Parent->Data->ProductType = CartItem::CERTIFICATE %>">
				<br/> jméno na certifikátu: <%# $this->Parent->Data->CertificateName %>
				</com:TControl Visible="">

			</prop:ItemTemplate>
	</com:XActiveTemplateColumn >	

--->
	<com:TBoundColumn DataField="ProductName" HeaderText="<%[ Produkt ]%>" 
					  ItemStyle.cssClass="firstCol" FooterStyle.cssClass="firstCol" HeaderStyle.cssClass="firstCol" >
					<prop:FooterText><%[ Celkem ]%></prop:FooterText>
	</com:TBoundColumn>

	<com:TBoundColumn DataField="Count" HeaderText="<%[ Počet ]%>" />
	<com:TBoundColumn DataField="TotalPriceCurrency" HeaderText="<%[ Cena ]%>" />
</com:TDataGrid>