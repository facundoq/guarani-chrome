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
  const rowsWithWrongValues = autofillData.filter(s => {!values.includes(s.get(column)) });
  return (rowsWithWrongValues.length===0)? Some(rowsWithWrongValues) : None
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

        for ( [key, values] of Object.entries(csvConfig.values)) {
          if (header.includes(key)){
            const validValues = Object.keys(values);
            const valueCheck = checkValues(key,validValues,autofillData);
            if (valueCheck.isSome()){
              console.log(valueCheck)
              return Either.Left(`Column ${key} contains invalid values.\n Valid values ${validValues}.\n Rows with invalid values:\n${valueCheck.get()} `)
            }
          }
        }

        return Either.Right([autofillData,header])
        


    }