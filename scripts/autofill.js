const id_key = "dni"
function sampleData(){
    const student1 = new Map();
    student1.set(id_key,"25498891")
    student1.set("condicion","Aprobado")
    const student2 = new Map();
    student2.set(id_key,"25498891")
    student2.set("condicion","Aprobado")

    const sampleAutofillData = new Map();
    sampleAutofillData.set(student1.get(id_key),student1)
    sampleAutofillData.set(student2.get(id_key),student2)
    return sampleAutofillData
}

const sampleAutofillData = sampleData()


function autofill(rows,autofillData){
    
    for (let row of rows){
        const id_element_value = row.querySelector(".identificacion").innerText
        log(id_element_value)
        const id = id_element_value.split(" ")[1];
        if (autofillData.has(dni)){
            log(`Autofilling ${dni}`)
            const rowData = autofillData.get(dni);
            for (const entry of myMap.entries()) {
              if (entry.key.equals(key)){ continue;}
              log(`Autofilling ${dni} with ${entry.key}=${entry.value}`)
              const selector = `.${entry.key}`
              row.querySelector(selector).value = entry.value
            }
        }else{
            log(`Could not find match for ${dni}. `)
        }
        
    }
  }
  
  function addAutofillButton(form_renglones){
    log("adding autofill button")
    const element = document.getElementById("notas_cursada_query").parentElement
    log(element)
    const button = fromHTML(`<button> Autofill </button>`)
    const table = form_renglones.children[1];
    const table_body = table.children[1];

    button.onclick = () =>{
      getSettings( settings =>{
          autofill(table_body.rows,settings.autofillData)
      })
    }
    element.appendChild(button)
    log(button)
  }
  

  when_form_renglones_ready(addAutofillButton);
  