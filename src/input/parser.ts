import {
  Either,
  Some,
  None,
  Optional,
  intersection,
  Left,
  Right,
} from "../utils/utils";
import { parseCSV, CSVData, CSVHeader, CSV, CSVRow } from "./csv";

export abstract class CSVConfig {
  public abstract id:string;
  public abstract dataColumns: string[];
  public abstract keyColumns: string[];
  public abstract csvSeparator: string;
  public abstract values: { [key: string]: { [key: string]: string } };
}

function checkValues(column: string, values: string[], rows: CSVData) {
  const rowsWithNumber: CSVRowWithIndex[] = rows.map((v, i, a) => [v, i + 2]);
  const rowsWithWrongValues: CSVRowWithIndex[] = rowsWithNumber.filter(
    ([s, i], j) => !values.includes(s.get(column))
  );
  return rowsWithWrongValues.length === 0
    ? new None()
    : new Some(rowsWithWrongValues);
}

type CSVRowWithIndex = [CSVRow, number];

function printRow(rowIndex: CSVRowWithIndex,separator:string) {
  const [row, index] = rowIndex;
  return `Fila ${index}: ${Array.from(row.values()).join(
    separator
  )}`;
}
function printAutofillData(data: CSVRowWithIndex[], header:string[],separator:string) {
  let headerRow = header.join(separator);
  let rows = data.map(r => printRow(r,separator)).join("\n");
  return `${headerRow}\n${rows}\n`;
}
export type CSVParseResult = Either<string, CSV>;

export class AutofillParser {
  constructor(public config: CSVConfig) {}

  parse(data:string): CSVParseResult {
    
    const parseResult = parseCSV(data, this.config.csvSeparator, true);
    
    if (parseResult.isLeft()){return parseResult}

    const csv = parseResult.get() as CSV
    const keyColumnsPresent = intersection(this.config.keyColumns, csv.header);
    if (keyColumnsPresent.length === 0) {
      return new Left(
        `El CSV no contiene ninguna de las columnas necesarias para identificar estudiantes. \n - Columnas de identificación: ${this.config.keyColumns}. \n - Columnas del csv: ${csv.header}`
      );
    }

    const dataColumnsPresent = intersection(
      this.config.dataColumns,
      csv.header
    );

    if (dataColumnsPresent.length === 0) {
      return new Left(
        `El CSV no contiene ninguna columna de datos relevante para el llenado. \n - Columnas de datos: ${this.config.dataColumns}.\n - Columnas del csv: ${csv.header}`
      );
    }

    if (csv.rows.length === 0) {
      return new Left(
        `El csv solo contiene un encabezado, y no contiene datos.\n - Encabezado: ${csv.header}`
      );
    }
    for (const [key, values] of Object.entries(this.config.values)) {
      if (csv.header.includes(key)) {
        const validValues = Object.keys(values);
        const valueCheck = checkValues(key, validValues, csv.rows);
        if (valueCheck.isSome()) {
          let rowsWithErrors = (valueCheck as Some<CSVRowWithIndex[]>).get();
          return new Left(
            `La columna ${key} contiene valores inválidos. Valores válidos: ${validValues}.\n Filas con valores inválidos:\n${printAutofillData(
              rowsWithErrors,
              csv.header,
              this.config.csvSeparator
            )}`
          );
        }
      }
    }

    return new Right(csv);
  }
}
