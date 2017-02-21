<com:TControl ID="EmailSuccess" >
    <div class="contentOfset">    
	<p>V následujících několika minutách Vám bude automaticky tato objednávka potvrzena 
	na vaši e-mailovou adresu. S dotazy či připomínkami se prosím obraťte 
	na <a href="mailto:info@sedlarstvi-libich.cz ">info@sedlarstvi-libich.cz </a> nebo použijte některý z dalších kontaktů v sekci <strong>KONTAKTY</strong>.</p>
	</div>
</com:TControl>
<com:TControl ID="EmailError" Visible="false">
	    <div class="contentOfset">    Zaslání objednávky selhalo ... (layout/contents/shop/FinalNotice.tpl) </div>
</com:TControl>

<br/><br/>
<div class="contentOfset">
	<a href="<%= $this->Page->getContainer(59)->Href %>" class="buttZpet byLink"></a>
</div>