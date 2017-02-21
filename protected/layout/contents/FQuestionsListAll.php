<?php
  
class FQuestionsListAll extends FNewsListAll
{
	
	public function getNews($offset=null,$limit=null)
	{
		if ($this->_news == null)
		{
			$criteria = new TActiveRecordCriteria;
			$criteria->OrdersBy['publish_date']="DESC";
			if ($this->getMaxNews() > 0)
				$criteria->Limit=$this->getMaxNews();
			$criteria->Condition = '';				
			if ($this->getRespectCulture())
			{
				$criteria->Condition .= "lang = :culture";
				$culture = strtolower($this->Application->Globalization->Culture);
				$criteria->Parameters[':culture'] = ($culture == 'sk')?'cs':$culture;
			}
			if ($this->getRespectDates())
				$criteria->Condition .= ' AND publish_date > 0 AND publish_date < UNIX_TIMESTAMP() ';

			$this->_news = QARecord::finder()->findAll($criteria);
		}

		return $this->_news ;
	}

}
