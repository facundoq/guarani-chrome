import { initializeSettings } from "./settings";

import {initializeThemeChooser} from "./themes"

initializeSettings( () =>{
        ready(initializeThemeChooser)
        // when_form_renglones_ready(addAutofillUI,1000,10);
        // when_form_renglones_ready(add_row_buttons)
    }
)