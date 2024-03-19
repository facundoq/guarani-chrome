import { getSettings, setSettings,Settings } from "../settings";
import {Student} from "../autofill/autofill";
import { fromHTML,appendChildren, UI, observe } from "../utils/dom_utils";

export class CounterUI extends UI {
  root = fromHTML(`<span class="counterUI">  </span>`)
  protected count:HTMLSpanElement
  protected icon:HTMLSpanElement
  constructor(){
    super()
    this.count = document.createElement("span")
    this.icon = document.createElement("span")
    this.icon.innerHTML=" ●"
    this.root.appendChild(this.count)
    this.root.appendChild(this.icon)
  } 
  update(count:number, total:number){
    this.count.innerHTML=`${count}/${total}`
    const rate = count/total
    const hue = (rate * 120).toString(10);
    this.icon.style.color = `hsl(${hue},70%,35%)`
  }
}

export class ProgressUI extends UI {

  root = fromHTML(`<span id="statsUIComplete" class="progressUI" >  </span>`) as HTMLSpanElement
  protected count:CounterUI
  constructor(id:string,label:string,title:string){
    super()
    this.root.title = title
    this.root.id = id
    const labelElement = fromHTML(`<span> ${label} </span>`)
    this.count = new CounterUI()
    this.root.appendChild(labelElement)
    this.root.appendChild(this.count.root)
  }
  update(count:number, total:number){
      this.count.update(count,total)
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
    this.update()

    // elementsToWatch.foreach()
    rows_element.forEach(e =>{
      const inputs = e.querySelectorAll("input, select")
      inputs.forEach((i)=>{
        i.addEventListener('change', ()=>{this.update()}, true)
        i.addEventListener('keyup', ()=>{this.update()}, true)
      })
    })
    const parent = document.getElementById("renglones").querySelector("thead").querySelectorAll("tr")

    const elementSelectors = []

  }
  update(){
    console.log("Status UI updating")
    const students = this.rows_element.map(s => Student.fromRow(s) )
    const total = students.length
    const nonEmpty = students.filter(s => s.nonEmpty()).length
    const complete = students.filter(s => s.complete()).length
    this.countNonEmpty.update(nonEmpty,total)
    this.countComplete.update(complete,total)
    const fields = [".fecha","nota","resultado","condicion","observacion"]
    fields.forEach((field)=>{
      
    const count =  this.rows_element.map(row => {
        const s = Student.fromRow(row)
        return (s.asDict()[field]!=="")?1:0
      }).reduce((a,b) => a+b,0)
    

    })
  }
    
  }
  