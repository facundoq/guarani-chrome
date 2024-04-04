
import { Settings } from "../settings"
import {fromHTML,UI} from "../utils/dom_utils"

export class AutofillOverwriteConfigUI extends UI {

    root = fromHTML(`<div id="autofillOverwrite"></div>`) as HTMLDivElement
     
    constructor(public settings:Settings){
        super()
        const labelTitle = "Sobreescribir valores (notas, condición, fecha, etc) existentes al rellenar."
        const label = fromHTML(`<label title="${labelTitle}" style="display:inline;">Sobreescribir valores: </label>`) as HTMLLabelElement
        const checkbox = fromHTML(`<input type="checkbox" id="autofillOverwriteCheckbox"/>`) as HTMLInputElement
        checkbox.checked = this.settings.overwriteOnAutofill
        checkbox.onchange = (e) => {
            this.settings.overwriteOnAutofill = checkbox.checked
            this.settings.save()            
        }
        this.root.appendChild(label)
        this.root.appendChild(checkbox)
    }
}