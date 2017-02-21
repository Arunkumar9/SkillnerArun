/**
 * Task/Issue      Author    			UniqueID        Comment   
 *---------------------------------------------------------------------------------------------------------------------------------------------------
 *  24008		  Tapaswini Sabat		201312041802	As callout was not coming in the tooltip, so added that
 **/ 
/**
 * @author Tapaswini Sabat
 * 
 * This component is used to create individual posts based on some config value (attachments, hidereply, msg, content, lastmodified, 
 * titlecolor, titlebgcolor, expandflag, firstflag, attachmentSummary, positionIndex, record, showHidden)
 */

Ext.define('CHAT.view.Post', {
	extend: 'Ext.container.Container',
    alias: 'widget.post',
    cls : 'eachPostBody',
    layout : 'auto',
    requires:['CHAT.view.DownloadAttachments','CHAT.view.ImageButton','CHAT.view.QuotedText'],
    /**
     * @cfg hideQuotedText {boolean}
     * hide the quoted text component
     * 
     * Default:false
     */
    hideQuotedText : false,
    adminVersion : false,
 
    constructor : function( config ) {
    	
        var me = this;

        Ext.apply( me, config );
        this.callParent( arguments );
    },
    
    initComponent : function() {
    	
		var me=this;
		
		/**
		 * refs #6062
		 */
		
		if( me.adminVersion ) {
			
			this.adminVersion = me.adminVersion ;
		}
		
		
		this.style= {borderWidth : '1px 0px 1px 0px',overflowX : 'hidden'};
		
		this.content = this.record.get('content');
		this.attachments = this.record.get('attachments');
		var headerImages=[], headerButtons = [],postMenu=[];
		if ( !this.attachments ) {
			
			 Ext.Error.raise({
	             msg: MESSAGE.POST_ERROR_MSG 
	           
	         });
		}
		
		var i= 0 ,j =0;
		if( this.adminVersion && (this.record.get('threadtypeId') == 3) ) {

			this.splitButton = Ext.create('Ext.button.Button',{
				iconCls : 'post-header-hidecontext',
				//201312041802
				tooltip : {
					text : MESSAGEDETAILS.TASK_ACTION, 
					anchor : 'top'
				},
				cls:'btn-style',
				renderTo : Ext.getBody()



			});
			this.splitButtonhtml = this.splitButton.getEl().dom.outerHTML; //Ext.DomHelper.generateMarkup([this.splitButton.getRenderTree()], []);
			this.splitButton.setVisible( false );
		}else{
			this.splitButtonhtml = '<div></div>';
		}
			
		var lastmoddate = this.lastmodified;
		
		if ( this.content.substr(0,11) == 'TASKACTIONS'){
			this.content = '<p>'+eval( this.content )+'</p>';
		}
		var html = this.content;
		this.cls='pocview';
		
		this.msg = "<font color = "+this.titlecolor+">"+ Ext.String.htmlEncode(this.msg) + "</font>";
		
		var quotemessage = this.content;
		
		this.items = [			             
		              {
		            	  xtype:'postheader',
		            	  record:me.record,
//		            	  style : 'margin-right : 22px !important',
		            	  splithtml : this.splitButtonhtml
		              }
    		];
		
		this.callParent(arguments);
},

createMenu : function(event) {
	
	var me = this;
	if( !me.menu ){
	
		me.menu = Ext.create('Ext.menu.Menu',{
			store:this.actionStore,
			id:me.getId()+'menu',
			items:this.splitMenuItems,
			listeners:{
			'click':function(menu , item ){
			me.msg = item.actionText;
			me.replybody = item.body;
			me.fireEvent( 'actionchange', me, item.actionId );
		}
		}
		});
	}
	 me.menu.showAt(event.getX(), event.getY()+9);
	
},
	/**
	 * This method will collapse the panel if expanded by clicking on the collapse button and will change the image.
	 */
	collapse: function( ) {
		var pan= this.items.items[1];
		pan.collapse();
		pan.addCls('poc-collapsed');
		this.down('postheader').markCollapse(true);
	},
	
	/**
	 * This method will expand the panel if collapsed by clicking on the expand button and will change the image.
	 * */
	 
	expand:function() {
		var pan= this.items.items[1];
		pan.removeCls('poc-collapsed');
		pan.expand(false);
		this.down('postheader').markCollapse(false);
	},
	
	/**
	 * This method will collapse the panel if expanded and viceversa by clicking on the button and will change the image.
	 */
	toggleCollapse:function( event ) {

		var pan= this.items.items[1];
		var postheaderID = event.getTarget().id.split("-")[1];
		this.avatar = Ext.getElementById("postheader-"+postheaderID+"-avatar");
		this.YPosition = event.getXY()[1];
		
		// Get the current messagedetails window.
		var messagedetailsCount = Ext.ComponentQuery.query('messagedetails');
		messagedetails = messagedetailsCount[messagedetailsCount.length - 1];
//		pan.on('expand',function( p ){
//				
//				var msgDetails = Ext.ComponentQuery.query('messagedetails')[0];
//				var deltaY = (this.YPosition)-(this.avatar.clientHeight);
//				msgDetails.scrollBy(0,deltaY , true);
////			Ext.getCmp(this.up('messagedetails').getId()+'posts').scrollBy( 0,  p.el.dom.offsetTop , true);
//			
//		},this,{single:true});
		
		// Get the expand-collapse buttons
		var expandCollapseButton = Ext.ComponentQuery.query('button[name=expand-collapse]');
		if ( pan.collapsed == false ) {
			
			pan.collapse(Ext.Component.DIRECTION_TOP,true);
			pan.addCls('poc-collapsed');
			messagedetails.postsCollapsed++;
			
			// If atleast one post is collapsed then we are making the collapse-all button to expand-all.
			if ( messagedetails.postsCollapsed == 1 ) {
				
				expandCollapseButton[expandCollapseButton.length-1].setIconCls('x-img-btn-expand-collapse');
				messagedetails.down('button[name=expand-collapse]').setTooltip(
				//201312041802
						 { text : MESSAGEDETAILS.EXPANDALL_TOOLTIP,
			        			anchor :'top'
								} 
						 );
			}
			this.down('postheader').markCollapse(true);
			
		} else {
			
			pan.removeCls('poc-collapsed');
			pan.expand(true);
			messagedetails.postsCollapsed--;
			
			// If all posts are  expanded then we are making the expand-all button to collapse-all.
			
			if ( messagedetails.postsCollapsed == 0 ){
				expandCollapseButton[expandCollapseButton.length-1].setIconCls('expanding-collapsing');
				messagedetails.down('button[name=expand-collapse]').setTooltip(
				//201312041802
								{ text :  MESSAGEDETAILS.COLLAPSEALL_TOOLTIP,
			        			anchor :'top'
								});
			}
			pan.focus();
			this.down('postheader').markCollapse(false);
		}
	},
	replyAll : function(){
		
		this.fireEvent('replyall',this,me);
	},
	
	/**
	 * 	Fires after the component rendering is finished.
	 */
		afterRender:function() {
			var me = this;
		this.callParent( arguments );
		
		var childConfig ={};
		var quotedText = '';
		if ( this.record.get('parent') ) {
			
			if ( this.record.get( 'parent' )['content'].substr(0,11) == 'TASKACTIONS' ) { 
				
				quotedText =eval( this.record.get('parent')['content'] );
				
			}else {
				
				quotedText = this.record.get('parent')['content'];
				
			}
		}
		childConfig ={
				xtype:'panel',
				border : 0,
				cls : 'postBody',
				style :'float : left;',
				layout:'hbox',
				width : '99%',
			    scope:this,
				collapsed:false,
				items:[
				       {
				    	   xtype:'container',
				    	   width:120
				    	   
				       },{
				    	   xtype:'container',
				    	   cls:'post-actual-body', //this CSS class is used in coding, do't change this class name
				    	   flex:9,
				    	   items : [
				    	            ( quotedText && !this.hideQuotedText ) ? {
				    	            	xtype:'container',
				    	            	cls:'quoted-text-area',
				    	            	items:[
											{
												xtype:'fieldset',
												title: POST.QUOTED_TEXT_TITLE,
												collapsible: true,
												collapsed:true,
												hidden:this.hideQuotedText,
												items:[{
													xtype : 'container',
													html :  quotedText,
													width:'100%',
													height:100,
													autoScroll:true
											
												}],
												listeners:{
												'expand' : function( f, eopts ){
													f.focus();
											}
											}
											}
	
				    	            	       ]
				    	            } : {
				    	            	
				    	            },
							         {
							        	 xtype : 'container',
							        	 html : this.content,
							        	 cls:'post-content-area'
							         },
							         {
							        	 xtype : 'container',
							        	 dock : 'bottom',
							        	 cls:'post-attachments',
							        	 id:this.getId()+'-attachments',
							        	 items:[
								        	       (this.attachments && this.attachments.length > 0) ?  {
								       				xtype : 'downloadattachments',
								    				records:this.attachments,
								    				attachmentSummary:this.record.get('attachmentSummary'),
								    				postid : this.record.get('uid')
								    			} : {
								    				xtype : 'container',
								    				minHeight : 2
								    			} 
								        	        ]
							         }
							         ]
				       }
				       ],
			listeners:{
				/**
				 * Fires after the component rendering is finished.
				 */
				afterRender:function() {
					
					if ( this.rendered && this.collapsed ){
						
						this.addCls('poc-collapsed');
					}
				},
				/**
				 * Fires when the postbody is expanded.
				 */
				expand:function( p ){
					if ( this.scope.avatar ){
						
						var msgDetails = Ext.ComponentQuery.query('messagedetails')[0];
						var deltaY = ( this.scope.YPosition ) - ( this.scope.avatar.clientHeight + msgDetails.getDockedItems()[0].getHeight() );
						msgDetails.scrollBy(0,deltaY , true);
					}
				
				}
			}
		};
				
		this.add( childConfig );
	}
});
