<?php
/**
 * XListMenu and XListMenuItem class file
 *
 * @author Qiang Xue <qiang.xue@gmail.com>
 * @link http://www.pradosoft.com/
 * @copyright Copyright &copy; 2006 PradoSoft
 * @license http://www.pradosoft.com/license/
 * @version $Revision: $  $Date: $
 */

Prado::using('System.Web.UI.WebControls.TListControl');

/**
 * XListMenu class
 *
 * XListMenu displays a list of hyperlinks that can be used for page menus.
 * Menu items adjust their css class automatically according to the current
 * page displayed. In particular, a menu item is considered as active if
 * the URL it represents is for the page currently displayed.
 *
 * Usage of XListMenu is similar to PRADO list controls. Each list item has
 * two extra properties: {@link XListMenuItem::setPagePath PagePath} and
 * {@link XListMenuItem::setNavigateUrl NavigateUrl}. The former is used to
 * determine if the item is active or not, while the latter specifies the
 * URL for the item. If the latter is not specified, a URL to the page is
 * generated automatically.
 *
 * In template, you may use the following tags to specify a menu:
 * <code>
 *   <com:XListMenu ActiveCssClass="class1" InactiveCssClass="class2">
 *      <com:XListMenuItem Text="Menu 1" PagePath="Page1" />
 *      <com:XListMenuItem Text="Menu 2" PagePath="Page2" NavigateUrl="/page2" />
 *   </com:XListMenu>
 * </code>
 *
 * @author Qiang Xue <qiang.xue@gmail.com>
 * @link http://www.pradosoft.com/
 * @copyright Copyright &copy; 2006 PradoSoft
 * @license http://www.pradosoft.com/license/
 */
class FListMenu extends TListControl implements INamingContainer
{
	const ITEM_CLASS='it';
	private $_nextitem;
	protected $_rootid;
    protected $_only_links;
    protected $_tags;
	protected $_wrap;
	protected $_generate_item_class;
	protected $_separator;
	protected $_generate_all;

 	public function getEnableJs() {
 		return $this->getViewState('EnableJs',true);
 	}
 	
 	public function setEnableJs ($value) {
		$this->setViewState('EnableJs',TPropertyValue::ensureBoolean($value),true);
	}

 	public function getRootId() {
 		return $this->_rootid;//$this->getViewState('RootId',null);
 	}
 	
 	public function setRootId ($value) {
		$this->_rootid = $value; //$this->setViewState('RootId',TPropertyValue::ensureInteger($value),null);
	}
	
 	public function getMaxItems() {
 		return $this->getViewState('MaxItems',0);
 	}
 	
 	public function setMaxItems ($value) {
		$this->setViewState('MaxItems',TPropertyValue::ensureInteger($value),0);
	}

	public function getNextItem()
	{
		return $this->_nextitem;
	}
	
	public function setNextItem($value)
	{
		$this->_nextitem=$value;
	}

	public function getGenerateItemClass()
	{
		return $this->_generate_item_class;
	}
	
	public function setGenerateItemClass($value)
	{
		$this->_generate_item_class=$value;
	}

	public function getJustLinks()
	{
		return $this->_only_links;
	}
	
	public function setJustLinks($value)
	{
		$this->_only_links=TPropertyValue::ensureBoolean($value);;
	}

	public function getGenerateAll()
	{
		return $this->_generate_all;
	}
	
	public function setGenerateAll($value)
	{
		$this->_generate_all=TPropertyValue::ensureBoolean($value);;
	}

	public function getSeparator()
	{
		return $this->_separator;
	}
	
	public function setSeparator($value)
	{
		$this->_separator=TPropertyValue::ensureString($value);;
	}

	public function getWrap()
	{
		return $this->_wrap;
	}
	
	public function setWrap($value)
	{
		$this->_wrap=$value;
	}

	public function getTags()
	{
		return $this->_tags;
	}
	
	public function setTags($value)
	{
		$this->_tags=explode(',',$value);
	}

	public function getCurrentUrl()
	{
		return 	$this->getPage()->Request->getUrl()->getPath().'?'.htmlspecialchars($this->getPage()->Request->getUrl()->getQuery());
	}

	public function wrapMe($value)
	{
		if ($this->Wrap) {
			return '<'.$this->Wrap.'>'.$value.'</'.$this->Wrap.'>';
		}
		else
			return $value;
	}

