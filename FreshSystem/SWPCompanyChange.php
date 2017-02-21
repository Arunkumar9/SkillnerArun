<?php
class SWPCompanyChange {
	
	/**
	 * This method is useful to update the company parameter in to the videos ,  products , cms_containers tables 
	 * @param String $user_id      (value in UserName column of the be_users table) .
	 * @param Integer $company_id
	 */
	public function changeCompanyOfUser($user_id , $company_id=1) {
	  SWPLogManager::log("Company Parameter updation to the  videos ,  products , cms_containers tables Input we got",array("User_id"=>$user_id,"company_id"=>$company_id),TLogger::DEBUG,$this,"changeCompanyOfUser","FreshSystem");
	  
	  try {
		  if(!empty( $user_id ) ){
		  	
		  		//Update Videos (Lessions and Quizes we create should be under one company)
	            $videosSql   = "SELECT * FROM videos  WHERE user_id ='".$user_id."'" ;
			 	$videosList = TActiveRecord::finder('VideoRecordBase')->findAllBySql($videosSql);
			 	if(count($videosList)) {
			 		foreach($videosList as $video) {
			 			$video->company_id = $company_id;
			 			$video->save();
			 		}
			 	}
			 	
			 	//Update produts (Courses which we create should be under one company)
		  		$productsSql   = "SELECT * FROM products  WHERE user_id ='".$user_id."'";
			 	$productsList = TActiveRecord::finder('ProductRecord')->findAllBySql($productsSql);
			 	if(count($productsList)) {
			 		foreach($productsList as $product) {
			 			$product->company_id = $company_id;
			 			$product->save();
			 		}
			 	}
			 	
			 	//Update cms_container (Tags which we create should be under one company)
		  		$tagsSql   = "SELECT * FROM cms_containers  WHERE name ='".$user_id."'" ;
			 	$tagsList = TActiveRecord::finder('ContainerRecord')->findAllBySql($tagsSql);
			 	if(count($tagsList)) {
			 		foreach($tagsList as $tag) {
			 			$tag->company_id = $company_id;
			 			$tag->save();
			 		}
			 	}
	      }
	  }catch (Exception $e){
		 SWPLogManager::log("We Got Some SQL Error While Executing SQL => Error  : ",array("Error Message"=>$e->getMessage()),TLogger::ERROR,$this,"changeCompanyOfUser","FreshSystem");
	  }
       SWPLogManager::log("Company Parameter updation to the  videos ,  products , cms_containers tables Is Completed",array("User_id"=>$user_id,"company_id"=>$company_id),TLogger::DEBUG,$this,"changeCompanyOfUser","FreshSystem");
	}
}

?>