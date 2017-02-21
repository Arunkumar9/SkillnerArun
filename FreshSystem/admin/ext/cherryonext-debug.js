/*
 * Cherry On Ext
 * Copyright(c) 2008, Netbox Team, RowFitLayout is from Kirill Hryapin, Select is from Andrei Neculau, DateTimeField is from Jozef Sakalos.
 * This is free software; you can redistribute it and/or modify it
 * under the terms of the GNU Lesser General Public License as
 * published by the Free Software Foundation version 3.0 of
 * the License, or (at your option) any later version.
 * 
 * This software is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more details.
 * 
 * You should have received a copy of the GNU Lesser General Public
 * License along with this software; if not, write to the Free
 * Software Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA
 * 02110-1301 USA, or see the FSF site: http://www.fsf.org.
 */

Ext.namespace('Ext.ux.layout');



Ext.ux.layout.RowFitLayout = Ext.extend(Ext.layout.ContainerLayout, {
  
  monitorResize: true,

  
  trackChildEvents: ['collapse', 'expand', 'hide', 'show'],

  
  renderAll: function(ct, target) {
    Ext.ux.layout.RowFitLayout.superclass.renderAll.apply(this, arguments);
    
    ct.on('add', this.containerListener);
    ct.on('remove', this.containerListener);
  },

  
  renderItem: function(c, position, target) {
    Ext.ux.layout.RowFitLayout.superclass.renderItem.apply(this, arguments);

    
    for (var i=0, n = this.trackChildEvents.length; i < n; i++) {
      c.on(this.trackChildEvents[i], this.itemListener);
    }
    c.animCollapse = false; 

    
    c.rowFit = {
      hasAbsHeight: false, 
      relHeight: 0, 
      calcRelHeight: 0, 
      calcAbsHeight: 0 
    };

    
    if (c.height) {
      
      if (typeof c.height == "string" && c.height.indexOf("%")) {
        c.rowFit.relHeight = parseInt(c.height);
      }
      else { 
        c.setHeight(c.height);
        c.rowFit.hasAbsHeight = true;
      }
    }
  },

  
  onLayout: function(ct, target) {
    Ext.ux.layout.RowFitLayout.superclass.onLayout.call(this, ct, target);

    if (this.container.collapsed || !ct.items || !ct.items.length) { return; }

    
    
    var absHeightSum = 0, 
        relHeightSum = 0, 
        relHeightRatio = 1, 
        relHeightElements = [], 
        noHeightCount = 0; 

    for (var i=0, n = ct.items.length; i < n; i++) {
      var c = ct.items.itemAt(i);

      if (!c.isVisible()) { continue; }

      
      if (c.collapsed) { absHeightSum += c.getFrameHeight(); }
      
      else if (c.rowFit.hasAbsHeight) {
        absHeightSum += c.height;
      }
      
      else {
        if (!c.rowFit.relHeight) { noHeightCount++; } 
        else { relHeightSum += c.rowFit.relHeight; }
        relHeightElements.push(c);
      }
    }

    
    
    if (noHeightCount == 0 && relHeightSum != 100) {
      relHeightRatio = 100 / relHeightSum;
    }

    var freeHeight = target.getStyleSize().height - absHeightSum, 
        absHeightLeft = freeHeight; 

    while (relHeightElements.length) {
      var c = relHeightElements.shift(), 
          relH = c.rowFit.relHeight * relHeightRatio, 
          absH = 0; 

      
      if (!relH) {
        relH = (100 - relHeightSum) / noHeightCount;
      }

      
      if (!relHeightElements.length) { absH = absHeightLeft; }
      else { absH = Math.round(freeHeight * relH / 100); }

      
      if (absH < 0) { absH = 0; }

      c.rowFit.calcAbsHeight = absH;
      c.rowFit.calcRelHeight = relH;

      c.setHeight(absH);
      absHeightLeft -= absH;
    }

  },


  
  itemListener: function(item) {
    item.ownerCt.doLayout();
  },


  
  containerListener: function(ct) {
    ct.doLayout();
  }

});


if (Ext.SplitBar.BasicLayoutAdapter) {

  
  Ext.ux.layout.RowFitLayout.SplitAdapter = function(splitbar) {
    if (splitbar && splitbar.el.dom.nextSibling) {
      var next = Ext.getCmp( splitbar.el.dom.nextSibling.id ),
          resized = Ext.getCmp(splitbar.resizingEl.id);

      if (next) {
        splitbar.maxSize = (resized.height || resized.rowFit.calcAbsHeight) +
                           next.getInnerHeight() - 1; 
      }
      splitbar.minSize = resized.getFrameHeight() + 1;
    }
  }

  Ext.extend(Ext.ux.layout.RowFitLayout.SplitAdapter, Ext.SplitBar.BasicLayoutAdapter, {

    setElementSize: function(splitbar, newSize, onComplete) {
      var resized = Ext.getCmp(splitbar.resizingEl.id);

      
      if (!resized || resized.collapsed || !resized.isVisible()) return;

      
      if (resized.rowFit.hasAbsHeight) {
        resized.setHeight(newSize);
      }
      
      else {
        if (splitbar.el.dom.nextSibling) {
          var nextSibling = Ext.getCmp( splitbar.el.dom.nextSibling.id ),
              deltaAbsHeight = newSize - resized.rowFit.calcAbsHeight, 
              nsRf = nextSibling.rowFit, 
              rzRf = resized.rowFit,
              
              pctPxRatio = rzRf.calcRelHeight / rzRf.calcAbsHeight,
              deltaRelHeight = pctPxRatio * deltaAbsHeight; 

          rzRf.relHeight = rzRf.calcRelHeight + deltaRelHeight;

          if (nsRf.hasAbsHeight) {
            var newHeight = nextSibling.height - deltaAbsHeight;
            nextSibling.height = newHeight;
            nextSibling.setHeight(newHeight);
          }
          else {
            nsRf.relHeight = nsRf.calcRelHeight - deltaRelHeight;
          }
        }
      }
      
      resized.ownerCt.doLayout();
    } 

  }); 
}

Ext.Container.LAYOUTS['row-fit'] = Ext.ux.layout.RowFitLayout;  

Ext.apply(Ext.DataView.prototype, {
	deselect:function(node, suppressEvent){
    if(this.isSelected(node)){
			var node = this.getNode(node);
			this.selected.removeElement(node);
			if(this.last == node.viewIndex){
				this.last = false;
			}
			Ext.fly(node).removeClass(this.selectedClass);
			if(!suppressEvent){
				this.fireEvent('selectionchange', this, this.selected.elements);
			}
		}
	}
});

Ext.namespace('Ext.ux.Andrie');


Ext.ux.Andrie.Select = function(config){
	if (config.transform && typeof config.multiSelect == 'undefined'){
		var o = Ext.getDom(config.transform);
		config.multiSelect = (Ext.isIE ? o.getAttributeNode('multiple').specified : o.hasAttribute('multiple'));
	}
	config.hideTrigger2 = config.hideTrigger2||config.hideTrigger;
        Fresh.console.log(config.store);
        if ('string' == typeof config.store) {

            var store = Ext.StoreMgr.lookup(config.store);
            if (!store)
                store =  new Fresh.data.ViewProvider({
                    id: config.store
                })
            config.store = store;
        }

        if (!config.store)
            Fresh.console.log("Store in "+this.id+" undefined");

        Ext.ux.Andrie.Select.superclass.constructor.call(this, config);
}

Ext.extend(Ext.ux.Andrie.Select, Ext.form.ComboBox, {
	
	multiSelect:false,
	
	minLength:0,
	
	minLengthText:'Minimum {0} items required',
	
	maxLength:Number.MAX_VALUE,
	
	maxLengthText:'Maximum {0} items allowed',
	
	clearTrigger:true,
	
	history:false,
	
	historyMaxLength:0,
	
	separator:',',
	
	displaySeparator:',',
	
	
	valueArray:[],
	
	
	rawValueArray:[],
	
	initComponent:function(){
		
		this.triggerConfig = {
			tag:'span', cls:'x-form-twin-triggers', cn:[
				{tag: "img", src: Ext.BLANK_IMAGE_URL, cls: "x-form-trigger " + this.trigger1Class},
				{tag: "img", src: Ext.BLANK_IMAGE_URL, cls: "x-form-trigger " + this.trigger2Class}
			]
		};
		
		Ext.ux.Andrie.Select.superclass.initComponent.call(this);
		if (this.multiSelect){
			this.typeAhead = false;
			this.editable = false;
			
			this.triggerAction = 'all';
			this.selectOnFocus = false;
		}
		if (this.history){
			this.forceSelection = false;
		}
		if (this.value){
			this.setValue(this.value);
		}
	},
	
	hideTrigger1:true,
	
	getTrigger:Ext.form.TwinTriggerField.prototype.getTrigger,
	
	initTrigger:Ext.form.TwinTriggerField.prototype.initTrigger,
	
	trigger1Class:'x-form-clear-trigger',
	trigger2Class:'x-form-arrow-trigger',
	
	onTrigger2Click:function(){
		this.onTriggerClick();
	},
	
	onTrigger1Click:function(){
		this.clearValue();
	},
	
	initList:function(){
		if(!this.list){
			var cls = 'x-combo-list';

			this.list = new Ext.Layer({
				shadow: this.shadow, cls: [cls, this.listClass].join(' '), constrain:false
			});

			var lw = this.listWidth || Math.max(this.wrap.getWidth(), this.minListWidth);
			this.list.setWidth(lw);
			this.list.swallowEvent('mousewheel');
			this.assetHeight = 0;

			if(this.title){
				this.header = this.list.createChild({cls:cls+'-hd', html: this.title});
				this.assetHeight += this.header.getHeight();
			}

			this.innerList = this.list.createChild({cls:cls+'-inner'});
						this.innerList.on('mouseover', this.onViewOver, this);
			this.innerList.on('mousemove', this.onViewMove, this);
			this.innerList.setWidth(lw - this.list.getFrameWidth('lr'))

			if(this.pageSize){
				this.footer = this.list.createChild({cls:cls+'-ft'});
				this.pageTb = new Ext.PagingToolbar({
					store:this.store,
					pageSize: this.pageSize,
					renderTo:this.footer
				});
				this.assetHeight += this.footer.getHeight();
			}

			if(!this.tpl){
				this.tpl = '<tpl for="."><div class="'+cls+'-item">{' + this.displayField + '}</div></tpl>';
			}

			
			this.view = new Ext.DataView({
				applyTo: this.innerList,
				tpl: this.tpl,
				singleSelect: true,
								
				
				multiSelect: this.multiSelect,
				simpleSelect: true,
				overClass:cls + '-cursor',
				
								
				selectedClass: this.selectedClass,
				itemSelector: this.itemSelector || '.' + cls + '-item'
			});

			this.view.on('click', this.onViewClick, this);
			
			this.view.on('beforeClick', this.onViewBeforeClick, this);
			

			this.bindStore(this.store, true);
						
			
			if (this.valueArray.length){
				this.selectByValue(this.valueArray);
			}
			

			if(this.resizable){
				this.resizer = new Ext.Resizable(this.list,  {
				   pinned:true, handles:'se'
				});
				this.resizer.on('resize', function(r, w, h){
					this.maxHeight = h-this.handleHeight-this.list.getFrameWidth('tb')-this.assetHeight;
					this.listWidth = w;
					this.innerList.setWidth(w - this.list.getFrameWidth('lr'));
					this.restrictHeight();
				}, this);
				this[this.pageSize?'footer':'innerList'].setStyle('margin-bottom', this.handleHeight+'px');
			}
		}
	},
	
	
	initEvents:function(){
		Ext.form.ComboBox.superclass.initEvents.call(this);

		this.keyNav = new Ext.KeyNav(this.el, {
			"up" : function(e){
				this.inKeyMode = true;
				this.hoverPrev();
			},

			"down" : function(e){
				if(!this.isExpanded()){
					this.onTriggerClick();
				}else{
					this.inKeyMode = true;
					this.hoverNext();
				}
			},

			"enter" : function(e){
				if (this.isExpanded()){
					this.inKeyMode = true;
					var hoveredIndex = this.view.indexOf(this.view.lastItem);
					this.onViewBeforeClick(this.view, hoveredIndex, this.view.getNode(hoveredIndex), e);
					this.onViewClick(this.view, hoveredIndex, this.view.getNode(hoveredIndex), e);
				}else{
					this.onSingleBlur();
				}
				return true;
			},

			"esc" : function(e){
				this.collapse();
			},

			"tab" : function(e){
				this.collapse();
				return true;
			},
			
			"home" : function(e){
				this.hoverFirst();
				return false;
			},
			
			"end" : function(e){
				this.hoverLast();
				return false;
			},

			scope : this,

			doRelay : function(foo, bar, hname){
				if(hname == 'down' || this.scope.isExpanded()){
				   return Ext.KeyNav.prototype.doRelay.apply(this, arguments);
				}
				
				if(hname == 'enter' || this.scope.isExpanded()){
				   return Ext.KeyNav.prototype.doRelay.apply(this, arguments);
				}
				
				return true;
			},

			forceKeyDown: true
		});
		this.queryDelay = Math.max(this.queryDelay || 10,
				this.mode == 'local' ? 10 : 250);
		this.dqTask = new Ext.util.DelayedTask(this.initQuery, this);
		if(this.typeAhead){
			this.taTask = new Ext.util.DelayedTask(this.onTypeAhead, this);
		}
		if(this.editable !== false){
			this.el.on("keyup", this.onKeyUp, this);
		}
		
		if(!this.multiSelect){
			if(this.forceSelection){
				this.on('blur', this.doForce, this);
			}
			this.on('focus', this.onSingleFocus, this);
			this.on('blur', this.onSingleBlur, this);
		}
		this.on('change', this.onChange, this);
		
	},

	
	doForce:function(){
		if(this.el.dom.value.length > 0){
			if (this.el.dom.value == this.emptyText){
				this.clearValue();
			}
			else if (!this.multiSelect){
				this.el.dom.value =
					this.lastSelectionText === undefined?'':this.lastSelectionText;
				this.applyEmptyText();
			}
		}
	},
	
	
	
	
	onLoad:function(){
		if(!this.hasFocus){
			return;
		}
		if(this.store.getCount() > 0){
			this.expand();
			this.restrictHeight();
			if(this.lastQuery == this.allQuery){
				if(this.editable){
					this.el.dom.select();
				}
				
				this.selectByValue(this.value, true);
				
				
			}else{
				this.selectNext();
				if(this.typeAhead && this.lastKey != Ext.EventObject.BACKSPACE && this.lastKey != Ext.EventObject.DELETE){
					this.taTask.delay(this.typeAheadDelay);
				}
			}
		}else{
			this.onEmptyResults();
		}
		
	},

	
	onSelect:function(record, index){
		if(this.fireEvent('beforeselect', this, record, index) !== false){
			this.addValue(record.data[this.valueField || this.displayField]);
			this.fireEvent('select', this, record, index);
			if (!this.multiSelect){
				this.collapse();
			}
		}
	},
	
	
	onSingleFocus:function(){
		this.oldValue = this.getRawValue();
	},
	
	
	onSingleBlur:function(){
		var r = this.findRecord(this.displayField, this.getRawValue());
		if (r){
			this.select(this.store.indexOf(r));
			return;
		}
		if (String(this.oldValue) != String(this.getRawValue())){
			this.setValue(this.getRawValue());
			this.fireEvent('change', this, this.oldValue, this.getRawValue());
		}
		this.oldValue = String(this.getRawValue());
	},
	
	
	onChange:function(){
		if (!this.clearTrigger){
			return;
		}
		if (this.getValue() != ''){
			this.triggers[0].show();
		}else{
			this.triggers[0].hide();
		}
	},



	
	collapse:function(){
		this.hoverOut();
		Ext.ux.Andrie.Select.superclass.collapse.call(this);
	},

	expand:function(){
		Ext.ux.Andrie.Select.superclass.expand.call(this);
		
	},
	
	
	onViewOver:function(e, t){
		if(this.inKeyMode){ 
			return;
		}
		
		
		
	},
	
	
	onViewBeforeClick:function(vw, index, node, e){
		this.preClickSelections = this.view.getSelectedIndexes();
	},
	
	
	onViewClick:function(vw, index, node, e){
		if (typeof index != 'undefined'){
			var arrayIndex = this.preClickSelections.indexOf(index);
			if (arrayIndex != -1 && this.multiSelect){
				this.removeValue(this.store.getAt(index).data[this.valueField || this.displayField]);
				if (this.inKeyMode){
					this.view.deselect(index, true);
				}
				this.hover(index, true);
			}else{
				var r = this.store.getAt(index);
				if (r){
					if (this.inKeyMode){
						this.view.select(index, true);
					}
					this.onSelect(r, index);
					this.hover(index, true);
				}
			}
		}
			
		
		if(vw !== false){
			this.el.focus();
		}
	},

	
	
	
	
	addValue:function(v){
		if (!this.multiSelect){
			this.setValue(v);
			return;
		}
		if (v instanceof Array){
			v = v[0];
		}
		v = String(v);
		if (this.valueArray.indexOf(v) == -1){
			var text = v;
			var r = this.findRecord(this.valueField || this.displayField, v);
			if(r){
				text = r.data[this.displayField];
				if (this.view){
					this.select(this.store.indexOf(r));
				}
			}else if(this.forceSelection){
				return;
			}
			var result = Ext.apply([], this.valueArray);
			result.push(v);
			var resultRaw = Ext.apply([], this.rawValueArray);
			resultRaw.push(text);
			v = result.join(this.separator || ',');
			text = resultRaw.join(this.displaySeparator || this.separator || ',');
			this.commonChangeValue(v, text, result, resultRaw);
		}
	},
	
	
	removeValue:function(v){
		if (v instanceof Array){
			v = v[0];
		}
		v = String(v);
		if (this.valueArray.indexOf(v) != -1){
			var text = v;
			var r = this.findRecord(this.valueField || this.displayField, v);
			if(r){
				text = r.data[this.displayField];
				if (this.view){
					this.deselect(this.store.indexOf(r));
				}
			}else if(this.forceSelection){
				return;
			}
			var result = Ext.apply([], this.valueArray);
			result.remove(v);
			var resultRaw = Ext.apply([], this.rawValueArray);
			resultRaw.remove(text);
			v = result.join(this.separator || ',');
			text = resultRaw.join(this.displaySeparator || this.separator || ',');
			this.commonChangeValue(v, text, result, resultRaw);
		}
	},
	
	
	setValue:function(v){
		var result = [],
				resultRaw = [];
		if (v!==null){
    		if (!(v instanceof Array)){
    			if (this.separator && this.separator !== true){
    				v = v.split(String(this.separator));
    			}else{
    				v = [v];
    			}
    		}
    		else if (!this.multiSelect){
    			v = v.slice(0,1);
    		}

    		for (var i=0, len=v.length; i<len; i++){
    			var value = v[i];
    			var text = null;
    			if(this.valueField){
    				var r = this.findRecord(this.valueField || this.displayField, value);
    				if(r){
    					text = r.data[this.displayField];
    				}else if(this.forceSelection){
    					continue;
    				}
    			}
    			result.push(value);
    			resultRaw.push(text);
    		}
    }
		v = result.join(this.separator || ',');
		text = resultRaw.join(this.displaySeparator || this.separator || ',');
		
		this.commonChangeValue(v, text, result, resultRaw);
		
		if (this.history && !this.multiSelect && this.mode == 'local'){
			this.addHistory(this.valueField?this.getValue():this.getRawValue());
		}
		if (this.view){
			this.view.clearSelections();
			this.selectByValue(this.valueArray);
		}
	},
	
	
	commonChangeValue:function(v, text, result, resultRaw){
		this.lastSelectionText = text;
		this.valueArray = result;
		this.rawValueArray = resultRaw;
		if(this.hiddenField){
			this.hiddenField.value = v;
		}
		Ext.form.ComboBox.superclass.setValue.call(this, text);
		this.value = v;
		
		if (this.oldValueArray != this.valueArray){
			this.fireEvent('change', this, this.oldValueArray, this.valueArray);
		}
		this.oldValueArray = Ext.apply([], this.valueArray);
	},

	validateValue:function(value){
		if(!Ext.ux.Andrie.Select.superclass.validateValue.call(this, value)){
			return false;
		}
		if (this.valueArray.length < this.minLength){
			this.markInvalid(String.format(this.minLengthText, this.minLength));
			return false;
		}
		if (this.valueArray.length > this.maxLength){
			this.markInvalid(String.format(this.maxLengthText, this.maxLength));
			return false;
		}
		return true;
	},
	
	clearValue:function(){
		this.commonChangeValue('', '', [], []);
		if (this.view){
			this.view.clearSelections();
		}
		Ext.ux.Andrie.Select.superclass.clearValue.call(this);
	},
	
	reset:function(){
		if (this.view){
			this.view.clearSelections();
		}
		Ext.ux.Andrie.Select.superclass.reset.call(this);
	},

	getValue : function(asArray){
		if (asArray){
			return typeof this.valueArray != 'undefined' ? this.valueArray : [];
		}
		return Ext.ux.Andrie.Select.superclass.getValue.call(this);
	},
	
	getRawValue:function(asArray){
		if (asArray){
			return typeof this.rawValueArray != 'undefined' ? this.rawValueArray : [];
		}
		return Ext.ux.Andrie.Select.superclass.getRawValue.call(this);
	},
	
	
	
	
	select:function(index, scrollIntoView){
		this.selectedIndex = index;
		if (!this.view){
			return;
		}
		this.view.select(index, this.multiSelect);
		if(scrollIntoView !== false){
			var el = this.view.getNode(index);
			if(el){
				this.innerList.scrollChildIntoView(el, false);
			}
		}
	},
	
	deselect:function(index, scrollIntoView){
		this.selectedIndex = index;
		this.view.deselect(index, this.multiSelect);
		if(scrollIntoView !== false){
			var el = this.view.getNode(index);
			if(el){
				this.innerList.scrollChildIntoView(el, false);
			}
		}
	},
	
	selectByValue:function(v, scrollIntoView){
		this.hoverOut();
		if(v !== undefined && v !== null){
			if (!(v instanceof Array)){
				v = [v];
			}
			var result = [];
			for (var i=0, len=v.length; i<len; i++){
				var value = v[i];
				var r = this.findRecord(this.valueField || this.displayField, value);
				if(r){
					this.select(this.store.indexOf(r), scrollIntoView);
					result.push(value);
				}
			}
			return result.join(',');
		}
		return false;
	},
	
	
	selectFirst:function(){
		var ct = this.store.getCount();
		if(ct > 0){
			this.select(0);
		}
	},
	
	
	selectLast:function(){
		var ct = this.store.getCount();
		if(ct > 0){
			this.select(ct);
		}
	},
	
	
	
	
	
	hover:function(index, scrollIntoView){
		if (!this.view){
			return;
		}
		this.hoverOut();
		var node = this.view.getNode(index);
		this.view.lastItem = node;
		Ext.fly(node).addClass(this.view.overClass);
		if(scrollIntoView !== false){
			var el = this.view.getNode(index);
			if(el){
				this.innerList.scrollChildIntoView(el, false);
			}
		}
	},
	
	hoverOut:function(){
		if (!this.view){
			return;
		}
		if (this.view.lastItem){
			Ext.fly(this.view.lastItem).removeClass(this.view.overClass);
			delete this.view.lastItem;
		}
	},

	
	hoverNext:function(){
		if (!this.view){
			return;
		}
		var ct = this.store.getCount();
		if(ct > 0){
			if(!this.view.lastItem){
				this.hover(0);
			}else{
				var hoveredIndex = this.view.indexOf(this.view.lastItem);
				if(hoveredIndex < ct-1){
					this.hover(hoveredIndex+1);
				}
			}
		}
	},

	
	hoverPrev:function(){
		if (!this.view){
			return;
		}
		var ct = this.store.getCount();
		if(ct > 0){
			if(!this.view.lastItem){
				this.hover(0);
			}else{
				var hoveredIndex = this.view.indexOf(this.view.lastItem);
				if(hoveredIndex != 0){
					this.hover(hoveredIndex-1);
				}
			}
		}
	},
	
	
	hoverFirst:function(){
		var ct = this.store.getCount();
		if(ct > 0){
			this.hover(0);
		}
	},
	
	
	hoverLast:function(){
		var ct = this.store.getCount();
		if(ct > 0){
			this.hover(ct);
		}
	},
	
	
	
	
	
	addHistory:function(value){
		if (!value.length){
			return;
		}
		var r = this.findRecord(this.valueField || this.displayField, value);
		if (r){
			this.store.remove(r);
		}else{
			
			
			var o = {};
			if (this.valueField){
				o[this.valueField] = value;
			}
			o[this.displayField] = value;
			r = new this.store.reader.recordType(o);
		}
		this.store.clearFilter();
		this.store.insert(0, r);
		this.pruneHistory();
	},
	
	
	pruneHistory:function(){
		if (this.historyMaxLength == 0){
			return;
		}
		if (this.store.getCount()>this.historyMaxLength){
			var overflow = this.store.getRange(this.historyMaxLength, this.store.getCount());
			for (var i=0, len=overflow.length; i<len; i++){
				this.store.remove(overflow[i]);
			}
		}
	}
});
Ext.reg('select', Ext.ux.Andrie.Select);


