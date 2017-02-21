/**
 * Task/Issue      Author    			UniqueID        Comment   
 *---------------------------------------------------------------------------------------------------------------------------------------------------
 * 27666          Arunkumar.muddada    201312270330     Added : New Class
 */

Ext.define('SWPCommon.view.RadioField', {
    override:'Ext.form.field.Radio',
     onBoxClick: function(e) {
        var me = this;
        if (!me.disabled && !me.readOnly ) {
            if(this.getValue()){
                    this.setValue(false);
            }else{ 
                this.setValue(true);
            }
        }
    }
});