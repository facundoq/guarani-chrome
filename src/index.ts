import { initializeSettings, Settings, _settings } from "./settings";

import { initializeThemeChooser } from "./themes"
import { ready, waitForElement } from "./utils/dom_utils"
import { when_form_renglones_ready } from "./form_renglones";
import { addAutofillUI } from "./autofill_ui/autofill_ui"

enum PageType {
    Cursada,
    Final,
    Other,
}

function detectPageTypeByURL(){
    if (window.location.host.includes("localhost")){
        if (window.location.pathname.endsWith("cursada.html")){
            return PageType.Cursada
        }
        if (window.location.pathname.endsWith("final.html")){
            return PageType.Final
        }
        return PageType.Other
    }
    const url = window.location.toString()
    if (window.location.pathname.startsWith("/cursada/edicion")){
        return PageType.Cursada
    }
    if (window.location.pathname.endsWith("/cierre_cursadas")){
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

function addPageSpecificUI(){
    switch (detectPageTypeByURL()) {
        case PageType.Cursada: {
            console.log(`Se detectó página de carga de notas de CURSADA`)
            when_form_renglones_ready(addAutofillUI, 4000, 10);
            break;
        }
        case PageType.Final: {
            console.log(`Se detectó página de carga de notas de FINAl`)
            //TODO
            break;
        }
        default: console.log("No se detectó un tipo de página especial.")
    }
}

initializeSettings(() => {
    ready(initializeThemeChooser)
    waitForElement("#cabecera",() =>{
        addPageSpecificUI()
    })
    // ready(() => {
        
    // })


}
)