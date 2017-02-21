<?php
    $packages = array(
//        'filetree'=> array('js/Ext.ux.form.BrowseButton.js','js/Ext.ux.FileUploader.js','js/Ext.ux.UploadPanel.js','js/Ext.ux.FileTreeMenu.js','js/Ext.ux.FileTreePanel.js'),
        'filetree'=> array('js/FileUploadField.js','js/Ext.ux.FileUploaderHTML5.js','js/Ext.ux.UploadPanel.js','js/Ext.ux.FileTreeMenu.js','js/Ext.ux.FileTreePanel.js'),
        'filetreecss'=> array('css/fileuploadfield.css','css/filetree.css','css/filetype.css','css/icons.css','css/famflag.css'), //'css/famflag.css',
    );
    $deps = array(
        'allFileTreeCss'=>array('filetreecss'),
        'allFileTreeJs'=>array('filetree')
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


  <script type="text/javascript" src="./js/Ext.ux.form.BrowseButton.js"></script>
  <script type="text/javascript" src="./js/Ext.ux.FileUploader.js"></script>
  <script type="text/javascript" src="./js/Ext.ux.UploadPanel.js"></script>
  <script type="text/javascript" src="./js/Ext.ux.FileTreeMenu.js"></script>
  <script type="text/javascript" src="./js/Ext.ux.FileTreePanel.js"></script>
  
  */   
  
