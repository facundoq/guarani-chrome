import { Settings, getSettings, setSettings } from "../settings";
import {csv2autofillData,CSVCursadaConfig} from "../input/parser"
import { CSVData,CSVHeader } from "../input/csv";
import {fromHTML,appendChildren,UI} from "../utils/dom_utils"

import { AutofillOverwriteConfigUI } from "./autofill_overwrite_ui";
import { AutofillResultUI } from "./autofill_result_ui";
import { AutofillInputUI } from "./autofill_input_ui";

export class AutofillConfigUI extends UI{
    
    root = fromHTML(`<div id="autofillConfig" ></div>`) as HTMLDivElement

    constructor(onParseCallback:CallableFunction){
        super()
        const inputCSV = getSettings(Settings.AutofillDataCSV) as string
        const autofillResultUI = new AutofillResultUI(5)
        
        const inputUpdate = (inputCSV) => {
            setSettings(Settings.AutofillDataCSV,inputCSV)
            const result = csv2autofillData(inputCSV);
            autofillResultUI.update(result)
            onParseCallback(result)
        }
        const inputUI = new AutofillInputUI(inputCSV, inputUpdate)
        const autofillOverwriteConfigUI = new AutofillOverwriteConfigUI()
        appendChildren(this.root, [autofillOverwriteConfigUI.root,  inputUI.root, autofillResultUI.root])

        inputUpdate(inputCSV)

    
    }   
}