

function autofillDataToString(autofillData, k) {
    const n = autofillData.length;
    k = Math.min(n, k);

    var samples = "";
    var i = 0;
    for (const [key, values] of autofillData.entries()) {
        if (i == k) { break; }
        i = i + 1;

        var sample = "";
        for (const [sampleKey, sampleValue] of values.entries()) {
            sample = sample.concat(`${sampleKey}=${sampleValue}, `)
        }
        samples = samples.concat(`\n${key}: ${sample}`)

    }
    return samples
}

function AutofillDataViewer(max_rows=5) {
    const root = fromHTML(`<textarea id="autofillDataViewer" disabled="true">
      No hay datos cargados
      </textarea>`)
    root.update = () => {
        const autofillData = getSettings("autofillData")
        if (autofillData && autofillData.length>0)  {
            root.value = `${autofillDataToString(autofillData, max_rows)}\n...\nTotal: ${autofillData.length} filas.\n`;
        } else {
            root.value = "No hay datos guardados."
        }
    }
    return root
}

function AutofillMissingUI() {
    const root = fromHTML(`<div id="autofillMissingUI> </div>`)
    const deleteButton = fromHTML(`<button  type="button" id="autofillDeleteMissingButton"> Borrar faltantes </button>`)

    const textarea = fromHTML(`<textarea id="autofillMissingViewer" disabled="true">
    
    </textarea>`)

    root.update = () => {
        const missingStudents = getSettings("missingStudents")
        if (missingStudents) {
            textarea.value = missingStudents;
            deleteButton.disabled = false;
        } else {
            textarea.value = "No hay datos guardados."
            deleteButton.disabled = true;
        }
    }
    deleteButton.onclick = (e) => {
        setSettings("missingStudents", [])
        root.update()
    }

    root.appendChild(textarea)
    root.appendChild(deleteButton)
    return root
}

function intersection(a, b) {
    return a.filter(value => b.includes(value));
}

function autofillSubmit(autofillDataViewer, resultViewer, autofillDataInput, autofillStartButton) {
        resultViewer.innerHTML = "Cargando...";
        const data = autofillDataInput.value;

        const result = csv2autofillData(data);
        result.doLeft((errors) => {
            resultViewer.innerHTML = `Errores en el csv: \n
           ${errors}\n`;
           setSettings(Settings.AutofillData,[])
           autofillDataViewer.update();
        })
        result.doRight(([autofillData, header]) => {
            setSettings("autofillData", autofillData)
            resultViewer.innerHTML = `Carga exitosa\n - Filas: ${autofillData.length}\n - Columnas: ${header.length}\n\t ${header.join("\n\t")}`;
            autofillDataViewer.update();
            autofillStartButton.update();
        });
}
function validateAutofillData(autofillData) {
    if (!autofillData.value) {
        return false
    } else {
        return autofillData.value.trim().length > 0;
    }
}

function AutofillConfigPopUpUI(autofillStartButton, closeButton) {
    const root = fromHTML(`<div id="autofillConfig" ></div>`)
    const labelTitle = `El CSV requiere como mínimo una columna de identificación y una columna de datos:\n
      Cols. de identificación: ${csvConfig.keyColumns}
      Cols. de datos: ${csvConfig.dataColumns}
      `
    var autofillDataCSV = getSettings("autofillDataCSV")
    // TODO remove for final version
    if (autofillDataCSV ==="") { autofillDataCSV = sampleCSV }

    const label = fromHTML(`<label for="autofillInput" style="display:block" title="${labelTitle}">Carga de CSV para autollenado 🛈:</label>`)

    const autofillDataInput = fromHTML(`
      <textarea type="text" name="autofill" 
      id="autofillInput">${autofillDataCSV}</textarea>`)

    const resultLabel = fromHTML(`<p">Resultado de la carga:</p>`)
    const resultViewer = fromHTML(`<pre></pre>`)
    const autofillDataViewerLabel = fromHTML(`<p style="display:block">Datos cargados actualmente:</p>`)
    const autofillDataViewer = AutofillDataViewer()

        const inputUpdate = () => {
            setSettings(Settings.AutofillDataCSV,autofillDataInput.value)
            autofillSubmit(autofillDataViewer, resultViewer, autofillDataInput, autofillStartButton)
        }
    autofillDataInput.onchange = inputUpdate
    autofillDataInput.addEventListener('input', inputUpdate)
    inputUpdate()

    const autofillOverwriteConfigUI = AutofillOverwriteConfigUI(value => {
        setSettings("overwriteOnAutofill", value)
    })
    

    appendChildren(root, [closeButton, autofillOverwriteConfigUI, label, autofillDataInput,  resultLabel, resultViewer, autofillDataViewerLabel, autofillDataViewer,])


    autofillDataViewer.update()
    return root
}

function AutofillOverwriteConfigUI(onchangeCallback) {
    const root = fromHTML(`<div id="autofillOverwrite"></div>`)
    const labelTitle = "Sobreescribir valores (notas, condición, fecha, etc) existentes al rellenar."
    const label = fromHTML(`<label title="${labelTitle}" style="display:inline;">Sobreescribir valores: </label>`)
    const checkbox = fromHTML(`<input type="checkbox" id="autofillOverwriteCheckbox"/>`)
    checkbox.onchange = (e) => {
        onchangeCallback(checkbox.checked)
    }
    root.appendChild(label)
    root.appendChild(checkbox)
    checkbox.checked = getSettings("overwriteOnAutofill");
    return root
}


