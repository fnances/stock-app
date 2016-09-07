import angular from "angular";
import DailyChartComponent from "./DailyChart.component";

const DailyChart = angular
  .module("DailyChart", [])
  .component("dailyChart", DailyChartComponent)
  .name;


export default DailyChart;
