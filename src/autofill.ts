import { getSettings } from "./settings"
import {Either, Optional} from "./utils"
import {csv2autofillData,csvConfig} from "./csv_parser"

class Student{
  constructor(
    dni:string,
    nombre:string,
    fecha:string,
    nota:string,
  ){}
}

function dniMatcher(studentData,allData){
  
  const matches = allData.filter(s => s.get("dni") == studentData.dni)
  
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
  var nota = row.querySelector(elementSelectors["nota"]).value
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

  return (s.fecha === "") && (s.nota === "") && (s.condicion === "") && (s.resultado === "")
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
      const element = row.querySelector(elementSelectors[column])
      element.value = autofillValue;
      var event = new Event('change');
      element.dispatchEvent(event);
    }
  })
  
}

function addToStudentTitle(row:HTMLElement,message:string){
 const nombre = row.querySelector(elementSelectors["nombre"]) as HTMLSpanElement
 const id = row.querySelector(elementSelectors["dni"]) as HTMLSpanElement
 const emoji = row.querySelector(".result-emoji:last-child") as HTMLSpanElement
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

//   root.addMissingStudent = (student) => {
//   const missingStudents = getSettings("missingStudents")
//   if (missingStudents) {
//       missingStudents.push(student)
//       setSettings("missingStudents", missingStudents)
//   } else {
//       textarea.value = "No hay datos guardados."
//       deleteButton.disabled = true;
//   }
// }

export function autofill(rows,autofillData,overwrite,matcher=dniMatcher){
    const unmatched = []
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
            unmatched.push(studentFormData.dni)
          }else{
            markAlreadyFilledStudent(row)
          }
        })
    }
    return unmatched
  }  