Ext.ns('Ext.ux.form');


Ext.ux.form.DateTime = Ext.extend(Ext.form.Field, {
    
     defaultAutoCreate:{tag:'input', type:'hidden'}
    
    ,timeWidth:100
    
    ,dtSeparator:' '
    
    ,hiddenFormat:'Y-m-d H:i:s'
    
    ,otherToNow:true
    
    ,timePosition:'right' 
    
    ,dateFormat:'m/d/y'
    
    ,timeFormat:'g:i A'
    
    

    
    
    ,initComponent:function() {
        
        Ext.ux.form.DateTime.superclass.initComponent.call(this);
        this.validationTask = new Ext.util.DelayedTask(this.validate, this);
        
        var dateConfig = Ext.apply({}, {
             id:this.id + '-date'
            ,format:this.dateFormat || Ext.form.DateField.prototype.format
            ,width:this.timeWidth
            ,selectOnFocus:this.selectOnFocus
            ,validationEvent: false
            ,listeners:{
                  blur:{scope:this, fn:this.onBlur}
                 ,focus:{scope:this, fn:this.onFocus}
            }
        }, this.dateConfig);
        this.df = new Ext.form.DateField(dateConfig);
        delete(this.dateFormat);

        
        var timeConfig = Ext.apply({}, {
             id:this.id + '-time'
            ,format:this.timeFormat || Ext.form.TimeField.prototype.format
            ,width:this.timeWidth
            ,selectOnFocus:this.selectOnFocus
            ,validationEvent: false
            ,listeners:{
                  blur:{scope:this, fn:this.onBlur}
                 ,focus:{scope:this, fn:this.onFocus}
            }
        }, this.timeConfig);
        this.tf = new Ext.form.TimeField(timeConfig);
        delete(this.timeFormat);

        
        this.relayEvents(this.df, ['focus', 'specialkey', 'invalid', 'valid']);
        this.relayEvents(this.tf, ['focus', 'specialkey', 'invalid', 'valid']);

    } 
    
    
    
    ,filterValidation: function(e){
        if(!e.isNavKeyPress()){
            this.validationTask.delay(this.validationDelay);
        }
    }

    
    ,onRender:function(ct, position) {
        
        if(this.isRendered) {
            return;
        }

        
        Ext.ux.form.DateTime.superclass.onRender.call(this, ct, position);

        
        
        var t;
        if('bellow' === this.timePosition) {
            t = Ext.DomHelper.append(ct, {tag:'table',style:'border-collapse:collapse',children:[
                 {tag:'tr',children:[{tag:'td', style:'padding-bottom:1px', cls:'ux-datetime-date'}]}
                ,{tag:'tr',children:[{tag:'td', cls:'ux-datetime-time'}]}
            ]}, true);
        }
        else {
            t = Ext.DomHelper.append(ct, {tag:'table',style:'border-collapse:collapse',children:[
                {tag:'tr',children:[
                    {tag:'td',style:'padding-right:4px', cls:'ux-datetime-date'},{tag:'td', cls:'ux-datetime-time'}
                ]}
            ]}, true);
        }

        this.tableEl = t;
        this.wrap = t.wrap({cls:'x-form-field-wrap'});
        this.wrap.on("mousedown", this.onMouseDown, this, {delay:10});

        
        this.df.render(t.child('td.ux-datetime-date'));
        this.tf.render(t.child('td.ux-datetime-time'));
        this.df.getEl().on("keyup",this.filterValidation,this);
        this.tf.getEl().on("keyup",this.filterValidation,this);

        
        if(Ext.isIE && Ext.isStrict) {
            t.select('input').applyStyles({top:0});
        }

        this.on('specialkey', this.onSpecialKey, this);
        this.df.el.swallowEvent(['keydown', 'keypress']);
        this.tf.el.swallowEvent(['keydown', 'keypress']);

        
        if('side' === this.msgTarget) {
            var elp = this.el.findParent('.x-form-element', 10, true);
            this.errorIcon = elp.createChild({cls:'x-form-invalid-icon'});

            this.df.errorIcon = this.errorIcon;
            this.tf.errorIcon = this.errorIcon;
        }

        
        this.isRendered = true;
        this.validate();
    } 
    
    
    
    ,adjustSize:Ext.BoxComponent.prototype.adjustSize
    
    
    
    ,alignErrorIcon:function() {
        this.errorIcon.alignTo(this.tableEl, 'tl-tr', [2, 0]);
    }
    
    
    
    ,initDateValue:function() {
        this.dateValue = this.otherToNow ? new Date() : new Date(1970, 0, 1, 0, 0, 0);
    }
    
    ,initTimeValue:function() {
        this.timeValue = this.otherToNow ? new Date() : new Date(1970, 0, 1, 0, 0, 0);
    }
    
    
    
    ,disable:function() {
        if(this.isRendered) {
            this.df.disabled = this.disabled;
            this.df.onDisable();
            this.tf.onDisable();
        }
        this.disabled = true;
        this.df.disabled = true;
        this.tf.disabled = true;
        this.fireEvent("disable", this);
        return this;
    } 
    
    
    
    ,enable:function() {
        if(this.rendered){
            this.df.onEnable();
            this.tf.onEnable();
        }
        this.disabled = false;
        this.df.disabled = false;
        this.tf.disabled = false;
        this.fireEvent("enable", this);
        return this;
    } 
    
    
    
    ,focus:function() {
        this.df.focus();
    } 
    
    
    
    ,getPositionEl:function() {
        return this.wrap;
    }
    
    
    
    ,getResizeEl:function() {
        return this.wrap;
    }
    
    
    
    ,getValue:function() {
      return(this.getDateTime());
    } 
    
    
    
    ,isValid:function() {
        return this.df.isValid() && this.tf.isValid();
    } 
    
    
    
    ,isVisible : function(){
        return this.df.rendered && this.df.getActionEl().isVisible();
    } 
    
    
    
    ,onBlur:function(f) {
        

        
        if(this.wrapClick) {
            f.focus();
            this.wrapClick = false;
        }

        
        if(f === this.df) {
            this.updateDate();
        }
        else {
            this.updateTime();
        }
        this.updateHidden();

        
        (function() {
            if(!this.df.hasFocus && !this.tf.hasFocus) {
                var v = this.getValue();
                if(String(v) !== String(this.startValue)) {
                    this.fireEvent("change", this, v, this.startValue);
                }
                this.hasFocus = false;
                this.fireEvent('blur', this);
            }
        }).defer(100, this);

    } 
    
    
    
    ,onFocus:function() {
        if(!this.hasFocus){
            this.hasFocus = true;
            this.startValue = this.getValue();
            this.fireEvent("focus", this);
        }
    }
    
    
    
    ,onMouseDown:function(e) {
        this.wrapClick = 'td' === e.target.nodeName.toLowerCase();
    }
    
    
    
    ,onSpecialKey:function(t, e) {
        var key = e.getKey();
        if(key == e.TAB) {
            if(t === this.df && !e.shiftKey) {
                e.stopEvent();
                this.tf.focus();
            }
            if(t === this.tf && e.shiftKey) {
                e.stopEvent();
                this.df.focus();
            }
        }
        
        if(key == e.ENTER) {
            this.updateValue();
        }

    } 
    
    
    
    ,setDate:function(date) {
        this.df.setValue(date);
    } 
    
    
    
    ,setTime:function(date) {
        this.tf.setValue(date);
    } 
    
    
    
    ,setSize:function(w, h) {
        if(!w) {
            return;
        }
        if('bellow' == this.timePosition) {
            this.df.setSize(w, h);
            this.tf.setSize(w, h);
            if(Ext.isIE) {
                this.df.el.up('td').setWidth(w);
                this.tf.el.up('td').setWidth(w);
            }
        }
        else {
            this.df.setSize(w - this.timeWidth - 4, h);
            this.tf.setSize(this.timeWidth, h);

            if(Ext.isIE) {
                this.df.el.up('td').setWidth(w - this.timeWidth - 4);
                this.tf.el.up('td').setWidth(this.timeWidth);
            }
        }
    } 
    
    
    
    ,setValue:function(val) {
        if(!val && true === this.emptyToNow) {
            this.setValue(new Date());
            return;
        }
        else if(!val) {
            this.setDate('');
            this.setTime('');
            this.updateValue();
            if(this.rendered){
              this.validate()
            } 
            return;
        }
        val = val ? val : new Date(1970, 0 ,1, 0, 0, 0);
        var da, time;
        if(val instanceof Date) {
            this.setDate(val);
            this.setTime(val);
            this.dateValue=new Date(val);
            this.timeValue=new Date(val);
        }
        else {
            da = val.split(this.dtSeparator);
            this.setDate(da[0]);
            if(da[1]) {
                this.setTime(da[1]);
            }
        }
        this.updateValue();
        if(this.rendered){
          this.validate()
        }

    } 
    
    
    
    ,setVisible: function(visible){
        if(visible) {
            this.df.show();
            this.tf.show();
        }else{
            this.df.hide();
            this.tf.hide();
        }
        return this;
    } 
    
    
    ,show:function() {
        return this.setVisible(true);
    } 
    
    
    ,hide:function() {
        return this.setVisible(false);
    } 
    
    
    
    ,updateDate:function() {

        var d = this.df.getValue();
        if(d) {
            if(!(this.dateValue instanceof Date)) {
                this.initDateValue();
            }
            this.dateValue.setMonth(0); 
            this.dateValue.setFullYear(d.getFullYear());
            this.dateValue.setMonth(d.getMonth());
            this.dateValue.setDate(d.getDate());
        }
        else {
            this.dateValue = '';
        }
    } 
    
    
    
    ,updateTime:function() {
        var t = this.tf.getValue();
        if(t){
          if (!(t instanceof Date)) {
            t = Date.parseDate(t, this.tf.format);
          }
          if(!(this.timeValue instanceof Date)) {
            this.initTimeValue();
          }
          this.timeValue.setHours(t.getHours());
          this.timeValue.setMinutes(t.getMinutes());
          this.timeValue.setSeconds(t.getSeconds());
        } else {
          this.timeValue='';
        }
    } 
    
    
    ,getDateTime: function(){
      if(this.dateValue instanceof Date && this.timeValue instanceof Date){
        var dt=new Date();
        dt.setHours(this.timeValue.getHours());
        dt.setMinutes(this.timeValue.getMinutes());
        dt.setSeconds(this.timeValue.getSeconds());
        dt.setMonth(0); 
        dt.setFullYear(this.dateValue.getFullYear());
        dt.setMonth(this.dateValue.getMonth());
        dt.setDate(this.dateValue.getDate());
        return(dt);
      } else if(this.dateValue instanceof Date){
        return(new Date(this.dateValue));
      }
      return("");
     
    }
    
    ,updateHidden:function() {
        if(this.isRendered) {
          var value="";
          var dt=this.getDateTime();
          if(dt instanceof Date){
            value=dt.format(this.hiddenFormat);
          }
          this.el.dom.value = value;
        }
    }
    
    
    
    ,updateValue:function() {

        this.updateDate();
        this.updateTime();
        this.updateHidden();

        return;
    } 
    
    
    
    ,validate:function() {
      var tValid=this.tf.validate();
      var dValid=this.df.validate();
      if(dValid){
        this.df.clearInvalid();
      }
      if(tValid){
        this.tf.clearInvalid();
      }
      if(dValid && tValid){
         this.updateValue();
         return(this.validateValue(this.getValue()));
       }
       return(false);
    } 
    
    
    ,markInvalid: function(msg){
      this.df.markInvalid(msg);
      this.tf.markInvalid(msg);
     }
     ,clearInvalid: function(){
       this.df.clearInvalid();
       this.tf.clearInvalid();
     }

    
    ,renderer: function(field) {
        var format = field.editor.dateFormat || Ext.ux.form.DateTime.prototype.dateFormat;
        format += ' ' + (field.editor.timeFormat || Ext.ux.form.DateTime.prototype.timeFormat);
        var renderer = function(val) {
            var retval = Ext.util.Format.date(val, format);
            return retval;
        };
        return renderer;
    } 
    

}); 


Ext.reg('xdatetime', Ext.ux.form.DateTime);



Ext.namespace('Ext.ux.netbox.core');


Ext.ux.netbox.core.Operator=function(id, label){
  
  this.id=id;
  
  this.label=((label==undefined)?id:label);
  
  this.field=null;
}

Ext.ux.netbox.core.Operator.prototype = {

  
  isAvailableValuesAvailable: function(){
    if(this.getField()===null){
      throw("An operator must be associated to a Field to know if there is the list of the available values!");
    }
    return(this.getField().isAvailableValuesAvailable());
  },
  
  getAvailableValues: function(){
    if(!this.isAvailableValuesAvailable()){
      throw("Available values not available!");
    }
    if(this.getField()==null){
      throw("An operator must be associated to a field to obtain the list of the available values!");
    }
    return(this.getField().getAvailableValues());
  },
  
  getId: function(){
    return(this.id);
  },
  
  getLabel: function(){
    return(this.label);
  },
  
  setField: function(field){
    this.field=field;
  },
  
  getField: function(){
    return(this.field);
  },
  
  render: function(value){
    if(this.getField()===undefined || this.getField()===null){
      throw("Impossible to render a value from the operator "+this.getId()+" which is without field");
    }
    return(this.getField().render(value,this.getId()));
  },
  
  getEditor: function(cache){
    if(this.getField()==undefined || this.getField()==null){
      throw("Impossible to obtain the editor for the operator "+this.getId()+" which is without field");
    }
    var editor;
    if(cache===undefined){
      cache=true;
    }
    if(this.editor==null || !cache){
      editor=this.createEditor();
      var myField=editor.field;
      var originalFunc=myField.validateValue;
      var myValidateFunc=this.validate;
      var myValidateScope=this;
      myField.validateValue=function(value){
        if(originalFunc.call(this,myField.value)===false)
          return false;
        var retval=myValidateFunc.call(myValidateScope,editor.getValue());
        if(retval===true)
          return true;
        myField.markInvalid(retval);
      };
      if(cache){
        this.editor=editor;
      }
    } else {
      editor=this.editor;
    }
    return(editor);
  },
  
  convertValue: function(values){
    if(values !==null && values !== undefined && Ext.type(values)=="array"){
      if(values.length>0 && values[0].value!== undefined && values[0].label!== undefined){
        if(values.length==1){
          return(values);
        } else {
          return([values[0]]);
        }
      }
    }
    return([]);
  },
  
  isStoreRemote: function(){
    if(this.getField()===undefined || this.getField()===null){
      throw("Impossible to obtain the type of the store (remote/local) for the operator "+this.getId()+" which is without field");
    }
    return(this.getField().isStoreRemote());
  },
  
  isForceReload: function(){
    if(this.getField()===undefined || this.getField()===null){
      throw("Impossible to obtain the forceReload info for the operator "+this.getId()+" which is without field");
    }
    return(this.getField().isForceReload());
  },
  
  getDefaultValues : function(){
    return(this.getField().getDefaultValues());
  },
  
  validate: function(values){
    if(this.validateFn!==undefined){
      return this.validateFn.call(this,values);
    } 
    if(this.getField()===undefined || this.getField()===null){
      throw("Impossible to call the validate function on the field: is not defined. Operation id: "+this.getId());
    }
    var validation=this.getField().validate(values);
    if(validation && this.additionalValidationFn){
      validation=this.additionalValidationFn.call(this,values);
    }
    return(validation);
  },
  
  createEditor: function(){
    if(this.getField()===undefined || this.getField()===null){
      throw("Impossible to create the editor for the operator "+this.getId()+" which is without field");
    }
    return(this.getField().createEditor(this.getId()));
  },
  
  
  addValidateFn: function(additionalValidationFn){
    this.additionalValidationFn=additionalValidationFn;
  },
  
  setValidateFn: function(validateFn){
    this.validateFn=validateFn;
  }
};


Ext.namespace('Ext.ux.netbox.core');


Ext.ux.netbox.core.Field=function(id,labelIn,defaultValues,config){
  Ext.ux.netbox.core.Field.superclass.constructor.call(this);
  this.addEvents({
    
    operatorAdded : true,
    
    operatorRemoved : true,
    
    defaultOperatorChanged : true
  });

  this.config = config || {};
  
  this.id=id;
  
  this.label=((labelIn===undefined)?id:labelIn);
  
  this.availableOperators=[];
  
  this.defaultOperator=null;
  
  this.editor=null;
  
  this.availableValueStore=null;
  
  this.isRemote=true;
  
  this.forceReload=false;
  
  this.defaultValues=((defaultValues==undefined)?[]:defaultValues);
  
  this.validateFunc=null;
}

