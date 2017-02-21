/**
 * Task/Issue      Author    			UniqueID        Comment   
 *---------------------------------------------------------------------------------------------------------------------------------------------------
 * 23063		Arunkumar.muddada	    201310270625    Because of this fit layout bottom scroll bar is comming when the summary page have so many questons
 * 
 * 23253		Venkatesh Teja			201310300510	Because of removing layout: fit config Quiz panel view is dirstubing with multple horizental scrollbars So added again
 * 
 * 23386   		Arunkumar.muddada       201311081859    Here we are disabling this icon as at the starting stage of player launch it is not having any images.
 * 														And in Classroom.js we have code to enable or disable according to the Quiz Question is having the image
 * 
 * 23192        Dinesh GK    			20131114210		For handling the showQuizSummary functionality, update the Quiz score record in product_quiz_scores table.
 * 22689        Tapaswini Sabat			201311141653    When we loading the quiz summary by clicking the reference from 
 * 														Messagewindow, we are refreshing the chapters list.
 * 23710        Dinesh GK    			20131126600		Modification is done in tabchange event,showQuizSummary method.For showing alert for quiz fails scenario.
 * 22766        Dinesh GK    			201311281230	Modification is done for firing the markunviewedlessons event  ,In this event based on the 3rd parameter we are make the lesson as unmarked
 * 22766        Dinesh GK    			20131130801 	Modification is done for firing the markunviewedlessons event  ,It that quiz passed only we are mark the lesson as unviewed.
 * 22766        Dinesh GK    			2013123730		Modification is done for markunviewedlessons event,change quiz bulb icon to failed bulb,if quiz is failed
 * 27665        Arunkumar.muddada       201406210404    Added : beforecollapse , beforeexpand to show and hide the quiz name as the header.
 * 28961		Dinesh GK				201407070707	Modified: tabpanel tabchange event is chnaged, the summary related code is moved to evaluateQuizSummary() method,
 *																	showQuizSummary() summary content is updated to summay card.
 */
