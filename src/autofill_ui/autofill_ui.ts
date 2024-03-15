import { getSettings, setSettings, Settings } from "../settings";
import { autofill } from "../autofill/autofill";
import { AutofillConfigUI } from "./autofill_config_ui";
import {
  fromHTML,
  appendChildren,
  UI,
  toggleElement,
} from "../utils/dom_utils";

const sampleCSV = `dni;condicion;fecha;resultado;nota
44960966;Aprobado;1/02/2024;Aprobado;A
44785441;Insuficiente;1/02/2024;Reprobado;D
45814671;Aprobado;1/02/2024;Aprobado;A
96172896;Desaprobado;1/02/2024;Reprobado;D
`;

export class AutofillStartButtonUI extends UI {
  root = fromHTML(
    `<button type='button' class="btn btn-small"> 📝 Autocompletar </button>`
  ) as HTMLButtonElement;

  constructor(rows: HTMLElement[], autofillCallback: CallableFunction) {
    super();
    this.root.onclick = () => {
      const unmatched = autofill(
        rows,
        getSettings(Settings.AutofillData),
        getSettings(Settings.OverwriteOnAutofill)
      );
      const allUnmatched = getSettings(Settings.Unmatched) as Array<object>;
      const newUnmatched = new Set(allUnmatched.concat(unmatched));
      setSettings(Settings.Unmatched, Array.from(newUnmatched));
      autofillCallback();
    };
    this.update();
  }
  disable() {
    this.root.disabled = true;
  }
  enable() {
    this.root.disabled = false;
  }
  update() {}
}

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
  constructor(protected rows_element: HTMLElement[]) {
    super();

    // add a container with the autofill config, a toggle button to open/close it, and an autofill button to operate it
    const toggleButton = fromHTML(
      `<button id="autofillAdvanced" class="btn btn-small" href="#"><i   class="icon-wrench"></i> Configurar autocompletado </button>`
    );
    const autofillStartButton = new AutofillStartButtonUI(
      rows_element,
      () => {}
    );

    const config = fromHTML(
      `<div id="autofillConfigContainer" style="display:none;"> </div>`
    );
    const controls = fromHTML(`<div id="autofillControlsContainer"> </div>`);
    toggleButton.onclick = () => {
      toggleElement(config, "block");
    };

    controls.appendChild(toggleButton);
    controls.appendChild(autofillStartButton.root);

    this.root.appendChild(controls);
    this.root.appendChild(config);

    const autofillConfigUI = new AutofillConfigUI(autofillStartButton);
    config.appendChild(autofillConfigUI.root);
  }
}

export function addAutofillUI(form_renglones) {
  // const root = document.getElementById("notas_cursada_query").parentElement.parentElement.parentElement
  const table = form_renglones.children[1];
  const table_body = table.children[1];
  const autofillUI = new AutofillUI(table_body.rows);

  const renglones = document.getElementById("renglones");
  renglones.parentElement.insertBefore(autofillUI.root, renglones);

  shortenToolButtonsNames();
}
