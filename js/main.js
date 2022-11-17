// First, we need a frame
const MARGINS = { left: 40, right: 60, top: 0, bottom: 100 };

const FRAME_HEIGHT = 600;
const FRAME_WIDTH = 750;
const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.left - MARGINS.right;
const VIS_WIDTH = FRAME_WIDTH - MARGINS.top - MARGINS.bottom;
const MAP_HEIGHT = 600;
const MAP_WIDTH = 750;

//Creating the frame for  Location vs Rain Level
const FRAME2 = d3.select("#right")
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
const FRAME4 = d3.select("#leftrow")
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

        non_zero_rain = data.filter(function (d) { return d.rain != 0 });
        q1 = d3.rollup(non_zero_rain, v => d3.quantile(v.map(function (x) { return x.rain }), 0.25), d => d.source)
        median = d3.rollup(non_zero_rain, v => d3.quantile(v.map(function (x) { return x.rain }), 0.5), d => d.source)
        q3 = d3.rollup(non_zero_rain, v => d3.quantile(v.map(function (x) { return x.rain }), 0.75), d => d.source)
        console.log(q1.get("Fenway"))

        const Barcolor = d3.scaleOrdinal()
            .domain(["Back Bay", "Beacon Hill", "Boston University", "Fenway", "Financial District", "HayMarket Square", "North End", "North Station", "Northeastern University", "South Station", "Theatre Distrcit", "West End"])
            .range(["#2e8b57", "#ff7f50", "#40e0d0", "#bc8f8f", "#008b8b", "#663399", "#d2b48c", "#ff0000", "#4b008", "#808000", "#cd853f"])
        const xScale = d3.scaleBand()
            .domain(data.map(function (d) { return d.source; }))
            .range([0, VIS_WIDTH])
            .padding(0.4);
        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, function (d) { return d.rain; }) + 1])
            .range([VIS_HEIGHT, 0]);


        FRAME2.selectAll("bars")
            .data(non_zero_rain)
            .enter()
            .append("line")
            .attr("x1", (d) => { return (xScale(d.source) + MARGINS.left + xScale.bandwidth() / 2); })
            .attr("x2", (d) => { return (xScale(d.source) + MARGINS.left + xScale.bandwidth() / 2); })
            .attr("y1", VIS_HEIGHT)
            .attr("y2", (d) => { return (yScale(d.rain)); })
            // .attr("width", xScale.bandwidth())
            // .style("fill", function (d) { return Barcolor(d.source) })
            .attr("class", "bar")
            .attr("id", (d) => { return d.source })
            .attr("stroke", "black");

        FRAME2.selectAll("boxes")
            .data(non_zero_rain)
            .enter()
            .append("rect")
            .attr("x", function (d) { return (xScale(d.source) + MARGINS.left) })
            .attr("y", function (d) { return (MARGINS.top + yScale(q3.get(d.source))) })
            .attr("height", function (d) { return yScale(q1.get(d.source)) - yScale(q3.get(d.source)) })
            .attr("width", xScale.bandwidth())
            .attr("position", "absolute")
            .attr("stroke", "black")
            .attr("class", "box")
            .attr("id", (d) => { return d.source; })
            .style("fill", function (d) { return Barcolor(d.source) })

        FRAME2.selectAll("medianline").data(non_zero_rain)
            .enter()
            .append("line")
            .attr("x1", (d) => { return (xScale(d.source) + MARGINS.left); })
            .attr("x2", (d) => { return (xScale(d.source) + MARGINS.left + xScale.bandwidth()); })
            .attr("y1", (d) => { return MARGINS.top + yScale(median.get(d.source)); })
            .attr("y2", (d) => { return MARGINS.top + yScale(median.get(d.source)); })
            .style("stroke", "black")
            .attr("class", "median")
        /*
        .on("mouseover", function(event,d) {
           div.transition()
             .duration(200)
             .style("opacity", .9);
           div.html("Q3 : " + d.q3  + "<br/> Median: " + d.median + "<br/> Q1: " + d.q1)
             .style("left", (event.pageX) + "px")
             .style("top", (event.pageY - 28) + "px");
           })
        .on("mouseout", function(d) {
           div.transition()
             .duration(500)
             .style("opacity", 0);
           });*/
        /*
        jitterWidth = 30
        FRAME2
            .selectAll("indPoints")
            .data(non_zero_rain)
            .enter()
            .append("circle")
            .attr("cx", function (d) { return (xScale(d.source) + MARGINS.left + xScale.bandwidth() / 2 - jitterWidth / 2 + Math.random() * jitterWidth) })
            .attr("cy", function (d) { return (yScale(d.rain)) })
            .attr("r", 4)
            .style("fill", "lightblue")
            .attr("opacity", "0.5")
            .attr("stroke", "black")*/

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

        //Add Interaction to Boxplot
        //  FRAME2.selectAll(".box").on("click", selectBox);

        //filter data: Get a subset of the data based on the source 
        function getFilteredData(data, Selectedsource) {
            return data.filter(function (d) { return d.source === Selectedsource && d.rain != 0 });
        }

        //   console.log(getFilteredData(data,'Fenway'));

        // const non_zero_rainSource = data.filter(function (d,source) { return d.source == source && d.rain !=0 });
        //  console.log(non_zero_rainSource);
        //function to handl selection of boxes
        function selectBox(Box) {
            //get source
            let ClickedBoxSource = document.getElementById(Box.target.id);
            console.log(ClickedBoxSource);
            if (ClickedBoxSource.classList.contains("selected")) {
                ClickedBoxSource.classList.remove("selected");
            }
            else {
                ClickedBoxSource.classList.add("selected");

                console.log(ClickedBoxSource);
                return ClickedBoxSource;
            }

            // filter data to just source
            // populate graph with just that points of that source
            // use same code for scatteplot just with filtered data
            //user clicks box
        }


        //add listener to all Boxes
        FRAME2.selectAll(".box").on("click", selectBox);
        //enter Handles appending new points to graph
        function enterPoints(data) {
            //new graph 
            const X_MAX = d3.max(data, (d) => { return parseInt(d.rain); });
            console.log(X_MAX)
            const X_SCALE = d3.scaleLinear()
                .domain([0, X_MAX + 1])
                .range([0, VIS_WIDTH]);
            const Y_MAX = d3.max(data, (d) => { return parseInt(d.price); })
            console.log(Y_MAX)
            const Y_SCALE = d3.scaleLinear()
                .domain([0, Y_MAX + 1])
                .range([VIS_HEIGHT, 0]);
            const Scattercolor1 = d3.scaleOrdinal()
                .domain(["Back Bay", "Beacon Hill", "Boston University", "Fenway", "Financial District", "Haymarket Square", "North End", "Northeastern University", "South Station", "Theatre District", "West End"])
                .range(["#2e8b57", "#ff7f50", "#40e0d0", "#bc8f8f", "#008b8b", "#663399", "#d2b48c", "#9acd32", "#4b008", "#808000", "#cd853f"])
            FRAME4.selectAll(".point")
                .data(data)
                .enter().append("path")
                .attr("class", "point")
                .append("circle")
                .attr("id", (d) => { return "(" + d.rain + "," + d.price + ")"; })
                .attr("cx", (d) => { return (MARGINS.left + X_SCALE(d.rain)); })
                .attr("cy", (d) => { return (MARGINS.top + Y_SCALE(d.price)); })
                .attr("r", 1)
                .style("fill", function (d) { return Scattercolor1(d.source) })
                .attr("class", "point");
            // make the x_axis 
            FRAME4.append("g")
                .attr("transform", "translate(" + MARGINS.left + "," + (VIS_HEIGHT + MARGINS.top) + ")")
                .call(d3.axisBottom(X_SCALE).ticks(20))
                .attr("font-size", "10px")
            // make the Y-axis 
            FRAME4.append("g")
                .attr("transform", "translate(" + MARGINS.left + "," + MARGINS.top + ")")
                .call(d3.axisLeft(Y_SCALE).ticks(20))
                .attr("font-size", "10px");
        }

        //function removes points that are no longer needed
        function exitPoints(data) {
            FRAME4.selectAll(".point")
                .data(data)
                .exit()
                .remove();
        }
        // update existing values based on change in data
        function updatePoints(data) {
            FRAME4.selectAll("points")
                .data(data)
                .transition()
                .attr("transform", function (d) { return "translate(" + MARGINS.left + "," + (VIS_HEIGHT + MARGINS.top) + ")" })

        }

        //change entire scatterplot when selection changes -- updates points, adds points, removes non neededpoints
        selectBox.onChange = function (e) {
            const source = selectBox(e);
            const newData = getFilteredData(data, source);
         
            updatePoints(newData);
            enterPoints(newData);
            exitPoints(newData);
        }

        //ToolTip
        const ToolTip = d3.select(("#right"))
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

        const allGroup = new Set(data.map(d => d.destination))
        // add the options to the button
        d3.select("#selectButton")
            .selectAll('myOptions')
            .data(allGroup)
            .enter()
            .append('option')
            .text(function (d) { return d; }) // text showed in the menu
            .attr("value", function (d) { return d; }) // corresponding value returned by the button
        const myColor = d3.scaleOrdinal()
            .domain(allGroup)
            .range(d3.schemeSet2);
        // Add X axis 
         const x = d3.scaleLinear()
                .domain(d3.extent(data, function(d) { return d.rain; }))
                .range([ 0, VIS_WIDTH ]);
        FRAME4.append("g")
                .attr("transform", "translate(" + MARGINS.left + "," + (VIS_HEIGHT + MARGINS.top) + ")")
                .call(d3.axisBottom(x).ticks(20));
        // Add Y axis
        const y = d3.scaleLinear()
                    .domain([0, d3.max(data, function(d) { return +d.price; })])
                    .range([VIS_HEIGHT, 0 ]);
        FRAME4.append("g")
                .attr("transform", "translate(" + MARGINS.left + "," + MARGINS.top + ")")
                .call(d3.axisLeft(y));
        const Scattercolor1 = d3.scaleOrdinal()
                            .domain(["Back Bay", "Beacon Hill", "Boston University", "Fenway", "Financial District", "Haymarket Square", "North End", "Northeastern University", "South Station", "Theatre District", "West End"])
                            .range(["#2e8b57", "#ff7f50", "#40e0d0", "#bc8f8f", "#008b8b", "#663399", "#d2b48c", "#9acd32", "#4b008", "#808000", "#cd853f"]);
         // append all the points that are read in from the file 
        const Frame4Points = FRAME4.selectAll("points")
                                    .data(data.filter(function(d){return d.destination=="Northeastern University"}))
                                    .enter()
                                    .append('g')
                                    .append("circle")
                                    .attr("id", (d) => { return "(" + d.rain + "," + d.price + ")"; })
                                    .attr("cx", (d) => { return (MARGINS.left + x(d.rain)); })
                                    .attr("cy", (d) => { return (MARGINS.top + y(+d.price)); })
                                    .attr("r", 1) 
                                    .style("fill", function (d) { return myColor("Northeastern University") })
                                    .attr("id", (d) => {return d.source})
                                    .attr("class", "point");

        // A function that update the chart
        function update(selectedGroup) {

        // Create new data with the selection
        const dataFilter = data.filter(function(d){return d.destination==selectedGroup})

        // Give these new data to update line
        Frame4Points
            .data(dataFilter)
            .transition()
            .attr("id", (d) => { return "(" + d.rain + "," + d.price + ")"; })
            .attr("cx", (d) => { return (MARGINS.left + x(d.rain)); })
            .attr("cy", (d) => { return (MARGINS.top + y(+d.price)); })
            .attr("r", 1)
            .attr("stroke", function(d){ return Scattercolor1(selectedGroup) })
    }

        // When the button is changed, run the updateChart function
        d3.select("#selectButton").on("change", function(event,d) {
            // recover the option that has been chosen
            const selectedOption = d3.select(this).property("value")
            // run the updateChart function with this selected option
            update(selectedOption)
     })        

    });


    // Drawing the map of Boston
    let projection = d3.geoMercator()
        .scale(200000)
        .precision(.1)
        .center([-71.06161620932242, 42.361975036613735])
        .translate([MAP_WIDTH / 2, MAP_HEIGHT / 2]);

    let path = d3.geoPath()
        .projection(projection);

    let svg = d3.select("#left").append("svg")
        .attr("width", MAP_WIDTH)
        .attr("height", MAP_HEIGHT);
    let g = svg.append("g");
    // Load world shape
    d3.json("data/Boston.json")
        .then(data => {
            /*
            data.features = data.features.filter( function(d){return d.properties.name=="USA"} );
            // console.log(data.features);
            */

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
                .attr("cx", function (d) { return projection([d.long, d.lat])[0] })
                .attr("cy", function (d) { return projection([d.long, d.lat])[1] })
                .attr("r", 4)
                .attr("class", "circle")
                .attr("id", (d) => { return d.name });

        });


}

buildPlots();


const margin = { top: 20, right: 20, bottom: 30, left: 50 };
const width = 960 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

// parse the date / time
let parseTime = d3.timeParse("%y-%b-%d");

// set the ranges
let x = d3.scaleTime().range([0, width]);
let y = d3.scaleLinear().range([height, 0]);

// define the area
let area = d3.area()
    .x(function (d) { return x(d.date); })
    .y0(height)
    .y1(function (d) { return y(d.price); });


const FRAME3 = d3.select("#timeline")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")")
    .attr("class", "frame");

/*
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

}); */