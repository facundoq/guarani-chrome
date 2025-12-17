import { waitForElement } from "./utils/dom_utils";

const form_renglones_selector = ".form-renglones"

function failed_callback(timeout){
  console.log(`GUARANI-CHROME: after waiting for ${timeout}, assuming there's no form in page.`);
}

export function when_form_renglones_ready(callback,timeout=5000,additional_wait=10){

  const formCallback = () => {
    const form_renglones = document.querySelector(form_renglones_selector);
    callback(form_renglones);
  }
  const failCallback = () => {failed_callback(timeout)}
  const waitCallback = () => { setTimeout(formCallback,additional_wait)}
  waitForElement(form_renglones_selector,waitCallback,timeout,undefined,failCallback)
}

// function when_form_renglones_ready_old(listeners){
//     const columna = document.querySelector("#columna_1");
//       if (!columna) {
//         console.log("#Columna_1 not found; not a students form.")
//         return  
//     }
//     console.log("Registering to add save button")
//     console.log(columna)
//     observe(columna,when_columna_changes,{childList:true,subtree:true },disableAfterFirst=false,params=listeners)
//   }
  
  // function when_columna_changes(observer,listeners){
  //   const renglones = document.querySelector("#renglones");
  //   if (renglones) {
  //     console.log("renglones found; adding mutation observer")
  //     console.log(renglones)
  //     observer.disconnect()
  //     observe(renglones,when_renglones_changes,{ subtree: true,childList:true },true,listeners)        
  //   }
  // }
  
export function when_renglones_changes(observer,listeners){
      const form_renglones = document.querySelector(".form-renglones");
      if (form_renglones) {
        console.log("GUARANI-CHROME: Form renglones found; adding button")
        observer.disconnect()
        listeners.forEach(listener => listener(form_renglones));
        
      }else{
        console.log("GUARANI-CHROME: Form renglones not found")
        // console.log(document.querySelector("#renglones"))        
      }
  }
  
 
  