<div class='<%= regForms %>'>
	<h1><%[ Registrace ]%></h1>
	<h2><%[ Vaše registrace byla dokončena. Děkujeme ]%></h2>
	<br />
	<p>
		<span><%[ Přihlásit se můžete ]%></span>
		<com:THyperLink>
			<prop:Text><%[ zde ]%></prop:Text>
			<prop:NavigateUrl><%= $this->Page->getContainer('Login')->HRef %></prop:NavigateUrl>
		</com:THyperLink>
	</p>
	<br />
</div>
