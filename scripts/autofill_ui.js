const sampleCSV = `dni;condicion;fecha;resultado;nota
44960966;Aprobado;1/02/2024;Aprobado;A
44785441;Insuficiente;1/02/2024;Reprobado;D
45814671;Aprobado;1/02/2024;Aprobado;A
96172896;Desaprobado;1/02/2024;Reprobado;D
`
 
function autofillDataToString(autofillData,k=5){
  const n = autofillData.size;
  k = Math.min(n,k);
  
  var samples = "";
  var i = 0;
  for (const [key, values] of autofillData.entries()) {
      if (i==k){break;}
      i=i+1;

      var sample = "";
      for (const [sampleKey, sampleValue] of values.entries()) {
          sample = sample.concat(`${sampleKey}=${sampleValue}, `)
      }
      samples = samples.concat(`\n${key}: ${sample}`)
      
  }
  return samples
}

function AutofillDataViewer(){
    const root = fromHTML(`<textarea id="autofillDataViewer" disabled="true">
    No hay datos cargados
    </textarea>`)
    root.update = () => {
      const autofillData = getSettings("autofillData")
      if (autofillData){
        const k = 5;
        root.value=`${autofillDataToString(autofillData,k)}\n...\nTotal: ${autofillData.length} filas.\n`;
      }else{
        root.value = "No hay datos guardados."
      }
    }
    return root
  }
  

  function intersection(a,b){
    return a.filter(value => b.includes(value));
  }

  function AutofillSubmitButon(autofillDataViewer,resultViewer,autofillDataInput,autofillStartButton,autofillDeleteButton){
    const root = fromHTML(`<button  type="button" name="autofillSubmitButton" id="autofillSubmitButton"> Cargar datos </button>`)

    root.onclick = () =>{
      resultViewer.innerHTML = "Cargando...";
      const data = autofillDataInput.value;

      const result = csv2autofillData(data);
      result.doLeft((errors) =>{
        resultViewer.innerHTML=`Errores en el csv: \n
         ${errors}\n`;
      })
      result.doRight(([autofillData,header])=>{
        setSettings("autofillData",autofillData)
        resultViewer.innerHTML=`Carga exitosa\n - Filas: ${autofillData.length}\n - Columnas: ${header.length}\n\t ${header.join("\n\t")}`;
        autofillDataViewer.update();
        autofillStartButton.update();
        autofillDeleteButton.update();
      });
    }
    return root
  }
  function validateAutofillData(autofillData){
    if (!autofillData.value){
      return false
    }else{
      return autofillData.value.trim().length>0;
    }
  }
  function AutofillDeleteButton(autofillDataViewer,autofillStartButton){
    const root = fromHTML(`<button  type="button" name="autofillDeleteButton" id="autofillDeleteButton"> Borrar datos cargados </button>`)
    root.onclick= () =>{
      setSettings("autofillData",undefined)
      autofillDataViewer.update();
      autofillStartButton.update();
      root.update();
    }

    root.update = () =>{
      root.disabled = typeof getSettings("autofillData") === 'undefined'
    }
    root.update()
    return root
  }
  function AutofillConfigPopUpUI(autofillStartButton,closeButton){
    const root = fromHTML(`<div id="autofillConfig" ></div>`)
    const labelTitle = `El CSV requiere como mínimo una columna de identificación y una columna de datos:\n
    Cols. de identificación: ${csvConfig.keyColumns}
    Cols. de datos: ${csvConfig.dataColumns}
    `
    var autofillData = getSettings("autofillData")
    if (!autofillData){ autofillData = sampleCSV}
    const label = fromHTML(`<label for="autofillInput" style="display:block" title="${labelTitle}">Carga de CSV para autollenado 🛈:</label>`)
    const autofillDataInput = fromHTML(`
    <textarea type="text" name="autofill" id="autofillInput"> 
      ${autofillData} 
    </textarea>
      `)
    
    const resultLabel = fromHTML(`<p">Resultado de la carga:</p>`)
    const resultViewer = fromHTML(`<pre></pre>`)
    const autofillDataViewerLabel = fromHTML(`<p style="display:block">Datos cargados actualmente:</p>`)
    const autofillDataViewer = AutofillDataViewer()
    autofillDeleteButton = AutofillDeleteButton(autofillDataViewer,autofillStartButton) 

    const submit = AutofillSubmitButon(autofillDataViewer,resultViewer,autofillDataInput,autofillStartButton,autofillDeleteButton)
    
    autofillDataInput.onchange = () => {
      submit.disabled = !validateAutofillData(autofillDataInput);
    }
    autofillDataInput.onchange()
    const autofillOverwriteConfigUI = AutofillOverwriteConfigUI(value =>{
      setSettings("overwriteOnAutofill",value)
    })
    // root.appendChild(autofillOverwriteConfigUI);
    // root.appendChild(label);
    appendChildren(root,[closeButton,autofillOverwriteConfigUI,label,autofillDataInput,submit,resultLabel, resultViewer,autofillDataViewerLabel,autofillDataViewer,autofillDeleteButton])
    

    autofillDataViewer.update()
    return root
  }
  function AutofillOverwriteConfigUI(onchangeCallback){
    const root = fromHTML(`<div id="autofillOverwrite"></div>`)
    const labelTitle = "Sobreescribir valores (notas, condición, fecha, etc) existentes al rellenar."
    const label = fromHTML(`<label title="${labelTitle}" style="display:inline;">Sobreescribir valores: </label>`)
    const checkbox = fromHTML(`<input type="checkbox" id="autofillOverwriteCheckbox"/>`)
    checkbox.onchange = (e) =>{
      onchangeCallback(checkbox.checked)
    }
    root.appendChild(label)
    root.appendChild(checkbox)
    checkbox.checked = getSettings("overwriteOnAutofill");
    return root
  }

  function AutofillConfigUI(autofillStartButton){
    const root = fromHTML(`<div id="autofillConfigContainer" style="display:inline"></div>`)
    const openButton = fromHTML(`<button type='button'> Config ⚙️ </button>`)
    const closeButton = fromHTML(`<button type='button' id="autofillConfigCloseButton"> Cerrar ✖</button>`)
    const config = AutofillConfigPopUpUI(autofillStartButton,closeButton)
    
    openButton.onclick = () =>{
      openButton.style.display="none"      
      config.style.display="inline"
    }
    closeButton.onclick = () =>{
      openButton.style.display="inline"      
      config.style.display="none"
    }

    
    root.appendChild(openButton)
    root.appendChild(config)
    
    
    // by default, don't display config and only display config button
    closeButton.onclick()
    return root
  }

  function AutofillStartButtonUI(rows){
    const button = fromHTML(`<button type='button'> Autofill 📝</button>`)
    button.onclick = () =>{

      autofill(rows,getSettings("autofillData"),getSettings("overwriteOnAutofill"))
    }
    button.update = () =>{
      if (getSettings("autofillData") ){
        button.disabled=false;
      }else{
        button.disabled=true;
      }
    }
    button.update()
    return button
  }

  function AutofillUI(rows_element){
  const container = fromHTML(`<div class="span3" id="autofillContainer"> </div>`)
  console.log("adding autofill button")

  const guarangadaLogo = fromHTML(`<img id="guarangadaLogo" src="/images/logo.png"/>`)
  const autofillStartButtonUI = AutofillStartButtonUI(rows_element)
  console.log("adding autofill config button")
  const autofillConfigUI = AutofillConfigUI(autofillStartButtonUI)

  appendChildren(container,[guarangadaLogo,autofillStartButtonUI,autofillConfigUI])
  return container
}
  function addAutofillUI(form_renglones){
    
    const root = document.getElementById("notas_cursada_query").parentElement.parentElement.parentElement
    const table = form_renglones.children[1];
    const table_body = table.children[1];
    const autofillUI = AutofillUI(table_body.rows)
    root.appendChild(autofillUI)

    //TODO remove load data for testing automatically
    document.getElementById("autofillSubmitButton").onclick()
    
  }



when_form_renglones_ready(addAutofillUI);
  