<com:FActivePanelReceiver id='ActiveReceiver'>
	<prop:ListenOn>OnRegistrationSubmit</prop:ListenOn>
	<com:TMultiView id='View' ActiveViewIndex='000'>
		<com:TView id='RegistrationView'>
<%include UserRegistrationForm %>
		</com:TView>
		<com:TView id='SuccessView'>
<%include UserAfterRegistration %>
		</com:TView>
		<com:TView id='FailureView'>
<%include UserFailureRegistration %>
		</com:TView>
	</com:TMultiView>
</com:FActivePanelReceiver>
<com:FWidgetControl id='MetaData'>
	properties:
		-   usecaptcha
		-   pageafter
		-   email
		-	otherinfo
	fields:
		-   fieldLabel: <%= $this->MetaData->getRecord()->name %> / <%[Use Captcha]%>
			name: <%= $this->MetaData->getFieldName('usecaptcha') %>
			editor:
				xtype: xcheckbox
		-   fieldLabel: <%= $this->MetaData->getRecord()->name %> / <%[Other Info]%>
			name: <%= $this->MetaData->getFieldName('otherinfo') %>
			editor:
				xtype: textfield
				allowBlank: true
				width: 200
		-   fieldLabel: <%= $this->MetaData->getRecord()->name %> / <%[Page to go after]%>
			name: <%= $this->MetaData->getFieldName('pageafter') %>
			editor:
				xtype: textfield
				allowBlank: true
				width: 200
		-   fieldLabel: <%= $this->MetaData->getRecord()->name %> / <%[Email to send question]%>
			name: <%= $this->MetaData->getFieldName('email') %>
			editor:
				xtype: textfield
				vtype: email
				allowBlank: true
				width: 200
</com:FWidgetControl>