Ext.extend(Ext.ux.netbox.core.Field,Ext.util.Observable,
{
  
  getDefaultValues : function(){
    return(this.defaultValues);
  },
  
  setDefaultValues : function(values){
    var arrayValues=[];
    for(var i=0;i<values.length;i++){
      if(values[i].label==undefined){
        values[i].label=values[i].value;
      }
      arrayValues.push(values[i]);
    }
    this.defaultValues=arrayValues;
  },
  
  getDefaultOperator : function(){
    return(this.defaultOperator);
  },
  
  setDefaultOperator : function(defaultOperator){
    var id=defaultOperator.getId();
    var oper=this.getAvailableOperatorById(id);
    if (oper==null){
      throw("operator not among available operators");
    }
    this.defaultOperator=defaultOperator;
    this.fireEvent("defaultOperatorChanged",defaultOperator);
  },
  
  getAvailableValues : function(){
    if(!this.isAvailableValuesAvailable()){
      throw("Available values not available!");
    }
    return(this.availableValueStore);
  },
  
  setAvailableValues: function(store){
    this.availableValueStore=store;
    this.editor=null;
  },
  
  isAvailableValuesAvailable: function(){
    return(this.availableValueStore!==null);
  },
  
  setStoreRemote: function(isRemote){
    this.isRemote=isRemote;
  },
  
  isStoreRemote: function(){
    if(!this.isAvailableValuesAvailable()){
      throw(this.getId()+" isStoreRemote: no store available");
    }
    return(this.isRemote);
  },
  
  setForceReload: function(forceReload){
    this.forceReload=forceReload;
  },
  
  isForceReload: function(){
    if(!this.isAvailableValuesAvailable()){
      throw(this.getId()+" isForceReload: no store available");
    }
    return(this.forceReload);
  },
  
  addOperator : function(operator){
    if(operator.getField()!==null && operator.getField != this){
      throw("Impossible to add the operator "+operator.getId()+" to the Field "+this.getId()+". The operator is already associated to another Field");
    }
    this.availableOperators.push(operator);
    operator.setField(this);
    this.fireEvent("operatorAdded",operator);
  },
  
  getAvailableOperators : function(){
    return(this.availableOperators);
  },
  
  getAvailableOperatorById : function(id){
    var index=this._getOperatorIndexById(id);
    if(index===null)
      return(null);
    else
      return(this.getAvailableOperators()[index]);
  },
  
  _getOperatorIndexById : function(id){
    var availableOps=this.getAvailableOperators();
    for(var i=0; i<availableOps.length;i++){
      if(availableOps[i].getId()==id){
        return(i);
      }
    }
    return(null);
  },
  
  removeOperator : function(id){
    var index=this._getOperatorIndexById(id);
    if(index===null){
      throw("The operator with the given id doesn't exist");
    } else {
      var operator=this.getAvailableOperators()[index];
      if (operator==this.getDefaultOperator) { 
        throw("operator to remove is the DefaultOperator");
      }
      this.availableOperators.splice(index,1);
      this.fireEvent("operatorRemoved",operator);
    }
  },
  
  getElementaryFilterInstance : function(operator){
    var filter=new Ext.ux.netbox.core.ElementaryFilter(this,operator);
    return filter;
  },
  
  getId : function(){
    return(this.id);
  },
  
  getLabel : function(){
    return(this.label);
  },
  
  render: function(value,operatorId){
    if(value !==undefined && value!==null){
      if(Ext.type(value)=="array"){
        var rendered=[];
        for(var i=0;i<value.length;i++){
          rendered.push(this.render(value[i],operatorId));
        }
        return(rendered.join(","));
      }else {
        if(value.value!==undefined && value.label!==undefined){
          return(this.render(value.label,operatorId));
        }
        return(String(value));
      }
    } else {
      return("");
    }
  },
  
  createEditor: function(operatorId){
    var editor;
    if(!this.isAvailableValuesAvailable()){
      editor=new Ext.ux.netbox.core.TextValuesEditor();
    } else {
      editor=new Ext.ux.netbox.core.AvailableValuesEditor(this.getAvailableValues(),this.isStoreRemote(),this.isForceReload(),this.config);
    }
    return editor;
  },
  
  setValidateFn: function(func){
    this.validateFunc=func;
  },
  
  validate: function(values){
    if(this.validateFunc!==null){
      return this.validateFunc.call(this,values);
    }else{
      return true;
    }
  },
  
  
  emptyNotAllowedFn: function(value){
    if(!value)
      return(this.emptyNotAllowed);
    if(!value.length)
      return(this.emptyNotAllowed);
    return(true);
  },
   
  emptyNotAllowed: "Empty value not allowed"
});


Ext.namespace('Ext.ux.netbox.core');


Ext.ux.netbox.core.Filter = function () {
  Ext.ux.netbox.core.Filter.superclass.constructor.call(this);
}

Ext.extend(Ext.ux.netbox.core.Filter,Ext.util.Observable,
{
  
  getFilterObj : function(){
    throw("getFilterObj is an abstract method!");
  },
  
  setFilterObj : function(filter){
    throw("setFilterObj is an abstract method!");
  },
  
  getElementaryFilterById : function(id){
  	throw("getElementaryFilterById is an abstract method!");
  },
  
  getElementaryFiltersByFieldId : function(fieldId){
  	throw("getElementaryFiltersByFieldId is an abstract method!");
  }

});


Ext.namespace('Ext.ux.netbox.core');


Ext.ux.netbox.core.ElementaryFilter = function(field, operator){
  Ext.ux.netbox.core.ElementaryFilter.superclass.constructor.call(this);
  this.addEvents({
    
    operatorChanged : true,
    
    valueChanged : true
  });
  
  this.id = field.getId()+Ext.ux.netbox.core.ElementaryFilter.sequence;
  Ext.ux.netbox.core.ElementaryFilter.sequence++;

  
  this.field=field;

  
  this.operator;
  this.setOperator(((operator==undefined)?field.getDefaultOperator():operator));

  
  this.values;
  this.setValues(this.getOperator().getDefaultValues());
}
if(Ext.ux.netbox.core.ElementaryFilter.sequence==undefined){
  Ext.ux.netbox.core.ElementaryFilter.sequence=0;
}

Ext.extend(Ext.ux.netbox.core.ElementaryFilter,Ext.ux.netbox.core.Filter,
{
  
  getField : function(){
    return(this.field);
  },
  
  getOperator : function(){
    return(this.operator);
  },
  
  setOperator : function(operator){
    if(operator==null){
      throw("Null Operator not allowed");
    }
    if(operator.getId){
      if(this.field.getAvailableOperatorById(operator.getId())==null) throw("Operator "+operator.getId()+" is not available for this elementaryFilter");
    } else {
      var operatorTmp=this.getField().getAvailableOperatorById(operator);
      if(operatorTmp==null){
        throw("Operator "+operator+" is not available for this elementaryFilter");
      }
      operator=operatorTmp;
    }
    this.operator=operator;
    this.fireEvent("operatorChanged",this,operator);
    this.setValues(this.operator.convertValue(this.getValues()));
  },
  
  getValues : function(){
    if(this.values){
      return(this.values.concat());
    }
    return(this.values);
  },
  
  addValue : function(val){
    this.values.push(val);
    this.fireEvent("valueChanged",this,val);
  },
  
  removeValue : function(val){
    var find=-1
    for(var i=0;i<this.getValues().length;i++){
      if(this.getValues()[i]==val){
        find=i;
        break;
      }
    }
    if(find!=-1){
      this.values.splice(find,1);
      this.fireEvent("valueChanged",this,val);
    } else {
      throw("Unable to remove the value "+val+". Not found");
    }
  },
  
  setValues : function(values){
    if(values===undefined || values === null){
      throw("ElementaryFilter "+this.getId()+". Impossible to set a undefined or null value. The empty value is an empty array.");
    }
    if(Ext.type(values)!="array"){
      throw("ElementaryFilter "+this.getId()+". The value of a ElementaryFilter MUST be an array!");
    }
    if(Ext.util.JSON.encode(this.values)!=Ext.util.JSON.encode(values)){
      if(this.getOperator().validate(values)===true || this.getOperator().validate(this.getValues())!==true){
        this.values=values;
        this.fireEvent("valueChanged",this,values);
      }
        
    }
  },
  
  getFilterObj : function(){
    return ({fieldId : this.getField().getId(), operatorId : this.getOperator().getId(), values : this.getValues()});
  },
  
  setFilterObj : function(filter){
    if(this.getField().getId()!=filter.fieldId){
      throw("Wrong field for this filter. Expected "+this.getField().getId()+" got "+filter.fieldId);
    }
    this.setOperator(this.getField().getAvailableOperatorById(filter.operatorId));
    this.setValues(filter.values);
  },
  
  getId : function(){
  	return(this.id);
  },
  
  getElementaryFilterById : function(id){
  	if(this.getId()==id)
  	  return(this);
  	return(null);
  },
  
  getElementaryFiltersByFieldId : function(fieldId){
  	if(this.getField().getId()==fieldId)
  	  return([this]);
  	return([]);
  },
  
  isValid : function(){
    if(this.values!==undefined && this.getOperator().validate(this.values)===true)
      return true;
    else
      return false;
  }

});


Ext.namespace('Ext.ux.netbox.core');


Ext.ux.netbox.core.CompositeFilter = function (left, logicalOperator, right){
  Ext.ux.netbox.core.CompositeFilter.superclass.constructor.call(this);
  this.addEvents({
    
    leftSideChanged : true,
    
    rightSideChanged : true,
    
    operatorChanged : true
  });
  
  this.left;
  this.setLeftSide(left);
  
  this.logicalOperator;
  this.setLogicalOperator(logicalOperator);
  
  this.right;
  this.setRightSide(right);
}


Ext.ux.netbox.core.CompositeFilter.OR="OR";

Ext.ux.netbox.core.CompositeFilter.AND="AND";

Ext.extend(Ext.ux.netbox.core.CompositeFilter, Ext.ux.netbox.core.Filter,
{
  
  
  AND: Ext.ux.netbox.core.CompositeFilter.AND,
  
  
  
  OR: Ext.ux.netbox.core.CompositeFilter.OR,
  
  
  setLogicalOperator : function(logicalOperator){
    if (logicalOperator!=Ext.ux.netbox.core.CompositeFilter.AND && logicalOperator!=Ext.ux.netbox.core.CompositeFilter.OR) {
      throw("Unknown logical operator : "+logicalOperator);
    }
    this.logicalOperator=logicalOperator;
    this.fireEvent("operatorChanged",this);
  },
  
  getLogicalOperator : function(){
    return(this.logicalOperator);
  },
  
  setRightSide : function(right){
    this.right=right;
    this.fireEvent("rightSideChanged",this);
  },
  
  getRightSide : function (){
    return(this.right);
  },
  
  setLeftSide : function(left){
    this.left=left;
    this.fireEvent("leftSideChanged",this);
  },
  
  getLeftSide : function(){
    return(this.left);
  },
  
  setFilterObj : function(filter){
    this.setLeftSide(filter.left);
    this.setLogicalOperator(filter.logicalOperator);
    this.setRightSide(filter.right);
  },
  
  getFilterObj : function(){
    return {left:this.getLeftSide(), logicalOperator:this.getLogicalOperator(), right:this.getRightSide()};
  },
  
  getElementaryFilterById : function(id){
    var toReturn=this.getLeftSide().getElementaryFilterById(id);
    if(toReturn!=null)
      return(toReturn);
    if(this.getRightSide()!=null)
      return(this.getRightSide().getElementaryFilterById(id));
    return null;
  },
  
  getElementaryFiltersByFieldId : function(fieldId){
    var toReturn=this.getLeftSide().getElementaryFiltersByFieldId(fieldId);
    if(this.getRightSide()!=null)
      toReturn=toReturn.concat(this.getRightSide().getElementaryFiltersByFieldId(fieldId));
    return toReturn;
  }

});


Ext.namespace('Ext.ux.netbox.core');


Ext.ux.netbox.core.FieldManager=function(config){
  Ext.ux.netbox.core.FieldManager.superclass.constructor.call(this);
  this.addEvents({
    
    fieldAdded : true,
    
    fieldRemoved : true
  });
  
  this.fields=new Ext.util.MixedCollection(false,function(field){return(field.getId())});
  if(config!==undefined){
    for(var i=0; i< config.length; i++){
      var field;
      if(config[i].type===undefined){
        config[i].type="string";
      }

      switch(config[i].type){
        case "string":
          field=new Ext.ux.netbox.string.StringField(config[i].id,config[i].label);
          break;
        case "enum":
          field=new Ext.ux.netbox.string.EnumField(config[i].id,config[i].label,config[i]);
          break;
        case "float":
        case "int":
          field=new Ext.ux.netbox.number.NumberField(config[i].id,config[i].label);
          break;
        case "date":
          field=new Ext.ux.netbox.date.DateField(config[i].id,config[i].label,config[i].format);
          break;
        default:
          continue;
      }
      if(config[i].availableValues!==undefined){
        field.setAvailableValues(config[i].availableValues);
        if(config[i].remoteStore!==undefined){
          field.setStoreRemote(config[i].remoteStore);
        }
        if(config[i].type=="string" || config[i].type=="enum"){
          field.addOperator(new Ext.ux.netbox.string.StringListOperator('STRING_LIST',field.stringListText));
          field.addOperator(new Ext.ux.netbox.string.StringListOperator('STRING_NOT_IN_LIST',field.stringNotListText));
        }
      }
      if(config[i].defaultValues!==undefined)
        field.setDefaultValues(config[i].defaultValues);
      if(config[i].forceReload!==undefined)
        field.setForceReload(config[i].forceReload);
      if(config[i].validate!==undefined)
        field.setValidateFn(config[i].validate);

      this.addField(field);
    }
  }
}

Ext.extend(Ext.ux.netbox.core.FieldManager,Ext.util.Observable,
{
  
  getAllFields : function(){
    return(this.fields.getRange());
  },
  
  getFieldById : function(id){
    var field=this.fields.get(id);
    if(!field){
      return(null);
    }
    return(field);
  },
  
  addField : function(field){
    this.fields.add(field);
    this.fireEvent("fieldAdded",field);
  },
  
  removeField : function(field){
    if(this.fields.removeKey(field.getId()))
    this.fireEvent("fieldRemoved",field);
  }

});


Ext.namespace('Ext.ux.netbox.core');


Ext.ux.netbox.core.FilterModel=function(config){
  Ext.ux.netbox.core.FilterModel.superclass.constructor.call(this);
  this.addEvents({
    
    elementaryFilterAdded : true,
    
    elementaryFilterRemoved : true,
    
    filterChanged : true
  });
  
  this.filter=null;
  
  if(config instanceof Ext.ux.netbox.core.FieldManager)
    this.fieldManager=config;
  else
    this.fieldManager=new Ext.ux.netbox.core.FieldManager(config);
}

Ext.extend(Ext.ux.netbox.core.FilterModel,Ext.util.Observable,
{
  
  _createFilter : function (fieldId, operator, values){
    var myField=this.getFieldManager().getFieldById(fieldId);
    if(myField==null) throw ("Field "+fieldId+" not found!");
    var elementaryFilter=myField.getElementaryFilterInstance();
    if(operator!=undefined) elementaryFilter.setOperator(operator);
    if(values!=undefined) elementaryFilter.setValues(values);
    return(elementaryFilter);
  },
  
  _addFilter : function(elementaryFilter){
    if(this.getFilter()==null)
      this.filter=elementaryFilter;
    else
      this.filter=new Ext.ux.netbox.core.CompositeFilter(this.getFilter(), Ext.ux.netbox.core.CompositeFilter.AND, elementaryFilter);
    this.fireEvent("elementaryFilterAdded", this, elementaryFilter);
  },
  
  _decodeFilter : function(filterObject){
    if(filterObject.fieldId){
      var myField=this.getFieldManager().getFieldById(filterObject.fieldId);
      if(myField==null) throw ("Field "+filterObject.fieldId+" not found!");
      var operator=myField.getAvailableOperatorById(filterObject.operatorId);
      if(operator===null)
        operator=undefined;
      var elementaryFilter=myField.getElementaryFilterInstance(operator);
      elementaryFilter.setFilterObj(filterObject);
      return(elementaryFilter);
    } else {
      var leftTmp=this._decodeFilter(filterObject.left);
      var rightTmp=this._decodeFilter(filterObject.right);
      var myCompositeFilter=new Ext.ux.netbox.core.CompositeFilter(leftTmp,filterObject.logicalOperator,rightTmp);
      return(myCompositeFilter);
    }
  },
  
  _encodeFilter : function(filter){
    if(filter.setValues){
      return(filter.getFilterObj());
    } else {
      var filterTmp=filter.getFilterObj();
      filterTmp.left=this._encodeFilter(filterTmp.left);
      filterTmp.right=this._encodeFilter(filterTmp.right);
      return(filterTmp);
    }
  },
  
  _findAndRemoveFilter : function(parentExpression,expression, matchFn, toRemove){
    if(expression instanceof Ext.ux.netbox.core.ElementaryFilter){
      if(matchFn.call(this,expression)){
        toRemove.push(expression);
        return(true);
      } else {
        return(false);
      }
    }

    var shouldRemoveLeft=this._findAndRemoveFilter(expression,expression.getLeftSide(),matchFn,toRemove)
    var shouldRemoveRight=this._findAndRemoveFilter(expression,expression.getRightSide(),matchFn,toRemove);

    if(shouldRemoveRight && shouldRemoveLeft){
      return(true);
    }

    if(shouldRemoveLeft){
      if(parentExpression.getLeftSide()==expression){
        parentExpression.setLeftSide(expression.getRightSide());
      } else {
        parentExpression.setRightSide(expression.getRightSide());
      }
    }

    if(shouldRemoveRight){
      if(parentExpression.getLeftSide()==expression){
        parentExpression.setLeftSide(expression.getLeftSide());
      } else {
        parentExpression.setRightSide(expression.getLeftSide());
      }
    }

    return(false);
  },
  
  getFieldManager : function(){
    return(this.fieldManager);
  },
  
  getFilter : function(){
    return(this.filter);
  },
  
  getFilterObj : function(evenInvalid,additionalFilterObj,additionalLogicalOper){
    var additionalFilter;
    if(additionalFilterObj===undefined){
      additionalFilter=null;
    } else {
      additionalFilter=this._decodeFilter(additionalFilterObj);
    }
    if(additionalLogicalOper===undefined)
      additionalLogicalOper=Ext.ux.netbox.core.CompositeFilter.AND;
    var filter=this.getFilter();
   
    var filterToExport;
    if(filter===null) 
      filterToExport=additionalFilter;
    else if (additionalFilter === null){
      filterToExport=filter;
    } else {
      filterToExport=new Ext.ux.netbox.core.CompositeFilter(filter,additionalLogicalOper,additionalFilter);
    }
    
    if(filterToExport instanceof Ext.ux.netbox.core.ElementaryFilter){
      if(!filterToExport.isValid()){
        filterToExport=null;
      }
    } else if(filterToExport !== null) {
      var matchFn=function(filter){
        return(!filter.isValid());
      };
      var toRemove=[];
      var shouldRemoveLeft=this._findAndRemoveFilter(filterToExport,filterToExport.getLeftSide(),matchFn,toRemove);
      var shouldRemoveRight=this._findAndRemoveFilter(filterToExport,filterToExport.getRightSide(),matchFn,toRemove);
      if(shouldRemoveLeft && shouldRemoveRight){
        filterToExport=null;
      } else if(shouldRemoveLeft){
        filterToExport=filterToExport.getRightSide();
      }else if(shouldRemoveRight){
        filterToExport=filterToExport.getLeftSide();
      }
    }
    if(filterToExport!=null)
      return(this._encodeFilter(filterToExport));
    else
      return null;
  },
  
  setFilterObj : function(filterObject){
    if(filterObject){
      if(!filterObject.setFilterObj){
        filterObject=this._decodeFilter(filterObject);
      }
    }
    this.filter=filterObject;
    this.fireEvent("filterChanged",this);
  },
  
  getElementaryFilterById : function(id){
    if(this.getFilter()!=null)
      return(this.getFilter().getElementaryFilterById(id));
    return(null);
  },
  
  getElementaryFiltersByFieldId : function(fieldId){
    if(this.getFilter()!=null){
      return(this.getFilter().getElementaryFiltersByFieldId(fieldId));
    }
    return [];
  },
  
  addElementaryFilterByFieldId : function(fieldId){
    var elementaryFilter=this._createFilter(fieldId);
    this._addFilter(elementaryFilter);
    return(elementaryFilter.getId());
  },
  
  addElementaryFilter : function (filterObject){
    var elementaryFilter=this._createFilter(filterObject.fieldId, filterObject.operatorId, filterObject.values);
    this._addFilter(elementaryFilter);
    return(elementaryFilter.getId());
  },
  
  removeElementaryFilterById : function(filterId){
    var removedElementaryFilter=null;
    if(this.getFilter()==null)
      throw("Unable to remove the elementaryFilter with id "+filterId+". The elementaryFilter doesn't exist.");
    if(this.getFilter() instanceof Ext.ux.netbox.core.ElementaryFilter){
      if(this.getFilter().getId()==filterId){
        removedElementaryFilter=this.filter;
        this.filter=null;
      } else {
        throw("Unable to remove the elementaryFilter with id "+filterId+". The elementaryFilter doesn't exist");
      }
    } else {
      var matchFn=function(filter){
        if(filter.getId()===filterId){
          return(true);
        } else {
          return(false);
        }
      };
      var toRemove=[];
      var shouldRemoveLeft=this._findAndRemoveFilter(this.getFilter(),this.getFilter().getLeftSide(),matchFn,toRemove);
      var shouldRemoveRight=this._findAndRemoveFilter(this.getFilter(),this.getFilter().getRightSide(),matchFn,toRemove);
      if(toRemove.length===0){
        throw("Unable to remove the elementaryFilter with id "+filterId+". The elementaryFilter doesn't exist");
      }
      removedElementaryFilter=toRemove[0];
      if(shouldRemoveLeft){
        this.filter=this.getFilter().getRightSide();
      }

      if(shouldRemoveRight){
        this.filter=this.getFilter().getLeftSide();
      }
    }
    this.fireEvent("elementaryFilterRemoved", this, removedElementaryFilter);
  },
  
  getAllElementaryFilters : function(filter){
    if(filter===undefined)
      filter=this.getFilter();
    var elementaryFilters=[];
    if(filter!=null){
      if(filter.setValues){
        elementaryFilters.push(filter);
      } else {
        elementaryFilters=elementaryFilters.concat(this.getAllElementaryFilters(filter.getLeftSide()));
        elementaryFilters=elementaryFilters.concat(this.getAllElementaryFilters(filter.getRightSide()))
      }
    }
    return(elementaryFilters);
  }

});


Ext.namespace('Ext.ux.netbox.core');


