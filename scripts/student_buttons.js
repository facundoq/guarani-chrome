

const passed_button = '<p style="background-color:#82f5a3;font-weight:bold;cursor: pointer;"> Aprobar </p>'
const failed_button = '<p style="background-color:#f58982;font-weight:bold;cursor: pointer;"> Desaprobar </p>'

const clean_button = '<p style="background-color:#AAAAAA;font-weight:bold;cursor: pointer;"> Limpiar </p>'



function change_row(row,condition,result){
  const fecha = row.querySelector(".fecha");
  getSettings(s =>{ fecha.value= s.date;})
  propagateOnChange(fecha)
  // const resultado = row.querySelector(".resultado");
  // resultado.value = result;
  // propagateOnChange(resultado)
  const condicion = row.querySelector(".condicion");
  condicion.value = condition;
  propagateOnChange(condicion)
}

function add_passed_button(row){
  const button_container = row.querySelector(".col-nro-acta")
  const button = fromHTML(passed_button)
  button.onclick = e => { change_row(row,175,"A")}
  button_container.appendChild(button)
  
}

function add_failed_button(row){
  const button_container = row.querySelector(".col-nro-acta")
  const button = fromHTML(failed_button)
  button.onclick = e => { change_row(row,174,"R") }
  button_container.appendChild(button)
}



function add_clean_button(row){
  const button_container = row.querySelector(".col-nro-acta")
  const button = fromHTML(clean_button)
  button.onclick = e => { 
    cleanPropagate(row.querySelector(".fecha"));
    cleanPropagate(row.querySelector(".resultado"));
    cleanPropagate(row.querySelector(".condicion"));
   }
  button_container.appendChild(button)
}

function add_row_buttons(form_renglones){
  const table = form_renglones.children[1];
  const table_body = table.children[1];
  for (let row of table_body.rows){
    add_passed_button(row)
    add_failed_button(row)
    add_clean_button(row)
  }
}

when_form_renglones_ready(add_row_buttons)


