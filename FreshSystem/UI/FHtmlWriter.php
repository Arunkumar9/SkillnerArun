<?php
/**
 * FHtmlWriter class file
 *
 * @author Jan Rosa <jan.rosa@freshconcept.cz>
 * @copyright Copyright &copy; 2007 FreshConcept
 * @license http://www.pradosoft.com/license/
 * @version $Id: FHtmlWriter.php 2348 2013-12-20 10:20:54Z arun $
 * @package FreshSystem.UI
 */
Prado::using('System.Web.UI.THtmlWriter');
/**
 * FHtmlWriter class
 *
 * FHtmlWriter is THtmlWriter that returns buffer when flushed;
 *
 * @author Jan Rosa <jan.rosa@freshconcept.cz>
 * @version $Id: FHtmlWriter.php 2348 2013-12-20 10:20:54Z arun $
 * @package FreshSystem.UI
 * @since 3.0
 */
class FHtmlWriter extends THtmlWriter //implements ITextWriter
{
	/**
	 * Renders a string.
	 * @param string string to be rendered
	 */
	public function flush()
	{
		return $this->getWriter()->flush();
	}

}

