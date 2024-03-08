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