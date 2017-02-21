<html>
<com:THead >
	<prop:Title>
		Nová otázka od <%= $this->Context->QuestionContact->SafeText %>
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
<com:TPanel>
	<prop:Style
		Font.Name="Verdana"
	/>
	

				<h2>Nová otázka</h2>
				Od: <%= $this->Context->QuestionContact->SafeText %>
				<br />
				<br />
				<%= nl2br($this->Page->CustomData->QuestionText->SafeText) %>			
	
				
				
</com:TPanel>
</body>
</html>
