<?php





class FMenuTabPanel extends FMenuSimple implements IWidget
{

	



        public function performDataBinding($data)
        {

            $len = count($data);
            $translate = $this->getApplication()->Parameters['translatable'];
            Prado::Trace(__CLASS__.' performDataBinding '.$len,'Json' );

            $panel = new FTabPanel();
            $panel->cssUrl="";
            $panel->cssClass=($this->cssClass) ? $this->cssClass : "contentTabs";
            $panel->ViewCssClass="tabs-container";
            $panel->TabCssClass="tabs-li";
            $panel->ActiveTabCssClass="tabs-selected";
            $this->getControls()->add($panel);

            foreach ($data as $key => $value) {


                if ($value instanceof FTypedActiveRecord)
                {
                    $td = $value->getTypeData();
                    if ($td['notInMenu'] || $td['service'] || $td['hidden'])
                        continue;
                }

                $item = new FTabView();
                $item->Caption = ($translate && $value instanceof FActiveLangRecord) ? $value->nameLangAct : $value->name;

                $content = new FContentReader();
                $content->Container = $value;

                $item->getControls()->add($content);

                $panel->getControls()->add($item);


            }
        }


        /**
	 * Renders the reader.
	 * This method overrides the parent implementation by rendering the body
	 * content as the whole presentation of the repeater. Outer tag is not rendered.
	 * @param THtmlWriter writer
	 */
	public function render($writer)
	{
            $this->renderContents($writer);

	}

        public function wiLoadData($gw)
	{
		return false;
	}

	public function wiSetData($content,$gw)
	{
		return false;
	}

	public function wiInjectData($gw)
	{
		$gw->getData();
	}

	public function wiGetMetaData($gw)
	{
		return array(
		'properties'=>array('containeruid','cssclass'),
                'columns'=>1,
		'fields' => array(
			array(
			'fieldLabel'=>$gw->getRecord()->Name.' / '.Prado::localize('Container'),
			'name'=>$gw->getFieldName('containeruid'),
			'editor'=>array('xtype'=>'textfield','width'=>400)
			),
			array(
			'fieldLabel'=>$gw->getRecord()->Name.' / '.Prado::localize('Css class'),
			'name'=>$gw->getFieldName('cssclass'),
			'editor'=>array('xtype'=>'textfield','width'=>400)
			)
			)
		);
	}

}
