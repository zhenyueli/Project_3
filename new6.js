d3.json('/GAS').then(response => {
    // Access the object within key '0' and check its validity
    const key0Data = response['4'];
    if (!key0Data || typeof key0Data !== "object") {
      console.error("Key 0 does not exist or is not an object.");
      return;
    }
  
    // Define date range criteria
    const startDate = new Date(2018, 0, 1); 
    const endDate = new Date(2024, 0, 1); 
  
    // Extract data points (handling year-month date format)
    const data = [];
    const geography = key0Data['\ufeffGeography']; 
    for (const property in key0Data) {
      if (property !== '\ufeffGeography' && key0Data.hasOwnProperty(property)) {
        const dateString = property;
        const value = parseFloat(key0Data[property]);
  
        try {
          const parsedDate = new Date(dateString);
          const month = parsedDate.getMonth();
  
          if (month >= 0 && month <= 11) { 
            const year = parseInt(`20${dateString.slice(0, 2)}`); 
            const yearInt = parseInt(year);
  
            if (yearInt === 2018) {
              const date = new Date(yearInt, month); 
              data.push({ date, value }); 
            }
          } else {
            console.error("Invalid month in date string:", dateString);
          }
        } catch (error) {
          console.error("Error parsing date:", error);
        }
      }
    }
  
    // Sort the data by date
    data.sort((a, b) => a.date - b.date); 
  
    // Define chart dimensions and margins
    const width = 800;
    const height = 400;
    const margin = { top: 20, right: 80, bottom: 30, left: 50 };
  
    // Create SVG element
    const svg = d3.select("body")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
    // Define scales 
    const xScale = d3.scaleTime()
      .domain([new Date(2018, 0, 1), new Date(2018, 11, 31)]) 
      .range([0, width]);
  
    const minY = d3.min(data, d => d.value);
    const maxY = d3.max(data, d => d.value);
  
    const yScale = d3.scaleLinear()
      .domain([minY, maxY]) 
      .range([height, 0]);
  
    // Color scale for years (currently only for 2018)
    const colorScale = d3.scaleOrdinal()
      .domain(['2018'])
      .range(['blue']);
  
    // Add X-axis
    svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(xScale)
             .ticks(12) 
             .tickFormat(d3.timeFormat('%b'))); 
  
    // Add Y-axis
    svg.append("g")
      .call(d3.axisLeft(yScale)); 
  
    // Line generator
    const line = d3.line()
      .x(d => xScale(d.date))
      .y(d => yScale(d.value)); 
  
    // Add the line 
    svg.append("g")
       .attr("class", "line-group")
       .append("path")
          .attr("class", "line")
          .attr("d", line(data)) 
           .style("stroke", ('2018')); 

   
  
    // Add circles for data points
    svg.selectAll(".data-point")
       .data(data)
       .enter()
       .append("circle")
          .attr("class", "data-point") 
          .attr("cx", d => xScale(d.date)) 
          .attr("cy", d => yScale(d.value))
          .attr("r", 3) 
          .style("fill", colorScale('2018'))
          .style("opacity", 0.5) 
  
       // Hover Events
       .on("mouseover", function(event, d) {
           d3.select(this)
             .style("opacity", 1)
             .attr("r", 6);  
  
           // Tooltip
           tooltip.transition() 
               .duration(200)   
               .style("opacity", 0.9); 
  
          tooltip.html("Value: " + d.value) 
              .style("left", (event.pageX + 10) + "px")  
              .style("top", (event.pageY - 20) + "px"); 
       })
       .on("mousemove", function(event) { // Add for tooltip positioning
          tooltip.style("left", (event.pageX + 10) + "px")  
              .style("top", (event.pageY - 20) + "px"); 
       })
       .on("mouseout", function(event, d) { 
           d3.select(this)
             .style("opacity", 0.5)
             .attr("r", 3); 
  
          tooltip.transition() 
              .duration(500)    
              .style("opacity", 0); 
       });
  
    // Tooltip Setup (Do this once, outside the loop)
    const tooltip = d3.select("body") 
        .append("div")  
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("opacity", 0); 
  
    // Add legend
    const legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${width - 60}, 10)`); 
  
    legend.append("rect") 
          .attr("x", 0)
          .attr("y", 0) 
          .attr("width", 15)
          .attr("height", 15)
          .style("fill", colorScale('2018'));
  
    legend.append("text")
          .attr("x", 20)
          .attr("y", 12)
          .text('2018')
          .style("font-size", "12px")
          .attr("alignment-baseline", "middle");
  });