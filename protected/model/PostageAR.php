<?php
/**
 * Auto generated by prado-cli.php on 2008-10-13 12:51:06.
 */
class PostageAR extends FBaseActiveRecord
{
	const TABLE='postages';

	public $uid;
	public $name;
	public $price;
	public $lang;
	public $advance=0;
        public $codlv;

	public static function finder($className=__CLASS__)
	{
		return parent::finder($className);
	}
}
?>