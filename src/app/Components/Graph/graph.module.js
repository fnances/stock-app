import angular from "angular";
import GraphComponent from "./graph.component";
import d3Charts from "./graph.directive";

const Graph = angular
  .module("Graph", [])
  .component("graph", GraphComponent)
  .directive("d3Charts", d3Charts)
  .name;

export default Graph;
