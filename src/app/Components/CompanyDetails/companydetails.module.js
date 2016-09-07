import angular from "angular";
import CompanyDetailsComponent from "./companydetails.component";


const CompanyDetails = angular
  .module("companyDetails", [])
  .component("companyDetails", CompanyDetailsComponent)
  .name;

  export default CompanyDetails;
