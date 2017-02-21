<?php
class ContainerTagRecord extends ContainerCategoryRecord
{

     public static function finder($className=__CLASS__)
	{
		return parent::finder($className);
	}

	public function getIsFolder()
	{
		return ($this->type_id == 'CategoriesRoot');
	}

	public function getNodeType()
	{
		return ($this->IsFolder)?'folder':'leaf';
	}

    /**
     * Populates a new record with the query result.
     * This is a wrapper of {@link createRecord}.
     * @param array name value pair of record data
     * @return TActiveRecord object record, null if data is empty.
     */
    protected function populateObject($data)
    {
        $class = get_class($this);
        return self::createRecord($class, $data);
    }


}