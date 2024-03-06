d3.json('/GAS').then(response => {
    const dataSlider = document.getElementById('dataSlider');
    const monthMap = {
      'Jan': 'Jan',
      'Feb': 'Feb',
      'Mar': 'Mar',
      'Apr': 'Apr',
      'May': 'May',
      'Jun': 'Jun',
      'Jul': 'Jul',
      'Aug': 'Aug',
      'Sep': 'Sep',
      'Oct': 'Oct',
      'Nov': 'Nov',
      'Dec': 'Dec',
    };
    // --- SVG Setup (do this only once)---
    const width = 800, height = 400, margin = { top: 90, right: 40, bottom: 50, left: 70 };
    const svg = d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);  
  
    // Scales
    const xScale = d3.scaleBand().range([0, width]);
    const yScale = d3.scaleLinear().range([height, 0]).domain([80, 200]); // Initial domain
  
    // Color Scale 
    const colorScale = d3.scaleOrdinal()
      .domain(['2018', '2019', '2020', '2021', '2022', '2023'])
      .range(['blue', 'red', 'green', 'orange', 'purple', 'cyan']);
  
    // Axes (created once)
    let xAxisGroup = svg.append("g") 
      .attr("transform", `translate(0, ${height})`)
      .attr("class", "axis"); 
  
    let yAxisGroup = svg.append("g") // Create the yAxisGroup here
      .attr("class", "gridlines y-axis"); 
  
    // Axis Labels
    svg.append("text") // x-axis label
      .attr("x", width / 2)
      .attr("y", height + margin.bottom - 5)
      .attr("text-anchor", "middle")
      .text("Month");
  
    svg.append("text") // y-axis label
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("text-anchor", "middle")
      .text("Disel Price"); 
  
    function monthSort(pair1, pair2) {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthIndex1 = months.indexOf(pair1); 
        const monthIndex2 = months.indexOf(pair2);
        return monthIndex1 - monthIndex2;
      }
  
      function updateChart(keyIndex) {
        const key0Data = response[keyIndex];
        const allKeys = Object.keys(key0Data).filter(key => key !== '\ufeffGeography');
        console.clear();
        // Data Extraction Logic
        const data = Object.entries(key0Data)
          .filter(([key]) => key !== '\ufeffGeography')
          .map(([key, value]) => {
            const [year, month] = key.split('-');  
            const fullYear = '20' + year; 
      
            // Explicit Parsing (Adjust for "yy-MMM" format)
            const date = new Date(`${fullYear}-${month}-01`); 
      
            // Date Validation
            if (isNaN(date.getTime())) {  
              console.error("Invalid date:", key); 
              return null; // Exclude invalid data points
            }
            return { month: date.toLocaleString('default', { month: 'short' }), value: +value, date: date }; 
          })
          .filter(Boolean); 
      
        // Update Scales
        const uniqueMonths = data.map(d => monthMap[d.month]).sort(monthSort); 
        xScale.domain(uniqueMonths); 
        const dataMin = d3.min(data, d => d.value);
        const dataMax = d3.max(data, d => d.value);
        const buffer = 0.15 * (dataMax - dataMin);  
        yScale.domain([dataMin - buffer, dataMax + buffer]);
      
        // Update the axis 
        xAxisGroup.call(d3.axisBottom(xScale)) 
        .selectAll("text")   
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end")
        .text(d => d);
        console.log("Before Update:", svg.selectAll("g.y-axis")); //new
        svg.select("g.y-axis").selectAll("*").remove();
        svg.select("g.y-axis").remove();//new
        // Gridlines
        xAxisGroup.append("g") 
          .call(d3.axisBottom(xScale).tickSizeOuter(0).tickFormat(""))
          .attr("class", "gridlines");
        svg.append("g") 
          .call(d3.axisLeft(yScale).tickSizeOuter(0).tickFormat("")) 
          .attr("class", "gridlines y-axis");
          
          svg.selectAll("g.y-axis text") 
          .each(function(d) {
              console.log("Y-Axis Label:", d, this); 
          })
          .text(d => d); 
           // Update y-axis gridlines
          yAxisGroup.call(d3.axisLeft(yScale).tickSizeOuter(0).tickFormat("")); // Update y-gridlines
          console.log("After Update:", svg.selectAll("g.y-axis")); //new
          
          
      
        // Data Points (with Clearing) 
        svg.selectAll(".data-point").remove(); // Clear old points
        svg.selectAll(".data-point") 
            .data(data)
            .enter()
            .append("circle")
            .attr("class", "data-point") 
            .attr("cx", d => { // <-- Modify this line
              console.log(d, xScale(d.date)); 
              return xScale(monthMap[d.month]) + xScale.bandwidth() / 2; // Corrected version 
            }) 
          .attr("cy", d => yScale(d.value)) 
          .attr("r", 5) 
          .attr("fill", d => {
            return colorScale(d.date ? d.date.getFullYear().toString() : 'unknown');
          }) 
      
        // Update Geography Label (with Clearing) 
        svg.selectAll("text.geography-label").remove(); // Remove old label
        svg.append("text")
            .attr("class", "geography-label") // Add a class
            .attr("x", width / 2) 
            .attr("y", -8)
            .attr("text-anchor", "middle") 
            .text(`Geography: ${key0Data['\ufeffGeography']}`);
      }
      
      dataSlider.addEventListener('input', () => {
        currentIndex = dataSlider.value; 
        updateChart(currentIndex); 
      });
      
  
    updateChart(0); // Initial call 


 // Data Points Hover Effects
 svg.selectAll(".data-point")
 .on("mouseenter", function (event, d) {
     d3.select(this)
         .attr("r", 8)
         .style("fill", "black");
 
     svg.append("text")
         .attr("class", "data-point-popup")
         .attr("x", xScale(monthMap[d.month]) + xScale.bandwidth() / 2)
         .attr("y", yScale(d.value) - 20)
         .attr("text-anchor", "middle")
         .text(`${d.value},  Date:${d.date.toLocaleString('default', { month: 'short' })}/${d.date.getFullYear().toString().slice(-2)}`)
         .style("font-weight", "bold");
 })
 .on("mouseleave", function (event, d) {
     d3.select(this)
         .attr("r", 5)
         .style("fill", d => colorScale(d.date ? d.date.getFullYear().toString() : 'unknown'));
 
     svg.select(".data-point-popup").remove();
 });
 

   
// Legend
const legend = svg.append("g")
.attr("class", "legend")
.attr("transform", `translate(${width - margin.right}, ${margin.top})`);

const legendRectSize = 18;
const legendSpacing = 4;

const legendEntries = legend.selectAll(".legend-entry")
.data(colorScale.domain())
.enter().append("g")
.attr("class", "legend-entry")
.attr("transform", (d, i) => `translate(0, ${i * (legendRectSize + legendSpacing)})`);

legendEntries.append("rect")
.attr("x", 0)
.attr("y", 0)
.attr("width", legendRectSize)
.attr("height", legendRectSize)
.style("fill", colorScale);

legendEntries.append("text")
.attr("x", legendRectSize + legendSpacing)
.attr("y", legendRectSize - legendSpacing)
.text(d => d)
.style("font-size", "12px");

})
