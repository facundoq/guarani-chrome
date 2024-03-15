import {Either, Some,None, Optional,intersection, Left, Right} from "../utils/utils"
import {parseCSV,CSVData,CSVHeader, CSV, CSVRow} from "./csv"

export const csvConfig = {
  dataColumns: ["fecha", "condicion", "nota", "resultado"],
  keyColumns: ["dni", "nombre"],
  csvSeparator: ";",
  values:{
    nota: {
      "U": "U",
      "D": "D",
      "A": "A",
      "-": "",
    },
    resultado:{
      "Ausente": "U",
      "Reprobado": "R",
      "Aprobado": "A",
      "-": "",
    },
    condicion:{
      "Abandono": 2,
      "Aprobado": 175,
      "Desaprobado": 174,
      "Insuficiente": 3,
      "Libre": 1,
      "No Promociono": 107,
      "Promociono": 5,
      "Regular": 4,
      "-": "",
    }
  }
}

function checkValues(column:string,values:Array<string>,rows:CSVData){
  const rowsWithNumber:CSVRowWithIndex[] = rows.map( (v,i,a) => [v,i+2])
  const rowsWithWrongValues:CSVRowWithIndex[] = rowsWithNumber.filter( ([s,i],j) =>  !values.includes(s.get(column)));
  return (rowsWithWrongValues.length===0)? new None(): new Some(rowsWithWrongValues);
}

type CSVRowWithIndex =[CSVRow,number]

function printRow(rowIndex:CSVRowWithIndex){
  const [row,index] =rowIndex
  return `Fila ${index}: ${Array.from(row.values()).join(csvConfig.csvSeparator)}`;
}
function printAutofillData(data:Array<CSVRowWithIndex>,header){
    let headerRow = header.join(csvConfig.csvSeparator)
    let rows = data.map(printRow).join("\n")
    return `${headerRow}\n${rows}\n`
}
export type CSVParseResult = Either<string,CSV>

export function csv2autofillData(data):CSVParseResult{

        
        const csv = parseCSV(data,csvConfig.csvSeparator,true);
        
        const keyColumnsPresent = intersection(csvConfig.keyColumns,csv.header)
        if (keyColumnsPresent.length === 0){
          return new Left(`El CSV no contiene ninguna de las columnas necesarias para identificar estudiantes. \n - Columnas de identificación: ${csvConfig.keyColumns}. \n - Columnas del csv: ${csv.header}`);
        }

        const dataColumnsPresent = intersection(csvConfig.dataColumns,csv.header)
        if (dataColumnsPresent.length === 0){
          return new Left(`El CSV no contiene ninguna columna de datos relevante para el llenado. \n - Columnas de datos: ${csvConfig.dataColumns}.\n - Columnas del csv: ${csv.header}`);
        }

        if (csv.rows.length === 0){
          return new Left(`El csv solo contiene un encabezado, y no contiene datos.\n - Encabezado: ${csv.header}`)
        }
        for (const [key, values] of Object.entries(csvConfig.values)) {
          if (csv.header.includes(key)){
            const validValues = Object.keys(values);
            const valueCheck = checkValues(key,validValues,csv.rows);
            if (valueCheck.isSome()){
              let rowsWithErrors = (valueCheck as Some<CSVRowWithIndex[]>).get()
              return new Left(`La columna ${key} contiene valores inválidos. Valores válidos: ${validValues}.\n Filas con valores inválidos:\n${printAutofillData(rowsWithErrors,csv.header)}`)
            }
          }
        }

        return new Right(csv)
    }