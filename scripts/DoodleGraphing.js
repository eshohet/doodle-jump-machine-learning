var ScorePerLifeChartDPS = [];
var ScorePerLifeChart;

window.onload = function () {

  ScorePerLifeChart = new CanvasJS.Chart("chartContainer",
  {
    title:{
      text: "Score Per Life"
    },
    axisX: {
      title: "Life #"
    },
    axisY: {
      title: "Score"
    },
    data: [{
      type: "line",
      dataPoints: ScorePerLifeChartDPS
    }]
  });

  ScorePerLifeChart.render();
}

var updateChart = function() {
  ScorePerLifeChart.render();
};