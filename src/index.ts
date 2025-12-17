import { Settings } from "./settings";

import { addSaveButton } from "./save_button";

import { initializeThemeChooser } from "./themes"
import { ready, waitForElement } from "./utils/dom_utils"
import { when_form_renglones_ready } from "./form_renglones";
import { addAutofillUI } from "./autofill_ui/autofill_ui"
import { AutofillCursada, AutofillFinal, BaseAutofill } from "./autofill/autofill";
import { AutofillParser } from "./input/parser";
import { CSVCursadaConfig } from "./input/CSVCursadaConfig";
import { CSVFinalConfig } from "./input/CSVFinalConfig";
import { ColumnStatusUI } from "./autofill_ui/autofill_status_ui";

enum PageType {
    Cursada,
    Final,
    Other,
}

function detectPageTypeByURL() {
    if (window.location.host.includes("localhost")) {
        if (window.location.pathname.endsWith("cursada.html")) {
            return PageType.Cursada
        }
        if (window.location.pathname.endsWith("final.html")) {
            return PageType.Final
        }
        return PageType.Other
    }
    const url = window.location.toString()
    if (window.location.pathname.startsWith("/cursada/edicion")) {
        return PageType.Cursada
    }
    if (window.location.pathname.startsWith("/notas_mesa_examen/edicion")) {
        return PageType.Final
    }
    return PageType.Other

}

function detectPageTypeByElements(): PageType {
    const cabeceraElement = document.getElementById("cabecera")
    if (!cabeceraElement) {
        return PageType.Other
    }
    const titleElementContainer = cabeceraElement.querySelector("h2")
    if (!titleElementContainer) {
        return PageType.Other
    }
    const titleElement = titleElementContainer.children[0] as HTMLSpanElement
    switch (titleElement.innerText) {
        case "Carga de notas de cursada": return PageType.Cursada;
        case "Carga de notas a mesa de examen": return PageType.Final;
        default: return PageType.Other;
    }

}
function getSubjectName() {
    const divCabecera = document.getElementById("js-colapsar-detalles-zona")
    const nameSpan = divCabecera.children[0].children[0] as HTMLSpanElement
    return nameSpan.innerText
}

function addColumnCounters(rows:HTMLElement[],autofill:BaseAutofill,fieldToIndex:{[key: string]:number}){
    const headerElements = Array.from(
          document
            .getElementById("renglones")
            .querySelector("thead")
            .querySelectorAll("th")
        );
        
        const columnsStatusUIs = Object.entries(fieldToIndex).map( (e,i,a) =>{
            const [key, value] = e
            const header = headerElements[value] as HTMLTableCellElement

            return new ColumnStatusUI(rows,autofill,key,header)
        })
        return columnsStatusUIs
}
interface MyObjLayout {
    string: string;
}

function addPageSpecificUI(settings: Settings) {

    switch (detectPageTypeByURL()) {
        case PageType.Cursada: {

            when_form_renglones_ready((form_renglones) => {
                const table = form_renglones.children[1]
                const table_body = table.children[1] as HTMLTableElement
                const rows = Array.from(table_body.rows) as HTMLElement[]
                const subjectName = getSubjectName()
                console.log(`GUARANI-CHROME: Se detectó página de carga de notas de CURSADA de la materia ${subjectName}`)
                const autofill = new AutofillCursada(new AutofillParser(new CSVCursadaConfig()), subjectName)
                const fieldToIndex = { "fecha": 3, "nota": 4, "resultado": 5, "condicion": 6 } as {[key: string]:number}
                addColumnCounters(rows,autofill,fieldToIndex)
                addAutofillUI(rows, settings, autofill);
                addSaveButton(form_renglones);
            }, 4000, 10);
            break;
        }
        case PageType.Final: {
            when_form_renglones_ready((form_renglones) => {
                const table = form_renglones.children[1]
                const table_body = table.children[1] as HTMLTableElement
                const rows = Array.from(table_body.rows) as HTMLElement[]
                const subjectName = getSubjectName()
                console.log(`GUARANI-CHROME: Se detectó página de carga de notas de FINAL de la materia ${subjectName}`)
                const autofill = new AutofillFinal(new AutofillParser(new CSVFinalConfig()), subjectName)
                const fieldToIndex = { "fecha": 3, "nota": 4, "resultado": 5} as {[key: string]:number}
                addColumnCounters(rows,autofill,fieldToIndex)
                addAutofillUI(rows, settings, autofill)
            }, 4000, 10)

            break;
        }
        default: console.log("GUARANI-CHROME: No se detectó un tipo de página especial.")
    }
}




Settings.RestoreFromStorage(s => {
    ready(() => initializeThemeChooser(s))
    waitForElement("#cabecera", () => {
        addPageSpecificUI(s)
    })
})
