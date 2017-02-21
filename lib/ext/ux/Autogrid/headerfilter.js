/**
 * 
 * @project 
 * 
 * Item class file
 * 
 * @author Jan Rosa
 * @copyright Copyright &copy; Jan Rosa, 2007
 */


dsgwo.on("load",function(){
        if (!cb){
          strCm = arCm = "";
          if (rader.jsonData['metaData']['fields'].length>1){
            strCm='[';
            for (var i=0;i<rader.jsonData['metaData']['fields'].length;i++){
              if (typeof rader.jsonData['metaData']['fields'][i]['dataIndex'] != 'undefined'){
                if (i != rader.jsonData['metaData']['fields'].length -1){
                  strCm+="['"+rader.jsonData['metaData']['fields'][i]['header']+"','"+rader.jsonData['metaData']['fields'][i]['dataIndex']+"'],";
                }else{
                  strCm+="['"+rader.jsonData['metaData']['fields'][i]['header']+"','"+rader.jsonData['metaData']['fields'][i]['dataIndex']+"']";
                }
              }
            }
            strCm+=']';
          }
          arCm=eval(strCm);
          gridgwoHead = gridgwo.getView().getHeaderPanel(true);
          tb = new Ext.Toolbar(gridgwoHead);
          tstore = new Ext.data.SimpleStore({
            fields: ['ab','detail'],
            data : arCm
          });
          cb=new Ext.form.ComboBox({
            store: tstore,
            displayField:'ab',
            valueField :'detail',
            editable: false,
            mode: 'local',
            triggerAction: 'all',
            selectOnFocus:true,
            hiddenName: 'cbTipegwo'
          });
          tb.add(cb);
          tb.add('-','filter:');
          filter = Ext.get(
            tb.addDom({
              tag: 'input',
              type: 'text',
              value: '',
              cls: ''
            }).el
          );
          cb.setValue(tstore.getAt(0).data['detail']);
          tp=Ext.get('cbTipegwo');
          filter.on('keypress', function(e) {
            if(e.getKey() == e.ENTER) {
                        dsgwo.reload({params:{start:0, limit:10, task:'getwonew'}});
            }
          });
          dsgwo.on('beforeload', function() {
            dsgwo.baseParams = {
              filter: Ext.util.Format.lowercase(filter.getValue()),
              tipe: tp.dom.value,
              task: 'getwonew'
            }
          });
          delete arCm;
          delete strCm;
          gridgwo.getView().refresh();
        }
});