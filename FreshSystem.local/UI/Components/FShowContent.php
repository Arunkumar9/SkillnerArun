<?php



class FShowContent extends TWebControl implements IDataRenderer //, INamingContainer
{
	const FACTORY_PREFIX = 'FConvertor';

	protected $_content=null;
	protected $_data=null;
	protected $_factoryClass=null;
	
	

	public function onInit($param)
	{
		parent::onInit($param);
		$this->ensureChildControls();

/*
		if ($this->IsEditable)
		{
			$cs = $this->Page->ClientScript;
			$cs->registerStylesheetFile("Fresh.FChooser",$this->publishAsset("FChooser.css"));
			$cs->registerScriptFile("Fresh.FChooser",$this->publishAsset("FChooser.js"));
			$cs->registerScriptFile("Fresh.LinkChooser",$this->publishAsset("FLinkChooser.js"));
			$cs->registerScriptFile("Fresh.FExtInlineEdit",$this->publishAsset("FExtInlineEdit.js"));
		}

*/	}

/*
	public function getForControl()
	{
		return '';
	}

*/	
	public function getTagName()
	{
		if ($this->IsEditable) 
			return 'div';
		else
			return 'blabla';//$this->getContentValueTag();
	}
	
	public function getCssClass()
	{
		$cssClass = (parent::getCssClass())?parent::getCssClass():FU::Ini('Content.DefaultCssClass');
		return $cssClass.' '.$cssClass.$this->Content->type->name.(($this->IsEditable)?' fresh-editable':''); 
	}
	
	/**
	 * Renders the control.
	 * This method overrides the parent implementation by replacing it with
	 * the following sequence:
	 * - {@link renderBeginTag}
	 * - {@link renderContents}
	 * - {@link renderEndTag}
	 * @param THtmlWriter the writer used for the rendering purpose
	 */
	public function render($writer)
	{
		if ($this->Content instanceof TActiveRecord)
			$this->renderContents($writer);
//			parent::render($writer);
	}
	
	/**
	 * Renders the body content of the content.
	 * @param THtmlWriter the renderer
	 */
	public function renderContents($writer)
	{
		
/*
		$text = "";
		if ($this->IsEditable) {
			$cfg = array(
				'RecordClass'=>$this->ContentRecordClass,
				'Uid'=>$this->Content->uid,
				'Field'=>$this->ContentFieldName,
				'Name'=>$this->Content->name,
				'Type'=>$this->Type,
				'Desc'=>$this->Content->type->description
			); 
			$text .= '<script type="application/json">'.json_encode($cfg)."</script>"; 
			$text .= "<".$this->getContentValueTag()." class='fresh-content-value'>";
			$writer->write($text);
		} 

//		$text .= $this->getText();
*/		$this->renderChildren($writer);

/*		if ($this->IsEditable) {
			$text = "</".$this->getContentValueTag().">";		
			$writer->write($text);
		}  */
	}

	protected function addAttributesToRender($writer)
	{
		parent::addAttributesToRender($writer);
		if ($this->getClientID() != '' && $this->IsEditable) 
			$writer->addAttribute('id',$this->getClientID());
		else
			$writer->removeAttribute('id');
			
		if ($this->getCssClass() != '')
			$writer->addAttribute('class',$this->getCssClass());
	}

	/**
	 * @param string name of field from record
	 */
	public function getContentRecordClass()
	{
		return $this->getViewState('ContentRecordClass',$this->ID);
	}

	/**
	 * @param string name of field from record
	 */
	public function setContentRecordClass($value)
	{
		$this->setViewState('ContentRecordClass',$value,$this->ID);
	}

	/**
	 * @param string name of field from record
	 */
	public function getContentFieldName()
	{
		return $this->getViewState('ContentFieldName','data');
	}

	/**
	 * @param string name of field from record
	 */
	public function setContentFieldName($value)
	{
		$this->setViewState('ContentFieldName',$value,'data');
	}

	/**
	 * @param string name of tagname of directly encapsulate content record
	 */
	public function getContentValueTag()
	{
		$cvt = $this->getViewState('ContentValueTag');
		
		if ($cvt)
			return $cvt;
		elseif (isset($this->TypeData['ContentValueTag']))
			return $this->TypeData['ContentValueTag'];
		else
			return 'div';//return $this->getViewState('ContentValueTag');
	}

	/**
	 * @param string name of tagname of directly encapsulate content record
	 */
	public function setContentValueTag($value)
	{
		$this->setViewState('ContentValueTag',$value,null);
	}

	/**
	 * @param string name of JS class for inline editing
	 */
	public function getContentEditClass()
	{
		return $this->getViewState('ContentEditClass','');
	}

	/**
	 * @param string name of JS class for inline editing
	 */
	public function setContentEditClass($value)
	{
		$this->setViewState('ContentEditClass',$value,'');
	}

	/**
	 * @param boolean whether convert text before output
	 */
	public function getConvertContent()
	{
		return $this->getViewState('ConvertContent',true);
	}

	/**
	 * @param boolean whether convert text before output
	 */
	public function setConvertContent($value)
	{
		$this->setViewState('ConvertContent',TPropertyValue::ensureBoolean($value),true);
	}

