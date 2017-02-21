	<table class="<%= $this->getCssClass() %>">

		<tr>
			<th><%[ Jméno a příjmení ]%></th>
			<td ><%= $this->Cart->Address->CustomerName %></td>
		</tr>

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
		
		<tr>
			
			<td>&nbsp;</td></tr>
	</table>
