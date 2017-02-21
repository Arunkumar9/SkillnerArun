<table class="standardForm">
<com:TControl ID="EmailFormPanel" />
    <com:TControl Visible="<%= $this->UseCaptcha %>" >
		<tr>
			<th><%[ Zadejte znaky z obrázku ]%></th>
			<td>
				<com:TCaptcha ID="Captcha" /><br/>
				<com:TTextBox ID="CaptchaInput" />
				<com:TCaptchaValidator CaptchaControl="Captcha"
									   ControlToValidate="CaptchaInput"
									   ValidationGroup="EmailForm"
                                                                           Text="*"
									   ErrorMessage="<%[ Zkuste prosím obrázek znovu ]%>" />
			</td>
		</tr>
</com:TControl>
		<tr>
			<td colspan="2" >
				<com:TValidationSummary ID="Summary" cssClass="valError" HeaderText=""
										AutoUpdate="true"
										ValidationGroup="EmaiForm"
										EnableClientScript="true" />
			</td>
		</tr>
</table>
<com:TButton cssClass="buttSendForm" Text="<%[  ]%>"
		 ValidationGroup="EmailForm"
		 OnCommand="sendFormClicked" />
<com:FWidgetControl ID="MetaData">
properties:
	-	usecaptcha
	-	pageafter
	-	email
	-	emailtemplate
	-	emailtemplatetext
	-	formdefinition
fields:
    -	fieldLabel: <%= $this->MetaData->getRecord()->name %> / <%[Use Captcha]%>
		name: <%= $this->MetaData->getFieldName('usecaptcha') %>
		editor:
			xtype: xcheckbox
    -	fieldLabel: <%= $this->MetaData->getRecord()->name %> / <%[Page to go after]%>
		name: <%= $this->MetaData->getFieldName('pageafter') %>
		editor:
			xtype: textfield
			allowBlank: true
			width: 200
    -	fieldLabel: <%= $this->MetaData->getRecord()->name %> / <%[Email to send question]%>
		name: <%= $this->MetaData->getFieldName('email') %>
		editor:
			xtype: textfield
			vtype: email
			allowBlank: true
			width: 200
    -	fieldLabel: <%= $this->MetaData->getRecord()->name %> / <%[Email template]%>
	    name: <%= $this->MetaData->getFieldName('emailtemplate') %>
	    editor:
			xtype: textfield
			width: 200
    -	fieldLabel: <%= $this->MetaData->getRecord()->name %> / <%[Email template text]%>
	    name: <%= $this->MetaData->getFieldName('emailtemplatetext') %>
	    editor:
                        xtype: ccodemirror
                        language: html
                        codeMirrorPath: lib/CodeMirror
                        anchor: 90%
                        height: 200
    -	fieldLabel: <%= $this->MetaData->getRecord()->name %> / <%[Form definition]%>
	    name: <%= $this->MetaData->getFieldName('formdefinition') %>
	    editor:
                        xtype: ccodemirror
                        anchor: 90%
                        height: 200
</com:FWidgetControl>	