Ext.ux.netbox.core.DynamicFilterModelView=function(config){

Fresh.console.log(config.filterModel);
  if (!(config.filterModel instanceof Ext.ux.netbox.core.FilterModel))
      config.filterModel = new Ext.ux.netbox.core.FilterModel(config.filterModel);
  this.filterModel=config.filterModel;
  config=this.createFilterGridConfig(config);
  Ext.ux.netbox.core.DynamicFilterModelView.superclass.constructor.call(this,config);
  this.on('cellclick', this.removeFilter, this);
  this.on('beforeedit', this.updateOperatorStore, this);
  this.on('afteredit', this.updateFilter, this);

  this.populateFilterStore();

  this.getFilterModel().on('elementaryFilterAdded', this.onFilterAdded, this);
  this.getFilterModel().on('elementaryFilterRemoved', this.onFilterRemoved, this);
  this.getFilterModel().on('filterChanged', this.onFilterChanged, this);
  this.getFilterModel().getFieldManager().on('fieldAdded', this.onFieldAdded, this);
  this.getFilterModel().getFieldManager().on('fieldRemoved', this.onFieldRemoved, this);

  this.createFieldCombo();

  this.getView().getRowClass=function(record, index, rowParams, store){
    var cls = '';
    var aFilter = record.data.filter;
    if(!aFilter.isValid()){
      cls='x-grid3-row-notValid';
    }
    return cls;
  };
}

Ext.extend(Ext.ux.netbox.core.DynamicFilterModelView,Ext.grid.EditorGridPanel,
{
  deleteText    : 'Delete',
  filterText    : 'Field',
  operatorText  : 'Operator',
  valueText     : 'Value',
  comboText     : 'Select a new field',

  
  getFilterModel : function(){
    return(this.filterModel);
  },
  
  onFieldAdded : function(field){
    this.addFields([field]);
  },
    
  onFieldRemoved : function(field){
    this.removeFields(field);
  },
  
  onFilterAdded : function(filterModel, filter){
    var filterRecord=[];
    filterRecord.push(['',
      filter.getField(),
      filter.getOperator().getId(),
      filter.getValues(),
      filter,
      filter.getId()]);
    this.filterStore.loadData(filterRecord, true);
    filter.on('operatorChanged', this.updateFilterOperator, this);
    filter.on('valueChanged',this.updateFilterValues,this);
  },
  
  onFilterRemoved : function(filterModel, filter){
    var recordToRemove=this.filterStore.getById(filter.getId());
    this.filterStore.remove(recordToRemove);
    filter.un('operatorChanged', this.updateFilterOperator, this);
    filter.on('valueChanged',this.updateFilterValues,this);
  },
  
  onFilterChanged : function(){
    this.populateFilterStore();
  },
  
  onEditComplete: function(ed, value, startValue){
    this.editing=false;
    this.activeEditor=null;
    ed.un('specialkey', this.selModel.onEditorKey, this.selModel);
    if(Ext.util.JSON.encode(value) !== Ext.util.JSON.encode(startValue)){
      var r=ed.record;
      
      r.set=function(name, value){
        if(Ext.util.JSON.encode(this.data[name]) == Ext.util.JSON.encode(value)){
          return;
        }
        this.dirty=true;
        if(!this.modified){
          this.modified={};
        }
        if(typeof this.modified[name] == 'undefined'){
          this.modified[name]=this.data[name];
        }
        this.data[name]=value;
        if(!this.editing){
          this.store.afterEdit(this);
        }
      }
      var field=this.colModel.getDataIndex(ed.col);
      var e={
        grid: this,
        record: r,
        field: field,
        originalValue: startValue,
        value: value,
        row: ed.row,
        column: ed.col,
        cancel:false,
        renderTo: this
      };
      if(this.fireEvent('validateedit', e) !== false && !e.cancel){
        r.set(field, e.value);
        delete e.cancel;
        this.fireEvent('afteredit', e);
      }
    }
    this.view.focusCell(ed.row, ed.col);
  },
  onRender: function(container){
     Ext.ux.netbox.core.DynamicFilterModelView.superclass.onRender.call(this,container);
     this.getTopToolbar().addField(this.fieldCombo);
  },
  
  createFilterGridConfig : function(config){

    this.filterStore=new Ext.data.SimpleStore({
      fields : ['image','field','operatorId','value','filter','filterId'],
      data : [],
      id : 5});

    this.operatorStore=new Ext.data.SimpleStore({
      fields : ['operatorId','operatorLabel'],
      data : [] });

    var operatorCombo=new Ext.form.ComboBox({
      store         : this.operatorStore,
      mode          : 'local',
      valueField    : 'operatorId',
      displayField  : 'operatorLabel',
      editable      : false,
      triggerAction : 'all',
      lazyRender    : true,
      listClass     : 'x-combo-list-small'
    });

    var cm=new Ext.grid.ColumnModel([{
        header    : this.deleteText,
        renderer  : this.imageRenderer,
        width     : 50,
        dataIndex : 'image'
      },{
        header    : this.filterText,
        renderer  : this.fieldRenderer,
        width     : 150,
        dataIndex : 'field'
      },{
        header    : this.operatorText,
        renderer  : this.operatorRenderer,
        width     : 150,
        dataIndex : 'operatorId',
        editor    : operatorCombo
      },{
        header    : this.valueText,
        width     : 150,
        renderer  : this.valueRenderer,
        editable  : true,
        dataIndex : 'value'
      }]);
    
    operatorCombo.on('select',this.completeEditLater,this);

    cm.getCellEditorOrig=cm.getCellEditor;
    cm.filterStore=this.filterStore;
    cm.getCellEditor=function(colIndex, rowIndex){
      if(colIndex==3){
        var filter=this.filterStore.getAt(rowIndex).get('filter');
        var operator=filter.getOperator();
        return(operator.getEditor());
      }
      return(this.getCellEditorOrig(colIndex, rowIndex));
    }
    config.store=this.filterStore;
    config.colModel=cm;
    config.cm=cm;
    config.clicksToEdit=1;
    config.autoExpandColumn='3';
    config.enableColumnHide=false;
    config.enableColumnMove=false;
    config.enableColumnResize=false;
    config.elements='body, tbar';
    if(config.tbar==undefined){
      config.tbar=[];
    }
    return(config);
  },
  
  
  completeEditLater: function(){
    var scope=this.getColumnModel().getCellEditor(2);
    var fn=scope.completeEdit;
    var task=new Ext.util.DelayedTask(fn,scope);
    task.delay(0);
  },
  
  populateFilterStore : function(){
    this.filterStore.removeAll();
    for(var i=0; i<this.getFilterModel().getAllElementaryFilters().length; i++){
      this.onFilterAdded(this.getFilterModel(),this.getFilterModel().getAllElementaryFilters()[i]);
    }
  },
  
  createFieldCombo : function(){
    this.fieldStore=new Ext.data.SimpleStore({fields: ['fieldId', 'label'], data: [], id:0});
    var allFields=this.getFilterModel().getFieldManager().getAllFields();
    this.addFields(allFields);

    this.fieldCombo=new Ext.form.ComboBox({
        emptyText     : this.comboText,
        displayField  : 'label',
        valueField    : 'fieldId',
        store         : this.fieldStore,
        mode          : 'local',
        triggerAction : 'all',
        selectOnFocus : true,
        typeAhead     : true,
        editable      : false
        });

    this.fieldCombo.on('select', this.addFilter, this);
  },
  
  addFields : function(fieldsToAdd){
    var fields=[];
    for(var i=0; i<fieldsToAdd.length; i++){
      fields.push([fieldsToAdd[i].getId(), fieldsToAdd[i].getLabel()]);
    }
    this.fieldStore.loadData(fields, true);
    this.fieldStore.sort('label','ASC');
  },
  
  removeFields : function(fieldToRemove){
    var fieldId=fieldToRemove.getId();
    var toRemove=this.fieldStore.getById(fieldId);
    this.fieldStore.remove(toRemove);
  },
  
  addFilter : function(combo, record, index){
    var addedId=this.getFilterModel().addElementaryFilterByFieldId(record.id);
    this.fieldCombo.clearValue();
    this.filterStore.indexOfId(addedId);
    this.startEditing(this.filterStore.indexOfId(addedId),3);
  },
  
  removeFilter : function(grid, rowIndex, columnIndex, event){
    if (columnIndex == 0){
      var recordToRemove=grid.getStore().getAt(rowIndex);
      var filter=recordToRemove.get('filter');
      this.getFilterModel().removeElementaryFilterById(filter.getId());
    }
  },
  
  updateOperatorStore : function(e){
    if(e.column==2){
      var field=e.record.get('field');
      var operators=[];
      for(var i=0; i<field.getAvailableOperators().length;i++){
        operators.push([field.getAvailableOperators()[i].getId(),
                        field.getAvailableOperators()[i].getLabel()]);
      }
      this.operatorStore.loadData(operators, false);
    }
  },
  
  updateFilter : function(e){
    if(e.column==2){
      var filter=e.record.get('filter');
      var operatorId=e.record.get('operatorId');
      filter.setOperator(operatorId);
    } else if(e.column==3){
      var filter=e.record.get('filter');
      try{
        filter.setValues(e.record.get('value'));
      } catch(exp){
        var r=this.filterStore.getById(filter.getId());
        r.set('value',filter.getValues());
      }
    }
    this.filterStore.commitChanges();
  },
  
  updateFilterOperator : function(filter){
    var record=this.filterStore.getById(filter.getId());
    if(record.get('operatorId')!=filter.getOperator().getId()){
      record.set('operatorId',filter.getOperator().getId());
    }
    this.filterStore.commitChanges();
  },
  
  updateFilterValues: function(filter){
    var record=this.filterStore.getById(filter.getId());
    if(Ext.util.JSON.encode(record.get('value'))!=Ext.util.JSON.encode(filter.getValues())){
      record.set('value',filter.getValues());
    }
    this.filterStore.commitChanges();
  },
  
  imageRenderer : function(value, metadata, record, rowIndex, colIndex, store){
    return('<img class="x-menu-item-icon x-icon-delete" style="cursor: pointer" src="'+Ext.BLANK_IMAGE_URL+'"/>');
  },
  
  fieldRenderer : function(value, metadata, record, rowIndex, colIndex, store){
    return(value.getLabel());
  },
  
  operatorRenderer : function(value, metadata, record, rowIndex, colIndex, store){
    var operator=record.get('filter').getField().getAvailableOperatorById(value);
    return(operator.getLabel());
  },
  
  valueRenderer : function(value, metadata, record, rowIndex, colIndex, store){
    return(record.get('filter').getOperator().render(value));
  }

});
Ext.reg('dynamicFilter',Ext.ux.netbox.core.DynamicFilterModelView);


Ext.namespace('Ext.ux.netbox.core');


Ext.ux.netbox.core.StaticFilterModelView=function(config){

  this.filterModel = config.filterModel;
  this.ratio=60;
  this.rowSize=27;
  if(config.rowSize!==undefined){
    this.rowSize=config.rowSize;
  }
  if(config.ratio){
    this.ratio=config.ratio;
  }
  config=this.createConfig(config);

  this.colsNumber=config.colsNumber;

  
  this.panelColumns=[];
  for(var i=0;i<this.colsNumber;i++){
    this.panelColumns[i]=null;
  }
  Ext.ux.netbox.core.StaticFilterModelView.superclass.constructor.call(this,config);
  if(this.rendered){
    this.populateFields();
  } else {
    this.on('render',this.populateFields,this);
  }
  this.filterModel.getFieldManager().on('fieldAdded',this.addField,this);
  this.filterModel.getFieldManager().on('fieldRemoved',this.removeField,this);
  this.filterModel.on('elementaryFilterAdded',this.elementaryFilterAdded,this);
  this.filterModel.on('elementaryFilterRemoved',this.elementaryFilterRemoved,this);
  this.filterModel.on('filterChanged',this.populateFilters,this);
  this.fieldPanelMapping=new Ext.util.MixedCollection();
  this.filterEditorsMapping={};
  this.managedFilters=new Ext.util.MixedCollection();
  if(this.rendered){
    this.populateFilters();
  } else {
    this.on('render',this.populateFilters,this);
  }
}

Ext.extend(Ext.ux.netbox.core.StaticFilterModelView,Ext.form.FormPanel,{
   
  createConfig: function(config){
    config.layout="form";
    config.frame="true";
    if(!config.colsNumber){
      config.colsNumber=1;
    }
    config.colsNumber=config.colsNumber*2;
    var colWidth=1/(config.colsNumber);
    var items=[];
    var addPanelCol=function(panel,colNumber){
      this.panelColumns[colNumber]=panel;
    }
    for(var i=0; i<config.colsNumber; i++){
      var colWidthTmp;
      if(i%2===0){
        colWidthTmp=colWidth*(this.ratio/100)*2;
      } else if(i%2===1){
        colWidthTmp=colWidth*(1-(this.ratio/100))*2;
      } 
      
      var panelCfg={
        columnWidth: colWidthTmp,
        layout: 'row-fit',
        items: null,
        plugins: {
          init: addPanelCol.createDelegate(this,[i],true)
        }
      }
      items.push(panelCfg);
      if(i%2==1){
        items.push({width:15, style: "height: 1px"});
      }

    }
    config.items=[{layout:"column", items: items }];
    return(config);
  },

  
  getEditorPanelNumber: function(field){
    var elementaryFilterCfg=this.fieldPanelMapping.get(field.getId());
    var editorComponent=elementaryFilterCfg.getEditorComponent();
    var operator=elementaryFilterCfg.getOperatorCombo();

    var panelNum=-1;
    for(var i=1; i<this.panelColumns.length;i+=2){
      if(this.panelColumns[i].items.contains(editorComponent)){
        panelNum=i;
        break;
      }
    }
    return(panelNum);
  },
  
  
  elementaryFilterRemoved: function(filterModel,filter){
    var field=filter.getField();
    var panelNum=this.getEditorPanelNumber(field);
    var elementaryFilterCfg=this.fieldPanelMapping.get(field.getId());
    var editorComponent=elementaryFilterCfg.getEditorComponent();
    var operator=elementaryFilterCfg.getOperatorCombo();
    if(editorComponent.items && editorComponent.items.getCount()>0){
      var componentToRemove=editorComponent.items.first();
      editorComponent.remove(componentToRemove);
    }
    if(operator.getValue()!==""){
      operator.setValue("");
    }
    filter.un('operatorChanged',this.operatorChanged,this);
    filter.un('valueChanged',this.valueChanged,this);
    this.managedFilters.remove(filter);
  },

  
  elementaryFilterAdded: function(filterModel,filter){
    var field=filter.getField();
    var panelNum=this.getEditorPanelNumber(field);
    var elementaryFilterCfg=this.fieldPanelMapping.get(field.getId());
    var editorComponent=elementaryFilterCfg.getEditorComponent();
    var operator=elementaryFilterCfg.getOperatorCombo();
    operator.setValue(filter.getOperator().getId());
    var editor=filter.getOperator().getEditor(false);
    this.changeEditor(editor,elementaryFilterCfg);
    var formField=elementaryFilterCfg.getEditor().field;
    if(editorComponent.items && editorComponent.items.getCount()>0){
      var componentToRemove=editorComponent.items.first();
      editorComponent.remove(componentToRemove);
    }
    
    this.addFormField(formField,editorComponent);
    elementaryFilterCfg.getEditor().editing=true;
    elementaryFilterCfg.getEditor().setValue(filter.getValues());
    elementaryFilterCfg.getEditor().startValue=filter.getValues();
    filter.on('operatorChanged',this.operatorChanged,this);
    filter.on('valueChanged',this.valueChanged,this);
    this.managedFilters.add(filter);
  },

  
  changeEditor: function(editor,elementaryFilterCfg){
    if(elementaryFilterCfg.getEditor()){
      elementaryFilterCfg.getEditor().un('complete',this.editingCompleted,this);
      elementaryFilterCfg.getEditor().field.un('change',this.editingCompleted,this);

    }
    elementaryFilterCfg.setEditor(editor);
    elementaryFilterCfg.getEditor().on('complete',this.editingCompleted,this);
    elementaryFilterCfg.getEditor().field.on('change',this.editingCompleted,this);
  },
  
  
  addFormField: function(formField, editorComponent){
    formField.labelSeparator='';
    if(this.initialConfig.labelAlign && this.initialConfig.labelAlign=='top'){
      formField.fieldLabel='&nbsp;';
    } else {
      formField.fieldLabel='';
    }
    editorComponent.add(formField);
    
    var fn=function(){
      if(editorComponent.rendered){
        formField.setWidth(editorComponent.getSize().width-4);
      }
    }
      
    editorComponent.on('afterlayout',fn);
    editorComponent.doLayout();
  },

  
  operatorChanged: function(filter, operator){
    var field=filter.getField();
    var elementaryFilterCfg=this.fieldPanelMapping.get(field.getId());
    var operatorCombo=elementaryFilterCfg.getOperatorCombo();
    var editorComponent=elementaryFilterCfg.getEditorComponent();
    if(operatorCombo.getValue()!=operator.getId())
      operatorCombo.setValue(operator.getId());
    var panelNum=this.getEditorPanelNumber(field);
    var editor=filter.getOperator().getEditor(false);
    this.changeEditor(editor,elementaryFilterCfg);
    var formField=elementaryFilterCfg.getEditor().field;
    var componentToRemove=editorComponent.items.first();
    editorComponent.remove(componentToRemove);
    this.addFormField(formField,editorComponent);
    elementaryFilterCfg.getEditor().editing=true;
    elementaryFilterCfg.getEditor().startValue=filter.getValues();
    elementaryFilterCfg.getEditor().setValue(filter.getValues());
  },

  
  valueChanged: function(filter, value){
    var elementaryFilterCfg=this.fieldPanelMapping.get(filter.getField().getId());
    var editor=elementaryFilterCfg.getEditor();
    
      editor.setValue(value);
    
  },
  
  editingCompleted: function(editorOrFormField){
    var fn=function(elementaryFilterCfg){
      if(elementaryFilterCfg.getEditor() && (elementaryFilterCfg.getEditor()==editorOrFormField || elementaryFilterCfg.getEditor().field==editorOrFormField)){
        return(true);
      }
      return(false);
    }
    var elementaryFilterCfg=this.fieldPanelMapping.find(fn);
    var field=elementaryFilterCfg.getField();
    var filters=this.filterModel.getElementaryFiltersByFieldId(field.getId());
    filters[0].setValues(elementaryFilterCfg.getEditor().getValue());
    elementaryFilterCfg.getEditor().editing=true;
  },
  
  
  populateFields: function(){
    var fields=this.filterModel.getFieldManager().getAllFields();
    for(var i=0;i<fields.length;i++){
      this.addField(fields[i]);
    }
  },
  
  removeField: function(field){
    var panelNum=this.getEditorPanelNumber(field);
    var elementaryFilterCfg=this.fieldPanelMapping.get(field.getId());
    var editorComponent=elementaryFilterCfg.getEditorComponent();
    var operator=elementaryFilterCfg.getOperatorCombo();
    var componentToRemove=editorComponent.items.first();
    editorComponent.remove(componentToRemove,false);
    var parent=operator.getEl().up('.x-form-item');
    this.panelColumns[panelNum-1].remove(operator,true);
    parent.remove();
    this.panelColumns[panelNum].doLayout();
    this.panelColumns[panelNum-1].doLayout();
    this.fieldPanelMapping.removeKey(field.getId());
  },

  
  operatorSelected: function(combo, record,index){
    var fn=function(elementaryFilterCfg){
      if(elementaryFilterCfg.getOperatorCombo()==combo){
        return(true);
      }
      return(false);
    }
    var elementaryFilterCfg=this.fieldPanelMapping.find(fn);
    var field=elementaryFilterCfg.getField();
    var filters=this.filterModel.getElementaryFiltersByFieldId(field.getId());
    if(record.get('operatorId')===""){
      combo.clearValue();
      if(filters.length>0){
        this.filterModel.removeElementaryFilterById(filters[0].getId());
      }
      return;
    }
    if(record.get('operatorId')!=="" && filters.length==0){
      var filterId=this.filterModel.addElementaryFilterByFieldId(field.getId());
      filters.push(this.filterModel.getElementaryFilterById(filterId));
    }
    var availableOperators=field.getAvailableOperators();
    for(var i=0; i< availableOperators.length; i++){
      if(availableOperators[i].getId()===record.get('operatorId')){
        filters[0].setOperator(availableOperators[i]);
      }
    }
    return;
  },
  
  
  populateFilters: function(){
    while(this.managedFilters.getCount()>0){
      var filter=this.managedFilters.last();
      this.elementaryFilterRemoved(this.filterModel,filter);
    }
    var allFilters=this.filterModel.getAllElementaryFilters();
    for(var i=0;i<allFilters.length;i++){
      this.elementaryFilterAdded(this.filterModel,allFilters[i]);
    }
  },

   
  addField: function(field){
    var cfg={};
    if(this.initialConfig.labelWidth!==undefined){
      cfg.labelWidth=this.initialConfig.labelWidth;
    }
    if(this.initialConfig.hideLabels !==undefined){
      cfg.hideLabels=this.initialConfig.hideLabels;
    }
    if(this.initialConfig.itemCls!==undefined){
      cfg.itemCls=this.initialConfig.itemCls;
    }
    if(this.initialConfig.labelAlign!==undefined){
      cfg.labelAlign=this.initialConfig.labelAlign;
    }
    if(this.initialConfig.labelPad!==undefined){
      cfg.labelPad=this.initialConfig.labelPad;
    }
    var elementaryFilterCfg=new Ext.ux.netbox.core.ElementaryFilterCfg(field,this.rowSize,cfg);
    var minCount=null;
    var choosen=0;
    for(var i=0; i<this.panelColumns.length;i+=2){
      if(!this.panelColumns[i].items){
        minCount=0;
        choosen=i;
        break;
      }
      if(minCount==null || this.panelColumns[i].items.length<minCount){
        minCount=this.panelColumns[i].items.length;
        choosen=i;
      }
    }
    this.fieldPanelMapping.add(field.getId(),elementaryFilterCfg);
    elementaryFilterCfg.getOperatorCombo().on('select',this.operatorSelected,this);
    cfg.layout="form";
    cfg.items=[elementaryFilterCfg.getOperatorCombo()];
    cfg.height=this.rowSize;
    this.panelColumns[choosen].add(cfg);
    this.panelColumns[choosen].doLayout();
    this.panelColumns[choosen+1].add(elementaryFilterCfg.getEditorComponent());
    this.panelColumns[choosen+1].doLayout();
  }
});

