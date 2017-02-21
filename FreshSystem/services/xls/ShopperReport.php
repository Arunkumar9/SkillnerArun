<?php
Prado::using('Application.services.xls.PHPExcel.Classes.PHPExcel.Reader.Excel2007');
class ShopperReport extends TComponent
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

        foreach($this->context['pageSetup'] as $k=>$v) {
            $method = 'set'.$k;
            $sheet->getPageSetup()->$method($v);
        }

        foreach($this->context['pageMargins'] as $k=>$v) {
            $method = 'set'.$k;
            $sheet->getPageMargins()->$method($v);
        }

        foreach($this->context['dimensions'] as $k=>$v) {
            $k = explode(',',$k);
            foreach ($k as $ok) {
                if (is_numeric((string) $ok))
                    $sheet->getRowDimension($ok)->setRowHeight($v);
                else
                    $sheet->getColumnDimension($ok)->setWidth($v);
            }
        }

        $content = $this->context['content'];
        foreach($content as $cmd) {
            call_user_func_array(array($sheet,$cmd['method']),$cmd['arguments']);
        }

//            die();
        $count = 0; $sum = 0;  $items=array(); $extras = array();
        foreach($records as $rec) {
            ++$count;
            $sum += $rec->AccountBalance;
            
            $extra = trim(preg_replace('/\s+/', ' ', $rec->MiscExtras));
            if ($extra) {
                if (strlen($extra)>70) {
                    $sp = strpos($extra,' ',65);
                    $sp = ($sp)?$sp:70;
                    $extras[]=trim(substr($extra,0,$sp));
                    $extras[]=trim(substr($extra,$sp));
                } else {
                    $extras[]=$extra;
                }
            }
            $in[] = $rec->CustNo;
            
        }
        
        $sheet->setCellValue('B4', $count);
        $sheet->setCellValue('B5', $sum);
        $sheet->getStyle('B5')->getNumberFormat()->setFormatCode(PHPExcel_Style_NumberFormat::FORMAT_CURRENCY_USD_SIMPLE);

        $insql = 'IN('.implode(',',$in).')';

        $sql = '
            SELECT 
                SUM(IF(cp.Want=1,1,0)) as pYes,
                SUM(IF(cp.Want=0,1,0)) as pNo,                
                SUM(IF(cp.Want=1,cp.Qty,0)) as pQty,                
                SUM(IF(cp.Want is NULL,1,0)) as pNone,
                p.Name as Preference 
            FROM 
                customer_preferences as cp 
            JOIN 
                preferences as p 
            ON 
                p.Uid = cp.preferences_Uid 
            WHERE 
                cp.CustNo '.$insql.' GROUP BY cp.preferences_Uid';
                
        $cmd = CustomerRecord::finder()->getDbConnection()->createCommand($sql);
        //$cmd->bindValue(':CustNo',$this->CustNo,PDO::PARAM_INT);
        $result = $cmd->query();
        
        $max = $row;

        $row = 9;
        foreach ($result as $sums) {
               // echo $sums['Preference'].' '.$sums['pYes']."<br>";
              $sheet->setCellValue('A'.$row, $sums['Preference']);
              $sheet->setCellValue('B'.$row, $sums['pNo']);
              $sheet->setCellValue('C'.$row, $sums['pYes']);
              $sheet->setCellValue('F'.$row, $sums['pQty']);
              $sheet->setCellValue('G'.$row, $sums['pNone']);
              ++$row;
        }
        
        $sql =  'SELECT 
                    count(*) 
                 FROM 
                    customers as c 
                 WHERE 
                    c.CustNo '.$insql.' 
                 AND NOT EXISTS 
                     (SELECT 
                         * 
                      FROM customer_preferences as cp 
                      WHERE Want IS NOT NULL 
                      AND preferences_Uid IN(%prefs%) 
                      AND cp.CustNo=c.CustNo )';
         $pr['Pumpkins all'] = '46,48,50';                          
         $pr['Lettuce all'] = '39,40,41,77';                          
         $pr['Potato all'] = '44,45,72';   //54 sweet
         
         ++$row;
         foreach ($pr as $name=>$inpr)
         {
             $cmd = CustomerRecord::finder()->getDbConnection()
                                            ->createCommand(str_replace('%prefs%',$inpr,$sql));
             $result = $cmd->queryScalar();
             $sheet->setCellValue('A'.$row, $name);
             $sheet->setCellValue('G'.$row, $result);
              ++$row;
         }

        $A9b = $sheet->getStyle('A9')->getBorders();
        $A9b->getTop()->setBorderStyle(PHPExcel_Style_Border::BORDER_THIN);
        $sheet->duplicateStyle( $sheet->getStyle('A9'), 'A9:G'.$row );
        
        $row = 9;
        foreach ($extras as $extra) {
                $sheet->setCellValue('I'.$row, $extra);
                ++$row;
        }
        
        $max = max($max,$row);
        $defFont = $this->context['default']['font'];
        $defSize = $this->context['default']['size'];
        $sheet->duplicateStyleArray( array(
            'font'=>array('name'=>$defFont,'size'=>$defSize)), 'A9:I'.$max );
        
        for ($i=9; $i<=$max;++$i) {
            $sheet->getRowDimension($i)->setRowHeight($defSize+2);
        }
        $sheet->getDefaultStyle()->getFont()->setName($defFont);
        $sheet->getDefaultStyle()->getFont()->setSize($defSize);
    
    
                          
                          
//        $sheet->getDefaultStyle()->getFont()->setName($this->getSubProperty('context.default.font'));
  //      $sheet->getDefaultStyle()->getFont()->setSize($this->getSubProperty('context.default.size'));
//die();
    }
   
}
