import { CSVConfig } from "./parser"

export class CSVFinalConfig extends CSVConfig{
    id = "final"
    dataColumns= ["fecha","nota", "resultado"]
    keyColumns= ["dni", "nombre"]
    csvSeparator= ";"
    values={
      nota: {
        "0": "0",
        "1": "3",
        "2": "3",
        "-": "",
      },
      resultado:{
        "Ausente": "U",
        "Reprobado": "R",
        "Aprobado": "A",
        "-": "",
      },
    }
  }