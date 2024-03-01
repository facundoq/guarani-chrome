// add sync/local map to chrome.storage to fake being in an extension
class FakeStorage {
    constructor() {
      this.values = {}
    }
    set(kv,callback){
      for (const [k, v] of Object.entries(kv)) {
          localStorage.setItem(k,v)
      }
      callback()
    }
    get(key,callback){
      callback(localStorage.getItem(key))
    }
  }
  chrome.storage = {sync:new FakeStorage(),local:new FakeStorage()}
  chrome.runtime= {getURL:(url) => `/${url}`}
  
  