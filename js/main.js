// First, we need a frame
const MARGINS = { left: 40, right: 60, top: 0, bottom: 100 };

const FRAME_HEIGHT = 600;
const FRAME_WIDTH = 750;
const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.left - MARGINS.right;
const VIS_WIDTH = FRAME_WIDTH - MARGINS.top - MARGINS.bottom;
const MAP_HEIGHT = 600;
const MAP_WIDTH = 750;


//Creating the frame for  Location vs Rain Level
const FRAME2 = d3.select("#barchart")
    .append("svg")
    .attr("height", FRAME_HEIGHT)
    .attr("width", FRAME_WIDTH)
    .attr("class", "frame");



const LOCATION = [
    { lat: 42.34951908186938, long: -71.07961534089964, name: "Back Bay" },
    { lat: 42.35623840591134, long: -71.06958586081059, name: "Beacon Hill" },
    { lat: 42.350863440297815, long: -71.10536757955218, name: "Boston University" },
    { lat: 42.34044743062222, long: -71.08905397673476, name: "Northeastern University" },
    { lat: 42.346953317328285, long: -71.09236848084416, name: "Fenway" },
    { lat: 42.366433580982076, long: -71.06193200915563, name: "North Station" },
    { lat: 42.362918759655585, long: -71.05849212109845, name: "Haymarket Square" },
    { lat: 42.36518837689946, long: -71.05512527121255, name: "North End" },
    { lat: 42.35211128441916, long: -71.05539853661827, name: "South Station" },
    { lat: 42.351855312673585, long: -71.06422972185284, name: "Theatre District" },
    { lat: 42.35596536121418, long: -71.05502481285681, name: "Financial District" },
    { lat: 42.36519766224288, long: -71.06450910516438, name: "West End" }
]

//Creating frame for Barchat for Location vs. Rain Level
const FRAME4 = d3.select("#scatterplot")
    .append("svg")
    .attr("height", FRAME_HEIGHT)
    .attr("width", FRAME_WIDTH)
    .attr("class", "frame");


