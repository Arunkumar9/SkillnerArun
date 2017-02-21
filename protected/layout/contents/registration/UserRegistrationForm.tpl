<div class='regForms'>
	<com:TControl Visible='<%= $this->User->IsGuest %>'>
		<h1><%[ Registrace nového uživatele ]%></h1>
		<h3><%[ Zadejte, prosím, všechny povinné údaje. ]%></h3>
	</com:TControl>
	<com:TControl Visible='<%= !$this->User->IsGuest %>'>
		<h1><%[ Můj účet ]%></h1>
	</com:TControl>
	<h2><%[ Osobní údaje uživatele ]%></h2>
	<table class='standardForm'> 
		<com:TControl Visible='<%= !$this->User->IsGuest %>'>
			<tr>
				<th><%[ Uživatelské jméno ]%></th>
				<td><%= $this->User->Username %></td>
			</tr>
			<tr>
				<td><%[ &nbsp; ]%></td>
			</tr>
		</com:TControl>
		<tr>
			<th><%[ Jméno a příjmení ]%></th>
			<td>
				<com:TTextBox id='CustomerName' cssClass='textBox'>
					<prop:Columns>30</prop:Columns>
					<prop:Text><%= $this->CustomerName->SafeText %></prop:Text>
				</com:TTextBox>
				<com:TRequiredFieldValidator>
					<prop:ControlToValidate>CustomerName</prop:ControlToValidate>
					<prop:ErrorMessage></prop:ErrorMessage>
					<prop:cssClass>errorNote</prop:cssClass>
					<prop:ControlCssClass>errorField</prop:ControlCssClass>
					<prop:EnableClientScript>true</prop:EnableClientScript>
					<prop:Text><%[ Zadejte jméno ]%></prop:Text>
					<prop:ValidationGroup>RegistrationData</prop:ValidationGroup>
					<prop:Display>Fixed</prop:Display>
				</com:TRequiredFieldValidator>
			</td>
		</tr>
		<tr>
			<th><%[ Ulice ]%></th>
			<td>
				<com:TTextBox id='Street' cssClass='textBox'>
					<prop:Columns>30</prop:Columns>
					<prop:Text><%= $this->Street->SafeText %></prop:Text>
				</com:TTextBox>
				<com:TRequiredFieldValidator>
					<prop:ControlToValidate>Street</prop:ControlToValidate>
					<prop:Text><%[ Zadejte ulici ]%></prop:Text>
					<prop:ErrorMessage></prop:ErrorMessage>
					<prop:cssClass>errorNote</prop:cssClass>
					<prop:ControlCssClass>errorField</prop:ControlCssClass>
					<prop:EnableClientScript>true</prop:EnableClientScript>
					<prop:ValidationGroup>RegistrationData</prop:ValidationGroup>
					<prop:Display>Fixed</prop:Display>
				</com:TRequiredFieldValidator>
			</td>
		</tr>
		<tr>
			<th><%[ Číslo popisné ]%></th>
			<td>
				<com:TTextBox id='StreetNumber' cssClass='textBox'>
					<prop:Columns>05</prop:Columns>
					<prop:Text><%= $this->StreetNumber->SafeText %></prop:Text>
				</com:TTextBox>
			</td>
		</tr>
		<tr>
			<th><%[ Obec ]%></th>
			<td>
				<com:TTextBox id='City' cssClass='textBox'>
					<prop:Columns>30</prop:Columns>
					<prop:Text><%= $this->City->SafeText %></prop:Text>
				</com:TTextBox>
				<com:TRequiredFieldValidator>
					<prop:ControlToValidate>City</prop:ControlToValidate>
					<prop:Text><%[ Zadejte obec ]%></prop:Text>
					<prop:ErrorMessage></prop:ErrorMessage>
					<prop:cssClass>errorNote</prop:cssClass>
					<prop:ControlCssClass>errorField</prop:ControlCssClass>
					<prop:EnableClientScript>true</prop:EnableClientScript>
					<prop:ValidationGroup>RegistrationData</prop:ValidationGroup>
					<prop:Display>Fixed</prop:Display>
				</com:TRequiredFieldValidator>
			</td>
		</tr>
		<tr>
			<th><%[ PSČ ]%></th>
			<td>
				<com:TTextBox id='Zip' cssClass='textBox'>
					<prop:Columns>05</prop:Columns>
					<prop:Text><%= $this->Zip->SafeText %></prop:Text>
				</com:TTextBox>
				<com:TRequiredFieldValidator>
					<prop:ControlToValidate>Zip</prop:ControlToValidate>
					<prop:Text><%[ Zadejte PSČ ]%></prop:Text>
					<prop:ErrorMessage></prop:ErrorMessage>
					<prop:cssClass>errorNote</prop:cssClass>
					<prop:ControlCssClass>errorField</prop:ControlCssClass>
					<prop:EnableClientScript>true</prop:EnableClientScript>
					<prop:ValidationGroup>RegistrationData</prop:ValidationGroup>
					<prop:Display>Fixed</prop:Display>
				</com:TRequiredFieldValidator>
			</td>
		</tr>
		<tr>
			<th>&nbsp;</th>
			<td>&nbsp;</td>
		</tr>
		<tr>
			<th><%[ Telefon ]%></th>
			<td>
				<com:TTextBox id='Phone' cssClass='textBox'>
					<prop:Columns>30</prop:Columns>
					<prop:Text><%= $this->Phone->SafeText %></prop:Text>
				</com:TTextBox>
				<com:TRequiredFieldValidator>
					<prop:ControlToValidate>Phone</prop:ControlToValidate>
					<prop:Text><%[ Zadejte telefon ]%></prop:Text>
					<prop:ErrorMessage></prop:ErrorMessage>
					<prop:cssClass>errorNote</prop:cssClass>
					<prop:ControlCssClass>errorField</prop:ControlCssClass>
					<prop:EnableClientScript>true</prop:EnableClientScript>
					<prop:ValidationGroup>RegistrationData</prop:ValidationGroup>
					<prop:Display>Fixed</prop:Display>
				</com:TRequiredFieldValidator>
			</td>
		</tr>
		<tr>
			<th><%[ Email ]%></th>
			<td>
				<com:TTextBox id='Email' cssClass='textBox'>
					<prop:Columns>30</prop:Columns>
					<prop:Text><%= $this->Email->SafeText %></prop:Text>
				</com:TTextBox>
				<com:TRequiredFieldValidator>
					<prop:ControlToValidate>Email</prop:ControlToValidate>
					<prop:Text><%[ Zadejte email ]%></prop:Text>
					<prop:ErrorMessage></prop:ErrorMessage>
					<prop:cssClass>errorNote</prop:cssClass>
					<prop:ControlCssClass>errorField</prop:ControlCssClass>
					<prop:EnableClientScript>true</prop:EnableClientScript>
					<prop:ValidationGroup>RegistrationData</prop:ValidationGroup>
					<prop:Display>Fixed</prop:Display>
				</com:TRequiredFieldValidator>
				<com:TCustomValidator>
					<prop:ControlToValidate>Username</prop:ControlToValidate>
					<prop:Text><%[ Takový email již existuje ]%></prop:Text>
					<prop:ErrorMessage></prop:ErrorMessage>
					<prop:cssClass>errorNote</prop:cssClass>
					<prop:ControlCssClass>errorField</prop:ControlCssClass>
					<prop:EnableClientScript>true</prop:EnableClientScript>
					<prop:ValidationGroup>RegistrationData</prop:ValidationGroup>
					<prop:Display>Fixed</prop:Display>
					<prop:OnServerValidate>checkEmail</prop:OnServerValidate>
				</com:TCustomValidator>
				<com:TEmailAddressValidator>
					<prop:ControlToValidate>Email</prop:ControlToValidate>
					<prop:Text><%[ Nesprávně zadaný email ]%></prop:Text>
					<prop:ErrorMessage></prop:ErrorMessage>
					<prop:cssClass>errorNote</prop:cssClass>
					<prop:ControlCssClass>errorField</prop:ControlCssClass>
					<prop:EnableClientScript>true</prop:EnableClientScript>
					<prop:ValidationGroup>RegistrationData</prop:ValidationGroup>
					<prop:Display>Fixed</prop:Display>
					<prop:CheckMXRecord>false</prop:CheckMXRecord>
				</com:TEmailAddressValidator>
			</td>
		</tr>
	</table>

	<h2><%[ Fakturační údaje (pouze pokud se liší od osobních údajů) ]%></h2>
	<com:TActiveCheckBox id='BillingAddressDifferent' CssClass="checkBox">
		<prop:Text><%[ liší se od osobních údajů ]%></prop:Text>
		<prop:OnCheckedChanged>billingAddressDifferentClicked</prop:OnCheckedChanged>
		<prop:OnCallback>billingAddressDifferentClicked</prop:OnCallback>
		<prop:CausesValidation>false</prop:CausesValidation>
		<prop:AutoPostBack>true</prop:AutoPostBack>
		<prop:Visible>true</prop:Visible>
	</com:TActiveCheckBox>
	<com:FActivePanelReceiver id='BillingAddressReceiver'>
		<prop:ListenOn>OnBillingAddressVisible</prop:ListenOn>
		<com:TPanel id='BillingAddressForm' Visible='false'>
			<table class='standardForm'>
				<tr>
					<th><%[ Jméno a příjmení ]%></th>
					<td>
						<com:TTextBox id='BillingCustomerName' cssClass='textBox'>
							<prop:Columns>30</prop:Columns>
							<prop:Text><%= $this->BillingCustomerName->SafeText %></prop:Text>
						</com:TTextBox>
						<com:FRequiredConfirmValidator>
							<prop:ControlToValidate>BillingCustomerName</prop:ControlToValidate>
							<prop:ControlToConfirm>BillingAddressDifferent</prop:ControlToConfirm>
							<prop:ErrorMessage></prop:ErrorMessage>
					<prop:cssClass>errorNote</prop:cssClass>
					<prop:ControlCssClass>errorField</prop:ControlCssClass>
							<prop:EnableClientScript>true</prop:EnableClientScript>
							<prop:Text><%[ Zadejte jméno ]%></prop:Text>
							<prop:ValidationGroup>RegistrationData</prop:ValidationGroup>
							<prop:Display>Fixed</prop:Display>
						</com:FRequiredConfirmValidator>
					</td>
				</tr>
				<tr>
					<th><%[ Firma ]%></th>
					<td>
						<com:TTextBox id='BillingCompanyName' cssClass='textBox'>
							<prop:Columns>30</prop:Columns>
							<prop:Text><%= $this->BillingCompanyName->SafeText %></prop:Text>
						</com:TTextBox>
					</td>
				</tr>
				<tr>
					<th><%[ IČ ]%></th>
					<td>
						<com:TTextBox id='BillingIC' cssClass='textBox'>
							<prop:Columns>30</prop:Columns>
							<prop:Text><%= $this->BillingIC->SafeText %></prop:Text>
						</com:TTextBox>
						<com:FRequiredConfirmValidator>
							<prop:ControlToValidate>BillingIC</prop:ControlToValidate>
							<prop:ControlToConfirm>BillingCompanyName.SafeText</prop:ControlToConfirm>
							<prop:Text><%[ Zadejte IČ ]%></prop:Text>
							<prop:ErrorMessage></prop:ErrorMessage>
					<prop:cssClass>errorNote</prop:cssClass>
					<prop:ControlCssClass>errorField</prop:ControlCssClass>
							<prop:EnableClientScript>true</prop:EnableClientScript>
							<prop:ValidationGroup>RegistrationData</prop:ValidationGroup>
							<prop:Display>Fixed</prop:Display>
						</com:FRequiredConfirmValidator>
					</td>
				</tr>
				<tr>
					<th><%[ DIČ ]%></th>
					<td>
						<com:TTextBox id='BillingDIC' cssClass='textBox'>
							<prop:Columns>30</prop:Columns>
							<prop:Text><%= $this->BillingDIC->SafeText %></prop:Text>
						</com:TTextBox>
					</td>
				</tr>
				<tr>
					<th><%[ Ulice ]%></th>
					<td>
						<com:TTextBox id='BillingStreet' cssClass='textBox'>
							<prop:Columns>30</prop:Columns>
							<prop:Text><%= $this->BillingStreet->SafeText %></prop:Text>
						</com:TTextBox>
						<com:FRequiredConfirmValidator>
							<prop:ControlToValidate>BillingStreet</prop:ControlToValidate>
							<prop:ControlToConfirm>BillingAddressDifferent</prop:ControlToConfirm>
							<prop:Text><%[ Zadejte ulici ]%></prop:Text>
							<prop:ErrorMessage></prop:ErrorMessage>
					<prop:cssClass>errorNote</prop:cssClass>
					<prop:ControlCssClass>errorField</prop:ControlCssClass>
							<prop:EnableClientScript>true</prop:EnableClientScript>
							<prop:ValidationGroup>RegistrationData</prop:ValidationGroup>
							<prop:Display>Fixed</prop:Display>
						</com:FRequiredConfirmValidator>
					</td>
				</tr>
				<tr>
					<th><%[ Číslo popisné ]%></th>
					<td>
						<com:TTextBox id='BillingStreetNumber' cssClass='textBox'>
							<prop:Columns>5</prop:Columns>
							<prop:Text><%= $this->BillingStreetNumber->SafeText %></prop:Text>
						</com:TTextBox>
					</td>
				</tr>
				<tr>
					<th><%[ Obec ]%></th>
					<td>
						<com:TTextBox id='BillingCity' cssClass='textBox'>
							<prop:Columns>30</prop:Columns>
							<prop:Text><%= $this->BillingCity->SafeText %></prop:Text>
						</com:TTextBox>
						<com:FRequiredConfirmValidator>
							<prop:ControlToValidate>BillingCity</prop:ControlToValidate>
							<prop:ControlToConfirm>BillingAddressDifferent</prop:ControlToConfirm>
							<prop:Text><%[ Zadejte obec ]%></prop:Text>
							<prop:ErrorMessage></prop:ErrorMessage>
					<prop:cssClass>errorNote</prop:cssClass>
					<prop:ControlCssClass>errorField</prop:ControlCssClass>
							<prop:EnableClientScript>true</prop:EnableClientScript>
							<prop:ValidationGroup>RegistrationData</prop:ValidationGroup>
							<prop:Display>Fixed</prop:Display>
						</com:FRequiredConfirmValidator>
					</td>
				</tr>
				<tr>
					<th><%[ PSČ ]%></th>
					<td>
						<com:TTextBox id='BillingZip' cssClass='textBox'>
							<prop:Columns>5</prop:Columns>
							<prop:Text><%= $this->BillingZip->SafeText %></prop:Text>
						</com:TTextBox>
						<com:FRequiredConfirmValidator>
							<prop:ControlToValidate>BillingZip</prop:ControlToValidate>
							<prop:ControlToConfirm>BillingAddressDifferent</prop:ControlToConfirm>
							<prop:Text><%[ Zadejte PSČ ]%></prop:Text>
							<prop:ErrorMessage></prop:ErrorMessage>
					<prop:cssClass>errorNote</prop:cssClass>
					<prop:ControlCssClass>errorField</prop:ControlCssClass>
							<prop:EnableClientScript>true</prop:EnableClientScript>
							<prop:ValidationGroup>RegistrationData</prop:ValidationGroup>
							<prop:Display>Fixed</prop:Display>
						</com:FRequiredConfirmValidator>
					</td>
				</tr>
				<tr>
					<th>&nbsp;</th>
					<td>&nbsp;</td>
				</tr>
				<tr>
					<th><%[ Telefon ]%></th>
					<td>
						<com:TTextBox id='BillingPhone' cssClass='textBox'>
							<prop:Columns>30</prop:Columns>
							<prop:Text><%= $this->BillingPhone->SafeText %></prop:Text>
						</com:TTextBox>
						<com:FRequiredConfirmValidator>
							<prop:ControlToValidate>BillingPhone</prop:ControlToValidate>
							<prop:ControlToConfirm>BillingAddressDifferent</prop:ControlToConfirm>
							<prop:Text><%[ Zadejte telefon ]%></prop:Text>
							<prop:ErrorMessage></prop:ErrorMessage>
					<prop:cssClass>errorNote</prop:cssClass>
					<prop:ControlCssClass>errorField</prop:ControlCssClass>
							<prop:EnableClientScript>true</prop:EnableClientScript>
							<prop:ValidationGroup>RegistrationData</prop:ValidationGroup>
							<prop:Display>Fixed</prop:Display>
						</com:FRequiredConfirmValidator>
					</td>
				</tr>
				<tr>
					<th><%[ Email ]%></th>
					<td>
						<com:TTextBox id='BillingEmail' cssClass='textBox'>
							<prop:Columns>30</prop:Columns>
							<prop:Text><%= $this->BillingEmail->SafeText %></prop:Text>
						</com:TTextBox>
						<com:FRequiredConfirmValidator>
							<prop:ControlToValidate>BillingEmail</prop:ControlToValidate>
							<prop:ControlToConfirm>BillingAddressDifferent</prop:ControlToConfirm>
							<prop:Text><%[ Zadejte email ]%></prop:Text>
							<prop:ErrorMessage></prop:ErrorMessage>
					<prop:cssClass>errorNote</prop:cssClass>
					<prop:ControlCssClass>errorField</prop:ControlCssClass>
							<prop:EnableClientScript>true</prop:EnableClientScript>
							<prop:ValidationGroup>RegistrationData</prop:ValidationGroup>
							<prop:Display>Fixed</prop:Display>
						</com:FRequiredConfirmValidator>
						<com:TEmailAddressValidator>
							<prop:ControlToValidate>BillingEmail</prop:ControlToValidate>
							<prop:Text><%[ Nesprávně zadaný email ]%></prop:Text>
							<prop:ErrorMessage></prop:ErrorMessage>
					<prop:cssClass>errorNote</prop:cssClass>
					<prop:ControlCssClass>errorField</prop:ControlCssClass>
							<prop:EnableClientScript>true</prop:EnableClientScript>
							<prop:ValidationGroup>RegistrationData</prop:ValidationGroup>
							<prop:Display>Fixed</prop:Display>
						</com:TEmailAddressValidator>
					</td>
				</tr>
			</table>
		</com:TPanel>
	</com:FActivePanelReceiver>

	<h2>Dodací údaje</h2>
	<com:TActiveCheckBox id='ShippingAddressDifferent' CssClass="checkBox">
		<prop:Text><%[ liší se od fakturačních údajů ]%></prop:Text>
		<prop:OnCheckedChanged>shippingAddressDifferentClicked</prop:OnCheckedChanged>
		<prop:OnCallback>shippingAddressDifferentClicked</prop:OnCallback>
		<prop:CausesValidation>false</prop:CausesValidation>
		<prop:AutoPostBack>true</prop:AutoPostBack>
	</com:TActiveCheckBox>
	<com:FActivePanelReceiver id='ShippingAddressReceiver'>
		<prop:ListenOn>OnShippingAddressVisible</prop:ListenOn>
		<com:TPanel id='ShippingAddressForm' Visible='false'>
			<table class='standardForm'>
				<tr>
					<th><%[ Jméno a příjmení ]%></th>
					<td>
						<com:TTextBox id='ShippingCustomerName' cssClass='textBox'>
							<prop:Columns>30</prop:Columns>
							<prop:Text><%= $this->ShippingCustomerName->SafeText %></prop:Text>
						</com:TTextBox>
						<com:FRequiredConfirmValidator>
							<prop:ControlToValidate>ShippingCustomerName</prop:ControlToValidate>
							<prop:ControlToConfirm>ShippingAddressDifferent</prop:ControlToConfirm>
							<prop:ErrorMessage></prop:ErrorMessage>
					<prop:cssClass>errorNote</prop:cssClass>
					<prop:ControlCssClass>errorField</prop:ControlCssClass>
							<prop:EnableClientScript>true</prop:EnableClientScript>
							<prop:Text><%[ Zadejte jméno ]%></prop:Text>
							<prop:ValidationGroup>RegistrationData</prop:ValidationGroup>
							<prop:Display>Fixed</prop:Display>
						</com:FRequiredConfirmValidator>
					</td>
				</tr>
				<tr>
					<th><%[ Firma ]%></th>
					<td>
						<com:TTextBox id='ShippingCompanyName' cssClass='textBox'>
							<prop:Columns>30</prop:Columns>
							<prop:Text><%= $this->ShippingCompanyName->SafeText %></prop:Text>
						</com:TTextBox>
					</td>
				</tr>
				<tr>
					<th><%[ IČ ]%></th>
					<td>
						<com:TTextBox id='ShippingIC' cssClass='textBox'>
							<prop:Columns>30</prop:Columns>
							<prop:Text><%= $this->ShippingIC->SafeText %></prop:Text>
						</com:TTextBox>
						<com:FRequiredConfirmValidator>
							<prop:ControlToValidate>ShippingIC</prop:ControlToValidate>
							<prop:ControlToConfirm>ShippingCompanyName.SafeText</prop:ControlToConfirm>
							<prop:Text><%[ Zadejte IČ ]%></prop:Text>
							<prop:ErrorMessage></prop:ErrorMessage>
					<prop:cssClass>errorNote</prop:cssClass>
					<prop:ControlCssClass>errorField</prop:ControlCssClass>
							<prop:EnableClientScript>true</prop:EnableClientScript>
							<prop:ValidationGroup>RegistrationData</prop:ValidationGroup>
							<prop:Display>Fixed</prop:Display>
						</com:FRequiredConfirmValidator>
					</td>
				</tr>
				<tr>
					<th><%[ DIČ ]%></th>
					<td>
						<com:TTextBox id='ShippingDIC' cssClass='textBox'>
							<prop:Columns>30</prop:Columns>
							<prop:Text><%= $this->ShippingDIC->SafeText %></prop:Text>
						</com:TTextBox>
					</td>
				</tr>
				<tr>
					<th><%[ Ulice ]%></th>
					<td>
						<com:TTextBox id='ShippingStreet' cssClass='textBox'>
							<prop:Columns>30</prop:Columns>
							<prop:Text><%= $this->ShippingStreet->SafeText %></prop:Text>
						</com:TTextBox>
						<com:FRequiredConfirmValidator>
							<prop:ControlToValidate>ShippingStreet</prop:ControlToValidate>
							<prop:ControlToConfirm>ShippingAddressDifferent</prop:ControlToConfirm>
							<prop:Text><%[ Zadejte ulici ]%></prop:Text>
							<prop:ErrorMessage></prop:ErrorMessage>
					<prop:cssClass>errorNote</prop:cssClass>
					<prop:ControlCssClass>errorField</prop:ControlCssClass>
							<prop:EnableClientScript>true</prop:EnableClientScript>
							<prop:ValidationGroup>RegistrationData</prop:ValidationGroup>
							<prop:Display>Fixed</prop:Display>
						</com:FRequiredConfirmValidator>
					</td>
				</tr>
				<tr>
					<th><%[ Číslo popisné ]%></th>
					<td>
						<com:TTextBox id='ShippingStreetNumber' cssClass='textBox'>
							<prop:Columns>5</prop:Columns>
							<prop:Text><%= $this->ShippingStreetNumber->SafeText %></prop:Text>
						</com:TTextBox>
					</td>
				</tr>
				<tr>
					<th><%[ Obec ]%></th>
					<td>
						<com:TTextBox id='ShippingCity' cssClass='textBox'>
							<prop:Columns>30</prop:Columns>
							<prop:Text><%= $this->ShippingCity->SafeText %></prop:Text>
						</com:TTextBox>
						<com:FRequiredConfirmValidator>
							<prop:ControlToValidate>ShippingCity</prop:ControlToValidate>
							<prop:ControlToConfirm>ShippingAddressDifferent</prop:ControlToConfirm>
							<prop:Text><%[ Zadejte obec ]%></prop:Text>
							<prop:ErrorMessage></prop:ErrorMessage>
					<prop:cssClass>errorNote</prop:cssClass>
					<prop:ControlCssClass>errorField</prop:ControlCssClass>
							<prop:EnableClientScript>true</prop:EnableClientScript>
							<prop:ValidationGroup>RegistrationData</prop:ValidationGroup>
							<prop:Display>Fixed</prop:Display>
						</com:FRequiredConfirmValidator>
					</td>
				</tr>
				<tr>
					<th><%[ PSČ ]%></th>
					<td>
						<com:TTextBox id='ShippingZip' cssClass='textBox'>
							<prop:Columns>5</prop:Columns>
							<prop:Text><%= $this->ShippingZip->SafeText %></prop:Text>
						</com:TTextBox>
						<com:FRequiredConfirmValidator>
							<prop:ControlToValidate>ShippingZip</prop:ControlToValidate>
							<prop:ControlToConfirm>ShippingAddressDifferent</prop:ControlToConfirm>
							<prop:Text><%[ Zadejte PSČ ]%></prop:Text>
							<prop:ErrorMessage></prop:ErrorMessage>
					<prop:cssClass>errorNote</prop:cssClass>
					<prop:ControlCssClass>errorField</prop:ControlCssClass>
							<prop:EnableClientScript>true</prop:EnableClientScript>
							<prop:ValidationGroup>RegistrationData</prop:ValidationGroup>
							<prop:Display>Fixed</prop:Display>
						</com:FRequiredConfirmValidator>
					</td>
				</tr>
				<tr>
					<th>&nbsp;</th>
					<td>&nbsp;</td>
				</tr>
				<tr>
					<th><%[ Telefon ]%></th>
					<td>
						<com:TTextBox id='ShippingPhone' cssClass='textBox'>
							<prop:Columns>30</prop:Columns>
							<prop:Text><%= $this->ShippingPhone->SafeText %></prop:Text>
						</com:TTextBox>
						<com:FRequiredConfirmValidator>
							<prop:ControlToValidate>ShippingPhone</prop:ControlToValidate>
							<prop:ControlToConfirm>ShippingAddressDifferent</prop:ControlToConfirm>
							<prop:Text><%[ Zadejte telefon ]%></prop:Text>
							<prop:ErrorMessage></prop:ErrorMessage>
					<prop:cssClass>errorNote</prop:cssClass>
					<prop:ControlCssClass>errorField</prop:ControlCssClass>
							<prop:EnableClientScript>true</prop:EnableClientScript>
							<prop:ValidationGroup>RegistrationData</prop:ValidationGroup>
							<prop:Display>Fixed</prop:Display>
						</com:FRequiredConfirmValidator>
					</td>
				</tr>
				<tr>
					<th><%[ Email ]%></th>
					<td>
						<com:TTextBox id='ShippingEmail' cssClass='textBox'>
							<prop:Columns>30</prop:Columns>
							<prop:Text><%= $this->ShippingEmail->SafeText %></prop:Text>
						</com:TTextBox>
						<com:FRequiredConfirmValidator>
							<prop:ControlToValidate>ShippingEmail</prop:ControlToValidate>
							<prop:ControlToConfirm>ShippingAddressDifferent</prop:ControlToConfirm>
							<prop:Text><%[ Zadejte email ]%></prop:Text>
							<prop:ErrorMessage></prop:ErrorMessage>
					<prop:cssClass>errorNote</prop:cssClass>
					<prop:ControlCssClass>errorField</prop:ControlCssClass>
							<prop:EnableClientScript>true</prop:EnableClientScript>
							<prop:ValidationGroup>RegistrationData</prop:ValidationGroup>
							<prop:Display>Fixed</prop:Display>
						</com:FRequiredConfirmValidator>
						<com:TEmailAddressValidator>
							<prop:ControlToValidate>ShippingEmail</prop:ControlToValidate>
							<prop:Text><%[ Nesprávně zadaný email ]%></prop:Text>
							<prop:ErrorMessage></prop:ErrorMessage>
					<prop:cssClass>errorNote</prop:cssClass>
					<prop:ControlCssClass>errorField</prop:ControlCssClass>
							<prop:EnableClientScript>true</prop:EnableClientScript>
							<prop:ValidationGroup>RegistrationData</prop:ValidationGroup>
							<prop:Display>Fixed</prop:Display>
						</com:TEmailAddressValidator>
					</td>
				</tr>
			</table>
		</com:TPanel>
	</com:FActivePanelReceiver>
	<com:TControl id='ChildForm' Visible='false'>
		<br />
		<br />
		<h3><%[ Údaje o dětech ]%></h3>
		<p>
