<?php
/**
 * TTemplateManager class
 *
 * TTemplateManager manages the loading and parsing of control templates.
 *
 * First compiles template from HAMP to TPL then hands over to TTemplateManager;
 *
 * @author Jan Rosa
 * @version $Id: FHamlTemplateManager.php 2348 2013-12-20 10:20:54Z arun $
 * @package FreshSystem.Haml
 */
Prado::using('FreshSystem.haml.PRADO_HAML');
class FHamlTemplateManager extends TTemplateManager
{
	/**
	 * Template file extension
	 */
	const HAML_TEMPLATE_FILE_EXT='.haml';


	/**
	 * Loads the template from the specified file.
	 * @return ITemplate template parsed from the specified file, null if the file doesn't exist.
	 */
	 
	public function getTemplateByFileName($fileName)
	{
		$origFileName = $fileName;
		if (file_exists($fileName.self::HAML_TEMPLATE_FILE_EXT))
		{
			Prado::trace("Hamling template $fileName".self::HAML_TEMPLATE_FILE_EXT,'FreshSystem.haml.FHamlTemplateManager');
			$fileName = haml($fileName.self::HAML_TEMPLATE_FILE_EXT);
		}

		if(($fileName=$this->getLocalizedTemplate($fileName))!==null)
		{
			Prado::trace("Loading template $fileName",'FreshSystem.haml.TemplateManager');
			if(($cache=$this->getApplication()->getCache())===null)
				return new FHamlTemplate(file_get_contents($fileName),dirname($origFileName),$origFileName);
			else
			{
				$array=$cache->get(self::TEMPLATE_CACHE_PREFIX.$fileName);
				if(is_array($array))
				{
					list($template,$timestamps)=$array;
					if($this->getApplication()->getMode()===TApplicationMode::Performance)
						return $template;
					$cacheValid=true;
					foreach($timestamps as $tplFile=>$timestamp)
					{
						if(!is_file($tplFile) || filemtime($tplFile)>$timestamp)
						{
							$cacheValid=false;
							break;
						}
					}
					if($cacheValid)
						return $template;
				}
				$template=new FHamlTemplate(file_get_contents($fileName),dirname($origFileName),$origFileName);
				$includedFiles=$template->getIncludedFiles();
				$timestamps=array();
				$timestamps[$origFileName]=filemtime($origFileName);
				foreach($includedFiles as $includedFile)
					$timestamps[$includedFile]=filemtime($includedFile);
				$cache->set(self::TEMPLATE_CACHE_PREFIX.$origFileName,array($template,$timestamps));
				return $template;
			}
		}
		else
			return null;
	}
	 
}

class FHamlTemplate extends TTemplate
{
	/**
	 * Preprocesses the template string by including external templates
	 * @param string template string
	 * @return string expanded template string
	 */
	protected function preprocess($input)
	{
		if($n=preg_match_all('/<%include(.*?)%>/',$input,$matches,PREG_SET_ORDER|PREG_OFFSET_CAPTURE))
		{
			for($i=0;$i<$n;++$i)
			{
				$namespace = trim($matches[$i][1][0]);
				if (strpos($namespace,'.')===false)
					$hamlFilePath=$this->contextPath.DIRECTORY_SEPARATOR.$namespace.TTemplateManager::TEMPLATE_FILE_EXT.FHamlTemplateManager::HAML_TEMPLATE_FILE_EXT;
				else
					$hamlFilePath=Prado::getPathOfNamespace($namespace,TTemplateManager::TEMPLATE_FILE_EXT.FHamlTemplateManager::HAML_TEMPLATE_FILE_EXT);
				if ($hamlFilePath!==null && is_file($hamlFilePath))
				{
					Prado::trace("Hamling template $hamlFilePath",'FreshSystem.haml.FHamlTemplate');
					$filePath = haml($hamlFilePath);
				}
				else
				{
					$filePath=Prado::getPathOfNamespace($namespace,TTemplateManager::TEMPLATE_FILE_EXT);
				}
				if($filePath!==null && is_file($filePath))
					$this->_includedFiles[]=$filePath;
				else
				{
					$errorLine=count(explode("\n",substr($input,0,$matches[$i][0][1]+1)));
					$this->handleException(new TConfigurationException('template_include_invalid',trim($matches[$i][1][0])),$errorLine,$input);
				}
			}
			$base=0;
			for($i=0;$i<$n;++$i)
			{
				$ext=file_get_contents($this->_includedFiles[$i]);
				$length=strlen($matches[$i][0][0]);
				$offset=$base+$matches[$i][0][1];
				$this->_includeAtLine[$i]=count(explode("\n",substr($input,0,$offset)));
				$this->_includeLines[$i]=count(explode("\n",$ext));
				$input=substr_replace($input,$ext,$offset,$length);
				$base+=strlen($ext)-$length;
			}
		}

		return $input;
	}
}

