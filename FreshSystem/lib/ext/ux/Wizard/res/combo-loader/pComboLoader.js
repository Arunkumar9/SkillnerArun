Ext.namespace('Ext.ux.plugin');
/**
 * @class Ext.ux.plugin.ComboLoader
 * @extends Ext.form.ComboBox
 * A utility that lets you load data into other combo(s) asynchronously, with cacheing
 * @constructor
 * Create a new ComboLoader plugin.
 * @param {Object} config Configuration options
 * @author Charles Opute Odili
 * @version 0.1
 */
 
 Ext.ux.plugin.ComboLoader = function(config){
 	Ext.apply(this, config);
 }
 
 Ext.extend(Ext.ux.plugin.ComboLoader, Ext.util.Observable, {
 	/**
 	 * @cfg {String} url
 	 * The Request URL
 	 */
 	url: null,
 	
 	/**
 	 * @cfg {Object} baseParams
 	 * Optional Request parameters to pass with every selection request 
 	 */
 	baseParams: null,
 	
 	/**
 	 * @cfg {String} method
 	 * The request method to use, defaults to POST
 	 */
 	method: 'POST',
 	
 	/**
 	 * @cfg {Function} failure
 	 * A callback action on request failure
 	 */
 	failure: null,
 	
 	/**
 	 * @cfg {Boolean} useCache
 	 * Weather or not to cache responses, defaults to true
 	 */
 	useCache: true,
 	
 	/**
 	 * @cfg {Object / Array} target
 	 * Configure combo(s) to be populated from selections on this combo.
 	 * Value(s) should be the id of the target combos
 	 */
 	target: null,
 	
 	init: function(combo){
 		this.combo = combo;
 		this.responseCache = [];
 		this.targetComps = [];
 		
 		if(this.target){
 			if(this.target instanceof Array){
 				Ext.each(this.target, function(item){
	 				this.disableTarget(item);
	 			}, this);
 			}else{
 				this.disableTarget(this.target);
 			}
 		}else{
 			throw 'target not specified in combo loader plugin for ' + this.combo;
 		} 
 		this.combo.on('select', this.onLoad, this);
 	},
 	
 	disableTarget: function(el){
 		var comp = null;
 		var task = new Ext.util.DelayedTask();
 		var action = function(){
 			if(comp && comp.disabled){
 				task.cancel();
 				return;
 			}else{
 				comp = Ext.getCmp(el);
 				if(comp){
 					this.targetComps.push(comp);
 					comp.disable();
 				}else{
	 				task.delay('1000', action, task);
 				}	 				
 			}
 		}; 		
 		task.delay('1000', action, this);
 	},
 	 	
 	onLoad: function(combo, record, index){
 		var _self = this;
 		var queryValue = record.data[combo.valueField];
 		var queryText = record.data[combo.displayField];
 		
 		// see if we have it cached
 		if(_self.responseCache[queryValue]){
 			var data = _self.responseCache[queryValue];
 			_self.afterLoad.call(_self, data);
 			
 		}else{ 			
 			Ext.Ajax.request({
	 			url: this.url,
	 			method: this.method || 'POST',
	 			params: Ext.apply({value:queryValue, text:queryText}, _self.baseParams),
	 			success: function(o){
	 				var resp = Ext.decode(o.responseText);
	 				_self.afterLoad.call(_self, resp, queryValue);
	 			},
	 			failure: function(o){
	 				if(_self.failure){
	 					_self.failure(o);
	 				}else{
	 					Ext.Msg.alert('Message', 'Load Failure !');
	 				}
	 			}
	 		});
 		}	 		
 	},
 	
 	afterLoad: function(data, cacheKey){
 		Ext.each(this.targetComps, function(targetCombo){
 			if(targetCombo.disabled){
	 			targetCombo.enable();
	 		}
	 		targetCombo.clearValue();
	 		targetCombo.store.removeAll();
	 		targetCombo.store.loadData( data );
	 					
	 		//cache it
	 		if(this.useCache && cacheKey){
	 			this.responseCache[cacheKey] = data;
	 		}
 		}, this);
 	}
 	
 });
 
 Ext.reg('comboloader', Ext.ux.plugin.ComboLoader);