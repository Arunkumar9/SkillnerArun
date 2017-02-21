<?php

class FDownloadHyperLink extends THyperLink
{
	
	const DOWNLOAD_PARAM = 'download';
	
	/**
	 * Adds attributes related to a hyperlink element to renderer.
	 * @param THtmlWriter the writer used for the rendering purpose
	 */
	protected function addAttributesToRender($writer)
	{
		parent::addAttributesToRender($writer);
		$writer->removeAttribute('target');
		$writer->removeAttribute('href');
		
		$isEnabled=$this->getEnabled(true);
		$target=$this->getTarget();
		$url=$this->getNavigateUrl();
		if(strtolower($target) =='_download')
		{
			if ($url !== '' && $isEnabled)
			{
				$sm = Prado::getApplication()->getSecurityManager();
				$path = ($this->getSecureDownload()) ? $sm->hashData($url).'&hashed=1' : $url;
				$url = Prado::getApplication()->getRequest()->getApplicationUrl()
					   . '?download='. $path;
				$writer->addAttribute('href',$url);
			}
		} else {

			if($url !== '' && $isEnabled)
				$writer->addAttribute('href',$url);
	
			if($target !=='')
				$writer->addAttribute('target',$target);
				
		}
		$writer->addAttribute('class',trim($this->getCssClass().' '.$this->getFileType()));
	}
	

	public function getFileType() {
		
		$url = $this->getNavigateUrl();
		$ext = strtolower(pathinfo($url,PATHINFO_EXTENSION));
		return $ext;		
	}
	
	/**
	 * @param boolean if secure filedownload
	 */
	public function getSecureDownload()
	{
		return $this->getViewState('SecureDownload',false);
	}

	/**
	 * @param boolean if secure filedownload
	 */
	public function setSecureDownload($value)
	{
		$this->setViewState('SecureDownload',TPropertyValue::ensureBoolean($value),false);
	}
	
	
}