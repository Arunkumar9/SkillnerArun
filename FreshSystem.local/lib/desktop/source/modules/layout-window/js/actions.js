
/**
 * 
 * @project Fresh!
 * 
 * @package Fresh.web.clientside.actions

 * @fileOverview
 * 
 * @author Jan Rosa
 * @copyright Copyright &copy; Jan Rosa, 2008
 * @version	$Id: actions.js 2348 2013-12-20 10:20:54Z arun $
 * 
 */
/**
 * Task/Issue      Author    			UniqueID        Comment   
 *---------------------------------------------------------------------------------------------------------------------------------------------------
 *  23192          Dinesh GK    		20131114210     If the post evaluation option is "Show quiz results, correction allowed", 
 *  												then  the "Lessons to be marked unviewed" area shall remain disabled synchronously 
 *  23985	       Arunkumar.muddada	201312041243	Modified : onSaveButton
 *  													if field xtype is "ddautoview" && i[j].isDirtyFlag == true
 *  															then we are setting i[j].isDirtyFlag = false;
 *  27668		   Arunkumar.muddada	201405140827    Modified : onSaveButton
 *  													This will be true when user clicks on the finalize button
 *  27837		   Arunkumar.muddada    201405270805    Modified : deleteGridRow
 *  														Code for the restriction of the delete of the finalized content.
 *  28037		   Arunkumar.muddada    201406051106    Modified : deleteGridRow
														If Delete is from markers grid then we are preparing the array from the selected items and deleteing the items
														
														Modified : onDeleteGridTool
														On deletion we need to set the header to non check box as the selected rows are deleted.
														
														Modified : onCancelButton
														On cancelling the changes in chapters grid, rearranging of records based on start field is happening.
														
														Modified : onCancelGridTool
														On cancelling the changes in chapters grid, rearranging of records based on start field is happening.
														
														Modified : onReloadGridButton
														While reload we are clearing the selection and setting the header to unchecked
														
														Modified : addRecordGrid
														For the markers grid We are allowing to edit , so it will point to the first column of the grid on new record.
														
														Modified : onAddGridTool
														On Add we need to set the header to non check box as the selected rows are not consider while adding.
 *
 *  28041		   Arunkumar.muddada    201406061200    Modified : onReloadGridButton          
 *  														While relaod we are deselecting the selected rows
 *  28040 	       Arunkumar.muddada    201406111043    Added Method : getRecsFromCsv
 *  														This method is used for the Parse the input data and 
 *  														creation of store records and push the data into created records and insert the records into store
 *  28042          Arunkumar.muddada    201406130247    Added method : getRecFromCsvForCuepoints : This method is used for the Parse the input data and creation of store records and push the data into created records and insert the records into store
 *	
 *	28042(Comment #13)  Arunkumar.muddada    201406240313    Modified: onSaveButton for adding the view refresh code.
 *                                                           Modified: onReloadGridButton to reject the chages on reload.
 *  28951		   Dinesh GK			201407030510	Modified : showQuizSettings() settings window title, fields text are changed and one new field is added.
 *  29015		   Dinesh GK			201407171130	Modified : createNewQuestion here paging toolbar is updating with exist count.
 *  29018		   Dinesh GK			201407170755	Modified : onReloadGridButton() here for question answers grid reload we are showing an alert to user.
 *  29013		   Dinesh GK			201407301130	Modified : deleteGridRow() For answers grid before saving the content also we sorting the grid with ordering. 
 **/

Ext.namespace('Fresh.global');

