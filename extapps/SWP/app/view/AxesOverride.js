Ext.define('SWP.view.AxesOverride', {

    /* Begin Definitions */
//	override: 'Ext.chart.Chart',
    override: 'Ext.chart.axis.Axis',

    initComponent : function () {
        var me = this;
        
        me.callParent(arguments);
    },

    handleClick: function(name, e) {

    	var me = this,
            position = me.getEventXY(e),
            axesItems = me.axes.items,
            seriesItems = me.series.items,
            i, ln, series,axes,
            item;

        // Ask each series if it has an item corresponding to (not necessarily exactly
        // on top of) the current mouse coords. Fire itemclick event.
        for (i = 0, ln = seriesItems.length; i < ln; i++) {
            series = seriesItems[i];
            if (Ext.draw.Draw.withinBox(position[0], position[1], series.bbox)) {
                if (series.getItemForPoint) {
                    item = series.getItemForPoint(position[0], position[1]);
                    if (item) {
                        series.fireEvent(name, item);
                    }
                }
            }
        }
        
        // Ask each axes if it has an item corresponding to (not necessarily exactly
        // on top of) the current mouse coords. Fire itemclick event.
        for (i = 0, ln = axesItems.length; i < ln; i++) {
            series = axesItems[i];
//            if (Ext.draw.Draw.withinBox(position[0], position[1], series.bbox)) {
                if (this.getItemForPoint) {
                    item = this.getItemForPoint(position[0], position[1]);
                    if (item) {
                    	me.axes.fireEvent(name, item);
                    }
                }
//            }
        }
    },
   
    getItemForPoint: function(x, y) {
    	
    	var me = this.axes;
              
        var items = me.items,
            bbox = me.bbox,
            item, i, ln;

        for (i = 0, ln = items.length; i < ln; i++) {
            
        	if ( items[i] && this.isItemInPoint(x, y, items[i], i) ) {
            	console.log(items[i]);
                return items[i];
            }
        }

        return null;
    },
    
    isItemInPoint: function(x, y, item) {
    
    	var bbox = item.bbox;
        
    	return bbox.x <= x && bbox.y <= y
            && (bbox.x + bbox.width) >= x
            && (bbox.y + bbox.height) >= y;
    }
    
//    drawHorizontalLabels: function () {
//
//    	var me = this,
//            labelConf = me.label,
//            floor = Math.floor,
//            max = Math.max,
//            axes = me.chart.axes,
//            insetPadding = me.chart.insetPadding,
//            gutters = me.chart.maxGutters,
//            position = me.position,
//            inflections = me.inflections,
//            ln = inflections.length,
//            labels = me.labels,
//            maxHeight = 0,
//            ratio,
//            bbox, point, prevLabel, prevLabelId,
//            adjustEnd = me.adjustEnd,
//            hasLeft = axes.findIndex('position', 'left') != -1,
//            hasRight = axes.findIndex('position', 'right') != -1,
//            textLabel, text,
//            last, x, y, i, firstLabel;
//
//        last = ln - 1;
//        
//        point = inflections[0];
//        firstLabel = me.getOrCreateLabel(0, me.label.renderer(labels[0]));
//        ratio = Math.floor(Math.abs(Math.sin(labelConf.rotate && (labelConf.rotate.degrees * Math.PI / 180) || 0)));
//
//        for (i = 0; i < ln; i++) {
//            point = inflections[i];
//            text = me.label.renderer(labels[i]);
//            textLabel = me.getOrCreateLabel(i, text);
//            bbox = textLabel._bbox;
//            maxHeight = max(maxHeight, bbox.height + me.dashSize + me.label.padding);
//            x = floor(point[0] - (ratio ? bbox.height : bbox.width) / 2);
//            if (adjustEnd && gutters.left == 0 && gutters.right == 0) {
//                if (i == 0 && !hasLeft) {
//                    x = point[0];
//                }
//                else if (i == last && !hasRight) {
//                    x = Math.min(x, point[0] - bbox.width + insetPadding);
//                }
//            }
//            if (position == 'top') {
//                y = point[1] - (me.dashSize * 2) - me.label.padding - (bbox.height / 2);
//            }
//            else {
//                y = point[1] + (me.dashSize * 2) + me.label.padding + (bbox.height / 2);
//            }
//
//            textLabel.setAttributes({
//                hidden: false,
//                x: x,
//                y: y
//            }, true);
//            if( textLabel.cls ) {
//            	textLabel.addCls(textLabel.cls);
//            }
//            
//            if (i != 0 && (me.intersect(textLabel, prevLabel)
//                || me.intersect(textLabel, firstLabel))) {
//                if (i === last && prevLabelId !== 0) {
//                    prevLabel.hide(true);
//                } else {
//                    textLabel.hide(true);
//                    continue;
//                }
//            }
//
//            prevLabel = textLabel;
//            prevLabelId = i;
//        }
//
//        return maxHeight;
//    }
});