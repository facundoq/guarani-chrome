import { Settings, getSettings, setSettings } from "../settings";
import {CSVParseResult, csv2autofillData,csvConfig} from "../autofill/parser"
import { CSVData,CSVHeader } from "../autofill/csv";
import {fromHTML,appendChildren,UI} from "../utils/dom_utils"
import { Either, mapMap } from "../utils/utils";


function rowToString(row:Map<string,string>,index:number){
    const data = Array.from(mapMap(row,(k,v) =>[k,`${k}=${v}`]).values()).join(", ")
    return `${index}: ${data}`
}

function autofillDataToString(rows:CSVData) {
    let asStr = rows.map((v,i,a) =>rowToString(v,i))
    return asStr.join("\n")
}



export class AutofillResultUI extends UI {
    
    
    public root = document.createElement("div")
    protected result = document.createElement("textarea")
    protected status = document.createElement("span")
    constructor(protected maxRows=5){
        super()
        const autofillDataViewerLabel = fromHTML(`<p style="display:block">Resultado de la carga:</p>`)
        autofillDataViewerLabel.appendChild(this.status)
        this.result.id = "autofillResult"
        this.result.disabled = true
        this.root.appendChild(autofillDataViewerLabel)
        this.root.appendChild(this.result)
    }
    
    update(result:CSVParseResult){
        result.doLeft(error => {
            setSettings(Settings.AutofillData,[])
            this.result.value = error
            this.status.innerText = "❌"
         })
         result.doRight(csv => {
            const shortRows = csv.rows.slice(0,Math.min(this.maxRows,csv.rows.length)) 
            this.result.value = `${autofillDataToString(shortRows)}`;
            this.status.innerText = `✅ (Filas: ${csv.rows.length}, Columnas: ${csv.header.length})`
             
         });
    }

    
}
