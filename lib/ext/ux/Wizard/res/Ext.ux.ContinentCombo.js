
/**
  * Ext.ux.ContinentCombo Extension Class for Ext 2.x Library
  *
  * @author  Charles Opute Odili 
  * @version 0.1
  *
  * @class Ext.ux.ContinentCombo
  * @extends Ext.form.ComboBox
  */
Ext.ux.ContinentCombo = Ext.extend(Ext.form.ComboBox, {
    width: 120,
	mode: 'local',
	editable: false,
	triggerAction: 'all',
	forceSelection: true,
	valueField: 'continentCode',
	displayField: 'continentName',
	initComponent:function() {

        Ext.apply(this, {
            store: new Ext.data.SimpleStore({
                id:0,
                fields:['continentCode', 'continentName'],
                data:[
                    ['eu', 'Europe'],
                    ['us', 'America'],
                    ['au', 'Africa']
                ]
            })
        });

        // call parent initComponent
        Ext.ux.ContinentCombo.superclass.initComponent.call(this);

    },
    
    renderGender:function() {
        return function(val) {
            var retval;
            //var gp = Ext.ux.ContinentCombo.prototype;
            switch(val) {
                case 'eu':
                    retval = '<div class="ux-cell-gender">' + 'Europe' + '</div>';
                	break;

                case 'us':
                    retval = '<div class="ux-cell-gender">' + 'America' + '</div>';
                	break;
                	
                case 'au':
                    retval = '<div class="ux-cell-gender">' + 'Africa' + '</div>';
                	break;
                	
            }
            return retval;
        };

    },
    
    editorGender:function() {
        return new Ext.grid.GridEditor(new Ext.ux.ContinentCombo());
    }

});

// register xtype
Ext.reg('continentcombo', Ext.ux.ContinentCombo);