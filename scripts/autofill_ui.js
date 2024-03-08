const sampleCSV = `dni;condicion;fecha;resultado;nota
44960966;Aprobado;1/02/2024;Aprobado;A
44785441;Insuficiente;1/02/2024;Reprobado;D
45814671;Aprobado;1/02/2024;Aprobado;A
96172896;Desaprobado;1/02/2024;Reprobado;D
`

function AutofillConfigUI(autofillStartButton){
  const root = fromHTML(`<div id="autofillConfigContainer" style="display:inline"></div>`)
  const openButton = fromHTML(`<button type='button'> Config ⚙️ </button>`)
  const closeButton = fromHTML(`<button type='button' id="autofillConfigCloseButton"> ✖</button>`)
  const config = AutofillConfigPopUpUI(autofillStartButton,closeButton)
  
  openButton.onclick = () =>{
    // openButton.style.display="none"      
    if (config.style.display==="none"){
      config.style.display="inline";
    }else{
      config.style.display="none";  
    }
    
  }
  closeButton.onclick = () =>{
    // openButton.style.display="inline"      
    config.style.display="none"
  }
  
  root.appendChild(openButton)
  root.appendChild(config)
  
  // by default, don't display config and only display config button
  closeButton.onclick()
  return root
}

  function AutofillStartButtonUI(rows,autofillCallback){
    const button = fromHTML(`<button type='button'> Rellenar 📝</button>`)
    button.onclick = () =>{

      const unmatched = autofill(rows,getSettings("autofillData"),getSettings("overwriteOnAutofill"))
      const allUnmatched = getSettings("unmatched")
      const newUnmatched = [...new Set(allUnmatched.concat(unmatched))]
      setSettings("unmatched",newUnmatched)
      autofillCallback()
    }
    button.update = () =>{
      if (getSettings("autofillData") ){
        button.disabled=false;
      }else{
        button.disabled=true;
      }
    }
    button.update()
    return button
  }

function AutofillStatsUI(rows_element){
  const container = fromHTML(`<span  id="statsUI"> </span>`)
  const label = fromHTML(`<span> Completados: </span>`)
  const count = fromHTML(`<span  id="statsUIProgress"> </span>`)
  // const elementsToWatch = rows_element.querySelectorAll("input, .select")
  // elementsToWatch.foreach()
  appendChildren(container, [label,count])
  return container
}
function AutofillUI(rows_element){
  const container = fromHTML(`<div class="span3" id="autofillContainer"> </div>`)
  console.log("Adding Autofill UI")

  const logo = fromHTML(`<img id="guaraniChromeLogo" src="/images/logo.png"/>`)
  const autofillStartButtonUI = AutofillStartButtonUI(rows_element, ()=>{
    //TODO show unmatched
  })
  const autofillConfigUI = AutofillConfigUI(autofillStartButtonUI)
  
  const autofillStatsUI = AutofillStatsUI(rows_element)


  appendChildren(container,[logo,autofillStartButtonUI,autofillConfigUI])
  return container
}
  function addAutofillUI(form_renglones){
    
    const root = document.getElementById("notas_cursada_query").parentElement.parentElement.parentElement
    const table = form_renglones.children[1];
    const table_body = table.children[1];
    const autofillUI = AutofillUI(table_body.rows)

    // TODO COnsider alternative location for UI
    // const autofillContainer = document.getElementsByClassName("form-actions");
    root.appendChild(autofillUI)

    //TODO remove load data for testing automatically
    //document.getElementById("autofillSubmitButton").onclick()
    
  }




  