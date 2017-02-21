
/*
 * Task/Issue      Author    			UniqueID        Comment   
 *---------------------------------------------------------------------------------------------------------------------------------------------------
 *  24006          Arunkumar.muddada    201312041040    Pointing to correct file
Awesome Uploader
Ext.ux.XHRUpload JavaScript Class

Copyright (c) 2010, Andrew Rymarczyk
All rights reserved.

Redistribution and use in source and minified, compiled or otherwise obfuscated 
form, with or without modification, are permitted provided that the following 
conditions are met:

	* Redistributions of source code must retain the above copyright notice, 
		this list of conditions and the following disclaimer.
	* Redistributions in minified, compiled or otherwise obfuscated form must 
		reproduce the above copyright notice, this list of conditions and the 
		following disclaimer in the documentation and/or other materials 
		provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND 
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED 
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE 
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL 
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR 
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER 
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, 
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE 
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

// API Specs:
// http://www.w3.org/TR/XMLHttpRequest/
// http://www.w3.org/TR/XMLHttpRequest2/
// http://www.w3.org/TR/progress-events/

// Browser Implementation Details:
// FROM: https://developer.mozilla.org/en/DOM/File
// https://developer.mozilla.org/en/Using_files_from_web_applications
// https://developer.mozilla.org/En/DragDrop/DataTransfer
// https://developer.mozilla.org/en/DOM/FileList
// "NOTE: The File object as implemented by Gecko offers several non-standard methods for reading the contents of the file. These should not be used, as they will prevent your web application from being used in other browsers, as well as in future versions of Gecko, which will likely remove these methods."
// NOTE: fileObj.getAsBinary() is deprecated according to the mozilla docs!

// Can optionally follow RFC2388
// RFC2388 - Returning Values from Forms: multipart/form-data
// http://www.faqs.org/rfcs/rfc2388.html
// This allows additional POST params to be sent with file upload, and also simplifies the backend upload handler becuase a single script can be used for drag and drop, flash, and standard uploads
// NOTE: This is currently only supported by Firefox 1.6, Chrome 6 should be released soon and will also be supported.




Ext.define('SWPCommon.lib.XHRUpload',{
	extend:'Ext.util.Observable',
	constructor:function(config){

		Ext.apply(this, config, {
			method: 'POST'
			,fileNameHeader: 'X-File-Name'
			,filePostName:'fileName'
			,contentTypeHeader: 'text/plain; charset=x-user-defined-binary'
			,extraPostData:{}
			,xhrExtraPostDataPrefix:'extraPostData_'
			,sendMultiPartFormData:false
		});
		this.addEvents( //extend the xhr's progress events to here
			'loadstart',
			'progress',
			'abort',
			'error',
			'load',
			'loadend'
		);
		//201312041040
		SWPCommon.lib.XHRUpload.superclass.constructor.call(this);

	},
	send:function(config){
		Ext.apply(this, config);
		
		this.xhr = new XMLHttpRequest();
		this.xhr.addEventListener('loadstart', Ext.Function.bind(this.relayXHREvent, this), false);
		this.xhr.addEventListener('progress', Ext.Function.bind(this.relayXHREvent, this), false);
		this.xhr.addEventListener('progressabort', Ext.Function.bind(this.relayXHREvent, this), false);
		this.xhr.addEventListener('error', Ext.Function.bind(this.relayXHREvent, this), false);
		this.xhr.addEventListener('load', Ext.Function.bind(this.relayXHREvent, this), false);
		this.xhr.addEventListener('loadend', Ext.Function.bind(this.relayXHREvent, this), false);
		
		this.xhr.upload.addEventListener('loadstart', Ext.Function.bind(this.relayUploadEvent,this), false);
		this.xhr.upload.addEventListener('progress', Ext.Function.bind(this.relayUploadEvent,this), false);
		this.xhr.upload.addEventListener('progressabort', Ext.Function.bind(this.relayUploadEvent,this), false);
		this.xhr.upload.addEventListener('error', Ext.Function.bind(this.relayUploadEvent,this), false);
		this.xhr.upload.addEventListener('load', Ext.Function.bind(this.relayUploadEvent,this), false);
		this.xhr.upload.addEventListener('loadend', Ext.Function.bind(this.relayUploadEvent,this), false);

		this.xhr.open(this.method, this.url, true);
		
		if(typeof(FileReader) !== 'undefined' && this.sendMultiPartFormData ){
			//currently this is firefox only, chrome 6 will support this in the future
			this.reader = new FileReader();
			this.reader.onload= Ext.Function.bind(this.sendFileUpload,this, false);
			this.reader.readAsBinaryString(this.file);
			return true;	
		}
		//This will work in both Firefox 1.6 and Chrome 5
		this.xhr.overrideMimeType(this.contentTypeHeader);
		this.xhr.setRequestHeader(this.fileNameHeader, this.file.name);
		for(attr in this.extraPostData){
			this.xhr.setRequestHeader(this.xhrExtraPostDataPrefix + attr, this.extraPostData[attr]);
		}
		this.xhr.setRequestHeader('X-File-Size', this.file.size); //this may be useful
		this.xhr.send(this.file);
		return true;
		
	}
	,sendFileUpload:function(){

		var boundary = (1000000000000+Math.floor(Math.random()*8999999999998)).toString(),
			data = '';
//		
//		for(attr in this.extraPostData){
//			data += '--'+boundary + '\r\nContent-Disposition: form-data; name="' + attr + '"\r\ncontent-type: text/plain;\r\n\r\n'+this.extraPostData[attr]+'\r\n';
//		}
//		
//		//window.btoa(binaryData)
//		//Creates a base-64 encoded ASCII string from a string of binary data. 
//		//https://developer.mozilla.org/en/DOM/window.btoa
//		//Firefox and Chrome only!!
//		
		data += '--'+boundary + '\r\nContent-Disposition: form-data; name="' + this.filePostName + '"; filename="' + this.file.name + '"\r\nContent-Type: '+this.file.type+'\r\nContent-Transfer-Encoding: base64\r\n\r\n' + window.btoa(this.reader.result) + '\r\n'+'--'+boundary+'--\r\n\r\n';
//		
//		this.xhr.setRequestHeader('Content-Type', 'multipart/form-data; boundary='+boundary);
		this.xhr.setRequestHeader(this.fileNameHeader, this.file.name);
		
		for(attr in this.extraPostData){
			this.xhr.setRequestHeader(this.xhrExtraPostDataPrefix + attr, this.extraPostData[attr]);
		}
		this.xhr.send(data);
	}
	,relayUploadEvent:function(event){
		this.fireEvent('upload'+event.type, event);
	}
	,relayXHREvent:function(event){
		this.fireEvent(event.type, event);
	}
});