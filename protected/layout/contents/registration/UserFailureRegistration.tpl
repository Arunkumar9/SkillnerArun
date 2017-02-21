<div class='<%= regForms %>'>
	<h1><%[ Registrace se nezdařila ]%></h1>
	<h2><%[ Vaše registrace NEBYLA dokončena. ]%></h2>
	<br />
	<p>
<%[ Zkuste znovu nebo kontaktujte administrátora ]%>
		<com:THyperLink>
			<prop:Text><%= $this->Application->Parameters['siteAdmin'] %></prop:Text>
			<prop:NavigateUrl><%= $this->Application->Parameters['siteAdmin'] %></prop:NavigateUrl>
		</com:THyperLink>
	</p>
</div>
