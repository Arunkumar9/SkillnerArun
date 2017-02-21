<?php
/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


class StatisticRecord extends FBaseActiveRecord {

    const TABLE="knt_statistics";

    public $Typ;
    public $Name;
    public $Created;
    public $branch_id;
    public $be_user_id;
    public $Updated;
    public $Mnth;
    public $Branch;
    public $Consultant;



    public static function finder($className=__CLASS__)
    {
            return parent::finder($className);
    }


}