Ext.reg('staticFilter',Ext.ux.netbox.core.StaticFilterModelView);


Ext.ux.netbox.core.ElementaryFilterCfg = function(field,rowSize,cfg){
  this.rowSize=rowSize;
  var operators = [["","&nbsp;"]];
  this.field=field;
  for(var i=0; i<field.getAvailableOperators().length;i++){
    operators.push([field.getAvailableOperators()[i].getId(),
    field.getAvailableOperators()[i].getLabel()]);
  }
  var operatorStore=new Ext.data.SimpleStore({
    fields : ['operatorId','operatorLabel'],
    data: operators
  });
  this.operatorCombo = new Ext.form.ComboBox({
    store         : operatorStore,
    mode          : 'local',
    valueField    : 'operatorId',
    displayField  : 'operatorLabel',
    editable      : false,
    triggerAction : 'all',
    lazyRender    : true,
    fieldLabel    : field.getLabel(),
    width         : 105
  });
  var cfgCloned=Ext.apply({},cfg);
  cfgCloned.layout='form';
  cfgCloned.height=this.rowSize;
  cfgCloned.labelWidth=1;
  cfgCloned.labelPad=1;
  this.editorComponent=new Ext.Panel(cfgCloned);
}

Ext.ux.netbox.core.ElementaryFilterCfg.prototype={
  
  getOperatorCombo: function(){
    return(this.operatorCombo);
  },
  
  
  getEditorComponent: function(){
    return(this.editorComponent);
  },
  
  getField: function(){
    return(this.field);
  },
  
  setEditor: function(editor){
    this.editor=editor;
  },
  
  getEditor: function(){
    return(this.editor);
  }
};


Ext.namespace('Ext.ux.netbox');


Ext.ux.netbox.FilterEditor = function(field,config){
  Ext.ux.netbox.FilterEditor.superclass.constructor.call(this,field,config);
};

Ext.extend(Ext.ux.netbox.FilterEditor,Ext.grid.GridEditor,
{
  
  startEdit : function(el, value){
    if(this.editing){
        this.completeEdit();
    }
    this.boundEl = Ext.get(el);
    var v = value !== undefined ? value : this.boundEl.dom.innerHTML;
    if(!this.rendered){
        this.render(this.parentEl || document.body);
    }
    if(this.fireEvent("beforestartedit", this, this.boundEl, v) === false){
        return;
    }
    this.startValue = v;
    this.setValue(v);
    if(this.autoSize){
      var sz = this.boundEl.getSize();
      switch(this.autoSize){
        case "width":
        this.setSize(sz.width,  "");
        break;
        case "height":
        this.setSize("",  sz.height);
        break;
        default:
        this.setSize(sz.width,  sz.height);
      }
    }
    this.el.alignTo(this.boundEl, this.alignment);
    this.editing = true;
    this.show();
  },

  
  completeEdit : function(remainVisible){
    if(!this.editing){
      return;
    }
    var v = this.getValue();
    if(this.revertInvalid !== false && !this.field.isValid()){
      v = this.startValue;
      this.cancelEdit(true);
    }
    if(Ext.util.JSON.encode(v) === Ext.util.JSON.encode(this.startValue) && this.ignoreNoChange){
      this.editing = false;
      this.hide();
      return;
    }
    if(this.fireEvent("beforecomplete", this, v, this.startValue) !== false){
      this.editing = false;
      if(this.updateEl && this.boundEl){
        this.boundEl.update(v);
      }
      if(remainVisible !== true){
        this.hide();
      }
      this.fireEvent("complete", this, v, this.startValue);
    }
  }
});


Ext.namespace('Ext.ux.netbox.core');



Ext.ux.netbox.core.AvailableValuesEditor=function(store,remote,forceReload,config){
  var mode;
  if(remote){
    mode='remote';
  } else {
    mode='local';
  }
  config= config || {};
  Ext.applyIf(config,{
      displayField: 'Name',
      valueField: 'Uid',
      multiSelect: false
  });
  var test = store.getAt(0);
  if (test && typeof test.get(config.valueField) == 'undefined') {
      config.displayField = 'label';
      config.valueField = 'value';
  }
  Fresh.console.log(config);
//  if(config.multiSelect==undefined){
 //   config.multiSelect=false;
  //}
  this.fieldCombo=new Ext.ux.Andrie.Select({
    store         : store,
    displayField  : config.displayField,
    valueField    : config.valueField,
    selectOnFocus : true,
    mode          : 'local',
    triggerAction : 'all',
    selectOnFocus : true,
    typeAhead     : true,
    multiSelect   : config.multiSelect
  });
  if(!config.multiSelect){
    this.fieldCombo.on('select',this.completeEditLater,this);
  }
  if(forceReload){
    this.fieldCombo.on("beforequery",function(qe){ qe.combo.lastQuery = null; });
  }
  Ext.ux.netbox.core.AvailableValuesEditor.superclass.constructor.call(this,this.fieldCombo,config);
  this.store=store;
}

Ext.extend(Ext.ux.netbox.core.AvailableValuesEditor,Ext.ux.netbox.FilterEditor,{

  
  setValue: function(value){
    var val=[];
    var rawVal=[];
    var label='';
    if(value!=undefined && value!=null && Ext.type(value)=="array"){
      if(value.length>0){
        for(var i=0; i< value.length && ((this.fieldCombo.multiSelect) || i<1); i++){
          val.push(value[i].value);
          if(value[i].label!=undefined){
            rawVal.push(value[i].label);
          } else {
            rawVal.push(value[i].value);
          }
/*          val.push(value[i][this.valueField]);
          if(value[i][this.displayField]!=undefined){
            rawVal.push(value[i][this.displayField]);
          } else {
            rawVal.push(value[i][this.valueField]);
          }
*/        }
      }
    }
    this.originalValue=value;

    Ext.ux.netbox.core.AvailableValuesEditor.superclass.setValue.call(this,val);
    
    Ext.form.ComboBox.superclass.setValue.call(this.fieldCombo,rawVal.join(","));
    this.fieldCombo.value=val;
    this.fieldCombo.rawValueArray=rawVal;
  },
  
  
  completeEditLater: function(){
    var task=new Ext.util.DelayedTask(this.completeEdit,this);
    task.delay(0);
  },
  
  
  getValue: function() {
    var val=Ext.ux.netbox.core.AvailableValuesEditor.superclass.getValue.call(this);
    if(Ext.type(val)=='string'){
      if(val===''){
        return([]);
      }
      val=val.split(',');
    }
    var toReturn=[];
    for(var i=0; i<val.length;i++){
      var j=this.store.find(this.fieldCombo.valueField,val[i]);
      if(j<0)
        continue;
      var record=this.store.getAt(j);
      var r = {};
    //  r[this.displayField] = record.get(this.displayField);
  //    r[this.valueField] = val[i];
      toReturn.push({label: record.get(this.fieldCombo.displayField), value: val[i]});
//      toReturn.push(r);
    }
    
    if(val.length>0 && toReturn.length==0)
      return(this.originalValue);
    else
      return toReturn;
  }
});



Ext.namespace('Ext.ux.netbox.core');


Ext.ux.netbox.core.TextValuesEditor = function(field, config){
  if(field==undefined){
    field=new Ext.form.TextField();
  }
  Ext.ux.netbox.core.TextValuesEditor.superclass.constructor.call(this,field,config);
}

Ext.extend(Ext.ux.netbox.core.TextValuesEditor,Ext.ux.netbox.FilterEditor,
{
  
  setValue: function(value){
    var val;
    if(value!==undefined && value!==null && Ext.type(value)==="array"){ 
      if(value.length==0){
        val="";
      } else if (value[0].value!==undefined){
        val=value[0].value;
      } else {
        val=value[0];
      }
    } else {
      val="";
    }
    Ext.ux.netbox.FilterEditor.superclass.setValue.call(this,val);
  },

  
  getValue: function() {
    var val=Ext.ux.netbox.FilterEditor.superclass.getValue.call(this);
    if(val===""){
      return([]);
    } else {
      val=[{label: val, value:val}];
    }
    return(val);
  }

});


Ext.namespace('Ext.ux.netbox.string');


Ext.ux.netbox.string.TextFieldOperator = function(id,label) {

  Ext.ux.netbox.string.TextFieldOperator.superclass.constructor.call(this,id,label);

  
  this.editor=null;
};

Ext.extend(Ext.ux.netbox.string.TextFieldOperator,Ext.ux.netbox.core.Operator,
{
  
  createEditor: function(operatorId){
    var editor=new Ext.ux.netbox.core.TextValuesEditor();
    return editor;
  }

});


Ext.namespace('Ext.ux.netbox.string');


Ext.ux.netbox.string.StringListOperator = function(id,label) {
  Ext.ux.netbox.string.StringListOperator.superclass.constructor.call(this,id,label);
  
  this.editor=null;
  valFn=function(values){
    return(this.getField().emptyNotAllowedFn(values));
  }
  this.addValidateFn(valFn);
}

Ext.extend(Ext.ux.netbox.string.StringListOperator,Ext.ux.netbox.core.Operator,{
  
  createEditor: function(operatorId){
    var editor=new Ext.ux.netbox.core.AvailableValuesEditor(this.getField().getAvailableValues(),this.isStoreRemote(),this.isForceReload(),{multiSelect: true});
    return editor;
  },
  
  convertValue: function(values){
    var toReturn=[];
    if(values !==null && values !== undefined && Ext.type(values)=="array"){
      for(var i=0;i<values.length;i++){
        if(values[i].value!== undefined && values[i].label!== undefined){
          toReturn.push(values[i]);
        }
      }
    }
    return(toReturn);
  }
});


Ext.namespace('Ext.ux.netbox.string');


Ext.ux.netbox.string.StringField = function(id,label) {
  Ext.ux.netbox.string.StringField.superclass.constructor.call(this,id,label);
  var equalOperator = new Ext.ux.netbox.core.Operator("STRING_EQUAL",this.stringEqualsLabel);
  this.addOperator(equalOperator);
  this.setDefaultOperator(equalOperator);
  this.addOperator(new Ext.ux.netbox.core.Operator("STRING_DIFFERENT",this.stringDifferentLabel));
  noEmptyAllowed=this.emptyNotAllowedFn.createDelegate(this);
  var op=new Ext.ux.netbox.string.TextFieldOperator("STRING_CONTAINS",this.containsText);
  op.addValidateFn(noEmptyAllowed);
  this.addOperator(op);
  op=new Ext.ux.netbox.string.TextFieldOperator("STRING_DOESNT_CONTAIN",this.doesntContainsText);
  op.addValidateFn(noEmptyAllowed);
  this.addOperator(op);
  op=new Ext.ux.netbox.string.TextFieldOperator("STRING_STARTS_WITH",this.startsWithText);
  op.addValidateFn(noEmptyAllowed);
  this.addOperator(op);
  op=new Ext.ux.netbox.string.TextFieldOperator("STRING_ENDS_WITH",this.endsWithText);
  op.addValidateFn(noEmptyAllowed);
  this.addOperator(op);
}

Ext.extend(Ext.ux.netbox.string.StringField,Ext.ux.netbox.core.Field,{
  stringEqualsLabel: "=",
  stringDifferentLabel: "!=",
  containsText: "contains",
  doesntContainsText: "doesn't contain",
  startsWithText: "starts with",
  endsWithText: "ends with",
    
  stringListText: "in",
  
  stringNotListText: "not in"
});


Ext.namespace('Ext.ux.netbox.string');


Ext.ux.netbox.string.EnumField = function(id,label,config) {
  Ext.ux.netbox.string.EnumField.superclass.constructor.call(this,id,label,[],config);
  var equalOperator = new Ext.ux.netbox.core.Operator("STRING_EQUAL",this.stringEqualsLabel);
  this.addOperator(equalOperator);
  this.setDefaultOperator(equalOperator);
  this.addOperator(new Ext.ux.netbox.core.Operator("STRING_DIFFERENT",this.stringDifferentLabel));
}

Ext.extend(Ext.ux.netbox.string.EnumField,Ext.ux.netbox.core.Field,{

  stringEqualsLabel: "=",
  stringDifferentLabel: "!=",

    
  stringListText: "in",
  
  stringNotListText: "not in"

});


Ext.namespace('Ext.ux.netbox.number');


Ext.ux.netbox.number.NumberRangeOperator = function() {
  Ext.ux.netbox.number.NumberRangeOperator.superclass.constructor.call(this,"NUMBER_RANGE",this.includeText);
  var validateFn=function(value){
    var isOk=this.getField().emptyNotAllowedFn(value);
    if(isOk!==true){
      return(isOk);
    }
    if(value.length!=2){
      return(this.bothFromAndToNotEmpty);
    }
    var fromANumber=this.isNumeric(value[0].value);
    var toANumber=this.isNumeric(value[1].value);
    if(!fromANumber && !toANumber){
      return(this.toAndFromNotANumber);
    }
    
    if(!fromANumber){
      return(this.fromNotANumber);
    }
    
    if(!toANumber){
      return(this.toNotANumber);
    }
    
    if(parseFloat(value[0].value)>parseFloat(value[1].value)){
      return(this.fromBiggerThanTo);
    }
    return(true);
  }
  this.setValidateFn(validateFn);
}

Ext.extend(Ext.ux.netbox.number.NumberRangeOperator,Ext.ux.netbox.core.Operator,{

  fromText    : 'from',
  toText      : 'to',
  includeText : 'between',
  bothFromAndToNotEmpty: "Both 'from' and 'to' must have a value",
  fromBiggerThanTo: "From is bigger than to",
  fromNotANumber: "From is not a number",
  toNotANumber: "To is not a number",
  toAndFromNotANumber: "From and to are not numbers",
  isNumeric: function (value){
    if(Ext.type(value)==='number'){
      return(isFinite(value));
    } else if(Ext.type(value)==='string'){
      
      
      if(value.lastIndexOf(".")===value.length){
        return("A number should not end with a .");
      }
      var RegExp = /^(-)?(\d+)(\.?)(\d*)$/;
      
      
      
  
      return(value.match(RegExp));
    }
    return(false);
  },

  
  createEditor: function(operatorId){
    var field=new Ext.ux.netbox.core.RangeField({
      textCls: Ext.form.NumberField,
      fromConfig: {},
      toConfig: {}
    });
    var editor=new Ext.ux.netbox.FilterEditor(field);
    field.on("editingcompleted",editor.completeEdit,editor);
    return editor;
  },

  render: function(value){
    var valueFrom=value[0] == undefined ? '' : value[0].label;
    var valueTo=value[1] == undefined ? '' : value[1].label;
    return(this.fromText+": "+valueFrom+", "+this.toText+": "+valueTo);
  }
});


Ext.namespace('Ext.ux.netbox.number');


Ext.ux.netbox.number.NumberField = function(id,label) {
  Ext.ux.netbox.number.NumberField.superclass.constructor.call(this,id,label);
  var equalOperator = new Ext.ux.netbox.core.Operator("NUMBER_EQUAL","=");
  this.addOperator(equalOperator);
  this.setDefaultOperator(equalOperator);
  this.addOperator(new Ext.ux.netbox.core.Operator("NUMBER_NOT_EQUAL","!="));
  noEmptyAllowed=this.emptyNotAllowedFn.createDelegate(this);
  var op=new Ext.ux.netbox.core.Operator("NUMBER_GREATER",">");
  op.addValidateFn(noEmptyAllowed);
  this.addOperator(op);
  op=new Ext.ux.netbox.core.Operator("NUMBER_GREATER_OR_EQUAL",">=");
  op.addValidateFn(noEmptyAllowed);
  this.addOperator(op);
  op=new Ext.ux.netbox.core.Operator("NUMBER_LESS","<");
  op.addValidateFn(noEmptyAllowed);
  this.addOperator(op);
  op=new Ext.ux.netbox.core.Operator("NUMBER_LESS_OR_EQUAL","<=");
  op.addValidateFn(noEmptyAllowed);
  this.addOperator(op);
  this.addOperator(new Ext.ux.netbox.number.NumberRangeOperator());
}

Ext.extend(Ext.ux.netbox.number.NumberField,Ext.ux.netbox.core.Field,{
 
  
  
  createEditor: function(operatorId){
    var editor=new Ext.ux.netbox.core.TextValuesEditor(new Ext.form.NumberField({decimalPrecision: 10}));
    return editor;
  }
});


Ext.namespace('Ext.ux.netbox');


Ext.ux.netbox.InputTextMask = function(mask,clearWhenInvalid) {

    if(clearWhenInvalid === undefined){
      this.clearWhenInvalid = true;
    }else{
      this.clearWhenInvalid = clearWhenInvalid;
    }
    this.rawMask = mask;
    this.viewMask = '';
    this.maskArray = [];
    var mai = 0;
    var regexp = '';
    for(var i=0; i<mask.length; i++){
        if(regexp){
            if(regexp == 'X'){
                regexp = '';
            }
            if(mask.charAt(i) == 'X'){
                this.maskArray[mai] = regexp;
                mai++;
                regexp = '';
            } else {
                regexp += mask.charAt(i);
            }
        } else if(mask.charAt(i) == 'X'){
            regexp += 'X';
            this.viewMask += '_';
        } else if(mask.charAt(i) == '9' || mask.charAt(i) == 'L' || mask.charAt(i) == 'l' || mask.charAt(i) == 'A') {
            this.viewMask += '_';
            this.maskArray[mai] = mask.charAt(i);
            mai++;
        } else {
            this.viewMask += mask.charAt(i);
            this.maskArray[mai] = RegExp.escape(mask.charAt(i));
            mai++;
        }
    }

    this.specialChars = this.viewMask.replace(/(L|l|9|A|_|X)/g,'');
};