MyDesktop.actions = function()  {

        var msgCt;
        var createBox = function(t, s){
        return ['<div class="msg">',
                '<div class="x-box-tl"><div class="x-box-tr"><div class="x-box-tc"></div></div></div>',
                '<div class="x-box-ml"><div class="x-box-mr"><div class="x-box-mc"><h3>', t, '</h3>', s, '</div></div></div>',
                '<div class="x-box-bl"><div class="x-box-br"><div class="x-box-bc"></div></div></div>',
                '</div>'].join('');
        };

        if (Ext.ux.ManagedIframe)
            Ext.ux.ManagedIFrame = Ext.ux.ManagedIframe;
        
        var msg  = function(title, format, id, type){
            var attach = Ext.get(id) || document;
            var ins = Ext.get(id) || document.body;
            type = type || 'c-c';
            if(!msgCt){
                msgCt = Ext.DomHelper.insertFirst(document.body, {id:'msg-div'}, true);
            }
//            msgCt.alignTo(document, 'br-br',[0,-70]);
            msgCt.alignTo(document, 'tr-tr');
            var s = String.format.apply(String, Array.prototype.slice.call(arguments, 1));
            var m = Ext.DomHelper.append(msgCt, {html:createBox(title, s)}, true);
            m.slideIn().pause(1).slideOut("t", {remove:true});
        };

        
		/**
		 * Search action private handler
		 * @param {Object} button
		 * @param {Object} e
		 */
        var onSearchButton = function(button, e){
		
			e.preventDefault();
			var form = button.panel || button.form;
			
			if (!form.getForm().isDirty()) 
				return;
			var options = form.formBaseParams ||	{};

            var values = form.getForm().getValues(false);
			
			//if (typeof form.linkedGrid == 'string')
			//	form.linkedGrid = Ext.getCmp(form.linkedGrid);
			
			if (typeof form.linkedGrid == 'object') {
				form.linkedGrid.store.baseParams.filter = Ext.encode(values);
				form.linkedGrid.store.baseParams.context = form.id;
				form.linkedGrid.store.load();
			}
			
		};
        var deleteGridRow = function(grid,viewContext,recs) {

            if (Ext.isArray(viewContext))
                recs = viewContext;

            if (Ext.isString(viewContext) && viewContext)
                viewContext = viewContext;
            else
                viewContext = grid.id+'-delete';
            
            if (!Ext.isArray(recs))
            {
                var sm = grid.getSelectionModel();
                if (typeof sm.getSelections == 'function') {
                    recs = sm.getSelections();
                }
                else if (typeof sm.getSelectedCell == 'function') {
                //If Delete is from markers grid then we are preparing the array from the selected items 
                //and deleteing the items
                //201406051106
                	 if(grid.id == "markercuepoints-grid"){
                		 var markersSelc = [];
                		 var markers = grid.getStore().data.items;
                		 var n = 0;
                		 for(var j=0 ; j<markers.length; j++){
                			 var marker = markers[j];
                			 if(marker.data.isActive == 1){
                				 markersSelc[n] = marker;
                				 n = n+1;
                			 }
                		 }
                		 recs = markersSelc;
                	 } else {                		 
                		 recs = [grid.store.getAt(sm.getSelectedCell()[0])];
                	 }
                }
                else
                    return;
            }

            var data = {};
            var idName = grid.store.meta.id;
            var l = 0;
            for (var i = 0; i < recs.length; i++) {
                if (recs[i].get(idName)) {
                    l++;
                    r = {};
                    r[idName] = recs[i].get(idName);
                    data[recs[i].id] = r;
                    //201405270805
                    //Code for the restriction of the delete of the finalized content.
                    if (viewContext=='quizgroups-grid-delete' || viewContext=='videos-grid-delete' || viewContext=='courses-grid-delete')
                    {
                        if (recs[i].get('is_finished')==1) {
                                Ext.MessageBox.alert(__(''), __('Finalized content cannot be deleted.'));
                                return false;
                        }
                    }
                }
            }
            var params = {};
            for (p in grid.store.baseParams) {
                params[p] = grid.store.baseParams[p];
            }
            var sm = grid.getSelectionModel();
        	var selected = '';
            if (l > 0) {
                var options = {
                  url: grid.store.url,
                      params: Ext.apply(params,{
                          meta: false,
                          rows: Ext.encode(data),
                          context: viewContext
                      }),
                  success: function(response){
                        var result = Ext.decode(response.responseText);
                        if (result.success) {
                            msg(__('Success!'),result.message,grid.getEl(),'c-c');
//                                form.el.select('.x-panel-btns').insertFirst({
//                                    tag: 'span',
//                                    html: result.message
//                                });
                            for (var i = 0; i < recs.length; i++) {
                                grid.store.remove(recs[i]);
                                grid.store.sort('ordering','ASC'); //sort the records after deleting a record
                            }
                            if (grid.linkedForm)
                                grid.linkedForm.disable();
                            /*#29022
                             * Here after deleting the Evaluation item the paging tool bar count is updating with toolbar load 
                             */
                            if( grid.id == "quizes-grid"){
                            	grid.toolbars[1].doLoad();
                            }
                        }
                        else {
                        	Ext.MessageBox.alert(__('Error'),'Cannot delete content as some dependency is there.');
                        }
                        
                  },
                  failure: function() {
                      Ext.MessageBox.alert('Error','Error occured while saving preferences.');
                  }
                };
                Ext.Ajax.request(options);
            }else{
            	
            	//
            	//	Deleting the records that were not saved when clicked on delete button for grid.
            	//	Checking conditions for getSelections and getSelectedCell to provide functionality
            	//	for both cuepoints grid and quiz-answers grid.
            	//
            	
            	if( 'function' == typeof sm.getSelections ){
            		
            		selected = sm.getSelections();
            		
            	}else if (typeof sm.getSelectedCell == 'function') {
            		
            		selected = grid.store.getAt(sm.getSelectedCell()[0]);
                }
            	if( selected ){
            		
            		grid.getStore().remove( selected );
            		//201407301130 #29013
            		if( grid.id == "quiz-answers-grid" ){
            			grid.getStore().sort('ordering','ASC');
            		}
            	}
            }
            
            /**
             * Here modified records are removed form stroe modified array.
             */
            if(selected == ''){
            	selected = sm.getSelections();
            }
            if( grid.id == "quiz-answers-grid" ){
                var modifiedRecords =  grid.getStore().getModifiedRecords();
                if( modifiedRecords.length > 0 ){
         		   for( var s=0; s<selected.length; s++){
         			   for( var l=0; l<modifiedRecords.length; l++){
         				   if(  modifiedRecords[l].get('name') == selected[s].get('name') && 
         						   modifiedRecords[l].get('ordering') == selected[s].get('ordering') ){
         					   grid.getStore().modified.remove(modifiedRecords[l]);
         					   l = 0;
         				   }
         			   }
                    }
                }
            }else{
            	
            	for( var s=0; s<selected.length; s++){
            		if( selected[s].get('uid') == "" ){
            			grid.getStore().modified.remove(selected[s]);
            		}
            	}
            }
            
        };

        var onDeleteGridTool = function(button, e){

            var grid = button.form;
            var sm = grid.getSelectionModel();
            if (sm && sm.hasSelection()) {
            
                Ext.MessageBox.confirm(__('Confirm'), __('Are you sure you want to remove selected rows?'), function(btn, text){
                    if (btn == 'yes') {
                        deleteGridRow(grid);
                        //On deletion we need to set the header to non check box as the 
                        //selected rows are deleted.
                        //201406051106
                        if( grid.id == "markercuepoints-grid" || grid.id == "cuepoints-grid" ){
                        	var header = '<div class="x-grid3-hd-tag">&#160;</div>';
     	   				    grid.getColumnModel().setColumnHeader(0,header);
     	   				  //  grid.getStore().reload();
     	   				    grid.fireEvent('identifyErrorCell',grid);
                        }
                    }
                });
            }
            var importScript = Ext.getCmp('lesson-import-script-button');
            if( !Ext.isEmpty( importScript ) ){
            	importScript.setDisabled( (grid.getStore().getCount() == 1 ) ? true : false );
            }
        }
        var onSaveGridTool = function(button, e){

        	var grid;
        	if (grid = button.form){

        		var requires = grid.colModel.config[1].requires;
        		var cansave = true;

        		if( requires ){

        			var recs = grid.getStore().getModifiedRecords();

        			//
        			// check the name field is blank if blank then return false to break the 
        			// the loop and assign cansave as false. to restrict the saveData function call
        			//

        			Ext.each( recs ,function( rec ){

        				if( rec.get('name') == "" ){ 

        					Ext.MessageBox.alert(" Required "," The name field should not be blank ");
        					cansave = false;
        					return false;
        				}

        			}, this );
        		}


        		if( cansave ){

        			grid.saveData();
        		}
        	}
        }
        function trim(s) {
            return s.replace( /^\s*/, "" ).replace( /\s*$/, "" );
        }
        
        var onSaveButton = function(button,e, errorCallBack,defaultRec) {

            if (Ext.MessageBox.isVisible()) return;
            
            if ('undefined' != typeof e)
				e.preventDefault();
            if (!(form = button.form))
				form = button;
			Fresh.console.log(form.data);
			/* #29017
			 * Here code is written for handling the Answers grid validation.
			 */
			var typeField = form.getForm().findField("quiz-qtype-value");
			if( typeField ){
				var answerType = typeField.getValue();
			}
			if( button.id == "question-form-save-button" && answerType == 'numeric question' ){
            	var answersStore = Ext.getCmp(form.autogridId).getStore();
//            	var mandatoryFields = answersStore.findBy(function(rec, id) {
//    					return ( (rec.get('numeric_type')=="Value From Range" )  &&	( rec.get('first_value')=="" || rec.get('second_value') == "" ) );
//  					},this);
//            	if( mandatoryFields > -1 ){
//            		Ext.Msg.alert('Error!', 'The From and To fields are mandatory.');
//            		return;
//            	}
            	var wrongFormatIndex = answersStore.findBy(function(rec, id) {
                    				return ( (rec.get('numeric_type')=="Value From Range" )  &&	
                    						( parseFloat(rec.get('first_value')) >= parseFloat(rec.get('second_value')) ) );
                  					},this);
            	if( wrongFormatIndex > -1 ){
            		Ext.Msg.alert('Error!', 'Value From should be less than Value To.', function(btn) {}, this);
            		return;
            	}
			}
			
            var grid = form.linkedGrid;
            
            //When we click on the finalize button we are setting the disable option to true
            var isfinalizedEvent = button.disabled;
            
//            var dirty = form.getForm().isDirty() || (grid && );
            var formParams = form.formBaseParams || {};
            formParams.action = 'store';
			delete	formParams.context;	
			var options = {
                  params: formParams
                  ,waitMsg: 'Saving...'
                  ,clientValidation: true
                  ,waitTitle: __('Saving...')
                  ,success: function(f,action){
                	  
                        var result = action.result;
						if ('undefined' == typeof result) 
							result = Ext.decode(f.responseText);
                        result.message = result.message || '';
                        
                        if (result.success) {
                        	
                            Fresh.Msg.SlideBox(__('Success!'),result.message);
                            
							if (f.setValues) {
                                wasNewRecord = (!form.formBaseParams.id || form.formBaseParams.id == 'new' ) ? true : false;
                                if (result.CustNo) {
									f.setValues({
										'CustNo': result.CustNo
									});
									form.formBaseParams.id = result.CustNo;
									if (grid) {
										grid.customerChanged = true;
										grid.store.baseParams.filter = result.CustNo;
									}
								}
                                                                
								if (result.Uid) {
									f.setValues({
										'Uid': result.Uid
									});
									form.formBaseParams.id = result.Uid;
									if (grid) {
										grid.customerChanged = true;
										grid.store.baseParams.filter = result.Uid;
									}
								}
								
								if (result.uid) {
									f.setValues({
										'uid': result.uid
									});
                                    form.formBaseParams.id = result.uid;
									if (grid) {
										grid.customerChanged = true;
										grid.store.baseParams.filter = result.uid;
									}
								}
								
                                if (wasNewRecord) {
                                    if (grid && 'function' == typeof grid.saveData && !grid.noAutoSave)
                                        grid.saveData(form.id+'-store');
                                
                                    if (gs = form.findByType('autogrid')) {
                                        for (i=0;i<gs.length;i++) {
                                            if (gs[i].linkToForm && !gs.noAutoSave)
                                                gs[i].saveData(form.id+'-store');
                                        }
                                    }
                                }
							}   
							
                        	//This will be true when user clicks on the finalize button
							//201405140827
                        	if(isfinalizedEvent){
                        		VideoRecordMgr.createBusinessEventForFinalizedQuiz( form.formBaseParams.id ,function(r,t){
            						if( t.status ){
            							console.log("It is finalize event");
            						}
            					},this);
                        	}
                        }else {
							Ext.MessageBox.alert('Error',result.message);
                        }
                        //to reset form to new values;
						if (f.setValues) {
							if (result.result) 
								f.setValues(result.result)
	                        if (f.trackResetOnLoad) {
	                            f.items.each(function(field){
	                                if (field.isXType('compositefield')) {
	                                    field.items.each(function(cfield){
	                                        cfield.originalValue = cfield.getValue();
	                                    });
	                                } else {
	                                        field.originalValue = field.getValue();
	                                }
	                            });
	                        }
							// preventing reset when 'ddautoview' is updated and for remain forms reset is done.
							
							if(f.items.items)
							    i=f.items.items;
							else
								i.length = 0;
							var reset = false;
							for(j=0;j < i.length ;j++){
								if (i[j].getXType() == "ddautoview" && i[j].isDirtyFlag == true)
									{
									reset = true;
									//201312041243
									i[j].isDirtyFlag = false;
									}
							}
							if(!reset){
									f.reset();
							}
						}
                  }
                  ,failure: function(f,action) {
				      Fresh.console.log(action.result);
				      
				      if ( !Ext.isEmpty(errorCallBack) ) {
						   errorCallBack(Ext.decode(action.response.responseText));
					   } else {
	
						   Ext.MessageBox.alert('Error','Error occured while saving.');
					   }
                  }
            };
			
            if ('function' === typeof form.getForm) {
                if ( form.getForm().isDirty() || defaultRec ) {

                        if (form.getForm().isValid() || defaultRec) {
                                form.getForm().submit(options);
                        }
                        else {
                                Ext.MessageBox.alert(__('Form not valid...'), __('Please check your form! Some of the fields are not valid.'));
                        }
                }
            }else {
                options.params.data = Ext.encode(form.data);
                options.url = form.url;
                Ext.Ajax.request(options);
            }
            
            if (grid && 'function' == typeof grid.saveData && !grid.noAutoSave) {
                grid.saveData(form.id+'-store');
            }
            if (gs = form.findByType('autogrid')) {
                for (i=0;i<gs.length;i++) {
                    if (gs[i].linkToForm && !gs[i].noAutoSave)
                        gs[i].saveData(gs[i].id+'-store'); // instead of formid to save the grid data pass the grid id
                        //201406240313
                        gs[i].getView().refresh();
                }
            }
        };

        var onCancelButton = function(button,e) {
        
            e.preventDefault();
            var form = button.form;
            var grid = form.linkedGrid;
            var modifiedRecs = 0;
            if (gs = form.findByType('autogrid')) {
        		for (i=0;i<gs.length;i++) {
        			
        			if( gs[i].store.getModifiedRecords().length > 0 ){
        				modifiedRecs = gs[i].store.getModifiedRecords().length;
        			}
        		}
        	}
            
            if( (grid && grid.store.getModifiedRecords().length > 0) ){
            	modifiedRecs = grid.store.getModifiedRecords().length;
            }
            if (form.getForm().isDirty() || modifiedRecs ) {
            
                Ext.MessageBox.confirm(__('Confirm'), __('Are you sure you want to reset form?<br/>Changes will be lost!'), function(btn, text){
                    if (btn == 'yes') {
                        form.getForm().reset();
                        if (grid) {
                            cancelGridEdit(grid);
                            // On cancelling the changes in chapters grid, rearranging of records
                            // based on start field is happening.
                            //201406051106
                            if( grid.id == "cuepoints-grid" || grid.id == "markercuepoints-grid"){
                            	grid.getStore().sort("startFormated","ASC");
                            	grid.getStore().reload();
                            }
                        }
                        if (gs = form.findByType('autogrid')) {
                    		for (i=0;i<gs.length;i++) {
                    			cancelGridEdit( gs[i] );
                    			if(gs[i].id == 'markercuepoints-grid' || gs[i].id == 'cuepoints-grid' ){
                    				gs[i].fireEvent('identifyErrorCell',grid);
                    			}
                    			
                                if(form && form.id=='question-form'){
                                	var questionForm = form.getForm();
                                	var gridData = Ext.getCmp( 'quiz-answers-grid' );
                                	var qTypeField = questionForm.findField('quiz-qtype-value');
                                	var taskNote = questionForm.findField('taskNote');
                                	var qtypeValue = qTypeField.getValue();
                                	var questionSaveBtn = Ext.getCmp('question-form-save-button');
                                	if(qtypeValue == 'Task'){
                                		gridData.setVisible( false );
                                		Ext.getCmp( 'taskNote' ).setVisible(true);
                                		questionSaveBtn.setText('Save task');
                                	}else {
                                		gridData.setVisible( true );
                                		Ext.getCmp( 'taskNote' ).setVisible(false);
                                		questionSaveBtn.setText('Save question');
                                	}
                                }
                    			/*if(gs[i].id == 'markercuepoints-grid' || gs[i].id == 'cuepoints-grid' ){
                    				var tabPanel=Ext.getCmp('video-form-panel');
                    				if(tabPanel.getActiveTab().id == 'video-cuepoints-tab') {
                    					if(gs[i].id == 'cuepoints-grid'){
                    						gs[i].fireEvent('identifyErrorCell',grid);
                    					}
                    				}else if(tabPanel.getActiveTab().id == 'video-markercuepoints-tab'){
                    					if(gs[i].id == 'markercuepoints-grid'){
                    						gs[i].fireEvent('identifyErrorCell',grid);
                    					}
                    				}
                    			}*/
                    		}
                    	}
                    }
                });
            }

        };

        var onNewGridTool = function(button, e){
        }
        var onCancelGridTool = function(button,e) {
		
            e.preventDefault();
            var grid = button.form;
            
            if (grid.store.getModifiedRecords().length > 0) {
            
                Ext.MessageBox.confirm(__('Confirm'), __('Cancel edits in the grid?'), function(btn, text){
                    if (btn == 'yes') {
                            cancelGridEdit(grid);
                            // On cancelling the changes in chapters grid, rearranging of records
                            // based on start field is happening.
                            //201406051106
                            if( grid.id == "cuepoints-grid" || grid.id == "markercuepoints-grid"){
                            	grid.getStore().sort("startFormated","ASC");
                            	grid.fireEvent('identifyErrorCell',grid);
                            }
                    }
                });
            }
            var importScript = Ext.getCmp('lesson-import-script-button');
            if( !Ext.isEmpty( importScript ) ){
            	importScript.setDisabled( (grid.getStore().getCount() > 0 ) ? false : true );
            }

        };

        /**
         * this function will get the records with empty values after reject changes called 
         * and removes those records from the grid.
         */
        var cancelGridEdit = function(grid) {
             grid.store.rejectChanges();
             var id = grid.getStore().meta.id;
             var count = grid.store.data.length;
             var removeRecs = [];
             for( var l =0,k=0;l<count;l++){
            	 
            	 if( grid.store.getAt(l).get(id) == undefined ||  grid.store.getAt(l).get(id)=="" ){
            		 removeRecs[k]=grid.store.getAt(l);
            		 k++;
            	 }
            	 
             }
             grid.getStore().remove( removeRecs );
             grid.getView().refresh();
        };

        var onReloadTreeButton = function(button,e) {
            e.preventDefault();
            var tree = button.form;
            tree.body.mask(__('Loading'), 'x-mask-loading');
            tree.root.reload(function(){ 
                tree.body.unmask();
                tree.root.expand(false, false);
            });
            tree.root.collapse(true, false);
        };

        var onReloadGridButton = function(button,e) {
        	
            e.preventDefault();
            var grid = button.form,
            	smo = grid.getSelectionModel();
            if (grid && grid.store)              
	            var	gridStore = grid.getStore();
            /* #29018   201407170755
             * Here for quiz answers grid befor reloading the form, we are showing an confirm message to user.
             */
            if( grid.id == 'quiz-answers-grid' && gridStore.getModifiedRecords().length > 0 ){
            	  Ext.MessageBox.confirm(__('Confirm'), __('Are you sure you want to reload the form?<br> Changes will lost!'), function(btn, text){
                      if (btn == 'yes') {
                    	cancelGridEdit(grid);
                      	grid.getSelectionModel().deselectRange( 0, grid.store.data.length );
                      	grid.fireEvent('identifyErrorCell',grid);
                      }else{
                    	  return;
                      }
                  },this);
            }else{
            	
            	//While reload we are clearing the selection and setting the header to unchecked    
            	//201406051106
            	if( grid.id == "markercuepoints-grid" || grid.id == "cuepoints-grid" ){
            		var header = '<div class="x-grid3-hd-tag">&#160;</div>';
            		grid.getColumnModel().setColumnHeader(0,header);
            		//201406061200
            		//While relaod we are deselecting the selected rows
            		if(grid.store.data.length > 0){
            			for(var i=0 ; i< grid.store.data.length ; i++){
            				grid.store.data.items[i].data.isActive = 0;
            			}
            		}
            	}
            	//201406240313
            	//grid.store.rejectChanges();
            	cancelGridEdit(grid);
            	grid.getSelectionModel().deselectRange( 0, grid.store.data.length ); // deselect all selected records 
            	grid.fireEvent('identifyErrorCell',grid);
            }
            
        }

        var onCuepointsHelpWin = function(button,e){
         //201406091202
         //Code for Creating a window with the help text
        	var helpText = '';
        	var title = '';
        	if(button.form.id == 'markercuepoints-grid'){
        		helpText = AWESOME_HELP_DESCRIPTION.MARKERS;
        		title = 'Help- Marker Configuration';
        	} else if(button.form.id == 'cuepoints-grid'){
        		helpText = AWESOME_HELP_DESCRIPTION.CUEPOINTS;  
        		title = 'Help- Chapters Configuration';
        	}
        	
        	var cuepointswind=new Ext.Window({
				title : title,
				cls:'window-title-text-align',
				modal : true,
				constrain : true,
				width:600,
				height:300,
				layout : 'fit',
				items:[{
					html : helpText,
					cls:'window-text-text-align',
					autoScroll : true
				}]
			});
        	cuepointswind.show();
        }
        
        var addRecordGrid = function(grid,r) {
            var store = grid.store;
			var df;
            if (store) {
                r = r || {};
                var fields = store.meta.fields;
                var Record = Ext.data.Record.create(fields);
                var rec = new Record(r);
                for (var i=0; i<fields.length; i++) {

                	df = (typeof fields[i].defValue === 'function')?fields[i].defValue(rec,store):fields[i].defValue;
					rec.set(fields[i].name,df || '');	

					if( grid.id == 'quiz-answers-grid'){
						var positionVlaue = 0;
	                	if( store.data.length ){
	                		
	                		positionVlaue = store.getAt( store.data.length-1 ).data.ordering;
	                		positionVlaue = positionVlaue + 10;
	                	}
						
						rec.set('ordering',positionVlaue);
						/*#29071
						 * Newly added question record values are setting explicitly 
						 */
			            var numCombo = Ext.get('quiz-qtype-value');
        	            if( numCombo )
        	            	var qtypeValue = numCombo.getValue();
        	            if( qtypeValue == 'numeric question' || qtypeValue == 'multiple choice'){
	    					
	    					rec.set('numeric_type',"Single Value");
	    					rec.set('first_value',0);
	    				}
					}
                }
                grid.stopEditing();
                
                var insertIndex = 0;
                if ( grid.insertPos === 'END' ) {
                	insertIndex = store.data.length;
                }
                store.insert(insertIndex, [rec]);
                
                //
                // startEditing some time fails due to which whole
                // flow is failing so added in try catch
                //
                
                //For the markers grid We are allowing to edit , so it will point to the first column of the grid on new record.
                //201406051106
                try{
                	if( grid.id == 'quiz-answers-grid' || grid.id == "markercuepoints-grid"){
                		
                		grid.startEditing(insertIndex, 1);
                		grid.getSelectionModel().selectRow(insertIndex);
                	}else if(  grid.id == "cuepoints-grid" ){
                		
                		grid.startEditing(insertIndex, 2);
                		grid.getSelectionModel().selectRow(insertIndex);
                	}else{

                		grid.startEditing(insertIndex, 0);
                	}
                }catch(e){
                	console.log( e.message );
                }
            }
        }

        var onAddGridTool = function(button,e) {
            var panel = button.form;
            if (panel)
                addRecordGrid(panel);
            //On Add we need to set the header to non check box as the 
            //selected rows are not consider while adding.
            //201406051106
            var markerGrid = panel;
            if( markerGrid.id == "markercuepoints-grid" || markerGrid.id == "cuepoints-grid" ){
            	var header = '<div class="x-grid3-hd-tag">&#160;</div>';
                markerGrid.getColumnModel().setColumnHeader(0,header);
    			var smo = markerGrid.getSelectionModel();
                smo.clearSelections();
                if(markerGrid.store.data.length > 0){
                	for(var i=0 ; i< markerGrid.store.data.length ; i++){
                		markerGrid.store.data.items[i].data.isActive = 0;
                	}
                }
                markerGrid.getSelectionModel().selectRow(0);
                markerGrid.store.data.items[0].data.isActive = 1;
            }
            var importScript = Ext.getCmp('lesson-import-script-button');
            if( !Ext.isEmpty( importScript ) ){
            	importScript.setDisabled( (markerGrid.getStore().getCount() > 0 ) ? false : true );
            }
            
        }

        var onCollapseTreeButton = function(button,e) {
            e.preventDefault();
            var tree = button.form;
            tree.root.collapse(true, false);
        };

        var onExpandTreeButton = function(button,e) {
            e.preventDefault();
            var tree = button.form;
            tree.root.expand(true, true);
        };
        
        var onRenameNode = function(button,e) {
            if ((tree = button.form) && (n = tree.getOneSelectedNode())) {
                tree.editor.editByAction = true;
                (function(){tree.editor.triggerEdit(n);}.defer(10));
            }
        }

        var onDeleteNode = function(button,e) {
            if ((tree = button.form) && (n = tree.getOneSelectedNode())) {
                Ext.MessageBox.confirm(__('Confirm'),'Do you really want to move<br/> <b>'+n.text+'</b> to ' + __('recycle bin') + '?',
                    function(btn,text) { 
                        var r,rb;
                        if (btn=='yes') {
                         	//if ((r = tree.root.lastChild) && r.attributes.menuType == 'recycleBin')
                         	if (r = tree.root.findChild('menuType','recycleBin')) 
                         		rb = r.id || 1;
                         	else
                         		rb = 1;
                        	tree.treeEditor.updateNode(n,{ParentId: rb});
                        }
                    });
            }
        }

        var onTrueDeleteNode = function(button,e) {
            if ((tree = button.form) && (n = tree.getOneSelectedNode())) {
                Ext.MessageBox.confirm(__('Confirm'),'Do you really want to delete <b>'+n.text+'</b>?<br/><b>THIS CANNOT BE UNDONE!!',
                    function(btn,text) { 
                        if (btn=='yes')
                            tree.treeEditor.onDelete(tree,n);                              
                    });
            }
        }

        var onEmptyRecycleBin = function(button,e) {
            if ((tree = button.form) && (n = tree.getOneSelectedNode())) {
                Ext.MessageBox.confirm(__('Confirm'),'Do you really want to empty Recycle Bin?<br/><b>THIS CANNOT BE UNDONE!!',
                    function(btn,text) { 
                        if (btn=='yes')
                            var rb = tree.getNodeById('1');
                            if (rb && rb.firstChild) {
                                var ch = rb.childNodes;
                                for (var i = 0;i<ch.length;i++) {
                                   tree.treeEditor.onDelete(tree,ch[i]);         
                                }
                            }
                    });
            }
        }

        var onOpenFilter = function(button,e) {
      //      e.stopEvent();
            if ((tree = button.form) && (n = tree.getOneSelectedNode())) {
                tree.openFilter(n);
            }
        }
        
        var onNewNode = function(button,e) {
            e.stopEvent();
			var tree;
            if ((tree = button.form) && (n = tree.getOneSelectedNode())) {
                tree.createNewNode(n,'leaf');
            }
        }

        var onNewFolderNode = function(button,e) {
            e.stopEvent();
            var tree;
            if ((tree = button.form) && (n = tree.getOneSelectedNode())) {
                tree.createNewNode(n,'folder');
            }
            return true;
        }

        var onReloadNode = function(button,e) {
            var tree;
            if ((tree = button.form) && (n = tree.getOneSelectedNode())) {
               // tree.body.mask('Loading', 'x-mask-loading');
                delete n.attributes.children;
				n.reload();/*function(){
                    tree.body.unmask();
                    //n.expand(true, true);
                });
                */
                //n.collapse(true, false);
            }
        };

        var askBeforeClose = function(p,lf) {
            if (!lf)
                return; 
            if( lfaugId = lf.xlinkedGrid){
                var modified = Ext.getCmp( lfaugId).getStore().getModifiedRecords().length;
        	}
            
            //
        	// verify all the autogrid's for the modified records
        	//which are under the linked form
        	//
            
            if(gs = lf.findByType('autogrid')){
                
            	for( var k =0;k<gs.length;k++){
            		if( gs[k].getStore().getModifiedRecords().length > 0 ){
            			modified =  gs[k].getStore().getModifiedRecords().length;
            		}
            	}
        	}
            
            if ( (lf.getForm().isDirty() || ( lf.linkedGrid && lf.linkedGrid.isDirty() ) || modified>0)
               ) {
                Ext.MessageBox.confirm(__('Confirm'), __('You have not saved changes and they will be lost.<br/>Do you want to exit?'), function(btn, text){
                    if (btn == 'yes') {
                        lf.getForm().reset();
                        if (lf.linkedGrid){
                        	
                        	lf.linkedGrid.store.rejectChanges();
                        }else if( lf.autogridId && Ext.getCmp( lf.autogridId ) ){
                        	
                        	Ext.getCmp( lf.autogridId ).store.rejectChanges();
                        }
                        
                        //
                        // reject all the changes of the autogrids under the linked form
                        //
                        
                        if(gs = lf.findByType('autogrid')){

                        	for( var k =0;k<gs.length;k++){
                        		gs[k].getStore().rejectChanges();
                        	}
                        }
                        //
                        //Before closing the window need to clear all the previous selections.
                        //
                        if( lf.selGrid ){
                        	clearSelGridSelctions( lf.selGrid );
                        }
                        p.close();
                    }
                    else {
                        return false;
                    }
                },this);
                return false;
                
            }
            if( lf.autogridId == "quiz-answers-grid" ){
            	
            	Ext.getCmp('quizes-grid').store.removeAll();
            }
            if( lf.selGrid ){
            	clearSelGridSelctions( lf.selGrid );
            }
            return true;
            
        }
        //If the user really wants to load the content of another chapter then nedd to clear
        //the previous selections first
        var clearSelGridSelctions= function( selgrids ){
        	 if( selgrids ){
             	var selections = selgrids.split(' ');
             	var x;
             	for ( x = 0; x< selections.length; x++ ){
                 	var selgrid = Ext.getCmp( selections[x] );
                 	selgrid.getSelectionModel().clearSelections();
                 	if( selgrid.getSelectionModel() ){
                 		
                 		selgrid.getView().innerHd.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild.className = 'x-grid3-hd-inner x-grid3-hd-checker';
                 	}
                 	selgrid.getView().refresh();
             	}
             }
        }
        var askOnNewRecordButton = function(button, e){
            var lf;
            if (!(lf = button.form))
                return;
            if( lfaugId = lf.xlinkedGrid){
                var modified = Ext.getCmp( lfaugId).getStore().getModifiedRecords().length;
        	}
            
            if (lf.askBeforeLoad && 
                ((lf.getForm().isDirty() || ( lf.linkedGrid && lf.linkedGrid.isDirty() )) || modified >0 )
               ) {
                Ext.MessageBox.confirm(__('Confirm'), __('You have not saved changes and they will be lost.<br/>Do you want to continue?'), function(btn, text){
                    if (btn == 'yes') {
                        lf.getForm().reset();
                        if (lf.linkedGrid)
                            lf.linkedGrid.store.rejectChanges();
                        onNewRecordButton(button,e);
                    }
                    else {
                        return false;
                    }
                },this);
                
            }
            else {
                onNewRecordButton(button,e);
            }
            
        }
        
        var askOnDuplciateRecordButton = function(grid,button, e,f){
            var lf;
            if (!(lf = button.form))
                return;
            if( lfaugId = lf.xlinkedGrid){
                var modified = Ext.getCmp( lfaugId).getStore().getModifiedRecords().length;
        	}
            
            if (lf.askBeforeLoad && 
                ((lf.getForm().isDirty() || ( lf.linkedGrid && lf.linkedGrid.isDirty() )) || modified >0 )
               ) {
                Ext.MessageBox.confirm(__('Confirm'), __('You have not saved changes and they will be lost.<br/>Do you want to continue?'), function(btn, text){
                    if (btn == 'yes') {
                        lf.getForm().reset();
                        if (lf.linkedGrid)
                            lf.linkedGrid.store.rejectChanges();
                        onDuplicateRecordButton(grid,button, e,f);
                    }
                    else {
                        return false;
                    }
                },this);
                
            }
            else {
                onDuplicateRecordButton(grid,button, e,f);
            }
            
        }
        /**
         * This method is taking care of loading empty record to the quiz-question form
         * Here we are getting the form fiuelds and setting it with empty value.
         * We are setting the value and original value as well inorder to clean the
         * dirty flag for the form.
         * 
         * */
        
        var loadEmptyRecord = function(){
        	
        	var tabPanel = Ext.getCmp('question-form-panel');
            if( tabPanel ){
            	tabPanel.setActiveTab(0);
            	var formItems = tabPanel.items.items[0].items
            	for( var i=0; i <formItems.length; i++ ){
            		
            		if (formItems.items[i].xtype != 'hidden'){
            			
            			if ( formItems.items[i].xtype == "autogrid" && formItems.items[i].store){
            				
            				formItems.items[i].store.removeAll();
            				continue;
            			}
            			if(formItems.items[i].xtype == "checkbox"){
            				
            				formItems.items[i].setValue(false);
            				formItems.items[i].originalValue = false;
            			}else{
            				
            				if(formItems.items[i].allowBlank == false ){
            					
            					formItems.items[i].setValue('New');
            					formItems.items[i].originalValue = 'New';
            					
            				}else if(formItems.items[i].xtype != "container"){
            					
            					formItems.items[i].setValue('');
            					formItems.items[i].originalValue = '';
            				}
            			}
            		}
            	}
            }
        }
         
        var onNewRecordButton = function(button,e) {
            var fFocus,form;
            if (!(form = button.form))
                return;
            //Clicking on the new Record button DATA Tab will be always the active Tab
            if(form.askBeforeLoad){
            	var tabpan = button.form.id + "-panel";	
                var g = Ext.getCmp(tabpan);
                if(g)
                	g.setActiveTab(0);
            }
            clearSelGridSelctions( button.form.selGrid );
            var formParams = form.formBaseParams || {};
            formParams.id = 'new';
            formParams.action = 'load';
            formParams.context = 'new-record';

            form.load({
                params: formParams,
                waitMsg: 'Loading new blank record',
                success: function(actualform,action) { 
                    form.enable();
                    formParams.id = Ext.decode( action.response.responseText ).data.content_id;
                    Ext.getCmp(form.selGrid.split(' ')[0]).getStore().load();
            //         if (grid = form.linkedGrid ) {
            //     if (typeof grid.store == 'object')
            //         grid.store.removeAll();
            //     //grid.customerChanged = false;
            //     grid.store.baseParams.filter = content_id;
            //     grid.store.baseParams.context = form.id;
            //     grid.store.load();
            // }
            
            // if (gs = form.findByType('autogrid')) {
            //     for (i=0;i<gs.length;i++) {
            //         if (gs[i].linkToForm) {
            //             if (typeof gs[i].store == 'object')
            //                 gs[i].store.removeAll();
            //     //grid.customerChanged = false;
            //             gs[i].store.baseParams.filter = content_id;
            //             gs[i].store.baseParams.context = form.id;
            //         }

            //     }
            // }
                }
            });
    
            

            try {
            	if (ct = form.ownerCt)
                ct.setTitle(ct.initialConfig.title+': '+__('New record'));
            } catch (e) {}

            if (form.focusOnNew && (fFocus = form.getForm().findField(form.focusOnNew))) {
                fFocus.focus(true,100);
            }
        
           
        }
        
        var onDuplicateRecordButton = function(grid,button,e,f){
            	
            		button.form  = Ext.getCmp(f);
            		
                    viewContext = grid.id+'-duplicate';
                    var data = {};
                    var r = {};
                    var idName = grid.store.meta.id;
                    var params = {};
                    for (p in grid.store.baseParams) {
                        params[p] = grid.store.baseParams[p];
                    }
                    if( grid.getSelectionModel().getSelected() ){
                    	var selected = grid.getSelectionModel().getSelected();
                    	var recId = selected.id;
                    	
                    	var idName = grid.store.meta.id;
                    	
                    	r[idName] = recId;
                    	
                    	var options = {
                    			url: grid.store.url,
                    			params: Ext.apply(params,{
                    				meta: true,
                    				rows: Ext.encode(r),
                    				context: viewContext
                    			}),
                    			success: function(response){
                    		
                    		// Here from the response we are geetting the content is for the duplicated record.
                    		if( response.responseText ){
                    			
                    			clearSelGridSelctions( button.form.selGrid );
                    			var resText = Ext.decode( response.responseText);
                    			var contentId = resText.result.contentId;
                    			grid.duplicateContentId = contentId;
                    			
                    			// Here based on the page number we are loading the store of that particular page only.
                    			
                    			var pageSize = grid.getBottomToolbar().pageSize;
                    			var activePage = grid.getBottomToolbar().getPageData().pages;
                                var startValue = 1*( activePage - 1) * pageSize;
                                var parentId = 0;
                                if( grid.id && grid.id == "quizes-grid"){
                                	parentId = Ext.getCmp(grid.parentGrid).getSelectionModel( ).getSelections()[0].get('content_id');
                                	grid.startValue = startValue;
                                	grid.getStore().load({
    									params: {
    			                            start: startValue,
    			                            limit: pageSize,
    			                            parent_id : parentId
    			                        }
    								});
                                }else{
                                	
                                	grid.getStore().load({
                                		params: {
                                		start: startValue,
                                		limit: pageSize
                                	}
                                	});
                                }
                    		}
                    	},
                    	failure: function() {
                    		Ext.MessageBox.alert('Error','Error occured while saving preferences.');
                    	}
                    	};
                    	//Ext.MessageBox.wait(__('Duplicating '+selected.get('name')),__('Please wait'));
                    	Ext.Ajax.request(options); 
                    }
            }
            
        var onDeleteRecordButton = function(button,e) {
            var tree,editor,node;
            if (!(tree = button.form))
                return;
            if (editor = tree.treeEditor) {
                node = tree.getOneSelectedNode();
                if (node)
                    Ext.MessageBox.confirm(__('Confirm'),__('Do you really want to remove')+' '+node.text,function(btn){
                        if (btn == 'yes') 
                            editor.onDelete(tree,node);
                        
                    });
            }
        }

        var onFnSwitchButton = function(button,e) {
            Ext.MessageBox.confirm('Confirm','Do you really want switch FN Cycle from '+Fresh.FNCycle+'?',function(btn){
                        if (btn != 'yes') 
                            return;
                            
                        var options = {
                            url: Fresh.Config.Service.Report+'json=switch',
                            success: function(response){
                                var result = Ext.decode(response.responseText);
                                if (result.success) {
                                    Fresh.Msg.SlideBox('Success!', result.message || '');
                                    Fresh.FNCycle = parseInt(result.FN);
                                    Fresh.global.actions.showFNCycle.setText('<b>FNCycle '+Fresh.FNCycle+'</b>');
                                }
                                else {
                                    Ext.MessageBox.alert(__('Error'), result.message || '');
                                }
                                
                            },
                            failure: function(){
                                Ext.MessageBox.alert(__('Error'), __('Error occured while saving data.'));
                            }
                        };
                        Ext.Ajax.request(options);
                    });
            }
        
        
        var onImportButton = function(button, e){
            var impwin;
            var form = button.form;
            var impstore = Ext.StoreMgr.lookup('import-store');
            if (impstore.getModifiedRecords().length > 0) {
                Ext.MessageBox.alert(__('Info'), __('Please save your modifications first.'));
                return;
            }
            
            if (button.id == 'upload-import-button') {
                if (form.getForm().isDirty()) {
                
                    if (form.getForm().isValid()) {
                        var formParams = form.formBaseParams ||
                        {};
                        formParams.action = 'upload';
                        
                        form.getForm().submit({
                            params: formParams,
                            waitMsg: 'Uploading...',
                            clientValidation: true,
                            success: function(f, action){
                                var result = action.result;
                                result.message = result.message || '';
                                if (result.success) {
                                    Fresh.Msg.SlideBox(__('Success!'), result.message);
                                    if (impwin = Ext.getCmp('import-win').getLayout()) {
                                        Ext.StoreMgr.lookup('import-store').reload();
                                        impwin.setActiveItem(1);
                                    }
                                }
                            },
                            failure: function(){
                                Ext.MessageBox.alert(__('Error'), 'Error occured uploading orders.');
                            }
                        });
                    }
                }
                else {
                    if (impwin = Ext.getCmp('import-win').getLayout()) {
                        impwin.setActiveItem(1);
                    }
                }
            }
            else {
                if (button.id == 'finish-import-button') {
                
                    var options = {
                        url: form.url,
                        params: Ext.apply(form.formBaseParams, {
                            action: 'import'
                        }),
                        success: function(response){
                            Ext.MessageBox.hide();
							var result = Ext.decode(response.responseText);
                            if (result.success) {
                                var msg = result.message || '';
                                Fresh.Msg.SlideBox(__('Success!'), msg);
                                impstore.reload({
                                    success: function(){
                                        Ext.MessageBox.alert(__('Info'), msg);
                                    }
                                });
                            }
                            else {
	                            Ext.MessageBox.hide();
                                Ext.MessageBox.alert(__('Error'), result.message || '');
                            }
                        },
                        failure: function(){
                            Ext.MessageBox.alert(__('Error'), __('Error occured while saving data.'));
                        }
                    };
					Ext.MessageBox.wait(__('Importing ...'),__('Please wait'));
                    Ext.Ajax.request(options);
                }
                else {
                    if (button.id == 'clear-import-button') {
                        var options = {
                            url: form.url,
                            params: Ext.apply(form.formBaseParams, {
                                action: 'clear'
                            }),
                            success: function(response){
                                var result = Ext.decode(response.responseText);
                                if (result.success) {
                                    var msg = result.message || '';
                                    impstore.reload();
                                    Fresh.Msg.SlideBox(__('Success!'), msg);
                                    Ext.MessageBox.alert('Info', msg);
                                }
                                else {
                                    Ext.MessageBox.alert(__('Error'), result.message || '');
                                }
                            },
                            failure: function(){
                                Ext.MessageBox.alert(__('Error'), __('Error occured while saving preferences.'));
                            }
                        };
                        Ext.MessageBox.confirm(__('Confirm'), 'Do you really want to clear uploaded records?',function(btn) {
                                    if (btn=='yes')
                                        Ext.Ajax.request(options);
                                });
                    }
                    else {
                        if (button.id == 'close-import-button') {
                            impwin = Ext.getCmp('import-win');
                            impwin.close();
                        }
			else {
				if (button.id == 'new-import-button') {
				    if (impwin = Ext.getCmp('import-win').getLayout())
					impwin.setActiveItem(0);
				    Ext.getCmp('upload-field').setRawValue('');
			        }

			}
                    }
                }
            }
        }
        
        var onLinkReportButton = function(button, e){
            var grid, filter, f, service;
            if (!(grid = button.form)) 
                return;
            
            grid = (Ext.isString(grid))?Ext.getCmp(grid) : grid;

            if (grid.store && grid.store.getTotalCount()>Fresh.Config.Reports.MaxTotalCount) {
               Ext.MessageBox.alert(__('Alert'),__('This filter has to many records to create ')+button.getText());
               return;
            }
                
           Ext.MessageBox.wait(__('Creating report'),'Info');
            f = grid.store.baseParams.filter;
            service = button.service || 'xls';
            button.url = button.url || (Fresh.Config.Service.Report + service + '=report&report='+button.report);
            if (!Fresh.global.dFrame) {
                Fresh.global.dFrame = new Ext.ux.ManagedIframe({
                    autoCreate: {
                        id: 'downloadMIF',
                        src: button.url + '&filter=' + f+'&filterName='+encodeURIComponent(Fresh.global.actions.filterNoAction.getText()),
                        style: 'visibility: hidden'
                    },
                    loadMask: false 
                });
            } else {
                Fresh.global.dFrame.setSrc(button.url + '&filter=' + f+'&filterName='+encodeURIComponent(Fresh.global.actions.filterNoAction.getText()));
            }
            (function(){
                Ext.MessageBox.hide();
            }).defer(5000);
        }
        
        return {

            linkReportButtonHandler: function(button,e) {
              onLinkReportButton(button,e);
            },

            deleteRecordHandler: function(button,e,f) {
              button.form  = Ext.getCmp(f);
              onDeleteRecordButton(button,e);
            },

            editRecordHandler: function(button,e,f) {
              button.form  = Ext.getCmp(f);
              onOpenFilter(button,e);
            },


            askBeforeCloseHandler: function(p,fname) {
                if (!(lf = Ext.getCmp(fname)))
                        return true;
              	return askBeforeClose(p,lf);
            },

            closeWindowHandler: function(f) {
              var win = Ext.getCmp(f);
              if (win) {
		if (win.onlyHide)
		    win.hide();
		else
		    win.close();
              }
            },

            newRecordHandler: function( button, e, f) {
            	
	            button.form  = Ext.getCmp(f);
	            askOnNewRecordButton(button,e);
            },
            duplicateRecordHandler:function(grid,button,e,f){
            	       button.form  = Ext.getCmp(f);
	            askOnDuplciateRecordButton(grid,button,e,f);
            },
            /*duplicateRecordHandler: function(grid,button,e,f){
            	
            		button.form  = Ext.getCmp(f);
            		
                    viewContext = grid.id+'-duplicate';
                    var data = {};
                    var r = {};
                    var idName = grid.store.meta.id;
                    var params = {};
                    for (p in grid.store.baseParams) {
                        params[p] = grid.store.baseParams[p];
                    }
                    if( grid.getSelectionModel().getSelected() ){
                    	
                    	var recId = grid.getSelectionModel().getSelected().id;
                    	
                    	var idName = grid.store.meta.id;
                    	
                    	r[idName] = recId;
                    	
                    	var options = {
                    			url: grid.store.url,
                    			params: Ext.apply(params,{
                    				meta: true,
                    				rows: Ext.encode(r),
                    				context: viewContext
                    			}),
                    			success: function(response){
                    		grid.store.load();
                    	},
                    	failure: function() {
                    		Ext.MessageBox.alert('Error','Error occured while saving preferences.');
                    	}
                    	};
                    	Ext.Ajax.request(options);
                    }
            },*/
           showLessonSettings : function( grid,rowIndex,colIndex ) {
            	grid.saveData();
            	var courseContentStore = grid.getStore();
            	var contentArray = new Array();
            	for(var i=rowIndex;i<courseContentStore.data.length;i++) {
            		var courseContentRec = courseContentStore.getAt(i);
            		contentArray.push({content_id:courseContentRec.get('video_id'),type:courseContentRec.get('type'),name:courseContentRec.get('name')});
            	}
            	var courseContentArray = new Array();
            	for(var i=0;i<courseContentStore.data.length;i++) {
            		var courseContentRec = courseContentStore.getAt(i);
            		courseContentArray.push({content_id:courseContentRec.get('video_id'),type:courseContentRec.get('type'),name:courseContentRec.get('name')});
            	}
            	
            	var course_id = courseContentStore.data.items[0].get('product_id');
            	
            	VideoRecordMgr.updateModifiedLessonSettings(courseContentArray , course_id,function(res,sta){
            		if( sta.status ){
	           			 if (!Ext.isEmpty(res)) {
	    						console.log('Update the lesson settings records is successfully comepleted');
	           			 }else{
	           				console.log('Update the lesson settings records is not comepleted successfully');
	           			 }
            		}
            	},this);
            	
            	VideoRecordMgr.getLessonSettings(course_id,contentArray,function(r,t){
            		if( t.status ){
           			 if (!Ext.isEmpty(r)) {
           				 var currentRec = contentArray[0];
        				 var lessonName = currentRec['name'];
        				 var selectedContentId = currentRec['content_id'];
        				 var lessonsNames = [];
        				 for(var i=1 ; i<r.length ; i++){
        					var dependentRecArray = [], contentRec = [] ,contentChecked = false;
        					contentRec = contentArray[i];
        					dependentRecArray = r[i];
    						if( dependentRecArray[contentRec['content_id']] == 1 ) {
    							contentChecked = true;
    						}
    						lessonsNames.push({
    							boxLabel : contentRec['name'],
    							name : i,
    							checked : contentChecked,
    							contentId : contentRec['content_id']
    						});
        				 }
        				 var lockedValueArray = r[0];
        				 var lockSratus = lockedValueArray['SUB_SEQUENT_LOCK'];
        				 var isEnable = lockedValueArray['isEnabled'];
        				 if(isEnable == 0){
        					 lockSratus = 0;
        				 } else{
        					 lockSratus = (lockSratus == 1) ? 1 : 0;
        				 }
        				 var subSequentLockConditionStore = new Ext.data.ArrayStore({
    							// explicitly create reader
    							fields : ['name','value'],
    							data : [
    								[ 'Unless this lesson is viewed',0],
    								[ 'Unless this lesson is viewed and the task in this lesson is completed',1 ]
    							]
    					});
        				 var cmp = Ext.getCmp('lessonsettingsWin');
        				 if(!cmp){
        					 var newwind=new Ext.Window({
        						 height:400,
        						 title : 'Lesson Settings - '+lessonName,
        						 modal : true,
        						 id:'lessonsettingsWin',
        						 selectedContentId : selectedContentId,
        						 selectedcourseID : course_id,
        						 stateful :false,
        						 constrain : true,
        						 width:700,
        						 layout : 'fit',
        						 items:[{
        							 xtype:'form',
        							 autoScroll : true,
        							 cls : 'quizsettings-form-cls',
        							 items:[
        							        {
        							        	xtype : 'combo',
        							        	mode: 'local',
        							        	width : 400,
        							        	name : 'sub-sequent-lock',
        							        	itemCls : 'sub-sequent-lock-cls',
        							        	labelSeparator:'',
        							        	fieldLabel: 'The following content remains locked',
        							        	store: subSequentLockConditionStore,
        							        	displayField: 'name',
        							        	editable : false,
        							        	readOnly : (isEnable==0) ? true : false,
    						        			valueField: 'value',
    						        			value : lockSratus,
    						        			triggerAction: 'all'
        							        },
        							        ( lessonsNames.length > 0 ) ?
        							        		{
		        							        	xtype:'fieldset',
		        							        	layout: 'anchor',
		        							        	cls:'lesson-subsequent-cls',
		        							        	defaults: {
		        							        		anchor: '100%'
		        							        	},
		        							        	items : [{
		        							        		xtype: 'checkboxgroup',
		        							        		id : 'subsequentcontent-group',
		        							        		columns: 1,
		        							        		items: lessonsNames
		        							        	}]
        							        		} : {}
        							        	],
        							        	buttons:[{
        							        		text:'Save',
        							        		handler:function(){
        							        			var settingsForm = this.findParentByType('form').getForm();
        							        			var subSequentLock = settingsForm.findField('sub-sequent-lock');
        							        			var lessonstobeplayed = Ext.getCmp('subsequentcontent-group');
        							        			var lessonstobeplayedgroup = [];
        							        			var latestLessonsNames = [];
        							        			
        							        			if( !Ext.isEmpty( lessonstobeplayed )){
        							        				lessonstobeplayedgroup = lessonstobeplayed.items.items;
        							        			}
        							        			if( lessonstobeplayed ) {
        							        				latestLessonsNames.push({SUB_SEQUENT_LOCK:subSequentLock.getValue()});
        							        				for( var i=0; i< lessonstobeplayedgroup.length; i++ ) {
        							        					var actualContent = lessonstobeplayedgroup[i];
        							        					latestLessonsNames.push({content_id:actualContent['contentId'],value:actualContent.getValue()});
        							        					if(actualContent.getValue()){
        							        						for(var d=rowIndex+1;d<courseContentStore.data.length;d++) {
        							        		            		var courseContentRec = courseContentStore.getAt(d);
        							        		            		if(courseContentRec.get('video_id') == actualContent['contentId']){
        							        		            			var lessonViewBforeQuiz = courseContentRec.get('LessonViewBforeQuiz');
        							        		            			if(lessonViewBforeQuiz){
            							        		            			var contentIndex =lessonViewBforeQuiz.indexOf(newwind.selectedContentId);
            							        		            			if(contentIndex == -1){
            							        		            				lessonViewBforeQuiz.push(newwind.selectedContentId);
            							        		            			}
        							        		            			}
        							        		            		}
        							        		            	}
        							        					} else {
        							        						for(var f=rowIndex+1;f<courseContentStore.data.length;f++) {
        							        		            		var courseContentRec = courseContentStore.getAt(f);
        							        		            		if(courseContentRec.get('video_id') == actualContent['contentId']){
        							        		            			var lessonViewBforeQuiz = courseContentRec.get('LessonViewBforeQuiz');
        							        		            			if(lessonViewBforeQuiz){
            							        		            			var contentIndex =lessonViewBforeQuiz.indexOf(newwind.selectedContentId);
            							        		            			if(contentIndex != -1){
            							        		            				lessonViewBforeQuiz.splice(contentIndex,1);
            							        		            			}
        							        		            			}
        							        		            		}
        							        		            	}
        							        					}
        							        				}
        							        			}
        							        			var myMask = new Ext.LoadMask(newwind.getEl(), {msg:"Saving..."});
        							        			myMask.show();
        							        			VideoRecordMgr.saveLessonSettings(course_id,newwind.selectedContentId,latestLessonsNames,function(r,t){
        							        				if(!t.status){												
        							        					Ext.MessageBox.alert('Error','Error occured while saving preferences.');
        							        				}     							        				
        							        				myMask.hide();
        							        				newwind.close();
        							        			});
        							        		}//handler
        							        	},{
        							        		text:'Cancel',
        							        		scope : this,
        							        		handler:function(){
        							        			newwind.close();
        							        		}
        							        	}]
        						 }]
        					 });
        					 newwind.show();
        				 }
           			 }
            		}
            	});
            	
            	VideoRecordMgr.processLessonSettings(course_id,contentArray,function(r,t){
            		if( t.status ){
            			 if (!Ext.isEmpty(r)) {
     						console.log('Creating the lesson settings records is successfully comepleted');
            			 }else{
            				console.log('Creating the lesson settings records is not comepleted successfully');
            			 }
    				}
            	},this);
            },
        showQuizSettings : function( grid,rowIndex,colIndex ) {
    			
				grid.saveData();
				var courseStore = grid.getStore();
				var courseContentArray = new Array();
            	for(var i=0;i<courseStore.data.length;i++) {
            		var courseContentRec = courseStore.getAt(i);
            		courseContentArray.push({content_id:courseContentRec.get('video_id'),type:courseContentRec.get('type'),name:courseContentRec.get('name')});
            	}
            	
            	var course_id = courseStore.data.items[0].get('product_id');
            	
            	VideoRecordMgr.updateModifiedLessonSettings(courseContentArray , course_id,function(res,sta){
            		if( sta.status ){
	           			 if (!Ext.isEmpty(res)) {
	    						console.log('Update the lesson settings records is successfully comepleted');
	           			 }else{
	           				console.log('Update the lesson settings records is not comepleted successfully');
	           			 }
            		}
            	},this);
            	
				var recordsForAssociation = [],	lessonsNames = [], unviewedLessons =[],
				postEvaluationOptionValue, requiredSubsequentValue,passedRequiredValue,
				unviewLessonsAreaDesabled = false, randomizeQuestions, requiredcompletecourse ;
				
				
				courseStore.filter([
				                    {
				                        property     : 'type',
				                        value        : 1,
				                        anyMatch     : true, 
				                        caseSensitive: true  
				                      },
				                      {
				                        fn   : function(record) {
				                          return record.get('SettingsExist') == false
				                        },
				                        scope: this
				                      }
				                    ]);
				
				var settingsLessQuizes = [];
				
				if( courseStore.data.length > 0 ){
					
					for( var i = 0; i < courseStore.data.length ; i++ ){
						settingsLessQuizes[i] = {
								courseId : courseStore.data.items[i].get('uid'),
								ordering : courseStore.data.items[i].get('ordering'),
								productId  : courseStore.data.items[i].get('product_id')
						}
					}
					
					VideoRecordMgr.createSettingsToSettingsLessQuizes( settingsLessQuizes ,function(r,t){
						if( t.status ){
							
							grid.store.reload();
						}
						
					},this);
				}
				courseStore.clearFilter();
				
				var selectedQuizRecord = grid.store.getAt( rowIndex );
				grid.selectedRecord = selectedQuizRecord;
				var selectedQuizId = selectedQuizRecord.get('video_id');
				var productIdValue = selectedQuizRecord.get('product_id');
				var passingScoreFieldValue = parseInt(selectedQuizRecord.get('PassingScore'));
				postEvaluationOptionValue = parseInt(selectedQuizRecord.get('PostEvaluationOption'));
				requiredSubsequentValue = parseInt(selectedQuizRecord.get('RequiredSubsequent'));
				passedRequiredValue = parseInt(selectedQuizRecord.get('PassedRequired'));
				randomizeQuestions = parseInt(selectedQuizRecord.get('RandomizeQuestions'));
				requiredcompletecourse = parseInt(selectedQuizRecord.get('RequiredCompleteCourse'));  
				
				if( passingScoreFieldValue == "0" ||  passingScoreFieldValue == null ) {
					
					 passingScoreFieldValue = 0;
				}
				
				if( passedRequiredValue && passingScoreFieldValue ){
					
					unviewLessonsAreaDesabled = true;
				}
			
				for( var i=0; i<rowIndex; i++ ) {
	
					if( grid.getStore().getAt(i).get('type') == 0 ) {
						var lessonChecked = false, unviewedLessonChecked = false;
						var associatedQuizArray = selectedQuizRecord.get('RequiredComplete');
						var unviewedLessonsArray = selectedQuizRecord.get('UnviewedLessons');
						var lessonToViewForAccessQuiz = selectedQuizRecord.get('LessonViewBforeQuiz');
						
						var lessonId = grid.getStore().getAt(i).get('video_id');
						
						if( !associatedQuizArray ) {
								
							associatedQuizArray = [];
						}
						
						if( associatedQuizArray.indexOf( lessonId ) != -1 ) {
						
							lessonChecked = true;
						}
						recordsForAssociation.push( grid.getStore().getAt(i) );
						//If we are able to find the lesson id in the lessonToViewForAccessQuiz.
						//this array will have all the lesson which need to view before attempting this quiz
						if(lessonToViewForAccessQuiz){
							if(lessonToViewForAccessQuiz.indexOf( lessonId ) != -1 ){							
								lessonsNames.push({
									fieldLabel : grid.getStore().getAt(i).get('name'),
									labelSeparator:'',
									labelStyle: 'width:90%;padding-top:6px;',
									name : i,
									checked : true,
									videoId : grid.getStore().getAt(i).get('video_id'),
									cls : 'lessonName_checkbox_hidden',
									listeners:{
										render : function(comp){
											comp.getEl().on('click',function(e,comp){
												e.preventDefault();
											});
										}
									}
								});
							}
						}
						
						
						if( !unviewedLessonsArray ) {
							
							unviewedLessonsArray = [];
						}
						
						if( unviewedLessonsArray.indexOf( lessonId ) != -1 ) {
						
							unviewedLessonChecked = true;
						}
						recordsForAssociation.push( grid.getStore().getAt(i) );
						
						unviewedLessons.push({
							boxLabel : grid.getStore().getAt(i).get('name'),
							name : i,
							checked : unviewedLessonChecked,
							videoId : grid.getStore().getAt(i).get('video_id')
						});
						
					}
					
				}
				var postEvaluationOptionStore = new Ext.data.ArrayStore({
					// explicitly create reader
					fields : ['name','value'],
					data : [
						[ 'Hide quiz summary',1],
						[ 'Show quiz results, no correction',2 ],
						[ 'Show quiz results, show quiz answers, no correction',3 ],
						[ 'Show quiz results, correction allowed',4 ]
					]
				});
				
				 var newwind=new Ext.Window({
								height:400,
								title : 'Evaluation settings', //201407030510
								modal : true,
								selectedQuizId : selectedQuizId,
								productIdValue : productIdValue,
								constrain : true,
								width:700,
								stateful :false,
								layout : 'fit',
								items:[{
									xtype:'form',
									autoScroll : true,
									cls : 'quizsettings-form-cls',
									items:[
									( lessonsNames.length > 0 ) ?
									{
										xtype:'fieldset',
										layout: 'anchor',
									    defaults: {
									           anchor: '100%'
									    },
										items : [{
											
											xtype : 'container',
											cls : 'editsettings-container-cls',
											html : 'Lessons to be viewed before taking this quiz:' //201407030510
										},{
											xtype: 'checkboxgroup',
											id : 'lessonstobeplayed-group',
											columns: 3,
											//hidden :true,										  //201407030510
											//disabled:true,
											items: lessonsNames
										}]
									} : {},
									{
										xtype:'fieldset',
										id : 'quizevaluation',
										title : 'Evaluation',									 //201407030510
										items : [{
											xtype 	  : 'checkbox',
											boxLabel  : 'Hide Marks From Student',
											name      : 'hidemarks',
											hidden 	  : true, 
											id        : 'checkbox1'
										},{
											xtype 	  : 'checkbox',
											boxLabel  : 'Passing score required?',
											name      : 'passingscore',
											checked   : passedRequiredValue ? true :false ,
											listeners : {
												check : function( field,checked){
												
													var settingsForm = this.findParentByType('form').getForm();
													
													var passingScoreField = settingsForm.findField('passingscore-value');
													
													var requiredSubsequent = settingsForm.findField('requiredsubsequent');
													var postEvaluation = settingsForm.findField('postevaluation-options');
													
													var unviewLessonsArea = Ext.getCmp('unviewlessons-area');
												
													if( checked == false ) {
														
														passingScoreField.disable();
														requiredSubsequent.disable();
														!Ext.isEmpty(unviewLessonsArea) ? unviewLessonsArea.disable() : '';
														postEvaluation.disable();
														
													}else {
													
														passingScoreField.enable();
														requiredSubsequent.enable();
														(!Ext.isEmpty(unviewLessonsArea) && postEvaluation.getValue() != 4) ? unviewLessonsArea.enable() : '';//20131114210
														postEvaluation.enable();
													}
												}
											}
										},{
											xtype 	  : 'checkbox',
											boxLabel  : 'Randomize questions',
											name      : 'randomizequestions',
											hidden 	  : true, 
											checked	  : randomizeQuestions ? true : false
										},{
											xtype : 'spinnerfield',
											fieldLabel : 'Passing Score (%)',
											itemCls : 'spinnerfiled-cls',
											labelStyle : 'width : 120px;',
											name: 'passingscore-value',
											disabled : passedRequiredValue ? false : true,
											value : passingScoreFieldValue ? passingScoreFieldValue : 0,
											minValue: 0,
											maxValue: 100,
											accelerate: true,
											enableKeyEvents : true,
											allowNegative :false,
											width: 60,
											listeners : {
												keyup : function(){
													
													if( this.getValue() <0 || this.getValue() > 100 ) {
														Ext.MessageBox.alert( 'Alert!', 'Passing score should not be more then 100.');
														return false;
													}
												}
											}
										}, {
											xtype : 'checkbox',
											boxLabel  : 'Passing required to play subsequent content',  //201407030510
											name : 'requiredsubsequent',
											disabled : passedRequiredValue ? false : true,
											checked   : requiredSubsequentValue > 0 ? true :false
										}, { //201407030510
											xtype : 'checkbox',
											boxLabel  : 'Passing required to complete the course',
											hidden:true,
											name : 'requiredcompletecourse',
											checked : requiredcompletecourse ? true :false
										},{
											
											xtype : 'combo',
											mode: 'local',
											width : 300,
											name : 'postevaluation-options',
											itemCls : 'spinnerfiled-cls',
											fieldLabel: 'Post Evaluation Options',
											store: postEvaluationOptionStore,
											displayField: 'name',
											valueField: 'value',
											disabled : passedRequiredValue ? false : true,
											value : postEvaluationOptionValue ? postEvaluationOptionValue : 4,
											triggerAction: 'all',
											listeners : { //20131114210
												select:function( combo, records, eOpts ){
												
													var unviewLessonsArea = Ext.getCmp('unviewlessons-area');
													if(records.get('value') == 4  ){
														unviewLessonsArea.disable();
                                                        var checkboxes = Ext.getCmp('markedunviewedonfail-group').items.items;
                                                        for( var k=0;k<checkboxes.length;k++){
                                                            checkboxes[k].setValue( false);
                                                        }
													}else{
														unviewLessonsArea.enable();
													}
												}
											}
											
										},( unviewedLessons.length > 0 )?{
											xtype:'fieldset',
											id : 'unviewlessons-area',
											layout: 'anchor',
										    defaults: {
										           anchor: '100%'
										    },
											disabled : ( passedRequiredValue && postEvaluationOptionValue != 4 ) ? false : true,  //20131114210
											items : [{
												xtype : 'container',
												cls : 'editsettings-container-cls',
												html : 'Lessons to be marked not viewed on failure'
											},{
											
												xtype: 'checkboxgroup',
												id:'markedunviewedonfail-group',
												columns: 3,
												items: unviewedLessons
											}]
										}:{
											 xtype: 'container'
										}]
									}],
									buttons:[{
										 text:'Save',
										 handler:function(){
										 
											var settingsForm = this.findParentByType('form').getForm();
											var lessonstobeplayed = Ext.getCmp('lessonstobeplayed-group');
											var lessonstobeplayedgroup = [];
											if( !Ext.isEmpty( lessonstobeplayed )){
												lessonstobeplayedgroup = lessonstobeplayed.items.items;
											}
											var passingScoreRequire = settingsForm.findField('passingscore');
											var passingScore = settingsForm.findField('passingscore-value');
											var requiredSubsequent = settingsForm.findField('requiredsubsequent');
											var postEvaluation = settingsForm.findField('postevaluation-options');
											var unviewLessonsArea = Ext.getCmp('unviewlessons-area');
											var markedunviewedonfail = Ext.getCmp('markedunviewedonfail-group');
											var randomizeQuestions = settingsForm.findField('randomizequestions');
											var requiredCompleteCourse = settingsForm.findField('requiredcompletecourse');
											
											var videoIds = [],
											selectedGroupVideoIds = [],
											unmarkedVideoIds = [];
											
											if( lessonstobeplayed ) {
											
												for( var i=0; i< lessonstobeplayedgroup.length; i++ ) {
													
													videoIds.push( lessonstobeplayedgroup[i].videoId );
													if( lessonstobeplayedgroup[i].getValue() )
														selectedGroupVideoIds.push( lessonstobeplayedgroup[i].videoId );
												}
											}
											
											if( markedunviewedonfail && postEvaluation.getValue() != 4 ) { //20131114210
												
												for( var i=0; i< markedunviewedonfail.getValue().length; i++ ) {
													
													if( passingScoreRequire.getValue() )
														unmarkedVideoIds.push( markedunviewedonfail.getValue()[i].videoId );
													
												}
											}
											var myMask = new Ext.LoadMask(newwind.getEl(), {msg:"Saving..."});
											myMask.show();
											
											var quizSettings = {
													productId 			: newwind.productIdValue,
													quizId				: newwind.selectedQuizId,
													videoIds			: videoIds,
													selectedVideoIds	: selectedGroupVideoIds,
													passingScoreRequire : passingScoreRequire.getValue(),
													passingScore		: passingScoreRequire.getValue() && passingScore.getValue() ? passingScore.getValue() : 0,
													requiredSubsequent	: passingScoreRequire.getValue() && requiredSubsequent.getValue() ? requiredSubsequent.getValue() : 0,
													postEvaluation		: passingScoreRequire.getValue() &&  postEvaluation.getValue() ? postEvaluation.getValue() : 0,
													lessonsUnviewed		: unmarkedVideoIds,
													randomizeQuestions	: randomizeQuestions.getValue(),
													requiredCompleteCourse : requiredCompleteCourse.getValue()
													
											};
											
										    var params = {};
							                    for (p in grid.store.baseParams) {
							                        params[p] = grid.store.baseParams[p];
							                    }
											var options = {
					                    			url: grid.store.url,
					                    			params: Ext.apply(params,{
					                    				rows: Ext.encode(quizSettings),
					                    				context: 'coursecontent-quiz-settings'
					                    			}),
					                    			success: function(response){
					                    		grid.store.load();
					                    		myMask.hide();
												newwind.close();
					                    	},
					                    	failure: function() {
					                    		Ext.MessageBox.alert('Error','Error occured while saving preferences.');
					                    	}
					                    	};
											if(passingScore.getValue() && passingScore.getValue() > 100){
												
												Ext.MessageBox.alert( 'Alert!', 'Passing score should not be more then 100.',function(){
													myMask.hide();
												},this);
											}else{
												
												if( grid.selectedRecord && grid.selectedRecord.get('type') == 1 ) {
													Ext.Ajax.request(options);
												}else{
													//TODO for lesson settings
													myMask.hide();
												}
											}
							                   
										 }
									},{
										 text:'Cancel',
										 scope : this,
										 handler:function(){
											newwind.close();
										 }
									}]
								}]
							});
						newwind.show();
			}, 
            createNewQuestion : function( grid ) {
            	
            	var gr = Ext.getCmp(grid),
                fields = gr.store.meta.fields,
                Record = Ext.data.Record.create(fields),
                rec = new Record();
	            gr.stopEditing();
	            gr.store.insert(0, [rec]);
	            gr.getSelectionModel().selectFirstRow();
	            rec = gr.store.getAt(0);
	            var parentId = Ext.getCmp(gr.parentGrid).getSelectionModel( ).getSelections()[0].get('content_id');
	            if( !parentId ){
	            	parentId = gr.getStore().baseParams.filter;
	            }
	            rec.set('parent_id', parentId);
	            rec.set('name','... New item');
	            rec.set('ordering',gr.getStore().getAt(gr.getStore().data.length-1).get('ordering')+10);
	            gr.saveData('quizes-grid-store',false,function(r,o){
	            	/*#29015  201407171130
	            	 * Here updating question's paging toolbar count.
	            	 */
	            	gr.toolbars[1].doLoad();
	                var rr = gr.store.find('uid',r.result.rows[0].uid);
	                gr.getSelectionModel().selectRow(rr,false);
	                gr.newQuestionId = r.result.rows[0].uid;
	                gr.fireEvent('rowclick',gr,{});
	            });
            
            },
            /*
             * This method deletes the Quiz or question
             */
            deleteGridToolRecord : function( button,e ){

                var grid = button.form;
                var sm = grid.getSelectionModel();
                if (sm && sm.hasSelection()) {
                
                    Ext.MessageBox.confirm(__('Confirm'), __('Are you sure you want to remove selected rows?'), function(btn, text){
                        if (btn == 'yes') {
                            deleteGridRow(grid);
                        }
                    });
                }
            },
            /*#29019
             * Here this method is identifiy the selected grid form is dirty or not,
             * if it is dirty return true other wise false
             */ 
            isSelectedFormDirty : function( selectedGrid ){
            	
            	var lf = ( selectedGrid.linkedForm ? selectedGrid.linkedForm : selectedGrid ),
				finalized = parseInt(Ext.getCmp('quiz-form').getForm().getValues(false,true).Finalized);	
				linkedForm =lf.getForm(),
				quizGroupModified = linkedForm.isDirty(),
				modified=[];
				if (gs = lf.findByType('autogrid')) {
					for (i=0;i<gs.length;i++) {
						if( gs[i].getStore().getModifiedRecords().length > 0 ){
							modified =  gs[i].getStore().getModifiedRecords().length ;
						}
					}
				}
				if( lf.askBeforeLoad && !finalized && 
							( quizGroupModified || 
										( !lf.disabled && 
													( lf.getForm().isDirty() || 
															( lf.linkedGrid && lf.linkedGrid.store.dirty ) ) ||	
																	modified > 0) ) ){
					return true;
				}else{
					return false;
				}
            },
            
            /*
             * Here before creating a new quiz or question or duplicating a quiz
             * we arer first checking for form dirty, if the form is not dirty then 
             * we are creating the records.
             * */
            
            checkFormDirty : function( fromButton, grid,button,e ){
            	
            	this.grid = Ext.getCmp('quizgroups-grid');
                var form  = Ext.getCmp('quiz-form');
                //var grid = this.grid;
        		var lf = this.grid.linkedForm;
        		if( this.grid.linkedForm.autogridId && !this.grid.linkedForm.disabled){
        			var lfaugId = this.grid.linkedForm.autogridId;

        			var modified = Ext.getCmp( lfaugId ).getStore().getModifiedRecords().length;

        		}
        		if (gs = this.grid.linkedForm.findByType('autogrid')) {
        			for (i=0;i<gs.length;i++) {
        				if( gs[i].getStore().getModifiedRecords().length > 0 ){
        					modified =  gs[i].getStore().getModifiedRecords().length ;
        				}
        			}
        		}
        		
        		if (lf.askBeforeLoad && ( !lf.disabled &&
        				( lf.getForm().isDirty() || ( lf.linkedGrid && lf.linkedGrid.store.dirty ) ) || modified > 0
        		)){
        			
        			Ext.MessageBox.confirm(__('Confirm'), __('You have unsaved changes. Proceed?'), function(btn, text){
        				if (btn == 'yes') {
        					
        					
        					//this.grid.getSelectionModel().selectRow(e ,false, false );
        					lf.getForm().reset();
        					Ext.getCmp('question-form').getForm().reset();
        					
        					if ( lf.linkedGrid ){

        						lf.linkedGrid.store.rejectChanges();
        					}else if( lf.autogridId  ){
        						var lfaugId = lf.autogridId;
        						Ext.getCmp( lfaugId).store.rejectChanges();
        					}

        					//
        					// reject all the changes of the autogrids under the linked form
        					//

        					if (gs = this.grid.linkedForm.findByType('autogrid')) {
        						for (i=0;i<gs.length;i++) {
        							gs[i].getStore().rejectChanges();
        						}
        					}
        					this.doAction( fromButton, grid,button,e );
        				}
        				else {
        					//If the user clicks on No button then changed the selection to previously selected one
        					return;

        				}
        			},this);
        		} else {
        			
        			this.doAction( fromButton, grid,button,e );
        		}
                	
            },
            
            /**
             * This method is taking care of calling to the corresponding method 
             * based on the action.
             * */
            doAction  : function( fromButton,grid,button,e ){
         
            	var quizSelected = Ext.getCmp('quizgroups-grid').getSelectionModel().getSelected();
            	grid.duplicateContentId = undefined;
            	grid.newQuestionId = undefined;
            	loadEmptyRecord();
            	if( fromButton == 'New quiz'){
            		
            		grid.getSelectionModel().clearSelections(true);
            		grid.getView().refresh();
            		this.newRecordHandler( button,e,'quiz-form' );
            		
            	} else if( fromButton == 'Duplicate quiz' ){
            		
            		this.duplicateRecordHandler( grid,button,e,'quiz-form' );
            		
            	} else if( fromButton == 'New quiz question' ){
            		
            		this.createNewQuestion('quizes-grid');
            	}else if( fromButton == 'Duplicate question' && quizSelected ){
            		
            		this.duplicateRecordHandler( grid,button,e,'question-form' );
            	}
            },
            deleteFromGridHandler: function(button,e,f) {
              button.form  = Ext.getCmp(f);
              onDeleteGridTool(button,e);
            },

            deleteGridRowHandler: function(grid,recs) {
              deleteGridRow(grid,recs);
            },


	    fnSwitchFNHandler: function(button,e) {
              onFnSwitchButton(button,e);
            },

	    newFolderNodeHandler: function(button,e,f) {
              button.form  = Ext.getCmp(f);
              onNewFolderNode(button,e);
            },

            saveFormHandler: function(button,e,f, errorCallBack,defaultRec ) {
                button.form = Ext.getCmp(f);
                onSaveButton(button,e, errorCallBack,defaultRec);
            },

            saveGridHandler: function(button,e,f) {
                button.form = Ext.getCmp(f);
                onSaveGridTool(button,e);
            },

            addGridHandler: function(button,e,f) {
                button.form = Ext.getCmp(f);
                onAddGridTool(button,e);
            },
            addRecordHandler: function(gr,r) {
                addRecordGrid(gr,r);
            },

            cancelGridHandler: function(button,e,f) {
                button.form = Ext.getCmp(f);
                onCancelGridTool(button,e);
            },

            cancelFormHandler: function(button,e,f) {
                button.form = Ext.getCmp(f);
                onCancelButton(button,e);
            },

            importHandler: function(button,e,f) {
                if ('string' === typeof f)
                    button.form = Ext.getCmp(f);
                onImportButton(button,e);
            },
            
            showFNCycle: new Ext.Action({
                text: '<b>FNCycle: '+Fresh.FNCycle+'</b>',
                handler: Ext.emptyFn,
                disabled: false
            }),

            newRecord: new Ext.Action({
                text: __('New'),
                minWidth: 75,
                handler: askOnNewRecordButton,
                disabled: false
            }),

            save: new Ext.Action({
                text: __('Save'),
                minWidth: 75,
                iconCls: 'icon-ok',
                handler: onSaveButton,
                disabled: false
            }),

            saveGridTool: new Ext.Action({
                iconCls: 'icon-save',
                text: __('Save'),
                handler: onSaveGridTool,
                disabled: false
            }),

            search: new Ext.Action({
                text: __('Search'),
                minWidth: 75,
                handler: onSearchButton,
                disabled: false
            }),

            cancelGridTool: new Ext.Action({
                iconCls: 'icon-cancel',
                text: __('Cancel'),
                handler: onCancelGridTool,
                disabled: false
            }),

            addGridTool: new Ext.Action({
                iconCls: 'icon-new',
                text: __('Add'),
                handler: onAddGridTool,
                disabled: false
            }),

            deleteGridTool: new Ext.Action({
                iconCls: 'icon-delete',
                text: __('Delete'),
                handler: onDeleteGridTool,
                disabled: false
            }),

            cancel: new Ext.Action({
                text: __('Cancel'),
                iconCls: 'icon-cancel',
                minWidth: 75,
                handler: onCancelButton,
                disabled: true
            }),

            expandTree: new Ext.Action({
                text: __('Expand all'),
                iconCls: 'expand',
 //               minWidth: 75,
                handler: onExpandTreeButton
            }),

            collapseTree: new Ext.Action({
                text: __('Collapse all'),
                iconCls: 'collapse',
 //               minWidth: 75,
                handler: onCollapseTreeButton,
                disabled: false
            }),

            reloadTree: new Ext.Action({
                text: __('Reload'),
                iconCls: 'reload',
 //               minWidth: 75,
                handler: onReloadTreeButton,
                disabled: false
            }),

            reloadNode: new Ext.Action({
                text: __('Reload'),
                iconCls: 'reload',
 //               minWidth: 75,
                handler: onReloadNode,
                disabled: false
            }),
            
            cuepointsHelpWin: new Ext.Action({
                text: __(''),
                iconCls: 'icon-cuepoints-help-win',
                handler: onCuepointsHelpWin,
                disabled: false
            }),
            
            reloadGrid: new Ext.Action({
             //   id: 'refresh',
                text: __('Reload'),
                iconCls: 'reload',
                handler: onReloadGridButton,
                disabled: false
            }),
            
            deleteNode: new Ext.Action({
             //   id: 'refresh',
                text: __('Delete'),
                iconCls: 'icon-delete',
                handler: onDeleteNode,
                disabled: false
            }),

            trueDeleteNode: new Ext.Action({
             //   id: 'refresh',
                text: __('Delete'),
                iconCls: 'icon-delete',
                handler: onTrueDeleteNode,
                disabled: false
            }),

            emptyRecycleBin: new Ext.Action({
             //   id: 'refresh',
                text: __('Empty Recycle Bin'),
                iconCls: 'icon-delete',
                handler: onEmptyRecycleBin,
                disabled: false
            }),

            renameNode: new Ext.Action({
             //   id: 'refresh',
                text: __('Rename'),
                iconCls: 'icon-rename',
                handler: onRenameNode,
                itemId: 'renameNodeAction',
                disabled: false
            }),
            
            openFilter: new Ext.Action({
             //   id: 'refresh',
                text: __('Open'),
                iconCls: 'icon-open',
                handler: onOpenFilter,
                disabled: false
            }),
            
            newNode: new Ext.Action({
                text: __('New filter'),
                iconCls: 'icon-new',
                handler: onNewNode,
                disabled: false
            }),
            
            newCategoryNode: new Ext.Action({
                text: __('New category'),
                iconCls: 'icon-folder-new',
                handler: onNewFolderNode,
                hideOnClick: true,
                disabled: false
            }),

            filterNoAction: new Ext.Action({
                text: __('No filter'),
                iconCls: 'icon-action'
                }),
            filterNoActionOpen: new Ext.Action({
                text: __('No filter'),
                iconCls: 'icon-action'
                }),
            newFolderNode: new Ext.Action({
                text: __('New folder'),
                itemId: 'newFolderNodeAction',
                iconCls: 'icon-folder-new',
                handler: onNewFolderNode,
                disabled: false
            }),
			saveFormData: function(form) { 
				onSaveButton(form); 
			},
			getRecsFromCsvForMarkers: function(grid, ta){
				//201406111043
				//This method is used for the Parse the input data and creation of store records and 
				//push the data into created records and insert the records into store
				document.body.removeChild(ta);
				var store = grid.store;
				var RowRec = Ext.data.Record.create(grid.store.meta.fields);
				var del = '';

				if (ta.value.indexOf("\r\n")) {
					del = "\r\n";
				} else if (ta.value.indexOf("\n")) {
					del = "\n"
				}

				var actualRows = ta.value.split("\n");
				var rows = [];
				var n=0;
				for(var a=0 ; a<actualRows.length ; a++){
					if(actualRows[a] != ""){
						rows[n] = actualRows[a];
						n++;
					}
				}
				//Total Columns in the Grid (Visible columns excluding the selection model column)
				var columns = [];
				var c = 0;
				var totalColumns = grid.colModel.config;
				if(totalColumns.length > 0 ){
					for(var k=0 ; k<totalColumns.length ; k++){
						if(totalColumns[k].dataIndex){
							columns[c] = totalColumns[k];
								c++;
						}
					}
				}
				
				for (var i=0; i<rows.length; i++) {
					var cols = rows[i].split("\t");

					if (cols.length > columns.length){
						cols = cols.slice(0, columns.length-1)
					}
					//201406130247
					//if(!grid.gmRow){
						grid.gmRow = store.data.length;
					//}
					//if(!grid.gmCol){
						grid.gmCol = 0;
					//}
					
					if (grid.gmRow === -1 || grid.gmCol === -1) {
						Ext.Msg.alert('Select a cell before pasting and try again!');
						return;
					}

					var cfg = { uid: '',
								name: 'H',
								description: 'Marker',
								transcript: '',
								videos_id: '',
								startFormated: '',
								stopFormated: '',
								is_enabled: 0,
								skippable: 0,
								ishidden: 1,
								buttonposition: 'Right bottom',
								isActive: 0
					};
					
					var tmpRec = grid.store.getAt(grid.gmRow);
					var existing = false;
					if (tmpRec) {
						cfg = tmpRec.data;
						existing = true;
					}

					var l = cols.length;
					if (grid.gmCol+cols.length > columns.length)
					l = columns.length - grid.gmCol;
					for (var j=grid.gmCol; j<grid.gmCol+l; j++) {
						if (cols[j] === "") {
							if(columns[j].dataIndex == "buttonposition") {
								cols[j-grid.gmCol] = 'Right bottom';
							}
						} else{
							if(columns[j].dataIndex == "buttonposition") {
							    var buttonPos = cols[j-grid.gmCol];
							    buttonPos = buttonPos.toLowerCase();
								if(buttonPos == 'right bottom' || buttonPos == 'rightbottom'){
									cols[j-grid.gmCol] = 'Right bottom';
								} else {
									cols[j-grid.gmCol] = 'Center middle';
								}
							}else if(columns[j].dataIndex == "startFormated"){
								var actual = cols[j-grid.gmCol];
								var actualValArray = actual.split(':');
			               		var finalVal = '';
								var temp = 0;
								if(actualValArray[0].length < 2){
			               			finalVal = ((temp.toString()).concat(actualValArray[0])).concat(':');
			               		}else {
			               			finalVal = actualValArray[0].concat(':');
			               		}
							    if(actualValArray[1].length < 2){
			               			finalVal = finalVal.concat(((temp.toString()).concat(actualValArray[1])).concat(':'));
			               		}else {
			               			finalVal = finalVal.concat(actualValArray[1]).concat(':');
			               		}
			               		if(actualValArray[2].length < 2){
			               			finalVal = finalVal.concat(((temp.toString()).concat(actualValArray[2])));
			               		}else {
			               			finalVal = finalVal.concat(actualValArray[2]);
			               		}
								cols[j-grid.gmCol] = finalVal;
							}
						}
						cfg[columns[j].dataIndex] = cols[j-grid.gmCol];
					}
					var tmpRow = grid.gmRow;
					var tmpCol = grid.gmCol;
					grid.getSelectionModel().clearSelections(true);
					var tmpRec = new RowRec(cfg);
					tmpRec.markDirty( );
					if (existing){						
						try{							
							store.removeAt(tmpRow);
							//201406130247
							var rec = store.modified[tmpRow];
							store.modified.remove(rec);
						}catch(e){
							console.log('REmoving record failed');
						}
					}
					store.insert(tmpRow, tmpRec);
					grid.gmRow = ++tmpRow;
					grid.gmCol = tmpCol;
				}
				store.sort("startFormated","ASC");
				grid.getView().refresh();
				var isHaveErrorData = false;
				for(var mark=0 ; mark < store.data.items.length ; mark++){
					var markerRecord = store.getAt(mark);
					var pauseTime = markerRecord.get('startFormated');
					var timeTest = /^([0-9][0-9]|[0-9]):([0-5][0-9]|[0-9]):([0-5][0-9]|[0-9])$/i;
					var result = timeTest.test(pauseTime);
					if(result){
		               if(pauseTime){
		               		var actualValArray = pauseTime.split(':');
		               		var finalVal = '';
							var temp = 0;
		               		if(actualValArray[0].length < 2){
		               			finalVal = ((temp.toString()).concat(actualValArray[0])).concat(':');
		               		}else {
		               			finalVal = actualValArray[0].concat(':');
		               		}
						    if(actualValArray[1].length < 2){
		               			finalVal = finalVal.concat(((temp.toString()).concat(actualValArray[1])).concat(':'));
		               		}else {
		               			finalVal = finalVal.concat(actualValArray[1]).concat(':');
		               		}
		               		if(actualValArray[2].length < 2){
		               			finalVal = finalVal.concat(((temp.toString()).concat(actualValArray[2])));
		               		}else {
		               			finalVal = finalVal.concat(actualValArray[2]);
		               		}
		               		markerRecord.set('startFormated',finalVal);
					   }
					}else{
						var desiredCell = Ext.getCmp('markercuepoints-grid').getView().getCell(mark,1);
						desiredCell.className += " cell-incorrect-data";		
						isHaveErrorData = true;
					}
					
					if(isHaveErrorData){
						Ext.getCmp('video-form-save-button').setDisabled(true);
						Ext.getCmp('video-form-finalize-button').setDisabled(true);
						var errorCmp = Ext.getCmp('makererrorcontent');
			    		errorCmp.setVisible(true);
					}else{
						var coursegrid = Ext.getCmp('videos-grid');
                        var courseSelectedRec = coursegrid.getSelectionModel().getSelections()[0];
                        if(courseSelectedRec.get('is_finished') == 0){
								Ext.getCmp('video-form-save-button').setDisabled(false);
								Ext.getCmp('video-form-finalize-button').setDisabled(false);
						}
					}
				}
				grid.gmRow = 0;
				grid.gmCol = 0;
			},
			getRecFromCsvForCuepoints : function(grid, ta){
				//201406130247
				//This method is used for the Parse the input data and creation of store records and 
				//push the data into created records and insert the records into store
				document.body.removeChild(ta);
				var store = grid.store;
				var RowRec = Ext.data.Record.create(grid.store.meta.fields);
				var del = '';

				if (ta.value.indexOf("\r\n")) {
					del = "\r\n";
				} else if (ta.value.indexOf("\n")) {
					del = "\n"
				}

				var actualRows = ta.value.split("\n");
				var rows = [];
				var n=0;
				for(var a=0 ; a<actualRows.length ; a++){
					if(actualRows[a] != ""){
						rows[n] = actualRows[a];
						n++;
					}
				}
				//Total Columns in the Grid (Visible columns excluding the selection model column)
				var columns = [];
				var c = 0;
				var totalColumns = grid.colModel.config;
				if(totalColumns.length > 0 ){
					for(var k=0 ; k<totalColumns.length ; k++){
						if(totalColumns[k].dataIndex){
							columns[c] = totalColumns[k];
								c++;
						}
					}
				}
				
				for (var i=0; i<rows.length; i++) {
					var cols = rows[i].split("\t");

					if (cols.length > columns.length){
						cols = cols.slice(0, columns.length-1)
					}
					
					//if(!grid.gRow){
						grid.gRow = store.data.length;
					//}
					//if(!grid.gCol){
						grid.gCol = 0;
					//}
					
					if (grid.gRow === -1 || grid.gCol === -1) {
						Ext.Msg.alert('Select a cell before pasting and try again!');
						return;
					}

					var cfg = { uid: '',
								name: 'CH',
								description: 'Chapter',
								transcript: '',
								videos_id: '',
								startFormated: '',
								stopFormated: '',
								is_enabled: 0,
								skippable: 0,
								ishidden: 1,
								buttonposition: 'Right bottom',
								isActive: 0
					};
					
					var tmpRec = grid.store.getAt(grid.gRow);
					var existing = false;
					if (tmpRec) {
						cfg = tmpRec.data;
						existing = true;
					}

					var l = cols.length;
					if (grid.gCol+cols.length > columns.length)
					l = columns.length - grid.gCol;
					for (var j=grid.gCol; j<grid.gCol+l; j++) {
						if (cols[j] === "") {
							if(columns[j].dataIndex == "skippable") {
								cols[j-grid.gCol] = 0;
							}
						} else{
							if(columns[j].dataIndex == "skippable") {
								cols[j-grid.gCol] = 1;
							}else if(columns[j].dataIndex == "startFormated"){
								var actual = cols[j-grid.gCol];
								var actualValArray = actual.split(':');
			               		var finalVal = '';
								var temp = 0;
								if(actualValArray[0].length < 2){
			               			finalVal = ((temp.toString()).concat(actualValArray[0])).concat(':');
			               		}else {
			               			finalVal = actualValArray[0].concat(':');
			               		}
							    if(actualValArray[1].length < 2){
			               			finalVal = finalVal.concat(((temp.toString()).concat(actualValArray[1])).concat(':'));
			               		}else {
			               			finalVal = finalVal.concat(actualValArray[1]).concat(':');
			               		}
			               		if(actualValArray[2].length < 2){
			               			finalVal = finalVal.concat(((temp.toString()).concat(actualValArray[2])));
			               		}else {
			               			finalVal = finalVal.concat(actualValArray[2]);
			               		}
								cols[j-grid.gCol] = finalVal;
							}
						}
						cfg[columns[j].dataIndex] = cols[j-grid.gCol];
					}
					var tmpRow = grid.gRow;
					var tmpCol = grid.gCol;
					grid.getSelectionModel().clearSelections(true);
					var tmpRec = new RowRec(cfg);
					tmpRec.markDirty( );
					if (existing){	
						try{							
							store.removeAt(tmpRow);
							var rec = store.modified[tmpRow];
							store.modified.remove(rec);
						}catch(e){
							console.log('REmoving record failed');
						}
					}
					
					try{
						store.insert(tmpRow, tmpRec);
					}catch (e) {
						console.log('insert record failed');
					}
					grid.gRow = ++tmpRow;
					grid.gCol = tmpCol;
				}
				store.sort("startFormated","ASC");
				grid.getView().refresh();
				var isHaveErrorData = false;
				for(var cue=0 ; cue < store.data.items.length ; cue++){
					var cueRecord = store.getAt(cue);
					var startTime = cueRecord.get('startFormated');
					var timeTest = /^([0-9][0-9]|[0-9]):([0-5][0-9]|[0-9]):([0-5][0-9]|[0-9])$/i;
					var result = timeTest.test(startTime);
					if(result){
		               if(startTime){
		               		var actualValArray = startTime.split(':');
		               		var finalVal = '';
							var temp = 0;
		               		if(actualValArray[0].length < 2){
		               			finalVal = ((temp.toString()).concat(actualValArray[0])).concat(':');
		               		}else {
		               			finalVal = actualValArray[0].concat(':');
		               		}
						    if(actualValArray[1].length < 2){
		               			finalVal = finalVal.concat(((temp.toString()).concat(actualValArray[1])).concat(':'));
		               		}else {
		               			finalVal = finalVal.concat(actualValArray[1]).concat(':');
		               		}
		               		if(actualValArray[2].length < 2){
		               			finalVal = finalVal.concat(((temp.toString()).concat(actualValArray[2])));
		               		}else {
		               			finalVal = finalVal.concat(actualValArray[2]);
		               		}
		               		cueRecord.set('startFormated',finalVal);
					   }
					}else{
						var desiredCell = Ext.getCmp('cuepoints-grid').getView().getCell(cue,3);
						desiredCell.className += " cell-incorrect-data";
						isHaveErrorData = true;
					}
				}
				if(isHaveErrorData){
					Ext.getCmp('video-form-save-button').setDisabled(true);
					Ext.getCmp('video-form-finalize-button').setDisabled(true);
					var errorCmp = Ext.getCmp('cuepointerrorcontent');
		    		errorCmp.setVisible(true);
				}else{
					var coursegrid = Ext.getCmp('videos-grid');
                    var courseSelectedRec = coursegrid.getSelectionModel().getSelections()[0];
                    if(courseSelectedRec.get('is_finished') == 0){
							Ext.getCmp('video-form-save-button').setDisabled(false);
							Ext.getCmp('video-form-finalize-button').setDisabled(false);
					}
				}
				
				grid.gRow = 0;
				grid.gCol = 0;
			}
        }
}();

