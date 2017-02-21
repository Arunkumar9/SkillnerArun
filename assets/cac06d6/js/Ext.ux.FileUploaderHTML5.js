/*
 * Tine 2.0
 *
 * @license     http://www.gnu.org/licenses/agpl.html AGPL Version 3
 * @author      Cornelius Weiss <c.weiss@metaways.de>
 * @copyright   Copyright (c) 2007-2010 Metaways Infosystems GmbH (http://www.metaways.de)
 * @version     $Id: Ext.ux.FileUploaderHTML5.js 2348 2013-12-20 10:20:54Z arun $
 *
 */

Ext.ns('Ext.ux.file');

/**
 * a simple file uploader
 * objects of this class represent a single file uplaod
 *
 * @namespace   Ext.ux.file
 * @class       Ext.ux.file.Uploader
 * @extends     Ext.util.Observable
 */
Ext.ux.file.Uploader = function(config) {
    Ext.apply(this, config);
    var that = this;
   // XMLHttpRequest.open = Ext.createInterceptor(XMLHttpRequest.open,function() { this.upload.addEventListener('progress' , Fresh.console.log,false);return false;},XMLHttpRequest);

    Ext.ux.file.Uploader.superclass.constructor.apply(this, arguments);

    this.addEvents(
 		/**
		 * @event beforeallstart
		 * Fires before an upload (of all files) is started. Return false to cancel the event.
		 * @param {Ext.ux.FileUploader} this
		 */
		 'beforeallstart'
		/**
		 * @event allfinished
		 * Fires after upload (of all files) is finished
		 * @param {Ext.ux.FileUploader} this
		 */
		,'allfinished'
		/**
		 * @event beforefilestart
		 * Fires before the file upload is started. Return false to cancel the event.
		 * Fires only when singleUpload = false
		 * @param {Ext.ux.FileUploader} this
		 * @param {Ext.data.Record} record upload of which is being started
		 */
		,'beforefilestart'
		/**
		 * @event filefinished
		 * Fires when file finished uploading.
		 * Fires only when singleUpload = false
		 * @param {Ext.ux.FileUploader} this
		 * @param {Ext.data.Record} record upload of which has finished
		 */
		,'filefinished',
          /**
         * @event uploadcomplete
         * Fires when the upload was done successfully
         * @param {Ext.ux.file.Uploader} this
         * @param {Ext.Record} Ext.ux.file.Uploader.file
         */
         'uploadcomplete',
        /**
         * @event uploadfailure
         * Fires when the upload failed
         * @param {Ext.ux.file.Uploader} this
         * @param {Ext.Record} Ext.ux.file.Uploader.file
         */
         'uploadfailure',
        /**
         * @event uploadprogress
         * Fires on upload progress (html5 only)
         * @param {Ext.ux.file.Uploader} this
         * @param {Ext.Record} Ext.ux.file.Uploader.file
         * @param {XMLHttpRequestProgressEvent}
         */
         'uploadprogress'
    );
};

