<?php
/**
 * Auto generated by prado-cli.php on 2008-04-16 12:58:06.
 */
class NewsAR extends FActiveLangRecord
{
	const TABLE='cms_news';

	public $uid;
	public $name;
	public $text;
	public $fromDate;
	public $toDate;
	public $published;
	public $category;
    public $lang;
    public $images='';
	public $created;

	public static function finder($className=__CLASS__)
	{
		return parent::finder($className);
	}
}
?>