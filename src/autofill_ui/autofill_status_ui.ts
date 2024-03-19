import { getSettings, setSettings,Settings } from "../settings";
import {Student} from "../autofill/autofill";
import { fromHTML,appendChildren, UI, observe } from "../utils/dom_utils";

export class ProgressUI extends UI {

  root = fromHTML(`<span id="statsUIComplete" class="counterUI" title= >  </span>`) as HTMLSpanElement
  protected count:HTMLSpanElement
  constructor(id:string,label:string,title:string){
    super()
    this.root.title = title
    this.root.id = id
    const labelElement = fromHTML(`<span> ${label} </span>`)
    this.count = fromHTML(`<span > </span>`)
    this.root.appendChild(labelElement)
    this.root.appendChild(this.count)
  }
  update(count:number, total:number){
      this.count.innerHTML=`${count}/${total}`
      const rate = count/total
      const hue = (rate * 120).toString(10);

      this.count.style.backgroundColor = `hsl(${hue},70%,35%)`
  }

}
export class AutofillStatsUI extends UI {
  root = document.createElement("span")
  protected countNonEmpty:ProgressUI
  protected countComplete:ProgressUI
  constructor(protected rows_element:HTMLElement[]){
    super()
    this.root.id = "statsUI"
    this.countComplete = new ProgressUI("statsUIComplete","Completo","Estudiantes con información completa (no considera el campo observaciones)")
    this.countNonEmpty = new ProgressUI("statsUINonEmpty","Con datos","Estudiantes con información algún dato completado, pero no todos (no considera el campo observaciones)")
    this.root.appendChild(this.countNonEmpty.root)
    this.root.appendChild(this.countComplete.root)
    
    // const elementsToWatch = rows_element.querySelectorAll("input, .select")
    // elementsToWatch.foreach()
    rows_element.forEach(r =>{
      observe(r,() =>{this.update()},undefined,false)
    })
    this.update()
  }
  update(){
    console.log("Status UI updating")
    const students = this.rows_element.map(s => Student.fromRow(s) )
    const total = students.length
    const nonEmpty = students.filter(s => s.nonEmpty()).length
    const complete = students.filter(s => s.complete()).length
    this.countNonEmpty.update(nonEmpty,total)
    this.countComplete.update(complete,total)
  }
    
  }
  