/**
 * 
 * 
 *  * @author rosa
 */
Ext.namespace('Fresh');
Fresh.FHtmlEdit = Ext.extend(Ext.form.HtmlEditor,{
    /**
     * Protected method that will not generally be called directly. It
     * is called when the editor initializes the iframe with HTML contents. Override this method if you
     * want to change the initialization markup of the iframe (e.g. to add stylesheets).
     */
    getDocMarkup : function(){
        return '<html><head><link href="themes/Basic/mainLayoutStyles.css" type="text/css" rel="stylesheet"><style type="text/css">table{width:100%;} body{font-size:8pt;border:0;margin:0;padding:3px;height:98%;cursor:text;}</style></head><body></body></html>';
    }
});    

Fresh.InlineEditor = function() {

	var form;
	var el; 
	var chooser;
	
	var doOK = function() {
		jQuery(this.el).siblings('.fresh-content-value').html(this.ed.getRawValue()); 
		jQuery(this.el).parent().show(); b.destroy(); c.destroy(); 
		jQuery('#editor-ct').parents('.x-html-editor-wrap').remove(); 
		jQuery('#button-ct').remove();
		//this.form.submit({url: 'index.php', params: 'json=recordConvertor&uid='+this.el.parent().data().Uid+'&action=store&record=ContentRecord', waitMsg: 'Saving'}); //this.config.waitMsgStore
	}
	
	var sendRequest = function(dataString) {
/*
				Ext.lib.Ajax.request(
            		'POST',
            		'index.php',
            	    { success: function(x) { 
            	    		o = Ext.decode(x.responseText); 
							if (o.success)
	            	    		jQuery(el).siblings('.fresh-content-value').empty().html(o.data[0].value);  
							else
								Ext.MessageBox.alert("Chyba při ukládání!",o.message);
            	    		} , 
            	      failure: function() { Ext.Msg.Alert("Chyba při ukládání!"); }
            	     },
            		'json=recordConvertor&uid='+el.parent().data().Uid+'&action=store&record='+el.parent().data().RecordClass+'&field='+el.parent().data().Field+'&data='+encodeURIComponent(dataString)
        		);

*/				var options = {
					url: 'index.php'
            	    ,success: function(x) { 
            	    		o = Ext.decode(x.responseText); 
							if (o.success)
	            	    		jQuery(el).siblings('.fresh-content-value').empty().html(o.data[0].value);  
							else
								Ext.MessageBox.alert("Chyba při ukládání!",o.message);
            	    		}
            	    ,failure: function() { Ext.Msg.Alert("Chyba při ukládání!"); }
					,params: {
            			json: 'recordConvertor'
						,uid: el.parent().data().Uid
						,action: 'store'
						,record: el.parent().data().RecordClass
						,field: el.parent().data().Field
						,type: el.parent().data().Type
						,data: dataString //encodeURIComponent(dataString)
					}
				}
				var conn = new Ext.data.Connection().request(options);
	}
	
	return {
        init: function() {
			  Ext.QuickTips.init();
			  var forms = Ext.query('FORM');
			  this.form = new Ext.form.BasicForm(forms[0].id,{
        		url:'index.php'
	    	  });	
			  var ee = jQuery('.fresh-editable');
			  ee.append('<img src="/FreshSystem/images/icons/fam/pencil.png" style="position:absolute;z-index:1000" class="fresh-EditImg" />');
//			  ee.append('<img src="/FreshSystem/images/icons/fam/pencil.png" style="float: right; clear: both; z-index:10000" class="fresh-EditImg" />');
			  var ei = jQuery('.fresh-EditImg');
			  ei.each(function() {
			    var pa = jQuery(this).parent();
			    var el = Ext.get(pa.attr('id'));
				var l = jQuery(this).siblings('.fresh-content-value').children().length;
			    var mustr = null;
				if (l > 1 || l == 0) {
				  mustr = el.child('.fresh-content-value');
			    } else {
				  mustr = el.child('.fresh-content-value *');
				  if (mustr.getWidth() == 0) {
					  mustr = el.child('.fresh-content-value');
				  }
			    }
			    var d= jQuery(this).parent().data();
				jQuery(this).attr('id',d.Type+'-'+d.Uid);
				Ext.get(this).anchorTo(mustr,'tr-tl',[-2,0]).initDD();
			    Ext.QuickTips.register({width: 100, target: d.Type+'-'+d.Uid,title: d.Name, text: 'uid:'+d.Uid+'<br>typ: '+d.Desc});
			  });
			  ei.click(function() { 
			    Fresh.InlineEditor.show(jQuery(this));
			  });
			  jQuery('.fresh-EditImg').hover(function() { 
			    var pa = jQuery(this).parent();
			    var el = Ext.get(pa.attr('id'));
			    pa.after('<div id="hover-box" style="border: 2px dotted #222222; position: absolute;"></div>');
			    var bel = Ext.get('hover-box');
				var l = jQuery(this).siblings('.fresh-content-value').children().length;
			    var mustr = null;
				if (l > 1 || l == 0) {
				  mustr = el.child('.fresh-content-value');
			    } else {
				  mustr = el.child('.fresh-content-value *');
				  if (mustr.getWidth() == 0) {
					  mustr = el.child('.fresh-content-value');
				  }
			    }
//				ml = mustr.getStyle('margin-left');
//				mt = mustr.getStyle('margin-top');
//				fl = mustr.getStyle('float');
			    bel.alignTo(mustr,'c-c');//,[-4,-4]);
//		        bel.setWidth(mustr.getWidth()+10,true);
//		        bel.setHeight(mustr.getHeight()+10,true);
				w = mustr.getWidth();
				h = mustr.getHeight();
				cx = bel.getX()- w*0.5;
				cy = bel.getY()- h*0.5;
				bel.shift({
   					width: w+10,
				    height: h+10, 
					x: cx, y: cy,
				    easing: 'easeOut',
				    duration: .35
				});
//				if (fl == 'right') {
//				    bel.alignTo(mustr,'tr-tr',[0,0]);
					
//					bel.setStyle('right', 'right');
//				}
//				console.log(Ext.encode(mustr.getRegion()));
			  },
			  function() { 
			    jQuery('#hover-box').remove();
			  });
        },
        show: function(ele) {
			el = ele;
			type = el.parent().data().Type;
			eval('this.'+type+'()');
        },
        ProductImage:  function() {
			if(!this.chooser){
				el.parent().after('<div id="chooser-ct"></div>');
    			this.chooser = new ImageChooser({
    				url:'index.php?json=imagesProvider',
//					params: {album: a },
    				width:515, 
    				height:400
    			});
    		}
    		this.chooser.show('chooser-ct', this.insertImage);        	
        },
        insertImage:  function(data) {
			sendRequest(data.url);
         },
        LinkFile:  function() {
			if(!this.linkchooser){
				el.parent().after('<div id="link-chooser-ct"></div>');
    			this.linkchooser = new Fresh.LinkChooser({
    				url:'index.php?panel=Resources&json=fileProvider'
    			});
    		}
    		this.linkchooser.show('link-chooser-ct', this.insertFile, el.parent().data());        	
        },
        insertFile:  function(data) {
			sendRequest(Ext.encode(data));
         },
        ProductTable: function() {
			this.insertText(true);        	
        },
        ProductTableChem: function() {
			this.insertText(true);        	
        },
        ProductText: function() {
			this.insertText(true);        	
        },
        ContainerName: function() {
			this.insertText(false,50);        	
        },
        sourceText: function() {
			this.insertText(false,200);        	
        },
        insertText: function(htmlEdit,editHeight) {
			editHeight = editHeight || 200;
			jQuery('.fresh-editable').show();
		    jQuery('#editor-ct').parents('.x-html-editor-wrap').remove(); 
		    jQuery('#editor-ct').remove(); 
		    jQuery('#button-ct,#button-br').remove();
		    el.parent().hide().after('<textarea id="editor-ct" style="clear: both"></textarea><div id="button-ct" style="float: left; clear: both;"><div id="button-save-ct" style="float:left"></div><div id="button-cancel-ct" style="float:left"></div></div><br id="button-br" style="clear: both">');
		    
			if (htmlEdit) {
		    	ed =  new Fresh.FHtmlEdit({ //new Ext.form.HtmlEditor({
		            id:el.parent().data().Field,
		            width:500,
		            height:editHeight,
		            enableSourceEdit: true,enableFont: false,enableFontSize: false,enableLinks: true,
		            enableFormat: true,enableLists: false,enableAlignments: false,
		            enableColors: false
		        });
			} else {
				ed =  new Ext.form.TextField({	
		            id:el.parent().data().Field,
		            width:500,
		            height:editHeight,
					fieldLabel: '',
					allowBlank: true,
		            name: el.parent().data().Field,
					validateOnBlur: false
		        });
			}
		    ed.applyTo('editor-ct');
		    this.form.add(ed);
		//	this.form.waitMsgTarget = pa.attr('id');
		    this.load(el.parent().data());    
		    b = new Ext.Button('button-save-ct',{text: 'Save'});
		    c = new Ext.Button('button-cancel-ct',{text: 'Cancel'});
		    b.on('click', function() {
				sendRequest(ed.getRawValue());
				this.clean();
		    } ,this);
		    c.on('click',this.clean,this);
        }, 
		clean : function() {
		    	jQuery(el).parent().show(); 
		    	b.destroy(); c.destroy(); 
		    	jQuery('#editor-ct').parents('.x-html-editor-wrap').remove(); 
			    jQuery('#editor-ct').remove(); 
		    	jQuery('#button-ct,#button-br').remove(); 
		},
        load : function(d) {
				this.form.load({url:'index.php', params: 'json=recordConvertor&uid='+d.Uid+'&action=load&record='+d.RecordClass+'&field='+d.Field, waitMsg: 'Loading' });
		}
	}
}();

Ext.onReady(function() {
	  Fresh.InlineEditor.init();
});

 