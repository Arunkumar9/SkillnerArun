<com:FActivePanelReceiver ID="UserBoxPanel" ListenOn="OnLogin,OnLogout" cssClass="<%= $this->CssClass %>">
	 <com:THyperLink ID="LoginLink" Text="<%[ Přihlásit ]%>" />
	 <com:TLinkButton ID="LogoutLink" Text="<%[ Odhlásit ]%>" OnCommand="logoutButtonClicked" /><br/>
     <com:THyperLink ID="RegisterLink" Text="<%[ Registrace ]%>"/><br />
     <com:THyperLink ID="AccountLink" Text="<%[ Můj účet ]%>"/><br />
</com:FActivePanelReceiver>
<com:FWidgetControl ID="MetaData">
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
