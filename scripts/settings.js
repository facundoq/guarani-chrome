_settings = { date: '01/01/2024',theme:"light",overwriteOnAutofill:false}
chrome.storage.sync.get((s) => {
  _settings = s
});

function getSettings(f){
  f(_settings)
}

function setSettings(settings,callback = () => {}){
  _settings = settings
  chrome.storage.sync.set(settings);
  callback()
};


function getAndSetSettings(fGet,fSet){
  getSettings( (settings)=>{
    settings = fGet(settings);
    setSettings(settings,fSet);
  })
}

/// OLD VERSION SYNCS EVERY TIME
function _setSettings(settings,callback = () => {}){
    chrome.storage.sync.set(settings,callback);
  };
  
  // Restores select box and checkbox state using the preferences
  // stored in chrome.storage.
function _getSettings(f){
    chrome.storage.sync.get({ date: '01/01/2024',theme:"light",overwriteOnAutofill:false},f);
  };
  
