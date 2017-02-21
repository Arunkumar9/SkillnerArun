<?php
  
class FNewsList extends FStyledTemplateControl
{
	protected $_news;
	protected $_respect_dates = true;
	protected $_culture = true;
    protected $_max_news;
    protected $_more_link;
    protected $_category;


    public function onLoad($param)
    {
	    parent::onLoad($param);
		if (true || !$this->Page->IsPostback)
		{
	        $this->Repeater->DataSource = $this->getNews();
			$this->Repeater->dataBind();
		}
    }


	public function getNews($offset=null,$limit=null)
	{
		if ($this->_news == null)
		{
			$criteria = new TActiveRecordCriteria;
			$criteria->OrdersBy['fromDate']="DESC";
			if ($this->getMaxNews() > 0)
				$criteria->Limit=$this->getMaxNews();
                        if ($this->getCategory()) {
                            $criteria->Condition = '(category=:category) ';				
                            $criteria->Parameters[':category'] = $this->getCategory();
                        } 
                        else
                            $criteria->Condition = '(1=1) ';
			if (false && $this->getRespectCulture())
			{
				$criteria->Condition .= " AND lang = :culture";
				$criteria->Parameters[':culture'] = strtolower($this->Application->Globalization->Culture);
			}
			if ($this->getRespectDates())
				$criteria->Condition .= ' AND fromDate <= UNIX_TIMESTAMP()  ';
			$this->_news = NewsRecord::finder()->findAll($criteria);
		}

		return $this->_news ;
	}

	public function getRespectCulture()
	{
		return $this->_culture;
	}
	
	public function setRespectCulture($value)
	{
		$this->_culture = TPropertyValue::ensureBoolean($value);
	}

	public function getRespectDates()
	{
		return $this->_respect_dates;
	}
	
	public function setRespectDates($value)
	{
		$this->_respect_dates = TPropertyValue::ensureBoolean($value);
	}

    public function giveMoreLink($id)
    {
		if (($uid = $this->getMoreLink()) && ($c = $this->getPage()->getContainer($uid)))
                    return $this->getPage()->getContainer($uid)->getAbsoluteHref(true,array('newsid'=>$id),true);
                else
                    return "#";
    }
	
    public function giveListLink($id)
    {
                if (($uid = $this->getMoreLink()) && ($c = $this->getPage()->getContainer($uid)))
                    return $c->getAbsoluteHref().'#'.$id;
                else
                    return "#";
		
    }

	public function getMaxNews()
	{
		return $this->_max_news;
	}
	
	public function setMaxNews($value)
	{
		$this->_max_news = (int) $value;
	}
    
	public function getMoreLink()
	{
		return $this->_more_link;
	}
	
	public function setMoreLink($value)
	{
		$this->_more_link = (string) $value;
	}

	public function getCategory()
	{
		return $this->_category;
	}

	public function setCategory($value)
	{
		$this->_category = $value;
	}


}
