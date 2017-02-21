<?php
    $packages = array(
        'login'=> array('cookies.js','login.js','relogin.js','Fresh.Password.js'),
        'logincss'=> array('login.css'), //
    );
    $deps = array(
        'loginCss'=>array('logincss'),
        'loginJs'=>array('login')
    );
    
    return array($packages,$deps); 