Ext.extend(Ext.ux.file.Uploader, Ext.util.Observable, {
    /**
     * @cfg {Int} maxFileSize the maximum file size in bytes
     */
    maxFileSize: 20971520, // 20 MB
    /**
     * @cfg {String} url the url we upload to
     */
    url: 'index.php',
    upCount: 0,
    /**
     * @cfg {Ext.ux.file.BrowsePlugin} fileSelector
     * a file selector
     */
    fileSelector: null,

    baseParams:{cmd:'upload',dir:'.'},


    /**
     * creates a form where the upload takes place in
     * @private
     */
    createForm: function() {
        var form = Ext.getBody().createChild({
            tag:'form',
            action:this.url,
            method:'post',
            cls:'x-hidden',
            id:Ext.id(),
            cn:[{
                tag: 'input',
                type: 'hidden',
                name: 'MAX_FILE_SIZE',
                value: this.maxFileSize
            }]
        });
        return form;
    },

    /**
     * perform the upload
     *
     * @param  {FILE} file to upload (optional for html5 uploads)
     * @return {Ext.Record} Ext.ux.file.Uploader.file
     */
    uploadFile: function(file) {
        this.upCount++;
        file.set('state', 'uploading');
        if ((
            (! Ext.isGecko && window.XMLHttpRequest && window.File && window.FileList) || // safari, chrome, ...?
            (Ext.isGecko && window.FileReader) // FF
        ) && file) {

            return this.html5upload(file);
        } else {
            return this.html4upload();
        }
    },

    /**
     * 2010-01-26 Current Browsers implemetation state of:
     *  http://www.w3.org/TR/FileAPI
     *
     *  Interface: File | Blob | FileReader | FileReaderSync | FileError
     *  FF       : yes  | no   | no         | no             | no
     *  safari   : yes  | no   | no         | no             | no
     *  chrome   : yes  | no   | no         | no             | no
     *
     *  => no json rpc style upload possible
     *  => no chunked uploads posible
     *
     *  But all of them implement XMLHttpRequest Level 2:
     *   http://www.w3.org/TR/XMLHttpRequest2/
     *  => the only way of uploading is using the XMLHttpRequest Level 2.
     */
    html5upload: function(fileRecord) {
        /*var fileRecord = new Ext.ux.file.Uploader.file({
            name: file.name ? file.name : file.fileName,  // safari and chrome use the non std. fileX props
            type: (file.type ? file.type : file.fileType) || this.fileSelector.getFileCls(), // missing if safari and chrome
            size: (file.size ? file.size : file.fileSize) || 0, // non standard but all have it ;-)
            status: 'uploading',
            progress: 0,
            input: this.getInput()
        });
        */
        var file = fileRecord.get('file');
       /*
        var xhr = new XMLHttpRequest();
        xhr.upload.addEventListener('progress' , this.onUploadProgress.createDelegate(this, [fileRecord], true),false);
        this.xhr.open('POST', this.url, true);
        xhr.overrideMimeType("application/octet-stream");
        xhr.setRequestHeader("X-File-Name", fileRecord.get('name'));
        xhr.setRequestHeader("X-File-Type" , fileRecord.get('type'));
        xhr.setRequestHeader("X-File-Size" , fileRecord.get('size'));
        xhr.send()*/
        var conn = new Ext.data.Connection({
            disableCaching: true,
            method: 'POST',
            url: this.url, // + '?method=Tinebase.uploadTempFile',
            timeout: 300000, // 5 mins
            defaultHeaders: {
                "Content-Type"          : "application/octet-stream",//"multipart/form-data", //,//"application/x-www-form-urlencoded",
                "X-Requested-With"      : "XMLHttpRequest"
            }
        });

        var params = this.getParams(fileRecord);
        var transaction = conn.request({
            headers: {
                "X-File-Name"           : fileRecord.get('name'),
                "X-File-Type"           : fileRecord.get('type'),
                "X-File-Size"           : fileRecord.get('size')
            },
            xmlData: file,
            success: this.onUploadSuccess.createDelegate(this, [fileRecord], true),
            failure: this.onUploadFail.createDelegate(this, [fileRecord], true),
            fileRecord: fileRecord,
            params: params
        });

        fileRecord.set('request',transaction);
          var upload = transaction.conn.upload;
          upload['onprogress'] = this.onUploadProgress.createDelegate(this, [fileRecord], true);
         upload.addEventListener('progress' , this.onUploadProgress.createDelegate(this, [fileRecord], true),false);
        //upload.addEventListener('progress' , Fresh.console.log,false);
        //transaction.conn.upload.onprogress = Fresh.console.log;

        return fileRecord;
    },

    /**
     * uploads in a html4 fashion
     *
     * @return {Ext.data.Connection}
     */
    html4upload: function() {
        var form = this.createForm();
        var input = this.getInput();
        form.appendChild(input);

        var fileRecord = new Ext.ux.file.Uploader.file({
            name: this.fileSelector.getFileName(),
            size: 0,
            type: this.fileSelector.getFileCls(),
            input: input,
            form: form,
            status: 'uploading',
            progress: 0
        });

        Ext.Ajax.request({
            fileRecord: fileRecord,
            isUpload: true,
            method:'post',
            form: form,
            success: this.onUploadSuccess.createDelegate(this, [fileRecord], true),
            failure: this.onUploadFail.createDelegate(this, [fileRecord], true),
            params: {
                method: 'Tinebase.uploadTempFile',
                requestType: 'HTTP'
            }
        });

        return fileRecord;
    },

    /*
    onLoadStart: function(e, fileRecord) {
        this.fireEvent('loadstart', this, fileRecord, e);
    },
    */

    onUploadProgress: function(e, fileRecord) {
        var percent = Math.round(e.loaded / e.total * 100);
        fileRecord.set('progress', percent);
        Fresh.console.log(percent);
        this.fireEvent('uploadprogress', this, fileRecord, e);
    },

    /**
     * executed if a file got uploaded successfully
     */
    onUploadSuccess: function(response, options, fileRecord) {
        response = Ext.util.JSON.decode(response.responseText);
        if (response.status && response.status !== 'success') {
            this.onUploadFail(response, options, fileRecord);
        } else {
            fileRecord.beginEdit();
            fileRecord.set('status', 'complete');
            /*fileRecord.set('tempFile', response.tempFile);
            fileRecord.set('name', response.tempFile.name);
            fileRecord.set('size', response.tempFile.size);
            fileRecord.set('type', response.tempFile.type);
            fileRecord.set('path', response.tempFile.path); */
            fileRecord.set('state', 'done');
            fileRecord.set('error', '');
            fileRecord.commit(false);
            this.upCount--;
            this.fireEvent('uploadcomplete', this, fileRecord);
            this.fireFinishEvents(options);
        }
    },

    /**
     * executed if a file upload failed
     */
    onUploadFail: function(response, options, fileRecord) {
        fileRecord.set('status', 'failure');
        var e = error.errors ? error.errors[fileRecord.id] : this.unknownErrorText;
        if(e) {
                fileRecord.set('state', 'failed');
                fileRecord.set('error', e);
        }
        else {
                fileRecord.set('state', 'done');
                fileRecord.set('error', '');
        }
        fileRecord.commit();
        this.fireEvent('uploadfailure', this, fileRecord);
        this.fireFinishEvents(options);
    },
	/**
	 * Main public interface function. Preforms the upload
	 */
	upload:function() {

		var records = this.store.queryBy(function(r){return 'done' !== r.get('state');});
		if(!records.getCount()) {
			return;
		}

		// fire beforeallstart event
		if(true !== this.eventsSuspended && false === this.fireEvent('beforeallstart', this)) {
			return;
		}
		//if(this.singleUpload) {
		//	this.uploadSingle();
		//}
		//else {
			records.each(this.uploadFile, this);
		//}

		if(true === this.enableProgress) {
			this.startProgress();
		}

	}, // eo function upload
	/**
	 * path setter
	 * @private
	 */
	setPath:function(path) {
		this.path = path;
	}, // eo setPath
	// }}}
	// {{{
	/**
	 * url setter
	 * @private
	 */
	setUrl:function(url) {
		this.url = url;
	}, // eo setUrl
/**
	 * get params to use for request
	 * @private
	 * @return {Object} params
	 */
	getParams:function(record, params) {
		var p = {path:this.path};
		Ext.apply(p, this.baseParams || {}, params || {});
		return p;
	},
    // private
    getInput: function() {
        if (! this.input) {
            this.input = this.fileSelector.detachInputFile();
        }

        return this.input;
    }
	/**
	 * Stops all currently running uploads
	 */
	,stopAll:function() {
		var records = this.store.query('state', 'uploading');
		records.each(this.stopUpload, this);
	} // eo function stopAll
	// }}}
	// {{{
	/**
	 * Stops currently running upload
	 * @param {Ext.data.Record} record Optional, if not set singleUpload = true is assumed
	 * and the global stop is initiated
	 */
	,stopUpload:function(record) {
		var req;
                // single abord
		if(record) {
			this.upCount--;
			this.upCount = 0 > this.upCount ? 0 : this.upCount;
			record.set('state', 'stopped');
                        if ( req = record.get('request'))
                            Ext.Ajax.abort(req);

			this.fireFinishEvents({record:record});
		}
		// all abort
		else if(this.form) {
			this.upCount = 0;
			this.fireFinishEvents();
		}

	} // eo function abortUpload
	/**
	 * Fires event(s) on upload finish/error
	 * @private
	 */
	,fireFinishEvents:function(options) {
		if(true !== this.eventsSuspended && !this.singleUpload) {
			this.fireEvent('filefinished', this, options && options.record);
		}
		if(true !== this.eventsSuspended && 0 === this.upCount) {
			this.fireEvent('allfinished', this);
		}
	} // eo function fireFinishEvents
});

Ext.ux.file.Uploader.file = Ext.data.Record.create([
    {name: 'id', type: 'text', system: true},
    {name: 'name', type: 'text', system: true},
    {name: 'size', type: 'number', system: true},
    {name: 'type', type: 'text', system: true},
    {name: 'status', type: 'text', system: true},
    {name: 'progress', type: 'number', system: true},
    {name: 'form', system: true},
    {name: 'input', system: true},
    {name: 'request', system: true},
    {name: 'path', system: true},
    {name: 'tempFile', system: true}
]);

Ext.ux.file.Uploader.file.getFileData = function(file) {
    return Ext.copyTo({}, file.data, ['tempFile', 'name', 'path', 'size', 'type']);
};
