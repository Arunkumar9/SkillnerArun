/**
 * Task/Issue      Author    			UniqueID        Comment   
 *---------------------------------------------------------------------------------------------------------------------------------------------------
 *  23596          Dinesh.GK    		20131120630      Override Tooltip component is added into the common folder, 
 *  														Added the tooltip class in appliction launch event.
 *  
 **/ 
Ext.define('CHAT.Application', {
    name: 'CHAT',
appFolder:'extapps/chatapp/app/',
    extend: 'Ext.app.Application',
  autoCreateViewport: true,
  enableQuickTips:true,
      
        // All the paths for custom classes
        paths: {
//          'Ext': 'ext4.1/src/',
           'SWPCommon':'extapps/common',   
            'SWP':'extapps/SWP/app',
            'tinymce':'tinymce'
            
        },
    views: [

      'Viewport', 'Reply','Post','BadgeButton','BadgeTab',
            'DataList','DownloadAttachment','DownloadAttachments','FbarButton',
            'FbarButton','GroupingBtn','GroupingComboBox','GroupingList',
            'ImageButton','MessageDetails','MessageWindow','NewTopic',
            'NewTopicWindow','Paging','QuotedText','SearchField','TabView',
            'PostHeader'
    ],

    controllers: [
       
            'TrainingTools'
    ],


    models: ['Post','TaskAction','TaskStatus','Reference',
          'ThreadCatogery','Message','User'],
    //requires:['SWPCommon.model.File','SWPCommon.lib.AwesomeUploader','SWPCommon.view.workfiles.UploadPopup', 'SWPCommon.view.workfiles.WorkFiles'],
        
        launch:function(){
            Ext.require([
                         'SWPCommon.view.Tip' //20131120630
    //    'SWPCommon.FlexcrollAbstractComponent' , 'SWPCommon.view.TableView','SWPCommon.view.Panel'
     ]);

            




          
        Ext.apply(Ext.tip.QuickTipManager.getQuickTip(), {
                  showDelay: 50     
            });
        }

});
