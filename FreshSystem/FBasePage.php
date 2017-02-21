<?php

class FBasePage extends TPage
{

	private $_containerRecord;
	private $_userlevel=null;
	private $_code=null;


    public function onPreInit($param)
    {
    	Prado::trace('PreInit','Json');
		$this->Session->open();
                if (($c = $this->getContainer()) && ($td = $c->getTypeData()) )
                {
                       if ($td['theme'])
                            $this->StylesheetTheme = $td['theme'];
                       if ($td['MasterClass'])
                            $this->MasterClass = 'Application.layout.'.basename ($td['MasterClass'],'.tpl');
                }
                if ($this->Request['stheme'])
			$this->StylesheetTheme = $this->Request['stheme'];
		parent::onPreInit($param);
                
	}
 
	function onInit($param)
	{
	//	$this->handleDownload();
		parent::onInit($param);
	}

	public function onLoad($param)	
	{		
			
		parent::onLoad($param);		
		if(extension_loaded('newrelic')) {
						newrelic_name_transaction ($this->getContainer()->name);
		}
		$request = $this->Request;	
	
		if (!$this->IsEditable && ($this->Container->hidden == 1 || $this->Container->hidden_parent == 1))
			$this->gotoError('wrong_root');
		
			
		if (!$this->IsPostBack )		 //&& $request->contains('code')
		{			
			//$this->ContentRepeater->DataSource=$this->Container->contents; 			
			//$this->ContentRepeater->dataBind();		
			
		}	
	
	}
	
	public function gotoDefaultPage($sender=null,$param=null)
	{
		$this->gotoPage($this->Service->DefaultPage);
	}
	
	
	public function gotoPage($pagePath,$getParameters=array())
	{
		$this->Response->redirect($this->Service->constructUrl($pagePath,$getParameters,false,false));
	}

	
	public function gotoError($errorCode)
	{
		if (!$this->IsCallBack)
			$this->gotoPage('Error',array('id'=>$errorCode));
	}


	public function handleDownload()
	{
		if ($this->Request->contains('download'))
		{
			$sm = Prado::getApplication()->getSecurityManager();
			$hashed = $this->Request->contains('hashed');
			$basename = $this->Request['download'];
			$basename = ($hashed) ? $sm->validateData($basename) : $basename;

			$dir = dirname($this->Request->ApplicationFilePath);
			$file = $dir . '/' . $basename;
			if ($basename && is_file($file))
				$this->Response->writeFile($file);
			else
				$this->Response->redirect($this->gotoPageError('resource_not_exists'));
			
			die();
			
		}
		
	}	
	
	public function getIsEditable()
	{
		if ($this->Request['noedit'])
			return false;
		$container = $this->Container;
		if ($container && !$this->User->IsGuest)
			return ($this->UserLevel >= $container->write_level);
		else
			return false;
	}

	public function getUserLevel()
	{
 		if ($this->_userlevel === null)
			$this->_userlevel = Prado::getApplication()->getUser()->level;
		
		return $this->_userlevel;
	}


	public function getCode()
	{
		return $this->getApplication()->Modules['cms']->getCode();
		
/*
		$request = $this->Request;	
		if ($request->contains('code') || $request->contains('uid'))
		{	
			$code = ($request->contains('code'))?$request['code']:$request['uid'];
			$criteria = new TActiveRecordCriteria;
			$criteria->OrdersBy['ordering'] = 'asc';
			if (preg_match('/^[0-9]/',$code))
				$container = ContainerRecord::finder()->findByPk($code,$code);
			else				
				$container = ContainerRecord::finder()->findByName($code);			

			if ($container->Type->name == 'ContentColumn')
			{
				$this->_code = $container->parent_id;
			} else {
				$this->_code = $container->uid;//code;
				$this->_containerRecord[$this->_code] = $container;
			}

		} elseif ($this->_code === null) {
			$type = FU::Ini('Setup.HomePageType');
				
			$container = ContainerRecord::finder()->findByType_id($type);			
			if ($container===null)
				return null;
			$this->_code = $container->uid;
			$this->_containerRecord[$this->_code] = $container;
		}
		return $this->_code;

*/
	}


	public function getContainer($uid = null)
	{
		return $this->getApplication()->getModule('cms')->getContainer($uid);
//		$request = $this->Request;	
/*
		$criteria = new TActiveRecordCriteria;
		$criteria->OrdersBy['ordering'] = 'asc';

		if ($uid === null)
			$code = $this->getCode();
		else
			$code = $uid;
			
		if (!isset($this->_containerRecord[$code])) {
			$this->_containerRecord[$code] = ContainerRecord::finder()->withContents($criteria)->findByPk($code);
		}			
		return $this->_containerRecord[$code];

*/	}


