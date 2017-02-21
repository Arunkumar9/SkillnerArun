Ext.define('SWP.view.AxesScore', {
	extend: 'Ext.chart.axis.Category',

  alias: 'axis.score',
    //type: 'ScoreCategory',

    drawAxis: function (init) {
        var me = this,
            i, 
            x = me.x,
            y = me.y,
            dashSize = me.dashSize,
            length = me.length,
            position = me.position,
            verticalAxis = (position == 'left' || position == 'right'),
            inflections = [],
            calcLabels = (me.isNumericAxis),
            stepCalcs = me.applyData(),
            step = stepCalcs.step,
            steps = stepCalcs.steps,
            stepsArray = Ext.isArray(steps),
            from = stepCalcs.from,  
            to = stepCalcs.to,
            // If we have a single item, to - from will be 0.
            axisRange = (to - from) || 1,
            trueLength,
            currentX,
            currentY,
            path,
            subDashesX = me.minorTickSteps || 0,
            subDashesY = me.minorTickSteps || 0,
            dashesX = Math.max(subDashesX + 1, 0),
            dashesY = Math.max(subDashesY + 1, 0),
            dashDirection = (position == 'left' || position == 'top' ? -1 : 1),
            dashLength = dashSize * dashDirection,
            series = me.chart.series.items,
            firstSeries = series[0],
            gutters = firstSeries ? firstSeries.nullGutters : me.nullGutters,
            padding,
            subDashes,
            subDashValue,
            delta = 0,
            stepCount = 0,
            tick, axes, ln, val, begin, end;

        me.from = from;
        me.to = to;
        
        // If there is nothing to show, then leave. 
        if (me.hidden || (from > to)) {
            return;
        }

        // If no steps are specified (for instance if the store is empty), then leave.
        if ((stepsArray && (steps.length == 0)) || (!stepsArray && isNaN(step))) {
            return;
        }

        if (stepsArray) {
            // Clean the array of steps:
            // First remove the steps that are out of bounds.
            steps = Ext.Array.filter(steps, function(elem, index, array) {
                return (+elem > +me.from && +elem < +me.to);
            }, this);

            // Then add bounds on each side.
            steps = Ext.Array.union([me.from], steps, [me.to]);
        }
        else {
            // Build the array of steps out of the fixed-value 'step'.
            steps = new Array;
            for (val = +me.from; val < +me.to; val += step) {
                steps.push(val);
            }
            steps.push(+me.to);
        }
        stepCount = steps.length;


        // Get the gutters for this series
        for (i = 0, ln = series.length; i < ln; i++) {
            if (series[i].seriesIsHidden) {
                continue;
            }
            if (!series[i].getAxesForXAndYFields) {
                continue;
            }
            axes = series[i].getAxesForXAndYFields();
            if (!axes.xAxis || !axes.yAxis || (axes.xAxis === position) || (axes.yAxis === position)) {
                gutters = series[i].getGutters();
                if ((gutters.verticalAxis !== undefined) && (gutters.verticalAxis != verticalAxis)) {
                    // This series has gutters that don't apply to the direction of this axis
                    // (for instance, gutters for Bars apply to the vertical axis while gutters  
                    // for Columns apply to the horizontal axis). Since there is no gutter, the 
                    // padding is all that is left to take into account.
                    padding = series[i].getPadding();
                    if (verticalAxis) {
                        gutters = { lower: padding.bottom, upper: padding.top, verticalAxis: true };
                    } else {
                        gutters = { lower: padding.left, upper: padding.right, verticalAxis: false };
                    }
                }
                break;
            }
        }

        // Draw the major ticks

        if (calcLabels) {
            me.labels = [];
        }

        if (gutters) {
            if (verticalAxis) {
                currentX = Math.floor(x);
                path = ["M", currentX + 0.5, y, "l", 0, -length];
                trueLength = length - (gutters.lower + gutters.upper);

                for (tick = 0; tick < stepCount; tick++) {
                    currentY = y - gutters.lower - (steps[tick] - steps[0]) * trueLength / axisRange;
                    path.push("M", currentX, Math.floor(currentY) + 0.5, "l", dashLength * 2, 0);

                    inflections.push([ currentX, Math.floor(currentY) ]);

                    if (calcLabels) {
                        me.labels.push(steps[tick]);
                    }
                }

            } else {
                currentY = Math.floor(y);
                path = ["M", x, currentY + 0.5, "l", length, 0];
                trueLength = length - (gutters.lower + gutters.upper);

                for (tick = 0; tick < stepCount; tick++) {
                    currentX = x + (gutters.lower*2-gutters.paddingleft-gutters.barWidth/2) + (steps[tick] - steps[0]) * trueLength / axisRange;

                    path.push("M", Math.floor(currentX) + 0.5, currentY, "l", 0, dashLength * 2 + 1);

                    inflections.push([ Math.floor(currentX), currentY , (gutters.lower-gutters.paddingleft)  ]);

                    if (calcLabels) {
                        me.labels.push(steps[tick]);
                    }
                }
            }
        }


        // Draw the minor ticks

        // If 'minorTickSteps' is...
        // - A number: it contains the number of minor ticks between 2 major ticks.
        // - An array with 2 numbers: it contains a date interval like [Ext.Date.DAY,2].
        // - An array with a single number: it contains the value of a minor tick.
        subDashes = (verticalAxis ? subDashesY : subDashesX);
        if (Ext.isArray(subDashes)) {
            if (subDashes.length == 2) {
                subDashValue = +Ext.Date.add(new Date(), subDashes[0], subDashes[1]) - Date.now();
            } else {
                subDashValue = subDashes[0];
            }
        }
        else {
            if (Ext.isNumber(subDashes) && subDashes > 0) {
                subDashValue = step / (subDashes + 1);
            }
        }

        if (gutters && subDashValue) {
            for (tick = 0; tick < stepCount - 1; tick++) {
                begin = +steps[tick];
                end = +steps[tick+1];
                if (verticalAxis) {
                    for (value = begin + subDashValue; value < end; value += subDashValue) {
                        currentY = y - gutters.lower - (value - steps[0]) * trueLength / axisRange;
                        path.push("M", currentX, Math.floor(currentY) + 0.5, "l", dashLength, 0);
                    }
                }
                else {
                    for (value = begin + subDashValue; value < end; value += subDashValue) {
                        currentX = x + gutters.upper + (value - steps[0]) * trueLength / axisRange;
                        path.push("M", Math.floor(currentX) + 0.5, currentY, "l", 0, dashLength + 1);
                    }
                }
            }            
        }


        // Render

        if (!me.axis) {
            me.axis = me.chart.surface.add(Ext.apply({
                type: 'path',
                path: path
            }, me.axisStyle));
        }
        me.axis.setAttributes({
            path: path
        }, true);
        me.inflections = inflections;
        if (!init && me.grid) {
            me.drawGrid();
        }
        me.axisBBox = me.axis.getBBox();
        me.drawLabel();
    } ,


    drawHorizontalLabels: function () {
        var me = this,
            labelConf = me.label,
            floor = Math.floor,
            max = Math.max,
            axes = me.chart.axes,
            insetPadding = me.chart.insetPadding,
            gutters = me.chart.maxGutters,
            position = me.position,
            inflections = me.inflections,
            ln = inflections.length,
            labels = me.labels,
            maxHeight = 0,
            ratio,
            bbox, point, prevLabel, prevLabelId,
            adjustEnd = me.adjustEnd,
            hasLeft = axes.findIndex('position', 'left') != -1,
            hasRight = axes.findIndex('position', 'right') != -1,
            textLabel, text,
            last, x, y, i, firstLabel;

        last = ln - 1;
        //get a reference to the first text label dimensions
        point = inflections[0];
        firstLabel = me.getOrCreateLabel(0, me.label.renderer(labels[0]));
        ratio = Math.floor(Math.abs(Math.sin(labelConf.rotate && (labelConf.rotate.degrees * Math.PI / 180) || 0)));

        for (i = 0; i < ln; i++) {
            point = inflections[i];
            text = me.label.renderer(labels[i]);
            textLabel = me.getOrCreateLabel(i, text);
            bbox = textLabel._bbox;
            maxHeight = max(maxHeight, bbox.height + me.dashSize + me.label.padding);
            x = floor(point[0] - (ratio ? bbox.height : bbox.width) / 2);
            if (adjustEnd && gutters.left == 0 && gutters.right == 0) {
                if (i == 0 && !hasLeft) {
                    x = point[0];
                    // console.log('point');
                }
                else if (i == last && !hasRight) {
                    x = Math.min(x, point[0] - bbox.width + insetPadding);
                                        // console.log('min');
                }
            }
            if (position == 'top') {
                y = point[1] - (me.dashSize * 2) - me.label.padding - (bbox.height / 2);
            }
            else {
                y = point[1] + (me.dashSize * 2) + me.label.padding + (bbox.height / 2);
            }
            // console.log(point[0],bbox.width + insetPadding,point[0] - bbox.width + insetPadding,x,ratio,point[0]-((ratio ? bbox.height : bbox.width) / 2));
            // console.log(x, point[2]);
            textLabel.setAttributes({
                hidden: false,
                x: x -point[2],
                y: y
            }, true);
            if( textLabel.cls ) {
            	textLabel.addCls(textLabel.cls);
            }

            // Skip label if there isn't available minimum space
            if (i != 0 && (me.intersect(textLabel, prevLabel)
                || me.intersect(textLabel, firstLabel))) {
                if (i === last && prevLabelId !== 0) {
                    prevLabel.hide(true);
                } else {
                    textLabel.hide(true);
                    continue;
                }
            }

            prevLabel = textLabel;
            prevLabelId = i;
        }

        return maxHeight;
    }
});