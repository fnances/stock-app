import angular from "angular";
import ngMaterial from "angular-material";
import StockAppComponent from "./app.component.js";

const StockApp = angular
.module("stock", [ngMaterial])
.component("stockApp", StockAppComponent)
.name;

export default StockApp;
