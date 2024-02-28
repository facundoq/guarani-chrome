// add sync map to chrome.storage to fake being in an extension
class FakeSync {
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
      // if (this.values){
      // 	callback(this.values)
      // 	console.log("REturning stored value")
      // }else{
      // 	console.log("REturning default value", key)
      // 	this.values = key
      // 	callback(key)
      // }
    }
  }
  chrome.storage = {sync:new FakeSync()}
  chrome.runtime= {getURL:(url) => `/${url}`}
  
  