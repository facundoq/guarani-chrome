
const csvConfig = {
  dataColumns: ["fecha", "condicion", "nota_cursada", "resultado"],
  keyColumns: ["dni", "nombre"],
  csvSeparator: ";",
  values:{
    nota_cursada: {
      "U": "U",
      "D": "D",
      "A": "A",
    },
    resultado:{
      "Ausente": "U",
      "Reprobado": "R",
      "Aprobado": "A",
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
    }
  }
}

function checkValues(column,values,autofillData){
  const rowsWithWrongValues = autofillData.filter(s => !values.includes(s.get(column)));
  return (rowsWithWrongValues.length===0)? None: Some(rowsWithWrongValues);
}

function printRow(row){
  return Array.from(row.values()).join(csvConfig.csvSeparator);
}
function printAutofillData(data,header){
    let headerRow = header.join(csvConfig.csvSeparator)
    let rows = data.map(printRow).join("\n")
    return `${headerRow}\n${rows}\n`
}

function csv2autofillData(data){


        const [autofillData,header] = parseCSV(data,csvConfig.csvSeparator,true);
        
        const keyColumnsPresent = intersection(csvConfig.keyColumns,header)
        if (keyColumnsPresent.length === 0){
          return Either.Left(`El CSV no contiene ninguna de las columnas necesarias para identificar estudiantes. \n - Columnas de identificación: ${csvConfig.keyColumns}. \n - Columnas del csv: ${header}`);
        }

        const dataColumnsPresent = intersection(csvConfig.dataColumns,header)
        if (dataColumnsPresent.length === 0){
          return Either.Left(`El CSV no contiene ninguna columna de datos relevante para el llenado. \n - Columnas de datos: ${csvConfig.dataColumns}.\n - Columnas del csv: ${header}`);
        }

        if (autofillData.length === 0){
          return Either.Left(`El csv solo contiene un encabezado, y no contiene datos.\n - Encabezado: ${header}`)
        }
        console.log("Validating values..")
        for ( [key, values] of Object.entries(csvConfig.values)) {
          if (header.includes(key)){
            const validValues = Object.keys(values);
            console.log(validValues)
            const valueCheck = checkValues(key,validValues,autofillData);
            if (valueCheck.isSome()){
              let rowsWithErrors = valueCheck.get()
              return Either.Left(`La columna ${key} contiene valores inválidos.\n Valores válidos: ${validValues}.\n Filas con valores inválidos:\n${printAutofillData(rowsWithErrors,header)}`)
            }
          }
        }

        return Either.Right([autofillData,header])
    }