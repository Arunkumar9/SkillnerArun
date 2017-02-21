/**


*/

Ext.namespace('Fresh');

Fresh.FExtButton = {


	init: function(cfg) {

	 var btnID = cfg.buttonID;
	 var pradoBtn = Ext.get(btnID);
//	 pradoBtn.hide();
	 pradoBtn.dom.id = Ext.id();

	 if (false && cfg.containerID) {
		var container = Ext.ComponentMgr.get(cfg.containerID);
	 }
	 else {
		 var container = pradoBtn.dom.id;
	 }
	 btn = new Ext.Button(container,cfg);
	 btn.getEl().child('BUTTON').dom.id = btnID;
}

}