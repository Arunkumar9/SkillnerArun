<?php
Prado::using('FWidgetGateway');
class ContentText extends TLiteral implements IWidget,ITranslatableWidget {
    private static $_safeTextParser;

    public function wiInjectData($gw) {
        $tag = $gw->getContentValueTag();
        $text = $gw->getRecord()->DataLangAct;
        //$text = preg_replace('|<style>([^<]*)</style>|im', '\1', $text);
        if ($tag=='none')
            $this->setText($this->getSafeTextParser()->parse($text));
        else
            $this->setText("<$tag>".$this->getSafeTextParser()->parse($text)."</$tag>");
    }

    public function wiLoadData($gw) {
        $lang = $gw->getLang();
        $field = ($lang) ? 'DataLang'.$lang : 'Data';
        return array('id'=>$gw->getFieldName(),'value'=>$gw->getRecord()->$field);
    }

    public function wiSetData($content,$gw) {
        $lang = $gw->getLang();
        $field = ($lang) ? 'DataLang'.$lang : 'Data';
        $gw->getRecord()->$field = $content;
        return true;
    }

    public function wiGetMetaData($gw) {
        $styles = array();
        $theme = new TTheme('themes/Base','themes/Base');
        if ($theme)
            $styles = $theme->StyleSheetFiles;

        $styles[] = 'lib/ext/ux/HtmlEditor/htmleditor.css';

        return array(
                'fields' => array(array(
                                'fieldLabel'=>$gw->getRecord()->Name,
                                'name'=>$gw->getFieldName(),
                                'editor'=>array('xtype'=>'uxhtmleditor',
                                        "height"=>300,
//						'width'=>500,
                                        'autoHeight'=>false,
                                        'anchor'=>'95%',
                                        'styles' => $styles, //array('lib/ext/ux/HtmlEditor/htmleditor.css','themes/Base/styles.css'),'@new Ext.ux.HTMLEditorImage()',,'@new Ext.ux.form.HtmlEditor.Word()'
                                        "plugins"=>array('@new Ext.ux.HTMLEditorImage()','@new Ext.ux.form.HtmlEditor.Table()')
                                )
                        ))
        );
    }


    /**
     * @return mixed safe text parser
     */
    protected function getSafeTextParser() {
        if(!self::$_safeTextParser)
            self::$_safeTextParser=Prado::createComponent('System.3rdParty.SafeHtml.TSafeHtmlParser');
        return self::$_safeTextParser;
    }

    protected static function textDecode($value) {
        $decode = FBaseActiveRecord::textDecode($value);
        return ($decode === false) ? '':$decode;
    }

