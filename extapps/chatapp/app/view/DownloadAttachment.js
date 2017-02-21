/**
 * Task/Issue      Author    			UniqueID        Comment   
 *---------------------------------------------------------------------------------------------------------------------------------------------------
 * 23039           Venkatesh Teja		201311061716	Firing openNewWinToDownload event for downloading files in the new window.                                                
 */

//201311061716
startDownload = function( event , eopts){
	
	if(Ext.isIE){
		
		var compIdInIE = event.srcElement.id;
		var downloadComp = compIdInIE.toString().split('-textEl')[0];
	}else{
		
		var compId = event.currentTarget.attributes.id;
		var downloadComp = compId.nodeValue.toString().split('-textEl')[0];
	}
	
	var url = Ext.getCmp(downloadComp).url;
	var downloadcomponent = Ext.ComponentQuery.query('downloadattachment')[0];
	downloadcomponent.fireEvent('openNewWinToDownload',url);
};

Ext.define('CHAT.view.DownloadAttachment', {
//    extend: 'Ext.container.Container',
	extend: 'Ext.Component',
    alias: 'widget.downloadattachment',
    
		renderTpl: [
		            '<em id="{id}-dwnlWrap">',
		            '<form id="{id}-dwnlForm" class="x-hidden" target="{frameId}" action="{url}" method="get"></form>',
		            '<a id="{id}-textEl"  class = "filename" onClick = "startDownload( event )" >{text}</a> ',
		            '<span id="{id}-sizeEl" class = "fileSize"> ({fileSize} )</span>',
		            '</em>'
		        ],
		        childEls: [
		                   'textEl', 'dwnlWrap', 'dwnlForm','sizeEl'
		               ],
		               baseCls:'x-wtc-attachment-div',
    initComponent: function() {
    	var me=this;
    	 me.formCotents = [{}];
//    	me.frame =  Ext.getBody().createChild({
//            	tag: 'iframe'
//                , cls: 'x-hidden'
//                , id: me.getId()+'-frame'
//                , name: 'iframe'
//        }); 
		this.callParent(arguments);
    },
    beforeRender: function(){
    	var me = this;
    	 me.callParent();


         // Apply the renderData to the template args
         Ext.applyIf(me.renderData, me.getTemplateArgs());
    },
    getTemplateArgs : function(){
    	var me = this;
    	var attachmentname = me.text;
    	if(attachmentname.length > 40){
    		var att_name = (me.text).split(".");
    		 att_name[0] = att_name[0].substr(0,30)+"...";
	    	 attachmentname = att_name[0]+"."+att_name[1];
    	}
    	return {
    		text : attachmentname,
            url : me.url,
            baseCls   : me.baseCls,
            fileSize : me.fileSize
//            frameId :me.frame.id
        };
    },
    download: function(isFromDownloadAll){
    	if( isFromDownloadAll ){
    		this.dwnlForm.dom.action = this.initialConfig.url;
    	}
    	this.dwnlForm.dom.submit();
    },
    afterRender:function(){
    	var me = this;
    	this.callParent( arguments );
    }
    });