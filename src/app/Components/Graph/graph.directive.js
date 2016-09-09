/*eslint-disable*/

const d3Charts = d3Service => ({
  restrict: "A",
  link ($scope, $element, $attrs) {
    let d3;
    const $ctrl = $scope.$ctrl;

    d3Service.d3()
      .then(d3Instance => {
        d3 = d3Instance;

        $scope.$watch($attrs.stocks, newValue => {
          const preparedData = newValue.map(d => {
            d.High = Number(parseFloat(d.High, 10).toFixed(3));
            d.Low = Number(parseFloat(d.Low, 10).toFixed(3));   // toFixed returns a string for no reason...
            return d;
          });
          console.log(preparedData);
          renderGraph(preparedData);
        });
      });

    const renderGraph = data => {
      const maxValue = d3.extent(data, d => d.High);
      const minValue = d3.min(data, d => d.Low);

    };
  }
});

d3Charts.$inject = ["d3Service"];

export default d3Charts;
