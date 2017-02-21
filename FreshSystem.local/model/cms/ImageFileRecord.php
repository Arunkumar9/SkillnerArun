<?php
/* 
 * files and directories abstracted in ActiveRecord
 */

class ImageFileRecord extends FileRecord  {

    const PANEL = 'Images';

    public static function finder($className=__CLASS__)
    {
            return parent::finder($className);
    }

}

