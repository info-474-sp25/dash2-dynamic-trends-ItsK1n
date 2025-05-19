// 1: SET GLOBAL VARIABLES
const margin = { top: 50, right: 30, bottom: 60, left: 70 };
const width = 900 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// Create SVG containers for both charts
const svgLine = d3.select("#lineChart") // If you change this ID, you must change it in index.html too
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// (If applicable) Tooltip element for interactivity
// const tooltip = ...

// 2.a: LOAD...
d3.csv("weather.csv").then(data => {
    // 2.b: ... AND TRANSFORM DATA
    console.log("Original Data:", data);
    data.forEach(d => {
        d.year = new Date(d.date).getFullYear();
        d.month = new Date(d.date).getMonth() + 1;
        d.day =  new Date(d.date).getDate();
        d.avgTemp = +d.actual_mean_temp;
    });

    console.log("Updated Data:", data);

    const fullMonth = ["January", "February", "March", "April", "May", "June", "July", "August","September", "October", "November", "December"];

    const groupedData = d3.group(data, d => d.city, d => d.year, d => d.month);

    const cityMonthlyAverages = Array.from(
        groupedData,
        ([city, years]) => Array.from(years, ([year, months]) => 
            Array.from(months, ([month, days]) => ({
                city,
                year,
                month,
                avgTemp: d3.mean(days, d => d.avgTemp),
                monthName: fullMonth[month - 1]
            }))
        ).flat()
    ).flat();


    console.log("Monthly Averages:", cityMonthlyAverages);

    // 3.a: SET SCALES FOR CHART 1
    const xScale = d3.scaleBand()
        .domain(fullMonth)
        .range([0, width])
        .padding(0.1);

    const yScale = d3.scaleLinear()
        .domain([10, d3.max(cityMonthlyAverages, d => d.avgTemp)])
        .range([height, 0]);

    const cities = Array.from(new Set(cityMonthlyAverages.map(d => d.city)));

    const colorScale = d3.scaleOrdinal()
        .domain(cities)
        .range(d3.schemeCategory10);


    // 4.a: PLOT DATA FOR CHART 1
    const line = d3.line()
        .x(d => xScale(d.monthName) + xScale.bandwidth() / 2)
        .y(d => yScale(d.avgTemp));

    cities.forEach(city => {
        const cityData = cityMonthlyAverages
            .filter(d => d.city === city)
            .sort((a, b) => a.month - b.month);

        svgLine.append("path")
            .datum(cityData)
            .attr("d", line)
            .attr("stroke", colorScale(city))
            .attr("fill", "none")
            .attr("stroke-width", 2);
    });
        

    // 5.a: ADD AXES FOR CHART 1
    svgLine.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(xScale).tickSizeOuter(0)); ;

    svgLine.append("g")
        .call(d3.axisLeft(yScale));


    // 6.a: ADD LABELS FOR CHART 1
    // X-axis Label
    svgLine.append("text")
        .attr("class", "axis-label")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom)
        .attr("text-anchor", "middle")
        .text("Month");

    // Y-axis Label
    svgLine.append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -margin.left + 15)
        .attr("text-anchor", "middle")
        .text("Average Temperature (°F)");

    // Legend
    const legend = svgLine.selectAll(".legend")
        .data(cities)
        .enter()
        .append("g")
        .attr("class", "legend")
        .attr("transform", (d, i) => `translate(${width - 100}, ${i * 16 - 20})`);

    // Add colored squares
    legend.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 12)
        .attr("height", 12)
        .style("fill", d => colorScale(d));

    // Add city labels
    legend.append("text")
        .attr("x", 15)
        .attr("y", 10)
        .text(d => d)
        .style("font-size", "10px")
        .style("fill", "#333");

    // 7.a: ADD INTERACTIVITY FOR CHART 1


});