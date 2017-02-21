<?php
ini_set('session.use_trans_sid',FALSE);
/*
 *
 * To change this template, choose Tools | Templates
 *
 *  $curItem->setTagName('tt');
            $curItem->setAttribute('xml:lang', $this->getGlobalization()->getCulture());
            $curItem->setAttribute('xmlns', 'http://www.w3.org/2006/10/ttaf1');
            $curItem->setAttribute('xmlns:tts', 'http://www.w3.org/2006/10/ttaf1#styling');and open the template in the editor.
 */

/**
 * Description of FProductXml
 *
 * @author rosa
 */
class FVideoTitlesXml extends TComponent implements  IFeedContentProvider {

    private $_FormatFile='Application.services.titles.TimedTextTitles';

    /**
     * Getter for property FormatFile
     * file with format definitions
     * @return type
     */
    public function getFormatFile() {
	return $this->_FormatFile;
    }

    /**
     * Setter for property FormatFile
     * file with format definitions
     * @param $value type
     */
    public function setFormatFile($value) {
	$this->_FormatFile = $value;
    }





    public function getContentType()
    {
	return 'text/xml';
    }
    public function init($config)
    {
	
    }

    public function getFeedContent()
    {
        $file = Prado::getPathOfNamespace($this->FormatFile,'.xml');
        $feed = new TXmlDocument();
        $feed->loadFromFile($file);
	$finder = CuepointRecord::finder();
        $records = $finder->findAll('videos_id = ? AND start < stop ',Prado::getApplication()->Request['vid']);

	$langs = new TXmlElement('div');
        $langs->setAttribute('xml:lang', Prado::getApplication()->getGlobalization()->getCulture());

	foreach($records as $rec)
	{

		$recitem = new TXmlElement('p');
                $recitem->setValue($rec->description);
                $recitem->setAttribute('begin', date ('00:i:s.00', $rec->start));//$rec->start.'s');
                $recitem->setAttribute('dur', ($rec->stop - $rec->start).'.00');
                if ($rec->style)
                    $recitem->setAttribute('style', $rec->style);
                else
                    $recitem->setAttribute('style', '1');
		$langs->Elements[] = $recitem;
	}
        list($body,) = $feed->getElementsByTagName('body');
        $body->Elements[] = $langs;
	$content = $feed->saveToString();

	return $content;

    }

    public function evaluateFlag($rec,$f)
    {

	    if ($f)
	    {
		$flags = explode(',',$f);
		foreach($flags as $flag)
		{
		    if (strpos($flag,'(')===false)
		    {
			if (!$rec->$flag) return false;
		    } else {
			if (!eval('return $rec->'.$flag.';')) return false;
		    }
		}
	    }
	    return true;

    }

}
