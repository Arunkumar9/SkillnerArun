<?php
/* FConfig
 * 
 * Part of Fresh! Project
 * Created by rosa
 * Created on 26.6.2007
 */

 class FIni
 {
 }

 
 class FIniStyle
 {
 	const tableHeading 	= 'tableHeading';
 	const nth	 		= 'nth';
 	const ProductTable = 'longTable';
 	const ProductTableChem = 'longTableChem';
 	const InTextTable = 'inTextTable';
 }
 
 class FIniProductTable
 {
// 	const in = '<table',
//'<table class="longTable" ' 
 	
 }
 
 class FIniSecurity
 {
 	const FileDownload = true;
 }
 
 class FIniSecurityLevel
 {
 	const UserPanel = 100;
	const TypesPanel = 200;
	const FilesPanel = 50;
 }
 
 class FIniSetup
 {
 	const MenuRootType = 'MenuRoot';
 	const HomePageType = 'HomePage';
	const DefaultPagePath = 'ContentShow';
 }
 
 class FIniContent {
 	const PerexLength = 100;
	const DefaultCssClass = 'Content';
 }

 class FIniFilePanel
 {
 	const BaseDir = 'Root.images';
	const BaseUrl = 'images';
 	const notShow = '^runtime|^\..*';
	const pattern = '*';
 }
 

 class FIniFilePanelGalleries
 {
 	const BaseDir = 'Root.images.galleries';
	const BaseUrl = 'images/galleries';
 	const notShow = '^runtime|^\..*';
	const pattern = '{*.png,*.jpg,*.gif,*.PNG,*.JPG,*.GIF,*.PDF,*.pdf}';
 }

 class FIniFilePanelGadgets
 {
 	const BaseDir = 'Root.images.gadgets';
	const BaseUrl = 'images/gadgets';
 	const notShow = '^runtime|^\..*';
	const pattern = '{*.png,*.jpg,*.gif,*.PNG,*.JPG,*.GIF,*.PDF,*.pdf}';
 }

 class FIniFilePanelResources
 {
 	const BaseDir = 'Root.images';
	const BaseUrl = 'images';
 	const notShow = '.*\.(php|js|inc|page|tpl|db)$';
	const pattern = '*';
        const showDir = false;
 }

 class FIniFilePanelResourcesGalleries
 {
 	const BaseDir = 'Root.images.galleries';
	const BaseUrl = 'images/galleries';
 	const notShow = '.*\.(php|js|inc|page|tpl|db)$';
	const pattern = '*';
        const showDir = false;
 }

 class FIniFJsonImagesProvider 
 {
 	const BaseDir = 'Root.images.Components';
	const BaseUrl = 'images/Components';
	const notShow = '^runtime|^\..*';
	const pattern = '{*.*}';
 }

 class FIniFilePanelmovies
 {
// 	const BaseDir = 'ftp://jnovak:streamhoster@ftp28.streamhoster.com/';
// 	const BaseDir = 'Root.images'; //'ftp://jnovak:streamhoster@ftp28.streamhoster.com/';
//	const BaseUrl = 'http://web28.streamhoster.com/jnovak';
 	 const notShow = '.*\.(dmg|gif|xml|xls|jpg|png|doc|lock)$';
	 const pattern = '*';
     const showDir =true;
//{*.mp4,*.MP4,*.mpeg,*.MPEG,*.mpg,*.MPG}
     const onlyDir = false;
     
     public static function BaseDir() {
	   if (Prado::getApplication()->getUser()->MaxLevel >= 300)
		  return 'Root.images.sh.'.Prado::getApplication()->getUser()->getCompanyID();
	   else
		  return 'Root.images.sh.'.Prado::getApplication()->getUser()->username;
     }	  
		  
    public static function BaseDirUrl() {
	   if (Prado::getApplication()->getUser()->MaxLevel >= 300)
	   	return 'http://web28.streamhoster.com/jnovak/';
	   else
		return 'http://web28.streamhoster.com/jnovak/';
    }
    
    public static function BaseUrl() {
	   if (Prado::getApplication()->getUser()->MaxLevel >= 300)
		  return 'http://web28.streamhoster.com/jnovak/'.Prado::getApplication()->getUser()->getCompanyID();
	   else
		  return 'http://web28.streamhoster.com/jnovak/'.Prado::getApplication()->getUser()->username;
    }
 }
 
 class FIniFilePanelImages
 {
 //	const BaseDir = 'Root.images.Components';
 //	const BaseUrl = 'images/Components';
// 	const notShow = '^runtime|^\..*';
//	const pattern = '{*.png,*.jpg,*.gif,*.PNG,*.JPG,*.GIF,*.PDF,*.pdf}';
 	const notShow = '.*\.(dmg|mp4|mov|mpeg|fla|swf|xml|xls|lock|doc)$';
	const pattern = '*';
     const showDir =true;

    public static function BaseDir() {
	   if (Prado::getApplication()->getUser()->MaxLevel >= 300)
		  return 'Root.images.Components.'.Prado::getApplication()->getUser()->getCompanyID();
	   else
		  return 'Root.images.Components.'.Prado::getApplication()->getUser()->username;
    }
    public static function BaseUrl() {
	   if (Prado::getApplication()->getUser()->MaxLevel >= 300)
		  return 'images/Components/'.Prado::getApplication()->getUser()->getCompanyID()."/";
	   else
		  return 'images/Components/'.Prado::getApplication()->getUser()->username;
    }
 }
 
 
  class FIniFilePanelWorkingFiles
 {
 	// modified to not show srt files

 	const notShow = '.*\.(dmg|mp4|mov|mpeg|fla|swf|xml|xls|lock|doc|srt)$';
	const pattern = '*';
     const showDir =true;

    public static function BaseDir() {
	   if (Prado::getApplication()->getUser()->MaxLevel >= 300)
		  return 'Root.images.workingfiles.'.Prado::getApplication()->getUser()->getCompanyID();
	   else
		  return 'Root.images.workingfiles.'.Prado::getApplication()->getUser()->username;
    }
    public static function BaseUrl() {
	   if (Prado::getApplication()->getUser()->MaxLevel >= 300)
		  return 'images/workingfiles/'.Prado::getApplication()->getUser()->getCompanyID()."/";
	   else
		  return 'images/workingfiles/'.Prado::getApplication()->getUser()->username;
    }
 }
