<?php
class SimpleCsvReport extends TComponent
{
        public $context;
        public $xls;
        public $columns;

    public function __construct($context,$xls=null) {
        $this->context = $context;
        $this->xls = new PHPExcel();
        $this->xls->setActiveSheetIndex(0);
        $this->columns = $context['columns'];
    }
    
    
    public function render($records)
    {
	$i = 0;
        //add header row
        $renderHeader = false;
        foreach($this->columns as $col) {
            if (isset($col['header'])) {
                $this->xls->getActiveSheet()->setCellValueByColumnAndRow($i,1, $col['header']);
                $renderHeader = true;
            }
            ++$i;
        }
        $row = ($renderHeader)?2:1;
        foreach($records as $rec) {
           $i=0;
           foreach($this->columns as $col) {
            $value = $rec->{$col['dataIndex']};
            $this->xls->getActiveSheet()->setCellValueByColumnAndRow($i,$row, $value);
            ++$i;
           } 
           ++$row;
        }
    }
   
}
