
function when_form_renglones_ready(listeners){
    const columna = document.querySelector("#columna_1");
      if (!columna) {
        console.log("#Columna_1 not found; not a students form.")
        return  
    }
    console.log("Registering to add save button")
    console.log(columna)
    observe(columna,when_columna_changes,{childList:true,subtree:true },disableAfterFirst=false,params=listeners)
  }
  
  function when_columna_changes(observer,listeners){
    const renglones = document.querySelector("#renglones");
    if (renglones) {
      console.log("renglones found; adding mutation observer")
      console.log(renglones)
      observer.disconnect()
      observe(renglones,when_renglones_changes,{ subtree: true,childList:true },true,listeners)        
    }
  }
  
  function when_renglones_changes(observer,listeners){
      const form_renglones = document.querySelector(".form-renglones");
      if (form_renglones) {
        console.log("Form renglones found; adding button")
        observer.disconnect()
        listeners.forEach(listener => listener(form_renglones));
        
      }else{
        console.log("Form renglones not found")
        console.log(document.querySelector("#renglones"))        
      }
  }
  
 
  