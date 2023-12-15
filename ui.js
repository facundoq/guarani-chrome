const date = document.getElementById('date');

function initializeSettings(){
  console.log("Restoring settings");
  getSettings( settings => {
    date.value = settings.date;
  });
};
  


function updateSettings(){
  setSettings({ date: date.value});
}


  document.addEventListener('DOMContentLoaded', initializeSettings);
  document.getElementById('date').addEventListener('change', updateSettings);
