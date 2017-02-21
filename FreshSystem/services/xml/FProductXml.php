<?php
ini_set('session.use_trans_sid',FALSE);
/*
 *
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of FProductXml
 *
 * @author rosa
 */
class FProductXml extends TComponent implements  IFeedContentProvider {

    private $_FormatType;
    private $_FormatList;
    private $_FormatFile='FreshSystem.services.xml.seznam-zbozi';

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



    /**
     * Getter for property FormatList
     * format definitions
     * @return string
     */
    public function getFormatList() {
	return $this->_FormatList;
    }

    /**
     * Setter for property FormatList
     * format definitions
     * @param $value string
     */
    public function setFormatList($value) {
	$this->_FormatList = $value;
    }



    /**
     * Getter for property FormatType
     * format type of xml feed as defined in yml
     * @return string
     */
    public function getFormatType() {
	return $this->_FormatType;
    }

    /**
     * Setter for property FormatType
     * description
     * @param $value string
     */
    public function setFormatType($value) {
	$this->_FormatType = $value;
    }



    public function getContentType()
    {
	return 'application/xml';
    }
    public function init($config)
    {
	$file = Prado::getPathOfNamespace($this->FormatFile,'.yml');
	if (!is_file($file))
	    throw new TConfigurationException('nonexistent format file '.$file);
	$this->FormatList = syck_load_normalized(file_get_contents($file));
	if (!is_array($this->FormatList))
	    throw new TConfigurationException('wrong format file');

	//if (!$this->getFormatType())
	//{
	    $request = Prado::getApplication()->getRequest();
	    if ($request['type'])
		$this->FormatType = $request['type'];
	//}
    }

    public function getFeedContent()
    {
	$fm = $this->FormatList[$this->FormatType];//var_dump($fm);die();
	if (!is_array($fm))
	    throw new TConfigurationException('type is not defined '.$this->FormatType);
	$feed = new TXmlDocument('1.0', $fm['encoding']);
	$curItem = $feed;
	if (is_array($fm['rootItem']))
	{
	    $level=0;
	    foreach($fm['rootItem'] as $k=>$v)
	    {
		if ($level>0)
		{
		    $newItem = new TXmlElement($k);
		    $curItem->Elements[] = $newItem;
		    $curItem = $newItem;
		} else {
		    $curItem->setTagName($k);
		}
		$level++;
		if (is_array($v))
		    foreach($v as $an => $av)
			$curItem->setAttribute($an, $av);
	    }

	} else {
	    $curItem->setTagName($fm['rootItem']);
	    if ($fm['rootItemAttributes'])
	    {
		foreach($fm['rootItemAttributes'] as $k=>$v)
		    $curItem->setAttribute($k, $v);
	    }
	}
	if ($fm['otherItems'])
	{
	    foreach($fm['otherItems'] as $k=>$v)
	    {
		$oe = new TXmlElement($k);
		if ($v[0]=='$')
		{
		    $oe->setValue(Prado::getApplication()->Parameters[substr($v,1)]);
		}
		else
		{
		    $oe->setValue($v);
		}
		$curItem->Elements[] = $oe;
	    }
	}
	$finder = TActiveRecord::finder($fm['recordClass']);
	$crit = new TActiveRecordCriteria;
	$crit->Condition = $fm['condition'];
//echo $fm['condition'];
	$records = $finder->findAll($crit);

	foreach($records as $rec)
	{

	    if (!$this->evaluateFlag($rec, $fm['item']['flag'])) continue;

	    $shopitems = new TXmlElement($fm['item']['tagname']);
	    foreach($fm['item']['content'] as $tag => $val)
	    {
		
		$recitem = new TXmlElement($tag);
		if ($val[0]=='$')
		{
		    $val = substr($val,1);
		    $value = htmlspecialchars($rec->$val);
		}
		else
		    $value = htmlspecialchars($val);
		    
		if (!$value || $value == '0000-00-00 00:00:00') continue;
		$recitem->setValue($value);
		$shopitems->Elements[] = $recitem;
		//} catch (Exception $e) {}
	    }
	    $curItem->Elements[] = $shopitems;
	}

	$content = $feed->saveToString();

	if ($fm['encoding']!='utf-8')
	    $content = iconv('utf-8',$fm['encoding'],$content);

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
