import { initializeSettings, Settings, _settings } from "./settings";

import { initializeThemeChooser } from "./themes"
import { ready } from "./utils/dom_utils"
import { when_form_renglones_ready } from "./form_renglones";
import { addAutofillUI } from "./autofill_ui/autofill_ui"

enum PageType {
    Cursada,
    Final,
    Otra,
}

function detectPageType(): PageType {
    const cabeceraElement = document.getElementById("cabecera")
    if (!cabeceraElement) {
        return PageType.Otra
    }
    const titleElementContainer = cabeceraElement.querySelector("h2")
    if (!titleElementContainer) {
        return PageType.Otra
    }
    const titleElement = titleElementContainer.children[0] as HTMLSpanElement
    switch (titleElement.innerText) {
        case "Carga de notas de cursada": return PageType.Cursada;
        case "Carga de notas a mesa de examen": return PageType.Final;
        default: return PageType.Otra;
    }

}

initializeSettings(() => {
    ready(initializeThemeChooser)
    ready(() => {
        switch (detectPageType()) {
            case PageType.Cursada: {
                console.log(`Se detectó página de carga de notas de CURSADA`)
                when_form_renglones_ready(addAutofillUI, 1000, 10);
                break;
            }
            case PageType.Final: {
                console.log(`Se detectó página de carga de notas de FINAl`)
                //TODO
                break;
            }
            default: console.log("No se detectó un tipo de página especial.")
        }
    })


}
)