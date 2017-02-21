<?php
/*
 * Created on 12.7.2006
 *
 * To change the template for this generated file go to
 * Window - Preferences - PHPeclipse - PHP - Code Templates
 */
 
 class FDirListMenu extends FListMenu implements INamingContainer
 {
 	
 	private $_dirname;
 	
//	public function pagePreLoad($sender,$param)
//	{
//		$this->_initialized=true;
//		$isPostBack=$this->getPage()->getIsPostBack();
//		if(!$isPostBack || ($isPostBack && (!$this->getEnableViewState(true) || !$this->getIsDataBound())))
//			$this->setRequiresDataBinding(true);
//	}
 	
 	public function getDirname() {
 		return $this->_dirname;
 	}
 	
 	public function setDirname ($value) {
		$this->_dirname = Prado::getPathOfNamespace($value);
	}
 	
 	public function createChildControls () {
		
		parent::createChildControls ();
		$dirlist = FU::recurseDir($this->Dirname);
		$this->createChildControlsInternal ($dirlist,$this);
		
	}
	
	private function createChildControlsInternal ($dirlist,$parent,$level=0) {
		
		$level++;
		if ($level>3) return;
		foreach ($dirlist as $k => $v )
		{
			$name = iconv('CP1250','utf-8',preg_replace('/^.*?\_/','',$k));
			if (is_array($v)&& $k[0]!='_' && $k[0]!='.') {
				$namepath = str_replace('/','.',preg_replace('/^.*?\_/','',$v[0]));
				$c = Prado::createComponent('FListMenuItem');
				$c->Text = $name;
				$c->PagePath = $namepath;
				$c->NavigateUrl = '#';
				$parent->addParsedObject($c);
				
				$c = Prado::createComponent('FListMenu');
				//$c->ActiveCssClass=$this->ActiveCssClass.$level;
				//$c->InactiveCssClass=$this->InactiveCssClass.$level;
				$parent->addParsedObject($c);
				
				unset($v[0]);
				$this->createChildControlsInternal ($v,$c,$level);		
			} elseif ($k[0]!='_' && $k[0]!='.') {
				$namepath = str_replace('/','.',preg_replace('/^.*?_/','',$v));
				$kclass = ucfirst(preg_replace('/[0-9_]*([a-zA-Z0-9]{1,}).xml/is','\\1',$k));
				if (!preg_match('/_fe$/',$kclass))
				{
					$c = Prado::createComponent('FListMenuItem');
					$c->PagePath = 'Home';//$this->getPage()->getService()->getDefaultPage();
					
					if (preg_match('/\.xml$/is',$k) && class_exists($kclass)) {
						$fc = call_user_func(array($kclass,'getFConfig'));
						$text = $fc['general']['table']['description']; //$this->getXMLProperty('table',$k);
						//$text = $table[1];
						$navig = $this->Page->Service->constructUrl($c->PagePath,array('xml'=>$kclass));
						$target = '';
					} else 	{
						//die(class_exists('Timer'));
						$text = preg_replace('/\..{1,3}$/','',$name);
						$fline = file($this->Dirname.'/'.$v);
						$navig = trim($fline[0]);
						if (strpos($navig,'http://')!==0)
						{
							$navig = dirname($this->Page->Request->AbsoluteApplicationUrl).'/'.$navig;
						}
						$target = (count($fline)>1)?$fline[1]:'';
						$c->PagePath = '';
					}
					$c->Text = $text;
					
					
					$c->NavigateUrl = $navig;
					if ($target)
						$c->Target = $target;
					$parent->addParsedObject($c);
				}
			}
		}
	}
	
	public function getXMLProperty($name,$store=null)
	{
		$store = ($store)?$store:$this->ConfigXML;
		if ($this->ModuleXMLconfig){
			//Prado::Trace('XMLConfig '.$this->ModuleXMLConfig->ID);
			return $this->ModuleXMLconfig->getConfig('/root/*/'.strtolower($name),$store);
		} else
		{
			throw new TConfigurationException('invalid XML config');
		}
	}

	function getModuleXMLConfig()
	{
		return $this->Application->getModule('XMLconfig');
	}
	
 	
 }
?>

