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



when_form_renglones_ready(add_save_button)
