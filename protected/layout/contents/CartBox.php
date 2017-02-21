<?php
Prado::using("FreshSystem.FShoppingCartModule");
Prado::using("Application.common.CartItem");
class CartBox extends FStyledTemplateControl {
	
        public function getCartCount()
        {
               return $this->Application->getModule('cart')->Cart->count();
        }

        
        public function emptyCartClicked($sender, $param)
        {
                $this->Application->getModule('cart')->Cart->clear();
        }

}
