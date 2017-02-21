<?php
    $packages = array(

 		'filetree'=> array('js/FileUploadField.js','js/Ext.ux.FileUploaderHTML5.js','js/Ext.ux.UploadPanel.js','js/Ext.ux.FileTreeMenu.js','js/Ext.ux.FileTreePanel.js',
        					'js/cmsuploader/AwesomeUploaderPopup.js',
        					'js/cmsuploader/Ext.ux.AwesomeUploader.js',
    						'js/cmsuploader/Ext.ux.AwesomeUploaderLocalization.js',
    						'js/cmsuploader/Ext.ux.form.FileUploadField.js',
    						'js/cmsuploader/Ext.ux.XHRUpload.js',
    						'js/cmsuploader/swfupload.js'
    						),
        'filetreecss'=> array('css/fileuploadfield.css','css/filetree.css','css/filetype.css','css/icons.css','css/famflag.css',
    						'js/cmsuploader/AwesomeUploader.css',
    						'js/cmsuploader/AwesomeUploader Progress Bar.css',
    						'js/cmsuploader/Ext.ux.form.FileUploadField.css'), //'css/famflag.css',*/
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
  
