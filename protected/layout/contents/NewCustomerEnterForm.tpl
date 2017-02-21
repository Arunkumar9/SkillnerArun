<div class="tableColumn">

	<div class="tableForm coloredForm">
		<table border="0" >
		  <tr>
			<th><%[ Datum ]%>:</th>
			<td>
			<com:TDatePicker ValidationGroup="ProjectForm" Columns="30" cssClass="textfield" ID="datum"  Timestamp=<%= @strtotime("today") %> />
			</td>
		  </tr>




		  <tr>
			<th><%[ Jméno klienta ]%>:</th>
			<td>
			<com:TTextBox ValidationGroup="ProjectForm" Columns="70" ID="jmeno" Text="<%= $this->jmeno->SafeText %>" cssClass="textfield" />
					<com:TRequiredFieldValidator
									ControlToValidate="jmeno"
									Text="Zadejte vaše jméno"
									EnableClientScript="true"
									ErrorMessage=""
									cssClass="errorNote"
									ControlCssClass="errorField"
									ValidationGroup="ProjectForm"
									Display="Fixed" />

			</td>
		  </tr>




		  <tr>
			<th><%[ Datum narození ]%>:</th>
			<td>
				<com:TDatePicker ValidationGroup="ProjectForm" ID="datumNarozeni" cssClass="textfield" Columns="30"  />
						<com:TRequiredFieldValidator
									ControlToValidate="datumNarozeni"
									Text="Zadejte datum narození"
									EnableClientScript="true"
									ErrorMessage=""
									cssClass="errorNote"
									ControlCssClass="errorField"
									ValidationGroup="ProjectForm"
									Display="Fixed" />


			</td>
		  </tr>



		  <tr>
			<th><%[ Telefon ]%>:</th>
			<td><com:TTextBox ValidationGroup="ProjectForm"  ID="telefon" Text="<%= $this->telefon->SafeText %>" cssClass="textfield" Columns="30"  />
						<com:TRequiredFieldValidator
									ControlToValidate="telefon"
									Text="Zadejte telefonní číslo"
									EnableClientScript="true"
									ErrorMessage=""
									cssClass="errorNote"
									ControlCssClass="errorField"
									ValidationGroup="ProjectForm"
									Display="Fixed" />
			
			
			</td>
		  </tr>



		</table>

	</div>



















	<div class="tableForm">
		<table border="0" >



		<tr>
			<th><%[ Věk ]%>:</th>
			<td>

