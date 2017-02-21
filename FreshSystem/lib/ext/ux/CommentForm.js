/**
 * @author rosa
 */
Ext.namespace('Fresh','Fresh.dialogs','Fresh.localize');
Fresh._ = function(val) {
    if (Ext.type(Fresh.localize[val]))
        return Fresh.localize[val];
    else
        return '~'+val+'~';
}

Fresh.dialogs.CommentForm = Ext.extend(Ext.form.FormPanel,{
   
   initComponent: function() 
   {

        Ext.apply(this,{
           url: 'index.php?json=form&view=comments-form-view'
           ,id: 'send-comment-form'
           ,defaultType: 'textfield'
           ,labelWidth: 75
           ,border: false
           ,frame: true
           ,layout: 'form'
           ,bodyStyle: 'padding:10px;'
           ,defaults: {
               anchor: '100%'
           }
           ,items: [{
               fieldLabel: Fresh._('Email'),
               name: 'email',
               allowBlank: false,
               vtype: 'email'
           }, {
               fieldLabel: Fresh._('Name'),
               allowBlank: true,
               name: 'name'
           }, {
               fieldLabel: Fresh._('Phone'),
               allowBlank: true,
               name: 'phone'
           }, {
               fieldLabel: Fresh._('Text'),
               name: 'text',
               xtype: 'textarea',
               anchor: '100% -85'
           }]
        });
       Fresh.dialogs.CommentForm.superclass.initComponent.apply(this,arguments);
   }
   ,sendComment: function() {
       console.log('submit');
       this.getForm().submit({
           url: this.url,
           waitMsg:Fresh._('Odesílám...'),
           params: { source: recordUid, action: 'store'  },
           success: function(f,a) { 
                   Ext.MessageBox.alert(Fresh._('Info!'),a.result.message || '');
                   var email = f.findField('email').getValue();
                   f.reset();
                   f.findField('email').setValue(email);
                   Ext.getCmp('send-comment-win').hide();
           },
           failure: function(f, a){
                   Ext.Msg.alert(Fresh._('Warning!'), a.result.message || '');
           }
       });
   }
});

Ext.reg('commentform',Fresh.dialogs.CommentForm);

