// add sync/local map to chrome.storage to fake being in an extension
// Uses localStorage with JSON.stringify to simulate storing JS objects
// Therefore users should be careful since slight differences in behavior
// form chrome.storage may occur

class FakeStorage {
    constructor() {
      
    }
    set(kv){
      // console.log(`Setting ${Object.entries(kv)}..`)
      for (const [k, v] of Object.entries(kv)) {
        // console.log(`Setting key ${k} to ${JSON.stringify(v)}`)
        localStorage.setItem(k,JSON.stringify(v))
      }
      
      return new Promise(function(resolve, reject) {
        resolve()
     });
    }
    get(kv,callback){
      // console.log(`Getting ${Object.entries(kv)}..`)
      var result = {};
      for (const [k, v] of Object.entries(kv)) {
        // console.log(`Found  ${k}:${v} in localStorage`)
        const item = JSON.parse(localStorage.getItem(k)) || v;
        result[k] = item;
      }
      // console.log(`Set ${Object.entries(result)}..`)
      callback(result)
    }
    clear(callback){
      localStorage.clear()
      if(callback){
        callback()
      }
    }
  }
  
  // @ts-ignore
  chrome.storage = {sync:new FakeStorage(),local:new FakeStorage()}
  // @ts-ignore
  chrome.runtime= {getURL:(url) => `/dist/${url}`}
  
  