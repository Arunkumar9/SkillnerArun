<%@ MasterClass="Application.layout.eshopMaster" %>
<com:TContent ID="main">
	<com:FAncestorsHint Name="<%= $this->Product->name %>" ParentId="<%= $this->Request['parent'] %>" />
	<h1><%= $this->Product->name %></h1>
    <p><%= $this->Product->short_description %></p>

    <div class="detailLeft">
        <a href="" class="detailImage"><img src="<%= $this->Product->firstImageAsThumb155x1000 %>" ></a>
        <div class="icon recommend">Doporučujeme</div>
        <div class="icon inAction">Zboží v akci</div>
        <div class="icon new">Novinka</div>
        <div class="icon recommend">Jiná vlastnost</div>
    </div>

    <div class="detailRight">
      <%= $this->Product->description %>

      <br>
     <a href="<%= $this->getEshopDetailLink($this->Product->uid) %>"  class="cardEshopLinkBig">Chci koupit v e-shopu</a>

    </div>
</com:TContent> 				