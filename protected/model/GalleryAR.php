<?php
/**
 * Auto generated by prado-cli.php on 2009-12-13 01:51:36.
 */
class GalleryAR extends FActiveLangRecord
{
	const TABLE='cms_galleries';

	public $uid;
	public $is_enabled=1;
	public $name;
	public $name_en;
	public $name_other;
	public $seo_description;
	public $description;
	public $seo_keywords;
	public $date_created;
	public $date_updated;
        public $from_date=0;
	public $cool_url;
	public $is_featured=0;
	public $hits=0;
	public $ordering=0;
	public $images;
        public $author;
        public $category_id;


	public static function finder($className=__CLASS__)
	{
		return parent::finder($className);
	}

}