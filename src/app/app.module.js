import angular from "angular";
import ngMaterial from "angular-material";
import StockAppComponent from "./app.component";
import apiConnect from "./services/apiconnect.service";
import dataManipulation from "./services/stockUtils.service";
import Components from "./Components/components.module";
import { Graph, Chart } from "./d3-components";
import d3 from "./services/d3/d3.module";

const StockApp = angular
  .module("stock", [ngMaterial, Components, d3])
  .component("stockApp", StockAppComponent)
  .directive("graph", Graph)
  .directive("chart", Chart)
  .service("apiConnect", apiConnect)
  .service("dataManipulation", dataManipulation)
  .name;

export default StockApp;
