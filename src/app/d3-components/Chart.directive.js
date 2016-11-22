/*eslint-disable*/

 const Chart = (d3Service, $window)=> ({
  restrict: "A",
  link ($scope, $element, $attrs) {
    let color;
    let d3 = $window.d3;
    let svg;
    let stocks = [];

    let parseTime;

    let width;
    let height;

    let tooltip;
    let scalesAndAxes = {};


    const { right, top, left, bottom } = margin;

    const el = $element[0];

    const getAverage = stocks => {
      return stocks
        .map(stock => stock.high)
        .reduce((sum, num, i, array) => {
        sum += num;
        return (array.length === i + 1) ? sum / array.length : sum;
      });

    };


    function brushend (brush, brushG, xTimeScale) {
         const s = d3.event.selection;
          if (!s) {
            return;
          }
         const inverted = [s[0][0], s[1][0]].map(xTimeScale.invert, xTimeScale);
         brushG.call(brush.move, null);

         $scope.$ctrl.adjustDate(inverted);

       };

     function mouseover (d) {
       d3.select(this)
         .style("opacity", 0.5)
         .attr("stroke", "white")
         .attr("stroke-width", 2);
        tooltip
          .style("visibility", "visible")
          .style("top", `${d3.event.pageY - 50}px`)
          .style("left", `${d3.event.pageX - 50}px`)
          .style("font-size", "30px")
          .style("color", "white")
          .text(d.date);
      };

    function mouseout (d) {
      d3.select(this)
        .style("opacity", 1)
        .attr("stroke", "transparent")
        .attr("stroke-width", 0);
        tooltip
          .style("visibility", "hidden");
      };
   function click (stock)  {
        $scope.$ctrl.onStockClick(stock);
      };

    const createBars = (g, stocks, xTimeScale, yScale, xScale) =>  {
      g.selectAll("rect")
        .on("mouseover", mouseover)
        .on("mouseout", mouseout)
        .on("click", click)
        .data(stocks).enter()
        .append("rect")
          .attr("pointer-events", "all")
          .attr("class", "bar")
          .attr("fill", d => color(d.high))
          .attr("x", d => xTimeScale(parseTime(d.date)))
          .attr("y", d => yScale(d.high))
          .attr("width", d => xScale.bandwidth())
          .attr("height", d => height - yScale(d.high));
    };

    const render = newStocks => {

      svg.select("g").remove("*");

      if (!newStocks.length) { return; }

      stocks = newStocks;

      width = d3.select(el).node().offsetWidth - left - right;
      height = d3.select(el).node().offsetHeight - top - bottom;

      const [min, max] = d3.extent(stocks, d => d.high);
      const dates = stocks.map(d => parseTime(d.date));
      const datesExtent = d3.extent(stocks, d => parseTime(d.date));

      const average = getAverage(stocks);

      svg
        .attr("width", width + right + left)
        .attr("height", height + top + bottom);

      const g = svg.append("g")
        .attr("transform", `translate(${left}, ${top})`);

      const xScale = d3.scaleBand().range([0, width])
        .padding(0.15);

      const xTimeScale = d3.scaleTime().range([0, width]);

      const yScale = d3.scaleLinear().range([height, 0]);

      xScale
        .domain(dates);

      yScale
        .domain([min, max]);

      xTimeScale.domain(datesExtent);

      color.domain([0, average]);

      tooltip = d3.select("body").append("div");

      tooltip
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")

     const pass = [g, stocks, xTimeScale, yScale, xScale];
     const bars = createBars(...pass);

    const xAxis = g.append("g")
      .attr("class", "chart-x-axis")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(xTimeScale).tickPadding(15));

    const yAxis = g.append("g")
      .attr("class", "chart-y-axis")
      .call(d3.axisLeft(yScale));

    const brush = d3.brush();

    const brushG = g.append("g")
      .attr("class", "brush")
      .call(brush);

    const brushendBinded = brushend.bind(null, brush, brushG, xTimeScale);
      brush
      .on("end", brushendBinded);

        return {
          g,
          xTimeScale,
          yScale,
          xScale
        };
    };

    const update = newStocks => {
      let { g, xTimeScale, yScale, xScale} = scalesAndAxes;

      stocks = newStocks;

      const [min, max] = d3.extent(stocks, d => d.high);
      const dates = stocks.map(d => parseTime(d.date));

      const datesExtent = d3.extent(stocks, d => parseTime(d.date));

      const average = getAverage(stocks);

      color.domain([0, average]);

      xScale
        .domain(dates);

      yScale
        .domain([min, max]).ticks(15);

      xTimeScale
        .domain(datesExtent);

      const bars = g.selectAll("rect").data(stocks, d => d);
      bars
        .exit()
        .transition()
          .duration((d, i) => i * 20)
          .attr("y", d => 0)
          .attr("width", 0)
          .style("fill-opacity", 1e-6)
        .remove();

      bars
        .enter()
        .append("rect")
          .attr("pointer-events", "all")
          .on("mouseover", mouseover)
          .on("mouseout", mouseout)
          .on("click", click)
          .attr("class", "bar")
              .attr("x", d => xScale(parseTime(d.date)))
            .transition()
            .duration((d, i) => i * 35)
              .attr("y", d => yScale(d.high))
              .attr("height", d => height - yScale(d.high))
              .attr("width", d => xScale.bandwidth())
              .attr("fill", d => color(d.high));

      if (stocks.length >= 15) {
        const brush = d3.brush();
        g.select(".brush").remove();

        const brushG = g.append("g")
          .attr("class", "brush")
          .call(brush);

        const brushendBinded = brushend.bind(null, brush, brushG, xTimeScale);

        brush.on("end", brushendBinded);
      }

      g = g.transition();
      g.select(".chart-x-axis")
          .transition()
          .duration(750)
          .call(d3.axisBottom(xTimeScale));

      g.select(".chart-y-axis")
          .transition()
          .duration(750)
          .call(d3.axisLeft(yScale));

    };

    const stocksChanged = (newValue, oldValue) => {
      if (newValue.length && oldValue.length) {
        update(newValue);
        return;
      }
      scalesAndAxes = render(newValue);
    };

    const setWatchers = () => {
      
     $scope.$watch(
        $attrs.stocks,
        (newValue, oldValue) => stocksChanged(newValue, oldValue),
        true
      );

     $scope.$watch(
       () => angular.element($window)[0].innerWidth,
       () => scalesAndAxes = render(stocks)
     );

     $scope.$watch(
       () => angular.element($window)[0].innerHeight,
       () => scalesAndAxes = render(stocks)
     );
  };

    d3Service.d3().then(d3Instance => {
      d3 = d3Instance;
      color = d3.scaleOrdinal(d3.schemeCategory10);
      parseTime = d3.timeParse("%Y-%m-%d");
      svg = d3.select(el).append("svg")
          .style("width", "100%")
          .style("height", "100%")
      setWatchers();
    });
  }
});

Chart.$inject = ["d3Service", "$window"];

export default Chart;
