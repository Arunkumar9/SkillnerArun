<html>
<com:THead Title="Schválení vizitky pro <%= $this->CustomData->bcard->first_name %> <%= $this->CustomData->bcard->last_name %> (id: <%= $this->CustomData->bcard->uid %>)" />
<body>
<com:TPanel>
<prop:Style
	Font.Name="Verdana"
	Font.Size="11px"
/>

	
Dobrý den,<br/>
<br/>
zasíláme Vám žádost o schválení vizitky pro <%= $this->CustomData->bcard->first_name %> <%= $this->CustomData->bcard->last_name %>.
Soubor PDF s vizitku (včetně jazykový variant na dalších stranách) je v příloze tohoto e-mailu
<br/><br/>

<b>Počet vizitek / <i>Number of business cards</i></b><br/>
		  Jednostranné vizitky / <i>One side business cards</i>
		  <ul class="pocet">
			<li><span>CZ:</span><span class="num"><%= $this->CustomData->bcard->num_cz %></span></li>
			<li><span>EN:</span><span class="num"><%= $this->CustomData->bcard->num_en %></li>
			<li><span>DE:</span><span class="num"><%= $this->CustomData->bcard->num_de %></li>
		  </ul>
		  <br />
		  Oboustranné vizitky / <i>Both side business cards</i>
		  <ul class="pocet">
			<li><span>CZ/EN:</span><span class="num"><%= $this->CustomData->bcard->num_cz_en %></li>
			<li><span>CZ/DE:</span><span class="num"><%= $this->CustomData->bcard->num_cz_de %></li>
			<li><span>EN/DE:</span><span class="num"><%= $this->CustomData->bcard->num_en_de %></li>
		  </ul>

<b>Schválení/zamítnutí prosím proveďte <com:THyperLink ID="approvalAddress" NavigateUrl="<%= $this->Page->Request->getBaseUrl().$this->getToken('bcards.ApproveBcard',$this->CustomData->bcard->uid,'+5 day') %>" Text="po kliknutí zde" />.</b> 
<br/>
<br/>
S pozdravem<br/>
Team DM.cz
<br/>
<br/>
<span style="font-size: 9px">Pokud nemáte Adobe Acrobat, stáhněte si jej <com:THyperLink NavigateUrl="http://www.adobe.com/uk/products/acrobat/readstep2.html?ogn=CZ-gntray_dl_get_reader_cz" Text="zde" /></span>

</com:TPanel>
</body>
