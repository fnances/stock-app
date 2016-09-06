
const d3Charts = d3Service => ({
  restrict: "A",
  link ($scope, $element, $attrs) {
    let d3;
    const $ctrl = $scope.$ctrl;
    d3Service.d3().then(d3Instance => {
      d3 = d3Instance;
    });

    $scope.$watch($attrs.stocks, (newValue, oldValue) => {
      console.log(newValue);
    });
  }
});

d3Charts.$inject = ["d3Service"];

export default d3Charts;
