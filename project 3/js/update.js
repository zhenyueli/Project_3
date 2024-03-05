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
  // Update the axis 
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
    
    svg.selectAll("g.y-axis text") 
    .each(function(d) {
        console.log("Y-Axis Label:", d, this); 
    })
    .text(d => d); 
     // Update y-axis gridlines
     yAxisGroup.call(d3.axisLeft(yScale).tickSizeOuter(0).tickFormat(""));          // Update y-gridlines
    
    

  // Data Points (with Clearing) 
  svg.selectAll(".data-point").remove(); // Clear old points
  svg.selectAll(".data-point") 
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "data-point") 
      .attr("cx", d => xScale(monthMap[d.month]) + xScale.bandwidth() / 2) 
      .attr("cy", yScale(0)) // Start from the bottom
      .transition()
      .duration(500) // 500ms transition
      .attr("cy", d => yScale(d.value)) 
      .attr("r", 5) 
    .attr("fill",  d => colorScale(d.date.getFullYear().toString())); 
  
     
 
  // Update Geography Label (with Clearing) 
  svg.selectAll("text.geography-label").remove(); // Remove old label
  svg.append("text")
      .attr("class", "geography-label") // Add a class
      .attr("x", width / 2) 
      .attr("y", 15)
      .attr("text-anchor", "middle") 
      .text(`Geography: ${key0Data['\ufeffGeography']}`);
      const textData = format_data_as_text(filteredData);

      // Return the formatted text   
      return textData;  
      function format_data_as_text(data) {
        return data.map(entry => `Month: ${entry.month}  Value: ${entry.value}`).join('\n'); 
      }
    }