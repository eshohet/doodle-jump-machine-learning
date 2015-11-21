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

  Chart2 = new CanvasJS.Chart("chart2",
  {
    title:{
      text: "Chart 2"
    },
    axisX: {
      title: "X Label"
    },
    axisY: {
      title: "Y Label"
    },
    data: [{
      type: "line",
      dataPoints: Chart2DPS
    }]
  });

  Chart3 = new CanvasJS.Chart("chart3",
  {
    title:{
      text: "Chart 3"
    },
    axisX: {
      title: "X Label"
    },
    axisY: {
      title: "Y Label"
    },
    data: [{
      type: "line",
      dataPoints: Chart3DPS
    }]
  });

  ScorePerLifeChart.render();
  Chart2.render();
  Chart3.render();
}

var updateChart = function() {
  ScorePerLifeChart.render();
  Chart2.render();
  Chart3.render();
};
