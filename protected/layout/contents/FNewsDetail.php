<?php
  
class FNewsDetail extends FStyledTemplateControl
{
    private $_record;
    
    public function onLoad($param)
    {
    ///    $this->ImagesRepeater->DataSource = $this->Data->ImagesRecords;
      //  $this->ImagesRepeater->databind();
    }
    
    public function getData()
    {
        if ($this->_record===null)
        {
            if (!( ($id = $this->Request['newsid']) &&
                   ($this->_record = NewsRecord::finder()->findByPk($id)) )
               )
                $this->Page->gotoDefaultPage();
        }
        return $this->_record;
        
    }
    
    
}
