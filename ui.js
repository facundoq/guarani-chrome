const date = document.getElementById('date');

function initializeSettings(){
  console.log("Restoring settings");
  getSettings( settings => {
    date.value = settings.date;
  });
};
  



function updateSettings(){
  getSettings( settings => {
    settings.date = date.value;
    setSettings(settings);
    console.log(`settings ${settings}`)
  });
  
}


document.addEventListener('DOMContentLoaded', initializeSettings);
document.getElementById('date').addEventListener('change', updateSettings);


