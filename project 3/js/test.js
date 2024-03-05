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
  const width = 800, height = 400, margin = { top: 20, right: 40, bottom: 30, left: 80 };
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

  let yAxisGroup = svg.append("g") 
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
    console.clear();
    console.log("selectedYear:", selectedYear);

    // Data Extraction Logic
    console.log("Array keys from /GAS:", Object.keys(response));
    const data = Object.entries(key0Data)
      .filter(([key]) => key !== '\ufeffGeography')
      .map(([key, value]) => {
        const [year, month] = key.split('-');  
        const fullYear = '20' + year; 

        // Explicit Parsing (Adjust for "yy-MMM" format)
        const date = new Date(`${fullYear}-${month}-01`); 
        console.log("date", date)

        // Date Validation
        if (isNaN(date.getTime())) {  
          console.error("Invalid date:", key); 
          return null; // Exclude invalid data points
        }
        return { month: date.toLocaleString('default', { month: 'short' }), value: +value, date: date }; 
      })
      .filter(Boolean); 

    // Filter by Year
    const filteredData = selectedYear === 'all' ? data : data.filter(entry => {
      const [year, ] = entry.key.split('-');
      return year === selectedYear; 
    });

    // Update Scales
    const uniqueMonths = data.map(d => monthMap[d.month]).sort(monthSort); 
    xScale.domain(uniqueMonths); 
    const dataMin = d3.min(data, d => d.value);
    const dataMax = d3.max(data, d => d.value);
    const buffer = 0.15 * (dataMax - dataMin);  
    yScale.domain([dataMin - buffer, dataMax + buffer]);

    // Update the axes 
    xAxisGroup.call(d3.axisBottom(xScale)) 
      .selectAll("text")   
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end")
      .text(d => d);
    svg.select("g.y-axis").selectAll("*").remove();
    svg.select("g.y-axis").remove();//new
    // Gridlines
    xAxisGroup.append("g") 
      .call(d3.axisBottom(xScale).tickSizeOuter(0).tickFormat(""))
      .attr("class", "gridlines");
    svg.append("g") 
      .call(d3.axisLeft(yScale).tickSizeOuter(0).tickFormat("")) 
      .attr("class", "gridlines y-axis");

    // Data Points (with Clearing) 
    svg.selectAll(".data-point").remove(); // Clear old points
    svg.selectAll(".data-point") 
      .data(filteredData) // Use filteredData here 
      .enter()
      .append("circle")
      .attr("class", "data-point") 
      .attr("cx", d => xScale(monthMap[d.month]) + xScale.bandwidth() / 2) 
      .attr("cy", yScale(0)) // Start from the bottom
      .transition()
      .duration(500) // 500ms transition
      .attr("cy", d => yScale(d.value)) 
      .attr("r", 5) 
      .attr("fill",  d => colorScale(d.date.getFullYear().toString())); 

    // Update Geography Label (with Clearing) 
    svg.selectAll("text.geography-label").remove(); // Remove old label
    svg.append("text")
      .attr("class", "geography-label") // Add a class
      .attr("x", width / 2) 
      .attr("y", 15)
      .attr("text-anchor", "middle") 
      .text(`Geography: ${key0Data['\ufeffGeography']}`);

    // Find Matching Entry
    const matchingEntry = filteredData.find(d => d.date.getFullYear().toString() === selectedYear);

    // Output to results div 
    const result = document.getElementById('results');
    if (matchingEntry) {
      result.textContent = format_data_as_text(matchingEntry); 
    } else {
      result.textContent = "No data found for selected year";
    }
  }

  function format_data_as_text(entry) {
    return `Month: ${entry.month}  Value: ${entry.value}`;  
  }

  // Event Listeners
  dataSlider.addEventListener('input', () => {
    currentIndex = dataSlider.value; 
    updateChart(currentIndex); 
  });

  // Attach an event listener to the year dropdown
  const yearFilter = document.getElementById('yearFilter');
  yearFilter.addEventListener('change', function() {
    const selectedYear = this.value;
    updateChart(currentIndex); 
  }); 

  updateChart(0); // Initial call 
});
