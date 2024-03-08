 // Data Extraction Logic
 console.log("Array keys from /GAS:", Object.keys(response));
 const data = Object.entries(key0Data)
   .filter(([key]) => key !== '\ufeffGeography')
   .map(([key, value]) => {
     const [year, month] = key.split('-');  
     const fullYear = '20' + year; 
     console.log("Original value:", value, typeof value); 
     // Explicit Parsing (Adjust for "yy-MMM" format)
     const date = new Date(`${fullYear}-${month}-01`); 

     // Date Validation
     if (isNaN(date.getTime())) {  
       
       return null; // Exclude invalid data points
     }
     return { month: date.toLocaleString('default', { month: 'short' }), value: +value, date: date }; 
   })
   .filter(Boolean); 