//Build Bar chart
function buildPlots() {
    //read data from the file
    d3.csv("data/data.csv").then((data) => {
        //checking the data prints to the console
        console.log(data)

        const secGroup = new Set(data.map(d => d.source))


        non_zero_rain = data.filter(function (d) { return d.rain != 0 });
        q1 = d3.rollup(non_zero_rain, v => d3.quantile(v.map(function (x) { return x.rain }), 0.25), d => d.source)
        median = d3.rollup(non_zero_rain, v => d3.quantile(v.map(function (x) { return x.rain }), 0.5), d => d.source)
        q3 = d3.rollup(non_zero_rain, v => d3.quantile(v.map(function (x) { return x.rain }), 0.75), d => d.source)
        console.log(q1.get("Fenway"))

        const Barcolor = d3.scaleOrdinal()
                            .domain(secGroup)
                            .range(d3.schemeSet3);
        const xScale = d3.scaleBand()
            .domain(data.map(function (d) { return d.source; }))
            .range([0, VIS_WIDTH])
            .padding(0.4);
        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, function (d) { return d.rain; }) + 1])
            .range([VIS_HEIGHT, 0]);

        SOURCE = [
            { source: "Back Bay" },
            { source: "Beacon Hill" },
            { source: "Boston University" },
            { source: "Northeastern University" },
            { source: "Fenway" },
            { source: "North Station" },
            { source: "Haymarket Square" },
            { source: "North End" },
            { source: "South Station" },
            { source: "Theatre District" },
            { source: "Financial District" },
            { source: "West End" }
        ]


        FRAME2.selectAll("bars")
            .data(non_zero_rain)
            .enter()
            .append("line")
            .attr("x1", (d) => { return (xScale(d.source) + MARGINS.left + xScale.bandwidth() / 2); })
            .attr("x2", (d) => { return (xScale(d.source) + MARGINS.left + xScale.bandwidth() / 2); })
            .attr("y1", VIS_HEIGHT)
            .attr("y2", (d) => { return (yScale((d.rain))); })
            // .attr("width", xScale.bandwidth())
            // .style("fill", function (d) { return Barcolor(d.source) })
            .attr("class", "bar")
            //.attr("id", (d) => { return d.source })
            .attr("stroke", "darkblue");

        FRAME2.selectAll("boxes")
            .data(SOURCE)
            .enter()
            .append("rect")
            .attr("x", function (d) { return (xScale(d.source) + MARGINS.left) })
            .attr("y", function (d) { return (MARGINS.top + yScale(q3.get(d.source))) })
            .attr("height", function (d) { return yScale(q1.get(d.source)) - yScale(q3.get(d.source)) })
            .attr("width", xScale.bandwidth())
            .attr("position", "absolute")
            //.attr("stroke", "black")
            .attr("class", "box")
            .attr("id", (d) => { return d.source; })
            .style("fill", function (d) { return Barcolor(d.source) })

        FRAME2.selectAll("medianline").data(SOURCE)
            .enter()
            .append("line")
            .attr("x1", (d) => { return (xScale(d.source) + MARGINS.left); })
            .attr("x2", (d) => { return (xScale(d.source) + MARGINS.left + xScale.bandwidth()); })
            .attr("y1", (d) => { return MARGINS.top + yScale(median.get(d.source)); })
            .attr("y2", (d) => { return MARGINS.top + yScale(median.get(d.source)); })
            .style("stroke", "blue")
            .attr("class", "median")

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
        const ToolTip = d3.select(("#barchart"))
            .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        //event handler for Tooltip
        function handleMouseover(event, d) {
            ToolTip.style("opacity", 1);
        };
        function handleMousemove(event, d) {
            ToolTip.html("Q1: " + q1.get(d.source) + "<br>Median: " + median.get(d.source) + "<br>Q3: " + q3.get(d.source))
                .style("left", (event.pageX + 10) + "px") //add offset
                // from mouse
                .style("top", (event.pageY - 50) + "px");
        };
        function handleMouseleave(event, d) {
            ToolTip.style("opacity", 0);
        };
        //add event listeners
        FRAME2.selectAll(".box")
            .on("mouseover", handleMouseover) //add event listeners
            .on("mousemove", handleMousemove)
            .on("mouseleave", handleMouseleave);

        //building Price vs. Rain -- scatterplot
        FRAME2.selectAll(".box").on("click", selectBox);

        const allGroup = new Set(data.map(d => d.destination))
        const myColor = d3.scaleOrdinal()
            .domain(allGroup)
            .range(d3.schemeSet3);
        // Add X axis 
        const x = d3.scaleLinear()
                .domain(d3.extent(data, function(d) { return d.rain; }))
                .range([ 0, VIS_WIDTH ]);
        FRAME4.append("g")
                .attr("transform", "translate(" + MARGINS.left + "," + (VIS_HEIGHT + MARGINS.top) + ")")
                .call(d3.axisBottom(x).ticks(20));
        // Add Y axis
        const y = d3.scaleLinear()
                    .domain([0, d3.max(data, function(d) { return +d.surge_multiplier; })])
                    .range([VIS_HEIGHT, 0 ]);
        FRAME4.append("g")
                .attr("transform", "translate(" + MARGINS.left + "," + MARGINS.top + ")")
                .call(d3.axisLeft(y));
        const Scattercolor1 = d3.scaleOrdinal()
                            .domain(secGroup)
                            .range(d3.schemeSet3);
        // add the options to the button
        /*
        const Frame4Points = FRAME4.selectAll("points")
                                    .data(non_zero_rain)
                                    .enter()
                                    .append("circle")
                                    .attr("id", (d) => { return "(" + d.rain + "," + d.price + ")"; })
                                    .attr("cx", (d) => { return (MARGINS.left + x(d.rain)); })
                                    .attr("cy", (d) => { return (MARGINS.top + y(+d.price)); })
                                    .attr("r", 2)
                                    .attr("opacity", 0.7)
                                    .style("fill", function (d) { return myColor(d.source) })
                                    //.attr("id", (d) => {return d.source})
                                    .attr("class", "point");*/

        // A function that update the chart
        function selectBox(box) {
            //get source
            let ClickedBoxSource = document.getElementById(box.target.id);
            console.log(".point " + box.target.id);
            if (ClickedBoxSource.classList.contains("selected")) {
                ClickedBoxSource.classList.remove("selected");
                className = ".point" + box.target.id
                FRAME4.selectAll(".point" + box.target.id.split(" ").join("")).remove()
            }
            else {
                ClickedBoxSource.classList.add("selected");
                console.log(ClickedBoxSource);
                FRAME4.selectAll("points")
                                .data(non_zero_rain.filter((d) => {return d.source == ClickedBoxSource.id}))
                                    .enter()
                                    .append("circle")
                                    .attr("id", (d) => { return "(" + d.rain + "," + d.price + ")"; })
                                    .attr("cx", (d) => { return (MARGINS.left + x(d.rain)); })
                                    .attr("cy", (d) => { return (MARGINS.top + y(+d.surge_multiplier)); })
                                    .attr("r", 2)
                                    .attr("opacity", 0.7)
                                    .style("fill", function (d) { return Scattercolor1(d.source)})
                                    //.attr("id", (d) => {return d.source})
                                    .attr("class", (d) => { return ("point" + d.source.split(" ").join("")); });
                
            }
        // add the options to the button
        

            // filter data to just source
            // populate graph with just that points of that source
            // use same code for scatteplot just with filtered data
            return ClickedBoxSource;
        }

    });
}

buildPlots();