    protected static function textEncode($value) {
        return FBaseActiveRecord::textEncode($value);
    }
}
class ContentTextTinyMCE extends ContentText {
   public function wiSetData($content,$gw) {
        $lang = $gw->getLang();
        $field = ($lang) ? 'DataLang'.$lang : 'Data';
        if ($content)
            $gw->getRecord()->$field = $content;
        return true;
    }
    public function wiGetMetaData($gw) {
        $styles = array();
        $theme = new TTheme('themes/Base','themes/Base');
        if ($theme)
            $styles = $theme->StyleSheetFiles;

        $styles[] = 'lib/ext/ux/HtmlEditor/htmleditor.css';

        return array(
                'fields' => array(array(
                                'fieldLabel'=>$gw->getRecord()->Name,
                                'name'=>$gw->getFieldName(),
                                'editor'=>array('xtype'=>'tinymce',
                                        "height"=>300,
                                        'name'=>$gw->getFieldName(),
                                        //'width'=>'100%',
                                        //'autoWidth'=>true,
                                        //'autoHeight'=>true,
                                         'anchor'=>'90%',
                                        //'anchor'=>'90% -10',
                                        'tinymceSettings'=> array(
                                                'theme' => "advanced",
                                                'file_browser_callback' => 'FileBrowser',
                                                //'language'=>$this->getApplication()->getGlobalization()->getCulture(),
                                                'plugins'=> "safari,pagebreak,style,layer,table,advhr,emotions,iespell,advimage,advlink,insertdatetime,preview,media,searchreplace,print,contextmenu,paste,directionality,noneditable,visualchars,nonbreaking,xhtmlxtras,template,fullscreen",
                                                //'theme_advanced_buttons1' => "bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,|,styleselect,formatselect,fontselect,fontsizeselect",
                                                //'theme_advanced_buttons2' => "cut,copy,paste,pastetext,pasteword,|,search,replace,|,bullist,numlist,|,outdent,indent,blockquote,|,undo,redo,|,link,unlink,anchor,image,cleanup,help,code,|,insertdate,inserttime,preview,|,forecolor,backcolor",
                                                //'theme_advanced_buttons3' => "tablecontrols,|,hr,removeformat,visualaid,|,sub,sup,|,charmap,emotions,iespell,media,advhr,|,print,|,ltr,rtl,|",
                                                //'theme_advanced_buttons4' => "insertlayer,moveforward,movebackward,absolute,|,styleprops,|,cite,abbr,acronym,del,ins,attribs,|,visualchars,nonbreaking,template,pagebreak",
                                                'theme_advanced_buttons1' => "bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,|,cut,copy,paste,pastetext,pasteword,|,formatselect,tablecontrols",
                                                'theme_advanced_buttons2' => "search,replace,|,bullist,numlist,|,outdent,indent,blockquote,|,undo,redo,|,link,unlink,anchor,image,cleanup,help,code,|,hr,sub,sup,|,charmap,fullscreen",
                                                'theme_advanced_buttons3' => "",
                                                'theme_advanced_buttons4' => "",
                                                'theme_advanced_toolbar_location' => "top",
                                                'theme_advanced_toolbar_align' => "left",
                                                'theme_advanced_statusbar_location' => "bottom",
                                                'theme_advanced_resizing' => false,
                                                'extended_valid_elements' => "a[name|href|target|title|onclick],img[class|src|border=0|alt|title|hspace|vspace|width|height|align|onmouseover|onmouseout|name|style],hr[class|width|size|noshade],span[class|align|style]",//font[face|size|color|style],
                                        //'template_external_list_url' => "example_template_list.js"
                                        )
                                ))
                           )
            );
    }

}
class HtmlContentText extends ContentTextTinyMCE {
    public function wiInjectData($gw) {
        $tag = $gw->getContentValueTag();
        $this->setText("<$tag>".self::textDecode($gw->getRecord()->DataLangAct)."</$tag>");
    }


    public function wiLoadData($gw) {
        $lang = $gw->getLang();
        $field = ($lang) ? 'DataLang'.$lang : 'Data';
        return array('id'=>$gw->getFieldName(),'value'=>self::textDecode($gw->getRecord()->$field));
    }

    public function wiSetData($content,$gw) {
        $lang = $gw->getLang();
        $field = ($lang) ? 'DataLang'.$lang : 'Data';
        $gw->getRecord()->$field = self::textEncode($content);
    }
}

class RawHtmlContentText extends HtmlContentText {
    public function wiInjectData($gw) {
        //$tag = $gw->getContentValueTag();
        $this->setText(self::textDecode($gw->getRecord()->DataLangAct));
    }


    public function wiGetMetaData($gw) {
        return array(
                'fields' => array(array(
                                'fieldLabel'=>$gw->getRecord()->Name,
                                'name'=>$gw->getFieldName(),
                                'editor'=>array('xtype'=>'textarea',
                                        "height"=>300,
//						'width'=>500,
                                        'autoHeight'=>false,
                                        'anchor'=>'90%',
                                )
                        ))
        );
    }

}

class ContainerName extends ContentText {
    public function wiInjectData($gw) {
        $tag = $gw->getContentValueTag();
        $this->setText("<$tag>".$this->getSafeTextParser()->parse(nl2br($gw->getRecord()->DataLangAct))."</$tag>");
    }

    public function wiGetMetaData($gw) {
        return array(
                'fields' => array(array(
                                'fieldLabel'=>$gw->getRecord()->Name,
                                'name'=>$gw->getFieldName(),
                                'editor'=>array('xtype'=>'textarea','anchor'=>'90%','height'=>60)
                        ))
        );
    }
}

class ContentRedirect extends TControl implements IWidget,ITranslatableWidget {
    private $_redirect;
    private $_gw;


    public function onLoad($writer) {

        if ($this->getPage()->getContainer()->uid != $this->_gw->getRecord()->parent_id)
                return;
        
        if (preg_match('/^(https?|ftp):/', $this->getRedirectTo()))
                $this->getResponse()->redirect($this->getRedirectTo());

        if (!($uid = $this->getRedirectTo()))
        {
            $children = $this->Page->getContainer()->children;
            if (count($children)>0)
                $uid = $children[0]->uid;
            else
                throw new THttpException(404,'pageservice_page_unknown',$this->Request['code']);
        }
        $url = $this->Page->getContainer($uid)->getAbsoluteHref();//$manager->getUrl($uid);
        $this->getResponse()->redirect($url);
    }
    public function getRedirectTo() {
        return $this->_redirect;
    }

