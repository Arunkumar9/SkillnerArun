    <!-- DESKTOP -->
    <script type="text/javascript" src="lib/desktop/source/login/cookies.js"></script>
<!--    <script type="text/javascript" src="lib/ext/ux/GridSearch/Ext.ux.util.js"></script>
     <script type="text/javascript" src="lib/desktop/source/core/Config.js"></script> -->
    <script type="text/javascript" src="lib/desktop/source/core/3/StartMenu.js"></script>
    <script type="text/javascript" src="lib/desktop/source/core/3/TaskBar.js"></script>
    <script type="text/javascript" src="lib/desktop/source/core/Desktop.js"></script>
    <script type="text/javascript" src="lib/desktop/source/core/App.js"></script>
    <script type="text/javascript" src="lib/desktop/source/core/Module.js"></script>
    <script type="text/javascript" src="lib/desktop/source/core/DesktopConfig.js"></script>
    <script type="text/javascript" src="/index.php?json=direct&direct=api"></script>
    
    <!-- DESKTOP HELPERS -->
    <script type="text/javascript" src="lib/cherry.svn/cherryonext-debug.js"></script>
    <script type="text/javascript" src="lib/ext/ux/Fresh.SmartLoader.js"></script>
    <script type="text/javascript" src="lib/ext/ux/Ext.ux.MsgBus.js"></script>
    <script type="text/javascript" src="lib/ext/ux/Multiselect/DDView.js"></script>
    <script type="text/javascript" src="lib/ext/ux/Multiselect/Multiselect.js"></script>
    <script type="text/javascript" src="lib/ext/ux/radiogroup.js"></script>
    <script type="text/javascript" src="lib/ext/ux/RemoteComponent/Ext.ux.Plugin.RemoteComponent.js"></script>
    <script type="text/javascript" src="lib/ext/ux/Ext.ux.Crypto.SHA1.js"></script>
    <script type="text/javascript" src="lib/ext/ux/Autogrid/RowExpander.js"></script>
    <script type="text/javascript" src="lib/ext/ux/Recordform/js/Fresh.grid.RecordForm.js"></script>
    <script type="text/javascript" src="lib/ext/ux/Recordform/js/Ext.ux.plugins.IconCombo.js"></script>
    <script type="text/javascript" src="lib/ext/ux/Recordform/js/Ext.ux.grid.RowActions.js"></script>
    <script type="text/javascript" src="lib/ext/ux/Autogrid/Autogrid4.js"></script>
    <script type="text/javascript" src="lib/ext/ux/FilterTree/FilterTree.js"></script>
    <script type="text/javascript" src="lib/ext/ux/CheckTristate/TriCheckColumn.js"></script>
    <script type="text/javascript" src="lib/ext/ux/Spinner/Spinner.js"></script>
    <script type="text/javascript" src="lib/ext/ux/Spinner/SpinnerField.js"></script>
    <script type="text/javascript" src="lib/ext/ux/RowAction.js"></script>
    <script type="text/javascript" src="lib/desktop/source/helpers/color-picker/color-picker.ux.js"></script>
    <script type="text/javascript" src="lib/desktop/source/helpers/preferences/Preferences.js"></script>
    <script type="text/javascript" src="lib/ext/ux/Fresh.js"></script>
    <script type="text/javascript" src="lib/ext/ux/Ext.ux.Plugin.DetailBinder.js"></script>
    <script type="text/javascript" src="lib/ext/ux/Ext.ux.DDAutoView.js"></script>
    <script type="text/javascript" src="lib/ext/ux/Ext.ux.Plugins.DataView.js"></script>
    <script type="text/javascript" src="lib/ext/ux/Ext.ux.Plugin.PropertyEditor.js"></script>
    <script type="text/javascript" src="lib/ext/ux/uxvismode.js"></script>
    <script type="text/javascript" src="lib/ext/ux/GridSearch/Ext.ux.grid.Search.js"></script>
    <!--- <script type="text/javascript" src="lib/ext/ux/Fresh.definitions.Loader.js"></script> --->

    <script type="text/javascript" src="lib/ext/ux/TypedEditorColumn/3/TypedEditorColumn.js"></script>
    <script type="text/javascript" src="lib/ext/3.3.0/src/locale/ext-lang-<%= $this->Application->Globalization->Culture %>.js"></script>

    <!-- MODULES -->
    <script type="text/javascript" src="lib/desktop/source/modules/layout-window/js/actions.js"></script>
    <script type="text/javascript" src="lib/desktop/source/modules/layout-window/js/remoteApp.js"></script>
    <script type="text/javascript" src="lib/desktop/source/modules/layout-window/js/layout-window.js"></script>
    <script type="text/javascript" src="lib/desktop/source/modules/layout-window/js/admin-window.js"></script>
    <script type="text/javascript" src="lib/desktop/source/modules/docs/js/docs.js"></script>

    <script type="text/javascript" src="lib/ext/ux/Ext.ux.TableFormLayout.js"></script>
    <script type="text/javascript" src="lib/ext/ux/Ext.ux.grid.RowEditor.js"></script>
	
	
    <script type="text/javascript" src="lib/ext/ux/Ext.ux.TreeCombo.js"></script>
    <script type="text/javascript" src="lib/ext/ux/Ext.ux.form.ServerValidator.js"></script>
    <script type="text/javascript" src="lib/ext/ux/Ext.ux.TplTabPanel.js"></script>
	<com:FClientPackageLoader PackagePath="JS.ext.ux.SuperBoxSelect" PackageScripts="bx"/>
	<com:FClientPackageLoader PackagePath="JS.ext.ux.TreeComboSuperBox" PackageScripts="bx"/>
   <!--- <script type="text/javascript" src="lib/ext/ux/HtmlEditor/htmleditor.js"></script>
    <script type="text/javascript" src="lib/ext/ux/HtmlEditor/loadingindicator.js"></script>
    <script type="text/javascript" src="lib/ext/ux/HtmlEditor/imagebrowser.js"></script>
    <script type="text/javascript" src="lib/ext/ux/HtmlEditor/statictextfield.js"></script>
    <script type="text/javascript" src="lib/ext/ux/HtmlEditor/htmleditorimage.js"></script>
    <script type="text/javascript" src="lib/ext/ux/HtmlEditor/Ext.ux.HtmlEditor.Plugins-0.2-all-debug.js"></script> --->
	<com:TClientScriptLoader PackagePath="JS.ext.ux.HtmlEditor" PackageScripts="allJs"/>
        <com:FClientCssLoader PackagePath="JS.ext.ux.HtmlEditor" PackageScripts="allCss"/>

	 <com:TClientScript ScriptUrl="lib/ext/ux/Mif/build/miframe-debug.js" Visible="<%= true || !$this->getApplication()->Parameters['noMIframe'] %>" />
	<!--- <com:TClientScript ScriptUrl="lib/ext/ux/miframe.js" /> --->
	
        <script type="text/javascript" src="lib/tiny_mce/tiny_mce.js"></script>
	<script type="text/javascript" src="lib/ext/ux/TinyMCE/Ext.ux.TinyMCE.js"></script>
	<script type="text/javascript" src="lib/ext/ux/TinyMCE/ImageChooser.js"></script>
	<script type="text/javascript" src="lib/ext/ux/TinyMCE/FileChooser.js"></script>

	<com:FClientPackageLoader PackagePath="JS.ext.ux.FormGroup" PackageScripts="formGroup"/>
	<com:FClientPackageLoader PackagePath="JS.ext.ux.FileTree" PackageScripts="allFileTree"/>

    <link rel="stylesheet" type="text/css" href="lib/ext/ux/Ext.ux.form.LovCombo.css" />
    <script type="text/javascript" src="lib/ext/ux/Ext.ux.form.LovCombo.js"></script>
