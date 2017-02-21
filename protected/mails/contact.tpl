<html>
<com:THead >
	<prop:Title>
		Nový dotazník od <%= $this->Context->jmeno->SafeText.' '.$this->Context->prijmeni->SafeText %>
	</prop:Title>
	<com:TStyleSheet>
	body, table td {font-family: Verdana, Tahoma, Arial; font-size: 8pt}
	table td, table th  {padding-left: 10px; padding-right: 10px}
    h1 {font-family: Verdana, Tahoma, Arial; font-size: 14pt; color: #006600; margin-bottom: 5px }
    h2 {font-family: Verdana, Tahoma, Arial; font-size: 12pt; color: #009900 }
	h3 {font-family: Verdana, Tahoma, Arial; font-size: 10pt; color: #33CC33; margin-bottom: 3px }        
    td {font-family: Verdana, Tahoma, Arial; font-size: 10pt}
    th { text-align:  left; }
    
    
	</com:TStyleSheet>
</com:THead>
<body>
<com:TForm>
<com:TPanel>
	<prop:Style
		Font.Name="Verdana"
	/>
	

<h1>Zpráva z www</h1>
<br />

<table border="0" width="100%">
  <tr>
  	<td>Příjmení</td>
  	<td><com:TTextBox ID="prijmeni" Text="<%= $this->Context->prijmeni->SafeText %>" cssClass="textfield" /></td>
  	</tr>
  <tr>
    <td>Jméno</td>
    <td><com:TTextBox ID="jmeno" Text="<%= $this->Context->jmeno->SafeText %>" cssClass="textfield" /></td>
  </tr>
  <tr>
  	<td>E-mail</td>
  	<td><com:TTextBox ID="email" Text="<%= $this->Context->email->SafeText %>" cssClass="textfield" /></td>
  	</tr>
  <tr>
  	<td>Zpráva</td>
  	<td><com:TTextBox ID="zprava" Text="<%= $this->Context->zprava->SafeText %>" cssClass="textfield" /></td>
  	</tr>
</table>
<br />
<br />
<br />
				
				
</com:TPanel>
</com:TForm>
</body>
</html>
