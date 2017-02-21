ALTER TABLE cuepoints ADD COLUMN buttonposition VARCHAR(30) NOT NULL DEFAULT 'Right bottom';

/*
-    id: video-markercuepoints-tab
                                   xtype: panel
                                   title: <%[ Markers ]%>
                                   layout: fit
                                   defaults:
                                      anchor: 100%
                                      xtype: panel
                                   items:
                                      -    xtype: grid
                                           id:       markercuepoints-grid
                                           loadMask: true
                                           width:    100%
                                           linkedGrid: videos-grid
                                           sm: ^this.lessonTagsSelModel
								           cm: >
								               ^new Ext.grid.ColumnModel({
								                    columns:[ this.lessonTagsSelModel, { dataIndex: 'uid', header: __('Name') }]
								               })
                                           clicksToEdit: 1
                                           border:   false
                                           stateful: false
                                           noAutoSave: false
                                           
                                           linkToForm:true
                                           anchor:   100% 90%
                                           stripeRows: true
                                           insertPos:END
                                           noStorePreload: false
                                           viewConfig:
                                              forceFit: true
                                           tbarCfg:
                                                id: markercuepoints-grid-toolbar
                                           tbar:
                                              -   ^this.actions.addGridTool
                                              -   ^this.actions.deleteGridTool
                                              -   ^this.actions.cancelGridTool
                                              -   ^this.actions.reloadGrid
                                           plugins:
                                              -   pformtobuttons
                                              
                                              
                                              
                                              
                                              
                                              
                                              
                                              
                                              
                                              
                                              
                                              
                                              
                                              
                                              
                                              
                                              -    title: <%[ Tags ]%>
            region: west
            collapsible: true
            collapsed: false
            width: ^this.maxWidth(140,0.1)
            split: true
            layout: fit
            xtype: grid
            id: lesson-tags-grid
            store: ^Fresh.global.containersStore2
            stateful: false
            linkedGrid: videos-grid
            viewConfig: 
               forceFit: true
            sm: ^this.lessonTagsSelModel
            cm: >
                ^new Ext.grid.ColumnModel({
                    columns:[ this.lessonTagsSelModel, { dataIndex: 'name', header: __('Name') }]
                })
            plugins:
                -    ptype: pgridlinker
                     clickEvent: rowclick
                     disableLinkedForm: true
                     fireNoSelection: true
                     promptbeforeload:true
*/
