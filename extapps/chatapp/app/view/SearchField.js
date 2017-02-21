/**
 * Task/Issue      Author    			UniqueID        Comment   
 *---------------------------------------------------------------------------------------------------------------------------------------------------
 * 23039           Tapaswini Sabat		201311161301	Search in messages and task details window searching the reference link and Subject header as well
 * 23707           Tapaswini Sabat      201311301541	tooltip search is displaying for the search icon.
 * 26044           Arunkumar.muddada    201403030701    Modified : onTrigger2Click :
 * 															Checking for the  value in the search bar if the value exists then only we will show the clear trigger                            
 */
Ext.define('CHAT.view.SearchField', {
    extend: 'Ext.form.field.Trigger',
    
    alias: 'widget.searchfield',
    //23039
    requires : ['CHAT.view.HighLightSearch'],
    trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
    
    trigger2Cls: Ext.baseCSSPrefix + 'form-search-trigger',
    hasSearch : false,
    paramName : 'query',
    baseParams:{},
    isFirstRun :true,
    mainEleArray :[],
    mainHeaderEleArray:[],
    initComponent: function() {	
    	
        var me = this;
        me.searchText = ''; //This config is defined for identify the non auto search,Even if the free text entered and not clicked ENTER button.
        me.callParent(arguments);
        
        me.on( 'specialkey', function( f, e ) {
        	
            if (e.getKey() == e.ENTER) {
            
            	me.searchText = me.getValue();
            	me.onTrigger2Click();
            }
        });

        // We're going to use filtering
        if( ! Ext.isEmpty( me.store )){
        	
        	me.store.remoteFilter = false;
        }
        
        me.on( 'change',function (  field, newValue, oldValue, eOpts  ){
        	
        	if( this.paramName == "livesearch" ){
        		
        		this.onLiveSearch();
        	}
    	},this,{ buffer: 300 });
        
    },
    
    afterRender: function(){
    	
    	//201311171420
		//201311301541
    	var searchTrigger = document.getElementsByClassName("x-form-search-trigger");
    	Ext.create('Ext.tip.ToolTip', {
    	    target: searchTrigger[searchTrigger.length - 1].id,
    	    anchor : 'top',
    	    html: "Search"
    	});
    	
        this.callParent();
        this.triggerCell.item(0).setDisplayed(false);
    },
    
    onTrigger1Click : function(){
    	
        var me = this;
        
        if( me.paramName == "livesearch" ){
        	
        	me.setValue('');
        	me.triggerCell.item(0).setDisplayed(false);
        	me.updateLayout();
        	me.onLiveSearch();
        	
        }else {
        	
        	if ( me.hasSearch ) {
        		
        		me.setValue('');
        		me.store.clearFilter();
        		me.store.load();
        		me.hasSearch = false;
        		me.triggerCell.item(0).setDisplayed(false);
        		me.updateLayout();
        	}
        }
    },

    onTrigger2Click : function(){
    	
        var me = this;
        if( me.paramName == "livesearch" ) {
        	me.hasSearch = true;
        	//201403030701
        	value = me.getValue();
	        if ( value.length > 0 ) {
	         	me.triggerCell.item(0).setDisplayed(true);
	        } else {
	        	me.triggerCell.item(0).setDisplayed(false);
	        }
            me.updateLayout();
        	me.onLiveSearch();
        	
        } else {
        	
        	 /**
    		 * @var {Ext.data.Store} this.store
    		 * The store that is related to this searchfield 
    		 */
                store = me.store;
                proxy = store.getProxy();
                value = me.getValue();
    	                
            if ( value.length > 0 ) {
            	
                // Param name is ignored here since we use custom encoding in the proxy.
                // id is used by the Store to replace any previous filter
            	
            	/**
            	 *  clears all the filters that are applied before
            	 *  paramName -- is the name that we are passing along with the trigger request. If it is not specified then by default it will take it as query.
            	 *  value -- value entered in searchfield
         		 */
            	
             	me.store.clearFilter();
             	me.store.filter({
             		
             		id: me.paramName,
             		property: me.paramName,
             		value: value
             	});
         		me.store.loadPage(1);
             	me.store.clearFilter();
                 
             	me.hasSearch = true;
             	me.triggerCell.item(0).setDisplayed(true);
                me.updateLayout();
                 
             }else {
            	
            	/**
            	 *  If free text will not contain any text then it should refresh the view
         		 */
            	 //201403030701
             	me.triggerCell.item(0).setDisplayed(false);
            	me.store.clearFilter();
         		me.store.load();
            }
        }
       
    },
    onLiveSearch: function() {
   	 	var me = this;
   	 
   	 	me.searchRegExp = null;
   	 	me.caseSensitive = false;
        
   	 	// detects html tag
	    me.tagsRe= /<[^>]*>/gm;
	    // DEL ASCII code
	    me.tagsProtect= '\x0f';
	    
	    // detects regexp reserved word
	    me.regExpProtect= /\\|\/|\+|\\|\.|\[|\]|\{|\}|\?|\$|\*|\^|\|/gm;
	    
 		me.searchValue = me.getValue();
 		
 		var threadId = me.store.getAt(0).get('thread_id');
 		if( threadId && me.currentThreadID == threadId ){
 			this.isFirstRun = false;
 			
 		}else{
 			me.currentThreadID = threadId ;
 			this.isFirstRun = true;
 			me.mainEleArray = [];
 			me.mainHeaderEleArray = [];
 		}
 		var htmlEl='';
 		var messageDetails = me.up('messagedetails');
 		
 		var posts = Ext.getCmp(messageDetails.id+'posts').items;
 		
		if( me.searchValue !== null ) {
			var trimedSearchValue = me.searchValue.replace(/^\s+|\s+$/g, '');
			me.searchRegExp = new RegExp( trimedSearchValue, "gi" );
			
			posts.each( function(post, idx) {
				
				//23039
				if( idx == 0 ){
					
			 			var highlight =  Ext.create('CHAT.view.HighLightSearch',messageDetails.id+'-header-container-outerCt' );
			 			highlight.apply( me.searchValue, messageDetails.id+'-header-container-outerCt' );
				}
				else if( idx > 0 ){
					
						var postBody = post.down('panel');
						var postActualBody = postBody.down('container[cls=post-actual-body"]');
						var postContentArea = postActualBody.down('container[cls=post-content-area]');
						
						if( me.mainEleArray.length != 0 && ( ! this.isFirstRun ) && me.mainEleArray.length == posts.length ){
							
							postContentArea.el.dom.innerHTML = me.mainEleArray[idx];
						}else {
							
							me.mainEleArray[idx] = postContentArea.el.dom.innerHTML;
						}
						var postBodyEle = postContentArea.el.dom.innerHTML;
					
						var bodyHtml = postBodyEle.replace(this.tagsRe, me.tagsProtect );
						//Remove Character Entities from text
						bodyHtml = bodyHtml.replace(/&[^;]+;/g, "");
						
						if( bodyHtml.match( this.searchRegExp ) ){
						
							//If is execute when the Post body contain more then 2 childs.
							if( postContentArea.el.dom.children.length > 2){
								
								var eleChilds = postContentArea.el.dom.children;
								var chaildElesStr = "";
								for( var i in eleChilds ){
										if( i < eleChilds.length - 1 ){
											var innerHtml = eleChilds[i].innerHTML;
											var withOutEleText =  innerHtml.replace(this.tagsRe, me.tagsProtect );
											var withOutCharEntities = withOutEleText.replace(/&[^;]+;/g, "");
											if( withOutCharEntities.match( this.searchRegExp )){
												
												chaildEles = withOutCharEntities.replace(me.searchRegExp, function(m) {
													
													return '<span class = "search-text-highlight">' + m + '</span>';
												});
												
												var str = "<"+eleChilds[i].tagName+">"+chaildEles+"</"+eleChilds[i].tagName+">";
												chaildElesStr = chaildElesStr+""+str;
											}
										}
									}
									if( chaildElesStr != "" ){
										
										postContentArea.el.dom.innerHTML = chaildElesStr;
									}
									
							}else{
								var htmlEl = bodyHtml.replace(me.searchRegExp, function(m) {
									
			                        return '<span class="search-text-highlight">' + m + '</span>';
			                     });
								postContentArea.el.dom.innerHTML = '<p>'+htmlEl+'</p>';
							}

						}else{
							
							postContentArea.el.dom.innerHTML = '<p>'+bodyHtml+'</p>';
						}
						/**
						 * here written code for search Post header content text
						 */
						var postHeader = post.down('postheader');
						var postHeaderTextEl = Ext.select('#'+post.down('postheader').getId()+'-messageEl').elements[0].innerHTML;
						if( me.mainHeaderEleArray.length != 0 && ( ! this.isFirstRun ) && me.mainHeaderEleArray.length == posts.length ){
							
							postHeaderTextEl = me.mainHeaderEleArray[idx];
						}else {
							
							me.mainHeaderEleArray[idx] = postHeaderTextEl;
						}
						
						var postHeaderEl = postHeaderTextEl.replace(this.tagsRe, me.tagsProtect );
				
						if( postHeaderEl.match( this.searchRegExp ) ){
							var headerHtmlEl = postHeaderEl.replace(me.searchRegExp, function(m) {
								
		                        return '<span class="search-text-highlight">' + m + '</span>';
		                     });
							Ext.select('#'+post.down('postheader').getId()+'-messageEl').elements[0].innerHTML = headerHtmlEl;
							
						}else{
							Ext.select('#'+post.down('postheader').getId()+'-messageEl').elements[0].innerHTML = postHeaderEl;
						}
				}
				
			},this );
			
			this.isFirstRun = false;
		 }
    }
});