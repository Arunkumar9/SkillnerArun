Ext.namespace('Ext.ux.form');

Ext.ux.form.CodeMirror = Ext.extend(Ext.form.TextArea, {
    language: 'txt',
    codeMirrorHidden: false,
    codeMirrorPath: null, // should be path to code mirror on your server!

    initCallBackFn: null, // Executes right after the init from codemirror
    onResizeCallBackFn: null, // If we need our own resize function

    initComponent: function() {
    if (this.codeMirrorPath === null) {
        throw 'Ext.ux.form.CodeMirror: codeMirrorPath required';
    }
    this.initialized = false;
    Ext.ux.form.CodeMirror.superclass.initComponent.apply(this, arguments);
    this.addEvents('initialize');
    this.on({
        resize: function(ta, width, height) {
        if (this.onResizeCallBackFn)
            this.onResizeCallBackFn(this);
        else {
            var el = Ext.select('.'+this.id, true);
            var lineNumbersEl = Ext.select("."+this.id+" ~ div", true); // the lineNumbersEl is always the next div from the iframe
// 
            // Sometimes it happens in air that width or height from the resize event is undefined...
            if (!width)
            width = ta.getSize().width;
            if (!height)
            height = ta.getSize().height;
            //...but we got it back from the container

            if (el){
            // If we find the lineNumbersEl we subtract the width
            if ( this.initialized && !this.codeMirrorHidden && count(lineNumbersEl.elements) > 0 && width )
                width = width - lineNumbersEl.elements[0].getWidth();
            Ext.select(".CodeMirror-wrapping").setSize(width,height);
            for (var i=0; i< el.elements.length; i++)
            {
                // It should not but it could be that the width or height is undefined.. i realy have no plan why this
                // happens in Air. However we set what isn't undefined
                if (width)
                el.elements[i].setWidth(width);
                if (height)
                el.elements[i].setHeight(height);

                // On resize we set the height for the line numbers element too
                lineNumbersEl.elements[i].setHeight(height);
            }
            }
        }
        },
        render: function() {
        var parser, stylesheet;
        switch (this.language.toLowerCase()) {
            case 'json':
            parser = ['tokenizejson.js', 'parsejson.js'];
            stylesheet = this.codeMirrorPath+'/css/jsoncolors.css';
            break;
            case 'css':
            parser = 'parsecss.js';
            stylesheet = this.codeMirrorPath+'/css/csscolors.css';
            break;
            case 'js':
            parser = ['tokenizejavascript.js', 'parsejavascript.js'];
            stylesheet = this.codeMirrorPath+'/css/jscolors.css';
            break;
            case 'php':
            parser = [
            "parsexml.js",
            "parsecss.js",
            "tokenizejavascript.js",
            "parsejavascript.js",
            "../contrib/php/js/tokenizephp.js",
            "../contrib/php/js/parsephp.js",
            "../contrib/php/js/parsephphtmlmixed.js"
            ];
            stylesheet = [
            this.codeMirrorPath+'/css/xmlcolors.css',
            this.codeMirrorPath+'/css/jscolors.css',
            this.codeMirrorPath+'/css/csscolors.css',
            this.codeMirrorPath+'/contrib/php/css/phpcolors.css'
            ];
            break;
            case 'htm':
            case 'html':
            case 'xml':
            parser = 'parsexml.js';
            stylesheet = this.codeMirrorPath + '/css/xmlcolors.css';
            break;
            default:
            parser = 'parsedummy.js';
            stylesheet = '';
            break;

        }
        var me = this;
        (function() {
            me.codeEditor = new CodeMirror.fromTextArea(me.id, {
            parserfile: parser,
            stylesheet: stylesheet,
            path: me.codeMirrorPath+'/js/',
            /*textWrapping: true,
            autoMatchParens: true,
            lineNumbers: true,*/
            //continuousScanning: true,
            /*passDelay: 100,
            passTime: 50,
            lineNumberDelay: 1000,
            lineNumberTime: 50,*/
            iframeClass: 'codemirror-iframe '+me.id,
            content: this.value,
            /*parserConfig: {
                json: true
            },
            lang: me.language.toLowerCase(),*/
            initCallback: function() {
                me.initialized = true;
                me.fireEvent('initialize', true);

                if (me.initCallBackFn != null)
                me.initCallBackFn(me);

                if (me.codeMirrorHidden)
                me.hideCodeMirror();
            }
            });
        }).defer(100);
        }
    });
    },
    getValue: function() {
    var v;

    if (this.initialized) {
        if ( this.codeMirrorHidden )
        return this.getTextareaValue();
        else {
            v = this.codeEditor.getCode();
            //Ext.form.TextField.superclass.setValue.apply(this, [v]);
            return v;
        }
    }
    return this.value;
    },
    setValue: function(v) {
    if (this.initialized) {

        if (this.codeMirrorHidden)
        this.setTextareaValue(v)
        else
        this.codeEditor.setCode(v);
    } else {
        Ext.form.TextField.superclass.setValue.apply(this, [v]);
    }

    },
    getTextareaValue : function(){
    if(!this.rendered) {
        return this.value;
    }
    var v = this.el.getValue();
    if(v === this.emptyText || v === undefined){
        v = '';
    }
    return v;
    },
    setTextareaValue : function(v){
    if(this.emptyText && this.el && !Ext.isEmpty(v)){
        this.el.removeClass(this.emptyClass);
    }
    Ext.form.TextField.superclass.setValue.apply(this, arguments);
    this.applyEmptyText();
    this.autoSize();
    return this;
    },
    hideCodeMirror: function () {
    var me = this;
    var iframeEl = Ext.select('.'+this.id, true);
    var textareaEl = Ext.select("textarea#" + me.id, true);

    textareaEl.setVisibilityMode(Ext.Element.DISPLAY);
    iframeEl.setVisibilityMode(Ext.Element.DISPLAY);

    me.setTextareaValue( me.getValue() );

    iframeEl.setVisible(false);
    textareaEl.setVisible(true);

    me.codeMirrorHidden = true;
    },
    showCodeMirror: function () {
    var me = this;
    var iframeEl = Ext.select('.'+this.id, true);
    var textareaEl = Ext.select("textarea#" + me.id, true);

    textareaEl.setVisibilityMode(Ext.Element.DISPLAY);
    iframeEl.setVisibilityMode(Ext.Element.DISPLAY);

    textareaEl.setVisible(false);
    iframeEl.setVisible(true);

    me.codeMirrorHidden = false;

    me.setValue( this.getTextareaValue() );
//    me.setTextareaValue( '' );
    },
    validate: function() {
    this.setRawValue(this.getValue());
    return Ext.ux.form.CodeMirror.superclass.validate.apply(this, arguments);
    }
    ,saveFunction: function() {
      me.fireEvent('save', true);
}
});
Ext.reg('ux-codemirror', Ext.ux.form.CodeMirror);

Ext.ux.form.CommonCodeMirror = Ext.extend(Ext.ux.form.CodeMirror, {
    language: 'html',
    codeMirrorPath: 'lib/CodeMirror'
});

Ext.reg('ccodemirror', Ext.ux.form.CommonCodeMirror);


/*
 *
 *
 * {
  xtype: 'ux-codemirror',
  codeMirrorPath: 'path_to_codemirror_on_server',
  language: 'js', // possibilities: 'js', 'css', 'php', 'htm', 'html', 'xml', anything else is plain text
  listeners: { // optional
    init: function() {
    }
  }
}
 */