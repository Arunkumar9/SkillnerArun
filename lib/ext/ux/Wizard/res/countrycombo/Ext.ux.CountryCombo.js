
/**
  * Ext.ux.CountryCombo Extension Class for Ext 2.x Library
  *
  * @author  Charles Opute Odili (Original version by Ing. Jozef Sakalos)
  * @date 25. March 2008
  * @version 0.1
  *
  * @class Ext.ux.CountryCombo
  * @extends Ext.ux.IconCombo
  */
Ext.ux.CountryCombo = Ext.extend(Ext.ux.IconCombo, {
	width: 140,
    id: 'country_combo',
	mode: 'local',
	editable: false,
	triggerAction: 'all',
	forceSelection: true,
	valueField: 'countryCode',
    displayField: 'countryName',
    iconClsField: 'countryFlag',
	initComponent:function() {

        Ext.apply(this, {
            store: new Ext.data.SimpleStore({
                fields: ['countryCode', 'countryName', 'countryFlag'],
                data: []
            })
        });

        // call parent initComponent
        Ext.ux.CountryCombo.superclass.initComponent.call(this);

    }

});

// register xtype
Ext.reg('countrycombo', Ext.ux.CountryCombo);