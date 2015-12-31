var ScorePerLifeChartDPS = [];
var Chart3DPS            = [];
var Chart2DPS            = [];
var ScorePerLifeChart;
var Chart2;
var Chart3;

window.onload = function () {

  ScorePerLifeChart = new CanvasJS.Chart("chartScorePerLifeContainer",
  {
    title:{
      text: "Score vs Lives"
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

  Chart2 = new CanvasJS.Chart("chart2",
  {
    title:{
      text: "States Explored vs Lives"
    },
    axisX: {
      title: "Life #"
    },
    axisY: {
      title: "Unique Explored Count"
    },
    data: [{
      type: "line",
      dataPoints: Chart2DPS
    }]
  });


  ScorePerLifeChart.render();
  Chart2.render();

}

var updateChart = function() {
  ScorePerLifeChart.render();
  Chart2.render();

};
