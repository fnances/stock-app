import controller from "./graph.controller";
import template from "./graph.template.html";

const GraphComponent = {
  bindings: {
    stocks: "<",
    date: "<"
  },
  controller,
  template
};

export default GraphComponent;
