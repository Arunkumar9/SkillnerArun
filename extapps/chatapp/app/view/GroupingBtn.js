 /**
 * @author PhaniKiran.Gutha <phani.kiran@walkingtree.in>
 * 
 * Feature for the grid component to show button on the group header.
 * 
 * 
 */
 Ext.define('CHAT.view.GroupingBtn',{
    	extend:'Ext.grid.feature.Grouping',
    	requires: ['Ext.grid.feature.GroupStore'],
    	alias:'feature.groupingbtn',
    	headerBtns:[],
    	actionIdRe:new RegExp('x-groupheader-btn-(\\d+)'),
    	  constructor: function() {
	 			
		        this.groupCache = {};
		        this.callParent(arguments);
		        
    	    },
    	    groupTpl: [
    	               '{%',
    	                   'var me = this.groupingFeature;',
    	                   // If grouping is disabled, do not call setupRowData, and do not wrap
    	                   'if (me.disabled) {',
    	                       'values.needsWrap = false;',
    	                   '} else {',
    	                       'me.setupRowData(values.record, values.recordIndex, values);',
    	                       'values.needsWrap = !me.disabled && (values.isFirstRow || values.summaryRecord);',
    	                   '}',
    	               '%}',
    	               '<tpl if="needsWrap">',
    	                   '<tr data-boundView="{view.id}" data-recordId="{record.internalId}" data-recordIndex="{[values.isCollapsedGroup ? -1 : values.recordIndex]}"',
    	                       'class="{[values.itemClasses.join(" ")]} ' + Ext.baseCSSPrefix + 'grid-wrap-row<tpl if="!summaryRecord"> ' + Ext.baseCSSPrefix + 'grid-group-row</tpl>">',
    	                       '<td class="' + Ext.baseCSSPrefix + 'group-hd-container" colspan="{columns.length}">',
    	                           '<tpl if="isFirstRow">',
    	                               '{%',
    	                                   // Group title is visible if not locking, or we are the locked side, or the locked side has no columns/
    	                                   // Use visibility to keep row heights synced without intervention.
    	                                   'var groupTitleStyle = (!values.view.lockingPartner || (values.view.ownerCt === values.view.ownerCt.ownerLockable.lockedGrid) || (values.view.lockingPartner.headerCt.getVisibleGridColumns().length === 0)) ? "" : "visibility:hidden";',
    	                               '%}',
    	                               '<div id="{groupId}" class="' + Ext.baseCSSPrefix + 'grid-group-hd {collapsibleCls}" style="display: inline-block;width:100%;" tabIndex="0">',
    	                               '<div class="" style="display:inline; float:left;" >',
    	                               '{[me.headerIconRender(values.groupInfo, parent)]}</div>',
//    	                                   '<div class="' + Ext.baseCSSPrefix + 'grid-group-title hide-expand-collapse " style="{[groupTitleStyle]} width:74%;float: left;">',
    	                                       '{[me.headerText(values.groupInfo, parent)]}{[values.groupHeaderTpl.apply(values.groupInfo, parent) || "&#160;"]}',
    	                                   '</div>',
    	                                   '<div id={id}-grid-group-badge class = "' + Ext.baseCSSPrefix +'group-badge-default" > {[me.groupBadge( values.groupInfo, parent )]}</div>',
    	                               '</div>',
    	                           '</tpl>',

    	                           // Only output the child rows if  this is *not* a collapsed group
    	                           '<tpl if="summaryRecord || !isCollapsedGroup">',
    	                               '<table class="', Ext.baseCSSPrefix, '{view.id}-table ', Ext.baseCSSPrefix, 'grid-table',
    	                                   '<tpl if="summaryRecord"> ', Ext.baseCSSPrefix, 'grid-table-summary</tpl>"',
    	                                   'border="0" cellspacing="0" cellpadding="0" style="width:100%">',
    	                                   '{[values.view.renderColumnSizer(out)]}',
    	                                   // Only output the first row if this is *not* a collapsed group
    	                                   '<tpl if="!isCollapsedGroup">',
    	                                       '{%',
    	                                           'values.itemClasses.length = 0;',
    	                                           'this.nextTpl.applyOut(values, out, parent);',
    	                                       '%}',
    	                                   '</tpl>',
    	                                   '<tpl if="summaryRecord">',
    	                                       '{%me.outputSummaryRecord(values.summaryRecord, values, out);%}',
    	                                   '</tpl>',
    	                               '</table>',
    	                           '</tpl>',
    	                       '</td>',
    	                   '</tr>',
    	               '<tpl else>',
    	                   '{%this.nextTpl.applyOut(values, out, parent);%}',
    	               '</tpl>', {
    	                   priority: 200,

    	                   syncRowHeights: function(firstRow, secondRow) {
    	                       firstRow = Ext.fly(firstRow, 'syncDest');
    	                       secondRow = Ext.fly(secondRow, 'sycSrc');
    	                       var owner = this.owner,
    	                           firstHd = firstRow.down(owner.eventSelector, true),
    	                           secondHd,
    	                           firstSummaryRow = firstRow.down(owner.summaryRowSelector, true),
    	                           secondSummaryRow,
    	                           firstHeight, secondHeight;

    	                       // Sync the heights of header elements in each row if they need it.
    	                       if (firstHd && (secondHd = secondRow.down(owner.eventSelector, true))) {
    	                           firstHd.style.height = secondHd.style.height = '';
    	                           if ((firstHeight = firstHd.offsetHeight) > (secondHeight = secondHd.offsetHeight)) {
    	                               Ext.fly(secondHd).setHeight(firstHeight);
    	                           }
    	                           else if (secondHeight > firstHeight) {
    	                               Ext.fly(firstHd).setHeight(secondHeight);
    	                           }
    	                       }

    	                       // Sync the heights of summary row in each row if they need it.
    	                       if (firstSummaryRow && (secondSummaryRow = secondRow.down(owner.summaryRowSelector, true))) {
    	                           firstSummaryRow.style.height = secondSummaryRow.style.height = '';
    	                           if ((firstHeight = firstSummaryRow.offsetHeight) > (secondHeight = secondSummaryRow.offsetHeight)) {
    	                               Ext.fly(secondSummaryRow).setHeight(firstHeight);
    	                           }
    	                           else if (secondHeight > firstHeight) {
    	                               Ext.fly(firstSummaryRow).setHeight(secondHeight);
    	                           }
    	                       }
    	                   },

    	                   syncContent: function(destRow, sourceRow) {
    	                       destRow = Ext.fly(destRow, 'syncDest');
    	                       sourceRow = Ext.fly(sourceRow, 'sycSrc');
    	                       var owner = this.owner,
    	                           destHd = destRow.down(owner.eventSelector, true),
    	                           sourceHd = sourceRow.down(owner.eventSelector, true),
    	                           destSummaryRow = destRow.down(owner.summaryRowSelector, true),
    	                           sourceSummaryRow = sourceRow.down(owner.summaryRowSelector, true);

    	                       // Sync the content of header element.
    	                       if (destHd && sourceHd) {
//    	                           Ext.fly(destHd).syncContent(sourceHd);
    	                       }

    	                       // Sync the content of summary row element.
    	                       if (destSummaryRow && sourceSummaryRow) {
//    	                           Ext.fly(destSummaryRow).syncContent(sourceSummaryRow);
    	                       }
    	                   }
    	               }
    	           ],
    	           groupBadge:function( groupInfo, parent ){
    	        	   
    	        	   var me = this;
    	        	   var badgetpl = '' ;
    	        	   for( var i=0;i<me.headerBtns.length;i++){
    	        		   var item = me.headerBtns[i];
    	         		   var index=i;
    	         		   var scope = me.grid;
    	         		   
    	         		  var visible= (Ext.isFunction(item.isVisible) ? item.isVisible.apply( item.scope || scope, arguments ) : ( item.isVisible ? '' :'x-grid-heder-btn-hide'));
    	         		  
    	        		  var groupBadgeText = (Ext.isFunction(item.groupBadge) ? item.groupBadge.apply( item.scope || scope, arguments ) : item.groupBadge );
    	        		  
    	        		  var classcss = (Ext.isFunction(item.getClass) ? item.getClass.apply(item.scope || scope, arguments) : item.getClass );
    	        		  var hoverCls = classcss+'-hover';
     	        		  var quiz_instruction = false;
     	        		  
     	        		  	var uid = groupInfo.children[0].data.uid;
     	        		  	if(uid && uid.substr(0,1) == 'L'){
     	        		  		var statusCode = classcss.split('-');
     	        		  		classcss = 'fbarCls'+statusCode[1];
     	        		  		hoverCls = 'fbarCls'+statusCode[1]+'-hover';
     	        		  	} else {
     	        		  		
     	        		  		classcss += ' quiz-header';
     	        		  	}
     	        		  	if( (classcss.indexOf('status') >-1  && uid.substr(0,1) == 'Q' ) && groupInfo.children[0].get('instructions')){
     	        		  		quiz_instruction = true;
     	        		  	}
     	        		  	
    	        		  badgetpl += '<img style = "float : left;"" src="' + ( Ext.BLANK_IMAGE_URL) +
    	        		  
      	        		   '" class = "'+
    	        		  (( quiz_instruction == 1 ) ? ('instructions-cls x-groupheader-btn x-groupheader-btn-'+index): '' )+
    	        		  '" '+
    	        		 ( ( quiz_instruction == 1 ) ? (( ' data-qtip = " '+TASKSTATUS.INSTRUCTIONS+
	        						  ' " ' ) ) :'')
    	        		  +'></img>'+
      	 	        		  '<span alt="' + (item.altText || me.altText) + '" src="' + (item.icon || Ext.BLANK_IMAGE_URL) +
   	        		   '" hoverclass ="'+classcss+'-hover"  class="' +   'x-groupheader-btn ' + ' x-groupheader-btn-'+index +
   	        		   ( ( Ext.isFunction(item.isDisabled) ?  ( item.isDisabled.apply(item.scope||scope,arguments) ): item.disable ) ?  
   	        				   ' item-disabled' : ' ') +visible
   	        				   +
   	        				   ' ' + (classcss) +' ' + (item.iconCls || me.iconCls || ' ') +
   	        				   '  ' +'"'+
   	        				   ((item.tooltip) ? ' data-qtip = "' + ( Ext.isFunction(item.tooltip) ? item.tooltip.apply(item.scope||scope,arguments) :item.tooltip) +
   	        						  ' " data-anchor = "top" ' : '') + 
    	        			  'style="float:left;" ></span>'+
    						  '<span style=" "  class = "group-header-badgeCls '+ 
    	 	        		 (( groupBadgeText == 0 ) ? 'hide-headerbadge' : '' )+
    	 	        		  '"> '+groupBadgeText+'</span>' ;
    	        		  
    	        	   }
    	        	   return badgetpl;
    	           },
    	           headerIconRender:function( values,parent ){
    	        	  
    	        	var me = this;
   		 	   	    var ele = '';
   		      	    for( var i=0;i<me.headerBtns.length;i++){
   		      		 var item = me.headerBtns[i];
   	        		   var index=i;
   	        		   var scope = me.grid;
   	        		ele +=  '<img border="0" class=" group-header-icon  '+(Ext.isFunction(item.getHeaderIconCls) ? item.getHeaderIconCls.apply(item.scope || scope, arguments) : '' )+'"  src="'+Ext.BLANK_IMAGE_URL+'" />'+
   		      		'<img border="0" class=" group-header-icon2  '+(Ext.isFunction(item.getHeaderIconCls2) ? item.getHeaderIconCls2.apply(item.scope || scope, arguments) : '' )+'"  src="'+Ext.BLANK_IMAGE_URL+'" />'
   		      	   }
   		      	   return ele;
    	   	    },
    	   	 headerText : function( values,parent ){
    	        	  
    	        	var me = this;
   		 	   	    var ele = '';
   		      	    for( var i=0;i<me.headerBtns.length;i++){
   		      		 var item = me.headerBtns[i];
   	        		   var index=i;
   	        		   var scope = me.grid;
   		      		 	ele += '<div class="' + Ext.baseCSSPrefix + 'grid-group-title hide-expand-collapse '+(Ext.isFunction(item.getHeaderText) ? item.getHeaderText.apply(item.scope || scope,arguments ):''  )+' " style="width:60%;float: left;">'
   		      	   }
   		      	   return ele;
    	   	    },
    	           
 	  /**
 	   * @private
 	   * overriding the groupClick function to handle the click event on the image/headerbutton.
 	   * find out the actual item and find if handler is defined.if defined call's the handler.
 	   */
       onGroupClick: function(view, rowElement, groupName, e) {

           var me = this,
               groupCache = me.groupCache,
               groupIsCollapsed = !me.isExpanded(groupName),
               g;
           var match = e.getTarget().className.match(me.actionIdRe);
           if(match) {
        	   if(e.getTarget().className.indexOf('status') > -1 )
	    			return;
    		var headeritem = me.headerBtns[parseInt(match[1], 10)];
//        	  var headeritem =   me.headerBtns[0];
    		if (headeritem) {
    			if (e.type == 'click') {
    				fn = headeritem.handler || me.handler;
    				if (fn && !headeritem.disabled) {
    					return fn.call(headeritem.scope || me.scope || me, view, groupName,e);
    				}
    			} else if (type == 'mousedown' && headeritem.stopSelection !== false) {
    				return false;
    			}
    		}
    	}else if (me.collapsible) {
    			
               // CTRL means collapse all others
               if (e.ctrlKey) {
                   Ext.suspendLayouts();
                   for (g in groupCache) {
                       if (g === groupName) {
                           if (groupIsCollapsed) {
                               me.expand(groupName);
                           }
                       } else {
                           me.doCollapseExpand(true, g, false);
                       }
                   }
                   Ext.resumeLayouts(true);
                   return;
               }

               if (groupIsCollapsed) {
                  me.expand(groupName);
               } else {
                   me.collapse(groupName);
               }
           }
       },
       afterViewRender: function() {
           var me = this,
               view = me.view;

           view.on({
               scope: me,
               groupclick: me.onGroupClick,
               groupmouseover : me.onGroupMouseOver,
	           groupmouseout  : me.onGroupMouseOut,
	           ongroupcollapse: me.onGroupCollapse,
	           ongroupexpand  : me.onGroupExpand,
	           grouphandle : me.onGroupHandle,
	           changegroupicon : me.ChangeGroupIcon
           });

           if (me.enableGroupingMenu) {
               me.injectGroupingMenu();
           }

           me.pruneGroupedHeader();

           me.lastGroupField = me.getGroupField();
           me.block();
           me.onGroupChange();
           me.unblock();
       },
       
	    onGroupMouseOver: function( view, rowElement, groupName, e ) {
	    	
	    	var me = this,
	    	match = e.getTarget().className.match(me.actionIdRe),
	    	item, fn;
	    	if (match) {
	    		item = me.headerBtns[parseInt(match[1], 10)];
	    		if (item) {
	    			var hoverclass = "";
	    			if( Ext.isIE ){
	    				hoverclass =  e.target.attributes.getNamedItem("hoverclass").nodeValue;
	    				e.target.className = e.target.className +  ' ' + hoverclass;
	    					
	    			}else{
	    				
	    				hoverclass = e.getTarget().attributes[2].nodeValue;
	    				e.getTarget().classList.add(hoverclass);
	    			}
	    		}
	    	}
	    },
	    onGroupMouseOut: function( view, rowElement, groupName, e ) {
	    	
	    	
	    	var me = this,
	    	match = e.getTarget().className.match(me.actionIdRe),
	    	item, fn;

	    	if (match) {
	    		item = me.headerBtns[parseInt(match[1], 10)];
	    		if (item) {
	    			var hoverclass ="";
	    			if( Ext.isIE ){
	    				hoverclass =  e.target.attributes.getNamedItem("hoverclass").nodeValue;
	    				e.target.className = e.target.className.replace(  hoverclass );
	    			}else{
	    				
	    				hoverclass = e.getTarget().attributes[2].nodeValue;
	    				e.getTarget().classList.remove(hoverclass);
	    			}
//	    			e.getTarget().classList.remove('tap')
//	    			if (e.type == 'click') {
//	    				fn = item.handler || me.handler;
//	    				if (fn && !item.disabled) {
//	    					fn.call(item.scope || me.scope || me, view, groupName,e);
//	    				}
//	    			} else if (type == 'mousedown' && item.stopSelection !== false) {
//	    				return false;
	    			}
	    		}
	    },
	    /**
	     * Expand a group
	     * @param {String} groupName The group name
	     * @param {Boolean} focus Pass `true` to focus the group after expand.
	     */
	    expand: function(groupName, focus) {
	        this.doCollapseExpand(false, groupName, focus);
	    },
	    collapse: function(groupName, focus) {
	        this.doCollapseExpand(true, groupName, focus);
	    },
	    doCollapseExpand: function(collapsed, groupName, focus) {
	        var me = this,
	            lockingPartner = me.lockingPartner,
	            group = me.groupCache[groupName];

	        // groupCache is shared between two lockingPartners
	        if (group.isCollapsed != collapsed) {

	            // The GroupStore is shared by partnered Grouping features, so this will refresh both sides.
	            // We only want one layout as a result though, so suspend layouts while refreshing.
	            Ext.suspendLayouts();
	            if (collapsed) {
	                me.dataSource.collapseGroup(group);
	            } else {
	                me.dataSource.expandGroup(group);
	            }
	            Ext.resumeLayouts(true);

	            // Sync the group state and focus the row if requested.
	            me.afterCollapseExpand(collapsed, groupName, focus);

	            // Sync the lockingPartner's group state.
	            // Do not pass on focus flag. If we were told to focus, we must focus, not the other side.
	            if (lockingPartner) {
	                lockingPartner.afterCollapseExpand(collapsed, groupName, false);
	            }
	        }
	    },

	    afterCollapseExpand: function(collapsed, groupName, focus) {
	        var me = this,
	            view = me.view,
	            header;

	        header = Ext.get(this.getHeaderNode(groupName));
	        view.fireEvent(collapsed ? 'groupcollapse' : 'groupexpand', view, header, groupName);
	        if (focus) {
	            header.up(view.getItemSelector()).scrollIntoView(view.el, null, true);
	        }
	        view.fireEvent(collapsed ? 'ongroupcollapse' : 'ongroupexpand', view, header, groupName);
	        view.fireEvent('grouphandle', view, header, groupName);
	        view.fireEvent('changegroupicon',  view, header, groupName );
	        
	        
	    },
	    onGroupCollapse : function( view, groupHeader, groupName ){
	    	
	    	var record = view.getStore().findRecord('ordering',groupName);
	    	if( record.get( 'video_id' ).substr(0,1) == 'L' ){
	    		var headeIcon = groupHeader.down('.group-header-icon');
	    		var lessonOpen = headeIcon.dom.className.indexOf('lesson-open-expanded');
	    		var lessonClose = headeIcon.dom.className.indexOf('lesson-close-expanded');
	    		if( lessonOpen != -1 ){
	    			headeIcon.addCls('lesson-open-collapsed');
	    			
	    		}else if( lessonClose != -1 ){
	    			
	    			headeIcon.addCls('lesson-close-collapsed');
	    		}
	    	}
	    		
	    	
	    },
	    onGroupExpand:function( view, groupHeader, groupName ){
	    	
	    	var record = view.getStore().findRecord('ordering',groupName);
	    	if( record.get( 'video_id' ).substr(0,1) == 'L' ){
	    		
	    		var headeIcon = groupHeader.down('.group-header-icon');
	    		var lessonOpen = headeIcon.dom.className.indexOf('lesson-open-expanded');
	    		var lessonClose = headeIcon.dom.className.indexOf('lesson-close-expanded');
	    		if( lessonOpen != -1 ){
	    			headeIcon.removeCls('lesson-open-collapsed');
	    			
	    		}else if( lessonClose != -1 ){
	    			
	    			headeIcon.removeCls('lesson-close-collapsed');
	    		}
	    	}
	    },
	    onGroupHandle : function( view, groupHeader, groupName ){
	    	
	    	var list = view.ownerCt.ownerCt;
	    	var record = view.getStore().findRecord('ordering',groupName);
	    	var uid = record.get( 'uid' );;
	    	if( uid.substr(0,1) == 'Q' ){
	    		list.fireEvent('chapterselected', list,view, uid.substr(1), record, record.get('lesson'), null, null, true);
	    	}
	    },
	    
	    ChangeGroupIcon : function( groupName , fromAnswerQuiz ){
	    	if(fromAnswerQuiz == true){
	    		
	    		quizElement = Ext.get(this.getHeaderNode(groupName));
	    		quizElement.down('.group-header-icon').removeCls('quizOpenCls').addCls('quizClosedCls');
	    		quizElement.down('.hide-expand-collapse').removeCls('notseen-font').addCls('seen-font');
	    	}
	    }
});
