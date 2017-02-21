/**
 * @author Jack Slocum
 * @url	http://extjs.com/blog/2008/05/14/form-group/
 */

Ext.ux.FormGroup = Ext.extend(Ext.Panel, {
	collapsible:true,
	animCollapse: false,
	titleCollapse:true,
	hideCollapseTool: true,
	baseCls:'form-group'
});
Ext.reg('formgroup', Ext.ux.FormGroup);
