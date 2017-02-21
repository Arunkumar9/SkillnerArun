<?php
Prado::using('Application.services.xls.PHPExcel.Classes.PHPExcel.Reader.Excel2007');
class DriverRunReporter extends BaseReporter
{
        public $context;
        public $xls;
        public $columns;

    public function __construct($context,$xls=null) {
        $this->context = $context;
        if (!$xls && $context['template']) {
            $template = Prado::getPathOfNamespace('Application.clientside.reports.'.$contex['template'],'.xlsx');
            $reader = new PHPExcel_Reader_Excel2007();
            $this->xls = $reader->load($template);
        } elseif (!$xls) {
            $this->xls = new PHPExcel();
        }
        $this->xls->setActiveSheetIndex(0);
    }
    
    public function render($records,$criteria)
    {

        $sheet = $this->xls->getActiveSheet();


        $groups = array();
        $set = array();
        
        if (($groupBy = $this->context['groupBy']) && count($records)>0)
        {
             
            $last = $records[0]->$groupBy;
            foreach($records as $rec)
            {
                if ($last !== $rec->$groupBy)
                {
                    if (count($set)>0) 
                        $groups[$last]=$set;
                         
                    $last = $rec->$groupBy;
                    $set = array();
                }
                $set[] = $rec;
            }
            if (count($set)>0) 
                $groups[$last]=$set;
        }
        else {
            $groups[] = $records;
        }

        $i = 1; $row= 2;
        foreach($groups as $k => $run) 
        {
            $title = FU::tokenReplace($this->context['sheetName'],array('run'=>$k));
            $sheet->setTitle($title);
            $this->renderYamlScript($this->context,$sheet);
            $sheet->setCellValue('A1',FU::tokenReplace($this->context['sheetName'],array('run'=>$k)));
//            $sheet->setCellValue('F1',strip_tags(Prado::getApplication()->Request['filterName']));

            $this->renderArray($run,$this->context['columns'],$sheet,2);

            $sheet->getHeaderFooter()->setEvenFooter('&L&B'.$title.'&RPage &P of &N');
            $sheet->getHeaderFooter()->setOddFooter('&L&B'.$title.'&RPage &P of &N');

            if ($i<count($groups))
                $sheet = $this->xls->createSheet();
            ++$i;
        }



    }
   
}
