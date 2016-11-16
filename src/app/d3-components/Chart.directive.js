/*eslint-disable*/

 const Chart = d3Service => ({
  restrict: "A",
  link ($scope, $element, $attrs) {
    let d3;
    let svg;
    let initialRenderChecker = 0;
    const graphContainer = document.getElementsByClassName("graph-container")[0];
    const svgAttributes = {
      width: "",
      height: "",
      margin: {
        right: 20,
        left: 20,
        top: 20,
        bottom: 20
      }
    };

    d3Service.d3().then(d3Instance => {

    });
  }
});

Chart.$inject = ["d3Service"];

export default Chart;
