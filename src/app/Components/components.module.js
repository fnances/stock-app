import angular from "angular";
import CompanyDetails from "./CompanyDetails/companydetails.module";
import AddStock from "./AddStock/AddStock.module";
import Table from "./Table/Table.module";

const Components = angular
  .module("Components", [CompanyDetails, AddStock, Table])
  .name;

export default Components;
