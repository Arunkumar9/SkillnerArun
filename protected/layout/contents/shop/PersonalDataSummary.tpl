	<table class="<%= $this->getCssClass() %>">

		<tr>
			<th><%[ Jméno a příjmení ]%></th>
			<td ><%= $this->Cart->Address->CustomerName %></td>
		</tr>
		<com:TControl Visible="<%= ($this->Cart->Address->CompanyName != '') %>">
			<tr>
				<th><%[ Firma ]%></th>
				<td ><%= $this->Cart->Address->CompanyName %></td>
			</tr>
			<tr>
				<th><%[ IČ ]%></th>
				<td ><%= $this->Cart->Address->IC %></td>
			</tr>

			<tr>
				<th><%[ DIČ ]%></th>
				<td ><%= $this->Cart->Address->DIC %></td>
			</tr>
		</com:TControl>
		<tr>
			<th><%[ Ulice ]%></th>
			<td ><%= $this->Cart->Address->Street %></td>
		</tr>								
		
		<tr>
			<th><%[ Číslo popisné ]%></th>
			<td><%= $this->Cart->Address->StreetNumber %></td>
		</tr>
		<tr>
			<th><%[ PSČ ]%></th>
			<td><%= $this->Cart->Address->Zip %></td>
		</tr>								
		
		<tr>
			<th><%[ Obec ]%></th>
			<td><%= $this->Cart->Address->City %></td>
		</tr>								

		<tr>
			<th><%[ Telefon ]%></th>
			<td><%= $this->Cart->Address->Phone %></td>
		</tr>
		
		<tr>
			<th><%[ Email ]%></th>
			<td><%= $this->Cart->Address->Email %></td>
		</tr>																		
		
		<tr>
			<th><%[ Poznámka ]%></th>
			<td><%= $this->Cart->Address->Comment %></td>
		</tr>
	</table>
		
	<br/>
