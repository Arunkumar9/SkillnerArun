<?php

//Prado::using('FShowContent');
//Prado::using('FShowContentPick');

class FShowContentColumn extends TTemplateControl 
{
	private $_typedatavalue;

	public function onPreInit($param) {
//		$this->dataBind();
                Prado::trace(__CLASS__.': '.$this->ContainerUid,'Json');
		parent::onPreInit($param);
	}
	
	
	/**
	 * @param string name of field from record
	 */
	public function getCssClass()
	{
		return $this->getViewState('CssClass','');
	}

	/**
	 * @param string name of field from record
	 */
	public function setCssClass($value)
	{
		$this->setViewState('CssClass',$value,'');
	}

	/**
	 * @param string name of field from record
	 */
	public function getContentRecordClass()
	{
		return $this->getViewState('ContentRecordClass','ContentRecord');
	}

	/**
	 * @param string name of field from record
	 */
	public function setContentRecordClass($value)
	{
		$this->setViewState('ContentRecordClass',$value,'ContentRecord');
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
			return $this->getViewState('ContentValueTag','div');
	}

	/**
	 * @param string name of tagname of directly encapsulate content record
	 */
	public function setContentValueTag($value)
	{
		$this->setViewState('ContentValueTag',$value,'div');
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
	 * @param boolean if editable output
	 */
	public function getIsEditable()
	{
		return $this->getViewState('IsEditable',true);
	}

	/**
	 * @param boolean if editable output
	 */
	public function setIsEditable($value)
	{
		$this->setViewState('IsEditable',TPropertyValue::ensureBoolean($value),true);
	}

	/**
	 * @param string name of field from record
	 */
	public function getContentColumn()
	{
		return $this->getViewState('ContentColumn','');
	}

	/**
	 * @param string name of field from record
	 */
	public function setContentColumn($value)
	{
		$this->setViewState('ContentColumn',$value,'');
		$this->findControl('ContentRepeater')->ContentColumn = $value;
	}

	/**
	 * @param Container uid
	 */
	public function getContainerUid()
	{
		return $this->getViewState('ContainerUid',null);
	}

	/**
	 * @param string name of field from record
	 */
	public function setContainerUid($value)
	{
		$this->setViewState('ContainerUid',$value,null);
		$this->findControl('ContentRepeater')->ContainerUid = $value;
	}

	/**
	 * @param integet length of perex para
	public function setLength($value)
	{
		$this->setViewState('Length',$value,'');
	}
	 */

	/**
	 * @return integet length of perex para
	public function getLength()
	{
		return $this->getViewState('Length',true);
	}

	 */
	/**
	 * @param string field name of $content->TypeData
	 */
	public function setTypeDataField($value)
	{
		$this->setViewState('TypeDataField',$value,null);
	}

	/**
	 * @return string field name of $content->TypeData
	 */
	public function getTypeDataField()
	{
		return $this->getViewState('TypeDataField',null);
	}
	
	/**
	 * @param string field name value of $content->TypeData
	 */
	public function setTypeDataValue($value)
	{
		$this->_typedatavalue = $value;
	}

	/**
	 * @return string field name value of $content->TypeData
	 */
	public function getTypeDataValue()
	{
		return $this->_typedatavalue;
	}
	
	/**
	 * @param string field name value of $content->TypeData
	 */
	public function setFactoryClass($value)
	{
		$this->setViewState('FactoryClass',$value);
	}

	/**
	 * @return string field name value of $content->TypeData
	 */
	public function getFactoryClass()
	{
		return $this->getViewState('FactoryClass');
	}
	

	public function ItemCreated($sender,$param) 
	{
	
		$item = $param->Item;
		//die('ItemCreated '.TVarDumper::dump($item));
		if ($item instanceof FShowContentPick) {	
			$item->TypeDataField=$this->TypeDataField;
			$item->TypeDataValue=$this->TypeDataValue;
			//$item->FactoryClass=$this->FactoryClass;
			$item->isEditable=$this->isEditable;
			$item->ContentRecordClass = $this->ContentRecordClass;
			$item->ContentFieldName = $this->ContentFieldName;
			$item->ContentValueTag = $this->ContentValueTag;
			$item->ContentEditClass = $this->ContentEditClass;
			$item->cssClass = $this->cssClass;
	//		$item->ID = $this->ContentRecordClass;
	//	die('ItemCreated '.TVarDumper::dump($item->Data));
			$item->setContent($item->Data);
		}
	}

}