	public function onInit($param)
	{
		parent::onInit($param);
		$cs = $this->Page->ClientScript;
		$cs->registerStylesheetFile("Fresh:FListMenu",$this->publishAsset("FListMenu.css"));
		if ($this->EnableJs)
		{
			$cs->registerPradoScript('effects');
			//$cs->registerJavascriptPackages(Prado::getPathOfNamespace('Application.common.ext.*'),array('extEffects'),false,false);

			$path = $this->publishFilePath(Prado::getPathOfNamespace("FreshSystem.jquery.*"));
			$cs->registerScriptFile("Fresh:jquery",$path.'/jquery-1-2-5-pack.js');
			$cs->registerScriptFile("Fresh:jquery-easing",$path.'/jquery-easing-1-3.js');
			$cs->registerScriptFile("Fresh:FListMenu",$this->publishAsset("FListMenu.js"));
			$cs->registerEndScript('Fresh:FListMenu:'.$this->ID,'jQuery.noConflict();jQuery(document).ready(function() { jQuery("#'.$this->ClientID.'").BlindList(); });');
			//$cs->registerScriptFile("Fresh:FListMenu",$this->publishAsset("FListMenuExt.js"));
		//$cs->registerEndScript('Fresh:FListMenu:'.$this->ID,'Ext.onReady(function() { Fresh.BlindList("'.$this->ClientID.'"); });');
$js = <<<EOD
Event.observe(window, 'load', loadAccordions, false);
function loadAccordions() {
			var topAccordion = new accordion('{$this->ClientID}', {
				classNames : {
					toggle : 'horizontal_accordion_toggle',
					toggleActive : 'horizontal_accordion_toggle_active',
					content : 'horizontal_accordion_content'
				},
				defaultSize : {
					width : 525
				},
				direction : 'horizontal'
			});
			
			var bottomAccordion = new accordion('vertical_container');
			
			var nestedVerticalAccordion = new accordion('vertical_nested_container', {
			  classNames : {
					toggle : 'vertical_accordion_toggle',
					toggleActive : 'vertical_accordion_toggle_active',
					content : 'vertical_accordion_content'
				}
			});
			
			// Open first one
			bottomAccordion.activate($$('#vertical_container .accordion_toggle')[0]);
			
			// Open second one
			topAccordion.activate($$('#horizontal_container .horizontal_accordion_toggle')[2]);
		}
}
EOD;
		} 

	}

	public function addParsedObject($object)
	{
		if($object instanceof FListMenuItem) {
			if ($this->Items->Count>0)
				$this->Items[$this->Items->Count-1]->NextItem = $object;
			parent::addParsedObject($object);
		} elseif (!$this->_stateLoaded && ($object instanceof FListMenu)) {
			if ($this->Items->Count>0)
				$this->Items[$this->Items->Count-1]->NextItem = $object;
			$this->Items->add($object);
			$this->addedControl($object);
		}
	}

	public function getActiveCssClass()
	{
		return $this->getViewState('ActiveCssClass','');
	}

	public function setActiveCssClass($value)
	{
		$this->setViewState('ActiveCssClass',$value,'');
	}

	public function getInactiveCssClass()
	{
		return $this->getViewState('InactiveCssClass','');
	}

	public function setInactiveCssClass($value)
	{
		$this->setViewState('InactiveCssClass',$value,'');
	}

	public function getWasOpen()
	{
		return $this->Session[$this->ID.'-wasOpen'];
	}

	public function setWasOpen($value)
	{
		$this->Session[$this->ID.'-wasOpen'] = $value;
	}

	public function getCssClass()
	{
		$cssClass = parent::getCssClass();
		
		if (!$cssClass)
		{
			$parent = $this->parent; 
			while($parent instanceof FListMenu) {
				if ($cssClass = $parent->cssClass)
					return $cssClass; 
				$parent = $parent->parent;
			}
		}
		return $cssClass;
	}

	/**
	 * Creates a collection object to hold list items.
	 * This method may be overriden to create a customized collection.
	 * @return TListItemCollection the collection object
	 */
	protected function createListItemCollection()
	{
		return new FListItemCollection;
	}

	public function render($writer)
	{
		if(($activeClass=$this->getActiveCssClass())!=='')
			$activeClass=' class="'.$activeClass.'"';
		if(($inactiveClass=$this->getInactiveCssClass())!=='')
			$inactiveClass=' class="'.$inactiveClass.'"';

		//$writer->write('&nbsp;<img src="'.$this->publishAsset('../images/menu_triangl.gif').'"/>');
		$ulClass = $this->cssClass;
		$ulClass = ($ulClass)?$ulClass:'FListMenu';

		$parent = $this->parent; $i = 1;
		while($parent instanceof FListMenu) {
				$parent = $parent->parent; $i++;
		}
		$ulClass .= $i;
		if ($index = $this->getAttribute('index')) {
		    $ulClass .= ' level'.$i.'-'.$index;
		}
		$itemCount = count($this->getItems());
		if (!$this->JustLinks && $itemCount>0)
		    $writer->write('<ul ID="'.$this->ClientID.'" class="'.$ulClass.'">'."\n");
		$this->renderItems($writer,$i);
		if (!$this->JustLinks && $itemCount>0)
		    $writer->write("</ul>\n");
	}
	
	protected function renderItems($writer,$depth=1) 
	{
		$maxItems = $this->MaxItems;
		$currentPagePath=$this->getCurrentUrl();
		$editable = ($this->Request['noedit'])?array('noedit'=>1):array();
		if(($activeClass=$this->getActiveCssClass())!=='')
			$activeClass=' class="'.$activeClass.'"';
		if(($inactiveClass=$this->getInactiveCssClass())!=='')
			$inactiveClass=' class="'.$inactiveClass.'"';

        $ii = 0;
		foreach($this->getItems() as $item)
		{
			if ($item instanceof FListMenuItem) {
            ++$ii;
				$lastText = $item->Text;
				Prado::trace('Page path '.$currentPagePath,__CLASS__);
				Prado::trace('Page path item '.$item->getNavigateUrl(),__CLASS__);
				if($item->getNavigateUrl() === $currentPagePath)   //($pagePath=$item->getPagePath())===$currentPagePath && )
				{
					$current = true;
					$cssClass=$this->getActiveCssClass();//$activeClass;
				}
				else
				{
					$current = false;
					$cssClass=$this->getInactiveCssClass();//$inactiveClass;
				}	
				if(($url=$item->getNavigateUrl())==='')
					$url=$this->getService()->constructUrl($pagePath,$editable);
				
				if ($item->Target)
					$target = 'target="'.$item->Target.'"';
				else
					$target = '';
				if ($item->NextItem instanceof FListMenuItem OR $item->NavigateUrl!='#')
					$canopen = ' class="'.$cssClass.'"';
				else
					$canopen = ' class="canopen '.$cssClass.'"';
				
        		if (!$this->JustLinks)
		    		$writer->write("<li $canopen>");
				if ($this->generateItemClass)
				{
	                $cssClass = $cssClass.' '.self::ITEM_CLASS.$depth.' '.self::ITEM_CLASS.$depth.'-'.$ii;
					$cssClass .= ( $ii+1 == count($this->getItems()) )?' '.self::ITEM_CLASS.$depth.'-last':'';
					$cssClass  = ' class ="'.$cssClass.'"';
				}
				elseif ($cssClass)
					$cssClass = ' class ="'.$cssClass.'"';
                
                if ($tag = $this->Tags[$depth-1]) {
                    $href = ($tag == 'a')?'href="'.$url.'"':'';
                    $target = ($tag == 'a')?$target:'';
                    $writer->write("<$tag ".$href.$cssClass.' '.$target.">".$this->wrapMe($item->getTextWithLineBreaks())."</$tag>");
                }
                else
                    $writer->write("<a href=\"$url\"$cssClass $target>".$this->wrapMe($item->getTextWithLineBreaks())."</a>");

				if ($this->Separator && strlen($this->Separator)>1 ) //&& !($item->NextItem instanceof FListMenuItem)
		    		$writer->write("<div class=\"{$this->Separator}\"></div>");
				if ($this->Separator && strlen($this->Separator)==1 ) //&& !($item->NextItem instanceof FListMenuItem)
		    		$writer->write(" {$this->Separator} ");
				if (!$this->JustLinks && $item->NextItem instanceof FListMenuItem)
					$writer->write("</li>\n");
			}
			else
			{
				$item->setAttribute('index',$ii);
Prado::trace($this->wasOpen,'Json');
				if (true || $this->GenerateAll || $this->wasOpen === $lastText)
	                $item->render($writer);
				if (!$this->JustLinks)
                    $writer->write("</li>\n");
			}
			--$maxItems;
			if ($maxItems == 0)
				break;
		}
	}
	
}

