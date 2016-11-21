import template from "./CompanyDetails.template.html";
import controller from "./CompanyDetails.controller";

const CompanyDetailsComponent = {
  bindings: {
    companyStocks: "<",
    company: "<"
  },
  controller,
  template
};


export default CompanyDetailsComponent;
