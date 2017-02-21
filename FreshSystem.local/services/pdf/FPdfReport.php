<?php
/* FPdfReport.php
 * 
 * Part of Fresh! Project
 * Created by rosa
 * Created on 17.10.2006
 */
error_reporting (E_ALL && E_NOTICE);

//Prado::using('Common.fresh.services.json.FJsonResponse');
class FPdfReport extends FPdfResponse
{
//	const ACCESS_DENIED='access_deny.pdf';
	const ACCESS_DENIED='hlpapir.pdf';
	
	public function getPdfContent()
	{
		Prado::getApplication()->Session->Open();
		$tplDir = Prado::getPathOfNamespace('Common.fresh.template.*');
		$request = Prado::getApplication()->Request;
		$session = Prado::getApplication()->Session;

		$rep = ($request['report'])?$request['report']:$request['id'];
		$params = $request['params'];
		if (!is_array($params))
		{
			//$params = preg_split(FU::PREG_URL_ARRAY,$params);
			$params = explode('|',$params);
		}
		//die($rep);
		//$username = Prado::getApplication()->getUser()->name;
		//$uid = Prado::getApplication()->getUser()->uid;
		$level = Prado::getApplication()->getUser()->level;
		$report = Prado::getData()->Session
								 ->getTable('Report')
								 ->find($rep);

		if ( $report->_read_level < $level && count($report)==0 )
		{
			return file_get_contents($tplDir.'/'.self::ACCESS_DENIED);
		}
		else
		{
			Prado::using('Common.fresh.3rdParty.pdfTemplate.pdfDocument');
			
			
			$options = array(
				'underlay' => ($report->underlay)?$tplDir.'/'.$report->underlay:null,
				'template' => ($report->template)?$tplDir.'/'.$report->template:null,
			);
	
			$defParams = array();
			parse_str($report->params,&$defParams);

			$params = FU::defaultParams($params,$defParams);
			$params[':uid'] = str_replace(',',"','",$params[':uid']);
			
			$doc= new pdfDocument($options);
			$dql = str_replace(':uid',"'".$params[':uid']."'",$report->dql);
			unset($params[':uid']);
			$res = Prado::getData()->Session->query($dql,$params);
			if (count($res))
				$doc->DataSource['page'] = FU::DcToArray($res);

//var_dump($doc->DataSource['page']);
//die();

			$doc->readTemplate();
			//die('zz'.count($doc->DataSource['page']));
//			$doc->pageFromTemplate('FP');

				
			//echo $report->dql.' '.$rep;	
			//var_dump($doc->DataSource['page']);
			//die();
			$doc->Draw();
//			die('aaa');
			return $doc->Output('','S');
		}
	}
	
	public static function debugPdf($doc)
	{
		echo "<pre>";
		$doc->draw();
		foreach($doc->pages as $page)
		{
			foreach($page->objects as $obj)
			{
				echo get_class($obj)."::id ".$obj->params['id']."\n";

				foreach($obj->objects as $o)
				{
					echo ' '.get_class($o)."::id ".$o->params['id'].' '.$o->params['text']."\n";
					foreach($o->objects as $A){
						echo '  '.get_class($A)."::id ".$A->params['y'].' '.$A->params['text']."\n";
					}
				}
			}
		}
		echo "</pre>";
	}	
}
?>