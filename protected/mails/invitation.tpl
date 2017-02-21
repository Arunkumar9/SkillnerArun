<html>
<com:THead Title="Výzva k registraci na serveru vizitky.dm.cz" />
<body>
<com:TPanel>
<prop:Style
	Font.Name="Verdana"
	Font.Size="11px"
/>

	
Vážení přátelé,<br/>
<br/>
zasíláme Vám odkaz na službu "Zadávání vizitek", kde ....<br/><br/>

<com:THyperLink NavigateUrl="<%= $this->Page->Request->getBaseUrl().$this->getToken('users.RegisterInvitedUser','invite','+2 day') %>" target="_blank" Text="Registrujete se zde." />
<br/><br/>
Platnost tohoto odkazu jsou 2 dny.
<br/><br/>
S pozdravem<br/>
<%= Prado::getApplication()->User->FullName %>
</com:TPanel>
</body>
