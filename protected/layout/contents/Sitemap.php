<?php
  
class Sitemap extends FStyledTemplateControl
{
	private $_maxlevel;
	private $_rootid;
	private $_news;
	public function getRootId()
	{
		return $this->_rootid;
	}

	public function setRootId($value)
	{
		$this->_rootid = TPropertyValue::ensureInteger($value);
	}

	public function getMaxLevel()
	{
		return $this->_maxlevel;
	}

	public function setMaxLevel($value)
	{
		$this->_maxlevel = TPropertyValue::ensureInteger($value);
	}
    public function onLoad($param)
    {
        parent::onLoad($param);

     }

	public function getNewsletters($offset=null,$limit=null)
	{
		if ($this->_news == null)
		{
			$criteria = new TActiveRecordCriteria;
			$criteria->OrdersBy['fromDate']="DESC";
			$criteria->Condition = 'Published>0';
			$this->_news = NewsletterRecord::finder()->findAll($criteria);

		}

		return $this->_news ;
	}
	 public function getDetaiNewsletterLink($data,$page='newsletter')
    {
		$container = $this->Page->getContainer($page);
		if ($container)
			return $container->getHref(false,array('catid'=>$data->catid));
		else
			return '#';

    }
}
