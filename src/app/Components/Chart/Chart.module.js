import angular from "angular";
import ChartComponent from "./Chart.component";


const Chart = angular
  .module("chart", [])
  .component("chartD3", ChartComponent)
  .name;

export default Chart;
