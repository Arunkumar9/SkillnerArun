<?php
/**
 * FXlsResponse Class
 *
 * FXlsResponse is the base class for all Xls response provider classes.
 *
 * Derived classes must implement {@link getXlsContent()} to return
 * an object or literals to be converted to JSON format. The response
 * will be empty if the returned content is null.
 *
 * @author Jan Rosa
 * @version $Id: FXlsResponse.php 2348 2013-12-20 10:20:54Z arun $
 * @package fresh.services.pdf
 * @since 3.1
 */

abstract class FXlsResponse extends TApplicationComponent
{
    const   DEFAULT_YAML_CONFIG='xlsCfg';
    const   DEFAULT_FILENAME='report';
	private $_id='';
    private $_filename;
    private $_ymlcfg;
    private $_writer_class;

	/**
	 * Initializes the feed.
	 * @param TXmlElement configurations specified in {@link TJsonService}.
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

	/**
	 * @return string filename this response
	 */
	public function getFilename()
	{
		return $this->_filename;
	}

	/**
	 * @param string filename this response
	 */
	public function setFilename($value)
	{
		$this->_filename=$value;
	}

	/**
	 * @return appropriate YamlConfig module 
	 */
	public function getYamlConfig()
	{
        $cfg = ($this->_ymlcfg)?$this->_ymlcfg:self::DEFAULT_YAML_CONFIG;
        $modules = $this->getApplication()->getModules();
        
        if ($this->_ymlcfg)
            return $modules[$cfg];
        
        foreach ($modules as $id => $module) {
            if ($module instanceof FYamlConfig) {
                $this->_ymlcfg = $id;
                return $module;
            }
        }
	}	

    public function setWriter($value) {
        $this->_writer_class = $value;
    }
    
    public function getWriter($xls) {
//        try {
            Prado::using('FreshSystem.services.xls.PHPExcel.Classes.PHPExcel.Writer.'.$this->_writer_class);
            $class = 'PHPExcel_Writer_'.$this->_writer_class;
            return new $class($xls);
  //      } catch (Exception $e) {
    //        Prado::using('Application.services.xls.PHPExcel.Classes.PHPExcel.Writer.Excel2007');
      //      return new PHPExcel_Writer_Excel2007($xls);
        //}
    }
    
    public function sendHeaders($filename,$len=false,$download=true) {
            $response = $this->getResponse();
			$response->clear();
            $filename = ($filename)?$filename:self::DEFAULT_FLENAME;
            if ($this->_writer_class == 'CSV') {
                $filename .= '.csv';
                $ctype = 'text/csv';
            } else {
                $filename .= '.xls';
                $ctype = 'application/vnd.ms-excel';
            }
            
    	    $response->ContentType = $ctype;
			$response->Charset = '';
			$response->appendHeader("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1
			$response->appendHeader("Expires: Mon, 26 Jul 1997 05:00:00 GMT"); // Date in the past
			$response->appendHeader('Content-Type: '.$ctype);
			if ($len)
                $response->appendHeader('Content-Length: '.$len);

			if ($download) {
				$filename = $filename;
				$response->appendHeader('Content-disposition: attachment; filename="'.$filename.'"');
			} else {
				$response->appendHeader('Content-disposition: inline; filename="'.$filename.'"');
			}
    }

	/**
	 * @param string id of YamlConfig module
	 */
	public function setYamlConfig($value)
	{
		$this->_ymlcfg=$value;
	}

    public function setServiceProperties($ary)
    {
        foreach($ary as $k=>$v) {
            $this->setSubProperty($k,$v);
        }
    }
	/**
	 * @return object json response content, null to supress output.
	 */
	abstract public function getXlsContent();
}