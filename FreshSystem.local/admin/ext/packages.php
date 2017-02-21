<?php
    $packages = array(
        'extPrototype3'=> array('3/ext-prototype-adapter-debug.js'),
        'extPrototype'=> array('ext-prototype-adapter.js'),
		'extEffects'=>array('ext-effects.js'),
        'extBase3'=> array('3/ext-base-debug.js','Config.js'),
        'extBase'=> array('ext-base.js'),
        'extAll3'=> array('3/ext-all-debug.js','Ext.ux.XDateField.js','Ext.ux.MetaForm_1.js','carousel.layout.js'), //'Ext.ux.AjaxQueue.js',
        'extAll'=> array('Ext.ux.AjaxQueue.js','ext-all-debug.js','Ext.ux.XDateField.js','Ext.ux.MetaForm_1.js','carousel.layout.js'), //
        'sbox'=>array('shadowbox-prototype.js','shadowbox.js'),
        'cherry'=>array('3/cherryonext-debug.js'),//'carousel.layout.js','carousel.layoutv.js')
    );
    $deps = array(
        'extEffects'=>array('extPrototype3','extEffects'),
		'extAllBase'=>array('extBase3','extAll3'),//'cherry'),
        'extAll'=>array('extPrototype3','extAll3'),//'sbox'),
        'shadowbox'=>array('sbox')
    );
    
    return array($packages,$deps); 
    
?>
