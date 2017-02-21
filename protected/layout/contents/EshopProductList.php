<?php

class EshopProductList extends ProductList {


    public function  onInit($param) {
        parent::onInit($param);
        $cache = $this->getPage()->PageCache;
        if ($cache)
            $this->getPage()->PageCache->Duration = 0;
    }

    public function  onLoad($param) {


        if (!$this->getPage()->getIsPostback())
        {
            Prado::trace('state '.$this->getSessionState('ListOrderField'),'Json');
            $this->ListOrderField = $this->getSessionState('ListOrderField');
            $this->ListOrderDir = $this->getSessionState('ListOrderDir');
           if ($ps = $this->getSessionState('PageSize')) {
                $this->PageSizeBox->SelectedValue = $ps;
            } else {
                $this->PageSizeBox->SelectedValue = $this->getPageSize();
            }
        }
 

        parent::onLoad($param);
    }
    
    public function populateData($force=true)
    {
     //       $ps = ($this->getPageSize()) ? $this->getPageSize() : $this->PageSizeBox->SelectedValue;
            $ps = $this->PageSizeBox->SelectedValue;

            if 	($this->Repeater->AllowPaging = ($ps>0))
                    $this->Repeater->PageSize = $ps;

            if ($force || !$this->getPage()->getIsPostBack())
            {
                $this->Repeater->DataSource = $this->getProducts();
                $this->Repeater->dataBind();
                $this->setSessionState('PageSize',$ps);

            }
    }

    
    
    public function getProducts($force=false)
    {
            //die('AA'.$this->getCategory());
            if ($force || $this->_products == null)
            {
Prado::trace(__CLASS__.' CAT '.$this->getCategory(),'Json');
                    $crit  = new TActiveRecordCriteria;
                    $crit->OrdersBy[$this->ListOrderField] = $this->ListOrderDir;
                    $crit->Condition = 'is_enabled = 1 AND uid IN (SELECT product_id FROM products_containers WHERE container_id = :cat)';
                    $crit->Parameters[':cat'] = $this->getCategory();
                    $this->setSessionState('ListOrderField',$this->getListOrderField());
                    $this->setSessionState('ListOrderDir',$this->getListOrderDir());
                    $this->_products = ProductRecord::finder()->findAll($crit);
            }
            return $this->_products ;
    }

    public function _insertToCartClicked($sender, $param) {
        if ($this->Page->IsCallback && !($param instanceof TCallbackEventParameter))
            return;
        $cart = $this->Application->Modules['cart']->getCart();
        $cart->Culture = $this->Application->Globalization->Culture;

        $row = $sender->getParent();
        $variant = $row->Data->DefaultVariant;

        $key = $variant->uid;
        $item = $cart->addNew($key);
        $item->Key = $key;
        $item->ProductId = $key;
        $item->Count = $item->Count + TPropertyValue::ensureInteger($row->CountToInsert->SafeText);
        $item->Price = $variant->PriceWithVAT;

        $cart->save();
        if ($sender->CustomData)
            $sender->Text = $sender->CustomData;
//		$this->Page->gotoPage('shop.OrderPage',array('stheme'=>$this->Request['stheme'],'parent'=>$this->getPage()->getContainer()->uid));
        $this->broadcastEvent('OnCartChanged', $sender, $param);
    }

    public function insertToCartClicked($sender, $param) {
        if ($this->Page->IsCallback && !($param instanceof TCallbackEventParameter))
            return;

        $this->updateShownPrice($sender, $param);
        $price = $this->getProduct()->getCalculatedVariantPrice();
        $cart = $this->Application->Modules['cart']->getCart();
        $cart->Culture = $this->Application->Globalization->Culture;


        $key = $this->getProduct()->uid . '|' . implode(',', $this->getSelectedVariantsUids());

        $item = $cart->addNew($key);
        $item->Key = $key;
        $item->ProductId = $this->getProduct()->uid;
        $item->Count = $item->Count + TPropertyValue::ensureInteger($this->CountToInsert->SafeText);
        $item->Price = $this->getProduct()->PriceWithVAT; //?$variant->price:$this->Product->price;
        $item->Variants = $this->getProduct()->getCurrentVariants();
        $cart->save();
        //  Prado::trace('Cart count '.$cart->count(),'Json');
        if ($sender->CustomData)
            $sender->Text = $sender->CustomData;
        $this->broadcastEvent('OnCartChanged', $sender, $param);
    }


