<?php


class SWPLogManager extends TComponent{


 public static function log( $msg="",$dataobject,$loglevel=TLogger::ERROR,$referenceClass,$method,$catogery="SWP"){

        $user = Prado::getApplication()->getUser();
        $userInfo ="";
        if(!empty( $user ) ){
            $userInfo = " User --(" .$user->Username." --) ";
        }

        $msg = $userInfo . " Message --( " . $msg ." --)  " ;
        if( !empty($referenceClass)){
        	$msg = $msg ." From Class --( ".get_class($referenceClass) ." --)";
        }
        if( !empty($method)){
        	$msg = $msg ." Method Name --( ".$method ." --)";
        }

        if(!empty($dataobject)){
        	$msg = $msg . "data -- ( ".print_r($dataobject,true)." --)";
        }

         Prado::log($msg,$loglevel,$catogery);
    }
}