	/**
	 * @param boolean if editable output
	 */
	public function getIsEditable()
	{
		$e = $this->getViewState('IsEditable',true);
		return (false && $e && $this->Page->IsEditable );//&& $this->ID);
	}

	/**
	 * @param boolean if editable output
	 */
	public function setIsEditable($value)
	{
		$this->setViewState('IsEditable',TPropertyValue::ensureBoolean($value),true);
	}

	/**
	 * @return string type of content
	 */
	public function getType()
	{
		$typeData = $this->TypeData; //FU::readValues($this->Content->type->data);
		if (isset($typeData['ContentEditClass']))
			return $typeData['ContentEditClass'];

		elseif ($this->ContentEditClass)
			return $this->ContentEditClass;

		else
			return $this->Content->type->name;
	}

	/**
	 * @return string the text value of the label
	 */
	public function getText()
	{
		return $this->getViewState('Text','');
//		if ($this->getConvertContent()) 
///			return $this->convertContent($text);
//		else 
//			return $text;
	}

	public function setContent($value)
	{
		$value = $this->pickContent($value);

		if (!$this->_content && $value instanceof TActiveRecord) {
	//		if (!$value->uid)
	//				throw new TInvalidDataValueException('UID not set');
			$this->setViewState('ContentUid',$value->uid,'');
			//Prado::Trace(__CLASS__.' '.__LINE__.": ".$value->uid);
			$field = $this->ContentFieldName;
			Prado::Trace(__CLASS__.' '.__LINE__.": ".$value->uid.' '.$field,'Json');
			$this->setText($value->$field);
			$finder = call_user_func(array($this->ContentRecordClass, 'finder'));
//			$finder = TActiveRecord::finder($this->ContentRecordClass);
			$this->_content = $finder->findByPk($value->uid);//$value;
		}
	}
	
	
	public function getContent()
	{
		if ($this->_content === null)
		{
			$uid = $this->getViewState('ContentUid','');
			//if (!$uid)
				//throw new TInvalidDataValueException('UID not set');
			$finder = call_user_func(array($this->ContentRecordClass, 'finder'));
	//		$finder = TActiveRecord::finder($this->ContentRecordClass);
			$this->_content = $this->pickContent($finder->findByPk($uid));
			$field = $this->ContentFieldName;
			//$this->setText($this->_content->$field);
			Prado::Trace(__CLASS__.' '.__LINE__.": ".$uid.$this->_content->$field,'Json');
		}
		return $this->_content;
	}


	public function pickContent($value) {
		if (is_array($value) || $value instanceof ArrayAccess) {
			return $value[0];
		} else {
			return $value;
		}
	}

	public function getTypeData()
	{
		return $this->Content->TypeData;
	}


/*
	public function getFactoryClass($name=null)
	{
		if ($this->_factoryClass === null) 
		{
			$name = ($name===null) ? $this->Content->type->name : $name;
			$this->_factoryClass = self::FACTORY_PREFIX . $name;
			if (!class_exists($this->_factoryClass,true))
				$this->_factoryClass = self::FACTORY_PREFIX . "Base";
			
		}
		return $this->_factoryClass;
	}

	public function setFactoryClass($name)
	{
		if ($name !== null)
			$this->getFactoryClass($name);
	}
	public function convertContent($text)
	{
		
		$type = $this->getFactoryClass();
		if (class_exists($type,false))
			return call_user_func(array($type, 'Out'),$text,$this->Content);
		else 
			return $text;

	}

*/
	/**
	 * Performs the OnInit step for the control and all its child controls.
	 * This method overrides the parent implementation
	 * by ensuring child controls are created first.
	 * Only framework developers should use this method.
	 * @param TControl the naming container control
	 */
	protected function initRecursive($namingContainer=null)
	{
		$this->ensureChildControls();
		parent::initRecursive($namingContainer);
	}
	
	public function createChildControls()
	{
		$this->databind();
		$this->createDynamicChildControls();
		parent::createChildControls();
	}

	public function createDynamicChildControls()
	{
		//$control = call_user_func(array($this->getFactoryClass(), 'Factory'),$this);
		//Prado::Trace(__LINE__.": ".$this->Content->uid.TVarDumper::dump($this->Content).' '.$field,'Json');

		if ($this->getContent() instanceof ContainerRecord)
			return;
		$gw = new FWidgetGateway($this->getContent());
		$control = $gw->getComponent($this->getControls());
		//$this->getControls()->add($control);
	}
	
	/**
	 * @param string the text value of the label
	 */
	public function setText($value)
	{
		$this->setViewState('Text',$value,'');
	}

	/**
	 * Returns the text value of the label.
	 * This method is required by {@link IDataRenderer}.
	 * It is the same as {@link getText()}.
	 * @return string the text value of the label
	 * @see getText
	 * @since 3.1.0
	 */
	public function getData()
	{
		return $this->_data;
	}

	/**
	 * Sets the text value of the label.
	 * This method is required by {@link IDataRenderer}.
	 * It is the same as {@link setText()}.
	 * @param string the text value of the label
	 * @see setText
	 * @since 3.1.0
	 */
	public function setData($value)
	{
		$this->_data=$value;
	}


}


