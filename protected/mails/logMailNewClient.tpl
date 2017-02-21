<html>


<!--<style>
	body, table td {font-family: Verdana, Tahoma, Arial; font-size: 8pt}
	table td, table th  {padding-left: 10px; padding-right: 10px}
    h1 {font-family: Verdana, Tahoma, Arial; font-size: 14pt; color: #7AB01A; margin-bottom: 5px }
    h2 {font-family: Verdana, Tahoma, Arial; font-size: 12pt; color: #6AAC28 }
	h3 {font-family: Verdana, Tahoma, Arial; font-size: 10pt; color: #8DCA1E; margin-bottom: 3px }        
    td {font-family: Verdana, Tahoma, Arial; font-size: 10pt}
    th { text-align:  left; }
    
</style>
-->
<com:THead >
	<prop:Title>
		Svět zdraví - nová KNT analýza na pobočce: <%= $this->Page->CustomData->Branch->name %>
	</prop:Title>
	<com:TStyleSheet>
	body, table td {font-family: Verdana, Tahoma, Arial; font-size: 10pt}
	table td, table th  {padding-left: 10px; padding-right: 10px}
    h1 {font-family: Verdana, Tahoma, Arial; font-size: 14pt; color: #7AB01A; margin-bottom: 5px }
    h2 {font-family: Verdana, Tahoma, Arial; font-size: 12pt; color: #6AAC28 }
	h3 {font-family: Verdana, Tahoma, Arial; font-size: 10pt; color: #8DCA1E; margin-bottom: 3px }        
    td {font-family: Verdana, Tahoma, Arial; font-size: 10pt}
    th { text-align:  left; }
    
    
	</com:TStyleSheet>
</com:THead>
<body>
<com:TPanel>
<prop:Style
	Font.Name="Verdana"
/>
	

				<h1>Svět zdraví<sup>®</sup> - nová KNT analýza </h1>
				

				
<p>				Pobočka: <%= $this->Page->CustomData->Branch->name %></p>

<p>                KNT analýzu provedl: <%= Prado::getApplication()->getUser()->Name %></p>

<p>                Přiřazený specialista: <%= $this->Page->CustomData->Consultant->Name %></p>

<p>                Jméno klienta: <%= $this->Page->CustomData->Name %></p>

<p>                Datum generovani této zprávy: <com:TDateFormat /></p>

<p>                Datum a čas vytvoření: <%= $this->Page->CustomData->UpdatedAsDateTimeF %></p>





				
				
	<br><br>

	Tato zpráva je generována automaticky systémem FreshAdmin, instance KNT - Svět zdraví. Neodpovídejte na tuto zprávu.<br>
<br>
<br>
<br>
<br>

	<img src="http://www.nutricni-typologie.cz/themes/Base/images/logoMail.jpg">
    <p><br>
       	<br>
       	<br>
	</p>
</com:TPanel>
</body>
