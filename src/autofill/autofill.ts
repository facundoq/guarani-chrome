import { Settings } from "../settings";
import { Either, Left, Optional, Right } from "../utils/utils";
import { fromHTML } from "../utils/dom_utils";
import { CSV, CSVData, CSVRow } from "../input/csv";
import { StudentCursada } from "../guarani/StudentCursada";
import {CSVCursadaConfig} from "../input/CSVCursadaConfig"
import { AutofillParser } from "../input/parser";
import { Student } from "../guarani/Student";
import { StudentFinal } from "../guarani/StudentFinal";

function dniMatcher(student: StudentCursada, data: CSV) {
  const matches = data.rows.filter((s) => s.get("dni") == student.dni);

  if (matches.length === 1) {
    return new Right(matches[0]);
  } else {
    return new Left(matches);
  }
}


export abstract class BaseAutofill{
  constructor(public parser:AutofillParser,public subjectName:string){
  
  }

  abstract operationType:string

  parse(csv:string){ 
    const result = this.parser.parse(csv)
    return result
  }
  abstract getStudents(rowsElement: HTMLElement[]):Student[]

  autofill(
    rowsElement: HTMLElement[],
    autofillData: CSV,
    overwrite: boolean,
    matcher: CallableFunction = dniMatcher
  ) {
    const students = this.getStudents(rowsElement)
    const unmatched = [];
    for (let student of students) {
      const studentFormEmpty = student.isEmpty;
      if (!overwrite && !studentFormEmpty) {
        student.markAlreadyFilledStudent();
        continue;
      }

      const studentDataResult = matcher(student, autofillData);
      studentDataResult.doRight((studentData) => {
        this.autofillStudent(student, studentData);
        if (studentFormEmpty) {
          student.markFilledStudent();
        } else {
          student.markOverwrittenStudent();
        }
      });
      studentDataResult.doLeft((matches) => {
        if (studentFormEmpty) {
          student.markUnmatchedStudent(matches);
          unmatched.push(student.dni);
        } else {
          student.markAlreadyFilledStudent();
        }
      });
    }
    return unmatched;
  }

  autofillStudent(student:Student, studentData:CSVRow) {
    this.parser.config.dataColumns.forEach((column) => {
      if (studentData.has(column)) {
        const autofillValue = this.convertValues(studentData.get(column), column);
        const element = student.getFillableFieldElement(column)
        element.value = autofillValue;
        var event = new Event("change");
        element.dispatchEvent(event);
      }
    });
  }

  convertValues(value, column) {
    // TODO test alternative
  
    if (column in this.parser.config.values) {
      return this.parser.config.values[column][value];
    } else {
      return value;
    }
  }
}

export class AutofillCursada extends BaseAutofill{

  public operationType= "cursada"

  getStudents(rowsElement: HTMLElement[]) {
    return Array.from(rowsElement.map(r => new StudentCursada(r)))
  }  
}

export class AutofillFinal extends BaseAutofill{

  public operationType= "final"

  getStudents(rowsElement: HTMLElement[]) {
    return Array.from(rowsElement.map(r => new StudentFinal(r)))
  }
  
  
}