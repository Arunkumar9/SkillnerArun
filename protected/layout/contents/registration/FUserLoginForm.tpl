<div class="regForms">
	<com:FActivePanelReceiver id='UserLoginForm'>
		<prop:ListenOn>OnLogin,OnLogout</prop:ListenOn>
		<prop:CssClass><%= $this->CssClass %></prop:CssClass>
		<com:TMultiView id='View' ActiveViewIndex='000'>
			<com:TView id='LoginView'>
					<h2><%[ Zadejte, prosím, přihlašovací jméno a heslo. ]%></h2>
					<table class='standardForm'>
						<tr>
							<th><%[ Jméno: ]%></th>
							<td>
								<com:TTextBox id='Username' cssClass='textBox'>
									<prop:Columns>30</prop:Columns>
									<prop:Text><%= $this->Username->SafeText %></prop:Text>
								<com:TRequiredFieldValidator>
									<prop:ControlToValidate>Username</prop:ControlToValidate>
									<prop:Text>*</prop:Text>
									<prop:EnableClientScript>false</prop:EnableClientScript>
									<prop:ErrorMessage><%[ Zadejte jméno ]%></prop:ErrorMessage>
									<prop:ValidationGroup>LoginData</prop:ValidationGroup>
									<prop:Display>Fixed</prop:Display>
								</com:TRequiredFieldValidator>
							</com:TTextBox>
						</td>
						<tr>
							<th><%[ Heslo: ]%></th>
							<td>
								<com:TTextBox id='Password' cssClass='textBox'>
									<prop:Columns>30</prop:Columns>
									<prop:TextMode>Password</prop:TextMode>
								</com:TTextBox>
								<com:TRequiredFieldValidator>
									<prop:ControlToValidate>Password</prop:ControlToValidate>
									<prop:Text>*</prop:Text>
									<prop:EnableClientScript>false</prop:EnableClientScript>
									<prop:ErrorMessage><%[ Zadejte heslo ]%></prop:ErrorMessage>
									<prop:ValidationGroup>LoginData</prop:ValidationGroup>
									<prop:Display>Fixed</prop:Display>
								</com:TRequiredFieldValidator>
							</td>
						</tr>
					</tr>
				</table>




						<com:TValidationSummary id='Summary' cssClass='valError'>
							<prop:AutoUpdate>true</prop:AutoUpdate>
							<prop:EnableClientScript>false</prop:EnableClientScript>
							<prop:ValidationGroup>LoginData</prop:ValidationGroup>
						</com:TValidationSummary>
						<com:TActiveButton cssClass='buttLogin'>
							<prop:Text><%[ Přihlásit ]%></prop:Text>
							<prop:ValidationGroup>LoginData</prop:ValidationGroup>
							<prop:OnClick>loginButtonClicked</prop:OnClick>
							<prop:OnCallback>loginButtonClicked</prop:OnCallback>
						</com:TActiveButton>


			</com:TView>
			<com:TView id='SuccessView'>
				<p>
					<span><%[ Nyní jste přihlášeni jako&nbsp; ]%></span>
					<span><%= $this->User->Name %></span>
				</p>
				<!---<p>
					<span><%[ Můžete pokračovat&nbsp; ]%></span>
                                        <com:FCmsLink CmsLink="4" Text="<%[ zde. ]%>" />
				</p>--->
			</com:TView>
			<com:TView id='LoggedInView'>
				<h2>
					<span><%[ Jste přihlášeni jako&nbsp; ]%></span>
					<span><%= $this->User->Name %></span>
				</h2>
				<com:TLinkButton id='LogoutLink'>
					<prop:Text><%[ Odhlásit ]%></prop:Text>
					<prop:OnClick>LogoutButtonClicked</prop:OnClick>
				</com:TLinkButton>
				<!---<p>
					<span><%[ Můžete pokračovat&nbsp; ]%></span>
                                        <com:FCmsLink CmsLink="4" Text="<%[ zde. ]%>" />
				</p> --->
			</com:TView>
		</com:TMultiView>
	</com:FActivePanelReceiver>



<com:FWidgetControl id='MetaData'>
	properties:
		-	afterlogoutpageid
		-	afterloginpageid
	fields:
		-	fieldLabel: <%= $this->MetaData->getRecord()->name %> / <%[After Login Page]%>
			name: <%= $this->MetaData->getFieldName('afterloginpageid') %>
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
</com:FWidgetControl>
</div>