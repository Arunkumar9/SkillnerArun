<?php
/**
 * Auto generated by prado-cli.php on 2008-10-20 11:24:56.
 */
class ProductQuizSequenceAR extends FBaseActiveRecord
{
	const TABLE='product_quiz_sequence';

	public $uid;
	public $product_id;
	public $quiz_id;
	public $question_id;
	public $ordering;
	public $user_id;
	
    public static function finder($className=__CLASS__)
	{
		return parent::finder($className);
	}
}
