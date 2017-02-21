
<table border="0" width="80%" class="tableForm">
  <tr>
  	<td>Příjmení</td>
  	<td><com:TTextBox  ValidationGroup="ProjectForm"  ID="prijmeni" Text="<%= $this->prijmeni->SafeText %>" cssClass="textfield" /></td>
  	</tr>
  <tr>
    <td>Jméno</td>
    <td><com:TTextBox  ValidationGroup="ProjectForm"  ID="jmeno" Text="<%= $this->jmeno->SafeText %>" cssClass="textfield" /></td>
  </tr>
  <tr>
  	<td>E-mail</td>
  	<td><com:TTextBox  ValidationGroup="ProjectForm"  ID="emailSender" Text="<%= $this->emailSender->SafeText %>" cssClass="textfield" /></td>
  	</tr>
  <tr>
  	<td>Zpráva</td>
  	<td><com:TTextBox TextMode="MultiLine" Columns="45" Rows="5" ValidationGroup="ProjectForm"  ID="zprava" Text="<%= $this->zprava->SafeText %>" cssClass="textfield" /></td>
  	</tr>
</table>


<table width="80%" border="0">
<com:TControl Visible="<%= $this->UseCaptcha %>" >
		<tr>
			<td><%[ Zadejte znaky z obrázku ]%></td>

			<td class="captchaCell">
				<com:TCaptcha ID="Captcha"  />
			</td>				
			<td>				
				<com:TTextBox ID="CaptchaInput" cssClass="textfield" />
			
				<com:TCaptchaValidator CaptchaControl="Captcha"
									   ControlToValidate="CaptchaInput"
									   ValidationGroup="ProjectForm" 
									   Text="*"
									   EnableClientScript="true"
									   ErrorMessage="Zkuste to prosím znovu" />
			</td>
		</tr>
</com:TControl>

		<tr>
			<td colspan="3" class="captchaErrCell">
				<com:TValidationSummary ID="Summary" cssClass="valError" HeaderText=""
										AutoUpdate="true"
										ValidationGroup="ProjectForm" 
										EnableClientScript="true" />				
			</td>
		</tr>
</table>
<table width="80%" border="0">
  <tr>
    <td><com:TButton CausesValidation="true" ButtonType="Submit" ID="button" cssClass="button" Text="<%[Odeslat]%>" OnCommand="sendFormClicked" ValidationGroup="ProjectForm" />
      <com:TButton ButtonType="Reset" ID="button2" cssClass="button" Text="Vymazat formulář" /></td>
    <td>&nbsp;</td>
  </tr>
</table>


<com:FWidgetControl ID="MetaData">
properties:
	-	usecaptcha
	-	pageafter
	-	email
	-	emailtemplate
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
    -	fieldLabel: <%= $this->MetaData->getRecord()->name %> / <%[Template to send email]%>
		name: <%= $this->MetaData->getFieldName('emailtemplate') %>
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
</com:FWidgetControl>	
