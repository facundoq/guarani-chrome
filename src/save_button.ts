import { observe } from "./utils/dom_utils";
//import { when_form_renglones_ready } from "./form_renglones";

export function addSaveButton(form_renglones){
    const basic_save_button = document.querySelector("#js-btn-guardar") as HTMLInputElement;
    const save_button = document.createElement("input")
    save_button.type ="submit"
    save_button.value = "Guardar"
    save_button.classList.add("btn","btn-info","btn-small","pull-right")
    save_button.id="js-btn-guardar"
     
    save_button.onclick = () =>{
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    form_renglones.appendChild(save_button);
    const update = function(){save_button.disabled = basic_save_button.disabled ;}

    observe(basic_save_button,update,{ attributes: true,subtree:true, childList:true,},false)
  }



//when_form_renglones_ready(add_save_button)
