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
 * @version	$Id: FPreviewDBProvider.php 2348 2013-12-20 10:20:54Z arun $
 * 
 */

class FPreviewDBProvider extends FImageResponse
{
	protected $format;
	protected $_mimetype;
	
	public function getImageContent()
	{
		$request = Prado::getApplication()->Request;

        $width = (int) $request['w'];
        $height = (int) $request['h'];
	$format = $request['f'];
	$this->format = ($format) ? $format : 'jpeg';
	
        $params = Prado::getApplication()->Parameters;
        
        if ($width || $height)
        {
            $width = ($width) ? $width : 1000;
            $height = ($height) ? $height : 1000;
        }
        
        if (!($id = $request['id']) || !($rec = AttachRecord::finder()->findByPk($id)))
           return $this->Manager->getFullFilename($params['errorImage']);
        
	
	if (stripos($rec->type,'pdf') === false && stripos($rec->name,'.pdf') === false )
		return $this->previewBitmap($rec->data,$rec->type);
	else	
		return $this->previewPDF($rec->data);
	
	/*$im = new Imagick();
	$im->readImageBlob($rec->data);
	$im->resizeImage($width,$height,imagick::FILTER_CUBIC);
	$im->setImageFormat($this->format);
	return $im; */
	}
	
    protected function previewBitmap($content,$mime) {
	$this->_mimetype = $mime;
	return $content;
    }
    
    protected function previewPDF($content,$mime=null) {
	
	$this->_mimetype = 'application/x-shockwave-flash';

	$pdf = tempnam('pdf','previewdb');//.'.pdf';
			
	$swf = $pdf.'.swf';
	$pdf = $pdf.'.pdf';

	file_put_contents($pdf,$content);
	
	if ($_SERVER['WINDIR']) {
		exec( "d:/swftools/pdf2swf.exe -B /usr/share/swftools/swfs/simple_viewer.swf -z -q ${pdf} ${swf}" );
	} else {
		exec( "pdf2swf  -B /usr/share/swftools/swfs/keyboard_viewer.swf -z -s zoom=1000 -q ${pdf} ${swf}" );
	}
	
	//send content
	return file_get_contents($swf);
	
    }
    
    public function getMimeType()
    {
        return ($this->_mimetype) ? $this->_mimetype : 'image/'.$this->format;
    }
	
}
?>