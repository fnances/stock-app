import template from "./Chart.template.html";
import controller from "./Chart.controller";

const ChartComponent = {
  bindings: {
    stocks: "<",
    onStockClick: "&",
    adjustDate: "&"
  },
  controller,
  template
};


export default ChartComponent;
