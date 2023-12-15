

function add_save_button(form_renglones){
  const basic_save_button = document.querySelector("#js-btn-guardar");
  const button_html = '<input id="js-btn-guardar" disabled="" type="submit" value="Guardar" class="btn btn-info btn-small pull-right" title="Guardar" autocomplete="off">';
  const save_button = fromHTML(button_html);
  form_renglones.appendChild(save_button);
  const update = function(){save_button.disabled = basic_save_button.disabled ;}
  observe(basic_save_button,update,{ attributes: true },disableAfterFirst=false)
}

const passed_button = '<p style="background-color:#82f5a3;font-weight:bold;cursor: pointer;"> Aprobar </p>'
const failed_button = '<p style="background-color:#f58982;font-weight:bold;cursor: pointer;"> Desaprobar </p>'


function change_row(row,condition,result){
  const condicion = row.querySelector(".condicion");
  condicion.value = condition;
  const resultado = row.querySelector(".resultado");
  resultado.value = result;
  const fecha = row.querySelector(".fecha");
  getSettings(s =>{ fecha.value= s.date;})
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

function add_buttons(form_renglones){
  const table = form_renglones.children[1];
  const table_body = table.children[1];
  for (let row of table_body.rows){
    add_passed_button(row)
    add_failed_button(row)
  }
}

console.log("Setting up Guarangada..")

when_form_renglones_ready([add_save_button,add_buttons])


