<?php





class FContentReader extends TDataBoundControl
{

	private $_userlevel=null;
	private $_code=null;
	private $_containeruid = null;
	private $_contentcolumn = null;
        private $_container = null;

        private $_duration=3600;
        private $_key;

	/**
	 * @return integer number of seconds that the data can remain in cache. Defaults to 60 seconds.
	 * Note, if cache dependency changes or cache space is limited,
	 * the data may be purged out of cache earlier.
	 */
	public function getDuration()
	{
		return $this->_duration;
	}

	public function onInit($param)	
	{		
			
		parent::onInit($param);		

                $this->readContents();
	
	}

        protected function readContents()
        {
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
				

                        if ($contents) {
				$this->Visible = true;
				$this->DataSource=$contents; 			
				$this->dataBind();		
			} else {
				$this->Visible = false;
			}
            
        }

	public function getContainer()
	{
		Prado::Trace('FContentRepeater::container '.$this->getContainerUid().' / '.$this->_container,'Json' );//.' '.TVarDumper::dump($this->Page->getContainer($this->getContainerUid())));
		return ($this->_container) ? $this->_container : $this->getPage()->getContainer($this->getContainerUid());
	}

	public function setContainer($value)
	{
		$this->_container = $value;
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

        public function performDataBinding($data)
        {
            foreach ($data as $key => $value) {
                //$item = new FShowContent();
                //$item->IsEditable="true" ;
                //$item->ContentRecordClass="ContentRecord";
                //$item->ContentFieldName="data";
                //$item->cssClass="Content";
               // $item->setContent($value);
                if($this->getApplication()->getMode()===TApplicationMode::Debug)
                     $this->getControls()->add("\n<!-- START uid: {$value->uid}, name: {$value->name}, class: {$value->TypeData['ContentEditClass']} --> \n");

               
                    $this->factory($value);

                if($this->getApplication()->getMode()===TApplicationMode::Debug)
                     $this->getControls()->add("\n<!-- END uid: {$value->uid} --> \n");
            }
        }

        protected function factory($content)
        {
		if ($content instanceof ContainerRecord)
			return false;
		$gw = new FWidgetGateway($content);
		$control = $gw->getComponent($this->getControls());
        }

        /**
	 * Renders the reader.
	 * This method overrides the parent implementation by rendering the body
	 * content as the whole presentation of the repeater. Outer tag is not rendered.
	 * @param THtmlWriter writer
	 */
	public function render($writer)
	{
            $this->renderContents($writer);
	}
	
	public function getKey() {

                $rq = $this->getRequest();
                //$key = $rq->itemAt("uid")."|";
                $key .= $rq->itemAt("catid")."|";
                $key .= $rq->itemAt("newsid")."|";
                $key .= $rq->itemAt("vid")."|";
                $key .= $rq->itemAt("category")."|";
                $key .= $rq->itemAt("code")."|";
                if ($c = $this->getApplication()->getModule('cms')->getContainer())
                    $key .= $c->uid."|";
                $key .= ($this->getApplication()->Parameters['translatable']) ? $this->getApplication()->getGlobalization()->getCulture() : '';
                //if ($pc = $this->getPage()->PageCache) {}
                return $key;

        }

        //public function
	/**
	 * Renders the head control.
	 * @param THtmlWriter the writer for rendering purpose.
	 */
	public function TOBE_render($writer)
	{
                $key = $this->getKey();

                $cache = $this->getApplication()->getCache();
                if ($cache)
                {
                   $content = $cache->get($key);
                   if( $content != null)
			$writer->write($content[0]);
                    else
                    {
			$textWriter=new TTextWriter;

			$this->renderContents(new THtmlWriter($textWriter));
			$content=$textWriter->flush();
                        $data = $data=array($content);
			$cache->set($key,$data,$this->getDuration());
			$writer->write($content);
                    }
                }
		else
                    $this->renderContents($writer);

	}
}
