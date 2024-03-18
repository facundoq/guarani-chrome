import { getSettings, setSettings,Settings } from "../settings";
import {Student} from "../autofill/autofill";
import { fromHTML,appendChildren, UI, observe } from "../utils/dom_utils";

export class AutofillStatsUI extends UI {
  root = document.createElement("span")
  protected countNonEmpty:HTMLSpanElement
  protected countComplete:HTMLSpanElement
  constructor(protected rows_element:HTMLElement[]){
    super()
    this.root.id = "statsUI"
    
    const labelNonEmpty = fromHTML(`<span> Con datos: </span>`)
    this.countNonEmpty = fromHTML(`<span  id="statsUINonEmpty"> </span>`)
    this.root.appendChild(labelNonEmpty)
    this.root.appendChild(this.countNonEmpty)
    
    const labelComplete = fromHTML(`<span> Completados: </span>`)
    this.countComplete = fromHTML(`<span  id="statsUIComplete"> </span>`)
    this.root.appendChild(labelComplete)
    this.root.appendChild(this.countComplete)
    // const elementsToWatch = rows_element.querySelectorAll("input, .select")
    // elementsToWatch.foreach()
    rows_element.forEach(r =>{
      observe(r,this.update,undefined,false)
    })
    this.update()
  }
  update(){
    console.log("Status UI updating")
    const students = this.rows_element.map(s => Student.fromRow(s) )
    const total = students.length
    const nonEmpty = students.filter(s => s.nonEmpty()).length
    const complete = students.filter(s => s.complete()).length
    this.countNonEmpty.innerHTML = `${nonEmpty}/${total}`
    this.countComplete.innerHTML = `${complete}/${total}`
  }
    
  }
  