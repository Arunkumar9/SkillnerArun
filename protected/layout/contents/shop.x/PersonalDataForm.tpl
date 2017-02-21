	<h2><%[ Způsob dopravy a platby ]%></h2>
	<br/>
	<com:TRadioButtonList ID="PaymentRadio" RepeatLayout="Flow" DataValueField="uid" DataTextField="NameWithPrice"
											RepeatColumns="1" ValidationGroup="PersonalData"
											RepeatDirection="Vertical" />
	<com:TListControlValidator              ControlToValidate="PaymentRadio"
							                MinSelection="1" MaxSelection="1"
											EnableClientScript="false"
											Text=" "
											ValidationGroup="PersonalData"
											ErrorMessage="<%[ Zvolte způsob platby a dopravy ]%>" />
	<br/>
	<br/>
	<h2><%[ Fakturační údaje a dodací adresa ]%></h2>
	<table class="<%= $this->getCssClass() %>">
		<tr>
			<th><%[ Jméno a příjmení ]%></th>
			<td ><com:TTextBox Attributes.Size="30" ID="CustomerName" cssClass="textBox" Text="<%= $this->Cart->Address->CustomerName %>" />
			<com:TRequiredFieldValidator 
	    					ControlToValidate="CustomerName"
	    					Text="*"
							EnableClientScript="false"
	    					ErrorMessage="<%[ Zadejte jméno ]%>" 
							ValidationGroup="PersonalData" 
	                        Display="Fixed" />
			</td>
		</tr>


		<tr>
			<th><%[ Ulice ]%></th>
			<td ><com:TTextBox Columns="30" ID="Street" cssClass="textBox" Text="<%= $this->Cart->Address->Street %>" />
			<com:TRequiredFieldValidator 
	    					ControlToValidate="Street"
	    					Text="*"
							EnableClientScript="false"
	    					ErrorMessage="Zadejte ulici" 
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
	    					Text="*"
							EnableClientScript="false"
	    					ErrorMessage="<%[ Zadejte obec ]%>" 
							ValidationGroup="PersonalData" 
	                        Display="Fixed" />
			</td>
		</tr>								

		<tr>
			<th><%[ PSČ ]%></th>
			<td><com:TTextBox Columns="5" ID="Zip" cssClass="textBox" Text="<%= $this->Cart->Address->Zip %>" />
			<com:TRequiredFieldValidator 
	    					ControlToValidate="Zip"
	    					Text="*"
							EnableClientScript="false"
	    					ErrorMessage="<%[ Zadejte PSČ ]%>" 
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
	    					Text="*"
							EnableClientScript="false"
	    					ErrorMessage="<%[ Zadejte telefon ]%>" 
							ValidationGroup="PersonalData" 
	                        Display="Fixed" />
			</td>
		</tr>
		
		<tr>
			<th><%[ Email ]%></th>
			<td><com:TTextBox Columns="30" ID="Email" cssClass="textBox" Text="<%= $this->Cart->Address->Email %>"  />
			<com:TRequiredFieldValidator 
	    					ControlToValidate="Email"
	    					Text="*"
							EnableClientScript="false"
	    					ErrorMessage="<%[ Zadejte email ]%>" 
							ValidationGroup="PersonalData" 
	                        Display="Fixed" />
			<com:TEmailAddressValidator 
	    					ControlToValidate="Email"
	    					Text="*"
							EnableClientScript="false"
	    					ErrorMessage="<%[ Nesprávně zadaný email ]%>"
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
	<com:TActiveButton cssClass="buttZpet"     Text="<%[ O krok zpět ]%>"
											   OnClick="backClicked" OnCallback="backClicked" CausesValidation="false" />
	<com:TActiveButton cssClass="buttObjednat" Text="<%[ Zkontrolovat zadané údaje ]%>"					
											   ValidationGroup="PersonalData" 
											   OnCallback="sendPersonalDataClicked" />

