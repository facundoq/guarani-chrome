function addCSS(href){
    
    var link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', href);
    link.setAttribute('type', "text/css");
    // link.setAttribute('disabled', "disabled");
    document.head.appendChild(link);

    return link
}

function updateTheme(dark,themeButton){
    console.log(`Changing theme to "${themeButton.value}"`)
    setSettings("theme",themeButton.value);
    
    if (themeButton.value == "dark"){
        dark.disabled = false;
    }else{
        dark.disabled = true;
    }
}

function initializeThemeChooser(){
    console.log(`initializing theme chooser`)
    const darkUrl =  chrome.runtime.getURL("themes/dark.css");
    console.log(`Loading ${darkUrl}`)
    let dark = addCSS(darkUrl)
    let themeSelect = fromHTML(`<select type="text" name="theme" id="theme">
    <option value="light">Claro 🌕</option>
    <option value="dark">Oscuro 🌑</option>
    </select>`)
    themeSelect.value = getSettings("theme")

    let notifications = document.querySelector(".notificaciones")
    if (notifications){
        notifications.appendChild(themeSelect)
    }else{
        console.log(`Did not find element ".notificaciones" to append the theme chooser`)
    }

    themeSelect.addEventListener('change', (event) => updateTheme(dark,themeSelect))
    
    updateTheme(dark,themeSelect)
}

// when_form_renglones_ready(initializeThemeChooser);
ready(initializeThemeChooser)


