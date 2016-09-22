/*eslint-disable*/

const d3Charts = d3Service => ({
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
        d3 = d3Instance;
        svgAttributes.width =  d3.select($element[0]).node().offsetWidth;
        svgAttributes.height = d3.select(graphContainer).node().offsetHeight;
        svg = renderGraph();

        $scope.$watch($attrs.stocks, newValue => {
          if (!newValue.length)  { return; }
          initialRenderChecker++;

          if (initialRenderChecker <= 1) {
            svgAttributes["actualGraphState"] = initialChartsRender(newValue);
          } else {
            updateGraphs(newValue);
          }
        });

      });

      const renderGraph = () => {
        const { width, height } = svgAttributes;
        svg = d3.select($element[0]).append("svg");
        svg
          .attr({
            width,
            height
          })
          .style("background-color", "lightblue");

        return svg;
      };

      const initialChartsRender = data => {
        const { width, height, margin } = svgAttributes;
        const max = d3.max(data, d => d.High);
        const range = d3.range(data.length);
        const timeScale = d3.time.scale();
        const xScale = d3.scale.ordinal();
        xScale
          .domain(range)
          .rangeRoundBands([0, width], 0.15);

        const yScale = d3.scale.linear();
        yScale
          .domain([0, max])
          .range([height, 0]);
        const xAxis = d3.svg.axis();
        xAxis
          .scale(xScale)
          .orient("bottom")
          .ticksFormat(d3.time.format("%a $d"))
          .ticks(5);

        const yAxis = d3.svg.axis();
        yAxis
          .scale(yScale)
          .orient("left");

        const rects = svg
          .selectAll("rect")
          .data(data).enter()
          .append("rect");
        rects
          .attr({
            x: (d, i) => xScale(i),
            y: d => height - yScale(d.High) + margin.bottom,
            width: xScale.rangeBand(),
            height: (d, i) => yScale(d.High)
          });

          svg
           .append("g")
           .attr("class", "x axis chart")
           .attr("transform", `translate(0, ${height - margin.bottom})`)
           .call(xAxis);
         svg
           .append("g")
           .attr("class", "y axis chart")
           .attr("transform", `translate(${margin.right}, 0)`)
           .call(yAxis);

          return {
            xScale,
            yScale,
            xAxis,
            yAxis
          };
      };

      const updateGraphs = data => {
        const { xScale, yScale, xAxis, yAxis } = svgAttributes;


      };

  }
});

d3Charts.$inject = ["d3Service"];

export default d3Charts;