	public function setSessionState($key,$value,$defaultValue=null,$ID=null)
	{
		$this->Session->open();
		if (!$this->getID(true) && $ID === null)
			throw new TConfigurationException('Session state for named objects only');

		$k = (($ID === null)?$this->getID(true):$ID).'$'.$key;
		if($value===$defaultValue)
		{
			if (is_object($this->Session[$k]))
				$this->Session[$k]->Clear();
		}
		else
		{
			$this->Session[$k]=$value;
			echo "set $k -> $value"."\n";
		}
	}


	
	public function getSessionState($key,$defaultValue=null,$ID=null)
	{
		if (!$this->getID(true) && $ID === null)
			throw new TConfigurationException('Session state for named objects only');

		$k = (($ID === null)?$this->getID(true):$ID).'$'.$key;
		return isset($this->Session[$k])?$this->Session[$k]:$defaultValue;
	}
	

	public function findOneControlByID($ID,$i=0)
	{
		$ctrls = $this->findControlsByID($ID);
		return $ctrls[$i];
	}
	

	public function getFormID()
	{
		list($form,) = $this->findControlsByType('TForm');
		return $form->ClientID;
	}
	
	public function canAccess($prop,$class='SecurityLevel')
	{
		return ( Prado::getApplication()->getUser()->getLevel() >= FU::Ini($class.'.'.$prop) );
	}
	
	public function getCanAccessUsersPanel()
	{
		return $this->canAccess('UsersPanel');
	}
	
	public function getCanAccessTypesPanel()
	{
		return $this->canAccess('TypesPanel');
	}

	/**
	 * @return FClientScriptManager client script manager
	 */
	public function getClientScript()
	{
		if(!$this->_clientScript)
			$this->_clientScript=new FClientScriptManager($this);
		return $this->_clientScript;
	}
	
	public function getBaseUrl()
	{
		if ($_SERVER['SCRIPT_URI'])
			return dirname($_SERVER['SCRIPT_URI']).'/';
		else
			return trim('http://'.$_SERVER['HTTP_HOST'].dirname($_SERVER['REQUEST_URI']),'/\\').'/';
	}

    public function giveRequestedPageUrlWithLinks(array $merge,$excl='/IFR_repl/')
    {
		$params = $this->Request->toArray();
                foreach ($params as $key => $value) {
                    if ($_POST[$key] || ($excl && preg_match($excl,$key) ) )
                        unset($params[$key]);
                }
		$params = $merge + $params;
		unset($params[$this->Request->ServiceID]);

                return  $this->Service->ConstructUrl($this->Service->RequestedPagePath, $params);
    }

	/**
	 * Raises OnPreRenderComplete event.
	 * This method is invoked right after {@link onPreRender OnPreRender} stage.
	 * You may override this method to provide additional preparation for page rendering
	 * that should be done after {@link onPreRender OnPreRender}.
	 * Remember to call the parent implementation to ensure OnPreRenderComplete event is raised.
	 * @param mixed event parameter
	 */
	public function onPreRenderComplete($param)
	{
		
		$this->raiseEvent('OnPreRenderComplete',$this,$param);
		$cs=$this->getClientScript();
		$theme=$this->getTheme();
		if($theme instanceof ITheme)
		{
			foreach($theme->getStyleSheetFiles() as $url)
				$cs->registerStyleSheetFile($url,$url,$this->getCssMediaType($url));
			foreach($theme->getJavaScriptFiles() as $url)
				$cs->registerHeadScriptFile($url,$url);
		}
		$styleSheet=$this->getStyleSheetTheme();
		if($styleSheet instanceof ITheme)
		{
			foreach($styleSheet->getStyleSheetFiles() as $url)
				$cs->registerLastStyleSheetFile($url,$url,$this->getCssMediaType($url));
			foreach($styleSheet->getJavaScriptFiles() as $url)
				$cs->registerHeadScriptFile($url,$url);
		}

		if($cs->getRequiresHead() && $this->getHead()===null)
			throw new TConfigurationException('page_head_required');
	}

	/**
	 * Determines the media type of the CSS file.
	 * The media type is determined according to the following file name pattern:
	 *        xxx.media-type.extension
	 * For example, 'mystyle.print.css' means its media type is 'print'.
	 * @param string CSS URL
	 * @return string media type of the CSS file
	 */
	private function getCssMediaType($url)
	{
		$segs=explode('.',basename($url));
		if(isset($segs[2]))
			return $segs[count($segs)-2];
		else
			return '';
	}


}

?>