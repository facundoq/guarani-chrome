

function add_save_button(form_renglones){
  const basic_save_button = document.querySelector("#js-btn-guardar");
  const button_html = '<input id="js-btn-guardar" disabled="" type="submit" value="Guardar" class="btn btn-info btn-small pull-right" title="Guardar" autocomplete="off">';
  const save_button = fromHTML(button_html);
  save_button.onclick = () =>{
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  form_renglones.appendChild(save_button);
  const update = function(){save_button.disabled = basic_save_button.disabled ;}
  observe(basic_save_button,update,{ attributes: true },disableAfterFirst=false)
}

const passed_button = '<p style="background-color:#82f5a3;font-weight:bold;cursor: pointer;"> Aprobar </p>'
const failed_button = '<p style="background-color:#f58982;font-weight:bold;cursor: pointer;"> Desaprobar </p>'

const clean_button = '<p style="background-color:#AAAAAA;font-weight:bold;cursor: pointer;"> Limpiar </p>'

function propagateOnChange(element){
  var event = new Event('change', { bubbles: true });
  element.dispatchEvent(event);
}

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

function cleanPropagate(e){
  e.value=""
  propagateOnChange(e)
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

function log(message){
  console.log("Guarangada: ",message)
}

log("Waiting for form...")

function init(form_renglones){
  setTimeout(() =>{
    log("Initializing...")
    form_renglones = document.querySelector(form_renglones_selector)
    add_save_button(form_renglones)
    add_row_buttons(form_renglones)
    log("Done")
  },100)
}

// when_form_renglones_ready([add_save_button,add_row_buttons])
form_renglones_selector = ".form-renglones"
timeout= 5000;
waitForElement(form_renglones_selector,init,timeout,() =>{
  log(`after waiting for ${timeout}, assuming no form in page.`)
})

