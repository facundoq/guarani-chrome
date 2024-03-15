import { initializeSettings,Settings,_settings } from "./settings";

import {initializeThemeChooser} from "./themes"
import {ready} from "./utils/dom_utils"
import { when_form_renglones_ready } from "./form_renglones";
import {addAutofillUI} from "./autofill_ui/autofill_ui"

initializeSettings( () =>{
        ready(initializeThemeChooser)
        when_form_renglones_ready(addAutofillUI,1000,10);
        // when_form_renglones_ready(add_row_buttons)
    }
)