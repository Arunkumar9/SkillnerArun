<?php
/**
 * Auto generated by prado-cli.php on 2008-07-11 12:26:36.
 */
class ProductViewRecord extends ProductAR
{
	const TABLE='view_products_categories';

	public $product_id;
	public $category_id;
	
	
	public function getFirstImage()
	{
			//
		if ($this->images) 
		{
			$images = json_decode($this->images,true);
			//var_dump($images); die();
			//if (is_array($images))
				return $images[0]['uid'];
		}
		return 'resources/images/nahled.jpg';
	}
	
	public static function finder($className=__CLASS__)
	{
		return parent::finder($className);
	}
}
?>