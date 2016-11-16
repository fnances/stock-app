import angular from "angular";
import AddStockComponent from "./AddStock.component";


const AddStock = angular
  .module("addStock", [])
  .component("addStock", AddStockComponent)
  .name;

  export default AddStock;
