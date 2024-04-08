import { Settings } from "../settings";
import {AutofillParser} from "../input/parser"
import { CSV, CSVData,CSVHeader } from "../input/csv";
import {fromHTML,appendChildren,UI} from "../utils/dom_utils"

import { AutofillOverwriteConfigUI } from "./autofill_overwrite_ui";
import { AutofillResultUI } from "./autofill_result_ui";
import { AutofillInputUI } from "./autofill_input_ui";
import { BaseAutofill } from "../autofill/autofill";
import { Either } from "../utils/utils";

export class AutofillConfigUI extends UI{
    
    root = fromHTML(`<div id="autofillConfig" ></div>`) as HTMLDivElement
    
    public data : Either<string,CSV>

    constructor(autofill:BaseAutofill,onParseCallback:CallableFunction,settings:Settings){
        super()
        const inputCSV = settings.getAutofillData(autofill.operationType,autofill.subjectName)
        const autofillResultUI = new AutofillResultUI(5)
        
        const inputUpdate = (inputCSV) => {
            settings.setAutofillData(autofill.operationType,autofill.subjectName,inputCSV)
            settings.save()
            this.data = autofill.parse(inputCSV);
            autofillResultUI.update(this.data)
            onParseCallback(this.data)
        }
        const inputUI = new AutofillInputUI(inputCSV, inputUpdate,autofill.parser.config.keyColumns,autofill.parser.config.dataColumns)
        const autofillOverwriteConfigUI = new AutofillOverwriteConfigUI(settings)
        appendChildren(this.root, [autofillOverwriteConfigUI.root,  inputUI.root, autofillResultUI.root])

        inputUpdate(inputCSV)

    
    }   
}