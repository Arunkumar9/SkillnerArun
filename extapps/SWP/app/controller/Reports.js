/**
 * Task/Issue Author UniqueID Comment
 * ---------------------------------------------------------------------------------------------------------------------------------------------------
 * 23820 kanchan.singh 201310271256 Separate controller for reports module
 */

Ext.define(
				'SWP.controller.Reports',
				{

					extend : 'Ext.app.Controller',

					stores : [ 'ReportsTree', 'QuizScores', 'HitMapBlockField' ],

					models : [ 'HitMapBlockField' ],

					views : [ 'reports.QuizReport', 'AxesOverride',
							'SeriesScore', 'AxesScore',
							'reports.SummaryReportWindow',
							'reports.ReportsTree', 'reports.CourseReportForm',
							'reports.ReportsPanelCard',
							'reports.HeatMapReport', 'HeatMap' ],

					refs : [ {
						ref : 'summaryReportWindow',
						selector : 'summaryreportwindow'
					}, {
						ref : 'quizscorereport',
						selector : 'quizscorereport'
					}, {
						ref : 'heatmapreport',
						selector : 'heatmapreport'
					}, {
						ref : 'ReportsPanelCard',
						selector : 'reportspanelcard'
					}, {
						ref : 'quizReportCard',
						selector : 'quizreportcard'
					}, {
						ref : 'heatmapCard',
						selector : 'heatmapcard'
					}, {
						ref : 'courseReport',
						selector : 'coursereportform'
					} ],

					init : function() {

						SWP.QuizImageMap = {};

						SWP.quizAnsweredCount = {};

						SWP.quizAnsweredQuestions = [];

						SWP.quizQuestionLoaded = {};

						this.control({

							'reportstree' : {

								itemclick : this.handleReportItemClick,
								select : this.handleReportItemClick
							},

							'heatmapreport' : {
								itemclick : this.seekToDesiredBlockOfChapter,
								'afterrefresh' : this.heatMapAfterRefresh
							},

							'quizreportcard' : {
								'quizreportrefresh' : this.quizReportRefresh
							},

							'heatmapcard' : {
								heatmapsrefresh : this.heatMapsRefresh
							}

						});

					},

					/**
					 * 
					 * this method is called when the Quiz report icon from quiz
					 * panel is getting clicked.
					 * 
					 */
					quizReport : function(quizrefresh) {
						var me = this;

						if (!quizrefresh) {

							SWP.chartTheme = Ext.create('Ext.chart.theme.Dark',
									{});

							var reportsWin = Ext.create(
									'SWP.view.reports.SummaryReportWindow', {});
							reportsWin.on('show', function() {
								var summaryReportRec = this.down('treepanel')
										.getStore().getNodeById(
												'summary-report');
								if (summaryReportRec) {

									this.down('treepanel').getSelectionModel()
											.select(summaryReportRec);
								}
							});
							reportsWin.show();
						} else {
							var quizScoreReport = this.getQuizscorereport();
							this.getSummaryReportWindow().setLoading(true);
							this.addReportToCard(quizScoreReport);

							quizScoreReport.getStore().load(
									{
										scope : this,
										callback : function() {
											quizScoreReport.redraw(true);
											quizScoreReport.up('window')
													.setLoading(false);

											this.handleLabelElementClick();

										}
									});

						}

					},
					/**
					 * function to remove the existing reports in the card and
					 * add the new one. if new one is already a child of the
					 * reports panel card then do nothing
					 */
					addReportToCard : function(newReport) {

						if (Ext.isEmpty(newReport.ownerCt)) {
							var card = this.getReportsPanelCard();
							card.removeAll();
							card.add(newReport);
						}
					},

					generateCourseReport : function(reportsWin) {
						if (reportsWin) {
							reportsWin.setLoading(true);
							var form = this.getCourseReport();
							this.addReportToCard(form);
							form.getForm().load({
								params : {
									'param1' : '123'
								},
								success : function() {
									reportsWin.setLoading(false);
								}
							});
						}

					},
					/**
					 * This fucntion is the handler of the heatmap itemClick
					 * which will fire an event for the classroom.js to handle
					 * to play the chapter at the block start time
					 */
					seekToDesiredBlockOfChapter : function(ev, el, blockID,
							record) {
						var summaryReportWindow = this.getSummaryReportWindow();
						summaryReportWindow.close();

						this.fireEvent('heatmapitemclick', ev, el, blockID,
								record)
					},

					/**
					 * On item click on reports tree item, this method gets
					 * called. Loading selected record related information based
					 * on action parameter. If action value exists, calling
					 * action with method else, setting active item to 1.
					 * 
					 */

					handleReportItemClick : function(view, record, item, index) {

						var summaryReportWindow = this.getSummaryReportWindow();
						if (summaryReportWindow) {

							var functionName = record.get('action');
							var cardPanel = summaryReportWindow
									.down('container[name=reportsPanelCard]');
							if (functionName) {

								this[functionName](summaryReportWindow,
										cardPanel);

							}
						}
					},

					showQuizSummaryReport : function(summaryReportWindow,
							cardPanel) {
						var quizScoreReportCard = this.getQuizReportCard();
						if (Ext.isEmpty(quizScoreReportCard)) {
							var quizScore = Ext.create('SWP.store.QuizScores',
									{});
							quizScoreReportCard = Ext.create(
									'SWP.view.reports.QuizReportCard', {
										quizScore : quizScore
									});
						}
						var quizScoreReport = this.getQuizscorereport();

						cardPanel.removeAll();
						cardPanel.add(quizScoreReportCard);
						if (!quizScoreReport.finalized) {
							var chapterList, listStore, matchedRecords, lessons = [];
							chapterList = Ext.ComponentQuery
									.query('chapterslist gridpanel')[0];
							listStore = chapterList.getStore();

							matchedRecords = listStore
									.queryBy(
											function(r, i) {

												return ((r.get('video_id')
														.substr(0, 1) == 'Q'));

											}, this);
							quizScoreReport
									.setNoOfQuizes(matchedRecords.length)
						}

						if (quizScoreReport.noofQuizes > 0) {
							quizScoreReport.up('window').setLoading(true);
							quizScoreReport.getStore().load(
									{
										scope : this,
										callback : function() {
											quizScoreReport.up('window')
													.setLoading(false);
											this.handleLabelElementClick();
										}
									});
						}

					},
					showHeatMapReport : function(summaryReportWindow, cardPanel) {

						var heatMapCard = this.getHeatmapCard();
						if (Ext.isEmpty(heatMapCard)) {
							heatMapCard = Ext.create(
									'SWP.view.reports.HeatMapCard', {

									});
						}
						this.addReportToCard(heatMapCard);
						this.heatMapsRefresh();

					},
					showViewReport : function(summaryReportWindow, cardPanel) {
						// cardPanel.getLayout().setActiveItem(3);
					},
					/**
					 * 
					 * When user clicks on any of category label in quiz report
					 * chart, to handle that functionality, On boxready, calling
					 * this method and adding functionality in this method.
					 * 
					 */

					handleLabelElementClick : function() {
						var me = this;
						var summaryReportWindow = this.getSummaryReportWindow();
						if (summaryReportWindow) {

							var id;
							var tspanElements = Ext.select('.quiz-name').elements;
							for ( var i = 0; i < tspanElements.length; i++) {

								Ext.fly(tspanElements[i]).addListener(
												'click',
												function(e) {

													var chapterStore, targetCls, index, record;
													// chapterStore =
													// Ext.ComponentQuery.query('chapterslist
													// gridpanel')[0].getStore();

													if (Ext.isIE9) {
														targetCls = e.target.textContent
																+ ' quiz-name'; // 201311251225
													} else if (Ext.isIE8) {
														targetCls = e.target.innerHTML; // 201311251225
													} else {
														targetCls = e.currentTarget.className.baseVal;
													}

													summaryReportWindow.close();
													me.fireEvent('playquiz',
															targetCls);

												}, this);
							}
						}
					},

					quizReportRefresh : function() {

						this.quizReport(true);
					},
					heatMapsRefresh : function() {

						var heatMapReport = this.getHeatmapreport();
						heatMapReport.up('window').setLoading(true);
						heatMapReport.getStore().load({});

					},
					heatMapAfterRefresh : function(hm) {
						hm.up('window').setLoading(false);
					}

				});