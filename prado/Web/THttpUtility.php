<?php
/**
 * THttpUtility class file
 *
 * @author Qiang Xue <qiang.xue@gmail.com>
 * @link http://www.pradosoft.com/
 * @copyright Copyright &copy; 2005-2008 PradoSoft
 * @license http://www.pradosoft.com/license/
 * @version $Id: THttpUtility.php 2348 2013-12-20 10:20:54Z arun $
 * @package System.Web
 */

/**
 * THttpUtility class
 *
 * @author Qiang Xue <qiang.xue@gmail.com>
 * @version $Id: THttpUtility.php 2348 2013-12-20 10:20:54Z arun $
 * @package System.Web
 * @since 3.0
 */
class THttpUtility
{
	private static $_encodeTable=array('<'=>'&lt;','>'=>'&gt;','"'=>'&quot;');
	private static $_decodeTable=array('&lt;'=>'<','&gt;'=>'>','&quot;'=>'"');

	/**
	 * HTML-encodes a string.
	 * This method translates the following characters to their corresponding
	 * HTML entities: <, >, "
	 * Note, unlike {@link htmlspeicalchars}, & is not translated.
	 * @param string string to be encoded
	 * @return string encoded string
	 */
	public static function htmlEncode($s)
	{
		return strtr($s,self::$_encodeTable);
	}

	/**
	 * HTML-decodes a string.
	 * It is the inverse of {@link htmlEncode}.
	 * @param string string to be decoded
	 * @return string decoded string
	 */
	public static function htmlDecode($s)
	{
		return strtr($s,self::$_decodeTable);
	}
}

