/*
 * 
 * 
 * Task/Issue      Author    			UniqueID        Comment   
 *---------------------------------------------------------------------------------------------------------------------------------------------------
 * 23039           Venkatesh Teja		201311061716	Firing openNewWinToDownload event for downloading files in the new window.                                                
 *
 * 23745		   Venkatesh Teja		201311161045	Added tool tip for download all icon in message window.
 * 24049		   Dinesh GK			201312050630	For download-all image button ID is removed.
 * 
 * 
 * Here the component is used to create two component inside it.
 * The first one is a container which concist of a button DownloadAll and
 * which contains the total size of the downloaded items
 * The second item is creating one more components 'downloadattachment' based on the no. of items attached
 * 
 * */ 


Ext.define('CHAT.view.DownloadAttachments', {
	extend: 'Ext.container.Container',
	alias: 'widget.downloadattachments',
	requires:['CHAT.view.DownloadAttachment','Ext.tip.ToolTip'],
	cls : 'downloadattachments',
	
    initComponent: function() {
    	
	            	var me = this;
	            	var noOfDownloads ;
	            	if( !this.records || this.records.length <=0 ){
	            		Ext.Error.raise({
	            			msg: DOWNLOADATTACHMENTS.ERROR_MSG

	            		})
	            		return;
	            	}

	            	this.items=[{
	            		xtype:'container',
	            		border : 1,
	            		bodyCls : 'downloadattachmentss',
	            		items:[
	            		       {
	            		    	   xtype:'container',
	            		    	   border : 0,
	            		    	   layout:'vbox',
	            		    	   style : {fontWeight:'bold',height:'30px'},
	            		    	   items:[
	            		    	          {
	            		    	        	  xtype:'label',
	            		    	        	  style:'font-size:10px;white-space:nowrap;',
	            		    	        	  html : DOWNLOAD.PLEASE + ' <b>'+ DOWNLOAD.TEXT+'</b>'
	            		    	          },
	            		    	          {
	            		    	        	  xtype: 'container',

	            		    	        	  cls:'download-container',
	            		    	        	 items:[
	            		    	        	        {
			            		    	        		 xtype:'label',
			            		    	        		 style:'font-size:10px;white-space:nowrap;',
			            		    	        		 html : this.attachmentSummary[0] + '  '+MESSAGE.ATTACHMENTS_TEXT + ' <span style="color:#9f9f9f;"> (  '+ Ext.util.Format.fileSize( this.attachmentSummary[1] ) +'  )</span>'
	            		    	        	 		},
	            		    	        	        {
			            		    	        		  xtype : 'image',
			            		    	        		  imgCls : 'download-all-btn',
			            		    	        		  listeners: {
			            		    	        		        el: {
			            		    	        		            click: function( img ) {			            		    	        		            	
			            		    	        		            	  var comp = Ext.ComponentQuery.query('messagedetails');
						            		    	        			  (comp[comp.length-1]).setLoading(true);
						            		    	        			  
						            		    	        			  CollaborationToolMgr.downloadAll( me.postid, function( r,t ) {
						            		    	        				  
						            		    	        				  if( t.status ) {
						            		    	        					  //201311061716
						            		    	        					  Ext.ComponentQuery.query('downloadattachments')[0].fireEvent('openNewWinToDownload', r);
						            		    	        					  (comp[comp.length-1]).setLoading(false);
						            		    	        				  }
						            		    	        				  
						            		    	        			  },this);

			            		    	        		            }
			            		    	        		        },
			            		    	        		        afterrender : function( thisItem, width, height, eOpts ){
			            		    	        		        	var tip = Ext.create('Ext.tip.ToolTip', {
			            		    	        	            	    target: thisItem.getId(), //201312050630
			            		    	        	            	    html: DOWNLOADATTACHMENTS.DOWNLOAD_TOOLTIP
			            		    	        	            	},this);
		            		    	        		            }
			            		    	        		    }
		            		    	        	  	},
		            		    	        	  	// {
			            		    	        		 //  xtype:'label',
			            		    	        		 //  text:'( '+DOWNLOAD.DOWNLOAD_ALL+')',
			            		    	        		 //  style:'color: #9f9f9f;'
		            		    	        	  	// }
		            		    	        	  	// ,
		            		    	        	  	{
		            		    	        	  		 xtype: 'component',
		            		    	        	  		 id:me.getId()+'download-tpl',
		            		    	        	  		 renderTpl:'<form id="{id}-dwnlAllForm" class="x-hidden" action="{url}" method="get"></form>',
		            		    	        	  		 childEls: ['dwnlAllForm']
		            		    	        	  	}
			            		    	        	  ]
	            		    	          }]
	            		       },
	            		       {
	            		    	   xtype : 'container',
	            		    	   layout : 'auto',
	            		    	   records:this.records,
	            		    	   id : me.getId()+'-form'
	            		       },

	            		       {
	            		    	   xtype:'container',
	            		    	   height:10
	            		       }
	            		       ]
	            	}];
	            	this.callParent(arguments);
	            },
	            	afterRender:function( view, opt) {
	            	
	            		this.callParent(arguments);
	            		var id = this.getId()+'-form';
	            		var comp = Ext.getCmp(id);
	            	
	            		for ( var i=0; i<this.records.length; i++ ) {
	            			
	            			var filePath = this.records[i]['filePath'];
	            			var fileName = filePath.split('/');
	            			
	            			if ( SWP.isFromAmazon ){
	            				
	            				var decodePath = decodeURIComponent((filePath + '').replace(/\+/g, '%20'));
	            				fileName = decodePath.split('/');
	            			}
	            			
	            			comp.add({
	            				
	            				xtype : 'downloadattachment',
	            				text  : 	fileName[ ( fileName.length - 1 )],
	            				url	  :		filePath,
	            				fileSize :  Ext.util.Format.fileSize( this.records[i]['size'] ),
	            				style: { paddingBottom : 2}
	            			});
	            		}
	            	},
	            
	            /**
	             * Convert number of bytes into human readable format
	             *
	             * @param integer bytes     Number of bytes to convert
	             * @param integer precision Number of digits after the decimal separator
	             * @return string
	             */
	            
	            bytesToSize :function ( bytes ) {
	            	
	            	var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
	            	
	            	if (bytes == 0) return 'n/a';
	            	
	            	var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
	            	return Math.round(bytes / Math.pow(1024, i), 2) + '     ' + sizes[i];
	            }
});