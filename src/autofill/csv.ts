import { dictFromLists } from "../utils/utils";

export function validateCSV(input,separator=";"){
  return input.trim().length>0;
}

class CSVParseError extends Error {
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
export function parseCSV(input,separator=";",normalize_header=false):CSV{
    input = input.trim()
    if (input ===""){
      return new CSV([],[])
    }
    const lines = input.split(/\r\n|\n/).map(r => r.trim())
    const nonemptyLines = lines.filter(r => r.length>0)    
    const splitLines = nonemptyLines.map((l) => l.split(separator))
    const basicHeader = splitLines.shift()
    const header = normalize_header ? basicHeader.map(h => h.trim().toLowerCase()) : basicHeader;
    
    const rows = [];
    splitLines.forEach((values,i) =>{
        if (header.size!=values.size){
          throw new CSVParseError(`Number of values in row ${i} does not match number of values in header (row: ${values}, header: ${header}`);
        }
        const row = dictFromLists(header,values)
        rows.push(row)
        
    });
    
    return new CSV(rows, header)
  }

  // parseCSV("dni;h1\n23;v1\n  \n  \n")