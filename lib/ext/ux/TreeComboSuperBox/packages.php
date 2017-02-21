<?php
    $packages = array(
        'bx'=> array('TreeComboSuperBox.js','GridCombo.js'),
        'bxcss'=> array('TreeComboSuperBox.css'), //
    );
    $deps = array(
        'bxCss'=>array('bxcss'),
        'bxJs'=>array('bx')
    );
    
    return array($packages,$deps); 