Ext.ux.netbox.InputTextMask.prototype = {

    init : function(field) {
        this.field = field;

        if (field.rendered){
            this.assignEl();
        } else {
            field.on('render', this.assignEl, this);
        }

        field.on('blur',this.removeValueWhenInvalid, this);
        field.on('focus',this.processMaskFocus, this);
    },

    assignEl : function() {
        this.inputTextElement = this.field.getEl().dom;
        this.field.getEl().on('keypress', this.processKeyPress, this);
        this.field.getEl().on('keydown', this.processKeyDown, this);
        if(Ext.isSafari || Ext.isIE){
            this.field.getEl().on('paste',this.startTask,this);
            this.field.getEl().on('cut',this.startTask,this);
        }
        if(Ext.isGecko || Ext.isOpera){
            this.field.getEl().on('mousedown',this.setPreviousValue,this);
        }
        if(Ext.isGecko){
          this.field.getEl().on('input',this.onInput,this);
        }
        if(Ext.isOpera){
          this.field.getEl().on('input',this.onInputOpera,this);
        }
    },
    onInput : function(){
        this.startTask(false);
    },
    onInputOpera : function(){
      if(!this.prevValueOpera){
        this.startTask(false);
      }else{
        this.manageBackspaceAndDeleteOpera();
      }
    },

    manageBackspaceAndDeleteOpera: function(){
      this.inputTextElement.value=this.prevValueOpera.cursorPos.previousValue;
      this.manageTheText(this.prevValueOpera.keycode,this.prevValueOpera.cursorPos);
      this.prevValueOpera=null;
    },

    setPreviousValue : function(event){
        this.oldCursorPos=this.getCursorPosition();
    },

    getValidatedKey : function(keycode, cursorPosition) {
        var maskKey = this.maskArray[cursorPosition.start];
        if(maskKey == '9'){
            return keycode.pressedKey.match(/[0-9]/);
        } else if(maskKey == 'L'){
            return (keycode.pressedKey.match(/[A-Za-z]/))? keycode.pressedKey.toUpperCase(): null;
        } else if(maskKey == 'l'){
            return (keycode.pressedKey.match(/[A-Za-z]/))? keycode.pressedKey.toLowerCase(): null;
        } else if(maskKey == 'A'){
            return keycode.pressedKey.match(/[A-Za-z0-9]/);
        } else if(maskKey){
            return (keycode.pressedKey.match(new RegExp(maskKey)));
        }
        return(null);
    },

    removeValueWhenInvalid : function() {
        if(this.clearWhenInvalid && this.inputTextElement.value.indexOf('_') > -1){
            this.inputTextElement.value = '';
        }
    },

    managePaste : function() {
        if(this.oldCursorPos===null){
          return;
        }
        var valuePasted=this.inputTextElement.value.substring(this.oldCursorPos.start,this.inputTextElement.value.length-(this.oldCursorPos.previousValue.length-this.oldCursorPos.end));
        if(this.oldCursorPos.start<this.oldCursorPos.end){
          this.oldCursorPos.previousValue=
            this.oldCursorPos.previousValue.substring(0,this.oldCursorPos.start)+
            this.viewMask.substring(this.oldCursorPos.start,this.oldCursorPos.end)+
            this.oldCursorPos.previousValue.substring(this.oldCursorPos.end,this.oldCursorPos.previousValue.length);
          valuePasted=valuePasted.substr(0,this.oldCursorPos.end-this.oldCursorPos.start);
        }
        this.inputTextElement.value=this.oldCursorPos.previousValue;
        keycode={unicode :'',
          isShiftPressed: false,
          isTab: false,
          isBackspace: false,
          isLeftOrRightArrow: false,
          isDelete: false,
          pressedKey : ''
        };
        var charOk=false;
        for(var i=0;i<valuePasted.length;i++){
            keycode.pressedKey=valuePasted.substr(i,1);
            keycode.unicode=valuePasted.charCodeAt(i);
            this.oldCursorPos=this.skipMaskCharacters(keycode,this.oldCursorPos);
            if(this.oldCursorPos===false){
                break;
            }
            if(this.injectValue(keycode,this.oldCursorPos)){
                charOk=true;
                this.moveCursorToPosition(keycode, this.oldCursorPos);
                this.oldCursorPos.previousValue=this.inputTextElement.value;
                this.oldCursorPos.start=this.oldCursorPos.start+1;
            }
        }
        if(!charOk && this.oldCursorPos!==false){
            this.moveCursorToPosition(null, this.oldCursorPos);
        }
        this.oldCursorPos=null;
    },

    processKeyDown : function(e){
        this.processMaskFormatting(e,'keydown');
    },

    processKeyPress : function(e){
        this.processMaskFormatting(e,'keypress');
    },

    startTask : function(setOldCursor){
      if(this.task===undefined){
        this.task=new Ext.util.DelayedTask(this.managePaste,this);
      }
      if(setOldCursor!== false){
        this.oldCursorPos=this.getCursorPosition();
      }
      this.task.delay(0);
    },

    skipMaskCharacters : function(keycode, cursorPos){
       if(cursorPos.start!=cursorPos.end && (keycode.isDelete || keycode.isBackspace)){
         return(cursorPos);
       }
        while(this.specialChars.match(RegExp.escape(this.viewMask.charAt(((keycode.isBackspace)? cursorPos.start-1: cursorPos.start))))){
            if(keycode.isBackspace) {
                cursorPos.dec();
            } else {
                cursorPos.inc();
            }
            if(cursorPos.start >= cursorPos.previousValue.length || cursorPos.start < 0){
                return false;
            }
        }
        return(cursorPos);
    },

    isManagedByKeyDown : function(keycode){
        if(keycode.isDelete || keycode.isBackspace){
            return(true);
        }
        return(false);
    },

    processMaskFormatting : function(e, type) {
        this.oldCursorPos=null;
        var cursorPos = this.getCursorPosition();
        var keycode = this.getKeyCode(e, type);
        if(keycode.unicode===0){
            return;
        }
        if((keycode.unicode==67 || keycode.unicode==99) && e.ctrlKey){
            return;
        }
        if((keycode.unicode==88 || keycode.unicode==120) && e.ctrlKey){
            this.startTask();
            return;
        }
        if((keycode.unicode==86 || keycode.unicode==118) && e.ctrlKey){
            this.startTask();
            return;
        }
        if((keycode.isBackspace || keycode.isDelete) && Ext.isOpera){
          this.prevValueOpera={cursorPos: cursorPos, keycode: keycode};
          return;
        }
        if(type=='keydown' && !this.isManagedByKeyDown(keycode)){
            return true;
        }
        if(type=='keypress' && this.isManagedByKeyDown(keycode)){
            return true;
        }
        if(this.handleEventBubble(e, keycode, type)){
            return true;
        }
        return(this.manageTheText(keycode, cursorPos));
    },

    manageTheText: function(keycode, cursorPos){
      if(this.inputTextElement.value.length === 0){
          this.inputTextElement.value = this.viewMask;
      }
      cursorPos=this.skipMaskCharacters(keycode, cursorPos);
      if(cursorPos===false){
          return false;
      }
      if(this.injectValue(keycode, cursorPos)){
          this.moveCursorToPosition(keycode, cursorPos);
      }
      return(false);
    },

    processMaskFocus : function(){
        if(this.inputTextElement.value.length === 0){
            var cursorPos = this.getCursorPosition();
            this.inputTextElement.value = this.viewMask;
            this.moveCursorToPosition(null, cursorPos);
        }
    },

    isManagedByBrowser : function(keyEvent, keycode, type){
        if(((type=='keypress' && keyEvent.charCode===0) ||
            type=='keydown') && (keycode.unicode==Ext.EventObject.TAB ||
            keycode.unicode==Ext.EventObject.RETURN ||
            keycode.unicode==Ext.EventObject.ENTER ||
            keycode.unicode==Ext.EventObject.SHIFT ||
            keycode.unicode==Ext.EventObject.CONTROL ||
            keycode.unicode==Ext.EventObject.ESC ||
            keycode.unicode==Ext.EventObject.PAGEUP ||
            keycode.unicode==Ext.EventObject.PAGEDOWN ||
            keycode.unicode==Ext.EventObject.END ||
            keycode.unicode==Ext.EventObject.HOME ||
            keycode.unicode==Ext.EventObject.LEFT ||
            keycode.unicode==Ext.EventObject.UP ||
            keycode.unicode==Ext.EventObject.RIGHT ||
            keycode.unicode==Ext.EventObject.DOWN)){
                return(true);
        }
        return(false);
    },

    handleEventBubble : function(keyEvent, keycode, type) {
        try {
            if(keycode && this.isManagedByBrowser(keyEvent, keycode, type)){
                return true;
            }
            keyEvent.stopEvent();
            return false;
        } catch(e) {
            alert(e.message);
        }
    },

    getCursorPosition : function() {
        var s, e, r;
        if(this.inputTextElement.createTextRange){
            r = document.selection.createRange().duplicate();
            r.moveEnd('character', this.inputTextElement.value.length);
            if(r.text === ''){
                s = this.inputTextElement.value.length;
            } else {
                s = this.inputTextElement.value.lastIndexOf(r.text);
            }
            r = document.selection.createRange().duplicate();
            r.moveStart('character', -this.inputTextElement.value.length);
            e = r.text.length;
        } else {
            s = this.inputTextElement.selectionStart;
            e = this.inputTextElement.selectionEnd;
        }
        return this.CursorPosition(s, e, r, this.inputTextElement.value);
    },

    moveCursorToPosition : function(keycode, cursorPosition) {
        var p = (!keycode || (keycode && keycode.isBackspace ))? cursorPosition.start: cursorPosition.start + 1;
        if(this.inputTextElement.createTextRange){
            cursorPosition.range.move('character', p);
            cursorPosition.range.select();
        } else {
            this.inputTextElement.selectionStart = p;
            this.inputTextElement.selectionEnd = p;
        }
    },

    injectValue : function(keycode, cursorPosition) {
        if (!keycode.isDelete && keycode.unicode == cursorPosition.previousValue.charCodeAt(cursorPosition.start)){
          return true;
        }
        var key;
        if(!keycode.isDelete && !keycode.isBackspace){
            key=this.getValidatedKey(keycode, cursorPosition);
        } else {
            if(cursorPosition.start == cursorPosition.end){
                key='_';
                if(keycode.isBackspace){
                    cursorPosition.dec();
                }
            } else {
                key=this.viewMask.substring(cursorPosition.start,cursorPosition.end);
            }
        }
        if(key){
            this.inputTextElement.value = cursorPosition.previousValue.substring(0,cursorPosition.start);
            this.inputTextElement.value+= key +cursorPosition.previousValue.substring(cursorPosition.start + key.length,cursorPosition.previousValue.length);
            return true;
        }
        return false;
    },

    getKeyCode : function(onKeyDownEvent, type) {
        var keycode = {};
        keycode.unicode = onKeyDownEvent.getKey();
        keycode.isShiftPressed = onKeyDownEvent.shiftKey;

        keycode.isDelete = ((onKeyDownEvent.getKey() == Ext.EventObject.DELETE && type=='keydown') || ( type=='keypress' && onKeyDownEvent.charCode===0 && onKeyDownEvent.keyCode == Ext.EventObject.DELETE))? true: false;
        keycode.isTab = (onKeyDownEvent.getKey() == Ext.EventObject.TAB)? true: false;
        keycode.isBackspace = (onKeyDownEvent.getKey() == Ext.EventObject.BACKSPACE)? true: false;
        keycode.isLeftOrRightArrow = (onKeyDownEvent.getKey() == Ext.EventObject.LEFT || onKeyDownEvent.getKey() == Ext.EventObject.RIGHT)? true: false;
        keycode.pressedKey = String.fromCharCode(keycode.unicode);
        return(keycode);
    },

    CursorPosition : function(start, end, range, previousValue) {
        var cursorPosition = {};
        cursorPosition.start = isNaN(start)? 0: start;
        cursorPosition.end = isNaN(end)? 0: end;
        cursorPosition.range = range;
        cursorPosition.previousValue = previousValue;
        cursorPosition.inc = function(){cursorPosition.start++;cursorPosition.end++;};
        cursorPosition.dec = function(){cursorPosition.start--;cursorPosition.end--;};
        return(cursorPosition);
    }
};

Ext.applyIf(RegExp, {
  escape : function(str) {
    return str.replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
  }
});

Ext.ux.InputTextMask=Ext.ux.netbox.InputTextMask;


Ext.namespace('Ext.ux.netbox.date');


Ext.ux.netbox.date.DateTextEditor = function(field,config){
  Ext.ux.netbox.date.DateTextEditor.superclass.constructor.call(this,field,config);
  if(config.format==undefined){
    config.format='Y-m-d H:i:s';
  }
  this.format=config.format;
}

Ext.extend(Ext.ux.netbox.date.DateTextEditor,Ext.ux.netbox.FilterEditor,{

  

  getValue: function() {
    var val=Ext.ux.netbox.date.DateTextEditor.superclass.getValue.call(this);
    
    if(val===""){
      return([]);
    }else{
      return [{value: val.format('Y-m-d H:i:s'),label:val.format(this.format)}];
    }
  },

  setValue: function(val){
    var value;
    if(val.length==0){
      value="";
    }else{
      value=Date.parseDate(val[0].value, 'Y-m-d H:i:s');
    }
    Ext.ux.netbox.date.DateTextEditor.superclass.setValue.call(this,value);
  }

});


Ext.namespace('Ext.ux.netbox.date');


Ext.ux.netbox.date.DateOperator = function(id,label,format) {
  Ext.ux.netbox.date.DateOperator.superclass.constructor.call(this,id,label,format);

  
  this.editor=null;
  
  this.format=format;

  
};

Ext.extend(Ext.ux.netbox.date.DateOperator,Ext.ux.netbox.core.Operator,{
  
  createEditor: function(operatorId){
    var editor;
    var splittedFormat=this.format.split(" ");
    if(splittedFormat.length > 1){
      var dateTimeField=new Ext.ux.form.DateTime({
                dateFormat: splittedFormat[0],
                dateConfig: {
                  altFormats: 'Y-m-d|Y-n-d'
                },
                otherToNow: false,
                timeFormat: splittedFormat[1],
                timeConfig: {
                  altFormats: 'H:i:s'
                }
              });
      editor=new Ext.ux.netbox.date.DateTextEditor(dateTimeField,{format: this.format});
    }else{
      editor=new Ext.ux.netbox.date.DateTextEditor(new Ext.form.DateField({
                format: splittedFormat[0],
                allowBlank: false
              }),
              {format: this.format}
            );
    }
    return editor;
  },

  

  
  convertValue: function(value){
    if(value !==null && value !== undefined && Ext.type(value)=="array"){
      if(value.length>0 && value[0].value!== undefined && value[0].label!== undefined){
        if(this.getField().checkDate(value[0].label) && this.getField().checkDate(value[0].value,'Y-m-d H:i:s')){
          if(value.length==1){
            return(value);
          } else {
            return([value[0]]);
          }
        }
      }
    }
    return([]);
  },

  
  getFormat : function(){
    return this.format;
  }
});


Ext.ux.netbox.date.DateRangeEditor=function(field,config){
  Ext.ux.netbox.date.DateRangeEditor.superclass.constructor.call(this,field,config);
  this.format=config.format;
}

Ext.extend(Ext.ux.netbox.date.DateRangeEditor,Ext.ux.netbox.FilterEditor,{
  
  getValue: function(){
    var val=Ext.ux.netbox.date.DateRangeEditor.superclass.getValue.call(this);
    var toReturn=[];
    for(var i=0; val && i < val.length; i++){
      var date=Date.parseDate(val[i].value,this.format);
      if(!date){
        toReturn.push({label:"",value:""});
        continue;
      }
      val[i].value=date.format('Y-m-d H:i:s');
      toReturn.push(val[i]);
    }
    return(toReturn);
  }
});


Ext.ux.netbox.date.DateRangeOperator = function(format) {
  Ext.ux.netbox.date.DateRangeOperator.superclass.constructor.call(this,"DATE_RANGE",this.includeText,format);
  this.mapping={
    d: '99',
    m: '99',
    Y: '9999',
    y: '99',
    H: '99',
    i: '99',
    s: '99'
  }
  var validateFn=function(value){
    var isOk=this.getField().emptyNotAllowedFn(value);
    if(isOk!==true){
      return(isOk);
    }
    if(value.length!=2){
      return(this.bothFromAndToNotEmpty);
    }
    var fromADate=this.getField().checkDate(value[0].value,'Y-m-d H:i:s');
    var toADate=this.getField().checkDate(value[1].value,'Y-m-d H:i:s');
    if(!fromADate && !toADate){
      return(this.toAndFromNotADate);
    }
    
    if(!fromADate){
      return(this.fromNotADate);
    }
    
    if(!toADate){
      return(this.toNotADate);
    }
    
    if(Date.parseDate(value[0].value,'Y-m-d H:i:s')>Date.parseDate(value[1].value,'Y-m-d H:i:s')){
      return(this.fromBiggerThanTo);
    }
    return(true);
  }
  this.setValidateFn(validateFn);
}

Ext.extend(Ext.ux.netbox.date.DateRangeOperator,Ext.ux.netbox.date.DateOperator,{
  
  fromText    : 'from',
  
  toText      : 'to',
  
  includeText : 'between',
  
  bothFromAndToNotEmpty: "Both 'from' and 'to' must have a value",
  
  fromBiggerThanTo: "From is bigger than to",
  
  fromNotADate: "From is not a valid date",
  
  toNotADate: "To is not a valid date",
  
  toAndFromNotADate: "From and to are not valid dates",

  
  createEditor: function(operatorId){
    var field=new Ext.ux.netbox.core.RangeField({
      textCls: Ext.form.TextField,
      fromConfig: this.getTextFieldConfig(),
      toConfig: this.getTextFieldConfig(),
      minListWidth: 300,
      fieldSize: 36
    });

    var editor=new Ext.ux.netbox.date.DateRangeEditor(field,{format: this.format});
    field.on("editingcompleted",editor.completeEdit,editor);
    return editor;
  },
  
  render: function(value){
    var valueFrom=value[0] == undefined ? '' : value[0].label;
    var valueTo=value[1] == undefined ? '' : value[1].label;
    return(this.fromText+": "+valueFrom+", "+this.toText+": "+valueTo);
  },

  
  getTextFieldConfig: function(){
    return({plugins: [new Ext.ux.netbox.InputTextMask(this.calculateMask(), true)]});
  },
  
  calculateMask: function(){
	  var maskTmp='';
    for(var i=0; i<this.format.length;i++){
      if(this.mapping[this.format.charAt(i)]){
        maskTmp+=this.mapping[this.format.charAt(i)];
      }else{
        maskTmp+=this.format.charAt(i);
      }
    }
    return(maskTmp);
  }
});


Ext.ux.netbox.date.DatePeriodOperator = function() {
  Ext.ux.netbox.date.DatePeriodOperator.superclass.constructor.call(this,"DATE_PERIOD",this.periodText);
  
  this.periodStore=new Ext.data.SimpleStore({fields: ['value', 'label'],
      data: [
        ["LAST_QUARTER",this.quarterText],
        ["LAST_HOUR",this.hourText],
        ["LAST_DAY",this.dayText],
        ["LAST_WEEK",this.weekText],
        ["LAST_MONTH",this.monthText],
        ["LAST_YEAR",this.yearText]
      ]});
   var validateFn=function(value){
     if(this.getField().emptyNotAllowedFn(value)!==true){
       return(this.getField().emptyNotAllowedFn(value));
     }
     if(value[0].value!=="LAST_QUARTER" && value[0].value!=="LAST_HOUR" && value[0].value!=="LAST_DAY" 
       && value[0].value!=="LAST_WEEK" && value[0].value!=="LAST_MONTH" && value[0].value!=="LAST_YEAR"){
       return(this.valueNotExpected);
     }
     return(true);
   }
   this.setValidateFn(validateFn);
}

Ext.extend(Ext.ux.netbox.date.DatePeriodOperator,Ext.ux.netbox.core.Operator,{

  periodText  : "period",
  yearText    : "last year",
  monthText   : "last month",
  weekText    : "last week",
  dayText     : "last day",
  hourText    : "last hour",
  quarterText : "last quarter",
  valueNotExpected: "Value not expected",
  
  
  getDefaultValues : function(){
    return([{value: "LAST_DAY", label: this.dayText}]);
  },

  
  setPeriods: function(store){
    this.periodStore=store;
    this.editor=null;
  },
  
  createEditor: function(operatorId){
    var editor=new Ext.ux.netbox.core.AvailableValuesEditor(this.periodStore,false);
    return editor;
  },
  
  convertValue: function(value){
    if(value !==null && value !== undefined && Ext.type(value)=="array"){
      if(value.length>0 && value[0].value!== undefined && value[0].label!== undefined){
        if(this.periodStore.find('value',value[0].value)!='-1'){
          if(value.length==1){
            return(value);
          } else {
            return([value[0]]);
          }
        }
      }
    }
    return([]);
  }
});


Ext.namespace('Ext.ux.netbox.date');


Ext.ux.netbox.date.DateField = function(id,label,format) {
  Ext.ux.netbox.date.DateField.superclass.constructor.call(this,id,label);
  this.setValidateFn(this.validateDate);
  var periodOperator = new Ext.ux.netbox.date.DatePeriodOperator();
  this.addOperator(periodOperator);
  this.setDefaultOperator(periodOperator);
  this.addOperator(new Ext.ux.netbox.date.DateOperator("DATE_EQUAL","=",format));
  noEmptyAllowed=this.emptyNotAllowedFn.createDelegate(this);
  var op=new Ext.ux.netbox.date.DateOperator("DATE_GREATER",">",format);
  op.addValidateFn(noEmptyAllowed);
  this.addOperator(op);
  op=new Ext.ux.netbox.date.DateOperator("DATE_GREATER_OR_EQUAL",">=",format);
  op.addValidateFn(noEmptyAllowed);
  this.addOperator(op);
  op=new Ext.ux.netbox.date.DateOperator("DATE_LESS","<",format);
  op.addValidateFn(noEmptyAllowed);
  this.addOperator(op);
  op=new Ext.ux.netbox.date.DateOperator("DATE_LESS_OR_EQUAL","<=",format);
  op.addValidateFn(noEmptyAllowed);
  this.addOperator(op);
  this.addOperator(new Ext.ux.netbox.date.DateRangeOperator(format));
  this.format=format;
}

Ext.extend(Ext.ux.netbox.date.DateField,Ext.ux.netbox.core.Field,{
  
  validateDate: function(values){
    for(var i=0;values && i<values.length;i++){
      if(values[i].value!=="" && !this.checkDate(values[i].value,'Y-m-d H:i:s')){
        return(this.checkDate(values[i].value,'Y-m-d H:i:s'));
      }
    }
    return(true);
  },
  
  
  checkDate: function(value,format){
    if(format==undefined){
      format=this.format;
    }
    var date=Date.parseDate(value,format);
    if(!date){
      return(false);
    }
    var valueTmp=date.format(format);
    if(value!=valueTmp){
      return(false);
    }
    return(true);
  }
});


Ext.namespace('Ext.ux.netbox.core');



Ext.ux.netbox.core.RangeField = function(config){
  this.textCls=config.textCls;
  this.fromConfig=config.fromConfig;
  this.toConfig=config.toConfig;
  if(config.minListWidth){
    this.minListWidth=config.minListWidth;
  } else {
    this.minListWidth=100;
  }
  if(config.fieldSize){
    this.defaultAutoCreate.size=config.fieldSize;
  } else {
    this.defaultAutoCreate.size=20;
  }
  Ext.ux.netbox.core.RangeField.superclass.constructor.call(this,config);

  this.addEvents('editingcompleted');
}

Ext.extend(Ext.ux.netbox.core.RangeField,Ext.form.TriggerField,
{
  fromText : 'from',
  toText   : 'to',
  
  defaultAutoCreate : {tag: "input", type: "text", size: "20", autocomplete: "off"},
  readOnly: true,
  rangeValue: null,

  
  onTriggerClick: function(){
    if(this.disabled){
      return;
    }
    if(this.menu == null){
      this.menu = new Ext.ux.netbox.core.RangeMenu(this.textCls,this.fromConfig,this.toConfig,this.validate.createDelegate(this));
      this.menu.on('hide', this.fireEditingCompleted, this);
    }

    this.menu.on(Ext.apply({}, this.menuListeners, {
      scope:this
    }));
    var menuEl=this.menu.getEl();
    var width=Math.max(this.wrap.getWidth(),this.minListWidth)
    menuEl.setWidth(width);
    this.menu.doLayout(width-menuEl.getBorderWidth('lr')-menuEl.getPadding('lr')-menuEl.getMargins('lr'));
    this.menu.setValue(this.rangeValue);
    this.menu.show(this.el);
    this.validate();
    
  },
  
  validateBlur: function(e){
    return(this.menu && !this.menu.getEl().contains(e.target));
  },
  
  getValue: function(){
    if(this.menu !== undefined)
      this.rangeValue=this.menu.getValue();
    return(this.rangeValue);
  },
  
  setValue: function(val){
    valueFrom = val[0] !== undefined ? val[0] : {value:'',label:''};
    valueTo = val[1] !== undefined ? val[1] : {value:'',label:''};
    formattedValue=this.fromText+": "+valueFrom.label+", "+this.toText+": "+valueTo.label;
    Ext.ux.netbox.core.RangeField.superclass.setValue.call(this, formattedValue);
    this.rangeValue=val;
    if(this.menu!=null){
      this.menu.setValue(this.rangeValue);
    }
  },
  
  fireEditingCompleted: function(){
    this.fireEvent('editingcompleted');
  },
  
  
  markInvalid: function(msg){
    Ext.ux.netbox.core.RangeField.superclass.markInvalid.call(this,msg);
    if(this.menu){
      this.menu.markInvalid(msg);
    }
  },
  
  clearInvalid: function(){
    Ext.ux.netbox.core.RangeField.superclass.clearInvalid.call(this);
    if(this.menu){
      this.menu.clearInvalidFields();
    }
  }

});


