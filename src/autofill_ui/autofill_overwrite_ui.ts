import { Settings, getSettings, setSettings } from "../settings";
import {fromHTML,UI} from "../utils/dom_utils"

export class AutofillOverwriteConfigUI extends UI {

    root = fromHTML(`<div id="autofillOverwrite"></div>`) as HTMLDivElement
     
    constructor(){
        super()
        const labelTitle = "Sobreescribir valores (notas, condición, fecha, etc) existentes al rellenar."
        const label = fromHTML(`<label title="${labelTitle}" style="display:inline;">Sobreescribir valores: </label>`) as HTMLLabelElement
        const checkbox = fromHTML(`<input type="checkbox" id="autofillOverwriteCheckbox"/>`) as HTMLInputElement
        checkbox.checked = getSettings("overwriteOnAutofill") as boolean;
        checkbox.onchange = (e) => {
            setSettings("overwriteOnAutofill", checkbox.checked)            
        }
        this.root.appendChild(label)
        this.root.appendChild(checkbox)
    }
}