import { getSettings } from "../settings";
import { Either, Left, Optional, Right } from "../utils/utils";
import { csv2autofillData, csvConfig } from "./parser";
import { fromHTML } from "../utils/dom_utils";
import { CSV, CSVData } from "./csv";
import { StudentCursada } from "../guarani/StudentCursada";

function dniMatcher(student: StudentCursada, data: CSV) {
  const matches = data.rows.filter((s) => s.get("dni") == student.dni);

  if (matches.length === 1) {
    return new Right(matches[0]);
  } else {
    return new Left(matches);
  }
}

function convertValues(value, column) {
  // TODO test alternative

  if (column in csvConfig.values) {
    return csvConfig.values[column][value];
  } else {
    return value;
  }
}


export class AutofillCursada {
  autofill(
    students: StudentCursada[],
    autofillData: CSV,
    overwrite: boolean,
    matcher: CallableFunction = dniMatcher
  ) {
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

  autofillStudent(student, studentData) {
    csvConfig.dataColumns.forEach((column) => {
      if (studentData.has(column)) {
        const autofillValue = convertValues(studentData.get(column), column);
        const element = student.row.querySelector(
          StudentCursada.elementSelectors[column]
        );
        element.value = autofillValue;
        var event = new Event("change");
        element.dispatchEvent(event);
      }
    });
  }
}
