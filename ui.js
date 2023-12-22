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

function updateAutofillDataViewer(){
  if (autofillData){
    autofillDataViewer.innerHTML=`Data loaded correctly, ${autofillData.size} rows:\n ${autofillData.toString()}`;
  }else{
    autofillDataViewer.innerHTML = "No data loaded"
  }
}


function loadData(){
  
  autofillDataViewer.value = "Cargando...";
  const data = autofill.value;
  autofill.value=""
  try{
    
    const [rows,header] = parseCSV(data);
    const key = "dni";
    if (!header.includes(key)){
      throw new CSVParseError(`Missing ${key} in header row, found header: ${header}`);
    }
    autofillData = listOfDictToDictOfDict(rows,key);
    updateAutofillDataViewer();
    updateSettings()
  }catch(error){
    autofillData = new Map();
    autofillDataViewer.innerHTML=`Error parsing csv: \n<br/><br/> ${error.message}\n\n <br/><br/> Full error stack: \n${error.stack}\n`;
    throw error
  }
}

document.addEventListener('DOMContentLoaded', initializeSettings);
date.addEventListener('change', updateSettings);
autofillSubmit.addEventListener("click",loadData);

// log(date.value,autofillSubmit,autofillDataViewer,autofill);