<com:FActivePanelReceiver id='UserLoginForm'>
	<prop:ListenOn>OnViewChanged,OnLogin,OnLogout</prop:ListenOn>
	<prop:CssClass><%= $this->CssClass %></prop:CssClass>
	<h1>Ztracené heslo</h1>	
	<com:TMultiView id='View' ActiveViewIndex='000'>
		<com:TView id='LoginView'>
			
			<p><%[ Zadejte, prosím, přihlašovací jméno nebo email. ]%></p>
			<p><%[ Na registrovaný email Vám budou zaslány přihlašovací údaje. ]%></p>
			<br />
			<div class='forgetPassForm'>
				<table>
					<tr>
						<th><%[ Přihlašovací jméno nebo email:&nbsp; ]%></th>
						<td>
							<com:TTextBox id='Username' cssClass='textBox'>
								<prop:Columns>30</prop:Columns>
								<prop:Text><%= $this->Username->SafeText %></prop:Text>
							</com:TTextBox>
							<com:TRequiredFieldValidator>
								<prop:ControlToValidate>Username</prop:ControlToValidate>
								<prop:Text>*</prop:Text>
								<prop:EnableClientScript>true</prop:EnableClientScript>
								<prop:ErrorMessage><%[ Zadejte přihlašovací jméno nebo email ]%></prop:ErrorMessage>
								<prop:ValidationGroup>LoginData</prop:ValidationGroup>
								<prop:Display>Fixed</prop:Display>
							</com:TRequiredFieldValidator>
						</td>
					</tr>
				</table>
			

				<com:TValidationSummary id='Summary' cssClass='valError'>
					<prop:AutoUpdate>true</prop:AutoUpdate>
					<prop:EnableClientScript>false</prop:EnableClientScript>
					<prop:ValidationGroup>LoginData</prop:ValidationGroup>
				</com:TValidationSummary>

			<com:TActiveButton cssClass='buttLogin'>
				<prop:Text><%[ Odeslat ]%></prop:Text>
				<prop:ValidationGroup>LoginData</prop:ValidationGroup>
				<prop:OnClick>loginButtonClicked</prop:OnClick>
				<prop:OnCallback>forgotButtonClicked</prop:OnCallback>
			</com:TActiveButton>
		</div>
		</com:TView>





		<com:TView id='SuccessView'>
			<p>
				<span><%[ Na registrovaný email Vám byly zaslány přihlašovací údaje. ]%></span>
			</p>
			<p>
				<span><%[ Můžete pokračovat&nbsp; ]%></span>
				<com:THyperLink>
					<prop:Text><%[ zde. ]%></prop:Text>
					<prop:NavigateUrl><%= $this->Page->getContainer($this->AfterLogoutPageID)->Href %></prop:NavigateUrl>
				</com:THyperLink>
			</p>
		</com:TView>
		
		
		
		<com:TView id='LoggedInView'>
			<h2>
				<span><%[ Jste již přihlášeni jako&nbsp; ]%></span>
				<span><%= $this->User->Name %></span>
			</h2>
			<com:TActiveLinkButton id='LogoutLink'>
				<prop:Text><%[ Odhlásit ]%></prop:Text>
				<prop:OnClick>LogoutButtonClicked</prop:OnClick>
				<prop:OnCallback>LogoutButtonClicked</prop:OnCallback>
			</com:TActiveLinkButton>
			<p>
				<span><%[ Můžete pokračovat&nbsp; ]%></span>
				<com:THyperLink>
					<prop:Text><%[ zde. ]%></prop:Text>
					<prop:NavigateUrl><%= $this->Page->getContainer($this->AfterLogoutPageID)->Href %></prop:NavigateUrl>
				</com:THyperLink>
			</p>
		</com:TView>
		<com:TView id='FailureView'>
			<p>
				<span><%[ Jméno resp. email, který jste zadali, není v naší databázi. ]%></span>
			</p>
			<p>
				<span><%[ Můžete zkusit znovu&nbsp; ]%></span>
				<com:THyperLink>
					<prop:Text><%[ zde. ]%></prop:Text>
					<prop:NavigateUrl><%= $this->Page->getContainer('Zapomen%heslo')->Href %></prop:NavigateUrl>
				</com:THyperLink>
			</p>
		</com:TView>
		<com:TView id='Failure2View'>
			<p>
				<span><%[ Omlouváme se, ale došlo k chybě při odesílání emailu<. ]%></span>
			</p>
			<p>
				<span><%[ Můžete pokračovat&nbsp; ]%></span>
				<com:THyperLink>
					<prop:Text><%[ zde. ]%></prop:Text>
					<prop:NavigateUrl><%= $this->Page->getContainer($this->AfterLogoutPageID)->Href %></prop:NavigateUrl>
				</com:THyperLink>
			</p>
		</com:TView>
	</com:TMultiView>
</com:FActivePanelReceiver>
<com:FWidgetControl id='MetaData'>
	properties:
		-	afterlogoutpageid
	fields:
		-	fieldLabel: <%= $this->MetaData->getRecord()->name %> / <%[After Logout Page]%>
			name: <%= $this->MetaData->getFieldName('afterlogoutpageid') %>
			editor:
				xtype: textfield
				allowBlank: true
				width: 200
</com:FWidgetControl>
