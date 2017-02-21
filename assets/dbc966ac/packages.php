<?php
    $packages = array(
        'fg'=> array('Ext.ux.form.FormGroup.js'),
        'fgcss'=> array('Ext.ux.form.FormGroup.css'), //
    );
    $deps = array(
        'formGroupCss'=>array('fgcss'),
        'formGroupJs'=>array('fg')
    );
    
    return array($packages,$deps); 
