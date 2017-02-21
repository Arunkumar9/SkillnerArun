	<h3><%[ Způsob dopravy a platby ]%></h3>
	
    <div class="infoBox">
	<com:TRadioButtonList ID="PaymentRadio" RepeatLayout="Flow" DataValueField="uid" DataTextField="NameWithPrice"
											RepeatColumns="1" ValidationGroup="PersonalData"
											RepeatDirection="Vertical" />
	<com:TListControlValidator              ControlToValidate="PaymentRadio"
							                MinSelection="1" MaxSelection="1"
											EnableClientScript="false"
											Text="<%[ Zvolte způsob platby a dopravy ]%>"
											ValidationGroup="PersonalData"
											ErrorMessage="" 
							cssClass="errorNote"
							ControlCssClass="errorField" />

	</div>

 
 	<br/>
 

	<h3><%[ Dodací adresa ]%></h3>
	<table class="<%= $this->getCssClass() %>">
		<tr>
			<th><%[ Jméno a příjmení ]%></th>
			<td><com:TTextBox Attributes.Size="30" ID="CustomerName" cssClass="textBox" Text="<%= $this->Cart->Address->CustomerName %>" />
			<com:TRequiredFieldValidator 
	    					ControlToValidate="CustomerName"
	    					Text="<%[ Zadejte jméno ]%>"
							EnableClientScript="false"
	    					ErrorMessage="" 
							cssClass="errorNote"
							ControlCssClass="errorField"
							ValidationGroup="PersonalData" 
	                        Display="Fixed" />
			</td>
		</tr>

		<tr>
			<th><%[ Firma ]%></th>
			<td><com:TTextBox Attributes.Size="30" ID="CompanyName" cssClass="textBox" Text="<%= $this->Cart->Address->CompanyName %>" /></td>
		</tr>

		<tr>
			<th><%[ IČ ]%></th>
			<td><com:TTextBox Attributes.Size="30" ID="IC" cssClass="textBox" Text="<%= $this->Cart->Address->IC %>" /></td>
		</tr>

		<tr>
			<th><%[ DIČ ]%></th>
			<td><com:TTextBox Attributes.Size="30" ID="DIC" cssClass="textBox" Text="<%= $this->Cart->Address->DIC %>" /></td>
		</tr>
		<tr>
			<th><%[ Ulice ]%></th>
			<td><com:TTextBox Columns="30" ID="Street" cssClass="textBox" Text="<%= $this->Cart->Address->Street %>" />
			<com:TRequiredFieldValidator 
	    					ControlToValidate="Street"
	    					Text="Zadejte ulici"
							EnableClientScript="false"
	    					ErrorMessage="" 
							cssClass="errorNote"
							ControlCssClass="errorField" 
							ValidationGroup="PersonalData" 
	                        Display="Fixed" />
			</td>
		</tr>								
		
		<tr>
			<th><%[ Číslo popisné ]%></th>
			<td><com:TTextBox Columns="5" ID="StreetNumber" cssClass="textBox" Text="<%= $this->Cart->Address->StreetNumber %>" /></td>
		</tr>
		
		<tr>
			<th><%[ Obec ]%></th>
			<td><com:TTextBox Columns="30" ID="City" cssClass="textBox" Text="<%= $this->Cart->Address->City %>" />
			<com:TRequiredFieldValidator 
	    					ControlToValidate="City"
	    					Text="<%[ Zadejte obec ]%>"
							EnableClientScript="false"
	    					ErrorMessage="" 
							cssClass="errorNote"
							ControlCssClass="errorField" 
							ValidationGroup="PersonalData" 
	                        Display="Fixed" />
			</td>
		</tr>								

		<tr>
			<th><%[ PSČ ]%></th>
			<td><com:TTextBox Columns="5" ID="Zip" cssClass="textBox" Text="<%= $this->Cart->Address->Zip %>" />
			<com:TRequiredFieldValidator 
	    					ControlToValidate="Zip"
	    					Text="<%[ Zadejte PSČ ]%>"
							EnableClientScript="false"
	    					ErrorMessage="" 
							cssClass="errorNote"
							ControlCssClass="errorField" 
							ValidationGroup="PersonalData" 
	                        Display="Fixed" />
			</td>
		</tr>								
		<tr>
			<th>&nbsp;</th>
			<td></td>
		</tr>
		<tr>
			<th><%[ Telefon ]%></th>
			<td><com:TTextBox Columns="30" ID="Phone" cssClass="textBox" Text="<%= $this->Cart->Address->Phone %>"/>
			<com:TRequiredFieldValidator 
	    					ControlToValidate="Phone"
	    					Text="<%[ Zadejte telefon ]%>"
							EnableClientScript="false"
	    					ErrorMessage="" 
							cssClass="errorNote"
							ControlCssClass="errorField" 
							ValidationGroup="PersonalData" 
	                        Display="Fixed" />
			</td>
		</tr>
		
		<tr>
			<th><%[ Email ]%></th>
			<td><com:TTextBox Columns="30" ID="Email" cssClass="textBox" Text="<%= $this->Cart->Address->Email %>"  />
			<com:TRequiredFieldValidator 
	    					ControlToValidate="Email"
	    					Text="<%[ Zadejte email ]%>"
							EnableClientScript="false"
	    					ErrorMessage="" 
							cssClass="errorNote"
							ControlCssClass="errorField" 
							ValidationGroup="PersonalData" 
	                        Display="Fixed" />
			<com:TEmailAddressValidator 
	    					ControlToValidate="Email"
	    					Text="<%[ Nesprávně zadaný email ]%>"
							EnableClientScript="false"
	    					ErrorMessage="" 
							cssClass="errorNote"
							ControlCssClass="errorField"
							CheckMXRecord="false"
							ValidationGroup="PersonalData" 
	                        Display="Fixed" />
			</td>
		</tr>																		
		<tr>
			<th><%[ Poznámka ]%></th>
			<td><com:TTextBox TextMode="MultiLine" ID="Comment" Rows="3" Text="<%= $this->Cart->Address->Comment %>"/></td>
		</tr>									
		
										
	</table>
	<br/>

	<h3><%[ Fakturační adresa (pouze je-li jiná než dodací) ]%></h3>
	<table class="<%= $this->getCssClass() %>">
		<tr>
			<th><%[ Jméno a příjmení ]%></th>
			<td><com:TTextBox Attributes.Size="30" ID="BillingCustomerName" cssClass="textBox" Text="<%= $this->Cart->BillingAddress->CustomerName %>" /></td>
		</tr>


		<tr>
			<th><%[ Firma ]%></th>
			<td><com:TTextBox Attributes.Size="30" ID="BillingCompanyName" cssClass="textBox" Text="<%= $this->Cart->BillingAddress->CompanyName %>" /></td>
		</tr>

		<tr>
			<th><%[ IČ ]%></th>
			<td><com:TTextBox Attributes.Size="30" ID="BillingIC" cssClass="textBox" Text="<%= $this->Cart->BillingAddress->IC %>" /></td>
		</tr>

		<tr>
			<th><%[ DIČ ]%></th>
			<td><com:TTextBox Attributes.Size="30" ID="BillingDIC" cssClass="textBox" Text="<%= $this->Cart->BillingAddress->DIC %>" /></td>
		</tr>
		<tr>
			<th><%[ Ulice ]%></th>
			<td><com:TTextBox Columns="30" ID="BillingStreet" cssClass="textBox" Text="<%= $this->Cart->BillingAddress->Street %>" /></td>
		</tr>								
		
		<tr>
			<th><%[ Číslo popisné ]%></th>
			<td><com:TTextBox Columns="5" ID="BillingStreetNumber" cssClass="textBox" Text="<%= $this->Cart->BillingAddress->StreetNumber %>" /></td>
		</tr>
		
		<tr>
			<th><%[ Obec ]%></th>
			<td><com:TTextBox Columns="30" ID="BillingCity" cssClass="textBox" Text="<%= $this->Cart->BillingAddress->City %>" /></td>
		</tr>								

		<tr>
			<th><%[ PSČ ]%></th>
			<td><com:TTextBox Columns="5" ID="BillingZip" cssClass="textBox" Text="<%= $this->Cart->BillingAddress->Zip %>" /></td>
		</tr>								
		<tr>
			<th>&nbsp;</th>
			<td></td>
		</tr>
		<tr>
			<th><%[ Telefon ]%></th>
			<td><com:TTextBox Columns="30" ID="BillingPhone" cssClass="textBox" Text="<%= $this->Cart->BillingAddress->Phone %>"/></td>
		</tr>
		
		<tr>
			<th><%[ Email ]%></th>
			<td><com:TTextBox Columns="30" ID="BillingEmail" cssClass="textBox" Text="<%= $this->Cart->BillingAddress->Email %>"  />
			<com:TEmailAddressValidator 
	    					ControlToValidate="BillingEmail"
	    					Text="<%[ Nesprávně zadaný email ]%>"
							EnableClientScript="false"
	    					ErrorMessage="" 
							cssClass="errorNote"
							ControlCssClass="errorField"
							CheckMXRecord="false"
							ValidationGroup="PersonalData" 
	                        Display="Fixed" />
			</td>
		</tr>																		
		<tr>
			<td colspan="2" >
				<com:TValidationSummary ID="Summary" cssClass="valError" HeaderText=""
										AutoUpdate="true"
										ValidationGroup="PersonalData" 
										EnableClientScript="false" />				
			</td>
		</tr>										
										
	</table>
	<br/>
    <div class="buttonsTable">    
	<com:TActiveButton cssClass="buttonBack"     Text="<%[ Zpět na košík ]%>"
											   OnClick="backClicked" OnCallback="backClicked" CausesValidation="false" />
	<com:TActiveButton cssClass="buttonNextStep" Text="<%[ Přejít na Přehled objednávky ]%>"					
											   ValidationGroup="PersonalData" 
											   OnCallback="sendPersonalDataClicked" />

	</div>
