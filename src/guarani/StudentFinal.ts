import { Student } from "./Student";

export class StudentFinal extends Student {

  
  get notaElement(){
      return this.row.querySelector(".nota") as HTMLSelectElement    
  }

  fillableFieldsElements= [this.notaElement,this.fechaElement,this.resultadoElement]
  get fillableFieldsNames() {
    return ["nota", "fecha","resultado"];
}
    get fillableFields() {
        return [this.nota, this.fecha, this.resultado];
      }
}