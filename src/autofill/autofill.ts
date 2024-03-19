import { getSettings } from "../settings";
import { Either, Left, Optional, Right } from "../utils/utils";
import { csv2autofillData, csvConfig } from "./parser";
import { fromHTML } from "../utils/dom_utils";
import { CSV, CSVData } from "./csv";

export class Student {

  static elementSelectors = {
    dni: ".identificacion",
    nombre: ".nombre",
    fecha: ".fecha",
    nota: ".nota_cursada",
    resultado: ".resultado",
    condicion: ".condicion",
    observacion: ".observacion",
  };

  static fromRow(row) {
    const dni_element_value = row.querySelector(
      Student.elementSelectors["dni"]
    ).innerText;
    const dni = dni_element_value.split(" ")[1];
    const nombre = row.querySelector(
      Student.elementSelectors["nombre"]
    ).innerText;
    const fecha = row.querySelector(Student.elementSelectors["fecha"]).value;
    var nota = row.querySelector(Student.elementSelectors["nota"]).value;
    const resultado = row.querySelector(
      Student.elementSelectors["resultado"]
    ).value;
    const condicion = row.querySelector(
      Student.elementSelectors["condicion"]
    ).value;
    const observacion = row.querySelector(
      Student.elementSelectors["observacion"]
    ).value;
    if (nota === "-") {
      nota = "";
    }
    return new Student(
      dni,
      nombre,
      fecha,
      nota,
      resultado,
      condicion,
      observacion
    );


  }

  constructor(
    public dni: string,
    public nombre: string,
    public fecha: string,
    public nota: string,
    public resultado: string,
    public condicion: string,
    public observacion: string
  ) {}
  asDict(){
    return {dni:this.dni,
            nombre:this.nombre,
            fecha:this.fecha,
            nota:this.nota,
            resultado:this.resultado,
            condicion:this.condicion,
            observacion:this.observacion}
  }
  fillableFields(){
    return [this.nota,this.fecha,this.resultado,this.condicion]
  }
  complete(){
    return this.fillableFields().filter(f => f==="").length ===0
  }
  nonEmpty(){
    
    return this.fillableFields().filter(f => f==="").length <4
  }
}

function dniMatcher(studentData: Student, data: CSV) {
  const matches = data.rows.filter((s) => s.get("dni") == studentData.dni);

  if (matches.length === 1) {
    return new Right(matches[0]);
  } else {
    return new Left(matches);
  }
}

function isStudentFormEmpty(studentFormData: Student) {
  const s = studentFormData;

  return (
    s.fecha === "" && s.nota === "" && s.condicion === "" && s.resultado === ""
  );
}

function convertValues(value, column) {
  // TODO test alternative

  if (column in csvConfig.values) {
    return csvConfig.values[column][value];
  } else {
    return value;
  }
}

function autofillStudent(row, studentData) {
  csvConfig.dataColumns.forEach((column) => {
    if (studentData.has(column)) {
      const autofillValue = convertValues(studentData.get(column), column);
      const element = row.querySelector(Student.elementSelectors[column]);
      element.value = autofillValue;
      var event = new Event("change");
      element.dispatchEvent(event);
    }
  });
}

function addToStudentTitle(row: HTMLElement, message: string) {
  const nombre = row.querySelector(
    Student.elementSelectors["nombre"]
  ) as HTMLSpanElement;
  const id = row.querySelector(
    Student.elementSelectors["dni"]
  ) as HTMLSpanElement;
  const emoji = row.querySelector(
    ".result-emoji:last-child"
  ) as HTMLSpanElement;
  nombre.title = `${nombre.title}\n Autofill: ${message}`;
  id.title = `${id.title}\n Autofill: ${message}`;
  emoji.title = `${emoji.title} \n Autofill: ${message}`;
}

function setStudentClass(row, klass) {
  row.classList.remove(...row.classList);
  row.classList.add(klass);
}
function markFilledStudent(row) {
  setStudentClass(row, "autofilledStudent");
  addEmojiStudent(row, "✅");
  addToStudentTitle(row, "ha sido completado automaticamente");
}

function markOverwrittenStudent(row) {
  setStudentClass(row, "modifiedStudent");
  addEmojiStudent(row, "✏️");
  addToStudentTitle(row, "ha sido editado automáticamente");
}
function markUnmatchedStudent(row, matches) {
  setStudentClass(row, "unmatchedStudent");
  addEmojiStudent(row, "❌");
  addToStudentTitle(row, "no se pudo encontrar en el csv");
}

function addEmojiStudent(row, emoji) {
  let alumnoDiv = row.querySelector(".datos-alumno");
  const emojiElement = fromHTML(`<span class="result-emoji"> ${emoji}<span>`);
  alumnoDiv.appendChild(emojiElement);
  // alumnoDiv.innerText += emoji
}
function markAlreadyFilledStudent(row) {
  setStudentClass(row, "alreadyFilledStudent");
  addEmojiStudent(row, "⚠️");
  addToStudentTitle(row, "No se modificó porque ya tenía valores cargados");
  
}


export function autofill(
  rows: HTMLElement[],
  autofillData,
  overwrite,
  matcher = dniMatcher
) {
  const unmatched = [];
  for (let row of rows) {
    const studentFormData = Student.fromRow(row);
    const studentFormEmpty = isStudentFormEmpty(studentFormData);
    if (!overwrite && !studentFormEmpty) {
      markAlreadyFilledStudent(row);
      continue;
    }

    const studentDataResult = matcher(studentFormData, autofillData);
    studentDataResult.doRight((studentData) => {
      autofillStudent(row, studentData);
      if (studentFormEmpty) {
        markFilledStudent(row);
      } else {
        markOverwrittenStudent(row);
      }
    });
    studentDataResult.doLeft((matches) => {
      if (studentFormEmpty) {
        markUnmatchedStudent(row, matches);
        unmatched.push(studentFormData.dni);
      } else {
        markAlreadyFilledStudent(row);
      }
    });
  }
  return unmatched;
}
