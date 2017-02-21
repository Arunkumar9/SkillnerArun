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
 * @version	$Id: FThumbnailProvider.php 2348 2013-12-20 10:20:54Z arun $
 * 
 */

class FThumbnailProvider extends FImageResponse
{

	public function getImageContent()
	{
		$request = Prado::getApplication()->Request;

        $width = (int) $request['w'];
        $height = (int) $request['h'];
        $params = Prado::getApplication()->Parameters;
        
        if (!$width && !$height)
        {
            $width = $params['defaultThumbWidth'];
            $height = $params['defaultThumbHeight'];
        }            
        else
        {
            $width = ($width) ? $width : 1000;
            $height = ($height) ? $height : 1000;
        }
        
        if (!($id = $request['id']))
           return $this->Manager->getFullFilename($params['errorImage']);
        $tfile = $this->Manager->getThumbnail($id,$width,$height);
	
	$base = Prado::getPathOfAlias('Root');
	$url = str_replace($base,$this->Request->BaseUrl,$tfile);
        $this->Response->Redirect($url);
	die();

	}
    
    public function getMimeType()
    {
        return 'image/jpeg';
    }
	
}
?>