Vložit výpočet



			</td>
		</tr>


		  <tr>
			<th><%[ Pohlaví ]%>:</th>
			<td>
			<com:TActiveDropDownList ID="pohlavi" OnSelectedIndexChanged="" OnCallback="" >
                              <com:TListItem Value="Muž" />
                              <com:TListItem Value="Žena" />
            </com:TActiveDropDownList> 
			
			
			
			</td>
		  </tr>




		  <tr>
			<th><%[ Hmotnost (kg) ]%>:</th>
			<td>
			<com:TTextBox ValidationGroup="ProjectForm" Columns="10" ID="hmotnost" Text="<%= $this->hmotnost->SafeText %>" cssClass="textfield" />

						<com:TRequiredFieldValidator
									ControlToValidate="hmotnost"
									Text="Zadejte vaši hmotnost"
									EnableClientScript="true"
									ErrorMessage=""
									cssClass="errorNote"
									ControlCssClass="errorField"
									ValidationGroup="ProjectForm"
									Display="Fixed" />

						<com:TDataTypeValidator
									DataType="Float"
									ControlToValidate="hmotnost"
									Text="Nesprávně zadaný údaj - zadejte číslo s desetinnou TEČKOU! (31.5)"
									EnableClientScript="true"
									ErrorMessage=""
									cssClass="errorNote"
									ControlCssClass="errorField"
									ValidationGroup="ProjectForm"
									Display="Fixed" />			
			</td>
		  </tr>




		  <tr>
			<th><%[ Výška (cm) ]%>:</th>
			<td>
			<com:TTextBox ValidationGroup="ProjectForm" Columns="10" ID="vyska" Text="<%= $this->vyska->SafeText %>" cssClass="textfield" />
						<com:TRequiredFieldValidator
									ControlToValidate="vyska"
									Text="Zadejte vaši výšku"
									EnableClientScript="true"
									ErrorMessage=""
									cssClass="errorNote"
									ControlCssClass="errorField"
									ValidationGroup="ProjectForm"
									Display="Fixed" />

						<com:TDataTypeValidator
									DataType="Integer"
									ControlToValidate="vyska"
									Text="Nesprávně zadaný údaj - zadejte celé číslo"
									EnableClientScript="true"
									ErrorMessage=""
									cssClass="errorNote"
									ControlCssClass="errorField"
									ValidationGroup="ProjectForm"
									Display="Fixed" />										
									

			</td>
		  </tr>




		 



		  <tr>
			<th><%[ Procento tuku ]%>:</th>
			<td>
			<com:TTextBox ValidationGroup="ProjectForm" Columns="10" ID="procentoTuku" Text="<%= $this->procentoTuku->SafeText %>" cssClass="textfield" />
						<com:TRequiredFieldValidator
									ControlToValidate="procentoTuku"
									Text="Zadejte procento vašeho tuku"
									EnableClientScript="true"
									ErrorMessage=""
									cssClass="errorNote"
									ControlCssClass="errorField"
									ValidationGroup="ProjectForm"
									Display="Fixed" />

						<com:TDataTypeValidator
									DataType="Float"
									ControlToValidate="procentoTuku"
									Text="Nesprávně zadaný údaj - zadejte číslo s desetinnou TEČKOU! (31.5)"
									EnableClientScript="true"
									ErrorMessage=""
									cssClass="errorNote"
									ControlCssClass="errorField"
									ValidationGroup="ProjectForm"
									Display="Fixed" />				
			
			
			
			
			</td>
		  </tr>


		  <tr>
			<th><%[ Procento vody ]%>:</th>
			<td>
			<com:TTextBox ValidationGroup="ProjectForm" Columns="10" ID="procentoVody" Text="<%= $this->procentoVody->SafeText %>" cssClass="textfield" />
						<com:TRequiredFieldValidator
									ControlToValidate="procentoVody"
									Text="Zadejte procento vašeho tuku"
									EnableClientScript="true"
									ErrorMessage=""
									cssClass="errorNote"
									ControlCssClass="errorField"
									ValidationGroup="ProjectForm"
									Display="Fixed" />

						<com:TDataTypeValidator
									DataType="Float"
									ControlToValidate="procentoVody"
									Text="Nesprávně zadaný údaj - zadejte číslo s desetinnou TEČKOU! (31.5)"
									EnableClientScript="true"
									ErrorMessage=""
									cssClass="errorNote"
									ControlCssClass="errorField"
									ValidationGroup="ProjectForm"
									Display="Fixed" />				
			
			
			
			
			</td>
		  </tr>











		  <tr>
			<th><%[ Životní styl ]%>:</th>
			<td  class="lifeStyleSelect" >
			<com:TActiveDropDownList ID="zivotniStyl" OnSelectedIndexChanged="" OnCallback="">
                              <com:TListItem Value="1. sedavý styl (malá nebo žádná cvičení)"  />
                              <com:TListItem Value="2. lehká aktivita (1-3x týdně sport)" />
                              <com:TListItem Value="3. střední aktivita (3-5x týdně sport))" />
                              <com:TListItem Value="4. velká aktivita (6-7x týdně sport)" />
                              <com:TListItem Value="5. extrémní aktivita (těžká fyz. práce nebo 2xdenně tréninky)" />							  							  							  
							  
            </com:TActiveDropDownList>
			
			
			
			</td>
		  </tr>



		  <tr>
			<th><%[ Hmotnost kostí ]%>:</th>
			<td>
			<com:TTextBox ValidationGroup="ProjectForm" Columns="10" ID="hmotnostKosti" Text="<%= $this->hmotnostKosti->SafeText %>" cssClass="textfield" />
						<com:TRequiredFieldValidator
									ControlToValidate="hmotnostKosti"
									Text="Zadejte hmotnost vašich kostí"
									EnableClientScript="true"
									ErrorMessage=""
									cssClass="errorNote"
									ControlCssClass="errorField"
									ValidationGroup="ProjectForm"
									Display="Fixed" />

						<com:TDataTypeValidator
									DataType="Float"
									ControlToValidate="hmotnostKosti"
									Text="Nesprávně zadaný údaj - zadejte číslo s desetinnou TEČKOU! (31.5)"
									EnableClientScript="true"
									ErrorMessage=""
									cssClass="errorNote"
									ControlCssClass="errorField"
									ValidationGroup="ProjectForm"
									Display="Fixed" />				
			
			
			
			
			</td>
		  </tr>





		  <tr>
			<th><%[ Fyzická kondice ]%>:</th>
			<td>
			<com:TTextBox ValidationGroup="ProjectForm" Columns="10" ID="fyzickaKondice" Text="<%= $this->fyzickaKondice->SafeText %>" cssClass="textfield" />
						<com:TRequiredFieldValidator
									ControlToValidate="fyzickaKondice"
									Text="Zadejte index vaší fyzické kondice"
									EnableClientScript="true"
									ErrorMessage=""
									cssClass="errorNote"
									ControlCssClass="errorField"
									ValidationGroup="ProjectForm"
									Display="Fixed" />

						<com:TDataTypeValidator
									DataType="Integer"
									ControlToValidate="fyzickaKondice"
									Text="Nesprávně zadaný údaj - zadejte celé číslo"
									EnableClientScript="true"
									ErrorMessage=""
									cssClass="errorNote"
									ControlCssClass="errorField"
									ValidationGroup="ProjectForm"
									Display="Fixed" />				
			
			
			
			
			</td>
		  </tr>


		  <tr>
			<th><%[ Viscerální tuk ]%>:</th>
			<td>
			<com:TTextBox ValidationGroup="ProjectForm" Columns="10" ID="visceralniTuk" Text="<%= $this->visceralniTuk->SafeText %>" cssClass="textfield" />
						<com:TRequiredFieldValidator
									ControlToValidate="visceralniTuk"
									Text="Zadejte váš viscerální tuk"
									EnableClientScript="true"
									ErrorMessage=""
									cssClass="errorNote"
									ControlCssClass="errorField"
									ValidationGroup="ProjectForm"
									Display="Fixed" />

						<com:TDataTypeValidator
									DataType="Integer"
									ControlToValidate="visceralniTuk"
									Text="Nesprávně zadaný údaj - zadejte celé číslo"
									EnableClientScript="true"
									ErrorMessage=""
									cssClass="errorNote"
									ControlCssClass="errorField"
									ValidationGroup="ProjectForm"
									Display="Fixed" />				
			
			
			
			
			</td>
		  </tr>



		  <tr>
			<th><%[ Pas v nejužším místě, mezi pupíkem a spodní částí hrudníku (cm) ]%>:</th>
			<td>
			<com:TTextBox ValidationGroup="ProjectForm" Columns="10" ID="pas" Text="<%= $this->pas->SafeText %>" cssClass="textfield" />
						<com:TRequiredFieldValidator
									ControlToValidate="pas"
									Text="Zadejte obvod pasu ..."
									EnableClientScript="true"
									ErrorMessage=""
									cssClass="errorNote"
									ControlCssClass="errorField"
									ValidationGroup="ProjectForm"
									Display="Fixed" />

						<com:TDataTypeValidator
									DataType="Integer"
									ControlToValidate="pas"
									Text="Nesprávně zadaný údaj - zadejte celé číslo"
									EnableClientScript="true"
									ErrorMessage=""
									cssClass="errorNote"
									ControlCssClass="errorField"
									ValidationGroup="ProjectForm"
									Display="Fixed" />				
			
			
			
			
			</td>
		  </tr>




		  <tr>
			<th><%[ Boky kde je vaše pánev nejširší (často největší vyklenutí hýždí) (cm) ]%>:</th>
			<td>
			<com:TTextBox ValidationGroup="ProjectForm" Columns="10" ID="boky" Text="<%= $this->boky->SafeText %>" cssClass="textfield" />
						<com:TRequiredFieldValidator
									ControlToValidate="boky"
									Text="Zadejte obvod boků ..."
									EnableClientScript="true"
									ErrorMessage=""
									cssClass="errorNote"
									ControlCssClass="errorField"
									ValidationGroup="ProjectForm"
									Display="Fixed" />

						<com:TDataTypeValidator
									DataType="Integer"
									ControlToValidate="boky"
									Text="Nesprávně zadaný údaj - zadejte celé číslo"
									EnableClientScript="true"
									ErrorMessage=""
									cssClass="errorNote"
									ControlCssClass="errorField"
									ValidationGroup="ProjectForm"
									Display="Fixed" />				
			
			
			
			
			</td>
		  </tr>

















		</table>

	</div>























