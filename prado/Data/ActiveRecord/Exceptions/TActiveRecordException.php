<?php
/**
 * TActiveRecordException class file.
 *
 * @author Wei Zhuo <weizhuo[at]gmail[dot]com>
 * @link http://www.pradosoft.com/
 * @copyright Copyright &copy; 2005-2008 PradoSoft
 * @license http://www.pradosoft.com/license/
 * @version $Id: TActiveRecordException.php 2348 2013-12-20 10:20:54Z arun $
 * @package System.Data.ActiveRecord
 */

/**
 * Base exception class for Active Records.
 *
 * @author Wei Zhuo <weizho[at]gmail[dot]com>
 * @version $Id: TActiveRecordException.php 2348 2013-12-20 10:20:54Z arun $
 * @package System.Data.ActiveRecord
 * @since 3.1
 */
class TActiveRecordException extends TDbException
{
	/**
	 * @return string path to the error message file
	 */
	protected function getErrorMessageFile()
	{
		$lang=Prado::getPreferredLanguage();
		$path = dirname(__FILE__);
		$msgFile=$path.'/messages-'.$lang.'.txt';
		if(!is_file($msgFile))
			$msgFile=$path.'/messages.txt';
		return $msgFile;
	}
}

class TActiveRecordConfigurationException extends TActiveRecordException
{

}