Ext.ux.Plugin.ComponentService = function (config){
	var defaultType = config.xtype || 'panel';
    var defaultScope = config.scope || this;
    var callback = function(res){ 
        var aResult = res.responseText.split('/* --- */');
        
        while (aResult.length>1) {
            sObj = aResult.shift();
            oObj = Ext.decode(sObj);
            if (oObj.evalTo == 'global') {
                if (oObj.overwrite || !Ext.type(Fresh.global[oObj.name])) 
                    Fresh.global[oObj.name] = Ext.decode.call(Fresh.global, oObj.definition);
            }
            else {
                if (oObj.evalTo == 'local' || !oObj.evalTo) 
                    if (oObj.overwrite || !Ext.type(defaultScope[oObj.name])) {
                        var obj = Ext.decode.call(defaultScope, oObj.definition);
                        defaultScope[oObj.name] = obj;
                    }
            }
        }
        var JSON = Ext.decode.call(defaultScope,aResult[0]);
        var cpm = Ext.ComponentMgr.create(JSON, defaultType);
		this.container.add(cpm).show();
		this.container.doLayout() ;
        cpm.store.load({meta: true});
	};
    return{
		init : function (container){
			this.container = container;
            this.container.loadComponent = this.load.createDelegate(this);
    	},
        load: function(cfg) {
            var cfg = cfg || {};
            Ext.Ajax.request(Ext.apply(config, {success: callback, scope: this}, cfg));
        }
	}
};

Fresh.global.actions = MyDesktop.actions;