    public function setRedirectTo($value) {
        $this->_redirect = $value;
    }

    public function wiInjectData($gw) {
        $this->_gw = $gw;
        $lang = $gw->getLang();
        $field = ($lang) ? 'DataLang'.$lang : 'Data';
        $this->setRedirectTo($gw->getRecord()->$field);
    }

    public function wiLoadData($gw) {
        $lang = $gw->getLang();
        $field = ($lang) ? 'DataLang'.$lang : 'Data';
        return array('id'=>$gw->getFieldName(),'value'=>$gw->getRecord()->$field);
    }

    public function wiSetData($content,$gw) {
        $lang = $gw->getLang();
        $field = ($lang) ? 'DataLang'.$lang : 'Data';
        $gw->getRecord()->$field = $content;
        $c = $this->getDataRecord($gw);
        $td = $c->getLocalTypeData(false);
        $td['redirectTo'] = $content;
        $c->setLocalTypeData($td,false);
        $c->save();

    }

    public function wiGetMetaData($gw) {
        return array(
                'columns'=>1,
                'fields' => array(array(
                                'fieldLabel'=>$gw->getRecord()->Name.' / '.Prado::localize('to page uid'),
                                'name'=>$gw->getFieldName(),
                                'editor'=>array('xtype'=>'textfield','width'=>400)
                        ))
        );
    }
    public function getDataRecord($gw) {
        $record = $gw->getRecord();
        $lang = ucfirst($gw->getLang());

        if (!$lang) {
            $c = $record->container;
        }
        else {
            $langType = 'Language'.$lang;
            $c = ContainerRecord::finder()->find('parent_id = ? AND type_id like ?',$record->parent_id,$langType);
        }
        $c = ($c)?$c:$record->container;
        return $c;
    }
}

class ContentLinkTarget extends ContentRedirect {
    private $_redirect;
    private $_gw;

    public function onLoad($writer) {}

    public function getRedirectTarget() {
        return $this->_redirect;
    }

    public function setRedirectTarget($value) {
        $this->_redirect = $value;
    }

    public function wiInjectData($gw) {
        $this->_gw = $gw;
        $this->setRedirectTarget($gw->getRecord()->Data);
    }

    public function wiLoadData($gw) {
        return array('id'=>$gw->getFieldName(),'value'=>$gw->getRecord()->Data);
    }

    public function wiSetData($content,$gw) {
        $gw->getRecord()->Data = $content;
        $c = $this->getDataRecord($gw);
        $td = $c->getLocalTypeData(false);
        $td['redirectTarget'] = $content;
        $c->setLocalTypeData($td,false);
        $c->save();

    }

    public function wiGetMetaData($gw) {
        return array(
                'columns'=>1,
                'fields' => array(array(
                                'fieldLabel'=>$gw->getRecord()->Name.' / '.Prado::localize('to target'),
                                'name'=>$gw->getFieldName(),
                                'editor'=>array(
                                    'xtype'=>'combo',
                                    'width'=>400,
                                    'hiddenName'=> $gw->getFieldName(),
                                    'forceSelection'=>false,
                                    'lastQuery'=>"",
                                    'triggerAction'=>'all',
                                    'store' => array('_blank','_self','_parent','_top')
                                    )
                    //array('xtype'=>'textfield','width'=>400)
                        ))
        );
    }

}


class ContentCoolUrl extends TControl implements IWidget {

    public function wiInjectData($gw) {
        //$this->getPage()->setRedirectTo($gw->getRecord()->Data);
    }

    public function getDataRecord($gw) {
        $record = $gw->getRecord();
        $lang = ucfirst($gw->getLang());

        if (!$lang) {
            $c = $record->container;
        }
        else {
            $langType = 'Language'.$lang;
            $c = ContainerRecord::finder()->find('parent_id = ? AND type_id like ?',$record->parent_id,$langType);
        }
        $c = ($c)?$c:$record->container;
        return $c;
    }
    public function wiLoadData($gw) {

        $record = $gw->getRecord();

        $c = $this->getDataRecord($gw);
        if (!($url = $c->code)) { // && !(($url = $c->parent->code) && ($c->) )) {
            $parent_id = $gw->getRecord()->parent_id;
            $crit = new TActiveRecordCriteria;
            $crit->Condition = 'parent_id = :parent AND type_id like "heading%"';
            $crit->Parameters[':parent'] = $parent_id;
            $crit->OrdersBy['ordering']='ASC';
            $nadpis = ContentRecord::finder()->find($crit);
            $dl = ($lang) ? 'DataLang'.$lang : 'Data';
            if ($nadpis)
                $url = FU::urlify($nadpis->$dl);
        }
        return array('id'=>$gw->getFieldName(),'value'=>$url);
    }

