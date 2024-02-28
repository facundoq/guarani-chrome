
function dniMatcher(studentData,allData){
  const matches = allData.filter(s => s.get("dni") == studentData.dni)
  if (matches.length===1){
    return Either.Right(matches[0])
  }else{
    return Either.Left(matches)
  }
}

function getStudentData(row){
  const dni_element_value = row.querySelector(".identificacion").innerText
  const dni = dni_element_value.split(" ")[1];
  const nombre = row.querySelector(".nombre").innerText
  const fecha = row.querySelector(".fecha").value
  const notaCursada = row.querySelector(".nota_cursada").value
  const resultado = row.querySelector(".resultado").value
  const condicion = row.querySelector(".condicion").value
  
  const studentData = {
    dni:dni,
    nombre:nombre,
    date:fecha,
    nota:notaCursada,
    resultado:resultado,
    condicion:condicion,
  }
  return studentData
}
function isStudentFormEmpty(studentFormData){
  const s = studentFormData;
  return (s.date === "") & (s.nota === "") & (s.condicion === "") & (s.resultado === "")
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
    if (studentData.has(column)){
      const autofillValue = convertValues(studentData.get(column),column);
      const element = row.querySelector(`.${column}`)
      element.value = autofillValue;
      var event = new Event('change');
      element.dispatchEvent(event);
    }
  })
  
}

function addToStudentTitle(row,message){
 const nombre = row.querySelector(".nombre")
 const id = row.querySelector(".identificacion")
 const emoji = row.querySelector(".result-emoji")
 nombre.title = `${nombre.title}: ${message}`
 id.title = `${id.title}: ${message}`
 emoji.title = message;
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