function addCSS(href){
    
    var link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', href);
    link.setAttribute('type', "text/css");
    // link.setAttribute('disabled', "disabled");
    document.head.appendChild(link);

    return link
}

function updateTheme(dark,darkButton){
    getSettings( settings => {
        settings.theme = darkButton.value;
        setSettings(settings);
    });

    log(`Changing theme to ${darkButton.value}`)
    if (darkButton.value == "dark"){
        dark.disabled = false;
    }else{
        dark.disabled = true;
    }
}

function initializeThemeChooser(settings){
    log(`initializing theme chooser`)
    const darkUrl =  chrome.runtime.getURL("themes/dark.css");
    let dark = addCSS(darkUrl)
        
    let darkButton = fromHTML(`<select type="text" name="theme" id="theme">
    <option value="light">Claro 🌕</option>
    <option value="dark">Oscuro 🌑</option>
    </select>`)

    darkButton.selected = settings.theme
    darkButton.onchange = () => updateTheme(dark,darkButton)

    let notifications = document.querySelector(".notificaciones")
    if (notifications){
        notifications.appendChild(darkButton)
    }
    updateTheme(dark,darkButton)
}
getSettings( settings => {
    initializeThemeChooser(settings)
})

