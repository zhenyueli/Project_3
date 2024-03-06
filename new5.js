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

    // --- SVG Setup ---
    const width = 800, height = 400, margin = { top: 20, right: 40, bottom: 30, left: 20 };
    const svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Scales
    const xScale = d3.scaleBand()
        .range([0, width]);
    const yScale = d3.scaleLinear().range([height, 0]);

    // Color Scale
    const colorScale = d3.scaleOrdinal()
        .domain(['2018', '2019', '2020', '2021', '2022', '2023'])
        .range(['blue', 'red', 'green', 'orange', 'purple', 'cyan']);

    // Axes
    let xAxisGroup = svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .attr("class", "axis");

    svg.append("g")
        .call(d3.axisLeft(yScale));

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
        .text("Gasoline Price");

    // Update function
    function updateChart(keyIndex) {
        const key0Data = response[keyIndex];
        const allKeys = Object.keys(key0Data).filter(key => key !== '\ufeffGeography');

        // Data Extraction Logic
        const data = Object.entries(key0Data)
            .filter(([key, value]) => key !== '\ufeffGeography')
            .map(([key, value]) => {
                const [year, month] = key.split('-');
                const fullYear = '20' + year;

                const date = new Date(`${fullYear}-${month}-01`);

                if (isNaN(date.getTime())) {
                    console.error("Invalid date:", key);
                    return null;
                }
                return { month: date.toLocaleString('default', { month: 'short' }), value: +value, date: date };
            })
            .filter(Boolean);

        const uniqueMonths = data.map(d => monthMap[d.month]).sort(monthSort);
        xScale.domain(uniqueMonths);
        yScale.domain(d3.extent(data, d => d.value));

        // Update the axis
        xAxisGroup.call(d3.axisBottom(xScale))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end")
            .text(d => d);

        
        // Data Points
        svg.selectAll(".data-point").remove();
        svg.selectAll(".data-point")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", "data-point")
            .attr("cx", d => xScale(monthMap[d.month]) + xScale.bandwidth() / 2)
            .attr("cy", d => yScale(d.value))
            .attr("r", 5)
            .attr("fill", d => colorScale(d.date ? d.date.getFullYear().toString() : 'unknown'));

        // Geography Label
        svg.selectAll("text.geography-label").remove();
        svg.append("text")
            .attr("class", "geography-label")
            .attr("x", width / 2)
            .attr("y", 15)
            .attr("text-anchor", "middle")
            .text(`Geography: ${key0Data['\ufeffGeography']}`);
    }

    function monthSort(pair1, pair2) {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthIndex1 = months.indexOf(pair1);
        const monthIndex2 = months.indexOf(pair2);
        return monthIndex1 - monthIndex2;
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
                .attr("y", yScale(d.value) - 10)
                .attr("text-anchor", "middle")
                .text(d.value)
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

        // Next Chart Button
  const nextChartButton = document.getElementById('nextChartButton');
  nextChartButton.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % response.length;
      updateChart(currentIndex);
  });

});
