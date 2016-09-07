import angular from "angular";
import GraphComponent from "./graph.component";
import d3 from "../../services/d3/d3.module";

const Graph = angular
  .module("Graph", [d3])
  .component("graph", GraphComponent)
  .name;

export default Graph;
