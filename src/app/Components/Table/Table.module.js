import angular from "angular";
import TableComponent from "./Table.component";


const Table = angular
  .module("Table", [])
  .component("tableStock", TableComponent)
  .name;

export default Table;
