


d3.json('/GAS').then(response => {
    // Access the object within key '0' and check its validity
    const key0Data = response['0'];
    if (!key0Data || typeof key0Data !== "object") {
      console.error("Key 0 does not exist or is not an object.");
      return;
    }
  
    // Define date range criteria
    const startDate = new Date(2018, 0, 1); 
    const endDate = new Date(2024, 0,  1); 
  
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
  
            if (yearInt >= 2018 && yearInt <= 2023) {
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
  
    // Define chart dimensions and margins
    const width = 800;
    const height = 400;
    const margin = { top: 20, right: 40, bottom: 30, left: 20 };
  
    // Create SVG element
    const svg = d3.select("body")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
    // Define scales
    const xScale = d3.scaleTime()
      .domain([d3.min(data, d => d.date), d3.max(data, d => d.date)])
      .range([0, width]);
  
    const yScale = d3.scaleLinear()
      .domain([50, 300])
      .range([height, 0]);
  
    // Color scale for years
    const colorScale = d3.scaleOrdinal()
      .domain(['2018', '2019', '2020', '2021', '2022', '2023'])
      .range(['blue', 'red', 'green', 'orange', 'purple', 'cyan']);
  
    // Add X-axis
    svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(xScale)
             .ticks(d3.timeYear.every(1))  
             .tickFormat(d3.timeFormat('%Y'))); 
  
    // Add Y-axis
    svg.append("g")
      .call(d3.axisLeft(yScale)); 
  
    // Add data points with labels
    svg.selectAll(".data-point")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "data-point")
      .attr("cx", d => xScale(d.date))
      .attr("cy", d => yScale(d.value))
      .attr("r", 5)
      .attr("fill", d => colorScale(d.date.getFullYear().toString()))
      .on("mouseover", function(event, d) { 
          // Tooltip display
          tooltip.transition()
            .duration(200) 
            .style("opacity", 0.9);
  
          tooltip.html(`${d.date.toLocaleDateString()} - ${d.value}`) 
            .style("left", (event.pageX + 10) + "px") 
            .style("top", (event.pageY - 20) + "px"); 
      }) 
      .on("mouseout", function(event) { 
          tooltip.transition()
            .duration(500) 
            .style("opacity", 0);
      }); 
  
    // Add label for geography
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", 15)
      .attr("text-anchor", "middle")
      .text(`Geography: ${geography}`); 
  
    // Tooltip Setup 
    const tooltip = d3.select("body")
      .append("div") 
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("opacity", 0); 
  });
  




