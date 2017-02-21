<?php
/**
 * FSitemapPath class file
 * 
 * @author Jan ROSA (jan.rosa@freshconcept.fr)
 * @copyright Copyright &copy; 2007, Jan Rosa
 * @license http://www.pradosoft.com/license
 *
 *
 * based on CSitemap class of Christophe BOULAIN (Christophe.Boulain@ceram.fr)
 * Copyright &copy; 2007, CERAM Sophia Antipolis

 * 
 */

/**
 * FSitemapPath class
 * 
 * This control is a bread crumb, looking for the current path in the 
 * cms module manager
 * 
 * You can specify a FSitemapSeparatorClass to provide a new component for separator (must be a TWebControl)
 * By default, FSitemapSeparator just draw a static >
 * 
 */
class FSitemapPath extends TCompositeControl {

	
	/**
	 * @var FSitemapManager Manager module
	 */
	private $_manager=null;
	
	
	public function onInit($param)
	{
		$this->getPage()->attachEventHandler('OnPreRenderComplete',array($this,'preRenderComplete'));
		parent::onInit($param);
	}
	/**
	 * Get the FSitemapNodeManager module
	 * @return FSitemapNodeManager
	 * @throw TConfigurationException if module is not registered
	 */
	public function getManager () {
		if ($this->_manager===null)
		{
			foreach ($this->getApplication()->getModules() as $module)
			{
				if ($module instanceof FCmsModule) $this->_manager=$module;
			}
			if ($this->_manager===null) 
			throw new TConfigurationException("cms_manager_module_not_found");
		}
		return $this->_manager;
	}
	
	public function setSeparatorClass ($value) 
	{
		if (prado::createComponent($value) instanceof TWebControl)
			$this->setViewState('separatorClass', TPropertyValue::ensureString($value));
		else 
			throw new TInvalidDataValueException ('SeparatorClass must be an instance of TWebControl');
	}
	
	public function getSeparatorClass ()
	{
		return $this->getViewState('separatorClass', 'FSitemapPathNodeSeparator');
	}
	
	public function getSeparator ()
	{
		return $this->getViewState('separator','');
	}
	
	public function setSeparator ($value)
	{
		$this->setViewState('separator', TPropertyValue::ensureString($value));
	}

	public function getOffset ()
	{
		return $this->getViewState('offset',0);
	}

	public function setOffset ($value)
	{
		$this->setViewState('offset', TPropertyValue::ensureInteger($value));
	}

        public function getAncestors()
	{
		$ac = $this->getPage()->findControlsByType('FAncestorsHint');
		//die(TVarDumper::dump($ac));
		if (count($ac)>0)
			return $ac[0]->getAncestors();
		else
			return $this->getManager()->getAncestors();
	}

	public function preRenderComplete($params)
	{
		// Add the childs controls
		$controls=array ();
		
		$nodes = $this->getAncestors();
		//$nodes[0]->uid = null;

		if (count($nodes) > 0)
		{
                        if (count($nodes) > $this->getOffset()) 
                                $nodes = array_slice($nodes,0,count($nodes)-$this->Offset);
                        elseif (count($nodes) <= $this->getOffset())
                                $nodes = array_slice($nodes,0,1);

                        foreach ($nodes as $node)
			{		
                                if ($node->TypeData['notInMenu']) continue;
                                if (count($nodePath)>0)
				{
					$separator=prado::createComponent($this->getSeparatorClass());
					$separator->Separator = $this->getSeparator();
					array_unshift($controls, $separator);
				}
				$nodePath=prado::createComponent('FSitemapPathNode', $node);
				array_unshift($controls, $nodePath);
			}
			foreach ($controls as $control) $this->getControls()->add($control);
		}
		//parent::onPreRender($params);
	}
	
	public function addParsedObject ($object)
	{
		$this->ensureChildControls();
		parent::addParsedObject ($object);
	}
	
}

/**
 * This control render a node of sitemap path.
 *
 */
class FSitemapPathNode extends TWebControl
{
	
	public function __construct ($node=null)
	{
		parent::__construct();
		if ($node instanceof FTypedActiveRecord)
		{
/*
			$this->setTitle(prado::Localize($node->getTitle()));
			$this->setDescription(prado::Localize($node->getDescription()));
			if ($node->getServiceParameter()!==null)
				$this->setUrl($this->getRequest()->constructUrl($node->getServiceId(), $node->getServiceParameter(), $node->getParameters()));

*/		
  			if (Prado::getApplication()->Parameters['translatable'])
			{
				$this->setTitle($node->nameLangAct);
				//$this->setDescription($node->descriptionLangAct);
			}
			else
			{
				$this->setTitle($node->name);
				//$this->setDescription($node->description);
			}
			$this->setCode($node->getCid());
			if ($node->uid && ($href = $node->getAbsoluteHref()) )
				$this->setUrl($href);
                        else
                            $this->setUrl('#');//$this->Request->BaseUrl);
		}
	}
	
	/**
	 * Tag name : 
	 *  o span if no url specified
	 *  o a if url specified
	 */
	protected function getTagName ()
	{
		if ($this->getUrl()===null )//|| ($this->getCode() && $this->getParent()->getManager()->getCode() == $this->getCode()))
			return 'span';
		else
			return 'a';
	}
	
	protected function addAttributesToRender ($writer)
	{
		$isEnabled=$this->getEnabled(true);
		if($this->getEnabled() && !$isEnabled)
			$writer->addAttribute('disabled','disabled');
		parent::addAttributesToRender($writer);
		if(($url=$this->getUrl())!==null && $isEnabled)
			$writer->addAttribute('href',$url);
	}
	
	public function renderContents ($writer)
	{
		$writer->write ($this->getTitle());
	}
	
	public function getTitle ()
	{
		return $this->getViewState('title');
	}
	
	public function setTitle ($value)
	{
		$this->setViewState('title', TPropertyValue::ensureString($value));
	}
	
	public function setDescription ($value)
	{
		$this->setTooltip(TPropertyValue::ensureString($value));
	}
	
	public function getDescription ()
	{
		return $this->getTooltip();
	}
	
	public function getUrl ()
	{
		return $this->getViewState('url', null);
	}
	
	public function setUrl ($value)
	{
		$this->setViewState('url', TPropertyValue::ensureString($value));
	}
	
	public function getCode ()
	{
		return $this->getViewState('code', null);
	}
	
	public function setCode ($value)
	{
		$this->setViewState('code', TPropertyValue::ensureString($value));
	}
}

/**
 * simple separator, just write a '&gt'
 */
class FSitemapPathNodeSeparator extends TWebControl 
{
	protected $_separator = '';
	
	public function renderBeginTag ($writer)
	{
		return;
	}
	
	public function renderEndTag ($writer)
	{
		return;
	}
	
	public function renderContents($writer)
	{
		$writer->write ($this->getSeparator());
	}

	public function getSeparator ()
	{
		return $this->_separator;
	}
	
	public function setSeparator ($value)
	{
		$this->_separator = TPropertyValue::ensureString($value);
	}

}
