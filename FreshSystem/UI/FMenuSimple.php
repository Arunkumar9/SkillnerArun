<?php





class FMenuSimple extends TDataBoundControl implements IWidget
{

	private $_containerRecord;
	private $_JustLinks=false;
	private $_HSLinks=false;
	private $_containeruid = null;
	private $_Separator = null;

	public function onPreRender($param)
	{		
			
		parent::onPreRender($param);

                $contents = $this->Container->children;
                if ($contents) {
                        $this->Visible = true;
                        $this->DataSource=$contents;
                        $this->dataBind();
                } else {
                        $this->Visible = false;
                }
			
	
	}

/*        public function onPreRender($param)
        {
            parent::onPreRender($param);
        }
*/
	public function getContainer()
	{
		$uid = ($this->getContainerUid()) ? ($this->getContainerUid()) : 'this:';
		return $this->Page->getContainer($uid);
	}


	/**
	 * @param Container uid
	 */
	public function getContainerUid()
	{
		return $this->_containeruid;
	}

	/**
	 * @param string name of field from record
	 */
	public function setContainerUid($value)
	{
		$this->_containeruid = $value;
	}

	/**
	 * @param just links or ul list
	 */
	public function getJustLinks()
	{
		return $this->_JustLinks;
	}

	/**
	 * @param just links or ul list
	 */
	public function setJustLinks($value)
	{
                Prado::Trace(__CLASS__.' setJustLinks '.TPropertyValue::ensureBoolean($value),'Json' );
		$this->_JustLinks = TPropertyValue::ensureBoolean($value);
	}

	/**
	 * @param highslide links ?
	 */
	public function getHSLinks()
	{
		return $this->_HSLinks;
	}

	/**
	 * @param highslide links ?
	 */
	public function setHSLinks($value)
	{
		$this->_HSLinks = TPropertyValue::ensureBoolean($value);
	}

	/**
	 * @param just links or ul list
	 */
	public function getSeparator()
	{
		return $this->_Separator;
	}

	/**
	 * @param just links or ul list
	 */
	public function setSeparator($value)
	{
		$this->_Separator = $value;
	}

        public function performDataBinding($data)
        {

            if ($this->getHSLinks()) {
                $cs = $this->getPage()->getClientScript();
                $rand = uniqid('cfg');
                $js = "var $rand = { objectType: 'ajax', allowSizeReduction: true, wrapperClassName: 'draggable-header no-footer',
                useControls: true,outlineType: 'rounded-white',headingEval : 'this.thumb.title',slideshowGroup: 'pokus',maincontentText: ''};";
                $cs->registerBeginScript($rand,$js);
            }
            $len = count($data);
            Prado::Trace(__CLASS__.' performDataBinding '.$this->JustLinks,'Json' );
            if (!$this->getJustLinks())
                    $this->getControls()->add('<ul>');
            foreach ($data as $key => $value) {

               $len--;

                if ($value instanceof FTypedActiveRecord)
                {
                    $td = $value->getTypeData();
                    if (($td['notInMenu'] || $td['service'] || $td['hidden'] || $td['language']) && !$this->getHSLinks() && $td['pagePath']!='BarePage')
                        continue;
                }

                if (!$this->getJustLinks())
                        $this->getControls()->add('<li>');

                $item = new FCmsLink();
                $item->CmsLink=$value->uid ;
                if ($value->uid == $this->Page->Container->uid)
                       $item->CssClass = 'current';

                if ($this->getHSLinks()) {

                    if ($td && $td['pagePath']=='BarePage')
                        $item->Attributes['OnClick'] = 'return hs.htmlExpand(this, '.$rand.');';

                }

                $this->getControls()->add($item);

                if (!$this->getJustLinks())
                        $this->getControls()->add('</li>');

                if ($len>0 && $this->getSeparator())
                    $this->getControls()->add($this->getSeparator());

            }
            if (!$this->getJustLinks())
                    $this->getControls()->add('</ul>');
        }

        /**
	 * Returns the tag name used for this control.
	 * By default, the tag name is 'span'.
	 * You can override this method to provide customized tag names.
	 * @return string tag name of the control to be rendered
	 */
	protected function getTagName()
	{
		return 'div';
	}

        /**
	 * Renders the reader.
	 * This method overrides the parent implementation by rendering the body
	 * content as the whole presentation of the repeater. Outer tag is not rendered.
	 * @param THtmlWriter writer
	 */
	public function render($writer)
	{
            $this->renderBeginTag($writer);
        
            $this->renderContents($writer);
            
            $this->renderEndTag($writer);

	}

        public function wiLoadData($gw)
	{
		return false;
	}

	public function wiSetData($content,$gw)
	{
		return false;
	}

	public function wiInjectData($gw)
	{
		$gw->getData();
	}

	public function wiGetMetaData($gw)
	{
		return array(
		'properties'=>array('containeruid','separator','cssclass','justlinks','hslinks'),
                'columns'=>1,
		'fields' => array(
			array(
			'fieldLabel'=>$gw->getRecord()->Name.' / '.Prado::localize('Container'),
			'name'=>$gw->getFieldName('containeruid'),
			'editor'=>array('xtype'=>'textfield','width'=>400)
			),
			array(
			'fieldLabel'=>$gw->getRecord()->Name.' / '.Prado::localize('Separator'),
			'name'=>$gw->getFieldName('separator'),
			'editor'=>array('xtype'=>'textfield','width'=>400)
			),
			array(
			'fieldLabel'=>$gw->getRecord()->Name.' / '.Prado::localize('Css class'),
			'name'=>$gw->getFieldName('cssclass'),
			'editor'=>array('xtype'=>'textfield','width'=>400)
			),
			array(
			'fieldLabel'=>$gw->getRecord()->Name.' / '.Prado::localize('Just simple links'),
			'name'=>$gw->getFieldName('justlinks'),
			'editor'=>array('xtype'=>'xcheckbox')
			),
			array(
			'fieldLabel'=>$gw->getRecord()->Name.' / '.Prado::localize('Highslide links'),
			'name'=>$gw->getFieldName('hslinks'),
			'editor'=>array('xtype'=>'xcheckbox')
			)
			)
		);
	}

}
