<div class="<%= $this->CssClass %>">
      <h4><com:FCmsLiteral CmsLink="<%= $this->ContainerUid %>" /></h4>
      <com:FMenuSimple ID="menu" JustLinks="true" ContainerUid="<%= $this->ContainerUid %>" CssClass="<%= $this->menuCls %>" />
</div>
<com:FWidgetControl ID="MetaData">
editors:
    cssClass: Css class
    menuCls: Css class menu
    containerUid: Container Uid
</com:FWidgetControl>