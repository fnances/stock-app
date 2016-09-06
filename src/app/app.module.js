import angular from "angular";
import ngMaterial from "angular-material";
import StockAppComponent from "./app.component";
import apiConnect from "./services/apiconnect.service";
import dataMining from "./services/datamining.service";
import d3 from "./services/d3/d3.module";
import d3Charts from "./app.directive";

const StockApp = angular
.module("stock", [ngMaterial, d3])
.component("stockApp", StockAppComponent)
.directive("d3Charts", d3Charts)
.service("apiConnect", apiConnect)
.service("dataMining", dataMining)
.name;

export default StockApp;