<div class="tableForm">

		<table border="0">
		  <tr>
			<th><%[ Jméno specialisty ]%>:</th>
			<td>
			<com:TTextBox ValidationGroup="ProjectForm" Columns="30" ID="jmenoSpecialisty" Text="<%= $this->jmenoSpecialisty->SafeText %>" cssClass="textfield" />
			<com:TRequiredFieldValidator
									ControlToValidate="jmenoSpecialisty"
									Text="Zadejte jméno specialisty"
									EnableClientScript="true"
									ErrorMessage=""
									cssClass="errorNote"
									ControlCssClass="errorField"
									ValidationGroup="ProjectForm"
									Display="Fixed" />


			</td>
		  </tr>




		  <tr>
			<th><%[ Kontakt specialista ]%>:</th>
			<td>
			<com:TTextBox ValidationGroup="ProjectForm" Columns="30" ID="kontaktSpecialista" Text="<%= $this->kontaktSpecialista->SafeText %>" cssClass="textfield" />
			<com:TRequiredFieldValidator
									ControlToValidate="kontaktSpecialista"
									Text="Zadejte kontaktní údaje specialisty"
									EnableClientScript="true"
									ErrorMessage=""
									cssClass="errorNote"
									ControlCssClass="errorField"
									ValidationGroup="ProjectForm"
									Display="Fixed" />

			</td>
		  </tr>




		  <tr>
			<th><%[ Adresa ]%>:</th>
			<td>
				<com:TTextBox ValidationGroup="ProjectForm" Columns="30" ID="adresaSpecialista" Text="<%= $this->adresaSpecialista->SafeText %>" cssClass="textfield" />
				
				
			</td>
		  </tr>



		  <tr>
			<th><%[ Město, PSČ ]%>:</th>
			<td>
					<com:TTextBox ValidationGroup="ProjectForm" Columns="30" ID="mestoSpecialista" Text="<%= $this->mestoSpecialista->SafeText %>" cssClass="textfield" /></td>
		  </tr>



		</table>

	</div>












