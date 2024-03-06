const gasDropdown = document.getElementById('GasDropdown');
gasDropdown.addEventListener('change', function() {

    const selectedValue = this.value;
    console.log(selectedValue); // Check the value for 'diesel'
    if (selectedValue === 'diesel') {
        window.location.href = "/";  
    } else if (selectedValue === 'regular') {
    window.location.href = "index2.html"; 
  } 
  else if (selectedValue === 'premium') {
    window.location.href = "index3.html"; 
  } 
  else if (selectedValue === 'heating') {
    window.location.href = "index4.html"; 
  } 
});