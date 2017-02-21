<table class='standardForm'>
	<tr>
		<th><%[ Ulice ]%></th>
		<td>
			<com:TTextBox id='Street' cssClass='textBox'>
				<prop:Columns>30</prop:Columns>
				<prop:Text><%= $this->Cart->Address->Street %></prop:Text>
			</com:TTextBox>
			<com:TRequiredFieldValidator>
				<prop:ControlToValidate>Street</prop:ControlToValidate>
				<prop:Text>*</prop:Text>
				<prop:EnableClientScript>false</prop:EnableClientScript>
				<prop:ErrorMessage><%[ Zadejte ulici ]%></prop:ErrorMessage>
				<prop:ValidationGroup>PersonalData</prop:ValidationGroup>
				<prop:Display>Fixed</prop:Display>
			</com:TRequiredFieldValidator>
		</td>
	</tr>
</table>
<com:FWidgetControl id='MetaData'>
	properties:
		-	afterlogoutpageid
		-	loginpageid
		-	registerpageid
		-	accountpageid
	fields:
		-	fieldLabel: <%= $this->MetaData->getRecord()->name %> / <%[Login Page]%>
			name: <%= $this->MetaData->getFieldName('loginpageid') %>
			editor:
				xtype: textfield
				allowBlank: true
				width: 200
		-	fieldLabel: <%= $this->MetaData->getRecord()->name %> / <%[After Logout Page]%>
			name: <%= $this->MetaData->getFieldName('afterlogoutpageid') %>
			editor:
				xtype: textfield
				allowBlank: true
				width: 200
		-	fieldLabel: <%= $this->MetaData->getRecord()->name %> / <%[Register Page]%>
			name: <%= $this->MetaData->getFieldName('registerpageid') %>
			editor:
				xtype: textfield
				allowBlank: true
				width: 200
		-	fieldLabel: <%= $this->MetaData->getRecord()->name %> / <%[Account Page]%>
			name: <%= $this->MetaData->getFieldName('accountpageid') %>
			editor:
				xtype: textfield
				allowBlank: true
				width: 200
</com:FWidgetControl>
