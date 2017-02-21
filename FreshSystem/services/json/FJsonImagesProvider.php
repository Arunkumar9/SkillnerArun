<?php
/* FJsonFileProvider.php
 * 
 * Part of Fresh! Project
 * Created by rosa
 * Created on 17.10.2006
 */

class FJsonImagesProvider extends FJsonResponse
{
	protected $request;
	
	public function getJsonContent()
	{
		if (!$this->getIsAuthorized())
			return array('success'=>false, 'error'=>'Not authorized!');

		$this->request = Prado::getApplication()->Request;

		if ($this->request['node']=='..')
			return array('success'=>false, 'error'=>'Bad request!');
		
		$cmd = $this->request['cmd'];
		$method = 'cmd'.ucfirst($cmd);
		if (!is_callable(array($this,$method)) ) {
			$result = $this->cmdDefault();
		} else {
			$result = $this->$method();
		}	
//die($this->getIni('BaseDir'));
		return array('component'=>$result);

	}

	public function getDir($path) 
	{
		$baseDir = Prado::getPathOfNamespace( $this->getIni('BaseDir').'.*' );
		$dir = str_replace('/root/',$baseDir.'/',$path);
		if ($dir == '/root') $dir = $baseDir;
		return $dir;
	}

/*
	public function getDir($album,$node) 
	{
		$baseDir = Prado::getPathOfNamespace( $this->getIni('BaseDir').'.*' );
		$dir = ($album)?$baseDir.'/'.$album:$baseDir;
		return $dir;
	}

*/
	public function isReadOnly($path)
	{
		return false;
	}
	
	public function getQTip($path)
	{
		return "Size: ".filesize($path);
	}
	
	public function notShow($file)
	{
		$pattern = $this->getIni('notShow');
		return preg_match("/$pattern/",$file);
	}
	
	
/**

	Commands

*/

	public function cmdDefault()
	{
		$album = $this->request['album'];
		$album = (!$album)?'/root/':$album.'/';
		
		$pattern = $this->getIni('pattern');
		$baseUrl = $this->getIni('BaseUrl').'/'.str_replace('/root/','',$album);
		$dir = $this->getDir($album);

		Prado::Trace('JsonImagesProvider::cmdDefault '.$dir);
		
		$files = glob($dir.'/'.$pattern,GLOB_BRACE);
	//	Prado::Trace('JsonImagesProvider::cmdDefault '.TVarDumper::dump($files));

		$result = array(); $images = array();
		foreach ($files as $fullPath)
		{
			$name = basename($fullPath);
    		$size = filesize($fullPath);
			list($width, $height) = getimagesize($fullPath);
    		$lastmod = filemtime($fullPath)*1000;
		    $images[] = array(
						'name'=>$name, 
						'size'=>$size, 
						"width" => $width,
					    "height" => $height,
						'lastmod'=>$lastmod, 
						'url'=>$baseUrl.$name);
		}
		return array('images'=>$images);
		
	}
	


	public function cmdGet()
	{
		$node = $this->request['path'];
		$dir = $this->getDir($node);
		
		Prado::Trace('JsonImagesProvider::cmdGet '.$dir);

		$files = glob($dir.'/*',GLOB_ONLYDIR);
//		Prado::Trace('JsonImagesProvider::cmdGet '.TVarDumper::dump($files));
		
		$result = array();
		foreach ($files as $fullPath)
		{
			$file = basename($fullPath);
//			if ($file == '.' || $file == '..' || $this->notShow($file)) { continue;	}
			
			//$fullPath = $dir.'/'.$file;
			$info = pathinfo($fullPath);
			
			$item = array();
			$item['text'] = $file;
			$item['disabled'] = $this->isReadOnly($fullPath);
			
			if (is_dir($fullPath)) {
				$item['cls'] = 'folder';
				$item['leaf'] = false;
				$item['id'] = $file;//$node.'/'.$file;
			} else {
				$item['cls'] = 	'file-'.$info['extension'];
				$item['qtip'] = $this->getQTip($fullPath);
				$item['leaf'] = true;
				$item['id'] = $node.'/'.$file;
			}

			$result[] = $item;
//			Prado::Trace('JsonImagesProvider::cmdGet '.TVarDumper::dump($item));
		}
		return $result;
		
	}
	
	
}	
/*
	public function getImages() 
	{
		$dir = "../FreshSystem/images/catalog/";
$images = array();
$d = dir($dir);
while($name = $d->read()){
    if(!preg_match('/\.(jpg|gif|png)$/', $name)) continue;
    $size = filesize($dir.$name);
    $lastmod = filemtime($dir.$name)*1000;
    $images[] = array('name'=>$name, 'size'=>$size, 
			'lastmod'=>$lastmod, 'url'=>'FreshSystem/images/catalog/'.$name);
}
$d->close();
$o = array('images'=>$images);
echo json_encode($o);
	}

*/
?>