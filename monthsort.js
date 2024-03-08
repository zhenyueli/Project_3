function monthSort(pair1, pair2) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthIndex1 = months.indexOf(pair1); 
    const monthIndex2 = months.indexOf(pair2);
    return monthIndex1 - monthIndex2;
  }