<?php
  
class GadgetsList1 extends ProductList implements ITranslatableWidget
{
    protected $_gadgets;

    public function onLoad($param)
    {
	    parent::onLoad($param);
          //  $cs = $this->Page->ClientScript;
          //  $cs->registerStylesheetFile("Fresh:GadgetsList",$this->publishAsset("gadgetslist.css"));
	    if 	($this->Repeater->AllowPaging = ($this->getPageSize()>0))
			$this->Repeater->PageSize = $this->getPageSize();
            $this->Repeater->DataSource = $this->getGadgets();
            $this->Repeater->dataBind();
    }

    public function onPreRender($param)
    {
	    parent::onPreRender($param);
            $this->generateStyleSheet();
    }


	
	public function getGadgets()
	{
		if ($this->_gadgets == null)
                {
                    $cri = new TActiveRecordCriteria();
                    $cri->setCondition('uid IN (SELECT gc.product_id FROM gadgets_categories gc WHERE gc.category_id = :category) AND is_enabled = 1');
                    $cri->OrdersBy['ordering'] = 'ASC';
                  //  if ($this->getPageSize()>0)
                     //   $cri->setLimit($this->getPageSize());
                    $cri->Parameters[':category']=$this->getCategory();
                    $this->_gadgets = GadgetRecord::finder()->findAll($cri);
                }
		return $this->_gadgets ;
	}


        public function generateStyleSheet()
        {

            //$styles = "gadget { background-position: right; }\n gadget:hover { background-position: left; }\n";
            foreach($this->getGadgets() as $g)
            {
                 $styles .= ".g{$g->uid} { background-image: url('{$g->FirstImage}') }\n";
            }

            $sheet = new TStyleSheet();
            $sheet->getControls()->add($styles);

            $this->getPage()->getHead()->getControls()->add($sheet);
        }
    /**
     * Event handler to the OnPageIndexChanged event of pagers.
     */
    public function pageChanged($sender,$param)
    {
		//$this->populateData($param->NewPageIndex);
       $this->Repeater->DataSource = $this->getGadgets();
	   $this->Repeater->CurrentPageIndex=$param->NewPageIndex;
	   $this->Repeater->dataBind();
    }

}
