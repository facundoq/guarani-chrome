
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
function studentFormEmpty(studentFormData){
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
  row.classList.add("autofilledStudent");
  addEmojiStudent(row,"✅")
}

function markUnmatchedStudent(row,matches){
  row.classList.add("unmatchedStudent");
  addEmojiStudent(row,"❌")
}

function addEmojiStudent(row,emoji){
  let alumnoDiv = row.querySelector(".nombre");
  alumnoDiv.innerText += emoji
}
function markAlreadyFilledStudent(row){
  row.classList.add("alreadyFilledStudent");
  addEmojiStudent(row,"⚠️")
  // let resultImage = document.createElement('img')
  // alumnoDiv.appendChild()
}

function autofill(rows,autofillData,matcher=dniMatcher,onlyEmpty=true){
    
    for (let row of rows){
        const studentFormData = getStudentData(row) 
        if (onlyEmpty && !studentFormEmpty(studentFormData)){
          markAlreadyFilledStudent(row)
          continue;
        }

        const studentDataResult = matcher(studentFormData,autofillData);
        studentDataResult.doRight((studentData) =>{
          autofillStudent(row,studentData)
        })
        studentDataResult.doLeft((matches) =>{
          markUnmatchedStudent(row,matches)
        })
    }
  }  