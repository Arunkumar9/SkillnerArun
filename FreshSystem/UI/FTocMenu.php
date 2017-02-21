<?php
/*
 * Created on 
 *

 */
 
 class FTocMenu extends FContainerListMenu implements INamingContainer
 {

	protected function renderItems($writer) 
	{
		$maxItems = $this->MaxItems;
		$editable = ($this->Request['noedit'])?array('noedit'=>1):array();
		foreach($this->getItems() as $item)
		{
			if ($item instanceof FListMenuItem) {
				if(($pagePath=$item->getPagePath())===$currentPagePath)
					$cssClass=$activeClass;
				else
					$cssClass=$inactiveClass;
				if(($url=$item->getNavigateUrl())==='') 
					$url=$this->getService()->constructUrl($pagePath,$editable);
				
				
				if ($item->Target)
					$target = 'target="'.$item->Target.'"';
				else
					$target = '';
				if ($item->NextItem instanceof FListMenuItem OR $item->NavigateUrl!='#')
					$canopen = '';
				else
					$canopen = 'class="canopen"';
				
				$writer->write("<li $canopen><a href=\"$url\"$cssClass $target>".$item->getText()."</a>");

//				if (count($item->Data->contents)>0) {
//echo TVarDumper::dump($item->Data->contents);
//die();
				$sum = Prado::CreateComponent('FShowContentPick');
				$sum->TypeDataField="forSummary";
				$sum->TypeDataValue=1;
				$sum->FactoryClass="ProductPerex";
				$sum->isEditable=false;
				$sum->ContentRecordClass = "ContentRecord";

				$sum->Content = $item->Data->contents;
				$sum->onPreRender();

				$sum->render($writer);
//				}
/*
				
			  <com:FShowContentPick ID="ContentRecord" 
							Content="<%# $this->Data->contents %>" 
							TypeDataField="forPerex"
							FactoryClass="ProductPerex"
							isEditable="false" />

*/				

				if ($item->NextItem instanceof FListMenuItem)
					$writer->write("</li>\n");
			}
			else
			{
				$item->render($writer);
				$writer->write("</li>\n");
			}
			$maxItems--;
			if ($maxItems == 0)
				break;
		}
	}

	protected function itemFactory() {
		return Prado::createComponent('FTocMenuItem');
	}

 }

class FTocMenuItem extends FListMenuItem implements IDataRenderer 
{
	private $_summarytype = 'summary';
	private $_data = null;
	
	public function getSummaryType()
	{
		return $this->_summarytype;
	}
	
	public function setSummaryType($value)
	{
		$this->_summarytype=$value;
	}
	
	public function getData()
	{
		return $this->_data;
	}
	
	public function setData($value)
	{
		$this->_data=$value;
	}

}
?>
