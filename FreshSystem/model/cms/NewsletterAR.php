<?php
/**
 * Auto generated by prado-cli.php on 2008-04-16 12:58:06.
 */
class NewsletterAR extends NewsAR
{
	const TABLE='cms_newsletters';

	public $url;
	public $lang="cs";
	public $author;
	public $perex;
	public $published=1;
	public $sending=0;
	public static function finder($className=__CLASS__)
	{
		return parent::finder($className);
	}
}
?>