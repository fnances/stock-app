

export default class ChartController {
  constructor ($element, $window, $scope) {
    this.$element = $element
    this.$window = $window;
    this.$scope = $scope;

    this.createBars = this.createBars.bind(this);
    this.events = this.events.bind(this);
    this.getDimensions = this.getDimensions.bind(this);

    this.margin = {
      right: 30,
      top: 30,
      left: 30,
      bottom: 30
    };
    this.axesAndScales = {};
    this.minimumStocks = 15;
  }
  $onInit () {
    const { $window, $scope } = this;

    this.d3 = $window.d3;
    this.color = this.d3.scaleOrdinal(this.d3.schemeCategory10);
    this.parseTime = this.d3.timeParse("%Y-%m-%d");
    this.svg = this.d3.select(".chart").append("svg")
        .style("width", "100%")
        .style("height", "100%");


    $window.onresize = () => {
      $scope.$apply();
    };

    $scope.$watch(
      () => angular.element($window)[0].innerWidth,
      () => this.render(this.stocks)
    );

    $scope.$watch(
      () => angular.element($window)[0].innerHeight,
      () => this.render(this.stocks)
    );
  }
  $onChanges (changes) {
    const { copy } = angular;

    if (changes.stocks.isFirstChange()) {
      const copied = this.stocks.map(stock => copy(stock));
      this.render(copied);
      return;
    }
    if (changes.stocks) {
      const copied = this.stocks.map(stock => copy(stock));
      this.update(copied);
    }
  }
  events () {
    const { d3, tooltip, adjustDate, onStockClick } = this;

    function brushend (brush, brushG, xTimeScale) {
      const s = d3.event.selection;
      if (!s) {
        return;
      }
      const inverted = [s[0][0], s[1][0]].map(xTimeScale.invert, xTimeScale);
      brushG.call(brush.move, null);
      adjustDate({ $event: inverted });
    }

    function mouseover (ctx, d) {
      d3.select(ctx)
       .style("opacity", 0.5)
       .attr("stroke", "white")
       .attr("stroke-width", 2);

      tooltip
        .style("visibility", "visible")
        .style("top", `${d3.event.pageY - 50}px`)
        .style("left", `${d3.event.pageX - 50}px`)
        .style("font-size", "30px")
        .style("color", "#a1a1a1")
        .text(d.date);
    }

    function mouseout (ctx) {

      d3.select(ctx)
        .style("opacity", 1)
        .attr("stroke", "transparent")
        .attr("stroke-width", 0);

      tooltip
        .style("visibility", "hidden");
    }

    function click (stock)  {
      let stockWithoutColorProperty = Object.keys(stock)
      .reduce((obj, key) => {
        if (key === "color") { return obj; }
        obj[key] = stock[key];
        return obj;
      }, {});

      onStockClick({ $event: stockWithoutColorProperty });
    }

    return {mouseover, mouseout, click, brushend};
  }
  getDimensions () {
    const { right, top, left, bottom } = this.margin;
    return [
      this.d3.select(".chart").node().offsetWidth - right - left,
      this.d3.select(".chart").node().offsetHeight - top - bottom
    ];
  }
  render (stocks) {
    if (!this.d3 || !stocks.length) { return; }

    this.svg.select("*").remove();

    const { d3, color, svg, margin, createBars, parseTime, getDimensions } = this;
    const { right, top, left, bottom } = margin;

    let [width, height] = getDimensions();

    const [min, max] = d3.extent(stocks, d => d.high);
    const dates = stocks.map(d => parseTime(d.date));
    const datesExtent = d3.extent(dates, d => d);

    const average = this.getAverage(stocks);

    svg
      .attr("width", width + right + left)
      .attr("height", height + top + bottom);

    const g = svg.append("g")
      .attr("class", "container")
      .attr("transform", `translate(${left}, ${top})`);

    const xScale = d3.scaleBand().rangeRound([0, width])
      .padding(0.15);

    const xTimeScale = d3.scaleTime().range([0, width]);

    const yScale = d3.scaleLinear().range([height, 0]);

    xScale
      .domain(dates);

    yScale
      .domain([min, max]);

    xTimeScale.domain(datesExtent);

    color.domain([0, average]);

    const xAxis = g.append("g")
      .attr("class", "chart-x-axis")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(xTimeScale).tickPadding(15));

