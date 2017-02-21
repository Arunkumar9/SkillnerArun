/**
 * Task/Issue      Author    			UniqueID        Comment   
 *---------------------------------------------------------------------------------------------------------------------------------------------------
 *  23126          Arunkumar.muddada    201310271256      According to the issue 
 *  23596          Dinesh.GK    		20131120630     Override Tooltip component is added into the common folder, 
 *  														code modification is done as per the required areas for tooltip.
 *  23838	       Arunkumar.muddada    201311290618    Modified :getTemplateArgs
 *  													    Modified code for the noimage.jpg location
 **/ 
Ext.define('CHAT.view.PostHeader',{
	extend:'Ext.Component',
	record:{},
	alias:'widget.postheader',
	cls : 'postheader-comp',
	 childEls: [
	            'authorEl', 'subjectEl', 'headerbuttonEl','collapseEl', 'replyEl','dateEl','messageEl'
	        ],
	
	renderTpl:[
	           '<div id="{id}-authorEl" class= "author-conent">'+
	       			'<span class="auth-img-container"> '+ 	
	       				'<img class="author-img" src="{authorImage}" height=34 width=32 />'+
	       			'</span>' +
	       			'<span style=" display:block; word-wrap:break-word;"> {authorname}</span> '+
   				'</div>' +
   			'<div id="{id}-avatar" class="header-pointer-cls" ></div>'+
	       	'<div id="{id}-subjectEl" class= "postheader-subject" style="overflow: hidden;">'+
	       		'<div id = "{id}-headerbuttonEl" style="float:right;margin-right: 7px;">'+
	       			'<div id = "{id}-splitEl" style="float:right; ">{splithtml}</div>'+
	       			'<div  style="float:right; ">{splittn}</div>'+
	       			'<img id="{id}-collapseEl" border="0"  data-qclass="seek-qtip" data-anchor="right" data-qtip ="'+ MESSAGEDETAILS.COLLAPSE_TOOLTIP  +
	       			'"  src="data:image/gif;base64,R0lGODlhAQABAID/AMDAwAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" '+
	       				'class="x-wtc-link-btn expanding" style="float:right; margin-right: 5px;">'	+	            	        	        	
       				'<img id="{id}-replyEl" border="0" data-qtip="'+MESSAGEDETAILS.REPLY_TOOLTIP+'" data-anchor="right"  data-qclass="seek-qtip" '+'src="data:image/gif;base64,R0lGODlhAQABAID/AMDAwAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" '+
       					' class="x-wtc-link-btn reply" style="float:right;" >'+
   					'<label  id="{id}-dateEl" class="x-component x-component-default lastmodified" style="float:right;margin-right:8px;border-width:0;"> {lastmoddate}</label>'+
				'</div>'+
				'<div id="{id}-messageEl" style="margin-left:20px;margin-bottom: 15px !important;max-width: 75% !important;"> {message}</div>'+
	       	'</div>' ],
	
	initComponent:function() {
		this.tip = undefined;
		var me  = this;
		this.items=[
//		            	this.splitButton
		             ];
		
		this.callParent();
	},
	
	 onRender: function() {
		
		var me = this;
		me.callParent( arguments);
		me.applyChildEls(me.el,me.id);
		me.mon(me.el,{'click':me.onClick});
	},
	
	 beforeRender: function () {
		
        var me = this;
        me.callParent(arguments);
        Ext.applyIf(me.renderData ? me.renderData:{}, me.getTemplateArgs());

    },

	getTemplateArgs : function(){
    	
    	var me = this;
		var udpated  = me.record.get('updated').split('-');
		var requiredFormat = udpated[0]+'/'+udpated[1]+'/'+udpated[2];
		var lastmodified = Ext.Date.format( new Date( requiredFormat ) ,DATE.DATE_FORMAT);
		//201311290618
		return {'message':( me.record.get('readflag') )== '1'? '<span style="font-weight:bold; color:#000000;">'+me.record.get('subject')+'</span>' : me.record.get('subject'),'lastmoddate':lastmodified,'splitbuttonhtml': this.splitButtonHtml,
        		'authorname':me.record.get('authorName'),'authorImage': 
        		( Ext.isEmpty( me.record.get('authorimage') ) ? "./resources/images/noimage.jpg" : me.record.get('authorimage') ),
        		'splithtml': me.splithtml };
		
	},
	
	onClick:function(event){
		
		if ( event.target.className == "x-wtc-link-btn reply"){
			
			Ext.getCmp(this.id).up('container').replyAll(event.target.id);
			
		}else if( event.target.className == "x-wtc-link-btn expanding" || event.target.className == "x-wtc-link-btn expanding x-img-btn-collapse" ){
			
			Ext.getCmp(this.id).up('container').toggleCollapse(event);
		} 
		else if( event.target.className == "x-btn-icon-el post-header-hidecontext " || event.target.className == "x-btn-center" ) {
			
			Ext.getCmp(this.id).up('container').createMenu(event);
			
		}
	},
	afterRender : function ( view ){
		// For collapse/Expand post tooltip here we are creating the tooltip 
		// and dynamically updating the text based on the image.
//		if (!this.tip) {
//			
//			this.tip = Ext.create('Ext.tip.ToolTip', {
//			    target: this.collapseEl,
//			    tooltipType:"title",
//			    html: MESSAGEDETAILS.COLLAPSE_TOOLTIP
//			});
//		} 
	},
	markCollapse :function( collapse ) {
		
		var me = this;
		// Based on the collapsing and expanding of the post we are changing the tooltip dynmically.
		
		if( collapse ) {
			this.collapseEl.set({'data-qtip':MESSAGEDETAILS.EXPAND_TOOLTIP});
//			this.tip.update( MESSAGEDETAILS.EXPAND_TOOLTIP );
			this.collapseEl.addCls('x-img-btn-collapse');
		} else {
			
//			this.tip.update( MESSAGEDETAILS.COLLAPSE_TOOLTIP );
			this.collapseEl.set({'data-qtip':MESSAGEDETAILS.COLLAPSE_TOOLTIP});
			this.collapseEl.removeCls('x-img-btn-collapse');
		}
	}
});