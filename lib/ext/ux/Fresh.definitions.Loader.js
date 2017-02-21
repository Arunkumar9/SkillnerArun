/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

Ext.ns('Fresh.definitions');


Fresh.definitions.Loader = Ext.extend(Ext.Panel,{

   initComponent: function() {

       Fresh.definitions.Loader.superclass.initComponent.call(this);

       this.managedStores = [];
       
       Fresh.global.classesStore = new Fresh.data.ViewProvider({
                id: 'all-definitions-store',
                listeners: {
                    'load': {
                        fn: this.initDefinitions.createDelegate(this)
                    }
                }
       });



   },


   initDefinitions: function(s,r,o) {

       var dn,ds,dg,recs,st;

       recs = s.query('class','class').getRange();



       var data,j,da;

       for(var i=0; i<recs.length; i++) {

           dn = recs[i].get('name').toLowerCase() + '-def-store';
           dg = recs[i].get('name');

           data = s.query('class',dg).getRange();
           da = [];
           for (j=0;j<data.length;j++) {

               da.push({ uid: data[j].get('uid')
                       ,name: data[j].get('name')
                       ,Uid: data[j].get('uid')
                       ,nameLangAct: data[j].get('nameLangAct')
                       ,Name: data[j].get('name')
                       ,value: data[j].get('value')
                       ,'class': data[j].get('class')
                   });
           }

           if (ds = Ext.StoreMgr.lookup(dn)) {
                ds.loadData({
                            success: true,
                            rows: da});
               Fresh.console.log(dn+' store updated');
           } else {
               this.managedStores.push(dn);
               ds =     new Fresh.data.ViewProvider({
                        id: dn,
                        autoLoad: false,
                        ///url: Fresh.Config.Service.View,
                        root: 'rows',
                        idProperty: 'uid',
                        totalProperty: 'totalCount',
                        sortInfo: {
                            field:  'name',
                            direction: 'ASC'
                        }
                        ,fields: [
                            {name: 'uid'}
                            ,{name: 'name'}
                            ,{name: 'nameLangAct'}
                            ,{name: 'Uid'}
                            ,{name: 'Name'}
                            ,{name: 'value'}
                            ,{name: 'class'}
                        ]
               });
               ds.loadData({
                            success: true,
                            rows: da});
               Fresh.console.log(dn+' store inited');
               Fresh.global[dg.charAt(0).toUpperCase()+dg.substr(1)+'DefStore'] = ds;
           }


       }
       Ext.MessageBox.hide();

   }
/*   initDefinitions: function(s,r,o) {

       var dn,ds,dg,recs,st;

       recs = s.query('class','class').getRange();





       for(var i=0; i<recs.length; i++) {

           dn = recs[i].get('name').toLowerCase() + '-def-store';


           if (ds = Ext.StoreMgr.lookup(dn)) {
               ds.reload();
           } else {
               this.managedStores.push(dn);
               dg = recs[i].get('name');




              st =     new Ext.data.ArrayStore({
                        storeId: dn,
                        fields: s.fields.getRange()
               });
               st.loadData(s.query('class',dg).getRange());
               Fresh.global[dg.charAt(0).toUpperCase()+dg.substr(1)+'DefStore'] = st;
             // this.html
           }


       }

   }
*/


});

//Fresh.global.defloader = new Fresh.definitions.Loader();

Ext.reg('defloader', Fresh.definitions.Loader);
