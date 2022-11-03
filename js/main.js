// First, we need a frame
const MARGINS = { left: 50, right: 50, top: 50, bottom: 50 };

const FRAME_HEIGHT = 500;
const FRAME_WIDTH = 500;
const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.left - MARGINS.right;
const VIS_WIDTH = FRAME_WIDTH - MARGINS.top - MARGINS.bottom;

//Creating the frame for Barcha Location vs Rain Level
const FRAME2 = d3.select("#right")
    .append("svg")
    .attr("height", FRAME_HEIGHT)
    .attr("width", FRAME_WIDTH)
    .attr("class", "frame");

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
            .range([VIS_HEIGHT, 100]);

        FRAME2.selectAll("bars")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", (d) => { return (xScale(d.location) + MARGINS.left); })
            .attr("y", (d) => { return (yScale(d.rain) + MARGINS.top); })
            .attr("height", VIS_HEIGHT - yScale(50))
            .attr("width", xScale.bandwidth())
            .style("fill", function (d) { return Barcolor(d.location) })
            .attr('class', 'bar');


        // add an xaxis to the vis
        FRAME2.append("g")
            .attr("transform", "translate(" + MARGINS.left + "," + (VIS_HEIGHT + MARGINS.top) + ")")
            .call(d3.axisBottom(xScale))
            .attr("font-size", "10px");

        // add an yaxis to the vis
        FRAME2.append("g")
            .attr("transform", "translate(" + MARGINS.left + "," + MARGINS.top + ")")
            .call(d3.axisLeft(yScale))
            .attr("font-size", "10px");

        //ToolTip
        const ToolTip = d3.select("#barchart")
            .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        //event handler for Tooltip
        function handleMouseover(event, d) {
            ToolTip.style("opacity", 1);
        };
        function handleMousemove(event,d){
            ToolTip.html("Rain: " + d.rain + "<br>Location: " + d.location)
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
};

buildPlots();