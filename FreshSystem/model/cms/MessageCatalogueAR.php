<?php
/**
 * Auto generated by prado-cli.php on 2008-04-20 01:05:07.
 */
class MessageCatalogueAR extends FBaseActiveRecord
{
	const TABLE='catalogue';

	public $cat_id;
	public $name;
	public $source_lang;
	public $target_lang;
	public $date_created;
	public $date_modified;
	public $author;

	public static function finder($className=__CLASS__)
	{
		return parent::finder($className);
	}
}
?>