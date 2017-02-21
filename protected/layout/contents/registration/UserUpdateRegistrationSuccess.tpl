<div class='<%= regForms %>'>
	<h1><%[ Registrace ]%></h1>
	<h2><%[ Vaše změny byly uloženy. Děkujeme ]%></h2>
	<br />
	<p>
		<span><%[ Pokračovat můžete ]%></span>
		<com:THyperLink>
			<prop:Text><%[ zde ]%></prop:Text>
			<prop:NavigateUrl><%= $this->Page->getContainer('Home')->HRef %></prop:NavigateUrl>
		</com:THyperLink>
	</p>
	<br />
</div>
