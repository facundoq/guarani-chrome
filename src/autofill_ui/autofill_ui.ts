import { getSettings, setSettings, Settings } from "../settings";
import { AutofillCursada } from "../autofill/autofill";
import { AutofillConfigUI } from "./autofill_config_ui";
import {
  fromHTML,
  appendChildren,
  UI,
  toggleElement,
} from "../utils/dom_utils";
import { AutofillStatsUI } from "./autofill_status_ui";
import { CSV } from "../input/csv";
import { StudentCursada } from "../guarani/StudentCursada";
import { AutofillParser } from "../input/parser";
import { CSVCursadaConfig } from "../input/CSVCursadaConfig";


function shortenToolButtonsNames() {
  const autocomplete = document.getElementById("js-colapsar-autocompletar")
  if (autocomplete){
    autocomplete.children[1].innerHTML ="Autocompletar básico";
  }

  const scale = document.getElementById("ver_escala_regularidad")
  if (scale){
    scale.innerHTML = "Glosario";
  }
}

export class AutofillUI extends UI {
  // Create a bar above main form
  root = fromHTML(`<div id="autofillBar"> </div>`);
  constructor(protected rowsElement: HTMLElement[],public autofill:AutofillCursada) {
    super();

    // add a container with the autofill config, a toggle button to open/close it, and an autofill button to operate it
    const toggleButton = fromHTML(
      `<button id="autofillAdvanced" class="btn btn-small" href="#"><i   class="icon-wrench"></i> Configurar autocompletado </button>`
    );
    const autofillStartButton = fromHTML(
      `<button type='button' class="btn btn-small"> 📝 Autocompletar </button>`
    ) as HTMLButtonElement;
    autofillStartButton.onclick = () => {
        
        const students = Array.from(rowsElement.map(r => new StudentCursada(r)))
        const unmatched = this.autofill.autofill(
          students,
          getSettings(Settings.AutofillData) as CSV,
          getSettings(Settings.OverwriteOnAutofill) as boolean
        );
        const allUnmatched = getSettings(Settings.Unmatched) as Array<object>;
        const newUnmatched = new Set(allUnmatched.concat(unmatched));
        setSettings(Settings.Unmatched, Array.from(newUnmatched));
    }
    

    const config = fromHTML(
      `<div id="autofillConfigContainer" style="display:none;"> </div>`
    );
    const controls = fromHTML(`<div id="autofillControlsContainer"> </div>`);
    toggleButton.onclick = () => {
      toggleElement(config, "block");
    };

    const statsUI = new AutofillStatsUI(rowsElement)
    controls.appendChild(statsUI.root)
    controls.appendChild(toggleButton);
    controls.appendChild(autofillStartButton);

    this.root.appendChild(controls);
    this.root.appendChild(config);

    const autofillConfigUI = new AutofillConfigUI(result =>{
      result.doLeft(error => {
        setSettings(Settings.AutofillData,[])
        autofillStartButton.disabled = true
     })
     result.doRight(csv => {
         setSettings("autofillData", csv)
         autofillStartButton.disabled = false
     });
    });
    config.appendChild(autofillConfigUI.root);
  }
}


export function addAutofillUI(form_renglones) {
  // const root = document.getElementById("notas_cursada_query").parentElement.parentElement.parentElement
  const table = form_renglones.children[1]
  const table_body = table.children[1]
  const rows = Array.from(table_body.rows) as HTMLElement[]
  const  autofill = new AutofillCursada(new AutofillParser(new CSVCursadaConfig()))
  const autofillUI = new AutofillUI(rows,autofill)

  const renglones = document.getElementById("renglones")
  renglones.parentElement.insertBefore(autofillUI.root, renglones)

  shortenToolButtonsNames()
}
