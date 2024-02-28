
_settings = { date: '01/01/2024',theme:"dark",overwriteOnAutofill:false}


function getSettings(key){
  return _settings[key]
}

function setSettings(key,value){
  _settings[key] = value
  chrome.storage.sync.set({key: value}, () => {});
};

function initializeSettings(){
  for (k in ["date","theme","overwriteOnAutofill"]){
    chrome.storage.sync.get(k, (v)=>{
      _settings[k]=v;
    })
  } 
}

initializeSettings()