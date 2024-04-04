import { CSVConfig } from "./parser"

export class CSVCursadaConfig extends CSVConfig{
    id = "cursada"
    dataColumns= ["fecha", "condicion", "nota", "resultado"]
    keyColumns= ["dni", "nombre"]
    csvSeparator= ";"
    values={
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
        "Abandono": "2",
        "Aprobado": "175",
        "Desaprobado": "174",
        "Insuficiente": "3",
        "Libre": "1",
        "No Promociono": "107",
        "Promociono": "5",
        "Regular": "4",
        "-": "",
      }
    }
  }