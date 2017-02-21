<?php
/**
 * TJsonService and TJsonResponse class file.
 *
 * @author Wei Zhuo <weizhuo[at]gamil[dot]com>
 * @link http://www.pradosoft.com/
 * @copyright Copyright &copy; 2006 PradoSoft
 * @license http://www.pradosoft.com/license/
 * @version $Id: FImageService.php 2348 2013-12-20 10:20:54Z arun $
 * @package System.Web.Services
 */

/**
 */
class FImageService extends TService
{
	/**
	 * @var array registered services
	 */
	private $_services=array();

	/**
	 * Initializes this module.
	 * This method is required by the IModule interface.
	 * @param TXmlElement configuration for this module, can be null
	 */
	public function init($xml)
	{
		$this->loadImageServices($xml);
	}

	/**
	 * Load the service definitions.
	 * @param TXmlElement configuration for this module, can be null
	 */
	protected function loadImageServices($xml)
	{
		foreach($xml->getElementsByTagName('image') as $config)
		{
			if(($id=$config->getAttribute('id'))!==null)
				$this->_services[$id]=$config;
			else
				throw new TConfigurationException('imageservice_id_required');
		}
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
				if($service instanceof FImageResponse)
					$this->createImageResponse($service,$properties,$serviceConfig);
				else
					throw new TConfigurationException('imageservice_response_type_invalid',$id);
			}
			else
				throw new TConfigurationException('imageservice_class_required',$id);
		}
		else
			throw new THttpException(404,'imageservice_feed_unknown',$id);
	}

	/**
	 * Renders content .
	 */
	protected function createImageResponse($service,$properties,$config)
	{
		// init service properties
		foreach($properties as $name=>$value)
			$service->setSubproperty($name,$value);
		$service->init($config);

		//send content if not null
		if(($content=$service->getImageContent())!==null)
		{
			$response = $this->getResponse();
			$response->setContentType($service->getMimeType());

			//send content
			$response->write($content);
		}
	}
}

/**
 * FImageResponse Class
 *
 * */
abstract class FImageResponse extends TApplicationComponent
{
	private $_id='';

	/**
	 * Initializes the feed.
	 * @param TXmlElement configurations specified in {@link TImageService}.
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

    public function getManager()
    {
        return  Prado::getApplication()->getModule('image');
    }

	/**
	 * @return object json response content, null to supress output.
	 */
	abstract public function getImageContent();

	/**
	 * @return object json response content, null to supress output.
	 */
	abstract public function getMimeType();
}

?>