// 1: SET GLOBAL VARIABLES
const margin = { top: 50, right: 30, bottom: 60, left: 70 };
const width = 900 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// Create SVG containers for both charts
const svgLine = d3.select("#lineChart") // If you change this ID, you must change it in index.html too
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
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
        d.avgTemp = +d.actual_mean_temp;
    });

    const fullMonth = ["January", "February", "March", "April", "May", "June", "July", "August","September", "October", "November", "December"];

    const groupedData = d3.group(data, d => d.city, d => d.year, d => d.month);

    const cityMonthlyAverages = Array.from(
        d3.group(data, d => d.city, d => d.year, d => d.month),
        ([city, years]) => Array.from(years, ([year, months]) => 
            Array.from(months, ([month, days]) => ({
                city,
                year,
                month,
                avgTemp: d3.mean(days, d => d.avgTemp),
                monthName: fullMonth[month - 1]
            }))
        ).flat(2)
    );

    console.log("Monthly Averages:", cityMonthlyAverages);

    // 3.a: SET SCALES FOR CHART 1
    const xScale = d3.scaleLinear()

    const yScale = d3.scaleLinear()


    // 4.a: PLOT DATA FOR CHART 1


    // 5.a: ADD AXES FOR CHART 1


    // 6.a: ADD LABELS FOR CHART 1


    // 7.a: ADD INTERACTIVITY FOR CHART 1
    

});