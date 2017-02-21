<com:TDataGrid ID="CartGrid" ShowFooter="true" cssClass="<%= $this->getCssClass() %>" AutoGenerateColumns="false"  >
	<prop:FooterStyle cssClass="basketSummaryLine" />

	<com:TBoundColumn DataField="ProductName" HeaderText="<%[ Produkt ]%>" 
					  ItemStyle.cssClass="firstCol" FooterStyle.cssClass="firstCol" HeaderStyle.cssClass="firstCol" >
					<prop:FooterText><%[ Celkem s DPH ]%></prop:FooterText>
	</com:TBoundColumn>
		<com:XActiveTemplateColumn HeaderText="<%[ Varianty ]%>"
								ItemStyle.cssClass="firstCol"
								FooterStyle.cssClass="firstCol"
								HeaderStyle.cssClass="firstCol">
                    <prop:ItemTemplate>
                        <%# $this->TemplateControl->getVariantsList($this->Parent->Data) %>
                    </prop:ItemTemplate>
                </com:XActiveTemplateColumn>
	<com:TBoundColumn DataField="PriceCurrency" HeaderText="<%[ Cena/ks ]%>" />

	<com:TBoundColumn DataField="Count" HeaderText="<%[ Počet ]%>" />
	<com:TBoundColumn DataField="TotalPriceCurrency" HeaderText="<%[ Cena s DPH ]%>" />
</com:TDataGrid>