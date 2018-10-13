var svgWidth = 750;
var svgHeight = 550;

var margin = {
  top: 60,
  right: 40,
  bottom: 100,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv(".\\assets\\data\\data.csv")
  .then(function(dataset) {

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    dataset.forEach(function(data) {
        data.poverty = +data.poverty;
        data.obesity = +data.obesity;
    });

    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([8, d3.max(dataset, data => data.poverty)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([19, d3.max(dataset, data => data.obesity)])
      .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("cx", data => xLinearScale(data.poverty))
    .attr("cy", data => yLinearScale(data.obesity))
    .attr("r", "15")
    .attr("fill", "orange")
    .attr("opacity", ".50");

    // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(data) {
        return (`${data.state}<br>----------------<br>Poverty Rate: ${data.poverty}<br>Obesity Rate: ${data.obesity}`);
      });

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // // Step 8: Create event listeners to display and hide the tooltip
    // // ==============================
    circlesGroup.on("click", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });


      // Appending a label to each data point
    chartGroup.append("text")
      .style("font-size", "9px")
      .selectAll("tspan")
      .data(dataset)
      .enter()
      .append("tspan")
          .attr("x", function(data) {
              return xLinearScale(data.poverty - 0.2);
          })
          .attr("y", function(data) {
              return yLinearScale(data.obesity - 0.1);
          })
          .text(function(data) {
              return data.abbr
            });  

  
    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Percentage of the Population in Obesity");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top - 20})`)
      .attr("class", "axisText")
      .text("Percentage of the Population in Poverty");
  });
//   });
