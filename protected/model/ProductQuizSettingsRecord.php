<?php

/**
 * Auto generated by prado-cli.php on 2009-12-13 01:51:36.
 */
class ProductQuizSettingsRecord extends ProductQuizSettingsAR {
	
	 public static $RELATIONS=array
	 (
	 	'quizsettings'=>array(self::HAS_MANY,'ProductQuizLessonAssociationRecord','quiz_settings_id'),
	 );
    
	public static function finder($className=__CLASS__) {
	
        return parent::finder($className);
    }
}