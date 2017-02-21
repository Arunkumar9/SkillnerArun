<?php
/**
 * TFirePHPLogRoute class file
 *
 * @author 
 * @link http://www.pradosoft.com/
 * @copyright Copyright &copy; 2005 PradoSoft
 * @license http://www.pradosoft.com/license/
 * @version $Revision: $  $Date: $
 * @package System.Util
 */

/**
 * TFirePHPLogRoute class.
 *
 * TFirebugLogRoute prints selected log messages in the response.
 *
 * {@link http://www.joehewitt.com/software/firebug/ FireBug Website}
 * {@link http://www.firephp.org}
 *
 * @author 
 * @version $Revision: $  $Date: $
 * @package System.Util
 * @since 3.
 */
if(!isset($_SERVER['argv']) || php_sapi_name()!=='cli')
{
//Prado::using('System.3rdParty.FirePHPCore.fb');
require_once('FirePHPCore/fb.php');
fb("[Cumulated Time] [Time] [Category] [Message]");
if (!class_exists('TFirePHPLogRoute',false))
{
class TFirePHPLogRoute extends TLogRoute
{
	public function processLogs($logs)
	{
		if(empty($logs) || $this->getApplication()->getMode()==='Performance') return;
		$first = $logs[0][3];
		//$response = $this->getApplication()->getResponse();
		//$response->write($this->renderHeader());
//die($log[0]);
		$instance = FirePHP::getInstance(true);
		//$instance->fb('Log start...');
//		foreach($logs as $log) 
	//		$instance->fb($log[3],@gmdate('M d H:i:s',$log[3]).' '.$log[2],$this->getFirebugLoggingLevel($log[1]));

		for($i=0,$n=count($logs);$i<$n;++$i)
		{
			if ($i<$n-1)
			{
				$timing['delta'] = $logs[$i+1][3] - $logs[$i][3];
				$timing['total'] = $logs[$i+1][3] - $first;
			}
			else
			{
				$timing['delta'] = '?';
				$timing['total'] = $logs[$i][3] - $first;
			}
			$msg = $this->renderMessage($logs[$i],$timing);
			$instance->fb($msg[0],$msg[1],$this->getFirebugLoggingLevel($log[1]));
		}
		

		//$response->write($this->renderFooter());
	}


	protected function renderMessage ($log, $info)
	{
		//$logfunc = $this->getFirebugLoggingFunction($log[1]);
		$total = sprintf('%0.6f', $info['total']);
		$delta = sprintf('%0.6f', $info['delta']);
		if (is_scalar($log[0]))
			$msg = trim(preg_replace('/\(line[^\)]+\)$/','',$log[0])); //remove line number info
		else
			$msg = $log[0];

//		$label = trim($this->formatLogMessage($log[0],$log[1],$log[2],''));
		$label = "[{$total}] [{$delta}] ".' ['.$log[2].']'; // Add time spent and cumulated time spent
		//$string = $logfunc . '(\'' . addslashes($msg) . '\');' . "\n";

		return array($msg,$label);
	}

	protected function getFirebugLoggingLevel($level)
	{
		switch ($level) {
			case TLogger::DEBUG:
				return FirePHP::LOG;
			case TLogger::INFO:
			case TLogger::NOTICE:
				return FirePHP::INFO;
			case TLogger::WARNING:
				return FirePHP::WARN;
			case TLogger::ERROR:
			case TLogger::ALERT:
			case TLogger::FATAL:
				return FirePHP::ERROR;
		}
		return FirePHP::LOG;
	}

}
}
} else {
class TFirePHPLogRoute extends TLogRoute
{
	public function processLogs($logs)
	{}
}
}

