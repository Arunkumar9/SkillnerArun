<html>
<com:THead Title="Vizitka pro <%= $this->CustomData->bcard->first_name %> <%= $this->CustomData->bcard->last_name %> schválena (id: <%= $this->CustomData->bcard->uid %>)" />
<body>
<com:TPanel>
<prop:Style
	Font.Name="Verdana"
	Font.Size="11px"
/>

	

Dobrý den,<br/>
<br/>
žádost o vizitku pro <%= $this->CustomData->bcard->first_name %> <%= $this->CustomData->bcard->last_name %> (id: <%= $this->CustomData->bcard->uid %>) <b>byla schválena</b>.

<br/>
<br/>
S pozdravem<br/>
Team DM.cz
<br/>
<br/>

</com:TPanel>
</body>
