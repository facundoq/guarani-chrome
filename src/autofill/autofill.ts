import { getSettings } from "../settings";
import { Either, Left, Optional, Right } from "../utils/utils";
import { csv2autofillData, csvConfig } from "./parser";
import { fromHTML } from "../utils/dom_utils";
import { CSV, CSVData } from "./csv";
import { StudentCursada } from "../guarani/StudentCursada";

function dniMatcher(studentData: StudentCursada, data: CSV) {
  const matches = data.rows.filter((s) => s.get("dni") == studentData.dni);

  if (matches.length === 1) {
    return new Right(matches[0]);
  } else {
    return new Left(matches);
  }
}

function isStudentFormEmpty(studentFormData: StudentCursada) {
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
      const element = row.querySelector(StudentCursada.elementSelectors[column]);
      element.value = autofillValue;
      var event = new Event("change");
      element.dispatchEvent(event);
    }
  });
}

function addToStudentTitle(row: HTMLElement, message: string) {
  const nombre = row.querySelector(
    StudentCursada.elementSelectors["nombre"]
  ) as HTMLSpanElement;
  const id = row.querySelector(
    StudentCursada.elementSelectors["dni"]
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
    const studentFormData = StudentCursada.fromRow(row);
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