Ext.namespace('Ext.ux.netbox.core');


Ext.ux.netbox.core.RangeMenu = function(textCls,fromCfg,toCfg,fieldValidateFunc){

  Ext.ux.netbox.core.RangeMenu.superclass.constructor.apply(this,arguments);
  if(textCls===undefined){
    textCls = Ext.form.TextField;
  }
  var editorFrom=new textCls(fromCfg);
  var editorTo=new textCls(toCfg);
  editorFrom.validate=fieldValidateFunc;
  editorTo.validate=fieldValidateFunc;
  this.fields = new Ext.ux.netbox.core.RangeItem({
    editorFrom: editorFrom,
    editorTo: editorTo
    });

  this.add(this.fields);
  this.fields.on("keyup",this.onKeyUp,this);
  this.addEvents({'update': true});
  this.on('show',this.disableKeyNav,this);
};

Ext.extend(Ext.ux.netbox.core.RangeMenu, Ext.menu.Menu,{
  
  disableKeyNav: function(){
    if(this.keyNav){
      this.keyNav.disable();
    }
    if(Ext.isGecko){
      var div=this.getEl();
      div.setStyle("overflow", "auto");
      var text=div.select(".x-form-text");
      text.each(function(el){
        el.dom.select();
      });
    }
  },
  
  setValue: function(data){
    var from="";
    var to="";
    if(data.length==2){
      from=data[0].label;
      to=data[1].label;
    } else if (data.length==1) {
      from=data[0].label;
    }
    this.fields.setValueTo(to);
    this.fields.setValueFrom(from);

    this.fireEvent("update", this);
  },
  
  onKeyUp: function(event){
    if(event.getKey() == event.ENTER && this.isValid()){
      this.hide(true);
      return;
    }
  },
  
  getValue: function(){
    var result = [{value: this.fields.getValueFrom(),label:this.fields.getValueFrom()} ,
    {value: this.fields.getValueTo(),label:this.fields.getValueTo()} ];
    return result;
  },
  
  isValid: function(){
    return(this.fields.isValidFrom() && this.fields.isValidTo());
  },
  
  doLayout: function(width){
    var itemEl=this.fields.getEl();
    this.fields.doLayout(width-itemEl.getBorderWidth('lr')-itemEl.getPadding('lr')-itemEl.getMargins('lr'));
  },
  
  
  markInvalid: function(msg){
    this.fields.markInvalid(msg);
  },
  
  clearInvalidFields: function(){
    this.fields.clearInvalidFields();
  }
});


Ext.namespace('Ext.ux.netbox.core');


Ext.ux.netbox.core.RangeItem = function(config){
  this.editorFrom=config.editorFrom;
  this.editorTo=config.editorTo;
  this.editorFrom.fieldLabel=this.fromText;
  this.editorTo.fieldLabel=this.toText;
  this.panel= new Ext.Panel({
    layout: 'column',
    bodyBorder: false,
    border: false,
    hideBorders: true,
    items: [{layout: "form", labelWidth: 28, labelPad: 2, items: [this.editorFrom],columnWidth:0.5},
      {layout: "form", labelWidth: 28, labelPad: 2, items: [this.editorTo],columnWidth:0.5}
    ]
  });
  Ext.ux.netbox.core.RangeItem.superclass.constructor.apply(this,[this.panel,config]);
}

Ext.extend(Ext.ux.netbox.core.RangeItem,Ext.menu.BaseItem,{
  
  fromText : 'from',
  
  toText   : 'to',
  
  itemCls: "x-menu-item",
  
  hideOnClick: false,
  
  initComponent: function(){
    this.addEvents({keyup:true});
  },
  
  doLayout: function(width){
    var fieldWidth=(width/2)-32;
    this.editorTo.setWidth(fieldWidth);
    this.editorFrom.setWidth(fieldWidth);
    this.panel.setWidth(width);
    this.panel.doLayout();
  },
  
  onRender: function(container){

    if(this.editorFrom.getValue()==""){
      this.editorFrom.setValue("");
    }
    if(this.editorTo.getValue()==""){
      this.editorTo.setValue("");
    }

    Ext.ux.netbox.core.RangeItem.superclass.onRender.apply(this, arguments);
  },
  
  getValueFrom: function(){
    return this.editorFrom.getValue();
  },
  
  getValueTo: function(){
    return this.editorTo.getValue();
  },
  
  setValueFrom: function(value){
    if(value===""){
      this.editorFrom.setRawValue(value);
    } else {
      this.editorFrom.setValue(value);
    }
  },
  
  setValueTo: function(value){
     if(value===""){
       this.editorTo.setRawValue(value);
    } else {
      this.editorTo.setValue(value);
    }
  },
  
  isValidFrom: function(preventMark){
    return this.editorFrom.isValid(preventMark);
  },
  
  isValidTo: function(preventMark){
    return this.editorTo.isValid(preventMark);
  },
  
  markInvalid: function(msg){
    this.editorFrom.markInvalid(msg);
    this.editorTo.markInvalid(msg);
  },
  
  clearInvalidFields: function(){
    this.editorFrom.clearInvalid();
    this.editorTo.clearInvalid();
  }
});


Ext.namespace('Ex.ux.netbox.core');


Ext.ux.netbox.core.LocalStoreFilterResolver = function(filterModel, mapping) {
  
  this.mapping=null;
  if(mapping==undefined){
    this.mapping={
      NUMBER_EQUAL: {fn: this.filterNumberEqual, scope: this},
      NUMBER_NOT_EQUAL: {fn: this.filterNumberDifferent, scope: this},
      NUMBER_GREATER: {fn: this.filterNumberGreater, scope: this},
      NUMBER_GREATER_OR_EQUAL: {fn: this.filterNumberGreaterOrEqual, scope: this},
      NUMBER_LESS: {fn: this.filterNumberLess, scope: this},
      NUMBER_LESS_OR_EQUAL: {fn: this.filterNumberLessOrEqual, scope: this},
      NUMBER_RANGE: {fn: this.filterNumberRange, scope: this},
      STRING_EQUAL: {fn: this.filterStringEquals, scope: this},
      STRING_DIFFERENT: {fn: this.filterStringDifferent, scope: this},
      STRING_CONTAINS: {fn: this.filterStringContains, scope: this},
      STRING_DOESNT_CONTAIN: {fn: this.filterStringDoesntContains, scope: this},
      STRING_STARTS_WITH: {fn: this.filterStringStartsWith, scope: this},
      STRING_ENDS_WITH: {fn: this.filterStringEndsWith, scope: this},
      STRING_LIST: {fn: this.filterList, scope: this},
      STRING_NOT_IN_LIST: {fn: this.filterNotInList, scope: this},
      DATE_EQUAL:{fn: this.filterDateEqual, scope: this},
      DATE_GREATER:{fn: this.filterDateGreater, scope: this},
      DATE_GREATER_OR_EQUAL:{fn: this.filterDateGreaterOrEqual, scope: this},
      DATE_LESS:{fn: this.filterDateLess, scope: this},
      DATE_LESS_OR_EQUAL:{fn: this.filterDateLessOrEqual, scope: this},
      DATE_RANGE:{fn: this.filterDateRange, scope: this},
      DATE_PERIOD:{fn: this.filterDatePeriod, scope: this}
    };
  }
  
  this.filterModel=filterModel;
}

Ext.ux.netbox.core.LocalStoreFilterResolver.prototype = {

  
  escapeRegExp: function(s){
    return s.replace(/([.*+?^${}()|[\]\/\\])/g, '\\$1');
  },
  
  calcolateValue: function(value){
    if(value.length==0){
      return("");
    } else {
      return(value[0].value);
    }
  },
  
  calcolateValueNumber: function(value){
    if(value.length==0){
      throw("Not a number");
    } else {
      var val=parseFloat(value[0].value);
      if(isNaN(val)){
        throw("Not a number");
      }
      return(val);
    }
  },
  
  calcolateValueDate: function(value){
    if(value.length==0){
      throw("Not a date");
    } else {
      var date=Date.parseDate(value[0].value,'Y-m-d H:i:s');
      if(!date){
        throw("Not a date");
      }
      return(date);
    }
  },
  
  filterStringEquals: function(record, value,column){
    return(record.get(column)===this.calcolateValue(value));
  },
  
  filterStringDifferent: function(record, value,column){
    return(!this.filterStringEquals(record, value,column));
  },
  
  filterList:  function(record, value,column){
    for(var i=0; i<value.length;i++){
      if(this.filterStringEquals(record, [value[i]],column)){
        return(true);
      }
    }
    return(false);
  },
  
  filterNotInList:  function(record, value,column){
    return(!this.filterList(record, value,column));
  },
  
  filterStringStartsWith: function(record, value,column){
    var val=this.escapeRegExp(this.calcolateValue(value));
    var pattern = new RegExp('^' + val,'');
    return(record.get(column).match(pattern)!==null);
  },
  
  filterStringEndsWith: function(record, value,column){
    var val=this.escapeRegExp(this.calcolateValue(value));
    var pattern = new RegExp(val+'$','');
    return(record.get(column).match(pattern)!==null);
  },
  
  filterStringContains: function(record, value,column){
    var val=this.escapeRegExp(this.calcolateValue(value));
    var pattern = new RegExp('.*'+val+'.*','');
    return(record.get(column).match(pattern)!==null);
  },
  
  filterStringDoesntContains:function(record, value,column){
    return(!this.filterStringContains(record, value,column));
  },
  
  filterNumberEqual: function(record, value,column){
    var val;
    try {
      val=this.calcolateValueNumber(value);
    } catch (e){
      return(false);
    }
    return(record.get(column)===val);
  },
  
  filterNumberDifferent:function(record, value,column){
    return(!this.filterNumberEqual(record, value,column));
  },
  
  filterNumberGreater: function(record, value,column){
    var val;
    try {
      val=this.calcolateValueNumber(value);
    } catch (e){
      return(false);
    }
    return(record.get(column)>val);
  },
  
  filterNumberLessOrEqual: function(record, value,column){
    var val;
    try {
      val=this.calcolateValueNumber(value);
    } catch (e){
      return(false);
    }
    return(!this.filterNumberGreater(record, value,column));
  },
  
  filterNumberLess: function(record, value,column){
    var val;
    try {
      val=this.calcolateValueNumber(value);
    } catch (e){
      return(false);
    }
    return(record.get(column) < val);
  },
  
  filterNumberGreaterOrEqual: function(record, value,column){
    var val;
    try {
      val=this.calcolateValueNumber(value);
    } catch (e){
      return(false);
    }
    return(!this.filterNumberLess(record, value,column));
  },
  
  filterNumberRange: function(record, value,column){
    if(value.length!=2){
      return(false);
    }
    var matchLower=this.filterNumberGreaterOrEqual(record,[value[0]],column);
    var matchUpper=this.filterNumberLessOrEqual(record,[value[1]],column);
    return(matchLower && matchUpper);
  },
  
  filterDateEqual: function(record, value,column){
    var date;
    try {
      date=this.calcolateValueDate(value);
    } catch (e){
      return(false);
    }
    return(record.get(column).getTime()==date.getTime());
  },
  
  filterDateGreater: function(record, value,column){
    var date;
    try {
      date=this.calcolateValueDate(value);
    } catch (e){
      return(false);
    }
    return(record.get(column).getTime()>date.getTime());
  },
  
  filterDateLessOrEqual: function(record, value,column){
    var val;
    try {
      val=this.calcolateValueDate(value);
    } catch (e){
      return(false);
    }
    return(!this.filterDateGreater(record, value,column));
  },
  
  filterDateLess: function(record, value,column){
    var date;
    try {
      date=this.calcolateValueDate(value);
    } catch (e){
      return(false);
    }
    return(record.get(column).getTime() < date.getTime());
  },
  
  filterDateGreaterOrEqual: function(record, value,column){
    var date;
    try {
      date=this.calcolateValueDate(value);
    } catch (e){
      return(false);
    }
    return(!this.filterDateLess(record, value,column));
  },
  
  filterDateRange: function(record, value,column){
    if(value.length!=2){
      return(false);
    }
    var matchLower=this.filterDateGreaterOrEqual(record,[value[0]],column);
    var matchUpper=this.filterDateLessOrEqual(record,[value[1]],column);
    return(matchLower && matchUpper);
  },
  
  filterDatePeriod: function(record, value,column){
    if(value.length!=1){
      return(false);
    }
    var upper=new Date();
    upperValue={label: upper.format('Y-m-d H:i:s'),value:upper.format('Y-m-d H:i:s')};
    var lower;
    if(value[0].value==='LAST_YEAR'){
      lower=upper.add(Date.YEAR,-1);
    } else if (value[0].value==='LAST_MONTH'){
      lower=upper.add(Date.MONTH,-1);
    }else if (value[0].value==='LAST_WEEK'){
      lower=upper.add(Date.DAY,-7);
    }else if (value[0].value==='LAST_DAY'){
      lower=upper.add(Date.DAY,-1);
    }else if (value[0].value==='LAST_HOUR'){
      lower=upper.add(Date.HOUR,-1);
    }else if (value[0].value==='LAST_QUARTER'){
      lower=upper.add(Date.MINUTE ,-15);
    } else {
      return(false);
    }
    var lowerValue={label: lower.format('Y-m-d H:i:s'),value:lower.format('Y-m-d H:i:s')};
    return(this.filterDateRange(record, [lowerValue,upperValue],column));
  },
  
  apply : function(store){
    store.filterBy(this.filter,this);
  },
  
  filter: function(record,id,filterObj){
    if(filterObj==undefined)
      filterObj=this.filterModel.getFilterObj();
    if(filterObj==null)
      return(true);
    if(filterObj.operatorId!=undefined){
      var fn=this.mapping[filterObj.operatorId].fn;
      var scope=this.mapping[filterObj.operatorId].scope;
      if(scope===undefined || scope === null){
        scope=window;
      }
      toReturn=fn.call(scope,record,filterObj.values,filterObj.fieldId);
      return(toReturn);
    } else {
      var ret=this.filter(record,id,filterObj.left);
      if(ret===true && filterObj.logicalOperator===Ext.ux.netbox.core.CompositeFilter.OR)
        return true;
      if(ret===false && filterObj.logicalOperator===Ext.ux.netbox.core.CompositeFilter.AND)
        return(false);
      ret=this.filter(record,id,filterObj.right);
      return(ret);
    }
  }
}


Ext.namespace('Ext.ux.netbox');


Ext.ux.netbox.ContainerMenuItem=function(config){
  Ext.ux.netbox.ContainerMenuItem.superclass.constructor.call(this,config);
};

Ext.extend(Ext.ux.netbox.ContainerMenuItem, Ext.menu.Item,
{

  
  getSubMenu : function(){
    return this.menu;
  },

  
  setSubMenu : function(menu){
    this.menu = Ext.menu.MenuMgr.get(menu);
    if(this.getEl()){
      this.getEl().addClass('x-menu-item-arrow');
    }
  },

  
  removeSubMenu : function(){
    this.menu=undefined;
    if(this.getEl()){
      this.getEl().removeClass('x-menu-item-arrow');
    }
  }

});


Ext.namespace('Ext.ux.netbox');


Ext.ux.netbox.ContextMenuManager=function(config){

  this.menu=config.menu;
  
};

Ext.ux.netbox.ContextMenuManager.prototype=
{
  
  
  init: function(gridPanel){
    this.gridPanel=gridPanel;
    this.gridPanel.on("contextmenu",this.onContextmenu,this);
  },
  
  onCellcontextmenu : function(grid, rowIndex, cellIndex, e, menu){
    var menuUndefined=false;
    if(!menu){
      menuUndefined=true;
      if(!(this.menu instanceof Ext.menu.Menu)){
        this.menu=new Ext.menu.Menu(this.menu);
      }
      menu=this.menu;
    }
    e.stopEvent();
    var isSomethingVisible=false;
    for(var i=0;i<menu.items.getCount();i++){
      var itemTmp=menu.items.get(i);
      var scope=itemTmp.initialConfig.scope ? itemTmp.initialConfig.scope : window;
      var visible;
      if(itemTmp.initialConfig.isToShow){
        visible=itemTmp.initialConfig.isToShow.call(scope, grid, rowIndex, cellIndex);
        if(visible && itemTmp.menu){
          this.onCellcontextmenu(grid, rowIndex, cellIndex, e, itemTmp.menu);
        }
      } else {
        if(!itemTmp.menu){
          visible = (rowIndex >=0 && cellIndex>=0);
        } else {
          visible=this.onCellcontextmenu(grid, rowIndex, cellIndex, e, itemTmp.menu);
        }
      }
      if(visible){
        itemTmp.setVisible(true);
        if(itemTmp.initialConfig.handler){
          var handler=itemTmp.initialConfig.handler.createDelegate(scope,[grid, rowIndex, cellIndex],false);
          itemTmp.setHandler(handler);
        }
        isSomethingVisible=true;
      } else {
        itemTmp.setVisible(false);
      }
    }
    if(isSomethingVisible && menuUndefined){
      this.menu.showAt([e.getPageX(),e.getPageY()]);
    }
    return isSomethingVisible;
  },

  
  onContextmenu : function(e){
    var t = e.getTarget();
    var header = this.gridPanel.getView().findHeaderIndex(t);
    if(header !== false){
      return;
    }
    var row=-1;
    var col=-1;
    if(this.gridPanel.getView().findRowIndex(t)!==false){
      row=this.gridPanel.getView().findRowIndex(t);
    }
    if(this.gridPanel.getView().findCellIndex(t)!==false){
      col=this.gridPanel.getView().findCellIndex(t);
    }
    this.onCellcontextmenu(this.gridPanel,row,col,e);
  }

};


Ext.namespace('Ext.ux.netbox.core');


Ext.ux.netbox.core.QuickFilterModelView=function(config){

  this.addEvents({
    
    filterChanged : true
  });

  this.filterModel=config.filterModel;
  this.quickFilterItem=null;
  this.removeFilterItem=null;
  this.fieldsOptions=config.fieldsOptions;
  if(config.duplicatedElementaryFiltersAllowed === undefined){
    this.duplicatedElementaryFiltersAllowed=false;
  } else {
    this.duplicatedElementaryFiltersAllowed=config.duplicatedElementaryFiltersAllowed;
  }

  this.stringOperDefault = ['STRING_EQUAL','STRING_DIFFERENT'];
  this.numberOperDefault = ['NUMBER_EQUAL','NUMBER_NOT_EQUAL','NUMBER_GREATER','NUMBER_GREATER_OR_EQUAL','NUMBER_LESS','NUMBER_LESS_OR_EQUAL'];
  this.dateOperDefault = ['DATE_EQUAL','DATE_GREATER','DATE_GREATER_OR_EQUAL','DATE_LESS','DATE_LESS_OR_EQUAL'];
}

