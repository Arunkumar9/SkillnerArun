<?php
  
class CommentsList extends FNewsListAll
{
	
	public function getNews($offset=null,$limit=null)
	{

                if ($this->_news == null)
		{
			$criteria = new TActiveRecordCriteria;
			$criteria->OrdersBy['input_date']="DESC";

                        $criteria->Condition = 'fe_user_id = :userid ' ;
                        $criteria->Parameters[':userid'] = $this->getUser()->Uid;
                        
			if ($this->getRespectCulture())
			{
				$criteria->Condition .= " AND lang = :culture";
				$culture = strtolower($this->Application->Globalization->Culture);
				$criteria->Parameters[':culture'] = ($culture == 'sk')?'cs':$culture;
			}
			if ($this->getRespectDates())
				$criteria->Condition .= ' AND input_date > 0 AND input_date < UNIX_TIMESTAMP() ';

			$this->_news = CommentRecord::finder()->findAll($criteria);
		}

		return $this->_news ;
	}

}
