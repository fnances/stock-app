import template from "./addStock.template.html";
import controller from "./addStock.controller.js";


const AddStockComponent = {
  bindings: {
    cancel: "&",
    onAddStock: "&"
  },
  controller,
  template
};


export default AddStockComponent;