    public function wiSetData($content,$gw) {
        $r = $this->getDataRecord($gw);
        $r->code = $content;
        $r->save();
        // $r->parent->updateContainerPath();
    }

    public function wiClearData($gw) {
        $this->wiSetData(null, $gw);
    }

    public function wiGetMetaData($gw) {
        return array(
                'columns'=>1,
                'forTab'=>'Seo',
                'fields' => array(array(
                                'fieldLabel'=>$gw->getRecord()->Name.' / '.Prado::localize('cool url'),
                                'name'=>$gw->getFieldName(),
                                'editor'=>array('xtype'=>'textfield','anchor'=>'90%')
                        ))
        );
    }
}

class ContentDomain extends ContentCoolUrl {
    protected $_domain;

    public function onLoad($writer) {
        TControl::onLoad();

    }
    public function wiLoadData($gw) {

        $record = $gw->getRecord();

        $c = $this->getDataRecord($gw);
        if (!($domain = $c->code)) {
            $td = $c->getTypeData(true);
            $domain = $td['domain'];
        }
        return array('id'=>$gw->getFieldName(),'value'=>$domain);
    }

    public function wiSetData($content,$gw) {
        $r = $this->getDataRecord($gw);
        $r->code = $content;
        $td = $r->getLocalTypeData(false);

        if ($olddomain = $td['domain'])
            $this->updateMappings($r,$olddomain,$content);

        $td['domain'] = $content;
        $r->setLocalTypeData($td,false);

        $r->save();
        //$r->paupdateContainerPath();
    }

    public function updateMappings($rec,$oldkey,$path)
    {
        $conn = $rec->getDbConnection();
        $conn->setActive(true);

        $cmd = $conn->createCommand("UPDATE cms_mappings SET mapkey = REPLACE(mapkey,:oldkey,:newkey) WHERE mapkey like :oldkeystart AND class = 'ContainerRecord' ");
        $cmd->bindValue(':oldkeystart', $oldkey.'%');
        $cmd->bindValue(':oldkey', $oldkey);
        $cmd->bindValue(':newkey', $path);
        $cmd->execute();

    }
    public function wiInjectData($gw) {
        $r = $this->getDataRecord($gw);
        $td = $r->getTypeData(true);
        $this->_domain = $td['domain'];
    }

    /*	public function wiGetMetaData($gw)
	{
		return array(
		'properties'=>array('allowedculture','absoluteurl'),
                'columns' => 2,
		'fields' => array(
			array(
			'fieldLabel'=>$gw->getRecord()->Name.' / '.Prado::localize('allowed culture'),
			'name'=>$gw->getFieldName('a'),
			'editor'=>array('xtype'=>'textfield','width'=>400)
			),
			array(
			'fieldLabel'=>$gw->getRecord()->Name.' / '.Prado::localize('otherwise redirect to page uid'),
			'name'=>$gw->getFieldName('redirectto'),
			'editor'=>array('xtype'=>'textfield','width'=>400)
			)
			)
		);
	}
    */
    public function wiGetMetaData($gw) {
        return array(
                'columns'=>1,
            //   'forTab'=>'Visual',
                'fields' => array(array(
                                'fieldLabel'=>$gw->getRecord()->Name.' / '.Prado::localize('domain host'),
                                'name'=>$gw->getFieldName(),
                                'editor'=>array('xtype'=>'textfield','width'=>400)
                        ))
        );
    }

}

class ContentTheme extends ContentDomain
{
    public function wiLoadData($gw) {

        $record = $gw->getRecord();

        $c = $this->getDataRecord($gw);
        $td = $c->getTypeData(true);
        $theme = $td['theme'];
        return array('id'=>$gw->getFieldName(),'value'=>$theme);
    }

    public function wiSetData($content,$gw) {
        $r = $this->getDataRecord($gw);
        $td = $r->getLocalTypeData(false);
        if ($content)
            $td['theme'] = $content;
        else
            unset ($td['theme']);
        $r->setLocalTypeData($td,false);
        $r->save();
        //$r->paupdateContainerPath();
    }


    public function wiInjectData($gw) {
    }

