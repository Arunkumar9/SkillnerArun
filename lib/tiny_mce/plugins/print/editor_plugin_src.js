/**
 * $Id: editor_plugin_src.js 2348 2013-12-20 10:20:54Z arun $
 *
 * @author Moxiecode
 * @copyright Copyright © 2004-2008, Moxiecode Systems AB, All rights reserved.
 */

(function() {
	tinymce.create('tinymce.plugins.Print', {
		init : function(ed, url) {
			ed.addCommand('mcePrint', function() {
				ed.getWin().print();
			});

			ed.addButton('print', {title : 'print.print_desc', cmd : 'mcePrint'});
		},

		getInfo : function() {
			return {
				longname : 'Print',
				author : 'Moxiecode Systems AB',
				authorurl : 'http://tinymce.moxiecode.com',
				infourl : 'http://wiki.moxiecode.com/index.php/TinyMCE:Plugins/print',
				version : tinymce.majorVersion + "." + tinymce.minorVersion
			};
		}
	});

	// Register plugin
	tinymce.PluginManager.add('print', tinymce.plugins.Print);
})();
