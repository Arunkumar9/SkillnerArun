<?php
    $packages = array(
        'extPrototype'=> array('ext-prototype-adapter.js'),
		'extEffects'=>array('ext-effects.js'),
        'extBase'=> array('ext-base.js'),
        'extAll'=> array('Ext.ux.AjaxQueue.js','ext-all-debug.js','Ext.ux.XDateField.js','Ext.ux.MetaForm_1.js','carousel.layout.js'), //
        'sbox'=>array('shadowbox-prototype.js','shadowbox.js'),
        'cherry'=>array('cherryonext-debug.js','Config.js','carousel.layout.js','carousel.layoutv.js')
    );
    $deps = array(
        'extEffects'=>array('extPrototype','extEffects'),
		'extAllBase'=>array('extBase','extAll','cherry'),
        'extAll'=>array('extPrototype','extAll','sbox'),
        'shadowbox'=>array('sbox')
    );
    
    return array($packages,$deps); 
    
?>
