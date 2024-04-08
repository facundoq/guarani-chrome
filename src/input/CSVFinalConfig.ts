import { CSVConfig } from "./parser"

export class CSVFinalConfig extends CSVConfig{
    id = "final"
    dataColumns= ["fecha","nota", "resultado"]
    keyColumns= ["dni", "nombre"]
    csvSeparator= ";"
    values={
      nota: {
        "0": "0",
        "1": "1",
        "2": "2",
        "3": "3",
        "4": "4",
        "5": "5",
        "6": "6",
        "7": "7",
        "8": "8",
        "9": "9",
        "10": "10",
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