<?php
/**
 * Auto generated by prado-cli.php on 2008-04-20 01:04:37.
 */
class TranslationRecord extends TranslationAR
{

    public function getLangCategory()
    {
        return $this->cat_id;
    }
    
    public function setLangCategory($value)
    {
        if (is_numeric($value))
            $this->cat_id = $value;
        elseif ($f = Translation::formatter())
        {
            $c = $this->DbConnection;
            $cmd =  $c->createCommand("SELECT cat_id FROM catalogue WHERE name = ?");
            $cmd->bindValue(array('messages'.$value));
            $this->cat_id = $cmd->queryScalar();
        }    
    }
	public static function finder($className=__CLASS__)
	{
		return parent::finder($className);
	}
    
    public function getPrimaryKeyCondition($key)
    {
        $key = (!is_array($key))?array($key):$key;
        $keyUid = ':Uid'.time();
        $key = array_combine(array($keyUid),$key);
        return array("( msg_id = $keyUid )",$key); 
    }
    
    public function save()
    {
        Prado::Trace('T1 == '.Prado::getApplication()->getGlobalState('translation_updated'),'Json');
		parent::save();
        Prado::getApplication()->setGlobalState('translation_updated',true);
		Prado::Trace('T = '.Prado::getApplication()->getGlobalState('translation_updated'),'Json');
    }
}
?>