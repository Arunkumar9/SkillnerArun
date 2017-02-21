<?php
/**
 * 
 * @project Fresh!
 * 
 * @package Fresh.web.services.json

 * @fileOverview
 * 
 * @author Jan Rosa
 * @copyright Copyright &copy; Jan Rosa, 2008
 * @version	$Id: FJsonComponentListProvider.php 2348 2013-12-20 10:20:54Z arun $
 * 
 */

class FJsonComponentListProvider extends FJsonComponentProvider
{
	public function getJsonContent()
	{
		SWPLogManager::log("Content related to the login user role and auth levels",null,TLogger::INFO,$this,"getJsonContent","FreshSystem");
		if (!$this->getIsAuthorized()){
			
			SWPLogManager::log("getJsonContent return status as false,if login user is not authorized.",array('success'=>false, 'message'=>'Not authorized!'),TLogger::INFO,$this,"getJsonContent","FreshSystem");
			return array('success'=>false, 'message'=>'Not authorized!');
		}

		$user = $this->User;
		//echo TVarDumper::dump($user);
        $files = glob($this->Path.'/*.yml');
        foreach($files as $file)
        {
            $data = $this->getYamlData(basename($file,'.yml'));
            $name = $data['description']['name'];
            $level = $data['description']['authLevel'];
            $role = $data['description']['authRole'];

            if ($name && 
                ($level['min']<=$user->Level && $level['max']>=$user->Level ||
                $user->IsInRole($role) ||
                !$level && !$role
                ))
                $list[] = $data['description'];
        }
        setlocale(LC_COLLATE, $this->getApplication()->getGlobalization()->getLongCulture());
        usort($list,array($this,'sortByText'));
        SWPLogManager::log("getJsonContent return json content related to login user role and auth levels as an array",array('component'=>array('success'=>true,'result'=>$list)),TLogger::INFO,$this,"getJsonContent","FreshSystem");
		return array('component'=>array('success'=>true,'result'=>$list));

	}

        public function sortByText($a,$b) {
			SWPLogManager::log("sortByText: Sorting can be done by this method",array("params" =>array("a"=>$a, "b"=>$b)),TLogger::INFO,$this,"sortByText","FreshSystem");
            $at = $a['text'];
            $bt = $b['text'];
	    	SWPLogManager::log("sortByText returns the sorted array",strcoll($at, $bt),TLogger::INFO,$this,"sortByText","FreshSystem");
            return strcoll($at, $bt);
        }
	
}

?>
