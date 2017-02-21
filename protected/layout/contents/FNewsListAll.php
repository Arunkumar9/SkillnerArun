<?php
  
class FNewsListAll extends FNewsList
{
/*
	private $_news;
	private $_respect_dates;
*/

	private $_page_size;

    public function onLoad($param)
    {
	    TTemplateControl::onLoad($param);
		$this->Repeater->AllowPaging = ($this->getPageSize()>0);
		if ($this->getPageSize()>0)
			$this->Repeater->PageSize = $this->getPageSize();
		if (!$this->Page->IsPostback)
		{
	        $this->Repeater->DataSource = $this->getNews();
			$this->Repeater->dataBind();
		}
    }
	
	
/*
	public function getNews($offset=null,$limit=null)
	{
		if ($this->_news == null)
		{
			$criteria = new TActiveRecordCriteria;
			$criteria->OrdersBy['fromDate']="DESC";
			if ($this->getRespectDates())
				$criteria->Condition = 'fromDate <= UNIX_TIMESTAMP() AND (toDate >= UNIX_TIMESTAMP() OR toDate=0)';

			$this->_news = NewsRecord::finder()->findAll($criteria);
			
			
		}

		return $this->_news ;
	}

	public function getRespectDates()
	{
		return $this->_respect_dates;
	}
	
	public function setRespectDates($value)
	{
		$this->_respect_dates = TPropertyValue::ensureBoolean($value);
	}
	
*/
	public function getPageSize()
	{
		return $this->_page_size;
	}
	
	public function setPageSize($value)
	{
		$this->_page_size = TPropertyValue::ensureInteger($value);
	}

    /**
     * Event handler to the OnPageIndexChanged event of pagers.
     */
    public function pageChanged($sender,$param)
    {
		//$this->populateData($param->NewPageIndex);
       $this->Repeater->DataSource = $this->getNews();
	   $this->Repeater->CurrentPageIndex=$param->NewPageIndex;
	   $this->Repeater->dataBind();
    }
}
