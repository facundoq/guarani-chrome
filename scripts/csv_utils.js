
function parseCSV(input,separator=";"){
    const lines = input.split(/\r\n|\n/).map(r => r.trim())
    const nonemptyLines = lines.filter(r => r.length>0)    
    const splitLines = nonemptyLines.map((l) => l.split(separator))
    const header = splitLines.shift().map(h => h.trim().toLowerCase())
    log(header)
    const rows = [];
    splitLines.forEach((values,i) =>{
        if (header.size!=values.size){
          throw new CSVParseError(`Number of values in row ${i} does not match number of values in header (row: ${values}, header: ${header}`);
        }
        const row = dictFromLists(header,values)
        rows.push(row)
        
    });
    log(rows)
    return [rows, header]
  }
  parseCSV("dni;h1\n23;v1\n")