import { Settings, getSettings, setSettings } from "../settings";
import {AutofillParser} from "../input/parser"
import { CSVData,CSVHeader } from "../input/csv";
import {fromHTML,appendChildren,UI} from "../utils/dom_utils"

import { AutofillOverwriteConfigUI } from "./autofill_overwrite_ui";
import { AutofillResultUI } from "./autofill_result_ui";
import { AutofillInputUI } from "./autofill_input_ui";
import { AutofillCursada } from "../autofill/autofill";

export class AutofillConfigUI extends UI{
    
    root = fromHTML(`<div id="autofillConfig" ></div>`) as HTMLDivElement

    constructor(autofill:AutofillCursada,onParseCallback:CallableFunction,){
        super()
        const inputCSV = getSettings(Settings.AutofillDataCSV) as string
        const autofillResultUI = new AutofillResultUI(5)
        
        const inputUpdate = (inputCSV) => {
            setSettings(Settings.AutofillDataCSV,inputCSV)
            const result = autofill.parse(inputCSV);
            autofillResultUI.update(result)
            onParseCallback(result)
        }
        const inputUI = new AutofillInputUI(inputCSV, inputUpdate,autofill.parser.config.keyColumns,autofill.parser.config.dataColumns)
        const autofillOverwriteConfigUI = new AutofillOverwriteConfigUI()
        appendChildren(this.root, [autofillOverwriteConfigUI.root,  inputUI.root, autofillResultUI.root])

        inputUpdate(inputCSV)

    
    }   
}