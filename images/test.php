<?php
//echo strtotime('+ 1 day');
echo round( 100/1000,2,PHP_ROUND_HALF_UP);
//$aaa=[];
/*
$a;
$b=1;
if($a=$b){
	echo 'coming';
} else {
	echo 'not coming';
}
$aaa[1] = 11;
$aaa[3] = 12;

if(! $aaa[0]) {
//	echo 'got';
}

if($aaa[1]) {
//	echo 'exists';
}
///echo $aaa[2];
///echo $aaa[3];
var arr = [
                   {name: 'name', type : 'string'},
                   {name: 'firstAttemptScore', type: 'int'},
                   {name: 'firstLeastScore', type: 'int'},
                   {name: 'secondLeastScore', type: 'int'},
                   {name: 'thirdLeastScore', type: 'int'},
                   {name: 'fourthLeastScore', type: 'int'},
                   {name: 'fifthLeastScore', type: 'int'},
                   {name: 'fifthScore', type: 'int'},
                   {name: 'fourthScore', type: 'int'},
                   {name: 'thirdScore', type: 'int'},
                   {name: 'secondScore', type: 'int'},
                   {name: 'firstScore', type: 'int'},
                   {name: 'lastAttemptScore', type: 'int'},
                   {name: 'answeredPercentage', type: 'int'}
            ];

			$blockAndHitCounts = array(2,2,4,4,8,8,8);
			$currentBlockValue = 0;
		 	$count = 0 ; 
		 	$blockValueArray[0]='Hit Map';
		 	for($j = 0 ; $j< sizeof($blockAndHitCounts);  $j++ ) {
		 		$blockvalue =$blockAndHitCounts[$j]; 
		 		 if($blockvalue != $currentBlockValue) {
		 			
		 			if($count != 0){
		 				
		 				for($i=1 ; $i<($blockvalue) ; $i++) {
		 					//place the value corresponding to the block
		 					if($i == ($currentBlockValue) ) {
		 						$blockValueArray[$i] = $count;
		 						$count = 0;
		 					} else {
		 						//if the value does not exists in the perticular 
		 						//slot in the array then place the value
		 						if(! $blockValueArray[$i]) {
		 							$blockValueArray[$i] = 0;
		 						}
		 					}
		 				}
		 				$count = 0;
		 			}
		 			
		 			$currentBlockValue = $blockvalue;
		 			
		 		    //first time comming for each unique block value
		 			if($count == 0){
		 				$count = $count+1 ;
		 			}
		 			
		 		} else {
		 			$count = $count+1 ;
		 		}
		 	}
		 	
		 	//For the Last Record
	 		for($i=1 ; $i<=($currentBlockValue) ; $i++) {
 					//place the value corresponding to the block
 					if($i == ($currentBlockValue) ) {
 						$blockValueArray[$i] = $count;
 						$count = 0;
 					} else {
 						//if the value does not exists in the perticular 
 						//slot in the array then place the value
 						if(! $blockValueArray[$i]) {
 							$blockValueArray[$i] = 0;
 						}
 					}
 			}
 			
for($k=0 ; $k < sizeof($blockValueArray) ; $k++ ) {
	
	echo $blockValueArray[$k];
} 




/*Working Fine
 * 
$user = Prado::getApplication()->getUser();
		$userId = $user->Username;
		$contentId = $user->ContentID;
		$productId = $user->ProductID;
		$blockValueArray;
    	//$lastRunInfoRecords = LastRunRecord::finder()->findAll('product_id=? AND content_id=?', $product_id,$content_id);
    	 $blockAndHitCountSql = "SELECT * FROM `last_run_info` WHERE product_id = ".$productId." and content_id =".$contentId."  
    	                         and blockvalue !=0  order by blockvalue";
		 $blockAndHitCounts = TActiveRecord::finder('LastRunRecord')->findAllBySql($blockAndHitCountSql);
		 //var_dump($blockAndHitCounts);
		 if(count($blockAndHitCounts) > 0 ){
		 	$currentBlockValue = 0;
		 	$count = 0 ; 
		 	
		 	foreach($blockAndHitCounts as  $blockAndHitCount) {
		 		$blockvalue = $blockAndHitCount->blockvalue;
		 		if($blockvalue != $currentBlockValue) {
		 			
		 			if($count != 0){
		 				
		 				for($i=0 ; $i<($blockvalue-1) ; $i++) {
		 					//place the value corresponding to the block
		 					if($i == ($currentBlockValue-1) ) {
		 						$blockValueArray[$i] = $count;
		 						$count = 0;
		 					} else {
		 						//if the value does not exists in the perticular 
		 						//slot in the array then place the value
		 						if(! $blockValueArray[$i]) {
		 							$blockValueArray[$i] = 0;
		 						}
		 					}
		 				}
		 				$count = 0;
		 			}
		 			
		 			$currentBlockValue = $blockvalue;
		 			
		 		    //first time comming for each unique block value
		 			if($count == 0){
		 				$count = $count+1 ;
		 			}
		 			
		 		} else {
		 			$count = $count+1 ;
		 		}
		 	}
		 	
		    //For the Last Record
	 		for($i=0 ; $i<($currentBlockValue) ; $i++) {
 					//place the value corresponding to the block
 				if($i == ($currentBlockValue-1) ) {
 					$blockValueArray[$i] = $count;
 					$count = 0;
 				} else {
 					//if the value does not exists in the perticular 
 					//slot in the array then place the value
 					if(! $blockValueArray[$i]) {
 						$blockValueArray[$i] = 0;
 					}
 				}
 			}
		 }
		
    	return $blockValueArray;
 * 
 * 
 * 
**/