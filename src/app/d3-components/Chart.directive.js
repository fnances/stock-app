/*eslint-disable*/

 const Chart = (d3Service, $window)=> ({
  restrict: "A",
  link ($scope, $element, $attrs) {
    let d3;
    let svg;
    const el = $element[0];

    const margin = {
      left: 20,
      right: 20,
      top: 20,
      bottom: 20
    };

    const stocksChanged = (newValue, oldValue) => {
      if (newValue.length && oldValue.length) {
        update(newValue);
        return;
      }
      scalesAndAxes = render(newValue);
    };

    const setWatchers = () => {
      window.onresize = () => {
        $scope.$apply();
     };
     $scope.$watch(
        $attrs.stocks,
        (newValue, oldValue) => stocksChanged(newValue, oldValue)
      );

     $scope.$watch(
       () => angular.element($window)[0].innerWidth,
       () => render(stocks)
     );
  };

  d3Service.d3().then(d3Instance => {
    d3 = d3Instance;
    color = d3.scaleOrdinal(d3.schemeCategory10);
    svg = d3.select(el).append("svg")
      .style("width", "100%")
      .style("background-color", "lightblue");
    setWatchers();
 });




  }
});

Chart.$inject = ["d3Service", "$window"];

export default Chart;
