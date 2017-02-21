<com:FActivePanelReceiver ID="ActiveReceiver" ListenOn="OnAuthorizeSuccess,OnAuthorizeFailure" >
	<com:TMultiView ID="View" ActiveViewIndex="0" >

		<com:TView ID="InitialView"  >
			<com:FContentRepeater ContentColumn="initial" >
			<prop:ItemTemplate>
				  <com:FShowContent ID="ContentRecord" Content="<%# $this->Data %>" cssClass="Content" />
			</prop:ItemTemplate> 
			</com:FContentRepeater>
			<com:TTextBox ID="PasswordField" cssClass="textBox accessPassword" TextMode="Password" />
			<com:TActiveButton ID="PasswordButton" cssClass="sendPassButt" OnCallBack="sendPasswordClicked" OnClick="sendPasswordClicked" />
		</com:TView>

		<com:TView ID="AuthorizedView"  >
			<com:FContentRepeater ContentColumn="authorized" >
			<prop:ItemTemplate>
				  <com:FShowContent ID="ContentRecord" Content="<%# $this->Data %>" cssClass="Content" />
			</prop:ItemTemplate> 
			</com:FContentRepeater>

		</com:TView>

		<com:TView ID="DeniedView"  >
			<com:FContentRepeater ContentColumn="denied" >
			<prop:ItemTemplate>
				  <com:FShowContent ID="ContentRecord" Content="<%# $this->Data %>" cssClass="Content" />
			</prop:ItemTemplate> 
			</com:FContentRepeater>
		</com:TView>
	</com:TMultiView>
</com:FActivePanelReceiver >

<com:FWidgetControl ID="MetaData">
properties:
	-	password
	-	sendcookie
fields:
    -	fieldLabel: <%= $this->MetaData->getRecord()->name %> / <%[Password]%>
		name: <%= $this->MetaData->getFieldName('password') %>
		editor:
			xtype: textfield
			allowBlank: true
			anchor: 90%
    -	fieldLabel: <%= $this->MetaData->getRecord()->name %> / <%[Send Cookie]%>
		name: <%= $this->MetaData->getFieldName('sendcookie') %>
		editor:
			xtype: xcheckbox
</com:FWidgetControl>
