import { getSettings, setSettings,Settings } from "../settings";
import {autofill} from "../autofill/autofill";
import {AutofillConfigUI} from "./autofill_config_ui";
import { fromHTML,appendChildren, UI } from "../utils/dom_utils";

function AutofillStatsUI(rows_element) {
    const container = fromHTML(`<span  id="statsUI"> </span>`)
    const label = fromHTML(`<span> Completados: </span>`)
    const count = fromHTML(`<span  id="statsUIProgress"> </span>`)
    // const elementsToWatch = rows_element.querySelectorAll("input, .select")
    // elementsToWatch.foreach()
    appendChildren(container, [label, count])
    return container
  }
  