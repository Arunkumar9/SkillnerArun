<?php
Prado::using('FreshSystem.UI.*');
Prado::using('FreshSystem.UI.Content.*');
Prado::using('FreshSystem.model.cms.ContentText');
interface ITranslatableWidget { }
interface IWidget {
	public function wiInjectData($gw);
	public function wiLoadData($gw);
	public function wiSetData($value,$gw);
	public function wiGetMetaData($gw);
}
class FWidgetGateway extends TApplicationComponent
{
	const EXT_WIDGET = 'ExtWidget';
	const BASE_LANG = 'cs';
	const DEFAULT_CONTENT_CLASS = 'ContentText';
	const DEFAULT_CONTENT_TAG = 'div';
	private $_record;
	private $_control;
	private $_lang;
	private $_meta=null;
	
	public function __construct(FTypedActiveRecord $AR,$control=null,$lang=null)
	{
		$this->_record = $AR;
		$this->_control = $control;
		$this->_lang = $lang;
	}
	
	public function getCulture()
	{
		return $this->getApplication()->getGlobalization()->getCulture();
	}
	
	public function getRecord()
	{
		return $this->_record;
	}
	
	public function getLang()
	{
		return $this->_lang;
	}
	
	public function getMetaData($controls)
	{
		if (null === $this->_meta)
		{
			$this->_control = ($this->_control) ? $this->_control : Prado::createComponent($this->getContentClass());
			if ($controls)
				$controls->add($this->_control);
	
			if ($this->_control instanceof IWidget)
			{
				$this->_meta = $this->_control->wiGetMetaData($this);
			}
			else
			{
				if (!$this->_control->Page)		
					$this->_control->setPage(new TPage);
				$this->_control->ensureChildControls();
				if ($meta = $this->_control->findControl(FWidgetControl::MY_ID))
				{
					$meta->setGateway($this);
					$this->_meta = $meta->getData();
				}
				if ($this->_control->canSetProperty('gw'))
					$this->_control->gw = $this;
                                
			}
                        $this->wrapFields();
		}
		return $this->_meta;
	}

        public function wrapFields()
        {
            if (!$this->_meta['columns'] && count($this->_meta['fields'])<2) return;

            $meta = $this->_meta['fields'];
            $anchor = ($this->_meta['anchor']) ? $this->_meta['anchor'] : '90%';
            $collapsed = ($this->_meta['collapsed']) ? true : false;
            $labelWidth = (count($meta)>1) ? 150 : 100;

            $editors = array();
            foreach ($meta as $key => $value) {
                $t = explode('/', $value['fieldLabel']);
                $t = (count($t)>1) ? $t[1] : $value['fieldLabel'];
                $value['editor']['fieldLabel'] = trim($t);
                $value['editor']['name'] = $value['name'];
                $editors[] = $value['editor'];
            }

            $wrap[] = array(
                'fieldLabel'=>$this->getRecord()->name,
                'forTab'=>($this->_meta['forTab'])?$this->_meta['forTab']:0,
                'editor'=>array(
                    'xtype'=>'fieldset',
                    'autoHeight'=>true,
                    'anchor'=>$anchor,
                    'stateEvents'=>array('collapsed'),
                    //'layout'=>'form',
                    "labelWidth"=>$labelWidth,
                  //  "hideLabel"=>true,
                    'collapsed'=>$collapsed,
                    'stateId'=>$this->getRecord()->name,
                    'stateful'=>true,
                    'hideMode'=>'offsets',
                    'collapsible'=>true,
                    'defaults'=>array(
                         'xtype'=>'textfield',
                        'allowBlank'=>true
                    ),
                    'title'=>strtoupper($this->getRecord()->name).' ( '.$this->getRecord()->Type['description'].' )',
                    'items'=>$editors
                        )
            );
            $this->_meta['fields'] = $wrap;
/*
 *                                     -    xtype: formgroup
                                         autoHeight: true
                                         layout: column
                                         title: '<%[ Vlastnosti ]%>'
                                         defaults:
                                             layout: form
                                             labelWidth: 1

 */
        }
	
	public function getContentClass()
	{
		$editClass = $this->_record->TypeData['ContentEditClass'];
		return ($editClass) ? $editClass : self::DEFAULT_CONTENT_CLASS;		
	}

