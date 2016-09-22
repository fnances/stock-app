import angular from "angular";
import ngMaterial from "angular-material";
import StockAppComponent from "./app.component";
import apiConnect from "./services/apiconnect.service";
import dataManipulation from "./services/datamanipulation.service";
import Components from "./Components/components.module";

const StockApp = angular
  .module("stock", [ngMaterial, Components])
  .component("stockApp", StockAppComponent)
  .service("apiConnect", apiConnect)
  .service("dataManipulation", dataManipulation)
  .name;

export default StockApp;
