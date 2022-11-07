// First, we need a frame
const MARGINS = { left: 40, right: 60, top: 0, bottom: 100 };

const FRAME_HEIGHT = 600;
const FRAME_WIDTH = 750;
const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.left - MARGINS.right;
const VIS_WIDTH = FRAME_WIDTH - MARGINS.top - MARGINS.bottom;
const MAP_HEIGHT = 600;
const MAP_WIDTH = 750;

//Creating the frame for Barcha Location vs Rain Level
const FRAME2 = d3.select("#right")
    .append("svg")
    .attr("height", FRAME_HEIGHT)
    .attr("width", FRAME_WIDTH)
    .attr("class", "frame");


    
const LOCATION = [
  {lat:42.34951908186938, long:-71.07961534089964, name:"Back Bay"},
  {lat:42.35623840591134, long:-71.06958586081059, name:"Beacon Hill"},
  {lat:42.350863440297815, long:-71.10536757955218, name:"Boston University"},
  {lat:42.34044743062222, long:-71.08905397673476, name:"Northeastern University"},
  {lat:42.346953317328285, long:-71.09236848084416, name:"Fenway"},
  {lat:42.366433580982076, long:-71.06193200915563, name:"North Station"},
  {lat:42.362918759655585, long:-71.05849212109845, name:"Haymarket Square"},
  {lat:42.36518837689946, long:-71.05512527121255, name:"North End"},
  {lat:42.35211128441916, long:-71.05539853661827, name:"South Station"},
  {lat:42.351855312673585, long:-71.06422972185284, name:"Theatre District"},
  {lat:42.35596536121418, long:-71.05502481285681, name:"Financial District"},
  {lat:42.36519766224288, long:-71.06450910516438, name:"West End"}
]

//Build Bar chart
function buildPlots() {
    //read data from the file
    d3.csv("data/weather_data.csv").then((data) => {
        //checking the data prints to the console
        console.log(data)

        const Barcolor = d3.scaleOrdinal()
            .domain(["Back Bay", "Beacon Hill", "Boston University", "Fenway", "Financial District", "HayMarket Square", "North End", "North Station", "Northeastern University", "South Station", "Theatre Distrcit", "West End"])
            .range(["#4682b4", "#4682b4", "#4682b4", "#4682b4", "#4682b4", "#4682b4", "#4682b4", "#4682b4", "#4682b4", "#4682b4", "#4682b4", "#4682b4"])
        const xScale = d3.scaleBand()
            .domain(data.map(function (d) { return d.location; }))
            .range([0, VIS_WIDTH])
            .padding(0.4);
        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, function (d) { return d.rain; }) + 1])
            .range([VIS_HEIGHT, 0]);

        FRAME2.selectAll("bars")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", (d) => { return (xScale(d.location) + MARGINS.left); })
            .attr("y", (d) => { return (yScale(d.rain) + MARGINS.top); })
            .attr("height", (d) => { return (VIS_HEIGHT - yScale(d.rain)); })
            .attr("width", xScale.bandwidth())
            .style("fill", function (d) { return Barcolor(d.location) })
            .attr("class", "bar")
            .attr("id", (d) => { return d.location });


        // add an xaxis to the vis
        FRAME2.append("g")
            .attr("transform", "translate(" + MARGINS.left + "," + (VIS_HEIGHT + MARGINS.top) + ")")
            .call(d3.axisBottom(xScale))
            .attr("font-size", "10px")
            .classed("xAxis", true);

        // rotate x axis text
        FRAME2.select("g.xAxis")
        .selectAll("text")
            .style("text-anchor", "end")
            .style("font-size", "9.5px")
            .attr("transform", "rotate(-60)");
          

        // add an yaxis to the vis
        FRAME2.append("g")
            .attr("transform", "translate(" + MARGINS.left + "," + MARGINS.top + ")")
            .call(d3.axisLeft(yScale))
            .attr("font-size", "10px");


        //ToolTip
        const ToolTip = d3.select(("#right"))
            .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        //event handler for Tooltip
        function handleMouseover(event, d) {
            ToolTip.style("opacity", 1);
        };
        function handleMousemove(event,d){
            ToolTip.html("Rain: " + d.rain + "<br>Location: " + d.location + "<br>Date: " + d.date)
            .style("left", (event.pageX + 10) + "px") //add offset
                                                        // from mouse
            .style("top", (event.pageY - 50) + "px"); 
         };
         function handleMouseleave(event,d){
            ToolTip.style("opacity",0);
         };
         //add event listeners
         FRAME2.selectAll(".bar")
               .on("mouseover", handleMouseover) //add event listeners
               .on("mousemove", handleMousemove)
               .on("mouseleave", handleMouseleave); 

    });

    // Drawing the map of Boston
    var projection = d3.geoMercator()
                        .scale(200000)
                        .precision(.1)
                        .center([-71.06161620932242, 42.361975036613735])
                        .translate([MAP_WIDTH / 2, MAP_HEIGHT / 2]);
    
    var path = d3.geoPath()
                .projection(projection);
    
    var svg = d3.select("#left").append("svg")
                .attr("width", MAP_WIDTH)
                .attr("height", MAP_HEIGHT); 
    var g = svg.append("g");
    // Load world shape
    d3.json("data/Boston.json")
    .then(data => {
      // data.features = data.features.filter( function(d){return d.properties.name=="USA"} );
      // console.log(data.features);

      // Draw the map
      
      g.selectAll("path")
          .data(data.features)
          .enter()
          .append("path")
            .attr("fill", "lightblue")
            .attr("d", path)
          .style("stroke", "black")
          .style("opacity", .3);

      svg.selectAll("myCircles")
        .data(LOCATION)
        .enter()
          .append("circle")
          .attr("cx", function(d){ return projection([d.long, d.lat])[0] })
          .attr("cy", function(d){ return projection([d.long, d.lat])[1] })
          .attr("r", 4)
          .attr("class", "circle")
          .attr("id", (d) => { return d.name });

  });

    
};

buildPlots();


const margin = {top:20, right: 20, bottom: 30, left: 50};
const width = 960 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

// parse the date / time
var parseTime = d3.timeParse("%y-%b-%d");

// set the ranges
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// define the area
var area = d3.area() 
     .x(function(d) { return x(d.date); })
     .y0(height)
     .y1(function(d) { return y(d.price); });


const FRAME3 = d3.select("#timeline")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")")
                .attr("class", "frame");


//Read the data
d3.csv("data/price_data.csv").then(function(data) {
    
    // format the data
        data.forEach(function(d) {
             d.date = parseTime(d.date);
             d.price = +d.price;
             });

   // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain([0, d3.max(data, function(d) { return d.price; })]);
    
    // set the gradient
    FRAME3.append("linearGradient")
            .attr("id", "area-gradient")
            .attr("gradientUnits", "userSpaceOnUse")
            .attr("x1", 0).attr("y1", y(0))
            .attr("x2", 0).attr("y2", y(1000))
            .selectAll("stop")
            .data([
                {offset: "0%", color: "red"},
                {offset: "30%", color: "red"},
                {offset: "45%", color: "black"},
                {offset: "55%", color: "black"},
                {offset: "60%", color: "lawngreen"},
                {offset: "100%", color: "lawngreen"}])
            .enter()
            .append("stop")
            .attr("offset", function(d) { return d.offset; })
            .attr("stop-color", function(d) { return d.color; });

    // Add the area.
    FRAME3.append("path")
            .data([data])
            .attr("class", "area")
            .attr("d", area);

    // Add the X Axis
    FRAME3.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

    // Add the Y Axis
    FRAME3.append("g")
            .call(d3.axisLeft(y));

});