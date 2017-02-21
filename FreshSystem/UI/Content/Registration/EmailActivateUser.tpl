<com:FActivePanelReceiver ID="ActiveReceiver" ListenOn="OnActivateSuccess,OnActivateFailure" TagName="div" >
	<com:TMultiView ID="View" ActiveViewIndex="0" >

		<com:TView ID="InitialView"  >
			<h1><%[Activate your account]%></h1>
			<com:TTextBox ID="ActivateToken" cssClass="textBox" />
			<com:TActiveButton Text="<%[Activate]%>" ID="ActivateButton" cssClass="sendPassButt" OnCallBack="activateUserClicked" OnClick="activateUserClicked" />
		</com:TView>

		<com:TView ID="ActivatedView"  >
			<%[ Your account has been activated. You can log in ]%><com:FCmsLink CmsLink="login" Text="<[% here %]>" />.

		</com:TView>

		<com:TView ID="ErrorView"  >
			<%[ Sorry, your activation code was probably invalid. ]%><br/>
			<%[ Please contact administrator. ]%>
		</com:TView>
	</com:TMultiView>
</com:FActivePanelReceiver >

<com:FWidgetControl ID="MetaData">
properties:
	-	emailadmin
	-	autologin
fields:
    -	fieldLabel: <%= $this->MetaData->getRecord()->name %> / <%[Email to admin]%>
		name: <%= $this->MetaData->getFieldName('emailadmin') %>
		editor:
			xtype: textfield
			allowBlank: true
			anchor: 90%
    -	fieldLabel: <%= $this->MetaData->getRecord()->name %> / <%[Auto login]%>
		name: <%= $this->MetaData->getFieldName('autologin') %>
		editor:
			xtype: xcheckbox
</com:FWidgetControl>