    const yAxis = g.append("g")
       .attr("class", "chart-y-axis")
       .call(d3.axisLeft(yScale));

    const {brushend} = this.events();
    const pass = [g, stocks, xTimeScale, yScale, xScale, height];
    createBars(...pass);

    if (d3.select(".tooltip").empty()) {
      this.tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden");
    }
    const brush = d3.brush();

    const brushG = g.append("g")
      .attr("pointer-events", "all")
      .attr("class", "brush")
      .call(brush);


    const brushendBound = brushend.bind(null, brush, brushG, xTimeScale);

    brush
      .on("end", brushendBound);

    this.scalesAndAxes = {
      height,
      g,
      yAxis,
      xAxis,
      xTimeScale,
      xScale,
      yScale
    };
  }
  update (stocks) {
    const { d3, color, parseTime, getAverage, minimumStocks, getDimensions} = this;
    const { g, yAxis, xAxis, xTimeScale, xScale, yScale, height } = this.scalesAndAxes;

    const [min, max] = d3.extent(stocks, d => d.high);
    const dates = stocks.map(d => parseTime(d.date));
    const datesExtent = d3.extent(stocks, d => parseTime(d.date));
    const average = getAverage(stocks);

    color.domain([0, average]);

    xScale
      .domain(dates);

    yScale
      .domain([min, max]);

    xTimeScale
      .domain(datesExtent);

    const bars = g.selectAll("rect").data(stocks, d => d);
    bars
      .exit()
      .transition()
        .duration((d, i) => i * 15)
        .attr("y", 0)
        .attr("width", 0)
        .style("fill-opacity", 1e-6)
      .remove();

    const { mouseover, mouseout, click, brushend } = this.events();

    bars
      .enter()
      .append("rect")
        .on("mouseover", function (d) {
          mouseover(this, d);
        })
        .on("mouseout", function () {
          mouseout(this);
        })
        .on("click", function (d) {
          click(d);
        })
        .attr("pointer-events", "all")
        .attr("class", "bar")
        .attr("x", d => xScale(parseTime(d.date)))
        .transition()
        .duration((d, i) => i * 35)
        .attr("fill", d => {
          if (d.color) { return d.color; }
          d.color = color(d.high);
          return d.color;
        })
        .attr("y", d => yScale(d.high))
        .attr("width", () => xScale.bandwidth())
        .attr("height", d => height - yScale(d.high));

    xAxis
        .transition()
        .duration(750)
        .call(d3.axisBottom(xTimeScale));

    yAxis
        .transition()
        .duration(750)
        .call(d3.axisLeft(yScale));

    g.select(".brush").remove();

    if (stocks.length <= minimumStocks) { return; }
    const brush = d3.brush();
    const brushG = g.append("g")
      .attr("class", "brush")
      .call(brush);

    const brushendBound = brushend.bind(null, brush, brushG, xTimeScale);

    brush.on("end", brushendBound);
  }
  getAverage (stocks) {
    return stocks
      .map(stock => stock.high)
      .reduce((sum, num, i, array) => {
        sum += num;
        return (array.length === i + 1) ? sum / array.length : sum;
      });
  }
  createBars (sel, stocks, xTimeScale, yScale, xScale, height) {
    const { color, parseTime, events } = this;
    const {mouseover, mouseout, click} = events();
    sel.selectAll("rect")
      .on("mouseover", function (d) {
        const ctx = this;
        mouseover(ctx, d);
      })
      .on("mouseout", mouseout)
      .on("click", function (d) {
        click(d);
      })
      .data(stocks).enter()
      .append("rect")
        .attr("x", d => xScale(parseTime(d.date)))
        .attr("class", "bar")
          .attr("fill", d => {
            if (d.color) { return d.color; }
            d.color = color(d.high);
            return d.color;
          })
          .attr("y", d => yScale(d.high))
          .attr("width", () => xScale.bandwidth())
          .attr("height", d => height - yScale(d.high));
  }
}


ChartController.$inject = ["$element", "$window", "$scope"];
