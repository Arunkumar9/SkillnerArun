/**
 * @author rosa
 */
Ext.namespace('KNT.Chart');

Fresh.global.SessionsChartStore = new Ext.data.DirectStore({
        autoDestroy: false,
        directFn: ClientRecordMgr.getSessionsData,
        storeId: 'sessions-chart-store',
        root: 'rows',
        sortInfo: {
          field: 'SessionCreated',
          direction: 'ASC'},
        fields: [{name: 'SessionCreated',type:'date',dateFormat:'U'},'KNTSession_Hmotnost','BMI','KNTSession_ProcentoTuku',
                 'LBMZaokrouhleno','KalorickaSpotrebaZaokrouhleno','BMR','MetabolickyVekZaokrouhleno',
                 'KNTSession_VisceralniTuk','KNTSession_ProcentoVody','KNTSession_ProcentoTuku'],
        autoLoad: false
});

KNT.Chart.LineChart = Ext.extend(Ext.chart.LineChart, {
    store: Fresh.global.SessionsChartStore,
    layout: 'fit',
    chartStyle: {
         legend: {
            display: 'top',
         },
         padding: 10,
         font: {
           family: 'Tahoma',
           size: 10
         },
         animationEnabled: true,
         xAxis: {
          //  displayName: __('chart.sessision.date'),
            color: 'eeeeee',
            //labelRotation: -90,
            majorTicks: {color: '0x69aBc8', length: 4},
            minorTicks: {color: '0x69aBc8', length: 2}
         },
         yAxis: {
            majorGridLines: {
              size: 1,
              color: '0xdfe8f6'
            }
         }
       },
     xField: 'SessionCreated',

     xAxis: new Ext.chart.TimeAxis({
              title: __('chart.sessision.date'),
              dateFormat: 'd.m.y',
              fields: ['SessionCreated'],
              labelRenderer: Ext.util.Format.dateRenderer('d.m.y'),
              //labelSpacing: 'auto'
          }),
     yAxis: new Ext.chart.NumericAxis({
              //title: __('chart.sessision.value')
          }),

     initSeries: function() {
            var descr;
            this.series = this.series || [];
            for(var i=0;i<this.series.length;i++) {
                descr = __('chart.session.'+this.series[i].yField);
                Ext.applyIf(this.series[i],{
                    displayName: descr,
                    type: 'line',
                    xfield: 'SessionCreated'
                });
            }
     },

     initComponent: function() {
         this.initSeries();
         this.plugins = this.plugins || [];
         this.plugins.push({ptype: 'uxvismode'});

         KNT.Chart.LineChart.superclass.initComponent.apply(this);

     }
});

Ext.reg('kntlinechart',KNT.Chart.LineChart);