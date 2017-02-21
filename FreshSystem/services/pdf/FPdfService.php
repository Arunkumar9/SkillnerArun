<?php
/**
 * FPdfService and FPdfResponse class file.
 *
 * @author Jan Rosa
 * @copyright Copyright &copy; 2006 PradoSoft
 * @version $Id: FPdfService.php 2348 2013-12-20 10:20:54Z arun $
 * @package Fresh.Services.PDF
 */

/**
 * FPDFService class provides to end-users PDF content response in
 * PDF format.
 *
 * To use TJsonService, configure it in application configuration as follows,
 * <code>
 *  <service id="pdf" class="Common.fresh.services.pdf.FPDFService" >
 * 		<pdf id="report" class="Common.fresh.services.pdf.FPDFReport" />
 * 	<service/>
 * </code>

 * To retrieve the PDF content provided by "get_article", use the URL
 * <code>index.php?json=get_article</code>
 *
 * @author Jan Rosa
 * @version $Id: FPDFService.php$
 * @package Fresh.Services.PDF
 * @since 3.1
 */
class FPdfService extends TService
{
	/**
	 * @var array registered services
	 */
	private $_services=array();
	private $_modules=array();

	/**
	 * Initializes this module.
	 * This method is required by the IModule interface.
	 * @param TXmlElement configuration for this module, can be null
	 */
	public function init($xml)
	{
		$this->loadPdfServices($xml);
		$this->loadPdfModules($xml);
		$this->initModules();
	}

	/**
	 * Load the service definitions.
	 * @param TXmlElement configuration for this module, can be null
	 */
	protected function loadPdfServices($xml)
	{
		foreach($xml->getElementsByTagName('pdf') as $config)
		{
			if(($id=$config->getAttribute('id'))!==null)
				$this->_services[$id]=$config;
			else
				throw new TConfigurationException('pdf_id_service_required');
		}
	}

	protected function loadPdfModules($xml)
	{
			// modules
			foreach($xml->getElementsByTagName('module') as $node)
			{
				$properties=$node->getAttributes();
				$type=$properties->remove('class');
				$id=$properties->itemAt('id');
				if($type===null)
					throw new TConfigurationException('pdfserviceconf_moduletype_required',$id);
				$node->setParent(null);
				if($id===null)
					$this->_modules[]=array($type,$properties->toArray(),$node);
				else
					$this->_modules[$id]=array($type,$properties->toArray(),$node);
			}
	}
	
	protected function initModules()
	{
		$application=$this->getApplication();

		// load modules specified in page directory config
		$modules=array();
		foreach($this->_modules as $id=>$moduleConfig)
		{
			Prado::trace("Loading module $id ({$moduleConfig[0]})",'fresh.services.pdf.FPDFService');
			$module=Prado::createComponent($moduleConfig[0]);
			if(is_string($id))
				$application->setModule($id,$module);
			foreach($moduleConfig[1] as $name=>$value)
				$module->setSubProperty($name,$value);
			$modules[]=array($module,$moduleConfig[2]);
		}
		foreach($modules as $module)
			$module[0]->init($module[1]);
		
		//$application->getAuthorizationRules()->mergeWith($pageConfig->getRules());
	}

	/**
	 * Runs the service.
	 * This method is invoked by application automatically.
	 */
	public function run()
	{
		$id=$this->getRequest()->getServiceParameter();
		if(isset($this->_services[$id]))
		{
			$serviceConfig=$this->_services[$id];
			$properties=$serviceConfig->getAttributes();
			if(($class=$properties->remove('class'))!==null)
			{
				$service=Prado::createComponent($class);
				if($service instanceof FPdfResponse)
					$this->createPdfResponse($service,$properties,$serviceConfig);
				else
					throw new TConfigurationException('pdfservice_response_type_invalid',$id);
			}
			else
				throw new TConfigurationException('pdfservice_class_required',$id);
		}
		else
			throw new THttpException(404,'pdfservice_unknown',$id);
	}

	/**
	 * Renders content provided by FPDFResponse::getPDFContent() as
	 * PDF.
	 */
	protected function createPDFResponse($service,$properties,$config)
	{
		$filename = 'doc.pdf';
		// init service properties
		foreach($properties as $name=>$value)
		{
			$service->setSubproperty($name,$value);
			if ($name == 'name')
				$filename = $value.'.pdf';	
		}
		$service->init($config);

		//send content if not null
		if(($content=$service->getPdfContent())!==null)
		{
			$response = $this->getResponse();
				//We send to a browser
			$response->clear();
			//$response->setCacheControl('nocache');
			$response->ContentType = 'application/pdf';
			$response->Charset = '';
			$response->appendHeader('Content-Type: application/pdf');
			$response->appendHeader('Content-Length: '.strlen($content));
			$response->appendHeader('Content-disposition: inline; filename="'.$filename.'"');

			//send content
			$response->write($content);
			$response->flush();
			die();
		}
	}
}

/**
 * FPDFResponse Class
 *
 * FPDFResponse is the base class for all PDF response provider classes.
 *
 * Derived classes must implement {@link getPdfContent()} to return
 * an object or literals to be converted to JSON format. The response
 * will be empty if the returned content is null.
 *
 * @author Jan Rosa
 * @version $Id: FPdfService.php 2348 2013-12-20 10:20:54Z arun $
 * @package fresh.services.pdf
 * @since 3.1
 */
abstract class FPdfResponse extends TApplicationComponent
{
	private $_id='';

	/**
	 * Initializes the feed.
	 * @param TXmlElement configurations specified in {@link TJsonService}.
	 */
	public function init($config)
	{
	}

	/**
	 * @return string ID of this response
	 */
	public function getID()
	{
		return $this->_id;
	}

	/**
	 * @param string ID of this response
	 */
	public function setID($value)
	{
		$this->_id=$value;
	}

	/**
	 * @return object json response content, null to supress output.
	 */
	abstract public function getPdfContent();
}

?>