    public function wiGetMetaData($gw) {
        return array(
                'columns'=>1,
                'forTab'=>'Visual',
                'fields' => array(array(
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
                                    )
                        ))
        );
    }
}


class ContentMaster extends ContentDomain
{
    public function wiLoadData($gw) {

        $record = $gw->getRecord();

        $c = $this->getDataRecord($gw);
        $td = $c->getTypeData(true);
        $theme = $td['MasterClass'];
        return array('id'=>$gw->getFieldName(),'value'=>$theme);
    }

    public function wiSetData($content,$gw) {
        $r = $this->getDataRecord($gw);
        $td = $r->getLocalTypeData(false);
        if ($content)
            $td['MasterClass'] = $content;
        else
            unset ($td['MasterClass']);
        $r->setLocalTypeData($td,false);
        $r->save();
    }


    public function wiInjectData($gw) {
    }

    public function wiGetMetaData($gw) {
        return array(
                'columns'=>1,
                'forTab'=>'Visual',
                'fields' => array(array(
                                'fieldLabel'=>$gw->getRecord()->Name.' / '.Prado::localize('master class'),
                                'name'=>$gw->getFieldName(),
                                'editor'=>array(
                                    'xtype'=>'combo',
                                    'width'=>400,
                                    'hiddenName'=> $gw->getFieldName(),
                                    'forceSelection'=>true,
                                    'lastQuery'=>"",
                                    'triggerAction'=>'all',
                                    'store' => FU::filenames('protected/layout/*.tpl')
                                    )
                        ))
        );
    }
}

class ContentPagePath extends ContentDomain
{
    public function wiLoadData($gw) {

        $record = $gw->getRecord();

        $c = $this->getDataRecord($gw);
        $td = $c->getTypeData(true);
        $theme = $td['pagePath'];
        return array('id'=>$gw->getFieldName(),'value'=>$theme);
    }

    public function wiSetData($content,$gw) {
        $r = $this->getDataRecord($gw);
        $td = $r->getLocalTypeData(false);
        if ($content)
            $td['pagePath'] = $content;
        else
            unset ($td['pagePath']);
        $r->setLocalTypeData($td,false);
        $r->save();
        //$r->paupdateContainerPath();
    }


    public function wiInjectData($gw) {
        $r = $this->getDataRecord($gw);
        $td = $r->getTypeData(true);
        $this->_domain = $td['pagePath'];
    }

    public function wiGetMetaData($gw) {
        return array(
                'columns'=>1,
                'forTab'=>'Visual',
                'fields' => array(array(
                                'fieldLabel'=>$gw->getRecord()->Name.' / '.Prado::localize('page path'),
                                'name'=>$gw->getFieldName(),
                                'editor'=>array('xtype'=>'textfield','width'=>400)
                        ))
        );
    }
}

class ContentReadRights extends ContentDomain
{

    private $_allow;
    private $_deny;

    public function getAllow() { return $this->_allow; }

    public function setAllow($value) { $this->_allow = $value; }

    public function getDeny() { return $this->_deny; }

    public function setDeny($value) { $this->_deny = $value; }

    public function wiLoadData($gw) {

        return false;
    }

    public function wiSetData($content,$gw) {
        $r = $this->getDataRecord($gw);
        $td = $r->getLocalTypeData(false);
        if ($content)
        {
            unset ($td['acl.read.allow']);
            unset ($td['acl.read.deny']);
            unset ($td['acl.read.policy']);

            if ($content['allow']) {
                $td['acl.read.allow'] = implode(',',$content['allow']);
                $td['acl.read.policy'] = 'allow';
            }
            if ($content['deny']) {
                $td['acl.read.deny'] = implode(',',$content['deny']);
                $td['acl.read.policy'] = 'allow';
            }
        }
        $r->setLocalTypeData($td,false);
        $r->save();
        //$r->paupdateContainerPath();
    }


    public function wiInjectData($gw) {
       $gw->getData();
    }