<!---
        <script type="text/javascript" src="//asset0.zendesk.com/external/zenbox/zenbox-2.0.js"></script>
        <style type="text/css" media="screen, projection">
  @import url(//asset0.zendesk.com/external/zenbox/zenbox-2.0.css);

</style>
	<script type="text/javascript" src="http://snapabug.appspot.com/snapabug.js"></script>

        	<script type="text/javascript" src="lib/ext/ux/FileTree/js/Ext.ux.FileUploader.js"></script>
    <script type="text/javascript" src="lib/ext/ux/FileTree/js/Ext.ux.form.BrowseButton.js"></script>
  	<script type="text/javascript" src="lib/ext/ux/FileTree/js/Ext.ux.FileUploader.js"></script>
	<script type="text/javascript" src="lib/ext/ux/FileTree/js/Ext.ux.UploadPanel.js"></script>	
	<script type="text/javascript" src="lib/ext/ux/FileTree/js/Ext.ux.UploadPanel.js"></script> 

	<com:FClientCssLoader PackagePath="JS.ext.ux.FileTree" PackageScripts="allFileTreeCss"/>
	<script type="text/javascript" src="lib/ext/ux/miframe.js"></script>
	<script type="text/javascript" src="lib/tiny_mce/tiny_mce.js"></script>
	<script type="text/javascript" src="lib/ext/ux/TinyMCE/Ext.ux.TinyMCE.js"></script>
	<script type="text/javascript" src="lib/ext/ux/TinyMCE/ImageChooser.js"></script>
	<script type="text/javascript" src="lib/ext/ux/TinyMCE/FileChooser.js"></script>

	<link rel="stylesheet" type="text/css" href="lib/ext/ux/FileTree/css/filetree.css" />
	<link rel="stylesheet" type="text/css" href="lib/ext/ux/FileTree/css/icons.css" />
		<!---
	<com:TClientScriptLoader PackagePath="JS.ext.ux.HtmlEditor" PackageScripts="allJs"/>
  	<script type="text/javascript" src="lib/ext/ux/Ext.ux.TextBoxList.js"></script>
	<link rel="stylesheet" type="text/css" href="lib/ext/ux/Ext.ux.TextBoxList.css" /> --->
	<script type="text/javascript" src="lib/beautify.js"></script>
