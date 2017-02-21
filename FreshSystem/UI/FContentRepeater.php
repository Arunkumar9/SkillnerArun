<?php





class FContentRepeater extends TRepeater
{

	private $_containerRecord;
	private $_userlevel=null;
	private $_code=null;
	private $_containeruid = null;
	private $_contentcolumn = null;

	public function onInit($param)	
	{		
			
		parent::onInit($param);		

//		if (!$this->Page->IsPostBack )
//		{			
//echo 
Prado::Trace('Container '.$this->ContentColumn,'Json');
			if ($this->ContentColumn == '' || $this->ContentColumn === null)
			{
				$contents = $this->Container->contents;

			} else {
				$containers = $this->Container->children;
				foreach ($containers as $container)
				{
					if (($container->name == $this->ContentColumn || $container->uid == $this->ContentColumn) && 
						 $container->type_id == 'ContentColumn'
						)
					{
						$contents = $container->contents;
						break;
					}
				}
			}
				
			//Prado::Trace('FContentRepeater::contents '.TVarDumper::dump($contents));			
//						echo TVarDumper::dump($contents);
	//					die('---');
//if ($this->ContentColumn == 'left')
//	Prado::Trace('FContentRepeater::contents '.TVarDumper::dump($contents));
//Prado::Trace('Container '.$this->ContentColumn,'Json');			
			if ($contents) {
				$this->Visible = true;
				$this->DataSource=$contents; 			
				$this->dataBind();		
			} else {
				$this->Visible = false;
			}
			
//		}	
	
	}

	public function getContainer()
	{
		Prado::Trace('FContentRepeater::container '.$this->getContainerUid(),'Json' );//.' '.TVarDumper::dump($this->Page->getContainer($this->getContainerUid())));
		return $this->Page->getContainer($this->getContainerUid());
	}

	/**
	 * @param string name of field from record
	 */
	public function getContentColumn()
	{
		return $this->_contentcolumn;
//		return $this->getViewState('ContentColumn','');
	}

	/**
	 * @param string name of field from record
	 */
	public function setContentColumn($value)
	{
		$this->_contentcolumn = $value;
//		$this->setViewState('ContentColumn',$value,'');
	}

	/**
	 * @param Container uid
	 */
	public function getContainerUid()
	{
		return $this->_containeruid;
//		return $this->getViewState('ContainerUid',null);
	}

	/**
	 * @param string name of field from record
	 */
	public function setContainerUid($value)
	{
//		Prado::Trace('FContentRepeater::container set '.$value );//.' '.TVarDumper::dump($this->Page->getContainer($this->getContainerUid())));			
		$this->_containeruid = $value;
//		$this->setViewState('ContainerUid',$value,null);
	}
}
