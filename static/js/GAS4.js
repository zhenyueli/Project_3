d3.json('/GAS4').then(response => {
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
  const graphContainer = document.getElementById('graph-container'); // Select the container

  const width = 800, height = 400, margin = { top: 20, right: 40, bottom: 30, left: 80 };
  const svg = d3.select(graphContainer).append("svg")
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
    .range(['blue', 'red', 'green', 'orange', 'purple', 'teal']);

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
    .text("House Hold heating Price (prices in cents per litre)"); 

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
      const hasInValidData = Object.entries(key0Data)
        .filter(([key]) => key !== '\ufeffGeography')
        .some(([key, value]) => value === ".."); // Add this condition
      if (hasInValidData) { 
        // Handle scenario where all values are empty 
        const geography = key0Data['\ufeffGeography'];
      
        // Display error message
        const messageDiv = document.getElementById('error');
        messageDiv.textContent = `Error: No valid data found for ${geography}`;
        
      }else {
        const messageDiv = document.getElementById('error');
        messageDiv.textContent = ''; // Clear the error message
      }

      // Data Extraction Logic
      console.log("Array keys from /GAS4:", Object.keys(response));
      const data = Object.entries(key0Data)
        .filter(([key]) => key !== '\ufeffGeography')
        .map(([key, value]) => {
          const [year, month] = key.split('-');  
          const fullYear = '20' + year; 
    
          // Explicit Parsing (Adjust for "yy-MMM" format)
          const date = new Date(`${fullYear}-${month}-01`); 
    
          // Date Validation
          if (isNaN(date.getTime())) {  
          
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
          .attr("cx", d => {
            console.log(d, xScale(d.date)); 
            return xScale(monthMap[d.month]) + xScale.bandwidth() / 2; 
          }) 
        .attr("cy", d => yScale(d.value)) 
        .attr("r", 5) 
        .attr("fill", d => {
          return colorScale(d.date ? d.date.getFullYear().toString() : 'unknown');
        }) 
    
      // Update Geography Label (with Clearing) 
      svg.selectAll("text.geography-label").remove(); // Remove old label
      svg.append("text")
          .attr("class", "geography-label") 
          .attr("x", width / 2) 
          .attr("y", 15)
          .attr("text-anchor", "middle") 
          .text(`Geography: ${key0Data['\ufeffGeography']}`);

          const dataDisplay = document.getElementById('dataDisplay');
          dataDisplay.innerHTML = ''; // Clear existing content
          data.sort((pointA, pointB) => monthSort(pointA.month, pointB.month));
          data.forEach(point => {
            const columnDiv = document.createElement('div');
            columnDiv.classList.add('data-column');
        
            // Get the color based on the year
            const year = point.date.getFullYear().toString();
            const color = colorScale(year);
        
            columnDiv.innerHTML = `
              <b style="color: ${color}">Month:</b> ${point.month} <br>
              <b style="color: ${color}">Value:</b> ${point.value} <br>
              <b style="color: ${color}">Year:</b> ${point.date.getFullYear()} 
            `;
            dataDisplay.appendChild(columnDiv);
          });
          const geography = key0Data['\ufeffGeography'];
          const geoDiv = document.getElementById('geo'); 
          geoDiv.textContent = geography;
    }
    
    dataSlider.addEventListener('input', () => {
      currentIndex = dataSlider.value; 
      updateChart(currentIndex); 
    });
    const colorBoxes = document.querySelectorAll(".legend .color-box");

    colorBoxes.forEach((box, index) => {
      const year = colorScale.domain()[index];
      box.style.backgroundColor = colorScale(year); 
    });

  updateChart(0); // Initial call 
});