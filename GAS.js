d3.json('/GAS').then(response => {
    const dataSlider = document.getElementById('dataSlider');
  
    function updateChart(keyIndex) {
      const key0Data = response[keyIndex];
  
      // Data Extraction (with validation)
      const data = Object.entries(key0Data)
        .filter(([key, value]) => key !== '\ufeffGeography')
        .map(([key, value]) => {
          const date = new Date(key);
          const year = date.getFullYear();
          return (date.getMonth() >= 0 && year >= 2018 && year <= 2023) ?
            { date, value: +value } :  // +value ensures numerical conversion
            null;
        })
        .filter(Boolean); // Remove null values
  
      // SVG Setup (assuming it doesn't need frequent changes)
      const width = 800, height = 400, margin = { top: 20, right: 40, bottom: 30, left: 20 };
      const svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
      // Scales
      const xScale = d3.scaleTime().domain(d3.extent(data, d => d.date)).range([0, width]);
      const yScale = d3.scaleLinear().domain(d3.extent(data, d => d.value)).range([height, 0]);
  
      // Color Scale 
      const colorScale = d3.scaleOrdinal()
        .domain(['2018', '2019', '2020', '2021', '2022', '2023'])
        .range(['blue', 'red', 'green', 'orange', 'purple', 'cyan']);
  
      // Axes (created once)
      svg.append("g") 
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(xScale).ticks(d3.timeYear).tickFormat(d3.timeFormat('%Y'))); 
      svg.append("g").call(d3.axisLeft(yScale));
  
      // Data Points
      svg.selectAll(".data-point").remove(); 
      svg.selectAll(".data-point") 
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "data-point") 
        .attr("cx", d => xScale(d.date)) 
        .attr("cy", d => yScale(d.value)) 
        .attr("r", 5) 
        .attr("fill", d => colorScale(d.date.getFullYear().toString()));
  
      // Geography Label 
      svg.append("text")
        .attr("x", width / 2)
        .attr("y", 15)
        .attr("text-anchor", "middle")
        .text(`Geography: ${key0Data['\ufeffGeography']}`); 
    }
  
    updateChart(0); // Initial render
    dataSlider.addEventListener('input', () => updateChart(dataSlider.value));
  });