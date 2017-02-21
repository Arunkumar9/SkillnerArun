<?php
class ContainerCategoryRecord extends ContainerCategoryAR
{
  public static function finder($className=__CLASS__) {
		return parent::finder($className);
  }
}
?>