Ext.extend(Ext.ux.netbox.core.QuickFilterModelView, Ext.util.Observable,
{
  quickFilterText   : 'QuickFilter',
  removeText        : 'Remove filter',
  removeAllText     : 'Remove all',

  
  filterIsToShow: function(grid,row,column){
    if(column==-1 || this.getField(grid,column)==null){
      return false;
    }else{

      var itemsArray=[];
      var field=this.getField(grid,column);
      var availableOperatorsId;

      if(this.fieldsOptions){
        for(var i=0;i<this.fieldsOptions.length;i++){
          if(this.fieldsOptions[i].id===field.getId() && this.fieldsOptions[i].operators){
            availableOperatorsId=this.fieldsOptions[i].operators;
          }
        }
      }

      if(!availableOperatorsId){
        if(field instanceof Ext.ux.netbox.string.StringField || field instanceof Ext.ux.netbox.string.EnumField){
          availableOperatorsId=this.stringOperDefault;
        }else if(field instanceof Ext.ux.netbox.number.NumberField){
          availableOperatorsId=this.numberOperDefault;
        }else if(field instanceof Ext.ux.netbox.date.DateField){
          availableOperatorsId=this.dateOperDefault;
        }else{
          var availableOperators = field.getAvailableOperators();
          for(var i=0;i<availableOperators.length;i++){
            availableOperatorsId.push(availableOperators[i].getId());
          }
        }
      }

      for(var i=0;i<availableOperatorsId.length;i++){
        var isToAdd=true;
        var operator=field.getAvailableOperatorById(availableOperatorsId[i]);
        var filterItem = {
          text: Ext.util.Format.htmlEncode(operator.getLabel()),
          handler: this.setFilter.createDelegate(this,[grid,row,column,field.getId(),operator.getId()],false)
        };

        var filtersList=this.filterModel.getElementaryFiltersByFieldId(field.getId());
        var values=this.getValues(grid,row,column,field.getId(),operator.getId());
        for(var j=0;j<filtersList.length;j++){
          if(filtersList[j].getOperator().getId()===operator.getId() &&
          Ext.util.JSON.encode(filtersList[j].getValues())===Ext.util.JSON.encode(values))
            isToAdd=false;
        }
        if(operator.validate(values)!==true)
          isToAdd=false;

        if(isToAdd)
          itemsArray.push(filterItem);
      }

      if(itemsArray.length > 0){
        this.quickFilterItem.setSubMenu(new Ext.menu.Menu({items: itemsArray}));
        return true;
      } else {
        return false;
      }
    }
  },

  
  getValues: function(grid,row,column,fieldId,operatorId){
    var record=grid.getStore().getAt(row);
    var tableValue=record.get(grid.getColumnModel().getDataIndex(column));
    var getterFn;
    var getterScope;

    if(this.fieldsOptions){
      for(var i=0;i<this.fieldsOptions.length;i++){
        if(this.fieldsOptions[i].id===fieldId && this.fieldsOptions[i].getterFn){
          getterFn=this.fieldsOptions[i].getterFn;
          if(this.fieldsOptions[i].getterScope)
            getterScope=this.fieldsOptions[i].getterScope;
        }
      }
    }

    if(!getterFn){
      var field=this.getField(grid,column);
      var operator=field.getAvailableOperatorById(operatorId);

      if(operator instanceof Ext.ux.netbox.date.DateOperator && tableValue instanceof Date){
        getterFn=this.getValuesDate;
      }else{
        getterFn=this.getValuesOther;
      }
    }

    if(!getterScope)
      getterScope=this;

    var values=getterFn.call(getterScope,tableValue,fieldId,operatorId,grid,row,column);
    return values;
  },

  
  getValuesOther: function(tableValue,fieldId,operatorId,grid,row,column){
    var rendererFn=grid.getColumnModel().getRenderer(column);
    var record=grid.getStore().getAt(row);
    var label=rendererFn(tableValue,{},record, row,column,grid.getStore());
    return([{label: label, value: tableValue}]);
  },

  
  getValuesDate: function(tableValue,fieldId,operatorId,grid,row,column){
    var field=this.filterModel.getFieldManager().getFieldById(fieldId);
    var operator=field.getAvailableOperatorById(operatorId);
    return([{label: tableValue.format(operator.getFormat()), value: tableValue.format('Y-m-d H:i:s')}]);
  },

  
  setFilter: function(grid,row,column,fieldId,operatorId){
    var values=this.getValues(grid,row,column,fieldId,operatorId);
    var filterObject={fieldId : fieldId, operatorId : operatorId, values : values}
    var addFilter=true;
    if(!this.duplicatedElementaryFiltersAllowed){
      var elementaryFilters=this.filterModel.getElementaryFiltersByFieldId(fieldId);
      for(var i=0; i<elementaryFilters.length;i++){
        
        if(elementaryFilters[i].getOperator().getId()===operatorId
          && Ext.util.JSON.encode(elementaryFilters[i].getValues())===Ext.util.JSON.encode(values)){
            addFilter=false;
            break;
        }
      }
    }
    if(addFilter){
      this.filterModel.addElementaryFilter(filterObject);
      this.fireEvent('filterChanged');
    }
  },

  
  getFilterMenu: function(){
    if(this.quickFilterItem==null){
      this.quickFilterItem = new Ext.ux.netbox.ContainerMenuItem({
        text     : this.quickFilterText,
        isToShow : this.filterIsToShow,
        scope    : this
      });
    }
    return this.quickFilterItem;
  },

  
  getRemoveFilterMenu: function(){
    if(this.removeFilterItem==null){
      this.removeFilterItem = new Ext.ux.netbox.ContainerMenuItem({
        text     : this.removeText,
        isToShow : this.removeFilterIsToShow,
        scope    : this
      });
    }
    return this.removeFilterItem;
  },

  
  removeFilterIsToShow: function(grid,row,column){
    var filters=this.filterModel.getAllElementaryFilters();
    if(filters.length > 0){

      var itemsArray=[];

      for(var i=0;i<filters.length;i++){
        var label=filters[i].getField().getLabel()+' '+ filters[i].getOperator().getLabel()+' '+filters[i].getOperator().render(filters[i].getValues());
        var iconCls='';
        if(filters[i].isValid()!==true)
          iconCls='x-icon-invalid';
        var filterItem={
          iconCls  : iconCls,
          text     : label,
          handler  : this.removeFilterById.createDelegate(this,[filters[i].getId()],false),
          isToShow : function(){return(true);}
        };
        itemsArray.push(filterItem);
      }

      var removeAllFilterItem = {
        text    : this.removeAllText,
        handler : this.removeAllFilters,
        scope   : this,
        isToShow: function(){return(true);}
      };
      itemsArray.push(removeAllFilterItem);

      this.removeFilterItem.setSubMenu(new Ext.menu.Menu({items: itemsArray}));
      return true;
    }else{
      return false;
    }
  },

  
  removeAllFilters: function(){
    this.filterModel.setFilterObj(null);
    this.fireEvent('filterChanged');
  },

  
  removeFilterById: function(filterId){
    this.filterModel.removeElementaryFilterById(filterId);
    this.fireEvent('filterChanged');
  },

  
  getField: function(grid,column){
    var columnId=grid.getColumnModel().getDataIndex(column);
    var field=this.filterModel.getFieldManager().getFieldById(columnId);
    return field;
  }

});


Ext.namespace('Ext.ux.netbox');


Ext.ux.netbox.PreferenceManager=function(config){

  Ext.ux.netbox.PreferenceManager.superclass.constructor.call(this,config);

  this.addEvents({
    
    preferenceSaved: true,
    
    preferenceDeleteFailed: true,
    
    applyDefaultPreferenceFailed: true,
    
    applyPreferenceFailed: true,
    
    
    preferenceSaveFailed: true,
    
    
    preferenceDeleted : true,
    
    loadPreferencesFailed: true
  });
  
  this.id=config.id;
  
  this.userName=config.userName;
  
  this.setFn=config.setFn;
  
  this.getFn=config.getFn;
  
  this.fnScope=config.fnScope;
  
  this.getAllPrefURL=config.getAllPrefURL;
  
  this.applyDefaultPrefURL=config.applyDefaultPrefURL;
  
  this.loadPrefURL=config.loadPrefURL;
  
  this.savePrefURL=config.savePrefURL;
  
  this.deletePrefURL=config.deletePrefURL;
}

Ext.extend(Ext.ux.netbox.PreferenceManager, Ext.util.Observable,
{
  
  getAllPreferences : function(){
    if(this.store === undefined){
      this.store = new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({
          url: this.getAllPrefURL
        }),
        baseParams: {id: this.id, userName: this.userName},
        autoLoad: true,
        reader: new Ext.data.JsonReader({
          root: 'preferences',
          totalProperty: 'totalCount',
          fields: [
            'prefId',
            'prefName',
            'prefDesc',
            {name: 'isDefault', type: 'boolean'}
          ]
        })
      });
      this.store.on("loadexception",this._loadExceptionCbk,this);
      this.store.setDefaultSort('prefName');
    }
    return this.store;
  },
  
  
  _loadExceptionCbk: function(proxy, request, response){
    this.fireEvent("loadPreferencesFailed",response);
  },

  
  applyDefaultPreference : function(){
    Ext.Ajax.request({
       url: this.applyDefaultPrefURL,
       success: this.applyDefaultPreferenceCbk.createDelegate(this),
       failure: this.errorFunction.createDelegate(this),
       params: {
         id: this.id,
         userName: this.userName}
    });
  },

  
  applyPreference : function(prefId,prefValue){
    if(prefValue===undefined){
      Ext.Ajax.request({
         url: this.loadPrefURL,
         success: this.applyPreferenceCbk.createDelegate(this),
         failure: this.errorFunction.createDelegate(this),
         params: {
           id: this.id,
           userName: this.userName,
           prefId: prefId}
      });
    } else {
      this.setFn.call(this.fnScope,prefValue);
    }
  },
  
  
  applyDefaultPreferenceCbk : function(response,options){
    if(response.responseText!=""){
      this.applyPreferenceCbk(response,options);
    }
  },

  
  applyPreferenceCbk : function(response,options){
    var pref=Ext.util.JSON.decode(response.responseText);
    this.setFn.call(this.fnScope,pref);
  },

  
  savePreference : function(prefId,prefName,prefDesc,isDefault){
    var values=this.getFn.call(this.fnScope);
    var valueEnc=Ext.util.JSON.encode(values);
    var cfg={
       url: this.savePrefURL,
       params: {
         id: this.id,
         userName: this.userName,
         prefId:   prefId,
         prefName: prefName,
         prefDesc: prefDesc,
         prefValue: valueEnc,
         isDefault: isDefault
       },
       success: this._onSaveSuccessCbk.createDelegate(this),
       failure: this._onSaveFailureCbk.createDelegate(this)
    };
    Ext.Ajax.request(cfg);
  },

  
  _onSaveSuccessCbk : function(response,options){
    this.fireEvent('preferenceSaved',options.params.prefId,options.params.prefName);
  },

  
  _onSaveFailureCbk : function(response,options){
    this.fireEvent('preferenceSaveFailed',options.params.prefId, options.params.prefName,response);
  },

  
  deletePreferences : function(prefIdArray){
    var cfg={
       url: this.deletePrefURL,
       params: {
         id: this.id,
         userName: this.userName,
         prefIdArray: prefIdArray
       },
       success: this._onDeleteSuccessCbk.createDelegate(this),
       failure: this._onDeleteFailureCbk.createDelegate(this)
    };
    Ext.Ajax.request(cfg);
  },

  
  _onDeleteSuccessCbk : function(response,options){
    this.fireEvent('preferenceDeleted',options.params.prefIdArray,Ext.util.JSON.decode(response.responseText));
  },

  
  _onDeleteFailureCbk : function(response,options){
    this.fireEvent('preferenceDeleteFailed',options.params.prefIdArray,response);
  },
  
  
  errorFunction : function(response,options){
    if(options.params.prefId===undefined){
      this.fireEvent('applyDefaultPreferenceFailed',response);
    } else {
      this.fireEvent('applyPreferenceFailed',options.params.prefId,response);
    }
  }

});


Ext.namespace('Ext.ux.netbox');


Ext.ux.netbox.PreferenceManagerView = function(config){

  Ext.QuickTips.init();

  this.preferenceManager=config.preferenceManager;
  Ext.ux.netbox.PreferenceManagerView.superclass.constructor.call(this,config);
  this.preferenceManager.on("preferenceSaved",this.onPreferenceSaved,this);
  this.preferenceManager.on("preferenceDeleted",this.onPreferenceDeleted,this);
  this.preferenceManager.on("loadPreferencesFailed",this.resetMenu,this);
  if(config.defaultErrorHandling===undefined || config.defaultErrorHandling){
    new Ext.ux.netbox.DefaultPreferenceManagerErrorManager(this.preferenceManager);
  }

  this.on('show',this.loadRemotePref, this, {single: true});
};

Ext.extend(Ext.ux.netbox.PreferenceManagerView, Ext.menu.Menu,
{
  addText           : 'Add preference',
  addTooltipText    : 'Save the actual configuration',
  manageText        : 'Manage preferences',
  manageTooltipText : 'Manage the saved configurations',
  okText            : 'OK',
  cancelText        : 'Cancel',
  modifyText        : 'Modify preference',
  modifyBtnText     : 'Modify',
  deleteBtnText     : 'Delete',
  closeBtnText      : 'Close',
  nameText          : 'Name',
  descText          : 'Description',
  defaultText       : 'Default',
  loadingText       : 'Loading...',

  
  loadRemotePref : function(){
    if(this.prefStore===undefined){
      this.prefStore=this.preferenceManager.getAllPreferences();
      this.prefStore.on('load', this.loadRemotePrefAsync, this);
      this.prefStore.on('beforeload', this.beforeLoad, this);
      this.createStableItems();
    } 
    this.prefStore.load();
  },
  
  createStableItems: function(){
    if(this.items.getCount()==0){
      this.add(
        {text:this.addText, tooltip:this.addTooltipText, handler:this.addPreference, scope:this},
        {text:this.manageText, tooltip:this.manageTooltipText, handler:this.showManageDialog, scope:this},
        '-');
    }
  },
  beforeLoad: function(){
    this.resetMenu();
    this.getEl().mask(this.loadingText);
  },
  
  resetMenu: function(){
    if(this.getEl() && this.getEl().isMasked())
      this.getEl().unmask();
    for(var i=this.items.getCount()-1; i>=0;i--){
      if(this.items.get(i).removable===true){
        if(this.items.get(i).getEl() && this.items.get(i).getEl().isMasked())
          this.items.get(i).getEl().unmask();
        this.remove(this.items.get(i));
      }
    }
  },
    

  
  loadRemotePrefAsync : function(){
    this.resetMenu();
    for(var i=0;i<this.prefStore.getTotalCount();i++){
      var rec=this.prefStore.getAt(i);
      var iconCls='';
      if(rec.get('isDefault')==true)
        iconCls='x-icon-checked';
      this.add({
        id:      rec.get('prefId'),
        text:    rec.get('prefName'),
        tooltip: rec.get('prefDesc'),
        iconCls: iconCls,
        handler: this.applyPreference,
        scope:   this,
        removable: true});
    }
  },

  
  addPreference : function(){
    this.showAddDialog('','','',false);
  },

  
  managePreference : function(){
    selModel=this.manageGridPanel.getSelectionModel();
    record=selModel.getSelected();
    if(record)
      this.showAddDialog(record.get('prefId'),record.get('prefName'),record.get('prefDesc'),record.get('isDefault'));
  },

  
  deletePreferences : function(){
    selModel=this.manageGridPanel.getSelectionModel();
    records=selModel.getSelections();
    if(records.length>0){
      var prefIdArray=[];
      for(var i=0;i<records.length;i++){
        prefIdArray.push(records[i].get('prefId'));
      }
      this.preferenceManager.deletePreferences(prefIdArray);
    }
  },
  
  
  showAddDialog : function(prefId,prefName,prefDesc,isDefault){
    if(!this.addDialog){
      this.addDialog = new Ext.Window({
        width:       400,
        height:      160,
        minWidth:    400,
        minHeight:   160,
        closeAction: 'hide',
        layout:      'fit',
        plain:       true,
        modal:       true,
        shadow:      true,

        items: this.addForm = new Ext.form.FormPanel({
          labelWidth: 75,
          border:     false,
          bodyStyle: 'background-color:transparent;padding:10px; ',
          items: [{
              id:         'prefId',
              xtype:      'hidden',
              name:       'prefId',
              value:      prefId
            },{
              id:         'prefName',
              xtype:      'textfield',
              fieldLabel: this.nameText,
              name:       'prefName',
              value:      prefName,
              allowBlank: false,
              width:      '96%'
            },{
              id:         'prefDesc',
              xtype:      'textfield',
              fieldLabel: this.descText,
              name:       'prefDesc',
              value:      prefDesc,
              width:      '96%'
            },{
              id:         'isDefault',
              xtype:      'checkbox',
              fieldLabel: this.defaultText,
              name:       'isDefault',
              value:      isDefault
          }]
        }),

        buttons: [{
          text:    this.okText,
          handler: this.savePreference,
          scope:   this
        },{
          text:    this.cancelText,
          handler: function(){this.addDialog.hide();},
          scope:   this
        }]
      });
    } else {
      this.addForm.findById('prefId').setValue(prefId);
      this.addForm.findById('prefName').setValue(prefName);
      this.addForm.findById('prefDesc').setValue(prefDesc);
      this.addForm.findById('isDefault').setValue(isDefault);
    }
    if(prefId!='')
      this.addDialog.setTitle(this.modifyText);
    else
      this.addDialog.setTitle(this.addText);
    
    this.addDialog.show();
  },

  
  showManageDialog : function(){
    if(!this.manageDialog){
      this.manageDialog = new Ext.Window({
        title:       this.manageText,
        width:       600,
        height:      300,
        minWidth:    500,
        minHeight:   250,
        closeAction: 'hide',
        layout:      'fit',
        plain:       true,
        modal:       true,
        shadow:      true,

        items: this.manageGridPanel = new Ext.grid.GridPanel({
          store:   this.prefStore,
          border:  false,
          enableColumnHide: false,
          columns: [{
              id: 'prefId',
              hidden: true,
              dataIndex: 'prefId'
            },{
              id:'prefName',
              header: this.nameText,
              sortable: true,
              dataIndex: 'prefName',
              width: 200
            },{
              id:'prefDesc',
              header: this.descText,
              sortable: true,
              dataIndex: 'prefDesc',
              width: 330
            },{
              id:'isDefault',
              header: this.defaultText,
              sortable: true,
              dataIndex: 'isDefault',
              width: 60,
              renderer: this.imageRenderer
            }
          ],

          viewConfig: {
              forceFit: true
          },

          tbar:[{
              text: this.modifyBtnText,
              cls:  'x-btn-text-icon',
              iconCls: 'x-icon-modify',
              handler: this.managePreference,
              scope: this
          }, '-', {
              text: this.deleteBtnText,
              cls:  'x-btn-text-icon',
              iconCls: 'x-icon-delete',
              handler: this.deletePreferences,
              scope: this
          }, '-', {
              text: this.closeBtnText,
              cls:  'x-btn-text-icon',
              iconCls: 'x-icon-cancel',
              handler: function(){this.manageDialog.hide();},
              scope: this
          }]
        })
      })
    }
    this.manageDialog.show();
  },

  
  imageRenderer : function(value, metadata, record, rowIndex, colIndex, store){
    if(value==true)
      return('<img class="x-menu-item-icon x-icon-checked" src="'+Ext.BLANK_IMAGE_URL+'"/>');
  },

  
  applyPreference : function(item, event){
    this.preferenceManager.applyPreference(item.getId());
  },

  
  savePreference : function(){
    var prefId = this.addForm.findById('prefId');
    var prefName = this.addForm.findById('prefName');
    var prefDesc = this.addForm.findById('prefDesc');
    var isDefault = this.addForm.findById('isDefault');
    if (prefName.isValid()){
      this.preferenceManager.savePreference(prefId.getValue(),prefName.getValue(),prefDesc.getValue(),isDefault.getValue());
    }
  },

  
  onPreferenceSaved : function(prefName,response){
    this.prefStore.reload();
    this.addDialog.hide();
  },

  
  onPreferenceDeleted : function(prefIdArray){
    this.prefStore.reload();
  }

});


Ext.menu.BaseItem.prototype.onRender = function(container){
  this.el = Ext.get(this.el);
  container.dom.appendChild(this.el.dom);
  if (this.tooltip) {
   this.el.dom.qtip = this.tooltip;
  }
};



Ext.ux.netbox.DefaultPreferenceManagerErrorManager=function(preferenceManager){
  preferenceManager.on("applyDefaultPreferenceFailed",this.manageApplyDefaultPreferenceFailed,this);
  preferenceManager.on("applyPreferenceFailed",this.manageApplyPreferenceFailed,this);
  preferenceManager.on("loadPreferencesFailed",this.manageLoadPreferencesFailed,this);
  preferenceManager.on("preferenceDeleteFailed",this.manageDeletePreferencesFailed,this);
  preferenceManager.on("preferenceSaveFailed",this.manageSavePreferenceFailed,this);
}

Ext.ux.netbox.DefaultPreferenceManagerErrorManager.prototype= {
  
  failedToApplyDefaultPreferenceTitle: "Error applying default preference",
  
  failedToApplyPreferenceTitle: "Error applying preference",
  
  failedToSavePreferenceTitle: "Error saving preference",
  
  failedToDeletePreferenceTitle: "Error deleting preference(s)",
  
  failedToLoadPreferenceTitle: "Error loading preferences",
  
  manageApplyDefaultPreferenceFailed: function(response){
    this.manageError(this.failedToApplyDefaultPreferenceTitle,response.responseText);
  },
  
  manageApplyPreferenceFailed: function(prefId,response){
    this.manageError(this.failedToApplyPreferenceTitle,response.responseText);
  },
    
  manageSavePreferenceFailed: function(prefId,prefName,response){
    this.manageError(this.failedToSavePreferenceTitle,response.responseText);
  },
    
  manageDeletePreferencesFailed: function(prefIdsArray,response){
    this.manageError(this.failedToDeletePreferenceTitle,response.responseText);
  },
    
  manageLoadPreferencesFailed: function(response){
    this.manageError(this.failedToLoadPreferenceTitle,response.responseText);
  },
  
  manageError: function(title,message){
    Ext.MessageBox.show({
           title: title,
           msg: message,
           buttons: Ext.MessageBox.OK,
           icon: Ext.MessageBox.ERROR,
           minWidth: 200
       });
  }
};


Ext.namespace('Ext.ux.netbox.core');


Ext.ux.netbox.core.FilterHeaderPlugin = function(filterModel){
  this.filterModel = filterModel;
};

Ext.ux.netbox.core.FilterHeaderPlugin.prototype = {

  
  filterCls: 'ux-filtered-column',

  
  init : function(grid) {
    this.grid = grid;
    grid.on("render", this.onRender, this);
  },

  
  onRender: function(){
    this.grid.getView().on("refresh", this.onRefresh, this);
    this.updateColumnHeadings(this.grid.getView());
  },

  
  onRefresh: function(view){
    this.updateColumnHeadings(view);
  },

  
  updateColumnHeadings: function(view){
    if(!view || !view.mainHd) return;
    var hds = view.mainHd.select('td').removeClass(this.filterCls);
    for(var i=0, len=view.cm.config.length; i<len; i++){
      var filters = this.filterModel.getElementaryFiltersByFieldId(view.cm.config[i].dataIndex);
      for(var j=0;j<filters.length;j++){
        if(filters[j].isValid()===true){
          hds.item(i).addClass(this.filterCls);
          break;
        }
      }
    }
  }

};