	public function getContentValueTag()
	{
		$tag = $this->_record->TypeData['ContentValueTag'];
		return ($tag) ? $tag : self::DEFAULT_CONTENT_TAG;		
	}

	
	public function getFields()
	{
		$result = $this->MetaData['fields'];
		if (is_array($result))
			return $result;
		else
			return array($result);
	}
	
	public function getData()
	{
		$res = false;		
		$meta = $this->getMetaData();
		$result = array();
		$lang = ($this->_control instanceof ITranslatableWidget) ? $this->getLang() : null;
		$field = ($lang ) ? 'DataLang'.$lang : 'Data';

		if ($this->_control instanceof IWidget )
			$res = $this->_control->wiLoadData($this);
		if ($res)
			$result[] = $res;
		elseif (isset($meta['properties']) && count($meta['properties'])>0 )
		{
			if (!is_object($data = $this->_record->{$field.'AsObject'}) || $data->_class != get_class($this->_control))
			{
				$obj = new stdClass;
				//$obj->{$meta['properties'][0]} = $data;
				$obj->_class = get_class($this->_control);
				$data = $obj;
			}
			foreach($meta['properties'] as $k=>$v)
			{
				if (isset($meta['translate']) && in_array($v,$meta['translate']))
					$result[] = array('id'=>$this->getFieldName($v),'value'=>$this->runThrough($data->{$v.$this->Lang},$v));
				else
					$result[] = array('id'=>$this->getFieldName($v),'value'=>$this->runThrough($data->$v,$v));
			}
		}	
		else
			$result[] = array('id'=>$this->getFieldName($v),'value'=>$this->_record->Data);

		return $result;
	}
	
	protected function runThrough($val,$v)
	{
		if ($this->_control->canSetProperty($v))
		{
			$this->_control->$v = $val;
			return $this->_control->$v;
		}
		else
			return $val;		
	}
	
	public function setData($value,$lang=null)
	{
		$res = false;		
		$meta = $this->getMetaData();
		$lang = ($this->_control instanceof ITranslatableWidget) ? $this->getLang() : null;
		$field = ($lang ) ? 'DataLang'.$lang : 'Data';
		
		if ($this->_control instanceof IWidget)
			$res = $this->_control->wiSetData($value,$this,$lang);
		if ($res || $res === '')
		{}
		elseif (isset($meta['properties']) && count($meta['properties'])>0  )
		{
			if (!is_object($data = $this->_record->{$field.'AsObject'}) || $data->_class != get_class($this->_control))
			{
				$obj = new stdClass;
				$obj->{$meta['properties'][0]} = $data;
				$obj->_class = get_class($this->_control);
				$data = $obj;
			}
			foreach($meta['properties'] as $k=>$v)
			{
					
				if (isset($meta['translate']) && in_array($v,$meta['translate']))
					$data->{$v.$this->Lang} = $this->runThrough($value[$v],$v);
				else
					$data->$v = $this->runThrough($value[$v],$v);
			}
			$this->_record->{$field.'AsObject'} = $data;
		}	
		else
			$this->_record->$field = $value;
	}

	public function getComponent($controls=null)
	{
		$meta = $this->getMetaData($controls);
		$field = ($this->_control instanceof ITranslatableWidget) ? 'DataLangAct' : 'Data';
                $this->_control->setID($this->_record->t.$this->_record->uid);
		if ($this->_control instanceof IWidget)
			$this->_control->wiInjectData($this);
		elseif (isset($meta['properties']) && is_object($data = $this->_record->{$field.'AsObject'}) )
			foreach($meta['properties'] as $k=>$v)
			{
				if (isset($meta['translate']) && in_array($v,$meta['translate']))
				{
					$vLang = $v.$this->getCulture();
					$d = (isset($data->$vLang)) ? $data->$vLang : $data->$v;
					$this->_control->$v = $d;
				}
				else
					$this->_control->$v = $data->$v;
			}
		elseif (isset($meta['properties']))
			foreach($meta['properties'] as $k=>$v)
				$this->_control->$v = $this->_record->$field;
		
		return $this->_control;
	}
	
	public function getFieldNameVar()
	{
		return str_replace('record','',strtolower(get_class($this->_record)));
	}
	public function getFieldName($uid=null)
	{
		$suffix = null;
		if (is_string($uid))
		{
			$suffix = $uid;
			$uid = null;
		}
		$uid = ($uid)?$uid:$this->_record->uid;
		$fn = $this->getFieldNameVar().'['.$uid.']';
		
		return  ($suffix)?$fn.'['.$suffix.']':$fn;
	}
	
	
}
