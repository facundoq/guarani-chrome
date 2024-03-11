import { getSettings, setSettings } from "./settings";
import {autofill} from "./autofill";
import {AutofillConfigUI} from "./autofill_config_ui";

const sampleCSV = `dni;condicion;fecha;resultado;nota
44960966;Aprobado;1/02/2024;Aprobado;A
44785441;Insuficiente;1/02/2024;Reprobado;D
45814671;Aprobado;1/02/2024;Aprobado;A
96172896;Desaprobado;1/02/2024;Reprobado;D
`

function toggleElement(el, display = "block") {
  if (el.style.display === "none") {
    el.style.display = display;
  } else {
    el.style.display = "none";
  }
}



function AutofillStartButtonUI(rows, autofillCallback) {
  const button = fromHTML(`<button type='button' class="btn btn-small"> 📝 Autocompletar </button>`) as HTMLButtonElement
  button.onclick = () => {

    const unmatched = autofill(rows, getSettings("autofillData"), getSettings("overwriteOnAutofill"))
    const allUnmatched = getSettings("unmatched") as Array<object>
    const newUnmatched = [...new Set(allUnmatched.concat(unmatched))]
    setSettings("unmatched", newUnmatched)
    autofillCallback()
  } 
  
  button.update = () => {
    if (getSettings("autofillData")) {
      button.disabled = false;
    } else {
      button.disabled = true;
    }
  }
  button.update()
  return button
}

function AutofillStatsUI(rows_element) {
  const container = fromHTML(`<span  id="statsUI"> </span>`)
  const label = fromHTML(`<span> Completados: </span>`)
  const count = fromHTML(`<span  id="statsUIProgress"> </span>`)
  // const elementsToWatch = rows_element.querySelectorAll("input, .select")
  // elementsToWatch.foreach()
  appendChildren(container, [label, count])
  return container
}

function shortenToolButtonsNames() {
  document.getElementById("js-colapsar-autocompletar").children[1].innerHTML = "Autocompletar básico"

  document.getElementById("ver_escala_regularidad").children[1].innerHTML =
    "Glosario"
}

function AutofillUI(rows_element) {
  // Create a bar above main form
  const autofillUI = fromHTML(`<div id="autofillBar"> </div>`)
  

  // add a container with the autofill config, a toggle button to open/close it, and an autofill button to operate it
  const toggleButton = fromHTML(`<button id="autofillAdvanced" class="btn btn-small" href="#"><i   class="icon-wrench"></i> Config </button>`)
  const autofillStartButton = AutofillStartButtonUI(rows_element, () => {
    //TODO show unmatched
  })
  
  const config = fromHTML(`<div id="autofillConfigContainer" style="display:none;"> </div>`)
  const controls = fromHTML(`<div id="autofillControlsContainer"> </div>`)
  toggleButton.onclick = () => { toggleElement(config, "block") }
  
  controls.appendChild(toggleButton)
  controls.appendChild(autofillStartButton)

  autofillUI.appendChild(controls)
  autofillUI.appendChild(config)

  const autofillConfigUI = AutofillConfigUI(autofillStartButton)
  config.appendChild(autofillConfigUI)

  return autofillUI
}


// function AutofillUI2(rows_element) {
//   const container = fromHTML(`<div class="span3" id="autofillContainer"> </div>`)
//   console.log("Adding Autofill UI")

//   const logo = fromHTML(`<img id="guaraniChromeLogo" src="/images/logo.png"/>`)
//   const autofillStartButtonUI = AutofillStartButtonUI(rows_element, () => {
//     //TODO show unmatched
//   })
//   const autofillConfigUI = AutofillConfigUI(autofillStartButtonUI)

//   const autofillStatsUI = AutofillStatsUI(rows_element)


//   appendChildren(container, [logo, autofillStartButtonUI, autofillConfigUI])
//   return container
// }

function addAutofillUI(form_renglones) {

  // const root = document.getElementById("notas_cursada_query").parentElement.parentElement.parentElement
  const table = form_renglones.children[1];
  const table_body = table.children[1];
  const autofillUI = AutofillUI(table_body.rows)

  const renglones = document.getElementById("renglones")
  renglones.parentElement.insertBefore(autofillUI, renglones)

  // TODO COnsider alternative location for UI
  // const autofillContainer = document.getElementsByClassName("form-actions");
  // root.appendChild(autofillUI)

  //TODO remove load data for testing automatically
  //document.getElementById("autofillSubmitButton").onclick()

}




