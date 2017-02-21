<?php
    $packages = array(
        'bx'=> array('SuperBoxSelect.js'),
        'bxcss'=> array('superboxselect.css'), //
    );
    $deps = array(
        'bxCss'=>array('bxcss'),
        'bxJs'=>array('bx')
    );
    
    return array($packages,$deps); 
