<?php
class LanguageRedirect extends ContentRedirect implements IWidget
{
	private $_aculture;
	
	
	public function onLoad($param)
	{
		TControl::onLoad($param);
		if (strpos($this->AllowedCulture,FU::Culture())!==false)
			return;

		$manager = $this->getApplication()->Modules['cms'];
		if (!($uid = $this->getRedirectTo()))
			$uid = $manager->getContainer()->children[0]->uid;
		$url = $this->Page->getContainer($uid)->Href;//$manager->getUrl($uid);
//var_dump(FU::Culture());
//die($url);
		$this->getResponse()->redirect($url);
	}
	
	public function getAllowedCulture()
	{
		return $this->_aculture;
	}
	
	public function setAllowedCulture($value)
	{
		$this->_aculture = $value;
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
		'properties'=>array('allowedculture','redirectto'),		
		'fields' => array(
			array(
			'fieldLabel'=>$gw->getRecord()->Name.' / '.Prado::localize('allowed culture'),
			'name'=>$gw->getFieldName('allowedculture'),
			'editor'=>array('xtype'=>'textfield','width'=>400)
			),
			array(
			'fieldLabel'=>$gw->getRecord()->Name.' / '.Prado::localize('otherwise redirect to page uid'),
			'name'=>$gw->getFieldName('redirectto'),
			'editor'=>array('xtype'=>'textfield','width'=>400)
			)
			)
		);
	}
}

