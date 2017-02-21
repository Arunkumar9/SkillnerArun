<?php
/* FPdfReport.php
 * 
 * Part of Fresh! Project
 * Created by rosa
 * Created on 17.10.2006
 */
 set_time_limit(0);
error_reporting (E_ALL && E_NOTICE);
Prado::using('FreshSystem.services.xls.*');
class FXlsReport extends FXlsResponse
{
    protected $_ymlcfg;
    public $config;
	
	public static function createPdf($docName,$tplName,$params)
	{
		$tplDir = Prado::getPathOfNamespace('Root.resources.template.*');
		$options = array(
			'underlay' => $tplDir.'/'.$docName.'.pdf',
			'template' => $tplDir.'/'.$tplName.'.svg',
			'format'=>array(89*72/25.4,59*72/25.4),
			'units'=>'pt',
			'display'=>'fullpage',
			'layout'=>'single'
		);
		$doc= new pdfDocument($options);
		$doc->DataSource['page'] = $params;
		$doc->readTemplate();
		$doc->Draw();
		return $doc->Output('','S');
		
	}
	
	public function getXlsContent()
	{
		//if (!$this->getIsAuthorized())
			//throw new TInvalidOperationException('not_authorized');

		$user = $this->User;
		$request = Prado::getApplication()->Request;

		if (!($view = $request['report']))
			throw new TInvalidOperationException('bad_request');

        $this->config = $this->getYamlConfig()->read($view)->buildContext($request['context'],false)->getContext();
  //     var_dump($this->config->context);//die();

        $this->setServiceProperties($this->config->context['serviceProperties']);
        
        $dataRoot = ($this->config->context['dataRoot'])?$this->config->context['dataRoot']:'filter';

        if (preg_match('/^([0-9]+,*)+$/',$request[$dataRoot]))
            $filter = explode(',',$request[$dataRoot]);
		elseif ($request[$dataRoot])
			$filter = json_decode($request[$dataRoot],true);

//        if (!$filter)
//            return false;
//Prado::Trace('context '.$this->config->context['condition'],'Xls');
        $criteria = FU::getContextCriteria($this->config->context,$filter);
	
	//additional params
	$criteria = $this->getAdditionalParams($criteria);
//$criteria->Limit = 100;
//var_dump($criteria); //die();	
        //die($criteria->Condition);
        $finder = call_user_func(array($this->config->context['recordClass'], 'finder'));
        $records = $finder->findAll($criteria);
//var_dump($records);die();
        $reportClass = $this->config->context['reportClass'];
        $report = new $reportClass($this->config->context);
        $report->render($records);
        //die(get_class($this->getWriter($report->xls)));
	//die('THIS '.TVarDumper::dump($report->xls));
        return $report->xls;
        
    }

    public function getAdditionalParams($cri) {
	
	$params = $this->config->context['addSql'];
	
	if (!$params) return $cri;  
	foreach($params as $k=>$v) {
	    $val = $this->Request[$v];
	    $cri->Parameters[":$k"] = $val;
	}
		    
	return $cri;
    
    }


}