Ext.define('SWP.view.quiz.Wizard', {
	extend: 'Ext.panel.Panel',

	alias: 'widget.quiz',

    requires: ['Ext.form.Panel', 'Ext.form.field.ComboBox', 'SWP.view.quiz.LongRadioGroup','SWPCommon.view.BadgeTabPanel'],

	title: 'Evaluation',
	width: 350,
	layout: 'fit',     //201310270625,  uncommented this line 201310300510
	cls:'quiz-panel-cls',
	 minWidth :300,
	 style: {
    	 margin: '4px'
     },
	split: true,
	initComponent: function() {
		var me=this;
		Ext.apply(this, {
			dockedItems: [{
			    xtype: 'toolbar',
			    dock: 'bottom',
			    cls : 'quiz-wizard-toolbar',
			    flexCroll:false,
//			    style :{
//				
//			},
			    items: [
			{
				iconCls: 'icon-prev-question',
				id:'prev-question',
//				tooltip : QUIZ.PREVIOUS_QUESTION,
				tooltip : { 
					text :  QUIZ.PREVIOUS_QUESTION,
					anchor :'bottom'
				},
				handler: function() {
					var tabs = me.down('tabpanel');
					var tab = tabs.getActiveTab();
					tabs.setActiveTab(tab.prev() || tabs.items.getAt(0));
				}
			},{
				xtype : 'label',
				cls : 'questionlabel',
				text : '00/00',
				hidden : true
			},{
				iconCls: 'icon-next-question',
//				tooltip : QUIZ.NEXT_QUESTION,
				id:'next-question',
				tooltip : { 
					text : QUIZ.NEXT_QUESTION,
					anchor :'bottom'
				},
//				overCls : 'next-img-over',
				handler: function() {
					var tabs = me.down('tabpanel');
					var tab = tabs.getActiveTab();
					
					if ( tab.id === tabs.items.last().id ) {
						return;
					}
					
					if ( tab.next().id === tabs.items.last().id ) {
						//
						// The next tab is the summary tab.
						//
						me.getQuizSummary();
					} else {
						tabs.setActiveTab(tab.next());
					}
				}
			},{
				iconCls: 'icon-summary',
//				tooltip : QUIZ.SUMMARY,
				id:'summary-button',
				tooltip : { 
					text :  QUIZ.SUMMARY,
					anchor :'bottom'
				},
				handler: function() {
					
					me.getQuizSummary();
				}
			},  {
				iconCls: 'icon-video',
				disabled :true,
//				tooltip : QUIZ.QUESTION_HELP,
				tooltip : { 
					text :  QUIZ.QUESTION_HELP,
					anchor :'bottom'
				},
				width:25,
				height:21,
				scope: this,
				action: 'video'
			}, {
				iconCls: 'icon-figures',
//				tooltip : QUIZ.QUESTION_FIGURE,
				//201311081859
				disabled :true,
				tooltip : { 
					text :  QUIZ.QUESTION_FIGURE,
					anchor :'left'
				},
				width:31,
				height:24,
//				disable:false,
				scope: this,
				action: 'figure'
			},
			'->',{
				iconCls: 'icon-close',
//				tooltip : QUIZ.CLOSE,
				tooltip : { 
					text : QUIZ.CLOSE,
					anchor :'right'
				},
				width:25,
				height:21,
				scope: this,
				handler: function( btn ) {
					
					me.collapse();
				}
			}]
			}
			],
			items: [{
				xtype: 'form',
				anchor: '100% 100%',
				autoScroll: false,
				cls : 'quiz-wizard',
				items: [{
					xtype: 'badgetabpenl',
					tabBar:{defaultType: 'badgetab'},
					defaults: {
							padding: '10 10 10 10'
					},
					layout: 'anchor',
					anchor:'100% 100%',
					flexCroll:false,
					items: [], 
					listeners : {
						tabchange : { 
							fn:function(tabPanel, activeTab,oldTab ) {
								
								//201407070707
								var grid = Ext.ComponentQuery.query('chapterslist gridpanel')[0],
									gridSelect = grid.getSelectionModel().getSelection( )[0],
									chaptersStore = grid.getStore(),
									markUnviewedIds,
									markUnviewLessons = [];
								if ( (activeTab.id === tabPanel.items.last().id) && (activeTab.items.length == 0) ) {
									
									  if( gridSelect )
									     markUnviewedIds = gridSelect.get('markUnviewed');
								      
								      for (var i= 0; i < markUnviewedIds.length; i++ ){
								    	  var record = chaptersStore.getAt(chaptersStore.findExact('video_id','L'+markUnviewedIds[i]));
								    	  if( record ){
								    		  markUnviewLessons.push(record.get('lesson'));
								    	  }
								      }
								      var markUnviewLessonsStr = '<ul>';
								      if( markUnviewLessons.length > 0 ){
								    	  for (var j= 0; j < markUnviewLessons.length ; j++ ){
								    		  markUnviewLessonsStr = markUnviewLessonsStr+"<li>"+markUnviewLessons[j]+"</li>";
								    	  }
								      }
								      markUnviewLessonsStr = markUnviewLessonsStr+'</ul>';
								    //  var markUnviewLessonsStr = markUnviewLessons.toString().replace(new RegExp(',','g'),",<br>");
								      activeTab.add({	
													    layout: {
														    type: 'vbox',
											                align: 'center'
													    },
														items:[{
																xtype:'container',
																cls:'quiz-moreinfo',
																width: 300,
																//Here if the mark unview lessons is exist only we are showing message to user
																html:( markUnviewLessons.length > 0 ) ? WIZARD.QUIZ_EVALUATION_ALERT+''+markUnviewLessonsStr+'</div>':'' 
															},{
															xtype:'button',
															text:'Evaluate',
															name:'quizevaluatebtn',
															scale:'medium',
															cls:'evaluate-btn-cls',
															handler:function( btn ){
																tabPanel, activeTab,oldTab;
																me.evaluateQuizSummary( tabPanel, activeTab, btn );
															}
														}]
												    },{
														name:'summarycard',
														html:''
												    });
								}
								
								/*
								 * Here identify the summary show, 
								 * if regular complete, required passed or failed only we are showing the summary.
								 * refs #29453
								 */
								if( (gridSelect.get('quizStatus') == CHAPTERlIST.REGULAR_QUIZ_COMPLETED ) ||
										(gridSelect.get('quizStatus') == CHAPTERlIST.REQUIRED_QUIZ_PASSED) ||
										(gridSelect.get('quizStatus') == CHAPTERlIST.REQUIRED_QUIZ_FAILED)  ){
									//If the Active tab is the Smmary tab and it's post evaluation 
									//option is 4 then we are not going to show this summary
									
									if(activeTab.postevaluation == 4){	
										// if any question is modified it's answer and came to the summary page then this is 1(true)
										// else just visited and not changed any answer then 0(false)
										if(!Ext.isEmpty(SWP.modifiedQuestion[SWP.QuizID])){
											var quizSummask = new Ext.LoadMask(tabPanel.items.last().getEl(), {msg:"Please wait..."});
											quizSummask.show();
											var queModifedLen = 5;
											queModifedLen = (SWP.modifiedQuestion[SWP.QuizID]).length;
											var quizEvaluationDelay = new Ext.util.DelayedTask();
											quizEvaluationDelay.delay(1000*queModifedLen,function(){
												if(SWP.quizModifiedQuiz[SWP.QuizID]){
													if((activeTab.id === tabPanel.items.last().id)){												
														activeTab.getLayout().setActiveItem(0);
														SWP.quizModifiedQuiz[SWP.QuizID] = 0;
													}
												}else{
													me.evaluateQuizSummary( tabPanel, activeTab, false );
													if(activeTab.id === tabPanel.items.last().id){												
														activeTab.getLayout().setActiveItem(1);
													}
												}
												quizSummask.hide();
											},this);
										} else {
											if(SWP.quizModifiedQuiz[SWP.QuizID]){
												if((activeTab.id === tabPanel.items.last().id)){												
													activeTab.getLayout().setActiveItem(0);
													SWP.quizModifiedQuiz[SWP.QuizID] = 0;
												}
											}else{
												me.evaluateQuizSummary( tabPanel, activeTab, false );
												if(activeTab.id === tabPanel.items.last().id){												
													activeTab.getLayout().setActiveItem(1);
												}
											}
										}
									} else{
										me.evaluateQuizSummary( tabPanel, activeTab, false );
									}
								}
							}
						}
					}
				}]
			}]
		});

		this.callParent(arguments);
	},listeners:{
		
		beforeexpand:function(p, eOpts){
			if(p.title) {
	        	var quiz = Ext.ComponentQuery.query( 'quiz[name=quizpanel]' )[0];
	        	quiz.setTitle( "Evaluation : "+quiz.originalTitle);
	        }
			
		},beforecollapse:function(p, eOpts){
        	var quiz = Ext.ComponentQuery.query( 'quiz[name=quizpanel]' )[0];
        	quiz.setTitle( "Evaluation");
		}
	},

	getQuizSummary: function( ) {
		
		var tabs = this.down('tabpanel');
		var summaryTab = tabs.items.last();
		tabs.setActiveTab(tabs.items.last(),true);
	},
	setQuizItem: function(title ) {
		this.expand();
		var tab = this.down('tabpanel > panel[title=' + title + ']');
		this.down('tabpanel').setActiveTab(tab);
	},
	//201407070707
	evaluateQuizSummary: function( tabPanel, activeTab, btn ){
		
		if(btn){
			var summaryTab = btn.ownerCt.ownerCt;
			summaryTab.getLayout().setActiveItem(1);
		}
		var summaryBtn = Ext.getCmp('summary-button');
		if ( activeTab.id === tabPanel.items.last().id  && !SWP.instructLogin ) {
			var chapterslist = Ext.ComponentQuery.query( 'chapterslist gridpanel' )[0];
			var selection = chapterslist.getSelectionModel().getSelection()[0];
			if(Ext.isEmpty(SWP.modifiedQuestion[SWP.QuizID])){				
				this.showQuizSummary( btn ); //20131126600
			}else{
				var keys = [];
				for (var key in SWP.modifiedQuestion[SWP.QuizID]) {
				    keys.push(key);
				}
				var isCompletedCount = 0;
				for(var i=0; i < keys.length ; i++){
					var count = keys.length;
					var questionArray = SWP.modifiedQuestion[SWP.QuizID]
					var res = questionArray[keys[i]];
					if(!Ext.isEmpty(res)){
						VideoRecordMgr.saveQuizAnswer(keys[i], res, function(r, t) {
				    	      if (t.status) {
				    	    	  isCompletedCount = isCompletedCount+1;
				    	    	  if(isCompletedCount == count){				    	    		  
				    	    		  this.showQuizSummary( btn );
				    	    		  SWP.modifiedQuestion = [];
				    	    		  SWP.quizQuestionmodifyStatus = [];
				    	    	  }
				    	      }
				    	}, this);
					}
				}
			}
			summaryBtn.setDisabled( true );
			
		}else{
			if( summaryBtn.isDisabled( ) ){
				summaryBtn.setDisabled( false );
			}
		}
	},
	showQuizSummary: function(btn ){ //20131126600
		var isfromQuizWizard = btn ==false ? false : true;
		var tabs = this.down('tabpanel');
		var mask = new Ext.LoadMask(tabs.items.last().getEl(), {msg:"Please wait..."});
		mask.show();
		VideoRecordMgr.getQuizSummary(SWP.QuizID,isfromQuizWizard,function(r,t){ //20131114210
			
			var summarytab = tabs.items.last();
			var chapterslist = Ext.ComponentQuery.query( 'chapterslist gridpanel' )[0];
			summarytab.setAutoScroll( true );
			tabs.items.last().down('panel[name="summarycard"]').update(r); //201407070707
			//tabs.items.last().update(r);
			var quizWin = Ext.ComponentQuery.query('quiz')[0];
			
			//201311141653
			// checking for SWP.fromSummaryReference variable and if it is true 
			// then firing the event and restting the value to false again
			if( (r.indexOf('You failed') != -1) && btn ){ //20131130801
				quizWin.fireEvent('markunviewedlessons',SWP.QuizID, true ,true ,false );//201311281230
				
			}else if(SWP.fromSummaryReference ){ //2013123730
				quizWin.fireEvent('markunviewedlessons',SWP.QuizID, false ,true , false ); 
				if( SWP.fromSummaryReference ){
					SWP.fromSummaryReference  = false;
				}
			} else {
				//Passed scenario , on passed scenario we need to refresh the chapters grid by removing the 
				quizWin.fireEvent('markunviewedlessons',SWP.QuizID, false ,true ,true); 
			}
			quizWin.applyPostEvaluation(tabs);
			quizWin.handleEvents();
			mask.hide();
		});
	},
	handleEvents : function(){
		var me = this;
		Ext.select('td.clickable').on('click',function( e, html){
			var quiz = Ext.ComponentQuery.query('quiz')[0];
			var index = 0;
			for( var k = 0 ;k < html.attributes.length ; k++){
				if( html.attributes[k].name =='index'){
					index = html.attributes[k].nodeValue;
					break;
				}
			}
			var tab = Ext.ComponentQuery.query('quiz tabpanel panel')[index];
			quiz.down('tabpanel').setActiveTab(tab);
		});
		
		var quizReset = Ext.getElementById('quiz-reset');
		
		/*bg css for IE*/
		var bgColor = '#C8C8C8';
		if(SWP.theme == 'Dark'){
			bgColor = '#393939';
		}
		
		if( quizReset ){
			var button =Ext.create('Ext.Button', {
					    text: 'Reset',
					    renderTo: quizReset,
					    cls: 'resetquiz-btn',
					    scale : 'medium',
					    style :{
					    	'background-color': (Ext.isIE) ? bgColor : ''
					    },
					    handler: function( btn ) {
					    
			    			me.resetQuiz(btn);
					    }
			});
		}
		
	},

	resetQuiz:function(btn){
    	 if( btn ){
    		  var quiz = Ext.ComponentQuery.query( 'quiz[name=quizpanel]' )[0];
			   quiz.collapse();
		       VideoRecordMgr.resetQuiz( SWP.QuizID,function(r,t){
    			   //201407030805
    			   var ch = Ext.ComponentQuery.query('chapterslist')[0].getSelectedChapter();
			       ch.set('seen', false);
		           var grid = Ext.ComponentQuery.query('chapterslist gridpanel')[0];
		    	   var gview = grid.getView();
		    	   var row = gview.getNode(ch);
		    	   if(row){
		    			var hdTiltle = Ext.fly(row).parent('.x-group-hd-container').down('.x-grid-group-hd').down('.x-grid-group-title');
		    			hdTiltle.removeCls('seen-font').addCls('notseen-font');
		    	   }
    			   Ext.ComponentQuery.query('quiz')[0].fireEvent('markunviewedlessons',SWP.QuizID, true ,false ,false);//201311281230
		       });	
    	}
    },
	applyPostEvaluation:function( quizTabs ){
		
		var summaryTab = quizTabs.getActiveTab();
		var quizTabItems = quizTabs.items.items;
	
		if( summaryTab.postevaluation == '1' || summaryTab.postevaluation == '2'){ //Hide quiz summary || Show quiz results, no correction
			
			for(var i=0 ; i< (quizTabItems.length-1); i++ ){
				quizTabItems[i].setDisabled( true );
				Ext.getCmp( 'next-question' ).setDisabled( true );
				Ext.getCmp( 'prev-question' ).setDisabled( true );
			}
			
		}else if( summaryTab.postevaluation == '3' ){ //Show quiz results, show quiz answers, no correction
			
			for(var i=0 ; i< (quizTabItems.length-1); i++ ){
				quizTabItems[i].items.items[1].setDisabled( true );
			}
			
		}
		
		
	}
	
});

