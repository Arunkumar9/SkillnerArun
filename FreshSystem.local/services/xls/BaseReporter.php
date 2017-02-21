<?php

class BaseReporter extends TComponent
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
    
    
    public function renderArray($records,$context,$sheet=null,$startRow=1,$startColumn='A')
    {
        $i = $this->ordColumn($startColumn);
        $row = $startRow;
        
        if (!$sheet)
            $sheet = $this->xls->getActiveSheet();
            
        //add header row
        $renderHeader = 0;
        $heightSet = false;
        foreach($context as $col) {
            if (isset($col['header'])) {
                $sheet->setCellValueByColumnAndRow($i,$row, $col['header']);
                $renderHeader = 1;
            }
            if (isset($col['width']) && $col['width']>0) {
                $sheet->getColumnDimensionByColumn($i)->setWidth($col['width']);                
            }
            if (!$heightSet && isset($col['headerHeight']) && $col['headerHeight']>0) {
                $sheet->getRowDimension($row)->setWidth($col['headerHeight']);                
                $heightSet = true;
            }
            if (isset($col['headerFormat']) && is_array($col['headerFormat'])) {
                $sheet->duplicateStyleArray($col['headerFormat'],$this->charColumn($i).$row);
            }
            ++$i;
        }
        
        $row += $renderHeader;
        $heightSet = false;
        foreach($records as $rec) {
            
           $i=$this->ordColumn($startColumn);            
           foreach($context as $col) {
            $value = $rec->{$col['dataIndex']};
            $sheet->setCellValueByColumnAndRow($i,$row, $value);
            if (!$heightSet && isset($col['height']) && $col['height']>0) {
                $sheet->getRowDimension($row)->setWidth($col['height']);                
                $heightSet = true;
            }
            if (isset($col['format']) && is_array($col['format'])) {
                $sheet->duplicateStyleArray($col['format'],$this->charColumn($i).$row);
            }
            ++$i;
           } 
           ++$row;
        }
    }
    
    protected function charColumn($col)
    {
        if (!is_numeric($col))
            return (string) $col;
        
        return chr($col+65);
    }

    protected function ordColumn($col)
    {
        if (is_numeric($col))
            return (integer) $col;
        
        $letters = split(strtoupper($col)); $val = 0;
        foreach($letters as $letter)
            $val += ord($letter)-65;

        return $val;
    }
    
    protected function renderYamlScript($context,$sheet=null)
    {
        if (!$sheet)
            $sheet = $this->xls->getActiveSheet();

        $defFont = $context['default']['font'];
        $defSize = $context['default']['size'];
        $sheet->getDefaultStyle()->getFont()->setName($defFont);
        $sheet->getDefaultStyle()->getFont()->setSize($defSize);

        foreach($context['pageSetup'] as $k=>$v) {
            $method = 'set'.$k;
            $sheet->getPageSetup()->$method($v);
        }

        foreach($context['pageMargins'] as $k=>$v) {
            $method = 'set'.$k;
            $sheet->getPageMargins()->$method($v);
        }

        foreach($context['dimensions'] as $k=>$v) {
            $k = explode(',',$k);
            foreach ($k as $ok) {
                if (is_numeric((string) $ok))
                    $sheet->getRowDimension($ok)->setRowHeight($v);
                else
                    $sheet->getColumnDimension($ok)->setWidth($v);
            }
        }
        
        $content = $context['content'];
        foreach($content as $cmd) {
            call_user_func_array(array($sheet,$cmd['method']),$cmd['arguments']);
        }
        
        if ($context['repeatRows']) {
            list($start,$end) = $context['repeatRows'];
            $sheet->getPageSetup()->setRowsToRepeatAtTopByStartAndEnd($start,$end);
        }

        if ($context['repeatColumns']) {
            list($start,$end) = $context['repeatColumns'];
            $sheet->getPageSetup()->setColumnsToRepeatAtTopByStartAndEnd($start,$end);
        }
    }
   
}
