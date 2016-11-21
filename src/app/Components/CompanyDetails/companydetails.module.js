import angular from "angular";
import CompanyDetailsComponent from "./CompanyDetails.component";


const CompanyDetails = angular
  .module("companyDetails", [])
  .component("companyDetails", CompanyDetailsComponent)
  .name;

export default CompanyDetails;
