<?php

class FWidgetControl extends TControl
{
	const MY_ID = 'MetaData';
	private $_ymlcfg;
	private $_text;
	private $_data;
	private $_make_temp_visible = false;
	private $_gateway;
	
	/**
	 * @return string the static text of the TLiteral
	 */
	public function getText()
	{
		if ($this->_text === null)
			if ($this->getHasControls())
			{
				$this->_make_temp_visible = true;
//				$this->initRecursive();
				$this->PreRenderRecursive();
				$writer = Prado::createComponent('System.Web.UI.THtmlWriter', new TTextWriter);
				$this->renderChildren($writer);
				$text = $writer->writer->flush();
				if (preg_match('/^(\w)+/',$text,$m))
					$text = trim(str_replace("\n".$m[1],"\n",$text));
				$this->_text = $text;
				$this->_make_temp_visible = false;
			}
		return $this->_text;
		
	}
	
	public function getxxxID()
	{
		return self::MY_ID;
	}
	
	public function getData()
	{
		if ($this->_data === null)
                {
                    $data = $this->getYamlConfig()->read($this->getText(),true)->getContext()->data;

                    if (is_array($data['editors']))
                    {
                        foreach ($data['editors'] as $name => $args )
                        {
                            $label = (is_array($args)) ? $args['fieldLabel'] : $args;
                            $args = (is_array($args)) ? $args : array();

                            $method = ($args['xtype']) ? 'ct'.$args['xtype'] : 'ctTextfield';

                            $method = (method_exists($this, $method)) ? $method : 'ctField';
                            $data['fields'][] = $this->$method($name,$label,$args);
                            $data['properties'][] = $name;
                        }
                        unset ($data['editors']);
                    }
                    $this->_data = $data;

                }
		return $this->_data;
	}
	
	/**
	 * @return string the static text of the TLiteral
	 */
	public function getVisible()
	{
		return $this->_make_temp_visible;// && parent::getVisible();
	}

	/**
	 * @return appropriate YamlConfig module 
	 */
	public function getYamlConfig()
	{
        $cfg = ($this->_ymlcfg)?$this->_ymlcfg:'jsonCmpConfig';
        return $this->getApplication()->Modules[$cfg];
	}	

	/**
	 * @param string id of YamlConfig module
	 */
	public function setYamlConfig($value)
	{
		$this->_ymlcfg=$value;
	}
	
	public function setGateway($value)
	{
		$this->_gateway = $value;
	}
	
	public function getGateway()
	{
		return  $this->_gateway;
	}
	
	public function __call($method,$args)
	{
		return call_user_func_array(array($this->_gateway, $method), $args);
	}


        protected function ctField($field,$name=null,$args=array())
        {
            unset($args['fieldLabel']);
            $name = ($name === null) ? ucfirst($field) : $name;
            return array(
                'fieldLabel' => Prado::localize($name),
                'name' => $this->getFieldName($field),
                'editor' => $args
                );
        }


        protected function ctTextField($field,$name=null,$args=array())
        {
            $args['width'] = ($args['width']) ? $args['width'] : 400;
            $args['xtype'] = 'textfield';
            return $this->ctField($field,$name,$args);
        }

        protected function ctNumberField($field,$name=null,$args=array())
        {
            $args['width'] = ($args['width']) ? $args['width'] : 400;
            $args['allownegative'] = ($args['allownegative']) ? $args['allownegative'] : false;
            $args['xtype'] = 'numberfield';
            return $this->ctField($field,$name,$args);
        }

        protected function ctXCheckbox($field,$name=null,$args=array())
        {
            $fieldDef = $this->ctField($field,$name);
            $args['xtype'] = 'xcheckbox';
            return $this->ctField($field,$name,$args);
        }

        protected function ctTextArea($field,$name=null,$args=array())
        {
            $args['width'] = ($args['width']) ? $args['width'] : 400;
            $args['height'] = ($args['height']) ? $args['height'] : 300;
            $args['xtype'] = 'textarea';
            return $this->ctField($field,$name,$args);
        }

        protected function ctHtmlText($field,$name=null,$args=array())
        {
            $args['width'] = ($args['width']) ? $args['width'] : 400;
            $args['height'] = ($args['height']) ? $args['height'] : 300;
            $args['anchor'] = ($args['anchor']) ? $args['anchor'] : '90% -10';
            $args['xtype'] = 'ctinymce';
            return $this->ctField($field,$name,$args);
        }

        protected function ctTinyMCE($field,$name=null,$args=array())
        {
            return $this->ctHmtlText($field,$name,$args);
        }

        protected function ctCCombo($field,$name=null,$args=array())
        {
            $args['width'] = ($args['width']) ? $args['width'] : 400;
            $args['displayField'] = ($args['displayField']) ? $args['displayField'] : 'name';
            $args['valueField'] = ($args['valueField']) ? $args['valueField'] : 'uid';
            $args['hiddenName'] = $this->getFieldName($field);
            $args['xtype'] = 'ccombo';
            $args['store'] = (isset($args['store'])) ? $args['store'] : $field.'-store' ;
            //$args['store'] = "@Ext.StoreMgr.lookup(".$args['store'].")";
            return $this->ctField($field,$name,$args);
        }

        protected function ctDirNames($field,$name=null,$args=array())
        {
            $args['width'] = ($args['width']) ? $args['width'] : 400;
            $args['include'] = ($args['include']) ? $args['include'] : 'images/*';
            $args['exclude'] = ($args['exclude']) ? $args['exclude'] : '/^$/';
            $args['hiddenName'] = $this->getFieldName($field);
            $args['xtype'] = 'combo';
            $args['store'] = FU::dirnames($args['include'],$args['exclude'],PREG_GREP_INVERT);
            return $this->ctField($field,$name,$args);
        }


/*
 *     -	fieldLabel: <%= $this->MetaData->getRecord()->name %> / <%[Group]%>
		name: <%= $this->MetaData->getFieldName('group') %>
		editor:
			xtype: textfield
			width: 200


                               'fieldLabel'=>$gw->getRecord()->Name.' / '.Prado::localize('theme'),
                                'name'=>$gw->getFieldName(),
                                'editor'=>array(
                                    'xtype'=>'combo',
                                    'width'=>400,
                                    'hiddenName'=> $gw->getFieldName(),
                                    'forceSelection'=>true,
                                    'lastQuery'=>"",
                                    'triggerAction'=>'all',
                                    'store' => FU::dirnames('themes/*','/Admin|Base/i',PREG_GREP_INVERT)

 */
}
