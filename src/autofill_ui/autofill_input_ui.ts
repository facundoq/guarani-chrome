import { Settings, getSettings, setSettings } from "../settings";
import {csv2autofillData,CSVCursadaConfig} from "../input/parser"
import { CSVData,CSVHeader } from "../input/csv";
import {fromHTML,appendChildren,UI} from "../utils/dom_utils"


export class AutofillInputUI extends UI {
    root = document.createElement("div")

    constructor(inputCSV:string,changeCallback:CallableFunction){
        super()
        this.root.id="autofillInputUI"

        const labelTitle = `El CSV requiere como mínimo una columna de identificación y una columna de datos:\n
      Cols. de identificación: ${CSVCursadaConfig.keyColumns}
      Cols. de datos: ${CSVCursadaConfig.dataColumns}
      `
        const label = fromHTML(`<label for="autofillInput" style="display:block" title="${labelTitle}">Carga de CSV para autollenado 🛈:</label>`)

        const autofillDataInput = fromHTML(`
        <textarea type="text" name="autofill" 
        id="autofillInput">${inputCSV}</textarea>`) as HTMLTextAreaElement

        this.root.appendChild(label)
        this.root.appendChild(autofillDataInput)
        
        autofillDataInput.onchange = e => changeCallback(autofillDataInput.value)
        autofillDataInput.addEventListener('input', e => changeCallback(autofillDataInput.value))

    }

    

}