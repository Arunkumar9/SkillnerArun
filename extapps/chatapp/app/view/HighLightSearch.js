/**
 * This class is helpful to highlight the word in document body 
 * by maintaining the userdefined class properties.
 * 
 * 
 * Task/Issue      Author    			UniqueID        Comment   
 *---------------------------------------------------------------------------------------------------------------------------------------------------
 * 23039           Tapaswini Sabat		201311161301	Introduced the class to highlight the search field in document.                                                
 */

Ext.define('CHAT.view.HighLightSearch', {
    extend: 'Ext.Base',
    alias: 'widget.hiltor',
 initComponent: function(id, tag) {	

	this.callParent(arguments);
},
setMatchType : function(type)
{
  switch(type)
  {
    case "left":
      this.openLeft = false;
      this.openRight = true;
      break;
    case "right":
      this.openLeft = true;
      this.openRight = false;
      break;
    case "open":
      this.openLeft = this.openRight = true;
      break;
    default:
      this.openLeft = this.openRight = false;
  }
},
setRegex : function(input)
{
var trimedSearchValue = input.replace(/^\s+|\s+$/g, '');
			this.matchRegex = new RegExp( trimedSearchValue, "gi" );
			
},
getRegex : function()
{
  var retval = this.matchRegex.toString();
  retval = retval.replace(/(^\/(\\b)?|\(|\)|(\\b)?\/i$)/g, "");
  retval = retval.replace(/\|/g, " ");
  return retval;
},

apply : function( input, id, tag ){
	
	if(input == undefined) return;
	this.targetNode = document.getElementById(id) || document.body;
	this.unhighlightWord( this.targetNode, "", undefined);
	if( input == "") return;
    this.setRegex(input);
    this.highlightWord(this.targetNode, input, undefined);
},



stripVowelAccent : function(str)
{
	var rExps=[ /[\xC0-\xC2]/g, /[\xE0-\xE2]/g,
		/[\xC8-\xCA]/g, /[\xE8-\xEB]/g,
		/[\xCC-\xCE]/g, /[\xEC-\xEE]/g,
		/[\xD2-\xD4]/g, /[\xF2-\xF4]/g,
		/[\xD9-\xDB]/g, /[\xF9-\xFB]/g ];

	var repChar=['A','a','E','e','I','i','O','o','U','u'];

	for(var i=0; i<rExps.length; ++i)
		str=str.replace(rExps[i],repChar[i]);

	return str;
},

unhighlightWord : function (node,word,doc) {
    doc = typeof(doc) != 'undefined' ? doc : document;
	// Iterate into this nodes childNodes
	if (node.hasChildNodes) {
		var hi_cn;
		for (hi_cn=0;hi_cn<node.childNodes.length;hi_cn++) {
			this.unhighlightWord(node.childNodes[hi_cn],word,doc);
		}
	}

	// And do this node itself
	if (node.nodeType == 3) { // text node
		tempNodeVal = node.nodeValue.toLowerCase();
		tempWordVal = word.toLowerCase();
		if (tempNodeVal.indexOf(tempWordVal) != -1) {
			pn = node.parentNode;
			if (pn.className == "search-text-highlight") {
				prevSib = pn.previousSibling;
				nextSib = pn.nextSibling;
				nextSib.nodeValue = prevSib.nodeValue + node.nodeValue + nextSib.nodeValue;
				prevSib.nodeValue = '';
				node.nodeValue = '';
			}
		}
	}
},

highlightWord : function (node,word,doc) {
	
	     doc = typeof(doc) != 'undefined' ? doc : document;
	     count_matches = 0;
		// Iterate into this nodes childNodes
		if (node.hasChildNodes) {
			var hi_cn;
			for (hi_cn=0;hi_cn<node.childNodes.length;hi_cn++) {
				count_matches = count_matches + this.highlightWord(node.childNodes[hi_cn],word,doc);
			}
		}

		// And do this node itself
		if (node.nodeType == 3) { // text node
			tempNodeVal = this.stripVowelAccent(node.nodeValue.toLowerCase());
			tempWordVal = this.stripVowelAccent(word.toLowerCase());
			if (tempNodeVal.indexOf(tempWordVal) != -1) {
				pn = node.parentNode;
				if (pn.className != "search-text-highlight") {
	                    count_matches = count_matches + 1;
					// word has not already been highlighted!
					nv = node.nodeValue;
					ni = tempNodeVal.indexOf(tempWordVal);
					// Create a load of replacement nodes
					before = doc.createTextNode(nv.substr(0,ni));
					docWordVal = nv.substr(ni,word.length);
					after = doc.createTextNode(nv.substr(ni+word.length));
					hiwordtext = doc.createTextNode(docWordVal);
					hiword = doc.createElement("span");
					hiword.className = "search-text-highlight";
					hiword.appendChild(hiwordtext);
					pn.insertBefore(before,node);
					pn.insertBefore(hiword,node);
					pn.insertBefore(after,node);
					pn.removeChild(node);
				}
			}
		}

	     return count_matches;
	}

});
