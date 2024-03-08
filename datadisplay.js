data.sort((pointA, pointB) => monthSort(pointA.month, pointB.month));
const dataDisplay = document.getElementById('dataDisplay');
dataDisplay.innerHTML = ''; // Clear existing content

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
  dataDisplay.appendChild(columnDiv); })