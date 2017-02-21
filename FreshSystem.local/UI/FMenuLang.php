<?php





class FMenuLang extends FMenuSimple
{

	private $_LangLinks;

	public function onPreRender($param)
	{		
			
		TDataBoundControl::onPreRender($param);

                $contents = $this->getLangData();
                if ($contents) {
                        $this->Visible = true;
                        $this->DataSource=$contents;
                        $this->dataBind();
                } else {
                        $this->Visible = false;
                }
			
	
	}

        /**
         *
         * @return string    
         */
        public function getLangLinks()
        {
            return $this->_LangLinks;
        }

        /**
         *
         * @param <type> $value
         */
        public function setLangLinks($value)
        {
            $this->_LangLinks = $value;
        }

        protected function getLangData()
        {

            $lines = explode("\n",$this->_LangLinks);
            $links = array();
            foreach ($lines as $line)
            {
                list($lang,$def) = explode('|',trim($line));
                $links[trim($lang)]= trim($def);
            }
            return $links;
        }


        public function performDataBinding($data)
        {

            $len = count($data);
            $container = $this->getContainer();
            if (!$container) return;
            $culture = $this->getApplication()->getGlobalization()->getCulture();
            Prado::Trace(__CLASS__.' performDataBinding '.$this->JustLinks,'Json' );
            if (!$this->getJustLinks())
                    $this->getControls()->add('<ul>');
            foreach ($data as $lang => $def) {

                Prado::Trace(__CLASS__.' performDataBinding '.$lang.' '.$def,'Json' );
                if ($lang == $culture) continue;
                
                if (!$this->getJustLinks())
                        $this->getControls()->add('<li>');

                $item = new THyperLink();
                $item->Text = ' ';
                $item->CssClass = trim($this->getCssClass().' '.$lang);
                if ($def)// && !($rec = $container->getLanguageRecord($lang)))
                {
                     if (preg_match('/^(https?|ftp):/',$def))
                        $item->NavigateUrl = $def;
                     elseif ($ic = $this->getPage()->getContainer($def)) {
                         $item->NavigateUrl = $this->getLocalizedAddress($lang);  //$ic->getAbsoluteHref(true,array('lang'=>$lang),true);
                     }
                }
                else
                {
                     $item->NavigateUrl = $this->getLocalizedAddress($lang); //$container->getAbsoluteHref(true,array('lang'=>$lang),true);
                }
                $this->getControls()->add($item);

                if (!$this->getJustLinks())
                        $this->getControls()->add('</li>');

                $len--;
                if ($len>0 && $this->getSeparator())
                    $this->getControls()->add($this->getSeparator());

            }
            if (!$this->getJustLinks())
                    $this->getControls()->add('</ul>');
        }


        public function getLocalizedAddress($lang='') {
            $req = $this->getRequest();
            $host = $req->getUrl()->getScheme().'://'.$req->getUrl()->getHost();
            $path = preg_replace('/^\/([a-zA-Z]{2})\//','/',$req->getUrl()->getPath());
            return ($lang) ? $host.'/'.$lang.$path : $host.$path;
        }

        /**
	 * Renders the reader.
	 * This method overrides the parent implementation by rendering the body
	 * content as the whole presentation of the repeater. Outer tag is not rendered.
	 * @param THtmlWriter writer
	 */
	public function render($writer)
	{
            //$this->renderBeginTag($writer);
        
            $this->renderContents($writer);
            
            //$this->renderEndTag($writer);

	}

	public function wiGetMetaData($gw)
	{
		return array(
		'properties'=>array('containeruid','separator','cssclass','justlinks','langlinks'),
                'columns'=>1,
                'forTab'=>'System',
		'fields' => array(
			array(
			'fieldLabel'=>$gw->getRecord()->Name.' / '.Prado::localize('Container'),
			'name'=>$gw->getFieldName('containeruid'),
			'editor'=>array('xtype'=>'textfield','width'=>400)
			),
			array(
			'fieldLabel'=>$gw->getRecord()->Name.' / '.Prado::localize('Separator'),
			'name'=>$gw->getFieldName('separator'),
			'editor'=>array('xtype'=>'textfield','width'=>400)
			),
			array(
			'fieldLabel'=>$gw->getRecord()->Name.' / '.Prado::localize('Css class'),
			'name'=>$gw->getFieldName('cssclass'),
			'editor'=>array('xtype'=>'textfield','width'=>400)
			),
			array(
			'fieldLabel'=>$gw->getRecord()->Name.' / '.Prado::localize('Just simple links'),
			'name'=>$gw->getFieldName('justlinks'),
			'editor'=>array('xtype'=>'xcheckbox')
			),
			array(
			'fieldLabel'=>$gw->getRecord()->Name.' / '.Prado::localize('Lang links'),
			'name'=>$gw->getFieldName('langlinks'),
			'editor'=>array('xtype'=>'textarea','width'=>400,'height'=>150)
			),
			)
		);
	}

}
