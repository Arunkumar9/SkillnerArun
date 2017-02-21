<input type="button" value="<%[ Napsat dotaz ]%>" OnClick="jQuery('#QuestionForm').show()" />
<div ID="QuestionForm" style="display: none" >
<table class="standardForm">
		<tr>
			<th><%[ Kontakt e-mail nebo telefon ]%></th>
			<td ><com:TTextBox Attributes.Size="30" ID="QuestionContact" cssClass="textBox" Text="<%= $this->QuestionContact->SafeText %>" />
			<com:TRequiredFieldValidator 
	    					ControlToValidate="QuestionContact"
	    					Text="*"
							EnableClientScript="false"
	    					ErrorMessage="<%[ Zadejte kontakt ]%>" 
							ValidationGroup="QuestionsForm" 
	                        Display="Fixed" />
			</td>
		</tr>
		<tr>
			<th><%[ Váš dotaz ]%></th>
			<td ><com:TTextBox TextMode="MultiLine" Columns="30" Rows="10"  ID="QuestionText" cssClass="textBox" Text="<%= $this->QuestionText->SafeText %>" />
			<com:TRequiredFieldValidator 
	    					ControlToValidate="QuestionText"
	    					Text="*"
							EnableClientScript="false"
	    					ErrorMessage="<%[ Zadejte dotaz ]%>" 
							ValidationGroup="QuestionsForm" 
	                        Display="Fixed" />
			</td>
		</tr>
<com:TControl Visible="<%= $this->UseCaptcha %>" >
		<tr>
			<th><%[ Zadejte znaky z obrázku ]%></th>
			<td>
				<com:TCaptcha ID="Captcha" /><br/>
				<com:TTextBox ID="CaptchaInput" />
				<com:TCaptchaValidator CaptchaControl="Captcha"
									   ControlToValidate="CaptchaInput"
									   ValidationGroup="QuestionsForm" 
									   ErrorMessage="<%[ Zkuste to prosím znovu ]%>" />
			</td>
		</tr>
</com:TControl>
		<tr>
			<td colspan="2" >
				<com:TValidationSummary ID="Summary" cssClass="valError" HeaderText=""
										AutoUpdate="true"
										ValidationGroup="QuestionsForm" 
										EnableClientScript="false" />				
			</td>
		</tr>										
</table>			
<com:TButton cssClass="buttObjednat" Text="<%[ Zaslat dotaz ]%>"					
											   ValidationGroup="QuestionsForm" 
											   OnCommand="sendQuestionClicked" />
<hr/>
</div>
<br/>
<com:FWidgetControl ID="MetaData">
properties:
	-	usecaptcha
	-	pageafter
	-	email
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
</com:FWidgetControl>	
