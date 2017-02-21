<?php

/**
 * 
 */

class ContainerCategoryAR extends FBaseActiveRecord
{
	const TABLE='videos_containers';

	public $video_id;
	public $container_id;

	public static function finder($className=__CLASS__) {
		
		return parent::finder($className);
	}

}

?>