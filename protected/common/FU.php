<?php

class FU extends FUdesktop
{
    
    public static function langFind($records)
    {
        $culture = substr(Prado::getApplication()->getGlobalization()->getCulture(),0,2);
        foreach($records as $v)
        {
           if ($v->Lang == $culture)
               return $v;
        }    
        
        $defaultCulture = Prado::getApplication()->getParameters()->DefaultCulture;
        foreach($records as $v)
        {
           if ($v->Lang == $defaultCulture)
               return $v;
        }    
        
        return null;
    }
    
    function mkdir_recursive($pathname, $mode)
    {
        is_dir(dirname($pathname)) || mkdir_recursive(dirname($pathname), $mode);
        return is_dir($pathname) || @mkdir($pathname, $mode);
    }
    
    public static function getCatId($lang)
    {
        static $catalogues;
        
        if (!is_array($catalogues)) {
            
            $cat = Prado::getApplication()->Globalization->TranslationCatalogue;
            $cat = ($cat)?$cat:'messages';
//            $crit = new TActiveRecordCriteria();
//            $crit->Condition = 'name like :cat';
//            $crit->Parameters[':cat']= $cat.'%';
            $records = MessageCatalogueRecord::finder()->findAll('name like ?',$cat.'%');
            $l = strlen($cat);
            foreach($records as $record) {
                if ($key = substr($record->name,$l+1))
                    $catalogues[$key] = $record->cat_id;
//                    echo $key.' '.$record->cat_id;
            }
            
        }

        return ($catalogues[$lang])?$catalogues[$lang]:1;

    }
    
}
