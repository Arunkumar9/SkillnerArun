Ext.ux.GridGroupView = function(config){
    Ext.ux.GridGroupView.superclass.constructor.call(this);
    this.el = null;

    Ext.apply(this, config);
};

Ext.extend(Ext.ux.GridGroupView, Ext.grid.GridView, {

    emptyText : "No Items",
    
    groups : false,
    
    groupBy : 'group',
    
    init: function(grid){
        Ext.ux.GridGroupView.superclass.init.call(this, grid);

        // Add group template
        if(!this.templates.group){
            this.templates.group = new Ext.Template(
                '<tr class="x-grid-group"><td class="x-grid-col" colspan="{colspan}">',
                '<div class="x-grid-cell-text" unselectable="on">{title}</div>',
                '</td></tr>'
            );
            this.templates.group.disableFormats = true;
        }
        this.templates.group.compile();

        // Add empty text template
        if(!this.templates.groupempty){
            this.templates.groupempty = new Ext.Template(
                '<tr class="x-grid-emptyrow"><td class="x-grid-col" colspan="{colspan}">',
                '<div class="x-grid-cell-text" unselectable="on">{title}</div>',
                '</td></tr>'
            );
            this.templates.groupempty.disableFormats = true;
        }
        this.templates.groupempty.compile();
    },    

    findRowIndex : function(n){
        if(!n){
            return false;
        }
        var r = Ext.fly(n).findParent("tr." + this.rowClass, 6);
        //Fresh.console.log("findRowIndex", r, r.rowIndex);
        return r ? r.rowIndex : false;
    },    
    
    renderRows : function(startRow, endRow){
        // pull in all the crap needed to render rows
        var g = this.grid, cm = g.colModel, ds = g.dataSource, stripe = g.stripeRows;
        var colCount = cm.getColumnCount();

        if(ds.getCount() < 1){
            return ["", ""];
        }

        // build a map for all the columns
        var cs = [];
        for(var i = 0; i < colCount; i++){
            var name = cm.getDataIndex(i);
            cs[i] = {
                name : typeof name == 'undefined' ? ds.fields.get(i).name : name,
                renderer : cm.getRenderer(i),
                id : cm.getColumnId(i),
                locked : cm.isLocked(i)
            };
        }

        startRow = startRow || 0;
        endRow = typeof endRow == "undefined"? ds.getCount()-1 : endRow;

        // records to render
        var rs = ds.getRange(startRow, endRow);

        
        // build a map for the groups
        var groupBy = this.groupBy;
        var groups = this.groups;
        
        // If no groups given detect them from rows.
        if(!groups) {
        
            groups = [];
            var cv;
            
            for(var j = 0, len = rs.length; j < len; j++) {
                cv = rs[j].data[groupBy];             
                for(i = 0; i < groups.length; i++) {
                    if(groups[i].value == cv) break;
                }
                if(i == groups.length) {
                    groups[i] = { title: cv, value: cv };    
                }
            }
        }
        
        return this.doRender(cs, rs, ds, startRow, colCount, stripe, groupBy, groups);
    },

       
    // As much as I hate to duplicate code, this was branched because FireFox really hates
    // [].join("") on strings. The performance difference was substantial enough to
    // branch this function
    doRender : Ext.isGecko ?
            function(cs, rs, ds, startRow, colCount, stripe, groupBy, groups){
                var ts = this.templates, ct = ts.cell, rt = ts.row;
                // buffers
                var buf = "", lbuf = "", cb, lcb, c, p = {}, rp = {}, r, rowIndex;
                var cg, cval, empty, newRowIndex = startRow;
                this.translate = [];
                
                for(var k = 0; k < groups.length; k++) {
                    cg = groups[k];
                    
                    // Add group header
                    buf += ts.group.apply({colspan: colCount, title: cg.title});
                    this.translate[newRowIndex++] = false;
                    empty = true;
                    cval = (cg.value === undefined) ? cg.title : cg.value;
                    groupIndex = 0;
                    
                    for(var j = 0, len = rs.length; j < len; j++){
                        r = rs[j]; cb = ""; lcb = ""; rowIndex = (j+startRow);
                        
                        // Only show current groups
                        if(r.data[groupBy] != cval) continue;
                        empty = false;
                        groupIndex++;
                        
                        for(var i = 0; i < colCount; i++){
                            c = cs[i];
                            p.cellId = "x-grid-cell-" + rowIndex + "-" + i;
                            p.id = c.id;
                            p.css = p.attr = "";
                            p.value = c.renderer(r.data[c.name], p, r, rowIndex, i, ds);
                            if(p.value == undefined || p.value === "") p.value = "&#160;";
                            if(r.dirty && typeof r.modified[c.name] !== 'undefined'){
                                p.css += p.css ? ' x-grid-dirty-cell' : 'x-grid-dirty-cell';
                            }
                            var markup = ct.apply(p);
                            if(!c.locked){
                                cb+= markup;
                            }else{
                                lcb+= markup;
                            }
                        }
                        
                        var alt = [];
                        if(stripe && ((groupIndex+1) % 2 == 0)){
                            alt[0] = "x-grid-row-alt";
                        }
                        if(r.dirty){
                            alt[1] = " x-grid-dirty-row";
                        }
                        rp.cells = lcb;
                        if(this.getRowClass){
                            alt[2] = this.getRowClass(r, rowIndex);
                        }
                        rp.alt = alt.join(" ");
                        lbuf+= rt.apply(rp);
                        rp.cells = cb;
                        buf+=  rt.apply(rp);
                        this.translate[newRowIndex++] = rowIndex;
                    }
                    
                    if(empty) {
                        buf += ts.groupempty.apply({colspan: colCount, title: this.emptyText});
                        this.translate[newRowIndex++] = false;
                    }
                }
                return [lbuf, buf];
            } :
            function(cs, rs, ds, startRow, colCount, stripe, groupBy, groups){
                var ts = this.templates, ct = ts.cell, rt = ts.row;
                // buffers
                var buf = [], lbuf = [], cb, lcb, c, p = {}, rp = {}, r, rowIndex;
                var cg, cval, empty, newRowIndex = startRow;
                this.translate = [];
                
                for(var k = 0; k < groups.length; k++) {
                    cg = groups[k];
                    
                    // Add group header
                    buf[buf.length] = ts.group.apply({colspan: colCount, title: cg.title});
                    this.translate[newRowIndex++] = false;
                    empty = true;
                    cval = (cg.value === undefined) ? cg.title : cg.value;
                    groupIndex = 0;           
                
                    for(var j = 0, len = rs.length; j < len; j++){
                        r = rs[j]; cb = []; lcb = []; rowIndex = (j+startRow);
                        
                        // Only show current groups
                        if(r.data[groupBy] != cval) continue;
                        empty = false;
                        groupIndex++;
                                                
                        for(var i = 0; i < colCount; i++){
                            c = cs[i];
                            p.cellId = "x-grid-cell-" + rowIndex + "-" + i;
                            p.id = c.id;
                            p.css = p.attr = "";
                            p.value = c.renderer(r.data[c.name], p, r, rowIndex, i, ds);
                            if(p.value == undefined || p.value === "") p.value = "&#160;";
                            if(r.dirty && typeof r.modified[c.name] !== 'undefined'){
                                p.css += p.css ? ' x-grid-dirty-cell' : 'x-grid-dirty-cell';
                            }
                            var markup = ct.apply(p);
                            if(!c.locked){
                                cb[cb.length] = markup;
                            }else{
                                lcb[lcb.length] = markup;
                            }
                        }
                        var alt = [];
                        if(stripe && ((groupIndex+1) % 2 == 0)){
                            alt[0] = "x-grid-row-alt";
                        }
                        if(r.dirty){
                            alt[1] = " x-grid-dirty-row";
                        }
                        rp.cells = lcb;
                        if(this.getRowClass){
                            alt[2] = this.getRowClass(r, rowIndex);
                        }
                        rp.alt = alt.join(" ");
                        rp.cells = lcb.join("");
                        lbuf[lbuf.length] = rt.apply(rp);
                        rp.cells = cb.join("");
                        buf[buf.length] =  rt.apply(rp);
                        this.translate[newRowIndex++] = rowIndex;
                    }
                    
                    if(empty) {
                        buf[buf.length] = ts.groupempty.apply({colspan: colCount, title: this.emptyText});
                        this.translate[newRowIndex++] = false;
                    }
                }                    
                    
                return [lbuf.join(""), buf.join("")];
            },
    
    getRowClass : function(record, index) {
        if(record.data.cls) {
            return this.rowClass + " " + record.data.cls;
        } else {
            return this.rowClass;
        }
    }
}); 