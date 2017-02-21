<?php
/**
 * Auto generated by prado-cli.php on 2008-07-30 01:19:58.
 */
class ProductAR extends FActiveLangRecord
{
	const TABLE='products';


	/**
	 * @var integer $uid
	 * @soapproperty
	 */
	public $uid;


	public $price=0;
	public $user_id;
	/**
	 * @var integer $category_id
	 * @soapproperty
	 */
	public $main_category_id=1;

	/**
	 * @var integer $manufacturer_id
	 * @soapproperty
	 */
	public $manufacturer_id=0;

	/**
	 * @var integer $default_image_id
	 * @soapproperty
	 */
	public $default_image_id=0;

	/**
	 * @var integer $parent_id
	 * @soapproperty
	 */
	public $parent_id=0;

	/**
	 * @var boolean $is_enabled
	 * @soapproperty
	 */
	public $is_enabled=1;

	/**
	 * @var string $sku
	 * @soapproperty
	 */
	public $content_id;

	/**
	 * @var string $name
	 * @soapproperty
	 */
	public $name;

	/**
	 * @var string $short_description
	 * @soapproperty
	 */
	public $short_description;

	/**
	 * @var string $description
	 * @soapproperty
	 */
	public $description;

	/**
	 * @var string $keywords
	 * @soapproperty
	 */
	public $keywords='';

	/**
	 * @var string $date_created
	 * @soapproperty
	 */
	public $date_created=0;

	/**
	 * @var string $date_updated
	 * @soapproperty
	 */
	public $date_updated=0;

	/**
	 * @var string $url
	 * @soapproperty
	 */
	public $url='';

	/**
	 * @var boolean $is_featured
	 * @soapproperty
	 */
	public $is_finished=0;
	public $is_recommended=1;
	public $is_new=0;
	public $is_other_flag=0;

	/**
	 * @var integer $type
	 * @soapproperty
	 */
	public $type=0;

	/**
	 * @var integer $vote_sum
	 * @soapproperty
	 */
	public $vote_sum=0;

	/**
	 * @var integer $vote_count
	 * @soapproperty
	 */
	public $vote_count=0;

	/**
	 * @var float $rating
	 * @soapproperty
	 */
	public $rating=0;

	/**
	 * @var integer $hits
	 * @soapproperty
	 */
	public $hits=0;

	/**
	 * @var float $minimum_quantity
	 * @soapproperty
	 */
	public $minimum_quantity=0;

	/**
	 * @var float $shipping_surcharge
	 * @soapproperty
	 */
	public $shipping_surcharge=0;

	/**
	 * @var boolean $is_separate_shipment
	 * @soapproperty
	 */
	public $is_separate_shipment=0;

	/**
	 * @var boolean $is_free_shipping
	 * @soapproperty
	 */
	public $is_free_shipping=0;

	/**
	 * @var boolean $is_back_orderable
	 * @soapproperty
	 */
	public $is_back_orderable=0;

	/**
	 * @var boolean $is_fractional_unit
	 * @soapproperty
	 */
	public $is_fractional_unit=0;

	/**
	 * @var float $shipping_weight
	 * @soapproperty
	 */
	public $shipping_weight=0;

	/**
	 * @var float $stock_count
	 * @soapproperty
	 */
	public $stock_count=0;

	/**
	 * @var float $reserved_count
	 * @soapproperty
	 */
	public $reserved_count=0;

	/**
	 * @var integer $sales_rank
	 * @soapproperty
	 */
	public $sales_rank=0;

	/**
	 * @var integer $position
	 * @soapproperty
	 */
	public $ordering=0;
        public $cool_url='';
        public $vat=20;

	/**
	 * @var string $images
	 * @soapproperty
	 */
	public $images='';
	public $icons='';
	public $availability='';
    public $company_id;
        
	public static function finder($className=__CLASS__)
	{
		return parent::finder($className);
	}
}
?>