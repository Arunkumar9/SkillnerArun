<?php
class FShowContentPick extends FShowContent {
	
	
	public function pickContent($contents) {
		
		$field = $this->ContentFieldName;
		//die($this->TypeDataField . $this->TypeDataValue);
		if (is_array($contents) || $contents instanceof ArrayAccess) {

			if (!$this->TypeDataField && !$this->TypeDataValue)
				return $contents[0];
				
			foreach($contents as $content) {

				if ($this->TypeDataValue[0] == '!') {
					if ($content->TypeData[$this->TypeDataField]!=substr($this->TypeDataValue,1)) {
						return $content;				
					}
				} else {
					if ($content->TypeData[$this->TypeDataField]==$this->TypeDataValue) {
						return $content;				
					}
				}
			}

		} else {

			if (!$this->TypeDataField && !$this->TypeDataValue)
				return $contents;

			if ($this->TypeDataValue[0] == '!') {
				if ($contents->TypeData[$this->TypeDataField]!=substr($this->TypeDataValue,1)) {
					return $contents;				
				}
			} else {
				if ($contents->TypeData[$this->TypeDataField]==$this->TypeDataValue) {
					return $contents;				
				}
			}
		}
		return null;
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
		$this->setViewState('TypeDataField',$value);
	}

	/**
	 * @return string field name of $content->TypeData
	 */
	public function getTypeDataField()
	{
		return $this->getViewState('TypeDataField');
	}
	
	/**
	 * @param string field name value of $content->TypeData
	 */
	public function setTypeDataValue($value)
	{
		$this->setViewState('TypeDataValue',$value);
	}

	/**
	 * @return string field name value of $content->TypeData
	 */
	public function getTypeDataValue()
	{
		return $this->getViewState('TypeDataValue');
	}
	
}
