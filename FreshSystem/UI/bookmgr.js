/**
 * @author rosa
 */
var BookMgr = function() {		
	var newBtn, editBtn, deleteBtn;
	var ds;
	var sm;
		return {
			init : function() {					      
			    var Book = Ext.data.Record.create([
			        {name: 'TITLE', mapping: 'TITLE'},
			        {name: 'ISBN', mapping: 'ISBN'},
			        {name: 'AUTHOR', mapping: 'AUTHOR'},
			        {name: 'KEYWORDS', mapping: 'KEYWORDS'},
			        {name: 'DESCRIPTION', mapping: 'DESCRIPTION'},
			        {name: 'RATING', mapping: 'RATING'}
			    ]);
			
			    // create reader that reads into Topic records
			    var reader = new Ext.data.JsonReader({
			        root: 'BOOKARRAY'
			    }, Book);
			
			    // create the Data Store
			    ds = new Ext.data.Store({
			        // load using script tags for cross domain
			        proxy: new Ext.data.HttpProxy({url: '/playpen/bookJSON.cfm'}),
			        // let it know about the reader
			        reader: reader
			    });
			    ds.setDefaultSort('TITLE', 'desc');
			
					function renderRating(value) {
						var rating = '';
						for (var i = 0; i<value; i++)
							rating += '<img src="/playpen/star-small.gif" border="0" />';
							//rating += '*';
						return rating;
					}
			    // the column model has information about grid columns
			    // dataIndex maps the column to the specific data field in
			    // the data store
			    var cm = new Ext.grid.ColumnModel([{
			           header: "Title",
			           dataIndex: 'TITLE',
			           width: 305
			        },{
			           header: "Author",
			           dataIndex: 'AUTHOR',
			           width: 100
			        },{
			           header: "Rating",
			           dataIndex: 'RATING',
			           width: 80,
			           renderer: renderRating,
			           align: 'right'
			        }
			     ]);
			
			    // by default columns are sortable
			    cm.defaultSortable = true;
			
					sm = new Ext.grid.RowSelectionModel({singleSelect:true});
			    // create the editor grid
			    var grid = new Ext.grid.Grid('book-grid', {
			        ds: ds,
			        cm: cm,
			        selModel: sm,
			        enableColLock:false
			    });
			
			    // render it
			    grid.render();

		     var layout = new Ext.BorderLayout('book-manager', {
		     			west: {
		     				initialSize: 80,
		     				split: false,
		     				autoScroll: false
		     			},
		          center: {
		            autoScroll: true
		          }
		      });		      		      

          var innerLayout = new Ext.BorderLayout('book-inner-layout', {
		          north: {
		          	split: true,
		          	initialSize: 200	
		          },
		          center: {
		          		initialSize: 380,
                  autoScroll:true
              }
          });

			    
		      layout.beginUpdate();
		      layout.add('west', new Ext.ContentPanel('book-controls'));
          innerLayout.add('north', new Ext.GridPanel(grid));
          innerLayout.add('center', new Ext.ContentPanel('book-content'));
          layout.add('center', new Ext.NestedLayoutPanel(innerLayout));
		      layout.endUpdate();	
			    
			    newBtn = new Ext.ImageButton('book-controls', 
			    																 {text: 'New', 
			    																  imgPath: 'New.gif', 
			    																  imgWidth: 50,
			    																  imgHeight: 50,
			    																  tooltip: 'New Book', 
			    																  handler: this.clearData,
			    																  scope: this
			    																 });
			    editBtn = new Ext.ImageButton('book-controls', 
			    																 {text: 'Edit', 
			    																  imgPath: '/playpen/Edit.gif', 
			    																  disabledImgPath: '/playpen/Edit-inactive.gif',
			    																  disabled: true,
			    																  imgWidth: 50,
			    																  imgHeight: 50,
			    																  tooltip: 'Edit Book', 
			    																  handler: this.showForm,
			    																  scope: this
			    																 });
			    deleteBtn = new Ext.ImageButton('book-controls', 
			    																 {text: 'Delete', 
			    																  imgPath: '/playpen/Delete.gif', 
			    																  disabledImgPath: '/playpen/Delete-inactive.gif',
			    																  disabled: true,
			    																  imgWidth: 50,
			    																  imgHeight: 50,
			    																  tooltip: 'Delete Book', 
			    																  handler: this.confirmDelete,
			    																  scope: this
			    																 });						    
			    ds.on('load', sm.selectFirstRow, sm, true);
			    ds.on('remove', function(){
			    	if (!ds.getCount())
			    		sm.fireEvent('rowdeselect');
			    });
			    sm.on('rowselect', this.bindData, this, true);
			    sm.on('rowdeselect', function(){
			    	this.clearData();
			    	editBtn.disable();
			    	deleteBtn.disable();
			    }, this, true);
			    			
			    // trigger the data store load
			    ds.load();
		},
		showForm : function() {
			Ext.fly('book-title').setVisibilityMode(Ext.Element.DISPLAY).hide()			
			Ext.fly('book-isbn').hide();
			Ext.fly('book-keywords').hide();
			Ext.fly('book-description').hide();
			Ext.fly('book-title-form').show();
			Ext.fly('book-isbn-form').show();
			Ext.fly('book-keywords-form').show();
			Ext.fly('book-description-form').show();			
		},
		hideForm : function() {
			Ext.fly('book-title-form').setVisibilityMode(Ext.Element.DISPLAY).hide();
			Ext.fly('book-isbn-form').hide();
			Ext.fly('book-keywords-form').hide();
			Ext.fly('book-description-form').hide();
			Ext.fly('book-title').show()			
			Ext.fly('book-isbn').show();
			Ext.fly('book-keywords').show();
			Ext.fly('book-description').show();			
		},
		
		bindData : function(sm, rowIdx){
			this.hideForm();
	  	var currRow = ds.getAt(rowIdx);
	  	/* update the regular divs */
	  	Ext.fly('book-title').update(currRow.get('TITLE'));
	  	Ext.fly('book-isbn').update(currRow.get('ISBN'));
	  	Ext.fly('book-keywords').update(currRow.get('KEYWORDS'));
	  	Ext.fly('book-description').update(currRow.get('DESCRIPTION'));
	  	
	  	/* update form elements */
	  	Ext.fly('book-title-form').dom.value = currRow.get('TITLE');
	  	Ext.fly('book-isbn-form').dom.value = currRow.get('ISBN');
	  	Ext.fly('book-keywords-form').dom.value = currRow.get('KEYWORDS');
	  	Ext.fly('book-description-form').dom.value = currRow.get('DESCRIPTION');			    			
	  	editBtn.enable();
	  	deleteBtn.enable();
		},
		clearData : function(){
	  	Ext.fly('book-title-form').dom.value = '';
	  	Ext.fly('book-isbn-form').dom.value = '';
	  	Ext.fly('book-keywords-form').dom.value = '';
	  	Ext.fly('book-description-form').dom.value = '';
	  	Ext.fly('book-title').update('');
	  	Ext.fly('book-isbn').update('');
	  	Ext.fly('book-keywords').update('');
	  	Ext.fly('book-description').update('');	  	
	  	sm.clearSelections();
	  	this.showForm();
	  	Ext.fly('book-title-form').dom.focus();
		},
		confirmDelete : function(){
			var deleteRow = sm.getSelected();
			var deleteRowIdx = ds.indexOf(deleteRow);
			ds.remove(deleteRow);            
			if (deleteRowIdx === 0)
			   sm.selectFirstRow();
			else
			   sm.selectPrevious();			
		}
	}
}();
Ext.EventManager.onDocumentReady(BookMgr.init, BookMgr, true);