
const d3Charts = d3Service => ({
  restrict: "A",
  link ($scope, $element, $attrs) {
    let d3;
    let svg;
    const $ctrl = $scope.$ctrl;

    d3Service.d3()
      .then(d3Instance => {
        d3 = d3Instance;

        $scope.$watch($attrs.stocks, newValue => {
          renderGraph(newValue);
        });
      });

    const renderGraph = data => {
      if (!svg) {
        svg = d3
          .select($element[0])
          .append("svg")
          .attr("width", "100%")
          .attr("height", "100%");
      }
      const width = $element[0].style.width;
      const dataPrepared = data
        .filter(stock => !Number.isNaN(stock.High))
        .map(stock => Math.round(parseFloat(stock.High, 10)));
      const scale = d3.scaleLinear()
        .domain([0, d3.max(d => d.High)])
        .range([0, width]);

      svg.selectAll("rect")
        .data(dataPrepared)
        .enter().append("rect")
        .attr("x", d => d.High)
        .attr("y", d => d.Low)
        .attr("width", 20)
        .attr("height", 20);
    };
  }
});

d3Charts.$inject = ["d3Service"];

export default d3Charts;
