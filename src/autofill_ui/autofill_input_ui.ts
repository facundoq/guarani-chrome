import { Settings } from "../settings";
import {AutofillParser} from "../input/parser"
import { CSVData,CSVHeader } from "../input/csv";
import {fromHTML,appendChildren,UI} from "../utils/dom_utils"


export class AutofillInputUI extends UI {
    root = document.createElement("div")

    constructor(inputCSV:string,changeCallback:CallableFunction,keyColumns:string[],dataColumns:string[]){
        super()
        this.root.id="autofillInputUI"

        const labelTitle = `El CSV requiere como mínimo una columna de identificación y una columna de datos:\n
      Cols. de identificación: ${keyColumns}
      Cols. de datos: ${dataColumns}
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