    public function orderButtonClicked($sender, $param) {
        if ($this->Page->IsCallback && !($param instanceof TCallbackEventParameter))
            return;

        $this->setListOrderDir(str_replace('sort', '', $sender->ID));
        $this->setListOrderField($this->OrderBox->getSelectedValue());
        $this->_products = null;
        $this->populateData(true);
        if ($this->Page->IsCallback) {
            $this->sortDESC->render($param->getNewWriter());
            $this->sortASC->render($param->getNewWriter());
            $this->broadcastEvent('OnOrderChanged', $this, $param);
        }
    }

    public function orderBoxClicked($sender, $param) {
        if ($this->Page->IsCallback && !($param instanceof TCallbackEventParameter))
            return;

        $this->setListOrderField($sender->getSelectedValue());
        $this->_products = null;
        $this->populateData(true);
        if ($this->Page->IsCallback) {
            $this->Pager->render($param->getNewWriter());
            $this->broadcastEvent('OnOrderChanged', $this, $param);
        }
    }

    public function pageSizeBoxClicked($sender, $param) {
        if ($this->Page->IsCallback && !($param instanceof TCallbackEventParameter))
            return;

        $this->_products = null;
        $this->setSessionState('PageSize',$this->PageSizeBox->SelectedValue);
        $this->populateData(true);
        if ($this->Page->IsCallback) {
            $this->broadcastEvent('OnPageSizeChanged', $this, $param);
        }
    }


    /**
     * Event handler to the OnPageIndexChanged event of pagers.
     */
    public function pageChanged($sender,$param)
    {
Prado::trace('PAGER '.$param->NewPageIndex.' '.  get_class($param),'Json');
     //   if ($this->Page->IsCallback && !($param instanceof TCallbackEventParameter))
       // {
         //   return;
        //}


		//$this->populateData($param->NewPageIndex);
        $this->Repeater->DataSource = $this->getProducts(true);
            $this->Repeater->CurrentPageIndex=$param->NewPageIndex;
    	   $this->Repeater->dataBind();

           //$this->Pager->render($param->getNewWriter());
     //   $this->broadcastEvent('OnOrderChanged', $this, $param);

    }

    public function renderPageChanged($sender,$param)
    {
Prado::trace('PAGER '. get_class($param),'Json');
        $this->broadcastEvent('OnOrderChanged', $this, $param);

    }

    public function updateSortArrows()
    {

        $this->sortDESC->cssClass = str_replace('Inactive','',$this->sortDESC->cssClass);
        $this->sortASC->cssClass = str_replace('Inactive','',$this->sortASC->cssClass);
        if ($this->ListOrderDir == 'ASC')
        {
            $this->sortDESC->cssClass .=  'Inactive';
        }
        else
        {
            $this->sortASC->cssClass .=  'Inactive';
        }

    }
    public function  onPreRender($param) {
        parent::onPreRender($param);
        $this->updateSortArrows();
    }

    public function setListOrderDir($value) {
        $this->setViewState('ListOrderDir', $value, 'ASC');
    }

    public function setListOrderField($value) {
        //$this->setViewState('ListOrderField', $value, 'name');
        if ($value)
            $this->OrderBox->SelectedValue = $value;
    }

    public function getListOrderDir() {
        return $this->getViewState('ListOrderDir', 'ASC');
    }

    public function getListOrderField() {
        //return $this->getViewState('ListOrderField', 'name');
        $f = $this->OrderBox->SelectedValue;
        return ($f) ? $f : 'name';
    }



}
