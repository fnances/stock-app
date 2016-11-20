/*eslint-disable*/

const Graph = (d3Service, $window) => ({
  restrict: "A",
  link ($scope, $element, $attrs) {
    let d3;
    let stocks = [];
    let svg;
    let color;
    const ignoreKeys = ["symbol", "date", "volume", ];

    let scalesAndAxes = {};

    const el = $element[0];
    const margin = {
      top: 30,
      left: 30,
      right: 30,
      bottom: 30
    };

    const getMinAndMaxFromEntireStock = stocks => {

      const minAndMax = Object.keys(stocks[0])
        .reduce((values, key) => {
          if (ignoreKeys.includes(key)) { return values; }

          let [min, max] = d3.extent(stocks, d => d[key]);
          return [...values, min, max];

      }, []);

      return d3.extent(minAndMax, d => d);
    };

    const createPathsForEntireStock = (g, x, y, parseTime, stocks, key, i) => {
      const valueline = d3.line()
        .x(d => x(parseTime(d.date)))
        .y(d => y(d[key]));

      const graphSelector = `${key}-path`;

      g.append("text")
        .attr("x", (i + 1) * 45)
        .attr("y", 5)
        .style("font-size", 10)
        .style("fill", color(i))
        .text(`${key.toUpperCase()}`);

      g.append("path")
        .data([stocks])
        .attr("class", graphSelector)
        .style("stroke", color(i))
        .attr("d", valueline);

        return {
          graphSelector,
          valueline
        };
    };


    const render = newStocks => {

      if (!newStocks.length) { return; }
      stocks = newStocks;

      svg.select("g").remove("*");

      const { top, left, right, bottom } = margin;

      const width = d3.select(el).node().offsetWidth - left - right;
      const height = 450 - top - bottom;

      const parseTime = d3.timeParse("%Y-%m-%d");

      const [ min, max ] = getMinAndMaxFromEntireStock(stocks);
      const dateExtent = d3.extent(stocks, d => parseTime(d.date));

      svg
        .attr("height", height + top + bottom)
        .attr("width", width + left + right);

      const g = svg
            .append("g")
              .attr("transform", `translate(${left}, ${top})`)


      const xTimeScale = d3.scaleTime().range([0, width]);
      const yLinearScale = d3.scaleLinear().range([height, 0]);

      xTimeScale.domain(dateExtent);
      yLinearScale.domain([min, max]);

      const graphs = Object.keys(stocks[0])
        .filter(key => !ignoreKeys.includes(key))
        .map((key, i) => {

          const pass = [g, xTimeScale, yLinearScale, parseTime, stocks, key, i];
          const graph = createPathsForEntireStock(...pass);

          return graph;

        });

      const xAxis = g.append("g");

      xAxis
        .attr("class", "graph-x-axis")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(xTimeScale));

      const yAxis = g.append("g");

      yAxis
        .attr("class", "graph-y-axis")
        .call(d3.axisLeft(yLinearScale));

        return {
          g,
          graphs,
          xTimeScale,
          yLinearScale,
          xAxis,
          yAxis,
          parseTime
        };
    };

    const update = newStocks => {
      stocks = newStocks;
      let { g,
        graphs,
        xTimeScale,
        yLinearScale,
        xAxis,
        yAxis,
        parseTime } = scalesAndAxes;

      const dateExtent = d3.extent(stocks, d => parseTime(d.date));
      const [ min, max ] = getMinAndMaxFromEntireStock(stocks);

      xTimeScale.domain(dateExtent).ticks(5);
      yLinearScale.domain([min, max]);

      g = g.transition();

      graphs.forEach(({ graphSelector, valueline } )=> {
        g.select(`.${graphSelector}`)
          .duration(500)
          .attr("d", valueline(stocks));
      });

      g.select(".graph-x-axis")
        .duration(750)
        .call(d3.axisBottom(xTimeScale));

      g.select(".graph-y-axis")
        .duration(750)
        .call(d3.axisLeft(yLinearScale));
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
     .style("background-color", "#dddfe6");
   setWatchers();
});

}
});

Graph.$inject = ["d3Service", "$window"];

export default Graph;
