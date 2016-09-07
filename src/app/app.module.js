import angular from "angular";
import ngMaterial from "angular-material";
import StockAppComponent from "./app.component";
import apiConnect from "./services/apiconnect.service";
import dataMining from "./services/datamining.service";
import filter from "./services/filter.service";
import Components from "./Components/components.module";

const StockApp = angular
  .module("stock", [ngMaterial, Components])
  .component("stockApp", StockAppComponent)
  .service("apiConnect", apiConnect)
  .service("dataMining", dataMining)
  .service("filter", filter)
  .name;

export default StockApp;
