/**
 * CardLayout Implementation for wizards, uses Saki's MetaForm extension to
 * allow dynamic metadata configurations.
 * 
 * @author Charles Opute Odili (chalu)
 * @class Ext.ux.Wizard
 * @extend Ext.Panel
 * @version 1.0
 */

Ext.ux.Wizard = Ext.extend(Ext.Panel, {
	/**
	 * @cfg Label text for the back navigation button, default is 'Back'
	 */
	backBtnText: 'Back',
	
	/**
	 * @cfg Label text for the foward navigation button, default is 'Continue'
	 */
	nextBtnText: 'Continue',
	
	/**
	 * Label text for the foward navigation button on the last page / view, defaults to null
	 */
	endBtnText: null,
	
	/**
	 * Alignment for the navigation buttons, options are 'left' or 'right', default is 'right'
	 */
	buttonAlign: 'right',
	
	/**
	 * If to animate the navigation, default is true
	 */
	animate: true,
	
	/**
	 * Extra buttons to add to the default navigation buttons, defaults to null
	 */
	extraBtns: null,
	
	initComponent: function(){
				
		var tBar = [];
		if(this.extraBtns){
			if(this.extraBtns instanceof Array){
				tBar = this.extraBtns;
			}else{
				tBar.push(this.extraBtns);
			}
		}				
		
		this.cards = new Ext.ux.MetaForm({
			loadingText: this.loadingText,
			savingText: this.savingText,
			layout: this.animate ? 'slickcard' : 'card',
			activeItem: this.activeItem || 0,
			region: 'center',			
			frame: false,
			defaults: {
				border:false,
				bodyStyle: 'padding:10px'
			},
			autoInit: this.autoInit != undefined ? this.autoInit : false,
			url: this.url,
			items: this.items
		});
		
		this.cards.onMetaChange = this.onMetaChange;

		Ext.apply(this, {
			layout:'border',
			defaults: {
				border:false
			},
		    items: [
		    	Ext.apply(new Ext.Panel(this.west || {}), {
		    		region: 'west'
		    	}),
		    	Ext.apply(new Ext.Panel(this.north || {}), {
		    		region: 'north'
		    	}),
		    	this.cards
		    ],
		    bbar: tBar
		});
		
		Ext.ux.Wizard.superclass.initComponent.apply(this, arguments);
						
		this.addEvents({
			'start': true,
			'finish': true,
			'beforefinish': true,
			'afternavigate': true,
			'beforenavigate': true					
		});
		
		//setup default listeners
		this.on({
			'beforenavigate': {scope:this, fn:this.onBeforeNavigate},
			'afternavigate': {scope:this, fn:this.onAfterNavigate},
			'beforefinish': {scope:this, fn:this.onBeforeFinish},
			'finish': {scope:this, fn:this.onFinish},
			'start': {scope:this, fn:this.onStart}
		});
		
		this.backBtn = new Ext.Toolbar.Button({
			disabled: true,
			id: 'move-page-back',
			text: this.backBtnText || 'Back',
			handler: this.onNavigate.createDelegate(this, [-1])
		});
		
		this.nextBtn = new Ext.Toolbar.Button({
			disabled: true,
			id: 'move-page-next',
			text: this.nextBtnText || 'Continue',
			handler: this.onNavigate.createDelegate(this, [1])
		});
				
	},
	
	onMetaChange: function(form, meta){
		this.removeAll();
		var pages = meta.pages;
		var doConfig = function(config){
			var oConfig;
			if(config.items){
				var items = config.items;
				if(items instanceof Array){
					Ext.each(items, function(item){
						doConfig(item);							
					});
				}else{
					doConfig(items);				
				}
			}else{		            
	            // handle plugins
	            if(config.plugins){
	            	var plugins = config.plugins;
	            	delete config.plugins;
	            	if(plugins instanceof Array){
	            		config.plugins = [];
	            		Ext.each(plugins, function(plugin){
	            			config.plugins.push( Ext.ComponentMgr.create(plugin) );
	            		});
	            	}else{
	            		config.plugins = Ext.ComponentMgr.create(plugins);
	            	}
	            }
	            
				// handle regexps
	            if(config.regex) {
	                config.regex = new RegExp(config.regex)
	            }
	            
	            // to avoid checkbox misalignment
	            if('checkbox' === config.xtype) {
	                Ext.apply(config, {
	                     boxLabel:' ',
	                     checked: config.defaultValue
	                });
	            }
	            
	            Ext.apply(config, meta.fieldConfig || {});
			}
			return config;
		};
		
		Ext.each(pages, function(page){		
			var oConfig = doConfig(page);			
			Ext.apply(oConfig, meta.formConfig || {});
	        this.add(new Ext.Panel(oConfig));		        			        
	        
		}, this);
		
		var initItem = meta.wizConfig.activeItem || 0;
		this.getLayout().setActiveItem(initItem);
		this.doLayout(true);
		
		// we should have a properly abstracted nav mechanism that can be called from
		// any where like the navigate method, so that we can initialize navigation at 
		// this point (handling of button states, text, and navigation events) and preoceed thereof.
		// without duplicating code
		if((pages instanceof Array) && (pages.length > 1)){
			var wiz = this.ownerCt;
			wiz.nextBtn.enable();
			if(wiz.endBtnText && (this.items.length == 2)){
	        	wiz.nextBtn.setText(wiz.endBtnText);	        	
	        }
		}
	},
	
	getToolbar: function(){
		return this.getBottomToolbar();
	},
	
	onRender: function(){
		Ext.ux.Wizard.superclass.onRender.apply(this, arguments);
				
		var bbar = this.getBottomToolbar();
		var lft = this.buttonAlign == 'left' ? '' : '->';
		var rgt = this.buttonAlign == 'right' ? '' : '->';
		bbar.add(lft, this.backBtn, '', '-', '', this.nextBtn, rgt);
		bbar.doLayout();
		
		this.fireEvent('start', this);
	},
	
	onNavigate: function(dir){
		var activeItem = this.cards.getLayout().activeItem;
		var _self = this;
       	(function(){
       		_self.navigate(dir);
       	}).createInterceptor(function(){
	   		return this.fireEvent('beforenavigate', _self, dir);
	   	}, this)();	
	},
	
	navigate: function(dir){	
		var _self = this;
	   	var layout = this.cards.getLayout();
	   	var currentPage = layout.activeItem;	   	
	   	var cardItems = this.cards.items;		   	       	             
        var pageIndex = currentPage.index;
        
       	if(pageIndex != undefined){       		
       	    var next = parseInt(pageIndex) + dir;	        
	        
	        this.backBtn.setDisabled(next == 0);	        	        
	        if(dir != 1){
	        	// a back navigation was isssued
	        	currentPage = this.moveNext(layout, next);
	        	if(this.nextBtn.disabled){	        		
	        		// executed when a back navigation is initiated after the last page
		        	// is reached, so we turn it back on and reset it's label.
		        	// Only disable it in the finish event handler.	        		
		        	this.nextBtn.enable();
		        	this.nextBtn.setText(this.endBtnText);
	        	}else{
	        		if((this.endBtnText != this.nextBtnText) && (this.nextBtn.getText() == this.endBtnText)){
	        			this.nextBtn.setText(this.nextBtnText);
	        		}
	        	}
	        }else if(this.endBtnText && (next == cardItems.length-2)){
	        	currentPage = this.moveNext(layout, next);
	        	this.nextBtn.setText(this.endBtnText);	        	
	        }else if(next == cardItems.length-1){	        	
		       	(function(){
		       		currentPage = _self.moveNext(layout, next);
		       		_self.fireEvent('finish', _self);       		
		       	}).createInterceptor(function(){
			   		return this.fireEvent('beforefinish', _self, 1);   	
			   	}, this)();
	        }else{
	        	// just move on
	        	currentPage = this.moveNext(layout, next);
	        }
	        
	        this.fireEvent('afternavigate', _self, next);
       }
	},
	
	moveNext: function(layout, dir){
		layout.setActiveItem(dir);
        return layout.activeItem;
	},
	
	/**
	 * Called before a navigation occurs, implementations can return false to stop the navigation,
	 * Same can be achieved by listening for the 'beforenavigate' event.
	 * @param wizard {Ext.ux.Wizard} The wizard object
	 * @param dir {Number} The navigation direction
	 * @return {Boolean} True to proceed with the navigation, false to cancel it
	 */
	onBeforeNavigate: function(wizard, dir){
		return true;
	},
	
	/**
	 * Called after a navigation occurs, implementations can use this to pre-configure the activeItem
	 * Same can be achieved by listening for the 'afternavigate' event.
	 * @param wizard {Ext.ux.Wizard} The wizard object
	 * @param dir {Number} The navigation direction
	 */
	onAfterNavigate: function(wizard, dir){

	},
	
	/**
	 * Called when the last page is reached, Implementations can add more
	 * functionality like closing the panel's container window (if any). The default is 
	 * to disable the 'next' navigation button at this page. 
	 * @param wizard {Ext.ux.Wizard} The wizard object
	 */
	onFinish: function(wizard){
		this.nextBtn.setDisabled(true);
	},
	
	/**
	 * Called immediately after the panel is rendered and is ready to start navigation.
	 * @param wizard {Ext.ux.Wizard} The wizard object  
	 */
	onStart: function(wizard){

	},
	
	/**
	 * Called when the penultimate page is reached, a form implementation can use this
	 * for validation, and submiting of the values, then the finish event can be handled
	 * to display results of the submission if needed. Return false to prevent navigation to
	 * the final page.
	 * @param wizard {Ext.ux.Wizard} The wizard object
	 * @param dir {Number} The navigation direction
	 * @return {Boolean} True to proceed with the navigation, false to cancel it
	 */
	onBeforeFinish: function(wizard, dir){
		return true;	
	}
});

Ext.reg('wizard', Ext.ux.Wizard);
