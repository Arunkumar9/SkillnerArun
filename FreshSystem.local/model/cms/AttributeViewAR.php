<?php
/**
 * Auto generated by prado-cli.php on 2008-03-04 07:59:30.
 */
class AttributeViewAR extends FActiveLangRecord
{
	const TABLE='view_attributes';

    public $uid;
    public $product_id;
    public $value;
    public $definition_uid;
    public $price_add=0;
    public $price_coef=1;
    public $price=0;
    public $is_enabled=1;
    public $is_default=0;
    public $type=1;
    public $i18n=1;
    public $name='';
    public $discr='attributes';
    public $ordering=0;


    public static function finder($className=__CLASS__)
	{
		return parent::finder($className);
	}
}
?>