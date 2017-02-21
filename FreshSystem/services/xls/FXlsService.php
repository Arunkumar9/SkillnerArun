<?php
/**
 * FXlsService and FXlsResponse class file.
 *
 * @author Jan Rosa
 * @copyright Copyright &copy; 2006 PradoSoft
 * @version $Id: FXlsService.php 2348 2013-12-20 10:20:54Z arun $
 * @package Fresh.Services.PDF
 */
Prado::using("FreshSystem.services.xls.PHPExcel.Classes.*");
Prado::using("FreshSystem.services.xls.PHPExcel.Classes.PHPExcel.PHPExcel");
Prado::using('FreshSystem.services.xls.FXlsResponse');
/**
 * FXlsService class provides to end-users PDF content response in
 * PDF format.
 *
 * To use TJsonService, configure it in application configuration as follows,
 * <code>
 *  <service id="Xls" class="Common.fresh.services.Xls.FXlsService" >
 * 		<pdf id="report" class="Common.fresh.services.Xls.FXlsReport" />
 * 	<service/>
 * </code>

 * To retrieve the Xls content provided by "get_article", use the URL
 * <code>index.php?json=get_article</code>
 *
 * @author Jan Rosa
 * @version $Id: FXlsService.php$
 * @package Fresh.Services.Xls
 * @since 3.1
 */
class FXlsService extends TService
{
	/**
	 * @var array registered services
	 */
	private $_services=array();
	private $_modules=array();
    private $_active_service=null;

	/**
	 * Initializes this module.
	 * This method is required by the IModule interface.
	 * @param TXmlElement configuration for this module, can be null
	 */
	public function init($xml)
	{
		$this->loadXlsServices($xml);
		$this->loadXlsModules($xml);
		$this->initModules();
	}

	/**
	 * Load the service definitions.
	 * @param TXmlElement configuration for this module, can be null
	 */
	protected function loadXlsServices($xml)
	{
		foreach($xml->getElementsByTagName('xls') as $config)
		{
			if(($id=$config->getAttribute('id'))!==null)
				$this->_services[$id]=$config;
			else
				throw new TConfigurationException('Xls_id_service_required');
		}
	}

	protected function loadXlsModules($xml)
	{
			// modules
			foreach($xml->getElementsByTagName('module') as $node)
			{
				$properties=$node->getAttributes();
				$type=$properties->remove('class');
				$id=$properties->itemAt('id');
				if($type===null)
					throw new TConfigurationException('Xlsserviceconf_moduletype_required',$id);
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
			Prado::trace("Loading module $id ({$moduleConfig[0]})",'fresh.services.Xls.FXlsService');
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
				if($service instanceof FXlsResponse)
					$this->createXlsResponse($service,$properties,$serviceConfig);
				else
					throw new TConfigurationException('xlsservice_response_type_invalid',$id);
			}
			else
				throw new TConfigurationException('xlsservice_class_required',$id);
		}
		else
			throw new THttpException(404,'Xlsservice_unknown',$id);
	}

	/**
	 * Renders content provided by FXlsResponse::getXlsContent() as
	 * Xls.
	 */
	protected function createXlsResponse($service,$properties,$config)
	{
        $this->_active_service = $service;
		$filename = ($service->Filename)?$service->Filename:'doc.Xls';
		// init service properties
		foreach($properties as $name=>$value)
		{
			$service->setSubproperty($name,$value);
			if ($name == 'name')
				$filename = $value.'.xls';	
		}
		$service->init($config);

		//send content if not null
		if(($xls=$service->getXlsContent())!==null)
		{
		//die('here');
			//We send to a browser
		    $writer = $service->getWriter($xls);
		    $service->sendHeaders($service->getFilename());
		    $writer->save('php://output');
		    //$writer->save('test.csv');
		    die();
		} else
		{ die('null'); }
	}
    
    public function getActiveService()
    {
        return $this->_active_service;
    }
}



?>