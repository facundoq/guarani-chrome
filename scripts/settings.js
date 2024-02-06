

function setSettings(settings,callback = () => {}){
    chrome.storage.sync.set(settings,callback);
  };
  
  // Restores select box and checkbox state using the preferences
  // stored in chrome.storage.
function getSettings(f){
    chrome.storage.sync.get({ date: '01/01/2024',theme:"light"},f);
  };
  
function getAndSetSettings(fGet,fSet){
  getSettings( (settings)=>{
    settings = fGet(settings);
    setSettings(settings,fSet);
  })
}