    public function wiGetMetaData($gw) {
        return array(
                'properties'=>array('deny','allow'),
                'forTab'=> 'Access',
                'fields' => array(
                        array(
                                'fieldLabel'=>$gw->getRecord()->Name.' / '.Prado::localize('acl.read.allow'),
                                'name'=>$gw->getFieldName('allow'),
                                'editor'=>array(
                                     'xtype'=> 'csuperboxselect',
                                     'displayField'=> 'name',
                                     'valueField'=> 'uid',
                                     'mode'=> 'local',
                                    'noStoreClone'=>true,
                                     //'hiddenName'=> $gw->getFieldName('allow'),
                                        'removeValuesFromStore' => false,
                                     'name'=> $gw->getFieldName('allow'),
                                     'dataIndex'=> $gw->getFieldName('allow'),
                                     'allowBlank'=>true,
                                     'store'=> 'roles-store',
                                    'width'=>400)
                        ),
                        array(
                                'fieldLabel'=>$gw->getRecord()->Name.' / '.Prado::localize('acl.read.deny'),
                                'name'=>$gw->getFieldName('deny'),
                                'editor'=>array(
                                     'xtype'=> 'csuperboxselect',
                                     'displayField'=> 'name',
                                     'valueField'=> 'uid',
                                     'mode'=> 'local',
                                     'noStoreClone'=>true,
                                        'removeValuesFromStore' => false,
                                     //'hiddenName'=> $gw->getFieldName('deny'),
                                     'name'=> $gw->getFieldName('deny'),
                                     'dataIndex'=> $gw->getFieldName('deny'),
                                     'allowBlank'=>true,
                                     'store'=> 'roles-store',
                                    'width'=>400)
                        )
                )
        );
    }

}

class ContainerLevel extends TControl implements IWidget {

    private $_write_level;
    private $_read_level;

    public function getDataRecord($gw) {
        $record = $gw->getRecord();
        return $record->container;
    }
    public function wiLoadData($gw) {
        return false;
    }

    public function wiSetData($content,$gw) {
        $r = $this->getDataRecord($gw);
        $r->write_level = $content['writelevel'];
        $r->read_level = $content['readlevel'];
        $r->save();
        return false;
    }

    public function wiInjectData($gw) {
        $gw->getData();
    }

    public function getReadLevel() {
        return $this->_read_level;
    }

    public function setReadLevel($value) {
        $this->_read_level = $value;
    }

    public function getWriteLevel() {
        return $this->_write_level;
    }

    public function setWriteLevel($value) {
        $this->_write_level = $value;
    }

    public function wiGetMetaData($gw) {
        return array(
                'properties'=>array('readlevel','writelevel'),
                'collapsed'=> true,
                'fields' => array(
                        array(
                                'fieldLabel'=>$gw->getRecord()->Name.' / '.Prado::localize('Read Level'),
                                'name'=>$gw->getFieldName('readlevel'),
                                'editor'=>array('xtype'=>'textfield','width'=>400)
                        ),
                        array(
                                'fieldLabel'=>$gw->getRecord()->Name.' / '.Prado::localize('Write Level'),
                                'name'=>$gw->getFieldName('writelevel'),
                                'editor'=>array('xtype'=>'textfield','width'=>400)
                        )
                )
        );
    }
}

class ContentReaderWidget extends FContentReader implements IWidget
{
    private $_ContainerUidVar='reader';

    public function getContainerUidVar() {
        return $this->_ContainerUidVar;
    }

    public function setContainerUidVar($value) {
        $this->_ContainerUidVar = ($value) ? $value : 'reader';
    }


    public function onInit($param)
    {
       TDataBoundControl::onInit($param);
        Prado::Trace(__CLASS__.' onLoad '.$this->ContainerUid,'Json' );
        //$this->readContents();
    }

    public function onLoad($param)
    {
       parent::onLoad($param);
       $c = $this->getContainer();
       if (!$this->ContainerUid || $this->Page->getContainer()->uid === $c->uid) return;

        $this->readContents();
    }


    public function getContainer()
    {
        if ($reader = $this->Request[$this->ContainerUidVar])
        {
            $this->ContainerUid = $reader;
        }
        return parent::getContainer();
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
		'properties'=>array('containeruid','containeruidvar','contentcolumn'),
                'columns'=>1,
		'fields' => array(
			array(
			'fieldLabel'=>$gw->getRecord()->Name.' / '.Prado::localize('Container'),
			'name'=>$gw->getFieldName('containeruid'),
			'editor'=>array('xtype'=>'textfield','width'=>400)
			),
			array(
			'fieldLabel'=>$gw->getRecord()->Name.' / '.Prado::localize('Content column'),
			'name'=>$gw->getFieldName('contentcolumn'),
			'editor'=>array('xtype'=>'textfield','width'=>400)
			),
			array(
			'fieldLabel'=>$gw->getRecord()->Name.' / '.Prado::localize('Variable'),
			'name'=>$gw->getFieldName('containeruidvar'),
			'editor'=>array('xtype'=>'textfield','width'=>400)
			)
			)
		);
	}

}