import { fromHTML, ready,UI } from "./utils/dom_utils";
import { setSettings,getSettings,Settings } from "./settings";
import { mapValues } from "./utils/utils";

function addCSS(href){
    const trueHref =chrome.runtime.getURL(href)
    var link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', trueHref);
    link.setAttribute('type', "text/css");
    // link.setAttribute('disabled', "disabled");
    document.head.appendChild(link);

    return link
}


class ThemesUI extends UI{

    root = fromHTML(`<select type="text" name="theme" id="theme">
    <option value="light">Claro 🌕</option>
    <option value="dark">Oscuro 🌑</option>
    </select>`) as HTMLSelectElement

    constructor(public themes:Map<string,HTMLLinkElement>){
        super()
        this.root.value = getSettings(Settings.Theme) as string
        this.root.addEventListener('change', (event) => this.updateTheme())
        this.updateTheme()
        

        
    }

    updateTheme(){
        const newTheme = this.root.value
        console.log(`Changing theme to "${newTheme}"`)
        setSettings("theme",newTheme);
        //disable all themes
        this.themes.forEach((v,k) => v.disabled = true)
        //enable just this one
        if ( this.themes.has(newTheme)){
            this.themes.get(newTheme).disabled=false
        }
    }

    
} 



export function initializeThemeChooser(){
    console.log(`initializing theme chooser`)
    const themeURLs = new Map(Object.entries(
        {"dark":"themes/dark.css",
         "light":"themes/light.css"
    }))
    
    const themes = mapValues(themeURLs, addCSS )
    // wait a bit for css files to load before creating ThemesUI
    window.setTimeout(() =>{
        const themesUI = new ThemesUI(themes)
        let notifications = document.querySelector(".notificaciones")
        if (notifications){
            notifications.appendChild(themesUI.root)
        }else{
            console.log(`Did not find element ".notificaciones" to append the theme chooser`)
        }    
    }, 100);
    
}




