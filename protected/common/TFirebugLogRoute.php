<?php
/**
 * TFirebugLogRoute class file
 *
 * @author Enrico Stahn <mail@enricostahn.com>
 * @link http://www.pradosoft.com/
 * @copyright Copyright &copy; 2005 PradoSoft
 * @license http://www.pradosoft.com/license/
 * @version $Revision: $  $Date: $
 * @package System.Util
 */

/**
 * TFirebugLogRoute class.
 *
 * TFirebugLogRoute prints selected log messages in the response.
 *
 * {@link http://www.joehewitt.com/software/firebug/ FireBug Website}
 *
 * @author Enrico Stahn <mail@enricostahn.com>
 * @version $Revision: $  $Date: $
 * @package System.Util
 * @since 3.0
 */
class TFirebugLogRoute extends TLogRoute
{
	public function processLogs($logs)
	{
		if (empty($logs) || $this->getApplication()->getMode()==='Performance' || $this->getApplication()->Service->ID != 'page') {
			return;
		}
		$response = $this->getApplication()->getResponse();
		$response->write($this->renderHeader());

		foreach($logs as $log) {
			$response->write($this->renderMessage($log));
		}

		$response->write($this->renderFooter());
	}

	protected function renderHeader()
	{
		$string = <<<EOD

<script type="text/javascript">
/*<![CDATA[*/
if (typeof(console) == 'object') {

EOD;

		return $string;
	}

	protected function renderMessage($log)
	{
		$logfunc = $this->getFirebugLoggingLevel($log[1]);

		$msg = trim($this->formatLogMessage($log[0],$log[1],$log[2], $log[3]));
		$msg = preg_replace('/\(line[^\)]+\)$/','',$msg); //remove line number info

		$string = $logfunc . '(\'' . addslashes($msg) . '\');' . "\n";

		return $string;
	}

	protected function getFirebugLoggingLevel($level)
	{
		switch ($level) {
			case TLogger::DEBUG:
			case TLogger::INFO:
			case TLogger::NOTICE:
				return 'console.log';
			case TLogger::WARNING:
				return 'console.warn';
			case TLogger::ERROR:
			case TLogger::ALERT:
			case TLogger::FATAL:
				return 'console.error';
		}
		return 'console.log';
	}

	protected function renderFooter()
	{
		$string = <<<EOD

}
</script>

EOD;

		return $string;
	}
}

?>