<?php
    $packages = array(
        'htmleditor'=> array('htmleditor.js'),
        'htmleditorimage'=> array('fileuploadbutton.js','loadingindicator.js',"imagebrowser.js",'statictextfield.js','htmleditorimage.js','Ext.ux.HtmlEditor.Plugins-0.2-all-debug.js'), //
        'htmleditorcss'=>array('htmleditor.css'),
        'htmleditorimagecss'=>array('loadingindicator.css','imagebrowser.css','statictextfield.css','htmleditorimage.css','plugin-styles.css')
    );
    $deps = array(
        'allCss'=>array('htmleditorimagecss'),
        'allJs'=>array('htmleditor','htmleditorimage')
    );
    
    return array($packages,$deps); 
 /*
  *     <script type="text/javascript" src="htmleditor.js"></script>
    <script type="text/javascript" src="fileuploadbutton.js"></script>
    <link rel="stylesheet" type="text/css" href="loadingindicator.css">
    <script type="text/javascript" src="loadingindicator.js"></script>
    <link rel="stylesheet" type="text/css" href="imagebrowser.css">
    <script type="text/javascript" src="imagebrowser.js"></script>
    <link rel="stylesheet" type="text/css" href="statictextfield.css">
    <script type="text/javascript" src="statictextfield.js"></script>
    <link rel="stylesheet" type="text/css" href="htmleditorimage.css">
    <script type="text/javascript" src="htmleditorimage.js"></script>

  */   
  
