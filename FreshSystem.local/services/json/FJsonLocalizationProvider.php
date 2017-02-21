<?php
/**
 * 
 * @project Fresh!
 * 
 * @package Fresh.web.services.json

 * @fileOverview
 * 
 * @author Jan Rosa
 * @copyright Copyright &copy; Jan Rosa, 2008
 * @version	$Id: FJsonLocalizationProvider.php 2348 2013-12-20 10:20:54Z arun $
 * 
 */

class FJsonLocalizationProvider extends FJsonComponentProvider
{
	private $_path=null;
	private $_ymlcfg=null;
    protected $finder;
    protected $config;
    protected $context;
    protected $metadata;

    

	public function getJsonContent()
	{
		if (!$this->getIsAuthorized())
			return array('success'=>false, 'nessage'=>'Not authorized!');

		$user = $this->User;
		$request = Prado::getApplication()->Request;

		//if (!($id = $request['lang']))
			//return array('success'=>false, 'message'=>'Bad request!');
					
					
		$key = $id;

        //$data = $this->getYamlData($key);

		$result = array();
        foreach ($this->Messages as $s=>$target) {
            if ($target[0])
				$result[$s] = $target[0];
        }

        $js = "if ('undefined' === typeof Fresh) Fresh = {}; Fresh.localize = ".json_encode($result).";".$this->readClientParameters();

 		$response = $this->getResponse();
 		$response->setContentType('text/javascript');
 		$response->setCharset('UTF-8');
		$response->write($js);
        $response->flush();
        die();
        

	}

    public function readClientParameters()
    {
        $cpar = $this->getApplication()->Parameters['clientParameters'];

        if (!$cpar) return "";

        $params = array();
        foreach ($cpar->getElements() as $elem) {
//var_dump($elem);
            $params[$elem->getAttribute('id')] = $elem->getAttribute('value');

        }

        return " Fresh.localParameters = ".json_encode($params).";";

    }
    public function getMessages($catalogue=null, $charset=null)
	{
		Prado::using('System.I18N.Translation');
		$app = Prado::getApplication()->getGlobalization(false);

		//no translation handler provided
		if($app===null || ($config = $app->getTranslationConfiguration())===null)
			return strtr($text, $params);

		Translation::init();

		if(empty($catalogue) && isset($config['catalogue']))
			$catalogue = $config['catalogue'];

		//globalization charset
		$appCharset = $app===null ? '' : $app->getCharset();

		//default charset
		$defaultCharset = ($app===null) ? 'UTF-8' : $app->getDefaultCharset();

		//fall back
		if(empty($charset)) $charset = $appCharset;
		if(empty($charset)) $charset = $defaultCharset;

		$formatter = Translation::formatter();
        $formatter->format('Email');
        if($formatter->getSource()->load())
		{
			$m = $formatter->getSource()->read();
            return $m['messages.'.$app->Culture];
        }
        return array();
	}	
}
?>