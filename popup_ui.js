const date = document.getElementById('date');
const autofill = document.getElementById("autofill")
const autofillSubmit = document.getElementById("autofillSubmit")
const autofillDataViewer = document.getElementById("autofillDataViewer")

let autofillData = {};

function initializeSettings(){
  log("Restoring settings");
  getSettings( settings => {
    date.value = settings.date;
    autofillData.value = settings.autofillData
    updateAutofillDataViewer()
  });
};
  
function updateSettings(){
  getSettings( settings => {
    settings.date = date.value;
    settings.autofillData=autofillData;
    setSettings(settings);
    log(`settings ${settings}`);
    
  });
}


document.addEventListener('DOMContentLoaded', initializeSettings);
date.addEventListener('change', updateSettings);
autofillSubmit.addEventListener("click",loadData);

// log(date.value,autofillSubmit,autofillDataViewer,autofill);