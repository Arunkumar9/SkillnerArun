<?php
  
class DbList extends FStyledTemplateControl
{
	
	protected $_max_data=0;
	protected $_data_condition;
	protected $_data_parameters;
        protected  $_data;
	protected $_page_size=0;
        protected $_record_class='ProductRecord';
	

        public function onLoad($param)
        {
                parent::onLoad($param);
                $this->populateData();
        }

        public function populateData()
	{
		if ($this->Repeater->AllowPaging = ($this->getPageSize()>0))
			$this->Repeater->PageSize = $this->getPageSize();
		if (true || !$this->Page->IsPostback)
		{
	        $this->Repeater->DataSource = $this->getData();
			$this->Repeater->dataBind();
		}
        }        
        
        public function getData($offset=null,$limit=null)
	{
		if ($this->_data == null)
		{
			$criteria = new TActiveRecordCriteria;
			$criteria->setCondition("({$this->getDataCondition()})");
                        $criteria->Parameters = $this->getDataParameters();
			if ($this->getMaxData() > 0)
				$criteria->Limit=$this->getMaxData();
			$this->_data = FBaseActiveRecord::finder($this->getRecordClass)->findAll($criteria);
		}

		return $this->_data ;
	}

	public function setMaxData($value)
	{
		$this->_max_data = TPropertyValue::ensureInteger($value);
	}

	public function getMaxData()
	{
		return $this->_max_data;
	}

	public function setDataCondition($value)	
	{
		$this->_data_condition = $value;
	}

	public function getDataCondition()	
	{
		return ($this->_data_condition) ? $this->_data_condition : '1=1';
	}

	public function setRecordClass($value)
	{
		$this->_record_class = $value;
	}

	public function getRecordClass()
	{
		return $this->_record_class;
	}

	public function setDataParameters($value)
	{
		$this->_data_parameters = $value;
	}

	public function getDataParameters()
	{
		if ($this->_data_parameters)
                    return (is_array($this->_data_parameters)) ? $this->_data_parameters : explode(',',  $this->_data_parameters);
                else
                    return array();
	}

        public function getPageSize()
	{
		return $this->_page_size;
	}

	public function setPageSize($value)
	{
                $this->_page_size = TPropertyValue::ensureInteger($value);
	}

}