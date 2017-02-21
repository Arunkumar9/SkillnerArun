<com:FActivePanelReceiver ID="CartBoxPanel" ListenOn="OnInsertToCart,OnFinalizeOrder,OnCartChanged" tagName="div" cssClass="<%= $this->CssClass %> topControlsSecondLine">
            	<a href="#" class="topBasketLink"></a>
            	<strong><%= FU::NumericVariants($this->getCartCount(),'položka','položky','položek') %></strong> | 
                <strong><%= $this->Application->getModule('cart')->sumCart() %> Kč</strong> s DPH<br />
                <com:FCmsLink CmsLink="checkout" Text="<%[ Pokladna ]%>" /> |
                <com:TLinkButton OnClick="emptyCartClicked" Text="<%[ Vysypat košík ]%>" />
</com:FActivePanelReceiver>
