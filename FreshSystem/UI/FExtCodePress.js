/**
 * 
 * 
 *  * @author rosa
 */
Ext.namespace('Fresh');

Fresh.FExtCodePress =  function() {

	var config = {
		url: 'index.php'
	  , saveParams:  { json: 'fileProvider', cmd: 'fileSave'  }
	  , readParams:  { json: 'fileProvider', cmd: 'fileRead'  }		
	}

	var cdiv = Ext.DomHelper.append(document.body, {tag: 'div',id:'center'+Fresh.PANEL_COUNT,visibility: 'hidden'});
	var tbdiv = Ext.DomHelper.insertFirst(cdiv, {tag: 'div', id:'center'+Fresh.PANEL_COUNT+'-toolbar'});
	var fdiv = Ext.DomHelper.append(cdiv, {tag: 'div', id:'center'+Fresh.PANEL_COUNT+'-form'});


//	var ta = Ext.DomHelper.append(cdiv, {tag: 'textarea'
//								, style: 'width: 100%'
//								, name:'center'+Fresh.PANEL_COUNT+'-textarea'
//								, class: 'x-form-textarea x-form-field'
//								, id:'center'+Fresh.PANEL_COUNT+'-textarea'});


	// create the primary toolbar
    var tb = new Ext.Toolbar('center'+Fresh.PANEL_COUNT+'-toolbar');
    tb.add({
        id:'save',
        text:'Uložit',
        handler:nodeReload,
        cls:'x-btn-text-icon save',
        tooltip:'Uložit soubor'
    },'-',{
        id:'undo',
        handler:undo,
        cls:'x-btn-text-icon undo',
        text:'Rozbalit vše',
        tooltip:'Krok zpět'
/*
    },'-',{
        id:'collapse',
        handler:collapseAll,
        cls:'x-btn-text-icon collapse-all',
        text:'Sbalit vše',
        tooltip:'Sbalit všechny strany'

*/    });
	
    // for enabling and disabling
    var btns = tb.items.map;
	
		
	//alert('node open '+mode);

	
	simple = new Ext.form.Form({
	    labelWidth: 0,
	    url: this.config.url
	});
	simple.add(		
	    new Ext.form.TextArea({
	        fieldLabel: '',
	        name: 'contents',
	        id: 'center'+Fresh.PANEL_COUNT+'-textarea',
	        fieldClass: 'codepress x-form-field '
	    })		
	);

	simple.render('center'+Fresh.PANEL_COUNT+'-form');
//	simple.load({url:this.config.url, params: this.config.loadParams+'&uid='+this.config.uid+'&record='+this.config.recordClass, waitMsg: this.config.waitMsgLoad });

	var mainLayout = Fresh.Layout;
	mainLayout.beginUpdate();
		mainLayout.add('center', centerPanel1 = new Ext.ContentPanel('center'+Fresh.PANEL_COUNT, {
     		autoScroll: true, title: n.text, closable: true
        }));
		mainLayout.getRegion('center').showPanel('center'+Fresh.PANEL_COUNT);

	mainLayout.endUpdate();
    setTimeout(function(){
		Fresh.PANEL_COUNT = 1 + Fresh.PANEL_COUNT;
    }, 10);

			
		
		
		

}

