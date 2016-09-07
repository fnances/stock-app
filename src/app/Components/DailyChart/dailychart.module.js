import angular from "angular";
import DataTableComponent from "./datatable.component";

const DataTable = angular
  .module("DataTable", [])
  .component("dataTable", DataTableComponent)
  .name;


export default DataTable;
