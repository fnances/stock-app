import angular from "angular";
import CompanyDetails from "./CompanyDetails/companydetails.module";
import AddStock from "./AddStock/AddStock.module";

const Components = angular
  .module("Components", [CompanyDetails, AddStock])
  .name;

export default Components;