</div>

















































<div class="tableColumn">

<!--captcha  -->




	<div class="tableForm">
		<table border="0" >


			<com:TControl Visible="<%= $this->UseCaptcha %>" >
					<tr>
						<th><%[ Zadejte znaky z obrázku ]%></th>

						<td>
							<com:TTextBox ID="CaptchaInput" cssClass="textfield" />

							<com:TCaptchaValidator CaptchaControl="Captcha"
												ControlToValidate="CaptchaInput"
												ValidationGroup="ProjectForm"
												Text="Zadejte znovu text z obrázku"
												EnableClientScript="true"
												cssClass="errorNote"
												ControlCssClass="errorField"
												ErrorMessage="" />
						</td>


					</tr>
					<tr>
						<th>&nbsp;</th>
						<td class="captchaCell">
							<com:TCaptcha ID="Captcha" />
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
	</div>


	





















<div class="tableColumn">
	<div class="tableForm">
		<table border="0">
		  <tr>
			<td>
		
			<com:TButton CausesValidation="true" ButtonType="Submit" ID="button" cssClass="button" Text="<%[Odeslat]%>" OnCommand="sendFormClicked" ValidationGroup="ProjectForm" />
		
			<!--  <com:TButton ButtonType="Reset" ID="button2" cssClass="button" Text="Vymazat formulář" />-->
		
			  </td>
			<td>&nbsp;</td>
		  </tr>
		</table>
	</div>	
</div>



















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