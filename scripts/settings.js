
function setSettings(settings){
    chrome.storage.sync.set(settings,() => {});
  };
  
  // Restores select box and checkbox state using the preferences
  // stored in chrome.storage.
function getSettings(f){
    chrome.storage.sync.get({ date: '01/01/2024'},f);
  };
  
