	<table class="<%= $this->getCssClass() %>">

		<tr>
			<th><%[ Jméno a příjmení ]%></th>
			<td ><%= $this->Cart->BillingAddress->CustomerName %></td>
		</tr>
		<com:TControl Visible="<%= ($this->Cart->BillingAddress->CompanyName != '') %>">
			<tr>
				<th><%[ Firma ]%></th>
				<td ><%= $this->Cart->BillingAddress->CompanyName %></td>
			</tr>
			<tr>
				<th><%[ IČ ]%></th>
				<td ><%= $this->Cart->BillingAddress->IC %></td>
			</tr>

			<tr>
				<th><%[ DIČ ]%></th>
				<td ><%= $this->Cart->BillingAddress->DIC %></td>
			</tr>
		</com:TControl>
		<tr>
			<th><%[ Ulice ]%></th>
			<td ><%= $this->Cart->BillingAddress->Street %></td>
		</tr>								
		
		<tr>
			<th><%[ Číslo popisné ]%></th>
			<td><%= $this->Cart->BillingAddress->StreetNumber %></td>
		</tr>
		<tr>
			<th><%[ PSČ ]%></th>
			<td><%= $this->Cart->BillingAddress->Zip %></td>
		</tr>								
		
		<tr>
			<th><%[ Obec ]%></th>
			<td><%= $this->Cart->BillingAddress->City %></td>
		</tr>								

		<tr>
			<th><%[ Telefon ]%></th>
			<td><%= $this->Cart->BillingAddress->Phone %></td>
		</tr>
		
		<tr>
			<th><%[ Email ]%></th>
			<td><%= $this->Cart->BillingAddress->Email %></td>
		</tr>																		
		
	</table>
		
	<br/>
