<?php

class FClientPackageLoader extends TControl
{
	protected $_package_path;
	protected $_package_scripts;
	
	public function getPackagePath()
	{
		return $this->_package_path;
	}

	public function getPackageScripts()
	{
		return $this->_package_scripts;
	}
	
	public function setPackagePath($value)
	{
		$this->_package_path = $value;
	}

	public function setPackageScripts($value)
	{
		$this->_package_scripts = $value;
	}

	
	public function OnInit($param)
	{
		$css = new FClientCssLoader();	
		$js = new TClientScriptLoader();
		
		$css->PackagePath = $this->PackagePath;
		$css->PackageScripts = $this->PackageScripts.'Css';

		$js->PackagePath = $this->PackagePath;
		$js->PackageScripts = $this->PackageScripts.'Js';
		
		$this->Controls[] = $css;
		$this->Controls[] = $js;
	}
}	
