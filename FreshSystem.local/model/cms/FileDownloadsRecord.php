<?php
/* 
 * files and directories abstracted in ActiveRecord
 */

class FileDownloadsRecord extends FileRecord  {

    const PANEL = 'Downloads';

     public static function finder($className=__CLASS__)
    {
            return parent::finder($className);
    }

}