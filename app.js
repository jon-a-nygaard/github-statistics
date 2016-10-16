var data = require('./data.json')
var Highcharts = require('highcharts/highstock')

Highcharts.stockChart('container', {
  xAxis: [{
    type: 'datetime'
  }],
  series: [{
    data: data,
    dataGrouping: {
      approximation: 'high'
    }
  }]
})
