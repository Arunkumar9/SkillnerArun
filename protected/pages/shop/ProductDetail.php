<?php

/**
 *  Page class for product detail page
 *
 */
class ProductDetail extends EshopPage {

    private $_product;
    private $_SelectedVariantsUids;

    /**
     * OnPreInit event manager, calls handleParent() to set parent for AncestorsHint
     * 
     * @param <type> $param 
     */
    public function onPreInit($param) {
        parent::onPreInit($param);
        $this->handleParent();
    }


    /**
     * OnLoad event manager, databinds all data based controls on page
     *
     * @param <type> $param
     */
    public function onLoad($param) {

        if (!$this->PageCache->ContentCached) {

            //Images data
            $images = $this->getProduct()->getImagesRecords();
            if (is_array($images)) {
                array_shift($images);
                //var_dump($images);die();
                $this->ImagesRepeater->DataSource = $images;
                $this->ImagesRepeater->databind();
            }

            //Icons data
            $icons = $this->getProduct()->getIconsRecords();
            if (is_array($icons)) {
                $this->IconsRepeater->DataSource = $icons;
                $this->IconsRepeater->databind();
            }

        }
        if (!$this->AttributesCache->ContentCached)
        {
            //Attributes data
            $attributes = $this->getProduct()->attributes;
            if (is_array($attributes)) {
                $this->AttributesRepeater->DataSource = $attributes;
                $this->AttributesRepeater->databind();
            }

        } else {
            Prado::trace('ATTRIBUTES CACHE HIT','Json');
        }

        if (!$this->RelatedCache->ContentCached)
        {
            //Related products data
            $related = $this->getProduct()->relatedproducts;
            if (is_array($related)) {
                foreach ($related as $k => $re) {
                    if ($re->uid == $this->getProduct()->uid) {
                        unset($related[$k]);
                        break;
                    }
                }
                if (count($related) > 0) {
                    $this->RelatedContainer->Visible = true;
                    $this->RelatedRepeater->DataSource = $related;
                    $this->RelatedRepeater->databind();
                } else {
                    $this->RelatedContainer->Visible = false;
                }
            }
        } else {
            Prado::trace('RELATED CACHE HIT','Json');
        }


        if (!$this->IsPostBack) {

            //variants data
            $variants = $this->Product->getGroupedVariants();
            //$defaultVariants = $this->Product->getDefaultVariants();
            if (is_array($variants)) {
                $this->VariantsRepeater->DataSource = $variants;
                $this->VariantsRepeater->databind();
            }
            $price = $this->getProduct()->getCalculatedVariantPrice(true);
        }

    }


    /**
     * Sets up parent for AncestorsHint baset either on $_GET['parent'] or $_SESSION['parent']
     * If not found uses first category of product
     */
    public function handleParent() {

        $parent = $this->Request['parent'];
        $parent = ($parent) ? $parent : $this->Session['parent'];

        $cat = $this->getProduct()->CategoriesAsList;
        if (!$parent || !is_array($cat) || !in_array($parent, $cat)) {
            $param = new TBroadcastEventParameter();
            $param->Parameter['parentid'] = $cat[0];
            $this->broadcastEvent('OnAncestorsHint', $this, $param);
            $this->Request['parent'] = $cat[0];
            $this->Session['parent'] = $cat[0];

        } else {
            $param = new TBroadcastEventParameter();
            $param->Parameter['parentid'] = $parent;
            $this->broadcastEvent('OnAncestorsHint', $this, $param);
            //$this->Request['parent'] = $cat[0];
            //$this->Session['parent'] = $cat[0];

        }
    }

    public function variantsDataBound($sender, $param) {
        $item = $param->getItem();
        $cri = new TActiveRecordCriteria();
        $cri->Condition = 'product_id = :uid AND definition_uid = :defuid AND discr="variant" ';
        $cri->OrdersBy = 'ordering';
        $cri->Parameters[':defuid'] = $item->getData()->definition_uid;
        $cri->Parameters[':uid'] = $item->getData()->product_id;
        $choices = AttributeRecord::finder()->findAll($cri);
        //die(TVarDumper::dump($choices));
        $item->Combo->DataSource = $choices;
        $item->Combo->databind();
        $i = 0;
        $variants = explode(',', $this->Request['variants']);

        $recs = AttributeRecord::finder()->findAllByPks($variants);
        $this->getProduct()->setCurrentVariants($recs);

        if (count($variants) > 0) {
            foreach ($choices as $k => $v) {
                if (in_array($v->uid, $variants)) {
                    $item->Combo->SelectedIndex = $i;
                    return;
                }
                $i++;
            }
        }
        $i = 0;
        foreach ($choices as $k => $v) {
            if ($v->is_default) {
                $item->Combo->SelectedIndex = $i;
                return;
            }
            $i++;
        }
    }

    /**
     *
     * @return ProductRecord
     */
    public function getProduct() {
        if ($this->_product == null) {
            $prodid = $this->Request['catid'];
            $this->_product = ProductRecord::finder()->findByPk($prodid);
        }
        return $this->_product;
    }

    public function getEshopDetailLink($id = null) {
        $id = (is_object($id)) ? $id->CatID : $id;
        return $this->getContainer()->getAbsoluteHref(true, array('catid' => $id));
    }

    protected function getSelectedVariantsUids() {
        if ($this->_SelectedVariantsUids === null) {

            $varItems = $this->VariantsRepeater->getItems();
            $uids = array();
            foreach ($varItems as $item)
                $uids[] = $item->Combo->SelectedValue;

            $this->_SelectedVariantsUids = $uids;
        }
        return $this->_SelectedVariantsUids;
    }

    protected function extractVariants() {
        $variants = array();
        foreach ($this->getProduct()->getCurrentVariants() as $v) {
            $variants[$v->uid] = array($v->name, $v->value);
        }
        return $variants;
    }

    public function updateShownPrice($sender, $param) {

        if ($this->Page->IsCallback && !($param instanceof TCallbackEventParameter))
            return;

        $uids = $this->getSelectedVariantsUids();

//Prado::trace('POSTED VARIANTS '.implode(',',$uids),'Json');

        $recs = AttributeRecord::finder()->findAllByPks($uids);
 Prado::trace('VARIANTS '.json_encode($recs),'Json');
        $this->getProduct()->setCurrentVariants($recs);

        $this->getProduct()->getCalculatedVariantPrice(true);
        // if ($sender->ID != "buttonInsertToCart")
        $this->broadcastEvent('OnVariantChanged', $sender, $param);
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

 /*   public function onPreRender($param) {
        $cs = $this->getClientScript();

        if (!$this->getIsCallback()) {
            //$cs->registerHeadScriptFile('JQueryTools',"http://cdn.jquerytools.org/1.2.3/full/jquery.tools.min.js");
            $cs->registerHeadScriptFile('JQuery', "http://code.jquery.com/jquery-1.4.2.min.js");
            $cs->registerHeadScriptFile('jQUery.Uniform', "/lib/jQuery.Uniform/jquery.uniform.min.js");
            $cs->registerStyleSheetFile('jQUery.Uniform', "/lib/jQuery.Uniform/css/uniform.default.css");
        } else {
            //$id = $this->ActiveReceiver->ClientID;
            // $this->getCallbackClient()->callClientFunction('Prado.UniForm',"#$id select, #$id input:text, #$id input:radio, #$id textarea");
        }
        parent::onPreRender($param);
    }
*/
}