<%[ Údaje o dětech ]%>
			<em><%[ nejsou povinné ]%></em>
<%[ slouží pouze k rychlejší orientaci v produktech se zaměřením na věk dítěte. ]%>
		</p>
		<table class='standardForm centered'>
			<tr>
				<td>&nbsp;</td>
				<th><%[ Jméno: ]%></th>
				<th><%[ Datum narození (DD.MM.YYYY): ]%></th>
			</tr>
			<tr>
				<td>1.</td>
				<td>
					<com:TTextBox id='Child1Name' cssClass='textBox'>
						<prop:Text><%= $this->Child1Name->SafeText %></prop:Text>
					</com:TTextBox>
				</td>
				<td>
					<com:TTextBox id='Child1Birthdate' cssClass='textBox'>
						<prop:Text><%= $this->Child1Birthdate->SafeText %></prop:Text>
					</com:TTextBox>
				</td>
			</tr>
			<tr>
				<td>2.</td>
				<td>
					<com:TTextBox id='Child2Name' cssClass='textBox'>
						<prop:Text><%= $this->Child2Name->SafeText %></prop:Text>
					</com:TTextBox>
				</td>
				<td>
					<com:TTextBox id='Child2Birthdate' cssClass='textBox'>
						<prop:Text><%= $this->Child2Birthdate->SafeText %></prop:Text>
					</com:TTextBox>
				</td>
			</tr>
			<tr>
				<td>3.</td>
				<td>
					<com:TTextBox id='Child3Name' cssClass='textBox'>
						<prop:Text><%= $this->Child3Name->SafeText %></prop:Text>
					</com:TTextBox>
				</td>
				<td>
					<com:TTextBox id='Child3Birthdate' cssClass='textBox'>
						<prop:Text><%= $this->Child3Birthdate->SafeText %></prop:Text>
					</com:TTextBox>
				</td>
			</tr>
			<tr>
				<td>4.</td>
				<td>
					<com:TTextBox id='Child4Name' cssClass='textBox'>
						<prop:Text><%= $this->Child4Name->SafeText %></prop:Text>
					</com:TTextBox>
				</td>
				<td>
					<com:TTextBox id='Child4Birthdate' cssClass='textBox'>
						<prop:Text><%= $this->Child4Birthdate->SafeText %></prop:Text>
					</com:TTextBox>
				</td>
			</tr>
		</table>
	</com:TControl>

	<com:TControl id='UsernameAndPassword' Visible='true'>
		<br />
		<h2><%[ Přihlašovací údaje ]%></h2>
		<p class="paragraphInForm"><%[ Zvolte své přihlašovací jméno a heslo. ]%></p>
		<table class='standardForm centered'>
			<tr>
				<th><%[ Přihlašovací jméno (login): ]%></th>
				<td>
					<com:TTextBox id='Username' cssClass='textBox'>
						<prop:Text><%= $this->Username->SafeText %></prop:Text>
					</com:TTextBox>
					<com:TRequiredFieldValidator>
						<prop:ControlToValidate>Username</prop:ControlToValidate>
						<prop:Text><%[ Zadejte přihlašovací jméno ]%></prop:Text>
						<prop:ErrorMessage></prop:ErrorMessage>
					<prop:cssClass>errorNote</prop:cssClass>
					<prop:ControlCssClass>errorField</prop:ControlCssClass>
						<prop:EnableClientScript>true</prop:EnableClientScript>
						<prop:ValidationGroup>RegistrationData</prop:ValidationGroup>
						<prop:Display>Fixed</prop:Display>
					</com:TRequiredFieldValidator>
					<com:TCustomValidator>
						<prop:ControlToValidate>Username</prop:ControlToValidate>
						<prop:Text><%[ Takové přihlašovací jméno již existuje ]%></prop:Text>
						<prop:ErrorMessage></prop:ErrorMessage>
					<prop:cssClass>errorNote</prop:cssClass>
					<prop:ControlCssClass>errorField</prop:ControlCssClass>
						<prop:EnableClientScript>true</prop:EnableClientScript>
						<prop:ValidationGroup>RegistrationData</prop:ValidationGroup>
						<prop:Display>Fixed</prop:Display>
						<prop:OnServerValidate>checkUsername</prop:OnServerValidate>
					</com:TCustomValidator>
				</td>
			</tr>
			<tr>
				<th><%[ Heslo: ]%></th>
				<td>
					<com:TTextBox id='Password' cssClass='textBox'>
						<prop:TextMode>Password</prop:TextMode>
					</com:TTextBox>
					<com:TRequiredFieldValidator>
						<prop:ControlToValidate>Password</prop:ControlToValidate>
						<prop:Text><%[ Zadejte heslo ]%></prop:Text>
						<prop:ErrorMessage></prop:ErrorMessage>
					<prop:cssClass>errorNote</prop:cssClass>
					<prop:ControlCssClass>errorField</prop:ControlCssClass>
						<prop:EnableClientScript>true</prop:EnableClientScript>
						<prop:ValidationGroup>RegistrationData</prop:ValidationGroup>
						<prop:Display>Fixed</prop:Display>
					</com:TRequiredFieldValidator>
				</td>
			</tr>
			<tr>
				<th><%[ Zopakovat heslo: ]%></th>
				<td>
					<com:TTextBox id='PasswordAgain' cssClass='textBox'>
						<prop:TextMode>Password</prop:TextMode>
					</com:TTextBox>
					<com:TCompareValidator>
						<prop:ControlToValidate>PasswordAgain</prop:ControlToValidate>
						<prop:ControlToCompare>Password</prop:ControlToCompare>
						<prop:Text><%[ Zadaná hesla nejsou stejná ]%></prop:Text>
						<prop:Operator>Equal</prop:Operator>
						<prop:ErrorMessage></prop:ErrorMessage>
					<prop:cssClass>errorNote</prop:cssClass>
					<prop:ControlCssClass>errorField</prop:ControlCssClass>
						<prop:EnableClientScript>true</prop:EnableClientScript>
						<prop:ValidationGroup>RegistrationData</prop:ValidationGroup>
						<prop:Display>Fixed</prop:Display>
					</com:TCompareValidator>
				</td>
			</tr>
		</table>
	
	</com:TControl>
	<com:TControl id='ChangePassword' Visible='false'>
		<br />
		<h2><%[ Změna hesla ]%></h2>
		<table class='standardForm centered'>
			<tr>
				<th><%[ Nové heslo: ]%></th>
				<td>
					<com:TTextBox id='NewPassword' cssClass='textBox'>
						<prop:TextMode>Password</prop:TextMode>
					</com:TTextBox>
				</td>
			</tr>
			<tr>
				<th><%[ Zopakovat heslo: ]%></th>
				<td>
					<com:TTextBox id='NewPasswordAgain' cssClass='textBox'>
						<prop:TextMode>Password</prop:TextMode>
					</com:TTextBox>
					<com:TCompareValidator>
						<prop:ControlToValidate>NewPasswordAgain</prop:ControlToValidate>
						<prop:ControlToCompare>NewPassword</prop:ControlToCompare>
						<prop:Text><%[ Zadaná hesla nejsou stejná ]%></prop:Text>
						<prop:Operator>Equal</prop:Operator>
						<prop:ErrorMessage></prop:ErrorMessage>
					<prop:cssClass>errorNote</prop:cssClass>
					<prop:ControlCssClass>errorField</prop:ControlCssClass>
						<prop:EnableClientScript>true</prop:EnableClientScript>
						<prop:ValidationGroup>RegistrationData</prop:ValidationGroup>
						<prop:Display>Fixed</prop:Display>
					</com:TCompareValidator>
				</td>
			</tr>
		</table>
	</com:TControl>
	<com:TControl Visible='<%= $this->UseCaptcha && $this->User->IsGuest %>'>
		<h2><%[ Ochrana proti spamu ]%></h2>
		<div class='basicFormContainer'>
			<table class='standardForm centered'>
				<tr>
					<th><%[ Zadejte znaky z obrázku: ]%></th>
					<td>
						<com:TTextBox id='CaptchaInput' cssClass='textBox'>
							<prop:ErrorMessage></prop:ErrorMessage>
						</com:TTextBox>
					</td>

					<td class='captchaImg'>
						<com:TCaptcha id='Captcha'>&nbsp;</com:TCaptcha>
						<com:TCaptchaValidator>
							<prop:CaptchaControl>Captcha</prop:CaptchaControl>
							<prop:ControlToValidate>CaptchaInput</prop:ControlToValidate>
							<prop:EnableClientScript>true</prop:EnableClientScript>
							<prop:ValidationGroup>RegistrationData</prop:ValidationGroup>
							<prop:ErrorMessage></prop:ErrorMessage>
					<prop:cssClass>errorNote</prop:cssClass>
					<prop:ControlCssClass>errorField</prop:ControlCssClass>
							<prop:Text><%[ Zadejte, prosím, znaky z obrázky znovu ]%></prop:Text>
						</com:TCaptchaValidator>
					</td>
				</tr>
			</table>
		</div>
	</com:TControl>
	<div class='basicFormContainer'>
		<com:TValidationSummary id='Summary' cssClass='valError'>
			<prop:AutoUpdate>true</prop:AutoUpdate>
			<prop:EnableClientScript>true</prop:EnableClientScript>
			<prop:ValidationGroup>RegistrationData</prop:ValidationGroup>
		</com:TValidationSummary>
	</div>


	<div class='basicFormContainer'>
		<com:TButton cssClass='buttRegistrovat' Visible='<%= $this->User->IsGuest %>'>
			<prop:Text><%[ Zaregistrovat  ]%></prop:Text>
			<prop:ValidationGroup>RegistrationData</prop:ValidationGroup>
			<prop:OnCommand>sendRegistrationDataClicked</prop:OnCommand>
		</com:TButton>
		<com:TButton cssClass='buttSave' Visible='<%= !$this->User->IsGuest %>'>
			<prop:Text><%[ Uložit údaje ]%></prop:Text>
			<prop:ValidationGroup>RegistrationData</prop:ValidationGroup>
			<prop:OnCommand>sendUpdateDataClicked</prop:OnCommand>
		</com:TButton>
	</div>
 
</div>