/*
 * Ini calss for the captoin file tree panel.
 * shows only srt files.
 */
  class FIniFilePanelCaptionFiles
 {

 	const notShow = '.*\.(dmg|mp4|mov|mpeg|fla|swf|xml|xls|lock|doc)$';
	const pattern = '*.srt';
     const showDir =true;

    public static function BaseDir() {
	   if (Prado::getApplication()->getUser()->MaxLevel >= 300)
		  return 'Root.images.captionfiles.'.Prado::getApplication()->getUser()->getCompanyID();
	   else
		  return 'Root.images.captionfiles'.Prado::getApplication()->getUser()->username;
    }
    public static function BaseUrl() {
	   if (Prado::getApplication()->getUser()->MaxLevel >= 300)
		  return 'images/captionfiles/'.Prado::getApplication()->getUser()->getCompanyID()."/";
	   else
		  return 'images/captionfiles/'.Prado::getApplication()->getUser()->username;
    }
 }
 
   class FIniFileVideoCaptionFiles
 {

 	const notShow = '.*\.(dmg|mp4|mov|mpeg|fla|swf|xml|xls|lock|doc)$';
	const pattern = '*.srt';
     const showDir =true;

    public static function BaseDir() {
	   if (Prado::getApplication()->getUser()->MaxLevel >= 300)
		  return 'Root.images.videocaptionfiles.'.Prado::getApplication()->getUser()->getCompanyID();
	   else
		  return 'Root.images.videocaptionfiles'.Prado::getApplication()->getUser()->username;
    }
    public static function BaseUrl() {
	   if (Prado::getApplication()->getUser()->MaxLevel >= 300)
		  return 'images/videocaptionfiles/'.Prado::getApplication()->getUser()->getCompanyID()."/";
	   else
		  return 'images/videocaptionfiles/'.Prado::getApplication()->getUser()->username;
    }
 }
 
   class FIniFilePanelTrainingFiles
 {

 	const notShow = '.*\.(dmg|mp4|mov|mpeg|fla|swf|xml|xls|lock|doc)$';
	const pattern = '*.srt';
     const showDir =true;

    public static function BaseDir() {
	   if (Prado::getApplication()->getUser()->MaxLevel >= 300)
		  return 'Root.images.trainingfiles.'.Prado::getApplication()->getUser()->getCompanyID();
	   else
		  return 'Root.images.trainingfiles'.Prado::getApplication()->getUser()->username;
    }
    public static function BaseUrl() {
	   if (Prado::getApplication()->getUser()->MaxLevel >= 300)
		  return 'images/trainingfiles/'.Prado::getApplication()->getUser()->getCompanyID()."/";
	   else
		  return 'images/trainingfiles/'.Prado::getApplication()->getUser()->username;
    }
 }