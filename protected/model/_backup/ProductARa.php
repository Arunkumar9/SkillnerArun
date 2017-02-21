<?php
/**
 * Auto generated by prado-cli.php on 2008-07-11 11:22:12.
 */
class ProductARa extends TActiveRecord
{
	const TABLE='products';


	/**
	 * @var integer $uid
	 * @soapproperty
	 */
	public $uid;

	/**
	 * @var integer $type
	 * @soapproperty
	 */
	public $type;

	/**
	 * @var float $quantity
	 * @soapproperty
	 */
	public $quantity;

	/**
	 * @var string $model
	 * @soapproperty
	 */
	public $model;

	/**
	 * @var string $image
	 * @soapproperty
	 */
	public $image;

	/**
	 * @var float $price
	 * @soapproperty
	 */
	public $price;

	/**
	 * @var boolean $virtual
	 * @soapproperty
	 */
	public $virtual;

	/**
	 * @var integer $created
	 * @soapproperty
	 */
	public $created;

	/**
	 * @var integer $changed
	 * @soapproperty
	 */
	public $changed;

	/**
	 * @var integer $date_available
	 * @soapproperty
	 */
	public $date_available;

	/**
	 * @var float $weight
	 * @soapproperty
	 */
	public $weight;

	/**
	 * @var boolean $status
	 * @soapproperty
	 */
	public $status;

	/**
	 * @var integer $tax_class_id
	 * @soapproperty
	 */
	public $tax_class_id;

	/**
	 * @var integer $manufacturers_id
	 * @soapproperty
	 */
	public $manufacturers_id;

	/**
	 * @var float $ordered
	 * @soapproperty
	 */
	public $ordered;

	/**
	 * @var float $quantity_order_min
	 * @soapproperty
	 */
	public $quantity_order_min;

	/**
	 * @var float $quantity_order_units
	 * @soapproperty
	 */
	public $quantity_order_units;

	/**
	 * @var boolean $priced_by_attribute
	 * @soapproperty
	 */
	public $priced_by_attribute;

	/**
	 * @var boolean $product_is_free
	 * @soapproperty
	 */
	public $product_is_free;

	/**
	 * @var boolean $product_is_call
	 * @soapproperty
	 */
	public $product_is_call;

	/**
	 * @var boolean $quantity_mixed
	 * @soapproperty
	 */
	public $quantity_mixed;

	/**
	 * @var boolean $product_is_always_free_shipping
	 * @soapproperty
	 */
	public $product_is_always_free_shipping;

	/**
	 * @var boolean $qty_box_status
	 * @soapproperty
	 */
	public $qty_box_status;

	/**
	 * @var float $quantity_order_max
	 * @soapproperty
	 */
	public $quantity_order_max;

	/**
	 * @var integer $sort_order
	 * @soapproperty
	 */
	public $sort_order;

	/**
	 * @var boolean $discount_type
	 * @soapproperty
	 */
	public $discount_type;

	/**
	 * @var boolean $discount_type_from
	 * @soapproperty
	 */
	public $discount_type_from;

	/**
	 * @var float $price_sorter
	 * @soapproperty
	 */
	public $price_sorter;

	/**
	 * @var integer $master_categories_id
	 * @soapproperty
	 */
	public $master_categories_id;

	/**
	 * @var boolean $mixed_discount_quantity
	 * @soapproperty
	 */
	public $mixed_discount_quantity;

	/**
	 * @var boolean $metatags_title_status
	 * @soapproperty
	 */
	public $metatags_title_status;

	/**
	 * @var boolean $metatags_name_status
	 * @soapproperty
	 */
	public $metatags_name_status;

	/**
	 * @var boolean $metatags_model_status
	 * @soapproperty
	 */
	public $metatags_model_status;

	/**
	 * @var boolean $metatags_price_status
	 * @soapproperty
	 */
	public $metatags_price_status;

	/**
	 * @var boolean $metatags_title_tagline_status
	 * @soapproperty
	 */
	public $metatags_title_tagline_status;

	public static function finder($className=__CLASS__)
	{
		return parent::finder($className);
	}
}
?>