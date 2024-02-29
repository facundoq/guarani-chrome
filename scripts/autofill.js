
function dniMatcher(studentData,allData){
  console.log(`Matching ${studentData}...`)
  const matches = allData.filter(s => s.get("dni") == studentData.dni)
  console.log(matches)
  if (matches.length===1){
    return Either.Right(matches[0])
  }else{
    return Either.Left(matches)
  }
}

const elementSelectors = {
  dni:".identificacion",
  nombre:".nombre",
  fecha:".fecha",
  nota:".nota_cursada",
  resultado:".resultado",
  condicion:".condicion",
}

function getStudentData(row){
  const dni_element_value = row.querySelector(elementSelectors["dni"]).innerText
  const dni = dni_element_value.split(" ")[1];
  const nombre = row.querySelector(elementSelectors["nombre"]).innerText
  const fecha = row.querySelector(elementSelectors["fecha"]).value
  const nota = row.querySelector(elementSelectors["nota"]).value
  const resultado = row.querySelector(elementSelectors["resultado"]).value
  const condicion = row.querySelector(elementSelectors["condicion"]).value
  if (nota ==="-"){
    nota = ""
  }

  const studentData = {
    dni:dni,
    nombre:nombre,
    fecha:fecha,
    nota:nota,
    resultado:resultado,
    condicion:condicion,
  }
  return studentData
}
function isStudentFormEmpty(studentFormData){
  const s = studentFormData;
  console.log(s)
  return (s.fecha === "") && (s.nota === "") & (s.condicion === "") & (s.resultado === "")
}




function convertValues(value,column){
  // TODO test alternative
  
  if (column in csvConfig.values){
    return csvConfig.values[column][value]
  }else{
    return value
  } 
}

function autofillStudent(row,studentData){
  csvConfig.dataColumns.forEach(column =>{
    console.log(`Trying ${column}`)
    if (studentData.has(column)){
      console.log(`Found ${column} `)
      const autofillValue = convertValues(studentData.get(column),column);
      const element = row.querySelector(elementSelectors[column])
      element.value = autofillValue;
      var event = new Event('change');
      element.dispatchEvent(event);
    }
  })
  
}

function addToStudentTitle(row,message){
 const nombre = row.querySelector(elementSelectors["nombre"])
 const id = row.querySelector(elementSelectors["dni"])
 const emoji = row.querySelector(".result-emoji:last-child")
 nombre.title = `${nombre.title}\n Autofill: ${message}`
 id.title = `${id.title}\n Autofill: ${message}`
 emoji.title = `${emoji.title} \n Autofill: ${message}`;
}

function setStudentClass(row,klass){
  row.classList.remove(...row.classList);
  row.classList.add(klass);
}
function markFilledStudent(row){
  setStudentClass(row,"autofilledStudent")
  addEmojiStudent(row,"✅")
  addToStudentTitle(row,"ha sido completado automaticamente")
  
}

function markOverwrittenStudent(row){
  setStudentClass(row,"modifiedStudent");
  addEmojiStudent(row,"✏️")
  addToStudentTitle(row,"ha sido editado automáticamente")
  
}
function markUnmatchedStudent(row,matches){
  setStudentClass(row,"unmatchedStudent");
  addEmojiStudent(row,"❌")
  addToStudentTitle(row,"no se pudo encontrar en el csv")
}

function addEmojiStudent(row,emoji){
  let alumnoDiv = row.querySelector(".datos-alumno");
  const emojiElement = fromHTML(`<span class="result-emoji"> ${emoji}<span>`)
  alumnoDiv.appendChild(emojiElement)
  // alumnoDiv.innerText += emoji
}
function markAlreadyFilledStudent(row){
  setStudentClass(row,"alreadyFilledStudent");
  addEmojiStudent(row,"⚠️")
  addToStudentTitle(row,"No se modificó porque ya tenía valores cargados")
    // let resultImage = document.createElement('img')
  // alumnoDiv.appendChild()
}

function autofill(rows,autofillData,overwrite,matcher=dniMatcher){
    for (let row of rows){
        const studentFormData = getStudentData(row)
        const studentFormEmpty = isStudentFormEmpty(studentFormData)   
        if (!overwrite && !studentFormEmpty){
          markAlreadyFilledStudent(row)
          continue;
        }
        
        const studentDataResult = matcher(studentFormData,autofillData);
        studentDataResult.doRight((studentData) =>{
          autofillStudent(row,studentData)
          if (studentFormEmpty){
            markFilledStudent(row)
          }else{
            markOverwrittenStudent(row)
          }
        })
        studentDataResult.doLeft((matches) =>{
          if (studentFormEmpty){
            markUnmatchedStudent(row,matches)
          }else{
            markAlreadyFilledStudent(row)
          }
        })
    }
  }  