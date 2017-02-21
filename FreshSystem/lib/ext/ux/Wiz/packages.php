<?php
    $packages = array(
        'wiz'=> array('src/Wizard.js','src/Header.js','src/Card.js'),
        'wizcss'=> array('ext-ux-wiz.css'), //'src/CardLayout.js',
    );
    $deps = array(
        'wizCss'=>array('wizcss'),
        'wizJs'=>array('wiz')
    );
    
    return array($packages,$deps); 
