<div class="objednavkaForm">							
	<table>


	
		<tr>
			<th>Oblast vzdělávání</th>
			<td><%= $this->Product->categories[0]->name %></td>
		</tr>
		<tr>
			<th>Kurz</th>
			<td><%= $this->Product->Name %></td>
		</tr>
<com:TControl Visible="<%= count($this->Product->terms)>0 %>">

		<tr>
			<th>Termín</th>
			<td>
				<com:TActiveDropDownList ID="TermCombo" DataTextField="DateAndTime" DataValueField="uid" 
										 PromptText="Zvolte termín" AutoPostBack="true" OnCallback="termComboChanged"
										 ValidationGroup="Cart" CausesValidation="true" />
				<com:TRequiredFieldValidator 
    					ControlToValidate="TermCombo"
    					Text="*"
    					ErrorMessage="Zvolte termín" 
                        ValidationGroup="Cart"
    					Display="Dynamic" />
			</td>
		</tr>
		
		<tr>
			<th>Počet osob</th>
			<td>
				<com:TActiveTextBox ID="NumberOfPersonsBox" Attributes.Size="3" Text="1" AutoPostBack="true" 
									ValidationGroup="Cart" OnCallback="termComboChanged"
									CausesValidation="true" />
				<com:TRequiredFieldValidator 
    					ControlToValidate="NumberOfPersonsBox"
    					Text="*"
    					ErrorMessage="Zvolte termín" 
                        ValidationGroup="Cart"
    					Display="Dynamic" />
				<com:TRangeValidator 
					ControlToValidate="NumberOfPersonsBox"
					Text="*"
					ErrorMessage="Zadejte počet osob." 
					MinValue="1"
					ValidationGroup="Cart"
					Display="Dynamic" />
			</td>
		</tr>																

<com:TConditional Condition="$this->IsCertificate" >
	<prop:TrueTemplate>
		<tr>
			<th>Certifikát pro:</th>
			<td>
				<com:TActiveTextBox ID="CertificateNameBox" Attributes.Size="20" Text="" 
									ValidationGroup="Cart"  />

		</tr>																
	</prop:TrueTemplate>
</com:TConditional>		
		<tr>
			<th>Cena</th>
			<td><com:TActiveLabel ID="TotalPriceBox" Text="<%= $this->TotalPrice %>"  /></td>
		</tr>								

</com:TControl>
<com:TControl Visible="<%= count($this->Product->terms)==0 %>">
		<tr><td>&nbsp;</td></tr>
		<tr><th>&nbsp;</th><td >Kurz nemá vypsaný <br/>žádný termín</td></tr>
</com:TControl>
		<tr><td>&nbsp;</td></tr>
											
		<tr>
<!---
			<td class="cellCentered"><com:TActiveButton cssClass="buttZpet" OnClick="backClicked" OnCallback="backClicked" /></td>

--->			<td colspan="2" class="cellCentered">
					<com:TActiveButton cssClass="buttDokosiku" ValidationGroup="Cart" OnClick="insertToCartClicked" OnCallback="insertToCartClicked" Visible="<%= count($this->Product->terms)>0 %>" />
				</td>
		</tr>										

		<tr><td>&nbsp;</td></tr>
		<tr><td>&nbsp;</td></tr>

		<tr>
			<td colspan="2" class="cellCentered">
				<com:TValidationSummary ID="Summary" cssClass="valError" HeaderText=""
										AutoUpdate="true"
										ValidationGroup="Cart" EnableClientScript="true" />				
			</td>
		</tr>										


	</table>


</div>							