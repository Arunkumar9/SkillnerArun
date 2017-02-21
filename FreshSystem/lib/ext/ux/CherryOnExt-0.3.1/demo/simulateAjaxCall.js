
MockXmlHttpRequest.prototype.send=function(data){
  this.readyState=4;
  this.status=200;
  if(this.url==='http://getAllPrefURL'){
    this.responseText="{totalCount: 2, preferences:[{prefId: '1', prefName: 'Earnings', prefDesc: 'Bought Stock with increased value', isDefault: true},";
    this.responseText+="{prefId: '2', prefName: 'Losses', prefDesc: 'Bought Stock with decreased value', isDefault: false}]}";  
  }
  if(this.url==='http://loadPrefURL'){
    var params=data.split('&');
    for(var i=0;i<params.length;i++){
      var paramNameAndValue=params[i].split('=');
      if(paramNameAndValue[0]=='prefId'){
        if(paramNameAndValue[1]=='1'){
          this.responseText='{grid: {"columns":[{"id":1,"width":75},{"id":"company","width":477},{"id":2,"width":75},{"id":3,"width":75},{"id":4,"width":95},{"id":5,"width":85,hidden:true}],"sort":{"field":"price","direction":"ASC"}},';
          this.responseText+='filter: {"left":{"fieldId":"pctChange","operatorId":"NUMBER_GREATER","values":[{"label":0,"value":0}]},"logicalOperator":"AND","right":{"fieldId":"inPortfolio","operatorId":"STRING_EQUAL","values":[{"label":"Yes","value":"0"}]}}}';
        } else if(paramNameAndValue[1]=='2'){
          this.responseText='{grid: {"columns":[{"id":"company","width":221},{"id":1,"width":75},{"id":2,"width":75},{"id":3,"width":75},{"id":4,"width":95},{"id":5,"width":85}],"sort":{"field":"pctChange","direction":"ASC"}},';
          this.responseText+='filter: {"left":{"fieldId":"pctChange","operatorId":"NUMBER_LESS_OR_EQUAL","values":[{"label":0,"value":0}]},"logicalOperator":"AND","right":{"fieldId":"inPortfolio","operatorId":"STRING_EQUAL","values":[{"label":"Yes","value":"0"}]}}}';
        }
        break;
      }
    }
  }
  if(this.url==='http://applyDefaultPrefURL'){
    this.responseText='{grid: {"columns":[{"id":1,"width":75},{"id":"company","width":477},{"id":2,"width":75},{"id":3,"width":75},{"id":4,"width":95},{"id":5,"width":85,hidden:true}],"sort":{"field":"price","direction":"ASC"}},';
    this.responseText+='filter: {"left":{"fieldId":"pctChange","operatorId":"NUMBER_GREATER","values":[{"label":0,"value":0}]},"logicalOperator":"AND","right":{"fieldId":"inPortfolio","operatorId":"STRING_EQUAL","values":[{"label":"Yes","value":"0"}]}}}';
  }
  if(this.url==='http://savePrefURL'){
    this.status=500;
    this.responseText='Not supported in this demo';
  }
  if(this.url==='http://deletePrefURL'){
    this.status=500;
    this.responseText='Not supported in this demo';
  }
};
Ext.lib.Ajax.createXhrObject = function(transactionId) {return{conn:new MockXmlHttpRequest(), tId:transactionId}; }
/*var callback;
var connectionObject;
Ext.lib.Ajax.handleReadyState=function(o, callback){
  this.handleTransactionResponse(o, callback);
}*/