class FListMenuItem extends TListItem
{
	private $_nextitem;

	public function getNextItem()
	{
		return $this->_nextitem;
	}
	
	public function setNextItem($value)
	{
		$this->_nextitem=$value;
	}


	public function getPagePath()
	{
		return $this->getValue();
	}

	public function setPagePath($value)
	{
		$this->setValue($value);
	}

	public function getNavigateUrl()
	{
		return $this->hasAttribute('NavigateUrl')?$this->getAttribute('NavigateUrl'):'';
	}

	public function setNavigateUrl($value)
	{
		$this->setAttribute('NavigateUrl',$value);
	}

	public function getTarget()
	{
		return $this->hasAttribute('Target')?$this->getAttribute('Target'):'';
	}

	public function setTarget($value)
	{
		$this->setAttribute('Target',$value);
	}
    
    public function getTextWithLineBreaks()
    {
//        return strtr($this->getText(),array('|'),array('<br/>'));
        return str_replace(array('|'),array('<br/>'),$this->getText());
    }

}


/**
 * TListItemCollection class.
 *
 * TListItemCollection maintains a list of {@link TListItem} for {@link TListControl}.
 *
 * @author Qiang Xue <qiang.xue@gmail.com>
 * @version $Revision: $  $Date: $
 * @package System.Web.UI.WebControls
 * @since 3.0
 */
class FListItemCollection extends TListItemCollection
{

	/**
	 * Inserts an item into the collection.
	 * @param integer the location where the item will be inserted.
	 * The current item at the place and the following ones will be moved backward.
	 * @param TListItem the item to be inserted.
	 * @throws TInvalidDataTypeException if the item being inserted is neither a string nor TListItem
	 */
	public function insertAt($index,$item)
	{
		if(is_string($item))
			$item = $this->createNewListItem($item);
		if(!($item instanceof TListItem) && !($item instanceof FListMenu))
			throw new TInvalidDataTypeException('invalid',get_class($this));
		TList::insertAt($index,$item);
	}
}

?>