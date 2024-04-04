import { Either, Left, Right, dictFromLists } from "../utils/utils";

export function validateCSV(input,separator=";"){
  return input.trim().length>0;
}

function toEntries<T>(a: T[]) {
  return a.map((value, index) => [index, value] as const);
}

export class CSVParseError extends Error {
  constructor(message) {
    super(message);
    this.name = 'CSVParseError';
  }
}
export type CSVRow = Map<string,string>
export type CSVData = Array<CSVRow>
export type CSVHeader = Array<string>
export class CSV {
  constructor(public rows:CSVData,public header:CSVHeader){}
}
export function parseCSV(input:string,separator=";",normalize_header=false):Either<string,CSV>{
    input = input.trim()
    if (input ===""){
      return new Right(new CSV([],[]))
    }
    const lines = input.split(/\r\n|\n/).map(r => r.trim())
    const nonemptyLines = lines.filter(r => r.length>0)    
    const splitLines = nonemptyLines.map((l) => l.split(separator))
    const basicHeader = splitLines.shift()
    const header = normalize_header ? basicHeader.map(h => h.trim().toLowerCase()) : basicHeader;
    
    const rows = [];
    
    for (const [i, values] of toEntries(splitLines)) {
        if (header.length!=values.length){
          return new Left(`Number of values in row ${i} does not match number of values in header.\nHeader: "${header}"\nRow ${i}: "${values}"`);
        }
        const row = dictFromLists(header,values)
        rows.push(row)   
    }
    
    return new Right(new CSV(rows, header))
  }

  // parseCSV("dni;h1\n23;v1\n  \n  \n")