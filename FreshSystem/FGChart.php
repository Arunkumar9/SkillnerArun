<?php
/* 
 * This is facade to GChartPhp class (http://code.google.com/p/gchartphp/)
 *
 *
 */
Prado::using('FreshSystem.3rdparty.GChartPhp.PEAR.*');
Prado::using('FreshSystem.3rdparty.GChartPhp.gChart');

class FGChart extends TImage
{

    private $_chart;

    public function onLoad($param) {
        parent::onLoad($param);

        $this->setupChart();
    }

    protected function setupChart()
    {

        $obj = $this->chartFactory($this->getType(),true);
        foreach($this->getChart() as $k=>$v ) {

            if (!is_array($v) && !($v instanceof ArrayAccess))
            {
                $lines = explode("\n",trim($v));
                $prop = array();
                foreach ($lines as $line)
                    //$line = trim($line);
                    if (strpos($line,'|')) {
                        $sublines = explode ('|', $line);
                        $sary = array();
                        foreach ($sublines as $sline)
                            $sary[] = (strpos($sline,',')) ? explode(",", trim($sline)) : $sline;
                        
                        $prop[] = $sary;

                    }
                    else {
                        $prop[] = array(explode(",", trim($line)));
                    }
                
                    

                $v = $prop;
            }

            if (method_exists($obj, 'add'.$k)) {
//Prado::trace('add'.$k." ".  TVarDumper::dump($v),'Json');



                foreach ($v as $param) {
                    call_user_func_array(array($obj,'add'.$k), $param);
                }

            }
            elseif (method_exists($obj, 'set'.$k)) {
                    call_user_func_array(array($obj,'set'.$k), $v[0]);

            }
        }
        

    }

        /**
	 * @return integer the tab index of the control
	 */
	public function getType()
	{
		return $this->getViewState('Type',0);
	}

	/**
	 * Sets the tab index of the control.
	 * Pass 0 if you want to disable tab index.
	 * @param integer the tab index to be set
	 */
	public function setType($value)
	{
		$this->setViewState('Type',TPropertyValue::ensureString($value),'Bar');
	}

    /**
     * Returns the list of custom chart attributes.
     * Custom attributes are name-value pairs that may be rendered
     * as HTML tags' attributes.
     * @return TAttributeCollection the list of custom attributes
     */
    public function getChart() 	{

        if ($attributes=$this->getViewState('ChartProperties',null)) {
                return $attributes;
        }
        else
        {
                $attributes=new TAttributeCollection;
                $this->setViewState('ChartProperties',$attributes,null);
                return $attributes;
        }
    }


        /**
	 * @return string attribute value, null if attribute does not exist
	 
	public function getChart($name)
	{
		if($attributes=$this->getViewState('ChartProperties',null))
			return $attributes->itemAt($name);
		else
			return null;
	}

	
	 * Sets a custom control attribute.
	 * @param string attribute name
	 * @param string value of the attribute
	 
	public function setChart($name,$value)
	{
                $this->getChartProperties()->add($name,$value);
	}
*/

    public function chartFactory($type='bar',$force=false)
    {
        if ($force || $this->_chart === null) {

            $cls = 'g'.ucfirst($type).'Chart';

            $this->_chart = new $cls($this->Width,$this->Height);
        }
        return $this->_chart;

    }

    
    
    public function getImageUrl()
    {
        if ($this->_chart)
            return $this->_chart->getUrl();
        else
            return parent::getImageUrl();
    }








}



