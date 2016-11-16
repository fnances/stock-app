/*eslint-disable*/

const Graph = (d3Service, $window) => ({
  restrict: "A",
  link ($scope, $element, $attrs) {
    d3Service.d3().then(d3Instance => {
  
 });
}
});

Graph.$inject = ["d3Service", "$window"];

export default Graph;
